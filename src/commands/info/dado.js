// @ts-nocheck
const { box } = require("../../utils/boxUtils");
const { formatError } = require("../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../utils/formatCommandUtils");
const { randomInt } = require("../../utils/randomUtils");

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

const DADOS_PERMITIDOS = [4, 6, 8, 10, 12, 20, 100];
const MAX_CANTIDAD = 20;
const MIN_CANTIDAD = 1;

function parseDiceInput(input) {
  const fullMatch = input.match(/^(\d*)d(\d+)([+-]\d+)?(?:d(\d+))?$/);
  if (!fullMatch) return { error: "Formato invalido." };

  const hasDrop = fullMatch[4] !== undefined;
  const cantidad = parseInt(hasDrop ? fullMatch[1] || "1" : fullMatch[5] || "1");
  const caras = parseInt(hasDrop ? fullMatch[2] : fullMatch[6]);
  const modifier = parseInt(hasDrop ? fullMatch[3] || "0" : fullMatch[7] || "0") || 0;
  const dropLowest = hasDrop ? parseInt(fullMatch[4]) : 0;

  if (!DADOS_PERMITIDOS.includes(caras)) return { error: "Ese dado no esta permitido." };
  if (cantidad < MIN_CANTIDAD || cantidad > MAX_CANTIDAD) return { error: "Puedes lanzar entre 1 y 20 dados." };
  if (dropLowest < 0 || dropLowest >= cantidad) return { error: "El numero de dados a descartar debe ser menor que el total." };

  return { cantidad, caras, modifier, dropLowest };
}

function rollDice(cantidad, caras) {
  const rolls = [];
  let criticosAltos = 0;
  let criticosBajos = 0;

  for (let i = 0; i < cantidad; i++) {
    const roll = randomInt(1, caras + 1);
    rolls.push(roll);
    if (roll === caras) criticosAltos++;
    else if (roll === 1) criticosBajos++;
  }

  return { rolls, criticosAltos, criticosBajos };
}

function formatDisplayRoll(r, caras, lowest, dropLowest) {
  const isDropped = dropLowest > 0 && lowest.includes(r);
  let label = "" + r;
  if (r === caras) label = "\uD83C\uDF89" + r;
  else if (r === 1) label = "\uD83D\uDC80" + r;
  return isDropped ? "~" + label + "~" : label;
}

function addModifierLine(lines, rawTotal, modifier) {
  if (modifier !== 0) {
    lines.push(`(${rawTotal} ${modifier > 0 ? "+" : ""}${modifier}`);
    return true;
  }
  return false;
}

function addDropLine(lines, dropLowest, lowest) {
  if (dropLowest > 0) {
    lines.push(`📉 Descartados: ${lowest.length} más bajo${lowest.length > 1 ? "s" : ""}`);
    return true;
  }
  return false;
}

function addCritLines(lines, criticosAltos, criticosBajos, cantidad) {
  let added = false;
  if (criticosAltos > 0 || criticosBajos > 0) {
    lines.push("");
    lines.push("⚡ Críticos detectados:");
    if (criticosAltos > 0) lines.push(`🎉 Positivos: ${criticosAltos}`);
    if (criticosBajos > 0) lines.push(`💀 Negativos: ${criticosBajos}`);
    added = true;
  }
  if (criticosAltos === cantidad) {
    lines.push("");
    lines.push("🔥 CRÍTICO PERFECTO! 🔥");
    added = true;
  }
  if (criticosBajos === cantidad) {
    lines.push("");
    lines.push("☠️ DESASTRE TOTAL ☠️");
    added = true;
  }
  return added;
}

function formatRollResult(input, rolls, criticosAltos, criticosBajos, { modifier, dropLowest, cantidad, caras }) {
  const lowest = dropLowest > 0 ? [...rolls].sort((a, b) => a - b).slice(0, dropLowest) : [];
  let kept = dropLowest > 0 ? rolls.filter((r) => !lowest.includes(r)) : rolls;

  if (dropLowest > 0 && kept.length === 0) {
    kept = [Math.min(...rolls)];
  }

  const rawTotal = kept.reduce((s, v) => s + v, 0);
  const total = rawTotal + modifier;

  const displayRolls = rolls.map((r) => formatDisplayRoll(r, caras, lowest, dropLowest));

  const lines = [
    "",
    input,
    `→ [ ${displayRolls.join(", ")} ]`,
    `⭐ Total: ${total}`,
  ];

  addModifierLine(lines, rawTotal, modifier);
  addDropLine(lines, dropLowest, lowest);
  addCritLines(lines, criticosAltos, criticosBajos, cantidad);

  return lines;
}

module.exports = {
  name: "dado",
  aliases: ["dice"],
  description: "Lanza dados RPG. Ej: /dado 2d20, /dado 4d6d1, /dado 2d20+5",
  category: "info",

  async execute(ctx) {
    const input = (ctx.args[0] || "d20").toLowerCase();

    const parsed = parseDiceInput(input);
    if (parsed.error) {
      return ctx.reply(formatError(parsed.error, usageMessage));
    }

    const { rolls, criticosAltos, criticosBajos } = rollDice(parsed.cantidad, parsed.caras);

    const lines = formatRollResult(input, rolls, criticosAltos, criticosBajos, parsed);

    await ctx.react("🎲");
    await ctx.reply(box("🎲 Tirada", lines));
  },
};
