const { supabase } = require('../../database/supabase');

const SESSION_ID = 'combat_log';

async function logAction(roomId, entry) {
  try {
    const data = {
      roomId,
      turnCount: entry.turnCount || 0,
      round: entry.round || 1,
      timestamp: Date.now(),
      actor: entry.actor || 'unknown',
      actorName: entry.actorName || 'unknown',
      actionType: entry.actionType || 'unknown',
      target: entry.target || null,
      targetName: entry.targetName || null,
      zone: entry.zone || null,
      damage: entry.damage || 0,
      crit: entry.crit || false,
      ko: entry.ko || false,
      intercepted: entry.intercepted || false,
      blocked: entry.blocked || false,
      narrative: entry.narrative || null,
      infraction: entry.infraction || null,
      sanction: entry.sanction || false,
    };

    const id = `${roomId}:turno_${entry.turnCount}_${entry.timestamp || Date.now()}`;

    await supabase.from('bot_auth_state').upsert({
      session_id: SESSION_ID,
      id,
      data,
    });
  } catch (err) {
    console.error('combatLogger: error registrando acción', err.message);
  }
}

async function logCombatEnd(roomId, result) {
  try {
    const data = {
      roomId,
      type: 'combat_end',
      timestamp: Date.now(),
      winner: result.winner || 'unknown',
      rounds: result.rounds || 1,
      totalTurns: result.totalTurns || 0,
      participants: result.participants || [],
      reward: result.reward || null,
      duration: result.duration || 0,
    };

    await supabase.from('bot_auth_state').upsert({
      session_id: SESSION_ID,
      id: `${roomId}:end`,
      data,
    });
  } catch (err) {
    console.error('combatLogger: error registrando fin de combate', err.message);
  }
}

function mapActionResultToLogEntry(room, actionResult, narrativeText) {
  const { action, result, context } = actionResult;
  return {
    turnCount: room.turnCount,
    round: room.round,
    timestamp: Date.now(),
    actor: action.actor,
    actorName: context.attacker?.name || 'unknown',
    actionType: action.type,
    target: result.ko ? (context.defender?.name || 'unknown') : null,
    targetName: context.defender?.name || null,
    zone: result.bodyPart || action.targetZone || null,
    damage: result.damage || 0,
    crit: result.crit || false,
    ko: result.ko || false,
    intercepted: result.intercepted || false,
    blocked: result.blocked || false,
    narrative: narrativeText || null,
    infraction: null,
    sanction: false,
  };
}

function mapInfractionToLogEntry(room, participant, infractionResult) {
  return {
    turnCount: room.turnCount,
    round: room.round,
    timestamp: Date.now(),
    actor: participant?.id || 'unknown',
    actorName: participant?.name || 'unknown',
    actionType: 'infraction',
    target: null,
    targetName: null,
    zone: null,
    damage: 0,
    crit: false,
    ko: false,
    intercepted: false,
    blocked: false,
    narrative: null,
    infraction: infractionResult.infractions?.[0]?.type || 'unknown',
    sanction: infractionResult.sanction || false,
  };
}

async function getCombatLog(roomId, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('bot_auth_state')
      .select('data')
      .eq('session_id', SESSION_ID)
      .filter('data->>roomId', 'eq', roomId)
      .order('data->>timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    if (!data) return [];
    return data.map(r => r.data);
  } catch (err) {
    console.error('combatLogger: error leyendo log', err.message);
    return [];
  }
}

async function getCombatsByParticipant(participantId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('bot_auth_state')
      .select('data')
      .eq('session_id', SESSION_ID)
      .filter('data->>actor', 'eq', participantId)
      .order('data->>timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    if (!data) return [];
    return [...new Set(data.map(r => r.data?.roomId).filter(Boolean))];
  } catch (err) {
    console.error('combatLogger: error buscando combates', err.message);
    return [];
  }
}

module.exports = {
  logAction,
  logCombatEnd,
  mapActionResultToLogEntry,
  mapInfractionToLogEntry,
  getCombatLog,
  getCombatsByParticipant,
};
