// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { formatCharacter } = require("../../../utils/characterFormatUtils");

module.exports = {
  name: "pj",
  aliases: ["perfil"],
  description: "Muestra tu personaje activo actual.",
  category: "personajes",

  async execute(ctx) {
    const character = await getActiveCharacter({
      creatorId: ctx.sender,
    });

    if (!character) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    await ctx.reply(formatCharacter(character));
  },
};
