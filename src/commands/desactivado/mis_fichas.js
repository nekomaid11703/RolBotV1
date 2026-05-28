// commands/mis_fichas.js
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "mis_fichas",
  description: "Lista los nombres de las fichas creadas por ti",
  category: "informacion",

  async execute(sock, msg) {
    const from = msg.key.remoteJid; // chat
    const userId = msg.key.participant || msg.key.remoteJid; // usuario real

    const dir = path.join(__dirname, "..", "data", "characters");

    if (!fs.existsSync(dir)) {
      await sock.sendMessage(from, { text: "📂 No hay fichas guardadas aún." });
      return;
    }

    let files;
    try {
      files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
    } catch (e) {
      console.error("Error leyendo characters dir:", e);
      await sock.sendMessage(from, { text: "❌ Error accediendo a las fichas." });
      return;
    }

    const my = [];

    for (const file of files) {
      try {
        const content = JSON.parse(
          fs.readFileSync(path.join(dir, file), "utf8")
        );

        if (content.owner === userId) {
          my.push(content.name || file.replace(".json", ""));
        }
      } catch {
        console.warn("Archivo corrupto o ilegible:", file);
      }
    }

    if (my.length === 0) {
      await sock.sendMessage(from, { text: "📭 No tienes fichas creadas." });
      return;
    }

    const text =
      "🗂️ *Tus fichas:*\n\n" +
      my.map((n, i) => `${i + 1}. ${n}`).join("\n");

    await sock.sendMessage(from, { text });
  }
};
