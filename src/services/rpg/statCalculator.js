const { RPG_CONFIG } = require('../../config/rpg.config');

function calculateStats(character) {
  if (!character) return { ...RPG_CONFIG.defaultStats };

  const base = { ...RPG_CONFIG.defaultStats };

  const hpFromLevel = (character.level || 1) * RPG_CONFIG.hpPerLevel;
  const mpFromLevel = (character.level || 1) * RPG_CONFIG.mpPerLevel;

  base.hp += hpFromLevel;
  base.mp += mpFromLevel;

  const raceBonuses = character.race ? getRaceBonuses(character.race) : {};
  const classBonuses = character.class ? getClassBonuses(character.class) : {};
  const levelScaling = calculateLevelScaling(character.level || 1);

  const final = {};

  for (const stat of RPG_CONFIG.stats.primary) {
    let value = base[stat] || 0;
    value += raceBonuses[stat] || 0;
    value += classBonuses[stat] || 0;
    value += levelScaling[stat] || 0;
    if (raceBonuses[`${stat}_pct`]) value += base[stat] * (raceBonuses[`${stat}_pct`] / 100);
    if (classBonuses[`${stat}_pct`]) value += base[stat] * (classBonuses[`${stat}_pct`] / 100);
    final[stat] = Math.max(0, Math.round(value));
  }

  final.hp = base.hp;
  final.mp = base.mp;

  for (const stat of RPG_CONFIG.stats.secondary) {
    final[stat] = base[stat] || 0;
  }

  if (character.equipmentBonuses) {
    for (const [stat, bonus] of Object.entries(character.equipmentBonuses)) {
      if (final[stat] !== undefined) final[stat] += bonus;
    }
  }

  if (character.tempBuffs) {
    for (const [stat, bonus] of Object.entries(character.tempBuffs)) {
      if (final[stat] !== undefined) final[stat] += bonus;
    }
  }

  return final;
}

function getRaceBonuses(raceData) {
  if (!raceData || !raceData.statModifiers) return {};
  const bonuses = {};
  for (const [stat, value] of Object.entries(raceData.statModifiers)) {
    bonuses[stat] = value;
  }
  return bonuses;
}

function getClassBonuses(classData) {
  if (!classData || !classData.bonuses) return {};
  return { ...classData.bonuses };
}

function calculateLevelScaling(level) {
  const scaling = {};
  const totalPoints = (level - 1) * RPG_CONFIG.statPointsPerLevel;
  const perStat = Math.floor(totalPoints / RPG_CONFIG.stats.primary.length);
  for (const stat of RPG_CONFIG.stats.primary) {
    scaling[stat] = perStat;
  }
  return scaling;
}

function calculateDamage(attackerStats, defenderStats, options = {}) {
  const isPhysical = options.physical !== false;
  const atk = isPhysical ? (attackerStats.fuerza || 0) : (attackerStats.magia || 0);
  const def = isPhysical ? (defenderStats.defensa || 0) : (defenderStats.defensa_magica || 0);
  const baseDmg = Math.max(1, atk - def);
  let dmg = baseDmg;

  if (options.crit) {
    dmg = Math.round(dmg * RPG_CONFIG.combat.critMultiplier);
  }

  if (options.multiplier) {
    dmg = Math.round(dmg * options.multiplier);
  }

  return Math.max(RPG_CONFIG.combat.minDamage, dmg);
}

function calculateHitChance(attackerStats, defenderStats) {
  const base = RPG_CONFIG.combat.baseHitChance;
  const evasion = (defenderStats.agilidad || 0) * 0.01;
  const accuracy = (attackerStats.percepcion || 0) * 0.005;
  return Math.min(0.95, Math.max(0.1, base - evasion + accuracy));
}

function xpForLevel(level) {
  return Math.floor(RPG_CONFIG.baseXP * Math.pow(RPG_CONFIG.xpScaleFactor, level - 1));
}

function hpForLevel(level) {
  return RPG_CONFIG.defaultStats.hp + (level - 1) * RPG_CONFIG.hpPerLevel;
}

function mpForLevel(level) {
  return RPG_CONFIG.defaultStats.mp + (level - 1) * RPG_CONFIG.mpPerLevel;
}

module.exports = {
  calculateStats,
  calculateDamage,
  calculateHitChance,
  xpForLevel,
  hpForLevel,
  mpForLevel,
  calculateLevelScaling,
};
