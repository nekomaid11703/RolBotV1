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

module.exports = {
  name: "eco_admin_rem",
  aliases: ["ear", "econ_admin_rem"],
  description: "Quita permiso de economía a un usuario.",
  category: "permisos",
  creatorOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply("Uso: /eco_admin_rem @usuario");
    }

    if (isOwner(targetId)) {
      return ctx.reply("❌ No puedes quitar permisos de economía al creador.");
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
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
