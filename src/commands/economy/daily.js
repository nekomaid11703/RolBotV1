// @ts-nocheck
const { claimDaily } = require("../../services/economyService");
const { formatStelas, formatDuration } = require("../../utils/economyUtils");
const { DAILY_COOLDOWN_HOURS } = require("../../config/economyConfig");
const { box } = require("../../utils/boxUtils");

/**
 * @param {number} streak.
 * @param {*} streak
 * @returns
 */
function formatStreakLabel(streak) {
  /**
   * @constant value
   */
  const value = Math.max(0, Math.floor(Number(streak) || 0));
  return value === 1 ? "1 día" : `${value} días`;
}

/**
 * @param {number} remainingMs - @param {number} totalMs.
 * @param {*} totalMs
 * @returns
 */
function formatProgressBar(remainingMs, totalMs) {
  /**
   * @constant elapsed
   */
  const elapsed = Math.max(0, totalMs - remainingMs);
  /**
   * @constant pct
   */
  const pct = Math.min(100, Math.max(0, Math.floor((elapsed / totalMs) * 100)));
  /**
   * @constant filled
   */
  const filled = Math.floor(pct / 10);
  /**
   * @constant empty
   */
  const empty = 10 - filled;
  return `▓`.repeat(filled) + `░`.repeat(empty) + ` ${pct}%`;
}

module.exports = {
  name: "daily",
  aliases: ["claim", "reclamar"],
  description: "Reclama tu recompensa diaria, aumenta tu racha y gana más stelas cada día.",
  category: "economia",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   */
  async execute(ctx) {
    const userId = ctx.userId || ctx.sender;
    /**
     * @constant result
     */
    const result = await claimDaily({
      userId,
      userName: ctx.userName,
      registration: {
        source: "daily",
        scope: "self",
        createdBy: userId,
      },
    });

    /**
     * @constant totalCooldownMs
     */
    const totalCooldownMs = DAILY_COOLDOWN_HOURS * 60 * 60 * 1000;

    if (!result.claimed) {
      await ctx.reply(
        box("🎁 Daily", [
          "",
          "❌  Ya reclamaste tu recompensa.",
          "",
          `⏳  Disponible en: ${formatDuration(result.remainingMs)}`,
          `📊  ${formatProgressBar(result.remainingMs, totalCooldownMs)}`,
          "",
          `🔥  Racha actual: ${formatStreakLabel(result.streak)}`,
        ]),
      );
      return;
    }

    await ctx.react("🎁");

    await ctx.reply(
      box("🎁 Daily", [
        "",
        `💵  Recompensa: ${formatStelas(result.reward)}`,
        `🔥  Racha: ${formatStreakLabel(result.streak)}`,
        `💰  Balance: ${formatStelas(result.balance)}`,
      ]),
    );
  },
};
