const { formatCommandUsage, formatError } = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "🔓",
  title: "Abrir grupo",
  description: "Permite que todos los miembros puedan enviar mensajes.",
  usage: "/grupo_abrir",
  example: "/grupo_abrir",
  notes: ["Solo administradores del grupo."],
});

module.exports = {
  name: "grupo_abrir",
  aliases: ["abrir_grupo", "open_group", "gropen"],
  description: "Abre el grupo para que todos puedan escribir.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    try {
      await ctx.sock.groupSettingUpdate(ctx.from, 'not_announcement');
      await ctx.social(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "🔓 Grupo abierto",
          "",
          "Ahora todos los miembros pueden enviar mensajes.",
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
      );
    } catch (error) {
      await ctx.social(formatError("No se pudo abrir el grupo. Asegúrate de que el bot sea admin."));
    }
  },
};
