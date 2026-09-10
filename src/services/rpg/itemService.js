require("../../data/itemCategories");
const { getItem: getRawItem } = require("../../data/items");
const { createEntity } = require("../../modules/entityFactory");

/**
 * @param {*} itemId
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
    description: def.description,
    rarity: def.rarity || "common",
    price: def.basePrice || 0,
    maxStack: def.maxStack || 99,
    categories: def.categories || [],
    modules: def.modules || {},
  });

  return entity;
}

module.exports = { createItem };
