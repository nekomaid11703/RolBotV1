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

  async execute(ctx) {
    const metadata = await getGroupMetadata(ctx.sock, ctx.from);
    const participants = metadata?.participants || [];

    if (!participants.length) {
      return ctx.reply("❌ No se pudieron obtener los miembros del grupo.");
    }

    const memberJids = participants
      .map((p) => p.id || p.jid || "")
      .filter(Boolean)
      .filter((jid) => jid !== ctx.sock?.user?.id);

    const chunks = [];
    let chunk = "";
    let chunkMentions = [];
    for (const jid of memberJids) {
      const tag = formatRealMentionTag(jid);
      const next = chunk ? `${chunk} ${tag}` : tag;
      if (next.length > 2000) {
        chunks.push({ text: chunk, mentions: chunkMentions });
        chunk = tag;
        chunkMentions = [jid];
      } else {
        chunk = next;
        chunkMentions.push(jid);
      }
    }
    if (chunk) chunks.push({ text: chunk, mentions: chunkMentions });

    const firstChunk = chunks.shift() || { text: "", mentions: [] };

    await ctx.reply(
      withMentions(
        box("👥 Miembros del grupo", ["", `Total: ${formatCount(memberJids.length)}`, "", firstChunk.text]),
        firstChunk.mentions,
      ),
    );

    for (const chunk of chunks) {
      await ctx.reply(withMentions(chunk.text, chunk.mentions));
    }
  },
};
