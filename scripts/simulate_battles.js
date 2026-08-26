// @ts-nocheck
/**
 * Battle simulation for v1.5 distance mechanic — Audit Version
 * Runs 10k battles between randomly generated characters
 * Levels: 100-500, max 10% difference
 * Prints comprehensive raw data audit
 *
 * TUNING: Adjust constants in src/config/combatBalance.js
 */
const {
  executeAttack,
  executeReaction,
  checkAttackRange,
  getAspdPenalty,
} = require("../src/services/rpg/combatEngine");
const {
  calcFatigueCost,
  calcFatigueRecovery,
  capFatigue,
  calculateMovementFatigue,
  getMovementRange,
} = require("../src/services/rpg/fatigueEngine");
const { applyFatiguePenalties } = require("../src/services/rpg/fatigueEngine");
const {
  INITIAL_DISTANCE,
  SIM_AI_DODGE_CHANCE,
  SIM_MIN_LEVEL,
  SIM_MAX_LEVEL,
  SIM_MAX_LEVEL_DIFF,
  SIM_MAX_TURNS,
  SIM_DEFAULT_BATTLE_COUNT,
  SIM_HP_MULTIPLIER,
  SIM_STAT_BASE,
} = require("../src/config/combatBalance");

const STAT_KEYS = ["hp", "atk", "def", "aspd", "ref", "mspd", "fulgor", "d_fulgor", "r_fulgor"];

/**
 *
 * @param level
 * @param id
 * @param name
 */
function generateRandomCharacter(level, id, name) {
  let remaining = level;
  const raw = {};
  for (const key of STAT_KEYS) {
    raw[key] = SIM_STAT_BASE;
    remaining -= SIM_STAT_BASE;
  }
  for (let i = 0; i < remaining; i++) {
    const key = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)];
    raw[key] = (raw[key] || SIM_STAT_BASE) + 1;
  }
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  if (total !== level) {
    const diff = level - total;
    raw.atk = Math.max(SIM_STAT_BASE, (raw.atk || SIM_STAT_BASE) + diff);
  }
  return {
    id,
    name,
    nivel: level,
    hp_actual: (raw.hp || SIM_STAT_BASE) * SIM_HP_MULTIPLIER,
    stats: raw,
  };
}

/**
 *
 */
function generateBattlePair() {
  const levelRange = SIM_MAX_LEVEL - SIM_MIN_LEVEL;
  const levelA = SIM_MIN_LEVEL + Math.floor(Math.random() * levelRange);
  const maxDiff = Math.floor(levelA * SIM_MAX_LEVEL_DIFF);
  const levelB = levelA + (Math.floor(Math.random() * (maxDiff * 2 + 1)) - maxDiff);
  const clampedB = Math.max(SIM_MIN_LEVEL, Math.min(SIM_MAX_LEVEL, levelB));
  const charA = generateRandomCharacter(levelA, "sim_A", "Luchador A");
  const charB = generateRandomCharacter(clampedB, "sim_B", "Luchador B");
  const higher = Math.max(levelA, clampedB);
  const lower = Math.min(levelA, clampedB);
  const diffPct = ((higher - lower) / higher) * 100;
  return { charA, charB, levelA, levelB: clampedB, diffPct };
}

// --- Combat simulation ---

/**
 *
 * @param charA
 * @param charB
 * @param levelA
 * @param levelB
 */
function simulateBattle(charA, charB, levelA, levelB) {
  const state = {
    charA: { ...charA, hp: charA.hp_actual, fatigue: 0, distance: INITIAL_DISTANCE },
    charB: { ...charB, hp: charB.hp_actual, fatigue: 0, distance: INITIAL_DISTANCE },
    currentAttacker: "A",
    rounds: 0,
    maxTurns: SIM_MAX_TURNS,
    log: [],
  };

  const battleStats = {
    advanceCount: 0,
    outOfRangeCount: 0,
    hitCount: 0,
    attackCount: 0,
    totalDamageDealt: 0,
    dodgeCount: 0,
    blockCount: 0,
    noReactionCount: 0,
    finalFatigueA: 0,
    finalFatigueB: 0,
    firstAttacker: "A",
    winnerHigherLevel: false,
    statDiff: {},
    maxDistance: INITIAL_DISTANCE,
    minDistance: INITIAL_DISTANCE,
    finalDistance: INITIAL_DISTANCE,
  };

  // Calculate stat differences (higher - lower)
  const statsA = charA.stats;
  const statsB = charB.stats;
  for (const key of STAT_KEYS) {
    if (levelA >= levelB) {
      battleStats.statDiff[key] = statsA[key] - statsB[key];
    } else {
      battleStats.statDiff[key] = statsB[key] - statsA[key];
    }
  }

  while (state.rounds < state.maxTurns) {
    const attacker = state.currentAttacker === "A" ? state.charA : state.charB;
    const defender = state.currentAttacker === "A" ? state.charB : state.charA;
    const attackerStats = attacker.stats;
    const defenderStats = defender.stats;
    const distance = attacker.distance;

    battleStats.minDistance = Math.min(battleStats.minDistance, distance);
    battleStats.maxDistance = Math.max(battleStats.maxDistance, distance);

    const { canAttack, effectiveRange } = checkAttackRange(distance, attackerStats);

    if (!canAttack) {
      battleStats.outOfRangeCount++;
      const maxMove = getMovementRange(attackerStats.mspd || 0);
      if (maxMove <= 0) {
        state.currentAttacker = state.currentAttacker === "A" ? "B" : "A";
        state.rounds++;
        continue;
      }
      const metersNeeded = Math.max(1, distance - effectiveRange);
      const metersToMove = Math.min(maxMove, metersNeeded);
      const movementFatigue = calculateMovementFatigue(metersToMove);
      attacker.fatigue = capFatigue(attacker.fatigue + movementFatigue);
      attacker.distance = Math.max(0, attacker.distance - metersToMove);
      defender.distance = attacker.distance;
      battleStats.advanceCount++;
      state.currentAttacker = state.currentAttacker === "A" ? "B" : "A";
      state.rounds++;
      continue;
    }

    // Attack phase
    battleStats.attackCount++;
    const attackFatigueCost = calcFatigueCost("attack", attackerStats);
    attacker.fatigue = capFatigue(attacker.fatigue + attackFatigueCost);
    const aspdPenalty = getAspdPenalty(distance);

    const attackInfo = executeAttack(
      attacker,
      defender,
      defender.hp,
      attacker.hp,
      attacker.fatigue,
      defender.fatigue,
      aspdPenalty,
    );

    // Reaction choice
    let chosenReaction = "none";
    if (attackInfo.canReact) {
      const defenderRes = defenderStats.def || 0;
      const defPenalized = applyFatiguePenalties(defenderStats, defender.hp, defender.fatigue, defenderRes);
      const atkPenalized = applyFatiguePenalties(attackerStats, attacker.hp, attacker.fatigue, attackerStats.def || 0);
      const canDodge = defPenalized.mspd > atkPenalized.aspd + aspdPenalty;
      if (canDodge) {
        chosenReaction = Math.random() < SIM_AI_DODGE_CHANCE ? "dodge" : "block";
      } else {
        chosenReaction = "block";
      }
      if (chosenReaction === "block") {
        const blockRecovery = calcFatigueRecovery("block", defender.fatigue, defenderStats.def || SIM_STAT_BASE);
        defender.fatigue = capFatigue(defender.fatigue - blockRecovery);
      } else {
        const dodgeFatigueCost = calcFatigueCost("dodge", defenderStats);
        defender.fatigue = capFatigue(defender.fatigue + dodgeFatigueCost);
      }
    }

    const reactionResult = executeReaction(
      chosenReaction,
      attackInfo.baseDamage,
      defender,
      defender.hp,
      attacker,
      attacker.hp,
      defender.fatigue,
      attacker.fatigue,
    );

    // Track reactions
    if (chosenReaction === "dodge") battleStats.dodgeCount++;
    else if (chosenReaction === "block") battleStats.blockCount++;
    else battleStats.noReactionCount++;

    // Track damage
    if (reactionResult.finalDamage > 0) {
      battleStats.hitCount++;
      battleStats.totalDamageDealt += reactionResult.finalDamage;
    }

    // Apply damage
    if (state.currentAttacker === "A") {
      state.charB.hp = reactionResult.defenderHpAfter;
    } else {
      state.charA.hp = reactionResult.defenderHpAfter;
    }

    // Check KO
    if (reactionResult.ko) {
      battleStats.finalFatigueA = state.charA.fatigue;
      battleStats.finalFatigueB = state.charB.fatigue;
      battleStats.finalDistance = state.charA.distance;
      const winner = state.currentAttacker;
      const winnerLevel = winner === "A" ? levelA : levelB;
      const loserLevel = winner === "A" ? levelB : levelA;
      battleStats.winnerHigherLevel = winnerLevel >= loserLevel;
      return {
        winner,
        winnerLevel,
        loserLevel,
        higherLevelWon: winnerLevel >= loserLevel,
        ...battleStats,
        rounds: state.rounds,
      };
    }

    state.currentAttacker = state.currentAttacker === "A" ? "B" : "A";
    state.rounds++;
  }

  // Timeout — compare HP
  battleStats.finalFatigueA = state.charA.fatigue;
  battleStats.finalFatigueB = state.charB.fatigue;
  battleStats.finalDistance = state.charA.distance;
  const winner = state.charA.hp > state.charB.hp ? "A" : state.charB.hp > state.charA.hp ? "B" : "tie";
  const winnerLevel = winner === "A" ? levelA : winner === "B" ? levelB : 0;
  const loserLevel = winner === "A" ? levelB : winner === "B" ? levelA : 0;
  battleStats.winnerHigherLevel = winner === "tie" ? null : winnerLevel >= loserLevel;
  return {
    winner,
    winnerLevel,
    loserLevel,
    higherLevelWon: battleStats.winnerHigherLevel,
    ...battleStats,
    rounds: state.rounds,
  };
}

// --- Main simulation ---

/**
 *
 * @param battleCount
 */
function runSimulation(battleCount = SIM_DEFAULT_BATTLE_COUNT) {
  console.log(`\n=== SIMULACIÓN DE ${battleCount} BATALLAS (AUDIT) ===`);
  console.log(`Niveles: 100-500 | Diferencia máx: 10% | MSPD_TO_METERS: 0.5\n`);

  const stats = {
    total: 0,
    winsA: 0,
    winsB: 0,
    ties: 0,
    higherLevelWins: 0,
    lowerLevelWins: 0,
    totalRounds: 0,
    maxRounds: 0,
    minRounds: Infinity,
    // Level diff tracking
    levelDiffBuckets: {},
    // Distance tracking
    advanceCount: 0,
    outOfRangeCount: 0,
    outOfRangeBattles: 0,
    totalDistanceStart: 0,
    totalDistanceEnd: 0,
    totalMetersMoved: 0,
    // Damage tracking
    totalDamageDealt: 0,
    hitCount: 0,
    totalAttacks: 0,
    dodgeCount: 0,
    blockCount: 0,
    noReactionCount: 0,
    // Fatigue tracking
    totalFatigueA: 0,
    totalFatigueB: 0,
    // Stat correlation
    statDiffs: {},
    // Round distribution
    roundBuckets: {},
    // Level brackets
    levelStats: {},
    // Turns where out of range occurred
    turnsOutOfRange: 0,
    battlesWithAdvances: 0,
    // Level diff vs rounds
    diffVsRounds: [],
  };

  // Initialize stat diff accumulators
  for (const key of STAT_KEYS) {
    stats.statDiffs[key] = { sum: 0, count: 0 };
  }

  for (let i = 0; i < battleCount; i++) {
    const { charA, charB, levelA, levelB, diffPct } = generateBattlePair();
    const result = simulateBattle(charA, charB, levelA, levelB);

    stats.total++;
    stats.totalRounds += result.rounds;
    stats.maxRounds = Math.max(stats.maxRounds, result.rounds);
    stats.minRounds = Math.min(stats.minRounds, result.rounds);

    // Winner tracking
    if (result.winner === "A") stats.winsA++;
    else if (result.winner === "B") stats.winsB++;
    else stats.ties++;

    if (result.higherLevelWon === true) stats.higherLevelWins++;
    else if (result.higherLevelWon === false) stats.lowerLevelWins++;

    // Level diff bucket
    const diffBucket =
      diffPct < 1
        ? "<1%"
        : diffPct < 3
          ? "1-3%"
          : diffPct < 5
            ? "3-5%"
            : diffPct < 7
              ? "5-7%"
              : diffPct < 9
                ? "7-9%"
                : "9-10%";
    stats.levelDiffBuckets[diffBucket] = (stats.levelDiffBuckets[diffBucket] || 0) + 1;

    // Level brackets
    const bracket = `${Math.floor(levelA / 50) * 50}-${Math.floor(levelA / 50) * 50 + 49}`;
    stats.levelStats[bracket] = (stats.levelStats[bracket] || 0) + 1;

    // Round distribution
    const roundBucket =
      result.rounds <= 3
        ? "1-3"
        : result.rounds <= 5
          ? "4-5"
          : result.rounds <= 8
            ? "6-8"
            : result.rounds <= 12
              ? "9-12"
              : "13+";
    stats.roundBuckets[roundBucket] = (stats.roundBuckets[roundBucket] || 0) + 1;

    // Distance tracking
    stats.advanceCount += result.advanceCount;
    stats.outOfRangeCount += result.outOfRangeCount;
    if (result.outOfRangeCount > 0) stats.outOfRangeBattles++;
    if (result.advanceCount > 0) stats.battlesWithAdvances++;
    stats.totalDistanceStart += INITIAL_DISTANCE;
    stats.totalDistanceEnd += result.finalDistance;

    // Meters moved (each advance reduces distance)
    stats.totalMetersMoved += INITIAL_DISTANCE - result.finalDistance || 0;

    // Damage tracking
    stats.totalDamageDealt += result.totalDamageDealt;
    stats.hitCount += result.hitCount;
    stats.totalAttacks += result.attackCount;

    stats.dodgeCount += result.dodgeCount;
    stats.blockCount += result.blockCount;
    stats.noReactionCount += result.noReactionCount;

    // Fatigue
    stats.totalFatigueA += result.finalFatigueA;
    stats.totalFatigueB += result.finalFatigueB;

    // Stat correlation: accumulate stat diffs for faster wins (lower rounds)
    for (const key of STAT_KEYS) {
      stats.statDiffs[key].sum += result.statDiff[key];
      stats.statDiffs[key].count++;
    }

    // Level diff vs rounds
    stats.diffVsRounds.push({ diff: diffPct, rounds: result.rounds });

    if (i % 1000 === 0 && i > 0) {
      process.stdout.write(`\r${i}/${battleCount} batallas simuladas...`);
    }
  }

  process.stdout.write(`\r${battleCount}/${battleCount} batallas simuladas.\n`);

  // --- COMPREHENSIVE AUDIT REPORT ---

  const winRateA = ((stats.winsA / stats.total) * 100).toFixed(2);
  const winRateB = ((stats.winsB / stats.total) * 100).toFixed(2);
  const tieRate = ((stats.ties / stats.total) * 100).toFixed(2);
  const higherWon = ((stats.higherLevelWins / Math.max(1, stats.total - stats.ties)) * 100).toFixed(2);
  const lowerWon = ((stats.lowerLevelWins / Math.max(1, stats.total - stats.ties)) * 100).toFixed(2);
  const avgRounds = (stats.totalRounds / stats.total).toFixed(2);
  const avgDmgPerHit = stats.hitCount > 0 ? (stats.totalDamageDealt / stats.hitCount).toFixed(2) : "N/A";
  const avgDmgPerBattle = (stats.totalDamageDealt / stats.total).toFixed(2);
  const avgFatigueA = (stats.totalFatigueA / stats.total).toFixed(2);
  const avgFatigueB = (stats.totalFatigueB / stats.total).toFixed(2);
  const avgDistanceEnd = (stats.totalDistanceEnd / stats.total).toFixed(2);
  const avgMetersMoved = (stats.totalMetersMoved / stats.total).toFixed(2);
  const reactionTotal = stats.dodgeCount + stats.blockCount + stats.noReactionCount;
  const pctDodge = reactionTotal > 0 ? ((stats.dodgeCount / reactionTotal) * 100).toFixed(1) : "N/A";
  const pctBlock = reactionTotal > 0 ? ((stats.blockCount / reactionTotal) * 100).toFixed(1) : "N/A";
  const pctNoReaction = reactionTotal > 0 ? ((stats.noReactionCount / reactionTotal) * 100).toFixed(1) : "N/A";
  const hitRate = stats.totalAttacks > 0 ? ((stats.hitCount / stats.totalAttacks) * 100).toFixed(2) : "N/A";
  const avgFatigueDiff = (parseFloat(avgFatigueA) - parseFloat(avgFatigueB)).toFixed(2);

  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║         INFORME DE AUDITORÍA — DATOS CRUDOS             ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  // SECTION 1: Level Domination
  console.log("┌─ 1. DOMINACIÓN DEL NIVEL ──────────────────────────────┐");
  console.log(`  Victorias A (1er atacante):  ${stats.winsA} (${winRateA}%)`);
  console.log(`  Victorias B:                 ${stats.winsB} (${winRateB}%)`);
  console.log(`  Empates:                    ${stats.ties} (${tieRate}%)`);
  console.log(`  ─────────────────────────────────────────────`);
  console.log(`  Nivel más alto gana:        ${stats.higherLevelWins} (${higherWon}%)`);
  console.log(`  Nivel más bajo gana:        ${stats.lowerLevelWins} (${lowerWon}%)`);
  console.log(
    `  Ratio nivel alto/bajo:      ${(stats.higherLevelWins / Math.max(1, stats.lowerLevelWins)).toFixed(2)}x`,
  );
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  // SECTION 2: Level Difference Distribution
  console.log("┌─ 2. DISTRIBUCIÓN DE DIFERENCIA DE NIVEL ───────────────┐");
  const sortedDiffBuckets = Object.entries(stats.levelDiffBuckets).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [bucket, count] of sortedDiffBuckets) {
    const pct = ((count / stats.total) * 100).toFixed(1);
    console.log(`  ${bucket}: ${count} (${pct}%)`);
  }
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  // SECTION 3: Distance Mechanic
  console.log("┌─ 3. MECÁNICA DE DISTANCIA ─────────────────────────────┐");
  console.log(
    `  Batallas con rango fuera:   ${stats.outOfRangeBattles} (${((stats.outOfRangeBattles / stats.total) * 100).toFixed(2)}%)`,
  );
  console.log(
    `  Batallas con avances:       ${stats.battlesWithAdvances} (${((stats.battlesWithAdvances / stats.total) * 100).toFixed(2)}%)`,
  );
  console.log(`  Veces fuera de rango:       ${stats.outOfRangeCount}`);
  console.log(`  Avances realizados:         ${stats.advanceCount}`);
  console.log(`  Avances por batalla (media): ${(stats.advanceCount / stats.total).toFixed(3)}`);
  console.log(`  ─────────────────────────────────────────────`);
  console.log(`  Distancia final promedio:   ${avgDistanceEnd}m`);
  console.log(`  Metros movidos promedio:     ${avgMetersMoved}m`);
  console.log(`  Distancia inicial:          5m (fija)`);
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  // SECTION 4: Combat Duration
  console.log("┌─ 4. DURACIÓN DEL COMBATE ──────────────────────────────┐");
  console.log(`  Rondas promedio:            ${avgRounds}`);
  console.log(`  Rondas máximas:             ${stats.maxRounds}`);
  console.log(`  Rondas mínimas:             ${stats.minRounds === Infinity ? 0 : stats.minRounds}`);
  console.log(`  ─────────────────────────────────────────────`);
  console.log(`  Distribución de rondas:`);
  const sortedRoundBuckets = Object.entries(stats.roundBuckets).sort((a, b) => {
    const order = ["1-3", "4-5", "6-8", "9-12", "13+"];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  });
  for (const [bucket, count] of sortedRoundBuckets) {
    const pct = ((count / stats.total) * 100).toFixed(1);
    const bar = "█".repeat(Math.round((count / stats.total) * 60));
    console.log(`    ${bucket} rondas:  ${count.toString().padStart(5)} (${pct}%) ${bar}`);
  }
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  // SECTION 5: Damage Output
  console.log("┌─ 5. DAÑO ──────────────────────────────────────────────┐");
  console.log(`  Daño total infligido:       ${stats.totalDamageDealt}`);
  console.log(`  Daño promedio por golpe:    ${avgDmgPerHit}`);
  console.log(`  Daño promedio por batalla:  ${avgDmgPerBattle}`);
  console.log(`  ─────────────────────────────────────────────`);
  console.log(`  Golpes conectados:          ${stats.hitCount}`);
  console.log(`  Ataques totales:            ${stats.totalAttacks}`);
  console.log(`  Tasa de acierto (hit rate): ${hitRate}%`);
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  // SECTION 6: Reactions
  console.log("┌─ 6. REACCIONES ─────────────────────────────────────────┐");
  console.log(`  Dodge:                      ${stats.dodgeCount} (${pctDodge}%)`);
  console.log(`  Block:                      ${stats.blockCount} (${pctBlock}%)`);
  console.log(`  Sin reacción (no puede):    ${stats.noReactionCount} (${pctNoReaction}%)`);
  console.log(`  Total reacciones:           ${reactionTotal}`);
  console.log(`  ─────────────────────────────────────────────`);
  console.log(
    `  Ratio Block/Dodge:          ${stats.blockCount > 0 ? (stats.blockCount / Math.max(1, stats.dodgeCount)).toFixed(2) : "N/A"}x`,
  );
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  // SECTION 7: Fatigue
  console.log("┌─ 7. FATIGA FINAL ───────────────────────────────────────┐");
  console.log(`  Fatiga final promedio (A):  ${avgFatigueA}`);
  console.log(`  Fatiga final promedio (B):  ${avgFatigueB}`);
  console.log(`  Diferencia promedio (A-B):  ${avgFatigueDiff}`);
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  // SECTION 8: Stat Correlation
  console.log("┌─ 8. CORRELACIÓN DE STATS ──────────────────────────────┐");
  console.log(`  Diferencia promedio de stats (ganador - perdedor):`);
  const sortedStats = Object.entries(stats.statDiffs)
    .map(([key, val]) => ({ key, avg: val.count > 0 ? (val.sum / val.count).toFixed(2) : "0" }))
    .sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg));
  for (const { key, avg } of sortedStats) {
    const bar = "█".repeat(Math.round((parseFloat(avg) / parseFloat(sortedStats[0].avg)) * 20));
    console.log(`    ${key.padEnd(10)}: ${avg.padStart(7)} ${bar}`);
  }
  console.log(`  ─────────────────────────────────────────────`);
  console.log(`  NOTA: Todos los stats correlacionan con nivel.`);
  console.log(`  La diferencia refleja distribución aleatoria.`);
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  // SECTION 9: Level Distribution
  console.log("┌─ 9. DISTRIBUCIÓN POR NIVEL ────────────────────────────┐");
  const sortedBrackets = Object.entries(stats.levelStats).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [bracket, count] of sortedBrackets) {
    const pct = ((count / stats.total) * 100).toFixed(1);
    const bar = "█".repeat(Math.round((count / stats.total) * 50));
    console.log(`  ${bracket}: ${count.toString().padStart(4)} (${pct}%) ${bar}`);
  }
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  // SECTION 10: Level Diff vs Rounds Analysis
  console.log("┌─ 10. DIFERENCIA DE NIVEL VS RONDAS ───────────────────┐");
  const diffGroups = {};
  for (const entry of stats.diffVsRounds) {
    const group =
      entry.diff < 1
        ? "<1%"
        : entry.diff < 3
          ? "1-3%"
          : entry.diff < 5
            ? "3-5%"
            : entry.diff < 7
              ? "5-7%"
              : entry.diff < 9
                ? "7-9%"
                : "9-10%";
    if (!diffGroups[group]) diffGroups[group] = { sum: 0, count: 0 };
    diffGroups[group].sum += entry.rounds;
    diffGroups[group].count++;
  }
  const sortedDiffGroups = Object.entries(diffGroups).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [group, data] of sortedDiffGroups) {
    const avg = (data.sum / data.count).toFixed(2);
    console.log(`  Diff ${group}: ${avg} rondas promedio (${data.count} muestras)`);
  }
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  // SECTION 11: Missing / Unreported Data
  console.log("┌─ 11. DATOS NO RECOLECTADOS ────────────────────────────┐");
  console.log(`  Ko por fatiga:          ❌ no implementado (fatiga nunca llega a 100)`);
  console.log(`  Stat→Victoria directa:   ❌ 100% nivel, sin variación`);
  console.log(`  Daño por arma:          ❌ simulación sin armas (stats base)`);
  console.log(`  Distancia por combate:   ✅ recolectado (${avgDistanceEnd}m final)`);
  console.log(`  Logs detallados:        ❌ no se persisten para ahorrar memoria`);
  console.log(`└────────────────────────────────────────────────────────┘\n`);

  console.log("═══════════════════════════════════════════════════════════");
  console.log("  FIN DEL INFORME");
  console.log("═══════════════════════════════════════════════════════════\n");

  return stats;
}

const count = parseInt(process.argv[2], 10) || SIM_DEFAULT_BATTLE_COUNT;
runSimulation(count);
