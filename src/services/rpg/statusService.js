const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { logError } = require("../loggerService");
/**
 * @constant moduleRegistry
 */
const moduleRegistry = require("../../modules/moduleRegistry");

/**
 * @param character
 * @returns
 */
function getActiveEffects(character) {
  return character.slots?.active_effects || [];
}

/**
 * @param character
 * @returns
 */
function getCooldowns(character) {
  return character.slots?.cooldowns || {};
}

/**
 * @param characterId
 * @param slots
 */
async function saveSlots(characterId, slots) {
  /**
   * @constant payload
   */
  const payload = filterExisting("characters", { slots, updated_at: new Date().toISOString() });
  const { error } = await supabase.from("characters").update(payload).eq("id", characterId);
  if (error) {
    logError({ source: "statusService.saveSlots", error, characterId });
    throw new Error(`Error guardando estados: ${error.message}`);
  }
}

/**
 * @param character
 * @param effect
 * @returns
 */
async function addEffect(character, effect) {
  /**
   * @constant effects
   */
  const effects = getActiveEffects(character);
  effects.push(effect);
  /**
   * @constant slots
   * @type {Object}
   */
  const slots = { ...(character.slots || {}), active_effects: effects };
  await saveSlots(character.id, slots);
  character.slots = slots;
  return effect;
}

/**
 * @param characterId
 * @param character
 * @returns
 */
async function tickEffects(characterId, character) {
  if (!character) return [];
  /**
   * @constant effects
   */
  const effects = getActiveEffects(character);
  if (effects.length === 0) return [];

  /**
   * @constant remaining
   * @type {Array}
   */
  const remaining = [];
  /**
   * @constant expired
   * @type {Array}
   */
  const expired = [];

  for (const eff of effects) {
    eff.remainingTurns -= 1;
    /**
     * @constant mod
     */
    const mod = eff.module ? moduleRegistry.createInstance(eff.module, eff) : null;
    if (mod && mod.constructor.triggers.includes("EffectTick")) {
      mod.onEffectTick({ character, effect: eff });
    }
    if (eff.remainingTurns <= 0) {
      if (mod && mod.constructor.triggers.includes("EffectExpire")) {
        mod.onEffectExpire({ character, effect: eff });
      }
      expired.push(eff);
    } else {
      remaining.push(eff);
    }
  }

  /**
   * @constant slots
   * @type {Object}
   */
  const slots = { ...(character.slots || {}), active_effects: remaining };
  await saveSlots(characterId, slots);
  character.slots = slots;

  return expired;
}

/**
 * @param characterId
 * @param character
 */
async function clearEffects(characterId, character) {
  /**
   * @constant slots
   * @type {Object}
   */
  const slots = { ...(character.slots || {}), active_effects: [] };
  await saveSlots(characterId, slots);
  if (character) character.slots = slots;
}

/**
 * @param character
 * @param itemId
 * @returns
 */
function getCooldown(character, itemId) {
  /**
   * @constant cooldowns
   */
  const cooldowns = getCooldowns(character);
  /**
   * @constant lastUsed
   */
  const lastUsed = cooldowns[itemId];
  if (!lastUsed) return 0;

  /**
   * @constant elapsed
   */
  const elapsed = Date.now() - lastUsed;
  if (elapsed < 0) return 0;

  return elapsed;
}

/**
 * @param character
 * @param itemId
 */
async function cleanCooldown(character, itemId) {
  /**
   * @constant cooldowns
   * @type {Object}
   */
  const cooldowns = { ...getCooldowns(character) };
  delete cooldowns[itemId];
  /**
   * @constant slots
   * @type {Object}
   */
  const slots = { ...(character.slots || {}), cooldowns };
  await saveSlots(character.id, slots);
  character.slots = slots;
}

/**
 * @param character
 * @param itemId
 */
async function setCooldown(character, itemId) {
  /**
   * @constant cooldowns
   * @type {Object}
   */
  const cooldowns = { ...getCooldowns(character), [itemId]: Date.now() };
  /**
   * @constant slots
   * @type {Object}
   */
  const slots = { ...(character.slots || {}), cooldowns };
  await saveSlots(character.id, slots);
  character.slots = slots;
}

/**
 * @param character
 */
async function cleanExpiredCooldowns(character) {
  /**
   * @constant cooldowns
   */
  const cooldowns = getCooldowns(character);
  /**
   * @variable changed
   * @type {boolean}
   */
  let changed = false;
  for (const [itemId, timestamp] of Object.entries(cooldowns)) {
    if (Date.now() - timestamp > 0) {
      delete cooldowns[itemId];
      changed = true;
    }
  }
  if (changed) {
    /**
     * @constant slots
     * @type {Object}
     */
    const slots = { ...(character.slots || {}), cooldowns };
    await saveSlots(character.id, slots);
    character.slots = slots;
  }
}

module.exports = {
  addEffect,
  tickEffects,
  clearEffects,
  getCooldown,
  cleanCooldown,
  setCooldown,
  cleanExpiredCooldowns,
  getActiveEffects,
  getCooldowns,
};
