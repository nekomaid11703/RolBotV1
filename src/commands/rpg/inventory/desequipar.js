// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const { unequipItem, normalizeSlot, EQUIPMENT_SLOTS } = require("../../../services/rpg/equipmentService");
const { formatError } = require("../../../utils/formatErrorUtils");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");
const { box } = require("../../../utils/boxUtils");

const SLOTS_LIST = Object.keys(EQUIPMENT_SLOTS).join(", ");

const usageMessage = formatCommandUsage({
  icon: "🗑️",
  title: "Desequipar",
  description: "Desequipa el ítem de un slot y lo devuelve a tu inventario.",
  usage: "/des_equipar <slot>",
  example: "/des_equipar casco",
  notes: [`Slots disponibles: ${SLOTS_LIST}`, "Puedes usar alias: casco, pechera, grebas, botas, mano, artefacto..."],
});

module.exports = {
  name: "desequipar",
  aliases: ["des_equipar", "unequip", "remove_gear"],
  description: "Desequipa el ítem de un slot de equipamiento.",
  category: "rpg",

  async execute(ctx) {
    try {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
      }

      const [slotInput] = ctx.args;
      if (!slotInput) {
        return ctx.reply(usageMessage);
      }

      const slot = normalizeSlot(slotInput);

      const result = await unequipItem({
        characterId: activeChar.id,
        creatorId: ctx.sender,
        slot,
      });

      const lines = [`✅ *${activeChar.name}* desequipó *${result.unequipped}* del slot [${result.slot}]`];

      return ctx.reply(box("🗑️ UNEQUIP", lines));
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return ctx.reply(formatError(msg));
    }
  },
};
