const { getActiveCharacter, editCharacter } = require("../../services/characterService");

module.exports = {
  name: "edit_pj_name",
  aliases: ["renombrar_pj"],
  description: "Renombra tu personaje activo.",
  category: "personajes",

  async execute(ctx) {
    const newName = ctx.args.join(" ").trim();

    if (!newName) {
      return ctx.reply("📘 *RENOMBRAR PERSONAJE*\n\nUso: `/renombrar_pj NuevoNombre`\n_(Afectará a tu personaje activo)_");
    }

    try {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo para renombrar.");
      }

      const character = await editCharacter({
        creatorId: ctx.sender,
        characterName: activeChar.name,
        patch: {
          name: newName,
        },
      });

      await ctx.react("✏️");

      await ctx.reply(
        "✏️ *PERSONAJE RENOMBRADO*\n\n" +
          `👤 Antes: ${activeChar.name}\n` +
          `✨ Ahora: ${character.name}`,
      );
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  },
};
