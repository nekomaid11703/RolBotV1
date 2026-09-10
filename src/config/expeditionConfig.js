// @ts-nocheck
/**
 * Configuración modular de zonas de expedición.
 *
 * Modelo B8.2b (aprobado 2026-09-09, opción "banda + pool ponderado"):
 * - `floorRarity`: piso de la zona. Por debajo del piso no se reparte probabilidad.
 * - `rarityPool`: materiales por banda de rareza (entry: itemId/weight/minQty/maxQty/toolReq).
 *   La banda se tira con la ley R(L) según el nivel de la herramienta; dentro de la
 *   banda el material se elige ponderado por `weight`.
 * - `lootTable`: SOLO drops planos no-material (pescado, hierbas...): chance = weight/100
 *   por duración, sin bonus plano de herramienta.
 *
 * Cantidades (calibración B8.2b): tiradas por duración corta=2/media=3/larga=5;
 * cada tirada siempre entrega material del piso o mejor (común 2-4 uds, poco 2 uds,
 * raro 1 ud) → la herramienta NO suma cantidad, suaviza la composición de rareza.
 */

const EXPEDITION_ZONES = {
  bosque: {
    id: "bosque",
    name: "Bosque de los Susurros",
    description: "Espesa floresta rica en madera, hierbas medicinales y arroyos trucheros.",
    minLevel: 1,
    energyCosts: {
      corta: 15,
      media: 30,
      larga: 50,
    },
    durationsMinutes: {
      corta: 10,
      media: 30,
      larga: 60,
    },
    primaryTools: ["hacha", "bolsa", "cana"],
    floorRarity: "comun",
    rarityPool: {
      comun: [
        { itemId: "trozo_de_madera", weight: 45, minQty: 2, maxQty: 4, toolReq: "hacha" },
        { itemId: "trozo_de_cuero", weight: 15, minQty: 2, maxQty: 4, toolReq: "bolsa" },
      ],
      poco_comun: [{ itemId: "trozo_de_madera_caoba", weight: 8, minQty: 2, maxQty: 2, toolReq: "hacha" }],
    },
    lootTable: [
      { itemId: "hierba_medicinal", weight: 30, minQty: 1, maxQty: 3, toolReq: "bolsa", minToolLevel: 1 },
      { itemId: "pescado_fresco", weight: 20, minQty: 1, maxQty: 2, toolReq: "cana", minToolLevel: 1 },
    ],
    stelasRange: { min: 20, max: 80 },
    baseXp: 40,
  },

  minas: {
    id: "minas",
    name: "Minas de la Cuenca Férrea",
    description: "Antiguas galerías excavadas en roca sólida con vetas de acero y carbón.",
    minLevel: 1,
    energyCosts: {
      corta: 15,
      media: 30,
      larga: 50,
    },
    durationsMinutes: {
      corta: 10,
      media: 30,
      larga: 60,
    },
    primaryTools: ["pico"],
    floorRarity: "comun",
    rarityPool: {
      comun: [
        { itemId: "trozo_de_piedra", weight: 50, minQty: 2, maxQty: 4, toolReq: "pico" },
        { itemId: "trozo_de_cuarzo", weight: 12, minQty: 2, maxQty: 4, toolReq: "pico" },
      ],
      poco_comun: [{ itemId: "trozo_de_acero", weight: 35, minQty: 2, maxQty: 2, toolReq: "pico" }],
    },
    lootTable: [],
    stelasRange: { min: 30, max: 100 },
    baseXp: 50,
  },

  montanas: {
    id: "montanas",
    name: "Picos Escarpados",
    description: "Cumbres rocosas y ventosas donde afloran minerales de gran dureza.",
    minLevel: 3,
    energyCosts: {
      corta: 20,
      media: 35,
      larga: 60,
    },
    durationsMinutes: {
      corta: 15,
      media: 45,
      larga: 90,
    },
    primaryTools: ["pico", "hacha"],
    floorRarity: "poco_comun",
    rarityPool: {
      poco_comun: [
        { itemId: "trozo_de_acero", weight: 60, minQty: 2, maxQty: 2, toolReq: "pico" },
        { itemId: "trozo_de_plata", weight: 10, minQty: 2, maxQty: 2, toolReq: "pico" },
      ],
    },
    lootTable: [],
    stelasRange: { min: 50, max: 150 },
    baseXp: 75,
  },

  costa: {
    id: "costa",
    name: "Costa de los Naufragios",
    description: "Playas salinas y acantilados donde encallan reliquias y cardúmenes de peces.",
    minLevel: 2,
    energyCosts: {
      corta: 15,
      media: 30,
      larga: 50,
    },
    durationsMinutes: {
      corta: 10,
      media: 30,
      larga: 60,
    },
    primaryTools: ["cana", "bolsa"],
    floorRarity: "comun",
    rarityPool: {
      comun: [
        { itemId: "trozo_de_cuero", weight: 25, minQty: 2, maxQty: 4, toolReq: "bolsa" },
        { itemId: "trozo_de_madera", weight: 20, minQty: 2, maxQty: 4, toolReq: "bolsa" },
      ],
    },
    lootTable: [
      { itemId: "pescado_fresco", weight: 55, minQty: 2, maxQty: 6, toolReq: "cana", minToolLevel: 1 },
      { itemId: "hierba_medicinal", weight: 15, minQty: 1, maxQty: 2, toolReq: "bolsa", minToolLevel: 2 },
    ],
    stelasRange: { min: 40, max: 120 },
    baseXp: 55,
  },

  tundra: {
    id: "tundra",
    name: "Tundra Quebrada",
    description: "Páramo gélido con vetas de plata bajo el permafrost y flora criogénica.",
    minLevel: 5,
    energyCosts: {
      corta: 25,
      media: 40,
      larga: 70,
    },
    durationsMinutes: {
      corta: 20,
      media: 50,
      larga: 120,
    },
    primaryTools: ["pico", "bolsa"],
    // Nota: piso en poco_comun para conservar acero/plata como piso y el oro como
    // rareza superior (revisable en P2/B3 con el reporte).
    floorRarity: "poco_comun",
    rarityPool: {
      poco_comun: [
        { itemId: "trozo_de_plata", weight: 35, minQty: 2, maxQty: 2, toolReq: "pico" },
        { itemId: "trozo_de_acero", weight: 30, minQty: 2, maxQty: 2, toolReq: "pico" },
      ],
      raro: [{ itemId: "trozo_de_oro", weight: 8, minQty: 1, maxQty: 1, toolReq: "pico" }],
    },
    lootTable: [{ itemId: "hierba_medicinal", weight: 25, minQty: 1, maxQty: 4, toolReq: "bolsa", minToolLevel: 2 }],
    stelasRange: { min: 80, max: 240 },
    baseXp: 110,
  },
};

module.exports = {
  EXPEDITION_ZONES,
};
