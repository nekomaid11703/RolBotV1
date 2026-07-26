// @ts-nocheck
const {
  FATIGUE_THRESHOLDS,
  FATIGUE_SPEED_STATS,
  FATIGUE_COSTS,
  FATIGUE_RECOVERY,
  FATIGUE_ATK_COST_SCALE,
  FATIGUE_DEF_REDUCTION_SCALE,
  FATIGUE_DODGE_MSPD_REDUCTION,
  FATIGUE_REST_DEF_SCALE,
  FATIGUE_COST_MIN,
  FATIGUE_RECOVERY_MAX,
  FATIGUE_MAX,
} = require("../../config/combatConfig");

/**
 * Obtiene el nivel de fatiga basado en el ratio fatiga/resistencia.
 * @param {number} fatigue - Nivel de fatiga actual
 * @param {number} resistance - Resistencia máxima contra fatiga
 * @returns {*} Nivel de fatiga con nombre, penalización y radio
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
 * Aplica penalizaciones por fatiga a las estadísticas de velocidad.
 * @param {*} stats - Estadísticas base del personaje
 * @param {number} fatigue - Nivel de fatiga actual
 * @param {number} resistance - Resistencia a fatiga
 * @returns {*} Estadísticas con penalizaciones de fatiga aplicadas
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
 * Calcula el costo de fatiga de una acción basado en estadísticas.
 * @param {string} actionName - Nombre de la acción ('attack', 'dodge', 'flee', etc.)
 * @param {*} [stats] - Estadísticas del personaje
 * @returns {number} Costo de fatiga calculado
 */
function calcFatigueCost(actionName, stats = {}) {
  const base = FATIGUE_COSTS[actionName] || 0;
  if (base === 0) return 0;

  const atk = Number(stats.atk) || 0;
  const def = Number(stats.def) || 0;
  const mspd = Number(stats.mspd) || 0;

  if (actionName === "attack") {
    const scaled = base + atk * FATIGUE_ATK_COST_SCALE - def * FATIGUE_DEF_REDUCTION_SCALE;
    return Math.max(FATIGUE_COST_MIN, Math.round(scaled));
  }
  if (actionName === "dodge") {
    const scaled = base - mspd * FATIGUE_DODGE_MSPD_REDUCTION - def * FATIGUE_DEF_REDUCTION_SCALE;
    return Math.max(FATIGUE_COST_MIN, Math.round(scaled));
  }
  if (actionName === "flee") {
    const scaled = base - mspd * FATIGUE_DODGE_MSPD_REDUCTION - def * FATIGUE_DEF_REDUCTION_SCALE;
    return Math.max(FATIGUE_COST_MIN, Math.round(scaled));
  }
  return Math.max(FATIGUE_COST_MIN, base);
}

/**
 * Calcula la recuperación de fatiga según el método y nivel actual.
 * @param {string} method - Método de recuperación ('rest', etc.)
 * @param {number} fatigue - Nivel de fatiga actual
 * @param {number} resistance - Resistencia máxima
 * @returns {number} Cantidad de fatiga recuperada
 */
function calcFatigueRecovery(method, fatigue, resistance) {
  const base = FATIGUE_RECOVERY[method] || 0;
  if (base === 0) return 0;
  const { recoveryMult } = getFatigueLevel(fatigue, resistance);
  const def = Number(resistance) || 0;
  const defBonus = Math.floor(def * FATIGUE_REST_DEF_SCALE);
  const total = Math.min(FATIGUE_RECOVERY_MAX, base + defBonus);
  return Math.max(0, Math.floor(total * recoveryMult));
}

/**
 * Limita el valor de fatiga entre 0 y FATIGUE_MAX.
 * @param {number} fatigue - Valor de fatiga a limitar
 * @returns {number} Fatiga limitada dentro del rango válido
 */
function capFatigue(fatigue) {
  return Math.min(FATIGUE_MAX, Math.max(0, Number(fatigue) || 0));
}

module.exports = {
  getFatigueLevel,
  applyFatiguePenalties,
  calcFatigueCost,
  calcFatigueRecovery,
  capFatigue,
};
