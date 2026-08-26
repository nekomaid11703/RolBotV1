// @ts-nocheck
const { openGroup } = require("../../../utils/groupUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "grupo_abrir",
  aliases: ["abrir", "abrir_grupo"],
  description: "Abre el grupo para que todos puedan enviar mensajes.",
  category: "admin",
  groupOnly: true,
  adminOnly: true,

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   */
  async execute(ctx) {
    await openGroup(ctx.sock, ctx.from);
    await ctx.reply(box("🔓 Grupo abierto", ["", "Todos pueden enviar mensajes."]));
  },
};
