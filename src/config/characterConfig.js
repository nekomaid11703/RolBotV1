// =========================
// STATS — V1.0 COMBAT UPDATE
// =========================
// To add new stats in future updates:
// 1. Add entry to LEVELABLE_STATS
// 2. Add default value to DEFAULT_CHARACTER_STATS
// 3. Add to all RACES[race].baseStats
// Stats are stored in JSONB — no schema migration needed for new keys.

const LEVELABLE_STATS = {
  hp: { label: "HP", name: "Vida Base", min: 1, max: 100, icon: "❤️" },
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
  hp: 1,
  atk: 1,
  def: 1,
  aspd: 1,
  ref: 1,
  mspd: 1,
  fulgor: 1,
  d_fulgor: 1,
  r_fulgor: 1,
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
    baseStats: { atk: 6, def: 6, aspd: 5, ref: 5, mspd: 5, fulgor: 6, d_fulgor: 5, r_fulgor: 5, hp: 7 },
  },
  elfo: {
    name: "Elfo",
    description: "Especialistas magicos y agiles.",
    aliases: ["elfo", "elfa", "elf", "elves"],
    baseStats: { atk: 4, def: 3, aspd: 7, ref: 8, mspd: 7, fulgor: 6, d_fulgor: 5, r_fulgor: 6, hp: 4 },
  },
  enano: {
    name: "Enano",
    description: "Tanques resistentes y fisicos.",
    aliases: ["enano", "enana", "dwarf", "dwarves"],
    baseStats: { atk: 8, def: 10, aspd: 5, ref: 3, mspd: 3, fulgor: 4, d_fulgor: 4, r_fulgor: 4, hp: 9 },
  },
  duende: {
    name: "Duende",
    description: "Especialistas tecnicos y veloces.",
    aliases: ["duende", "duendes", "goblin", "goblins"],
    baseStats: { atk: 3, def: 3, aspd: 7, ref: 9, mspd: 8, fulgor: 5, d_fulgor: 5, r_fulgor: 4, hp: 6 },
  },
  oni: {
    name: "Oni",
    description: "Fuerza bruta extrema.",
    aliases: ["oni", "onis", "ogro", "ogro"],
    baseStats: { atk: 11, def: 7, aspd: 6, ref: 2, mspd: 4, fulgor: 4, d_fulgor: 3, r_fulgor: 3, hp: 10 },
  },
  elemental: {
    name: "Elemental",
    description: "Equilibrio fisico y magico.",
    aliases: ["elemental", "elementales"],
    baseStats: { atk: 5, def: 5, aspd: 5, ref: 6, mspd: 5, fulgor: 6, d_fulgor: 5, r_fulgor: 7, hp: 6 },
  },
  dragon: {
    name: "Dragon",
    description: "Raza superior equilibrada.",
    aliases: ["dragon", "dragones", "draconiano", "draconian"],
    baseStats: { atk: 10, def: 8, aspd: 5, ref: 5, mspd: 6, fulgor: 3, d_fulgor: 3, r_fulgor: 3, hp: 7 },
  },
  yordle: {
    name: "Yordle",
    description: "Caoticos y evasivos.",
    aliases: ["yordle", "yordles"],
    baseStats: { atk: 3, def: 3, aspd: 5, ref: 9, mspd: 9, fulgor: 5, d_fulgor: 6, r_fulgor: 4, hp: 6 },
  },
  no_muerto: {
    name: "No Muerto",
    description: "Resistencia sobre movilidad.",
    aliases: ["no_muerto", "no_muertos", "undead", "zombie", "zombi"],
    baseStats: { atk: 5, def: 8, aspd: 5, ref: 3, mspd: 3, fulgor: 6, d_fulgor: 6, r_fulgor: 6, hp: 8 },
  },
  vampiro: {
    name: "Vampiro",
    description: "Equilibrados con enfoque magico.",
    aliases: ["vampiro", "vampiros", "vampire", "vampires"],
    baseStats: { atk: 7, def: 5, aspd: 5, ref: 6, mspd: 7, fulgor: 4, d_fulgor: 4, r_fulgor: 4, hp: 8 },
  },
  furry: {
    name: "Furry",
    description: "Instinto y movilidad.",
    aliases: ["furry", "furrys", "bestia", "beast"],
    baseStats: { atk: 5, def: 5, aspd: 5, ref: 8, mspd: 7, fulgor: 5, d_fulgor: 4, r_fulgor: 4, hp: 7 },
  },
  hada: {
    name: "Hada",
    description: "Maxima velocidad y magia.",
    aliases: ["hada", "hadas", "ninfa", "ninfa", "fairy", "nymph"],
    baseStats: { atk: 2, def: 2, aspd: 4, ref: 10, mspd: 12, fulgor: 5, d_fulgor: 6, r_fulgor: 4, hp: 5 },
  },
  automata: {
    name: "Automata",
    description: "Maxima resistencia fisica.",
    aliases: ["automata", "automatas", "robot", "constructo"],
    baseStats: { atk: 8, def: 10, aspd: 5, ref: 3, mspd: 3, fulgor: 4, d_fulgor: 4, r_fulgor: 4, hp: 9 },
  },
  trickster: {
    name: "Trickster",
    description: "Especialistas en evasion y engano.",
    aliases: ["trickster", "tricksters", "embaucador"],
    baseStats: { atk: 2, def: 2, aspd: 4, ref: 10, mspd: 11, fulgor: 4, d_fulgor: 6, r_fulgor: 4, hp: 7 },
  },
  puppet: {
    name: "Puppet",
    description: "Equilibrio artificial.",
    aliases: ["puppet", "puppets", "marioneta", "titere"],
    baseStats: { atk: 4, def: 7, aspd: 4, ref: 6, mspd: 5, fulgor: 4, d_fulgor: 5, r_fulgor: 7, hp: 8 },
  },
  encarnacion: {
    name: "Encarnacion",
    description: "Poder explosivo.",
    aliases: ["encarnacion", "encarnaciones", "incarnation"],
    baseStats: { atk: 6, def: 6, aspd: 5, ref: 5, mspd: 5, fulgor: 5, d_fulgor: 5, r_fulgor: 5, hp: 8 },
  },
  ser_del_vacio: {
    name: "Ser del Vacio",
    description: "Corrupcion magica.",
    aliases: ["ser_del_vacio", "seres_del_vacio", "void", "vacio"],
    baseStats: { atk: 6, def: 5, aspd: 4, ref: 4, mspd: 5, fulgor: 6, d_fulgor: 5, r_fulgor: 7, hp: 8 },
  },
  angel: {
    name: "Angel",
    description: "Equilibrio sagrado.",
    aliases: ["angel", "angeles", "angelical"],
    baseStats: { atk: 7, def: 6, aspd: 5, ref: 5, mspd: 5, fulgor: 4, d_fulgor: 4, r_fulgor: 6, hp: 8 },
  },
  graviton: {
    name: "Graviton",
    description: "Control del campo.",
    aliases: ["graviton", "gravitons"],
    baseStats: { atk: 7, def: 9, aspd: 4, ref: 5, mspd: 4, fulgor: 4, d_fulgor: 4, r_fulgor: 5, hp: 8 },
  },
  sirena: {
    name: "Sirena",
    description: "Especialistas acuaticos.",
    aliases: ["sirena", "sirenas", "triton", "tritones", "mermaid"],
    baseStats: { atk: 3, def: 4, aspd: 4, ref: 8, mspd: 7, fulgor: 6, d_fulgor: 6, r_fulgor: 4, hp: 8 },
  },
  demonio: {
    name: "Demonio",
    description: "Poder ofensivo y magico.",
    aliases: ["demonio", "demonios", "demon", "demons"],
    baseStats: { atk: 7, def: 6, aspd: 6, ref: 4, mspd: 5, fulgor: 5, d_fulgor: 5, r_fulgor: 4, hp: 8 },
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
 * Calculate XP required for the next level.
 * @param {number} currentLevel - Current character level
 * @returns {number} XP needed to reach the next level
 */
function xpForNextLevel(currentLevel) {
  return Math.floor(XP_CURVE_BASE * Math.pow(currentLevel, XP_CURVE_EXPONENT));
}

/**
 * Calculate total level from stats sum.
 * @param {*} stats - Character stats object
 * @returns {number} Calculated level value
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
 * Get the list of available ranks.
 * @returns {string[]} Array of rank labels
 */
function rangosDisponibles() {
  return RANGOS;
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
  LEVEL_INITIAL,
  LEVEL_MAX,
  FREE_POINTS_AT_CREATION,
  XP_CURVE_BASE,
  XP_CURVE_EXPONENT,
  xpForNextLevel,
  calculateLevel,
  RANGOS,
  rangosDisponibles,

  MAX_CHARACTER_NAME_LENGTH,
  MAX_SLOT_SIZE,
  MAX_CHARACTERS_PER_USER,
};
