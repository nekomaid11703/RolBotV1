const { getActiveCharacter } = require("../../services/characterService");

module.exports = {
  name: "pj",
  aliases: ["ver_pj", "perfil"],
  description: "Muestra el personaje activo",
  category: "personajes",
  groupOnly: true,
  async execute(ctx) {
    const character = await getActiveCharacter({
      creatorId: ctx.sender,
    });

    if (!character) {
      return ctx.reply("No tienes un personaje activo.");
    }

    const stats = Object.entries(character.stats || {})
      .map(([key, value]) => `• ${key}: ${value}`)
      .join("\n");

    await ctx.reply(
      `👤 *${character.name}*\n` +
        `🏷️ Categoría: *${character.category}*\n` +
        `\n${stats}`,
    );
  },
};
