// @ts-nocheck
const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { getItem } = require("../../data/items");
const { LEVELABLE_STATS, LEVEL_MAX, LEVEL_INITIAL, xpForNextLevel, calculateLevel } = require("../../config/characterConfig");
const { invalidateUserCache, safeSingleOrNull } = require("../../utils/safeQuery");

/**
 * Agrega XP a un personaje, procesando posibles puntos de atributo ganados.
 * @param {string|number} characterId
 * @param {number} xpAmount
 * @returns {Promise<{newXp: number, xpTotal: number, pointsGained: number, totalPointsAvailable: number, currentLevel: number, leveledUp: boolean}>}
 */
async function addXpToCharacter(characterId, xpAmount) {
  const amount = Math.max(0, Number(xpAmount) || 0);
  if (amount === 0) {
    const char = await safeSingleOrNull(supabase.from("characters").select("id, nivel, xp, xp_total, stats").eq("id", characterId));
    const stats = char?.stats || {};
    return {
      newXp: Number(char?.xp) || 0,
      xpTotal: Number(char?.xp_total) || 0,
      pointsGained: 0,
      totalPointsAvailable: Number(stats.puntos_disponibles) || 0,
      currentLevel: Number(char?.nivel) || LEVEL_INITIAL,
      leveledUp: false,
    };
  }

  const { data: char, error } = await supabase
    .from("characters")
    .select("id, player_phone, nivel, xp, xp_total, stats")
    .eq("id", characterId)
    .maybeSingle();

  if (error || !char) {
    throw new Error(`Personaje ${characterId} no encontrado para otorgar XP.`);
  }

  let currentXp = (Number(char.xp) || 0) + amount;
  let xpTotal = (Number(char.xp_total) || 0) + amount;
  let currentLevel = Number(char.nivel) || LEVEL_INITIAL;
  const stats = { ...(char.stats || {}) };
  let pointsGained = 0;

  // Llenar barra de XP y otorgar puntos mientras alcance la XP requerida
  while (currentLevel < LEVEL_MAX) {
    const needed = xpForNextLevel(currentLevel);
    if (currentXp >= needed) {
      currentXp -= needed;
      pointsGained += 1;
      stats.puntos_disponibles = (Number(stats.puntos_disponibles) || 0) + 1;
    } else {
      break;
    }
  }

  const updatePayload = filterExisting("characters", {
    xp: currentXp,
    xp_total: xpTotal,
    stats,
    updated_at: new Date().toISOString(),
  });

  await supabase.from("characters").update(updatePayload).eq("id", characterId);
  if (char.player_phone) invalidateUserCache(char.player_phone);

  return {
    newXp: currentXp,
    xpTotal,
    pointsGained,
    totalPointsAvailable: Number(stats.puntos_disponibles) || 0,
    currentLevel,
    leveledUp: pointsGained > 0,
  };
}

/**
 * Normaliza claves o alias de stats a su nombre estándar de LEVELABLE_STATS.
 * @param {string} statInput
 * @returns {string|null}
 */
function normalizeStatKey(statInput) {
  const s = String(statInput || "").toLowerCase().trim();
  if (LEVELABLE_STATS[s]) return s;

  const aliases = {
    str: "fuerza",
    fue: "fuerza",
    fuerza: "fuerza",
    agi: "agilidad",
    agilidad: "agilidad",
    dex: "destreza",
    des: "destreza",
    destreza: "destreza",
    vit: "vitalidad",
    vitalidad: "vitalidad",
    res: "resistencia",
    resistencia: "resistencia",
    ful: "fulgor",
    fulgor: "fulgor",
    dful: "d_fulgor",
    dominio: "d_fulgor",
    d_fulgor: "d_fulgor",
    rful: "r_fulgor",
    r_fulgor: "r_fulgor",
    per: "percepcion",
    percepcion: "percepcion",
    percepción: "percepcion",
  };

  return aliases[s] || null;
}

/**
 * Asigna puntos de atributo disponibles a una estadística específica.
 * @param {object} options
 * @param {string|number} options.characterId
 * @param {string} options.creatorId
 * @param {string} options.stat - Stat deseada (fuerza, agilidad, destreza, vitalidad, etc.)
 * @param {number} [options.points=1] - Puntos a asignar
 * @returns {Promise<{character: object, stat: string, statName: string, pointsAssigned: number, newValue: number, newLevel: number, remainingPoints: number}>}
 */
async function allocateStatPoints({ characterId, creatorId, stat, points = 1 }) {
  const statKey = normalizeStatKey(stat);
  if (!statKey) {
    const validList = Object.keys(LEVELABLE_STATS).join(", ");
    throw new Error(`Estadística no válida: "${stat}". Opciones válidas: ${validList}`);
  }

  const numPoints = Math.max(1, Math.floor(Number(points) || 1));

  const { data: char, error } = await supabase
    .from("characters")
    .select("*")
    .eq("id", characterId)
    .maybeSingle();

  if (error || !char) {
    throw new Error("Personaje no encontrado.");
  }

  const stats = { ...(char.stats || {}) };
  const available = Number(stats.puntos_disponibles) || 0;

  if (available < numPoints) {
    throw new Error(`Puntos insuficientes. Tienes ${available} puntos disponibles (solicitados: ${numPoints}).`);
  }

  const currentVal = Number(stats[statKey]) || 0;
  const maxCap = LEVELABLE_STATS[statKey]?.max || 100;
  const newValue = Math.min(maxCap, currentVal + numPoints);
  const actualAssigned = newValue - currentVal;

  if (actualAssigned <= 0) {
    throw new Error(`La estadística "${LEVELABLE_STATS[statKey].name}" ya está en su nivel máximo (${maxCap}).`);
  }

  stats[statKey] = newValue;
  stats.puntos_disponibles = available - actualAssigned;

  const newLevel = calculateLevel(stats);

  const updatePayload = filterExisting("characters", {
    stats,
    nivel: newLevel,
    updated_at: new Date().toISOString(),
  });

  const { data: updated, error: updateErr } = await supabase
    .from("characters")
    .update(updatePayload)
    .eq("id", characterId)
    .select()
    .single();

  if (updateErr || !updated) {
    throw new Error("Error actualizando los puntos de atributo.");
  }

  invalidateUserCache(creatorId);

  return {
    character: updated,
    stat: statKey,
    statName: LEVELABLE_STATS[statKey].name,
    pointsAssigned: actualAssigned,
    newValue,
    newLevel,
    remainingPoints: stats.puntos_disponibles,
  };
}

module.exports = {
  addXpToCharacter,
  normalizeStatKey,
  allocateStatPoints,
};
