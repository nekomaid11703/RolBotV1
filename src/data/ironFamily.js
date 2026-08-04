const itemCatalog = require("./itemCatalog");
const { createItemDefinition } = require("../services/rpg/itemFactory");

/**
 * Familia del Hierro — primeros ítems de juego.
 *
 * Se registran en `itemCatalog` (registro inyectable) y son visibles para el
 * sistema real a través del puente `getItem` de `src/data/items.js`.
 */

/**
 * Estadísticas del material hierro (fuente única, replica materialData por claridad).
 * @constant IRON_STATS
 * @type {{afilabilidad: number, conduccion_magica: number, resistencia_material: number, flexibilidad: number}}
 */
const IRON_STATS = {
  afilabilidad: 45,
  conduccion_magica: 20,
  resistencia_material: 55,
  flexibilidad: 25,
};

/**
 * Compone una definición completa (normalizando tier/material/metadata) vía factory.
 * @param {object} input
 * @returns {object} ItemDefinition con metadata derivada
 */
function define(input) {
  return createItemDefinition({
    material: "hierro",
    tier: "E",
    setId: null,
    ...input,
  });
}

/**
 * @constant IRON_ITEMS
 * @type {Record<string, object>}
 */
const IRON_ITEMS = {
  // ---- Arma equipable ----
  espada_de_hierro: define({
    id: "espada_de_hierro",
    type: "weapon",
    name: "Espada de Hierro",
    description: "Espada cortante forjada en hierro. Sólida y fiable.",
    rarity: "poco_comun",
    basePrice: 350,
    categories: ["weapon"],
    modules: { weapon: { damageNature: "cortante", hands: 1, baseDamage: 20, weaponRange: 1 } },
  }),

  // ---- Set de armadura de hierro (4 piezas, setId set_hierro) ----
  casco_de_hierro: define({
    id: "casco_de_hierro",
    type: "armor",
    name: "Casco de Hierro",
    description: "Yelmo de hierro que protege la cabeza.",
    basePrice: 180,
    categories: ["armor"],
    setId: "set_hierro",
    modules: { armor: { slot: "cabeza", coverage: "media", bonusDef: 4 } },
  }),
  pechera_de_hierro: define({
    id: "pechera_de_hierro",
    type: "armor",
    name: "Pechera de Hierro",
    description: "Coraza de hierro de protección reforzada.",
    basePrice: 320,
    categories: ["armor"],
    setId: "set_hierro",
    modules: { armor: { slot: "pecho", coverage: "alta", bonusDef: 6 } },
  }),
  grebas_de_hierro: define({
    id: "grebas_de_hierro",
    type: "armor",
    name: "Grebas de Hierro",
    description: "Grebas de hierro que resguardan las piernas.",
    basePrice: 200,
    categories: ["armor"],
    setId: "set_hierro",
    modules: { armor: { slot: "pantalones", coverage: "media", bonusDef: 4 } },
  }),
  botas_de_hierro: define({
    id: "botas_de_hierro",
    type: "armor",
    name: "Botas de Hierro",
    description: "Botas reforzadas con placas de hierro.",
    basePrice: 150,
    categories: ["armor"],
    setId: "set_hierro",
    modules: { armor: { slot: "botas", coverage: "ligera", bonusDef: 3 } },
  }),

  // ---- Artefacto ----
  amuleto_de_hierro: define({
    id: "amuleto_de_hierro",
    type: "artifact",
    name: "Amuleto de Hierro",
    description: "Talismán de hierro que canaliza fuerza adicional.",
    basePrice: 420,
    categories: ["artifact"],
    modules: { buff: { stats: { atk: 5 } } },
  }),

  // ---- Arma arrojadiza (no equipable, consume turno de ataque) ----
  kunai_de_hierro: define({
    id: "kunai_de_hierro",
    type: "throwable",
    name: "Kunai de Hierro",
    description: "Arma arrojadiza de una sola pieza. Se lanza consumiendo el turno de ataque.",
    basePrice: 60,
    maxStack: 20,
    categories: ["throwable"],
    modules: { throwable: { damageNature: "perforante", baseDamage: 14, range: 3, tier: "E" } },
  }),
};

// Registra cada definición en el catálogo inyectable.
for (const [id, def] of Object.entries(IRON_ITEMS)) {
  itemCatalog.register(id, () => def);
}

module.exports = { IRON_ITEMS, IRON_STATS };
