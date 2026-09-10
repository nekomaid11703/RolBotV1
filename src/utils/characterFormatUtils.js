// @ts-nocheck
const { characterSheet, buildHpBar, formatHpState } = require("../ui/sections/characterSections");

/**
 * Formatea la ficha completa de un personaje compuesta por secciones
 * reutilizables (stats, equipo, inventario, historia).
 * @param {object} character - Personaje
 * @param {Array<object>|null} [inventoryParam] - Inventario resuelto
 * @param {number} [maxHpOverride] - HP máximo forzado
 * @param {object|null} [equipment] - Resumen de equipo (resolveCharacterEquipment)
 * @returns {string}
 */
function formatCharacter(character, inventoryParam = null, maxHpOverride, equipment = null) {
  return characterSheet(character, { inventory: inventoryParam, maxHpOverride, equipment });
}

module.exports = { formatCharacter, buildHpBar, formatHpState };
