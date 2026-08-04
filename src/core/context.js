// @ts-nocheck
const { extractPhoneNumber, normalizeJid } = require("../utils/identityUtils");

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

/**
 * @param {object|null|undefined} message - Message to process
 * @returns {object} - Context object
 */
function unwrapMessageContent(message) {
  if (!message) return {};

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

/**
 * @param {object|null|undefined} message - Message to process
 * @returns {string} - Formatted value
 */
function getMessageType(message) {
  const normalized = unwrapMessageContent(message);

  if (typeof normalized !== "object") {
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

/**
 * @param {string} messageType - Type of message
 * @returns {boolean} - True if text-like
 */
function isTextLikeMessageType(messageType) {
  return TEXT_MESSAGE_TYPES.has(
    String(messageType || "")
      .trim()
      .toLowerCase(),
  );
}

/**
 * @param {object|null|undefined} message - Message to process
 * @returns {string} - Formatted value
 */
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

/**
 * @param {object} sock - Socket instance
 * @param {{ key: { remoteJid: string, participant?: string }, pushName?: string, participant?: string, message?: object }} msg - Message object
 * @returns {object} - Context object
 */
function createContext(sock, msg) {
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith("@g.us");

  const senderJid = isGroup ? msg.key.participant || msg.participant || from : from;

  const senderNumber = extractPhoneNumber(senderJid) || null;
  const senderBareJid = normalizeJid(senderJid);

  const userName = msg.pushName || senderNumber || senderBareJid.split("@")[0];

  const normalizedMessage = unwrapMessageContent(msg.message);
  const contextInfo = Object.values(normalizedMessage).find((content) => content?.contextInfo)?.contextInfo;
  const mentionedJid = Array.isArray(contextInfo?.mentionedJid) ? contextInfo.mentionedJid : [];

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

    /**
     * @param {string|object} content - Content to write
     * @param {object} [options] - Options object
     * @returns {Promise<object>} - Promise resolving to the sent message
     */
    async reply(content, options = {}) {
      if (content && typeof content === "object" && !Array.isArray(content)) {
        const payload = { ...content, ...options };

        if (typeof payload.text !== "string" && typeof payload.content === "string") {
          payload.text = payload.content;
          delete payload.content;
        }

        return sock.sendMessage(from, payload, { quoted: msg });
      }

      return sock.sendMessage(from, { text: content, ...options }, { quoted: msg });
    },

    /**
     * @param {string} emoji - Emoji string
     * @returns {Promise<object>} - Promise resolving to the sent message
     */
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
