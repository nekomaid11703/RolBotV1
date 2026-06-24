const { deleteCharacter } = require("../../services/characterService");
const {
  formatCommandUsage,
  formatError,
} = require("../../utils/messageFormatUtils");

const usageMessage = formatCommandUsage({
  icon: "🗑️",
  title: "Eliminar personaje",
  description: "Elimina uno de tus personajes. Esta accion es irreversible.",
  usage: "/eliminar_pj NombrePersonaje",
  example: "/eliminar_pj Kael",
  notes: ["Verifica bien el nombre antes de confirmar el comando."],
});

module.exports = {
  name: "eliminar_pj",

  aliases: ["dpj"],

  description: "Elimina un personaje existente. ¡Cuidado, esta acción es irreversible!",

  category: "personajes",

  async execute(ctx) {
    const characterName = ctx.args.join(" ").trim();

    if (!characterName) {
      return ctx.social(usageMessage);
    }

    try {
      await deleteCharacter({
        creatorId: ctx.sender,

        characterName,
      });

      await ctx.react("🗑️");

      await ctx.reply(`🗑️ Personaje eliminado:\n\n` + `👤 ${characterName}`);
    } catch (error) {
      await ctx.social(formatError(error.message));
    }
  },
};
