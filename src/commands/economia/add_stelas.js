const { addMoney } = require("../../services/economyService");
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
  name: "add_stelas",
  aliases: ["add_money", "sumar_stelas"],
  description: "Añade stelas a un usuario.",
  category: "economia",
  economyAdminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply("Uso: /add_stelas @usuario 100");
    }

    const amount = extractAmountFromArgs(ctx.args);

    if (!amount) {
      return ctx.reply("Uso: /add_stelas @usuario 100");
    }

    try {
      const targetName = await resolveTargetDisplayName(ctx, targetId);

      const balance = await addMoney(targetId, amount, {
        createIfMissing: true,
        userName: targetName,
        registration: {
          source: "add_stelas",
          scope: "target",
          createdBy: ctx.sender,
          displayName: targetName,
        },
      });

      await ctx.reply(
        [
          "━━━━━━━━━━━━━━",
          "➕ Stelas añadidas",
          "",
          `👤 ${targetName} (${formatMentionTag(targetName)})`,
          "",
          `💵 Añadidas: ${formatStelas(amount)}`,
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
