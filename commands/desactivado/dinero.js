// commands/dinero.js
const fs = require("fs");
const path = require("path");

const DENOMS = ["blue","cyan","pink","yellow","orange","red"]; // 0..5
// español -> key map (singular/plural)
const DENOM_ALIASES = {
  azul: "blue", azules: "blue", blue: "blue",
  celeste: "cyan", celestes: "cyan", cyan: "cyan",
  rosa: "pink", rosas: "pink", pink: "pink",
  amarillo: "yellow", amarillos: "yellow", yellow: "yellow",
  naranja: "orange", naranjas: "orange", orange: "orange",
  rojo: "red", rojos: "red", red: "red"
};

// helpers: full_value (in base units = blue-frag)
function fullValue(index) {
  // full_value = 6^(index+1)
  return Math.pow(6, index + 1);
}
function fragValue(index) {
  // frag_value = 6^index
  return Math.pow(6, index);
}

// convierte inventario.money a total base units
function moneyToBase(money) {
  let total = 0;
  for (let i = 0; i < DENOMS.length; i++) {
    const key = DENOMS[i];
    const obj = money[key] || { full: 0, frag: 0 };
    total += (obj.full || 0) * fullValue(i);
    total += (obj.frag || 0) * fragValue(i);
  }
  return total;
}

// convierte total base units a estructura money normalizada
function baseToMoney(totalBase) {
  const out = {};
  for (let i = DENOMS.length - 1; i >= 0; i--) {
    const key = DENOMS[i];
    const fVal = fullValue(i);
    const frVal = fragValue(i);

    const full = Math.floor(totalBase / fVal);
    totalBase -= full * fVal;

    const frag = Math.floor(totalBase / frVal);
    totalBase -= frag * frVal;

    out[key] = { full: full, frag: frag };
  }
  // totalBase should be 0 now (or extremely small)
  return out;
}

function prettyMoneySection(money) {
  return [
    `— ${money.blue.full} / ${money.blue.frag}F 🔷 (Azules)`,
    `— ${money.cyan.full} / ${money.cyan.frag}F 💠 (Celestes)`,
    `— ${money.pink.full} / ${money.pink.frag}F 🟪 (Rosa)`,
    `— ${money.yellow.full} / ${money.yellow.frag}F ⭐ (Amarillo)`,
    `— ${money.orange.full} / ${money.orange.frag}F 🔸 (Naranja)`,
    `— ${money.red.full} / ${money.red.frag}F ♦️ (Rojo)`
  ].join("\n");
}

module.exports = {
  name: "dinero",
  description: "Agregar/quitar dinero a una ficha. Uso: /dinero <ficha> add|remove <cantidad> <denom>",
  category: "administracion",

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (args.length < 3) {
      await sock.sendMessage(from, {
        text:
          "❌ Uso: /dinero <ficha> <add|agregar|remove|quitar> <cantidad> <denominación>\n" +
          "Ejemplos:\n" +
          "/dinero kat add 40 azules\n" +
          "/dinero kat quitar 3 azul\n"
      });
      return;
    }

    const name = args[0].toLowerCase().slice(0, 10);
    const opRaw = args[1].toLowerCase();
    let amountPart = args[2];
    let denomPart = args[3] || "";

    // Si args[2] viene como "40azules" o "3azul", separamos numero+texto
    const compactMatch = amountPart.match(/^(-?\d+)([a-zA-ZçÇñÑáÁéÉíÍóÓúÚüÜ]+)?$/);
    if (compactMatch && compactMatch[2]) {
      amountPart = compactMatch[1];
      denomPart = compactMatch[2] + (denomPart ? " " + denomPart : "");
    }

    // Si denom está separado en next arg (p. ej. "40 azules")
    if (!denomPart && args[2] && args[3]) {
      denomPart = args[3];
    }
    // Si denomPart puede contener multiple words, take first token
    denomPart = String(denomPart).trim().split(/\s+/)[0].toLowerCase();

    const op = (opRaw === "add" || opRaw === "agregar") ? "add"
             : (opRaw === "remove" || opRaw === "quitar") ? "remove"
             : null;
    if (!op) {
      await sock.sendMessage(from, { text: "❌ Operación inválida. Usa add/agregar o remove/quitar." });
      return;
    }

    const amount = parseInt(amountPart, 10);
    if (isNaN(amount) || amount <= 0) {
      await sock.sendMessage(from, { text: "❌ Cantidad inválida. Debe ser entero positivo." });
      return;
    }

    const denomKey = DENOM_ALIASES[denomPart];
    if (!denomKey) {
      await sock.sendMessage(from, { text: "❌ Denominación desconocida. Usa: azul/celeste/rosa/amarillo/naranja/rojo" });
      return;
    }

    const filepath = path.join(__dirname, "..", "data", "characters", name + ".json");
    if (!fs.existsSync(filepath)) {
      await sock.sendMessage(from, { text: "❌ Ficha no encontrada." });
      return;
    }

    // load ficha
    let ficha;
    try {
      ficha = JSON.parse(fs.readFileSync(filepath, "utf8"));
    } catch (e) {
      await sock.sendMessage(from, { text: "❌ Error leyendo la ficha." });
      return;
    }

    // ensure inventory exists
    ficha.inventory = ficha.inventory || {
      money: {
        blue: { full: 0, frag: 0 },
        cyan: { full: 0, frag: 0 },
        pink: { full: 0, frag: 0 },
        yellow: { full: 0, frag: 0 },
        orange: { full: 0, frag: 0 },
        red: { full: 0, frag: 0 }
      },
      objects: [],
      materials: [],
      properties: [],
      companies: [],
      trade_units: []
    };

    const money = ficha.inventory.money;

    // snapshot before
    const beforeMoneyText = prettyMoneySection(money);

    // compute base units
    const totalBase = moneyToBase(money);
    // requested base units (we interpret amount as FULL units of denom)
    const denomIndex = DENOMS.indexOf(denomKey);
    const requestedBase = amount * fullValue(denomIndex);

    let newTotalBase = totalBase;
    if (op === "add") {
      newTotalBase = totalBase + requestedBase;
    } else {
      // remove
      if (requestedBase > totalBase) {
        await sock.sendMessage(from, { text: "❌ Fondos insuficientes para esa operación." });
        return;
      }
      newTotalBase = totalBase - requestedBase;
    }

    // normalize
    const newMoney = baseToMoney(newTotalBase);
    ficha.inventory.money = newMoney;

    // save
    try {
      fs.writeFileSync(filepath, JSON.stringify(ficha, null, 2), "utf8");
    } catch (e) {
      await sock.sendMessage(from, { text: "❌ Error guardando la ficha." });
      return;
    }

    const afterMoneyText = prettyMoneySection(newMoney);

    // response
    const opText = op === "add" ? "añadido" : "retirado";
    const denomPretty = {
      blue: "🔷 Azules",
      cyan: "💠 Celestes",
      pink: "🟪 Rosa",
      yellow: "⭐ Amarillo",
      orange: "🔸 Naranja",
      red: "♦️ Rojo"
    }[denomKey];

    const reply =
      `💼 *Inventario actualizado* — ${ficha.name || name}\n\n` +
      `Operación: *${opText}* ${amount} ${denomPretty}\n\n` +
      `📥 Antes:\n${beforeMoneyText}\n\n` +
      `📤 Después:\n${afterMoneyText}`;

    await sock.sendMessage(from, { text: reply });
  }
};
