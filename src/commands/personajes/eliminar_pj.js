const { deleteCharacter } = require("../../services/characterService");

module.exports = {
  name: "eliminar_pj",

  aliases: ["dpj"],

  description: "Elimina un personaje",

  category: "personajes",

  async execute(ctx) {
    const lines = ctx.text
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return ctx.reply("🗑️ Uso:\n\n" + "/eliminar_pj\n" + "NombrePersonaje");
    }

    const characterName = lines[1];

    try {
      await deleteCharacter({
        creatorId: ctx.sender,

        characterName,
      });

      await ctx.react("🗑️");

      await ctx.reply(`🗑️ Personaje eliminado:\n\n` + `👤 ${characterName}`);
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
