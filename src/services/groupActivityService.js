const { GROUP_TOP_LIMIT } = require("../config/groupConfig");
const { supabase } = require("../database/supabase");
const { safeSingleOrNull, groupCacheKey, topGroupMembersCacheKey, topActiveUsersCacheKey, invalidateGroupCache, invalidateTopActiveUsersCache, TTLS, cache } = require("../utils/safeQuery");

function sanitizeGroupId(groupId) {
  return String(groupId || "")
    .trim()
    .toLowerCase()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_") || "grupo";
}

function buildDefaultGroupRecord({ groupId, groupName = "" }) {
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

function normalizeGroupRecord(record, { groupId, groupName = "" }) {
  const now = new Date().toISOString();
  const base = buildDefaultGroupRecord({ groupId, groupName });

  const normalized = {
    ...base,
    ...(record || {}),
  };

  normalized.groupId = normalized.groupId || groupId;
  normalized.groupName = String(groupName || normalized.groupName || "").trim() || null;
  normalized.createdAt = normalized.createdAt || now;
  normalized.updatedAt = normalized.updatedAt || now;

  normalized.totals = {
    ...base.totals,
    ...(record?.totals || {}),
  };

  normalized.members = normalized.members && typeof normalized.members === "object"
    ? normalized.members
    : {};

  return normalized;
}

function resolveBucket(messageType) {
  const normalized = String(messageType || "").trim().toLowerCase();

  if (normalized.includes("sticker")) return "stickerMessages";
  if (normalized.includes("audio")) return "audioMessages";
  if (normalized.includes("image")) return "imageMessages";
  if (normalized.includes("video")) return "videoMessages";
  if (normalized.includes("document")) return "documentMessages";
  if (normalized.includes("reaction")) return "reactionMessages";

  return null;
}

async function getGroupActivity(groupId, bypassCache = false) {
  if (!groupId) return null;
  const cacheKey = groupCacheKey(groupId);
  if (!bypassCache) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  const group = await safeSingleOrNull(
    supabase.from('groups').select('*').eq('group_jid', groupId)
  );
  if (!group) return null;

  const { data: members } = await supabase.from('group_members').select('*, players(username)').eq('group_id', group.id);
  
  const record = buildDefaultGroupRecord({ groupId, groupName: group.group_name });
  record.totals.messages = group.total_messages;
  
  if (members) {
    for (const m of members) {
      record.members[m.player_phone] = {
        memberId: m.player_phone,
        memberName: m.players?.username || "usuario",
        messages: m.messages_count,
        textMessages: 0, 
        mediaMessages: 0
      };
    }
  }

  cache.set(cacheKey, record, TTLS.memoryContext);
  return record;
}

async function ensureGroupActivity({ groupId, groupName = "" }) {
  if (!groupId) throw new Error("Falta el identificador del grupo.");
  let record = await getGroupActivity(groupId);
  if (!record) {
    record = buildDefaultGroupRecord({ groupId, groupName });
    await saveGroupActivity(record);
  }
  return record;
}

async function saveGroupActivity(record) {
  const { supabase } = require("../database/supabase");
  const { data: group, error } = await supabase.from('groups').upsert({
    group_jid: record.groupId,
    group_name: record.groupName,
    total_messages: record.totals.messages
  }, { onConflict: 'group_jid' }).select('id').single();

  if (error || !group) {
    throw new Error("Error guardando grupo: " + (error?.message || "upsert falló"));
  }

  for (const member of Object.values(record.members)) {
    const { error: memberError } = await supabase.from('group_members').upsert({
      group_id: group.id,
      player_phone: member.memberId,
      messages_count: member.messages
    });
    if (memberError) throw new Error("Error guardando miembro: " + memberError.message);
  }

  invalidateGroupCache(record.groupId);
}

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

  const record = await ensureGroupActivity({ groupId, groupName });
  const now = new Date().toISOString();

  const safeMessageCount = Math.max(0, Math.floor(Number(messageCount) || 0));
  const bucket = resolveBucket(messageType);
  const normalizedType = String(messageType || "unknown").trim().toLowerCase() || "unknown";
  const cleanMemberId = String(memberId || "").trim() || "desconocido";
  const cleanMemberName = String(memberName || "usuario").trim() || "usuario";

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

async function getTopGroupMembers({
  groupId,
  limit = GROUP_TOP_LIMIT,
  bypassCache = false,
}) {
  const cacheKey = topGroupMembersCacheKey(groupId, limit);
  if (!bypassCache) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  const record = await getGroupActivity(groupId, bypassCache);

  if (!record) {
    return [];
  }

  const safeLimit = Math.max(1, Math.min(50, Math.floor(Number(limit) || GROUP_TOP_LIMIT)));
  const members = Object.values(record.members || {});

  const result = members
    .sort((a, b) => {
      const diffMessages = Number(b.messages || 0) - Number(a.messages || 0);
      if (diffMessages !== 0) return diffMessages;

      const diffText = Number(b.textMessages || 0) - Number(a.textMessages || 0);
      if (diffText !== 0) return diffText;

      return String(a.memberName || "").localeCompare(String(b.memberName || ""), "es");
    })
    .slice(0, safeLimit);

  cache.set(cacheKey, result, TTLS.memoryContext);
  return result;
}

async function getGroupMemberActivity({ groupId, memberId }) {
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
  recordGroupActivity,
};
