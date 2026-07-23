// @ts-nocheck
"use strict";

/**
 *
 * @param result
 */
function collectMetrics(result) {
  const damagePerTurnA = [];
  const damagePerTurnB = [];
  let totalDamageA = 0;
  let totalDamageB = 0;

  const reactionsA = { dodge_attempted: 0, dodge_success: 0, block: 0, none: 0, rest: 0 };
  const reactionsB = { dodge_attempted: 0, dodge_success: 0, block: 0, none: 0, rest: 0 };

  let restCountA = 0;
  let restCountB = 0;

  for (const entry of result.log) {
    const isRest = entry.reaction === "rest" || entry.attacker === "A_rest" || entry.attacker === "B_rest";

    if (entry.attacker === "A" || entry.attacker === "B_counter") {
      if (!isRest) {
        damagePerTurnA.push(entry.finalDamage);
        totalDamageA += entry.finalDamage;
      }
      trackReaction(reactionsB, entry.reaction);
    } else if (entry.attacker === "B" || entry.attacker === "A_counter") {
      if (!isRest) {
        damagePerTurnB.push(entry.finalDamage);
        totalDamageB += entry.finalDamage;
      }
      trackReaction(reactionsA, entry.reaction);
    }

    if (entry.attacker === "A_rest") restCountA++;
    if (entry.attacker === "B_rest") restCountB++;
  }

  return {
    fighterA_personality: result.fighterA.personality,
    fighterB_personality: result.fighterB.personality,
    fighterA_level: result.fighterA.nivel,
    fighterB_level: result.fighterB.nivel,
    fighterA_race: result.fighterA.race,
    fighterB_race: result.fighterB.race,
    winner: result.winner,
    koType: result.koType,
    totalRounds: result.totalRounds,
    damagePerTurnA,
    damagePerTurnB,
    totalDamageA,
    totalDamageB,
    reactionsA,
    reactionsB,
    restCountA,
    restCountB,
    fatigueCurveA: result.fatigueCurveA,
    fatigueCurveB: result.fatigueCurveB,
    hpCurveA: result.hpCurveA,
    hpCurveB: result.hpCurveB,
  };
}

/**
 *
 * @param stats
 * @param reaction
 */
function trackReaction(stats, reaction) {
  if (reaction === "dodge") {
    stats.dodge_attempted++;
    stats.dodge_success++;
  } else if (reaction === "dodge_failed") {
    stats.dodge_attempted++;
  } else if (reaction === "block") {
    stats.block++;
  } else if (reaction === "rest") {
    stats.rest++;
  } else {
    stats.none++;
  }
}

module.exports = { collectMetrics };
