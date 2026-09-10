// @ts-nocheck
const { JOB_TRAINING } = require("../../config/progressionBalance");

/**
 * Acumula puntos de entrenamiento hacia un atributo y convierte a +1 cuando se
 * cruza el umbral, respetando el tope semanal por atributo y el tope 100 de la stat.
 * Función pura: sin base de datos ni estado global.
 * @param {object} params
 * @param {number} params.points - Puntos ganados en esta jornada
 * @param {number} [params.currentPoints=0] - Puntos acumulados previos de la semana
 * @param {number} [params.weekGains=0] - Conversiones ya concedidas esta semana
 * @param {string} [params.trainingWeek] - Semana en la que se acumularon los puntos previos
 * @param {string} params.weekKey - Semana actual (YYYY-Www)
 * @param {number} [params.statValue=0] - Valor actual de la estadística
 * @param {number} [params.statCap=100] - Tope de la estadística
 * @param {number} [params.pointsPerStatPoint=JOB_TRAINING.pointsPerStatPoint]
 * @param {number} [params.weeklyCapPerStat=JOB_TRAINING.weeklyCapPerStat]
 * @returns {{pointsRemaining: number, weekGains: number, statValue: number, statIncreased: boolean, pointsPerStatPoint: number, weeklyCapPerStat: number}}
 */
function computeJobTraining({
  points,
  currentPoints = 0,
  weekGains = 0,
  trainingWeek,
  weekKey,
  statValue = 0,
  statCap = 100,
  pointsPerStatPoint = JOB_TRAINING.pointsPerStatPoint,
  weeklyCapPerStat = JOB_TRAINING.weeklyCapPerStat,
}) {
  const safePoints = Math.max(0, Math.floor(Number(points) || 0));
  const reset = trainingWeek !== weekKey;
  const basePoints = reset ? 0 : Math.max(0, Math.floor(Number(currentPoints) || 0));
  const baseGains = reset ? 0 : Math.max(0, Math.floor(Number(weekGains) || 0));

  let stat = Math.max(0, Math.floor(Number(statValue) || 0));

  if (stat >= statCap) {
    return {
      pointsRemaining: 0,
      weekGains: baseGains,
      statValue: stat,
      statIncreased: false,
      pointsPerStatPoint,
      weeklyCapPerStat,
    };
  }

  let accumulated = basePoints + safePoints;
  let consumed = 0;
  let gained = 0;

  while (accumulated - consumed >= pointsPerStatPoint && baseGains + gained < weeklyCapPerStat && stat < statCap) {
    consumed += pointsPerStatPoint;
    gained += 1;
    stat = Math.min(statCap, stat + 1);
  }

  return {
    pointsRemaining: accumulated - consumed,
    weekGains: baseGains + gained,
    statValue: stat,
    statIncreased: gained > 0,
    pointsPerStatPoint,
    weeklyCapPerStat,
  };
}

module.exports = { computeJobTraining };
