const { openGroup } = require("../../../utils/groupUtils");
const { formatError, box } = require("../../../utils/messageFormatUtils");

module.exports = {
  name: "grupo_abrir",
  aliases: ["abrir", "abrir_grupo"],
  description: "Abre el grupo para que todos puedan enviar mensajes.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    try {
      await openGroup(ctx.sock, ctx.from);
      await ctx.reply(box("🔓 Grupo abierto", [
        "",
        "Todos pueden enviar mensajes.",
      ]));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};