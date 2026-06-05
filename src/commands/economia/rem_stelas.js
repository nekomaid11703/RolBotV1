const { removeMoney } = require("../../services/economyService");
const { formatStelas } = require("../../utils/economyUtils");
const {
  getFirstMentionedJid,
  extractAmountFromArgs,
  formatMentionTag,
} = require("../../utils/commandParseUtils");
const {
  resolveTargetDisplayName,
} = require("../../utils/userMentionUtils");

module.exports = {
  name: "rem_stelas",
  aliases: ["rem_money", "quitar_stelas"],
  description: "Retira stelas a un usuario.",
  category: "economia",
  economyAdminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply("Uso: /rem_stelas @usuario 100");
    }

    const amount = extractAmountFromArgs(ctx.args);

    if (!amount) {
      return ctx.reply("Uso: /rem_stelas @usuario 100");
    }

    try {
      const targetName = await resolveTargetDisplayName(ctx, targetId);

      const balance = await removeMoney(targetId, amount, {
        createIfMissing: false,
        userName: targetName,
        registration: {
          source: "rem_stelas",
          scope: "target",
          createdBy: ctx.sender,
          displayName: targetName,
        },
      });

      await ctx.reply(
        [
          "━━━━━━━━━━━━━━",
          "➖ Stelas retiradas",
          "",
          `👤 ${targetName} (${formatMentionTag(targetName)})`,
          "",
          `💵 Retiradas: ${formatStelas(amount)}`,
          `💰 Balance: ${formatStelas(balance)}`,
          "━━━━━━━━━━━━━━",
        ].join("\n"),
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
