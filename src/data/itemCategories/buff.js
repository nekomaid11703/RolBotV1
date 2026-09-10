/**
 * @constant ModuleBase
 */
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Represents a buff module.
 * @augments ModuleBase
 */
class BuffModule extends ModuleBase {
  /**
   * @member type
   * @type {string}
   * @public
   * @static
   */
  static type = "buff";
  /**
   * @member triggers
   * @type {*[]}
   * @public
   * @static
   */
  static triggers = ["Use"];

  /**
   * Registers a listener for the use event.
   * @returns
   */
  onUse() {
    return {
      type: "buff",
      effect: {
        id: `eff_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        module: "buff",
        stat: this.config.stat,
        amount: this.config.amount,
        remainingTurns: this.config.durationTurns,
      },
    };
  }
}

module.exports = BuffModule;
