// @ts-nocheck
const createContext = require("./context");
const { handleCommand } = require("./commandHandler");
const { recordUserActivity } = require("../services/userService");
const { recordGroupActivity } = require("../services/groupActivityService");
const { incrementMessages } = require("../services/stats");
const { logError } = require("../services/loggerService");

/** @param {object} sock - Socket instance */
function registerEvents(sock) {
  sock.ev.on("messages.upsert", async (/** @type {{ messages: object[], type?: string }} */ { messages, type }) => {
    try {
      if (type && type !== "notify") {
        return;
      }

      if (!Array.isArray(messages) || messages.length === 0) {
        return;
      }

      for (const rawMsg of messages) {
        try {
          if (!rawMsg?.message) {
            continue;
          }

          if (rawMsg.key?.remoteJid === "status@broadcast") {
            continue;
          }

          if (rawMsg.key?.fromMe) {
            continue;
          }

          const ctx = createContext(sock, rawMsg);
          const userId = ctx.senderJid || ctx.sender;
          const creatorName = ctx.userName;
          const isTextMessage = Boolean(ctx.text);
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

          if (!isTextMessage) {
            continue;
          }

          await handleCommand(ctx);
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
    } catch (error) {
      await logError({
        source: "messages.upsert",
        error,
        context: {
          type: type || null,
          messageCount: Array.isArray(messages) ? messages.length : 0,
        },
      });
    }
  });
}

module.exports = { registerEvents };
