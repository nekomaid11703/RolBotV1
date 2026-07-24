// @ts-nocheck
"use strict";

const { RACES } = require("../../src/config/characterConfig");
const {
  PERSONALITIES,
  FREE_POINTS,
  PHYSICAL_STATS,
  MAGIC_STATS,
  LEVEL_MIN,
  LEVEL_MAX,
  LEVEL_DIFF_MAX_PCT,
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
 * Generate a fighter with personality-based stat allocation.
 *
 * 1. Pick random race -> get baseStats (sum = 50 across 8 stats)
 * 2. Pick random personality -> get physical allocation (sum = 50)
 * 3. Magic stats stay at race base values (no free points allocated)
 * 4. Clamp all stats to [1, 100]
 * 5. nivel = sum of all 8 stats (min 100)
 * @param {string} [personalityKey] - Force a specific personality
 * @param {string} [raceKey] - Force a specific race
 * @returns {{ name: string, stats: object, nivel: number, race: string, personality: string }}
 */
function generateFighter(personalityKey, raceKey) {
  const pKey = personalityKey || randomPersonality();
  const rKey = raceKey || randomRace();
  const personality = PERSONALITIES[pKey];
  const race = RACES[rKey];

  const raceStats = { ...race.baseStats };
  const baseWeights = { ...personality.weights };

  const randomizedWeights = {};
  for (const key of PHYSICAL_STATS) {
    const base = baseWeights[key] || 0;
    const variation = Math.round(base * (Math.random() * 0.4 - 0.2));
    randomizedWeights[key] = Math.max(1, base + variation);
  }

  const stats = {};

  for (const key of PHYSICAL_STATS) {
    stats[key] = clamp((raceStats[key] || 0) + (randomizedWeights[key] || 0), 1, 100);
  }

  for (const key of MAGIC_STATS) {
    stats[key] = clamp(raceStats[key] || 0, 1, 100);
  }

  stats.hp = raceStats.hp || 1;

  const nivel = Math.max(
    100,
    Object.values(stats).reduce((a, b) => a + b, 0),
  );

  return {
    name: `${personality.label} ${race.name}`,
    stats,
    nivel,
    race: rKey,
    personality: pKey,
    hp: stats.hp * 2,
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

  for (const key of [...PHYSICAL_STATS, ...MAGIC_STATS, "hp"]) {
    newStats[key] = clamp(Math.round(fighter.stats[key] * ratio), 1, 100);
  }

  const newNivel = Math.max(
    100,
    Object.values(newStats).reduce((a, b) => a + b, 0),
  );

  return {
    ...fighter,
    stats: newStats,
    nivel: newNivel,
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
