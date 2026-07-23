// @ts-nocheck
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

module.exports = {
  TURN_TIMEOUT_MS,
  DAMAGE_MIN,
  BLOCK_REDUCTION,
  MAX_ACTIVE_SESSIONS,
  CLEANUP_INTERVAL_MS,
  SESSION_STATES,
};
