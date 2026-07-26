require("../../data/itemCategories");
const { ITEMS, getItem: getRawItem } = require("../../data/items");
const { createEntity } = require("../../modules/entityFactory");

/**
 * @param itemId
 * @returns
 */
function createItem(itemId) {
  /**
   * @constant def
   */
  const def = getRawItem(itemId);
  if (!def) return null;

  /**
   * @constant entity
   */
  const entity = createEntity({
    id: def.id,
    type: "item",
    name: def.name,
    icon: def.icon,
    description: def.description,
    rarity: def.rarity || "common",
    price: def.basePrice || 0,
    maxStack: def.maxStack || 99,
    categories: def.categories || [],
    modules: def.modules || {},
  });

  entity.use = function use(context) {
    return this.trigger("Use", context);
  };

  return entity;
}

/**
 * @param itemId
 * @returns
 */
function getItem(itemId) {
  return getRawItem(itemId);
}

/**
 * @returns
 */
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
