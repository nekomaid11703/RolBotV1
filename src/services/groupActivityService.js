const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const { GROUP_ACTIVITY_ROOT, GROUP_TOP_LIMIT } = require("../config/groupConfig");

function ensureDir(dir) {
  return fsp.mkdir(dir, { recursive: true });
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

function sanitizeGroupId(groupId) {
  return String(groupId || "")
    .trim()
    .toLowerCase()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_") || "grupo";
}

function groupFolderPath(groupId) {
  return path.join(GROUP_ACTIVITY_ROOT, sanitizeGroupId(groupId));
}

function groupFilePath(groupId) {
  return path.join(groupFolderPath(groupId), "activity.json");
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

async function getGroupActivity(groupId) {
  if (!groupId) {
    return null;
  }

  await ensureDir(GROUP_ACTIVITY_ROOT);

  const file = groupFilePath(groupId);
  const stored = await readJson(file, null);

  if (!stored) {
    return null;
  }

  return normalizeGroupRecord(stored, {
    groupId,
    groupName: stored.groupName || "",
  });
}

async function ensureGroupActivity({ groupId, groupName = "" }) {
  if (!groupId) {
    throw new Error("Falta el identificador del grupo.");
  }

  await ensureDir(GROUP_ACTIVITY_ROOT);

  const file = groupFilePath(groupId);
  const stored = await readJson(file, null);

  const record = stored
    ? normalizeGroupRecord(stored, { groupId, groupName })
    : buildDefaultGroupRecord({ groupId, groupName });

  if (!stored || JSON.stringify(stored) !== JSON.stringify(record)) {
    await writeJson(file, record);
  }

  return record;
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
    await writeJson(groupFilePath(groupId), record);
  }

  return record;
}

async function getTopGroupMembers({
  groupId,
  limit = GROUP_TOP_LIMIT,
}) {
  const record = await getGroupActivity(groupId);

  if (!record) {
    return [];
  }

  const safeLimit = Math.max(1, Math.min(50, Math.floor(Number(limit) || GROUP_TOP_LIMIT)));
  const members = Object.values(record.members || {});

  return members
    .sort((a, b) => {
      const diffMessages = Number(b.messages || 0) - Number(a.messages || 0);
      if (diffMessages !== 0) return diffMessages;

      const diffText = Number(b.textMessages || 0) - Number(a.textMessages || 0);
      if (diffText !== 0) return diffText;

      return String(a.memberName || "").localeCompare(String(b.memberName || ""), "es");
    })
    .slice(0, safeLimit);
}

async function getGroupMemberActivity({ groupId, memberId }) {
  const record = await getGroupActivity(groupId);

  if (!record || !memberId) {
    return null;
  }

  return record.members[String(memberId).trim()] || null;
}

module.exports = {
  GROUP_ACTIVITY_ROOT,
  GROUP_TOP_LIMIT,
  buildDefaultGroupRecord,
  ensureGroupActivity,
  getGroupActivity,
  getGroupMemberActivity,
  getTopGroupMembers,
  recordGroupActivity,
};
