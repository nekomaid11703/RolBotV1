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

moduleRegistry.register(HealModule);
moduleRegistry.register(BuffModule);
moduleRegistry.register(DamageModule);
moduleRegistry.register(EquipableModule);
moduleRegistry.register(TemporalModule);
moduleRegistry.register(WeaponModule);
moduleRegistry.register(ArmorModule);
moduleRegistry.register(DurabilityModule);

module.exports = {
  getCategory: (type) => moduleRegistry.get(type),
  getCategories: () => moduleRegistry.getAll(),
};
