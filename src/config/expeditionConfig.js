// @ts-nocheck
/**
 * Configuración modular de zonas de expedición.
 * Cero hardcoding: permite añadir, eliminar o rebalancear fácilmente ubicaciones y probabilidades.
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
    // Tabla de probabilidad base de drops y cantidad por duración
    lootTable: [
      { itemId: "trozo_de_madera", weight: 45, minQty: 2, maxQty: 6, toolReq: "hacha", minToolLevel: 1 },
      { itemId: "hierba_medicinal", weight: 30, minQty: 1, maxQty: 3, toolReq: "bolsa", minToolLevel: 1 },
      { itemId: "pescado_fresco", weight: 20, minQty: 1, maxQty: 2, toolReq: "cana", minToolLevel: 1 },
      { itemId: "trozo_de_cuero", weight: 15, minQty: 1, maxQty: 2, toolReq: "bolsa", minToolLevel: 1 },
      // Rarezas desbloqueables con herramientas avanzadas:
      { itemId: "trozo_de_madera_caoba", weight: 8, minQty: 1, maxQty: 2, toolReq: "hacha", minToolLevel: 4 },
    ],
    stelasRange: { min: 20, max: 80 },
    baseXp: 40,
  },

  minas: {
    id: "minas",
    name: "Minas de la Cuenca Férrea",
    description: "Antiguas galerías excavadas en roca sólida con vetas de hierro y carbón.",
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
    lootTable: [
      { itemId: "trozo_de_piedra", weight: 50, minQty: 3, maxQty: 8, toolReq: "pico", minToolLevel: 1 },
      { itemId: "trozo_de_acero", weight: 35, minQty: 1, maxQty: 4, toolReq: "pico", minToolLevel: 1 },
      { itemId: "trozo_de_cuarzo", weight: 12, minQty: 1, maxQty: 2, toolReq: "pico", minToolLevel: 3 },
      { itemId: "trozo_de_acero", weight: 6, minQty: 1, maxQty: 2, toolReq: "pico", minToolLevel: 5 },
    ],
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
    lootTable: [
      { itemId: "trozo_de_acero", weight: 40, minQty: 2, maxQty: 5, toolReq: "pico", minToolLevel: 2 },
      { itemId: "trozo_de_acero", weight: 20, minQty: 1, maxQty: 3, toolReq: "pico", minToolLevel: 3 },
      { itemId: "trozo_de_plata", weight: 10, minQty: 1, maxQty: 2, toolReq: "pico", minToolLevel: 4 },
      { itemId: "trozo_de_piedra", weight: 25, minQty: 2, maxQty: 6, toolReq: "pico", minToolLevel: 1 },
    ],
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
    lootTable: [
      { itemId: "pescado_fresco", weight: 55, minQty: 2, maxQty: 6, toolReq: "cana", minToolLevel: 1 },
      { itemId: "trozo_de_cuero", weight: 25, minQty: 1, maxQty: 3, toolReq: "bolsa", minToolLevel: 1 },
      { itemId: "trozo_de_madera", weight: 20, minQty: 2, maxQty: 4, toolReq: "bolsa", minToolLevel: 1 },
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
    lootTable: [
      { itemId: "trozo_de_plata", weight: 35, minQty: 1, maxQty: 3, toolReq: "pico", minToolLevel: 3 },
      { itemId: "trozo_de_acero", weight: 30, minQty: 1, maxQty: 3, toolReq: "pico", minToolLevel: 3 },
      { itemId: "hierba_medicinal", weight: 25, minQty: 1, maxQty: 4, toolReq: "bolsa", minToolLevel: 2 },
      { itemId: "trozo_de_oro", weight: 8, minQty: 1, maxQty: 1, toolReq: "pico", minToolLevel: 5 },
    ],
    stelasRange: { min: 80, max: 240 },
    baseXp: 110,
  },
};

module.exports = {
  EXPEDITION_ZONES,
};
