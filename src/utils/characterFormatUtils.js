// @ts-nocheck
const { box } = require("./boxUtils");
const { LEVELABLE_STATS, HP_MAX } = require("../config/characterConfig");
const { getItem } = require("../data/items");

/**
 * @param character
 * @param [inventoryParam]
 * @param maxHpOverride
 * @returns
 */
function formatCharacter(character, inventoryParam = null, maxHpOverride) {
  /**
   * @constant lines
   * @type {Array}
   */
  const lines = [];
  /**
   * @constant maxHp
   */
  const maxHp = maxHpOverride ?? Math.max(1, (character.stats?.hp ?? 1) * 2);

  /**
   * @constant hpBar
   */
  const hpBar = buildHpBar(character.hp_actual, maxHp);

  lines.push("");
  lines.push(`👤  ${String(character.name || "").toUpperCase()}`);
  lines.push(`🎖️  ${character.clase || "?"}  ·  Rango ${character.rango || "F"}`);
  lines.push(`📖  Nivel ${character.nivel || 20}`);
  lines.push("");
  lines.push(`${hpBar}  ${character.hp_actual}/${maxHp}`);

  if (character.stats) {
    lines.push("");
    for (const [key, config] of Object.entries(LEVELABLE_STATS)) {
      /**
       * @constant val
       */
      const val = character.stats[key];
      if (val !== undefined) {
        lines.push(`${config.icon}  ${config.label}: ${val}`);
      }
    }
  }

  let inventory = inventoryParam;
  if (!Array.isArray(inventory)) {
    inventory = Array.isArray(character.inventory) ? character.inventory : null;
  }

  lines.push("");
  if (inventory && inventory.length > 0) {
    /**
     * @constant totalQty
     */
    const totalQty = inventory.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
    lines.push(`🎒  Inventario (${totalQty} ítems):`);
    for (const entry of inventory) {
      /**
       * @constant itemDef
       */
      const itemDef = getItem(entry.item_id);
      /**
       * @constant icon
       */
      const icon = itemDef ? itemDef.icon : "📦";
      /**
       * @constant name
       */
      const name = itemDef ? itemDef.name : entry.item_id;
      lines.push(`   · ${icon} ${name} x${entry.quantity}`);
    }
  } else {
    /**
     * @constant itemCount
     */
    const itemCount = character.item_count || 0;
    lines.push(`🎒  Items: ${itemCount}`);
  }

  if (character.slots?.historia) {
    lines.push("");
    lines.push(`📜  ${character.slots.historia}`);
  }

  return box(`🎭 ${(character.name || "").toUpperCase()}`, lines);
}

/**
 * @param hp
 * @param max
 * @returns
 */
function buildHpBar(hp, max) {
  /**
   * @constant barLength
   * @type {number}
   */
  const barLength = 10;
  /**
   * @constant filled
   */
  const filled = Math.min(barLength, Math.round((hp / max) * barLength));
  /**
   * @constant empty
   */
  const empty = barLength - filled;
  /**
   * @constant filledChar
   * @type {string}
   */
  const filledChar = "█";
  /**
   * @constant emptyChar
   * @type {string}
   */
  const emptyChar = "░";
  return "[" + filledChar.repeat(filled) + emptyChar.repeat(empty) + "]";
}

/**
 * @param hp
 * @param [max]
 * @returns
 */
function formatHpState(hp, max = HP_MAX) {
  return `${hp}/${max}`;
}

module.exports = { formatCharacter, buildHpBar, formatHpState };
