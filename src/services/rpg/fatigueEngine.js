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
  FATIGUE_BASE_PER_METER,
  FATIGUE_SCALE_PER_5M,
  FATIGUE_DISTANCE_BLOCK,
  MOVEMENT_FATIGUE_MIN,
  MOVEMENT_FATIGUE_DEF_REF,
  MSPD_TO_METERS,
  DOMINIO_REF,
  FULGOR_COST_BASE,
  FULGOR_DILUTED_MIN,
} = require("../../config/combatConfig");

/**
 * Obtiene el nivel de fatiga basado en el ratio fatiga/resistencia.
 * @param {number} fatigue - Nivel de fatiga actual
 * @param {number} resistance - Resistencia máxima contra fatiga
 * @returns {*} Nivel de fatiga con nombre, penalización y radio
 */
function getFatigueLevel(fatigue, resistance) {
  /**
   * @constant res
   */
  const res = Math.max(1, Number(resistance) || 1);
  /**
   * @constant ratio
   */
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

  /**
   * @constant result
   * @type {object}
   */
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
 * @param {object} options
 * @param {object} options
 * @param {*} actionName
 * @param {*} stats
 * @returns {number} Costo de fatiga calculado
 */
function calcFatigueCost(actionName, stats = {}) {
  /**
   * @constant base
   */
  const base = FATIGUE_COSTS[actionName] || 0;
  if (base === 0) return 0;

  /**
   * @constant atk
   */
  const atk = Number(stats.atk) || 0;
  /**
   * @constant def
   */
  const def = Number(stats.def) || 0;
  /**
   * @constant mspd
   */
  const mspd = Number(stats.mspd) || 0;

  if (actionName === "attack") {
    /**
     * @constant scaled
     */
    const scaled = base + atk * FATIGUE_ATK_COST_SCALE - def * FATIGUE_DEF_REDUCTION_SCALE;
    return Math.max(FATIGUE_COST_MIN, Math.round(scaled));
  }
  if (actionName === "dodge") {
    /**
     * @constant scaled
     */
    const scaled = base - mspd * FATIGUE_DODGE_MSPD_REDUCTION - def * FATIGUE_DEF_REDUCTION_SCALE;
    return Math.max(FATIGUE_COST_MIN, Math.round(scaled));
  }
  if (actionName === "flee") {
    /**
     * @constant scaled
     */
    const scaled = base - mspd * FATIGUE_DODGE_MSPD_REDUCTION - def * FATIGUE_DEF_REDUCTION_SCALE;
    return Math.max(FATIGUE_COST_MIN, Math.round(scaled));
  }
  return Math.max(FATIGUE_COST_MIN, base);
}

/**
 * Calcula la recuperación de fatiga según el método y nivel actual.
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {*} method
 * @param {*} fatigue
 * @param {*} resistance
 * @returns {number} Cantidad de fatiga recuperada
 */
function calcFatigueRecovery(method, fatigue, resistance) {
  /**
   * @constant base
   */
  const base = FATIGUE_RECOVERY[method] || 0;
  if (base === 0) return 0;
  const { recoveryMult } = getFatigueLevel(fatigue, resistance);
  /**
   * @constant def
   */
  const def = Number(resistance) || 0;
  /**
   * @constant defBonus
   */
  const defBonus = Math.floor(def * FATIGUE_REST_DEF_SCALE);
  /**
   * @constant total
   */
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

/**
 * Calculate fatigue cost for moving a given distance.
 * Fórmula LINEAL: coste por metro (FATIGUE_BASE_PER_METER) + coste adicional
 * POR BLOQUE de 5m (FATIGUE_SCALE_PER_5M). La versión anterior multiplicaba
 * blocks × meters × scale (cuadrática), que hacía prohibitivo correr cualquier
 * distancia >10m y colapsaba el ASPD del melee tras avanzar (dodge perpetuo a
 * niveles bajos).
 *
 * Escalado por condición física: si se pasa `resistance` (DEF del luchador), el
 * coste se multiplica por def/MOVEMENT_FATIGUE_DEF_REF, de modo que el ratio
 * fatiga/resistencia tras un desplazamiento es constante en todos los niveles.
 * Sin `resistance` devuelve el coste bruto (comportamiento original).
 * @param {number} meters
 * @param {number} [resistance] - DEF del luchador (escala por condición)
 * @returns {number}
 */
function calculateMovementFatigue(meters, resistance) {
  if (meters <= 0) return 0;
  const blocks = Math.floor(meters / FATIGUE_DISTANCE_BLOCK);
  const base = meters * FATIGUE_BASE_PER_METER + blocks * FATIGUE_SCALE_PER_5M;
  const def = Number(resistance) || 0;
  if (def > 0) {
    const scaled = (base * def) / MOVEMENT_FATIGUE_DEF_REF;
    return Math.max(MOVEMENT_FATIGUE_MIN, Math.round(scaled));
  }
  return Math.max(MOVEMENT_FATIGUE_MIN, base);
}

/**
 * Calculate maximum movement range based on MSPD stat.
 * @param {number} mspd
 * @returns {number}
 */
function getMovementRange(mspd) {
  return Math.floor((mspd || 0) * MSPD_TO_METERS);
}

/**
 * Coste de lanzamiento de un hechizo según dominio mágico (§11.5.2 / P3).
 * El dominio REDUCE el coste (más lanzamientos con la misma batería), pero nunca
 * suma daño directo (R6). Al alcanzar dominio puro (DOMINIO_REF) el coste se
 * aplana en un piso, nunca llega a 0.
 * @param {number} dominioMagico - d_fulgor del lanzador
 * @param {number} [costeBase] - Coste nominal (default FULGOR_COST_BASE)
 * @returns {number} Coste efectivo (≥ FULGOR_COST_BASE × FULGOR_DILUTED_MIN)
 */
function getCastCost(dominioMagico = 0, costeBase = FULGOR_COST_BASE) {
  const d = Math.max(0, Number(dominioMagico) || 0);
  const reduction = d / DOMINIO_REF;
  const raw = costeBase * (1 - reduction);
  const floor = costeBase * FULGOR_DILUTED_MIN;
  return Math.max(floor, Math.round(raw));
}

/**
 * Eficiencia de un lanzamiento diluido (A.2): si la batería actual no cubre el
 * coste efectivo del hechizo, el daño escala por `eff = fulgor_actual/coste`
 * con piso FULGOR_DILUTED_MIN. Nunca se prohíbe lanzar con batería parcial
 * ("todo o nada" es una elección, no un techo duro). Con batería suficiente la
 * eficiencia es 1 (lanzamiento pleno).
 * @param {number} fulgorActual - Batería de fulgor actual del lanzador
 * @param {number} coste - Coste efectivo del hechizo (getCastCost)
 * @returns {number} Eficiencia en [FULGOR_DILUTED_MIN, 1]
 */
function getCastEfficiency(fulgorActual = 0, coste = FULGOR_COST_BASE) {
  const f = Math.max(0, Number(fulgorActual) || 0);
  const c = Math.max(1, Number(coste) || FULGOR_COST_BASE);
  if (f >= c) return 1;
  return Math.max(FULGOR_DILUTED_MIN, f / c);
}

module.exports = {
  getFatigueLevel,
  applyFatiguePenalties,
  calcFatigueCost,
  calcFatigueRecovery,
  capFatigue,
  calculateMovementFatigue,
  getMovementRange,
  getCastCost,
  getCastEfficiency,
};
