// @ts-nocheck
const compactLines = require("./formatErrorUtils").compactLines;

const LINE = "✦ ━━━━━━━━━━━━━━ ✦";

/**
 *
 * @param root0
 */
function buildUsageBody({ icon = "📘", title, description, usage, example, notes = [] }) {
  const body = [LINE, `${icon} *${String(title || "COMANDO").toUpperCase()}*`, LINE, ""];
  if (description) body.push(description, "");
  body.push("*Uso*", `\`${usage}\``);
  if (example) body.push("", "*Ejemplo*", `\`${example}\``);
  if (notes.length > 0) {
    body.push("", "*Notas*");
    notes.forEach((n) => body.push(`• ${n}`));
  }
  body.push("", LINE);
  return body;
}

/**
 *
 * @param root0
 */
function buildFormBody({ icon = "📋", title, description, command, fields = [], example = [], notes = [] }) {
  const templateLines = [command, ...fields.map((f) => (f.includes(":") ? f : `${f}: `))];
  const body = [LINE, `${icon} *${String(title || "FORMULARIO").toUpperCase()}*`, LINE, ""];
  if (description) body.push(description, "");
  body.push("*Plantilla*", "```", templateLines.join("\n"), "```");
  if (example.length > 0) body.push("", "*Ejemplo*", "```", example.join("\n"), "```");
  if (notes.length > 0) {
    body.push("", "*Notas*");
    notes.forEach((n) => body.push(`• ${n}`));
  }
  body.push("", LINE);
  return body;
}

/**
 *
 * @param opts
 */
function formatCommandUsage(opts) {
  return compactLines(buildUsageBody(opts));
}

/**
 *
 * @param opts
 */
function formatCommandForm(opts) {
  return compactLines(buildFormBody(opts));
}

module.exports = { formatCommandUsage, formatCommandForm };
