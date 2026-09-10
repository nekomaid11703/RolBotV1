// @ts-nocheck
/**
 * Servicio de precios (P2): traduce el tiempo de obtención de un material a
 * stelas usando el salario mínimo como vara.
 *
 *   1 minuto de juego = STELA_PER_MINUTE stelas (salario mínimo / jornada)
 *   valor_material = minutos_para_1_unidad(herramienta 10) × STELA_PER_MINUTE
 *   precio_item    = valor_material × unidades_de_receta × (1 + margen_vendedor)
 *
 * Los ítems sin material (consumibles/contenedores) conservan su precio de config.
 */

const { MATERIALS } = require("../../data/materialData");
const { getItem } = require("../../data/items");
const { CRAFTING_RECIPES } = require("./craftingService");
const { EXPEDITION_ZONES } = require("../../config/expeditionConfig");
const {
  rarityBandProbabilities,
  MATERIAL_ROLLS_BY_DURATION,
  DROP_QTY_BY_RARITY,
} = require("../../config/rarityDropConfig");
const { STELA_PER_MINUTE, VENDOR_MARGIN } = require("../../config/economyConfig");
const { TIERS, normalizeTier } = require("../../config/tierConfig");

/** Nivel de herramienta de referencia para valorar materiales (maestra). */
const PRICING_TOOL_LEVEL = 10;

/**
 * Factor de valor por tier: refinar es 2:1, así que un trozo de tier T vale
 * 2^(rank-1) trozos E. (E=1, D=2, C=4, ... N=64.)
 * @param {string} tier
 * @returns {number}
 */
function tierValueFactor(tier) {
  const key = normalizeTier(tier);
  return Math.pow(2, (TIERS[key]?.rank || 1) - 1);
}

function averageBandQty(rarity) {
  const [min, max] = DROP_QTY_BY_RARITY[rarity] || [1, 1];
  return (min + max) / 2;
}

/**
 * Minutos esperados para conseguir 1 unidad de un material en su mejor zona.
 * @param {string} materialId
 * @param {number} [toolLevel]
 * @returns {number} minutos (Infinity si no tiene ruta)
 */
function materialMinutesPerUnit(materialId, toolLevel = PRICING_TOOL_LEVEL) {
  const material = MATERIALS[materialId];
  if (!material) return Infinity;
  const bandProbability = rarityBandProbabilities({ toolLevel })[material.rarity] || 0;
  const rolls = MATERIAL_ROLLS_BY_DURATION.corta || 2;
  const avgQty = averageBandQty(material.rarity);

  let best = Infinity;
  for (const zone of Object.values(EXPEDITION_ZONES)) {
    const weight = Math.max(0, Number(zone.axisWeights?.[material.archetype]) || 0);
    if (weight <= 0) continue;
    const totalWeight = Object.values(zone.axisWeights || {}).reduce(
      (sum, value) => sum + Math.max(0, Number(value) || 0),
      0,
    );
    if (totalWeight <= 0) continue;
    const unitsPerRun = rolls * (weight / totalWeight) * bandProbability * avgQty;
    if (unitsPerRun <= 0) continue;
    const minutes = (zone.durationsMinutes?.corta || 10) / unitsPerRun;
    if (minutes < best) best = minutes;
  }
  return best;
}

/**
 * Valor de una unidad de material en stelas.
 * @param {string} materialId
 * @param {string} [tier="E"]
 * @returns {number}
 */
function materialUnitValue(materialId, tier = "E") {
  const minutes = materialMinutesPerUnit(materialId);
  if (!Number.isFinite(minutes)) return 0;
  return Math.round(minutes * STELA_PER_MINUTE * tierValueFactor(tier));
}

/**
 * Precio base calculado de un ítem (material × receta × tier × margen).
 * Devuelve null para ítems sin material o sin receta (conservan precio de config).
 * @param {string} itemId
 * @param {string} [tier="E"]
 * @returns {number|null}
 */
function itemBasePrice(itemId, tier = "E") {
  const def = getItem(itemId);
  if (!def || !def.material) return null;

  let units = 1;
  if (!String(itemId).startsWith("trozo_de_")) {
    const recipeKey = String(itemId).slice(0, String(itemId).indexOf("_de_"));
    const recipe = CRAFTING_RECIPES[recipeKey];
    if (!recipe) return null;
    units = recipe.materialCost / (recipe.producedQuantity || 1);
  }

  const value = materialUnitValue(def.material, tier);
  if (value <= 0) return null;
  return Math.max(1, Math.round(value * units * (1 + VENDOR_MARGIN)));
}

module.exports = {
  PRICING_TOOL_LEVEL,
  tierValueFactor,
  materialMinutesPerUnit,
  materialUnitValue,
  itemBasePrice,
};
