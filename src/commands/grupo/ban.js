const { getFirstMentionedJid } = require("../../utils/commandParseUtils");
const { resolveTargetDisplayName } = require("../../utils/userMentionUtils");
const { formatCommandUsage, formatError } = require("../../utils/messageFormatUtils");

function extractPhoneFromArgs(args) {
  for (const arg of args) {
    const cleaned = arg.replace(/[^0-9]/g, "");
    if (cleaned.length >= 7 && cleaned.length <= 15) {
      return cleaned + "@s.whatsapp.net";
    }
  }
  return null;
}

const usageMessage = formatCommandUsage({
  icon: "🚫",
  title: "Expulsar miembro",
  description: "Expulsa a un miembro del grupo por mención o número.",
  usage: "/ban @usuario",
  example: "/ban @Nekomaid",
  notes: ["Solo administradores del grupo.", "También puedes usar: /ban 573156602784"],
});

module.exports = {
  name: "ban",
  aliases: ["kick", "expulsar", "sacar"],
  description: "Expulsa a un miembro del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    let targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      targetId = extractPhoneFromArgs(ctx.args || []);
    }

    if (!targetId) {
      return ctx.social(usageMessage);
    }

    const targetName = await resolveTargetDisplayName(ctx, targetId);

    try {
      await ctx.sock.groupParticipantsUpdate(ctx.from, [targetId], 'remove');
      await ctx.social(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "🚫 Miembro expulsado",
          "",
          `👤 ${targetName}`,
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
      );
    } catch (error) {
      await ctx.social(formatError(`No se pudo expulsar a ${targetName}. Asegúrate de que el bot sea admin.`));
    }
  },
};
