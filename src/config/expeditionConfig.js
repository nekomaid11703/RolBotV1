// @ts-nocheck
/**
 * Configuración modular de zonas de expedición.
 *
 * Modelo P2 ("identidad por multiplicadores", aprobado 2026-09-09):
 * - `axisWeights`: multiplicadores por especialización (filo/cond/res/flex). El eje
 *   del drop se sortea ponderado; su herramienta aporta el nivel que gobierna R(L).
 *   Las zonas NO usan piso de rareza: la rareza la decide la ley global R(L).
 * - `lootTable`: SOLO drops planos no-material (pescado, hierbas...) con chance
 *   `weight/100` por expedición de duración corta.
 *
 * Añadir zonas nuevas = declarar `axisWeights` coherentes con el lore (multiplicadores
 * más altos en sus ejes característicos).
 */

const EXPEDITION_ZONES = {
  bosque: {
    id: "bosque",
    name: "Bosque de los Susurros",
    description: "Espesa floresta rica en maderas (flex), con fibras y hierbas, pero pobre en minerales.",
    minLevel: 1,
    energyCosts: { corta: 15, media: 30, larga: 50 },
    durationsMinutes: { corta: 10, media: 30, larga: 60 },
    primaryTools: ["hacha", "bolsa"],
    axisWeights: { flex: 1.0, res: 0.6, filo: 0.15, cond: 0.1 },
    lootTable: [{ itemId: "hierba_medicinal", weight: 30, minQty: 1, maxQty: 3, toolReq: "bolsa", minToolLevel: 1 }],
    stelasRange: { min: 20, max: 80 },
    baseXp: 40,
  },

  minas: {
    id: "minas",
    name: "Cuevas de la Cuenca Férrea",
    description: "Galerías profundas de minerales (filo/cond) y criaturas de cueva (res), con poca madera.",
    minLevel: 1,
    energyCosts: { corta: 15, media: 30, larga: 50 },
    durationsMinutes: { corta: 10, media: 30, larga: 60 },
    primaryTools: ["pico", "bolsa"],
    axisWeights: { filo: 1.0, cond: 0.9, res: 0.6, flex: 0.15 },
    lootTable: [],
    stelasRange: { min: 30, max: 100 },
    baseXp: 50,
  },

  montanas: {
    id: "montanas",
    name: "Picos Escarpados",
    description: "Cumbres ventosas donde afloran los mejores minerales (filo/cond) y alguna reliquia.",
    minLevel: 3,
    energyCosts: { corta: 20, media: 35, larga: 60 },
    durationsMinutes: { corta: 15, media: 45, larga: 90 },
    primaryTools: ["pico", "hacha"],
    axisWeights: { filo: 1.2, cond: 0.8, res: 0.5, flex: 0.1 },
    lootTable: [],
    stelasRange: { min: 50, max: 150 },
    baseXp: 75,
  },

  costa: {
    id: "costa",
    name: "Costa de los Naufragios",
    description: "Playas y acantilados con restos orgánicos (res), maderas de naufragio y algo de magia marina.",
    minLevel: 2,
    energyCosts: { corta: 15, media: 30, larga: 50 },
    durationsMinutes: { corta: 10, media: 30, larga: 60 },
    primaryTools: ["bolsa", "hacha"],
    axisWeights: { res: 0.9, flex: 0.8, cond: 0.4, filo: 0.2 },
    lootTable: [{ itemId: "hierba_medicinal", weight: 15, minQty: 1, maxQty: 2, toolReq: "bolsa", minToolLevel: 2 }],
    stelasRange: { min: 40, max: 120 },
    baseXp: 55,
  },

  tundra: {
    id: "tundra",
    name: "Tundra Quebrada",
    description: "Páramo gélido con cristales de fulgor (cond) y minerales duros (filo) bajo el permafrost.",
    minLevel: 5,
    energyCosts: { corta: 25, media: 40, larga: 70 },
    durationsMinutes: { corta: 20, media: 50, larga: 120 },
    primaryTools: ["pico", "bolsa"],
    axisWeights: { cond: 1.1, filo: 1.0, res: 0.6, flex: 0.1 },
    lootTable: [{ itemId: "hierba_medicinal", weight: 25, minQty: 1, maxQty: 4, toolReq: "bolsa", minToolLevel: 2 }],
    stelasRange: { min: 80, max: 240 },
    baseXp: 110,
  },
};

module.exports = {
  EXPEDITION_ZONES,
};
