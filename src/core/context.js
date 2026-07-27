// @ts-nocheck
const { extractPhoneNumber, normalizeJid } = require("../utils/identityUtils");

/**
 * @constant TEXT_MESSAGE_TYPES
 * @type {Set}
 */
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
 * @param {object|null|undefined} message - - Message to process.
 * @returns {object} - Context object.
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
 * @param {object|null|undefined} message - - Message to process.
 * @returns {string} - Formatted value.
 */
function getMessageType(message) {
  /**
   * @constant normalized
   */
  const normalized = unwrapMessageContent(message);

  if (typeof normalized !== "object") {
    return "unknown";
  }

  /**
   * @constant keys
   * @type {*[]}
   */
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
 * @param {string} messageType - - Type of message.
 * @returns {boolean} - True if text-like.
 */
function isTextLikeMessageType(messageType) {
  return TEXT_MESSAGE_TYPES.has(
    String(messageType || "")
      .trim()
      .toLowerCase(),
  );
}

/**
 * @param {object|null|undefined} message - - Message to process.
 * @returns {string} - Formatted value.
 */
function extractText(message) {
  if (!message) return "";

  /**
   * @constant normalized
   */
  const normalized = unwrapMessageContent(message);

  /**
   * @constant text
   */
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
 * @param {object} options
 * @param {object} options
 * @param {*} sock
 * @param {*} msg
 * @returns {object} - Context object.
 */
function createContext(sock, msg) {
  /**
   * @constant from
   */
  const from = msg.key.remoteJid;
  /**
   * @constant isGroup
   */
  const isGroup = from.endsWith("@g.us");

  /**
   * @constant senderJid
   */
  const senderJid = isGroup ? msg.key.participant || msg.participant || from : from;

  /**
   * @constant senderNumber
   */
  const senderNumber = extractPhoneNumber(senderJid) || null;
  /**
   * @constant senderBareJid
   */
  const senderBareJid = normalizeJid(senderJid);

  /**
   * @constant userName
   */
  const userName = msg.pushName || senderNumber || senderBareJid.split("@")[0];

  /**
   * @constant mentionedJid
   */
  const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  /**
   * @constant messageType
   */
  const messageType = getMessageType(msg.message);
  /**
   * @constant text
   */
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
        /**
         * @constant payload
         * @type {object}
         */
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
