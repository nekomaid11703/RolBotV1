// @ts-nocheck
// Gestión de progresión de personajes: niveles, XP y habilidades equipables.

const { supabase } = require("../database/supabase");
const { filterExisting } = require("../database/columnRegistry");
const { invalidateUserCache, safeSingleOrNull } = require("../utils/safeQuery");
const {
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  LEVEL_MAX,
  XP_CURVE_BASE,
  XP_CURVE_EXPONENT,
  HP_MAX,
  xpForNextLevel,
  calculateLevel,
  maxSkillSlots,
  SKILL_SLOTS_BY_LEVEL,
} = require("../config/characterConfig");
const { sanitizarHabilidadesArray, habilidadesDisponibles } = require("../utils/characterSkillUtils");
const { getHabilidad } = require("../data/habilidades");

const skillLocks = new Map();

/**
 *
 * @param slug
 * @param fn
 */
async function withSkillLock(slug, fn) {
  while (skillLocks.get(slug)) {
    await new Promise((r) => {
      setTimeout(r, 10);
    });
  }
  skillLocks.set(slug, true);
  try {
    return await fn();
  } finally {
    skillLocks.delete(slug);
  }
}

/**
 *
 * @param characterName
 */
function getCharacterSlug(characterName) {
  const { sanitizeName } = require("./userService");
  return sanitizeName(characterName).toLowerCase();
}

/**
 *
 * @param root0
 */
async function equiparHabilidad({ creatorId, characterName, habilidadId }) {
  const slug = getCharacterSlug(characterName);

  const habilidad = getHabilidad(habilidadId);
  if (!habilidad) throw new Error(`La habilidad "${habilidadId}" no existe en el catálogo.`);

  return withSkillLock(slug, async () => {
    const character = await safeSingleOrNull(
      supabase.from("characters").select("*").eq("player_phone", creatorId).eq("slug", slug),
    );
    if (!character) throw new Error("No existe el personaje.");

    const habilidades = Array.isArray(character.slots?.habilidades) ? [...character.slots.habilidades] : [];

    if (habilidades.includes(habilidadId)) {
      throw new Error(`"${habilidad.name}" ya está equipada.`);
    }

    const disponibles = habilidadesDisponibles(character.clase, character.nivel);
    if (!disponibles.find((h) => h.id === habilidadId)) {
      throw new Error(`"${habilidad.name}" no está disponible (clase o nivel insuficiente).`);
    }

    const maxSlots = maxSkillSlots(character.nivel);
    if (habilidades.length >= maxSlots) {
      throw new Error(`No tienes espacios disponibles (máx ${maxSlots}). Desequipa una primero.`);
    }

    habilidades.push(habilidadId);

    const mergedSlots = { ...(character.slots || {}), habilidades };
    const payload = filterExisting("characters", { slots: mergedSlots, updated_at: new Date().toISOString() });

    const { data: updated, error } = await supabase
      .from("characters")
      .update(payload)
      .eq("player_phone", creatorId)
      .eq("slug", slug)
      .select()
      .maybeSingle();

    if (error || !updated) throw new Error("Error equipando habilidad: " + (error?.message || "sin datos"));

    invalidateUserCache(creatorId);
    return { character: updated, habilidad: habilidad.name };
  });
}

/**
 *
 * @param root0
 */
async function desequiparHabilidad({ creatorId, characterName, habilidadId }) {
  const slug = getCharacterSlug(characterName);

  return withSkillLock(slug, async () => {
    const character = await safeSingleOrNull(
      supabase.from("characters").select("*").eq("player_phone", creatorId).eq("slug", slug),
    );
    if (!character) throw new Error("No existe el personaje.");

    const habilidades = Array.isArray(character.slots?.habilidades) ? [...character.slots.habilidades] : [];

    if (!habilidades.includes(habilidadId)) {
      throw new Error("Esa habilidad no está equipada.");
    }

    const actualizadas = habilidades.filter((h) => h !== habilidadId);
    const mergedSlots = { ...(character.slots || {}), habilidades: actualizadas };
    const payload = filterExisting("characters", { slots: mergedSlots, updated_at: new Date().toISOString() });

    const { data: updated, error } = await supabase
      .from("characters")
      .update(payload)
      .eq("player_phone", creatorId)
      .eq("slug", slug)
      .select()
      .maybeSingle();

    if (error || !updated) throw new Error("Error desequipando habilidad.");

    invalidateUserCache(creatorId);
    return updated;
  });
}

/**
 *
 * @param root0
 */
async function listarHabilidadesEquipables({ creatorId, characterName }) {
  const character = await safeSingleOrNull(
    supabase.from("characters").select("*").eq("player_phone", creatorId).eq("slug", getCharacterSlug(characterName)),
  );
  if (!character) throw new Error("No existe el personaje.");

  const disponibles = habilidadesDisponibles(character.clase, character.nivel);
  const equipadas = Array.isArray(character.slots?.habilidades) ? character.slots.habilidades : [];
  const maxSlots = maxSkillSlots(character.nivel);

  return {
    equipadas: disponibles.filter((h) => equipadas.includes(h.id)),
    disponibles: disponibles.filter((h) => !equipadas.includes(h.id)),
    espaciosLibres: maxSlots - equipadas.length,
    maxSlots,
  };
}

/**
 *
 * @param root0
 */
async function ganarXP({ creatorId, characterName, cantidad }) {
  const slug = getCharacterSlug(characterName);
  const safeXp = Math.max(0, Math.floor(Number(cantidad) || 0));
  if (safeXp === 0) throw new Error("La cantidad debe ser mayor a 0.");

  return withSkillLock(slug, async () => {
    const character = await safeSingleOrNull(
      supabase.from("characters").select("*").eq("player_phone", creatorId).eq("slug", slug),
    );
    if (!character) throw new Error("No existe el personaje.");

    let nivel = Number(character.nivel) || LEVEL_INITIAL;
    let xp = (Number(character.xp) || 0) + safeXp;
    const xpTotal = (Number(character.xp_total) || 0) + safeXp;
    let subioDeNivel = false;
    let nivelesSubidos = 0;

    while (nivel < LEVEL_MAX) {
      const needed = xpForNextLevel(nivel);
      if (xp >= needed) {
        xp -= needed;
        nivel++;
        subioDeNivel = true;
        nivelesSubidos++;
      } else break;
    }

    if (nivel > LEVEL_MAX) nivel = LEVEL_MAX;

    const updatePayload = filterExisting("characters", {
      xp,
      xp_total: xpTotal,
      nivel,
      updated_at: new Date().toISOString(),
    });

    const { data: updated, error } = await supabase
      .from("characters")
      .update(updatePayload)
      .eq("player_phone", creatorId)
      .eq("slug", slug)
      .select()
      .maybeSingle();

    if (error || !updated) throw new Error("Error actualizando XP.");

    invalidateUserCache(creatorId);

    return {
      character: updated,
      xpGanado: safeXp,
      subioDeNivel,
      nivelesSubidos,
      xpRestante: xp,
      nivelActual: nivel,
    };
  });
}

module.exports = {
  equiparHabilidad,
  desequiparHabilidad,
  listarHabilidadesEquipables,
  ganarXP,
};
