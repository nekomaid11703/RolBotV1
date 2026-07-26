// @ts-nocheck
const { setEconomyAdmin } = require("../../../services/permissionService");
const { getFirstMentionedJid } = require("../../../utils/commandParseUtils");
const { isOwner } = require("../../../utils/permissionUtils");
const { formatDisplayMention, withMentions } = require("../../../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("../../../services/displayNameService");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");

/**
 * @constant usageMessage
 */
const usageMessage = formatCommandUsage({
  icon: "🛡️",
  title: "Dar permiso de economia",
  description: "Otorga permisos de economia a un usuario. Solo el creador del bot.",
  usage: "/eco_admin_add @usuario",
  example: "/eco_admin_add @Nekomaid",
});

module.exports = {
  name: "eco_admin_add",
  aliases: ["eaa", "econ_admin_add"],
  description: "Otorga permiso de economía a un usuario.(Solo para el creador del bot)",
  category: "admin",
  creatorOnly: true,

  /**
   * Executes the .
   * @async
   * @param ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant targetId
     */
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply(usageMessage);
    }

    if (isOwner(targetId)) {
      return ctx.reply("ℹ️ El creador ya tiene permisos de economía.");
    }

    try {
      /**
       * @constant targetName
       */
      const targetName = await resolveTargetDisplayName(ctx, targetId);

      await setEconomyAdmin({
        userId: targetId,
        userName: targetName,
        enabled: true,
        createIfMissing: true,
        registration: {
          source: "eco_admin_add",
          scope: "target",
          createdBy: ctx.sender,
          displayName: targetName,
        },
      });

      await ctx.reply(
        withMentions(
          box("🛡️ Permiso otorgado", [
            "",
            `👤  ${formatDisplayMention(targetId, targetName)}`,
            "",
            "Ahora es administrador de economia.",
          ]),
          [targetId],
        ),
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
