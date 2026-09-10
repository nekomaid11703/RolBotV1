// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { getInventoryList } = require("../../../services/rpg/inventoryService");
const { composeMessage } = require("../../../ui/sectionBuilder");

module.exports = {
  name: "inventario",
  aliases: ["inv", "items"],
  description: "Muestra los ítems en tu inventario activo.",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    /**
     * @constant character
     */
    const character = await getActiveCharacter({ creatorId: ctx.sender });
    if (!character) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    /**
     * @constant inventory
     */
    const inventory = await getInventoryList(character.id);

    if (inventory.length === 0) {
      return ctx.reply(
        composeMessage({ title: "🎒 Inventario vacío", sections: [["No tienes ítems en tu inventario."]] }),
      );
    }

    const sections = [
      [`👤  ${String(character.name).toUpperCase()}`],
      inventory.map((entry) => `${entry.index}. ${entry.name} x${entry.quantity}`),
      ["Usa `/equipar <n>` para equipar un ítem equipable.", "Usa `/usar <n>` para consumir un ítem."],
    ];

    return ctx.reply(composeMessage({ title: "🎒 INVENTARIO", sections }));
  },
};
