const { randomInt: secureRandomInt } = require("crypto");

/**
 * @param {*} min
 * @param {*} max
 * @returns
 */
function randomInt(min, max) {
  return secureRandomInt(min, max);
}

/**
 * @returns
 */
function randomFloat() {
  return secureRandomInt(0, 1000001) / 1000000;
}

/**
 * @param [length]
 * @returns
 */
function randomId(length = 4) {
  /**
   * @constant min
   */
  const min = Math.pow(36, length - 1);
  /**
   * @constant max
   */
  const max = Math.pow(36, length);
  return secureRandomInt(min, max).toString(36);
}

module.exports = { randomInt, randomFloat, randomId };
