const {
  extractPhoneNumber,
  normalizeJid,
} = require("../utils/identityUtils");
const { injectPersonality } = require("../services/rpg/nekomaidVoice");

const TEXT_MESSAGE_TYPES = new Set([
  "conversation",
  "extendedtextmessage",
  "imagemessage",
  "videomessage",
  "buttonsresponsemessage",
  "listresponsemessage",
  "templatebuttonreplymessage",
  "interactiveresponsemessage",
  "messagecontextinfo",
]);

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

function getMessageType(message) {
  const normalized = unwrapMessageContent(message);

  if (!normalized || typeof normalized !== "object") {
    return "unknown";
  }

  const keys = [
    "conversation",
    "extendedTextMessage",
    "imageMessage",
    "videoMessage",
    "stickerMessage",
    "audioMessage",
    "documentMessage",
    "reactionMessage",
    "buttonsResponseMessage",
    "listResponseMessage",
    "templateButtonReplyMessage",
    "interactiveResponseMessage",
    "protocolMessage",
    "messageContextInfo",
  ];

  for (const key of keys) {
    if (normalized[key]) {
      return key;
    }
  }

  return Object.keys(normalized)[0] || "unknown";
}

function isTextLikeMessageType(messageType) {
  return TEXT_MESSAGE_TYPES.has(String(messageType || "").trim().toLowerCase());
}

function extractText(message) {
  if (!message) return "";

  const normalized = unwrapMessageContent(message);

  const text =
    normalized.conversation ||
    normalized.extendedTextMessage?.text ||
    normalized.imageMessage?.caption ||
    normalized.videoMessage?.caption ||
    normalized.buttonsResponseMessage?.selectedButtonId ||
    normalized.listResponseMessage?.singleSelectReply?.selectedRowId ||
    normalized.templateButtonReplyMessage?.selectedId ||
    normalized.interactiveResponseMessage?.body?.text ||
    normalized.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ||
    "";

  return String(text).trim();
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

  const messageType = getMessageType(msg.message);
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
    messageType,
    isTextLike: isTextLikeMessageType(messageType),
    hasText: Boolean(text),
    mentionedJid,

    async reply(content, options = {}) {
      if (content && typeof content === "object" && !Array.isArray(content)) {
        const payload = {
          ...content,
          ...options,
        };

        if (typeof payload.text !== "string" && typeof payload.content === "string") {
          payload.text = payload.content;
          delete payload.content;
        }

        return sock.sendMessage(from, payload, { quoted: msg });
      }

      if (typeof content === "string") {
        const isFormatted = /[━━╭╰╮╯├┤└┘┌┐]/.test(content) || content.length > 300 || content.startsWith("❌") || content.startsWith("✅");
        if (!isFormatted) {
          content = injectPersonality(content);
        }
      }

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
