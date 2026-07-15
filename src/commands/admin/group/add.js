// @ts-nocheck
const { addParticipant } = require("../../../utils/groupUtils");
const { formatError, box } = require("../../../utils/messageFormatUtils");

module.exports = {
  name: "add",
  aliases: ["agregar", "invitar"],
  description: "Agrega un usuario al grupo mediante link de invitación.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const text = ctx.args.join(" ").trim();

    if (!text) {
      return ctx.reply("❌ Debes proporcionar un número o enlace de invitación.\n\nUso: /add <número>");
    }

    try {
      const result = await addParticipant(ctx.sock, ctx.from, text);
      await ctx.reply(box("➕ Usuario añadido", ["", result]));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
