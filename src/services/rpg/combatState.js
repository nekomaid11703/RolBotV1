// @ts-nocheck
const { TURN_TIMEOUT_MS, MAX_ACTIVE_SESSIONS, SESSION_STATES } = require("../../config/combatConfig");
const { supabase } = require("../../database/supabase");
const { logError, logSystem } = require("../loggerService");

const sessions = new Map();
let cleanupInterval = null;

/**
 *
 * @param challengerChar
 */
function generateDummyCharacter(challengerChar) {
  const stats = challengerChar.stats || {};
  const totalPoints =
    Number(stats.atk || 0) +
      Number(stats.def || 0) +
      Number(stats.aspd || 0) +
      Number(stats.ref || 0) +
      Number(stats.mspd || 0) +
      Number(stats.fulgor || 0) +
      Number(stats.d_fulgor || 0) +
      Number(stats.r_fulgor || 0) || 20;

  const keys = ["atk", "def", "aspd", "ref", "mspd", "fulgor", "d_fulgor", "r_fulgor"];
  const basePerStat = Math.max(1, Math.floor(totalPoints / keys.length));

  const dummyStats = {};
  for (const key of keys) {
    const variation = Math.floor((Math.random() * 0.4 - 0.2) * basePerStat);
    dummyStats[key] = Math.max(1, basePerStat + variation);
  }

  const currentSum = Object.values(dummyStats).reduce((a, b) => a + b, 0);
  const diff = totalPoints - currentSum;
  dummyStats.atk = Math.max(1, dummyStats.atk + diff);

  return {
    id: `dummy_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: "Maniqu\u00ed de Pr\u00e1ctica",
    nivel: totalPoints,
    hp_actual: 100,
    stats: {
      hp: 100,
      ...dummyStats,
    },
  };
}

/**
 *
 * @param session
 */
async function saveSession(session) {
  try {
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
 *
 * @param sessionId
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
 *
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
 *
 * @param session
 */
function isSessionExpired(session) {
  if (!session) return false;
  if (session.status === SESSION_STATES.COMPLETED || session.status === SESSION_STATES.EXPIRED) {
    return false;
  }
  return Date.now() - session.lastTurnAt > TURN_TIMEOUT_MS;
}

/**
 *
 * @param session
 */
function isSessionActive(session) {
  if (!session) return false;
  return session.status !== SESSION_STATES.COMPLETED && session.status !== SESSION_STATES.EXPIRED;
}

/**
 *
 */
function getActiveSessionCount() {
  let count = 0;
  for (const session of sessions.values()) {
    if (isSessionActive(session)) count++;
  }
  return count;
}

/**
 *
 * @param challengerId
 * @param defenderId
 * @param challengerChar
 * @param defenderChar
 */
async function createSession(challengerId, defenderId, challengerChar, defenderChar) {
  if (getActiveSessionCount() >= MAX_ACTIVE_SESSIONS) {
    throw new Error(`L\u00edmite de ${MAX_ACTIVE_SESSIONS} sesiones activas alcanzado.`);
  }

  const sessionId = `${challengerChar.id}:${defenderChar.id}:${Date.now()}`;

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
 *
 * @param challengerId
 * @param challengerChar
 */
async function createDummySession(challengerId, challengerChar) {
  if (getActiveSessionCount() >= MAX_ACTIVE_SESSIONS) {
    throw new Error(`L\u00edmite de ${MAX_ACTIVE_SESSIONS} sesiones activas alcanzado.`);
  }

  const dummyChar = generateDummyCharacter(challengerChar);
  const sessionId = `${challengerChar.id}:dummy:${Date.now()}`;

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
 *
 * @param sessionId
 */
function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

/**
 *
 * @param characterId
 */
function findSessionByCharacter(characterId) {
  if (!characterId) return null;
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
 *
 * @param userId
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
 *
 * @param sessionId
 * @param newAttackerHp
 * @param newDefenderHp
 */
async function advanceTurn(sessionId, newAttackerHp, newDefenderHp) {
  const session = sessions.get(sessionId);
  if (!session || !isSessionActive(session)) return null;

  session.challenger.hp = newAttackerHp;
  session.defender.hp = newDefenderHp;
  session.lastTurnAt = Date.now();
  session.rounds += 1;
  session.pendingAttack = null;
  session.status = SESSION_STATES.WAITING_ACTION;

  session.currentTurnCharId =
    session.currentTurnCharId === session.challenger.characterId
      ? session.defender.characterId
      : session.challenger.characterId;

  await saveSession(session);

  return session;
}

/**
 *
 * @param sessionId
 * @param pendingData
 */
function setPendingReaction(sessionId, pendingData) {
  const session = sessions.get(sessionId);
  if (!session || !isSessionActive(session)) return null;

  session.status = SESSION_STATES.WAITING_REACTION;
  session.pendingAttack = pendingData;
  saveSession(session);
  return session;
}

/**
 *
 * @param sessionId
 */
function clearPendingReaction(sessionId) {
  const session = sessions.get(sessionId);
  if (!session || !isSessionActive(session)) return null;

  session.status = SESSION_STATES.WAITING_ACTION;
  session.pendingAttack = null;
  saveSession(session);
  return session;
}

/**
 *
 * @param sessionId
 * @param winnerCharId
 */
async function endSession(sessionId, winnerCharId) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  session.status = SESSION_STATES.COMPLETED;
  session.winnerId = winnerCharId;

  await saveSession(session);

  return session;
}

/**
 *
 * @param sessionId
 * @param _reason
 */
async function expireSession(sessionId, _reason) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  session.status = SESSION_STATES.EXPIRED;

  await saveSession(session);

  return session;
}

/**
 *
 * @param sessionId
 */
async function removeSession(sessionId) {
  sessions.delete(sessionId);
  await deleteSessionFromDb(sessionId);
}

/**
 *
 */
async function cleanup() {
  const now = Date.now();
  const toExpire = [];
  const toRemove = [];

  for (const [id, session] of sessions.entries()) {
    if (!isSessionActive(session)) {
      toRemove.push(id);
      continue;
    }
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
 *
 */
async function restoreSessions() {
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
 *
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
 *
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
