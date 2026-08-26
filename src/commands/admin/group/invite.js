// @ts-nocheck
const { getInviteCode } = require("../../../utils/groupUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "invite",
  aliases: ["link", "invitacion"],
  description: "Obtiene el enlace de invitación del grupo.",
  category: "admin",
  groupOnly: true,
  adminOnly: true,

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   */
  async execute(ctx) {
    /**
     * @constant link
     */
    const link = await getInviteCode(ctx.sock, ctx.from);
    await ctx.reply(box("🔗 Link de invitación", ["", link]));
  },
};
