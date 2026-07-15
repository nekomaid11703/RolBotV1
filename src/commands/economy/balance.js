// @ts-nocheck
const { getOrCreateProfile, getUserProfile } = require("../../services/userService");

const { formatStelas } = require("../../utils/economyUtils");

const { box } = require("../../utils/messageFormatUtils");

function resolveTarget(ctx) {
  const mentioned = Array.isArray(ctx.mentionedJid) ? ctx.mentionedJid.filter(Boolean) : [];

  if (mentioned.length > 0) {
    return {
      userId: mentioned[0],
      isSelf: false,
    };
  }

  return {
    userId: ctx.sender,
    isSelf: true,
  };
}

module.exports = {
  name: "balance",
  aliases: ["bal", "money"],
  description: "Muestra la cantidad de stelas de un usuario.",
  category: "economia",

  async execute(ctx) {
    const target = resolveTarget(ctx);

    const data = target.isSelf
      ? await getOrCreateProfile({
          creatorId: ctx.sender,
          creatorName: ctx.userName,
          registration: {
            source: "balance",
            scope: "self",
            createdBy: ctx.sender,
          },
        })
      : await getUserProfile({
          creatorId: target.userId,
        });

    if (!data) {
      return ctx.reply("❌ Ese usuario aún no tiene un perfil registrado en el bot.");
    }

    const profile = data.profile;
    const money = Number(profile.economy?.money || 0);

    const displayName =
      profile.metadata?.displayName || profile.creatorName || (target.isSelf ? ctx.userName : "usuario");

    await ctx.reply(box("💰 Balance", ["", `👤  ${displayName}`, "", `💵  ${formatStelas(money)}`]));
  },
};
