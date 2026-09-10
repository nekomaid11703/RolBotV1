// @ts-nocheck
"use strict";

const {
  PERSONALITIES,
  FATIGUE_SNAPSHOT_TURNS,
  PHYSICAL_STATS,
  MAGIC_STATS,
  MATCHED_LEVEL_DIFF_PCT,
  BALANCE_TARGETS,
  MAGIC_HIGH_THRESHOLD,
} = require("./config");

const PERSONALITY_KEYS = Object.keys(PERSONALITIES);
const STAT_BUCKETS = ["1-15", "16-30", "31-50", "51-70", "71-100"];

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
 */
function stddev(arr) {
  if (arr.length === 0) return 0;
  const m = mean(arr);
  const variance = arr.reduce((acc, v) => acc + (v - m) * (v - m), 0) / arr.length;
  return Math.sqrt(variance);
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

/**
 * Aggregate all per-combat metrics into summary statistics aligned with the
 * balance targets (turns, first attacker, meta builds, resource management,
 * data variance, magic contribution).
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
  let draws = 0;
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

  // ── Stat vs win rate (físicas + mágicas) ──
  const statVsWinRate = {};
  for (const stat of [...PHYSICAL_STATS, ...MAGIC_STATS]) {
    statVsWinRate[stat] = {};
    for (const bucket of STAT_BUCKETS) {
      statVsWinRate[stat][bucket] = { wins: 0, total: 0 };
    }
  }

  // ── Target: primer atacante ──
  let firstAttackerWins = 0;

  // ── Target: turnos con nivel/equipo similares ──
  const matchedRounds = [];

  // ── Target: gestión de recursos ──
  const itemUsesList = [];
  const restsList = [];
  const advancesList = [];
  const retreatsList = [];
  const healsList = [];
  let battlesWithItemUse = 0;

  // ── Recursos mágicos de la simulación ──
  const fulgorStartList = [];
  const fulgorLeftList = [];
  const fulgorSpentList = [];
  const fulgorRegenList = [];
  const bateriaStartList = [];
  const meditationsList = [];
  const spellCastsList = [];
  const dilutedCastsList = [];
  let battlesWithSpellCast = 0;

  // ── Target: variación de datos ──
  const equipmentTierCount = {};
  const weaponNatureCount = {};
  const levelBrackets = { "100-199": 0, "200-299": 0, "300-399": 0, "400-500": 0 };
  const atkValues = [];
  const aspdValues = [];
  let weaponPresent = 0;
  let armorPresent = 0;

  // ── Equipo: cobertura, set, amuleto, escudo, tier de arma, naturaleza por nivel ──
  const coverageStats = {};
  const setPiecesStats = {};
  const setBonusStats = { active: { wins: 0, total: 0 }, inactive: { wins: 0, total: 0 } };
  const amuletStats = { with: { wins: 0, total: 0 }, without: { wins: 0, total: 0 } };
  const shieldStats = { with: { wins: 0, total: 0 }, without: { wins: 0, total: 0 } };
  const weaponTierStats = {};
  const weaponMaterialStats = {};
  const weaponMaterialRarityStats = {};
  const armorMaterialStats = {};
  const natureByLevel = {};

  // ── Target: contribución mágica ──
  const magicHigh = {};
  const magicLow = {};
  for (const stat of MAGIC_STATS) {
    magicHigh[stat] = { wins: 0, total: 0 };
    magicLow[stat] = { wins: 0, total: 0 };
  }

  for (const m of allMetrics) {
    const pA = m.fighterA_personality;
    const pB = m.fighterB_personality;

    appearances[pA]++;
    appearances[pB]++;

    if (m.koType === "ko") {
      totalKOs++;
    }
    allRounds.push(m.totalRounds);
    if (m.koType === "ko") roundsKO.push(m.totalRounds);

    if (m.winner === "A") {
      wins[pA]++;
    } else if (m.winner === "B") {
      wins[pB]++;
    } else {
      draws++;
    }

    if (m.winner === "A") firstAttackerWins++;

    const levelDiffPct =
      Math.abs(m.fighterA_level - m.fighterB_level) / Math.max(1, Math.max(m.fighterA_level, m.fighterB_level));
    if (levelDiffPct <= MATCHED_LEVEL_DIFF_PCT && m.fighterA_equipmentTier === m.fighterB_equipmentTier) {
      matchedRounds.push(m.totalRounds);
    }

    for (const d of m.damagePerTurnA) damageByPersonality[pA].push(d);
    for (const d of m.damagePerTurnB) damageByPersonality[pB].push(d);

    reactionStats[pA].dodge_attempted += m.reactionsA.dodge_attempted;
    reactionStats[pA].dodge_success += m.reactionsA.dodge_success;
    reactionStats[pA].block += m.reactionsA.block;
    reactionStats[pA].none += m.reactionsA.none;
    reactionStats[pA].totalDefended += m.reactionsA.dodge_attempted + m.reactionsA.block + m.reactionsA.none;

    reactionStats[pB].dodge_attempted += m.reactionsB.dodge_attempted;
    reactionStats[pB].dodge_success += m.reactionsB.dodge_success;
    reactionStats[pB].block += m.reactionsB.block;
    reactionStats[pB].none += m.reactionsB.none;
    reactionStats[pB].totalDefended += m.reactionsB.dodge_attempted + m.reactionsB.block + m.reactionsB.none;

    for (const turn of FATIGUE_SNAPSHOT_TURNS) {
      if (m.fatigueCurveA[turn] !== undefined) fatigueAccum[pA][turn].push(m.fatigueCurveA[turn]);
      if (m.fatigueCurveB[turn] !== undefined) fatigueAccum[pB][turn].push(m.fatigueCurveB[turn]);
    }

    matchupTotal[pA][pB]++;
    matchupTotal[pB][pA]++;
    if (m.winner === "A") {
      matchupWins[pA][pB]++;
    } else if (m.winner === "B") {
      matchupWins[pB][pA]++;
    }

    const statsA = m.fighterA_stats || {};
    const statsB = m.fighterB_stats || {};
    for (const stat of [...PHYSICAL_STATS, ...MAGIC_STATS]) {
      const bucketA = getBucket(statsA[stat] ?? 0);
      const bucketB = getBucket(statsB[stat] ?? 0);
      statVsWinRate[stat][bucketA].total++;
      statVsWinRate[stat][bucketB].total++;
      if (m.winner === "A") statVsWinRate[stat][bucketA].wins++;
      else if (m.winner === "B") statVsWinRate[stat][bucketB].wins++;
    }

    for (const stat of MAGIC_STATS) {
      const valA = statsA[stat] ?? 0;
      const valB = statsB[stat] ?? 0;
      if (valA >= MAGIC_HIGH_THRESHOLD) magicHigh[stat].total++;
      else magicLow[stat].total++;
      if (valB >= MAGIC_HIGH_THRESHOLD) magicHigh[stat].total++;
      else magicLow[stat].total++;
      if (m.winner === "A") {
        if (valA >= MAGIC_HIGH_THRESHOLD) magicHigh[stat].wins++;
        else magicLow[stat].wins++;
      } else if (m.winner === "B") {
        if (valB >= MAGIC_HIGH_THRESHOLD) magicHigh[stat].wins++;
        else magicLow[stat].wins++;
      }
    }

    itemUsesList.push(m.itemsUsedA + m.itemsUsedB);
    restsList.push(m.restCountA + m.restCountB);
    advancesList.push(m.advancesA + m.advancesB);
    retreatsList.push(m.retreatsA + m.retreatsB);
    healsList.push(m.healTotalA + m.healTotalB);
    if (m.itemsUsedA > 0 || m.itemsUsedB > 0) battlesWithItemUse++;

    const spellCasts = m.fighterA_spellCasts + m.fighterB_spellCasts;
    fulgorStartList.push(m.fighterA_fulgorStart, m.fighterB_fulgorStart);
    fulgorLeftList.push(m.fighterA_fulgorLeft, m.fighterB_fulgorLeft);
    fulgorSpentList.push(m.fighterA_fulgorSpent, m.fighterB_fulgorSpent);
    fulgorRegenList.push(m.fighterA_fulgorRegen || 0, m.fighterB_fulgorRegen || 0);
    bateriaStartList.push(m.fighterA_fulgorPoolMax || 0, m.fighterB_fulgorPoolMax || 0);
    meditationsList.push(m.fighterA_meditations || 0, m.fighterB_meditations || 0);
    spellCastsList.push(m.fighterA_spellCasts, m.fighterB_spellCasts);
    dilutedCastsList.push(m.fighterA_dilutedCasts, m.fighterB_dilutedCasts);
    if (spellCasts > 0) battlesWithSpellCast++;

    for (const tier of [m.fighterA_equipmentTier, m.fighterB_equipmentTier]) {
      equipmentTierCount[tier] = (equipmentTierCount[tier] || 0) + 1;
    }
    for (const nature of [m.fighterA_weaponNature, m.fighterB_weaponNature]) {
      weaponNatureCount[nature] = (weaponNatureCount[nature] || 0) + 1;
      if (nature !== "desarmado") weaponPresent++;
    }
    for (const armor of [m.fighterA_armorBonusDef, m.fighterB_armorBonusDef]) {
      if (armor > 0) armorPresent++;
    }
    for (const side of ["A", "B"]) {
      const prefix = `fighter${side}`;
      const won = m.winner === side;

      const cov = m[`${prefix}_coverage`] || "ninguna";
      coverageStats[cov] = coverageStats[cov] || { wins: 0, total: 0 };
      coverageStats[cov].total++;
      if (won) coverageStats[cov].wins++;

      const sp = m[`${prefix}_setPieces`] || 0;
      const spKey = sp >= 3 ? "3+" : sp > 0 ? `1-2` : "0";
      setPiecesStats[spKey] = setPiecesStats[spKey] || { wins: 0, total: 0 };
      setPiecesStats[spKey].total++;
      if (won) setPiecesStats[spKey].wins++;

      const sbKey = m[`${prefix}_setBonusActive`] ? "active" : "inactive";
      setBonusStats[sbKey].total++;
      if (won) setBonusStats[sbKey].wins++;

      const amKey = m[`${prefix}_amulet`] ? "with" : "without";
      amuletStats[amKey].total++;
      if (won) amuletStats[amKey].wins++;

      const shKey = m[`${prefix}_shield`] ? "with" : "without";
      shieldStats[shKey].total++;
      if (won) shieldStats[shKey].wins++;

      const wt = m[`${prefix}_weaponTier`] || "desarmado";
      weaponTierStats[wt] = weaponTierStats[wt] || { wins: 0, total: 0 };
      weaponTierStats[wt].total++;
      if (won) weaponTierStats[wt].wins++;

      const wmat = m[`${prefix}_weaponMaterial`] || "desarmado";
      weaponMaterialStats[wmat] = weaponMaterialStats[wmat] || { wins: 0, total: 0 };
      weaponMaterialStats[wmat].total++;
      if (won) weaponMaterialStats[wmat].wins++;

      const wmatRarity = m[`${prefix}_weaponMaterialRarity`] || "ninguno";
      weaponMaterialRarityStats[wmatRarity] = weaponMaterialRarityStats[wmatRarity] || { wins: 0, total: 0 };
      weaponMaterialRarityStats[wmatRarity].total++;
      if (won) weaponMaterialRarityStats[wmatRarity].wins++;

      const amat = m[`${prefix}_armorMaterial`] || "ninguno";
      armorMaterialStats[amat] = armorMaterialStats[amat] || { wins: 0, total: 0 };
      armorMaterialStats[amat].total++;
      if (won) armorMaterialStats[amat].wins++;

      const lvl = m[`${prefix}_level`];
      const bracket = lvl < 200 ? "100-199" : lvl < 300 ? "200-299" : lvl < 400 ? "300-399" : "400-500";
      natureByLevel[bracket] = natureByLevel[bracket] || {};
      const nat = m[`${prefix}_weaponNature`] || "desarmado";
      natureByLevel[bracket][nat] = (natureByLevel[bracket][nat] || 0) + 1;
    }
    for (const lvl of [m.fighterA_level, m.fighterB_level]) {
      if (lvl < 200) levelBrackets["100-199"]++;
      else if (lvl < 300) levelBrackets["200-299"]++;
      else if (lvl < 400) levelBrackets["300-399"]++;
      else levelBrackets["400-500"]++;
    }
    atkValues.push(statsA.atk ?? 0, statsB.atk ?? 0);
    aspdValues.push(statsA.aspd ?? 0, statsB.aspd ?? 0);
  }

  const totalFighters = totalSims * 2;

  // ── Overview ──
  const overview = {
    totalSimulations: totalSims,
    totalKOs,
    totalTimeouts: totalSims - totalKOs,
    draws,
    koRate: totalSims > 0 ? totalKOs / totalSims : 0,
    avgRoundsOverall: mean(allRounds),
    avgRoundsKO: mean(roundsKO),
    roundsP50: percentile(allRounds, 50),
    roundsP90: percentile(allRounds, 90),
    roundsMax: allRounds.length > 0 ? Math.max(...allRounds) : 0,
  };

  // ── Win rates ──
  const winRates = {};
  let metaWinrate = 0;
  let metaPersonality = null;
  for (const key of PERSONALITY_KEYS) {
    const total = appearances[key];
    const rate = total > 0 ? wins[key] / total : 0;
    winRates[key] = { wins: wins[key], total, rate };
    if (rate > metaWinrate) {
      metaWinrate = rate;
      metaPersonality = key;
    }
  }

  // ── Primer atacante ──
  const firstAttacker = {
    wins: firstAttackerWins,
    draws,
    total: totalSims,
    winrate: totalSims > 0 ? firstAttackerWins / totalSims : 0,
    advantage: totalSims > 0 ? firstAttackerWins / totalSims - 0.5 : 0,
  };

  // ── Turnos con nivel/equipo similares ──
  const matched = {
    count: matchedRounds.length,
    avgRounds: mean(matchedRounds),
    roundsP50: percentile(matchedRounds, 50),
    roundsP90: percentile(matchedRounds, 90),
  };

  // ── Daño por turno ──
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

  // ── Dodge / Block ──
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

  // ── Curvas de fatiga ──
  const fatigueCurves = {};
  for (const key of PERSONALITY_KEYS) {
    fatigueCurves[key] = {};
    for (const turn of FATIGUE_SNAPSHOT_TURNS) {
      fatigueCurves[key][turn] = mean(fatigueAccum[key][turn]);
    }
  }

  // ── Matchup matrix ──
  const matchupMatrix = {};
  for (const a of PERSONALITY_KEYS) {
    matchupMatrix[a] = {};
    for (const b of PERSONALITY_KEYS) {
      const total = matchupTotal[a][b];
      matchupMatrix[a][b] = total > 0 ? matchupWins[a][b] / total : 0;
    }
  }

  // ── Stat heatmap (valores reales de stats) ──
  const statHeatmap = {};
  for (const stat of [...PHYSICAL_STATS, ...MAGIC_STATS]) {
    statHeatmap[stat] = STAT_BUCKETS.map((bucket) => {
      const cell = statVsWinRate[stat][bucket];
      return {
        range: bucket,
        avgWinRate: cell.total > 0 ? cell.wins / cell.total : 0,
        count: cell.total,
      };
    });
  }

  // ── Gestión de recursos ──
  const resources = {
    avgItemsPerBattle: mean(itemUsesList),
    battlesWithItemUseRate: totalSims > 0 ? battlesWithItemUse / totalSims : 0,
    avgHealPerBattle: mean(healsList),
    avgRestsPerBattle: mean(restsList),
    avgAdvancesPerBattle: mean(advancesList),
    avgRetreatsPerBattle: mean(retreatsList),
    battlesWithMovement: 0,
    itemsP50: percentile(itemUsesList, 50),
    restsP50: percentile(restsList, 50),
  };

  // ── Recursos mágicos ──
  const totalSpellCasts = spellCastsList.reduce((sum, casts) => sum + casts, 0);
  const totalDilutedCasts = dilutedCastsList.reduce((sum, casts) => sum + casts, 0);
  const magicResources = {
    avgFulgorStartPerFighter: mean(fulgorStartList),
    avgBateriaStartPerFighter: mean(bateriaStartList),
    avgFulgorLeftPerFighter: mean(fulgorLeftList),
    avgFulgorSpentPerFighter: mean(fulgorSpentList),
    avgFulgorRegenPerFighter: mean(fulgorRegenList),
    avgMeditationsPerFighter: mean(meditationsList),
    avgSpellCastsPerFighter: mean(spellCastsList),
    avgDilutedCastsPerFighter: mean(dilutedCastsList),
    battlesWithSpellCastRate: totalSims > 0 ? battlesWithSpellCast / totalSims : 0,
    dilutedCastRate: totalSpellCasts > 0 ? totalDilutedCasts / totalSpellCasts : 0,
  };

  // ── Variación de datos ──
  const variance = {
    equipmentTier: {},
    weaponPresenceRate: totalFighters > 0 ? weaponPresent / totalFighters : 0,
    armorPresenceRate: totalFighters > 0 ? armorPresent / totalFighters : 0,
    weaponNature: weaponNatureCount,
    levelBrackets,
    atkSpread: stddev(atkValues),
    aspdSpread: stddev(aspdValues),
    atkAvg: mean(atkValues),
    aspdAvg: mean(aspdValues),
  };
  for (const tier of Object.keys(equipmentTierCount)) {
    variance.equipmentTier[tier] = {
      count: equipmentTierCount[tier],
      rate: totalFighters > 0 ? equipmentTierCount[tier] / totalFighters : 0,
    };
  }

  // ── Equipo: cobertura, set, amuleto, escudo, tier de arma, naturaleza por nivel ──
  function toWinRate(acc) {
    const out = {};
    for (const [key, cell] of Object.entries(acc)) {
      out[key] = { count: cell.total, winrate: cell.total > 0 ? cell.wins / cell.total : 0 };
    }
    return out;
  }
  variance.coverage = toWinRate(coverageStats);
  variance.setPieces = toWinRate(setPiecesStats);
  variance.setBonus = toWinRate(setBonusStats);
  variance.amulet = toWinRate(amuletStats);
  variance.shield = toWinRate(shieldStats);
  variance.weaponTier = toWinRate(weaponTierStats);
  variance.weaponMaterial = toWinRate(weaponMaterialStats);
  variance.weaponMaterialRarity = toWinRate(weaponMaterialRarityStats);
  variance.armorMaterial = toWinRate(armorMaterialStats);
  variance.natureByLevel = natureByLevel;

  // ── Contribución mágica ──
  const magicContribution = {};
  for (const stat of MAGIC_STATS) {
    magicContribution[stat] = {
      highWinrate: magicHigh[stat].total > 0 ? magicHigh[stat].wins / magicHigh[stat].total : 0,
      highCount: magicHigh[stat].total,
      lowWinrate: magicLow[stat].total > 0 ? magicLow[stat].wins / magicLow[stat].total : 0,
      lowCount: magicLow[stat].total,
      difference: 0,
    };
    magicContribution[stat].difference = magicContribution[stat].highWinrate - magicContribution[stat].lowWinrate;
  }

  // ── Validación de targets ──
  const targets = [
    {
      key: "avgTurnsMatched",
      label: BALANCE_TARGETS.avgTurnsMatched.label,
      target: BALANCE_TARGETS.avgTurnsMatched.target,
      tolerance: BALANCE_TARGETS.avgTurnsMatched.tolerance,
      value: matched.avgRounds,
      pass:
        Math.abs(matched.avgRounds - BALANCE_TARGETS.avgTurnsMatched.target) <=
        BALANCE_TARGETS.avgTurnsMatched.tolerance,
    },
    {
      key: "firstAttackerWinrate",
      label: BALANCE_TARGETS.firstAttackerWinrate.label,
      target: BALANCE_TARGETS.firstAttackerWinrate.target,
      tolerance: BALANCE_TARGETS.firstAttackerWinrate.tolerance,
      value: firstAttacker.advantage,
      pass:
        Math.abs(firstAttacker.advantage) <=
        BALANCE_TARGETS.firstAttackerWinrate.target + BALANCE_TARGETS.firstAttackerWinrate.tolerance,
    },
    {
      key: "metaWinrate",
      label: BALANCE_TARGETS.metaWinrate.label,
      target: BALANCE_TARGETS.metaWinrate.target,
      tolerance: BALANCE_TARGETS.metaWinrate.tolerance,
      value: metaWinrate,
      pass: metaWinrate <= BALANCE_TARGETS.metaWinrate.target + BALANCE_TARGETS.metaWinrate.tolerance,
    },
  ];

  return {
    overview,
    winRates,
    meta: { winrate: metaWinrate, personality: metaPersonality },
    firstAttacker,
    matched,
    avgDamagePerTurn,
    dodgeEffectiveness,
    blockEffectiveness,
    fatigueCurves,
    matchupMatrix,
    statHeatmap,
    resources,
    magicResources,
    variance,
    magicContribution,
    targets,
  };
}

module.exports = { aggregate };
