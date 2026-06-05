const { transferMoney, getBalance } = require("../../services/economyService");
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
  name: "dar_stelas",
  aliases: ["give_stelas", "transferir_stelas", "send_stelas"],
  description: "Transfiere stelas a otro usuario.",
  category: "economia",

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply("Uso: /dar_stelas @usuario 100");
    }

    if (targetId === ctx.sender) {
      return ctx.reply("❌ No puedes enviarte stelas a ti mismo.");
    }

    const amount = extractAmountFromArgs(ctx.args);

    if (!amount) {
      return ctx.reply("Uso: /dar_stelas @usuario 100");
    }

    try {
      const targetName = await resolveTargetDisplayName(ctx, targetId);

      await transferMoney(ctx.sender, targetId, amount, {
        fromUserName: ctx.userName || "usuario",
        toUserName: targetName,
        toRegistration: {
          source: "dar_stelas",
          scope: "target",
          createdBy: ctx.sender,
          displayName: targetName,
        },
      });

      const senderBalance = await getBalance(ctx.sender);

      await ctx.reply(
        [
          "━━━━━━━━━━━━━━",
          "💸 Transferencia",
          "",
          `👤 Destinatario: ${targetName} (${formatMentionTag(targetName)})`,
          "",
          `💵 Enviado: ${formatStelas(amount)}`,
          `💰 Tu balance restante: ${formatStelas(senderBalance)}`,
          "━━━━━━━━━━━━━━",
        ].join("\n"),
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
