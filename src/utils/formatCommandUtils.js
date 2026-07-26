// @ts-nocheck
/**
 * @constant compactLines
 */
const compactLines = require("./formatErrorUtils").compactLines;

/**
 * @constant LINE
 * @type {string}
 */
const LINE = "✦ ━━━━━━━━━━━━━━ ✦";

/**
 * @param { icon = "📘", title, description, usage, example, notes = [] } - TODO: describe parameter "{ icon = "📘", title, description, usage, example, notes = [] }".
 * @param root0
 * @returns
 */
function buildUsageBody({ icon = "📘", title, description, usage, example, notes = [] }) {
  /**
   * @constant body
   * @type {Array}
   */
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
 * @param { icon = "📋", title, description, command, fields = [], example = [], notes = [] } - TODO: describe parameter "{ icon = "📋", title, description, command, fields = [], example = [], notes = [] }".
 * @param root0
 * @returns
 */
function buildFormBody({ icon = "📋", title, description, command, fields = [], example = [], notes = [] }) {
  /**
   * @constant templateLines
   * @type {Array}
   */
  const templateLines = [command, ...fields.map((f) => (f.includes(":") ? f : `${f}: `))];
  /**
   * @constant body
   * @type {Array}
   */
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
 * @param opts
 * @returns
 */
function formatCommandUsage(opts) {
  return compactLines(buildUsageBody(opts));
}

/**
 * @param opts
 * @returns
 */
function formatCommandForm(opts) {
  return compactLines(buildFormBody(opts));
}

module.exports = { formatCommandUsage, formatCommandForm };
