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
  description: "Equipa uno o varios ítems de tu inventario (por número o id).",
  usage: "/equipar <nº1|id1> [nº2|id2] [slot]",
  example: "/equipar 3 | /equipar 1 2 5 7",
  notes: [
    `Slots disponibles: ${SLOTS_LIST}`,
    "Puedes pasar múltiples números separados por espacio o coma: `/equipar 1,2,5,7`",
  ],
});

/**
 * Resuelve un target (número o ID) a un itemId en el inventario.
 * @param {string} target
 * @param {Array} inventoryList
 * @returns {{itemId: string}|{error: string}}
 */
function resolveTargetFromList(target, inventoryList) {
  if (target && /^\d+$/.test(target)) {
    const entry = inventoryList.find((e) => e.index === Number(target));
    if (!entry) {
      return { error: `Posición ${target} no encontrada` };
    }
    return { itemId: entry.itemId };
  }
  const itemId = String(target || "").toLowerCase();
  const itemDef = getItem(itemId);
  if (!itemDef) {
    return { error: `"${itemId}" no existe` };
  }
  return { itemId };
}

module.exports = {
  name: "equipar",
  aliases: ["equip", "wear"],
  description: "Equipa uno o múltiples ítems del inventario en slots de equipamiento.",
  category: "rpg",

  async execute(ctx) {
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
    }

    if (ctx.args.length === 0) {
      return ctx.reply(usageMessage);
    }

    // Extraer todos los targets separados por espacio o coma
    const rawTargets = ctx.args.flatMap((arg) => arg.split(",")).filter(Boolean);

    // Si el último argumento es un slot válido y hay más de 1 argumento, usarlo como slot explícito
    let explicitSlot = null;
    if (rawTargets.length > 1) {
      const candidateSlot = normalizeSlot(rawTargets[rawTargets.length - 1]);
      if (EQUIPMENT_SLOTS[candidateSlot]) {
        explicitSlot = candidateSlot;
        rawTargets.pop(); // Quitar el slot de la lista de ítems a equipar
      }
    }

    const inventoryList = await getInventoryList(activeChar.id);
    const equippedSuccess = [];
    const equippedErrors = [];

    for (const target of rawTargets) {
      const resolved = resolveTargetFromList(target, inventoryList);
      if (resolved.error) {
        equippedErrors.push(`  • #${target}: ${resolved.error}`);
        continue;
      }

      const { itemId } = resolved;
      const itemDef = getItem(itemId);
      const currentSlots = await getEquippedSlots(activeChar.id);
      const slot = explicitSlot || resolveDefaultSlot(itemDef, currentSlots);

      if (!slot) {
        equippedErrors.push(`  • *${itemDef.name}*: No es equipable`);
        continue;
      }

      try {
        const result = await equipItem({
          characterId: activeChar.id,
          creatorId: ctx.sender,
          itemId,
          slot,
        });

        let msg = `  • [${result.slot}] → *${itemDef.name}*`;
        if (result.autoUnequipped && result.autoUnequipped.length > 0) {
          msg += ` *(auto-desequipó: ${result.autoUnequipped.join(", ")})*`;
        }
        equippedSuccess.push(msg);
      } catch (err) {
        equippedErrors.push(`  • *${itemDef.name}*: ${err.message}`);
      }
    }

    const lines = [`👤 *Personaje:* ${activeChar.name}`, ""];

    if (equippedSuccess.length > 0) {
      lines.push("⚔️ *Equipado Exitosamente:*");
      lines.push(...equippedSuccess);
      lines.push("");
    }

    if (equippedErrors.length > 0) {
      lines.push("⚠️ *No se pudieron equipar:*");
      lines.push(...equippedErrors);
    }

    return ctx.reply(box("⚔️ EQUIP", lines));
  },
};
