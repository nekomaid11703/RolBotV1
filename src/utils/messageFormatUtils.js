const LINE = "✦ ━━━━━━━━━━━━━━ ✦";

function compactLines(lines) {
  return lines
    .flat()
    .filter((line) => line !== null && line !== undefined)
    .map((line) => String(line))
    .join("\n");
}

function buildUsageBody({ icon = "📘", title, description, usage, example, notes = [] }) {
  const body = [
    LINE,
    `${icon} *${String(title || "COMANDO").toUpperCase()}*`,
    LINE,
    "",
  ];
  if (description) body.push(description, "");
  body.push("*Uso*", `\`${usage}\``);
  if (example) body.push("", "*Ejemplo*", `\`${example}\``);
  if (notes.length > 0) {
    body.push("", "*Notas*");
    notes.forEach(n => body.push(`• ${n}`));
  }
  body.push("", LINE);
  return body;
}

function buildFormBody({ icon = "📋", title, description, command, fields = [], example = [], notes = [] }) {
  const templateLines = [command, ...fields.map(f => `${f}: `)];
  const body = [
    LINE,
    `${icon} *${String(title || "FORMULARIO").toUpperCase()}*`,
    LINE,
    "",
  ];
  if (description) body.push(description, "");
  body.push("*Plantilla*", "```", templateLines.join("\n"), "```");
  if (example.length > 0) body.push("", "*Ejemplo*", "```", example.join("\n"), "```");
  if (notes.length > 0) {
    body.push("", "*Notas*");
    notes.forEach(n => body.push(`• ${n}`));
  }
  body.push("", LINE);
  return body;
}

function formatCommandUsage(opts) {
  return compactLines(buildUsageBody(opts));
}

function formatCommandForm(opts) {
  return compactLines(buildFormBody(opts));
}

function buildFeedbackBody({ icon = "ℹ️", title = "Aviso", lines = [] }) {
  return [LINE, `${icon} *${title}*`, LINE, "", lines, "", LINE];
}

function formatFeedback(opts) {
  return compactLines(buildFeedbackBody(opts));
}

function formatError(message, hint = null) {
  return formatFeedback({
    icon: "❌",
    title: "No se pudo completar",
    lines: hint ? [message, "", hint] : [message],
  });
}

module.exports = {
  LINE,
  buildUsageBody,
  buildFormBody,
  buildFeedbackBody,
  formatCommandForm,
  formatCommandUsage,
  formatError,
  formatFeedback,
};
