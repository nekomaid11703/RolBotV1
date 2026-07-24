const { ITEMS, getItem: getRawItem } = require("../../data/items");
const { getCategory } = require("../../data/itemCategories");

function createItem(itemId) {
  const def = getRawItem(itemId);
  if (!def) return null;

  const modules = [];
  for (const [type, config] of Object.entries(def.modules || {})) {
    const CategoryClass = getCategory(type);
    if (CategoryClass) {
      modules.push({ instance: new CategoryClass(), config, type });
    }
  }

  return {
    id: def.id,
    name: def.name,
    description: def.description,
    icon: def.icon,
    categories: def.categories || [],
    basePrice: def.basePrice || 0,
    rarity: def.rarity || "common",
    maxStack: def.maxStack || 99,
    modules,
    use(context) {
      return this.modules
        .filter((m) => m.instance.constructor.triggers.includes("onUse"))
        .map((m) => ({
          moduleType: m.type,
          result: m.instance.onUse({ ...context, config: m.config }),
        }));
    },
  };
}

function getItem(itemId) {
  return getRawItem(itemId);
}

function getDisplayList() {
  return Object.values(ITEMS).map((item) => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
    description: item.description,
    categories: item.categories || [],
    basePrice: item.basePrice || 0,
    rarity: item.rarity || "common",
  }));
}

module.exports = { createItem, getItem, getDisplayList };
