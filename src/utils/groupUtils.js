const {
  isSameIdentity,
  normalizeJid,
} = require("./identityUtils");

async function getGroupMetadata(sock, jid) {
  try {
    if (!jid || typeof jid !== "string" || !jid.endsWith("@g.us")) {
      return null;
    }

    return await sock.groupMetadata(jid);
  } catch {
    return null;
  }
}

function isOnGroup(jid) {
  return String(jid || "")
    .trim()
    .toLowerCase()
    .endsWith("@g.us");
}

function participantMatches(participant, user) {
  if (!participant || !user) {
    return false;
  }

  const participantId = participant.id || participant.jid || participant.userId;
  return isSameIdentity(participantId, user);
}

// =========================
// USER ADMIN
// =========================

async function isAdmin(sock, jid, user) {
  const metadata = await getGroupMetadata(sock, jid);

  if (!metadata || !Array.isArray(metadata.participants)) {
    return false;
  }

  const participant = metadata.participants.find((p) =>
    participantMatches(p, user),
  );

  if (!participant) {
    return false;
  }

  return participant.admin === "admin" || participant.admin === "superadmin";
}

// =========================
// BOT ADMIN
// =========================

async function isBotAdmin(sock, jid) {
  const metadata = await getGroupMetadata(sock, jid);

  if (!metadata || !Array.isArray(metadata.participants)) {
    return false;
  }

  const botId =
    sock?.user?.id ||
    sock?.user?.jid ||
    sock?.user?.wid ||
    sock?.user?.userId ||
    "";

  const participant = metadata.participants.find((p) =>
    participantMatches(p, botId),
  );

  if (!participant) {
    return false;
  }

  return participant.admin === "admin" || participant.admin === "superadmin";
}

module.exports = {
  getGroupMetadata,
  isOnGroup,
  isAdmin,
  isBotAdmin,
};
