// @ts-nocheck
const { supabase } = require("../../database/supabase");
const itemsModule = require("../../data/items");
const { MATERIALS } = require("../../data/materialData");
const { TIERS, normalizeTier } = require("../../config/tierConfig");
const inventoryService = require("./inventoryService");
const { invalidateUserCache } = require("../../utils/safeQuery");

/**
 * Orden y progreso de Tiers de materiales para refinamiento.
 * @constant NEXT_TIER
 * @type {Record<string, string>}
 */
const NEXT_TIER = {
  E: "D",
  D: "C",
  C: "B",
  B: "A",
  A: "S",
  S: "N",
};

/**
 * Recetas de forja y consumo de unidades de material por tipo de ítem.
 * producedQuantity: Si se especifica, la forja produce esa cantidad en lugar de 1.
 * @constant CRAFTING_RECIPES
 * @type {Record<string, {name: string, category: string, baseType: string, materialCost: number, producedQuantity?: number}>}
 */
const CRAFTING_RECIPES = {
  // ── Costo 1 unidad ──
  daga:      { name: "Daga",         category: "weapon",         baseType: "daga",      materialCost: 1 },
  kunai:     { name: "Kunai",        category: "throwable",      baseType: "kunai",     materialCost: 1 },
  amuleto:   { name: "Amuleto",      category: "artifact",       baseType: "amuleto",   materialCost: 1 },
  varita:    { name: "Varita Mágica",category: "weapon",         baseType: "baculo",    materialCost: 1 },
  resortera: { name: "Resortera",    category: "weapon",         baseType: "resortera", materialCost: 1 },
  cerbatana: { name: "Cerbatana",    category: "weapon",         baseType: "cerbatana", materialCost: 1 },

  // ── Municiones (1 unidad de material → 16 unidades de munición) ──
  flechas:   { name: "Flechas",      category: "projectile",     baseType: "flechas",   materialCost: 1, producedQuantity: 16 },
  virotes:   { name: "Virotes",      category: "projectile",     baseType: "virotes",   materialCost: 1, producedQuantity: 16 },
  balines:   { name: "Balines",      category: "projectile",     baseType: "balines",   materialCost: 1, producedQuantity: 16 },
  dardos:    { name: "Dardos",       category: "projectile",     baseType: "dardos",    materialCost: 1, producedQuantity: 16 },

  // ── Costo 2 unidades ──
  espada:    { name: "Espada",       category: "weapon",         baseType: "espada",    materialCost: 2 },
  maza:      { name: "Maza",         category: "weapon",         baseType: "maza",      materialCost: 2 },
  arco:      { name: "Arco",         category: "weapon",         baseType: "arco",      materialCost: 2 },
  casco:     { name: "Casco",        category: "armor",          baseType: "casco",     materialCost: 2 },
  botas:     { name: "Botas",        category: "armor",          baseType: "botas",     materialCost: 2 },
  baculo:    { name: "Báculo Arcano",category: "weapon",         baseType: "baculo",    materialCost: 2 },
  tunica:    { name: "Túnica de Mago",category: "armor",         baseType: "pechera",   materialCost: 2 },
  grimorio:  { name: "Grimorio Arcano",category: "spell_container",baseType: "grimorio", materialCost: 2 },

  // ── Costo 3 unidades ──
  espada_larga: { name: "Espada Larga", category: "weapon",  baseType: "espada",  materialCost: 3 },
  lanza:        { name: "Lanza",        category: "weapon",  baseType: "lanza",   materialCost: 3 },
  ballesta:     { name: "Ballesta",     category: "weapon",  baseType: "ballesta",materialCost: 3 },
  pechera:      { name: "Pechera",      category: "armor",   baseType: "pechera", materialCost: 3 },
  grebas:       { name: "Grebas",       category: "armor",   baseType: "grebas",  materialCost: 3 },
  escudo:       { name: "Escudo",       category: "shield",  baseType: "escudo",  materialCost: 3 },
};

/**
 * Normaliza una clave de material (ej: "hierro", "mitril", "madera").
 * @param {string} matInput
 * @returns {string|null} Key del material o null si no existe
 */
function normalizeMaterialId(matInput) {
  const m = String(matInput || "").toLowerCase().trim();
  if (MATERIALS[m]) return m;
  for (const [key, val] of Object.entries(MATERIALS)) {
    if (val.name.toLowerCase() === m) return key;
  }
  return null;
}

/**
 * Normaliza un tipo de objeto deseado para forja.
 * @param {string} recipeInput
 * @returns {string|null} Key de la receta o null
 */
function normalizeRecipeKey(recipeInput) {
  const r = String(recipeInput || "").toLowerCase().trim();
  if (CRAFTING_RECIPES[r]) return r;
  const aliases = {
    // melee
    daga: "daga", kunai: "kunai", amuleto: "amuleto", varita: "varita",
    espada: "espada", maza: "maza", casco: "casco", botas: "botas",
    baculo: "baculo", baculo_arcano: "baculo",
    tunica: "tunica", grimorio: "grimorio",
    espada_larga: "espada_larga", lanza: "lanza",
    pechera: "pechera", grebas: "grebas", escudo: "escudo",
    // ranged
    arco: "arco", ballesta: "ballesta",
    resortera: "resortera", cerbatana: "cerbatana",
    // ammo
    flechas: "flechas", flecha: "flechas",
    virotes: "virotes", virote: "virotes",
    balines: "balines", balin: "balines",
    dardos: "dardos", dardo: "dardos",
  };
  return aliases[r] || null;
}

/**
 * Refina materiales del personaje combinando 2 unidades de Tier T para formar 1 unidad Tier T+1.
 * @param {object} options
 * @param {string|number} options.characterId
 * @param {string} options.creatorId
 * @param {string} options.materialId - ID o nombre del material (ej: "hierro", "mitril")
 * @param {string} [options.tier="E"] - Tier actual a refinar
 * @param {number} [options.amount=1] - Cantidad de unidades refinadas a producir
 * @returns {Promise<{materialId: string, materialName: string, sourceTier: string, targetTier: string, consumedAmount: number, producedAmount: number}>}
 */
async function refineMaterial({ characterId, creatorId, materialId, tier = "E", amount = 1 }) {
  const matKey = normalizeMaterialId(materialId);
  if (!matKey) {
    throw new Error(`El material "${materialId}" no existe en el registro.`);
  }

  const currentTier = normalizeTier(tier);
  const targetTier = NEXT_TIER[currentTier];

  if (!targetTier) {
    throw new Error(`El material Tier ${currentTier} ya está en el rango máximo (Nirvana/N) y no puede ser refinado más.`);
  }

  const numProduced = Math.max(1, Math.floor(Number(amount) || 1));
  const numRequired = numProduced * 2;

  const matItemName = `lingote_de_${matKey}`;
  const matDef = itemsModule.getItem(matItemName) || itemsModule.getItem(matKey) || { id: matKey, name: MATERIALS[matKey]?.name || matKey };

  // Verificar cantidad disponible en inventario
  const invList = await inventoryService.getInventoryList(characterId);
  const matchingEntries = invList.filter((e) => {
    if (e.itemId !== matItemName && e.itemId !== matKey) return false;
    const entryTier = e.metadata?.tier || "E";
    return entryTier === currentTier;
  });

  const totalAvailable = matchingEntries.reduce((sum, e) => sum + e.quantity, 0);

  if (totalAvailable < numRequired) {
    throw new Error(
      `Necesitas ${numRequired} unidades de ${matDef.name} Tier ${currentTier} para refinar ${numProduced} unidad(es) Tier ${targetTier}. Tienes ${totalAvailable}.`,
    );
  }

  // Consumir 2x unidades de Tier T
  await inventoryService.removeItem({
    characterId,
    creatorId,
    itemId: matchingEntries[0].itemId,
    quantity: numRequired,
  });

  // Otorgar 1x unidad de Tier T+1
  await inventoryService.addItem({
    characterId,
    creatorId,
    itemId: matchingEntries[0].itemId,
    quantity: numProduced,
    metadata: { tier: targetTier },
  });

  invalidateUserCache(creatorId);

  return {
    materialId: matKey,
    materialName: MATERIALS[matKey]?.name || matKey,
    sourceTier: currentTier,
    targetTier,
    consumedAmount: numRequired,
    producedAmount: numProduced,
  };
}

/**
 * Forja un equipamiento a partir de materiales consumidos.
 * @param {object} options
 * @param {string|number} options.characterId
 * @param {string} options.creatorId
 * @param {string} options.recipeType - Tipo de objeto (espada, pechera, baculo, etc.)
 * @param {string} options.materialId - Material utilizado (hierro, mitril, etc.)
 * @param {string} [options.tier="E"] - Tier del material utilizado
 * @returns {Promise<{craftedItem: object, recipe: object, materialName: string, tier: string, materialCost: number}>}
 */
async function craftEquipment({ characterId, creatorId, recipeType, materialId, tier = "E" }) {
  const recipeKey = normalizeRecipeKey(recipeType);
  if (!recipeKey) {
    const list = Object.keys(CRAFTING_RECIPES).join(", ");
    throw new Error(`Tipo de forja no válido: "${recipeType}". Opciones: ${list}`);
  }

  const matKey = normalizeMaterialId(materialId);
  if (!matKey) {
    throw new Error(`El material "${materialId}" no existe en el registro.`);
  }

  const itemTier = normalizeTier(tier);
  const recipe = CRAFTING_RECIPES[recipeKey];

  // Resolver ID de ítem resultante en el catálogo oficial
  const targetItemId = `${recipe.baseType}_de_${matKey}`;
  const itemDef = itemsModule.getItem(targetItemId);

  if (!itemDef) {
    throw new Error(`No existe el producto forjado "${targetItemId}" para el material "${matKey}".`);
  }

  const matItemName = `lingote_de_${matKey}`;
  const requiredMaterialCount = recipe.materialCost;

  // Verificar cantidad de material en el inventario
  const invList = await inventoryService.getInventoryList(characterId);
  const matchingEntries = invList.filter((e) => {
    if (e.itemId !== matItemName && e.itemId !== matKey) return false;
    const entryTier = e.metadata?.tier || "E";
    return entryTier === itemTier;
  });

  const totalAvailable = matchingEntries.reduce((sum, e) => sum + e.quantity, 0);

  if (totalAvailable < requiredMaterialCount) {
    throw new Error(
      `Para forjar un(a) ${recipe.name} de ${MATERIALS[matKey]?.name} (Tier ${itemTier}) necesitas ${requiredMaterialCount} unidades del material. Tienes ${totalAvailable}.`,
    );
  }

  // Consumir materiales del inventario
  await inventoryService.removeItem({
    characterId,
    creatorId,
    itemId: matchingEntries[0].itemId,
    quantity: requiredMaterialCount,
  });

  // Otorgar el ítem forjado al inventario con su metadata de Tier.
  // Si la receta define producedQuantity (ej: munición 16x), se entrega ese lote.
  const producedQuantity = recipe.producedQuantity ?? 1;
  await inventoryService.addItem({
    characterId,
    creatorId,
    itemId: targetItemId,
    quantity: producedQuantity,
    metadata: { tier: itemTier, crafted: true },
  });

  invalidateUserCache(creatorId);

  return {
    craftedItem: itemDef,
    recipe,
    materialName: MATERIALS[matKey]?.name || matKey,
    tier: itemTier,
    materialCost: requiredMaterialCount,
    producedQuantity,
  };
}

module.exports = {
  NEXT_TIER,
  CRAFTING_RECIPES,
  normalizeMaterialId,
  normalizeRecipeKey,
  refineMaterial,
  craftEquipment,
};
