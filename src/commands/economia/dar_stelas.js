const { transferMoney, getBalance } = require("../../services/economyService");
const { getUserProfile } = require("../../services/userService");
const { formatStelas } = require("../../utils/economyUtils");
const {
  getFirstMentionedJid,
  extractAmountFromArgs,
  formatMentionTag,
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
  icon: "💸",
  title: "Transferir stelas",
  description: "Envia parte de tus stelas a otro usuario.",
  usage: "/dar_stelas @usuario cantidad",
  example: "/dar_stelas @Nekomaid 100",
  notes: ["No puedes transferirte stelas a ti mismo."],
});

module.exports = {
  name: "dar_stelas",
  aliases: ["give_stelas", "transferir_stelas", "send_stelas"],
  description: "Transfiere tus stelas a otro usuario.",
  category: "economia",

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.social(usageMessage);
    }

    if (targetId === ctx.sender) {
      return ctx.social(formatError("No puedes enviarte stelas a ti mismo."));
    }

    const amount = extractAmountFromArgs(ctx.args);

    if (!amount) {
      return ctx.social(usageMessage);
    }

    try {
      const targetProfile = await getUserProfile({ creatorId: targetId });
      if (!targetProfile) {
        return ctx.social(formatError("El usuario destinatario no tiene perfil registrado."));
      }

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
          `👤 Destinatario: ${formatDisplayMention(targetId, targetName)}`,
          "",
          `💵 Enviado: ${formatStelas(amount)}`,
          `💰 Tu balance restante: ${formatStelas(senderBalance)}`,
          "━━━━━━━━━━━━━━",
        ].join("\n"),
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.social(formatError(error.message));
    }
  },
};
