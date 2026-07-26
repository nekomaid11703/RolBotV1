// @ts-nocheck
/**
 * Combat Balance Configuration
 * Central service for ALL tunable combat magic numbers.
 * Modify constants here to adjust combat balance.
 * The simulation (scripts/simulate_battles.js) imports from here.
 * The engine (combatEngine.js, fatigueEngine.js) currently imports from combatConfig.js;
 * migrate individual values here as needed.
 */

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DAMAGE FORMULA
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/** Damage formula: atk * DAMAGE_DEFENSE_SCALE / (DAMAGE_DEFENSE_SCALE + def) */
const DAMAGE_DEFENSE_SCALE = 100;

/** Minimum damage floor */
const DAMAGE_MIN = 1;

/** Block damage reduction (0.25 = 25%) */
const BLOCK_REDUCTION = 0.25;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DISTANCE MECHANIC
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/** Maximum possible combat distance (meters) */
const MAX_DISTANCE = 500;

/** Starting distance when combat begins (meters) */
const INITIAL_DISTANCE = 5;

/** Base attack reach without MSPD contribution (meters) */
const BASE_ATTACK_RANGE = 1;

/** MSPD â†’ movement meters per turn: floor(mspd * MSPD_TO_METERS) */
const MSPD_TO_METERS = 0.5;

/** ASPD penalty per 5m block: penalty = -floor(distance / 5) * ASPD_PENALTY_PER_5M */
const ASPD_PENALTY_PER_5M = 1;

/** Divisor for distance grouping in ASPD penalty: floor(distance / ASPD_PENALTY_DISTANCE_BLOCK) */
const ASPD_PENALTY_DISTANCE_BLOCK = 5;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOVEMENT FATIGUE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/** Base fatigue cost per meter moved */
const FATIGUE_BASE_PER_METER = 1;

/** Additional fatigue per full 5m block moved */
const FATIGUE_SCALE_PER_5M = 1;

/** Divisor for distance grouping in movement fatigue: floor(meters / FATIGUE_DISTANCE_BLOCK) */
const FATIGUE_DISTANCE_BLOCK = 5;

/** Minimum movement fatigue cost (floor) */
const MOVEMENT_FATIGUE_MIN = 1;

/** Kite movement fatigue multiplier (defined but currently unused in engine) */
const KITE_FATIGUE_MULTIPLIER = 1.5;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FATIGUE COSTS (base values before stat scaling)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/** Base fatigue cost per action type */
const FATIGUE_COST_ATTACK = 1;
const FATIGUE_COST_DODGE = 4;
const FATIGUE_COST_BLOCK = 0;
const FATIGUE_COST_FLEE = 3;
const FATIGUE_COST_USE_ITEM = 1;
const FATIGUE_COST_RECEIVE_HIT = 1;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FATIGUE STAT SCALING
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/** ATK â†’ fatigue cost multiplier per point of ATK */
const FATIGUE_ATK_COST_SCALE = 0.05;

/** DEF â†’ fatigue cost reduction per point of DEF */
const FATIGUE_DEF_REDUCTION_SCALE = 0.01;

/** MSPD â†’ dodge fatigue cost reduction per MSPD point */
const FATIGUE_DODGE_MSPD_REDUCTION = 0.03;

/** DEF â†’ recovery bonus multiplier per DEF point */
const FATIGUE_REST_DEF_SCALE = 0.2;

/** Minimum possible fatigue cost */
const FATIGUE_COST_MIN = 1;

/** Maximum fatigue recovery per action */
const FATIGUE_RECOVERY_MAX = 15;

/** Fatigue cap */
const FATIGUE_MAX = 50;

/** Base fatigue recovery per reaction type */
const FATIGUE_RECOVERY_BLOCK = 1;
const FATIGUE_RECOVERY_REST = 5;

/** Stats affected by fatigue penalties */
const FATIGUE_SPEED_STATS = ["aspd", "mspd", "ref"];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FATIGUE THRESHOLDS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/**
 * Fatigue state thresholds (ratio of FATIGUE_MAX).
 * Each state defines a stat penalty and recovery multiplier.
 */
const FATIGUE_THRESHOLDS = [
  { maxRatio: 0.33, state: "pleno", name: "Pleno", penalty: 0, recoveryMult: 1.0 },
  { maxRatio: 0.66, state: "agitado", name: "Agitado", penalty: 0.2, recoveryMult: 0.5 },
  { maxRatio: 0.9,  state: "cansado", name: "Cansado", penalty: 0.4, recoveryMult: 0.25 },
  { maxRatio: Infinity, state: "fatigado", name: "Fatigado", penalty: 0.6, recoveryMult: 0.125 },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FLEE MECHANIC
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/** Flee success chances (currently hardcoded in combatEngine.js) */
const FLEE_CHANCE_HIGHER_MSPD = 1.0;   // fleer MSPD > pursuer MSPD â†’ guaranteed
const FLEE_CHANCE_EQUAL_MSPD = 0.5;    // fleer MSPD == pursuer MSPD â†’ 50%
const FLEE_CHANCE_LOWER_MSPD = 0.25;   // fleer MSPD < pursuer MSPD â†’ 25%

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// XP REWARDS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/** XP formula: baseXp = XP_BASE + enemyLevel * XP_PER_LEVEL */
const XP_BASE = 50;
const XP_PER_LEVEL = 2;

/** XP multiplier when losing */
const XP_LOSER_MULTIPLIER = 0.3;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STAT NORMALIZATION DEFAULTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/** Default stat value when a stat is missing (used in normalizeStats) */
const STAT_DEFAULT = 1;

/** Minimum floor for penalized stats after fatigue application */
const STAT_MIN_AFTER_PENALTY = 0;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SIMULATION-ONLY PARAMETERS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// These only affect the simulation script, not the real game engine.

/** AI dodge probability when dodge is feasible */
const SIM_AI_DODGE_CHANCE = 0.3;

/** Simulation level range */
const SIM_MIN_LEVEL = 100;
const SIM_MAX_LEVEL = 500;

/** Max level difference ratio for simulation pairing */
const SIM_MAX_LEVEL_DIFF = 0.1;

/** Simulation battle timeout in rounds */
const SIM_MAX_TURNS = 200;

/** Default number of simulation battles */
const SIM_DEFAULT_BATTLE_COUNT = 10000;

/** HP multiplier: hp_actual = hp_stat * HP_MULTIPLIER */
const SIM_HP_MULTIPLIER = 2;

/** Stat generation: initial base value per stat */
const SIM_STAT_BASE = 1;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// EXPORT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

module.exports = {
  // Damage
  DAMAGE_DEFENSE_SCALE,
  DAMAGE_MIN,
  BLOCK_REDUCTION,

  // Distance
  MAX_DISTANCE,
  INITIAL_DISTANCE,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_PER_5M,
  ASPD_PENALTY_DISTANCE_BLOCK,

  // Movement fatigue
  FATIGUE_BASE_PER_METER,
  FATIGUE_SCALE_PER_5M,
  FATIGUE_DISTANCE_BLOCK,
  MOVEMENT_FATIGUE_MIN,
  KITE_FATIGUE_MULTIPLIER,

  // Fatigue costs
  FATIGUE_COST_ATTACK,
  FATIGUE_COST_DODGE,
  FATIGUE_COST_BLOCK,
  FATIGUE_COST_FLEE,
  FATIGUE_COST_USE_ITEM,
  FATIGUE_COST_RECEIVE_HIT,

  // Fatigue scaling
  FATIGUE_ATK_COST_SCALE,
  FATIGUE_DEF_REDUCTION_SCALE,
  FATIGUE_DODGE_MSPD_REDUCTION,
  FATIGUE_REST_DEF_SCALE,
  FATIGUE_COST_MIN,
  FATIGUE_RECOVERY_MAX,
  FATIGUE_MAX,
  FATIGUE_RECOVERY_BLOCK,
  FATIGUE_RECOVERY_REST,
  FATIGUE_SPEED_STATS,
  FATIGUE_THRESHOLDS,

  // Flee
  FLEE_CHANCE_HIGHER_MSPD,
  FLEE_CHANCE_EQUAL_MSPD,
  FLEE_CHANCE_LOWER_MSPD,

  // XP
  XP_BASE,
  XP_PER_LEVEL,
  XP_LOSER_MULTIPLIER,

  // Stat defaults
  STAT_DEFAULT,
  STAT_MIN_AFTER_PENALTY,

  // Simulation
  SIM_AI_DODGE_CHANCE,
  SIM_MIN_LEVEL,
  SIM_MAX_LEVEL,
  SIM_MAX_LEVEL_DIFF,
  SIM_MAX_TURNS,
  SIM_DEFAULT_BATTLE_COUNT,
  SIM_HP_MULTIPLIER,
  SIM_STAT_BASE,
};
