// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { useItem, getInventory } = require("../../../services/rpg/inventoryService");
const { findSessionByCharacter } = require("../../../services/rpg/combatState");
const { getItem, ITEMS } = require("../../../data/items");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "usar",
  aliases: ["use", "consumir"],
  description: "Usa un ítem consumible de tu inventario activo.",
  category: "rpg",

  async execute(ctx) {
    if (ctx.args.length === 0) {
      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
      }

      const inv = await getInventory(character.id);
      const lines = [];
      lines.push("");
      lines.push("Uso: `/usar <item>`");
      lines.push("");

      if (inv.length === 0) {
        lines.push("📭 No tienes ítems consumibles en tu inventario.");
      } else {
        lines.push("📋 Tus ítems disponibles:");
        for (const entry of inv) {
          const item = getItem(entry.item_id);
          if (item) {
            lines.push(`   · ${item.icon} ${item.name} (${item.id}) x${entry.quantity}`);
          }
        }
      }

      lines.push("");
      lines.push("IDs válidos: " + Object.keys(ITEMS).join(", "));

      return ctx.reply(box("📦 Usar ítem", lines));
    }

    const itemName = ctx.args[0].toLowerCase();

    try {
      const result = await useItem(ctx.sender, itemName);

      const session = findSessionByCharacter(result.characterId);
      if (session) {
        if (session.challenger.characterId === result.characterId) {
          session.challenger.hp = result.hpAfter;
        } else {
          session.defender.hp = result.hpAfter;
        }
      }

      const lines = [];
      lines.push("");
      lines.push(`📦  ${result.icon} ${result.itemName} usado`);
      lines.push(`❤️  HP: ${result.hpBefore} → ${result.hpAfter}`);

      return ctx.reply(box("✅ ITEM USADO", lines));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
