const { getGroupMetadata } = require("../../utils/groupUtils");

module.exports = {
  name: "todos",
  aliases: ["everyone", "all", "tagall"],
  description: "Menciona a todos los miembros del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const metadata = await getGroupMetadata(ctx.sock, ctx.from);
    if (!metadata) {
      return ctx.reply("No se pudo obtener la lista de miembros.");
    }

    const botJid = String(ctx.sock?.user?.id || "").split(":")[0] + "@s.whatsapp.net";

    const participants = (metadata.participants || [])
      .map(p => p.id)
      .filter(jid => jid !== botJid);

    if (participants.length === 0) {
      return ctx.reply("No hay miembros para mencionar.");
    }

    const groupName = String(metadata.subject || "el grupo").trim() || "el grupo";

    const customMessage = ctx.args.join(" ").trim();
    const body = customMessage || "Mencionando a todos:";

    const lines = [
      "━━━━━━━━━━━━━━━━━━━━",
      "📢 *ATENCIÓN*",
      "",
      `👥 *${groupName}* — ${participants.length} miembros`,
      "",
      body,
    ];

    await ctx.reply(lines.join("\n"), { mentions: participants });
  },
};
