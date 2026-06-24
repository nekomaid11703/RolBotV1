const { getFirstMentionedJid } = require("../../utils/commandParseUtils");
const { resolveTargetDisplayName } = require("../../utils/userMentionUtils");
const { formatCommandUsage, formatError } = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "👑",
  title: "Promover admin",
  description: "Promueve a un miembro a administrador del grupo.",
  usage: "/promote @usuario",
  example: "/promote @Nekomaid",
  notes: ["Solo administradores del grupo."],
});

module.exports = {
  name: "promote",
  aliases: ["promover", "admin", "dar_admin"],
  description: "Promueve a un miembro a admin del grupo.",
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
      await ctx.sock.groupParticipantsUpdate(ctx.from, [targetId], 'promote');
      await ctx.social(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "👑 Admin promovido",
          "",
          `👤 ${targetName}`,
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.social(formatError(`No se pudo promover a ${targetName}. Asegúrate de que el bot sea admin.`));
    }
  },
};
