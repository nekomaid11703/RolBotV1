const { demoteFromAdmin } = require("../../utils/groupUtils");
const {
  getFirstMentionedJid,
} = require("../../utils/commandParseUtils");
const {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
} = require("../../utils/userMentionUtils");
const { formatError, box } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "demote",
  aliases: ["desadmin", "quitar_admin"],
  description: "Degrada a un administrador del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply("❌ Debes mencionar al administrador que deseas degradar.\n\nUso: /demote @usuario");
    }

    try {
      const targetName = await resolveTargetDisplayName(ctx, targetId);
      await demoteFromAdmin(ctx.sock, ctx.from, targetId);

      await ctx.reply(withMentions(
        box("⬇️ Admin degradado", [
          "",
          `👤  ${formatDisplayMention(targetId, targetName)}`,
          "",
          "Ya no es administrador del grupo.",
        ]),
        [targetId],
      ));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};