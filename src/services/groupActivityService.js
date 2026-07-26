// @ts-nocheck
const { GROUP_TOP_LIMIT } = require("../config/groupConfig");
const { supabase } = require("../database/supabase");
const { filterExisting } = require("../database/columnRegistry");
const { safeSingleOrNull } = require("../utils/safeQuery");
const { cache, TTLS } = require("../utils/cacheService");

/**
 * @param groupId
 * @returns
 */
function groupCacheKey(groupId) {
  return `group:${groupId}`;
}

/**
 * @param groupId
 * @param limit
 * @returns
 */
function topGroupMembersCacheKey(groupId, limit) {
  return `topGroupMembers:${groupId}:${limit}`;
}

/**
 * @param groupId
 */
function invalidateGroupCache(groupId) {
  /**
   * @constant key
   */
  const key = groupCacheKey(groupId);
  cache.invalidate((k) => k === key || k.startsWith(`group:${groupId}`) || k.startsWith(`topGroupMembers:${groupId}`));
}

/**
 * @param { groupId, groupName = "" } - TODO: describe parameter "{ groupId, groupName = "" }".
 * @param root0
 * @returns
 */
function buildDefaultGroupRecord({ groupId, groupName = "" }) {
  /**
   * @constant now
   */
  const now = new Date().toISOString();

  return {
    groupId,
    groupName: String(groupName || "").trim() || null,
    createdAt: now,
    updatedAt: now,
    totals: {
      messages: 0,
      textMessages: 0,
      mediaMessages: 0,
      stickerMessages: 0,
      audioMessages: 0,
      imageMessages: 0,
      videoMessages: 0,
      documentMessages: 0,
      reactionMessages: 0,
    },
    members: {},
  };
}

/**
 * @param messageType
 * @returns
 */
function resolveBucket(messageType) {
  /**
   * @constant normalized
   */
  const normalized = String(messageType || "")
    .trim()
    .toLowerCase();

  if (normalized.includes("sticker")) return "stickerMessages";
  if (normalized.includes("audio")) return "audioMessages";
  if (normalized.includes("image")) return "imageMessages";
  if (normalized.includes("video")) return "videoMessages";
  if (normalized.includes("document")) return "documentMessages";
  if (normalized.includes("reaction")) return "reactionMessages";

  return null;
}

/**
 * @param groupId
 * @param [bypassCache]
 * @returns
 */
async function getGroupActivity(groupId, bypassCache = false) {
  if (!groupId) return null;
  /**
   * @constant cacheKey
   */
  const cacheKey = groupCacheKey(groupId);
  if (!bypassCache) {
    /**
     * @constant cached
     */
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  /**
   * @constant group
   */
  const group = await safeSingleOrNull(supabase.from("groups").select("*").eq("group_jid", groupId));
  if (!group) return null;
  const { data: members } = await supabase
    .from("group_members")
    .select("*, players(username)")
    .eq("group_id", group.id);

  /**
   * @constant record
   */
  const record = buildDefaultGroupRecord({ groupId, groupName: group.group_name });
  record.totals.messages = group.total_messages;

  if (members) {
    for (const m of members) {
      record.members[m.player_phone] = {
        memberId: m.player_phone,
        memberName: m.players?.username || "usuario",
        messages: m.messages_count,
        textMessages: 0,
        mediaMessages: 0,
      };
    }
  }

  cache.set(cacheKey, record, TTLS.memoryContext);
  return record;
}

/**
 * @param { groupId, groupName = "" } - TODO: describe parameter "{ groupId, groupName = "" }".
 * @param root0
 * @returns
 */
async function ensureGroupActivity({ groupId, groupName = "" }) {
  if (!groupId) throw new Error("Falta el identificador del grupo.");
  /**
   * @variable record
   * @type {any}
   */
  let record = await getGroupActivity(groupId);
  if (!record) {
    record = buildDefaultGroupRecord({ groupId, groupName });
    await saveGroupActivity(record);
  }
  return record;
}

/**
 * @param record
 */
async function saveGroupActivity(record) {
  const { supabase } = require("../database/supabase");
  /**
   * @constant groupPayload
   */
  const groupPayload = filterExisting("groups", {
    group_jid: record.groupId,
    group_name: record.groupName,
    total_messages: record.totals.messages,
  });
  const { data: group, error } = await supabase
    .from("groups")
    .upsert(groupPayload, { onConflict: "group_jid" })
    .select("id")
    .single();

  if (error || !group) {
    throw new Error("Error guardando grupo: " + (error?.message || "upsert falló"));
  }

  for (const member of Object.values(record.members)) {
    /**
     * @constant memberPayload
     */
    const memberPayload = filterExisting("group_members", {
      group_id: group.id,
      player_phone: member.memberId,
      messages_count: member.messages,
    });
    const { error: memberError } = await supabase.from("group_members").upsert(memberPayload);
    if (memberError) throw new Error("Error guardando miembro: " + memberError.message);
  }

  invalidateGroupCache(record.groupId);
}

/**
 * @param {
  groupId,
  groupName = "",
  memberId,
  memberName = "usuario",
  messageType = "unknown",
  messageCount = 0,
  isText = false,
} - TODO: describe parameter "{
  groupId,
  groupName = "",
  memberId,
  memberName = "usuario",
  messageType = "unknown",
  messageCount = 0,
  isText = false,
}".
 * @param root0
 * @returns
 */
async function recordGroupActivity({
  groupId,
  groupName = "",
  memberId,
  memberName = "usuario",
  messageType = "unknown",
  messageCount = 0,
  isText = false,
}) {
  if (!groupId) {
    return null;
  }

  /**
   * @constant record
   */
  const record = await ensureGroupActivity({ groupId, groupName });
  /**
   * @constant now
   */
  const now = new Date().toISOString();

  /**
   * @constant safeMessageCount
   */
  const safeMessageCount = Math.max(0, Math.floor(Number(messageCount) || 0));
  /**
   * @constant bucket
   */
  const bucket = resolveBucket(messageType);
  /**
   * @constant normalizedType
   */
  const normalizedType =
    String(messageType || "unknown")
      .trim()
      .toLowerCase() || "unknown";
  /**
   * @constant cleanMemberId
   */
  const cleanMemberId = String(memberId || "").trim() || "desconocido";
  /**
   * @constant cleanMemberName
   */
  const cleanMemberName = String(memberName || "usuario").trim() || "usuario";

  /**
   * @variable changed
   * @type {boolean}
   */
  let changed = false;

  if (safeMessageCount > 0) {
    record.totals.messages = Number(record.totals.messages || 0) + safeMessageCount;

    if (isText) {
      record.totals.textMessages = Number(record.totals.textMessages || 0) + safeMessageCount;
    } else if (bucket !== "reactionMessages") {
      record.totals.mediaMessages = Number(record.totals.mediaMessages || 0) + safeMessageCount;
    }

    if (bucket) {
      record.totals[bucket] = Number(record.totals[bucket] || 0) + safeMessageCount;
    }

    /**
     * @variable member
     * @type {any}
     */
    let member = record.members[cleanMemberId];

    if (!member) {
      member = record.members[cleanMemberId] = {
        memberId: cleanMemberId,
        memberName: cleanMemberName,
        messages: 0,
        textMessages: 0,
        mediaMessages: 0,
        stickerMessages: 0,
        audioMessages: 0,
        imageMessages: 0,
        videoMessages: 0,
        documentMessages: 0,
        reactionMessages: 0,
        firstSeenAt: now,
        lastSeenAt: now,
        lastMessageType: normalizedType,
      };
    }

    member.memberName = cleanMemberName || member.memberName || "usuario";
    member.messages = Number(member.messages || 0) + safeMessageCount;
    if (isText) {
      member.textMessages = Number(member.textMessages || 0) + safeMessageCount;
    } else if (bucket !== "reactionMessages") {
      member.mediaMessages = Number(member.mediaMessages || 0) + safeMessageCount;
    }
    member.lastSeenAt = now;
    member.lastMessageType = normalizedType;

    if (bucket) {
      member[bucket] = Number(member[bucket] || 0) + safeMessageCount;
    }

    changed = true;
  }

  if (changed) {
    record.updatedAt = now;
    await saveGroupActivity(record);
  }

  return record;
}

/**
 * @param { groupId, limit = GROUP_TOP_LIMIT, bypassCache = false }
 * @param root0
 * @returns
 */
async function getTopGroupMembers({ groupId, limit = GROUP_TOP_LIMIT, bypassCache = false }) {
  /**
   * @constant cacheKey
   */
  const cacheKey = topGroupMembersCacheKey(groupId, limit);
  if (!bypassCache) {
    /**
     * @constant cached
     */
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  /**
   * @constant record
   */
  const record = await getGroupActivity(groupId, bypassCache);

  if (!record) {
    return [];
  }

  /**
   * @constant safeLimit
   */
  const safeLimit = Math.max(1, Math.min(50, Math.floor(Number(limit) || GROUP_TOP_LIMIT)));
  /**
   * @constant members
   */
  const members = Object.values(record.members || {});

  /**
   * @constant result
   */
  const result = members
    .sort((a, b) => {
      /**
       * @constant diffMessages
       */
      const diffMessages = Number(b.messages || 0) - Number(a.messages || 0);
      if (diffMessages !== 0) return diffMessages;

      /**
       * @constant diffText
       */
      const diffText = Number(b.textMessages || 0) - Number(a.textMessages || 0);
      if (diffText !== 0) return diffText;

      return String(a.memberName || "").localeCompare(String(b.memberName || ""), "es");
    })
    .slice(0, safeLimit);

  cache.set(cacheKey, result, TTLS.memoryContext);
  return result;
}

/**
 * @param { groupId, memberId }
 * @param root0
 * @returns
 */
async function getGroupMemberActivity({ groupId, memberId }) {
  /**
   * @constant record
   */
  const record = await getGroupActivity(groupId);

  if (!record || !memberId) {
    return null;
  }

  return record.members[String(memberId).trim()] || null;
}

module.exports = {
  GROUP_TOP_LIMIT,
  buildDefaultGroupRecord,
  ensureGroupActivity,
  getGroupActivity,
  getGroupMemberActivity,
  getTopGroupMembers,
  getGroupTopActiveUsers: getTopGroupMembers,
  recordGroupActivity,
};
