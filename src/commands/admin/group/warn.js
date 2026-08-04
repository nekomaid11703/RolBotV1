// @ts-nocheck
const { addWarn, getWarns, MAX_WARNS } = require("../../../utils/groupUtils");
const { getFirstMentionedJid } = require("../../../utils/commandParseUtils");
const { formatDisplayMention, withMentions } = require("../../../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("../../../services/displayNameService");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "warn",
  aliases: ["advertir", "avisar"],
  description: "Añade un warn a un usuario en el grupo.",
  category: "admin",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx);

    if (!targetId) {
      return ctx.reply("❌ Debes mencionar al usuario que deseas advertir.\n\nUso: /warn @usuario [motivo]");
    }

    const reason = ctx.args.slice(1).join(" ").trim() || "Sin motivo especificado";
    const targetName = await resolveTargetDisplayName(ctx, targetId);
    const currentWarns = await getWarns(ctx.from, targetId);
    const warnCount = currentWarns.count;

    await addWarn(ctx.from, targetId, {
      reason,
      moderatorId: ctx.sender,
      moderatorName: ctx.userName,
    });

    if (warnCount + 1 >= MAX_WARNS) {
      await ctx.reply(
        withMentions(
          box("⚠️ Usuario advertido", [
            "",
            `👤  ${formatDisplayMention(targetId, targetName)}`,
            `📋 Motivo: ${reason}`,
            "",
            `❗ Warn ${warnCount + 1}/${MAX_WARNS}`,
            `🚨 Límite alcanzado.`,
          ]),
          [targetId],
        ),
      );
    } else {
      await ctx.reply(
        withMentions(
          box("⚠️ Usuario advertido", [
            "",
            `👤  ${formatDisplayMention(targetId, targetName)}`,
            `📋 Motivo: ${reason}`,
            "",
            `❗ Warn ${warnCount + 1}/${MAX_WARNS}`,
          ]),
          [targetId],
        ),
      );
    }
  },
};
