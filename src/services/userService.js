// @ts-nocheck
const { supabase } = require("../database/supabase");
const {
  safeSingleOrNull,
  userCacheKey,
  invalidateUserCache,
  TTLS,
  cache,
  topActiveUsersCacheKey,
} = require("../utils/safeQuery");

function stripAccents(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function sanitizeName(text) {
  return (
    stripAccents(text)
      .replace(new RegExp('[<>:"/\\\\|?*' + "\\x00-\\x1f]", "g"), "")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_") || "usuario"
  );
}

async function listUserProfiles(bypassCache = false, opts = {}) {
  const cacheKey = opts.offset || opts.limit ? null : "allUserProfiles";
  if (!bypassCache && cacheKey) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  let query = supabase.from("players").select("*");
  if (opts.limit) query = query.range(opts.offset || 0, (opts.offset || 0) + opts.limit - 1);

  const { data, error } = await query;
  if (error || !data) return [];

  const result = data.map((row) => {
    const profile = normalizeProfile({}, { creatorId: row.phone, creatorName: row.username });
    profile.economy.money = Number(row.money || 0);
    profile.activity.messages = Number(row.activity_messages || 0);
    profile.activity.commands = Number(row.activity_commands || 0);
    profile.metadata.lastSeenAt = row.last_active_at || profile.createdAt;
    return { folder: "supabase", profilePath: "supabase", profile };
  });

  if (cacheKey) cache.set(cacheKey, result, TTLS.memoryContext);
  return result;
}

function buildRegistration({ creatorId, registration = {} }) {
  const now = new Date().toISOString();

  return {
    source: registration.source || "system",
    scope: registration.scope || "self",
    createdBy: registration.createdBy || creatorId,
    createdAt: registration.createdAt || now,
  };
}

function buildDefaultProfile({ creatorId, creatorName, registration = {} }) {
  const now = new Date().toISOString();
  const cleanName = String(creatorName || "usuario").trim() || "usuario";

  return {
    creatorId,
    creatorName: cleanName,
    metadata: {
      displayName: cleanName,
      pushName: cleanName,
      lastSeenAt: now,
      lastKnownJid: null,
      lastKnownNumber: null,
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
      textMessages: 0,
      mediaMessages: 0,
      stickerMessages: 0,
      audioMessages: 0,
      imageMessages: 0,
      videoMessages: 0,
      documentMessages: 0,
      reactionMessages: 0,
      lastMessageType: null,
      lastMessageAt: null,
      lastCommandAt: null,
    },
    daily: {
      streak: 0,
      lastClaim: null,
      totalClaims: 0,
    },
    permissions: {
      economyAdmin: false,
    },
    activeCharacter: null,
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeRegistration({ creatorId, registration = {}, fallback = {} }) {
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

function normalizeActivity(activity = {}) {
  return {
    messages: 0,
    commands: 0,
    textMessages: 0,
    mediaMessages: 0,
    stickerMessages: 0,
    audioMessages: 0,
    imageMessages: 0,
    videoMessages: 0,
    documentMessages: 0,
    reactionMessages: 0,
    lastMessageType: null,
    lastMessageAt: null,
    lastCommandAt: null,
    ...(activity || {}),
  };
}

function normalizeProfile(profile, { creatorId, creatorName }) {
  const now = new Date().toISOString();
  const cleanName = String(creatorName || profile?.creatorName || "usuario").trim() || "usuario";

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

  normalized.activity = normalizeActivity(profile?.activity || {});

  normalized.daily = {
    streak: 0,
    lastClaim: null,
    totalClaims: 0,
    ...(profile?.daily || {}),
  };
  normalized.permissions = {
    economyAdmin: false,
    ...(profile?.permissions || {}),
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

async function ensureUserProfile({ creatorId, creatorName = "usuario", registration = {} }) {
  const existing = await getUserProfile({ creatorId });
  if (existing) return existing;

  const profile = normalizeProfile({}, { creatorId, creatorName });
  profile.registration = normalizeRegistration({
    creatorId,
    registration,
    fallback: { source: "system", scope: "self" },
  });

  await saveUserProfile({ folder: "supabase", profile });
  return { folder: "supabase", profilePath: "supabase", profile };
}

async function getUserProfile({ creatorId, bypassCache = false }) {
  const key = userCacheKey(creatorId);
  if (!bypassCache) {
    const cached = cache.get(key);
    if (cached) return cached;
  }

  const data = await safeSingleOrNull(supabase.from("players").select("*").eq("phone", creatorId));

  if (!data) return null;

  const profile = normalizeProfile({}, { creatorId: data.phone, creatorName: data.username });
  profile.economy.money = Number(data.money || 0);
  profile.activity.messages = Number(data.activity_messages || 0);
  profile.activity.commands = Number(data.activity_commands || 0);
  profile.metadata.lastSeenAt = data.last_active_at || profile.createdAt;

  const result = { folder: "supabase", profilePath: "supabase", profile };
  cache.set(key, result, TTLS.memoryContext);
  return result;
}

async function saveUserProfile({ folder: _folder, profile }) {
  const { error } = await supabase.from("players").upsert(
    {
      phone: profile.creatorId,
      username: profile.creatorName,
      money: Number(profile.economy?.money || 0),
      activity_messages: Number(profile.activity?.messages || 0),
      activity_commands: Number(profile.activity?.commands || 0),
      last_active_at: profile.metadata?.lastSeenAt || new Date().toISOString(),
    },
    { onConflict: "phone" },
  );

  if (error) throw new Error("Error guardando usuario: " + error.message);

  invalidateUserCache(profile.creatorId);
  return profile;
}

async function getOrCreateProfile({ creatorId, creatorName = "usuario", registration = {} }) {
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

function resolveActivityBucket(messageType) {
  const normalizedType = String(messageType || "")
    .trim()
    .toLowerCase();

  if (!normalizedType) {
    return null;
  }

  if (normalizedType.includes("sticker")) return "stickerMessages";
  if (normalizedType.includes("audio")) return "audioMessages";
  if (normalizedType.includes("image")) return "imageMessages";
  if (normalizedType.includes("video")) return "videoMessages";
  if (normalizedType.includes("document")) return "documentMessages";
  if (normalizedType.includes("reaction")) return "reactionMessages";

  return null;
}

async function recordUserActivity({
  creatorId,
  creatorName = "usuario",
  displayName,
  pushName,
  senderJid,
  senderNumber,
  messageType = "unknown",
  messageCount = 0,
  commandCount = 0,
  isText = false,
  registration = {},
}) {
  const current = await getOrCreateProfile({
    creatorId,
    creatorName,
    registration: {
      source: registration.source || "activity",
      scope: registration.scope || "self",
      createdBy: registration.createdBy || creatorId,
      createdAt: registration.createdAt,
    },
  });

  if (!current) {
    return null;
  }

  const profile = current.profile;
  const next = {
    ...profile,
    metadata: {
      ...(profile.metadata || {}),
    },
    activity: normalizeActivity(profile.activity || {}),
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

  if (typeof senderJid === "string") {
    const cleanSenderJid = String(senderJid).trim() || null;

    if (cleanSenderJid && next.metadata.lastKnownJid !== cleanSenderJid) {
      next.metadata.lastKnownJid = cleanSenderJid;
      changed = true;
    }
  }

  if (typeof senderNumber === "string") {
    const cleanSenderNumber = senderNumber.trim() || null;

    if (cleanSenderNumber && next.metadata.lastKnownNumber !== cleanSenderNumber) {
      next.metadata.lastKnownNumber = cleanSenderNumber;
      changed = true;
    }
  }

  if (next.metadata.lastSeenAt !== now) {
    next.metadata.lastSeenAt = now;
    changed = true;
  }

  const safeMessageCount = Math.max(0, Math.floor(Number(messageCount) || 0));
  const safeCommandCount = Math.max(0, Math.floor(Number(commandCount) || 0));
  const bucket = resolveActivityBucket(messageType);
  const normalizedType =
    String(messageType || "unknown")
      .trim()
      .toLowerCase() || "unknown";

  if (safeMessageCount > 0) {
    next.activity.messages = Number(next.activity.messages || 0) + safeMessageCount;
    next.activity.lastMessageAt = now;
    next.activity.lastMessageType = normalizedType;
    changed = true;

    if (isText) {
      next.activity.textMessages = Number(next.activity.textMessages || 0) + safeMessageCount;
    } else if (bucket) {
      next.activity.mediaMessages = Number(next.activity.mediaMessages || 0) + safeMessageCount;
      next.activity[bucket] = Number(next.activity[bucket] || 0) + safeMessageCount;
    } else {
      next.activity.mediaMessages = Number(next.activity.mediaMessages || 0) + safeMessageCount;
    }
  }

  if (safeCommandCount > 0) {
    next.activity.commands = Number(next.activity.commands || 0) + safeCommandCount;
    next.activity.lastCommandAt = now;
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

function sortActivityProfilesDesc(a, b) {
  const diffMessages = Number(b.activity?.messages || 0) - Number(a.activity?.messages || 0);
  if (diffMessages !== 0) return diffMessages;

  const diffCommands = Number(b.activity?.commands || 0) - Number(a.activity?.commands || 0);
  if (diffCommands !== 0) return diffCommands;

  const diffText = Number(b.activity?.textMessages || 0) - Number(a.activity?.textMessages || 0);
  if (diffText !== 0) return diffText;

  return String(a.displayName || "").localeCompare(String(b.displayName || ""), "es");
}

async function getTopActiveUsers({ limit = 10, bypassCache = false } = {}) {
  const cacheKey = topActiveUsersCacheKey(limit);
  if (!bypassCache) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  const safeLimit = Math.max(1, Math.min(50, Math.floor(Number(limit) || 10)));
  const profiles = await listUserProfiles(bypassCache);

  const result = profiles
    .map((entry) => {
      const profile = entry?.profile || {};
      const activity = normalizeActivity(profile.activity || {});
      const displayName =
        String(profile?.metadata?.displayName || profile?.creatorName || "usuario").trim() || "usuario";

      return {
        creatorId: profile.creatorId || null,
        creatorName: profile.creatorName || displayName,
        displayName,
        activity,
        lastSeenAt: profile?.metadata?.lastSeenAt || profile?.updatedAt || null,
      };
    })
    .sort(sortActivityProfilesDesc)
    .slice(0, safeLimit);

  cache.set(cacheKey, result, TTLS.memoryContext);
  return result;
}

module.exports = {
  sanitizeName,
  listUserProfiles,
  ensureUserProfile,
  getUserProfile,
  saveUserProfile,
  recordUserActivity,
  getOrCreateProfile,
  getTopActiveUsers,
};
