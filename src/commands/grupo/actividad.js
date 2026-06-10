const {
  getGroupMemberActivity,
  getGroupActivity,
} = require("../../services/groupActivityService");
const {
  getGroupMetadata,
} = require("../../utils/groupUtils");
const {
  getUserProfile,
} = require("../../services/userService");
const {
  getFirstMentionedJid,
} = require("../../utils/commandParseUtils");
const {
  resolveTargetDisplayName,
  withMentions,
} = require("../../utils/userMentionUtils");

function formatCount(value) {
  return String(Math.max(0, Math.floor(Number(value) || 0)));
}

function formatDate(value) {
  if (!value) {
    return "sin datos";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "sin datos";
  }

  return date.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

module.exports = {
  name: "actividad",
  aliases: ["act", "mi_actividad"],
  description: "Muestra tu actividad dentro del grupo actual.",
  category: "grupo",
  groupOnly: true,

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx) || ctx.senderJid || ctx.sender;

    const [groupData, memberActivity, metadata, userProfile, targetDisplayName] = await Promise.all([
      getGroupActivity(ctx.from),
      getGroupMemberActivity({
        groupId: ctx.from,
        memberId: targetId,
      }),
      getGroupMetadata(ctx.sock, ctx.from),
      getUserProfile({
        creatorId: targetId,
      }),
      resolveTargetDisplayName(ctx, targetId, ctx.userName || "usuario"),
    ]);

    const groupName = String(metadata?.subject || groupData?.groupName || "este grupo").trim() || "este grupo";

    const activity = memberActivity || {
      messages: 0,
      textMessages: 0,
      mediaMessages: 0,
      stickerMessages: 0,
      audioMessages: 0,
      imageMessages: 0,
      videoMessages: 0,
      documentMessages: 0,
      reactionMessages: 0,
      firstSeenAt: null,
      lastSeenAt: null,
      lastMessageType: null,
    };

    const commandCount = Number(userProfile?.profile?.activity?.commands || 0);
    const targetLabel = String(targetDisplayName || "usuario").trim() || "usuario";

    await ctx.reply(
      withMentions(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "📊 Actividad",
          "",
          `👥 Grupo: ${groupName}`,
          `👤 Usuario: @${targetLabel}`,
          "",
          `💬 Mensajes: ${formatCount(activity.messages)}`,
          `⚙️ Comandos usados: ${formatCount(commandCount)}`,
          `✍️ Textos: ${formatCount(activity.textMessages)}`,
          `🖼️ Medios: ${formatCount(activity.mediaMessages)}`,
          `⭐ Stickers: ${formatCount(activity.stickerMessages)}`,
          `🔊 Audios: ${formatCount(activity.audioMessages)}`,
          `🖼️ Imágenes: ${formatCount(activity.imageMessages)}`,
          `🎥 Videos: ${formatCount(activity.videoMessages)}`,
          `📎 Documentos: ${formatCount(activity.documentMessages)}`,
          `💫 Reacciones: ${formatCount(activity.reactionMessages)}`,
          "",
          `🕒 Último mensaje: ${formatDate(activity.lastSeenAt)}`,
          `🔎 Tipo reciente: ${activity.lastMessageType || "sin datos"}`,
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
        [targetId],
      ),
    );
  },
};
