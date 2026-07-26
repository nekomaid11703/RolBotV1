/**
 * @constant ITEMS
 * @type {object}
 */
const ITEMS = {
  venda: {
    id: "venda",
    name: "Venda",
    description: "Venda básica para curar heridas superficiales.",
    icon: "🩹",
    categories: ["consumable"],
    basePrice: 100,
    maxStack: 99,
    rarity: "common",
    modules: { heal: { amount: 15 } },
  },
  pocion: {
    id: "pocion",
    name: "Poción",
    description: "Poción de recuperación que restaura una cantidad moderada de HP.",
    icon: "🧪",
    categories: ["consumable"],
    basePrice: 180,
    maxStack: 99,
    rarity: "common",
    modules: { heal: { amount: 40 } },
  },
  tonico: {
    id: "tonico",
    name: "Tónico",
    description: "Tónico revitalizante de alta calidad que restaura gran cantidad de HP.",
    icon: "⚗️",
    categories: ["consumable"],
    basePrice: 280,
    maxStack: 99,
    rarity: "common",
    modules: { heal: { amount: 80 } },
  },
  antidoto: {
    id: "antidoto",
    name: "Antídoto",
    description: "Antídoto de amplio espectro. Cura estados alterados y restaura 25 HP.",
    icon: "💊",
    categories: ["consumable"],
    basePrice: 200,
    maxStack: 99,
    rarity: "common",
    modules: { heal: { amount: 25 } },
  },
  // Temp items for dummy combat — cleaned up on session end
  pocion_temp: {
    id: "pocion_temp",
    name: "Poción de Prueba",
    description: "Ítem temporal de entrenamiento. Se elimina al terminar el combate.",
    icon: "🧪",
    categories: ["consumable"],
    basePrice: 0,
    maxStack: 5,
    rarity: "common",
    modules: { heal: { amount: 40 }, temporal: {} },
  },
  tonico_temp: {
    id: "tonico_temp",
    name: "Tónico de Prueba",
    description: "Ítem temporal de entrenamiento. Se elimina al terminar el combate.",
    icon: "⚗️",
    categories: ["consumable"],
    basePrice: 0,
    maxStack: 5,
    rarity: "common",
    modules: { heal: { amount: 80 }, temporal: {} },
  },
  venda_temp: {
    id: "venda_temp",
    name: "Venda de Prueba",
    description: "Ítem temporal de entrenamiento. Se elimina al terminar el combate.",
    icon: "🩹",
    categories: ["consumable"],
    basePrice: 0,
    maxStack: 5,
    rarity: "common",
    modules: { heal: { amount: 15 }, temporal: {} },
  },
};

/**
 * Get an item definition by id.
 * @param {string} itemId - Item identifier
 * @returns {*|null} Item definition object or null
 */
function getItem(itemId) {
  return ITEMS[itemId] || null;
}

/**
 * Get all items matching a category.
 * @param {string} category - Category to filter by
 * @returns {Array<*>} Array of matching item definitions
 */
function getItemsByCategory(category) {
  return Object.values(ITEMS).filter((item) => (item.categories || []).includes(category));
}

module.exports = {
  ITEMS,
  getItem,
  getItemsByCategory,
};
