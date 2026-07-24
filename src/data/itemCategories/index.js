const HealCategory = require("./heal");
const BuffCategory = require("./buff");
const DamageCategory = require("./damage");
const EquipableCategory = require("./equipable");
const TemporalCategory = require("./temporal");

const REGISTRY = new Map();
REGISTRY.set(HealCategory.type, HealCategory);
REGISTRY.set(BuffCategory.type, BuffCategory);
REGISTRY.set(DamageCategory.type, DamageCategory);
REGISTRY.set(EquipableCategory.type, EquipableCategory);
REGISTRY.set(TemporalCategory.type, TemporalCategory);

function getCategory(type) {
  return REGISTRY.get(type) || null;
}

function getCategories() {
  return Array.from(REGISTRY.keys());
}

module.exports = { getCategory, getCategories, REGISTRY };
