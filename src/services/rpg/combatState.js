// @ts-nocheck
const { TURN_TIMEOUT_MS, MAX_ACTIVE_SESSIONS, SESSION_STATES } = require("../../config/combatConfig");
const { supabase } = require("../../database/supabase");
const { logError, logSystem } = require("../loggerService");
/**
 * @constant moduleRegistry
 */
const moduleRegistry = require("../../modules/moduleRegistry");
const { buildDummyEquipment, IRON_DUMMY_LOADOUT } = require("./dummyEquipment");
const { resolveElementReaction } = require("./spellEffects");

/**
 * @constant sessions
 * @type {Map<*, *>}
 */
const sessions = new Map();
/** @type {Map<string, *>} */
const persistedSnapshots = new Map();
let cleanupInterval = null;

function cloneSession(session) {
  return structuredClone(session);
}

function rememberPersistedSession(session) {
  persistedSnapshots.set(session.id, cloneSession(session));
}

function restorePersistedSession(session) {
  const snapshot = persistedSnapshots.get(session.id);
  if (!snapshot) return;
  for (const key of Object.keys(session)) {
    if (!(key in snapshot)) delete session[key];
  }
  Object.assign(session, cloneSession(snapshot));
}

/**
 * Genera un personaje dummy para combate de práctica PvE.
 * @param {*} challengerChar - Personaje del retador para escalar estadísticas del dummy
 * @param {object} [options] - { loadout, minFulgor }
 * @param {Array<{slot: string, itemId: string}>} [options.loadout] - Loadout del dummy (default hierro)
 * @param {number} [options.minFulgor] - Batería mínima garantizada (dummy mágico)
 * @returns {*} Personaje dummy generado
 */
function generateDummyCharacter(challengerChar, options = {}) {
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
   * @type {*[]}
   */
  const keys = ["atk", "def", "aspd", "ref", "mspd", "fulgor", "d_fulgor", "r_fulgor"];
  /**
   * @constant basePerStat
   */
  const basePerStat = Math.max(1, Math.floor(totalPoints / keys.length));

  /**
   * @constant dummyStats
   * @type {object}
   */
  const dummyStats = {};
  for (const key of keys) {
    /**
     * @constant variation
     */
    const variation = Math.floor((Math.random() * 0.4 - 0.2) * basePerStat);
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

  // Batería mínima garantizada para el dummy mágico (B.3): el lanzamiento diluido
  // con la batería base es viable (eff = fulgor_actual/coste ≥ FULGOR_DILUTED_MIN).
  const minFulgor = Number(options.minFulgor);
  if (Number.isFinite(minFulgor) && minFulgor > 0) {
    dummyStats.fulgor = Math.max(dummyStats.fulgor || 0, Math.ceil(minFulgor));
  }

  /**
   * @constant dummyHp
   */
  const dummyHp = Math.max(1, Math.floor(totalPoints / keys.length));

  const loadout = Array.isArray(options.loadout) ? options.loadout : IRON_DUMMY_LOADOUT;

  return {
    id: `dummy_${Date.now()}_${Math.floor(Math.random() * 1000)}`,

    name: "Maniqu\u00ed de Pr\u00e1ctica",
    nivel: totalPoints,
    hp_actual: dummyHp * 2,
    stats: {
      hp: dummyHp,
      ...dummyStats,
    },
    // Equipamiento en memoria (Familia del Hierro por defecto) para que el dummy
    // use y luzca el sistema de equipo sin tocar la DB.
    dummyEquipment: buildDummyEquipment(loadout),
  };
}

/**
 * Resuelve el HP inicial de un combatiente de forma defensiva.
 * Si el HP persistido es 0 o inválido (p. ej. vida 0 dejada por un combate
 * anterior), inicia con el HP máximo para que una sesión nunca arranque con 0.
 * @param {*} character - Personaje con stats y hp_actual
 * @returns {number} HP inicial de la sesión (> 0)
 */
function resolveSessionHp(character) {
  const maxHp = (character.stats?.hp ?? 1) * 2;
  const hp = Number(character.hp_actual);
  return Number.isFinite(hp) && hp > 0 ? Math.floor(hp) : maxHp;
}

/**
 * Resuelve la batería de fulgor inicial de un personaje en sesión.
 * La batería NO se regenera en combate (§11.5.2 / P4): se inicializa a la stat fulgor.
 * @param {*} character - Personaje que entra en combate
 * @returns {number} Fulgor actual (≥ 0)
 */
function resolveSessionFulgor(character) {
  const fulgor = Number(character.stats?.fulgor);
  return Number.isFinite(fulgor) && fulgor > 0 ? Math.floor(fulgor) : 0;
}

/**
 * Guarda o actualiza una sesión de combate en la base de datos.
 * @param {*} session - - Sesión de combate a persistir.
 */
async function saveSession(session) {
  try {
    /**
     * @constant payload
     * @type {object}
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
      distance: session.distance,
    };
    const { error } = await supabase.from("combat_sessions").upsert(payload, { onConflict: "id" });
    if (error) throw error;
  } catch (err) {
    await logError({ source: "combatState.saveSession", error: err });
    throw err;
  }
}

/**
 * Elimina una sesión de combate de la base de datos.
 * @param {string} sessionId - - ID de la sesión a eliminar.
 */
async function deleteSessionFromDb(sessionId) {
  try {
    const { error } = await supabase.from("combat_sessions").delete().eq("id", sessionId);
    if (error) throw error;
  } catch (err) {
    await logError({ source: "combatState.deleteSessionFromDb", error: err });
    throw err;
  }
}

/**
 * Persiste el siguiente estado antes de publicarlo en la caché en memoria.
 * @param {*} session - Sesión actual
 * @param {(next: *) => void} mutate - Cambio a aplicar sobre una copia
 * @returns {Promise<*>} Sesión actualizada
 */
async function persistSessionUpdate(session, mutate) {
  const next = {
    ...session,
    challenger: { ...session.challenger },
    defender: { ...session.defender },
  };
  mutate(next);
  try {
    await saveSession(next);
  } catch (error) {
    restorePersistedSession(session);
    throw error;
  }
  Object.assign(session, next);
  rememberPersistedSession(session);
  return session;
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

    if (error) throw error;

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
      distance: Number(row.distance ?? 5),
    }));
  } catch (err) {
    await logError({ source: "combatState.loadSessionsFromDb", error: err });
    throw err;
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
   * @type {object}
   */
  const session = {
    id: sessionId,
    isPvE: false,
    distance: 5,
    challenger: {
      userId: challengerId,
      characterId: challengerChar.id,
      character: challengerChar,
      hp: resolveSessionHp(challengerChar),
      fulgor: resolveSessionFulgor(challengerChar),
      isBot: false,
      fatigue: 0,
      aura: { pasiva: null, turnos: 0 },
    },
    defender: {
      userId: defenderId,
      characterId: defenderChar.id,
      character: defenderChar,
      hp: resolveSessionHp(defenderChar),
      fulgor: resolveSessionFulgor(defenderChar),
      isBot: false,
      fatigue: 0,
      aura: { pasiva: null, turnos: 0 },
    },
    currentTurnCharId: challengerChar.id,
    status: SESSION_STATES.WAITING_ACTION,
    pendingAttack: null,
    createdAt: Date.now(),
    lastTurnAt: Date.now(),
    winnerId: null,
    rounds: 0,
  };

  await saveSession(session);
  rememberPersistedSession(session);
  sessions.set(sessionId, session);

  return session;
}

/**
 * @param {string} sessionId
 * @param {number} newDistance
 */
async function updateDistance(sessionId, newDistance) {
  const session = sessions.get(sessionId);
  if (!session || !isSessionActive(session)) return null;
  return persistSessionUpdate(session, (next) => {
    next.distance = newDistance;
    next.lastTurnAt = Date.now();
  });
}

/**
 * Crea una sesión de combate PvE contra un personaje dummy.
 * @param {string} challengerId - ID del usuario retador
 * @param {*} challengerChar - Personaje del retador
 * @param {object} [options] - Opciones del dummy { loadout, minFulgor }
 * @returns {Promise<*>} Sesión de combate PvE creada
 */
async function createDummySession(challengerId, challengerChar, options = {}) {
  if (getActiveSessionCount() >= MAX_ACTIVE_SESSIONS) {
    throw new Error(`L\u00edmite de ${MAX_ACTIVE_SESSIONS} sesiones activas alcanzado.`);
  }

  /**
   * @constant dummyChar
   */
  const dummyChar = generateDummyCharacter(challengerChar, options);
  /**
   * @constant sessionId
   */
  const sessionId = `${challengerChar.id}:dummy:${Date.now()}`;

  /**
   * @constant session
   * @type {object}
   */
  const session = {
    id: sessionId,
    isPvE: true,
    challenger: {
      userId: challengerId,
      characterId: challengerChar.id,
      character: challengerChar,
      hp: resolveSessionHp(challengerChar),
      fulgor: resolveSessionFulgor(challengerChar),
      isBot: false,
      fatigue: 0,
      aura: { pasiva: null, turnos: 0 },
    },
    defender: {
      userId: "bot_dummy",
      characterId: dummyChar.id,
      character: dummyChar,
      hp: dummyChar.hp_actual,
      fulgor: resolveSessionFulgor(dummyChar),
      isBot: true,
      fatigue: 0,
      aura: { pasiva: null, turnos: 0 },
    },
    currentTurnCharId: challengerChar.id,
    status: SESSION_STATES.WAITING_ACTION,
    pendingAttack: null,
    createdAt: Date.now(),
    lastTurnAt: Date.now(),
    winnerId: null,
    rounds: 0,
    distance: 5,
  };

  await saveSession(session);
  rememberPersistedSession(session);
  sessions.set(sessionId, session);

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
        void expireSession(session.id, "timeout").catch((error) =>
          logError({ source: "combatState.findSessionByCharacter", error }),
        );
        return session;
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
        void expireSession(session.id, "timeout").catch((error) =>
          logError({ source: "combatState.findSessionByUser", error }),
        );
        return session;
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
   * @type {*[]}
   */
  const slots = [session.challenger, session.defender];
  /**
   * @constant results
   * @type {*[]}
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
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {*} sessionId
 * @param {*} newAttackerHp
 * @param {*} newDefenderHp
 * @param {*} skipRound
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

  await persistSessionUpdate(session, (next) => {
    next.challenger.hp = newAttackerHp;
    next.defender.hp = newDefenderHp;
    decaySlotAura(next.challenger);
    decaySlotAura(next.defender);
    next.lastTurnAt = Date.now();
    if (!skipRound) next.rounds += 1;
    next.pendingAttack = null;
    next.status = SESSION_STATES.WAITING_ACTION;

    next.currentTurnCharId =
      next.currentTurnCharId === next.challenger.characterId ? next.defender.characterId : next.challenger.characterId;
  });

  triggerModuleEvent(session, "TurnStart", {
    session,
    actor: session.currentTurnCharId,
  });

  return session;
}

/**
 * Decrementa la ventana de imbuición de un slot y la limpia al llegar a cero.
 * @param {object} slot - Slot (challenger/defender) con estado `aura`
 */
function decaySlotAura(slot) {
  if (!slot.aura || !slot.aura.pasiva) return;
  slot.aura.turnos = Math.max(0, (Number(slot.aura.turnos) || 0) - 1);
  if (slot.aura.turnos <= 0) {
    slot.aura = { pasiva: null, turnos: 0 };
  }
}

/**
 * Devuelve el slot (challenger/defender) de la sesión por ID de personaje.
 * @param {*} session - Sesión de combate
 * @param {string} targetId - ID de personaje del objetivo
 * @returns {object|null} Slot correspondiente o null
 */
function resolveSlotByCharacterId(session, targetId) {
  const id = String(targetId);
  if (String(session.challenger.characterId) === id) return session.challenger;
  if (String(session.defender.characterId) === id) return session.defender;
  return null;
}

/**
 * Aplica un golpe elemental a un objetivo de la sesión y resuelve la reacción.
 *
 * El estado de imbuición del slot (`aura`) alimenta `resolveElementReaction`:
 *  - sin aura previa → imprime el elemento dominante (aura pasiva);
 *  - mismo elemento → refresca la ventana;
 *  - par con reacción → evento instantáneo (multiplicador + efectos) y consume
 *    el aura;
 *  - par sin reacción → el dominante reemplaza la aura.
 *
 * Aplica la nueva aura según `auraResultante` (persistencia en la sesión).
 * @param {string} sessionId - ID de la sesión
 * @param {string} targetId - ID del personaje objetivo
 * @param {string} dominante - Elemento entrante del golpe/hechizo
 * @returns {Promise<object|null>} Decisión de reacción (+ multiplicador/efectos)
 *   y aura aplicada; null si la sesión o el objetivo no existen
 */
async function applyElementalHit(sessionId, targetId, dominante) {
  const session = sessions.get(sessionId);
  const target = session ? resolveSlotByCharacterId(session, targetId) : null;
  if (!session || !target) return null;

  const res = resolveElementReaction(
    { objetivo: { auraPasiva: target.aura?.pasiva ?? null, turnosAura: target.aura?.turnos ?? 0 } },
    dominante,
  );

  await persistSessionUpdate(session, (next) => {
    const nextTarget =
      String(next.challenger.characterId) === String(targetId) ? next.challenger : next.defender;
    if (res.auraResultante && res.auraResultante.pasiva) {
      nextTarget.aura = { pasiva: res.auraResultante.pasiva, turnos: res.auraResultante.turnos };
    } else {
      nextTarget.aura = { pasiva: null, turnos: 0 };
    }
  });

  // El aura aplicada (madre de datos: la sesión persistida) viaja en el resultado
  // para que el llamador pueda leer el estado de imbuición tras el golpe.
  const nextTarget = resolveSlotByCharacterId(session, targetId);
  res.sessionAura = { ...(nextTarget.aura || { pasiva: null, turnos: 0 }) };
  return res;
}

/**
 * Aplica una reacción elemental a un ataque sobre un objetivo: resuelve la
 * imbuición (aura), persiste el nuevo estado y AMPLIFICA el daño del golpe
 * por el `canal` de la reacción en el instante (SEMÁNTICA Fase 4).
 *
 * Es el punto de entrada del motor: los comandos/resolución de turno llaman a
 * este helper con el golpe ya calculado y reciben el daño ya escalado además
 * de la decisión (para mensajes y efectos de estado).
 *
 * @param {string} sessionId - ID de la sesión
 * @param {object} targetSlot - Slot objetivo ({ characterId, ... }) con aura
 * @param {string} dominante - Elemento entrante del golpe/hechizo (canónico)
 * @param {number} baseDamage - Daño corporal del golpe sin amplificar
 * @param {number} [materialDamage] - Daño material del golpe sin amplificar
 * @returns {Promise<{reaction: object|null, baseDamage: number, materialDamage: number}>}
 *   reaction = decisión nula si no hay sesión/objetivo; baseDamage/materialDamage
 *   ya escalados por el multiplicador cuando la reacción dispara.
 */
async function applyElementalAttack(sessionId, targetSlot, dominante, baseDamage, materialDamage = 0) {
  const res = await applyElementalHit(sessionId, targetSlot?.characterId, dominante);
  if (!res) {
    return { reaction: null, baseDamage, materialDamage };
  }
  const mult = Number(res.multiplicador) || 1;
  const scaledBody = Math.max(1, Math.floor(baseDamage * mult));
  const scaledMaterial = materialDamage > 0 ? Math.max(1, Math.floor(materialDamage * mult)) : materialDamage;
  return { reaction: res, baseDamage: scaledBody, materialDamage: scaledMaterial };
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

  return persistSessionUpdate(session, (next) => {
    next.status = SESSION_STATES.WAITING_REACTION;
    next.pendingAttack = pendingData;
    next.lastTurnAt = Date.now();
  });
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

  await persistSessionUpdate(session, (next) => {
    next.status = SESSION_STATES.COMPLETED;
    next.winnerId = winnerCharId;
  });

  triggerModuleEvent(session, "CombatEnd", { session, winnerId: winnerCharId });
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
    cleanupTemporalItems(challengerId).catch((error) =>
      logError({ source: "combatState.cleanupTemporalItems", error, context: { characterId: challengerId } }),
    ),
    cleanupTemporalItems(defenderId).catch((error) =>
      logError({ source: "combatState.cleanupTemporalItems", error, context: { characterId: defenderId } }),
    ),
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

  return persistSessionUpdate(session, (next) => {
    next.status = SESSION_STATES.EXPIRED;
  });
}

/**
 * Elimina una sesión de la memoria y la base de datos.
 * @param {string} sessionId - - ID de la sesión a eliminar.
 */
async function removeSession(sessionId) {
  await deleteSessionFromDb(sessionId);
  sessions.delete(sessionId);
  persistedSnapshots.delete(sessionId);
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
   * @type {*[]}
   */
  const toExpire = [];
  /**
   * @constant toRemove
   * @type {*[]}
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
    await removeSession(id);
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
      rememberPersistedSession(session);
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
      cleanup().catch((error) => logError({ source: "combatState.cleanup", error }));
    },
    5 * 60 * 1000,
  );
}

module.exports = {
  createSession,
  createDummySession,
  generateDummyCharacter,
  resolveSessionHp,
  resolveSessionFulgor,
  getSession,
  findSessionByCharacter,
  updateDistance,
  findSessionByUser,
  advanceTurn,
  applyElementalHit,
  applyElementalAttack,
  resolveSlotByCharacterId,
  setPendingReaction,
  isSessionActive,
  isSessionExpired,
  endSession,
  expireSession,
  removeSession,
  restoreSessions,
  startCleanupInterval,
};
