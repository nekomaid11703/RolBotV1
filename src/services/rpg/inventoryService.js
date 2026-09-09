// @ts-nocheck
const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { invalidateUserCache } = require("../../utils/safeQuery");
const { logError } = require("../loggerService");
const { getItem } = require("../../data/items");
const { getActiveCharacter, setHp } = require("../characterService");
const { MAX_STACK_SIZE } = require("../../config/inventoryConfig");
const { parseQuantity } = require("../../utils/quantityUtils");
const { createItem } = require("./itemService");
const { setCooldown } = require("./statusService");
const { createItemDefinition } = require("./itemFactory");
const { randomUUID } = require("crypto");

/**
 * Tipos cuyas instancias portan durabilidad/metadata derivada en `inventory.metadata`.
 * @constant EQUIPABLE_TYPES
 * @type {string[]}
 */
const EQUIPABLE_TYPES = ["weapon", "armor", "artifact"];
const INSTANCE_ITEM_TYPES = ["weapon", "armor", "artifact", "shield", "focus", "spell_container"];

function getVariantKey(item, metadata, variantKey) {
  if (variantKey) return variantKey;
  if (metadata?.variantKey) return metadata.variantKey;
  if ((item.categories || []).some((category) => INSTANCE_ITEM_TYPES.includes(category)))
    return `instance:${randomUUID()}`;
  if ((item.categories || []).includes("material")) return `tier:${metadata?.tier || "E"}`;
  return metadata?.tier ? `tier:${metadata.tier}` : "legacy";
}

async function validateInventoryAdditions(characterId, additions) {
  const inventory = await getInventory(characterId);
  const maxSlots = await getMaxInventoryCapacity(characterId);
  const stacks = new Map(
    inventory.map((entry) => [`${entry.item_id}:${entry.variant_key || "legacy"}`, Number(entry.quantity) || 0]),
  );

  for (const addition of additions) {
    const item = getItem(addition.itemId);
    if (!item) return { ok: false, error: `El ítem "${addition.itemId}" no existe.` };
    const variantKey = getVariantKey(item, addition.metadata);
    const key = `${addition.itemId}:${variantKey}`;
    const current = stacks.get(key) || 0;
    const quantity = parseQuantity(addition.quantity);
    if (current + quantity > MAX_STACK_SIZE) {
      return { ok: false, error: `No hay espacio para ${item.name}: el stack máximo es ${MAX_STACK_SIZE}.` };
    }
    stacks.set(key, current + quantity);
  }

  if (stacks.size > maxSlots) {
    return {
      ok: false,
      error: `Tu mochila no tiene espacio para todo el botín (${inventory.length}/${maxSlots} ranuras).`,
    };
  }
  return { ok: true };
}

/**
 * Se lanza metadata inicial de un ítem equipable a partir de su definición.
 * Defensivo: si el catálogo no expone tipo o falla la derivación, devuelve null
 * (no rompe el alta, se mantiene backward-compat).
 * @param {object} item - ItemDef del catálogo (con categories/modules)
 * @returns {object|null} metadata inicial o null
 */
function seedItemMetadata(item) {
  if (!item || !Array.isArray(item.categories)) return null;
  const type = item.categories[0];
  if (!EQUIPABLE_TYPES.includes(type)) return null;
  try {
    const def = createItemDefinition({ ...item, id: item.id, type });
    return def.metadata || null;
  } catch {
    return null;
  }
}

/**
 * @constant characterLocks
 * @type {Map<*, *>}
 */
const characterLocks = new Map();

/**
 * Ejecuta una función con un lock exclusivo por personaje para evitar condiciones de carrera.
 * @param {object} options
 * @param {object} options
 * @param {*} characterId
 * @param {*} fn
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
    .select("item_id, variant_key, quantity, metadata")
    .eq("character_id", characterId)
    .order("item_id", { ascending: true });

  if (error) {
    logError({ source: "inventoryService.getInventory", error });
    return [];
  }

  return data || [];
}

/**
 * Lista el inventario en orden con índice 1-based y datos del catálogo,
 * lista para mostrar numerado y para resolver ítems por posición.
 * @param {string|number} characterId - ID del personaje
 * @returns {Promise<Array<{index: number, itemId: string, name: string, quantity: number, metadata: object, categories: string[], modules: object}>>}
 */
async function getInventoryList(characterId) {
  const inv = await getInventory(characterId);
  return inv.map((entry, i) => {
    const def = getItem(entry.item_id);
    return {
      index: i + 1,
      itemId: entry.item_id,
      variantKey: entry.variant_key || "legacy",
      name: def?.name || entry.item_id,
      quantity: entry.quantity,
      metadata: entry.metadata || {},
      categories: def?.categories || [],
      modules: def?.modules || {},
    };
  });
}

/**
 * Añade un item al inventario de un personaje con control de límites.
 * @param {string|number} characterId - ID del personaje
 * @param {string} creatorId - ID del creador/usuario
 * @param {string} itemId - ID del item a añadir
 * @param {number} [quantity] - Cantidad a añadir
 * @param {object} [metadata=null] - Metadata adicional (ej: { tier: "E", crafted: true })
 * @returns {Promise<*>} Resultado con itemId, quantity y total
 */
async function addItem(characterId, creatorId, itemId, quantity = 1, metadata = null, variantKey = null) {
  return withCharacterLock(characterId, async () => {
    /**
     * @constant safeQty
     */
    const safeQty = parseQuantity(quantity);

    /**
     * @constant item
     */
    const item = getItem(itemId);
    if (!item) throw new Error(`El ítem "${itemId}" no existe.`);

    /**
     * @constant inv
     */
    const inv = await getInventory(characterId);
    /**
     * @constant existing
     */
    const resolvedVariantKey = getVariantKey(item, metadata, variantKey);
    const existing = inv.find((row) => row.item_id === itemId && (row.variant_key || "legacy") === resolvedVariantKey);

    // Límite dinámico según nivel de mochila (20 base + 2 por nivel adicional, máx 38-40)
    const charRes = await supabase.from("characters").select("slots").eq("id", characterId).maybeSingle();
    const mochilaLvl = charRes?.data?.slots?.tools?.mochila?.level || 1;
    const { getInventorySlotsByMochilaLevel } = require("../../config/toolsConfig");
    const currentMaxSlots = getInventorySlotsByMochilaLevel(mochilaLvl);

    if (!existing && inv.length >= currentMaxSlots) {
      throw new Error(
        `Inventario lleno (máx. ${currentMaxSlots} tipos de items distintos). Mejora tu mochila con /herramientas.`,
      );
    }

    if (existing) {
      if (existing.quantity + safeQty > MAX_STACK_SIZE) {
        throw new Error(`No puedes tener más de ${MAX_STACK_SIZE} unidades del mismo ítem por ranura.`);
      }
      /**
       * @constant newQty
       */
      const newQty = existing.quantity + safeQty;
      /**
       * @constant mergedMeta
       */
      const mergedMeta = metadata ? { ...(existing.metadata || {}), ...metadata } : existing.metadata || null;
      /**
       * @constant payload
       */
      const payload = filterExisting("inventory", {
        quantity: newQty,
        updated_at: new Date().toISOString(),
        ...(mergedMeta ? { metadata: mergedMeta } : {}),
      });
      const { error } = await supabase
        .from("inventory")
        .update(payload)
        .eq("character_id", characterId)
        .eq("item_id", itemId)
        .eq("variant_key", resolvedVariantKey);

      if (error) throw new Error(`Error actualizando inventario: ${error.message}`);
    } else {
      /**
       * @constant seedMeta
       */
      const seedMeta = seedItemMetadata(item);
      /**
       * @constant finalMeta
       */
      const finalMeta = metadata || seedMeta;
      /**
       * @constant payload
       */
      const payload = filterExisting("inventory", {
        character_id: characterId,
        item_id: itemId,
        variant_key: resolvedVariantKey,
        quantity: safeQty,
        ...(finalMeta ? { metadata: finalMeta } : {}),
      });
      const { error } = await supabase.from("inventory").insert(payload);

      if (error) throw new Error(`Error añadiendo ítem: ${error.message}`);
    }

    invalidateUserCache(creatorId);
    return {
      itemId,
      variantKey: resolvedVariantKey,
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
async function removeItem(characterId, creatorId, itemId, quantity = 1, variantKey = "legacy") {
  return withCharacterLock(characterId, async () => {
    /**
     * @constant safeQty
     */
    const safeQty = parseQuantity(quantity);

    /**
     * @constant inv
     */
    const inv = await getInventory(characterId);
    /**
     * @constant existing
     */
    const existing = inv.find((row) => row.item_id === itemId && (row.variant_key || "legacy") === variantKey);

    if (!existing || existing.quantity < safeQty) {
      throw new Error(`No tienes suficientes "${itemId}".`);
    }

    /**
     * @constant newQty
     */
    const newQty = existing.quantity - safeQty;

    if (newQty <= 0) {
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("character_id", characterId)
        .eq("item_id", itemId)
        .eq("variant_key", variantKey);

      if (error) throw new Error(`Error eliminando ítem: ${error.message}`);
    } else {
      /**
       * @constant payload
       */
      const payload = filterExisting("inventory", { quantity: newQty, updated_at: new Date().toISOString() });
      const { error } = await supabase
        .from("inventory")
        .update(payload)
        .eq("character_id", characterId)
        .eq("item_id", itemId)
        .eq("variant_key", variantKey);

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
  /**
   * @constant character
   */
  const character = await getActiveCharacter({ creatorId });
  if (!character) throw new Error("No tienes un personaje activo.");

  /**
   * @constant itemDef
   */
  const itemDef = getItem(itemId);
  if (!itemDef) throw new Error(`El ítem "${itemId}" no existe.`);

  if (!(itemDef.categories || []).includes("consumable")) {
    throw new Error("Solo puedes usar ítems consumibles.");
  }

  return withCharacterLock(character.id, async () => {
    /**
     * @constant inv
     */
    const inv = await getInventory(character.id);
    /**
     * @constant entry
     */
    const entry = inv.find((row) => row.item_id === itemId);

    if (!entry || entry.quantity < 1) {
      throw new Error(`No tienes "${itemDef.name}" en tu inventario.`);
    }

    /**
     * @constant item
     */
    const item = createItem(itemId);
    /**
     * @constant results
     */
    const results = item.trigger("Use", { character, creatorId });

    /**
     * @constant healResult
     */
    const healResult = results.find((r) => r.type === "heal");
    /**
     * @constant healAmount
     */
    const healAmount = healResult?.result?.amount || 0;
    /**
     * @constant maxHp
     */
    const maxHp = (character.stats?.hp || 1) * 2;

    if (healAmount > 0 && character.hp_actual >= maxHp) {
      throw new Error("Tu personaje ya tiene la vida al máximo.");
    }

    /**
     * @constant payload
     */
    const payload = filterExisting("inventory", { quantity: entry.quantity - 1, updated_at: new Date().toISOString() });

    if (entry.quantity - 1 <= 0) {
      await supabase
        .from("inventory")
        .delete()
        .eq("character_id", character.id)
        .eq("item_id", itemId)
        .eq("variant_key", entry.variant_key || "legacy");
    } else {
      await supabase
        .from("inventory")
        .update(payload)
        .eq("character_id", character.id)
        .eq("item_id", itemId)
        .eq("variant_key", entry.variant_key || "legacy");
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
      modules: itemDef.modules || {},
      hpBefore,
      hpAfter,
    };
  });
}

/**
 * Elimina por completo todas las filas del inventario de un personaje.
 * @param {string|number} characterId - ID del personaje
 * @param {string} creatorId - ID del creador/usuario
 * @returns {Promise<{deletedCount: number}>}
 */
async function clearInventory(characterId, creatorId) {
  return withCharacterLock(characterId, async () => {
    const inv = await getInventory(characterId);
    const deletedCount = inv.reduce((acc, row) => acc + (row.quantity || 1), 0);

    if (inv.length > 0) {
      const { error } = await supabase.from("inventory").delete().eq("character_id", characterId);
      if (error) {
        throw new Error(`Error al vaciar inventario: ${error.message}`);
      }
    }

    invalidateUserCache(creatorId);
    return { deletedCount };
  });
}

/**
 * Obtiene la capacidad máxima de inventario de un personaje.
 * @param {string|number} characterId
 * @returns {Promise<number>}
 */
async function getMaxInventoryCapacity(characterId) {
  const { data } = await supabase.from("characters").select("slots").eq("id", characterId).maybeSingle();
  const mochilaLvl = data?.slots?.tools?.mochila?.level || 1;
  const { getInventorySlotsByMochilaLevel } = require("../../config/toolsConfig");
  return getInventorySlotsByMochilaLevel(mochilaLvl);
}

module.exports = {
  getInventory,
  getInventoryList,
  addItem,
  removeItem,
  useItem,
  clearInventory,
  getMaxInventoryCapacity,
  getVariantKey,
  validateInventoryAdditions,
};
