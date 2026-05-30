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

  const sender = isGroup
    ? msg.key.participant || msg.participant || from
    : from;

  const userName = msg.pushName || sender.split("@")[0];

  const mentionedJid =
    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  const text = extractText(msg.message);

  return {
    sock,
    msg,
    from,
    sender,
    userId: sender,
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
