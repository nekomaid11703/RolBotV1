// 48h — retención aceptable dado que ~10 sesiones simultáneas = ~50KB. Decisión: mantener para UX.
const TURN_TIMEOUT_MS = 48 * 60 * 60 * 1000;
const DAMAGE_MIN = 1;
const BLOCK_REDUCTION = 0.25;
const MAX_ACTIVE_SESSIONS = 50;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

const SESSION_STATES = {
  WAITING_ACTION: "waiting_action",
  WAITING_REACTION: "waiting_reaction",
  COMPLETED: "completed",
  EXPIRED: "expired",
};

const FATIGUE_THRESHOLDS = [
  { maxRatio: 0.33, state: "pleno", name: "Pleno", penalty: 0, recoveryMult: 1.0 },
  { maxRatio: 0.66, state: "agitado", name: "Agitado", penalty: 0.2, recoveryMult: 0.5 },
  { maxRatio: 0.9, state: "cansado", name: "Cansado", penalty: 0.4, recoveryMult: 0.25 },
  { maxRatio: Infinity, state: "fatigado", name: "Fatigado", penalty: 0.6, recoveryMult: 0.125 },
];

const FATIGUE_COSTS = {
  attack: 1,
  dodge: 4,
  block: 0,
  flee: 3,
  useItem: 1,
  receiveHit: 1,
};

const FATIGUE_ATK_COST_SCALE = 0.05;
const FATIGUE_DEF_REDUCTION_SCALE = 0.01;
const FATIGUE_DODGE_MSPD_REDUCTION = 0.03;
const FATIGUE_REST_DEF_SCALE = 0.2;
const FATIGUE_COST_MIN = 1;
const FATIGUE_RECOVERY_MAX = 15;
const FATIGUE_MAX = 50;

const FATIGUE_RECOVERY = {
  block: 1,
  rest: 5,
};

const FATIGUE_SPEED_STATS = ["aspd", "mspd", "ref"];

module.exports = {
  TURN_TIMEOUT_MS,
  DAMAGE_MIN,
  BLOCK_REDUCTION,
  MAX_ACTIVE_SESSIONS,
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
