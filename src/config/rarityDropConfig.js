// @ts-nocheck
/**
 * Ley de obtención universal (B8.2b).
 *
 * Distribución geométrica entre rarezas adyacentes gobernada por el nivel de la
 * herramienta de recolección. La herramienta ya NO otorga bonus plano de botín:
 * subir de nivel "suaviza" la curva y hace más probable la rareza siguiente.
 *
 *   P(rareza i+1) = P(rareza i) / R(L)
 *   R(L) = 16 − 14.61 × (L − 1) / 9     (L1 → R=16, L10 → R=1.39)
 *
 * Cada zona declara un piso de rareza; por debajo del piso no se reparte
 * probabilidad y la curva se renormaliza sobre las bandas alcanzables.
 */

/** @constant RARITY_BANDS - Bandas de rareza del canon, de menor a mayor. */
const RARITY_BANDS = ["comun", "poco_comun", "raro", "epico", "legendario", "mitico"];

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
  rarityRatioForLevel,
  rarityBandProbabilities,
  MATERIAL_ROLLS_BY_DURATION,
};
