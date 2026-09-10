// @ts-nocheck
/**
 * Configuración central de las herramientas de recolección y expansión de inventario.
 * Progresión estricta de 1 a 10 niveles. No se compran en tiendas.
 */

const { MINIMUM_WAGE_PER_DAY } = require("./economyConfig");

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
 * Fracción del salario mínimo diario que cuesta cada mejora (en stelas).
 * La herramienta NO otorga bonus plano de botín: su nivel gobierna la curva de
 * rareza R(L). El ROI se mide como payback ACUMULADO (ver B4/TOOL_POLICY).
 */
const UPGRADE_WAGE_FRACTION = {
  2: 0.1,
  3: 0.12,
  4: 0.15,
  5: 0.18,
  6: 0.2,
  7: 0.22,
  8: 0.25,
  9: 0.3,
  10: 0.4,
};

/**
 * Stelas de una mejora como fracción del salario mínimo diario.
 * @param {number} level
 * @returns {number}
 */
function stelasForLevel(level) {
  return Math.round(MINIMUM_WAGE_PER_DAY * (UPGRADE_WAGE_FRACTION[level] || 0));
}

/**
 * Requisitos de mejora por nivel de herramienta (del nivel actual al siguiente).
 * Nivel 1 es el inicial. Para subir a Nivel N (2..10) se requiere:
 * - Stelas (fracción de jornada)
 * - Materiales de forja específicos
 *
 * Calibración B4/B8.2b: cada mejora debe devolver su inversión de forma ACUMULADA
 * en ≤15 expediciones (pico) / ≤30 (hacha, bolsa). La curva R(L) concentra el valor
 * en los tramos altos, por eso el ROI se evalúa sobre el total y no por escalón.
 */
const TOOL_UPGRADE_COSTS = {
  2: {
    stelas: stelasForLevel(2),
    materials: [
      { itemId: "trozo_de_madera", quantity: 1 },
      { itemId: "trozo_de_piedra", quantity: 1 },
    ],
  },
  3: {
    stelas: stelasForLevel(3),
    materials: [
      { itemId: "trozo_de_madera", quantity: 1 },
      { itemId: "trozo_de_acero", quantity: 1 },
    ],
  },
  4: {
    stelas: stelasForLevel(4),
    materials: [
      { itemId: "trozo_de_acero", quantity: 1 },
      { itemId: "trozo_de_cuero", quantity: 1 },
    ],
  },
  5: {
    stelas: stelasForLevel(5),
    materials: [
      { itemId: "trozo_de_acero", quantity: 1 },
      { itemId: "trozo_de_acero", quantity: 1 },
    ],
  },
  6: {
    stelas: stelasForLevel(6),
    materials: [
      { itemId: "trozo_de_acero", quantity: 1 },
      { itemId: "trozo_de_cuero", quantity: 2 },
    ],
  },
  7: {
    stelas: stelasForLevel(7),
    materials: [{ itemId: "trozo_de_plata", quantity: 1 }],
  },
  8: {
    stelas: stelasForLevel(8),
    materials: [
      { itemId: "trozo_de_plata", quantity: 1 },
      { itemId: "trozo_de_madera_caoba", quantity: 1 },
    ],
  },
  9: {
    stelas: stelasForLevel(9),
    materials: [{ itemId: "trozo_de_oro", quantity: 1 }],
  },
  10: {
    stelas: stelasForLevel(10),
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
  UPGRADE_WAGE_FRACTION,
  stelasForLevel,
  TOOL_UPGRADE_COSTS,
  getInventorySlotsByMochilaLevel,
};
