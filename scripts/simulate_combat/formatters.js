// @ts-nocheck
"use strict";

const {
  PERSONALITIES,
  FATIGUE_SNAPSHOT_TURNS,
  PHYSICAL_STATS,
  MAGIC_STATS,
  MAX_ROUNDS,
} = require("./config");

const PERSONALITY_KEYS = Object.keys(PERSONALITIES);

/**
 *
 * @param val
 */
function pct(val) {
  return (val * 100).toFixed(1) + "%";
}

/**
 *
 * @param val
 * @param decimals
 */
function num(val, decimals = 1) {
  return Number(val).toFixed(decimals);
}

/**
 *
 * @param pass
 */
function passFail(pass) {
  return pass ? "PASS" : "FAIL";
}

/**
 * Generate human-readable markdown report from aggregated data.
 * @param {object} report - Output from aggregate()
 * @param {object} config - CLI options used
 * @returns {string} Markdown text
 */
function formatMarkdownReport(report, config = {}) {
  const lines = [];
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  lines.push("# Combat Simulation Report");
  lines.push(`Generated: ${now} | ${report.overview.totalSimulations} simulations | Max ${MAX_ROUNDS} rounds`);
  lines.push("");
  if (config.numSims) lines.push(`Config: numSims=${config.numSims}`);
  lines.push("");

  // ── Balance targets validation ──
  lines.push("## Balance Targets");
  lines.push("| Target | Objetivo | Valor actual | Estado |");
  lines.push("|--------|----------|--------------|--------|");
  for (const t of report.targets) {
    lines.push(`| ${t.label} | ${num(t.target)} | ${num(t.value)} | ${passFail(t.pass)} |`);
  }
  lines.push("");

  // ── Overview ──
  lines.push("## Overview");
  lines.push("| Metric | Value |");
  lines.push("|--------|-------|");
  lines.push(`| Total simulations | ${report.overview.totalSimulations} |`);
  lines.push(`| KO victories | ${report.overview.totalKOs} (${pct(report.overview.koRate)}) |`);
  lines.push(`| Timeouts (draws) | ${report.overview.totalTimeouts} (${pct(1 - report.overview.koRate)}) |`);
  lines.push(`| Avg rounds (all) | ${num(report.overview.avgRoundsOverall)} |`);
  lines.push(`| Avg rounds (KO only) | ${num(report.overview.avgRoundsKO)} |`);
  lines.push(`| Rounds P50 / P90 / Max | ${num(report.overview.roundsP50, 0)} / ${num(report.overview.roundsP90, 0)} / ${num(report.overview.roundsMax, 0)} |`);
  lines.push("");

  // ── Turnos nivel/equipo similares ──
  lines.push("## Turns (matched level & equipment)");
  lines.push("| Metric | Value |");
  lines.push("|--------|-------|");
  lines.push(`| Battles in subset | ${report.matched.count} |`);
  lines.push(`| Avg rounds | ${num(report.matched.avgRounds)} |`);
  lines.push(`| P50 / P90 | ${num(report.matched.roundsP50, 0)} / ${num(report.matched.roundsP90, 0)} |`);
  lines.push("");

  // ── Primer atacante ──
  lines.push("## First Attacker Advantage");
  lines.push("| Metric | Value |");
  lines.push("|--------|-------|");
  lines.push(`| First attacker wins | ${report.firstAttacker.wins}/${report.firstAttacker.total} |`);
  lines.push(`| Winrate | ${pct(report.firstAttacker.winrate)} |`);
  lines.push(`| Advantage over 50% | ${pct(report.firstAttacker.advantage)} |`);
  lines.push(`| Draws | ${report.firstAttacker.draws} |`);
  lines.push("");

  // ── Meta builds ──
  lines.push("## Win Rates by Personality");
  lines.push("| Personality | Wins | Total | Win Rate | Meta? |");
  lines.push("|-------------|------|-------|----------|-------|");
  for (const key of PERSONALITY_KEYS) {
    const wr = report.winRates[key];
    const isMeta = key === report.meta.personality;
    lines.push(
      `| ${PERSONALITIES[key].label} | ${wr.wins} | ${wr.total} | ${pct(wr.rate)} | ${isMeta ? "YES" : ""} |`,
    );
  }
  lines.push("");

  // ── Gestión de recursos ──
  lines.push("## Resource Management (per battle)");
  lines.push("| Metric | Avg | P50 |");
  lines.push("|--------|-----|-----|");
  lines.push(`| Items used | ${num(report.resources.avgItemsPerBattle)} | ${num(report.resources.itemsP50, 0)} |`);
  lines.push(`| Heal applied | ${num(report.resources.avgHealPerBattle)} | - |`);
  lines.push(`| Rests | ${num(report.resources.avgRestsPerBattle)} | ${num(report.resources.restsP50, 0)} |`);
  lines.push(`| Advances | ${num(report.resources.avgAdvancesPerBattle)} | - |`);
  lines.push(`| Retreats | ${num(report.resources.avgRetreatsPerBattle)} | - |`);
  lines.push(`| Battles with item use | ${pct(report.resources.battlesWithItemUseRate)} | - |`);
  lines.push("");

  // ── Variación de datos ──
  lines.push("## Data Variance");
  lines.push("| Metric | Value |");
  lines.push("|--------|-------|");
  lines.push(`| Weapon presence | ${pct(report.variance.weaponPresenceRate)} |`);
  lines.push(`| Armor presence | ${pct(report.variance.armorPresenceRate)} |`);
  lines.push(`| ATK spread (stddev) | ${num(report.variance.atkSpread, 2)} (avg ${num(report.variance.atkAvg, 2)}) |`);
  lines.push(`| ASPD spread (stddev) | ${num(report.variance.aspdSpread, 2)} (avg ${num(report.variance.aspdAvg, 2)}) |`);
  const tierKeys = Object.keys(report.variance.equipmentTier).sort();
  for (const tier of tierKeys) {
    const t = report.variance.equipmentTier[tier];
    lines.push(`| Equipment tier ${tier} | ${t.count} (${pct(t.rate)}) |`);
  }
  for (const bracket of Object.keys(report.variance.levelBrackets)) {
    lines.push(`| Level ${bracket} | ${report.variance.levelBrackets[bracket]} |`);
  }
  lines.push("");
  lines.push("### Weapon Natures");
  lines.push("| Nature | Count |");
  lines.push("|--------|-------|");
  for (const nature of Object.keys(report.variance.weaponNature).sort()) {
    lines.push(`| ${nature} | ${report.variance.weaponNature[nature]} |`);
  }
  lines.push("");

  // ── Contribución mágica ──
  lines.push("## Magic Stats Contribution");
  lines.push("| Stat | High winrate | High count | Low winrate | Low count | Diff |");
  lines.push("|------|--------------|------------|-------------|-----------|------|");
  for (const stat of MAGIC_STATS) {
    const mc = report.magicContribution[stat];
    lines.push(
      `| ${stat} | ${pct(mc.highWinrate)} | ${mc.highCount} | ${pct(mc.lowWinrate)} | ${mc.lowCount} | ${num(mc.difference * 100, 1)}pp |`,
    );
  }
  lines.push("");

  // ── Daño por turno ──
  lines.push("## Average Damage Per Attack");
  lines.push("| Personality | Avg | Min | Max | P25 | P50 | P75 |");
  lines.push("|-------------|-----|-----|-----|-----|-----|-----|");
  for (const key of PERSONALITY_KEYS) {
    const d = report.avgDamagePerTurn[key];
    lines.push(
      `| ${PERSONALITIES[key].label} | ${num(d.avg)} | ${d.min} | ${d.max} | ${num(d.p25, 0)} | ${num(d.p50, 0)} | ${num(d.p75, 0)} |`,
    );
  }
  lines.push("");

  // ── Dodge / Block ──
  lines.push("## Dodge Effectiveness");
  lines.push("| Personality | Attempts | Successes | Rate |");
  lines.push("|-------------|----------|-----------|------|");
  for (const key of PERSONALITY_KEYS) {
    const de = report.dodgeEffectiveness[key];
    lines.push(`| ${PERSONALITIES[key].label} | ${de.attempted} | ${de.success} | ${pct(de.rate)} |`);
  }
  lines.push("");

  lines.push("## Block Effectiveness");
  lines.push("| Personality | Chosen | Total Defended | Rate |");
  lines.push("|-------------|--------|----------------|------|");
  for (const key of PERSONALITY_KEYS) {
    const be = report.blockEffectiveness[key];
    lines.push(`| ${PERSONALITIES[key].label} | ${be.chosen} | ${be.totalDefended} | ${pct(be.rate)} |`);
  }
  lines.push("");

  // ── Curvas de fatiga ──
  lines.push("## Fatigue Progression (Avg)");
  const headerCols = ["Turn", ...PERSONALITY_KEYS.map((k) => PERSONALITIES[k].label)];
  lines.push(`| ${headerCols.join(" | ")} |`);
  lines.push(`| ${headerCols.map(() => "---").join(" | ")} |`);
  for (const turn of FATIGUE_SNAPSHOT_TURNS) {
    const row = [String(turn), ...PERSONALITY_KEYS.map((k) => num(report.fatigueCurves[k][turn], 0))];
    lines.push(`| ${row.join(" | ")} |`);
  }
  lines.push("");

  // ── Matchup matrix ──
  lines.push("## Personality Matchup Matrix");
  lines.push("(Row wins vs Column X% of the time)");
  const matrixHeader = ["", ...PERSONALITY_KEYS.map((k) => `vs ${PERSONALITIES[k].label}`)];
  lines.push(`| ${matrixHeader.join(" | ")} |`);
  lines.push(`| ${matrixHeader.map(() => "---").join(" | ")} |`);
  for (const a of PERSONALITY_KEYS) {
    const row = [PERSONALITIES[a].label, ...PERSONALITY_KEYS.map((b) => pct(report.matchupMatrix[a][b]))];
    lines.push(`| ${row.join(" | ")} |`);
  }
  lines.push("");

  // ── Stat heatmap ──
  lines.push("## Stat vs Win Rate Heatmap");
  for (const stat of [...PHYSICAL_STATS, ...MAGIC_STATS]) {
    lines.push(`### ${stat}`);
    lines.push("| Range | Win Rate | Count |");
    lines.push("|-------|----------|-------|");
    for (const cell of report.statHeatmap[stat]) {
      lines.push(`| ${cell.range} | ${pct(cell.avgWinRate)} | ${cell.count} |`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

module.exports = { formatMarkdownReport };
