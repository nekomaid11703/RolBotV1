// @ts-nocheck
const { calculateXpReward } = require("./combatEngine");
const { xpForNextLevel, clampLevel } = require("../../config/characterConfig");
const { XP_RULES } = require("../../config/progressionBalance");

/**
 * XP por victoria de combate (política B1 / P1).
 * - El PvP contra humano aplica prima de riesgo (1.25×) frente al PvE dummy.
 * - Vencer a un rival de nivel superior añade bonus proporcional al hueco.
 * - El multiplicador total queda acotado por maxRiskMultiplier.
 * @param {object} params
 * @param {number} params.winnerLevel
 * @param {number} params.loserLevel
 * @param {boolean} [params.isPvE=false]
 * @returns {number}
 */
function combatVictoryXp({ winnerLevel, loserLevel, isPvE = false }) {
  const winner = clampLevel(winnerLevel || 1);
  const loser = clampLevel(loserLevel || 1);
  const base = calculateXpReward(loser, true);
  const pvpMultiplier = isPvE ? 1 : XP_RULES.pvpRiskPremium;
  const gapRatio = loser > winner ? (loser - winner) / Math.max(1, winner) : 0;
  const gapMultiplier = 1 + gapRatio * XP_RULES.levelGapPremiumScale;
  return Math.max(1, Math.floor(base * pvpMultiplier * Math.min(XP_RULES.maxRiskMultiplier, gapMultiplier)));
}

/**
 * Escala una recompensa base de actividad al requisito XP del nivel del
 * personaje: share = shareBase × (weight/reference) del XP del siguiente nivel.
 * @param {object} params
 * @param {number} params.level
 * @param {number} params.weight - Peso de la actividad (ej. xpReward del trabajo)
 * @param {number} params.shareBase
 * @param {number} params.reference
 * @returns {number}
 */
function scaleActivityXpToLevel({ level, weight, shareBase, reference }) {
  const lvl = clampLevel(level || 1);
  const share = shareBase * ((weight || 0) / reference);
  return Math.max(1, Math.round(xpForNextLevel(lvl) * share));
}

function jobXpForLevel(level, jobXpWeight = XP_RULES.jobShareReference) {
  return scaleActivityXpToLevel({
    level,
    weight: jobXpWeight,
    shareBase: XP_RULES.jobShareBase,
    reference: XP_RULES.jobShareReference,
  });
}

function expeditionXpForLevel(level, xpWeight) {
  return scaleActivityXpToLevel({
    level,
    weight: xpWeight,
    shareBase: XP_RULES.expeditionShareBase,
    reference: XP_RULES.expeditionShareReference,
  });
}

module.exports = { combatVictoryXp, scaleActivityXpToLevel, jobXpForLevel, expeditionXpForLevel };
