// @ts-nocheck
/**
 * Definiciones de sets de armadura y sus bonos.
 *
 * Consumido por `armorSetService.resolveSetBonuses(armorParts, sets)`: si un
 * personaje lleva ≥3 piezas del mismo setId, se activa el bono del set.
 *
 * B6: se genera un set por material (`set_<materialId>`) con un bono coherente
 * con su arquetipo (filo→ataque, cond→fulgor, res→defensa/HP, flex→velocidad/
 * reflejos), escalado por rareza. Así cada build tiene identidad propia (P5).
 */

const { MATERIALS } = require("./materialData");

/** Escala del bono de set por rareza (moderada: no debe dominar al equipo base). */
const SET_RARITY_SCALE = {
  comun: 1,
  poco_comun: 1.6,
  raro: 2.4,
  epico: 3.6,
  legendario: 5,
  mitico: 7,
};

/**
 * Bono de set por arquetipo, escalado.
 * @type {Record<string, (scale: number) => Record<string, number>>}
 */
const SET_BONUS_BY_ARCHETYPE = {
  filo: (scale) => ({ atk: Math.round(4 * scale) }),
  cond: (scale) => ({ d_fulgor: Math.round(5 * scale), fulgor: Math.round(3 * scale) }),
  res: (scale) => ({ def: Math.round(6 * scale), hp: Math.round(4 * scale) }),
  flex: (scale) => ({ aspd: Math.round(3 * scale), ref: Math.round(2 * scale) }),
};

/**
 * @constant ARMOR_SETS
 * @type {Record<string, { name?: string, bonus: Record<string, number> }>}
 */
const ARMOR_SETS = {};
for (const material of Object.values(MATERIALS)) {
  if (material.id === "etereo") continue;
  const scale = SET_RARITY_SCALE[material.rarity] || 1;
  const bonusBuilder = SET_BONUS_BY_ARCHETYPE[material.archetype];
  ARMOR_SETS[`set_${material.id}`] = {
    name: material.name,
    bonus: bonusBuilder ? bonusBuilder(scale) : { def: Math.round(4 * scale) },
  };
}

/**
 * Obtiene la definición de un set por id.
 * @param {string} setId
 * @returns {object|null} { bonus } o null
 */
function getSet(setId) {
  return ARMOR_SETS[setId] || null;
}

module.exports = { ARMOR_SETS, SET_RARITY_SCALE, SET_BONUS_BY_ARCHETYPE, getSet };
