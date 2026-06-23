const { deleteCharacter } = require("../../services/characterService");

module.exports = {
  name: "eliminar_pj",

  aliases: ["dpj"],

  description: "Elimina un personaje existente. ¡Cuidado, esta acción es irreversible!",

  category: "personajes",

  async execute(ctx) {
    const characterName = ctx.args.join(" ").trim();

    if (!characterName) {
      return ctx.reply("🗑️ Uso: `/eliminar_pj NombrePersonaje`");
    }

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
