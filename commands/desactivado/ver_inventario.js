const fs = require("fs");
const path = require("path");

module.exports = {
  name: "ver_inventario",
  description: "Muestra el inventario de una ficha",
  category: "informacion",

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (args.length < 1) {
      await sock.sendMessage(from, {
        text: "❌ Uso: /ver_inventario <nombre_ficha>"
      });
      return;
    }

    const name = args[0].toLowerCase().slice(0, 10);
    const filepath = path.join(__dirname, "..", "data", "characters", name + ".json");

    if (!fs.existsSync(filepath)) {
      await sock.sendMessage(from, { text: "❌ Ficha no encontrada." });
      return;
    }

    let ficha;
    try {
      ficha = JSON.parse(fs.readFileSync(filepath, "utf8"));
    } catch {
      await sock.sendMessage(from, { text: "❌ Error leyendo la ficha." });
      return;
    }

    if (!ficha.inventory) {
      await sock.sendMessage(from, {
        text: "⚠️ Esta ficha no tiene inventario."
      });
      return;
    }

    const inv = ficha.inventory;
    const money = inv.money;

    const list = (arr) =>
      arr.length ? arr.map(e => `— ${e}`).join("\n") : "—";

    const text = 
`📦 *Inventario*

╰─► ❲ 𝙳𝚒𝚗𝚎𝚛𝚘 ❳
— ${money.blue.full} / ${money.blue.frag}F 🔷 (Azules)
— ${money.cyan.full} / ${money.cyan.frag}F 💠 (Celestes)
— ${money.pink.full} / ${money.pink.frag}F 🟪 (Rosa)
— ${money.yellow.full} / ${money.yellow.frag}F ⭐ (Amarillo)
— ${money.orange.full} / ${money.orange.frag}F 🔸 (Naranja)
— ${money.red.full} / ${money.red.frag}F ♦️ (Rojo)

╰─► ❲ 𝙾𝚋𝚓𝚎𝚝𝚘𝚜 ❳
${list(inv.objects)}

╰─► ❲ 𝙼𝚊𝚝𝚎𝚛𝚒𝚊𝚕𝚎𝚜 ʳᵉᶜᵒˡᵉᶜᵗᵃᵈᵒˢ ❳
${list(inv.materials)}

╰─► ❲ 𝙿𝚛𝚘𝚙𝚒𝚎𝚍𝚊𝚍𝚎𝚜 ❳
${list(inv.properties)}

╰─► ❲ 𝙴𝚖𝚙𝚛𝚎𝚜𝚊𝚜 ❳
${list(inv.companies)}

╰─► ❲ 𝚄𝚗𝚒𝚍𝚊𝚍𝚎𝚜 𝚍𝚎 𝙲𝚘𝚖𝚎𝚛𝚌𝚒𝚘 ❳
${list(inv.trade_units)}`;

    await sock.sendMessage(from, { text });
  }
};
