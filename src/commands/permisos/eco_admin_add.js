const { setEconomyAdmin } = require("../../services/permissionService");
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
  title: "Dar permiso de economia",
  description: "Otorga permisos de economia a un usuario. Solo el creador del bot.",
  usage: "/eco_admin_add @usuario",
  example: "/eco_admin_add @Nekomaid",
});

module.exports = {
  name: "eco_admin_add",
  aliases: ["eaa", "econ_admin_add"],
  description: "Otorga permiso de economía a un usuario.(Solo para el creador del bot)",
  category: "permisos",
  creatorOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply(usageMessage);
    }

    if (isOwner(targetId)) {
      return ctx.reply("ℹ️ El creador ya tiene permisos de economía.");
    }

    try {
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
        `✅ Permiso de economía otorgado a ${targetName} (${formatMentionTag(targetName)}).`,
        { mentions: [targetId] },
      );
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
