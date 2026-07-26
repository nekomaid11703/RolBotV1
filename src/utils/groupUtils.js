// @ts-nocheck
const { isSameIdentity } = require("./identityUtils");
const { supabase } = require("../database/supabase");

/**
 * @constant WARN_SESSION
 * @type {string}
 */
const WARN_SESSION = "warn";
/**
 * @constant MAX_WARNS
 * @type {number}
 */
const MAX_WARNS = 5;

/**
 * Returns the warns.
 * @param groupId - - group unique identifier.
 * @param userId - - user unique identifier.
 * @returns
 * @async
 */
async function getWarns(groupId, userId) {
  const { data } = await supabase
    .from("bot_auth_state")
    .select("data")
    .eq("session_id", WARN_SESSION)
    .eq("id", `${groupId}:${userId}`)
    .maybeSingle();
  return data?.data || { count: 0 };
}

/**
 * Saves the warns.
 * @param groupId - - group unique identifier.
 * @param userId - - user unique identifier.
 * @param warns - - warns.
 * @async
 */
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

/**
 * Deletes the warns.
 * @param groupId - - group unique identifier.
 * @param userId - - user unique identifier.
 * @async
 */
async function deleteWarns(groupId, userId) {
  await supabase.from("bot_auth_state").delete().eq("session_id", WARN_SESSION).eq("id", `${groupId}:${userId}`);
}

/**
 * Adds the warn.
 * @param groupId - - group unique identifier.
 * @param userId - - user unique identifier.
 * @param warnData - - warn input data.
 * @async
 */
async function addWarn(groupId, userId, warnData) {
  /**
   * @constant current
   */
  const current = await getWarns(groupId, userId);
  /**
   * @constant warns
   */
  const warns = current.warns || [];
  warns.push({ ...warnData, timestamp: new Date().toISOString() });
  await saveWarns(groupId, userId, { count: current.count + 1, warns });
}

/**
 * Returns the group metadata.
 * @param sock - - sock.
 * @param jid - - jid.
 * @returns
 * @async
 */
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

/**
 * Returns whether the on is group.
 * @param jid - - jid.
 * @returns
 */
function isOnGroup(jid) {
  return String(jid || "")
    .trim()
    .toLowerCase()
    .endsWith("@g.us");
}

/**
 * Participant matches.
 * @param participant - - participant.
 * @param user - - user object.
 * @returns
 */
function participantMatches(participant, user) {
  if (!participant || !user) {
    return false;
  }

  /**
   * @constant participantId
   */
  const participantId = participant.id || participant.jid || participant.userId;
  return isSameIdentity(participantId, user);
}

// =========================
// USER ADMIN
// =========================

/**
 * Returns whether it is admin.
 * @param sock - - sock.
 * @param jid - - jid.
 * @param user - - user object.
 * @returns
 * @async
 */
async function isAdmin(sock, jid, user) {
  /**
   * @constant metadata
   */
  const metadata = await getGroupMetadata(sock, jid);

  if (!metadata || !Array.isArray(metadata.participants)) {
    return false;
  }

  /**
   * @constant participant
   */
  const participant = metadata.participants.find((p) => participantMatches(p, user));

  if (!participant) {
    return false;
  }

  return participant.admin === "admin" || participant.admin === "superadmin";
}

// =========================
// BOT ADMIN
// =========================

/**
 * Returns whether the bot is admin.
 * @param sock - - sock.
 * @param jid - - jid.
 * @returns
 * @async
 */
async function isBotAdmin(sock, jid) {
  /**
   * @constant metadata
   */
  const metadata = await getGroupMetadata(sock, jid);

  if (!metadata || !Array.isArray(metadata.participants)) {
    return false;
  }

  /**
   * @constant botId
   */
  const botId = sock?.user?.id || sock?.user?.jid || sock?.user?.wid || sock?.user?.userId || "";

  /**
   * @constant participant
   */
  const participant = metadata.participants.find((p) => participantMatches(p, botId));

  if (!participant) {
    return false;
  }

  return participant.admin === "admin" || participant.admin === "superadmin";
}

// =========================
// GROUP MANAGEMENT
// =========================

/**
 * Adds the participant.
 * @param sock - - sock.
 * @param jid - - jid.
 * @param identifier - - identifier.
 * @throws {Error}
 * @returns
 * @async
 */
async function addParticipant(sock, jid, identifier) {
  try {
    /**
     * @constant result
     */
    const result = await sock.groupParticipantsAdd(jid, [identifier]);
    return result?.[0]?.message || "Usuario añadido correctamente.";
  } catch (err) {
    throw new Error(err?.message || "Error al añadir usuario", { cause: err });
  }
}

/**
 * Removes the participant.
 * @param sock - - sock.
 * @param jid - - jid.
 * @param participantJid - - participant jid.
 * @throws {Error}
 * @returns
 * @async
 */
async function removeParticipant(sock, jid, participantJid) {
  try {
    /**
     * @constant result
     */
    const result = await sock.groupParticipantsUpdate(jid, [participantJid], "remove");
    return result?.[0]?.message || "Usuario expulsado correctamente.";
  } catch (err) {
    throw new Error(err?.message || "Error al expulsar usuario", { cause: err });
  }
}

/**
 * Promote to admin.
 * @param sock - - sock.
 * @param jid - - jid.
 * @param participantJid - - participant jid.
 * @async
 */
async function promoteToAdmin(sock, jid, participantJid) {
  await sock.groupParticipantsUpdate(jid, [participantJid], "promote");
}

/**
 * Demote from admin.
 * @param sock - - sock.
 * @param jid - - jid.
 * @param participantJid - - participant jid.
 * @async
 */
async function demoteFromAdmin(sock, jid, participantJid) {
  await sock.groupParticipantsUpdate(jid, [participantJid], "demote");
}

/**
 * Returns the invite code.
 * @param sock - - sock.
 * @param jid - - jid.
 * @returns
 * @async
 */
async function getInviteCode(sock, jid) {
  /**
   * @constant code
   */
  const code = await sock.groupInviteCode(jid);
  return `https://chat.whatsapp.com/${code}`;
}

/**
 * Opens the group.
 * @param sock - - sock.
 * @param jid - - jid.
 * @async
 */
async function openGroup(sock, jid) {
  await sock.groupSettingUpdate(jid, "not_announcement");
}

/**
 * Closes the group.
 * @param sock - - sock.
 * @param jid - - jid.
 * @async
 */
async function closeGroup(sock, jid) {
  await sock.groupSettingUpdate(jid, "announcement");
}

/**
 * Deletes the warn.
 * @param groupId - - group unique identifier.
 * @param userId - - user unique identifier.
 * @async
 */
async function deleteWarn(groupId, userId) {
  /**
   * @constant current
   */
  const current = await getWarns(groupId, userId);
  /**
   * @constant warns
   */
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
