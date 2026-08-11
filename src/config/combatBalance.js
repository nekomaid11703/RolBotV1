// @ts-nocheck
/**
 * Combat Balance Configuration
 * Central service for ALL tunable combat magic numbers.
 * Modify constants here to adjust combat balance.
 * The simulation (scripts/simulate_battles.js) imports from here.
 * The engine (combatEngine.js, fatigueEngine.js) currently imports from combatConfig.js;
 * migrate individual values here as needed.
 */

// ══════════════════════════════════════════
// DAMAGE FORMULA
// ══════════════════════════════════════════

/** Damage formula: atk * DAMAGE_DEFENSE_SCALE / (DAMAGE_DEFENSE_SCALE + def) */
const DAMAGE_DEFENSE_SCALE = 100;

/**
 * Techo de DEF efectiva en la mitigación (0 = sin techo, comportamiento actual).
 * >0 aplaña la curva: apilar DEF por encima del cap deja de reducir daño.
 * Hook de balance tuneable vía run_experiments.js.
 */
const DEF_MITIGATION_CAP = 0;

/** Minimum damage floor */
const DAMAGE_MIN = 1;

/** Block damage reduction (0.25 = 25%) */
const BLOCK_REDUCTION = 0.25;

// ══════════════════════════════════════════
// DISTANCE MECHANIC
// ══════════════════════════════════════════

/** Maximum possible combat distance (meters) */
const MAX_DISTANCE = 500;

/** Starting distance when combat begins (meters) */
const INITIAL_DISTANCE = 5;

/** Base attack reach without MSPD contribution (meters) */
const BASE_ATTACK_RANGE = 1;

/** MSPD → movement meters per turn: floor(mspd * MSPD_TO_METERS) */
const MSPD_TO_METERS = 0.5;

/** ASPD penalty per 5m block: penalty = -floor(distance / 5) * ASPD_PENALTY_PER_5M */
const ASPD_PENALTY_PER_5M = 1;

/** Divisor for distance grouping in ASPD penalty: floor(distance / ASPD_PENALTY_DISTANCE_BLOCK) */
const ASPD_PENALTY_DISTANCE_BLOCK = 5;

/** Perforante melee: multiplicador de ATK para el daño base (0.6 × atk) */
const PIERCE_ATK_SCALE = 0.6;

/** Perforante melee: peso del daño base del arma en el cuerpo (1.0 = completo, escala con tier) */
const PIERCE_WEAPON_SCALE = 1.0;

/** Contundente: peso del daño base del arma en el cuerpo (0.5 = mitad) */
const CONTUNDENTE_BODY_SCALE = 0.5;

/** Contundente: multiplicador del daño material (fijo 1.5x del cuerpo; rompe armadura sin destruir en 1 golpe) */
const CONTUNDENTE_MATERIAL_MULT = 1.5;

/**
 * Peso de la dependencia del ATK del portador sobre el daño base del arma.
 * 0 = comportamiento actual (el arma aporta baseDamage plano, no depende del ATK).
 * 1 = el arma aporta el 100% solo si atk >= WEAPON_ATK_REF (lineal desde 0).
 * Hook de balance tuneable vía run_experiments.js.
 */
const WEAPON_BASE_ATK_WEIGHT = 0;

/** ATK de referencia para normalizar la dependencia del arma: f(atk) = min(1, atk / REF) */
const WEAPON_ATK_REF = 80;

/** Ventaja de reflejos al defensor por bloque de distancia (ataque a distancia / sprint) */
const DISTANCE_REF_BLOCK = 10;
const DISTANCE_REF_BONUS = 1;

/** Decaimiento de daño del proyectil conforme se acerca al borde de su alcance */
const PROJECTILE_FALL_OFF_RATE = 0.5;
const PROJECTILE_MIN_SCALE = 0.5;

// ══════════════════════════════════════════
// ARCHER BALANCE (arco + flechas)
// ══════════════════════════════════════════

/**
 * Multiplicador de daño del arco por tier (único multiplicador del arco).
 * El daño final = nominalDamage(flecha) × BOW_DAMAGE_MULT × falloff.
 * Reemplaza el doble escalado (flecha × tier + arco × CONTUNDENTE_PERFORANTE_MULT).
 */
const BOW_DAMAGE_MULT = {
  E: 1.2,
  D: 1.8,
  C: 2.6,
  B: 3.5,
  A: 4.8,
  S: 6.2,
  N: 7.6,
};

/**
 * Velocidad base del proyectil por tier del arco (metros/turno de base).
 * Velocidad efectiva = atk × ATK_RANGE_SCALE + BOW_SPEED_BASE.
 */
const BOW_SPEED_BASE = {
  E: 6,
  D: 10,
  C: 14,
  B: 19,
  A: 24,
  S: 30,
  N: 36,
};

/**
 * Velocidad de ataque base del arco por tier (usado por resolveAttackerSpeed).
 * El arco NO usa ASPD del usuario: usa ATK + este base.
 */
const BOW_ASPD_BASE = {
  E: 5,
  D: 7,
  C: 9,
  B: 12,
  A: 15,
  S: 18,
  N: 22,
};

/**
 * Aerodinámica por tier de la FLECHA. Multiplica la velocidad → alcance, y
 * agrava la pérdida de daño con la distancia.
 */
const AERO = {
  E: 0.85,
  D: 1.0,
  C: 1.2,
  B: 1.45,
  A: 1.75,
  S: 2.1,
  N: 2.5,
};

/** Contribución de ATK del usuario a la velocidad del proyectil (por punto) */
const ATK_RANGE_SCALE = 0.25;

/**
 * Exponente del falloff: scale = 1 - (distancia/alcance)^FALLOFF_K.
 * K=1 → lineal; K>1 → el daño se mantiene más tiempo y colapsa al borde.
 */
const FALLOFF_K = 2;

/** Piso mínimo del alcance efectivo del arco (metros) */
const BOW_RANGE_MIN = 8;

/**
 * Escala de ATK sobre el daño del proyectil: suma `atk × PROJECTILE_ATK_SCALE`
 * al daño base de la flecha (antes del falloff). Valor 0 = comportamiento
 * original (daño solo por flecha × tier). Sirve para que el arco no se quede
 * atrás del melee a niveles altos (el melee escala ~0.8×ATK, la flecha solo
 * por tier).
 */
const PROJECTILE_ATK_SCALE = 0.5;

// ══════════════════════════════════════════
// MOVEMENT FATIGUE
// ══════════════════════════════════════════

/** Base fatigue cost per meter moved */
const FATIGUE_BASE_PER_METER = 1;

/** Additional fatigue per full 5m block moved */
const FATIGUE_SCALE_PER_5M = 1;

/** Divisor for distance grouping in movement fatigue: floor(meters / FATIGUE_DISTANCE_BLOCK) */
const FATIGUE_DISTANCE_BLOCK = 5;

/** Minimum movement fatigue cost (floor) */
const MOVEMENT_FATIGUE_MIN = 1;

/**
 * Resistencia (DEF) de referencia para escalar la fatiga de movimiento por
 * condición física. El coste de movimiento se multiplica por def/DEF_REF de
 * modo que el ratio fatiga/resistencia tras un desplazamiento sea constante en
 * TODOS los niveles (el movimiento no es proporcionalmente más caro a nivel
 * bajo, que colapsaba el ASPD del melee y volvía inútil el avance-y-ataque).
 * DEF_REF=50 corresponde al DEF del lab a nivel 300 (punto de equilibrio).
 */
const MOVEMENT_FATIGUE_DEF_REF = 50;

/** Kite movement fatigue multiplier (defined but currently unused in engine) */
const KITE_FATIGUE_MULTIPLIER = 1.5;

// ══════════════════════════════════════════
// FATIGUE COSTS (base values before stat scaling)
// ══════════════════════════════════════════

/** Base fatigue cost per action type */
const FATIGUE_COST_ATTACK = 1;
/**
 * @constant FATIGUE_COST_DODGE
 * @type {number}
 */
const FATIGUE_COST_DODGE = 4;
/**
 * @constant FATIGUE_COST_BLOCK
 * @type {number}
 */
const FATIGUE_COST_BLOCK = 0;
/**
 * @constant FATIGUE_COST_FLEE
 * @type {number}
 */
const FATIGUE_COST_FLEE = 3;
/**
 * @constant FATIGUE_COST_USE_ITEM
 * @type {number}
 */
const FATIGUE_COST_USE_ITEM = 1;
/**
 * @constant FATIGUE_COST_RECEIVE_HIT
 * @type {number}
 */
const FATIGUE_COST_RECEIVE_HIT = 1;

// ══════════════════════════════════════════
// FATIGUE STAT SCALING
// ══════════════════════════════════════════

/** ATK → fatigue cost multiplier per point of ATK */
const FATIGUE_ATK_COST_SCALE = 0.05;

/** DEF → fatigue cost reduction per point of DEF */
const FATIGUE_DEF_REDUCTION_SCALE = 0.01;

/** MSPD → dodge fatigue cost reduction per MSPD point */
const FATIGUE_DODGE_MSPD_REDUCTION = 0.03;

/** DEF → recovery bonus multiplier per DEF point */
const FATIGUE_REST_DEF_SCALE = 0.2;

/** Minimum possible fatigue cost */
const FATIGUE_COST_MIN = 1;

/** Maximum fatigue recovery per action */
const FATIGUE_RECOVERY_MAX = 15;

/** Fatigue cap */
const FATIGUE_MAX = 50;

/** Base fatigue recovery per reaction type */
const FATIGUE_RECOVERY_BLOCK = 1;
/**
 * @constant FATIGUE_RECOVERY_REST
 * @type {number}
 */
const FATIGUE_RECOVERY_REST = 5;

/** Stats affected by fatigue penalties */
const FATIGUE_SPEED_STATS = ["aspd", "mspd", "ref"];

// ══════════════════════════════════════════
// FATIGUE THRESHOLDS
// ══════════════════════════════════════════

/**
 * Fatigue state thresholds (ratio of FATIGUE_MAX).
 * Each state defines a stat penalty and recovery multiplier.
 */
const FATIGUE_THRESHOLDS = [
  { maxRatio: 0.33, state: "pleno", name: "Pleno", penalty: 0, recoveryMult: 1.0 },
  { maxRatio: 0.66, state: "agitado", name: "Agitado", penalty: 0.2, recoveryMult: 0.5 },
  { maxRatio: 0.9, state: "cansado", name: "Cansado", penalty: 0.4, recoveryMult: 0.25 },
  { maxRatio: Infinity, state: "fatigado", name: "Fatigado", penalty: 0.6, recoveryMult: 0.125 },
];

// ══════════════════════════════════════════
// FLEE MECHANIC
// ══════════════════════════════════════════

/** Flee success chances (currently hardcoded in combatEngine.js) */
const FLEE_CHANCE_HIGHER_MSPD = 1.0; // fleer MSPD > pursuer MSPD → guaranteed
/**
 * @constant FLEE_CHANCE_EQUAL_MSPD
 * @type {number}
 */
const FLEE_CHANCE_EQUAL_MSPD = 0.5; // fleer MSPD == pursuer MSPD → 50%
/**
 * @constant FLEE_CHANCE_LOWER_MSPD
 * @type {number}
 */
const FLEE_CHANCE_LOWER_MSPD = 0.25; // fleer MSPD < pursuer MSPD → 25%

// ══════════════════════════════════════════
// XP REWARDS
// ══════════════════════════════════════════

/** XP formula: baseXp = XP_BASE + enemyLevel * XP_PER_LEVEL */
const XP_BASE = 50;
/**
 * @constant XP_PER_LEVEL
 * @type {number}
 */
const XP_PER_LEVEL = 2;

/** XP multiplier when losing */
const XP_LOSER_MULTIPLIER = 0.3;

// ══════════════════════════════════════════
// STAT NORMALIZATION DEFAULTS
// ══════════════════════════════════════════

/** Default stat value when a stat is missing (used in normalizeStats) */
const STAT_DEFAULT = 1;

/** Minimum floor for penalized stats after fatigue application */
const STAT_MIN_AFTER_PENALTY = 0;

// ══════════════════════════════════════════
// SIMULATION-ONLY PARAMETERS
// ══════════════════════════════════════════
// These only affect the simulation script, not the real game engine.

/** AI dodge probability when dodge is feasible */
const SIM_AI_DODGE_CHANCE = 0.3;

/** Simulation level range */
const SIM_MIN_LEVEL = 100;
/**
 * @constant SIM_MAX_LEVEL
 * @type {number}
 */
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

// ══════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════

module.exports = {
  // Damage
  DAMAGE_DEFENSE_SCALE,
  DAMAGE_DEFENSE_SCALE,
  DEF_MITIGATION_CAP,
  DAMAGE_MIN,
  BLOCK_REDUCTION,

  // Distance
  MAX_DISTANCE,
  INITIAL_DISTANCE,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_PER_5M,
  ASPD_PENALTY_DISTANCE_BLOCK,

  // Perforante melee y distancia
  PIERCE_ATK_SCALE,
  PIERCE_WEAPON_SCALE,
  CONTUNDENTE_BODY_SCALE,
  CONTUNDENTE_MATERIAL_MULT,
  WEAPON_BASE_ATK_WEIGHT,
  WEAPON_ATK_REF,
  DISTANCE_REF_BLOCK,
  DISTANCE_REF_BONUS,
  PROJECTILE_FALL_OFF_RATE,
  PROJECTILE_MIN_SCALE,

  // Archer balance
  BOW_DAMAGE_MULT,
  BOW_SPEED_BASE,
  BOW_ASPD_BASE,
  AERO,
  ATK_RANGE_SCALE,
  FALLOFF_K,
  BOW_RANGE_MIN,
  PROJECTILE_ATK_SCALE,

  // Movement fatigue
  FATIGUE_BASE_PER_METER,
  FATIGUE_SCALE_PER_5M,
  FATIGUE_DISTANCE_BLOCK,
  MOVEMENT_FATIGUE_MIN,
  MOVEMENT_FATIGUE_DEF_REF,
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
