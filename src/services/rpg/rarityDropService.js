// @ts-nocheck
/**
 * Tiradas de material por especialización (P2) + rareza R(L) (B8.2b).
 *
 * Modelo: cada zona define multiplicadores por eje (`axisWeights`). Una tirada
 * elige primero el eje (ponderado), luego la rareza con la ley R(L) del nivel de
 * la herramienta de ese eje, y finalmente resuelve el material canónico
 * (rareza × eje). Las zonas no usan piso de rareza.
 */

const { MATERIALS } = require("../../data/materialData");
const { AXIS_TOOL, rarityRatioForLevel } = require("../../config/rarityDropConfig");

/**
 * Mapa { rareza: { eje: materialId } } construido del canon (excluye "etereo").
 * @returns {Record<string, Record<string, string>>}
 */
function buildMaterialIndex() {
  const index = {};
  for (const material of Object.values(MATERIALS)) {
    if (material.id === "etereo") continue;
    if (!index[material.rarity]) index[material.rarity] = {};
    index[material.rarity][material.archetype] = material.id;
  }
  return index;
}

const RARITY_AXIS_MATERIAL = buildMaterialIndex();

/**
 * Material canónico de una combinación rareza × eje.
 * @param {string} rarity
 * @param {string} axis
 * @returns {string|null}
 */
function materialForBandAxis(rarity, axis) {
  return RARITY_AXIS_MATERIAL[rarity]?.[axis] || null;
}

/**
 * Contexto de ejes de una zona: ejes con multiplicador > 0 y herramienta poseída
 * (nivel ≥ 1). Normaliza los pesos a probabilidades.
 * @param {object} zone - Zona (con axisWeights)
 * @param {Record<string, {level: number}>} tools
 * @returns {{axes: Array<{axis: string, tool: string, toolLevel: number, probability: number}>}}
 */
function resolveZoneAxisContext(zone, tools) {
  const weights = zone?.axisWeights || {};
  const candidates = [];
  let total = 0;

  for (const [axis, weight] of Object.entries(weights)) {
    const numericWeight = Number(weight) || 0;
    if (numericWeight <= 0) continue;
    const tool = AXIS_TOOL[axis];
    const toolLevel = tools?.[tool]?.level || 0;
    if (toolLevel < 1) continue;
    candidates.push({ axis, tool, toolLevel, weight: numericWeight });
    total += numericWeight;
  }

  if (total <= 0) return { axes: [] };
  return {
    axes: candidates.map((entry) => ({
      axis: entry.axis,
      tool: entry.tool,
      toolLevel: entry.toolLevel,
      probability: entry.weight / total,
    })),
  };
}

/**
 * Elige un eje según probabilidades, con RNG inyectable.
 * @param {{axes: Array<object>}} context
 * @param {Function} [rng]
 * @returns {object|null} Eje elegido ({axis, tool, toolLevel, probability})
 */
function chooseAxis(context, rng = Math.random) {
  const axes = context?.axes || [];
  if (axes.length === 0) return null;
  const roll = rng();
  let cumulative = 0;
  for (const entry of axes) {
    cumulative += entry.probability;
    if (roll < cumulative) return entry;
  }
  return axes[axes.length - 1];
}

/**
 * Elige una banda según probabilidades normalizadas, con RNG inyectable.
 * @param {Record<string, number>} probabilities
 * @param {Function} [rng]
 * @returns {string|null}
 */
function sampleBand(probabilities, rng = Math.random) {
  const entries = Object.entries(probabilities);
  if (entries.length === 0) return null;
  const roll = rng();
  let cumulative = 0;
  for (const [band, probability] of entries) {
    cumulative += probability;
    if (roll < cumulative) return band;
  }
  return entries[entries.length - 1][0];
}

module.exports = {
  RARITY_AXIS_MATERIAL,
  materialForBandAxis,
  resolveZoneAxisContext,
  chooseAxis,
  sampleBand,
  rarityRatioForLevel,
};
