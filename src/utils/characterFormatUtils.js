// @ts-nocheck
const { box } = require("./boxUtils");
const { LEVELABLE_STATS, getHpState, HP_MAX } = require("../config/characterConfig");

/**
 *
 * @param character
 */
function formatCharacter(character) {
  const lines = [];

  const hpState = getHpState(character.hp_actual);
  const hpBar = buildHpBar(character.hp_actual, HP_MAX);

  lines.push("");
  lines.push(`👤  ${String(character.name || "").toUpperCase()}`);
  lines.push(`🎖️  ${character.clase || "?"}  ·  Rango ${character.rango || "F"}`);
  lines.push(`📖  Nivel ${character.nivel || 20}`);
  lines.push("");
  lines.push(`${hpBar}  ${character.hp_actual}/${HP_MAX}  (${hpState.name})`);

  if (character.stats) {
    lines.push("");
    for (const [key, config] of Object.entries(LEVELABLE_STATS)) {
      const val = character.stats[key];
      if (val !== undefined) {
        lines.push(`${config.icon}  ${config.label}: ${val}`);
      }
    }
  }

  const habilidades = Array.isArray(character.slots?.habilidades) ? character.slots.habilidades : [];
  if (habilidades.length > 0) {
    lines.push("");
    lines.push("⭐ Habilidades:");
    for (const h of habilidades) {
      lines.push(`   · ${h}`);
    }
  }

  const itemCount = character.item_count || 0;
  lines.push("");
  lines.push(`🎒  Items: ${itemCount}`);

  if (character.slots?.historia) {
    lines.push("");
    lines.push(`📜  ${character.slots.historia}`);
  }

  return box(`🎭 ${(character.name || "").toUpperCase()}`, lines);
}

/**
 *
 * @param hp
 * @param max
 */
function buildHpBar(hp, max) {
  const barLength = 10;
  const filled = Math.round((hp / max) * barLength);
  const empty = barLength - filled;
  const filledChar = "█";
  const emptyChar = "░";
  return "[" + filledChar.repeat(filled) + emptyChar.repeat(empty) + "]";
}

/**
 *
 * @param hp
 */
function formatHpState(hp) {
  const state = getHpState(hp);
  return `${hp}/${HP_MAX}  (${state.name})`;
}

module.exports = { formatCharacter, buildHpBar, formatHpState };
