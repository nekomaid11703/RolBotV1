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
   * @param {*} _context - - execution context.
   * @returns {*}
   */
  condition(_context) {
    return true;
  }

  /**
   * Registers a listener for the use event.
   * @param {*} _context - - execution context.
   * @returns {*}
   */
  onUse(_context) {
    return null;
  }
  /**
   * Registers a listener for the equip event.
   * @param {*} _context - - execution context.
   * @returns {*}
   */
  onEquip(_context) {
    return null;
  }
  /**
   * Registers a listener for the unequip event.
   * @param {*} _context - - execution context.
   * @returns {*}
   */
  onUnequip(_context) {
    return null;
  }
  /**
   * Registers a listener for the attack event.
   * @param {*} _context - - execution context.
   * @returns {*}
   */
  onAttack(_context) {
    return null;
  }
  /**
   * Registers a listener for the hit event.
   * @param {*} _context - - execution context.
   * @returns {*}
   */
  onHit(_context) {
    return null;
  }
  /**
   * Registers a listener for the turn start event.
   * @param {*} _context - - execution context.
   * @returns {*}
   */
  onTurnStart(_context) {
    return null;
  }
  /**
   * Registers a listener for the turn end event.
   * @param {*} _context - - execution context.
   * @returns {*}
   */
  onTurnEnd(_context) {
    return null;
  }
  /**
   * Registers a listener for the acquire event.
   * @param {*} _context - - execution context.
   * @returns {*}
   */
  onAcquire(_context) {
    return null;
  }
  /**
   * Registers a listener for the lose event.
   * @param {*} _context - - execution context.
   * @returns {*}
   */
  onLose(_context) {
    return null;
  }
}

module.exports = ModuleBase;
