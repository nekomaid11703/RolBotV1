const { normalizeTier, getTierMultiplier } = require("../../config/tierConfig");
const { getMaterialStats, MATERIALS } = require("../../data/materialData");

/**
 * Servicio de resolución de estadísticas finales de un ítem a partir de su
 * definición normalizada. La fórmula general es `base × tier × material`.
 *
 * NO instancia ítems ni comunica con la DB; recibe una ItemDefinition y
 * devuelve estadísticas numéricas puras (fácilmente testeables).
 */

/**
 * Coeficiente divisor para afilabilidad (escala 1-100 sobre un baseDamage nominal).
 * @constant EDGE_SCALE
 * @type {number}
 */
const EDGE_SCALE = 50;

/**
 * Resuelve la estadística de un arma a partir de su definición.
 * @param {import("./itemFactory").ItemDefinition} def - ItemDefinition (weapon)
 * @returns {object} { damageNature, tier, hands, baseDamage, weaponRange, ranged }
 */
function getWeaponStats(def) {
  const tier = normalizeTier(def.tier || "E");
  const mult = getTierMultiplier(tier);
  const mat = getMaterialStats(def.material || "madera", tier);
  const weapon = def.modules?.weapon || {};
  const ranged = Boolean(weapon.ranged);

  // Armas a distancia (arco): el daño lo aporta el proyectil, el arco no tiene baseDamage propio.
  const baseDamage = ranged
    ? 0
    : Math.max(1, Math.round((Number(weapon.baseDamage) || 10) * mult * (mat.afilabilidad / EDGE_SCALE)));

  return {
    damageNature: weapon.damageNature || "cortante",
    tier,
    hands: weapon.hands || 1,
    baseDamage,
    weaponRange: weapon.weaponRange || 1,
    ranged,
  };
}

/**
 * Resuelve la estadística de un proyectil (flecha) a partir de su definición.
 * El daño base es FIJO por material (nominal × afilabilidad / EDGE_SCALE), SIN
 * multiplicador de tier: el tier de la flecha solo aporta aerodinámica (AERO)
 * al alcance/falloff. El tier del arco aplica su multiplicador (BOW_DAMAGE_MULT).
 * Fuente única de la fórmula usada por el pool y el bot real (evita doble escalado).
 * @param {import("./itemFactory").ItemDefinition} def - ItemDefinition (weapon/proyectil)
 * @returns {object} { damageNature, tier, baseDamage, hands, weaponRange, ranged }
 */
function getProjectileStats(def) {
  const tier = normalizeTier(def.tier || "E");
  const weapon = def.modules?.weapon || {};
  // Afilabilidad BASE del material (sin multiplicador de tier): la flecha no
  // escala por tier (el tier solo aporta AERO al alcance/falloff).
  const baseAfi = MATERIALS[def.material || "madera"]?.baseStats?.afilabilidad ?? 45;
  const baseDamage = Math.max(1, Math.round((Number(weapon.baseDamage) || 10) * (baseAfi / EDGE_SCALE)));
  return {
    damageNature: weapon.damageNature || "proyectil",
    tier,
    baseDamage,
    hands: weapon.hands || 1,
    weaponRange: weapon.weaponRange || 0,
    ranged: false,
  };
}

/**
 * Resuelve la estadística de una armadura a partir de su definición.
 * @param {import("./itemFactory").ItemDefinition} def - ItemDefinition (normalizada)
 * @returns {object} { maxResist, bonusDef, coverage, slot, setId }
 */
function getArmorStats(def) {
  const tier = normalizeTier(def.tier || "E");
  const mat = getMaterialStats(def.material || "madera", tier);
  const armor = def.modules?.armor || {};

  const maxResist = Math.max(1, Math.round(mat.resistencia_material));
  const bonusDef = Math.round(maxResist / 2);

  return {
    maxResist,
    bonusDef,
    coverage: armor.coverage || "media",
    slot: armor.slot || "pecho",
    setId: def.setId || armor.setId || null,
  };
}

/**
 * Resuelve la estadística de un artefacto (buff pasivo) a partir de su definición.
 * @param {import("./itemFactory").ItemDefinition} def - ItemDefinition (normalizada)
 * @returns {object} { effects, buffs }
 */
function getArtifactStats(def) {
  const buff = def.modules?.buff || {};
  const effects = Array.isArray(buff.effects) ? buff.effects : [];
  return {
    effects,
    buffs: buff.stats || {},
  };
}

/**
 * Resuelve la estadística de canalización de un foco a partir de su definición.
 * Espejo de `baseDamage` de las armas: usa la conducción mágica del material
 * como palanca (materialData.js) × multiplicador de tier. El foco es el único
 * término plano/multiplicador del canal mágico → obsolescencia programada (P2).
 * @param {import("./itemFactory").ItemDefinition} def - ItemDefinition (focus)
 * @returns {object} { canalizeBase, slotHeld, spellIds, tier, canalizeScale }
 */
function getSpellStats(def) {
  const tier = normalizeTier(def.tier || "E");
  const mat = getMaterialStats(def.material || "madera", tier);
  const focus = def.modules?.focus || {};

  // getMaterialStats ya aplica el multiplicador de tier a conduccion_magica;
  // aquí solo se combina con el canalizeScale del foco (palanca fina de balance).
  const canalizeBase = Math.max(
    1,
    Math.round((Number(focus.canalizeScale) || 1) * (mat.conduccion_magica / EDGE_SCALE)),
  );

  return {
    canalizeBase,
    slotHeld: focus.slotHeld || "1h",
    spellIds: Array.isArray(focus.spellIds) ? focus.spellIds : [],
    tier,
    canalizeScale: focus.canalizeScale || 1,
  };
}

/**
 * Resuelve el coste de materiales de un ítem a partir de su tier y rareza.
 * Solo devuelve la fórmula base (sin receta de crafteo todavía).
 * @param {import("./itemFactory").ItemDefinition} def - ItemDefinition (normalizada)
 * @returns {object} { baseCost, rarity, tier, material }
 */
function getMaterialCost(def) {
  const tier = normalizeTier(def.tier || "E");
  const mult = getTierMultiplier(tier);

  const hasBasePrice = typeof def.basePrice === "number" && def.basePrice > 0;
  const baseCost = hasBasePrice ? def.basePrice : defaultBaseCost(def.rarity || "comun", mult);

  return {
    baseCost,
    rarity: def.rarity || "comun",
    tier,
    material: def.material || "madera",
  };
}

/**
 * Coste base por defecto según rareza y multiplicador de tier.
 * @param {string} rarity
 * @param {number} mult
 * @returns {number}
 */
function defaultBaseCost(rarity, mult) {
  const flat = rarity === "comun" ? 10 : 25;
  return Math.round(flat * mult);
}

module.exports = {
  getWeaponStats,
  getProjectileStats,
  getArmorStats,
  getArtifactStats,
  getSpellStats,
  getMaterialCost,
};
