/**
 * Economía base (P2): el **salario mínimo** es 720 stelas por 100 de energía
 * (jornalero de campo / ayudante de panadería, los trabajos peor pagados) y la
 * jornada de referencia es de 120 min. De ahí: 1 minuto de juego = 6 stelas.
 * El `daily` máximo (100 base + 100 de racha = 200) equivale a ~0,28 jornadas:
 * sigue teniendo valor sin desplazar a los trabajos ni a la venta de materiales.
 * @constant MINIMUM_WAGE_PER_DAY
 * @type {number}
 */
const MINIMUM_WAGE_PER_DAY = 720;
/**
 * @constant WORKDAY_MINUTES
 * @type {number}
 */
const WORKDAY_MINUTES = 120;
/**
 * Valor de la stela por minuto de juego (salario mínimo / jornada).
 * @constant STELA_PER_MINUTE
 * @type {number}
 */
const STELA_PER_MINUTE = MINIMUM_WAGE_PER_DAY / WORKDAY_MINUTES;
/**
 * Margen del vendedor sobre el valor de tiempo del material.
 * @constant VENDOR_MARGIN
 * @type {number}
 */
const VENDOR_MARGIN = 0.15;

/**
 * @constant DAILY_BASE_REWARD
 * @type {number}
 */
const DAILY_BASE_REWARD = 100;
/**
 * @constant DAILY_COOLDOWN_HOURS
 * @type {number}
 */
const DAILY_COOLDOWN_HOURS = 20;
/**
 * @constant DAILY_STREAK_RESET_HOURS
 * @type {number}
 */
const DAILY_STREAK_RESET_HOURS = 48;
/**
 * @constant DAILY_STREAK_BONUS_PER_DAY
 * @type {number}
 */
const DAILY_STREAK_BONUS_PER_DAY = 10;
/**
 * @constant DAILY_STREAK_BONUS_CAP
 * @type {number}
 */
const DAILY_STREAK_BONUS_CAP = 100;
/**
 * @constant TOP_DINERO_LIMIT
 * @type {number}
 */
const TOP_DINERO_LIMIT = 10;

module.exports = {
  MINIMUM_WAGE_PER_DAY,
  WORKDAY_MINUTES,
  STELA_PER_MINUTE,
  VENDOR_MARGIN,
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
  TOP_DINERO_LIMIT,
};
