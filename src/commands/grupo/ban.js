const { removeParticipant } = require("../../utils/groupUtils");
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
  name: "ban",
  aliases: ["expulsar", "kick"],
  description: "Expulsa a un usuario del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply("❌ Debes mencionar al usuario que deseas expulsar.\n\nUso: /ban @usuario");
    }

    try {
      const targetName = await resolveTargetDisplayName(ctx, targetId);
      const result = await removeParticipant(ctx.sock, ctx.from, targetId);

      await ctx.reply(withMentions(
        box("🚫 Usuario expulsado", [
          "",
          `👤  ${formatDisplayMention(targetId, targetName)}`,
          "",
          result,
        ]),
        [targetId],
      ));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};