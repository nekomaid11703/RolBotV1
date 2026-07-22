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
  atk: { label: "ATK", name: "Ataque", min: 1, max: 100, icon: "⚔️" },
  def: { label: "DEF", name: "Resistencia", min: 1, max: 100, icon: "🛡️" },
  aspd: { label: "ASPD", name: "Vel. Ataque", min: 1, max: 100, icon: "⚡" },
  ref: { label: "REF", name: "Reflejos", min: 1, max: 100, icon: "👁️" },
  mspd: { label: "MSPD", name: "Vel. Movimiento", min: 1, max: 100, icon: "💨" },
  fulgor: { label: "FULGOR", name: "Capacidad Magica", min: 1, max: 100, icon: "✨" },
  d_fulgor: { label: "D_FULGOR", name: "Dominio Magico", min: 1, max: 100, icon: "🔮" },
  r_fulgor: { label: "R_FULGOR", name: "Resistencia Magica", min: 1, max: 100, icon: "🛡️" },
};

const HP_MAX = 100;

const DEFAULT_CHARACTER_STATS = {
  hp: HP_MAX,
  atk: 0,
  def: 0,
  aspd: 0,
  ref: 0,
  mspd: 0,
  fulgor: 0,
  d_fulgor: 0,
  r_fulgor: 0,
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
// RACES
// =========================
// Race baseStats add to DEFAULT_CHARACTER_STATS at creation
// Total race contribution = sum of baseStats values = 50 points

const RACES = {
  humano: {
    name: "Humano",
    description: "Adaptabilidad equilibrada.",
    aliases: ["humano", "humana", "human", "humans"],
    baseStats: { atk: 6, def: 6, aspd: 6, ref: 6, mspd: 6, fulgor: 7, d_fulgor: 7, r_fulgor: 6 },
  },
  elfo: {
    name: "Elfo",
    description: "Especialistas magicos y agiles.",
    aliases: ["elfo", "elfa", "elf", "elves"],
    baseStats: { atk: 4, def: 4, aspd: 6, ref: 8, mspd: 8, fulgor: 7, d_fulgor: 6, r_fulgor: 7 },
  },
  enano: {
    name: "Enano",
    description: "Tanques resistentes y fisicos.",
    aliases: ["enano", "enana", "dwarf", "dwarves"],
    baseStats: { atk: 10, def: 12, aspd: 7, ref: 3, mspd: 3, fulgor: 5, d_fulgor: 4, r_fulgor: 6 },
  },
  duende: {
    name: "Duende",
    description: "Especialistas tecnicos y veloces.",
    aliases: ["duende", "duendes", "goblin", "goblins"],
    baseStats: { atk: 3, def: 4, aspd: 7, ref: 10, mspd: 9, fulgor: 6, d_fulgor: 6, r_fulgor: 5 },
  },
  oni: {
    name: "Oni",
    description: "Fuerza bruta extrema.",
    aliases: ["oni", "onis", "ogro", "ogro"],
    baseStats: { atk: 14, def: 10, aspd: 8, ref: 2, mspd: 5, fulgor: 5, d_fulgor: 3, r_fulgor: 3 },
  },
  elemental: {
    name: "Elemental",
    description: "Equilibrio fisico y magico.",
    aliases: ["elemental", "elementales"],
    baseStats: { atk: 5, def: 6, aspd: 5, ref: 7, mspd: 6, fulgor: 7, d_fulgor: 6, r_fulgor: 8 },
  },
  dragon: {
    name: "Dragon",
    description: "Raza superior equilibrada.",
    aliases: ["dragon", "dragones", "draconiano", "draconian"],
    baseStats: { atk: 11, def: 9, aspd: 6, ref: 6, mspd: 7, fulgor: 3, d_fulgor: 3, r_fulgor: 5 },
  },
  yordle: {
    name: "Yordle",
    description: "Caoticos y evasivos.",
    aliases: ["yordle", "yordles"],
    baseStats: { atk: 3, def: 4, aspd: 5, ref: 10, mspd: 10, fulgor: 6, d_fulgor: 7, r_fulgor: 5 },
  },
  no_muerto: {
    name: "No Muerto",
    description: "Resistencia sobre movilidad.",
    aliases: ["no_muerto", "no_muertos", "undead", "zombie", "zombi"],
    baseStats: { atk: 6, def: 10, aspd: 6, ref: 3, mspd: 3, fulgor: 7, d_fulgor: 7, r_fulgor: 8 },
  },
  vampiro: {
    name: "Vampiro",
    description: "Equilibrados con enfoque magico.",
    aliases: ["vampiro", "vampiros", "vampire", "vampires"],
    baseStats: { atk: 8, def: 6, aspd: 6, ref: 7, mspd: 8, fulgor: 5, d_fulgor: 5, r_fulgor: 5 },
  },
  furry: {
    name: "Furry",
    description: "Instinto y movilidad.",
    aliases: ["furry", "furrys", "bestia", "beast"],
    baseStats: { atk: 6, def: 6, aspd: 6, ref: 9, mspd: 8, fulgor: 6, d_fulgor: 5, r_fulgor: 4 },
  },
  hada: {
    name: "Hada",
    description: "Maxima velocidad y magia.",
    aliases: ["hada", "hadas", "ninfa", "ninfa", "fairy", "nymph"],
    baseStats: { atk: 2, def: 3, aspd: 5, ref: 10, mspd: 12, fulgor: 6, d_fulgor: 7, r_fulgor: 5 },
  },
  automata: {
    name: "Automata",
    description: "Maxima resistencia fisica.",
    aliases: ["automata", "automatas", "robot", "constructo"],
    baseStats: { atk: 10, def: 13, aspd: 7, ref: 3, mspd: 3, fulgor: 5, d_fulgor: 4, r_fulgor: 5 },
  },
  trickster: {
    name: "Trickster",
    description: "Especialistas en evasion y engano.",
    aliases: ["trickster", "tricksters", "embaucador"],
    baseStats: { atk: 2, def: 3, aspd: 5, ref: 11, mspd: 12, fulgor: 5, d_fulgor: 7, r_fulgor: 5 },
  },
  puppet: {
    name: "Puppet",
    description: "Equilibrio artificial.",
    aliases: ["puppet", "puppets", "marioneta", "titere"],
    baseStats: { atk: 5, def: 8, aspd: 5, ref: 7, mspd: 6, fulgor: 5, d_fulgor: 6, r_fulgor: 8 },
  },
  encarnacion: {
    name: "Encarnacion",
    description: "Poder explosivo.",
    aliases: ["encarnacion", "encarnaciones", "incarnation"],
    baseStats: { atk: 7, def: 7, aspd: 6, ref: 6, mspd: 6, fulgor: 6, d_fulgor: 6, r_fulgor: 6 },
  },
  ser_del_vacio: {
    name: "Ser del Vacio",
    description: "Corrupcion magica.",
    aliases: ["ser_del_vacio", "seres_del_vacio", "void", "vacio"],
    baseStats: { atk: 7, def: 6, aspd: 5, ref: 5, mspd: 6, fulgor: 7, d_fulgor: 6, r_fulgor: 8 },
  },
  angel: {
    name: "Angel",
    description: "Equilibrio sagrado.",
    aliases: ["angel", "angeles", "angelical"],
    baseStats: { atk: 8, def: 7, aspd: 6, ref: 6, mspd: 6, fulgor: 5, d_fulgor: 5, r_fulgor: 7 },
  },
  graviton: {
    name: "Graviton",
    description: "Control del campo.",
    aliases: ["graviton", "gravitons"],
    baseStats: { atk: 8, def: 10, aspd: 5, ref: 6, mspd: 5, fulgor: 5, d_fulgor: 5, r_fulgor: 6 },
  },
  sirena: {
    name: "Sirena",
    description: "Especialistas acuaticos.",
    aliases: ["sirena", "sirenas", "triton", "tritones", "mermaid"],
    baseStats: { atk: 4, def: 5, aspd: 5, ref: 9, mspd: 8, fulgor: 7, d_fulgor: 7, r_fulgor: 5 },
  },
  demonio: {
    name: "Demonio",
    description: "Poder ofensivo y magico.",
    aliases: ["demonio", "demonios", "demon", "demons"],
    baseStats: { atk: 8, def: 7, aspd: 7, ref: 5, mspd: 6, fulgor: 6, d_fulgor: 6, r_fulgor: 5 },
  },
};

// =========================
// CLASSES
// =========================

const CLASSES = {
  civil: {
    name: "Civil",
    description: "Gente comun con habilidades basicas. Sus puntos estan repartidos de forma uniforme.",
    baseStats: { atk: 6, def: 6, aspd: 6, ref: 6, mspd: 6, fulgor: 6, d_fulgor: 7, r_fulgor: 7 },
  },
  aventurero: {
    name: "Aventurero",
    description: "Explorador y combatiente. Sus puntos estan mayormente en velocidades y fuerza.",
    baseStats: { atk: 10, def: 4, aspd: 8, ref: 5, mspd: 5, fulgor: 5, d_fulgor: 6, r_fulgor: 7 },
  },
  ladron: {
    name: "Ladron",
    description: "Especialista en velocidad y sigilo. Sus puntos estan enfocados en velocidades.",
    baseStats: { atk: 4, def: 4, aspd: 7, ref: 10, mspd: 7, fulgor: 5, d_fulgor: 6, r_fulgor: 7 },
  },
  comerciante: {
    name: "Comerciante",
    description: "Velocidad y astucia. Sus puntos estan enfocados en velocidades.",
    baseStats: { atk: 4, def: 5, aspd: 8, ref: 7, mspd: 7, fulgor: 5, d_fulgor: 7, r_fulgor: 7 },
  },
};

// =========================
// LEVEL SYSTEM
// =========================

const LEVEL_INITIAL = 100;
const LEVEL_MAX = 500;
const FREE_POINTS_AT_CREATION = 50;

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
  MAX_CHARACTER_NAME_LENGTH,
  MAX_SLOT_SIZE,
  MAX_CHARACTERS_PER_USER,
};
