// @ts-nocheck
"use strict";

const { RACES } = require("../../src/config/characterConfig");
const {
  PERSONALITIES,
  GENERATED_STATS,
  PHYSICAL_STATS,
  MAGIC_STATS,
  LEVEL_MIN,
  LEVEL_MAX,
  LEVEL_DIFF_MAX_PCT,
  STAT_CLAMP,
  HP_STAT_MULTIPLIER,
  ITEM_POOL,
  ITEM_STOCK_MIN,
  ITEM_STOCK_MAX,
  WEAPONS_BY_TIER,
  ARMOR_BY_TIER,
  NO_WEAPON_CHANCE,
  NO_ARMOR_CHANCE,
  MAGIC_ALLOC_CHANCE,
  MAGIC_SHARE_MIN,
  MAGIC_SHARE_MAX,
} = require("./config");

const RACE_KEYS = Object.keys(RACES);
const PERSONALITY_KEYS = Object.keys(PERSONALITIES);

/**
 *
 */
function randomRace() {
  return RACE_KEYS[Math.floor(Math.random() * RACE_KEYS.length)];
}

/**
 *
 */
function randomPersonality() {
  return PERSONALITY_KEYS[Math.floor(Math.random() * PERSONALITY_KEYS.length)];
}

/**
 *
 * @param val
 * @param min
 * @param max
 */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 *
 * @param list
 * @param level
 */
function pickTier(list, level) {
  const eligible = list.filter((entry) => level >= entry.minLevel);
  return eligible[eligible.length - 1] || list[list.length - 1];
}

/**
 * Generate equipment (weapon + armor) scaled by fighter level.
 * Weapon/armor presence is random to generate data variance.
 * @param {number} level
 * @returns {{ tierKey: string, weapon: object|null, armor: object|null }}
 */
function generateEquipment(level) {
  const weaponEntry = pickTier(WEAPONS_BY_TIER, level);
  const armorEntry = pickTier(ARMOR_BY_TIER, level);

  return {
    tierKey: weaponEntry.tierKey,
    weapon: Math.random() >= NO_WEAPON_CHANCE ? { ...weaponEntry.weapon } : null,
    armor: Math.random() >= NO_ARMOR_CHANCE ? { ...armorEntry.armor, currentDurability: armorEntry.armor.durability } : null,
  };
}

/**
 * Generate healing item loadout scaled by fighter level.
 * @param {number} level
 * @returns {Array<{ name: string, heal: number }>}
 */
function generateLoadout(level) {
  const stock = ITEM_STOCK_MIN + Math.floor(Math.random() * (ITEM_STOCK_MAX - ITEM_STOCK_MIN + 1));
  const pool = ITEM_POOL.filter((item) => level >= item.minLevel);
  const items = [];

  for (let i = 0; i < stock; i++) {
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    items.push({ name: chosen.name, heal: chosen.heal });
  }

  return items;
}

/**
 * Generate a fighter with personality-based stat allocation.
 *
 * 1. Pick random race -> get baseStats (sum = 50 across 9 stats)
 * 2. Pick random personality -> get allocation weights (physical + hp)
 * 3. Magic stats stay at race base values (no free points allocated)
 * 4. Clamp all stats to [1, 100]
 * 5. nivel = sum of all 9 stats (min 100)
 * 6. HP pool = hp_stat * HP_STAT_MULTIPLIER
 * 7. Equipment + item loadout scaled by level
 * @param {string} [personalityKey] - Force a specific personality
 * @param {string} [raceKey] - Force a specific race
 * @returns {{ name: string, stats: object, nivel: number, race: string, personality: string, hp: number, equipment: object, loadout: Array }}
 */
function generateFighter(personalityKey, raceKey) {
  const pKey = personalityKey || randomPersonality();
  const rKey = raceKey || randomRace();
  const personality = PERSONALITIES[pKey];
  const race = RACES[rKey];

  const raceStats = { ...race.baseStats };
  const baseWeights = { ...personality.weights };

  const randomizedWeights = {};
  for (const key of GENERATED_STATS) {
    const base = baseWeights[key] || 0;
    const variation = Math.round(base * (Math.random() * 0.4 - 0.2));
    randomizedWeights[key] = Math.max(1, base + variation);
  }

  const stats = {};

  for (const key of GENERATED_STATS) {
    stats[key] = clamp((raceStats[key] || 0) + randomizedWeights[key], STAT_CLAMP.min, STAT_CLAMP.max);
  }

  if (Math.random() < MAGIC_ALLOC_CHANCE) {
    const share = MAGIC_SHARE_MIN + Math.random() * (MAGIC_SHARE_MAX - MAGIC_SHARE_MIN);
    const physicalTotal =
      PHYSICAL_STATS.reduce((acc, key) => acc + (stats[key] || 0), 0) / MAGIC_STATS.length;
    const magicPoints = Math.round(physicalTotal * share);
    for (const key of PHYSICAL_STATS) {
      stats[key] = clamp(Math.round((stats[key] || 0) * (1 - share)), STAT_CLAMP.min, STAT_CLAMP.max);
    }
    for (const key of MAGIC_STATS) {
      stats[key] = clamp((stats[key] || 0) + magicPoints, STAT_CLAMP.min, STAT_CLAMP.max);
    }
  } else {
    for (const key of MAGIC_STATS) {
      stats[key] = clamp(raceStats[key] || 0, STAT_CLAMP.min, STAT_CLAMP.max);
    }
  }

  const nivel = Math.max(
    100,
    Object.values(stats).reduce((a, b) => a + b, 0),
  );

  const equipment = generateEquipment(nivel);
  const loadout = generateLoadout(nivel);

  return {
    name: `${personality.label} ${race.name}`,
    stats,
    nivel,
    race: rKey,
    personality: pKey,
    hp: stats.hp * HP_STAT_MULTIPLIER,
    equipment,
    loadout,
  };
}

/**
 * Scale a fighter's stats proportionally to match a target level.
 * Maintains relative stat distribution.
 * @param {object} fighter
 * @param {number} targetLevel
 * @returns {object} New fighter with adjusted stats
 */
function scaleToLevel(fighter, targetLevel) {
  const currentLevel = fighter.nivel;
  if (currentLevel === targetLevel) return { ...fighter };

  const ratio = targetLevel / currentLevel;
  const newStats = {};

  for (const key of [...GENERATED_STATS, ...MAGIC_STATS]) {
    newStats[key] = clamp(Math.round(fighter.stats[key] * ratio), STAT_CLAMP.min, STAT_CLAMP.max);
  }

  const newNivel = Math.max(
    100,
    Object.values(newStats).reduce((a, b) => a + b, 0),
  );

  return {
    ...fighter,
    stats: newStats,
    nivel: newNivel,
    hp: newStats.hp * HP_STAT_MULTIPLIER,
    equipment: generateEquipment(newNivel),
    loadout: generateLoadout(newNivel),
  };
}

/**
 * Generate a pair of fighters with level difference <= 20%.
 * @returns {{ fighterA: object, fighterB: object }}
 */
function generateFighterPair() {
  const fighterA = generateFighter();
  const targetLevelA = LEVEL_MIN + Math.floor(Math.random() * (LEVEL_MAX - LEVEL_MIN + 1));
  const scaledFighterA = scaleToLevel(fighterA, targetLevelA);

  const minLevel = Math.max(LEVEL_MIN, Math.round(targetLevelA * (1 - LEVEL_DIFF_MAX_PCT)));
  const maxLevel = Math.min(LEVEL_MAX, Math.round(targetLevelA * (1 + LEVEL_DIFF_MAX_PCT)));
  const targetLevelB = minLevel + Math.floor(Math.random() * (maxLevel - minLevel + 1));

  let fighterB = generateFighter();
  fighterB = scaleToLevel(fighterB, targetLevelB);

  return { fighterA: scaledFighterA, fighterB };
}

module.exports = { generateFighter, generateFighterPair, scaleToLevel, randomRace, randomPersonality };
