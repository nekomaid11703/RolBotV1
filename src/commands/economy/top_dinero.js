// @ts-nocheck
const { getTopBalances } = require("../../services/economyService");
const { formatStelas } = require("../../utils/economyUtils");
const { TOP_DINERO_LIMIT } = require("../../config/economyConfig");
const { box } = require("../../utils/boxUtils");
const { medal } = require("../../utils/activityFormatUtils");

module.exports = {
  name: "top_dinero",
  aliases: ["top_money", "top_stelas", "top_ricos"],
  description: "Muestra el top de usuarios con más stelas.",
  category: "economia",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant limitArg
     */
    const limitArg = Number(ctx.args?.[0]);
    /**
     * @constant limit
     */
    const limit = Number.isFinite(limitArg) && limitArg > 0 ? Math.min(20, Math.floor(limitArg)) : TOP_DINERO_LIMIT;

    /**
     * @constant top
     */
    const top = await getTopBalances(limit);

    if (!top.length) {
      return ctx.reply(box("🏆 Top de stelas", ["", "Aún no hay usuarios registrados."]));
    }

    /**
     * @constant lines
     */
    const lines = top.map((entry, index) => {
      return `${medal(index)}  ${entry.displayName}  —  ${formatStelas(entry.money)}`;
    });

    await ctx.reply(box("🏆 Top de stelas", ["", ...lines]));
  },
};
