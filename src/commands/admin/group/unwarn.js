// @ts-nocheck
const { deleteWarn, getWarns } = require("../../../utils/groupUtils");
const { getFirstMentionedJid } = require("../../../utils/commandParseUtils");
const { formatDisplayMention, withMentions } = require("../../../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("../../../services/displayNameService");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");

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
      const warnCount = currentWarns.count;

      if (warnCount <= 0) {
        return ctx.reply("❌ Ese usuario no tiene warns activos.");
      }

      const targetName = await resolveTargetDisplayName(ctx, targetId);
      await deleteWarn(ctx.from, targetId);

      await ctx.reply(
        withMentions(
          box("✅ Warn eliminado", [
            "",
            `👤  ${formatDisplayMention(targetId, targetName)}`,
            "",
            `Warns restantes: ${warnCount - 1}`,
          ]),
          [targetId],
        ),
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
