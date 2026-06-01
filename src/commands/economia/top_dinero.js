const {
  getTopBalances,
} = require("../../services/economyService");

const {
  formatStelas,
} = require("../../utils/economyUtils");

const {
  TOP_DINERO_LIMIT,
} = require("../../config/economyConfig");

function getMedal(index) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${index + 1}.`;
}

module.exports = {
  name: "top_dinero",
  aliases: ["top_money", "top_stelas", "top_ricos", "top_tinero"],
  description: "Muestra el top de usuarios con más stelas.",
  category: "economia",

  async execute(ctx) {
    const limitArg = Number(ctx.args?.[0]);
    const limit = Number.isFinite(limitArg) && limitArg > 0
      ? Math.min(20, Math.floor(limitArg))
      : TOP_DINERO_LIMIT;

    const top = await getTopBalances(limit);

    if (!top.length) {
      return ctx.reply(
        [
          "━━━━━━━━━━━━━━",
          "🏆 Top de stelas",
          "",
          "Aún no hay usuarios registrados.",
          "━━━━━━━━━━━━━━",
        ].join("\n"),
      );
    }

    const lines = top.map((entry, index) => {
      const medal = getMedal(index);
      return `${medal} ${entry.displayName} — ${formatStelas(entry.money)}`;
    });

    await ctx.reply(
      [
        "━━━━━━━━━━━━━━",
        "🏆 Top de stelas",
        "",
        ...lines,
        "━━━━━━━━━━━━━━",
      ].join("\n"),
    );
  },
};
