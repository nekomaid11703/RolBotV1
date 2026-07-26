// @ts-nocheck
const { supabase } = require("../database/supabase");
const { filterExisting } = require("../database/columnRegistry");
/**
 * @constant {
  safeSingleOrNull,
  userCacheKey,
  invalidateUserCache,
  TTLS,
  cache,
  topActiveUsersCacheKey,
}
 * @type {any}
 */
const {
  safeSingleOrNull,
  userCacheKey,
  invalidateUserCache,
  TTLS,
  cache,
  topActiveUsersCacheKey,
} = require("../utils/safeQuery");

/**
 * @param text
 * @returns
 */
function stripAccents(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * @param text
 * @returns
 */
function sanitizeName(text) {
  return (
    stripAccents(text)
      .replace(new RegExp('[<>:"/\\\\|?*' + "\\x00-\\x1f]", "g"), "")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_") || "usuario"
  );
}

/**
 * @param [bypassCache]
 * @param [opts]
 * @returns
 */
async function listUserProfiles(bypassCache = false, opts = {}) {
  /**
   * @constant cacheKey
   */
  const cacheKey = opts.offset || opts.limit ? null : "allUserProfiles";
  if (!bypassCache && cacheKey) {
    /**
     * @constant cached
     */
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  /**
   * @variable query
   * @type {any}
   */
  let query = supabase.from("players").select("*");
  if (opts.limit) query = query.range(opts.offset || 0, (opts.offset || 0) + opts.limit - 1);
  const { data, error } = await query;
  if (error || !data) return [];

  /**
   * @constant result
   */
  const result = data.map((row) => {
    /**
     * @constant profile
     */
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

/**
 * @param { creatorId, registration = {} }
 * @param root0
 * @returns
 */
function buildRegistration({ creatorId, registration = {} }) {
  /**
   * @constant now
   */
  const now = new Date().toISOString();

  return {
    source: registration.source || "system",
    scope: registration.scope || "self",
    createdBy: registration.createdBy || creatorId,
    createdAt: registration.createdAt || now,
  };
}

/**
 * @param { creatorId, creatorName, registration = {} }
 * @param root0
 * @returns
 */
function buildDefaultProfile({ creatorId, creatorName, registration = {} }) {
  /**
   * @constant now
   */
  const now = new Date().toISOString();
  /**
   * @constant cleanName
   */
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

/**
 * @param { creatorId, registration = {}, fallback = {} }
 * @param root0
 * @returns
 */
function normalizeRegistration({ creatorId, registration = {}, fallback = {} }) {
  /**
   * @constant base
   */
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

/**
 * @param [activity]
 * @returns
 */
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

/**
 * @param profile
 * @param { creatorId, creatorName }
 * @param root0
 * @returns
 */
function normalizeProfile(profile, { creatorId, creatorName }) {
  /**
   * @constant now
   */
  const now = new Date().toISOString();
  /**
   * @constant cleanName
   */
  const cleanName = String(creatorName || profile?.creatorName || "usuario").trim() || "usuario";

  /**
   * @constant normalized
   * @type {object}
   */
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

/**
 * @param { creatorId, creatorName = "usuario", registration = {} } - TODO: describe parameter "{ creatorId, creatorName = "usuario", registration = {} }".
 * @param root0
 * @returns
 */
async function ensureUserProfile({ creatorId, creatorName = "usuario", registration = {} }) {
  /**
   * @constant existing
   */
  const existing = await getUserProfile({ creatorId });
  if (existing) return existing;

  /**
   * @constant profile
   */
  const profile = normalizeProfile({}, { creatorId, creatorName });
  profile.registration = normalizeRegistration({
    creatorId,
    registration,
    fallback: { source: "system", scope: "self" },
  });

  await saveUserProfile({ folder: "supabase", profile });
  return { folder: "supabase", profilePath: "supabase", profile };
}

/**
 * @param { creatorId, bypassCache = false }
 * @param root0
 * @returns
 */
async function getUserProfile({ creatorId, bypassCache = false }) {
  /**
   * @constant key
   */
  const key = userCacheKey(creatorId);
  if (!bypassCache) {
    /**
     * @constant cached
     */
    const cached = cache.get(key);
    if (cached) return cached;
  }

  /**
   * @constant data
   */
  const data = await safeSingleOrNull(supabase.from("players").select("*").eq("phone", creatorId));

  if (!data) return null;

  /**
   * @constant profile
   */
  const profile = normalizeProfile({}, { creatorId: data.phone, creatorName: data.username });
  profile.economy.money = Number(data.money || 0);
  profile.activity.messages = Number(data.activity_messages || 0);
  profile.activity.commands = Number(data.activity_commands || 0);
  profile.metadata.lastSeenAt = data.last_active_at || profile.createdAt;

  /**
   * @constant result
   * @type {object}
   */
  const result = { folder: "supabase", profilePath: "supabase", profile };
  cache.set(key, result, TTLS.memoryContext);
  return result;
}

/**
 * @param { folder: _folder, profile }
 * @param root0
 * @returns
 */
async function saveUserProfile({ folder: _folder, profile }) {
  /**
   * @constant payload
   */
  const payload = filterExisting("players", {
    phone: profile.creatorId,
    username: profile.creatorName,
    money: Number(profile.economy?.money || 0),
    activity_messages: Number(profile.activity?.messages || 0),
    activity_commands: Number(profile.activity?.commands || 0),
    last_active_at: profile.metadata?.lastSeenAt || new Date().toISOString(),
  });
  const { error } = await supabase.from("players").upsert(payload, { onConflict: "phone" });

  if (error) throw new Error("Error guardando usuario: " + error.message);

  invalidateUserCache(profile.creatorId);
  return profile;
}

/**
 * @param { creatorId, creatorName = "usuario", registration = {} } - TODO: describe parameter "{ creatorId, creatorName = "usuario", registration = {} }".
 * @param root0
 * @returns
 */
async function getOrCreateProfile({ creatorId, creatorName = "usuario", registration = {} }) {
  /**
   * @constant existing
   */
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

/**
 * @param messageType
 * @returns
 */
function resolveActivityBucket(messageType) {
  /**
   * @constant normalizedType
   */
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

/**
 * @param {
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
} - TODO: describe parameter "{
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
}".
 * @param root0
 * @returns
 */
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
  /**
   * @constant current
   */
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

  /**
   * @constant profile
   */
  const profile = current.profile;
  /**
   * @constant next
   * @type {object}
   */
  const next = {
    ...profile,
    metadata: {
      ...(profile.metadata || {}),
    },
    activity: normalizeActivity(profile.activity || {}),
  };

  /**
   * @constant now
   */
  const now = new Date().toISOString();
  /**
   * @variable changed
   * @type {boolean}
   */
  let changed = false;

  if (typeof displayName === "string") {
    /**
     * @constant cleanDisplayName
     */
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
    /**
     * @constant cleanPushName
     */
    const cleanPushName = pushName.trim() || "usuario";

    if (next.metadata.pushName !== cleanPushName) {
      next.metadata.pushName = cleanPushName;
      changed = true;
    }
  }

  if (typeof senderJid === "string") {
    /**
     * @constant cleanSenderJid
     */
    const cleanSenderJid = String(senderJid).trim() || null;

    if (cleanSenderJid && next.metadata.lastKnownJid !== cleanSenderJid) {
      next.metadata.lastKnownJid = cleanSenderJid;
      changed = true;
    }
  }

  if (typeof senderNumber === "string") {
    /**
     * @constant cleanSenderNumber
     */
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

  /**
   * @constant safeMessageCount
   */
  const safeMessageCount = Math.max(0, Math.floor(Number(messageCount) || 0));
  /**
   * @constant safeCommandCount
   */
  const safeCommandCount = Math.max(0, Math.floor(Number(commandCount) || 0));
  /**
   * @constant bucket
   */
  const bucket = resolveActivityBucket(messageType);
  /**
   * @constant normalizedType
   */
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

/**
 * @param a
 * @param b
 * @returns
 */
function sortActivityProfilesDesc(a, b) {
  /**
   * @constant diffMessages
   */
  const diffMessages = Number(b.activity?.messages || 0) - Number(a.activity?.messages || 0);
  if (diffMessages !== 0) return diffMessages;

  /**
   * @constant diffCommands
   */
  const diffCommands = Number(b.activity?.commands || 0) - Number(a.activity?.commands || 0);
  if (diffCommands !== 0) return diffCommands;

  /**
   * @constant diffText
   */
  const diffText = Number(b.activity?.textMessages || 0) - Number(a.activity?.textMessages || 0);
  if (diffText !== 0) return diffText;

  return String(a.displayName || "").localeCompare(String(b.displayName || ""), "es");
}

/**
 * @param {object} [{ limit = 10, bypassCache = false }]
 * @param root0
 * @returns
 */
async function getTopActiveUsers({ limit = 10, bypassCache = false } = {}) {
  /**
   * @constant cacheKey
   */
  const cacheKey = topActiveUsersCacheKey(limit);
  if (!bypassCache) {
    /**
     * @constant cached
     */
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  /**
   * @constant safeLimit
   */
  const safeLimit = Math.max(1, Math.min(50, Math.floor(Number(limit) || 10)));
  /**
   * @constant profiles
   */
  const profiles = await listUserProfiles(bypassCache);

  /**
   * @constant result
   */
  const result = profiles
    .map((entry) => {
      /**
       * @constant profile
       */
      const profile = entry?.profile || {};
      /**
       * @constant activity
       */
      const activity = normalizeActivity(profile.activity || {});
      /**
       * @constant displayName
       */
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
