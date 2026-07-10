const { promoteToAdmin } = require("../../../utils/groupUtils");
const {
  getFirstMentionedJid,
} = require("../../../utils/commandParseUtils");
const {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
} = require("../../../utils/userMentionUtils");
const { formatError, box } = require("../../../utils/messageFormatUtils");

module.exports = {
  name: "promote",
  aliases: ["admin", "dar_admin"],
  description: "Promueve a un usuario a administrador del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply("❌ Debes mencionar al usuario que deseas promover.\n\nUso: /promote @usuario");
    }

    try {
      const targetName = await resolveTargetDisplayName(ctx, targetId);
      await promoteToAdmin(ctx.sock, ctx.from, targetId);

      await ctx.reply(withMentions(
        box("⭐ Admin promovido", [
          "",
          `👤  ${formatDisplayMention(targetId, targetName)}`,
          "",
          "Ahora es administrador del grupo.",
        ]),
        [targetId],
      ));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};