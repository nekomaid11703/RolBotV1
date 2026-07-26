// @ts-nocheck
const { box } = require("../../utils/boxUtils");
const { formatError } = require("../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../utils/formatCommandUtils");
const { randomInt } = require("../../utils/randomUtils");

/**
 * @constant usageMessage
 */
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
  category: "info",

  /**
   * Executes the .
   * @async
   * @param ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant input
     */
    const input = (ctx.args[0] || "d20").toLowerCase();

    /**
     * @constant fullMatch
     */
    const fullMatch = input.match(/^(\d*)d(\d+)([+-]\d+)?(?:d(\d+))?$/);

    if (!fullMatch) {
      return ctx.reply(formatError("Formato invalido.", usageMessage));
    }

    /**
     * @constant hasDrop
     */
    const hasDrop = fullMatch[4] !== undefined;
    /**
     * @variable cantidad
     * @type {any}
     */
    let cantidad = parseInt(hasDrop ? fullMatch[1] || "1" : fullMatch[5] || "1");
    /**
     * @constant caras
     */
    const caras = parseInt(hasDrop ? fullMatch[2] : fullMatch[6]);
    /**
     * @constant modifier
     */
    const modifier = parseInt(hasDrop ? fullMatch[3] || "0" : fullMatch[7] || "0") || 0;
    /**
     * @constant dropLowest
     */
    const dropLowest = hasDrop ? parseInt(fullMatch[4]) : 0;

    /**
     * @constant dadosPermitidos
     * @type {Array}
     */
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

    /**
     * @constant rolls
     * @type {Array}
     */
    const rolls = [];
    /**
     * @variable criticosAltos
     * @type {number}
     */
    let criticosAltos = 0;
    /**
     * @variable criticosBajos
     * @type {number}
     */
    let criticosBajos = 0;

    for (let i = 0; i < cantidad; i++) {
      /**
       * @constant roll
       */
      const roll = randomInt(1, caras + 1);
      rolls.push(roll);

      if (roll === caras) criticosAltos++;
      else if (roll === 1) criticosBajos++;
    }

    /**
     * @constant lowest
     */
    const lowest = dropLowest > 0 ? [...rolls].sort((a, b) => a - b).slice(0, dropLowest) : [];

    /**
     * @constant kept
     */
    const kept = dropLowest > 0 ? rolls.filter((r) => !lowest.includes(r)) : rolls;

    if (dropLowest > 0 && kept.length === 0) {
      kept.push(Math.min(...rolls));
    }

    /**
     * @constant rawTotal
     */
    const rawTotal = kept.reduce((s, v) => s + v, 0);
    /**
     * @constant total
     */
    const total = rawTotal + modifier;

    /**
     * @constant displayRolls
     */
    const displayRolls = rolls.map((r) => {
      /**
       * @constant isDropped
       */
      const isDropped = dropLowest > 0 && lowest.includes(r);
      /**
       * @variable label
       * @type {any}
       */
      let label = "" + r;
      if (r === caras) label = "\uD83C\uDF89" + r;
      else if (r === 1) label = "\uD83D\uDC80" + r;
      return isDropped ? "~" + label + "~" : label;
    });

    /**
     * @constant lines
     * @type {Array}
     */
    const lines = [];

    lines.push("");
    lines.push(input);
    lines.push(`→ [ ${displayRolls.join(", ")} ]`);
    lines.push(`⭐ Total: ${total}`);

    if (modifier !== 0) {
      lines.push(`(${rawTotal} ${modifier > 0 ? "+" : ""}${modifier})`);
    }

    if (dropLowest > 0) {
      lines.push(`📉 Descartados: ${lowest.length} más bajo${lowest.length > 1 ? "s" : ""}`);
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
