// @ts-nocheck
const { FATIGUE_THRESHOLDS, FATIGUE_SPEED_STATS } = require("../../config/combatConfig");

/**
 *
 * @param fatigue
 * @param resistance
 */
function getFatigueLevel(fatigue, resistance) {
  const res = Math.max(1, Number(resistance) || 1);
  const ratio = Math.max(0, Number(fatigue) || 0) / res;

  for (const tier of FATIGUE_THRESHOLDS) {
    if (ratio <= tier.maxRatio) {
      return { ...tier, ratio };
    }
  }
  return { ...FATIGUE_THRESHOLDS[FATIGUE_THRESHOLDS.length - 1], ratio };
}

/**
 *
 * @param stats
 * @param fatigue
 * @param resistance
 */
function applyFatiguePenalties(stats, fatigue, resistance) {
  const { penalty } = getFatigueLevel(fatigue, resistance);
  if (penalty === 0) return { ...stats };

  const result = { ...stats };
  for (const key of FATIGUE_SPEED_STATS) {
    if (result[key] !== undefined) {
      result[key] = Math.max(0, Math.round(result[key] * (1 - penalty)));
    }
  }
  return result;
}

/**
 *
 * @param actionName
 * @param stats
 */
function calcFatigueCost(actionName, stats = {}) {
  const { FATIGUE_COSTS } = require("../../config/combatConfig");
  return FATIGUE_COSTS[actionName] || 0;
}

/**
 *
 * @param method
 * @param fatigue
 * @param resistance
 */
function calcFatigueRecovery(method, fatigue, resistance) {
  const { FATIGUE_RECOVERY } = require("../../config/combatConfig");
  const base = FATIGUE_RECOVERY[method] || 0;
  if (base === 0) return 0;
  const { recoveryMult } = getFatigueLevel(fatigue, resistance);
  return Math.max(0, Math.floor(base * recoveryMult));
}

module.exports = {
  getFatigueLevel,
  applyFatiguePenalties,
  calcFatigueCost,
  calcFatigueRecovery,
};
