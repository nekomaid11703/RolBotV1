const { setMoney } = require("../../services/economyService");
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
  name: "set_stelas",
  aliases: ["set_money", "fijar_stelas"],
  description: "Establece el balance de un usuario.(Solo para administradores de economía)",
  category: "economia",
  economyAdminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply("Uso: /set_stelas @usuario 1000");
    }

    const amount = extractAmountFromArgs(ctx.args, { min: 0 });

    if (amount === null) {
      return ctx.reply("Uso: /set_stelas @usuario 1000");
    }

    try {
      const targetName = await resolveTargetDisplayName(ctx, targetId);

      const balance = await setMoney(targetId, amount, {
        createIfMissing: true,
        userName: targetName,
        registration: {
          source: "set_stelas",
          scope: "target",
          createdBy: ctx.sender,
          displayName: targetName,
        },
      });

      await ctx.reply(
        [
          "━━━━━━━━━━━━━━",
          "⚙ Balance actualizado",
          "",
          `👤 ${targetName} (${formatMentionTag(targetName)})`,
          "",
          `💰 Nuevo balance: ${formatStelas(balance)}`,
          "━━━━━━━━━━━━━━",
        ].join("\n"),
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
