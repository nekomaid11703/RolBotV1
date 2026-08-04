// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const {
  equipItem,
  getEquippedSlots,
  normalizeSlot,
  resolveDefaultSlot,
  EQUIPMENT_SLOTS,
} = require("../../../services/rpg/equipmentService");
const { getInventoryList } = require("../../../services/rpg/inventoryService");
const { getItem } = require("../../../data/items");
const { formatCommandUsage } = require("../../../utils/formatCommandUtils");
const { box } = require("../../../utils/boxUtils");

const SLOTS_LIST = Object.keys(EQUIPMENT_SLOTS).join(", ");

const usageMessage = formatCommandUsage({
  icon: "⚔️",
  title: "Equipar",
  description: "Equipa un ítem de tu inventario. Si indicas el número, el slot se elige solo.",
  usage: "/equipar <nº_ítem|item_id> [slot]",
  example: "/equipar 3",
  notes: [
    `Slots disponibles: ${SLOTS_LIST}`,
    "Las armas de 2 manos se equipan en mano_der y liberan ambas manos automáticamente.",
  ],
});

/**
 * Resuelve el itemId a partir de un target que puede ser un número (posición
 * en /inventario) o un id directo.
 * @param {string} target - Input del usuario
 * @param {object} character - Personaje activo
 * @returns {Promise<{itemId: string}|{error: string}>}
 */
async function resolveTarget(target, character) {
  if (target && /^\d+$/.test(target)) {
    const list = await getInventoryList(character.id);
    const entry = list.find((e) => e.index === Number(target));
    if (!entry) {
      return { error: `❌ No existe ningún ítem en la posición ${target}. Usa /inventario para ver tu listado.` };
    }
    return { itemId: entry.itemId };
  }
  const itemId = String(target || "").toLowerCase();
  const itemDef = getItem(itemId);
  if (!itemDef) {
    return { error: `❌ El ítem "${itemId}" no existe en el catálogo.` };
  }
  return { itemId };
}

module.exports = {
  name: "equipar",
  aliases: ["equip", "wear"],
  description: "Equipa un ítem del inventario en un slot de equipamiento.",
  category: "rpg",

  async execute(ctx) {
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    const [target, slotInput] = ctx.args;
    if (!target) {
      return ctx.reply(usageMessage);
    }

    const resolved = await resolveTarget(target, activeChar);
    if (resolved.error) return ctx.reply(resolved.error);
    const { itemId } = resolved;

    const itemDef = getItem(itemId);
    let slot = slotInput ? normalizeSlot(slotInput) : null;

    if (!slot) {
      const currentSlots = await getEquippedSlots(activeChar.id);
      slot = resolveDefaultSlot(itemDef, currentSlots);
      if (!slot) {
        return ctx.reply("❌ Este ítem no es equipable. Los consumibles se usan con `/usar <n>`.");
      }
    }

    const result = await equipItem({
      characterId: activeChar.id,
      creatorId: ctx.sender,
      itemId,
      slot,
    });

    const lines = [`✅ *${activeChar.name}* equipó *${itemDef.name}* en [${result.slot}]`];

    if (result.autoUnequipped.length > 0) {
      lines.push(`🔄 Auto-desequipado: ${result.autoUnequipped.join(", ")}`);
    }

    return ctx.reply(box("⚔️ EQUIP", lines));
  },
};
