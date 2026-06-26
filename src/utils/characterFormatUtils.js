const { box } = require("./messageFormatUtils");

function formatCharacter(character) {
  const lines = [];

  lines.push("");
  lines.push(`👤  ${String(character.name).toUpperCase()}`);
  lines.push(`🎖️  Rango: ${character.category}`);

  if (character.stats && Object.keys(character.stats).length) {
    lines.push("");
    for (const [key, value] of Object.entries(character.stats)) {
      lines.push(`🔸  ${String(key).toUpperCase()}: ${value}`);
    }
  }

  if (character.slots && Object.keys(character.slots).length) {
    lines.push("");
    for (const [key, value] of Object.entries(character.slots)) {
      if (!value) continue;
      lines.push(`📎  ${key}`);
      lines.push(`    ${value}`);
    }
  }

  return box(`🎭 ${character.name.toUpperCase()}`, lines);
}

module.exports = { formatCharacter };