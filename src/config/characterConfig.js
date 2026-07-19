// @ts-nocheck

// =========================
// STATS — V1.0 COMBAT UPDATE
// =========================
// To add new stats in future updates:
// 1. Add entry to LEVELABLE_STATS
// 2. Add default value to DEFAULT_CHARACTER_STATS
// 3. Add to all RACES[race].baseStats
// Stats are stored in JSONB — no schema migration needed for new keys.

const LEVELABLE_STATS = {
  str: { label: "STR", name: "Fuerza", min: 1, max: 100, icon: "⚔️" },
  def: { label: "DEF", name: "Defensa", min: 1, max: 100, icon: "🛡️" },
  spd_atk: { label: "SPD_ATK", name: "Vel. Ataque", min: 1, max: 100, icon: "⚡" },
  ref: { label: "REF", name: "Reflejos", min: 1, max: 100, icon: "👁️" },
  spd_mov: { label: "SPD_MOV", name: "Vel. Movimiento", min: 1, max: 100, icon: "💨" },
};

const HP_MAX = 100;

const DEFAULT_CHARACTER_STATS = {
  hp: HP_MAX,
  str: 0,
  def: 0,
  spd_atk: 0,
  ref: 0,
  spd_mov: 0,
};

// =========================
// SLOTS
// =========================

const DEFAULT_CHARACTER_SLOTS = {
  descripcion: "",
  historia: "",
  habilidades: [],
};

// =========================
// RACES (v1.0: only Human)
// =========================
// Race baseStats add to DEFAULT_CHARACTER_STATS at creation
// Total race contribution = sum of baseStats values = 10 points

const RACES = {
  humano: {
    name: "Humano",
    description: "Versátil y equilibrado, sin debilidades ni fortalezas extremas.",
    baseStats: { str: 2, def: 2, spd_atk: 2, ref: 2, spd_mov: 2 },
  },
};

// =========================
// CLASSES
// =========================

const CLASSES = {
  civil: {
    name: "Civil",
    description: "Gente común con habilidades básicas. Sus puntos están repartidos de forma uniforme.",
    baseStats: { str: 2, def: 2, spd_atk: 2, ref: 2, spd_mov: 2 },
    skillsByLevel: { 20: "vendas", 44: "golpe_firme" },
  },
  aventurero: {
    name: "Aventurero",
    description: "Explorador y combatiente. Sus puntos están mayormente en velocidades y fuerza.",
    baseStats: { str: 4, def: 1, spd_atk: 3, ref: 1, spd_mov: 1 },
    skillsByLevel: { 20: "ataque_veloz", 44: "doble_golpe" },
  },
  ladron: {
    name: "Ladrón",
    description: "Especialista en velocidad y sigilo. Sus puntos están enfocados en velocidades.",
    baseStats: { str: 1, def: 1, spd_atk: 2, ref: 4, spd_mov: 2 },
    skillsByLevel: { 20: "golpe_sombra", 44: "evasion" },
  },
  comerciante: {
    name: "Comerciante",
    description: "Velocidad y astucia. Sus puntos están enfocados en velocidades.",
    baseStats: { str: 1, def: 2, spd_atk: 3, ref: 2, spd_mov: 2 },
    skillsByLevel: { 20: "venda_rapida", 44: "golpe_astuto" },
  },
};

// =========================
// LEVEL SYSTEM
// =========================

const LEVEL_INITIAL = 20;
const LEVEL_MAX = 500;
const FREE_POINTS_AT_CREATION = 10;

const XP_CURVE_BASE = 10;
const XP_CURVE_EXPONENT = 1.2;

/**
 *
 * @param currentLevel
 */
function xpForNextLevel(currentLevel) {
  return Math.floor(XP_CURVE_BASE * Math.pow(currentLevel, XP_CURVE_EXPONENT));
}

/**
 *
 * @param stats
 */
function calculateLevel(stats) {
  let sum = 0;
  for (const key of Object.keys(LEVELABLE_STATS)) {
    sum += stats[key] || 0;
  }
  return Math.max(LEVEL_INITIAL, sum);
}

// =========================
// RANGO (cosmetic)
// =========================

const RANGOS = ["F", "E", "D", "C", "B", "A", "S"];

/**
 *
 */
function rangosDisponibles() {
  return RANGOS;
}

// =========================
// HP THRESHOLDS
// =========================

const HP_THRESHOLDS = [
  { min: 60, max: 100, state: "optimal", name: "Óptimas", penalty: 0 },
  { min: 35, max: 59, state: "hurt", name: "Lastimado", penalty: 0.2 },
  { min: 25, max: 34, state: "incapacitated", name: "Incapacitado", penalty: 0.5 },
  { min: 1, max: 24, state: "ko", name: "K.O.", penalty: 1.0 },
  { min: 0, max: 0, state: "dead", name: "Muerto", penalty: 1.0 },
];

/**
 *
 * @param hp
 */
function getHpState(hp) {
  for (const t of HP_THRESHOLDS) {
    if (hp >= t.min && hp <= t.max) return t;
  }
  return HP_THRESHOLDS[HP_THRESHOLDS.length - 1];
}

// =========================
// SKILL SLOTS BY LEVEL
// =========================

const SKILL_SLOTS_BY_LEVEL = [
  { level: 20, slots: 2 },
  { level: 48, slots: 3 },
  { level: 76, slots: 4 },
  { level: 105, slots: 5 },
  { level: 134, slots: 6 },
  { level: 163, slots: 7 },
  { level: 192, slots: 8 },
  { level: 221, slots: 9 },
  { level: 250, slots: 10 },
];

/**
 *
 * @param level
 */
function maxSkillSlots(level) {
  let maxSlots = 1;
  for (const entry of SKILL_SLOTS_BY_LEVEL) {
    if (level >= entry.level) maxSlots = entry.slots;
  }
  return Math.min(maxSlots, SKILL_SLOTS_BY_LEVEL[SKILL_SLOTS_BY_LEVEL.length - 1].slots);
}

// =========================
// LIMITS
// =========================

const MAX_CHARACTER_NAME_LENGTH = 40;
const MAX_SLOT_SIZE = 5000;
const MAX_CHARACTERS_PER_USER = 5;

// =========================
// EXPORTS
// =========================

module.exports = {
  LEVELABLE_STATS,
  HP_MAX,
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  RACES,
  CLASSES,
  LEVEL_INITIAL,
  LEVEL_MAX,
  FREE_POINTS_AT_CREATION,
  XP_CURVE_BASE,
  XP_CURVE_EXPONENT,
  xpForNextLevel,
  calculateLevel,
  RANGOS,
  rangosDisponibles,
  HP_THRESHOLDS,
  getHpState,
  SKILL_SLOTS_BY_LEVEL,
  maxSkillSlots,
  MAX_CHARACTER_NAME_LENGTH,
  MAX_SLOT_SIZE,
  MAX_CHARACTERS_PER_USER,
};
