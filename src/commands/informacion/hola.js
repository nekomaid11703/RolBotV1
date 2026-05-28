module.exports = {
  name: "hola",

  aliases: ["saludo"],

  description: "Saluda al usuario",

  category: "informacion",

  groupOnly: false,

  adminOnly: true,

  botAdminOnly: false,

  async execute(ctx) {
    const numero = ctx.sender.split("@")[0];

    await ctx.react("👋");

    await ctx.reply(`👋 Hola @${numero}`, {
      mentions: [ctx.sender],
    });
  },
};
