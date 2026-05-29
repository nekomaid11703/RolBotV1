const path = require("path");

const CHARACTER_ROOT = path.join(__dirname, "../database/personajes");

const CHARACTER_CATEGORIES = ["F", "E", "D", "C", "BA", "S"];

// =========================
// STATS
// =========================

const DEFAULT_CHARACTER_STATS = {
  vida: 100,

  dinero: 0,

  exp: 0,

  fuerza: 0,

  defensa: 0,

  agilidad: 0,

  inteligencia: 0,

  suerte: 0,
};

// =========================
// SLOTS
// =========================

const DEFAULT_CHARACTER_SLOTS = {
  descripcion: "",

  historia: "",

  habilidades: "",
};

// =========================
// VALID KEYS
// =========================

const VALID_CHARACTER_FIELDS = [
  "rango",

  "nombre",

  ...Object.keys(DEFAULT_CHARACTER_STATS),

  ...Object.keys(DEFAULT_CHARACTER_SLOTS),
];

module.exports = {
  CHARACTER_ROOT,

  CHARACTER_CATEGORIES,

  DEFAULT_CHARACTER_STATS,

  DEFAULT_CHARACTER_SLOTS,

  VALID_CHARACTER_FIELDS,
};
