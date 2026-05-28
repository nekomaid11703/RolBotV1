function registerEvents(sock) {
  // =========================
  // MESSAGE EVENT
  // =========================

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0];

      if (!msg.message) return;

      // =========================
      // IGNORE STATUS
      // =========================

      if (msg.key.remoteJid === "status@broadcast") {
        return;
      }

      // =========================
      // EXTRACT TEXT
      // =========================

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        "";

      if (!text) return;

      console.log("\n=========================");
      console.log("📩 NUEVO MENSAJE");
      console.log("=========================");
      console.log("De:", msg.key.remoteJid);
      console.log("Mensaje:", text);
    } catch (error) {
      console.log("\n❌ Error procesando mensaje:");

      console.error(error);
    }
  });
}

module.exports = {
  registerEvents,
};
