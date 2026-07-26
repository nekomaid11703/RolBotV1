// @ts-nocheck
/**
 * @constant createContext
 */
const createContext = require("./context");
const { handleCommand } = require("./commandHandler");
const { recordUserActivity } = require("../services/userService");
const { recordGroupActivity } = require("../services/groupActivityService");
const { incrementMessages } = require("../services/stats");
const { logError } = require("../services/loggerService");

/**
 * Determines whether the skip message.
 * @param rawMsg - - raw message string.
 * @returns
 */
function shouldSkipMessage(rawMsg) {
  if (!rawMsg?.message) return true;
  if (rawMsg.key?.remoteJid === "status@broadcast") return true;
  if (rawMsg.key?.fromMe) return true;
  return false;
}

/**
 * Record user and group activity.
 * @param ctx - - execution context.
 * @param rawMsg - - raw message string.
 * @returns
 * @async
 */
async function recordUserAndGroupActivity(ctx, rawMsg) {
  /**
   * @constant userId
   */
  const userId = ctx.senderJid || ctx.sender;
  /**
   * @constant creatorName
   */
  const creatorName = ctx.userName;
  /**
   * @constant isTextMessage
   */
  const isTextMessage = Boolean(ctx.text);
  /**
   * @constant registration
   * @type {object}
   */
  const registration = {
    source: "activity",
    scope: ctx.isGroup ? "group" : "self",
    createdBy: userId,
  };

  incrementMessages();

  try {
    await recordUserActivity({
      creatorId: userId,
      creatorName,
      displayName: creatorName,
      pushName: rawMsg.pushName || creatorName,
      senderJid: userId,
      senderNumber: ctx.senderNumber || null,
      messageType: ctx.messageType,
      messageCount: 1,
      isText: isTextMessage,
      registration,
    });
  } catch (error) {
    await logError({
      source: "recordUserActivity",
      userId,
      userName: creatorName,
      groupId: ctx.from,
      error,
      context: {
        pushName: rawMsg.pushName || null,
        remoteJid: rawMsg.key?.remoteJid || null,
        messageType: ctx.messageType,
      },
    });
  }

  if (ctx.isGroup) {
    try {
      await recordGroupActivity({
        groupId: ctx.from,
        memberId: userId,
        memberName: creatorName,
        messageType: ctx.messageType,
        messageCount: 1,
        isText: isTextMessage,
      });
    } catch (error) {
      await logError({
        source: "recordGroupActivity",
        userId,
        userName: creatorName,
        groupId: ctx.from,
        error,
        context: {
          messageType: ctx.messageType,
          remoteJid: rawMsg.key?.remoteJid || null,
        },
      });
    }
  }

  return isTextMessage;
}

/**
 * Processes the single message.
 * @param rawMsg - - raw message string.
 * @param sock - - sock.
 * @async
 */
async function processSingleMessage(rawMsg, sock) {
  /**
   * @constant ctx
   */
  const ctx = createContext(sock, rawMsg);
  /**
   * @constant isTextMessage
   */
  const isTextMessage = await recordUserAndGroupActivity(ctx, rawMsg);
  if (!isTextMessage) return;
  await handleCommand(ctx);
}

/**
 * @param {object} sock - Socket instance.
 * @param sock
 */
function registerEvents(sock) {
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type && type !== "notify") return;
    if (!Array.isArray(messages) || messages.length === 0) return;

    for (const rawMsg of messages) {
      try {
        if (shouldSkipMessage(rawMsg)) continue;
        await processSingleMessage(rawMsg, sock);
      } catch (messageError) {
        await logError({
          source: "messages.upsert",
          error: messageError,
          context: {
            remoteJid: rawMsg?.key?.remoteJid || null,
            fromMe: rawMsg?.key?.fromMe || false,
          },
        });
      }
    }
  });
}

module.exports = { registerEvents };
