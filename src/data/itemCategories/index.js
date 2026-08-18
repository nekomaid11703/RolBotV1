/**
 * Module Registration Registry for Item Categories
 */
const moduleRegistry = require("../../modules/moduleRegistry");
const HealModule = require("./heal");
const BuffModule = require("./buff");
const DamageModule = require("./damage");
const EquipableModule = require("./equipable");
const TemporalModule = require("./temporal");
const WeaponModule = require("./weapon");
const ArmorModule = require("./armor");
const DurabilityModule = require("./durability");
const ThrowableModule = require("./throwable");
const SpellModule = require("./spell");
const FocusModule = require("./focus");

moduleRegistry.register(HealModule);
moduleRegistry.register(BuffModule);
moduleRegistry.register(DamageModule);
moduleRegistry.register(EquipableModule);
moduleRegistry.register(TemporalModule);
moduleRegistry.register(WeaponModule);
moduleRegistry.register(ArmorModule);
moduleRegistry.register(DurabilityModule);
moduleRegistry.register(ThrowableModule);
moduleRegistry.register(SpellModule);
moduleRegistry.register(FocusModule);

module.exports = {
  /**
   * @param {string} type - category type identifier.
   * @returns {object|null} the registered module class or null when not found.
   */
  getCategory: (type) => moduleRegistry.get(type),
  getCategories: () => moduleRegistry.getAll(),
};
