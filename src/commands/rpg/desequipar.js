const { getActiveCharacter } = require("../../services/characterService");
const invService = require("../../services/rpg/inventoryService");
const itemsData = require("../../services/rpg/items");
const { formatError } = require("../../utils/messageFormatUtils");

const SLOTS = ['arma', 'cabeza', 'cuello', 'pecho', 'espalda', 'brazo_izq',
  'brazo_der', 'mano_izq', 'mano_der', 'pierna_izq', 'pierna_der',
  'pie_izq', 'pie_der', 'accesorio_1', 'accesorio_2'];

module.exports = {
  name: "desequipar",
  aliases: ["unequip", "quitar", "sacar", "remove"],
  description: "Desequipa un slot equipado. Usa: /desequipar arma, /desequipar pecho",
  category: "rpg",

  async execute(ctx) {
    try {
      const character = await getActiveCharacter({ creatorId: ctx.sender });
      if (!character) {
        return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno."));
      }

      const raw = ctx.args.join(" ").trim().toLowerCase();
      if (!raw) {
        const slots = SLOTS.map(s => `• ${s.replace(/_/g, ' ')}`).join('\n');
        return ctx.reply(`¿Qué slot quieres desequipar? Usa: \`/desequipar <slot>\`\n\nSlots disponibles:\n${slots}`);
      }

      let slot = raw.replace(/\s+/g, '_');
      if (slot === 'brazo') slot = 'brazo_der';
      if (slot === 'pierna') slot = 'pierna_der';
      if (slot === 'mano') slot = 'mano_der';
      if (slot === 'pie') slot = 'pie_der';

      if (!SLOTS.includes(slot)) {
        return ctx.reply(`Slot "${raw}" no válido. Usa: arma, cabeza, pecho, brazo_izq, brazo_der, pierna_izq, pierna_der, etc.`);
      }

      const result = await invService.unequipItem(ctx.sender, slot);
      if (result.error) return ctx.reply(result.error);

      await invService.recalcStatsAfterEquip(ctx.sender);

      return ctx.reply(`🔄 Desequipaste *${result.item.name}* (${slot.replace(/_/g, ' ')}). Vuelve a tu inventario.`);

    } catch (error) {
      console.error('desequipar error:', error);
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
