const RPG_CONFIG = {
  version: '1.0.0',

  maxLevel: 100,
  baseXP: 100,
  xpScaleFactor: 1.5,
  statPointsPerLevel: 3,
  maxCharactersPerUser: 5,

  stats: {
    primary: ['fuerza', 'defensa', 'agilidad', 'magia', 'percepcion', 'carisma'],
    secondary: ['vida', 'mana', 'velocidad', 'precision', 'evasion', 'critico', 'resistencia'],
    combat: ['hp', 'mp', 'daño_fisico', 'daño_magico', 'defensa_fisica', 'defensa_magica'],
  },

  defaultStats: {
    hp: 100,
    mp: 50,
    fuerza: 5,
    defensa: 5,
    agilidad: 5,
    magia: 5,
    percepcion: 5,
    carisma: 5,
  },

  hpPerLevel: 10,
  mpPerLevel: 5,

  combat: {
    baseHitChance: 0.85,
    critMultiplier: 1.5,
    dodgeMultiplier: 1.0,
    minDamage: 1,
    fleeBaseChance: 0.4,
    xpRewardMultiplier: 1.0,
    lootDropChance: 0.6,
    maxBuffs: 5,
    maxDebuffs: 5,
    turnTimeoutMs: 60000,
  },

  combatRoom: {
    turnTimeoutMs: 86400000,
    fastTurnTimeoutMs: 3600000,
    maxConsecutiveSkips: 3,
    skipFatiguePenalty: 5,
    autoExpelAfterSkips: true,
    maxParticipantsPerTeam: 8,
    incertidumbreMin: 0.85,
    incertidumbreMax: 1.15,
    koThreshold: 30,
    fatigueAfterTurns: 5,
    interceptionSpeedRatio: 0.7,
    fleeReflexRatio: 0.7,
    magicPrecisionDivisor: 5,
    magicFulgorCostRatio: 0.3,
    fuerzaBonusRatio: 0.3,
    cortaduraMultiplier: 1.2,
  },

  inventory: {
    defaultCapacity: 30,
    baseWeight: 50,
    strengthWeightBonus: 5,
    maxStackSize: 99,
  },

  affinityLevels: ['S', 'A', 'B', 'C', 'D', 'E', 'F'],
  rarityScale: ['comun', 'avanzado', 'elite', 'legendario', 'mitologico'],

  hybrid: {
    minLevel: 20,
    requiredReputation: 'respetado',
    cooldownDays: 7,
  },
};

module.exports = { RPG_CONFIG };
