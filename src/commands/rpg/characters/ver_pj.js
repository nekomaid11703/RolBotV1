// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { getInventory } = require("../../../services/rpg/inventoryService");
const { formatCharacter } = require("../../../utils/characterFormatUtils");

module.exports = {
  name: "ver_pj",
  aliases: ["vistazo", "vista_pj"],
  description: "Muestra en detalle tu personaje activo.",
  category: "rpg",

  async execute(ctx) {
    const character = await getActiveCharacter({
      creatorId: ctx.sender,
    });

    if (!character) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    let inventory = [];
    try {
      inventory = await getInventory(character.id);
    } catch (_err) {}

    await ctx.reply(formatCharacter(character, inventory));
  },
};
