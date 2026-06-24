const { RPG_CONFIG } = require('../../config/rpg.config');
const { getRace, getClass, validateRaceClassCompatibility } = require('./dataLoader');

function validateCharacterCreation({ raceId, className, userLevel = 1, userCharacters = 0 }) {
  const errors = [];

  if (userCharacters >= RPG_CONFIG.maxCharactersPerUser) {
    errors.push(`Máximo de ${RPG_CONFIG.maxCharactersPerUser} personajes alcanzado`);
  }

  const race = getRace(raceId);
  if (!race) {
    errors.push(`Raza "${raceId}" no encontrada`);
  } else if (race.blocked) {
    errors.push(`Raza "${race.name}" está bloqueada`);
  }

  const cls = getClass(className);
  if (!cls) {
    errors.push(`Clase "${className}" no encontrada`);
  }

  if (race && cls) {
    const compat = validateRaceClassCompatibility(raceId, className);
    if (!compat.valid) errors.push(compat.reason);
  }

  return {
    valid: errors.length === 0,
    errors,
    race,
    class: cls,
  };
}

function validateEquipment({ item, characterRace, characterClass, characterLevel }) {
  const errors = [];
  if (!item) return { valid: false, errors: ['Item no existe'] };

  if (item.restrictions) {
    for (const restriction of item.restrictions) {
      if (restriction.type === 'race' && restriction.value !== characterRace) {
        errors.push(restriction.reason || `No compatible con tu raza`);
      }
      if (restriction.type === 'class' && restriction.value !== characterClass) {
        errors.push(restriction.reason || `No compatible con tu clase`);
      }
      if (restriction.type === 'level' && characterLevel < restriction.value) {
        errors.push(`Requiere nivel ${restriction.value}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

function canEquipToSlot(itemType, slot) {
  const slotMap = {
    arma: ['weapon', 'secondary_weapon'],
    armadura: ['armor'],
    casco: ['helmet'],
    guantes: ['gloves'],
    botas: ['boots'],
    accesorio: ['accessory_1', 'accessory_2'],
    herramienta: ['tool'],
    reliquia: ['relic'],
    consumible: null,
    material: null,
  };

  const validSlots = slotMap[itemType];
  if (!validSlots) return false;
  return validSlots.includes(slot);
}

function validateFlee(characterAgility, enemyLevel) {
  const base = RPG_CONFIG.combat.fleeBaseChance;
  const modifier = characterAgility / (characterAgility + enemyLevel * 5 + 10);
  return Math.min(0.9, base + modifier * 0.5);
}

function validateXP(characterLevel, enemyLevel) {
  const diff = enemyLevel - characterLevel;
  const xpBase = RPG_CONFIG.combat.xpRewardMultiplier;
  if (diff >= 5) return Math.round(xpBase * 1.5 * enemyLevel * 10);
  if (diff >= 0) return Math.round(xpBase * enemyLevel * 10);
  const reduction = Math.max(0.1, 1 + diff * 0.1);
  return Math.round(xpBase * reduction * enemyLevel * 10);
}

module.exports = {
  validateCharacterCreation,
  validateEquipment,
  canEquipToSlot,
  validateFlee,
  validateXP,
};
