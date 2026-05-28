async function getGroupMetadata(sock, jid) {
  try {
    return await sock.groupMetadata(jid);
  } catch {
    return null;
  }
}

// =========================
// USER ADMIN
// =========================

async function isAdmin(sock, jid, user) {
  const metadata = await getGroupMetadata(sock, jid);

  if (!metadata) return false;

  const participant = metadata.participants.find((p) => p.id === user);

  if (!participant) return false;

  return participant.admin === "admin" || participant.admin === "superadmin";
}

// =========================
// BOT ADMIN
// =========================

async function isBotAdmin(sock, jid) {
  const metadata = await getGroupMetadata(sock, jid);

  if (!metadata) return false;

  const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";

  const participant = metadata.participants.find((p) => p.id === botId);

  if (!participant) return false;

  return participant.admin === "admin" || participant.admin === "superadmin";
}

module.exports = {
  getGroupMetadata,
  isAdmin,
  isBotAdmin,
};
