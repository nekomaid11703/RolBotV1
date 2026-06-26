const { supabase } = require('../../database/supabase');
const { getItem, isEquippable, getEquipSlot, getMaxWeight } = require('./items');
const { getActiveCharacter, updateCharacterStats } = require('../characterService');
const { logSystem, logError } = require('../loggerService');

const SESSION_ID = 'inventory';

const EQUIP_BONUSES_CACHE = new Map();

const EQUIPPABLE_SLOTS = ['arma', 'cabeza', 'cuello', 'pecho', 'espalda',
  'brazo_izq', 'brazo_der', 'mano_izq', 'mano_der',
  'pierna_izq', 'pierna_der', 'pie_izq', 'pie_der',
  'accesorio_1', 'accesorio_2'];

function emptyInventory() {
  return {
    items: [],
    equipped: {},
    capacityBase: 50,
    capacityBonus: 0,
  };
}

async function getInventory(playerId) {
  try {
    const { data, error } = await supabase
      .from('bot_auth_state')
      .select('data')
      .eq('session_id', SESSION_ID)
      .eq('id', playerId)
      .single();

    if (error || !data) return emptyInventory();
    return data.data || emptyInventory();
  } catch {
    return emptyInventory();
  }
}

async function saveInventory(playerId, inv) {
  try {
    const { error } = await supabase.from('bot_auth_state').upsert({
      session_id: SESSION_ID,
      id: playerId,
      data: inv,
    });
    if (error) {
      logError({ source: 'inventoryService', error });
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    logError({ source: 'inventoryService', error: err });
    return { success: false, error: err.message };
  }
}

async function addItem(playerId, itemId, quantity = 1) {
  try {
    const inv = await getInventory(playerId);
    const item = getItem(itemId);
    if (!item) return { error: `Item "${itemId}" no encontrado.` };

    const existing = inv.items.find(i => i.itemId === itemId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      inv.items.push({ itemId, quantity });
    }

    const pesoActual = getUsedWeight(inv);
    const maxPeso = getCapacity(inv);
    if (pesoActual > maxPeso) {
      return { error: `No puedes cargar más peso (${pesoActual}/${maxPeso}). Suelta algo primero.` };
    }

    const saveResult = await saveInventory(playerId, inv);
    if (!saveResult.success) return { error: 'Error de base de datos al guardar inventario.' };
    return { success: true, inv };
  } catch (err) {
    return { error: `Error inesperado al añadir item: ${err.message}` };
  }
}

async function removeItem(playerId, itemId, quantity = 1) {
  try {
    const inv = await getInventory(playerId);
    const existing = inv.items.find(i => i.itemId === itemId);
    if (!existing || existing.quantity < quantity) {
      return { error: `No tienes suficiente "${itemId}".` };
    }

    existing.quantity -= quantity;
    if (existing.quantity <= 0) {
      inv.items = inv.items.filter(i => i.itemId !== itemId);
    }

    const saveResult = await saveInventory(playerId, inv);
    if (!saveResult.success) return { error: 'Error de base de datos al guardar inventario.' };
    return { success: true, inv };
  } catch (err) {
    return { error: `Error inesperado al remover item: ${err.message}` };
  }
}

async function equipItem(playerId, itemId) {
  try {
    const inv = await getInventory(playerId);
    const item = getItem(itemId);
    if (!item) return { error: `Item "${itemId}" no encontrado.` };
    if (!isEquippable(item)) return { error: `"${item.name}" no es equipable.` };

    const stack = inv.items.find(i => i.itemId === itemId);
    if (!stack || stack.quantity < 1) return { error: `No tienes "${item.name}".` };

    const slot = getEquipSlot(item);
    const prevItemId = inv.equipped[slot];
    if (prevItemId && prevItemId !== itemId) {
      const prevStack = inv.items.find(i => i.itemId === prevItemId);
      if (prevStack) prevStack.quantity += 1;
      else inv.items.push({ itemId: prevItemId, quantity: 1 });
    }

    inv.equipped[slot] = itemId;

    stack.quantity -= 1;
    if (stack.quantity <= 0) {
      inv.items = inv.items.filter(i => i.itemId !== itemId);
    }

    const saveResult = await saveInventory(playerId, inv);
    if (!saveResult.success) return { error: 'Error de base de datos al guardar inventario.' };
    invalidateEquipmentCache(playerId);
    return { success: true, slot, item, inv };
  } catch (err) {
    return { error: `Error inesperado al equipar item: ${err.message}` };
  }
}

async function unequipItem(playerId, slot) {
  try {
    const inv = await getInventory(playerId);
    const itemId = inv.equipped[slot];
    if (!itemId) return { error: `No hay nada equipado en "${slot}".` };

    const item = getItem(itemId);
    inv.equipped[slot] = null;

    const existing = inv.items.find(i => i.itemId === itemId);
    if (existing) existing.quantity += 1;
    else inv.items.push({ itemId, quantity: 1 });

    const saveResult = await saveInventory(playerId, inv);
    if (!saveResult.success) return { error: 'Error de base de datos al guardar inventario.' };
    invalidateEquipmentCache(playerId);
    return { success: true, item, inv };
  } catch (err) {
    return { error: `Error inesperado al desequipar item: ${err.message}` };
  }
}

function invalidateEquipmentCache(playerId) {
  EQUIP_BONUSES_CACHE.delete(playerId);
}

async function calculateEquipmentBonuses(playerId) {
  if (EQUIP_BONUSES_CACHE.has(playerId)) {
    return EQUIP_BONUSES_CACHE.get(playerId);
  }

  const inv = await getInventory(playerId);
  const bonuses = {};

  for (const [slot, itemId] of Object.entries(inv.equipped)) {
    if (!itemId) continue;
    const item = getItem(itemId);
    if (item && item.stats) {
      for (const [stat, val] of Object.entries(item.stats)) {
        bonuses[stat] = (bonuses[stat] || 0) + val;
      }
    }
  }

  EQUIP_BONUSES_CACHE.set(playerId, bonuses);
  return bonuses;
}

async function applyEquipmentBonuses(playerId) {
  try {
    const bonuses = await calculateEquipmentBonuses(playerId);
    const character = await getActiveCharacter({ creatorId: playerId });
    if (!character) {
      logError({ source: 'inventoryService.applyEquipmentBonuses', error: new Error(`No active character for player ${playerId}`) });
      return;
    }

    const currentStats = character.stats || {};
    const newStats = { ...currentStats, equipmentBonuses: bonuses };
    await updateCharacterStats({
      creatorId: playerId,
      characterName: character.slug || character.name,
      patch: { stats: newStats },
    });
  } catch (err) {
    logError({ source: 'inventoryService', error: err });
  }
}

async function recalcStatsAfterEquip(playerId) {
  await applyEquipmentBonuses(playerId);
}

function getUsedWeight(inv) {
  let total = 0;
  for (const stack of inv.items) {
    const item = getItem(stack.itemId);
    if (item) total += (item.peso || 0) * stack.quantity;
  }
  for (const [slot, itemId] of Object.entries(inv.equipped || {})) {
    if (!itemId) continue;
    const item = getItem(itemId);
    if (item && slot !== 'arma') total += (item.peso || 0);
  }
  return Math.round(total * 10) / 10;
}

function getCapacity(inv) {
  return (inv.capacityBase || 50) + (inv.capacityBonus || 0);
}

function getItemCount(inv, itemId) {
  const stack = inv.items.find(i => i.itemId === itemId);
  return stack ? stack.quantity : 0;
}

async function getEquipped(playerId) {
  const inv = await getInventory(playerId);
  const result = {};
  for (const [slot, itemId] of Object.entries(inv.equipped)) {
    if (itemId) result[slot] = getItem(itemId);
  }
  return result;
}

async function getEquippedInSlot(playerId, slot) {
  const inv = await getInventory(playerId);
  const itemId = inv.equipped[slot];
  if (!itemId) return null;
  return getItem(itemId);
}

async function damageEquippedItem(playerId, slot, damage = 1) {
  try {
    const inv = await getInventory(playerId);
    const itemId = inv.equipped[slot];
    if (!itemId) return null;

    const item = getItem(itemId);
    if (!item || item.resistencia === undefined) return null;

    let stack = inv.items.find(i => i.itemId === itemId);
    if (!stack) return null;

    const currentDur = stack.durability !== undefined ? stack.durability : item.resistencia;
    const newDur = Math.max(0, currentDur - damage);
    stack.durability = newDur;

    if (newDur <= 0) {
      inv.equipped[slot] = null;
      inv.items = inv.items.filter(i => i.itemId !== itemId);
      const saveResult = await saveInventory(playerId, inv);
      invalidateEquipmentCache(playerId);
      if (!saveResult.success) return { broken: true, item, saveError: true };
      return { broken: true, item };
    }

    const saveResult = await saveInventory(playerId, inv);
    invalidateEquipmentCache(playerId);
    if (!saveResult.success) return { broken: false, item, durability: newDur, maxDurability: item.resistencia, saveError: true };
    return { broken: false, item, durability: newDur, maxDurability: item.resistencia };
  } catch (err) {
    return { error: `Error inesperado al dañar item: ${err.message}` };
  }
}

module.exports = {
  getInventory,
  saveInventory,
  addItem,
  removeItem,
  equipItem,
  unequipItem,
  calculateEquipmentBonuses,
  applyEquipmentBonuses,
  recalcStatsAfterEquip,
  getUsedWeight,
  getCapacity,
  getItemCount,
  getEquipped,
  getEquippedInSlot,
  damageEquippedItem,
  invalidateEquipmentCache,
  EQUIPPABLE_SLOTS,
};
