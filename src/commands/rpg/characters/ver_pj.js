// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { getInventory } = require("../../../services/rpg/inventoryService");
const { formatCharacter } = require("../../../utils/characterFormatUtils");
const { logError } = require("../../../services/loggerService");

module.exports = {
  name: "ver_pj",
  aliases: ["vistazo", "vista_pj"],
  description: "Muestra en detalle tu personaje activo. Menciona a otro usuario para ver el suyo.",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant mentioned
     */
    const mentioned = Array.isArray(ctx.mentionedJid) ? ctx.mentionedJid.filter(Boolean) : [];
    /**
     * @constant targetId
     */
    const targetId = mentioned.length > 0 ? mentioned[0] : ctx.sender;

    /**
     * @constant character
     */
    const character = await getActiveCharacter({
      creatorId: targetId,
    });

    if (!character) {
      if (mentioned.length > 0) {
        return ctx.reply("❌ Ese usuario no tiene un personaje activo.");
      }
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    let inventory = [];
    try {
      inventory = await getInventory(character.id);
    } catch (err) {
      logError({ source: "ver_pj.getInventory", error: err });
    }

    await ctx.reply(formatCharacter(character, inventory));
  },
};
