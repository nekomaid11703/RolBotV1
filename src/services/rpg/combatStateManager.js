// @ts-nocheck
/**
 * combatStateManager.js — Gestión de Estado de Salas de Combate
 *
 * Administra las salas de combate en memoria y Supabase.
 * Los participantes usan la nueva ficha táctica:
 *   - 6 stats (fuerza, velocidad, reflejos, res_fisica, res_magica, dominio_magico)
 *   - Slots: inventario, efectos_activos, habilidades, xp, nivel
 */

const crypto = require("crypto");
const { supabase } = require("../../database/supabase");
const { getEnemy } = require("./enemies");
const { logSystem, logError } = require("../loggerService");
const { RPG_CONFIG } = require("../../config/rpg.config");

const SESSION_ID = "combat";
const rooms = new Map();
const groupIndex = new Map();
let lastLoadTime = 0;
const LOAD_TTL = 60000;

function uuid() {
  return "cmb_" + crypto.randomBytes(6).toString("hex");
}

// ═══════════════════════════════════════════════════════════════════════
//  CREACIÓN DE PARTICIPANTES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Crea un participante jugador con la ficha táctica D20.
 *
 * @param {string} jid - WhatsApp JID del jugador
 * @param {string} name - Nombre del personaje
 * @param {string} team - Equipo ('players' o 'enemies')
 * @param {object} charData - Datos del personaje (stats, nivel, xp, habilidades, inventario)
 * @param {string|null} bando - Bando en PvP ('challenger' | 'target' | null)
 * @returns {object} Participante formateado
 */
function makeParticipant(jid, name, team, charData = {}, bando = null) {
  const stats = charData.stats || {};
  const defaults = RPG_CONFIG.defaultStats;

  return {
    id: jid,
    name: name || jid.split("@")[0],
    team,
    bando,

    // ── HP ──────────────────────────────────────────────────────────
    hp: stats.vida || 100,
    maxHp: stats.vida || 100,

    // ── 6 Estadísticas (1-20) ──────────────────────────────────────
    fuerza: clampStat(stats.fuerza || defaults.fuerza),
    velocidad: clampStat(stats.velocidad || defaults.velocidad),
    reflejos: clampStat(stats.reflejos || defaults.reflejos),
    resistencia_fisica: clampStat(stats.resistencia_fisica || defaults.resistencia_fisica),
    resistencia_magica: clampStat(stats.resistencia_magica || defaults.resistencia_magica),
    dominio_magico: clampStat(stats.dominio_magico || defaults.dominio_magico),

    // ── Slots de Ficha ─────────────────────────────────────────────
    inventario: charData.inventario || [],
    efectos_activos: [],
    habilidades: charData.habilidades || [],
    xp: charData.xp || 0,
    nivel: charData.nivel || 1,

    // ── Estado de combate ──────────────────────────────────────────
    ko: false,
    stunned: false,
    consecutiveSkips: 0,
    lastActionAt: Date.now(),
  };
}

/**
 * Crea un participante enemigo (NPC) con la ficha D20.
 *
 * @param {object} enemy - Datos del enemigo (de enemies.js)
 * @param {number} index - Índice para enemigos duplicados
 * @returns {object} Participante NPC formateado
 */
function makeEnemyParticipant(enemy, index) {
  const eId = `enemy:${enemy.id}_${index}`;
  const stats = enemy.stats || {};

  return {
    id: eId,
    name: enemy.name + (index > 0 ? ` ${index + 1}` : ""),
    team: "enemies",

    hp: enemy.hp || 40,
    maxHp: enemy.hp || 40,

    fuerza: clampStat(stats.fuerza || 3),
    velocidad: clampStat(stats.velocidad || 3),
    reflejos: clampStat(stats.reflejos || 3),
    resistencia_fisica: clampStat(stats.resistencia_fisica || 3),
    resistencia_magica: clampStat(stats.resistencia_magica || 2),
    dominio_magico: clampStat(stats.dominio_magico || 1),

    inventario: [],
    efectos_activos: [],
    habilidades: enemy.habilidades || [],
    xp: 0,
    nivel: enemy.level || 1,

    ko: false,
    stunned: false,
    consecutiveSkips: 0,
    lastActionAt: Date.now(),

    // Recompensas (para el cálculo al final del combate)
    reward: enemy.reward || null,
  };
}

/**
 * Limita una estadística al rango [1, 20].
 * @param {number} value
 * @returns {number}
 */
function clampStat(value) {
  return Math.max(RPG_CONFIG.stats.min, Math.min(RPG_CONFIG.stats.max, value));
}

// ═══════════════════════════════════════════════════════════════════════
//  PERSISTENCIA (Supabase)
// ═══════════════════════════════════════════════════════════════════════

async function saveToSupabase(room) {
  try {
    const data = JSON.parse(JSON.stringify(room));
    await supabase.from("bot_auth_state").upsert({
      session_id: SESSION_ID,
      id: room.id,
      data,
    });
  } catch (err) {
    logError({ source: "combatStateManager", error: err });
  }
}

async function deleteFromSupabase(combatId) {
  try {
    await supabase.from("bot_auth_state").delete().eq("session_id", SESSION_ID).eq("id", combatId);
  } catch (err) {
    logError({ source: "combatStateManager", error: err });
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  GESTIÓN DE SALAS (In-Memory)
// ═══════════════════════════════════════════════════════════════════════

function getRoom(combatId) {
  return rooms.get(combatId) || null;
}

function getRoomByGroup(groupId) {
  const combatId = groupIndex.get(groupId);
  if (!combatId) return null;
  const room = rooms.get(combatId);
  if (!room || room.status !== "active") {
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

// ═══════════════════════════════════════════════════════════════════════
//  CREACIÓN Y GESTIÓN DE COMBATES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Crea una sala de combate con participantes ya construidos.
 */
function createRoom(groupId, participants, options = {}) {
  const room = {
    id: uuid(),
    groupId,
    status: "active",
    round: 1,
    turnCount: 0,
    currentTurnIndex: 0,
    lastActionAt: Date.now(),
    turnTimeoutMs: RPG_CONFIG.combatRoom.turnTimeoutMs,
    participants: [...participants],
    turnQueue: [],
    createdAt: Date.now(),
    startedVia: options.startedVia || "pve",
    challengerId: options.challengerId || null,
    targetId: options.targetId || null,
  };

  // Calcular orden de turnos por velocidad (mayor primero)
  room.turnQueue = participants
    .map((p, i) => ({ participantId: p.id, order: i, vel: p.velocidad }))
    .sort((a, b) => b.vel - a.vel);

  setRoom(room);
  return room;
}

/**
 * Crea una sala de combate PvE completa (jugador vs enemigos).
 */
async function createCombatRoom(groupId, initiatorJid, character, enemyIds, quantity = 1) {
  const participants = [];

  // Agregar jugador
  participants.push(makeParticipant(initiatorJid, character.name, "players", character));

  // Agregar enemigos
  if (enemyIds && enemyIds.length > 0) {
    for (const eid of enemyIds) {
      const enemy = getEnemy(eid);
      if (enemy) {
        for (let i = 0; i < Math.min(quantity, RPG_CONFIG.combatRoom.maxParticipantsPerTeam); i++) {
          participants.push(makeEnemyParticipant(enemy, i));
        }
      }
    }
  }

  const room = createRoom(groupId, participants, { startedVia: "pve" });
  await saveToSupabase(room);
  return room;
}

/**
 * Agrega un participante a un combate activo.
 */
async function addParticipant(room, jid, name, charData = {}) {
  if (room.participants.some((p) => p.id === jid)) return false;
  const p = makeParticipant(jid, name, "players", charData);
  room.participants.push(p);
  room.turnQueue.push({ participantId: jid, order: room.turnQueue.length, vel: p.velocidad });
  room.turnQueue.sort((a, b) => b.vel - a.vel);
  await saveToSupabase(room);
  return true;
}

/**
 * Actualiza una sala de combate y persiste.
 */
async function updateRoom(combatId, patch) {
  const room = rooms.get(combatId);
  if (!room) return null;
  Object.assign(room, patch);
  room.lastActionAt = Date.now();
  setRoom(room);
  await saveToSupabase(room);
  return room;
}

/**
 * Elimina un participante del combate.
 */
async function removeParticipant(combatId, jid) {
  const room = rooms.get(combatId);
  if (!room) return null;
  room.participants = room.participants.filter((p) => p.id !== jid);
  room.turnQueue = room.turnQueue.filter((t) => t.participantId !== jid);
  if (room.currentTurnIndex >= room.turnQueue.length) room.currentTurnIndex = 0;
  if (
    room.participants.filter((p) => p.team === "players").length === 0 ||
    room.participants.filter((p) => p.team === "enemies").length === 0
  ) {
    room.status = "finished";
  }
  setRoom(room);
  await saveToSupabase(room);
  return room;
}

async function finishRoom(combatId) {
  const room = rooms.get(combatId);
  if (!room) return;
  room.status = "finished";
  setRoom(room);
  await saveToSupabase(room);
}

async function expireRoom(combatId) {
  const room = rooms.get(combatId);
  if (!room) return;
  room.status = "finished";
  setRoom(room);
  deleteFromSupabase(combatId);
}

function getActiveRooms() {
  const result = [];
  for (const room of rooms.values()) {
    if (room.status === "active") result.push(room);
  }
  return result;
}

async function loadActiveCombats(force = false) {
  const now = Date.now();
  if (!force && now - lastLoadTime < LOAD_TTL) return;
  lastLoadTime = now;
  try {
    const { data, error } = await supabase.from("bot_auth_state").select("data").eq("session_id", SESSION_ID);

    if (error) throw error;
    if (!data) return;

    for (const row of data) {
      const room = row.data;
      if (room && room.status === "active") {
        setRoom(room);
      }
    }
    logSystem(`combatStateManager: ${getActiveRooms().length} salas activas cargadas desde Supabase`);
  } catch (err) {
    logError({ source: "combatStateManager", error: err });
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════════

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
  makeParticipant,
  makeEnemyParticipant,
  deleteRoom,
  clampStat,
};
