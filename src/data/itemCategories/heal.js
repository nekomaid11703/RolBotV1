/**
 * @constant ModuleBase
 */
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Represents a heal module.
 * @extends ModuleBase
 */
class HealModule extends ModuleBase {
  /**
   * @member type
   * @type {string}
   * @public
   * @static
   */
  static type = "heal";
  /**
   * @member triggers
   * @type {Array}
   * @public
   * @static
   */
  static triggers = ["Use"];

  /**
   * Registers a listener for the use event.
   * @param { character }
   * @returns
   */
  onUse({ character }) {
    /**
     * @constant maxHp
     */
    const maxHp = (character.stats?.hp || 1) * 2;
    /**
     * @constant amount
     */
    const amount = this.config.amount || 0;
    /**
     * @constant newHp
     */
    const newHp = Math.min(maxHp, character.hp_actual + amount);
    return {
      type: "heal",
      amount,
      hpBefore: character.hp_actual,
      hpAfter: newHp,
      delta: newHp - character.hp_actual,
      maxHp,
    };
  }
}

module.exports = HealModule;
