const {
  claimDaily,
} = require("../../services/economyService");

const {
  formatStelas,
  formatDuration,
} = require("../../utils/economyUtils");
const {
  DAILY_COOLDOWN_HOURS,
} = require("../../config/economyConfig");
const {
  box,
} = require("../../utils/messageFormatUtils");

function formatStreakLabel(streak) {
  const value = Math.max(0, Math.floor(Number(streak) || 0));
  return value === 1 ? "1 día" : `${value} días`;
}

function formatProgressBar(remainingMs, totalMs) {
  const elapsed = Math.max(0, totalMs - remainingMs);
  const pct = Math.min(100, Math.max(0, Math.floor((elapsed / totalMs) * 100)));
  const filled = Math.floor(pct / 10);
  const empty = 10 - filled;
  return `▓`.repeat(filled) + `░`.repeat(empty) + ` ${pct}%`;
}

module.exports = {
  name: "daily",
  aliases: ["claim", "reclamar"],
  description: "Reclama tu recompensa diaria, aumenta tu racha y gana más stelas cada día.",
  category: "economia",

  async execute(ctx) {
    const result = await claimDaily({
      userId: ctx.sender,
      userName: ctx.userName,
      registration: {
        source: "daily",
        scope: "self",
        createdBy: ctx.sender,
      },
    });

    const totalCooldownMs = DAILY_COOLDOWN_HOURS * 60 * 60 * 1000;

    if (!result.claimed) {
      await ctx.reply(box("🎁 Daily", [
        "",
        "❌  Ya reclamaste tu recompensa.",
        "",
        `⏳  Disponible en: ${formatDuration(result.remainingMs)}`,
        `📊  ${formatProgressBar(result.remainingMs, totalCooldownMs)}`,
        "",
        `🔥  Racha actual: ${formatStreakLabel(result.streak)}`,
      ]));
      return;
    }

    await ctx.react("🎁");

    await ctx.reply(box("🎁 Daily", [
      "",
      `💵  Recompensa: ${formatStelas(result.reward)}`,
      `🔥  Racha: ${formatStreakLabel(result.streak)}`,
      `💰  Balance: ${formatStelas(result.balance)}`,
    ]));
  },
};