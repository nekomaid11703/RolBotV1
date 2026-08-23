// @ts-nocheck
const { getItem } = require("../../data/items");
const equipmentService = require("./equipmentService");
const { getInventoryList } = require("./inventoryService");

/**
 * Capacidad por defecto de los ítems contenedores de hechizos.
 * @constant CONTAINER_CAPACITIES
 * @type {Record<string, number>}
 */
/**
 * Capacidad de ranuras de memoria por tipo de ítem contenedor de hechizos.
 * @constant CONTAINER_CAPACITIES
 * @type {Record<string, number>}
 */
const CONTAINER_CAPACITIES = {
  pergamino: 1,
  libreta_desgastada: 4,
  grimorio: 12,
  grimorio_arcano: 24,
};

/**
 * Slots de hechizos activos en combate (máximo 4 simultáneos).
 * @constant ACTIVE_SPELL_SLOTS
 * @type {string[]}
 */
const ACTIVE_SPELL_SLOTS = ["spell_1", "spell_2", "spell_3", "spell_4"];

/**
 * Calcula el coste de ranuras de almacenamiento que requiere un hechizo según su Tier.
 * - Tier S: 4 slots
 * - Tier A: 3 slots
 * - Tier B / C: 2 slots
 * - Tier E / D: 1 slot
 * @param {string} tier
 * @returns {number} Ranuras que ocupa en el contenedor
 */
function getSpellSlotCost(tier = "E") {
  const t = String(tier || "E").toUpperCase();
  if (t === "S") return 4;
  if (t === "A") return 3;
  if (t === "B" || t === "C") return 2;
  return 1;
}

/**
 * Obtiene la información del contenedor de hechizos equipado en el personaje.
 * @param {string|number} characterId
 * @returns {Promise<{containerId: string|null, name: string, capacity: number, usedSlots: number, freeSlots: number, itemDef: object|null}>}
 */
async function getEquippedContainer(characterId) {
  const allSlots = await equipmentService.getEquippedSlots(characterId);
  const containerId = allSlots.spell_container || null;

  let itemDef = containerId ? getItem(containerId) : null;
  let capacity = 1; // Default de respaldo si no equipa tomo (capacidad 1)

  if (itemDef) {
    const modCap = itemDef.modules?.spellContainer?.capacity;
    capacity = modCap || CONTAINER_CAPACITIES[itemDef.id] || 4;
  } else {
    itemDef = { id: "pergamino_basico", name: "Pergamino Básico", categories: ["spell_container"] };
  }

  // Calcular slots ocupados por los hechizos actualmente activos
  const activeData = await getActiveSpells(characterId);
  let usedSlots = 0;

  for (const item of activeData.activeSpells) {
    const details = getSpellDetails(item.spellId);
    const cost = getSpellSlotCost(details?.tier || item.itemDef?.tier);
    usedSlots += cost;
  }

  const freeSlots = Math.max(0, capacity - usedSlots);
  return {
    containerId: containerId || "ninguno",
    name: itemDef.name,
    capacity,
    usedSlots,
    freeSlots,
    itemDef,
  };
}

/**
 * Obtiene los slots de hechizos activos equipados en el personaje.
 * @param {string|number} characterId
 * @returns {Promise<{slots: Record<string, string|null>, activeSpells: Array<{slot: string, spellId: string, itemDef: object}>, activeCount: number}>}
 */
async function getActiveSpells(characterId) {
  const allSlots = await equipmentService.getEquippedSlots(characterId);
  const slots = {};
  const activeSpells = [];

  for (const slotKey of ACTIVE_SPELL_SLOTS) {
    const spellId = allSlots[slotKey] || null;
    slots[slotKey] = spellId;
    if (spellId) {
      const itemDef = getItem(spellId);
      activeSpells.push({
        slot: slotKey,
        spellId,
        itemDef: itemDef || { id: spellId, name: spellId, categories: ["spell"] },
      });
    }
  }

  return {
    slots,
    activeSpells,
    activeCount: activeSpells.length,
    maxSlots: ACTIVE_SPELL_SLOTS.length,
  };
}

/**
 * Lista los ítems contenedores de hechizos en el inventario del personaje.
 * @param {string|number} characterId
 * @returns {Promise<Array<{index: number, itemId: string, name: string, capacity: number, itemDef: object}>>}
 */
async function getSpellContainersInInventory(characterId) {
  const invList = await getInventoryList(characterId);
  const containers = [];

  for (const entry of invList) {
    const itemDef = getItem(entry.itemId);
    if (!itemDef) continue;

    const isContainerCat = (itemDef.categories || []).includes("spell_container");
    const containerMod = (itemDef.modules || {}).spellContainer;

    if (isContainerCat || containerMod) {
      const capacity = containerMod?.capacity || CONTAINER_CAPACITIES[entry.itemId] || 4;
      containers.push({
        index: entry.index,
        itemId: entry.itemId,
        name: itemDef.name,
        quantity: entry.quantity,
        capacity,
        itemDef,
      });
    }
  }

  return containers;
}

/**
 * Equipa un hechizo en una de las 4 ranuras activas de combate.
 * Validando capacidad del contenedor equipado y coste por Tier.
 * @param {object} options
 * @param {string|number} options.characterId
 * @param {string} options.creatorId
 * @param {string} options.spellId - ID del hechizo a equipar
 * @param {string} [options.slot] - Slot específico (spell_1..spell_4)
 * @returns {Promise<{equipped: string, slot: string, autoUnequipped: string[]}>}
 */
async function equipActiveSpell({ characterId, creatorId, spellId, slot }) {
  const itemDef = getItem(spellId);
  if (!itemDef) {
    throw new Error(`El hechizo/habilidad "${spellId}" no existe en el catálogo.`);
  }

  const isSpell = (itemDef.categories || []).includes("spell") || itemDef.modules?.spell;
  if (!isSpell) {
    throw new Error(`El ítem "${itemDef.name}" no es un hechizo ni habilidad equipable.`);
  }

  const details = getSpellDetails(spellId);
  const spellTier = details?.tier || itemDef.tier || "E";
  const requiredSlots = getSpellSlotCost(spellTier);

  // Verificar capacidad del contenedor equipado
  const container = await getEquippedContainer(characterId);
  const { slots } = await getActiveSpells(characterId);

  let targetSlot = slot ? String(slot).toLowerCase() : null;
  if (targetSlot && /^[1-4]$/.test(targetSlot)) {
    targetSlot = `spell_${targetSlot}`;
  }

  if (!targetSlot) {
    targetSlot = ACTIVE_SPELL_SLOTS.find((s) => !slots[s]) || "spell_1";
  }

  if (!ACTIVE_SPELL_SLOTS.includes(targetSlot)) {
    throw new Error(`Slot de hechizo inválido: "${targetSlot}". Ranuras válidas: ${ACTIVE_SPELL_SLOTS.join(", ")}`);
  }

  // Si reemplaza un hechizo existente en targetSlot, recuperar su coste
  const existingSpellId = slots[targetSlot];
  let freeCapAfterReplace = container.freeSlots;
  if (existingSpellId) {
    const existingDetails = getSpellDetails(existingSpellId);
    const existingCost = getSpellSlotCost(existingDetails?.tier);
    freeCapAfterReplace += existingCost;
  }

  if (requiredSlots > freeCapAfterReplace) {
    throw new Error(
      `Capacidad insuficiente en tu contenedor equipado "${container.name}". Un hechizo Tier ${spellTier} requiere ${requiredSlots} slots (disponibles: ${freeCapAfterReplace}/${container.capacity}).`,
    );
  }

  return await equipmentService.equipItem({
    characterId,
    creatorId,
    itemId: spellId,
    slot: targetSlot,
  });
}

/**
 * Desequipa un hechizo activo de una ranura.
 * @param {object} options
 * @param {string|number} options.characterId
 * @param {string} options.creatorId
 * @param {string} options.target - Slot (spell_1..spell_4) o spellId
 * @returns {Promise<{unequipped: string|null, slot: string}>}
 */
async function unequipActiveSpell({ characterId, creatorId, target }) {
  const t = String(target || "").toLowerCase();
  const { slots } = await getActiveSpells(characterId);

  let targetSlot;
  if (ACTIVE_SPELL_SLOTS.includes(t)) {
    targetSlot = t;
  } else if (/^[1-4]$/.test(t)) {
    targetSlot = `spell_${t}`;
  } else {
    // Buscar por spellId
    targetSlot = ACTIVE_SPELL_SLOTS.find((s) => slots[s] === t) || null;
  }

  if (!targetSlot || !slots[targetSlot]) {
    throw new Error(`No hay ningún hechizo activo en la ranura solicitada ("${target}").`);
  }

  return await equipmentService.unequipItem({
    characterId,
    creatorId,
    slot: targetSlot,
  });
}

/**
 * Formatea los detalles técnicos de una definición de hechizo.
 * @param {string} spellId
 * @returns {{id: string, name: string, description: string, tier: string, kind: string, application: string, nature: string, fulgorCost: number, castTime: number, cooldown: number, range: number, baseDamage: number, damageNature: string, effects: Array<any>, isPassive: boolean}|null}
 */
function getSpellDetails(spellId) {
  const itemDef = getItem(spellId);
  if (!itemDef) return null;

  const mod = itemDef.modules?.spell || {};
  return {
    id: itemDef.id,
    name: itemDef.name,
    description: itemDef.description || "Sin descripción",
    tier: itemDef.tier || mod.tier || "E",
    kind: mod.kind || itemDef.kind || "proyectil",
    application: mod.application || itemDef.application || "externa",
    nature: mod.nature || itemDef.nature || "fuego",
    fulgorCost: mod.fulgorCost ?? itemDef.fulgorCost ?? 0,
    castTime: mod.castTime ?? itemDef.castTime ?? 1,
    cooldown: mod.cooldown ?? itemDef.cooldown ?? 0,
    range: mod.range ?? itemDef.range ?? 3,
    baseDamage: mod.baseDamage ?? itemDef.baseDamage ?? 0,
    damageNature: mod.damageNature || "mágico",
    effects: mod.effects || itemDef.effects || [],
    isPassive: (mod.kind === "buffo" || mod.kind === "aura") && mod.application === "propia",
  };
}

module.exports = {
  CONTAINER_CAPACITIES,
  ACTIVE_SPELL_SLOTS,
  getSpellSlotCost,
  getEquippedContainer,
  getActiveSpells,
  getSpellContainersInInventory,
  equipActiveSpell,
  unequipActiveSpell,
  getSpellDetails,
};

