const {
  getTopGroupMembers,
} = require("../../services/groupActivityService");
const {
  getGroupMetadata,
} = require("../../utils/groupUtils");
const {
  formatJidTag,
} = require("../../utils/commandParseUtils");
const {
  withMentions,
} = require("../../utils/userMentionUtils");
const {
  GROUP_TOP_LIMIT,
} = require("../../config/groupConfig");

function medal(index) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${index + 1}.`;
}

function formatCount(value) {
  return String(Math.max(0, Math.floor(Number(value) || 0)));
}

module.exports = {
  name: "top_activos",
  aliases: ["top_actividad", "top_active", "topactivos"],
  description: "Muestra el top 10 de miembros más activos del grupo.",
  category: "grupo",
  groupOnly: true,

  async execute(ctx) {
    const rawLimit = Number(ctx.args?.[0]);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(50, Math.floor(rawLimit))
      : GROUP_TOP_LIMIT;

    const [topMembers, metadata] = await Promise.all([
      getTopGroupMembers({
        groupId: ctx.from,
        limit,
      }),
      getGroupMetadata(ctx.sock, ctx.from),
    ]);

    const groupName = String(metadata?.subject || "este grupo").trim() || "este grupo";

    if (!topMembers.length) {
      return ctx.reply(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "🏆 Top de actividad",
          "",
          `👥 Grupo: ${groupName}`,
          "",
          "Aún no hay actividad registrada.",
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
      );
    }

    const mentions = [];
    const lines = topMembers.map((member, index) => {
      const memberId = String(member.memberId || "").trim();
      if (memberId) {
        mentions.push(memberId);
      }

      const label = formatJidTag(member.memberId, member.memberName);
      return [
        `${medal(index)} ${label}`,
        `   Mensajes: ${formatCount(member.messages)}`,
        `   Textos: ${formatCount(member.textMessages)} | Medios: ${formatCount(member.mediaMessages)}`,
      ].join("\n");
    });

    await ctx.reply(
      withMentions(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "🏆 Top de actividad",
          "",
          `👥 Grupo: ${groupName}`,
          "",
          ...lines,
          "",
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
        mentions,
      ),
    );
  },
};
