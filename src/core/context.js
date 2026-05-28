function extractText(message) {
  if (!message) return "";

  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    message.buttonsResponseMessage?.selectedButtonId ||
    message.listResponseMessage?.singleSelectReply?.selectedRowId ||
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
