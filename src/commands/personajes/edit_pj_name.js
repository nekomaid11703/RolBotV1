const { editCharacter } = require("../../services/characterService");

module.exports = {
  name: "edit_pj_name",

  aliases: ["renombrar_pj"],

  description: "Renombra un personaje",

  category: "personajes",

  async execute(ctx) {
    const lines = ctx.text
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    // =========================
    // HELP
    // =========================

    if (lines.length < 3) {
      return ctx.reply(
        "📘 *RENOMBRAR PERSONAJE*\n\n" +
          "/edit_pj_name\n" +
          "Kevin\n" +
          "Michel",
      );
    }

    const oldName = lines[1];

    const newName = lines[2];

    try {
      const character = await editCharacter({
        creatorId: ctx.sender,

        characterName: oldName,

        patch: {
          name: newName,
        },
      });

      await ctx.react("✏️");

      await ctx.reply(
        "✏️ *PERSONAJE RENOMBRADO*\n\n" +
          `👤 Antes: ${oldName}\n` +
          `✨ Ahora: ${character.name}`,
      );
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
