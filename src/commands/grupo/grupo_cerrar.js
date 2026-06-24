const { formatCommandUsage, formatError } = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "🔒",
  title: "Cerrar grupo",
  description: "Restringe el envío de mensajes solo a administradores.",
  usage: "/grupo_cerrar",
  example: "/grupo_cerrar",
  notes: ["Solo administradores del grupo."],
});

module.exports = {
  name: "grupo_cerrar",
  aliases: ["cerrar_grupo", "close_group", "grclose"],
  description: "Cierra el grupo para que solo admins escriban.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    try {
      await ctx.sock.groupSettingUpdate(ctx.from, 'announcement');
      await ctx.reply(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "🔒 Grupo cerrado",
          "",
          "Solo los administradores pueden enviar mensajes ahora.",
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
      );
    } catch (error) {
      await ctx.reply(formatError("No se pudo cerrar el grupo. Asegúrate de que el bot sea admin."));
    }
  },
};
