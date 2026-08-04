// @ts-nocheck
const { calculateMovementFatigue } = require("./fatigueEngine");

/**
 * Servicio de cobertura de armadura y bonos de set.
 *
 * Cobertura: total | alta | media | ligera ⇒ penalización sobre la velocidad de
 * movimiento (MSPD) y coste de fatiga por meter (el peso de la armadura dificulta
 * el desplazamiento). Sets: ≥3 piezas del mismo `setId` activan su bono.
 */

/**
 * Penalizaciones por nivel de cobertura.
 * @constant COVERAGE_RULES
 * @type {Record<string, { mspdPenalty: number, fatigueMult: number }>}
 */
const COVERAGE_RULES = {
  total: { mspdPenalty: 0.4, fatigueMult: 1.5 },
  alta: { mspdPenalty: 0.3, fatigueMult: 1.35 },
  media: { mspdPenalty: 0.2, fatigueMult: 1.2 },
  ligera: { mspdPenalty: 0.1, fatigueMult: 1.05 },
};

/**
 * Umbral de piezas para activar el bono de set.
 * @constant SET_BONUS_THRESHOLD
 * @type {number}
 */
const SET_BONUS_THRESHOLD = 3;

/**
 * Determina el efecto de cobertura dominante (la pieza más pesada manda).
 * @param {Array<object>} armorParts - Piezas con `coverage`
 * @returns {{ coverage: string, mspdPenalty: number, fatigueMult: number }}
 */
function getCoverage(armorParts = []) {
  let worst = { coverage: "ninguna", mspdPenalty: 0, fatigueMult: 1 };
  for (const part of armorParts) {
    const rule = COVERAGE_RULES[part?.coverage];
    if (!rule) continue;
    if (rule.mspdPenalty > worst.mspdPenalty) {
      worst = { coverage: part.coverage, ...rule };
    }
  }
  return worst;
}

/**
 * Aplica el coste de fatiga de movimiento penalizado por cobertura.
 * @param {number} meters - Distancia a desplazarse
 * @param {Array<object>} armorParts - Piezas de armadura equipadas
 * @returns {number}
 */
function getMovementFatigueWithCoverage(meters, armorParts = []) {
  const { fatigueMult } = getCoverage(armorParts);
  return Math.round(calculateMovementFatigue(meters) * fatigueMult);
}

/**
 * Cuenta piezas por setId.
 * @param {Array<object>} armorParts - Piezas con `setId`
 * @returns {Record<string, number>}
 */
function countSetPieces(armorParts = []) {
  const counts = {};
  for (const part of armorParts) {
    if (!part?.setId) continue;
    counts[part.setId] = (counts[part.setId] || 0) + 1;
  }
  return counts;
}

/**
 * Resuelve bonos de set activos (≥3 piezas).
 * @param {Array<object>} armorParts - Piezas con setId/coverage
 * @param {Record<string, object>} sets - { setId: { bonus: object } }
 * @returns {Array<{setId: string, count: number, active: boolean, bonus: object|null}>}
 */
function resolveSetBonuses(armorParts = [], sets = {}) {
  const counts = countSetPieces(armorParts);
  const result = [];
  for (const [setId, count] of Object.entries(counts)) {
    const active = count >= SET_BONUS_THRESHOLD;
    result.push({
      setId,
      name: sets[setId]?.name || setId,
      count,
      active,
      bonus: active ? sets[setId]?.bonus || null : null,
    });
  }
  return result;
}

module.exports = {
  COVERAGE_RULES,
  SET_BONUS_THRESHOLD,
  getCoverage,
  getMovementFatigueWithCoverage,
  countSetPieces,
  resolveSetBonuses,
};