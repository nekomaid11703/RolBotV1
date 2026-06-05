const { formatMentionTag } = require("../../utils/commandParseUtils");

module.exports = {
  name: "hola",

  aliases: ["saludo"],

  description: "Saluda al usuario",

  category: "informacion",

  async execute(ctx) {
    await ctx.react("👋");

    await ctx.reply(`👋 Hola ${formatMentionTag(ctx.userName || "usuario")}`, {
      mentions: [ctx.sender],
    });
  },
};
