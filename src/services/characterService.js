// @ts-nocheck
const { supabase } = require("../database/supabase");
const { filterExisting } = require("../database/columnRegistry");
const { invalidateUserCache, charactersCacheKey, safeSingleOrNull, cache, TTLS } = require("../utils/safeQuery");
/**
 * @constant {
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  RACES,
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  FREE_POINTS_AT_CREATION,
  calculateLevel,
  xpForNextLevel,
  RANGOS,
}
 * @type {any}
 */
const {
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  RACES,
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  FREE_POINTS_AT_CREATION,
  calculateLevel,
  xpForNextLevel,
  RANGOS,
} = require("../config/characterConfig");
const { getClase } = require("../data/clases");
const { sanitizeName, ensureUserProfile } = require("./userService");

/**
 * @param characterName
 * @returns
 */
function getCharacterSlug(characterName) {
  return sanitizeName(characterName).toLowerCase();
}

/**
 * @param [stats]
 * @returns
 */
function normalizeStats(stats = {}) {
  /**
   * @constant base
   * @type {object}
   */
  const base = { ...DEFAULT_CHARACTER_STATS };
  for (const key of Object.keys(base)) {
    if (typeof stats[key] === "number" && !Number.isNaN(stats[key])) {
      base[key] = Math.max(0, Math.floor(stats[key]));
    }
  }
  return base;
}

/**
 * @param character
 * @returns
 */
function normalizeCharacterRecord(character) {
  if (!character || typeof character !== "object") return character;

  /**
   * @constant normalized
   * @type {object}
   */
  const normalized = { ...character };
  normalized.name = String(normalized.name || "").trim();
  normalized.slug = getCharacterSlug(normalized.slug || normalized.name);
  normalized.raza = normalized.raza || "humano";
  normalized.clase = normalized.clase || "civil";
  normalized.rango = RANGOS.includes(normalized.rango) ? normalized.rango : "F";
  normalized.nivel = Math.max(LEVEL_INITIAL, Number(normalized.nivel) || LEVEL_INITIAL);
  normalized.xp = Math.max(0, Number(normalized.xp) || 0);
  normalized.xp_total = Math.max(0, Number(normalized.xp_total) || 0);

  normalized.stats = normalizeStats(normalized.stats || {});

  if (normalized.hp_actual == null || Number.isNaN(Number(normalized.hp_actual))) {
    normalized.hp_actual = (normalized.stats.hp || 1) * 2;
  } else {
    normalized.hp_actual = Math.max(0, Math.floor(Number(normalized.hp_actual)));
  }

  normalized.slots = {
    ...DEFAULT_CHARACTER_SLOTS,
    ...(normalized.slots || {}),
  };

  if (normalized.description !== undefined && !String(normalized.slots.descripcion || "").trim()) {
    normalized.slots.descripcion = String(normalized.description).trim();
  }
  delete normalized.description;

  return normalized;
}

/**
 * @param {
  creatorId,
  creatorName,
  characterName,
  raza = "humano",
  clase = "civil",
  statDistribution = {},
  historia = "",
} - TODO: describe parameter "{
  creatorId,
  creatorName,
  characterName,
  raza = "humano",
  clase = "civil",
  statDistribution = {},
  historia = "",
}".
 * @param root0
 * @returns
 */
async function createCharacter({
  creatorId,
  creatorName,
  characterName,
  raza = "humano",
  clase = "civil",
  statDistribution = {},
  historia = "",
}) {
  await ensureUserProfile({
    creatorId,
    creatorName,
    registration: { source: "crear_pj", scope: "self", createdBy: creatorId },
  });

  /**
   * @constant slug
   */
  const slug = getCharacterSlug(characterName);
  const { count } = await supabase
    .from("characters")
    .select("*", { count: "exact", head: true })
    .eq("player_phone", creatorId);
  if (count >= 5) {
    throw new Error("Has alcanzado el máximo de 5 personajes por usuario.");
  }

  /**
   * @constant raceConfig
   */
  const raceConfig = RACES[raza];
  if (!raceConfig) throw new Error("Raza no válida.");

  /**
   * @constant claseConfig
   */
  const claseConfig = getClase(clase);
  if (!claseConfig) throw new Error("Clase no válida.");

  /**
   * @constant raceStats
   * @type {object}
   */
  const raceStats = { ...raceConfig.baseStats };
  /**
   * @constant totalRace
   */
  const totalRace = Object.values(raceStats).reduce((a, b) => a + b, 0);
  if (totalRace !== 50) {
    throw new Error(`La raza ${raceConfig.name} no tiene una distribucion de 50 puntos.`);
  }

  /**
   * @constant assignedPoints
   */
  const assignedPoints = Object.values(statDistribution).reduce((a, b) => a + (Number(b) || 0), 0);
  if (assignedPoints !== FREE_POINTS_AT_CREATION) {
    throw new Error(`Debes distribuir exactamente ${FREE_POINTS_AT_CREATION} puntos libres.`);
  }

  /**
   * @constant finalStats
   * @type {object}
   */
  const finalStats = { ...DEFAULT_CHARACTER_STATS };
  for (const key of Object.keys(LEVELABLE_STATS)) {
    /**
     * @constant raceVal
     */
    const raceVal = raceStats[key] || 0;
    /**
     * @constant freeVal
     */
    const freeVal = Math.max(0, Math.min(Number(statDistribution[key]) || 0, 100));
    finalStats[key] = Math.max(0, Math.min(raceVal + freeVal, 100));
  }

  /**
   * @constant nivel
   */
  const nivel = calculateLevel(finalStats);

  /**
   * @constant isActive
   */
  const isActive = count === 0;

  /**
   * @constant record
   */
  const record = filterExisting("characters", {
    player_phone: creatorId,
    name: characterName,
    slug,
    raza,
    clase,
    rango: "F",
    nivel,
    xp: 0,
    xp_total: 0,
    is_active: isActive,
    hp_actual: finalStats.hp * 2,
    stats: finalStats,
    slots: { ...DEFAULT_CHARACTER_SLOTS, historia, habilidades: [] },
  });
  const { data, error } = await supabase.from("characters").insert(record).select().single();

  if (error) {
    if (error.code === "23505") throw new Error("Ya existe un personaje con ese nombre.");
    throw new Error("Error guardando el personaje: " + error.message);
  }

  /**
   * @constant normalized
   */
  const normalized = normalizeCharacterRecord(data);
  normalized.active = data.is_active;

  invalidateUserCache(creatorId);

  return normalized;
}

/**
 * @param { creatorId, bypassCache = false }
 * @param root0
 * @returns
 */
async function listCharacters({ creatorId, bypassCache = false }) {
  /**
   * @constant cacheKey
   */
  const cacheKey = charactersCacheKey(creatorId);
  if (!bypassCache) {
    /**
     * @constant cached
     */
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("player_phone", creatorId)
    .order("name", { ascending: true });

  if (error || !data) return [];

  /**
   * @constant result
   */
  const result = data.map((row) => {
    /**
     * @constant normalized
     */
    const normalized = normalizeCharacterRecord(row);
    normalized.active = row.is_active;
    return normalized;
  });

  cache.set(cacheKey, result, TTLS.memoryContext);
  return result;
}

/**
 * @param { creatorId, bypassCache = false }
 * @param root0
 * @returns
 */
async function getActiveCharacter({ creatorId, bypassCache = false }) {
  /**
   * @constant cacheKey
   */
  const cacheKey = `activeCharacter:${creatorId}`;
  if (!bypassCache) {
    /**
     * @constant cached
     */
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("player_phone", creatorId)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  /**
   * @constant normalized
   */
  const normalized = normalizeCharacterRecord(data);
  normalized.active = true;

  cache.set(cacheKey, normalized, TTLS.memoryContext);
  return normalized;
}

/**
 * @param {
  targetCreatorId,
  _targetCreatorName,
  characterName,
  requesterId,
  requesterIsAdmin = false,
}
 * @param root0
 * @returns
 */
async function setActiveCharacter({
  targetCreatorId,
  _targetCreatorName,
  characterName,
  requesterId,
  requesterIsAdmin = false,
}) {
  if (requesterId !== targetCreatorId && !requesterIsAdmin) {
    throw new Error("Solo el creador o un admin pueden hacer switch.");
  }

  /**
   * @constant slug
   */
  const slug = getCharacterSlug(characterName);
  const { data: character, error } = await supabase
    .from("characters")
    .select("id")
    .eq("player_phone", targetCreatorId)
    .eq("slug", slug)
    .single();

  if (error || !character) throw new Error("No existe ese personaje.");

  /**
   * @constant deactivatePayload
   */
  const deactivatePayload = filterExisting("characters", { is_active: false, updated_at: new Date().toISOString() });
  const { error: updateError } = await supabase
    .from("characters")
    .update(deactivatePayload)
    .eq("player_phone", targetCreatorId)
    .neq("slug", slug);

  if (updateError) throw new Error("Error desactivando personajes: " + updateError.message);

  /**
   * @constant activatePayload
   */
  const activatePayload = filterExisting("characters", { is_active: true, updated_at: new Date().toISOString() });
  const { data: activated, error: activateError } = await supabase
    .from("characters")
    .update(activatePayload)
    .eq("player_phone", targetCreatorId)
    .eq("slug", slug)
    .select()
    .single();

  if (activateError || !activated) {
    throw new Error("Error activando personaje: " + (activateError?.message || "No encontrado"));
  }

  /**
   * @constant normalized
   */
  const normalized = normalizeCharacterRecord(activated);
  normalized.active = true;

  invalidateUserCache(targetCreatorId);

  return normalized;
}

/**
 * @param { creatorId, characterName }
 * @param root0
 * @returns
 */
async function deleteCharacter({ creatorId, characterName }) {
  /**
   * @constant slug
   */
  const slug = getCharacterSlug(characterName);

  /**
   * @constant character
   */
  const character = await safeSingleOrNull(
    supabase.from("characters").select("*").eq("player_phone", creatorId).eq("slug", slug),
  );

  if (!character) throw new Error("No existe el personaje.");
  const { error: deleteError } = await supabase.from("characters").delete().eq("id", character.id);
  if (deleteError) throw new Error("Error eliminando personaje: " + deleteError.message);

  if (character.is_active) {
    const { data: remaining } = await supabase
      .from("characters")
      .select("id")
      .eq("player_phone", creatorId)
      .order("name", { ascending: true })
      .limit(1);

    if (remaining && remaining.length > 0) {
      await supabase
        .from("characters")
        .update(filterExisting("characters", { is_active: true }))
        .eq("id", remaining[0].id);
    }
  }

  invalidateUserCache(creatorId);
  return true;
}

/**
 * @param { creatorId }
 * @param root0
 * @returns
 */
async function getCharacterNames({ creatorId }) {
  /**
   * @constant characters
   */
  const characters = await listCharacters({ creatorId, bypassCache: true });
  return new Set(characters.map((c) => c.name));
}

/**
 * @param { characterName, newName, creatorId, requesterId, requesterIsAdmin = false }
 * @param root0
 * @returns
 */
async function renameCharacter({ characterName, newName, creatorId, requesterId, requesterIsAdmin = false }) {
  if (requesterId !== creatorId && !requesterIsAdmin) {
    throw new Error("Solo el creador o un admin pueden renombrar personajes.");
  }

  /**
   * @constant slug
   */
  const slug = getCharacterSlug(characterName);
  /**
   * @constant newSlug
   */
  const newSlug = getCharacterSlug(newName);

  /**
   * @constant existing
   */
  const existing = await safeSingleOrNull(
    supabase.from("characters").select("id").eq("player_phone", creatorId).eq("slug", newSlug),
  );
  if (existing) throw new Error("Ya existe un personaje con ese nombre.");

  /**
   * @constant renamePayload
   */
  const renamePayload = filterExisting("characters", {
    name: newName,
    slug: newSlug,
    updated_at: new Date().toISOString(),
  });
  const { data: updated, error } = await supabase
    .from("characters")
    .update(renamePayload)
    .eq("player_phone", creatorId)
    .eq("slug", slug)
    .select()
    .maybeSingle();

  if (error || !updated) throw new Error(error?.message || "No se encontró el personaje para renombrar.");

  /**
   * @constant normalized
   */
  const normalized = normalizeCharacterRecord(updated);
  normalized.active = updated.is_active;

  invalidateUserCache(creatorId);
  return normalized;
}

/**
 * @param { characterName, creatorId, slots, requesterId, requesterIsAdmin = false }
 * @param root0
 * @returns
 */
async function updateCharacterSlots({ characterName, creatorId, slots, requesterId, requesterIsAdmin = false }) {
  if (requesterId !== creatorId && !requesterIsAdmin) {
    throw new Error("Solo el creador o un admin pueden editar personajes.");
  }

  /**
   * @constant slug
   */
  const slug = getCharacterSlug(characterName);

  /**
   * @constant current
   */
  const current = await safeSingleOrNull(
    supabase.from("characters").select("slots").eq("player_phone", creatorId).eq("slug", slug),
  );
  if (!current) throw new Error("No existe el personaje.");

  /**
   * @constant mergedSlots
   * @type {object}
   */
  const mergedSlots = { ...DEFAULT_CHARACTER_SLOTS, ...(current.slots || {}), ...slots };

  /**
   * @constant slotsPayload
   */
  const slotsPayload = filterExisting("characters", { slots: mergedSlots, updated_at: new Date().toISOString() });
  const { data: updated, error } = await supabase
    .from("characters")
    .update(slotsPayload)
    .eq("player_phone", creatorId)
    .eq("slug", slug)
    .select()
    .maybeSingle();

  if (error || !updated) throw new Error(error?.message || "Error actualizando los slots del personaje.");

  /**
   * @constant normalized
   */
  const normalized = normalizeCharacterRecord(updated);
  normalized.active = updated.is_active;

  invalidateUserCache(creatorId);
  return normalized;
}

// =========================
// COMBAT-RELATED
// =========================

/**
 * @param { creatorId, maxHp }
 * @param root0
 * @returns
 */
async function getCombatStats({ creatorId, maxHp }) {
  /**
   * @constant character
   */
  const character = await getActiveCharacter({ creatorId });
  if (!character) return null;

  /**
   * @constant baseMaxHp
   */
  const baseMaxHp = (character.stats?.hp || 1) * 2;
  /**
   * @constant combatStats
   * @type {object}
   */
  const combatStats = { hp: character.hp_actual, hp_max: maxHp ?? baseMaxHp };
  for (const key of Object.keys(LEVELABLE_STATS)) {
    /**
     * @constant baseVal
     */
    const baseVal = Number(character.stats[key]) || 0;
    combatStats[key] = Math.max(0, Math.round(baseVal));
  }

  return combatStats;
}

/**
 * @param { creatorId, characterName, cantidad }
 * @param root0
 * @returns
 */
async function addXp({ creatorId, characterName, cantidad }) {
  /**
   * @constant slug
   */
  const slug = getCharacterSlug(characterName);
  /**
   * @constant safeXp
   */
  const safeXp = Math.max(1, Math.floor(Number(cantidad) || 0));

  /**
   * @constant character
   */
  const character = await safeSingleOrNull(
    supabase.from("characters").select("xp, xp_total").eq("player_phone", creatorId).eq("slug", slug),
  );
  if (!character) throw new Error("No existe el personaje.");

  /**
   * @constant newXp
   */
  const newXp = (Number(character.xp) || 0) + safeXp;
  /**
   * @constant newXpTotal
   */
  const newXpTotal = (Number(character.xp_total) || 0) + safeXp;

  /**
   * @constant updatePayload
   */
  const updatePayload = filterExisting("characters", {
    xp: newXp,
    xp_total: newXpTotal,
    updated_at: new Date().toISOString(),
  });
  const { data, error } = await supabase
    .from("characters")
    .update(updatePayload)
    .eq("player_phone", creatorId)
    .eq("slug", slug)
    .select()
    .maybeSingle();

  if (error || !data) throw new Error("Error actualizando XP.");

  invalidateUserCache(creatorId);
  return { xp: newXp, xp_total: newXpTotal };
}

/**
 * @param { creatorId, characterName, hp, maxHp }
 * @param root0
 * @returns
 */
async function setHp({ creatorId, characterName, hp, maxHp }) {
  /**
   * @constant slug
   */
  const slug = getCharacterSlug(characterName);

  /**
   * @constant character
   */
  const character = await safeSingleOrNull(
    supabase.from("characters").select("stats").eq("player_phone", creatorId).eq("slug", slug),
  );
  /**
   * @constant baseMaxHp
   */
  const baseMaxHp = (character?.stats?.hp ?? 1) * 2;
  /**
   * @constant maxHpOverride
   */
  const maxHpOverride = maxHp ?? baseMaxHp;
  /**
   * @constant safeHp
   */
  const safeHp = Math.max(0, Math.min(maxHpOverride, Math.floor(Number(hp) || 0)));

  /**
   * @constant updatePayload
   */
  const updatePayload = filterExisting("characters", { hp_actual: safeHp, updated_at: new Date().toISOString() });
  const { data, error } = await supabase
    .from("characters")
    .update(updatePayload)
    .eq("player_phone", creatorId)
    .eq("slug", slug)
    .select()
    .maybeSingle();

  if (error || !data) throw new Error("Error actualizando HP.");

  invalidateUserCache(creatorId);
  return normalizeCharacterRecord(data);
}

/**
 * @param { creatorId, characterName, maxHp }
 * @param root0
 * @returns
 */
async function restaurarHp({ creatorId, characterName, maxHp }) {
  /**
   * @constant slug
   */
  const slug = getCharacterSlug(characterName);
  /**
   * @constant character
   */
  const character = await safeSingleOrNull(
    supabase.from("characters").select("stats").eq("player_phone", creatorId).eq("slug", slug),
  );
  /**
   * @constant baseMaxHp
   */
  const baseMaxHp = (character?.stats?.hp ?? 1) * 2;
  /**
   * @constant maxHpOverride
   */
  const maxHpOverride = maxHp ?? baseMaxHp;
  return setHp({ creatorId, characterName, hp: maxHpOverride, maxHp: maxHpOverride });
}

/**
 * @param { creatorId, characterName, stat }
 * @param root0
 * @returns
 */
async function distribuirPunto({ creatorId, characterName, stat }) {
  if (!LEVELABLE_STATS[stat]) throw new Error(`La estadística '${stat}' no es válida.`);

  /**
   * @constant slug
   */
  const slug = getCharacterSlug(characterName);
  /**
   * @constant character
   */
  const character = await safeSingleOrNull(
    supabase.from("characters").select("*").eq("player_phone", creatorId).eq("slug", slug),
  );
  if (!character) throw new Error("No existe el personaje.");

  /**
   * @constant stats
   * @type {object}
   */
  const stats = { ...(character.stats || {}) };

  if (LEVELABLE_STATS[stat] && stats[stat] >= LEVELABLE_STATS[stat].max) {
    throw new Error(`${LEVELABLE_STATS[stat].name} ya está al máximo (${LEVELABLE_STATS[stat].max}).`);
  }

  /**
   * @constant currentXp
   */
  const currentXp = Number(character.xp) || 0;
  /**
   * @constant currentLevel
   */
  const currentLevel = Number(character.nivel) || LEVEL_INITIAL;
  /**
   * @constant neededXp
   */
  const neededXp = xpForNextLevel(currentLevel);

  if (currentXp < neededXp) {
    throw new Error(`Necesitas ${neededXp} XP para subir de nivel. Tienes ${currentXp}.`);
  }

  stats[stat] = Math.min((stats[stat] || 0) + 1, LEVELABLE_STATS[stat].max);

  /**
   * @constant newLevel
   */
  const newLevel = calculateLevel(stats);
  /**
   * @constant remainingXp
   */
  const remainingXp = currentXp - neededXp;

  /**
   * @constant updatePayload
   */
  const updatePayload = filterExisting("characters", {
    stats,
    nivel: newLevel,
    xp: remainingXp,
    updated_at: new Date().toISOString(),
  });
  const { data, error } = await supabase
    .from("characters")
    .update(updatePayload)
    .eq("id", character.id)
    .select()
    .maybeSingle();

  if (error || !data) throw new Error("Error distribuyendo punto.");

  invalidateUserCache(creatorId);
  return normalizeCharacterRecord(data);
}

/**
 * @param { creatorId, characterName }
 * @param root0
 * @returns
 */
async function getXpInfo({ creatorId, characterName }) {
  /**
   * @constant slug
   */
  const slug = getCharacterSlug(characterName);
  /**
   * @constant character
   */
  const character = await safeSingleOrNull(
    supabase.from("characters").select("nivel, xp, xp_total").eq("player_phone", creatorId).eq("slug", slug),
  );

  if (!character) throw new Error("No existe el personaje.");

  /**
   * @constant currentLevel
   */
  const currentLevel = Number(character.nivel) || LEVEL_INITIAL;
  /**
   * @constant currentXp
   */
  const currentXp = Number(character.xp) || 0;
  /**
   * @constant neededXp
   */
  const neededXp = xpForNextLevel(currentLevel);

  return {
    nivel: currentLevel,
    xp: currentXp,
    xp_total: Number(character.xp_total) || 0,
    xp_para_siguiente: neededXp,
    progreso: neededXp > 0 ? Math.min(1, currentXp / neededXp) : 0,
  };
}

module.exports = {
  createCharacter,
  listCharacters,
  getActiveCharacter,
  setActiveCharacter,
  deleteCharacter,
  getCharacterNames,
  renameCharacter,
  updateCharacterSlots,
  getCombatStats,
  addXp,
  setHp,
  restaurarHp,
  distribuirPunto,
  getXpInfo,
};
