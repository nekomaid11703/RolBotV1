// @ts-nocheck
const { getTopGroupMembers } = require("../../../services/groupActivityService");
const { formatCount, medal } = require("../../../utils/activityFormatUtils");
const { formatDisplayMention, withMentions } = require("../../../utils/userMentionUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "top_activos",
  aliases: ["rank", "ranking_grupo"],
  description: "Muestra el ranking de actividad del grupo actual.",
  category: "admin",
  groupOnly: true,

  /**
   * Executes the .
   * @async
   * @param ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant rawLimit
     */
    const rawLimit = Number(ctx.args?.[0]);
    /**
     * @constant limit
     */
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(15, Math.floor(rawLimit)) : 10;

    /**
     * @constant top
     */
    const top = await getTopGroupMembers({ groupId: ctx.from, limit });

    if (!top.length) {
      return ctx.reply(box("🏆 Top activos", ["", "No hay actividad registrada en este grupo."]));
    }

    /**
     * @constant mentions
     * @type {Array}
     */
    const mentions = [];
    /**
     * @constant lines
     */
    const lines = top.map((entry, index) => {
      if (entry?.creatorId) mentions.push(entry.creatorId);
      /**
       * @constant name
       */
      const name = formatDisplayMention(entry.creatorId, entry.displayName);
      return `${medal(index)} ${name}\n   Mensajes: ${formatCount(entry.activity?.messages)}`;
    });

    await ctx.reply(withMentions(box("🏆 Top activos", ["", ...lines]), mentions));
  },
};
