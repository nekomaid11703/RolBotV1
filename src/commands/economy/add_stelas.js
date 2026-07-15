// @ts-nocheck
const { addMoney } = require("../../services/economyService");
const { formatStelas } = require("../../utils/economyUtils");
const { getFirstMentionedJid, extractAmountFromArgs } = require("../../utils/commandParseUtils");
const { formatDisplayMention } = require("../../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("../../services/displayNameService");
const { formatCommandUsage, formatError, box } = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "➕",
  title: "Añadir stelas",
  description: "Suma stelas al balance de un usuario. Solo administradores de economia.",
  usage: "/add_stelas @usuario cantidad",
  example: "/add_stelas @Nekomaid 100",
  notes: ["Menciona al usuario y escribe una cantidad positiva."],
});

module.exports = {
  name: "add_stelas",
  aliases: ["add_money", "sumar_stelas"],
  description: "Añade stelas a un usuario.(Solo para administradores de economía)",
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
        box("➕ Stelas añadidas", [
          "",
          `👤  ${formatDisplayMention(targetId, targetName)}`,
          "",
          `💵  Añadidas: ${formatStelas(amount)}`,
          `💰  Balance: ${formatStelas(balance)}`,
        ]),
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
