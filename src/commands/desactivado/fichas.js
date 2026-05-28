// commands/fichas.js
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "fichas",
  description: "Muestra los nombres de todas las fichas guardadas",
  category: "informacion",
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const dir = path.join(__dirname, "..", "data", "characters");
    let files = [];
    try {
      if (!fs.existsSync(dir)) {
        await sock.sendMessage(from, { text: "No hay fichas guardadas aún." });
        return;
      }
      files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
    } catch (e) {
      console.error("Error leyendo characters dir:", e);
      await sock.sendMessage(from, { text: "❌ Error accediendo a las fichas." });
      return;
    }

    const all = [];
    for (const file of files) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
        all.push(content.name || file.replace(".json", ""));
      } catch (e) {
        console.warn("Archivo corrupto o inaccesible:", file);
      }
    }

    if (all.length === 0) {
      await sock.sendMessage(from, { text: "No hay fichas guardadas." });
    } else {
      const text = "📚 *Lista de fichas guardadas globalmente:*\n\n" + all.map((n, i) => `${i + 1}. ${n}`).join("\n");
      await sock.sendMessage(from, { text });
    }
  }
};
