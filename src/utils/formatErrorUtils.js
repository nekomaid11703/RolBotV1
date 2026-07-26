// @ts-nocheck
/**
 * @constant LINE
 * @type {string}
 */
const LINE = "✦ ━━━━━━━━━━━━━━ ✦";

/**
 * @param lines
 * @returns
 */
function compactLines(lines) {
  return lines
    .flat()
    .filter((line) => line !== null && line !== undefined)
    .map((line) => String(line))
    .join("\n");
}

/**
 * @param { icon = "ℹ️", title = "Aviso", lines = [] } - TODO: describe parameter "{ icon = "ℹ️", title = "Aviso", lines = [] }".
 * @param root0
 * @returns
 */
function buildFeedbackBody({ icon = "ℹ️", title = "Aviso", lines = [] }) {
  return [LINE, `${icon} *${title}*`, LINE, "", lines, "", LINE];
}

/**
 * @param opts
 * @returns
 */
function formatFeedback(opts) {
  return compactLines(buildFeedbackBody(opts));
}

/**
 * @param message
 * @param [hint]
 * @returns
 */
function formatError(message, hint = null) {
  return formatFeedback({
    icon: "❌",
    title: "No se pudo completar",
    lines: hint ? [message, "", hint] : [message],
  });
}

module.exports = { formatError, formatFeedback, buildFeedbackBody, compactLines };
