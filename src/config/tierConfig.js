// @ts-nocheck
/**
 * Tier Definitions & Multipliers for Items & Materials
 */

const TIERS = {
  E: { name: "E", label: "Escaso", mult: 1.12, penaltyBonus: 0.12, rank: 1 },
  D: { name: "D", label: "Distinguido", mult: 1.24, penaltyBonus: 0.24, rank: 2 },
  C: { name: "C", label: "Notable", mult: 1.36, penaltyBonus: 0.36, rank: 3 },
  B: { name: "B", label: "Bueno", mult: 1.48, penaltyBonus: 0.48, rank: 4 },
  A: { name: "A", label: "Alto", mult: 1.6, penaltyBonus: 0.6, rank: 5 },
  S: { name: "S", label: "Supremo", mult: 1.72, penaltyBonus: 0.72, rank: 6 },
  N: { name: "N", label: "Nirvana", mult: 1.84, penaltyBonus: 0.84, rank: 7 },
};

const CONTUNDENTE_PERFORANTE_MULT = {
  E: 1.2,
  D: 1.5,
  C: 2.0,
  B: 3.0,
  A: 4.0,
  S: 5.0,
  N: 6.0,
};

/**
 * Normaliza el tier de entrada a una clave válida (default "E").
 * @param {string} tier
 * @returns {string} Key de tier (E, D, C, B, A, S, N)
 */
function normalizeTier(tier) {
  const upper = String(tier || "E").toUpperCase();
  return TIERS[upper] ? upper : "E";
}

/**
 * Obtiene el multiplicador del tier.
 * @param {string} tier
 * @returns {number} Multiplicador (1.12 a 1.84)
 */
function getTierMultiplier(tier) {
  const key = normalizeTier(tier);
  return TIERS[key].mult;
}

/**
 * Obtiene el multiplicador especial de daño contundente / perforante (1.2 a 6.0).
 * @param {string} tier
 * @returns {number}
 */
function getSpecialTierMult(tier) {
  const key = normalizeTier(tier);
  return CONTUNDENTE_PERFORANTE_MULT[key] || 1.2;
}

/**
 * Obtiene la tasa de penetración/modificador según el rango del tier (0.12 a 0.84).
 * @param {string} tier
 * @returns {number}
 */
function getTierPenaltyBonus(tier) {
  const key = normalizeTier(tier);
  return TIERS[key].penaltyBonus;
}

module.exports = {
  TIERS,
  CONTUNDENTE_PERFORANTE_MULT,
  normalizeTier,
  getTierMultiplier,
  getSpecialTierMult,
  getTierPenaltyBonus,
};
