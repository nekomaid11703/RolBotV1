/**
 * @constant moduleRegistry
 */
const moduleRegistry = require("../../modules/moduleRegistry");
/**
 * @constant HealModule
 */
const HealModule = require("./heal");
/**
 * @constant BuffModule
 */
const BuffModule = require("./buff");
/**
 * @constant DamageModule
 */
const DamageModule = require("./damage");
/**
 * @constant EquipableModule
 */
const EquipableModule = require("./equipable");
/**
 * @constant TemporalModule
 */
const TemporalModule = require("./temporal");

moduleRegistry.register(HealModule);
moduleRegistry.register(BuffModule);
moduleRegistry.register(DamageModule);
moduleRegistry.register(EquipableModule);
moduleRegistry.register(TemporalModule);

module.exports = {
  /**
   * Returns the category.
   * @param {*} type - type identifier.
   * @returns {any}
   */
  getCategory: (type) => moduleRegistry.get(type),
  /**
   * Returns the categories.
   * @returns {any}
   */
  getCategories: () => moduleRegistry.getAll(),
};
