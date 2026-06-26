const {
  deleteWarn,
  getWarns,
} = require("../../utils/groupUtils");
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
  name: "unwarn",
  aliases: ["quitar_warn", "disculpar"],
  description: "Elimina el último warn de un usuario en el grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply("❌ Debes mencionar al usuario.\n\nUso: /unwarn @usuario");
    }

    try {
      const currentWarns = await getWarns(ctx.from, targetId);

      if (currentWarns <= 0) {
        return ctx.reply("❌ Ese usuario no tiene warns activos.");
      }

      const targetName = await resolveTargetDisplayName(ctx, targetId);
      await deleteWarn(ctx.from, targetId);

      await ctx.reply(withMentions(
        box("✅ Warn eliminado", [
          "",
          `👤  ${formatDisplayMention(targetId, targetName)}`,
          "",
          `Warns restantes: ${currentWarns - 1}`,
        ]),
        [targetId],
      ));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};