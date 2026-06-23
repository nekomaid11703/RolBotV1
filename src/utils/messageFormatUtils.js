const LINE = "✦ ━━━━━━━━━━━━━━ ✦";

function compactLines(lines) {
  return lines
    .flat()
    .filter((line) => line !== null && line !== undefined)
    .map((line) => String(line))
    .join("\n");
}

function formatCommandUsage({
  icon = "📘",
  title,
  description,
  usage,
  example,
  notes = [],
}) {
  const body = [
    LINE,
    `${icon} *${String(title || "COMANDO").toUpperCase()}*`,
    LINE,
    "",
  ];

  if (description) {
    body.push(description, "");
  }

  body.push("*Uso*", `\`${usage}\``);

  if (example) {
    body.push("", "*Ejemplo*", `\`${example}\``);
  }

  if (notes.length > 0) {
    body.push("", "*Notas*");
    for (const note of notes) {
      body.push(`• ${note}`);
    }
  }

  body.push("", LINE);
  return compactLines(body);
}

function formatCommandForm({
  icon = "📋",
  title,
  description,
  command,
  fields = [],
  example = [],
  notes = [],
}) {
  const templateLines = [command, ...fields.map((field) => `${field}: `)];
  const body = [
    LINE,
    `${icon} *${String(title || "FORMULARIO").toUpperCase()}*`,
    LINE,
    "",
  ];

  if (description) {
    body.push(description, "");
  }

  body.push("*Plantilla*", "```", templateLines.join("\n"), "```");

  if (example.length > 0) {
    body.push("", "*Ejemplo*", "```", example.join("\n"), "```");
  }

  if (notes.length > 0) {
    body.push("", "*Notas*");
    for (const note of notes) {
      body.push(`• ${note}`);
    }
  }

  body.push("", LINE);
  return compactLines(body);
}

function formatFeedback({ icon = "ℹ️", title = "Aviso", lines = [] }) {
  return compactLines([
    LINE,
    `${icon} *${title}*`,
    LINE,
    "",
    lines,
    "",
    LINE,
  ]);
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
  formatCommandForm,
  formatCommandUsage,
  formatError,
  formatFeedback,
};
