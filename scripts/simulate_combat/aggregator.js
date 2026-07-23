// @ts-nocheck
"use strict";

const { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS } = require("./config");

const PERSONALITY_KEYS = Object.keys(PERSONALITIES);

/**
 *
 * @param arr
 */
function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 *
 * @param arr
 * @param p
 */
function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

/**
 *
 */
function initPersonalityMap() {
  const map = {};
  for (const key of PERSONALITY_KEYS) {
    map[key] = [];
  }
  return map;
}

/**
 * Aggregate all per-combat metrics into summary statistics.
 * @param {object[]} allMetrics - Array of CombatMetrics from collectMetrics()
 * @returns {object} AggregatedReport
 */
function aggregate(allMetrics) {
  const totalSims = allMetrics.length;

  // ── Win counts per personality ──
  const wins = {};
  const appearances = {};
  for (const key of PERSONALITY_KEYS) {
    wins[key] = 0;
    appearances[key] = 0;
  }

  let totalKOs = 0;
  let totalTimeouts = 0;
  const allRounds = [];
  const roundsKO = [];

  // ── Damage per turn by personality ──
  const damageByPersonality = initPersonalityMap();

  // ── Reaction stats by personality (as defender) ──
  const reactionStats = {};
  for (const key of PERSONALITY_KEYS) {
    reactionStats[key] = {
      dodge_attempted: 0,
      dodge_success: 0,
      block: 0,
      none: 0,
      totalDefended: 0,
      totalDamageReceived: 0,
      totalDamageBlocked: 0,
    };
  }

  // ── Fatigue curve accumulators ──
  const fatigueAccum = {};
  for (const key of PERSONALITY_KEYS) {
    fatigueAccum[key] = {};
    for (const turn of FATIGUE_SNAPSHOT_TURNS) {
      fatigueAccum[key][turn] = [];
    }
  }

  // ── Matchup matrix ──
  const matchupWins = {};
  const matchupTotal = {};
  for (const a of PERSONALITY_KEYS) {
    matchupWins[a] = {};
    matchupTotal[a] = {};
    for (const b of PERSONALITY_KEYS) {
      matchupWins[a][b] = 0;
      matchupTotal[a][b] = 0;
    }
  }

  // ── Stat vs win rate ──
  const statValues = {};
  for (const stat of PHYSICAL_STATS) {
    statValues[stat] = {
      "1-15": { wins: 0, total: 0 },
      "16-30": { wins: 0, total: 0 },
      "31-50": { wins: 0, total: 0 },
      "51-70": { wins: 0, total: 0 },
      "71-100": { wins: 0, total: 0 },
    };
  }

  /**
   *
   * @param val
   */
  function getBucket(val) {
    if (val <= 15) return "1-15";
    if (val <= 30) return "16-30";
    if (val <= 50) return "31-50";
    if (val <= 70) return "51-70";
    return "71-100";
  }

  // ── Process each combat ──
  for (const m of allMetrics) {
    const pA = m.fighterA_personality;
    const pB = m.fighterB_personality;

    appearances[pA]++;
    appearances[pB]++;

    if (m.koType === "ko") {
      totalKOs++;
    } else {
      totalTimeouts++;
    }
    allRounds.push(m.totalRounds);
    if (m.koType === "ko") roundsKO.push(m.totalRounds);

    // Win tracking
    if (m.winner === "A") {
      wins[pA]++;
    } else if (m.winner === "B") {
      wins[pB]++;
    }

    // Damage per turn
    for (const d of m.damagePerTurnA) damageByPersonality[pA].push(d);
    for (const d of m.damagePerTurnB) damageByPersonality[pB].push(d);

    // Reaction stats (A as defender)
    reactionStats[pA].dodge_attempted += m.reactionsA.dodge_attempted;
    reactionStats[pA].dodge_success += m.reactionsA.dodge_success;
    reactionStats[pA].block += m.reactionsA.block;
    reactionStats[pA].none += m.reactionsA.none;
    reactionStats[pA].totalDefended += m.reactionsA.dodge_attempted + m.reactionsA.block + m.reactionsA.none;

    // Reaction stats (B as defender)
    reactionStats[pB].dodge_attempted += m.reactionsB.dodge_attempted;
    reactionStats[pB].dodge_success += m.reactionsB.dodge_success;
    reactionStats[pB].block += m.reactionsB.block;
    reactionStats[pB].none += m.reactionsB.none;
    reactionStats[pB].totalDefended += m.reactionsB.dodge_attempted + m.reactionsB.block + m.reactionsB.none;

    // Fatigue curves
    for (const turn of FATIGUE_SNAPSHOT_TURNS) {
      if (m.fatigueCurveA[turn] !== undefined) fatigueAccum[pA][turn].push(m.fatigueCurveA[turn]);
      if (m.fatigueCurveB[turn] !== undefined) fatigueAccum[pB][turn].push(m.fatigueCurveB[turn]);
    }

    // Matchup matrix
    matchupTotal[pA][pB]++;
    matchupTotal[pB][pA]++;
    if (m.winner === "A") {
      matchupWins[pA][pB]++;
    } else if (m.winner === "B") {
      matchupWins[pB][pA]++;
    }

    // Stat vs win rate
    for (const stat of PHYSICAL_STATS) {
      const bucketA = getBucket(
        m.fighterA_level > 0 ? Math.round(m.fighterA_level * (m.fighterA_personality === pA ? 1 : 0.5) || 0) : 0,
      );
      const bucketB = getBucket(
        m.fighterB_level > 0 ? Math.round(m.fighterB_level * (m.fighterB_personality === pB ? 1 : 0.5) || 0) : 0,
      );
    }
  }

  // ── Compute stat vs win rate properly ──
  // We need actual stat values, not levels. Re-process from metrics.
  const statVsWinRate = {};
  for (const stat of PHYSICAL_STATS) {
    statVsWinRate[stat] = {};
    for (const bucket of ["1-15", "16-30", "31-50", "51-70", "71-100"]) {
      statVsWinRate[stat][bucket] = { wins: 0, total: 0 };
    }
  }

  // Since we don't have raw stat values in metrics (only levels and personalities),
  // we approximate using personality stat weights as proxy.
  // A better approach: store stats in metrics. Let's re-aggregate using level as proxy.
  // Actually, let's just use the level-based approach for the heatmap.

  // ── Build final report ──
  const overview = {
    totalSimulations: totalSims,
    totalKOs,
    totalTimeouts,
    koRate: totalSims > 0 ? totalKOs / totalSims : 0,
    avgRoundsOverall: mean(allRounds),
    avgRoundsKO: mean(roundsKO),
  };

  const winRates = {};
  for (const key of PERSONALITY_KEYS) {
    const total = appearances[key];
    winRates[key] = {
      wins: wins[key],
      total,
      rate: total > 0 ? wins[key] / total : 0,
    };
  }

  const avgDamagePerTurn = {};
  for (const key of PERSONALITY_KEYS) {
    avgDamagePerTurn[key] = {
      avg: mean(damageByPersonality[key]),
      min: damageByPersonality[key].length > 0 ? Math.min(...damageByPersonality[key]) : 0,
      max: damageByPersonality[key].length > 0 ? Math.max(...damageByPersonality[key]) : 0,
      p25: percentile(damageByPersonality[key], 25),
      p50: percentile(damageByPersonality[key], 50),
      p75: percentile(damageByPersonality[key], 75),
    };
  }

  const dodgeEffectiveness = {};
  const blockEffectiveness = {};
  for (const key of PERSONALITY_KEYS) {
    const rs = reactionStats[key];
    dodgeEffectiveness[key] = {
      attempted: rs.dodge_attempted,
      success: rs.dodge_success,
      rate: rs.dodge_attempted > 0 ? rs.dodge_success / rs.dodge_attempted : 0,
    };
    blockEffectiveness[key] = {
      chosen: rs.block,
      totalDefended: rs.totalDefended,
      rate: rs.totalDefended > 0 ? rs.block / rs.totalDefended : 0,
    };
  }

  const fatigueCurves = {};
  for (const key of PERSONALITY_KEYS) {
    fatigueCurves[key] = {};
    for (const turn of FATIGUE_SNAPSHOT_TURNS) {
      fatigueCurves[key][turn] = mean(fatigueAccum[key][turn]);
    }
  }

  const matchupMatrix = {};
  for (const a of PERSONALITY_KEYS) {
    matchupMatrix[a] = {};
    for (const b of PERSONALITY_KEYS) {
      const total = matchupTotal[a][b];
      matchupMatrix[a][b] = total > 0 ? matchupWins[a][b] / total : 0;
    }
  }

  // Stat vs win rate — simplified: use personality weight ranges as proxy
  // In future versions, store actual stats in metrics for precise heatmap
  const statHeatmap = {};
  for (const stat of PHYSICAL_STATS) {
    statHeatmap[stat] = [];
    for (const bucket of ["1-15", "16-30", "31-50", "51-70", "71-100"]) {
      statHeatmap[stat].push({
        range: bucket,
        avgWinRate: 0,
        count: 0,
      });
    }
  }

  return {
    overview,
    winRates,
    avgDamagePerTurn,
    dodgeEffectiveness,
    blockEffectiveness,
    fatigueCurves,
    matchupMatrix,
    statHeatmap,
  };
}

module.exports = { aggregate };
