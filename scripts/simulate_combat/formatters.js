// @ts-nocheck
"use strict";

const { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS } = require("./config");

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
 * Generate human-readable markdown report from aggregated data.
 * @param {object} report - Output from aggregate()
 * @param {object} config - CLI options used
 * @returns {string} Markdown text
 */
function formatMarkdownReport(report, config = {}) {
  const lines = [];
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  lines.push("# Combat Simulation Report");
  lines.push(`Generated: ${now} | ${report.overview.totalSimulations} simulations | Max 50 rounds`);
  if (config.numSims) lines.push(`Config: numSims=${config.numSims}`);
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
  lines.push("");

  // ── Win Rates ──
  lines.push("## Win Rates by Personality");
  lines.push("| Personality | Wins | Total | Win Rate |");
  lines.push("|-------------|------|-------|----------|");
  for (const key of PERSONALITY_KEYS) {
    const wr = report.winRates[key];
    lines.push(`| ${PERSONALITIES[key].label} | ${wr.wins} | ${wr.total} | ${pct(wr.rate)} |`);
  }
  lines.push("");

  // ── Damage Per Turn ──
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

  // ── Dodge / Block Effectiveness ──
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

  // ── Fatigue Curves ──
  lines.push("## Fatigue Progression (Avg)");
  const headerCols = ["Turn", ...PERSONALITY_KEYS.map((k) => PERSONALITIES[k].label)];
  lines.push(`| ${headerCols.join(" | ")} |`);
  lines.push(`| ${headerCols.map(() => "---").join(" | ")} |`);
  for (const turn of FATIGUE_SNAPSHOT_TURNS) {
    const row = [String(turn), ...PERSONALITY_KEYS.map((k) => num(report.fatigueCurves[k][turn], 0))];
    lines.push(`| ${row.join(" | ")} |`);
  }
  lines.push("");

  // ── Matchup Matrix ──
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

  return lines.join("\n");
}

module.exports = { formatMarkdownReport };
