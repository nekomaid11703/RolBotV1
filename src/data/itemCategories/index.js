const moduleRegistry = require("../../modules/moduleRegistry");
const HealModule = require("./heal");
const BuffModule = require("./buff");
const DamageModule = require("./damage");
const EquipableModule = require("./equipable");
const TemporalModule = require("./temporal");

moduleRegistry.register(HealModule);
moduleRegistry.register(BuffModule);
moduleRegistry.register(DamageModule);
moduleRegistry.register(EquipableModule);
moduleRegistry.register(TemporalModule);

module.exports = {
  getCategory: (type) => moduleRegistry.get(type),
  getCategories: () => moduleRegistry.getAll(),
};
