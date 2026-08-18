// @ts-nocheck
const { getTierMultiplier } = require("../config/tierConfig");

/**
 * Atributos base de materiales (Rango 1-100 natural)
 * @typedef {object} MaterialStats
 * @property {number} afilabilidad - Calidad del filo (1-100)
 * @property {number} conduccion_magica - Conducción de Fulgor (1-100)
 * @property {number} resistencia_material - Durabilidad física / dureza (1-100)
 * @property {number} flexibilidad - Elasticidad / almacenamiento de energía (1-100)
 */

/**
 * Entrada del catálogo de materiales.
 * @typedef {object} MaterialEntry
 * @property {string} id
 * @property {string} name
 * @property {string} rarity
 * @property {MaterialStats} baseStats
 */

/**
 * Catálogo de Materiales por Categorías
 * @type {Record<string, MaterialEntry>}
 */
const MATERIALS = {
  // ── Conceptuales (no-físicos) ─────────────────────────────────────────────
  // Materia etérea: representación técnica de ítems que NO son objetos físicos
  // (hechizos). Neutra en todas las stats físicas; no es forjable ni seleccionable.
  etereo: {
    id: "etereo",
    name: "Etéreo",
    rarity: "comun",
    baseStats: { afilabilidad: 1, conduccion_magica: 1, resistencia_material: 1, flexibilidad: 1 },
  },

  // ── Comunes (presupuesto 80) ─────────────────────────────────────────────
  madera: {
    id: "madera",
    name: "Madera",
    rarity: "comun",
    baseStats: { afilabilidad: 20, conduccion_magica: 20, resistencia_material: 20, flexibilidad: 20 },
  },
  cuero: {
    id: "cuero",
    name: "Cuero",
    rarity: "comun",
    baseStats: { afilabilidad: 12, conduccion_magica: 12, resistencia_material: 14, flexibilidad: 42 },
  },
  hueso: {
    id: "hueso",
    name: "Hueso",
    rarity: "comun",
    baseStats: { afilabilidad: 42, conduccion_magica: 12, resistencia_material: 16, flexibilidad: 10 },
  },
  piedra: {
    id: "piedra",
    name: "Piedra",
    rarity: "comun",
    baseStats: { afilabilidad: 12, conduccion_magica: 10, resistencia_material: 48, flexibilidad: 10 },
  },

  // ── Poco Comunes (presupuesto 120) ───────────────────────────────────────
  hierro: {
    id: "hierro",
    name: "Hierro",
    rarity: "poco_comun",
    baseStats: { afilabilidad: 30, conduccion_magica: 30, resistencia_material: 30, flexibilidad: 30 },
  },
  bronce: {
    id: "bronce",
    name: "Bronce",
    rarity: "poco_comun",
    baseStats: { afilabilidad: 60, conduccion_magica: 15, resistencia_material: 30, flexibilidad: 15 },
  },
  acero: {
    id: "acero",
    name: "Acero",
    rarity: "poco_comun",
    baseStats: { afilabilidad: 20, conduccion_magica: 15, resistencia_material: 65, flexibilidad: 20 },
  },
  plata: {
    id: "plata",
    name: "Plata",
    rarity: "poco_comun",
    baseStats: { afilabilidad: 20, conduccion_magica: 60, resistencia_material: 20, flexibilidad: 20 },
  },

  // ── Raros (presupuesto 170) ───────────────────────────────────────────────
  platino: {
    id: "platino",
    name: "Platino",
    rarity: "raro",
    baseStats: { afilabilidad: 45, conduccion_magica: 40, resistencia_material: 45, flexibilidad: 40 },
  },
  obsidiana: {
    id: "obsidiana",
    name: "Obsidiana",
    rarity: "raro",
    baseStats: { afilabilidad: 90, conduccion_magica: 20, resistencia_material: 40, flexibilidad: 20 },
  },
  oro: {
    id: "oro",
    name: "Oro",
    rarity: "raro",
    baseStats: { afilabilidad: 30, conduccion_magica: 80, resistencia_material: 35, flexibilidad: 25 },
  },
  madera_caoba: {
    id: "madera_caoba",
    name: "Madera de Caoba",
    rarity: "raro",
    baseStats: { afilabilidad: 30, conduccion_magica: 25, resistencia_material: 35, flexibilidad: 80 },
  },

  // ── Épicos (presupuesto 230) ──────────────────────────────────────────────
  titanio: {
    id: "titanio",
    name: "Titanio",
    rarity: "epico",
    baseStats: { afilabilidad: 45, conduccion_magica: 30, resistencia_material: 100, flexibilidad: 55 },
  },
  mitril: {
    id: "mitril",
    name: "Mitril",
    rarity: "epico",
    baseStats: { afilabilidad: 55, conduccion_magica: 100, resistencia_material: 40, flexibilidad: 35 },
  },
  oricalco: {
    id: "oricalco",
    name: "Oricalco",
    rarity: "epico",
    baseStats: { afilabilidad: 100, conduccion_magica: 35, resistencia_material: 55, flexibilidad: 40 },
  },

  // ── Legendarios (presupuesto 300) ─────────────────────────────────────────
  luminita: {
    id: "luminita",
    name: "Luminita",
    rarity: "legendario",
    baseStats: { afilabilidad: 75, conduccion_magica: 75, resistencia_material: 75, flexibilidad: 75 },
  },
  mineral_palido: {
    id: "mineral_palido",
    name: "Mineral Pálido",
    rarity: "legendario",
    baseStats: { afilabilidad: 100, conduccion_magica: 40, resistencia_material: 100, flexibilidad: 60 },
  },
  obsidiana_azul: {
    id: "obsidiana_azul",
    name: "Obsidiana Azul",
    rarity: "legendario",
    baseStats: { afilabilidad: 95, conduccion_magica: 60, resistencia_material: 55, flexibilidad: 90 },
  },
  madera_irminsul: {
    id: "madera_irminsul",
    name: "Madera del Irminsul",
    rarity: "legendario",
    baseStats: { afilabilidad: 40, conduccion_magica: 100, resistencia_material: 60, flexibilidad: 100 },
  },

  // ── Míticos (presupuesto 380) ─────────────────────────────────────────────
  adamantita: {
    id: "adamantita",
    name: "Adamantita",
    rarity: "mitico",
    baseStats: { afilabilidad: 100, conduccion_magica: 80, resistencia_material: 100, flexibilidad: 100 },
  },
  eterio: {
    id: "eterio",
    name: "Etério",
    rarity: "mitico",
    baseStats: { afilabilidad: 80, conduccion_magica: 100, resistencia_material: 100, flexibilidad: 100 },
  },
  vibranium: {
    id: "vibranium",
    name: "Vibranium",
    rarity: "mitico",
    baseStats: { afilabilidad: 95, conduccion_magica: 85, resistencia_material: 100, flexibilidad: 100 },
  },
  filo_estelar: {
    id: "filo_estelar",
    name: "Filo Estelar",
    rarity: "mitico",
    baseStats: { afilabilidad: 100, conduccion_magica: 85, resistencia_material: 95, flexibilidad: 100 },
  },
};

/**
 * Obtiene las estadísticas finales de un material aplicando su Tier.
 * @param {string} materialId
 * @param {string} [tier]
 * @returns {MaterialStats}
 */
function getMaterialStats(materialId, tier = "E") {
  const mat = MATERIALS[materialId] || MATERIALS.madera;
  const mult = getTierMultiplier(tier);
  return {
    afilabilidad: Math.round(mat.baseStats.afilabilidad * mult),
    conduccion_magica: Math.round(mat.baseStats.conduccion_magica * mult),
    resistencia_material: Math.round(mat.baseStats.resistencia_material * mult),
    flexibilidad: Math.round(mat.baseStats.flexibilidad * mult),
  };
}

module.exports = {
  MATERIALS,
  getMaterialStats,
};
