const fs = require("fs");
const path = require("path");

module.exports = {
  name: "crear_inventario",
  description: "Crea un inventario y lo vincula a una ficha existente",
  category: "administracion",

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (args.length < 1) {
      await sock.sendMessage(from, {
        text: "❌ Uso: /crear_inventario <nombre_ficha>"
      });
      return;
    }

    const name = args[0].toLowerCase().slice(0, 10);
    const filepath = path.join(__dirname, "..", "data", "characters", name + ".json");

    if (!fs.existsSync(filepath)) {
      await sock.sendMessage(from, { text: "❌ La ficha no existe." });
      return;
    }

    let ficha;
    try {
      ficha = JSON.parse(fs.readFileSync(filepath, "utf8"));
    } catch (e) {
      await sock.sendMessage(from, { text: "❌ Error leyendo la ficha." });
      return;
    }

    if (ficha.inventory) {
      await sock.sendMessage(from, {
        text: "⚠️ Esta ficha ya tiene un inventario."
      });
      return;
    }

    ficha.inventory = {
      money: {
        blue:   { full: 0, frag: 0 },
        cyan:   { full: 0, frag: 0 },
        pink:   { full: 0, frag: 0 },
        yellow: { full: 0, frag: 0 },
        orange: { full: 0, frag: 0 },
        red:    { full: 0, frag: 0 }
      },
      objects: [],
      materials: [],
      properties: [],
      companies: [],
      trade_units: []
    };

    fs.writeFileSync(filepath, JSON.stringify(ficha, null, 2));

    await sock.sendMessage(from, {
      text:
        "📦 *Inventario creado correctamente*\n\n" +
        `Ficha: *${ficha.name || name}*\n` +
        "El inventario está listo para usarse."
    });
  }
};
