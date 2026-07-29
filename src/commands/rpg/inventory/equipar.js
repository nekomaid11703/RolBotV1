// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { equipItem, EQUIPMENT_SLOTS } = require("../../../services/rpg/equipmentService");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");
const { box } = require("../../../utils/boxUtils");

const SLOTS_LIST = Object.keys(EQUIPMENT_SLOTS).join(", ");

const usageMessage = formatCommandUsage({
  icon: "⚔️",
  title: "Equipar",
  description: "Equipa un ítem de tu inventario en el slot indicado.",
  usage: "/equipar <item_id> <slot>",
  example: "/equipar espada_acero_C mano_der",
  notes: [
    `Slots disponibles: ${SLOTS_LIST}`,
    "Las armas de 2 manos se equipan en mano_der y liberan ambas manos automáticamente.",
  ],
});

module.exports = {
  name: "equipar",
  aliases: ["equip", "wear"],
  description: "Equipa un ítem del inventario en un slot de equipamiento.",
  category: "rpg",

  async execute(ctx) {
    try {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
      }

      const [itemId, slot] = ctx.args;
      if (!itemId || !slot) {
        return ctx.reply(usageMessage);
      }

      const result = await equipItem({
        characterId: activeChar.id,
        creatorId: ctx.sender,
        itemId,
        slot,
      });

      const lines = [`✅ *${activeChar.name}* equipó *${result.equipped}* en [${result.slot}]`];

      if (result.autoUnequipped.length > 0) {
        lines.push(`🔄 Auto-desequipado: ${result.autoUnequipped.join(", ")}`);
      }

      return ctx.reply(box("⚔️ EQUIP", lines));
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return ctx.reply(formatError(msg));
    }
  },
};
