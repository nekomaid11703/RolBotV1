// @ts-nocheck
const ITEMS = {
  venda: {
    id: "venda",
    name: "Venda",
    description: "Venda básica para curar heridas superficiales.",
    price: 100,
    healHp: 15,
    category: "consumable",
    icon: "🩹",
  },
  pocion: {
    id: "pocion",
    name: "Poción",
    description: "Poción de recuperación que restaura una cantidad moderada de HP.",
    price: 180,
    healHp: 40,
    category: "consumable",
    icon: "🧪",
  },
  tonico: {
    id: "tonico",
    name: "Tónico",
    description: "Tónico revitalizante de alta calidad que restaura gran cantidad de HP.",
    price: 280,
    healHp: 80,
    category: "consumable",
    icon: "⚗️",
  },
  antidoto: {
    id: "antidoto",
    name: "Antídoto",
    description: "Antídoto de amplio espectro. Cura estados alterados y restaura 25 HP.",
    price: 200,
    healHp: 25,
    category: "consumable",
    icon: "💊",
  },
};

/**
 *
 * @param itemId
 */
function getItem(itemId) {
  return ITEMS[itemId] || null;
}

/**
 *
 * @param category
 */
function getItemsByCategory(category) {
  return Object.values(ITEMS).filter((item) => item.category === category);
}

module.exports = {
  ITEMS,
  getItem,
  getItemsByCategory,
};
