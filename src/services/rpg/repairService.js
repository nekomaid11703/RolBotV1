// @ts-nocheck
/**
 * Reparación de equipo (sumidero recurrente de stelas).
 * Restaura la durabilidad de las piezas equipadas pagando según los puntos
 * de resistencia faltantes.
 */

const equipmentResolver = require("./equipmentResolverService");
const durabilityPersistence = require("./durabilityPersistenceService");
const economyService = require("../economyService");
const { REPAIR_COST_PER_POINT } = require("../../config/economyConfig");

/**
 * Repara las piezas equipadas dañadas del personaje.
 * @param {object} params
 * @param {string} params.userId
 * @param {string|number} params.characterId
 * @param {string|null} [params.slot] - Slot concreto o null para todo
 * @returns {Promise<object>}
 */
async function repairEquipped({ userId, characterId, slot = null }) {
  const entries = await equipmentResolver.getEquippedItems(characterId);
  const targets = [];

  for (const entry of entries) {
    if (slot && entry.slot !== slot) continue;
    const durability = entry.row?.metadata?.durability;
    if (!durability || durability.isRepairable === false) continue;
    const maxResist = Number(durability.maxResist) || 0;
    const parsedCurrent = Number(durability.currentResist);
    const currentResist = Number.isFinite(parsedCurrent) ? parsedCurrent : maxResist;
    if (currentResist >= maxResist) continue;
    const missing = maxResist - currentResist;
    targets.push({
      slot: entry.slot,
      itemId: entry.itemId,
      variantKey: entry.variantKey || "legacy",
      maxResist,
      missing,
      cost: Math.max(1, Math.ceil(missing * REPAIR_COST_PER_POINT)),
    });
  }

  if (targets.length === 0) {
    return { success: false, error: "No tienes equipo dañado que reparar." };
  }

  const totalCost = targets.reduce((sum, target) => sum + target.cost, 0);
  const balance = await economyService.getBalance(userId);
  if (balance < totalCost) {
    return {
      success: false,
      error: `❌ Stelas insuficientes. Reparar cuesta ✧ ${totalCost.toLocaleString()} y tienes ✧ ${balance.toLocaleString()}.`,
    };
  }

  await economyService.removeMoney(userId, totalCost);
  for (const target of targets) {
    await durabilityPersistence.persistDurability({
      characterId,
      creatorId: userId,
      itemId: target.itemId,
      variantKey: target.variantKey,
      durability: { maxResist: target.maxResist, currentResist: target.maxResist, isRepairable: true },
    });
  }

  return {
    success: true,
    totalCost,
    repaired: targets,
    newBalance: balance - totalCost,
  };
}

module.exports = { repairEquipped };
