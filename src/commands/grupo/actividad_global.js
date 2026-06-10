const {
  getTopActiveUsers,
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

function medal(index) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${index + 1}.`;
}

module.exports = {
  name: "actividad_global",
  aliases: ["act_global", "actividad_total", "global_actividad"],
  description: "Muestra la actividad global de un usuario y el top general del bot.",
  category: "grupo",

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx) || ctx.senderJid || ctx.sender;
    const rawLimit = Number(ctx.args?.[0]);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(10, Math.floor(rawLimit))
      : 10;

    const [targetProfile, topUsers, targetDisplayName] = await Promise.all([
      getUserProfile({ creatorId: targetId }),
      getTopActiveUsers({ limit }),
      resolveTargetDisplayName(ctx, targetId, ctx.userName || "usuario"),
    ]);

    const activity = targetProfile?.profile?.activity || {
      messages: 0,
      commands: 0,
      textMessages: 0,
      mediaMessages: 0,
      stickerMessages: 0,
      audioMessages: 0,
      imageMessages: 0,
      videoMessages: 0,
      documentMessages: 0,
      reactionMessages: 0,
      lastMessageType: null,
      lastMessageAt: null,
      lastCommandAt: null,
    };

    if (!topUsers.length) {
      return ctx.reply(
        withMentions(
          [
            "━━━━━━━━━━━━━━━━━━━━",
            "📊 Actividad global",
            "",
            `👤 Usuario: @${String(targetDisplayName || "usuario").trim() || "usuario"}`,
            "",
            `💬 Mensajes: ${formatCount(activity.messages)}`,
            `⚙️ Comandos usados: ${formatCount(activity.commands)}`,
            `✍️ Textos: ${formatCount(activity.textMessages)}`,
            `🖼️ Medios: ${formatCount(activity.mediaMessages)}`,
            `⭐ Stickers: ${formatCount(activity.stickerMessages)}`,
            `🔊 Audios: ${formatCount(activity.audioMessages)}`,
            `🖼️ Imágenes: ${formatCount(activity.imageMessages)}`,
            `🎥 Videos: ${formatCount(activity.videoMessages)}`,
            `📎 Documentos: ${formatCount(activity.documentMessages)}`,
            `💫 Reacciones: ${formatCount(activity.reactionMessages)}`,
            "",
            `🕒 Último mensaje: ${formatDate(activity.lastMessageAt)}`,
            `🔎 Tipo reciente: ${activity.lastMessageType || "sin datos"}`,
            "",
            "🏆 Top global",
            "",
            "Aún no hay actividad registrada.",
            "━━━━━━━━━━━━━━━━━━━━",
          ].join("\n"),
          [targetId],
        ),
      );
    }

    const mentions = [];
    const lines = topUsers.map((entry, index) => {
      if (entry?.creatorId) {
        mentions.push(entry.creatorId);
      }

      return [
        `${medal(index)} @${String(entry.displayName || "usuario").trim() || "usuario"}`,
        `   Mensajes: ${formatCount(entry.activity?.messages)}`,
        `   Comandos: ${formatCount(entry.activity?.commands)}`,
      ].join("\n");
    });

    await ctx.reply(
      withMentions(
        [
          "━━━━━━━━━━━━━━━━━━━━",
          "📊 Actividad global",
          "",
          `👤 Usuario: @${String(targetDisplayName || "usuario").trim() || "usuario"}`,
          "",
          `💬 Mensajes: ${formatCount(activity.messages)}`,
          `⚙️ Comandos usados: ${formatCount(activity.commands)}`,
          `✍️ Textos: ${formatCount(activity.textMessages)}`,
          `🖼️ Medios: ${formatCount(activity.mediaMessages)}`,
          `⭐ Stickers: ${formatCount(activity.stickerMessages)}`,
          `🔊 Audios: ${formatCount(activity.audioMessages)}`,
          `🖼️ Imágenes: ${formatCount(activity.imageMessages)}`,
          `🎥 Videos: ${formatCount(activity.videoMessages)}`,
          `📎 Documentos: ${formatCount(activity.documentMessages)}`,
          `💫 Reacciones: ${formatCount(activity.reactionMessages)}`,
          "",
          `🕒 Último mensaje: ${formatDate(activity.lastMessageAt)}`,
          `🔎 Tipo reciente: ${activity.lastMessageType || "sin datos"}`,
          "",
          "🏆 Top global",
          "",
          ...lines,
          "",
          "━━━━━━━━━━━━━━━━━━━━",
        ].join("\n"),
        [targetId, ...mentions],
      ),
    );
  },
};
