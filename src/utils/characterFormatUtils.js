// @ts-nocheck
const { box } = require("./boxUtils");
const { LEVELABLE_STATS, HP_MAX } = require("../config/characterConfig");
const { getItem } = require("../data/items");

function buildStatsLines(lines, character) {
  if (!character.stats) return;
  lines.push("");
  for (const [key, config] of Object.entries(LEVELABLE_STATS)) {
    const val = character.stats[key];
    if (val !== undefined) {
      lines.push(`${config.icon}  ${config.label}: ${val}`);
    }
  }
}

function resolveInventory(character, inventoryParam) {
  if (Array.isArray(inventoryParam)) return inventoryParam;
  if (Array.isArray(character.inventory)) return character.inventory;
  return null;
}

function buildInventoryLines(lines, character, inventoryParam) {
  const inventory = resolveInventory(character, inventoryParam);

  lines.push("");
  if (inventory && inventory.length > 0) {
    const totalQty = inventory.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
    lines.push(`🎒  Inventario (${totalQty} ítems):`);
    for (const entry of inventory) {
      const itemDef = getItem(entry.item_id);
      const icon = itemDef ? itemDef.icon : "📦";
      const name = itemDef ? itemDef.name : entry.item_id;
      lines.push(`   · ${icon} ${name} x${entry.quantity}`);
    }
  } else {
    const itemCount = character.item_count || 0;
    lines.push(`🎒  Items: ${itemCount}`);
  }
}

function formatCharacter(character, inventoryParam = null, maxHpOverride) {
  const lines = [];
  const maxHp = maxHpOverride ?? Math.max(1, (character.stats?.hp ?? 1) * 2);

  const hpBar = buildHpBar(character.hp_actual, maxHp);

  lines.push("");
  lines.push(`👤  ${String(character.name || "").toUpperCase()}`);
  lines.push(`🎖️  ${character.clase || "?"}  ·  Rango ${character.rango || "F"}`);
  lines.push(`📖  Nivel ${character.nivel || 20}`);
  lines.push("");
  lines.push(`${hpBar}  ${character.hp_actual}/${maxHp}`);

  buildStatsLines(lines, character);
  buildInventoryLines(lines, character, inventoryParam);

  if (character.slots?.historia) {
    lines.push("");
    lines.push(`📜  ${character.slots.historia}`);
  }

  return box(`🎭 ${(character.name || "").toUpperCase()}`, lines);
}

function buildHpBar(hp, max) {
  const barLength = 10;
  const filled = Math.min(barLength, Math.round((hp / max) * barLength));
  const empty = barLength - filled;
  const filledChar = "█";
  const emptyChar = "░";
  return "[" + filledChar.repeat(filled) + emptyChar.repeat(empty) + "]";
}

function formatHpState(hp, max = HP_MAX) {
  return `${hp}/${max}`;
}

module.exports = { formatCharacter, buildHpBar, formatHpState };
