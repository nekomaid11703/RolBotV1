const { getGroupMetadata } = require("../../../utils/groupUtils");
const { formatCount } = require("../../../utils/activityFormatUtils");
const { formatRealMentionTag, withMentions } = require("../../../utils/userMentionUtils");
const { formatError, box } = require("../../../utils/messageFormatUtils");

module.exports = {
  name: "todos",
  aliases: ["miembros", "mencionar_todos", "tagall"],
  description: "Menciona a todos los miembros del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    try {
      const metadata = await getGroupMetadata(ctx.sock, ctx.from);
      const participants = metadata?.participants || [];

      if (!participants.length) {
        return ctx.reply("❌ No se pudieron obtener los miembros del grupo.");
      }

      const memberJids = participants
        .map(p => p.id || p.jid || "")
        .filter(Boolean)
        .filter(jid => jid !== ctx.sock?.user?.id);

      const lines = [];
      let chunk = "";
      for (const jid of memberJids) {
        const tag = formatRealMentionTag(jid);
        const next = chunk ? `${chunk} ${tag}` : tag;
        if (next.length > 2000) {
          lines.push(chunk);
          chunk = tag;
        } else {
          chunk = next;
        }
      }
      if (chunk) lines.push(chunk);

      const firstLine = lines.shift() || "";

      await ctx.reply(withMentions(
        box("👥 Miembros del grupo", [
          "",
          `Total: ${formatCount(memberJids.length)}`,
          "",
          firstLine,
        ]),
        memberJids,
      ));

      for (const chunk of lines) {
        await ctx.reply(withMentions(chunk, memberJids));
      }
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};