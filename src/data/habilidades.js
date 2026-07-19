// @ts-nocheck
// Catálogo de habilidades — v1.0 Combat Update
//
// Estructura:
//   id: Identificador único (snake_case)
//   name: Nombre visible
//   description: Qué hace en una línea
//   tier: E | D | C | B | A | S | N
//   duration: Turnos que dura el efecto (0 = instantáneo)
//   effects: Estados que aplica al enemigo ([])
//   multipliers: Stats propias que modifica ({ stat: multiplicador })
//   cooldown: Turnos antes de reutilizar
//   clase: "Universal" o el id de la clase
//   cost: Recurso que consume (null = ninguno)

const HABILIDADES = {
  // ========================
  // UNIVERSALES
  // ========================

  golpe_fuerte: {
    id: "golpe_fuerte",
    name: "Golpe Fuerte",
    description: "Un golpe físico concentrado y potente.",
    tier: "E",
    duration: 0,
    effects: [],
    multipliers: { str: 1.2 },
    cooldown: 0,
    clase: "Universal",
    cost: null,
  },

  acelerar: {
    id: "acelerar",
    name: "Acelerar",
    description: "Aceleras tus brazos para que tu golpe llegue más rápido.",
    tier: "E",
    duration: 0,
    effects: [],
    multipliers: { spd_atk: 1.2 },
    cooldown: 0,
    clase: "Universal",
    cost: null,
  },

  postura: {
    id: "postura",
    name: "Postura",
    description: "Te preparas para recibir el próximo golpe.",
    tier: "D",
    duration: 1,
    effects: [],
    multipliers: { def: 1.5 },
    cooldown: 1,
    clase: "Universal",
    cost: null,
  },

  reflejo: {
    id: "reflejo",
    name: "Reflejo",
    description: "Agudizas tus sentidos para reaccionar más rápido.",
    tier: "D",
    duration: 1,
    effects: [],
    multipliers: { ref: 1.5 },
    cooldown: 1,
    clase: "Universal",
    cost: null,
  },

  // ========================
  // CIVIL
  // ========================

  vendas: {
    id: "vendas",
    name: "Vendas",
    description: "Te vendas las heridas para recuperar algo de vida.",
    tier: "D",
    duration: 0,
    effects: [],
    multipliers: {},
    cooldown: 1,
    clase: "civil",
    cost: null,
    cura: 0.15,
  },

  golpe_firme: {
    id: "golpe_firme",
    name: "Golpe Firme",
    description: "Un golpe sólido y directo.",
    tier: "D",
    duration: 0,
    effects: [],
    multipliers: { str: 1.5 },
    cooldown: 0,
    clase: "civil",
    cost: null,
  },

  // ========================
  // AVENTURERO
  // ========================

  ataque_veloz: {
    id: "ataque_veloz",
    name: "Ataque Veloz",
    description: "Un golpe rápido que adelanta tu velocidad de ataque.",
    tier: "D",
    duration: 0,
    effects: [],
    multipliers: { spd_atk: 1.5 },
    cooldown: 0,
    clase: "aventurero",
    cost: null,
  },

  doble_golpe: {
    id: "doble_golpe",
    name: "Doble Golpe",
    description: "Golpeas con fuerza y velocidad al mismo tiempo.",
    tier: "D",
    duration: 0,
    effects: [],
    multipliers: { str: 1.2, spd_atk: 1.2 },
    cooldown: 1,
    clase: "aventurero",
    cost: null,
  },

  // ========================
  // LADRÓN
  // ========================

  golpe_sombra: {
    id: "golpe_sombra",
    name: "Golpe Sombra",
    description: "Un golpe sigiloso que busca puntos débiles.",
    tier: "D",
    duration: 0,
    effects: [],
    multipliers: { str: 1.5 },
    cooldown: 0,
    clase: "ladron",
    cost: null,
  },

  evasion: {
    id: "evasion",
    name: "Evasión",
    description: "Te preparas para esquivar el próximo ataque.",
    tier: "D",
    duration: 1,
    effects: [],
    multipliers: { ref: 1.5 },
    cooldown: 1,
    clase: "ladron",
    cost: null,
  },

  // ========================
  // COMERCIANTE
  // ========================

  venda_rapida: {
    id: "venda_rapida",
    name: "Venda Rápida",
    description: "Te curas sobre la marcha sin perder tiempo.",
    tier: "D",
    duration: 0,
    effects: [],
    multipliers: {},
    cooldown: 1,
    clase: "comerciante",
    cost: null,
    cura: 0.15,
  },

  golpe_astuto: {
    id: "golpe_astuto",
    name: "Golpe Astuto",
    description: "Un golpe calculado que llega antes de lo esperado.",
    tier: "D",
    duration: 0,
    effects: [],
    multipliers: { spd_atk: 1.5 },
    cooldown: 0,
    clase: "comerciante",
    cost: null,
  },
};

const TIERS = {
  E: { maxDuration: 0, maxStates: 0, maxCura: 0, minCooldown: 0, maxCooldown: 0 },
  D: { maxDuration: 1, maxStates: 1, maxCura: 0.15, minCooldown: 0, maxCooldown: 1 },
  C: { maxDuration: 2, maxStates: 1, maxCura: 0.25, minCooldown: 1, maxCooldown: 2 },
  B: { maxDuration: 3, maxStates: 2, maxCura: 0.4, minCooldown: 2, maxCooldown: 3 },
  A: { maxDuration: 4, maxStates: null, maxCura: 0.6, minCooldown: 3, maxCooldown: 4 },
  S: { maxDuration: 5, maxStates: null, maxCura: 1.0, minCooldown: 4, maxCooldown: 5 },
  N: { maxDuration: null, maxStates: null, maxCura: null, minCooldown: null, maxCooldown: null },
};

const TIER_MULTIPLIERS = {
  E: { 1: 1.2 },
  D: { 1: 1.5, 2: 1.2 },
  C: { 1: 2.0, 2: 1.5, 3: 1.2 },
  B: { 1: 3.0, 2: 2.0, 3: 1.5, 4: 1.2 },
  A: { 1: 4.0, 2: 3.0, 3: 2.0, 4: 1.5, 5: 1.2 },
  S: { 1: 5.0, 2: 4.0, 3: 3.0, 4: 2.0, 5: 1.5, 6: 1.2 },
};

/**
 *
 * @param id
 */
function getHabilidad(id) {
  return HABILIDADES[id] || null;
}

/**
 *
 */
function listarHabilidades() {
  return Object.values(HABILIDADES);
}

/**
 *
 * @param claseId
 */
function habilidadesPorClase(claseId) {
  return Object.values(HABILIDADES).filter((h) => h.clase === claseId || h.clase === "Universal");
}

/**
 *
 */
function habilidadesUniversales() {
  return Object.values(HABILIDADES).filter((h) => h.clase === "Universal");
}

module.exports = {
  HABILIDADES,
  TIERS,
  TIER_MULTIPLIERS,
  getHabilidad,
  listarHabilidades,
  habilidadesPorClase,
  habilidadesUniversales,
};
