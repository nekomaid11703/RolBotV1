const { getFirstMentionedJid } = require("../../utils/commandParseUtils");
const { resolveTargetDisplayName } = require("../../utils/userMentionUtils");
const { formatCommandUsage, formatError } = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "⬇️",
  title: "Degradar admin",
  description: "Degrada a un administrador a miembro normal.",
  usage: "/demote @usuario",
  example: "/demote @Nekomaid",
  notes: ["Solo administradores del grupo."],
});

module.exports = {
  name: "demote",
  aliases: ["degradar", "quitar_admin", "remadmin"],
  description: "Degrada a un admin a miembro normal.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.social(usageMessage);
    }

    const targetName = await resolveTargetDisplayName(ctx, targetId);

    try {
      await ctx.sock.groupParticipantsUpdate(ctx.from, [targetId], 'demote');
      await ctx.social(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "⬇️ Admin degradado",
          "",
          `👤 ${targetName}`,
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.social(formatError(`No se pudo degradar a ${targetName}. Asegúrate de que el bot sea admin.`));
    }
  },
};
