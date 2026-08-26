/**
 * @typedef {object} ItemDef
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]} categories
 * @property {number} basePrice
 * @property {number} maxStack
 * @property {string} rarity
 * @property {object} modules
 */

const itemCatalog = require("./itemCatalog");
// Carga las familias del catálogo inyectable (auto-registran sus definiciones).
require("./ironFamily");
require("./materialFamilies");
// Carga los hechizos creados por el usuario en el Spell Lab (si existen).
require("./userSpells").loadUserSpells();

/**
 * @constant ITEMS
 * @type {Record<string, ItemDef>}
 */
const ITEMS = {
  venda: {
    id: "venda",
    name: "Venda",
    description: "Venda básica para curar heridas superficiales.",
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
    categories: ["consumable"],
    basePrice: 0,
    maxStack: 5,
    rarity: "common",
    modules: { heal: { amount: 15 }, temporal: {} },
  },

  // Contenedores de hechizos
  libreta_desgastada: {
    id: "libreta_desgastada",
    name: "Libreta Desgastada",
    description: "Una pequeña libreta de apuntes que permite almacenar hasta 2 hechizos.",
    categories: ["spell_container"],
    basePrice: 150,
    maxStack: 1,
    rarity: "common",
    modules: { spellContainer: { capacity: 2 } },
  },
  pergamino: {
    id: "pergamino",
    name: "Pergamino de Hechizo",
    description: "Un pergamino arcano que conserva 1 hechizo inscrito.",
    categories: ["spell_container"],
    basePrice: 100,
    maxStack: 10,
    rarity: "common",
    modules: { spellContainer: { capacity: 1 } },
  },
  grimorio: {
    id: "grimorio",
    name: "Grimorio",
    description: "Un tomo de magia resistente capaz de contener 4 hechizos.",
    categories: ["spell_container"],
    basePrice: 500,
    maxStack: 1,
    rarity: "rare",
    modules: { spellContainer: { capacity: 4 } },
  },
  grimorio_arcano: {
    id: "grimorio_arcano",
    name: "Grimorio Arcano",
    description: "Un sofisticado tomo encuadernado en piel mágica con capacidad para 8 hechizos.",
    categories: ["spell_container"],
    basePrice: 1200,
    maxStack: 1,
    rarity: "epic",
    modules: { spellContainer: { capacity: 8 } },
  },
};

/**
 * Obtiene todos los ítems registrados en el sistema (estáticos e inyectados en itemCatalog).
 * @returns {Array<object>}
 */
function getAllItems() {
  const allMap = new Map();
  for (const [id, item] of Object.entries(ITEMS)) {
    allMap.set(id, item);
  }
  for (const id of itemCatalog.ids()) {
    if (!allMap.has(id)) {
      const loaded = itemCatalog.load(id);
      if (loaded) allMap.set(id, loaded);
    }
  }
  return Array.from(allMap.values());
}

/**
 * Get an item definition by id.
 * @param {string} itemId - Item identifier
 * @returns {ItemDef|null} Item definition object or null
 */
function getItem(itemId) {
  if (!itemId) return null;
  const id = String(itemId).toLowerCase();
  return ITEMS[id] || itemCatalog.load(id) || null;
}

/**
 * Get all items matching a category.
 * @param {string} category - Category to filter by
 * @returns {Array<*>} Array of matching item definitions
 */
function getItemsByCategory(category) {
  const cat = String(category).toLowerCase();
  return getAllItems().filter((item) => (item.categories || []).includes(cat) || item.type === cat);
}

module.exports = {
  ITEMS,
  getItem,
  getAllItems,
  getItemsByCategory,
};

