// @ts-nocheck
const { setAdminForCategory, isAdminForCategory } = require("../../../services/permissionService");
const { getFirstMentionedJid } = require("../../../utils/commandParseUtils");
const { isOwner } = require("../../../utils/permissionUtils");
const { formatDisplayMention, withMentions } = require("../../../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("../../../services/displayNameService");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");

const CATEGORIES = ["economy", "items"];
const CATEGORY_DISPLAY = { economy: "econom\u00eda", items: "\u00edtems" };

const usageMessage = formatCommandUsage({
  icon: "\uD83D\uDEE1\uFE0F",
  title: "Quitar permiso de administrador",
  description: "Retira permisos de administrador de una categor\u00eda a un usuario. Solo el creador.",
  usage: "/admin_perm_rem @usuario <categor\u00eda>",
  example: "/admin_perm_rem @Nekomaid economy",
  notes: [
    `Categor\u00edas disponibles: ${CATEGORIES.map((c) => `\`${c}\``).join(", ")}`,
    "El creador conserva permisos permanentes.",
  ],
});

module.exports = {
  name: "admin_perm_rem",
  aliases: ["apr", "perm_rem"],
  description: "Quita permiso de administrador de una categor\u00eda a un usuario. (Solo para el creador del bot)",
  category: "admin",
  creatorOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);
    const category = (ctx.args.find((a) => !a.startsWith("@") && CATEGORIES.includes(a)) || "").toLowerCase();

    if (!targetId || !category) {
      return ctx.reply(usageMessage);
    }

    if (!CATEGORIES.includes(category)) {
      return ctx.reply(
        `\u274C Categor\u00eda \`${category}\` no v\u00e1lida.\n\nCategor\u00edas disponibles: ${CATEGORIES.map((c) => `\`${c}\``).join(", ")}`,
      );
    }

    if (isOwner(targetId)) {
      return ctx.reply(formatError(`No puedes quitar permisos de ${CATEGORY_DISPLAY[category]} al creador.`));
    }

    const current = await isAdminForCategory(targetId, category);
    const targetName = await resolveTargetDisplayName(ctx, targetId);

    if (!current) {
      return ctx.reply(
        withMentions(
          box("\u2139\uFE0F Sin permisos", [
            "",
            `\uD83D\uDC64  ${formatDisplayMention(targetId, targetName)}`,
            "",
            `No tiene permisos de ${CATEGORY_DISPLAY[category]} activos.`,
          ]),
          [targetId],
        ),
      );
    }

    await setAdminForCategory({
      userId: targetId,
      userName: targetName,
      category,
      enabled: false,
      createIfMissing: false,
      registration: {
        source: "admin_perm_rem",
        scope: "target",
        createdBy: ctx.sender,
        displayName: targetName,
      },
    });

    await ctx.reply(
      withMentions(
        box("\uD83D\uDEE1\uFE0F Permiso retirado", [
          "",
          `\uD83D\uDC64  ${formatDisplayMention(targetId, targetName)}`,
          `\uD83D\uDCC1  Categor\u00eda: *${CATEGORY_DISPLAY[category]}*`,
          "",
          `Ya no es administrador de ${CATEGORY_DISPLAY[category]}.`,
        ]),
        [targetId],
      ),
    );
  },
};
