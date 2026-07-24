const { supabase } = require("../../database/supabase");
const { filterExisting } = require("../../database/columnRegistry");
const { logError } = require("../loggerService");

function getActiveEffects(character) {
  return character.slots?.active_effects || [];
}

function getCooldowns(character) {
  return character.slots?.cooldowns || {};
}

async function saveSlots(characterId, slots) {
  const payload = filterExisting("characters", { slots, updated_at: new Date().toISOString() });
  const { error } = await supabase.from("characters").update(payload).eq("id", characterId);
  if (error) {
    logError({ source: "statusService.saveSlots", error, characterId });
    throw new Error(`Error guardando estados: ${error.message}`);
  }
}

async function addEffect(character, effect) {
  const effects = getActiveEffects(character);
  effects.push(effect);
  const slots = { ...(character.slots || {}), active_effects: effects };
  await saveSlots(character.id, slots);
  character.slots = slots;
  return effect;
}

async function tickEffects(characterId, character) {
  if (!character) return [];
  const effects = getActiveEffects(character);
  if (effects.length === 0) return [];

  const remaining = [];
  const expired = [];

  for (const eff of effects) {
    eff.remainingTurns -= 1;
    if (eff.remainingTurns <= 0) {
      expired.push(eff);
    } else {
      remaining.push(eff);
    }
  }

  const slots = { ...(character.slots || {}), active_effects: remaining };
  await saveSlots(characterId, slots);
  character.slots = slots;

  return expired;
}

async function clearEffects(characterId, character) {
  const slots = { ...(character.slots || {}), active_effects: [] };
  await saveSlots(characterId, slots);
  if (character) character.slots = slots;
}

function getCooldown(character, itemId) {
  const cooldowns = getCooldowns(character);
  const lastUsed = cooldowns[itemId];
  if (!lastUsed) return 0;

  const elapsed = Date.now() - lastUsed;
  if (elapsed < 0) return 0;

  return elapsed;
}

async function cleanCooldown(character, itemId) {
  const cooldowns = { ...getCooldowns(character) };
  delete cooldowns[itemId];
  const slots = { ...(character.slots || {}), cooldowns };
  await saveSlots(character.id, slots);
  character.slots = slots;
}

async function setCooldown(character, itemId) {
  const cooldowns = { ...getCooldowns(character), [itemId]: Date.now() };
  const slots = { ...(character.slots || {}), cooldowns };
  await saveSlots(character.id, slots);
  character.slots = slots;
}

async function cleanExpiredCooldowns(character) {
  const cooldowns = getCooldowns(character);
  let changed = false;
  for (const [itemId, timestamp] of Object.entries(cooldowns)) {
    if (Date.now() - timestamp > 0) {
      delete cooldowns[itemId];
      changed = true;
    }
  }
  if (changed) {
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
