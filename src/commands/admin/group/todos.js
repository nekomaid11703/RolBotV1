// @ts-nocheck
const { getGroupMetadata } = require("../../../utils/groupUtils");
const { formatCount } = require("../../../utils/activityFormatUtils");
const { formatRealMentionTag, withMentions } = require("../../../utils/userMentionUtils");
const { box } = require("../../../utils/boxUtils");

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
    let chunkJids = [];
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
        lines.push({ text: chunk, mentions: chunkJids });
        chunk = tag;
        chunkJids = [jid];
      } else {
        chunk = next;
        chunkJids.push(jid);
      }
    }
    if (chunk) lines.push({ text: chunk, mentions: chunkJids });

    /**
     * @constant firstLine
     */
    const firstLine = lines.shift() || { text: "", mentions: [] };

    await ctx.reply(
      withMentions(
        box("👥 Miembros del grupo", ["", `Total: ${formatCount(memberJids.length)}`, "", firstLine.text]),
        firstLine.mentions,
      ),
    );

    for (const line of lines) {
      await ctx.reply(withMentions(line.text, line.mentions));
    }
  },
};
