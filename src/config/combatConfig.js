// @ts-nocheck
// TODO: Evaluar si 48h es excesivo — cada sesión inactiva retiene ~5KB en memoria por 2 días
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
  attack: 3,
  dodge: 6,
  block: 1,
  flee: 4,
  useItem: 2,
  receiveHit: 1,
};

const FATIGUE_RECOVERY = {
  block: 3,
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
};
