// @ts-nocheck
const { TURN_TIMEOUT_MS, MAX_ACTIVE_SESSIONS, SESSION_STATES } = require("../../config/combatConfig");
const { supabase } = require("../../database/supabase");
const { logError, logSystem } = require("../loggerService");
/**
 * @constant moduleRegistry
 */
const moduleRegistry = require("../../modules/moduleRegistry");

/**
 * @constant sessions
 * @type {Map}
 */
const sessions = new Map();
/**
 * @variable cleanupInterval
 * @type {any}
 */
let cleanupInterval = null;

/**
 * Genera un personaje dummy para combate de práctica PvE.
 * @param {*} challengerChar - Personaje del retador para escalar estadísticas del dummy
 * @returns {*} Personaje dummy generado
 */
function generateDummyCharacter(challengerChar) {
  /**
   * @constant stats
   */
  const stats = challengerChar.stats || {};
  /**
   * @constant totalPoints
   */
  const totalPoints =
    Number(stats.atk || 0) +
      Number(stats.def || 0) +
      Number(stats.aspd || 0) +
      Number(stats.ref || 0) +
      Number(stats.mspd || 0) +
      Number(stats.fulgor || 0) +
      Number(stats.d_fulgor || 0) +
      Number(stats.r_fulgor || 0) || 20;

  /**
   * @constant keys
   * @type {Array}
   */
  const keys = ["atk", "def", "aspd", "ref", "mspd", "fulgor", "d_fulgor", "r_fulgor"];
  /**
   * @constant basePerStat
   */
  const basePerStat = Math.max(1, Math.floor(totalPoints / keys.length));

  /**
   * @constant dummyStats
   * @type {Object}
   */
  const dummyStats = {};
  for (const key of keys) {
    /**
     * @constant variation
     */
    const variation = Math.floor((Math.random() * 0.4 - 0.2) * basePerStat); // eslint-disable-line sonarjs/pseudo-random
    dummyStats[key] = Math.max(1, basePerStat + variation);
  }

  /**
   * @constant currentSum
   */
  const currentSum = Object.values(dummyStats).reduce((a, b) => a + b, 0);
  /**
   * @constant diff
   */
  const diff = totalPoints - currentSum;
  dummyStats.atk = Math.max(1, dummyStats.atk + diff);

  /**
   * @constant dummyHp
   */
  const dummyHp = Math.max(1, Math.floor(totalPoints / keys.length));

  return {
    id: `dummy_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // eslint-disable-line sonarjs/pseudo-random

    name: "Maniqu\u00ed de Pr\u00e1ctica",
    nivel: totalPoints,
    hp_actual: dummyHp * 2,
    stats: {
      hp: dummyHp,
      ...dummyStats,
    },
  };
}

/**
 * Guarda o actualiza una sesión de combate en la base de datos.
 * @param {*} session - - Sesión de combate a persistir.
 */
async function saveSession(session) {
  try {
    /**
     * @constant payload
     * @type {Object}
     */
    const payload = {
      id: session.id,
      is_pve: session.isPvE,
      challenger: session.challenger,
      defender: session.defender,
      current_turn_char_id: session.currentTurnCharId,
      status: session.status,
      pending_attack: session.pendingAttack,
      created_at: session.createdAt,
      last_turn_at: session.lastTurnAt,
      winner_id: session.winnerId,
      rounds: session.rounds,
    };
    const { error } = await supabase.from("combat_sessions").upsert(payload, { onConflict: "id" });
    if (error) {
      logError({ source: "combatState.saveSession", error });
    }
  } catch (err) {
    logError({ source: "combatState.saveSession", error: err });
  }
}

/**
 * Elimina una sesión de combate de la base de datos.
 * @param {string} sessionId - - ID de la sesión a eliminar.
 */
async function deleteSessionFromDb(sessionId) {
  try {
    const { error } = await supabase.from("combat_sessions").delete().eq("id", sessionId);
    if (error) {
      logError({ source: "combatState.deleteSessionFromDb", error });
    }
  } catch (err) {
    logError({ source: "combatState.deleteSessionFromDb", error: err });
  }
}

/**
 * Carga sesiones activas desde la base de datos al iniciar.
 * @returns {Promise<Array<*>>} Lista de sesiones restauradas
 */
async function loadSessionsFromDb() {
  try {
    const { data, error } = await supabase
      .from("combat_sessions")
      .select("*")
      .in("status", [SESSION_STATES.WAITING_ACTION, SESSION_STATES.WAITING_REACTION]);

    if (error) {
      logError({ source: "combatState.loadSessionsFromDb", error });
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      isPvE: row.is_pve,
      challenger: row.challenger,
      defender: row.defender,
      currentTurnCharId: row.current_turn_char_id,
      status: row.status,
      pendingAttack: row.pending_attack,
      createdAt: row.created_at,
      lastTurnAt: row.last_turn_at,
      winnerId: row.winner_id,
      rounds: row.rounds,
    }));
  } catch (err) {
    logError({ source: "combatState.loadSessionsFromDb", error: err });
    return [];
  }
}

/**
 * Verifica si una sesión ha expirado por tiempo de inactividad.
 * @param {*} session - Sesión de combate a verificar
 * @returns {boolean} true si la sesión expiró
 */
function isSessionExpired(session) {
  if (!session) return false;
  if (session.status === SESSION_STATES.COMPLETED || session.status === SESSION_STATES.EXPIRED) {
    return false;
  }
  return Date.now() - session.lastTurnAt > TURN_TIMEOUT_MS;
}

/**
 * Verifica si una sesión sigue activa (no completada ni expirada).
 * @param {*} session - Sesión de combate a verificar
 * @returns {boolean} true si la sesión está activa
 */
function isSessionActive(session) {
  if (!session) return false;
  return session.status !== SESSION_STATES.COMPLETED && session.status !== SESSION_STATES.EXPIRED;
}

/**
 * Cuenta las sesiones de combate activas actualmente.
 * @returns {number} Número de sesiones activas
 */
function getActiveSessionCount() {
  /**
   * @variable count
   * @type {number}
   */
  let count = 0;
  for (const session of sessions.values()) {
    if (isSessionActive(session)) count++;
  }
  return count;
}

/**
 * Crea una nueva sesión de combate PvP entre dos personajes.
 * @param {string} challengerId - ID del usuario retador
 * @param {string} defenderId - ID del usuario defensor
 * @param {*} challengerChar - Personaje del retador
 * @param {*} defenderChar - Personaje del defensor
 * @returns {Promise<*>} Sesión de combate creada
 */
async function createSession(challengerId, defenderId, challengerChar, defenderChar) {
  if (getActiveSessionCount() >= MAX_ACTIVE_SESSIONS) {
    throw new Error(`L\u00edmite de ${MAX_ACTIVE_SESSIONS} sesiones activas alcanzado.`);
  }

  /**
   * @constant sessionId
   */
  const sessionId = `${challengerChar.id}:${defenderChar.id}:${Date.now()}`;

  /**
   * @constant session
   * @type {Object}
   */
  const session = {
    id: sessionId,
    isPvE: false,
    challenger: {
      userId: challengerId,
      characterId: challengerChar.id,
      character: challengerChar,
      hp: challengerChar.hp_actual,
      isBot: false,
      fatigue: 0,
    },
    defender: {
      userId: defenderId,
      characterId: defenderChar.id,
      character: defenderChar,
      hp: defenderChar.hp_actual,
      isBot: false,
      fatigue: 0,
    },
    currentTurnCharId: challengerChar.id,
    status: SESSION_STATES.WAITING_ACTION,
    pendingAttack: null,
    createdAt: Date.now(),
    lastTurnAt: Date.now(),
    winnerId: null,
    rounds: 0,
  };

  sessions.set(sessionId, session);
  await saveSession(session);

  return session;
}

/**
 * Crea una sesión de combate PvE contra un personaje dummy.
 * @param {string} challengerId - ID del usuario retador
 * @param {*} challengerChar - Personaje del retador
 * @returns {Promise<*>} Sesión de combate PvE creada
 */
async function createDummySession(challengerId, challengerChar) {
  if (getActiveSessionCount() >= MAX_ACTIVE_SESSIONS) {
    throw new Error(`L\u00edmite de ${MAX_ACTIVE_SESSIONS} sesiones activas alcanzado.`);
  }

  /**
   * @constant dummyChar
   */
  const dummyChar = generateDummyCharacter(challengerChar);
  /**
   * @constant sessionId
   */
  const sessionId = `${challengerChar.id}:dummy:${Date.now()}`;

  /**
   * @constant session
   * @type {Object}
   */
  const session = {
    id: sessionId,
    isPvE: true,
    challenger: {
      userId: challengerId,
      characterId: challengerChar.id,
      character: challengerChar,
      hp: challengerChar.hp_actual,
      isBot: false,
      fatigue: 0,
    },
    defender: {
      userId: "bot_dummy",
      characterId: dummyChar.id,
      character: dummyChar,
      hp: dummyChar.hp_actual,
      isBot: true,
      fatigue: 0,
    },
    currentTurnCharId: challengerChar.id,
    status: SESSION_STATES.WAITING_ACTION,
    pendingAttack: null,
    createdAt: Date.now(),
    lastTurnAt: Date.now(),
    winnerId: null,
    rounds: 0,
  };

  sessions.set(sessionId, session);
  await saveSession(session);

  return session;
}

/**
 * Obtiene una sesión de combate por su ID.
 * @param {string} sessionId - ID de la sesión
 * @returns {*|null} Sesión encontrada o null
 */
function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

/**
 * Busca una sesión activa por ID de personaje.
 * @param {string} characterId - ID del personaje
 * @returns {*|null} Sesión activa encontrada o null
 */
function findSessionByCharacter(characterId) {
  if (!characterId) return null;
  /**
   * @constant targetIdStr
   */
  const targetIdStr = String(characterId);

  for (const session of sessions.values()) {
    if (!isSessionActive(session)) continue;
    if (
      String(session.challenger.characterId) === targetIdStr ||
      String(session.defender.characterId) === targetIdStr
    ) {
      if (isSessionExpired(session)) {
        expireSession(session.id, "timeout");
        continue;
      }
      return session;
    }
  }
  return null;
}

/**
 * Busca una sesión activa por ID de usuario.
 * @param {string} userId - ID del usuario
 * @returns {*|null} Sesión activa encontrada o null
 */
function findSessionByUser(userId) {
  for (const session of sessions.values()) {
    if (!isSessionActive(session)) continue;
    if (session.challenger.userId === userId || session.defender.userId === userId) {
      if (isSessionExpired(session)) {
        expireSession(session.id, "timeout");
        continue;
      }
      return session;
    }
  }
  return null;
}

/**
 * Dispara un evento de módulo para todos los participantes de la sesión.
 * @param {*} session - Sesión de combate
 * @param {string} event - Nombre del evento a disparar
 * @param {*} [context] - Contexto adicional para el evento
 * @returns {Array<*>} Resultados de la ejecución de módulos
 */
function triggerModuleEvent(session, event, context = {}) {
  /**
   * @constant slots
   * @type {Array}
   */
  const slots = [session.challenger, session.defender];
  /**
   * @constant results
   * @type {Array}
   */
  const results = [];
  for (const slot of slots) {
    /**
     * @constant charModules
     */
    const charModules = slot.character?.slots?.modules;
    if (!charModules) continue;
    for (const [type, config] of Object.entries(charModules)) {
      /**
       * @constant mod
       */
      const mod = moduleRegistry.createInstance(type, config);
      if (mod && mod.constructor.triggers.includes(event)) {
        /**
         * @constant method
         */
        const method = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
        if (typeof mod[method] === "function") {
          results.push({ characterId: slot.characterId, type, result: mod[method](context) });
        }
      }
    }
  }
  return results;
}

/**
 * Avanza al siguiente turno actualizando HP, fatiga y cambiando el turno al otro personaje.
 * @param {string} sessionId - ID de la sesión
 * @param {number} newAttackerHp - Nuevo HP del atacante
 * @param {number} newDefenderHp - Nuevo HP del defensor
 * @param {boolean} [skipRound] - Si true, no incrementa el contador de rondas
 * @returns {Promise<*|null>} Sesión actualizada o null si no existe
 */
async function advanceTurn(sessionId, newAttackerHp, newDefenderHp, skipRound = false) {
  /**
   * @constant session
   */
  const session = sessions.get(sessionId);
  if (!session || !isSessionActive(session)) return null;

  triggerModuleEvent(session, "TurnEnd", {
    session,
    actor: session.currentTurnCharId,
  });

  session.challenger.hp = newAttackerHp;
  session.defender.hp = newDefenderHp;
  session.lastTurnAt = Date.now();
  if (!skipRound) session.rounds += 1;
  session.pendingAttack = null;
  session.status = SESSION_STATES.WAITING_ACTION;

  session.currentTurnCharId =
    session.currentTurnCharId === session.challenger.characterId
      ? session.defender.characterId
      : session.challenger.characterId;

  triggerModuleEvent(session, "TurnStart", {
    session,
    actor: session.currentTurnCharId,
  });

  await saveSession(session);

  return session;
}

/**
 * Marca una sesión como esperando reacción del defensor.
 * @param {string} sessionId - ID de la sesión
 * @param {*} pendingData - Datos del ataque pendiente de reacción
 * @returns {Promise<*|null>} Sesión actualizada o null si no existe
 */
async function setPendingReaction(sessionId, pendingData) {
  /**
   * @constant session
   */
  const session = sessions.get(sessionId);
  if (!session || !isSessionActive(session)) return null;

  session.status = SESSION_STATES.WAITING_REACTION;
  session.pendingAttack = pendingData;
  await saveSession(session);
  return session;
}

/**
 * Limpia el estado de reacción pendiente de una sesión.
 * @param {string} sessionId - ID de la sesión
 * @returns {Promise<*|null>} Sesión actualizada o null si no existe
 */
async function clearPendingReaction(sessionId) {
  /**
   * @constant session
   */
  const session = sessions.get(sessionId);
  if (!session || !isSessionActive(session)) return null;

  session.status = SESSION_STATES.WAITING_ACTION;
  session.pendingAttack = null;
  await saveSession(session);
  return session;
}

/**
 * Finaliza una sesión de combate declarando un ganador y limpiando items temporales.
 * @param {string} sessionId - ID de la sesión
 * @param {string} winnerCharId - ID del personaje ganador
 * @returns {Promise<*|null>} Sesión finalizada o null si no existe
 */
async function endSession(sessionId, winnerCharId) {
  /**
   * @constant session
   */
  const session = sessions.get(sessionId);
  if (!session) return null;

  session.status = SESSION_STATES.COMPLETED;
  session.winnerId = winnerCharId;

  triggerModuleEvent(session, "CombatEnd", { session, winnerId: winnerCharId });

  await saveSession(session);
  const { cleanupTemporalItems } = require("./inventoryService");
  /**
   * @constant challengerId
   */
  const challengerId = session.challenger.characterId;
  /**
   * @constant defenderId
   */
  const defenderId = session.defender.characterId;
  await Promise.all([
    cleanupTemporalItems(challengerId).catch(() => {}),
    cleanupTemporalItems(defenderId).catch(() => {}),
  ]);

  return session;
}

/**
 * Marca una sesión como expirada por inactividad.
 * @param {string} sessionId - ID de la sesión
 * @param {string} _reason - Razón de la expiración (no utilizada internamente)
 * @returns {Promise<*|null>} Sesión expirada o null si no existe
 */
async function expireSession(sessionId, _reason) {
  /**
   * @constant session
   */
  const session = sessions.get(sessionId);
  if (!session) return null;

  session.status = SESSION_STATES.EXPIRED;

  await saveSession(session);

  return session;
}

/**
 * Elimina una sesión de la memoria y la base de datos.
 * @param {string} sessionId - - ID de la sesión a eliminar.
 */
async function removeSession(sessionId) {
  sessions.delete(sessionId);
  await deleteSessionFromDb(sessionId);
}

/**
 * Limpia sesiones expiradas y remueve sesiones inactivas de la memoria y BD.
 */
async function cleanup() {
  /**
   * @constant now
   */
  const now = Date.now();
  /**
   * @constant toExpire
   * @type {Array}
   */
  const toExpire = [];
  /**
   * @constant toRemove
   * @type {Array}
   */
  const toRemove = [];

  for (const [id, session] of sessions.entries()) {
    if (!isSessionActive(session)) {
      toRemove.push(id);
      continue;
    }
    /**
     * @constant elapsed
     */
    const elapsed = now - session.lastTurnAt;
    if (elapsed > TURN_TIMEOUT_MS) {
      toExpire.push(id);
    }
  }

  for (const id of toExpire) {
    await expireSession(id, "timeout");
  }

  for (const id of toRemove) {
    sessions.delete(id);
    await deleteSessionFromDb(id);
  }

  if (toExpire.length > 0 || toRemove.length > 0) {
    logSystem(`Combat cleanup: ${toExpire.length} expiradas, ${toRemove.length} eliminadas`);
  }
}

/**
 * Restaura sesiones activas desde la base de datos al iniciar el bot.
 */
async function restoreSessions() {
  /**
   * @constant loaded
   */
  const loaded = await loadSessionsFromDb();

  for (const session of loaded) {
    if (isSessionExpired(session)) {
      session.status = SESSION_STATES.EXPIRED;
      await saveSession(session);
    } else {
      sessions.set(session.id, session);
    }
  }

  logSystem(`Combat: ${sessions.size} sesiones restauradas desde Supabase`);
}

/**
 * Inicia el intervalo de limpieza automática de sesiones cada 5 minutos.
 */
function startCleanupInterval() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(
    () => {
      cleanup();
    },
    5 * 60 * 1000,
  );
}

/**
 * Detiene el intervalo de limpieza automática de sesiones.
 */
function stopCleanupInterval() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

module.exports = {
  createSession,
  createDummySession,
  generateDummyCharacter,
  getSession,
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  clearPendingReaction,
  isSessionActive,
  isSessionExpired,
  endSession,
  expireSession,
  removeSession,
  cleanup,
  restoreSessions,
  startCleanupInterval,
  stopCleanupInterval,
};
