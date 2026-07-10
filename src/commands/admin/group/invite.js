const { getInviteCode } = require("../../../utils/groupUtils");
const { formatError, box } = require("../../../utils/messageFormatUtils");

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
      await ctx.reply(box("🔗 Link de invitación", [
        "",
        link,
      ]));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};