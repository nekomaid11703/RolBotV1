// @ts-nocheck
const { DAMAGE_MIN, BLOCK_REDUCTION } = require("../../config/combatConfig");
const { getHpState } = require("../../config/characterConfig");
const { applyFatiguePenalties } = require("./fatigueEngine");

/**
 *
 * @param stats
 */
function normalizeStats(stats = {}) {
  return {
    atk: Number(stats.atk ?? stats.fuerza ?? stats.str ?? 0),
    def: Number(stats.def ?? stats.defensa ?? 0),
    aspd: Number(stats.aspd ?? stats.velocidad_ataque ?? 0),
    ref: Number(stats.ref ?? stats.reflejos ?? 0),
    mspd: Number(stats.mspd ?? stats.velocidad_movimiento ?? 0),
    fulgor: Number(stats.fulgor ?? stats.capacidad_magica ?? stats.magic ?? 0),
    d_fulgor: Number(stats.d_fulgor ?? stats.dominio_magico ?? stats.dmagic ?? 0),
    r_fulgor: Number(stats.r_fulgor ?? stats.resistencia_magica ?? stats.rmagic ?? 0),
  };
}

/**
 *
 * @param stats
 * @param hp
 * @param fatigue
 * @param resistance
 */
function applyPenalties(stats, hp, fatigue = 0, resistance = 0) {
  const fatigueApplied = fatigue > 0 ? applyFatiguePenalties(stats, fatigue, resistance) : { ...normalizeStats(stats) };
  const normalized = normalizeStats(fatigueApplied);

  const hpState = getHpState(hp);
  const hpPenalty = hpState ? hpState.penalty : 0;

  const penalized = {};
  for (const key of Object.keys(normalized)) {
    penalized[key] = Math.max(0, Math.round(normalized[key] * (1 - hpPenalty)));
  }
  return penalized;
}

/**
 *
 * @param attackerStats
 * @param defenderStats
 * @param attackerHp
 * @param defenderHp
 * @param attackerFatigue
 * @param defenderFatigue
 * @param attackerRes
 * @param defenderRes
 */
function calculateDamage(
  attackerStats,
  defenderStats,
  attackerHp,
  defenderHp,
  attackerFatigue = 0,
  defenderFatigue = 0,
  attackerRes = 0,
  defenderRes = 0,
) {
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);

  const rawDamage = atkPenalized.atk - defPenalized.def;
  return Math.max(DAMAGE_MIN, rawDamage);
}

/**
 *
 * @param defenderStats
 * @param defenderHp
 * @param attackerStats
 * @param attackerHp
 * @param defenderFatigue
 * @param attackerFatigue
 * @param defenderRes
 * @param attackerRes
 */
function canReact(
  defenderStats,
  defenderHp,
  attackerStats,
  attackerHp,
  defenderFatigue = 0,
  attackerFatigue = 0,
  defenderRes = 0,
  attackerRes = 0,
) {
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);
  return defPenalized.ref >= atkPenalized.aspd;
}

/**
 * Evalúa si esquivar resultará en dodge exitoso (sin cálculo mental para el jugador).
 * @param defenderStats
 * @param defenderHp
 * @param attackerStats
 * @param attackerHp
 * @param defenderFatigue
 * @param attackerFatigue
 * @param defenderRes
 * @param attackerRes
 * @returns {boolean} true si el jugador podrá esquivar completamente
 */
function evaluateDodgeFeasibility(
  defenderStats,
  defenderHp,
  attackerStats,
  attackerHp,
  defenderFatigue = 0,
  attackerFatigue = 0,
  defenderRes = 0,
  attackerRes = 0,
) {
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);
  return defPenalized.mspd >= atkPenalized.aspd;
}

/**
 * Evalúa la probabilidad de huida basada en MSPD comparativo.
 * @param fleerStats
 * @param fleerHp
 * @param pursuerStats
 * @param pursuerHp
 * @param fleerFatigue
 * @param pursuerFatigue
 * @param fleerRes
 * @param pursuerRes
 * @returns {{ chance: number, roll: number, success: boolean }}
 */
function rollFlee(
  fleerStats,
  fleerHp,
  pursuerStats,
  pursuerHp,
  fleerFatigue = 0,
  pursuerFatigue = 0,
  fleerRes = 0,
  pursuerRes = 0,
) {
  const fleerPenalized = applyPenalties(fleerStats, fleerHp, fleerFatigue, fleerRes);
  const pursuerPenalized = applyPenalties(pursuerStats, pursuerHp, pursuerFatigue, pursuerRes);

  let chance;
  if (fleerPenalized.mspd > pursuerPenalized.mspd) {
    chance = 1.0; // Garantizado
  } else if (fleerPenalized.mspd === pursuerPenalized.mspd) {
    chance = 0.5;
  } else {
    chance = 0.25;
  }

  const roll = Math.random();
  return { chance, roll, success: roll < chance };
}

/**
 *
 * @param incomingDamage
 */
function attemptBlock(incomingDamage) {
  return {
    blocked: true,
    damage: Math.max(DAMAGE_MIN, Math.round(incomingDamage * (1 - BLOCK_REDUCTION))),
  };
}

/**
 *
 * @param defenderStats
 * @param defenderHp
 * @param attackerStats
 * @param attackerHp
 * @param defenderFatigue
 * @param attackerFatigue
 * @param defenderRes
 * @param attackerRes
 */
function attemptDodge(
  defenderStats,
  defenderHp,
  attackerStats,
  attackerHp,
  defenderFatigue = 0,
  attackerFatigue = 0,
  defenderRes = 0,
  attackerRes = 0,
) {
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);

  if (defPenalized.mspd >= atkPenalized.aspd) {
    return { dodged: true, damage: 0 };
  }
  return { dodged: false, damage: null };
}

/**
 *
 * @param attackerChar
 * @param defenderChar
 * @param defenderHp
 * @param attackerFatigue
 * @param defenderFatigue
 */
function executeAttack(attackerChar, defenderChar, defenderHp, attackerFatigue = 0, defenderFatigue = 0) {
  const attackerStats = attackerChar.stats || {};
  const defenderStats = defenderChar.stats || {};
  const attackerRes = attackerStats.def || 0;
  const defenderRes = defenderStats.def || 0;

  const baseDamage = calculateDamage(
    attackerStats,
    defenderStats,
    attackerChar.hp_actual,
    defenderHp,
    attackerFatigue,
    defenderFatigue,
    attackerRes,
    defenderRes,
  );
  const reactPossible = canReact(
    defenderStats,
    defenderHp,
    attackerStats,
    attackerChar.hp_actual,
    defenderFatigue,
    attackerFatigue,
    defenderRes,
    attackerRes,
  );

  return {
    attackerName: attackerChar.name,
    defenderName: defenderChar.name,
    baseDamage,
    canReact: reactPossible,
    defenderHpBefore: defenderHp,
  };
}

/**
 *
 * @param reactionType
 * @param baseDamage
 * @param defenderChar
 * @param defenderHp
 * @param attackerChar
 * @param defenderFatigue
 * @param attackerFatigue
 */
function executeReaction(
  reactionType,
  baseDamage,
  defenderChar,
  defenderHp,
  attackerChar,
  defenderFatigue = 0,
  attackerFatigue = 0,
) {
  const attackerStats = attackerChar.stats || {};
  const defenderStats = defenderChar.stats || {};
  const attackerRes = attackerStats.def || 0;
  const defenderRes = defenderStats.def || 0;

  let finalDamage;
  let reaction;
  let dodged = false;

  if (reactionType === "dodge") {
    const dodgeResult = attemptDodge(
      defenderStats,
      defenderHp,
      attackerStats,
      attackerChar.hp_actual,
      defenderFatigue,
      attackerFatigue,
      defenderRes,
      attackerRes,
    );
    if (dodgeResult.dodged) {
      finalDamage = 0;
      dodged = true;
      reaction = "dodge";
    } else {
      finalDamage = baseDamage;
      reaction = "dodge_failed";
    }
  } else if (reactionType === "block") {
    const blockResult = attemptBlock(baseDamage);
    finalDamage = blockResult.damage;
    reaction = "block";
  } else {
    reaction = "none";
    finalDamage = baseDamage;
  }

  const defenderHpAfter = Math.max(0, defenderHp - finalDamage);

  return {
    attackerName: attackerChar.name,
    defenderName: defenderChar.name,
    baseDamage,
    reaction,
    finalDamage,
    dodged,
    defenderHpBefore: defenderHp,
    defenderHpAfter,
    ko: defenderHpAfter <= 0,
  };
}

/**
 *
 * @param defenderChar
 * @param defenderHp
 * @param attackerChar
 * @param baseDamage
 * @param defenderFatigue
 * @param attackerFatigue
 */
function chooseAiReaction(
  defenderChar,
  defenderHp,
  attackerChar,
  baseDamage,
  defenderFatigue = 0,
  attackerFatigue = 0,
) {
  const attackerStats = attackerChar.stats || {};
  const defenderStats = defenderChar.stats || {};
  const attackerRes = attackerStats.def || 0;
  const defenderRes = defenderStats.def || 0;

  const reactPossible = canReact(
    defenderStats,
    defenderHp,
    attackerStats,
    attackerChar.hp_actual,
    defenderFatigue,
    attackerFatigue,
    defenderRes,
    attackerRes,
  );
  if (!reactPossible) {
    return "none";
  }

  const dodgeCheck = attemptDodge(
    defenderStats,
    defenderHp,
    attackerStats,
    attackerChar.hp_actual,
    defenderFatigue,
    attackerFatigue,
    defenderRes,
    attackerRes,
  );
  if (dodgeCheck.dodged) {
    return "dodge";
  }
  return "block";
}

/**
 *
 * @param attackerChar
 * @param defenderChar
 * @param defenderHp
 * @param chosenReaction
 * @param attackerFatigue
 * @param defenderFatigue
 */
function executeTurn(
  attackerChar,
  defenderChar,
  defenderHp,
  chosenReaction = null,
  attackerFatigue = 0,
  defenderFatigue = 0,
) {
  const attackInfo = executeAttack(attackerChar, defenderChar, defenderHp, attackerFatigue, defenderFatigue);
  if (!attackInfo.canReact) {
    return executeReaction(
      "none",
      attackInfo.baseDamage,
      defenderChar,
      defenderHp,
      attackerChar,
      defenderFatigue,
      attackerFatigue,
    );
  }

  const reaction =
    chosenReaction ||
    chooseAiReaction(defenderChar, defenderHp, attackerChar, attackInfo.baseDamage, defenderFatigue, attackerFatigue);
  return executeReaction(
    reaction,
    attackInfo.baseDamage,
    defenderChar,
    defenderHp,
    attackerChar,
    defenderFatigue,
    attackerFatigue,
  );
}

/**
 *
 * @param enemyLevel
 * @param isWinner
 */
function calculateXpReward(enemyLevel = 1, isWinner = true) {
  const lvl = Math.max(1, Number(enemyLevel) || 1);
  const baseXp = 50 + lvl * 2;
  return isWinner ? baseXp : Math.round(baseXp * 0.3);
}

module.exports = {
  normalizeStats,
  applyPenalties,
  calculateDamage,
  canReact,
  evaluateDodgeFeasibility,
  rollFlee,
  attemptBlock,
  attemptDodge,
  executeAttack,
  executeReaction,
  chooseAiReaction,
  executeTurn,
  calculateXpReward,
};
