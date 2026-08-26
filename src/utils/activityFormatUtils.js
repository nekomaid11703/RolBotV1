// @ts-nocheck
/**
 * Formats the count.
 * @param {*} value - - value to process.
 * @returns
 */
function formatCount(value) {
  return String(Math.max(0, Math.floor(Number(value) || 0)));
}

/**
 * Formats the date.
 * @param {*} value - - value to process.
 * @returns
 */
function formatDate(value) {
  if (!value) {
    return "sin datos";
  }

  /**
   * @constant date
   * @type {Date}
   */
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "sin datos";
  }

  return date.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

/**
 * Medal.
 * @param {*} index - - zero-based index.
 * @returns
 */
function medal(index) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${index + 1}.`;
}

module.exports = { formatCount, formatDate, medal };
