/**
 * @constant ModuleBase
 */
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Represents a equipable module.
 * @augments ModuleBase
 */
class EquipableModule extends ModuleBase {
  /**
   * @member type
   * @type {string}
   * @public
   * @static
   */
  static type = "equipable";
  /**
   * @member triggers
   * @type {*[]}
   * @public
   * @static
   */
  static triggers = ["Equip", "Unequip"];

  /**
   * Registers a listener for the use event.
   * @returns
   */
  onUse() {
    return { type: "equipable" };
  }

  /**
   * Registers a listener for the equip event.
   * @returns
   */
  onEquip() {
    return { type: "equipable", action: "equipped" };
  }

  /**
   * Registers a listener for the unequip event.
   * @returns
   */
  onUnequip() {
    return { type: "equipable", action: "unequipped" };
  }
}

module.exports = EquipableModule;
