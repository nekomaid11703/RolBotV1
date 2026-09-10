// @ts-nocheck
/**
 * Configuración central de las herramientas de recolección y expansión de inventario.
 * Progresión estricta de 1 a 10 niveles. No se compran en tiendas.
 */

const TOOLS = {
  pico: {
    id: "pico",
    name: "Pico de Minero",
    icon: "⛏️",
    type: "mineria",
    description: "Permite extraer minerales y piedras preciosas en yacimientos y montañas.",
  },
  hacha: {
    id: "hacha",
    name: "Hacha de Leñador",
    icon: "🪓",
    type: "tala",
    description: "Permite cortar maderas comunes y exóticas en bosques y arboledas.",
  },
  bolsa: {
    id: "bolsa",
    name: "Bolsa de Herboristería",
    icon: "🌿",
    type: "recoleccion",
    description: "Permite recolectar hierbas medicinales, raíces y fibras naturales.",
  },
  mochila: {
    id: "mochila",
    name: "Mochila de Viajero",
    icon: "🎒",
    type: "expansion",
    description:
      "Aumenta la capacidad de ranuras de ítems distintos en el inventario (+2 slots por nivel sobre los 20 base).",
  },
};

/**
 * Requisitos de mejora por nivel de herramienta (del nivel actual al siguiente).
 * Nivel 1 es el inicial. Para subir a Nivel N (2..10) se requiere:
 * - Stelas
 * - Materiales de forja específicos
 *
 * Calibración B4/B8.2b: cada mejora debe devolver su inversión en ≤10 expediciones de la
 * zona de la herramienta. La herramienta NO otorga bonus plano de botín: su nivel
 * gobierna la curva de rareza R(L) (16:1 en L1 → ~1 mítico/16 en L10). Los costes
 * en stelas/materiales se mantienen acotados; los niveles 9-10 quedan bloqueados por
 * materiales exóticos hasta disponer de rutas (trozo de oro / trozo de titanio).
 */
const TOOL_UPGRADE_COSTS = {
  2: {
    stelas: 60,
    materials: [
      { itemId: "trozo_de_madera", quantity: 1 },
      { itemId: "trozo_de_piedra", quantity: 1 },
    ],
  },
  3: {
    stelas: 90,
    materials: [
      { itemId: "trozo_de_madera", quantity: 1 },
      { itemId: "trozo_de_acero", quantity: 1 },
    ],
  },
  4: {
    stelas: 120,
    materials: [
      { itemId: "trozo_de_acero", quantity: 1 },
      { itemId: "trozo_de_cuero", quantity: 1 },
    ],
  },
  5: {
    stelas: 160,
    materials: [
      { itemId: "trozo_de_acero", quantity: 1 },
      { itemId: "trozo_de_acero", quantity: 1 },
    ],
  },
  6: {
    stelas: 200,
    materials: [
      { itemId: "trozo_de_acero", quantity: 1 },
      { itemId: "trozo_de_cuero", quantity: 2 },
    ],
  },
  7: {
    stelas: 200,
    materials: [{ itemId: "trozo_de_plata", quantity: 1 }],
  },
  8: {
    stelas: 100,
    materials: [
      { itemId: "trozo_de_plata", quantity: 1 },
      { itemId: "trozo_de_madera_caoba", quantity: 1 },
    ],
  },
  9: {
    stelas: 180,
    materials: [{ itemId: "trozo_de_oro", quantity: 1 }],
  },
  10: {
    stelas: 220,
    materials: [
      { itemId: "trozo_de_oro", quantity: 1 },
      { itemId: "trozo_de_titanio", quantity: 1 },
    ],
  },
};

/**
 * Retorna la capacidad total de inventario según el nivel de la mochila (1..10).
 * Nivel 1 = 20 (base). Nivel 10 = 20 + 9*2 = 38 slots.
 * @param {number} mochilaLevel
 * @returns {number}
 */
function getInventorySlotsByMochilaLevel(mochilaLevel = 1) {
  const lvl = Math.max(1, Math.min(10, Number(mochilaLevel) || 1));
  return 20 + (lvl - 1) * 2;
}

module.exports = {
  TOOLS,
  TOOL_UPGRADE_COSTS,
  getInventorySlotsByMochilaLevel,
};
