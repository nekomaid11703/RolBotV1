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
 * Catálogo de Materiales por Categorías
 */
const MATERIALS = {
  // Comunes
  madera: {
    id: "madera",
    name: "Madera",
    rarity: "comun",
    baseStats: { afilabilidad: 10, conduccion_magica: 25, resistencia_material: 20, flexibilidad: 40 },
  },
  cuero: {
    id: "cuero",
    name: "Cuero",
    rarity: "comun",
    baseStats: { afilabilidad: 5, conduccion_magica: 15, resistencia_material: 25, flexibilidad: 50 },
  },
  hueso: {
    id: "hueso",
    name: "Hueso",
    rarity: "comun",
    baseStats: { afilabilidad: 20, conduccion_magica: 10, resistencia_material: 30, flexibilidad: 10 },
  },
  piedra: {
    id: "piedra",
    name: "Piedra",
    rarity: "comun",
    baseStats: { afilabilidad: 15, conduccion_magica: 5, resistencia_material: 40, flexibilidad: 5 },
  },

  // Poco Comunes
  bronce: {
    id: "bronce",
    name: "Bronce",
    rarity: "poco_comun",
    baseStats: { afilabilidad: 35, conduccion_magica: 30, resistencia_material: 45, flexibilidad: 20 },
  },
  plata: {
    id: "plata",
    name: "Plata",
    rarity: "poco_comun",
    baseStats: { afilabilidad: 30, conduccion_magica: 55, resistencia_material: 35, flexibilidad: 25 },
  },
  hierro: {
    id: "hierro",
    name: "Hierro",
    rarity: "poco_comun",
    baseStats: { afilabilidad: 45, conduccion_magica: 20, resistencia_material: 55, flexibilidad: 25 },
  },
  acero: {
    id: "acero",
    name: "Acero",
    rarity: "poco_comun",
    baseStats: { afilabilidad: 55, conduccion_magica: 25, resistencia_material: 65, flexibilidad: 30 },
  },

  // Raros (regulares en 2 stats, balanceados en resto)
  oro: {
    id: "oro",
    name: "Oro",
    rarity: "raro",
    baseStats: { afilabilidad: 40, conduccion_magica: 75, resistencia_material: 45, flexibilidad: 50 },
  },
  platino: {
    id: "platino",
    name: "Platino",
    rarity: "raro",
    baseStats: { afilabilidad: 50, conduccion_magica: 70, resistencia_material: 70, flexibilidad: 45 },
  },
  obsidiana: {
    id: "obsidiana",
    name: "Obsidiana",
    rarity: "raro",
    baseStats: { afilabilidad: 75, conduccion_magica: 40, resistencia_material: 60, flexibilidad: 15 },
  },
  madera_caoba: {
    id: "madera_caoba",
    name: "Madera de Caoba",
    rarity: "raro",
    baseStats: { afilabilidad: 30, conduccion_magica: 50, resistencia_material: 55, flexibilidad: 75 },
  },

  // Épicos (excelente en 1 stat, regulares en resto)
  titanio: {
    id: "titanio",
    name: "Titanio",
    rarity: "epico",
    baseStats: { afilabilidad: 65, conduccion_magica: 35, resistencia_material: 90, flexibilidad: 40 },
  },
  mitril: {
    id: "mitril",
    name: "Mitril",
    rarity: "epico",
    baseStats: { afilabilidad: 70, conduccion_magica: 90, resistencia_material: 75, flexibilidad: 60 },
  },
  oricalco: {
    id: "oricalco",
    name: "Oricalco",
    rarity: "epico",
    baseStats: { afilabilidad: 85, conduccion_magica: 65, resistencia_material: 80, flexibilidad: 50 },
  },

  // Legendarios (excelentes en 2 stats, regulares en resto)
  madera_irminsul: {
    id: "madera_irminsul",
    name: "Madera del Irminsul",
    rarity: "legendario",
    baseStats: { afilabilidad: 50, conduccion_magica: 95, resistencia_material: 75, flexibilidad: 95 },
  },
  mineral_palido: {
    id: "mineral_palido",
    name: "Mineral Pálido",
    rarity: "legendario",
    baseStats: { afilabilidad: 95, conduccion_magica: 60, resistencia_material: 95, flexibilidad: 40 },
  },
  obsidiana_azul: {
    id: "obsidiana_azul",
    name: "Obsidiana Azul",
    rarity: "legendario",
    baseStats: { afilabilidad: 95, conduccion_magica: 95, resistencia_material: 80, flexibilidad: 30 },
  },
  luminita: {
    id: "luminita",
    name: "Luminita",
    rarity: "legendario",
    baseStats: { afilabilidad: 80, conduccion_magica: 95, resistencia_material: 95, flexibilidad: 70 },
  },

  // Míticos (Top 1 en su mejor stat, excelente en secundaria)
  adamantita: {
    id: "adamantita",
    name: "Adamantita",
    rarity: "mitico",
    baseStats: { afilabilidad: 85, conduccion_magica: 70, resistencia_material: 100, flexibilidad: 80 },
  },
  eterio: {
    id: "eterio",
    name: "Etério",
    rarity: "mitico",
    baseStats: { afilabilidad: 80, conduccion_magica: 100, resistencia_material: 70, flexibilidad: 85 },
  },
  vibranium: {
    id: "vibranium",
    name: "Vibranium",
    rarity: "mitico",
    baseStats: { afilabilidad: 75, conduccion_magica: 80, resistencia_material: 90, flexibilidad: 100 },
  },
  filo_estelar: {
    id: "filo_estelar",
    name: "Filo Estelar",
    rarity: "mitico",
    baseStats: { afilabilidad: 100, conduccion_magica: 85, resistencia_material: 80, flexibilidad: 75 },
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
