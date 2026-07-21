// @ts-nocheck
const { getInviteCode } = require("../../../utils/groupUtils");
const { box } = require("../../../utils/boxUtils");
const { formatError } = require("../../../utils/formatErrorUtils");

module.exports = {
  name: "invite",
  aliases: ["link", "invitacion"],
  description: "Obtiene el enlace de invitación del grupo.",
  category: "grupo",
  groupOnly: true,
  adminOnly: true,

  async execute(ctx) {
    try {
      const link = await getInviteCode(ctx.sock, ctx.from);
      await ctx.reply(box("🔗 Link de invitación", ["", link]));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};
