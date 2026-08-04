const { normalizeTier, getTierMultiplier } = require("../../config/tierConfig");
const { getMaterialStats } = require("../../data/materialData");

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
 * @returns {object} { damageNature, tier, hands, baseDamage, weaponRange }
 */
function getWeaponStats(def) {
  const tier = normalizeTier(def.tier || "E");
  const mult = getTierMultiplier(tier);
  const mat = getMaterialStats(def.material || "madera", tier);
  const weapon = def.modules?.weapon || {};

  const baseDamage = Math.max(
    1,
    Math.round((Number(weapon.baseDamage) || 10) * mult * (mat.afilabilidad / EDGE_SCALE)),
  );

  return {
    damageNature: weapon.damageNature || "cortante",
    tier,
    hands: weapon.hands || 1,
    baseDamage,
    weaponRange: weapon.weaponRange || 1,
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
  getArmorStats,
  getArtifactStats,
  getMaterialCost,
};
