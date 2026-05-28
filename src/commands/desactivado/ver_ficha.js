const fs = require("fs");
const path = require("path");

module.exports = {
  name: "ver_ficha",
  description: "Muestra una ficha de personaje",
  category: "informacion",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (args.length === 0) {
      await sock.sendMessage(from, { text: "❌ Uso: /ver_ficha <nombre>" });
      return;
    }

    const filename = args.join("_").toLowerCase().slice(0, 10) + ".json";
    const filepath = path.join(__dirname, "..", "data", "characters", filename);

    if (!fs.existsSync(filepath)) {
      await sock.sendMessage(from, { text: "❌ Ficha no encontrada." });
      return;
    }

    const ficha = JSON.parse(fs.readFileSync(filepath, "utf8"));

    const text =
    `*᪄    l ͜͡ ͠l ͜͡ ͠l︩︪l ͜͡ ͠l︩︪l︩︪ ͜͡ ͠l︩︪l ͜͡ l     ꒰͜͡ ★ ͜͡꒱    l ͜͡ ͠l︩︪l ͜͡ ͠l︩︪l ͜͡ ͠l︩︪ ͜͡ ͠l︩︪l ͜͡ l   ᪃*\n\n` +

    ` *\`ꐚ. 𝗙𝐈𝐂𝐇𝐀 𝗗𝐄 𝗣𝐄𝐑𝐒𝐎𝐍𝐀𝐉𝐄 /!?\`*\n` +
    `          ݁⏜͜͡᪈͜͡⏜݁    💠᳕    ݁⏜͜͡᪈͜͡⏜݁\n\n` +

    `                   ─────\n` +
    `♦️ \`IDENTIFICACIÓN:\`\n` +
    `> .🖋️ ${ficha.name}\n\n` +

    `                   ─────\n` +
    `💎 \`PERSONALIDAD:\`\n` +
    `> .🖋️ ${ficha.personality}\n\n` +

    `                   ─────\n` +
    `♦️ \`HISTORIA:\`\n` +
    `> .🖋️ ${ficha.history}\n\n` +

    `                   ─────\n` +
    `💎 \`RAZA:\`\n` +
    `> .🖋️ ${ficha.race}\n\n` +

    `                   ─────\n` +
    `♦️ \`HABILIDADES:\`\n` +
    `> .🖋️\n\n` +
    `*${ficha.skill1.name}:* ${ficha.skill1.description}\n\n` +
    `*${ficha.skill2.name}:* ${ficha.skill2.description}\n\n` +
    `*${ficha.skill3.name}:* ${ficha.skill3.description}\n\n` +

    `                   ─────\n` +
    `💎 \`ESTADÍSTICAS:\`\n` +
    `> .🖋️\n\n` +

    Object.entries(ficha.stats)
      .map(([k, v]) => 
    `♦️ \`${k.toUpperCase()}:\`\n` +
    `> .🖋️\n\n` +
    `                   ${v}\n`
      ).join("\n");


    await sock.sendMessage(from, { text });
  }
};
