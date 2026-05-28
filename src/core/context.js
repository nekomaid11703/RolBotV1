const { proto } = require("@whiskeysockets/baileys");

function getMessageText(message) {
  if (!message) return "";

  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    ""
  ).trim();
}

function createContext(sock, msg) {
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith("@g.us");
  const sender = isGroup ? msg.key.participant || msg.participant : from;

  const text = getMessageText(msg.message);

  return {
    sock,
    msg,
    from,
    sender,
    isGroup,
    text,
    async reply(content, options = {}) {
      return sock.sendMessage(
        from,
        {
          text: content,
          ...options,
        },
        {
          quoted: msg,
        },
      );
    },
    react(emoji) {
      return sock.sendMessage(from, {
        react: { text: emoji, key: msg.key },
      });
    },
    get quotedMsg() {
      const quoted =
        msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      return quoted ? proto.Message.fromObject(quoted) : null;
    },
  };
}

module.exports = { createContext, getMessageText };
