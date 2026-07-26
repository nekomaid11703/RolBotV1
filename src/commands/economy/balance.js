// @ts-nocheck
const { getOrCreateProfile, getUserProfile } = require("../../services/userService");
const { formatStelas } = require("../../utils/economyUtils");
const { box } = require("../../utils/boxUtils");

/**
 * @param {{ mentionedJid?: string[], sender: string }} ctx.
 * @param ctx
 * @returns
 */
function resolveTarget(ctx) {
  /**
   * @constant mentioned
   */
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

  /**
   * Executes the .
   * @async
   * @param ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant target
     */
    const target = resolveTarget(ctx);

    /**
     * @constant data
     */
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

    /**
     * @constant profile
     */
    const profile = data.profile;
    /**
     * @constant money
     */
    const money = Number(profile.economy?.money || 0);

    /**
     * @constant displayName
     */
    const displayName =
      profile.metadata?.displayName || profile.creatorName || (target.isSelf ? ctx.userName : "usuario");

    await ctx.reply(box("💰 Balance", ["", `👤  ${displayName}`, "", `💵  ${formatStelas(money)}`]));
  },
};
