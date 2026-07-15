// @ts-nocheck
const { isSameIdentity } = require("./identityUtils");
const { supabase } = require("../database/supabase");

const WARN_SESSION = "warn";
const MAX_WARNS = 5;

async function getWarns(groupId, userId) {
  const { data } = await supabase
    .from("bot_auth_state")
    .select("data")
    .eq("session_id", WARN_SESSION)
    .eq("id", `${groupId}:${userId}`)
    .maybeSingle();
  return data?.data || { count: 0 };
}

async function saveWarns(groupId, userId, warns) {
  await supabase.from("bot_auth_state").upsert(
    {
      session_id: WARN_SESSION,
      id: `${groupId}:${userId}`,
      data: warns,
    },
    { onConflict: "session_id,id" },
  );
}

async function deleteWarns(groupId, userId) {
  await supabase.from("bot_auth_state").delete().eq("session_id", WARN_SESSION).eq("id", `${groupId}:${userId}`);
}

async function addWarn(groupId, userId, warnData) {
  const current = await getWarns(groupId, userId);
  const warns = current.warns || [];
  warns.push({ ...warnData, timestamp: new Date().toISOString() });
  await saveWarns(groupId, userId, { count: current.count + 1, warns });
}

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

  const participant = metadata.participants.find((p) => participantMatches(p, user));

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

  const botId = sock?.user?.id || sock?.user?.jid || sock?.user?.wid || sock?.user?.userId || "";

  const participant = metadata.participants.find((p) => participantMatches(p, botId));

  if (!participant) {
    return false;
  }

  return participant.admin === "admin" || participant.admin === "superadmin";
}

// =========================
// GROUP MANAGEMENT
// =========================

async function addParticipant(sock, jid, identifier) {
  try {
    const result = await sock.groupParticipantsAdd(jid, [identifier]);
    return result?.[0]?.message || "Usuario añadido correctamente.";
  } catch (err) {
    throw new Error(err?.message || "Error al añadir usuario", { cause: err });
  }
}

async function removeParticipant(sock, jid, participantJid) {
  try {
    const result = await sock.groupParticipantsUpdate(jid, [participantJid], "remove");
    return result?.[0]?.message || "Usuario expulsado correctamente.";
  } catch (err) {
    throw new Error(err?.message || "Error al expulsar usuario", { cause: err });
  }
}

async function promoteToAdmin(sock, jid, participantJid) {
  await sock.groupParticipantsUpdate(jid, [participantJid], "promote");
}

async function demoteFromAdmin(sock, jid, participantJid) {
  await sock.groupParticipantsUpdate(jid, [participantJid], "demote");
}

async function getInviteCode(sock, jid) {
  const code = await sock.groupInviteCode(jid);
  return `https://chat.whatsapp.com/${code}`;
}

async function openGroup(sock, jid) {
  await sock.groupSettingUpdate(jid, "not_announcement");
}

async function closeGroup(sock, jid) {
  await sock.groupSettingUpdate(jid, "announcement");
}

async function deleteWarn(groupId, userId) {
  const current = await getWarns(groupId, userId);
  const warns = current.warns || [];
  warns.pop();
  if (warns.length === 0) {
    await deleteWarns(groupId, userId);
  } else {
    await saveWarns(groupId, userId, { count: warns.length, warns });
  }
}

module.exports = {
  MAX_WARNS,
  getGroupMetadata,
  isOnGroup,
  isAdmin,
  isBotAdmin,
  getWarns,
  addWarn,
  deleteWarn,
  addParticipant,
  removeParticipant,
  promoteToAdmin,
  demoteFromAdmin,
  getInviteCode,
  openGroup,
  closeGroup,
};
