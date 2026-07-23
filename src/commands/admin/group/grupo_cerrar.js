// @ts-nocheck
const { closeGroup } = require("../../../utils/groupUtils");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");

module.exports = {
  name: "grupo_cerrar",
  aliases: ["cerrar", "cerrar_grupo"],
  description: "Cierra el grupo (solo admins pueden enviar mensajes).",
  category: "admin",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    try {
      await closeGroup(ctx.sock, ctx.from);
      await ctx.reply(box("🔒 Grupo cerrado", ["", "Solo admins pueden enviar mensajes."]));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
