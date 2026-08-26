/**
 * @constant path
 */
const path = require("path");

/**
 * @constant GROUP_ACTIVITY_ROOT
 */
const GROUP_ACTIVITY_ROOT = path.join(__dirname, "../database/grupos");
/**
 * @constant GROUP_TOP_LIMIT
 * @type {number}
 */
const GROUP_TOP_LIMIT = 10;
/**
 * @constant MAX_WARNS
 * @type {number}
 */
const MAX_WARNS = 3;

module.exports = {
  GROUP_ACTIVITY_ROOT,
  GROUP_TOP_LIMIT,
  MAX_WARNS,
};
