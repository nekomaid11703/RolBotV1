/**
 * @constant ModuleBase
 */
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Represents a damage module.
 * @extends ModuleBase
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
   * @type {Array}
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
