const { getActiveCharacter, editCharacter } = require("../../services/characterService");
const {
  formatCommandUsage,
  formatError,
  box,
} = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "✏️",
  title: "Renombrar personaje",
  description: "Cambia el nombre de tu personaje activo.",
  usage: "/renombrar_pj NuevoNombre",
  example: "/renombrar_pj Kael Sombragris",
  notes: ["Afecta solamente al personaje activo."],
});

module.exports = {
  name: "renombrar_pj",
  aliases: ["edit_pj_name", "rename_pj"],
  description: "Renombra tu personaje activo.",
  category: "personajes",

  async execute(ctx) {
    const newName = ctx.args.join(" ").trim();

    if (!newName) {
      return ctx.reply(usageMessage);
    }

    try {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      
      if (!activeChar) {
        return ctx.reply(formatError(
          "No tienes un personaje activo para renombrar.",
          "Usa `/switch_pj` o `/crear_pj` primero.",
        ));
      }

      const character = await editCharacter({
        creatorId: ctx.sender,
        characterName: activeChar.name,
        patch: {
          name: newName,
        },
      });

      await ctx.react("✏️");

      await ctx.reply(box("✏️ Personaje renombrado", [
        "",
        `⬆️  ${activeChar.name}`,
        `⬇️  ${character.name}`,
      ]));
    } catch (error) {
      await ctx.reply(formatError(error.message));
    }
  },
};