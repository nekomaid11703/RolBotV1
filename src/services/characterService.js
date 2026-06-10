const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const {
  CHARACTER_ROOT,
  CHARACTER_CATEGORIES,
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  MAX_CHARACTER_NAME_LENGTH,
  MAX_SLOT_SIZE,
  MAX_CHARACTERS_PER_USER,
} = require("../config/characterConfig");

const {
  sanitizeName,
  getCreatorFolderName,
  findUserFolderById,
  ensureUserProfile,
  getUserProfile,
  saveUserProfile,
} = require("./userService");

function getCharacterSlug(characterName) {
  return sanitizeName(characterName).toLowerCase();
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function readJson(file, fallback = null) {
  try {
    const raw = await fsp.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await ensureDir(path.dirname(file));
  await fsp.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

function normalizeCategory(category, isAdmin = false) {
  const normalized = String(category || "F")
    .toUpperCase()
    .trim();

  if (!CHARACTER_CATEGORIES.includes(normalized)) {
    return "F";
  }

  if (!isAdmin && normalized !== "F") {
    return "F";
  }

  return normalized;
}

function normalizeStats(stats = {}) {
  return {
    ...DEFAULT_CHARACTER_STATS,
    ...(stats || {}),
  };
}

function characterFilePath(folder, slug) {
  return path.join(folder, "characters", `${slug}.json`);
}

function normalizeCharacterRecord(character) {
  if (!character || typeof character !== "object") {
    return character;
  }

  const normalized = { ...character };

  normalized.name = String(normalized.name || "").trim();
  normalized.slug = getCharacterSlug(normalized.slug || normalized.name);
  normalized.category = normalizeCategory(normalized.category, true);
  normalized.creatorId = normalized.creatorId || null;
  normalized.creatorName = String(normalized.creatorName || "usuario").trim() || "usuario";
  normalized.stats = normalizeStats(normalized.stats || {});

  const legacyDescription = normalized.description;

  normalized.slots = {
    ...DEFAULT_CHARACTER_SLOTS,
    ...(normalized.slots || {}),
  };

  if (
    legacyDescription !== undefined &&
    legacyDescription !== null &&
    !String(normalized.slots.descripcion || "").trim()
  ) {
    normalized.slots.descripcion = String(legacyDescription).trim();
  }

  delete normalized.description;

  normalized.createdAt = normalized.createdAt || new Date().toISOString();
  normalized.updatedAt = normalized.updatedAt || normalized.createdAt;

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
  const { folder, profile } = await ensureUserProfile({
    creatorId,
    creatorName,
    registration: {
      source: "crear_pj",
      scope: "self",
      createdBy: creatorId,
    },
  });

  const existingCount = await fsp
    .readdir(path.join(folder, "characters"), { withFileTypes: true })
    .then((entries) => entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length)
    .catch(() => 0);

  if (existingCount >= MAX_CHARACTERS_PER_USER) {
    throw new Error(`Has alcanzado el máximo de ${MAX_CHARACTERS_PER_USER} personajes por usuario.`);
  }

  const slug = getCharacterSlug(characterName);
  const file = characterFilePath(folder, slug);

  if (fs.existsSync(file)) {
    throw new Error("Ya existe un personaje con ese nombre.");
  }

  const now = new Date().toISOString();

  const character = normalizeCharacterRecord({
    name: characterName,
    slug,
    category: normalizeCategory(category, isAdmin),
    creatorId,
    creatorName,
    stats: normalizeStats(stats),
    slots: {
      ...DEFAULT_CHARACTER_SLOTS,
      ...(slots || {}),
    },
    createdAt: now,
    updatedAt: now,
  });

  await writeJson(file, character);

  if (!profile.activeCharacter) {
    profile.activeCharacter = slug;
    profile.updatedAt = now;

    await saveUserProfile({
      folder,
      profile,
    });

    character.active = true;
  } else {
    character.active = false;
  }

  return character;
}

async function getCharacter({ creatorId, characterName }) {
  const folder = await findUserFolderById(creatorId);
  if (!folder) return null;

  const slug = getCharacterSlug(characterName);
  const file = characterFilePath(folder, slug);

  if (!fs.existsSync(file)) return null;

  return normalizeCharacterRecord(await readJson(file, null));
}

async function listCharacters({ creatorId }) {
  const folder = await findUserFolderById(creatorId);
  if (!folder) return [];

  const profile = await getUserProfile({ creatorId });

  const activeCharacter = profile?.profile?.activeCharacter || null;

  const charsDir = path.join(folder, "characters");
  const files = await fsp.readdir(charsDir).catch(() => []);

  const result = [];

  for (const file of files.filter((f) => f.endsWith(".json"))) {
    const data = await readJson(path.join(charsDir, file), null);

    if (data) {
      const normalized = normalizeCharacterRecord(data);
      normalized.active = activeCharacter === normalized.slug;
      result.push(normalized);
    }
  }

  return result.sort((a, b) => a.name.localeCompare(b.name, "es"));
}

async function getActiveCharacter({ creatorId }) {
  const profileData = await getUserProfile({ creatorId });

  if (!profileData) {
    return null;
  }

  const { folder, profile } = profileData;

  if (!profile?.activeCharacter) {
    return null;
  }

  const file = characterFilePath(folder, profile.activeCharacter);

  if (!fs.existsSync(file)) {
    profile.activeCharacter = null;
    profile.updatedAt = new Date().toISOString();

    await saveUserProfile({
      folder,
      profile,
    });

    return null;
  }

  const character = normalizeCharacterRecord(await readJson(file, null));
  if (!character) {
    profile.activeCharacter = null;
    profile.updatedAt = new Date().toISOString();

    await saveUserProfile({
      folder,
      profile,
    });

    return null;
  }

  character.active = true;
  return character;
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

  const folder = await findUserFolderById(targetCreatorId);

  if (!folder) {
    throw new Error("El usuario no tiene personajes registrados.");
  }

  const character = await getCharacter({
    creatorId: targetCreatorId,
    characterName,
  });

  if (!character) {
    throw new Error("No existe ese personaje.");
  }

  const profileData = await getUserProfile({ creatorId: targetCreatorId });

  const profile =
    profileData?.profile || {
      creatorId: targetCreatorId,
      creatorName: targetCreatorName || "usuario",
      metadata: {
        displayName: targetCreatorName || "usuario",
        pushName: targetCreatorName || "usuario",
        lastSeenAt: new Date().toISOString(),
      },
      activeCharacter: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  profile.activeCharacter = character.slug;
  profile.updatedAt = new Date().toISOString();

  await saveUserProfile({
    folder,
    profile,
  });

  character.active = true;
  return character;
}

async function updateCharacterStats({ creatorId, characterName, patch = {} }) {
  const folder = await findUserFolderById(creatorId);
  if (!folder) return null;

  const slug = getCharacterSlug(characterName);
  const file = characterFilePath(folder, slug);

  if (!fs.existsSync(file)) return null;

  const character = normalizeCharacterRecord(await readJson(file, null));
  if (!character) return null;

  character.stats = {
    ...character.stats,
    ...patch,
  };

  character.updatedAt = new Date().toISOString();

  await writeJson(file, character);

  return character;
}

// =========================
// EDIT CHARACTER
// =========================

async function editCharacter({
  creatorId,
  characterName,
  patch = {},
}) {
  const folder = await findUserFolderById(creatorId);

  if (!folder) {
    throw new Error("No existe el creador.");
  }

  const oldSlug = getCharacterSlug(characterName);
  const oldFile = characterFilePath(folder, oldSlug);

  if (!fs.existsSync(oldFile)) {
    throw new Error("No existe el personaje.");
  }

  const character = normalizeCharacterRecord(await readJson(oldFile, null));

  if (!character) {
    throw new Error("No se pudo leer el personaje.");
  }

  if (character.creatorId !== creatorId) {
    throw new Error("No puedes editar personajes ajenos.");
  }

  let newSlug = oldSlug;

  if (patch.name && patch.name !== character.name) {
    const cleanName = String(patch.name).trim();

    if (cleanName.length < 2) {
      throw new Error("Nombre demasiado corto.");
    }

    if (cleanName.length > MAX_CHARACTER_NAME_LENGTH) {
      throw new Error("Nombre demasiado largo.");
    }

    newSlug = getCharacterSlug(cleanName);

    const newFile = characterFilePath(folder, newSlug);

    if (fs.existsSync(newFile)) {
      throw new Error("Ya existe un personaje con ese nombre.");
    }

    character.name = cleanName;
    character.slug = newSlug;

    await fsp.rename(oldFile, newFile);
  }

  if (patch.description !== undefined) {
    character.slots = character.slots || {};
    character.slots.descripcion = String(patch.description).trim();
  }

  if (patch.slots) {
    if (typeof patch.slots !== "object") {
      throw new Error("Slots inválidos.");
    }

    if (!character.slots) {
      character.slots = {};
    }

    for (const [key, value] of Object.entries(patch.slots)) {
      const cleanKey = String(key).trim().toLowerCase();

      if (cleanKey.length < 1) {
        continue;
      }

      if (cleanKey.length > 50) {
        throw new Error(`Slot demasiado largo:\n${cleanKey}`);
      }

      const cleanValue = String(value).trim();

      if (cleanValue.length > MAX_SLOT_SIZE) {
        throw new Error(`Contenido demasiado largo:\n${cleanKey}`);
      }

      character.slots[cleanKey] = cleanValue;
    }
  }

  character.updatedAt = new Date().toISOString();

  const finalFile = characterFilePath(folder, newSlug);

  await writeJson(finalFile, character);

  const profileData = await getUserProfile({ creatorId });

  if (profileData?.profile && profileData.profile.activeCharacter === oldSlug) {
    profileData.profile.activeCharacter = newSlug;
    profileData.profile.updatedAt = new Date().toISOString();

    await saveUserProfile({
      folder,
      profile: profileData.profile,
    });
  }

  return character;
}

// =========================
// DELETE CHARACTER
// =========================

async function deleteCharacter({
  creatorId,
  characterName,
}) {
  const folder = await findUserFolderById(creatorId);

  if (!folder) {
    throw new Error("No existe el creador.");
  }

  const slug = getCharacterSlug(characterName);
  const file = characterFilePath(folder, slug);

  if (!fs.existsSync(file)) {
    throw new Error("No existe el personaje.");
  }

  const profileData = await getUserProfile({ creatorId });
  const profile = profileData?.profile || null;
  const wasActive = profile?.activeCharacter === slug;

  await fsp.unlink(file);

  if (!wasActive) {
    return true;
  }

  const charsDir = path.join(folder, "characters");
  const files = await fsp.readdir(charsDir).catch(() => []);

  const remaining = files
    .filter((f) => f.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b, "es"));

  if (remaining.length === 0) {
    profile.activeCharacter = null;
  } else {
    const nextCharacter = await readJson(
      path.join(charsDir, remaining[0]),
      null,
    );

    profile.activeCharacter = nextCharacter?.slug || null;
  }

  profile.updatedAt = new Date().toISOString();

  await saveUserProfile({
    folder,
    profile,
  });

  return true;
}

// =========================
// GET CHARACTER BY SLUG
// =========================

async function getCharacterBySlug({
  creatorId,
  slug,
}) {
  const folder = await findUserFolderById(creatorId);

  if (!folder) {
    return null;
  }

  const file = characterFilePath(folder, slug);

  if (!fs.existsSync(file)) {
    return null;
  }

  return normalizeCharacterRecord(await readJson(file, null));
}

module.exports = {
  createCharacter,
  getCharacter,
  listCharacters,
  getActiveCharacter,
  setActiveCharacter,
  updateCharacterStats,
  getCreatorFolderName,
  getCharacterSlug,
  editCharacter,
  deleteCharacter,
  getCharacterBySlug,
};
