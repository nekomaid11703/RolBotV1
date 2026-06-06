const {
  claimDaily,
} = require("../../services/economyService");

const {
  formatStelas,
  formatDuration,
} = require("../../utils/economyUtils");

function formatStreakLabel(streak) {
  const value = Math.max(0, Math.floor(Number(streak) || 0));

  return value === 1 ? "1 día" : `${value} días`;
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

    if (!result.claimed) {
      await ctx.reply(
        [
          "━━━━━━━━━━━━━━",
          "🎁 Daily",
          "",
          "❌ Ya reclamaste tu recompensa.",
          "",
          `⏳ Disponible en: ${formatDuration(result.remainingMs)}`,
          "",
          `🔥 Racha actual: ${formatStreakLabel(result.streak)}`,
          "━━━━━━━━━━━━━━",
        ].join("\n"),
      );

      return;
    }

    await ctx.react("🎁");

    await ctx.reply(
      [
        "━━━━━━━━━━━━━━",
        "🎁 Daily",
        "",
        `💵 Recompensa: ${formatStelas(result.reward)}`,
        `🔥 Racha: ${formatStreakLabel(result.streak)}`,
        `💰 Balance: ${formatStelas(result.balance)}`,
        "━━━━━━━━━━━━━━",
      ].join("\n"),
    );
  },
};
