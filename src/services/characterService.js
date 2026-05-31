const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const {
  CHARACTER_ROOT,
  CHARACTER_CATEGORIES,
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
} = require("../config/characterConfig");

function stripAccents(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function sanitizeName(text) {
  return (
    stripAccents(text)
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_") || "usuario"
  );
}

function creatorDigits(creatorId) {
  return (
    String(creatorId || "")
      .split("@")[0]
      .replace(/\D/g, "") || "sin_id"
  );
}

function getCreatorFolderName(creatorName, creatorId) {
  return `${sanitizeName(creatorName)}__${creatorDigits(creatorId)}`;
}

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

async function listCreatorFolders() {
  await ensureDir(CHARACTER_ROOT);

  return await fsp.readdir(CHARACTER_ROOT, {
    withFileTypes: true,
  });
}

async function findCreatorFolderById(creatorId) {
  const suffix = `__${creatorDigits(creatorId)}`;
  const folders = await listCreatorFolders();

  const match = folders.find(
    (entry) => entry.isDirectory() && entry.name.endsWith(suffix),
  );

  return match ? path.join(CHARACTER_ROOT, match.name) : null;
}

async function ensureCreatorFolder(creatorId, creatorName) {
  const existing = await findCreatorFolderById(creatorId);

  if (existing) {
    await ensureDir(path.join(existing, "characters"));
    return existing;
  }

  const folder = path.join(
    CHARACTER_ROOT,
    getCreatorFolderName(creatorName, creatorId),
  );

  await ensureDir(path.join(folder, "characters"));

  const profilePath = path.join(folder, "profile.json");

  if (!fs.existsSync(profilePath)) {
    await writeJson(profilePath, {
      creatorId,
      creatorName,
      activeCharacter: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return folder;
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
    ...stats,
  };
}

function characterFilePath(folder, slug) {
  return path.join(folder, "characters", `${slug}.json`);
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
  const folder = await ensureCreatorFolder(creatorId, creatorName);
  const profilePath = path.join(folder, "profile.json");

  const slug = getCharacterSlug(characterName);
  const file = characterFilePath(folder, slug);

  if (fs.existsSync(file)) {
    throw new Error("Ya existe un personaje con ese nombre.");
  }

  const now = new Date().toISOString();
  const profile = await readJson(profilePath, {
    creatorId,
    creatorName,
    activeCharacter: null,
  });

  const character = {
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
  };

  await writeJson(file, character);

  if (!profile.activeCharacter) {
    profile.activeCharacter = slug;
    profile.updatedAt = now;
    await writeJson(profilePath, profile);
    character.active = true;
  } else {
    character.active = false;
  }

  return character;
}

async function getCharacter({ creatorId, characterName }) {
  const folder = await findCreatorFolderById(creatorId);
  if (!folder) return null;

  const slug = getCharacterSlug(characterName);
  const file = characterFilePath(folder, slug);

  if (!fs.existsSync(file)) return null;

  return await readJson(file, null);
}

async function listCharacters({ creatorId }) {
  const folder = await findCreatorFolderById(creatorId);
  if (!folder) return [];

  const profilePath = path.join(folder, "profile.json");
  const profile = await readJson(profilePath, {
    activeCharacter: null,
  });

  const charsDir = path.join(folder, "characters");
  const files = await fsp.readdir(charsDir).catch(() => []);

  const result = [];

  for (const file of files.filter((f) => f.endsWith(".json"))) {
    const data = await readJson(path.join(charsDir, file), null);
    if (data) {
      data.active = profile.activeCharacter === data.slug;
      result.push(data);
    }
  }

  return result.sort((a, b) => a.name.localeCompare(b.name, "es"));
}

async function getActiveCharacter({ creatorId }) {
  const folder = await findCreatorFolderById(creatorId);
  if (!folder) return null;

  const profile = await readJson(path.join(folder, "profile.json"), null);

  if (!profile?.activeCharacter) return null;

  const file = characterFilePath(folder, profile.activeCharacter);

  if (!fs.existsSync(file)) {
  profile.activeCharacter = null;
  profile.updatedAt = new Date().toISOString();

  await writeJson(
    path.join(folder, "profile.json"),
    profile,
  );

  return null;
}

  const character = await readJson(file, null);
  if (!character) return null;

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
  if (
    requesterId !== targetCreatorId &&
    !requesterIsAdmin
  ) {
    throw new Error(
      "Solo el creador o un admin pueden hacer switch.",
    );
  }

  const folder = await findCreatorFolderById(
    targetCreatorId,
  );

  if (!folder) {
    throw new Error(
      "El usuario no tiene personajes registrados.",
    );
  }

  const character = await getCharacter({
    creatorId: targetCreatorId,
    characterName,
  });

  if (!character) {
    throw new Error(
      "No existe ese personaje.",
    );
  }

  const profilePath = path.join(
    folder,
    "profile.json",
  );

  const profile = await readJson(
    profilePath,
    {
      creatorId: targetCreatorId,
      creatorName: targetCreatorName,
      activeCharacter: null,
    },
  );

  profile.activeCharacter = character.slug;

  profile.updatedAt =
    new Date().toISOString();

  await writeJson(profilePath, profile);

  character.active = true;

  return character;
}
async function updateCharacterStats({ creatorId, characterName, patch = {} }) {
  const folder = await findCreatorFolderById(creatorId);
  if (!folder) return null;

  const slug = getCharacterSlug(characterName);
  const file = characterFilePath(folder, slug);

  if (!fs.existsSync(file)) return null;

  const character = await readJson(file, null);
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
  const folder = await findCreatorFolderById(creatorId);

  if (!folder) {
    throw new Error("No existe el creador.");
  }

  // =========================
  // FILE ORIGINAL
  // =========================

  const oldSlug = getCharacterSlug(characterName);

  const oldFile = characterFilePath(folder, oldSlug);

  if (!fs.existsSync(oldFile)) {
    throw new Error("No existe el personaje.");
  }

  const character = await readJson(oldFile, null);

  if (!character) {
    throw new Error("No se pudo leer el personaje.");
  }

  // =========================
  // OWNER SECURITY
  // =========================

  if (character.creatorId !== creatorId) {
    throw new Error("No puedes editar personajes ajenos.");
  }

  // =========================
  // RENAME
  // =========================

  let newSlug = oldSlug;

  if (patch.name && patch.name !== character.name) {
    const cleanName = String(patch.name).trim();

    if (cleanName.length < 2) {
      throw new Error("Nombre demasiado corto.");
    }

    if (cleanName.length > 40) {
      throw new Error("Nombre demasiado largo.");
    }

    newSlug = getCharacterSlug(cleanName);

    const newFile = characterFilePath(folder, newSlug);

    // =========================
    // DUPLICATE
    // =========================

    if (fs.existsSync(newFile)) {
      throw new Error("Ya existe un personaje con ese nombre.");
    }

    character.name = cleanName;

    character.slug = newSlug;

    // =========================
    // MOVE FILE
    // =========================

    await fsp.rename(oldFile, newFile);
  }

  // =========================
  // DESCRIPTION
  // =========================

  if (patch.description !== undefined) {
    character.description = String(patch.description);
  }

  // =========================
  // SLOTS
  // =========================

  if (patch.slots) {
    if (typeof patch.slots !== "object") {
      throw new Error("Slots inválidos.");
    }

    if (!character.slots) {
      character.slots = {};
    }

    for (const [key, value] of Object.entries(patch.slots)) {
      // =========================
      // KEY SECURITY
      // =========================

      const cleanKey = String(key).trim().toLowerCase();

      if (cleanKey.length < 1) {
        continue;
      }

      if (cleanKey.length > 50) {
        throw new Error(`Slot demasiado largo:\n${cleanKey}`);
      }

      // =========================
      // VALUE SECURITY
      // =========================

      const cleanValue = String(value).trim();

      if (cleanValue.length > 5000) {
        throw new Error(`Contenido demasiado largo:\n${cleanKey}`);
      }

      character.slots[cleanKey] = cleanValue;
    }
  }

  character.updatedAt = new Date().toISOString();

  // =========================
  // NEW FILE
  // =========================

  const finalFile = characterFilePath(folder, newSlug);

  await writeJson(finalFile, character);

  // =========================
  // UPDATE ACTIVE
  // =========================

  const profilePath = path.join(folder, "profile.json");

  const profile = await readJson(profilePath, null);

  if (profile && profile.activeCharacter === oldSlug) {
    profile.activeCharacter = newSlug;

    profile.updatedAt = new Date().toISOString();

    await writeJson(profilePath, profile);
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
  const folder = await findCreatorFolderById(creatorId);

  if (!folder) {
    throw new Error("No existe el creador.");
  }

  const slug = getCharacterSlug(characterName);

  const file = characterFilePath(folder, slug);

  if (!fs.existsSync(file)) {
    throw new Error("No existe el personaje.");
  }

  const profilePath = path.join(
    folder,
    "profile.json",
  );

  const profile = await readJson(profilePath, {
    activeCharacter: null,
  });

  const wasActive =
    profile.activeCharacter === slug;

  await fsp.unlink(file);

  if (!wasActive) {
    return true;
  }

  const charsDir = path.join(
    folder,
    "characters",
  );

  const files = await fsp
    .readdir(charsDir)
    .catch(() => []);

  const remaining = files
    .filter((f) => f.endsWith(".json"))
    .sort();

  if (remaining.length === 0) {
    profile.activeCharacter = null;
  } else {
    const nextCharacter = await readJson(
      path.join(charsDir, remaining[0]),
      null,
    );

    profile.activeCharacter =
      nextCharacter?.slug || null;
  }

  profile.updatedAt =
    new Date().toISOString();

  await writeJson(profilePath, profile);

  return true;
}
// =========================
// GET CHARACTER BY SLUG
// =========================

async function getCharacterBySlug({
  creatorId,

  slug,
}) {
  const folder = await findCreatorFolderById(creatorId);

  if (!folder) {
    return null;
  }

  const file = characterFilePath(folder, slug);

  if (!fs.existsSync(file)) {
    return null;
  }

  return await readJson(file, null);
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
