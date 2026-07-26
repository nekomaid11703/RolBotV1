// @ts-nocheck
const { addParticipant } = require("../../../utils/groupUtils");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");

module.exports = {
  name: "add",
  aliases: ["agregar", "invitar"],
  description: "Agrega un usuario al grupo mediante link de invitación.",
  category: "admin",
  groupOnly: true,
  adminOnly: true,

  /**
   * Executes the .
   * @async
   * @param ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant text
     */
    const text = ctx.args.join(" ").trim();

    if (!text) {
      return ctx.reply("❌ Debes proporcionar un número o enlace de invitación.\n\nUso: /add <número>");
    }

    try {
      /**
       * @constant result
       */
      const result = await addParticipant(ctx.sock, ctx.from, text);
      await ctx.reply(box("➕ Usuario añadido", ["", result]));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
