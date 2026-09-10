// @ts-nocheck
/**
 * Servicio de tiradas de rareza y materiales (B8.2b).
 *
 * Primitivas puras sobre el canon: sin acceso a DB. El motor de expediciones
 * (y su réplica analítica en progressionAnalyticsService) las usan para que la
 * simulación y el runtime compartan exactamente la misma curva.
 */

const { RARITY_BAND_INDEX, rarityRatioForLevel } = require("../../config/rarityDropConfig");

/**
 * Determina las bandas alcanzables y el nivel de herramienta que gobierna la
 * curva en una zona, a partir de las herramientas del personaje.
 * @param {object} zone - Zona de expedición (con rarityPool y floorRarity)
 * @param {Record<string, {level: number}>} tools - Herramientas del personaje
 * @returns {{entriesByBand: Map<string, object[]>, bandKeys: string[], toolLevel: number}|null}
 */
function resolveZoneMaterialContext(zone, tools) {
  const pool = zone?.rarityPool || {};
  const floorIdx = RARITY_BAND_INDEX[zone.floorRarity] ?? 0;
  const entriesByBand = new Map();
  let toolLevel = 0;

  for (const [band, entries] of Object.entries(pool)) {
    const bandIdx = RARITY_BAND_INDEX[band];
    if (bandIdx < floorIdx) continue; // bajo el piso no se reparte probabilidad
    const accessible = (entries || []).filter((entry) => (tools[entry.toolReq]?.level || 0) >= 1);
    if (accessible.length === 0) continue;
    for (const entry of accessible) {
      toolLevel = Math.max(toolLevel, tools[entry.toolReq].level);
    }
    entriesByBand.set(band, accessible);
  }

  if (entriesByBand.size === 0) return null;
  return {
    entriesByBand,
    bandKeys: Array.from(entriesByBand.keys()).sort((a, b) => RARITY_BAND_INDEX[a] - RARITY_BAND_INDEX[b]),
    toolLevel,
  };
}

/**
 * Elige una banda según probabilidades normalizadas usando un RNG inyectable.
 * @param {Record<string, number>} probabilities - { banda: prob } (suma ≈ 1)
 * @param {Function} [rng] - Devuelve [0, 1)
 * @returns {string|null} Banda elegida o null
 */
function sampleBand(probabilities, rng = Math.random) {
  const entries = Object.entries(probabilities);
  if (entries.length === 0) return null;
  const roll = rng();
  let cumulative = 0;
  for (const [band, probability] of entries) {
    cumulative += probability;
    if (roll < cumulative) return band;
  }
  return entries[entries.length - 1][0];
}

/**
 * Elige una entrada de material ponderada por `weight` dentro de su banda.
 * @param {object[]} entries - Entradas del pool (con weight)
 * @param {Function} [rng]
 * @returns {object} Entrada elegida
 */
function weightedEntry(entries, rng = Math.random) {
  const total = entries.reduce((sum, entry) => sum + (Number(entry.weight) || 1), 0);
  const roll = rng() * total;
  let cumulative = 0;
  for (const entry of entries) {
    cumulative += Number(entry.weight) || 1;
    if (roll < cumulative) return entry;
  }
  return entries[entries.length - 1];
}

/**
 * Nivel de herramienta efectivo para una zona (si el personaje la puede explorar).
 * @param {object} zone
 * @param {Record<string, {level: number}>} tools
 * @returns {number|null}
 */
function effectiveToolLevelForZone(zone, tools) {
  const context = resolveZoneMaterialContext(zone, tools);
  return context ? context.toolLevel : null;
}

module.exports = {
  resolveZoneMaterialContext,
  sampleBand,
  weightedEntry,
  effectiveToolLevelForZone,
  rarityRatioForLevel,
};
