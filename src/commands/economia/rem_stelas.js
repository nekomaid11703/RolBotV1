const { removeMoney } = require("../../services/economyService");
const { formatStelas } = require("../../utils/economyUtils");
const {
  getFirstMentionedJid,
  extractAmountFromArgs,
} = require("../../utils/commandParseUtils");
const {
  resolveTargetDisplayName,
  formatDisplayMention,
} = require("../../utils/userMentionUtils");
const {
  formatCommandUsage,
  formatError,
} = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "➖",
  title: "Retirar stelas",
  description: "Resta stelas del balance de un usuario. Solo administradores de economia.",
  usage: "/rem_stelas @usuario cantidad",
  example: "/rem_stelas @Nekomaid 100",
  notes: ["Menciona al usuario y escribe una cantidad positiva."],
});

module.exports = {
  name: "rem_stelas",
  aliases: ["rem_money", "quitar_stelas"],
  description: "Retira stelas de un usuario.(Solo para administradores de economía)",
  category: "economia",
  economyAdminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply(usageMessage);
    }

    const amount = extractAmountFromArgs(ctx.args);

    if (!amount) {
      return ctx.reply(usageMessage);
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
          `👤 ${formatDisplayMention(targetId, targetName)}`,
          "",
          `💵 Retiradas: ${formatStelas(amount)}`,
          `💰 Balance: ${formatStelas(balance)}`,
          "━━━━━━━━━━━━━━",
        ].join("\n"),
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
