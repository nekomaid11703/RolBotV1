// @ts-nocheck
const LINE = "✦ ━━━━━━━━━━━━━━ ✦";

/**
 *
 * @param lines
 */
function compactLines(lines) {
  return lines
    .flat()
    .filter((line) => line !== null && line !== undefined)
    .map((line) => String(line))
    .join("\n");
}

/**
 *
 * @param root0
 */
function buildFeedbackBody({ icon = "ℹ️", title = "Aviso", lines = [] }) {
  return [LINE, `${icon} *${title}*`, LINE, "", lines, "", LINE];
}

/**
 *
 * @param opts
 */
function formatFeedback(opts) {
  return compactLines(buildFeedbackBody(opts));
}

/**
 *
 * @param message
 * @param hint
 */
function formatError(message, hint = null) {
  return formatFeedback({
    icon: "❌",
    title: "No se pudo completar",
    lines: hint ? [message, "", hint] : [message],
  });
}

module.exports = { formatError, compactLines };
