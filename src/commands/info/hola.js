// @ts-nocheck
const { formatDisplayMention } = require("../../utils/userMentionUtils");

module.exports = {
  name: "hola",

  aliases: ["saludo"],

  description: "Saluda al usuario",

  category: "info",

  async execute(ctx) {
    await ctx.react("👋");

    await ctx.reply(`👋 Hola ${formatDisplayMention(ctx.sender, ctx.userName || "usuario")}`, {
      mentions: [ctx.sender],
    });
  },
};
