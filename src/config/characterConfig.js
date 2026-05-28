const path = require("path");

const CHARACTER_ROOT = path.join(__dirname, "../database/personajes");

const CHARACTER_CATEGORIES = ["F", "E", "D", "C", "BA", "S"];

// =========================
// STATS OFICIALES
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
// KEYS VALIDAS
// =========================

const VALID_CHARACTER_FIELDS = [
  "rango",

  ...Object.keys(DEFAULT_CHARACTER_STATS),
];

module.exports = {
  CHARACTER_ROOT,

  CHARACTER_CATEGORIES,

  DEFAULT_CHARACTER_STATS,

  VALID_CHARACTER_FIELDS,
};
