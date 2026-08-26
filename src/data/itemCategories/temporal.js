/**
 * @constant ModuleBase
 */
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Represents a temporal module.
 * @augments ModuleBase
 */
class TemporalModule extends ModuleBase {
  /**
   * @member type
   * @type {string}
   * @public
   * @static
   */
  static type = "temporal";
  /**
   * @member triggers
   * @type {*[]}
   * @public
   * @static
   */
  static triggers = [];
}

module.exports = TemporalModule;
