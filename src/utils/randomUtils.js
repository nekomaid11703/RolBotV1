const { randomInt: secureRandomInt } = require("crypto");

/**
 *
 * @param min
 * @param max
 */
function randomInt(min, max) {
  return secureRandomInt(min, max);
}

/**
 *
 */
function randomFloat() {
  return secureRandomInt(0, 1000001) / 1000000;
}

/**
 *
 * @param length
 */
function randomId(length = 4) {
  const min = Math.pow(36, length - 1);
  const max = Math.pow(36, length);
  return secureRandomInt(min, max).toString(36);
}

module.exports = { randomInt, randomFloat, randomId };
