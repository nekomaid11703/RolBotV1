// @ts-nocheck
const path = require("path");

const CHARACTER_ROOT = path.join(__dirname, "../database/personajes");

const CHARACTER_CATEGORIES = ["F", "E", "D", "C", "B", "A", "S"];

const MAX_CHARACTER_NAME_LENGTH = 40;
const MAX_SLOT_SIZE = 5000;
const MAX_CHARACTERS_PER_USER = 5;

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

  clase: "",

  habilidad_1: "",

  habilidad_2: "",
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

  MAX_CHARACTER_NAME_LENGTH,
  MAX_SLOT_SIZE,
  MAX_CHARACTERS_PER_USER,

  VALID_CHARACTER_FIELDS,
};
