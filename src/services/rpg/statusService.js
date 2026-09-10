const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { logError } = require("../loggerService");
/**
 * @param {*} character
 * @returns
 */
function getActiveEffects(character) {
  return character.slots?.active_effects || [];
}

/**
 * @param {*} character
 * @returns
 */
function getCooldowns(character) {
  return character.slots?.cooldowns || {};
}

/**
 * @param {*} characterId
 * @param {*} slots
 */
async function saveSlots(characterId, slots) {
  /**
   * @constant payload
   */
  const payload = filterExisting("characters", { slots, updated_at: new Date().toISOString() });
  const { error } = await supabase.from("characters").update(payload).eq("id", characterId);
  if (error) {
    logError({ source: "statusService.saveSlots", error, context: { characterId } });
    throw new Error(`Error guardando estados: ${error.message}`);
  }
}

/**
 * @param {*} character
 * @param {*} effect
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
   * @type {object}
   */
  const slots = { ...(character.slots || {}), active_effects: effects };
  await saveSlots(character.id, slots);
  character.slots = slots;
  return effect;
}

/**
 * @param {*} character
 * @param {*} itemId
 */
async function setCooldown(character, itemId) {
  /**
   * @constant cooldowns
   * @type {object}
   */
  const cooldowns = { ...getCooldowns(character), [itemId]: Date.now() };
  /**
   * @constant slots
   * @type {object}
   */
  const slots = { ...(character.slots || {}), cooldowns };
  await saveSlots(character.id, slots);
  character.slots = slots;
}

module.exports = {
  addEffect,
  setCooldown,
};
