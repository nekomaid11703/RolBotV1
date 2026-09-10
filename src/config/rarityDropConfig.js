// @ts-nocheck
/**
 * Ley de obtención universal (B8.2b) + identidad por zona (P2).
 *
 * La rareza se decide con una distribución geométrica gobernada por el nivel de
 * la herramienta que recolecta el eje del drop:
 *
 *   P(rareza i+1) = P(rareza i) / R(L)
 *   R(L) = 16 − 14.61 × (L − 1) / 9     (L1 → R=16, L10 → R=1.39)
 *
 * Las zonas NO usan piso de probabilidad: cada una define multiplicadores por
 * especialización (`axisWeights`) que sesgan el eje del drop (flex menos filo/
 * cond en el bosque; cuevas con más filo/cond/res, etc.). Primero se tira el eje
 * según esos multiplicadores y su herramienta, y luego la rareza con R(L).
 */

/** @constant RARITY_BANDS - Bandas de rareza del canon, de menor a mayor. */
const RARITY_BANDS = ["comun", "poco_comun", "raro", "epico", "legendario", "mitico"];

/** @constant MATERIAL_AXES - Especializaciones de material (ejes del canon). */
const MATERIAL_AXES = ["filo", "cond", "res", "flex"];

/** Herramienta que recolecta cada especialización. */
const AXIS_TOOL = { filo: "pico", cond: "pico", res: "bolsa", flex: "hacha" };

/** Cantidad entregada por banda (unidad [min, max]); las raras vienen de a 1. */
const DROP_QTY_BY_RARITY = {
  comun: [2, 4],
  poco_comun: [2, 2],
  raro: [1, 1],
  epico: [1, 1],
  legendario: [1, 1],
  mitico: [1, 1],
};

/** @constant RARITY_BAND_INDEX - Índice de cada banda (0..5). */
const RARITY_BAND_INDEX = Object.fromEntries(RARITY_BANDS.map((band, index) => [band, index]));

const R_AT_L1 = 16;
const R_AT_L10 = 1.39;

/**
 * Ratios de rareza entre bandas adyacentes según el nivel de herramienta (1-10).
 * @param {number} toolLevel
 * @returns {number} R(L)
 */
function rarityRatioForLevel(toolLevel = 1) {
  const level = Math.max(1, Math.min(10, Number(toolLevel) || 1));
  const slope = (R_AT_L1 - R_AT_L10) / 9; // 14.61
  return R_AT_L1 - slope * (level - 1);
}

/**
 * Probabilidades por banda (normalizadas) según nivel, piso y bandas alcanzables.
 * @param {object} params
 * @param {number} [params.toolLevel=1]
 * @param {string} [params.floorRarity="comun"] - Piso de la zona (banda mínima)
 * @param {string[]} [params.accessibleBands] - Bandas con materiales presentes en la zona
 * @returns {Record<string, number>} { banda: probabilidad }
 */
function rarityBandProbabilities({ toolLevel = 1, floorRarity = "comun", accessibleBands } = {}) {
  const floorIdx = RARITY_BAND_INDEX[floorRarity] ?? 0;
  const ratio = rarityRatioForLevel(toolLevel);
  const step = 1 / ratio;

  const source =
    Array.isArray(accessibleBands) && accessibleBands.length > 0
      ? accessibleBands.map((band) => RARITY_BAND_INDEX[band]).filter((idx) => idx >= floorIdx)
      : RARITY_BANDS.map((_, idx) => idx).filter((idx) => idx >= floorIdx);

  const indexes = [...new Set(source)].sort((a, b) => a - b);

  const weights = indexes.map((idx) => Math.pow(step, idx - floorIdx));
  const sum = weights.reduce((acc, value) => acc + value, 0);

  const probabilities = {};
  indexes.forEach((idx, position) => {
    probabilities[RARITY_BANDS[idx]] = weights[position] / sum;
  });
  return probabilities;
}

/** Tiradas de material por duración de expedición (calibración P1/B8.2b). */
const MATERIAL_ROLLS_BY_DURATION = { corta: 2, media: 3, larga: 5 };

module.exports = {
  RARITY_BANDS,
  RARITY_BAND_INDEX,
  MATERIAL_AXES,
  AXIS_TOOL,
  DROP_QTY_BY_RARITY,
  rarityRatioForLevel,
  rarityBandProbabilities,
  MATERIAL_ROLLS_BY_DURATION,
};
