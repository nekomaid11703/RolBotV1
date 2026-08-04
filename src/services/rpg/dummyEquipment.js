// @ts-nocheck
const { getItem } = require("../../data/items");

/**
 * Equipamiento en memoria del dummy PvE (Familia del Hierro).
 *
 * El dummy no tiene fila en `characters` ni `inventory`, así que su equipo se
 * resuelve 100% en memoria. Este módulo es puro: produce la MISMA forma que
 * `equipmentResolverService.getEquippedItems` para la DB, de modo que los
 * resolvers funcionan de forma idéntica para bots y jugadores sin bifurcar la
 * lógica de combate.
 */

/**
 * @constant IRON_DUMMY_LOADOUT
 * @type {Array<{slot: string, itemId: string}>}
 */
const IRON_DUMMY_LOADOUT = [
  { slot: "mano_der", itemId: "espada_de_hierro" },
  { slot: "cabeza", itemId: "casco_de_hierro" },
  { slot: "pecho", itemId: "pechera_de_hierro" },
  { slot: "pantalones", itemId: "grebas_de_hierro" },
  { slot: "botas", itemId: "botas_de_hierro" },
  { slot: "artefacto_1", itemId: "amuleto_de_hierro" },
];

/**
 * Construye el equipo del dummy: mapa de slots + filas "inventory" con metadata
 * (durabilidad a plena resistencia, reparable).
 * @returns {{ slots: Record<string,string>, inventory: Array<object> }}
 */
function buildDummyEquipment() {
  const slots = {};
  const inventory = [];
  for (const { slot, itemId } of IRON_DUMMY_LOADOUT) {
    const def = getItem(itemId);
    if (!def) continue;
    slots[slot] = itemId;
    const dur = (def.metadata && def.metadata.durability) || {};
    const maxResist = Math.max(1, Number(dur.maxResist) || 1);
    inventory.push({
      item_id: itemId,
      quantity: 1,
      metadata: {
        ...(def.metadata ? def.metadata : {}),
        durability: { ...dur, currentResist: maxResist, isRepairable: dur.isRepairable !== false },
      },
    });
  }
  return { slots, inventory };
}

module.exports = { buildDummyEquipment, IRON_DUMMY_LOADOUT };