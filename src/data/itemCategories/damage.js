/**
 * @constant ModuleBase
 */
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Represents a damage module.
 * @augments ModuleBase
 */
class DamageModule extends ModuleBase {
  /**
   * @member type
   * @type {string}
   * @public
   * @static
   */
  static type = "damage";
  /**
   * @member triggers
   * @type {*[]}
   * @public
   * @static
   */
  static triggers = ["Attack"];

  /**
   * Registers a listener for the attack event.
   * @returns
   */
  onAttack() {
    return { type: "damage" };
  }
}

module.exports = DamageModule;
