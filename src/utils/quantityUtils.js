/**
 *
 * @param input
 */
function parseQuantity(input) {
  const parsed = parseInt(input, 10);
  return Math.max(1, isNaN(parsed) ? 1 : parsed);
}

module.exports = { parseQuantity };