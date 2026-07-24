// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { getInventory } = require("../../../services/rpg/inventoryService");
const { getItem } = require("../../../data/items");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "inventario",
  aliases: ["inv", "items"],
  description: "Muestra los ítems en tu inventario activo.",
  category: "rpg",

  async execute(ctx) {
    const character = await getActiveCharacter({ creatorId: ctx.sender });
    if (!character) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const inventory = await getInventory(character.id);

    if (inventory.length === 0) {
      return ctx.reply(box("🎒 Inventario vacío", ["", "No tienes ítems en tu inventario."]));
    }

    const lines = [];
    lines.push(`👤  ${String(character.name).toUpperCase()}`);
    lines.push("");

    for (const entry of inventory) {
      const item = getItem(entry.item_id);
      if (item) {
        lines.push(`${item.icon}  ${item.name} x${entry.quantity}`);
      } else {
        lines.push(`❓  ${entry.item_id} x${entry.quantity}`);
      }
    }

    lines.push("");
    lines.push("Usa `/usar <item>` para consumir un ítem.");

    return ctx.reply(box("🎒 INVENTARIO", lines));
  },
};
