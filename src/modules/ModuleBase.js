/**
 * Represents a module base.
 */
class ModuleBase {
  /**
   * @member type
   * @type {string}
   * @public
   * @static
   */
  static type = "__base__";
  /**
   * @member triggers
   * @type {*[]}
   * @public
   * @static
   */
  static triggers = [];
  /**
   * @member priority
   * @type {number}
   * @public
   * @static
   */
  static priority = 0;

  /**
   * @param {*} [config] - configuration object.
   * @class
   */
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Condition.
   * @param {*} context - - execution context.
   * @returns {*}
   */
  condition(context) {
    return true;
  }

  /**
   * Registers a listener for the use event.
   * @param {*} context - - execution context.
   * @returns {*}
   */
  onUse(context) {
    return null;
  }
  /**
   * Registers a listener for the equip event.
   * @param {*} context - - execution context.
   * @returns {*}
   */
  onEquip(context) {
    return null;
  }
  /**
   * Registers a listener for the unequip event.
   * @param {*} context - - execution context.
   * @returns {*}
   */
  onUnequip(context) {
    return null;
  }
  /**
   * Registers a listener for the attack event.
   * @param {*} context - - execution context.
   * @returns {*}
   */
  onAttack(context) {
    return null;
  }
  /**
   * Registers a listener for the hit event.
   * @param {*} context - - execution context.
   * @returns {*}
   */
  onHit(context) {
    return null;
  }
  /**
   * Registers a listener for the turn start event.
   * @param {*} context - - execution context.
   * @returns {*}
   */
  onTurnStart(context) {
    return null;
  }
  /**
   * Registers a listener for the turn end event.
   * @param {*} context - - execution context.
   * @returns {*}
   */
  onTurnEnd(context) {
    return null;
  }
  /**
   * Registers a listener for the acquire event.
   * @param {*} context - - execution context.
   * @returns {*}
   */
  onAcquire(context) {
    return null;
  }
  /**
   * Registers a listener for the lose event.
   * @param {*} context - - execution context.
   * @returns {*}
   */
  onLose(context) {
    return null;
  }
}

module.exports = ModuleBase;
