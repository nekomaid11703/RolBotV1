// @ts-nocheck
const { transferMoney, getBalance } = require("../../services/economyService");
const { getUserProfile } = require("../../services/userService");
const { formatStelas } = require("../../utils/economyUtils");
const { getFirstMentionedJid, extractAmountFromArgs } = require("../../utils/commandParseUtils");
const { formatDisplayMention } = require("../../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("../../services/displayNameService");
const { box } = require("../../utils/boxUtils");
const { formatError } = require("../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../utils/formatCommandUtils");

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
      return ctx.reply(usageMessage);
    }

    if (targetId === ctx.sender) {
      return ctx.reply(formatError("No puedes enviarte stelas a ti mismo."));
    }

    const amount = extractAmountFromArgs(ctx.args);

    if (!amount) {
      return ctx.reply(usageMessage);
    }

    try {
      const targetProfile = await getUserProfile({ creatorId: targetId });
      if (!targetProfile) {
        return ctx.reply(formatError("El usuario destinatario no tiene perfil registrado."));
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
        box("💸 Transferencia", [
          "",
          `👤  Destinatario: ${formatDisplayMention(targetId, targetName)}`,
          "",
          `💵  Enviado: ${formatStelas(amount)}`,
          `💰  Tu balance: ${formatStelas(senderBalance)}`,
        ]),
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
