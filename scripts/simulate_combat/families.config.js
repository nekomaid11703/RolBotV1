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

// Escala de desplazamiento de peso hacia rarezas mayores según el nivel.
const MATERIAL_LEVEL_SCALE = 0.4;

// Orden de tiers de forja / calidad de manufactura (independiente del material).
const TIER_ORDER = ["E", "D", "C", "B", "A", "S", "N"];

// ── Munición (arco) ─────────────────────────────────────────────────────────
const AMMO_STOCK_MIN = 30;
const AMMO_STOCK_MAX = 30;

// ── IA por equipamiento ─────────────────────────────────────────────────────
const { BLOCK_PREFER_DEF_THRESHOLD } = require("../../src/config/combatConfig");

// Lista de TODOS los materiales del juego
const ALL_MATERIALS = [
  "madera", "cuero", "hueso", "piedra",
  "hierro", "bronce", "acero", "plata",
  "platino", "obsidiana", "oro", "madera_caoba",
  "titanio", "mitril", "oricalco",
  "luminita", "mineral_palido", "obsidiana_azul", "madera_irminsul",
  "adamantita", "eterio", "vibranium", "filo_estelar"
];

// ── Familias de ítems ───────────────────────────────────────────────────────
// Derivan sus estadísticas reales del motor (itemStatService: base × tier × material).
// Incluyen de base armas físicas, focos (varita, báculo), armaduras y túnicas místicas.
const FAMILIES = {
  universal: {
    id: "universal",
    name: "Familia Universal",
    setId: "set_universal",
    materials: ALL_MATERIALS,
    weaponPool: [
      { id: "espada", name: "Espada", damageNature: "cortante", nominalDamage: 20, hands: 1, weaponRange: 1 },
      { id: "estoque", name: "Estoque", damageNature: "perforante", nominalDamage: 14, hands: 1, weaponRange: 1 },
      { id: "maza", name: "Maza", damageNature: "contundente", nominalDamage: 22, hands: 1, weaponRange: 1 },
      { id: "arco", name: "Arco", damageNature: "proyectil", nominalDamage: 0, hands: 2, weaponRange: 20, ranged: true },
      { id: "varita", name: "Varita Mágica", damageNature: "contundente", nominalDamage: 10, hands: 1, weaponRange: 1, isFocus: true, canalizeScale: 1.0 },
      { id: "baculo", name: "Báculo Mágico", damageNature: "contundente", nominalDamage: 14, hands: 2, weaponRange: 1, isFocus: true, canalizeScale: 1.2 },
    ],
    armorSlotBase: {
      cabeza: "Casco",
      pecho: "Pechera",
      pantalones: "Grebas",
      botas: "Botas",
      tunica: "Túnica Mística",
    },
    coverageSuffix: { ligera: "Ligero", media: "", alta: "Alto", total: "Total", mistica: "Mística" },
    shield: { id: "escudo", name: "Escudo", slot: "mano_izq", coverage: "alta" },
    amulet: { id: "amuleto", name: "Amuleto", slot: "artefacto_1", buff: { fulgor: 10, d_fulgor: 5 } },
    ammo: { id: "flecha", name: "Flecha", damageNature: "proyectil", nominalDamage: 12 },
  },
  hierro: {
    id: "hierro",
    name: "Familia del Hierro",
    setId: "set_hierro",
    materials: ALL_MATERIALS,
    weaponPool: [
      { id: "espada_de_hierro", name: "Espada", damageNature: "cortante", nominalDamage: 20, hands: 1, weaponRange: 1 },
      { id: "estoque_de_hierro", name: "Estoque", damageNature: "perforante", nominalDamage: 14, hands: 1, weaponRange: 1 },
      { id: "maza_de_hierro", name: "Maza", damageNature: "contundente", nominalDamage: 22, hands: 1, weaponRange: 1 },
      { id: "arco_de_hierro", name: "Arco", damageNature: "proyectil", nominalDamage: 0, hands: 2, weaponRange: 20, ranged: true },
      { id: "varita_de_hierro", name: "Varita Mágica", damageNature: "contundente", nominalDamage: 10, hands: 1, weaponRange: 1, isFocus: true, canalizeScale: 1.0 },
      { id: "baculo_de_hierro", name: "Báculo Mágico", damageNature: "contundente", nominalDamage: 14, hands: 2, weaponRange: 1, isFocus: true, canalizeScale: 1.2 },
    ],
    armorSlotBase: {
      cabeza: "Casco",
      pecho: "Pechera",
      pantalones: "Grebas",
      botas: "Botas",
      tunica: "Túnica Mística",
    },
    coverageSuffix: { ligera: "Ligero", media: "", alta: "Alto", total: "Total", mistica: "Mística" },
    shield: { id: "escudo_de_hierro", name: "Escudo", slot: "mano_izq", coverage: "alta" },
    amulet: { id: "amuleto_de_hierro", name: "Amuleto", slot: "artefacto_1", buff: { fulgor: 10 } },
    ammo: { id: "flecha_de_hierro", name: "Flecha", damageNature: "proyectil", nominalDamage: 12 },
  },
  madera: {
    id: "madera",
    name: "Familia de la Madera",
    setId: "set_madera",
    materials: ALL_MATERIALS,
    weaponPool: [
      { id: "arco_de_madera", name: "Arco", damageNature: "proyectil", nominalDamage: 0, hands: 2, weaponRange: 18, ranged: true },
      { id: "clava_de_madera", name: "Clava", damageNature: "contundente", nominalDamage: 18, hands: 1, weaponRange: 1 },
      { id: "lanza_de_madera", name: "Lanza", damageNature: "perforante", nominalDamage: 16, hands: 2, weaponRange: 2 },
      { id: "varita_de_madera", name: "Varita de Madera", damageNature: "contundente", nominalDamage: 8, hands: 1, weaponRange: 1, isFocus: true, canalizeScale: 1.0 },
      { id: "baculo_de_madera", name: "Báculo de Madera", damageNature: "contundente", nominalDamage: 12, hands: 2, weaponRange: 1, isFocus: true, canalizeScale: 1.2 },
    ],
    armorSlotBase: {
      cabeza: "Capucha",
      pecho: "Coraza",
      pantalones: "Grebas",
      botas: "Botas",
      tunica: "Túnica de Mago",
    },
    coverageSuffix: { ligera: "Ligera", media: "", alta: "Alta", total: "Total", mistica: "Mística" },
    shield: { id: "rodela_de_madera", name: "Rodela", slot: "mano_izq", coverage: "media" },
    amulet: { id: "talisman_de_madera", name: "Talismán", slot: "artefacto_1", buff: { d_fulgor: 8 } },
    ammo: { id: "flecha_de_madera", name: "Flecha de Madera", damageNature: "proyectil", nominalDamage: 10 },
  },
};

module.exports = {
  MATERIAL_RARITY_WEIGHTS,
  MATERIAL_RARITY_ORDER,
  MATERIAL_LEVEL_SCALE,
  TIER_ORDER,
  AMMO_STOCK_MIN,
  AMMO_STOCK_MAX,
  BLOCK_PREFER_DEF_THRESHOLD,
  FAMILIES,
};
