const crypto = require('crypto');
const { supabase } = require('../../database/supabase');
const { getEnemy } = require('./enemies');

const SESSION_ID = 'combat';
const rooms = new Map();
const groupIndex = new Map();
let loaded = false;

function uuid() {
  return 'cmb_' + crypto.randomBytes(6).toString('hex');
}

function makeBaseParticipant(jid, name, team, charStats = {}, equipped = {}, equipmentBonuses = {}) {
  const s = charStats;
  const b = equipmentBonuses || {};
  return {
    id: jid,
    name: name || jid.split('@')[0],
    team,
    hp: s.vida || 100,
    maxHp: s.vida || 100,
    fulgor: s.fulgor_max || 50,
    maxFulgor: s.fulgor_max || 50,
    fatigue: 0,
    fuerza: (s.fuerza || 5) + (b.fuerza || 0),
    resistencia_fisica: (s.resistencia_fisica || 5) + (b.resistencia_fisica || 0) + (b.defensa || 0),
    resistencia_magica: (s.resistencia_magica || 3) + (b.resistencia_magica || 0),
    reflejos: (s.reflejos || 5) + (b.reflejos || 0) + (b.agilidad || 0),
    velocidad_ataque: (s.velocidad_ataque || 5) + (b.velocidad_ataque || 0) + (b.agilidad || 0),
    precision: (s.precision || 5) + (b.precision || 0),
    velocidad_desplazamiento: (s.velocidad_desplazamiento || 5) + (b.velocidad_desplazamiento || 0) + (b.agilidad || 0),
    dominio_fulgor: (s.dominio_fulgor || 1) + (b.dominio_fulgor || 0) + (b.magia || 0),
    defending: false,
    ko: false,
    consecutiveSkips: 0,
    lastActionAt: Date.now(),
    equipped,
    equipmentBonuses,
    bodyParts: {
      cabeza: 10, cuello: 5, pecho: 20, abdomen: 15, espalda: 15,
      brazo_izq: 10, brazo_der: 10, mano_izq: 5, mano_der: 5,
      pierna_izq: 12, pierna_der: 12, pie_izq: 5, pie_der: 5,
    },
  };
}

function makeEnemyParticipant(enemy, index) {
  const eId = `enemy:${enemy.id}_${index}`;
  return {
    id: eId,
    name: enemy.name + (index > 0 ? ` ${index + 1}` : ''),
    team: 'enemies',
    hp: enemy.hp || 40,
    maxHp: enemy.hp || 40,
    fulgor: enemy.mp || 5,
    maxFulgor: enemy.mp || 5,
    fatigue: 0,
    fuerza: enemy.stats?.fuerza || 3,
    resistencia_fisica: enemy.stats?.defensa || 2,
    resistencia_magica: enemy.stats?.magia || 2,
    reflejos: enemy.stats?.percepcion || 2,
    velocidad_ataque: enemy.stats?.agilidad || 2,
    precision: enemy.stats?.percepcion || 2,
    velocidad_desplazamiento: enemy.stats?.agilidad || 2,
    dominio_fulgor: 0,
    defending: false,
    ko: false,
    consecutiveSkips: 0,
    lastActionAt: Date.now(),
    bodyParts: {
      cabeza: 8, cuello: 4, pecho: 18, abdomen: 12, espalda: 12,
      brazo_izq: 8, brazo_der: 8, mano_izq: 4, mano_der: 4,
      pierna_izq: 10, pierna_der: 10, pie_izq: 4, pie_der: 4,
    },
  };
}

async function saveToSupabase(room) {
  try {
    const data = JSON.parse(JSON.stringify(room));
    await supabase.from('bot_auth_state').upsert({
      session_id: SESSION_ID,
      id: room.id,
      data,
    });
  } catch (err) {
    console.error('combatStateManager: error guardando sala', room.id, err.message);
  }
}

async function deleteFromSupabase(combatId) {
  try {
    await supabase.from('bot_auth_state').delete().eq('session_id', SESSION_ID).eq('id', combatId);
  } catch (err) {
    console.error('combatStateManager: error eliminando sala', combatId, err.message);
  }
}

function getRoom(combatId) {
  return rooms.get(combatId) || null;
}

function getRoomByGroup(groupId) {
  const combatId = groupIndex.get(groupId);
  if (!combatId) return null;
  const room = rooms.get(combatId);
  if (!room || room.status !== 'active') {
    groupIndex.delete(groupId);
    return null;
  }
  return room;
}

function setRoom(room) {
  rooms.set(room.id, room);
  groupIndex.set(room.groupId, room.id);
}

function deleteRoom(combatId) {
  const room = rooms.get(combatId);
  if (room) groupIndex.delete(room.groupId);
  rooms.delete(combatId);
}

function createRoom(groupId, participants, location = {}) {
  const room = {
    id: uuid(),
    groupId,
    status: 'active',
    round: 1,
    turnCount: 0,
    currentTurnIndex: 0,
    lastActionAt: Date.now(),
    turnTimeoutMs: 86400000,
    participants: [],
    turnQueue: [],
    location: {
      region: location.region || 'desconocida',
      zone: location.zone || 'desconocida',
      locationId: location.locationId || 'default',
      sceneVersion: location.sceneVersion || 1,
    },
    createdAt: Date.now(),
    startedVia: location.startedVia || 'pve',
  };

  for (const p of participants) {
    room.participants.push(p);
  }

  room.turnQueue = participants
    .map((p, i) => ({ participantId: p.id, order: i, vel: p.velocidad_ataque }))
    .sort((a, b) => b.vel - a.vel);

  setRoom(room);
  return room;
}

async function createCombatRoom(groupId, initiator, character, enemyIds, quantity = 1, equipped = {}, equipmentBonuses = {}) {
  const participants = [];

  const charStats = character.stats || {};
  participants.push(makeBaseParticipant(initiator, character.name, 'players', charStats, equipped, equipmentBonuses));

  if (enemyIds && enemyIds.length > 0) {
    for (const eid of enemyIds) {
      const enemy = getEnemy(eid);
      if (enemy) {
        for (let i = 0; i < quantity; i++) {
          participants.push(makeEnemyParticipant(enemy, i));
        }
      }
    }
  }

  const room = createRoom(groupId, participants, { startedVia: 'pve' });
  await saveToSupabase(room);
  return room;
}

async function addParticipant(room, jid, name, charStats = {}, equipped = {}, equipmentBonuses = {}) {
  if (room.participants.some(p => p.id === jid)) return false;
  const p = makeBaseParticipant(jid, name, 'players', charStats, equipped, equipmentBonuses);
  room.participants.push(p);
  room.turnQueue.push({ participantId: jid, order: room.turnQueue.length, vel: p.velocidad_ataque });
  room.turnQueue.sort((a, b) => b.vel - a.vel);
  await saveToSupabase(room);
  return true;
}

async function updateRoom(combatId, patch) {
  const room = rooms.get(combatId);
  if (!room) return null;
  Object.assign(room, patch);
  room.lastActionAt = Date.now();
  setRoom(room);
  await saveToSupabase(room);
  return room;
}

async function removeParticipant(combatId, jid) {
  const room = rooms.get(combatId);
  if (!room) return null;
  room.participants = room.participants.filter(p => p.id !== jid);
  room.turnQueue = room.turnQueue.filter(t => t.participantId !== jid);
  if (room.currentTurnIndex >= room.turnQueue.length) room.currentTurnIndex = 0;
  if (room.participants.filter(p => p.team === 'players').length === 0 ||
      room.participants.filter(p => p.team === 'enemies').length === 0) {
    room.status = 'finished';
  }
  setRoom(room);
  await saveToSupabase(room);
  return room;
}

async function finishRoom(combatId) {
  const room = rooms.get(combatId);
  if (!room) return;
  room.status = 'finished';
  setRoom(room);
  await saveToSupabase(room);
}

async function expireRoom(combatId) {
  const room = rooms.get(combatId);
  if (!room) return;
  room.status = 'finished';
  setRoom(room);
  deleteFromSupabase(combatId);
}

function getActiveRooms() {
  const result = [];
  for (const room of rooms.values()) {
    if (room.status === 'active') result.push(room);
  }
  return result;
}

async function loadActiveCombats() {
  if (loaded) return;
  loaded = true;
  try {
    const { data, error } = await supabase
      .from('bot_auth_state')
      .select('data')
      .eq('session_id', SESSION_ID);

    if (error) throw error;
    if (!data) return;

    for (const row of data) {
      const room = row.data;
      if (room && room.status === 'active') {
        setRoom(room);
      }
    }
    console.log(`combatStateManager: ${getActiveRooms().length} salas activas cargadas desde Supabase`);
  } catch (err) {
    console.error('combatStateManager: error cargando combates activos', err.message);
  }
}

module.exports = {
  getRoom,
  getRoomByGroup,
  createRoom,
  createCombatRoom,
  addParticipant,
  updateRoom,
  removeParticipant,
  finishRoom,
  expireRoom,
  getActiveRooms,
  loadActiveCombats,
  makeBaseParticipant,
  makeEnemyParticipant,
  deleteRoom,
};
