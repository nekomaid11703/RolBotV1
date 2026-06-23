const { supabase } = require("../database/supabase");
const {
  CHARACTER_CATEGORIES,
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  MAX_CHARACTER_NAME_LENGTH,
  MAX_SLOT_SIZE,
  MAX_CHARACTERS_PER_USER,
} = require("../config/characterConfig");

const {
  sanitizeName,
  ensureUserProfile,
} = require("./userService");

function getCharacterSlug(characterName) {
  return sanitizeName(characterName).toLowerCase();
}

function normalizeCategory(category, isAdmin = false) {
  const normalized = String(category || "F").toUpperCase().trim();
  if (!CHARACTER_CATEGORIES.includes(normalized)) return "F";
  if (!isAdmin && normalized !== "F") return "F";
  return normalized;
}

function normalizeStats(stats = {}) {
  return { ...DEFAULT_CHARACTER_STATS, ...(stats || {}) };
}

function normalizeCharacterRecord(character) {
  if (!character || typeof character !== "object") return character;

  const normalized = { ...character };
  normalized.name = String(normalized.name || "").trim();
  normalized.slug = getCharacterSlug(normalized.slug || normalized.name);
  normalized.category = normalizeCategory(normalized.category, true);
  normalized.stats = normalizeStats(normalized.stats || {});
  
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

async function createCharacter({
  creatorId,
  creatorName,
  characterName,
  category = "F",
  stats = {},
  slots = {},
  isAdmin = false,
}) {
  await ensureUserProfile({
    creatorId,
    creatorName,
    registration: { source: "crear_pj", scope: "self", createdBy: creatorId },
  });

  const { count } = await supabase
    .from("characters")
    .select("*", { count: "exact", head: true })
    .eq("player_phone", creatorId);

  if (count >= MAX_CHARACTERS_PER_USER) {
    throw new Error(`Has alcanzado el máximo de ${MAX_CHARACTERS_PER_USER} personajes por usuario.`);
  }

  const slug = getCharacterSlug(characterName);
  
  const { data: existing } = await supabase
    .from("characters")
    .select("id")
    .eq("player_phone", creatorId)
    .eq("slug", slug)
    .single();

  if (existing) {
    throw new Error("Ya existe un personaje con ese nombre.");
  }

  const isActive = count === 0;

  const record = {
    player_phone: creatorId,
    name: characterName,
    slug: slug,
    category: normalizeCategory(category, isAdmin),
    is_active: isActive
  };

  // Solo inyectar si no son null o vacíos, permitiendo que Supabase use los suyos.
  if (stats && Object.keys(stats).length > 0) record.stats = normalizeStats(stats);
  if (slots && Object.keys(slots).length > 0) record.slots = { ...DEFAULT_CHARACTER_SLOTS, ...slots };

  const { data, error } = await supabase
    .from("characters")
    .insert(record)
    .select()
    .single();

  if (error) throw new Error("Error guardando el personaje: " + error.message);

  const normalized = normalizeCharacterRecord(data);
  normalized.active = data.is_active;
  return normalized;
}

async function getCharacter({ creatorId, characterName }) {
  const slug = getCharacterSlug(characterName);
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("player_phone", creatorId)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  const normalized = normalizeCharacterRecord(data);
  normalized.active = data.is_active;
  return normalized;
}

async function listCharacters({ creatorId }) {
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("player_phone", creatorId)
    .order("name", { ascending: true });

  if (error || !data) return [];
  
  return data.map(row => {
    const normalized = normalizeCharacterRecord(row);
    normalized.active = row.is_active;
    return normalized;
  });
}

async function getActiveCharacter({ creatorId }) {
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("player_phone", creatorId)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  const normalized = normalizeCharacterRecord(data);
  normalized.active = true;
  return normalized;
}

async function setActiveCharacter({
  targetCreatorId,
  targetCreatorName,
  characterName,
  requesterId,
  requesterIsAdmin = false,
}) {
  if (requesterId !== targetCreatorId && !requesterIsAdmin) {
    throw new Error("Solo el creador o un admin pueden hacer switch.");
  }

  const slug = getCharacterSlug(characterName);

  const { data: character, error } = await supabase
    .from("characters")
    .select("id")
    .eq("player_phone", targetCreatorId)
    .eq("slug", slug)
    .single();

  if (error || !character) {
    throw new Error("No existe ese personaje.");
  }

  await supabase
    .from("characters")
    .update({ is_active: false })
    .eq("player_phone", targetCreatorId);

  const { data: updated } = await supabase
    .from("characters")
    .update({ is_active: true })
    .eq("player_phone", targetCreatorId)
    .eq("slug", slug)
    .select()
    .single();

  const normalized = normalizeCharacterRecord(updated);
  normalized.active = true;
  return normalized;
}

async function updateCharacterStats({ creatorId, characterName, patch = {} }) {
  const slug = getCharacterSlug(characterName);
  
  const { data, error } = await supabase
    .from("characters")
    .select("stats")
    .eq("player_phone", creatorId)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  const newStats = { ...data.stats, ...patch };

  const { data: updated, error: updateError } = await supabase
    .from("characters")
    .update({ stats: newStats, updated_at: new Date().toISOString() })
    .eq("player_phone", creatorId)
    .eq("slug", slug)
    .select()
    .single();

  if (updateError || !updated) return null;
  
  const normalized = normalizeCharacterRecord(updated);
  normalized.active = updated.is_active;
  return normalized;
}

async function editCharacter({ creatorId, characterName, patch = {} }) {
  const oldSlug = getCharacterSlug(characterName);
  
  const { data: character, error } = await supabase
    .from("characters")
    .select("*")
    .eq("player_phone", creatorId)
    .eq("slug", oldSlug)
    .single();

  if (error || !character) {
    throw new Error("No existe el personaje.");
  }

  const updates = { updated_at: new Date().toISOString() };
  let newSlug = oldSlug;

  if (patch.name && patch.name !== character.name) {
    const cleanName = String(patch.name).trim();
    if (cleanName.length < 2) throw new Error("Nombre demasiado corto.");
    if (cleanName.length > MAX_CHARACTER_NAME_LENGTH) throw new Error("Nombre demasiado largo.");
    
    newSlug = getCharacterSlug(cleanName);
    
    const { data: existing } = await supabase
      .from("characters")
      .select("id")
      .eq("player_phone", creatorId)
      .eq("slug", newSlug)
      .single();

    if (existing) throw new Error("Ya existe un personaje con ese nombre.");
    
    updates.name = cleanName;
    updates.slug = newSlug;
  }

  const newSlots = { ...character.slots };
  
  if (patch.description !== undefined) {
    newSlots.descripcion = String(patch.description).trim();
  }

  if (patch.slots) {
    if (typeof patch.slots !== "object") throw new Error("Slots inválidos.");
    for (const [key, value] of Object.entries(patch.slots)) {
      const cleanKey = String(key).trim().toLowerCase();
      if (cleanKey.length < 1) continue;
      if (cleanKey.length > 50) throw new Error(`Slot demasiado largo:\n${cleanKey}`);
      const cleanValue = String(value).trim();
      if (cleanValue.length > MAX_SLOT_SIZE) throw new Error(`Contenido demasiado largo:\n${cleanKey}`);
      newSlots[cleanKey] = cleanValue;
    }
  }
  
  updates.slots = newSlots;

  const { data: updated, error: updateError } = await supabase
    .from("characters")
    .update(updates)
    .eq("id", character.id)
    .select()
    .single();

  if (updateError) throw new Error("Error guardando el personaje: " + updateError.message);

  const normalized = normalizeCharacterRecord(updated);
  normalized.active = updated.is_active;
  return normalized;
}

async function deleteCharacter({ creatorId, characterName }) {
  const slug = getCharacterSlug(characterName);
  
  const { data: character, error } = await supabase
    .from("characters")
    .select("*")
    .eq("player_phone", creatorId)
    .eq("slug", slug)
    .single();

  if (error || !character) {
    throw new Error("No existe el personaje.");
  }

  await supabase
    .from("characters")
    .delete()
    .eq("id", character.id);

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
        .update({ is_active: true })
        .eq("id", remaining[0].id);
    }
  }

  return true;
}

async function getCharacterBySlug({ creatorId, slug }) {
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("player_phone", creatorId)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  const normalized = normalizeCharacterRecord(data);
  normalized.active = data.is_active;
  return normalized;
}

module.exports = {
  createCharacter,
  getCharacter,
  listCharacters,
  getActiveCharacter,
  setActiveCharacter,
  updateCharacterStats,
  getCharacterSlug,
  editCharacter,
  deleteCharacter,
  getCharacterBySlug,
};
