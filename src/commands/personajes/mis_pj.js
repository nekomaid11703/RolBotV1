const { listCharacters } = require("../../services/characterService");

module.exports = {
  name: "mis_pj",
  aliases: ["pjs", "listar_pj"],
  description: "Lista tus personajes",
  category: "personajes",
  
  async execute(ctx) {
    const characters = await listCharacters({
      creatorId: ctx.sender,
    });

    if (!characters.length) {
      return ctx.reply("No tienes personajes todavía.");
    }

    let text = "📂 *Tus personajes*\n\n";

    for (const character of characters) {
      text += `${character.active ? "⭐" : "•"} *${character.name}* [${character.category}]\n`;
    }

    await ctx.reply(text);
  },
};
