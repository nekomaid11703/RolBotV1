// @ts-nocheck
const { setEconomyAdmin, isEconomyAdmin } = require("../../../services/permissionService");
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
  title: "Quitar permiso de economia",
  description: "Retira permisos de economia a un usuario. Solo el creador del bot.",
  usage: "/eco_admin_rem @usuario",
  example: "/eco_admin_rem @Nekomaid",
  notes: ["El creador conserva permisos permanentes."],
});

module.exports = {
  name: "eco_admin_rem",
  aliases: ["ear", "econ_admin_rem"],
  description: "Quita permiso de economía a un usuario.(Solo para el creador del bot)",
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
      return ctx.reply(formatError("No puedes quitar permisos de economia al creador."));
    }

    /**
     * @constant current
     */
    const current = await isEconomyAdmin(targetId);
    /**
     * @constant targetName
     */
    const targetName = await resolveTargetDisplayName(ctx, targetId);

    if (!current) {
      return ctx.reply(
        withMentions(
          box("ℹ️ Sin permisos", [
            "",
            `👤  ${formatDisplayMention(targetId, targetName)}`,
            "",
            "No tiene permisos de economía activos.",
          ]),
          [targetId],
        ),
      );
    }

    try {
      await setEconomyAdmin({
        userId: targetId,
        userName: targetName,
        enabled: false,
        createIfMissing: false,
        registration: {
          source: "eco_admin_rem",
          scope: "target",
          createdBy: ctx.sender,
          displayName: targetName,
        },
      });

      await ctx.reply(
        withMentions(
          box("🛡️ Permiso retirado", [
            "",
            `👤  ${formatDisplayMention(targetId, targetName)}`,
            "",
            "Ya no es administrador de economia.",
          ]),
          [targetId],
        ),
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
