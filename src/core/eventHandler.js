const createContext = require("./context");
const { handleCommand } = require("./commandHandler");

function registerEvents(sock) {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0];
      if (!msg?.message) return;
      if (msg.key.remoteJid === "status@broadcast") return;

      const ctx = createContext(sock, msg);

      if (!ctx.text) return;

      console.log("🔥 MENSAJE RECIBIDO");
      console.log("📩 TEXTO:", ctx.text);

      await handleCommand(ctx);
    } catch (error) {
      console.log("\n❌ Error procesando mensaje:");
      console.error(error);
    }
  });
}

module.exports = { registerEvents };
