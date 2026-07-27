// 48h — retención aceptable dado que ~10 sesiones simultáneas = ~50KB. Decisión: mantener para UX.
/**
 * @constant TURN_TIMEOUT_MS
 */
const TURN_TIMEOUT_MS = 48 * 60 * 60 * 1000;
/**
 * @constant DAMAGE_MIN
 * @type {number}
 */
const DAMAGE_MIN = 1;
/**
 * @constant BLOCK_REDUCTION
 * @type {number}
 */
const BLOCK_REDUCTION = 0.25;
/**
 * @constant MAX_ACTIVE_SESSIONS
 * @type {number}
 */
const MAX_ACTIVE_SESSIONS = 50;
/**
 * @constant CLEANUP_INTERVAL_MS
 */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

/**
 * @constant SESSION_STATES
 * @type {object}
 */
const SESSION_STATES = {
  WAITING_ACTION: "waiting_action",
  WAITING_REACTION: "waiting_reaction",
  COMPLETED: "completed",
  EXPIRED: "expired",
};

/**
 * @constant FATIGUE_THRESHOLDS
 * @type {*[]}
 */
const FATIGUE_THRESHOLDS = [
  { maxRatio: 0.33, state: "pleno", name: "Pleno", penalty: 0, recoveryMult: 1.0 },
  { maxRatio: 0.66, state: "agitado", name: "Agitado", penalty: 0.2, recoveryMult: 0.5 },
  { maxRatio: 0.9, state: "cansado", name: "Cansado", penalty: 0.4, recoveryMult: 0.25 },
  { maxRatio: Infinity, state: "fatigado", name: "Fatigado", penalty: 0.6, recoveryMult: 0.125 },
];

/**
 * @constant FATIGUE_COSTS
 * @type {object}
 */
const FATIGUE_COSTS = {
  attack: 1,
  dodge: 4,
  block: 0,
  flee: 3,
  useItem: 1,
  receiveHit: 1,
};

/**
 * @constant FATIGUE_ATK_COST_SCALE
 * @type {number}
 */
const FATIGUE_ATK_COST_SCALE = 0.05;
/**
 * @constant FATIGUE_DEF_REDUCTION_SCALE
 * @type {number}
 */
const FATIGUE_DEF_REDUCTION_SCALE = 0.01;
/**
 * @constant FATIGUE_DODGE_MSPD_REDUCTION
 * @type {number}
 */
const FATIGUE_DODGE_MSPD_REDUCTION = 0.03;
/**
 * @constant FATIGUE_REST_DEF_SCALE
 * @type {number}
 */
const FATIGUE_REST_DEF_SCALE = 0.2;
/**
 * @constant FATIGUE_COST_MIN
 * @type {number}
 */
const FATIGUE_COST_MIN = 1;
/**
 * @constant FATIGUE_RECOVERY_MAX
 * @type {number}
 */
const FATIGUE_RECOVERY_MAX = 15;
/**
 * @constant FATIGUE_MAX
 * @type {number}
 */
const FATIGUE_MAX = 50;

/**
 * @constant FATIGUE_RECOVERY
 * @type {object}
 */
const FATIGUE_RECOVERY = {
  block: 1,
  rest: 5,
};

/**
 * @constant MAX_DISTANCE
 * @type {number}
 */
const MAX_DISTANCE = 500;

/**
 * @constant FATIGUE_SPEED_STATS
 * @type {*[]}
 */
const FATIGUE_SPEED_STATS = ["aspd", "mspd", "ref"];

const {
  INITIAL_DISTANCE,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_PER_5M,
  ASPD_PENALTY_DISTANCE_BLOCK,
  FATIGUE_BASE_PER_METER,
  FATIGUE_SCALE_PER_5M,
  FATIGUE_DISTANCE_BLOCK,
  MOVEMENT_FATIGUE_MIN,
  KITE_FATIGUE_MULTIPLIER,
} = require("./combatBalance");

module.exports = {
  TURN_TIMEOUT_MS,
  DAMAGE_MIN,
  BLOCK_REDUCTION,
  MAX_ACTIVE_SESSIONS,
  MAX_DISTANCE,
  INITIAL_DISTANCE,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_PER_5M,
  ASPD_PENALTY_DISTANCE_BLOCK,
  FATIGUE_BASE_PER_METER,
  FATIGUE_SCALE_PER_5M,
  FATIGUE_DISTANCE_BLOCK,
  MOVEMENT_FATIGUE_MIN,
  KITE_FATIGUE_MULTIPLIER,
  CLEANUP_INTERVAL_MS,
  SESSION_STATES,
  FATIGUE_THRESHOLDS,
  FATIGUE_COSTS,
  FATIGUE_RECOVERY,
  FATIGUE_SPEED_STATS,
  FATIGUE_ATK_COST_SCALE,
  FATIGUE_DEF_REDUCTION_SCALE,
  FATIGUE_DODGE_MSPD_REDUCTION,
  FATIGUE_REST_DEF_SCALE,
  FATIGUE_COST_MIN,
  FATIGUE_RECOVERY_MAX,
  FATIGUE_MAX,
};
