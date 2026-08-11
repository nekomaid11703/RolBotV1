// @ts-nocheck
"use strict";

// ── Pesos de rareza de material ─────────────────────────────────────────────
// La probabilidad de que un material salga al generar una pieza. Los materiales
// de rareza mayor aparecen con menos frecuencia (requisito: equipo variado con
// peso inverso a la rareza).
const MATERIAL_RARITY_WEIGHTS = {
  comun: 40,
  poco_comun: 25,
  raro: 15,
  epico: 10,
  legendario: 7,
  mitico: 3,
};

// Orden de rareza (índice = peso de desplazamiento por nivel).
const MATERIAL_RARITY_ORDER = ["comun", "poco_comun", "raro", "epico", "legendario", "mitico"];

// Escala de desplazamiento de peso hacia rarezas mayores según el nivel
// (0 = el nivel no influye; 1 = a nivel máximo los materiales raros duplican
// su peso base). Simula que el jugador accede a materiales mejores a medida
// que sube de nivel.
const MATERIAL_LEVEL_SCALE = 0.4;

// Techo de tier por rareza del material: un material común jamás puede craftear
// un arma de tier S (requisito: "material tier S → arma tier S").
// comun → C, poco_comun → B, raro → A, epico → S, legendario → S, mitico → S.
const TIER_CAPS = {
  comun: "C",
  poco_comun: "B",
  raro: "A",
  epico: "S",
  legendario: "S",
  mitico: "S",
};

// Orden de tiers (índice para comparar techos).
const TIER_ORDER = ["E", "D", "C", "B", "A", "S", "N"];

// ── Munición (arco) ─────────────────────────────────────────────────────────
// Stock fijo de flechas al generar un arquero (un jugador carga muchas).
// Cap: 30 flechas (decisión Fase B).
const AMMO_STOCK_MIN = 30;
const AMMO_STOCK_MAX = 30;

// ── IA por equipamiento ─────────────────────────────────────────────────────
// Si la armadura suma este bonusDef (o más), la IA prefiere bloquear sobre
// esquivar: el tanque aguanta con durabilidad en vez de gastar fatiga.
// (Constante única en src/config/combatConfig.js)
const { BLOCK_PREFER_DEF_THRESHOLD } = require("../../src/config/combatConfig");

// ── Familias de ítems (editable) ────────────────────────────────────────────
// Una familia = conjunto de materiales + plantillas de ítems. Los ítems se
// DERIVAN con las fórmulas reales del motor (itemStatService: base × tier ×
// material) usando el material y tier elegidos por el generador.
// Para añadir/editar/borrar familias basta con editar este objeto (o usar
// scripts/simulate_combat/manage_families.js).
const FAMILIES = {
  // Familia del Hierro: metal base del simulador (compat con presets).
  hierro: {
    id: "hierro",
    name: "Familia del Hierro",
    setId: "set_hierro",
    materials: ["hierro", "acero", "bronce", "titanio", "mitril", "adamantita", "filo_estelar"],
    weaponPool: [
      { id: "espada_de_hierro", name: "Espada", damageNature: "cortante", nominalDamage: 20, hands: 1, weaponRange: 1 },
      { id: "estoque_de_hierro", name: "Estoque", damageNature: "perforante", nominalDamage: 14, hands: 1, weaponRange: 1 },
      { id: "maza_de_hierro", name: "Maza", damageNature: "contundente", nominalDamage: 22, hands: 1, weaponRange: 1 },
      { id: "arco_de_hierro", name: "Arco", damageNature: "proyectil", nominalDamage: 0, hands: 2, weaponRange: 20, ranged: true },
    ],
    armorSlotBase: {
      cabeza: "Casco",
      pecho: "Pechera",
      pantalones: "Grebas",
      botas: "Botas",
    },
    coverageSuffix: { ligera: "Ligero", media: "", alta: "Alto", total: "Total" },
    shield: { id: "escudo_de_hierro", name: "Escudo", slot: "mano_izq", coverage: "alta" },
    amulet: { id: "amuleto_de_hierro", name: "Amuleto", slot: "artefacto_1", buff: { atk: 5 } },
    ammo: { id: "flecha_de_hierro", name: "Flecha", damageNature: "proyectil", nominalDamage: 12 },
  },

  // Familia de la Madera: materiales vegetales (ejemplo para testear el generador).
  madera: {
    id: "madera",
    name: "Familia de la Madera",
    setId: "set_madera",
    materials: ["madera", "cuero", "hueso", "madera_caoba", "madera_irminsul"],
    weaponPool: [
      { id: "arco_de_madera", name: "Arco", damageNature: "proyectil", nominalDamage: 0, hands: 2, weaponRange: 18, ranged: true },
      { id: "clava_de_madera", name: "Clava", damageNature: "contundente", nominalDamage: 18, hands: 1, weaponRange: 1 },
      { id: "lanza_de_madera", name: "Lanza", damageNature: "perforante", nominalDamage: 16, hands: 2, weaponRange: 2 },
    ],
    armorSlotBase: {
      cabeza: "Capucha",
      pecho: "Coraza",
      pantalones: "Grebas",
      botas: "Botas",
    },
    coverageSuffix: { ligera: "Ligero", media: "", alta: "Alto", total: "Total" },
    shield: { id: "escudo_de_madera", name: "Escudo de Madera", slot: "mano_izq", coverage: "media" },
    amulet: { id: "amuleto_de_madera", name: "Amuleto de Madera", slot: "artefacto_1", buff: { ref: 5 } },
    ammo: { id: "flecha_de_madera", name: "Flecha de Madera", damageNature: "proyectil", nominalDamage: 10 },
  },
};

module.exports = {
  MATERIAL_RARITY_WEIGHTS,
  MATERIAL_RARITY_ORDER,
  MATERIAL_LEVEL_SCALE,
  TIER_CAPS,
  TIER_ORDER,
  AMMO_STOCK_MIN,
  AMMO_STOCK_MAX,
  BLOCK_PREFER_DEF_THRESHOLD,
  FAMILIES,
};
