const {
  formatCommandUsage,
  formatError,
  box,
} = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "🎲",
  title: "Lanzar dados",
  description: "Lanza dados de rol con notacion XdY. Usa /dado para 1d20.",
  usage: "/dado [X]dY[+/-Z][dW]",
  example: "/dado 2d20+5",
  notes: [
    "Ejemplos: /dado (1d20), /dado 2d20+3, /dado 4d6d1 (descarta el mas bajo)",
    "Dados permitidos: d4, d6, d8, d10, d12, d20 y d100.",
  ],
});

module.exports = {
  name: "dado",
  aliases: ["dice"],
  description: "Lanza dados RPG. Ej: /dado 2d20, /dado 4d6d1, /dado 2d20+5",
  category: "utilidades",

  async execute(ctx) {
    const input = (ctx.args[0] || "d20").toLowerCase();

    const fullMatch = input.match(/^(\d*)d(\d+)([+-]\d+)?d(\d+)?$|^(\d*)d(\d+)([+-]\d+)?$/);

    if (!fullMatch) {
      return ctx.reply(formatError("Formato invalido.", usageMessage));
    }

    const hasDrop = fullMatch[4] !== undefined;
    let cantidad = parseInt(hasDrop ? (fullMatch[1] || "1") : (fullMatch[5] || "1"));
    const caras = parseInt(hasDrop ? fullMatch[2] : fullMatch[6]);
    const modifier = parseInt(hasDrop ? (fullMatch[3] || "0") : (fullMatch[7] || "0")) || 0;
    const dropLowest = hasDrop ? parseInt(fullMatch[4]) : 0;

    const dadosPermitidos = [4, 6, 8, 10, 12, 20, 100];

    if (!dadosPermitidos.includes(caras)) {
      return ctx.reply(formatError("Ese dado no esta permitido.", usageMessage));
    }

    if (cantidad < 1 || cantidad > 20) {
      return ctx.reply(formatError("Puedes lanzar entre 1 y 20 dados.", usageMessage));
    }

    if (dropLowest < 0 || dropLowest >= cantidad) {
      return ctx.reply(formatError("El numero de dados a descartar debe ser menor que el total.", usageMessage));
    }

    const rolls = [];
    let criticosAltos = 0;
    let criticosBajos = 0;

    for (let i = 0; i < cantidad; i++) {
      const roll = Math.floor(Math.random() * caras) + 1;
      rolls.push(roll);

      if (roll === caras) criticosAltos++;
      else if (roll === 1) criticosBajos++;
    }

    const lowest = dropLowest > 0
      ? [...rolls].sort((a, b) => a - b).slice(0, dropLowest)
      : [];

    const kept = dropLowest > 0
      ? rolls.filter(r => !lowest.includes(r))
      : rolls;

    if (dropLowest > 0 && kept.length === 0) {
      kept.push(Math.min(...rolls));
    }

    const rawTotal = kept.reduce((s, v) => s + v, 0);
    const total = rawTotal + modifier;

    const displayRolls = rolls.map(r => {
      const isDropped = dropLowest > 0 && lowest.includes(r);
      const label = r === caras ? `🎉${r}` : r === 1 ? `💀${r}` : `${r}`;
      return isDropped ? `~${label}~` : label;
    });

    const lines = [];

    lines.push("");
    lines.push(input);
    lines.push(`→ [ ${displayRolls.join(", ")} ]`);
    lines.push(`⭐ Total: ${total}`);

    if (modifier !== 0) {
      lines.push(`(${rawTotal} ${modifier > 0 ? '+' : ''}${modifier})`);
    }

    if (dropLowest > 0) {
      lines.push(`📉 Descartados: ${lowest.length} más bajo${lowest.length > 1 ? 's' : ''}`);
    }

    if (criticosAltos > 0 || criticosBajos > 0) {
      lines.push("");
      lines.push("⚡ Críticos detectados:");
      if (criticosAltos > 0) lines.push(`🎉 Positivos: ${criticosAltos}`);
      if (criticosBajos > 0) lines.push(`💀 Negativos: ${criticosBajos}`);
    }

    if (criticosAltos === cantidad) {
      lines.push("");
      lines.push("🔥 CRÍTICO PERFECTO! 🔥");
    }

    if (criticosBajos === cantidad) {
      lines.push("");
      lines.push("☠️ DESASTRE TOTAL ☠️");
    }

    await ctx.react("🎲");
    await ctx.reply(box("🎲 Tirada", lines));
  },
};