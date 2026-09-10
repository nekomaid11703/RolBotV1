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
module.exports = { randomInt, randomFloat };
