const { getActiveCharacter } = require("../../services/characterService");
const invService = require("../../services/rpg/inventoryService");
const itemsData = require("../../services/rpg/items");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "inventario",
  aliases: ["inv", "i", "inventory", "mochila", "bag"],
  description: "Muestra tu inventario y equipo actual. Usa: /inventario",
  category: "rpg",

  async execute(ctx) {
    try {
      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno."));
      }

      const inv = await invService.getInventory(ctx.sender);
      const pesoActual = invService.getUsedWeight(inv);
      const capacidad = invService.getCapacity(inv);

      const lines = [
        "✦ ━━━━━━━━━━━━━━ ✦",
        `🎒 *INVENTARIO: ${character.name.toUpperCase()}*`,
        "✦ ━━━━━━━━━━━━━━ ✦",
        "",
      ];

      const equipped = [];
      for (const [slot, itemId] of Object.entries(inv.equipped)) {
        if (!itemId) continue;
        const item = itemsData.getItem(itemId);
        if (item) equipped.push({ slot, item });
      }

      if (equipped.length > 0) {
        lines.push('*EQUIPADO:*');
        for (const { slot, item } of equipped) {
          const dmg = item.damageType ? `(${item.damageType}, ${item.baseDamage} daño)` : '';
          const def = item.defensaBonus ? `(+${item.defensaBonus} defensa)` : '';
          const dur = item.resistencia ? ` [${item.resistencia} resistencia]` : '';
          lines.push(`  ⚔️ ${item.name}: ${dmg}${def}${dur}`);
        }
        lines.push('');
      }

      if (inv.items.length > 0) {
        lines.push('*MOCHILA:*');
        for (const stack of inv.items) {
          const item = itemsData.getItem(stack.itemId);
          if (!item) continue;
          const pesoItem = (item.peso * stack.quantity).toFixed(1);
          lines.push(`  • ${item.name} ×${stack.quantity} (${pesoItem} peso)`);
        }
        lines.push('');
      }

      lines.push(`📦 Peso: ${pesoActual}/${capacidad}`);
      lines.push('');
      lines.push('Usa `/equipar <item>` para equipar, `/desequipar <slot>` para quitar.');
      lines.push('', '✦ ━━━━━━━━━━━━━━ ✦');

      return ctx.reply(lines.join('\n'));

    } catch (error) {
      console.error('inventario error:', error);
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
