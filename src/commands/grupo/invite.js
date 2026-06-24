const { formatCommandUsage, formatError } = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "🔗",
  title: "Link de invitación",
  description: "Muestra el enlace de invitación del grupo.",
  usage: "/invite",
  example: "/invite",
  notes: ["Solo administradores del grupo."],
});

module.exports = {
  name: "invite",
  aliases: ["link", "invitacion", "grupo_link"],
  description: "Muestra el link de invitación del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    try {
      const code = await ctx.sock.groupInviteCode(ctx.from);
      const inviteLink = `https://chat.whatsapp.com/${code}`;
      const metadata = await ctx.sock.groupMetadata(ctx.from);
      const groupName = String(metadata.subject || "el grupo").trim() || "el grupo";

      await ctx.social(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "🔗 Link de invitación",
          "",
          `👥 *${groupName}*`,
          "",
          inviteLink,
          "",
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
      );
    } catch (error) {
      await ctx.social(formatError("No se pudo obtener el link. Asegúrate de que el bot sea admin."));
    }
  },
};
