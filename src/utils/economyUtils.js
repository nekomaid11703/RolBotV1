// @ts-nocheck
/**
 * Formats the stelas.
 * @param {*} amount - - amount.
 * @returns
 */
function formatStelas(amount) {
  /**
   * @constant value
   */
  const value = Math.floor(Number(amount) || 0);

  return value === 1 ? `✧ ${value} stela` : `✧ ${value} stelas`;
}

/**
 * Formats the duration.
 * @param {*} ms - - ms.
 * @returns
 */
function formatDuration(ms) {
  /**
   * @constant totalMs
   */
  const totalMs = Math.max(0, Math.floor(Number(ms) || 0));

  /**
   * @constant totalMinutes
   */
  const totalMinutes = Math.ceil(totalMs / 60000);

  /**
   * @constant hours
   */
  const hours = Math.floor(totalMinutes / 60);
  /**
   * @constant minutes
   */
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes}m`;
  }

  if (minutes <= 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

module.exports = {
  formatStelas,
  formatDuration,
};
