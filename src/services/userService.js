const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const { CHARACTER_ROOT } = require("../config/characterConfig");

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

async function findUserFolderById(creatorId) {
  const suffix = `__${creatorDigits(creatorId)}`;
  const folders = await listCreatorFolders();

  const match = folders.find(
    (entry) => entry.isDirectory() && entry.name.endsWith(suffix),
  );

  return match ? path.join(CHARACTER_ROOT, match.name) : null;
}

async function listUserProfiles() {
  const folders = await listCreatorFolders();
  const result = [];

  for (const entry of folders) {
    if (!entry.isDirectory()) {
      continue;
    }

    const folder = path.join(CHARACTER_ROOT, entry.name);
    const profilePath = path.join(folder, "profile.json");
    const stored = await readJson(profilePath, null);

    if (!stored) {
      continue;
    }

    const normalized = normalizeProfile(stored, {
      creatorId: stored.creatorId || entry.name.split("__").pop(),
      creatorName: stored.creatorName || "usuario",
    });

    if (JSON.stringify(stored) !== JSON.stringify(normalized)) {
      await writeJson(profilePath, normalized);
    }

    result.push({
      folder,
      profilePath,
      profile: normalized,
    });
  }

  return result;
}

function buildRegistration({
  creatorId,
  registration = {},
}) {
  const now = new Date().toISOString();

  return {
    source: registration.source || "system",
    scope: registration.scope || "self",
    createdBy: registration.createdBy || creatorId,
    createdAt: registration.createdAt || now,
  };
}

function buildDefaultProfile({
  creatorId,
  creatorName,
  registration = {},
}) {
  const now = new Date().toISOString();
  const cleanName = String(creatorName || "usuario").trim() || "usuario";

  return {
    creatorId,
    creatorName: cleanName,
    metadata: {
      displayName: cleanName,
      pushName: cleanName,
      lastSeenAt: now,
    },
    registration: buildRegistration({
      creatorId,
      registration,
    }),
    economy: {
      money: 0,
    },
    activity: {
      messages: 0,
      commands: 0,
    },
    daily: {
      streak: 0,
      lastClaim: null,
      totalClaims: 0,
    },
    activeCharacter: null,
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeRegistration({
  creatorId,
  registration = {},
  fallback = {},
}) {
  const base = buildRegistration({
    creatorId,
    registration: {
      ...fallback,
      ...registration,
    },
  });

  return {
    ...base,
    ...registration,
    createdBy: registration.createdBy || fallback.createdBy || creatorId,
    createdAt: registration.createdAt || fallback.createdAt || base.createdAt,
  };
}

function normalizeProfile(profile, { creatorId, creatorName }) {
  const now = new Date().toISOString();
  const cleanName =
    String(creatorName || profile?.creatorName || "usuario").trim() ||
    "usuario";

  const normalized = {
    ...buildDefaultProfile({
      creatorId,
      creatorName: cleanName,
      registration: profile?.registration || {},
    }),
    ...profile,
  };

  normalized.creatorId = normalized.creatorId || creatorId;
  normalized.creatorName = normalized.creatorName || cleanName;
  normalized.activeCharacter =
    normalized.activeCharacter && String(normalized.activeCharacter).trim()
      ? String(normalized.activeCharacter).trim().toLowerCase()
      : null;

  normalized.metadata = {
    ...buildDefaultProfile({
      creatorId,
      creatorName: cleanName,
    }).metadata,
    ...(profile?.metadata || {}),
  };

  normalized.registration = normalizeRegistration({
    creatorId,
    registration: profile?.registration || {},
    fallback: {
      source: "system",
      scope: "self",
      createdBy: creatorId,
      createdAt: normalized.createdAt || now,
    },
  });

  normalized.economy = {
    money: 0,
    ...(profile?.economy || {}),
  };

  normalized.activity = {
    messages: 0,
    commands: 0,
    ...(profile?.activity || {}),
  };

  normalized.daily = {
    streak: 0,
    lastClaim: null,
    totalClaims: 0,
    ...(profile?.daily || {}),
  };

  if (!normalized.metadata.displayName) {
    normalized.metadata.displayName = cleanName;
  }

  if (!normalized.metadata.pushName) {
    normalized.metadata.pushName = cleanName;
  }

  if (!normalized.createdAt) {
    normalized.createdAt = now;
  }

  if (!normalized.updatedAt) {
    normalized.updatedAt = now;
  }

  return normalized;
}

async function ensureUserFolder(
  creatorId,
  creatorName = "usuario",
  registration = {},
) {
  const existing = await findUserFolderById(creatorId);

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
    await writeJson(
      profilePath,
      buildDefaultProfile({
        creatorId,
        creatorName,
        registration,
      }),
    );
  }

  return folder;
}

async function ensureUserProfile({
  creatorId,
  creatorName = "usuario",
  registration = {},
}) {
  const folder = await ensureUserFolder(
    creatorId,
    creatorName,
    registration,
  );
  const profilePath = path.join(folder, "profile.json");

  const stored = await readJson(profilePath, null);
  const profile = stored
    ? normalizeProfile(stored, { creatorId, creatorName })
    : buildDefaultProfile({
        creatorId,
        creatorName,
        registration,
      });

  if (!stored || JSON.stringify(stored) !== JSON.stringify(profile)) {
    await writeJson(profilePath, profile);
  }

  return {
    folder,
    profilePath,
    profile,
  };
}

async function getUserProfile({ creatorId }) {
  const folder = await findUserFolderById(creatorId);

  if (!folder) {
    return null;
  }

  const profilePath = path.join(folder, "profile.json");
  const stored = await readJson(profilePath, null);

  if (!stored) {
    return null;
  }

  const profile = normalizeProfile(stored, {
    creatorId,
    creatorName: stored.creatorName || "usuario",
  });

  if (JSON.stringify(stored) !== JSON.stringify(profile)) {
    await writeJson(profilePath, profile);
  }

  return {
    folder,
    profilePath,
    profile,
  };
}

async function isUserRegistered({ creatorId }) {
  const profile = await getUserProfile({ creatorId });
  return Boolean(profile);
}

async function saveUserProfile({ folder, profile }) {
  if (!folder) {
    throw new Error("Falta la carpeta del perfil.");
  }

  const profilePath = path.join(folder, "profile.json");

  await writeJson(profilePath, profile);

  return profile;
}

async function syncUserMetadata({
  creatorId,
  creatorName,
  displayName,
  pushName,
}) {
  const current = await getUserProfile({ creatorId });

  if (!current) {
    return null;
  }

  const profile = current.profile;
  const next = {
    ...profile,
    metadata: {
      ...(profile.metadata || {}),
    },
  };

  const now = new Date().toISOString();
  let changed = false;

  if (typeof displayName === "string") {
    const cleanDisplayName = displayName.trim() || "usuario";

    if (next.metadata.displayName !== cleanDisplayName) {
      next.metadata.displayName = cleanDisplayName;
      changed = true;
    }

    if (next.creatorName !== cleanDisplayName) {
      next.creatorName = cleanDisplayName;
      changed = true;
    }
  }

  if (typeof pushName === "string") {
    const cleanPushName = pushName.trim() || "usuario";

    if (next.metadata.pushName !== cleanPushName) {
      next.metadata.pushName = cleanPushName;
      changed = true;
    }
  }

  if (typeof creatorName === "string" && !displayName) {
    const cleanCreatorName = creatorName.trim() || "usuario";

    if (next.metadata.displayName !== cleanCreatorName) {
      next.metadata.displayName = cleanCreatorName;
      changed = true;
    }

    if (next.creatorName !== cleanCreatorName) {
      next.creatorName = cleanCreatorName;
      changed = true;
    }
  }

  if (next.metadata.lastSeenAt !== now) {
    next.metadata.lastSeenAt = now;
    changed = true;
  }

  if (changed) {
    next.updatedAt = now;
    await saveUserProfile({
      folder: current.folder,
      profile: next,
    });
  }

  return next;
}

async function getOrCreateProfile({
  creatorId,
  creatorName = "usuario",
  registration = {},
}) {
  const existing = await getUserProfile({
    creatorId,
  });

  if (existing) {
    return existing;
  }

  return await ensureUserProfile({
    creatorId,
    creatorName,
    registration,
  });
}

async function resolveUserProfile({
  creatorId,
  creatorName = "usuario",
  createIfMissing = false,
  registration = {},
}) {
  if (createIfMissing) {
    return await ensureUserProfile({
      creatorId,
      creatorName,
      registration,
    });
  }

  return await getUserProfile({ creatorId });
}

module.exports = {
  stripAccents,
  sanitizeName,
  creatorDigits,
  getCreatorFolderName,
  findUserFolderById,
  listUserProfiles,
  ensureUserFolder,
  ensureUserProfile,
  getUserProfile,
  isUserRegistered,
  saveUserProfile,
  syncUserMetadata,
  getOrCreateProfile,
  resolveUserProfile,
};
