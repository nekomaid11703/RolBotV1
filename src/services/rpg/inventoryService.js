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
const { createItemDefinition } = require("./itemFactory");

/**
 * Tipos cuyas instancias portan durabilidad/metadata derivada en `inventory.metadata`.
 * @constant EQUIPABLE_TYPES
 * @type {string[]}
 */
const EQUIPABLE_TYPES = ["weapon", "armor", "artifact"];

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
    .select("item_id, quantity, metadata")
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
 * @returns {Promise<*>} Resultado con itemId, quantity y total
 */
async function addItem(characterId, creatorId, itemId, quantity = 1) {
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
    const existing = inv.find((row) => row.item_id === itemId);

    if (!existing && inv.length >= MAX_INVENTORY_SIZE) {
      throw new Error(`Inventario lleno (máx. ${MAX_INVENTORY_SIZE} tipos de items distintos).`);
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
       * @constant payload
       */
      const payload = filterExisting("inventory", { quantity: newQty, updated_at: new Date().toISOString() });
      const { error } = await supabase
        .from("inventory")
        .update(payload)
        .eq("character_id", characterId)
        .eq("item_id", itemId);

      if (error) throw new Error(`Error actualizando inventario: ${error.message}`);
    } else {
      /**
       * @constant metadata
       */
      const metadata = seedItemMetadata(item);
      /**
       * @constant payload
       */
      const payload = filterExisting("inventory", {
        character_id: characterId,
        item_id: itemId,
        quantity: safeQty,
        ...(metadata ? { metadata } : {}),
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
    const existing = inv.find((row) => row.item_id === itemId);

    if (!existing || existing.quantity < safeQty) {
      throw new Error(`No tienes suficientes "${itemId}".`);
    }

    /**
     * @constant newQty
     */
    const newQty = existing.quantity - safeQty;

    if (newQty <= 0) {
      const { error } = await supabase.from("inventory").delete().eq("character_id", characterId).eq("item_id", itemId);

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
  /**
   * @constant testItems
   * @type {*[]}
   */
  const testItems = ["venda", "pocion", "tonico", "antidoto"];
  /**
   * @constant inv
   */
  const inv = await getInventory(characterId);
  /**
   * @constant existingIds
   * @type {Set}
   */
  const existingIds = new Set(inv.map((row) => row.item_id));
  /**
   * @constant added
   * @type {*[]}
   */
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
  /**
   * @constant tempItems
   * @type {*[]}
   */
  const tempItems = ["venda_temp", "pocion_temp", "tonico_temp"];
  /**
   * @constant inv
   */
  const inv = await getInventory(characterId);
  /**
   * @constant existingIds
   * @type {Set}
   */
  const existingIds = new Set(inv.map((row) => row.item_id));
  /**
   * @constant added
   * @type {*[]}
   */
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
 * Ítems de la Familia del Hierro que se siembran al retar al dummy para probar
 * equipo real (arma, set de armadura, artefacto y arrojadiza).
 * @constant IRON_FAMILY_KIT
 * @type {Array<[string, number]>}
 */
const IRON_FAMILY_KIT = [
  ["espada_de_hierro", 1],
  ["casco_de_hierro", 1],
  ["pechera_de_hierro", 1],
  ["grebas_de_hierro", 1],
  ["botas_de_hierro", 1],
  ["amuleto_de_hierro", 1],
  ["kunai_de_hierro", 5],
];

/**
 * Asegura que un personaje tenga la Familia del Hierro en el inventario.
 * @param {string|number} characterId - ID del personaje
 * @param {string} creatorId - ID del creador/usuario
 * @returns {Promise<string[]>} Lista de items añadidos
 */
async function ensureIronFamilyKit(characterId, creatorId) {
  const inv = await getInventory(characterId);
  const existingIds = new Set(inv.map((row) => row.item_id));
  const added = [];

  for (const [itemId, qty] of IRON_FAMILY_KIT) {
    if (!existingIds.has(itemId)) {
      try {
        await addItem(characterId, creatorId, itemId, qty);
        added.push(itemId);
      } catch (err) {
        logError({ source: "inventoryService.ensureIronFamilyKit", error: err, characterId, itemId });
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
  /**
   * @constant inv
   */
  const inv = await getInventory(characterId);
  /**
   * @constant toRemove
   * @type {*[]}
   */
  const toRemove = [];

  for (const entry of inv) {
    /**
     * @constant item
     */
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

module.exports = {
  getInventory,
  getInventoryList,
  addItem,
  removeItem,
  useItem,
  clearInventory,
  ensureTestKit,
  ensureTempTestKit,
  ensureIronFamilyKit,
  cleanupTemporalItems,
};
