const {
  setEconomyAdmin,
  isEconomyAdmin,
} = require("../../services/permissionService");
const {
  formatMentionTag,
  getFirstMentionedJid,
} = require("../../utils/commandParseUtils");
const { isOwner } = require("../../utils/permissionUtils");
const {
  resolveTargetDisplayName,
} = require("../../utils/userMentionUtils");
const {
  formatCommandUsage,
  formatError,
} = require("../../utils/messageFormatUtils");

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
  category: "permisos",
  creatorOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply(usageMessage);
    }

    if (isOwner(targetId)) {
      return ctx.reply(formatError("No puedes quitar permisos de economia al creador."));
    }

    const current = await isEconomyAdmin(targetId);
    const targetName = await resolveTargetDisplayName(ctx, targetId);

    if (!current) {
      return ctx.reply(
        `ℹ️ ${targetName} (${formatMentionTag(targetName)}) no tiene permisos de economía activos.`,
        { mentions: [targetId] },
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
        `✅ Permiso de economía retirado a ${targetName} (${formatMentionTag(targetName)}).`,
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
