const {
  extractPhoneNumber,
  normalizeJid,
} = require("../utils/identityUtils");

function unwrapMessageContent(message) {
  if (!message) return null;

  if (message.ephemeralMessage?.message) {
    return unwrapMessageContent(message.ephemeralMessage.message);
  }

  if (message.viewOnceMessage?.message) {
    return unwrapMessageContent(message.viewOnceMessage.message);
  }

  if (message.viewOnceMessageV2?.message) {
    return unwrapMessageContent(message.viewOnceMessageV2.message);
  }

  if (message.viewOnceMessageV2Extension?.message) {
    return unwrapMessageContent(message.viewOnceMessageV2Extension.message);
  }

  return message;
}

function extractText(message) {
  if (!message) return "";

  const normalized = unwrapMessageContent(message);

  return (
    normalized.conversation ||
    normalized.extendedTextMessage?.text ||
    normalized.imageMessage?.caption ||
    normalized.videoMessage?.caption ||
    normalized.buttonsResponseMessage?.selectedButtonId ||
    normalized.listResponseMessage?.singleSelectReply?.selectedRowId ||
    ""
  ).trim();
}

function createContext(sock, msg) {
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith("@g.us");

  const senderJid = isGroup
    ? msg.key.participant || msg.participant || from
    : from;

  const senderNumber = extractPhoneNumber(senderJid) || null;
  const senderBareJid = normalizeJid(senderJid);

  const userName = msg.pushName || senderNumber || senderBareJid.split("@")[0];

  const mentionedJid =
    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  const text = extractText(msg.message);

  return {
    sock,
    msg,
    from,
    chatJid: from,
    sender: senderJid,
    senderJid,
    senderNumber,
    senderBareJid,
    userId: senderJid,
    userName,
    isGroup,
    text,
    mentionedJid,

    async reply(content, options = {}) {
      return sock.sendMessage(
        from,
        { text: content, ...options },
        { quoted: msg },
      );
    },

    async react(emoji) {
      return sock.sendMessage(from, {
        react: {
          text: emoji,
          key: msg.key,
        },
      });
    },
  };
}

module.exports = createContext;
