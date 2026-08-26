const { normalizeTier } = require("../../config/tierConfig");
const { getMaterialStats } = require("../../data/materialData");
const itemCatalog = require("../../data/itemCatalog");
const { createEntity } = require("../../modules/entityFactory");
const moduleRegistry = require("../../modules/moduleRegistry");
// Registra los módulos de ítem en el registry (weapon, armor, buff, ...).
require("../../data/itemCategories");

/**
 * @typedef {"weapon"|"armor"|"artifact"|"consumable"|"material"|"special"|"throwable"|"spell"} ItemType
 */

/**
 * @constant VALID_TYPES
 * @type {Set<string>}
 */
const VALID_TYPES = new Set([
  "weapon",
  "armor",
  "artifact",
  "consumable",
  "material",
  "special",
  "throwable",
  "spell",
  "focus",
]);

/**
 * @typedef {object} ItemDefinition
 * @property {string} id - Identificador único del ítem
 * @property {ItemType} type - Categoría funcional del ítem
 * @property {string} [name] - Nombre mostrado
 * @property {string} [description] - Descripción del ítem
 * @property {number} [basePrice] - Precio base (monedas)
 * @property {number} [maxStack] - Límite de stack por ranura
 * @property {string} [rarity] - Rareza del ítem
 * @property {string} [tier] - Tier (E, D, C, B, A, S, N)
 * @property {string} [material] - Material base
 * @property {string[]} [categories] - Categorías de equipamiento
 * @property {Record<string, any>} [modules] - Configuración de módulos
 * @property {object} [metadata] - Metadatos derivados (durabilidad, stats)
 * @property {string|null} [setId] - Identificador de set
 * @property {boolean} [isRepairable] - Si es reparable o se destruye
 */

/**
 * Valida y normaliza la forma base de una definición de ítem (sin hardcodear instancias).
 * @param {Record<string, any>} raw - Input bruto (base de una ItemDefinition)
 * @throws {Error} Si el tipo no es válido o faltan campos obligatorios
 */
function validateDefinition(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Definición de ítem inválida");
  if (!raw.id) throw new Error("Definición de ítem sin 'id'");
  if (!VALID_TYPES.has(raw.type)) {
    throw new Error(`Tipo de ítem inválido: "${raw.type}". Válidos: ${Array.from(VALID_TYPES).join(", ")}`);
  }
  return raw.type;
}

/**
 * Deriva los metadatos iniciales de un ítem equipable a partir de su material y tier.
 * @param {ItemDefinition} def - Definición normalizada
 * @returns {object} metadata inicial { tier, material, durability, ... }
 */
function deriveMetadata(def) {
  const tier = normalizeTier(def.tier || "E");
  const matStats = getMaterialStats(def.material || "madera", tier);

  const metadata = /** @type {Record<string, any>} */ ({
    tier,
    material: def.material || "madera",
    broken: false,
  });

  metadata.materialStats = {
    afilabilidad: matStats.afilabilidad,
    conduccion_magica: matStats.conduccion_magica,
    resistencia_material: matStats.resistencia_material,
    flexibilidad: matStats.flexibilidad,
  };

  // Durabilidad derivada de la resistencia material (para armor/weapon/artefacto equipable).
  // Los arrojadizos son de una sola pieza (no portan durabilidad persistente).
  if (
    def.type !== "consumable" &&
    def.type !== "material" &&
    def.type !== "special" &&
    def.type !== "throwable" &&
    def.type !== "spell"
  ) {
    const maxResist = Math.max(1, matStats.resistencia_material);
    metadata.durability = { maxResist, currentResist: maxResist, isRepairable: def.isRepairable !== false };
  }

  return metadata;
}

/**
 * Construye la definición de ítem cruda a partir de una entrada de configuración,
 * aplicando validación, normalización de tipo/tier y derivación de metadata del material.
 * @param {Record<string, any>} input - { id, type, name, basePrice, maxStack, rarity, material, tier,
 *                          modules, slots, setId, isRepairable }
 * @returns {ItemDefinition} ItemDefinition completa
 */
function createItemDefinition(input) {
  const type = validateDefinition(input);
  const id = input.id;

  const definition = {
    id,
    type,
    name: input.name || id,
    description: input.description || "",
    basePrice: Number(input.basePrice) || 0,
    maxStack: input.maxStack ?? (type === "consumable" ? 99 : 1),
    rarity: input.rarity || "comun",
    tier: normalizeTier(input.tier || "E"),
    material: input.material || "madera",
    categories: Array.isArray(input.categories) ? input.categories : [type],
    modules: input.modules || {},
    setId: input.setId || null,
    isRepairable: input.isRepairable !== false,
    metadata: deriveMetadata(/** @type {ItemDefinition} */ ({ ...input, type })),
  };

  // Validar que los módulos referenciados existan en el registro (fail-fast).
  const knownModules = moduleRegistry.getAll();
  for (const modType of Object.keys(definition.modules)) {
    if (!knownModules.includes(modType)) {
      throw new Error(`Módulo de ítem desconocido: "${modType}"`);
    }
  }

  return definition;
}

/**
 * Instancia la definición en un Entity (módulos activos) reutilizando entityFactory.
 * @param {ItemDefinition} definition - Definición normalizada
 * @returns {object|null} Entity con módulos o null
 */
function instantiateEntity(definition) {
  if (!definition || !definition.id) return null;
  return createEntity({
    id: definition.id,
    type: definition.type,
    name: definition.name,
    description: definition.description,
    rarity: definition.rarity,
    price: definition.basePrice,
    maxStack: definition.maxStack,
    categories: definition.categories,
    modules: definition.modules || {},
  });
}

/**
 * Compone el flujo completo: cargar del catálogo → crear definición → instanciar Entity.
 * @param {string} id
 * @returns {object|null} Entity o null si el ítem no está registrado
 */
function buildItem(id) {
  const catalog = itemCatalog.load(id);
  if (!catalog) return null;
  const def = createItemDefinition(catalog);
  return instantiateEntity(def);
}

module.exports = {
  validateDefinition,
  createItemDefinition,
  buildItem,
};
