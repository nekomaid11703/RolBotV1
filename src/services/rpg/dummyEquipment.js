// @ts-nocheck
const { getItem } = require("../../data/items");
// Carga la semilla del catálogo arcano para que el loadout del dummy mágico
// resuelva sus hechizos vía getItem (mismo patrón que los loadouts explícitos).
require("../../data/arcaneFamily");

/**
 * Equipamiento en memoria del dummy PvE.
 *
 * El dummy no tiene fila en `characters` ni `inventory`, así que su equipo se
 * resuelve 100% en memoria. Este módulo es puro: produce la MISMA forma que
 * `equipmentResolverService.getEquippedItems` para la DB, de modo que los
 * resolvers funcionan de forma idéntica para bots y jugadores sin bifurcar la
 * lógica de combate.
 */

/**
 * Loadout del dummy mágico: el hechizo va en `mano_der` (el lanzamiento se
 * modela como ataque mágico, P7: reutiliza executeAttack/resolveAttackerWeapon).
 * @constant ARCANE_DUMMY_LOADOUT
 * @type {Array<{slot: string, itemId: string}>}
 */
const ARCANE_DUMMY_LOADOUT = [{ slot: "mano_der", itemId: "hechizo_doom" }];

/**
 * Construye el equipo del dummy: mapa de slots + filas "inventory" con metadata
 * (durabilidad a plena resistencia, reparable). Por defecto el dummy NO lleva
 * equipamiento de prueba (sin loadout).
 * @param {Array<{slot: string, itemId: string}>} [loadout] - Loadout opcional
 * @returns {{ slots: Record<string,string>, inventory: Array<object> }}
 */
function buildDummyEquipment(loadout = []) {
  const slots = {};
  const inventory = [];
  for (const { slot, itemId } of loadout) {
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

module.exports = { buildDummyEquipment, ARCANE_DUMMY_LOADOUT };
