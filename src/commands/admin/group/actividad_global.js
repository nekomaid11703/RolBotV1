// @ts-nocheck
const { getTopActiveUsers, getUserProfile } = require("../../../services/userService");
const { getFirstMentionedJid } = require("../../../utils/commandParseUtils");
const { formatDisplayMention, withMentions } = require("../../../utils/userMentionUtils");
const { resolveTargetDisplayName } = require("../../../services/displayNameService");
const { formatCount, formatDate, medal } = require("../../../utils/activityFormatUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "actividad_global",
  aliases: ["act_global", "actividad_total", "global_actividad"],
  description: "Muestra la actividad global de un usuario y el top general del bot.",
  category: "grupo",

  async execute(ctx) {
    const targetId = getFirstMentionedJid(ctx) || ctx.senderJid || ctx.sender;
    const rawLimit = Number(ctx.args?.[0]);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(10, Math.floor(rawLimit)) : 10;

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

    const targetLabel = formatDisplayMention(targetId, targetDisplayName);

    if (!topUsers.length) {
      return ctx.reply(
        withMentions(
          box("📊 Actividad global", [
            "",
            `👤  ${targetLabel}`,
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
          ]),
          [targetId],
        ),
      );
    }

    const mentions = [];
    const lines = topUsers.map((entry, index) => {
      if (entry?.creatorId) {
        mentions.push(entry.creatorId);
      }

      return `${medal(index)} ${formatDisplayMention(entry.creatorId, entry.displayName)}\n   Mensajes: ${formatCount(entry.activity?.messages)}\n   Comandos: ${formatCount(entry.activity?.commands)}`;
    });

    await ctx.reply(
      withMentions(
        box("📊 Actividad global", [
          "",
          `👤  ${targetLabel}`,
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
        ]),
        [targetId, ...mentions],
      ),
    );
  },
};
