// @ts-nocheck
const { getGroupMetadata } = require("../../../utils/groupUtils");
const { formatCount } = require("../../../utils/activityFormatUtils");
const { formatRealMentionTag, withMentions } = require("../../../utils/userMentionUtils");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");

module.exports = {
  name: "todos",
  aliases: ["miembros", "mencionar_todos", "tagall"],
  description: "Menciona a todos los miembros del grupo.",
  category: "admin",
  groupOnly: true,
  adminOnly: true,

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    try {
      /**
       * @constant metadata
       */
      const metadata = await getGroupMetadata(ctx.sock, ctx.from);
      /**
       * @constant participants
       */
      const participants = metadata?.participants || [];

      if (!participants.length) {
        return ctx.reply("❌ No se pudieron obtener los miembros del grupo.");
      }

      /**
       * @constant memberJids
       */
      const memberJids = participants
        .map((p) => p.id || p.jid || "")
        .filter(Boolean)
        .filter((jid) => jid !== ctx.sock?.user?.id);

      /**
       * @constant lines
       * @type {*[]}
       */
      const lines = [];
      let chunk = "";
      for (const jid of memberJids) {
        /**
         * @constant tag
         */
        const tag = formatRealMentionTag(jid);
        /**
         * @constant next
         */
        const next = chunk ? `${chunk} ${tag}` : tag;
        if (next.length > 2000) {
          lines.push(chunk);
          chunk = tag;
        } else {
          chunk = next;
        }
      }
      if (chunk) lines.push(chunk);

      /**
       * @constant firstLine
       */
      const firstLine = lines.shift() || "";

      await ctx.reply(
        withMentions(
          box("👥 Miembros del grupo", ["", `Total: ${formatCount(memberJids.length)}`, "", firstLine]),
          memberJids,
        ),
      );

      for (const chunk of lines) {
        await ctx.reply(withMentions(chunk, memberJids));
      }
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
