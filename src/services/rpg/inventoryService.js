// @ts-nocheck
const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { invalidateUserCache } = require("../../utils/safeQuery");
const { logError } = require("../loggerService");
const { getItem } = require("../../data/items");
const { getActiveCharacter, setHp } = require("../characterService");
const { MAX_INVENTORY_SIZE, MAX_STACK_SIZE } = require("../../config/inventoryConfig");
const { parseQuantity } = require("../../utils/quantityUtils");
const { createItem } = require("./itemService");
const { setCooldown } = require("./statusService");

const characterLocks = new Map();

/**
 * Ejecuta una función con un lock exclusivo por personaje para evitar condiciones de carrera.
 * @param {string|number} characterId - ID del personaje
 * @param {() => Promise<*>} fn - Función asíncrona a ejecutar bajo lock
 * @returns {Promise<*>} Resultado de la función ejecutada
 */
async function withCharacterLock(characterId, fn) {
  while (characterLocks.get(characterId)) {
    await new Promise((r) => {
      setTimeout(r, 10);
    });
  }
  characterLocks.set(characterId, true);
  try {
    return await fn();
  } finally {
    characterLocks.delete(characterId);
  }
}

/**
 * Obtiene el inventario de un personaje desde la base de datos.
 * @param {string|number} characterId - ID del personaje
 * @returns {Promise<Array<*>>} Lista de items en el inventario
 */
async function getInventory(characterId) {
  const { data, error } = await supabase
    .from("inventory")
    .select("item_id, quantity")
    .eq("character_id", characterId)
    .order("item_id", { ascending: true });

  if (error) {
    logError({ source: "inventoryService.getInventory", error });
    return [];
  }

  return data || [];
}

/**
 * Añade un item al inventario de un personaje con control de límites.
 * @param {string|number} characterId - ID del personaje
 * @param {string} creatorId - ID del creador/usuario
 * @param {string} itemId - ID del item a añadir
 * @param {number} [quantity] - Cantidad a añadir
 * @returns {Promise<*>} Resultado con itemId, quantity y total
 */
async function addItem(characterId, creatorId, itemId, quantity = 1) {
  return withCharacterLock(characterId, async () => {
    const safeQty = parseQuantity(quantity);

    const item = getItem(itemId);
    if (!item) throw new Error(`El ítem "${itemId}" no existe.`);

    const inv = await getInventory(characterId);
    const existing = inv.find((row) => row.item_id === itemId);

    if (!existing && inv.length >= MAX_INVENTORY_SIZE) {
      throw new Error(`Inventario lleno (máx. ${MAX_INVENTORY_SIZE} tipos de items distintos).`);
    }

    if (existing) {
      if (existing.quantity + safeQty > MAX_STACK_SIZE) {
        throw new Error(`No puedes tener más de ${MAX_STACK_SIZE} unidades del mismo ítem por ranura.`);
      }
      const newQty = existing.quantity + safeQty;
      const payload = filterExisting("inventory", { quantity: newQty, updated_at: new Date().toISOString() });
      const { error } = await supabase
        .from("inventory")
        .update(payload)
        .eq("character_id", characterId)
        .eq("item_id", itemId);

      if (error) throw new Error(`Error actualizando inventario: ${error.message}`);
    } else {
      const payload = filterExisting("inventory", {
        character_id: characterId,
        item_id: itemId,
        quantity: safeQty,
      });
      const { error } = await supabase.from("inventory").insert(payload);

      if (error) throw new Error(`Error añadiendo ítem: ${error.message}`);
    }

    invalidateUserCache(creatorId);
    return {
      itemId,
      quantity: safeQty,
      total: existing ? existing.quantity + safeQty : safeQty,
    };
  });
}

/**
 * Elimina una cantidad de un item del inventario de un personaje.
 * @param {string|number} characterId - ID del personaje
 * @param {string} creatorId - ID del creador/usuario
 * @param {string} itemId - ID del item a eliminar
 * @param {number} [quantity] - Cantidad a eliminar
 * @returns {Promise<*>} Resultado con itemId, removed y remaining
 */
async function removeItem(characterId, creatorId, itemId, quantity = 1) {
  return withCharacterLock(characterId, async () => {
    const safeQty = parseQuantity(quantity);

    const inv = await getInventory(characterId);
    const existing = inv.find((row) => row.item_id === itemId);

    if (!existing || existing.quantity < safeQty) {
      throw new Error(`No tienes suficientes "${itemId}".`);
    }

    const newQty = existing.quantity - safeQty;

    if (newQty <= 0) {
      const { error } = await supabase.from("inventory").delete().eq("character_id", characterId).eq("item_id", itemId);

      if (error) throw new Error(`Error eliminando ítem: ${error.message}`);
    } else {
      const payload = filterExisting("inventory", { quantity: newQty, updated_at: new Date().toISOString() });
      const { error } = await supabase
        .from("inventory")
        .update(payload)
        .eq("character_id", characterId)
        .eq("item_id", itemId);

      if (error) throw new Error(`Error actualizando cantidad: ${error.message}`);
    }

    invalidateUserCache(creatorId);
    return { itemId, removed: safeQty, remaining: Math.max(0, newQty) };
  });
}

/**
 * Usa un item consumible del inventario del personaje activo.
 * @param {string} creatorId - ID del creador/usuario
 * @param {string} itemId - ID del item a usar
 * @returns {Promise<*>} Resultado del uso del item con efectos aplicados
 */
async function useItem(creatorId, itemId) {
  const character = await getActiveCharacter({ creatorId });
  if (!character) throw new Error("No tienes un personaje activo.");

  const itemDef = getItem(itemId);
  if (!itemDef) throw new Error(`El ítem "${itemId}" no existe.`);

  if (!(itemDef.categories || []).includes("consumable")) {
    throw new Error("Solo puedes usar ítems consumibles.");
  }

  return withCharacterLock(character.id, async () => {
    const inv = await getInventory(character.id);
    const entry = inv.find((row) => row.item_id === itemId);

    if (!entry || entry.quantity < 1) {
      throw new Error(`No tienes "${itemDef.name}" en tu inventario.`);
    }

    const item = createItem(itemId);
    const results = item.trigger("Use", { character, creatorId });

    const healResult = results.find((r) => r.type === "heal");
    const healAmount = healResult?.result?.amount || 0;
    const maxHp = (character.stats?.hp || 1) * 2;

    if (healAmount > 0 && character.hp_actual >= maxHp) {
      throw new Error("Tu personaje ya tiene la vida al máximo.");
    }

    const payload = filterExisting("inventory", { quantity: entry.quantity - 1, updated_at: new Date().toISOString() });

    if (entry.quantity - 1 <= 0) {
      await supabase.from("inventory").delete().eq("character_id", character.id).eq("item_id", itemId);
    } else {
      await supabase.from("inventory").update(payload).eq("character_id", character.id).eq("item_id", itemId);
    }

    let hpBefore = character.hp_actual;
    let hpAfter = character.hp_actual;

    for (const { type, result } of results) {
      if (type === "heal" && result?.amount > 0) {
        hpAfter = Math.min(maxHp, character.hp_actual + result.amount);
        await setHp({ creatorId, characterName: character.name, hp: hpAfter });
      }
      if (type === "buff" && result) {
        const { addEffect } = require("./statusService");
        await addEffect(character, result);
      }
    }

    await setCooldown(character, itemId);
    invalidateUserCache(creatorId);

    return {
      characterId: character.id,
      itemName: itemDef.name,
      icon: itemDef.icon,
      modules: itemDef.modules || {},
      hpBefore,
      hpAfter,
    };
  });
}

/**
 * Asegura que un personaje tenga los items de prueba básicos en su inventario.
 * @param {string|number} characterId - ID del personaje
 * @param {string} creatorId - ID del creador/usuario
 * @returns {Promise<string[]>} Lista de items añadidos
 */
async function ensureTestKit(characterId, creatorId) {
  const testItems = ["venda", "pocion", "tonico", "antidoto"];
  const inv = await getInventory(characterId);
  const existingIds = new Set(inv.map((row) => row.item_id));
  const added = [];

  for (const itemId of testItems) {
    if (!existingIds.has(itemId)) {
      try {
        await addItem(characterId, creatorId, itemId, 1);
        added.push(itemId);
      } catch (err) {
        logError({ source: "inventoryService.ensureTestKit", error: err, characterId, itemId });
      }
    }
  }

  return added;
}

/**
 * Asegura que un personaje tenga los items temporales de prueba.
 * @param {string|number} characterId - ID del personaje
 * @param {string} creatorId - ID del creador/usuario
 * @returns {Promise<string[]>} Lista de items temporales añadidos
 */
async function ensureTempTestKit(characterId, creatorId) {
  const tempItems = ["venda_temp", "pocion_temp", "tonico_temp"];
  const inv = await getInventory(characterId);
  const existingIds = new Set(inv.map((row) => row.item_id));
  const added = [];

  for (const itemId of tempItems) {
    if (!existingIds.has(itemId)) {
      try {
        await addItem(characterId, creatorId, itemId, 3);
        added.push(itemId);
      } catch (err) {
        logError({ source: "inventoryService.ensureTempTestKit", error: err, characterId, itemId });
      }
    }
  }

  return added;
}

/**
 * Limpia los items temporales del inventario de un personaje.
 * @param {string|number} characterId - ID del personaje
 * @returns {Promise<string[]>} Lista de items temporales eliminados
 */
async function cleanupTemporalItems(characterId) {
  const inv = await getInventory(characterId);
  const toRemove = [];

  for (const entry of inv) {
    const item = createItem(entry.item_id);
    if (item && item.modules.some((m) => m.constructor.type === "temporal")) {
      toRemove.push(entry.item_id);
    }
  }

  if (toRemove.length === 0) return [];

  const { error } = await supabase.from("inventory").delete().eq("character_id", characterId).in("item_id", toRemove);

  if (error) {
    logError({ source: "inventoryService.cleanupTemporalItems", error, characterId });
  }

  return toRemove;
}

module.exports = {
  getInventory,
  addItem,
  removeItem,
  useItem,
  ensureTestKit,
  ensureTempTestKit,
  cleanupTemporalItems,
};
