// @ts-nocheck
const { getTierMultiplier } = require("../config/tierConfig");

/**
 * Atributos base de materiales (serie ×1.4 por rareza).
 * @typedef {object} MaterialStats
 * @property {number} afilabilidad - Calidad del filo
 * @property {number} conduccion_magica - Conducción de Fulgor
 * @property {number} resistencia_material - Durabilidad física / dureza
 * @property {number} flexibilidad - Elasticidad / almacenamiento de energía
 */

/**
 * Canon de materiales (B8, aprobado 2026-09-08).
 *
 * Estructura: 6 rarezas × 4 ejes = 24 materiales.
 *   - flex (maderas): Madera, Caoba, Ébano, Noble, Tétrica, Irminsul.
 *   - resistencia (biológicos/reliquias): Cuero, Coraza desgastada, Coraza robusta,
 *     Piel bestial, Piel de titán, Luminita (restos de un titán).
 *   - filo (minerales): Piedra, Acero, Obsidiana, Titanio, Mineral Pálido, Filo Estelar.
 *   - conducción (cristales y metales preciosos): Cuarzo, Plata, Oro, Mitril,
 *     Obsidiana Azul, Fulgorita.
 *
 * Los 4 valores de cada fila provienen de una única serie por rareza v = [x1,x2,x3,x4]
 * con x1..x4 = [19,14,10,7] en común y ×1.4 por rareza. Disposición por eje:
 *   filo  → A x1, C x2, R x3, F x4
 *   cond  → A x2, C x1, R x3, F x4
 *   res   → A x4, C x3, R x1, F x2
 *   flex  → A x4, C x3, R x2, F x1
 *
 * Presupuestos: común 50 · poco 69 · raro 95 · épico 132 · legendario 184 · mítico 258.
 */

/**
 * @typedef {object} MaterialEntry
 * @property {string} id
 * @property {string} name
 * @property {string} rarity
 * @property {"filo"|"cond"|"res"|"flex"} archetype
 * @property {MaterialStats} baseStats
 */

const MATERIALS = {
  // ── Conceptuales (no-físicos) ─────────────────────────────────────────────
  // Materia etérea: representación técnica de ítems que NO son objetos físicos
  // (hechizos). Neutra; no es forjable ni seleccionable. No forma parte del canon.
  etereo: {
    id: "etereo",
    name: "Etéreo",
    rarity: "comun",
    archetype: "cond",
    baseStats: { afilabilidad: 1, conduccion_magica: 1, resistencia_material: 1, flexibilidad: 1 },
  },

  // ── Comunes (presupuesto 50; serie 19/14/10/7) ───────────────────────────
  piedra: {
    id: "piedra",
    name: "Piedra",
    rarity: "comun",
    archetype: "filo",
    baseStats: { afilabilidad: 19, conduccion_magica: 14, resistencia_material: 10, flexibilidad: 7 },
  },
  cuarzo: {
    id: "cuarzo",
    name: "Cuarzo",
    rarity: "comun",
    archetype: "cond",
    baseStats: { afilabilidad: 14, conduccion_magica: 19, resistencia_material: 10, flexibilidad: 7 },
  },
  cuero: {
    id: "cuero",
    name: "Cuero",
    rarity: "comun",
    archetype: "res",
    baseStats: { afilabilidad: 7, conduccion_magica: 10, resistencia_material: 19, flexibilidad: 14 },
  },
  madera: {
    id: "madera",
    name: "Madera",
    rarity: "comun",
    archetype: "flex",
    baseStats: { afilabilidad: 7, conduccion_magica: 10, resistencia_material: 14, flexibilidad: 19 },
  },

  // ── Poco comunes (presupuesto 69; serie 26/19/14/10) ─────────────────────
  acero: {
    id: "acero",
    name: "Acero",
    rarity: "poco_comun",
    archetype: "filo",
    baseStats: { afilabilidad: 26, conduccion_magica: 19, resistencia_material: 14, flexibilidad: 10 },
  },
  plata: {
    id: "plata",
    name: "Plata",
    rarity: "poco_comun",
    archetype: "cond",
    baseStats: { afilabilidad: 19, conduccion_magica: 26, resistencia_material: 14, flexibilidad: 10 },
  },
  coraza_desgastada: {
    id: "coraza_desgastada",
    name: "Coraza desgastada",
    rarity: "poco_comun",
    archetype: "res",
    baseStats: { afilabilidad: 10, conduccion_magica: 14, resistencia_material: 26, flexibilidad: 19 },
  },
  madera_caoba: {
    id: "madera_caoba",
    name: "Madera de Caoba",
    rarity: "poco_comun",
    archetype: "flex",
    baseStats: { afilabilidad: 10, conduccion_magica: 14, resistencia_material: 19, flexibilidad: 26 },
  },

  // ── Raros (presupuesto 95; serie 36/26/19/14) ────────────────────────────
  obsidiana: {
    id: "obsidiana",
    name: "Obsidiana",
    rarity: "raro",
    archetype: "filo",
    baseStats: { afilabilidad: 36, conduccion_magica: 26, resistencia_material: 19, flexibilidad: 14 },
  },
  oro: {
    id: "oro",
    name: "Oro",
    rarity: "raro",
    archetype: "cond",
    baseStats: { afilabilidad: 26, conduccion_magica: 36, resistencia_material: 19, flexibilidad: 14 },
  },
  coraza_robusta: {
    id: "coraza_robusta",
    name: "Coraza robusta",
    rarity: "raro",
    archetype: "res",
    baseStats: { afilabilidad: 14, conduccion_magica: 19, resistencia_material: 36, flexibilidad: 26 },
  },
  madera_ebano: {
    id: "madera_ebano",
    name: "Madera de ébano",
    rarity: "raro",
    archetype: "flex",
    baseStats: { afilabilidad: 14, conduccion_magica: 19, resistencia_material: 26, flexibilidad: 36 },
  },

  // ── Épicos (presupuesto 132; serie 51/36/26/19) ──────────────────────────
  titanio: {
    id: "titanio",
    name: "Titanio",
    rarity: "epico",
    archetype: "filo",
    baseStats: { afilabilidad: 51, conduccion_magica: 36, resistencia_material: 26, flexibilidad: 19 },
  },
  mitril: {
    id: "mitril",
    name: "Mitril",
    rarity: "epico",
    archetype: "cond",
    baseStats: { afilabilidad: 36, conduccion_magica: 51, resistencia_material: 26, flexibilidad: 19 },
  },
  piel_bestial: {
    id: "piel_bestial",
    name: "Piel bestial",
    rarity: "epico",
    archetype: "res",
    baseStats: { afilabilidad: 19, conduccion_magica: 26, resistencia_material: 51, flexibilidad: 36 },
  },
  madera_noble: {
    id: "madera_noble",
    name: "Madera noble",
    rarity: "epico",
    archetype: "flex",
    baseStats: { afilabilidad: 19, conduccion_magica: 26, resistencia_material: 36, flexibilidad: 51 },
  },

  // ── Legendarios (presupuesto 184; serie 71/51/36/26) ─────────────────────
  mineral_palido: {
    id: "mineral_palido",
    name: "Mineral Pálido",
    rarity: "legendario",
    archetype: "filo",
    baseStats: { afilabilidad: 71, conduccion_magica: 51, resistencia_material: 36, flexibilidad: 26 },
  },
  obsidiana_azul: {
    id: "obsidiana_azul",
    name: "Obsidiana Azul",
    rarity: "legendario",
    archetype: "cond",
    baseStats: { afilabilidad: 51, conduccion_magica: 71, resistencia_material: 36, flexibilidad: 26 },
  },
  luminita: {
    id: "luminita",
    name: "Luminita",
    rarity: "legendario",
    archetype: "res",
    baseStats: { afilabilidad: 26, conduccion_magica: 36, resistencia_material: 71, flexibilidad: 51 },
  },
  madera_tetrica: {
    id: "madera_tetrica",
    name: "Madera Tétrica",
    rarity: "legendario",
    archetype: "flex",
    baseStats: { afilabilidad: 26, conduccion_magica: 36, resistencia_material: 51, flexibilidad: 71 },
  },

  // ── Míticos (presupuesto 258; serie 100/71/51/36) ────────────────────────
  filo_estelar: {
    id: "filo_estelar",
    name: "Filo Estelar",
    rarity: "mitico",
    archetype: "filo",
    baseStats: { afilabilidad: 100, conduccion_magica: 71, resistencia_material: 51, flexibilidad: 36 },
  },
  fulgorita: {
    id: "fulgorita",
    name: "Fulgorita",
    rarity: "mitico",
    archetype: "cond",
    baseStats: { afilabilidad: 71, conduccion_magica: 100, resistencia_material: 51, flexibilidad: 36 },
  },
  piel_titan: {
    id: "piel_titan",
    name: "Piel de titán",
    rarity: "mitico",
    archetype: "res",
    baseStats: { afilabilidad: 36, conduccion_magica: 51, resistencia_material: 100, flexibilidad: 71 },
  },
  madera_irminsul: {
    id: "madera_irminsul",
    name: "Madera del Irminsul",
    rarity: "mitico",
    archetype: "flex",
    baseStats: { afilabilidad: 36, conduccion_magica: 51, resistencia_material: 71, flexibilidad: 100 },
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
