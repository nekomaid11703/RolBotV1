const { setMoney } = require("../../services/economyService");
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
  box,
} = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "⚙️",
  title: "Fijar stelas",
  description: "Establece el balance exacto de un usuario. Solo administradores de economia.",
  usage: "/set_stelas @usuario cantidad",
  example: "/set_stelas @Nekomaid 1000",
  notes: ["La cantidad puede ser 0 o mayor."],
});

module.exports = {
  name: "set_stelas",
  aliases: ["set_money", "fijar_stelas"],
  description: "Establece el balance de un usuario.(Solo para administradores de economía)",
  category: "economia",
  economyAdminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply(usageMessage);
    }

    const amount = extractAmountFromArgs(ctx.args, { min: 0 });

    if (amount === null) {
      return ctx.reply(usageMessage);
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

      await ctx.reply(box("⚙️ Balance actualizado", [
        "",
        `👤  ${formatDisplayMention(targetId, targetName)}`,
        "",
        `💰  Nuevo balance: ${formatStelas(balance)}`,
      ]), { mentions: [targetId] });
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};