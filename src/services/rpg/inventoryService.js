// @ts-nocheck
const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { invalidateUserCache } = require("../../utils/safeQuery");
const { logError } = require("../loggerService");
const { getItem } = require("../../data/items");
const { getActiveCharacter, setHp } = require("../characterService");
const { MAX_INVENTORY_SIZE, MAX_STACK_SIZE } = require("../../config/inventoryConfig");
const { HP_MAX } = require("../../config/characterConfig");

const characterLocks = new Map();

/**
 *
 * @param characterId
 * @param fn
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
 *
 * @param characterId
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
 *
 * @param characterId
 * @param itemId
 * @param quantity
 */
async function addItem(characterId, itemId, quantity = 1) {
  return withCharacterLock(characterId, async () => {
    const safeQty = Math.max(1, Math.floor(Number(quantity) || 1));

    const item = getItem(itemId);
    if (!item) throw new Error(`El ítem "${itemId}" no existe.`);

    const inv = await getInventory(characterId);
    const totalItems = inv.reduce((acc, row) => acc + row.quantity, 0);
    const existing = inv.find((row) => row.item_id === itemId);

    const newTotal = existing ? totalItems : totalItems + safeQty;

    if (newTotal > MAX_INVENTORY_SIZE) {
      throw new Error(`Inventario lleno (máx. ${MAX_INVENTORY_SIZE} slots ocupados).`);
    }

    if (existing) {
      const newQty = Math.min(existing.quantity + safeQty, MAX_STACK_SIZE);
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

    invalidateUserCache(characterId);
    return {
      itemId,
      quantity: safeQty,
      total: existing ? Math.min(existing.quantity + safeQty, MAX_STACK_SIZE) : safeQty,
    };
  });
}

/**
 *
 * @param characterId
 * @param itemId
 * @param quantity
 */
async function removeItem(characterId, itemId, quantity = 1) {
  return withCharacterLock(characterId, async () => {
    const safeQty = Math.max(1, Math.floor(Number(quantity) || 1));

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

    invalidateUserCache(characterId);
    return { itemId, removed: safeQty, remaining: Math.max(0, newQty) };
  });
}

/**
 *
 * @param creatorId
 * @param itemId
 */
async function useItem(creatorId, itemId) {
  const character = await getActiveCharacter({ creatorId });
  if (!character) throw new Error("No tienes un personaje activo.");

  const item = getItem(itemId);
  if (!item) throw new Error(`El ítem "${itemId}" no existe.`);

  if (item.category !== "consumable") {
    throw new Error("Solo puedes usar ítems consumibles.");
  }

  return withCharacterLock(character.id, async () => {
    const inv = await getInventory(character.id);
    const entry = inv.find((row) => row.item_id === itemId);

    if (!entry || entry.quantity < 1) {
      throw new Error(`No tienes "${item.name}" en tu inventario.`);
    }

    const { findSessionByCharacter } = require("./combatState");
    const activeCombat = findSessionByCharacter(character.id);

    const currentHp = activeCombat
      ? activeCombat.challenger.characterId === character.id
        ? activeCombat.challenger.hp
        : activeCombat.defender.hp
      : character.hp_actual;

    if (currentHp >= HP_MAX && item.healHp > 0) {
      throw new Error("Tu personaje ya tiene la vida al máximo.");
    }

    const newHp = Math.min(HP_MAX, currentHp + item.healHp);

    const payload = filterExisting("inventory", { quantity: entry.quantity - 1, updated_at: new Date().toISOString() });

    if (entry.quantity - 1 <= 0) {
      await supabase.from("inventory").delete().eq("character_id", character.id).eq("item_id", itemId);
    } else {
      await supabase.from("inventory").update(payload).eq("character_id", character.id).eq("item_id", itemId);
    }

    await setHp({ creatorId, characterName: character.name, hp: newHp });

    if (activeCombat) {
      if (activeCombat.challenger.characterId === character.id) {
        activeCombat.challenger.hp = newHp;
      } else {
        activeCombat.defender.hp = newHp;
      }
    }

    invalidateUserCache(creatorId);

    return {
      itemName: item.name,
      icon: item.icon,
      healHp: item.healHp,
      hpBefore: currentHp,
      hpAfter: newHp,
    };
  });
}

/**
 *
 * @param characterId
 */
async function ensureTestKit(characterId) {
  const testItems = ["venda", "pocion", "tonico", "antidoto"];
  const inv = await getInventory(characterId);
  const existingIds = new Set(inv.map((row) => row.item_id));

  for (const itemId of testItems) {
    if (!existingIds.has(itemId)) {
      try {
        await addItem(characterId, itemId, 1);
      } catch (_err) {
        logError({ source: "inventoryService.ensureTestKit", error: _err });
      }
    }
  }
}

module.exports = {
  withCharacterLock,
  getInventory,
  addItem,
  removeItem,
  useItem,
  ensureTestKit,
};
