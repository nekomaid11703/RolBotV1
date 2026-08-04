// @ts-nocheck
const { LEVELABLE_STATS, HP_MAX } = require("../../config/characterConfig");
const { getItem } = require("../../data/items");
const { equipmentSummaryLines } = require("./equipmentSections");
const { composeMessage } = require("../sectionBuilder");

/**
 * Construye una barra de HP simple para la ficha de personaje.
 * @param {number} hp - HP actual
 * @param {number} max - HP máximo
 * @returns {string} Barra de HP
 */
function buildHpBar(hp, max) {
  const barLength = 10;
  const filled = Math.min(barLength, Math.round((hp / max) * barLength));
  const empty = barLength - filled;
  return "[" + "\u2588".repeat(filled) + "\u2591".repeat(empty) + "]";
}

/**
 * @param {number} hp - HP actual
 * @param {number} [max] - HP máximo
 * @returns {string}
 */
function formatHpState(hp, max = HP_MAX) {
  return `${hp}/${max}`;
}

/**
 * Líneas de stats nivelables de un personaje (desde LEVELABLE_STATS).
 * @param {object} character
 * @returns {string[]}
 */
function statsLines(character) {
  const lines = [];
  if (!character.stats) return lines;
  for (const [key, config] of Object.entries(LEVELABLE_STATS)) {
    const val = character.stats[key];
    if (val !== undefined) {
      lines.push(`${config.icon}  ${config.label}: ${val}`);
    }
  }
  return lines;
}

/**
 * Resuelve el inventario a usar en la ficha (param → character.inventory → null).
 * @param {object} character
 * @param {Array<object>|null} [inventoryParam]
 * @returns {Array<object>|null}
 */
function resolveInventory(character, inventoryParam) {
  if (Array.isArray(inventoryParam)) return inventoryParam;
  if (Array.isArray(character.inventory)) return character.inventory;
  return null;
}

/**
 * Líneas de inventario de un personaje (resumen para la ficha).
 * @param {object} character
 * @param {Array<object>|null} [inventoryParam] - Inventario resuelto (si no, usa character.inventory)
 * @returns {string[]}
 */
function inventorySectionLines(character, inventoryParam = null) {
  const inventory = resolveInventory(character, inventoryParam);

  const lines = [];
  if (inventory && inventory.length > 0) {
    const totalQty = inventory.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
    lines.push(`\uD83C\uDF92  Inventario (${totalQty} \u00EDtems):`);
    for (const entry of inventory) {
      const itemDef = getItem(entry.item_id);
      const name = itemDef ? itemDef.name : entry.item_id;
      lines.push(`   \u00B7 ${name} x${entry.quantity}`);
    }
  } else {
    lines.push(`\uD83C\uDF92  Items: ${character.item_count || 0}`);
  }
  return lines;
}

/**
 * Líneas de cabecera de la ficha (nombre, clase, rango, nivel, HP).
 * @param {object} character
 * @param {number} maxHp
 * @returns {string[]}
 */
function headerLines(character, maxHp) {
  return [
    `\uD83D\uDC64  ${String(character.name || "").toUpperCase()}`,
    `\uD83C\uDF96\uFE0F  ${character.clase || "?"}  \u00B7  Rango ${character.rango || "F"}`,
    `\uD83D\uDCD6  Nivel ${character.nivel || 20}`,
    `${buildHpBar(character.hp_actual, maxHp)}  ${character.hp_actual}/${maxHp}`,
  ];
}

/**
 * Ficha de personaje compuesta por secciones reutilizables.
 * @param {object} character
 * @param {{inventory?: Array<object>|null, equipment?: object|null, maxHpOverride?: number}} [opts]
 * @returns {string}
 */
function characterSheet(character, opts = {}) {
  const { inventory = null, equipment = null, maxHpOverride } = opts || {};
  const maxHp = maxHpOverride ?? Math.max(1, (character.stats?.hp ?? 1) * 2);

  const sections = [headerLines(character, maxHp)];

  const sts = statsLines(character);
  if (sts.length > 0) sections.push(sts);

  if (equipment) {
    const eqLines = equipmentSummaryLines(equipment);
    if (eqLines.length > 0) sections.push(["\u2694  EQUIPO:", ...eqLines]);
  }

  sections.push(inventorySectionLines(character, inventory));

  if (character.slots?.historia) {
    sections.push([`\uD83D\uDCDC  ${character.slots.historia}`]);
  }

  return composeMessage({ title: `\uD83C\uDFAD ${String(character.name || "").toUpperCase()}`, sections });
}

module.exports = { characterSheet, buildHpBar, formatHpState };
