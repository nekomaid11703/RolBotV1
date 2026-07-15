// @ts-nocheck
const path = require("path");

const GROUP_ACTIVITY_ROOT = path.join(__dirname, "../database/grupos");
const GROUP_TOP_LIMIT = 10;
const MAX_WARNS = 3;

module.exports = {
  GROUP_ACTIVITY_ROOT,
  GROUP_TOP_LIMIT,
  MAX_WARNS,
};
