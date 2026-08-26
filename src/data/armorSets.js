/**
 * Definiciones de sets de armadura y sus bonos.
 *
 * Consumido por `armorSetService.resolveSetBonuses(armorParts, sets)`: si un
 * personaje lleva ≥3 piezas del mismo setId, se activa el bono del set.
 */

/**
 * @constant ARMOR_SETS
 * @type {Record<string, { name?: string, bonus: Record<string, number> }>}
 */
const ARMOR_SETS = {
  set_hierro: {
    name: "Hierro",
    bonus: { def: 10 },
  },
};

/**
 * Obtiene la definición de un set por id.
 * @param {string} setId
 * @returns {object|null} { bonus } o null
 */
function getSet(setId) {
  return ARMOR_SETS[setId] || null;
}

module.exports = { ARMOR_SETS, getSet };
