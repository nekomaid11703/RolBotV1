const createContext = require("./context");
const { handleCommand } = require("./commandHandler");

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

          console.log("🔥 MENSAJE RECIBIDO");
          console.log("📩 TEXTO:", ctx.text);

          await handleCommand(ctx);
        } catch (messageError) {
          console.log("\n❌ Error procesando mensaje individual:");
          console.error(messageError);
        }
      }
    } catch (error) {
      console.log("\n❌ Error procesando mensajes.upsert:");
      console.error(error);
    }
  });
}

module.exports = { registerEvents };
