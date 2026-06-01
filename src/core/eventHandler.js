const createContext = require("./context");
const { handleCommand } = require("./commandHandler");
const { syncUserMetadata } = require("../services/userService");
const { logError } = require("../services/loggerService");

function registerEvents(sock) {
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
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

          if (!ctx.text) {
            continue;
          }

          try {
            await syncUserMetadata({
              creatorId: ctx.sender,
              creatorName: ctx.userName,
              displayName: ctx.userName,
              pushName: rawMsg.pushName || ctx.userName,
            });
          } catch (error) {
            await logError({
              source: "syncUserMetadata",
              userId: ctx.sender,
              userName: ctx.userName,
              groupId: ctx.from,
              error,
              context: {
                pushName: rawMsg.pushName || null,
                remoteJid: rawMsg.key?.remoteJid || null,
              },
            });
          }

          console.log("🔥 MENSAJE RECIBIDO");
          console.log("📩 TEXTO:", ctx.text);

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

          console.log("\n❌ Error procesando mensaje individual:");
          console.error(messageError);
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

      console.log("\n❌ Error procesando mensajes.upsert:");
      console.error(error);
    }
  });
}

module.exports = { registerEvents };
