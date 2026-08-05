// @ts-nocheck
"use strict";

const { PHYSICAL_STATS } = require("./config");
const { getCoverage } = require("../../src/services/rpg/armorSetService");

/**
 * Resumen de equipo de un fighter para las métricas.
 * @param {object} equipment
 * @returns {object} Métricas de equipo
 */
function equipmentMetrics(equipment) {
  const pieces = equipment.armorList || [];
  const coverage = getCoverage(pieces);
  return {
    weaponTier: equipment.weapon?.tier || null,
    armorPieces: pieces.length,
    armorMaxResist: pieces.reduce((acc, p) => acc + (p.maxResist || 0), 0),
    armorLeftResist: pieces.reduce((acc, p) => acc + (p.currentResist || 0), 0),
    armorBrokenPieces: pieces.filter((p) => (p.currentResist || 0) <= 0).length,
    coverage: coverage.coverage,
    setPieces: equipment.setPieces || 0,
    setBonusActive: Boolean(equipment.setBonusActive),
    amulet: Boolean(equipment.amulet),
    shield: Boolean(equipment.shield),
  };
}

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
  let itemsUsedA = 0;
  let itemsUsedB = 0;
  let healTotalA = 0;
  let healTotalB = 0;
  let advancesA = 0;
  let advancesB = 0;
  let retreatsA = 0;
  let retreatsB = 0;
  let weaponHitsA = 0;
  let weaponHitsB = 0;

  for (const entry of result.log) {
    const isA = entry.attacker.startsWith("A");

    if (entry.action === "attack") {
      if (isA) {
        weaponHitsA++;
        damagePerTurnA.push(entry.finalDamage);
        totalDamageA += entry.finalDamage;
        trackReaction(reactionsB, entry.reaction);
      } else {
        weaponHitsB++;
        damagePerTurnB.push(entry.finalDamage);
        totalDamageB += entry.finalDamage;
        trackReaction(reactionsA, entry.reaction);
      }
    } else if (entry.action === "rest") {
      if (isA) restCountA++;
      else restCountB++;
    } else if (entry.action === "item") {
      if (isA) {
        itemsUsedA++;
        healTotalA += entry.heal;
      } else {
        itemsUsedB++;
        healTotalB += entry.heal;
      }
    } else if (entry.action === "advance") {
      if (isA) advancesA++;
      else advancesB++;
    } else if (entry.action === "retreat") {
      if (isA) retreatsA++;
      else retreatsB++;
    }
  }

  const fighterA = result.fighterA;
  const fighterB = result.fighterB;
  const eqA = equipmentMetrics(fighterA.equipment);
  const eqB = equipmentMetrics(fighterB.equipment);

  return {
    fighterA_personality: fighterA.personality,
    fighterB_personality: fighterB.personality,
    fighterA_level: fighterA.nivel,
    fighterB_level: fighterB.nivel,
    fighterA_race: fighterA.race,
    fighterB_race: fighterB.race,
    fighterA_stats: fighterA.stats,
    fighterB_stats: fighterB.stats,
    fighterA_weapon: fighterA.equipment.weapon?.name || "desarmado",
    fighterB_weapon: fighterB.equipment.weapon?.name || "desarmado",
    fighterA_weaponNature: fighterA.equipment.weapon?.damageNature || "desarmado",
    fighterB_weaponNature: fighterB.equipment.weapon?.damageNature || "desarmado",
    fighterA_weaponRange: fighterA.equipment.weapon?.weaponRange || 0,
    fighterB_weaponRange: fighterB.equipment.weapon?.weaponRange || 0,
    fighterA_equipmentTier: fighterA.equipment.tierKey,
    fighterB_equipmentTier: fighterB.equipment.tierKey,
    fighterA_weaponTier: eqA.weaponTier,
    fighterB_weaponTier: eqB.weaponTier,
    fighterA_armorBonusDef: fighterA.equipment.armor?.bonusDef || 0,
    fighterB_armorBonusDef: fighterB.equipment.armor?.bonusDef || 0,
    fighterA_armorPieces: eqA.armorPieces,
    fighterB_armorPieces: eqB.armorPieces,
    fighterA_armorMaxResist: eqA.armorMaxResist,
    fighterB_armorMaxResist: eqB.armorMaxResist,
    fighterA_armorLeftResist: eqA.armorLeftResist,
    fighterB_armorLeftResist: eqB.armorLeftResist,
    fighterA_armorBrokenPieces: eqA.armorBrokenPieces,
    fighterB_armorBrokenPieces: eqB.armorBrokenPieces,
    fighterA_coverage: eqA.coverage,
    fighterB_coverage: eqB.coverage,
    fighterA_setPieces: eqA.setPieces,
    fighterB_setPieces: eqB.setPieces,
    fighterA_setBonusActive: eqA.setBonusActive,
    fighterB_setBonusActive: eqB.setBonusActive,
    fighterA_amulet: eqA.amulet,
    fighterB_amulet: eqB.amulet,
    fighterA_shield: eqA.shield,
    fighterB_shield: eqB.shield,
    winner: result.winner,
    koType: result.koType,
    firstAttacker: result.firstAttacker,
    winnerIsFirstAttacker: result.winner === result.firstAttacker,
    totalRounds: result.totalRounds,
    damagePerTurnA,
    damagePerTurnB,
    totalDamageA,
    totalDamageB,
    weaponHitsA,
    weaponHitsB,
    reactionsA,
    reactionsB,
    restCountA,
    restCountB,
    itemsUsedA,
    itemsUsedB,
    healTotalA,
    healTotalB,
    advancesA,
    advancesB,
    retreatsA,
    retreatsB,
    fatigueCurveA: result.fatigueCurveA,
    fatigueCurveB: result.fatigueCurveB,
    hpCurveA: result.hpCurveA,
    hpCurveB: result.hpCurveB,
    distanceCurve: result.distanceCurve,
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

module.exports = { collectMetrics, PHYSICAL_STATS };
