#!/usr/bin/env node
// @ts-nocheck
"use strict";

const path = require("path");
const fs = require("fs");
const { simulateCombat } = require("./simulate_combat/combatLoop");

const NUM_SIMS = 20000;
const LEVEL_MIN = 100;
const LEVEL_MAX = 500;
const LEVEL_DIFF_MAX_PCT = 0.15;
const STAT_KEYS = ["atk", "def", "aspd", "ref", "mspd", "fulgor", "d_fulgor", "r_fulgor", "hp"];

/**
 *
 */
function randomLevel() {
  return LEVEL_MIN + Math.floor(Math.random() * (LEVEL_MAX - LEVEL_MIN + 1));
}

/**
 *
 * @param level
 */
function generateRandomStats(level) {
  const min = 1;
  const remaining = Math.max(0, level - min * STAT_KEYS.length);
  const raw = STAT_KEYS.map(() => Math.random());
  const sum = raw.reduce((a, b) => a + b, 0);
  const stats = {};
  let total = 0;
  STAT_KEYS.forEach((key, i) => {
    stats[key] = min + Math.round((raw[i] / sum) * remaining);
    total += stats[key];
  });
  const diff = level - total;
  if (diff !== 0) stats.atk = Math.max(1, stats.atk + diff);
  return stats;
}

/**
 *
 * @param level
 */
function generateRandomFighter(level) {
  const stats = generateRandomStats(level);
  return {
    name: `Random_${level}`,
    stats,
    nivel: level,
    hp: stats.hp * 2,
  };
}

/**
 *
 */
function generatePair() {
  const levelA = randomLevel();
  const range = Math.round(levelA * LEVEL_DIFF_MAX_PCT);
  const minB = Math.max(LEVEL_MIN, levelA - range);
  const maxB = Math.min(LEVEL_MAX, levelA + range);
  const levelB = minB + Math.floor(Math.random() * (maxB - minB + 1));
  return { fighterA: generateRandomFighter(levelA), fighterB: generateRandomFighter(levelB) };
}

/**
 *
 * @param values
 */
function quintileBuckets(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  return [
    sorted[Math.floor(n * 0.2)],
    sorted[Math.floor(n * 0.4)],
    sorted[Math.floor(n * 0.6)],
    sorted[Math.floor(n * 0.8)],
  ];
}

/**
 *
 */
function main() {
  const startTime = Date.now();
  const logInterval = Math.floor(NUM_SIMS / 20);

  const allFighters = [];
  const maxHpSeen = [];

  const statsByKey = {};
  for (const key of STAT_KEYS) statsByKey[key] = [];

  for (let i = 0; i < NUM_SIMS; i++) {
    const { fighterA, fighterB } = generatePair();
    const result = simulateCombat(fighterA, fighterB);

    const aWon = result.winner === "A";
    allFighters.push({ name: "A", stats: fighterA.stats, level: fighterA.nivel, won: aWon });
    allFighters.push({ name: "B", stats: fighterB.stats, level: fighterB.nivel, won: !aWon });
    maxHpSeen.push(fighterA.hp, fighterB.hp);

    for (const key of STAT_KEYS) {
      statsByKey[key].push(fighterA.stats[key], fighterB.stats[key]);
    }

    if ((i + 1) % logInterval === 0) {
      process.stdout.write(`\r  ${i + 1}/${NUM_SIMS}...`);
    }
  }

  process.stdout.write(`\r  ${NUM_SIMS}/${NUM_SIMS}...\n`);

  const totalFighters = allFighters.length;
  const totalWins = allFighters.filter((f) => f.won).length;

  const winrateByLevelBucket = {};
  const levelBuckets = ["100-199", "200-299", "300-399", "400-500"];
  for (const b of levelBuckets) winrateByLevelBucket[b] = { wins: 0, total: 0 };
  for (const f of allFighters) {
    const b = f.level <= 199 ? "100-199" : f.level <= 299 ? "200-299" : f.level <= 399 ? "300-399" : "400-500";
    winrateByLevelBucket[b].total++;
    if (f.won) winrateByLevelBucket[b].wins++;
  }

  const cuts = quintileBuckets(Object.values(statsByKey).flat());
  const statWinrate = {};
  for (const key of STAT_KEYS) {
    const buckets = {
      "Q1-bajo": { wins: 0, total: 0 },
      Q2: { wins: 0, total: 0 },
      Q3: { wins: 0, total: 0 },
      Q4: { wins: 0, total: 0 },
      "Q5-alto": { wins: 0, total: 0 },
    };
    for (const f of allFighters) {
      const val = f.stats[key];
      let label;
      if (val <= cuts[0]) label = "Q1-bajo";
      else if (val <= cuts[1]) label = "Q2";
      else if (val <= cuts[2]) label = "Q3";
      else if (val <= cuts[3]) label = "Q4";
      else label = "Q5-alto";
      buckets[label].total++;
      if (f.won) buckets[label].wins++;
    }
    statWinrate[key] = buckets;
  }

  // Utility stats: only HP, ATK, DEF positively impact winrate.
  // The other 6 stats (aspd, ref, mspd, fulgor, d_fulgor, r_fulgor) are waste.
  const WASTE_STATS = ["aspd", "ref", "mspd", "fulgor", "d_fulgor", "r_fulgor"];

  // ── Archetype analysis: how points are allocated ──
  const archetypes = {};
  for (const f of allFighters) {
    const lvl = f.level;
    const wastePct = WASTE_STATS.reduce((s, k) => s + f.stats[k], 0) / lvl;
    const atkPct = f.stats.atk / lvl;
    const hpPct = f.stats.hp / lvl;
    const defPct = f.stats.def / lvl;

    let arch;
    if (wastePct > 0.5) {
      arch = "WASTE-heavy (>50% en stats inutiles)";
    } else if (atkPct > 0.25 && hpPct > 0.25) {
      arch = "ATK+HP focus";
    } else if (atkPct > 0.3) {
      arch = "ATK focus";
    } else if (hpPct > 0.3) {
      arch = "HP focus";
    } else if (defPct > 0.25) {
      arch = "DEF focus";
    } else if (atkPct > 0.2 && defPct > 0.2 && hpPct > 0.2) {
      arch = "ATK+DEF+HP balanced";
    } else {
      arch = "ATK+HP+DEF spread";
    }

    if (!archetypes[arch]) archetypes[arch] = { wins: 0, total: 0 };
    archetypes[arch].total++;
    if (f.won) archetypes[arch].wins++;
  }

  // ── Correlacion: inversion util (HP+ATK+DEF) vs winrate ──
  const utilityCorr = {};
  for (let pct = 0; pct <= 100; pct += 10) {
    utilityCorr[pct + "-" + (pct + 10)] = { wins: 0, total: 0 };
  }
  for (const f of allFighters) {
    const utilPct = (f.stats.hp + f.stats.atk + f.stats.def) / f.level;
    const idx = Math.min(90, Math.floor((utilPct * 100) / 10) * 10);
    const key = idx + "-" + (idx + 10);
    if (utilityCorr[key]) {
      utilityCorr[key].total++;
      if (f.won) utilityCorr[key].wins++;
    }
  }

  // ── Signatures con bucket binario: util vs waste ──
  // Solo 2 buckets por stat: "bajo" vs "alto" usando mediana
  const medians = {};
  for (const key of STAT_KEYS) {
    const sorted = [...statsByKey[key]].sort((a, b) => a - b);
    medians[key] = sorted[Math.floor(sorted.length / 2)];
  }
  const sig2 = {};
  for (const f of allFighters) {
    const parts = STAT_KEYS.map((k) => (f.stats[k] >= medians[k] ? "H" : "L"));
    const sig = parts.join("-");
    if (!sig2[sig]) sig2[sig] = { wins: 0, total: 0 };
    sig2[sig].total++;
    if (f.won) sig2[sig].wins++;
  }
  const topSigs = Object.entries(sig2)
    .map(([s, d]) => ({ sig: s, wins: d.wins, total: d.total, rate: d.wins / d.total }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 15);
  const bottomSigs = Object.entries(sig2)
    .map(([s, d]) => ({ sig: s, wins: d.wins, total: d.total, rate: d.wins / d.total }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 15);

  // ── Output ──
  const lines = [];
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  /**
   *
   * @param v
   */
  function pct(v) {
    return (v * 100).toFixed(1) + "%";
  }

  lines.push("# Random Stat Simulation Report");
  lines.push(`Generated: ${now} | ${NUM_SIMS} simulations`);
  lines.push(`Level range: ${LEVEL_MIN}-${LEVEL_MAX} | Max level diff: ${LEVEL_DIFF_MAX_PCT * 100}%`);
  lines.push(
    `Total fighters: ${totalFighters} | Total wins by A: ${allFighters.filter((f) => f.name === "A" && f.won).length}`,
  );
  lines.push("");

  // ═══ RESULTADOS CLAVE ═══
  lines.push("## Resultados Clave");
  lines.push("");
  lines.push("**Estadisticas que importan (ordenadas por impacto en winrate):**");
  const impactOrder = STAT_KEYS.map((k) => {
    const q1 = statWinrate[k]["Q1-bajo"];
    const q5 = statWinrate[k]["Q5-alto"];
    return {
      key: k,
      q1Rate: q1.wins / q1.total,
      q5Rate: q5.wins / q5.total,
      delta: q5.wins / q5.total - q1.wins / q1.total,
    };
  }).sort((a, b) => b.delta - a.delta);
  for (const s of impactOrder) {
    const arrow = s.delta > 0.05 ? ":arrow_up:" : s.delta < -0.05 ? ":arrow_down:" : ":left_right_arrow:";
    lines.push(
      `- **${s.key.toUpperCase()}**: ${pct(s.q1Rate)} (Q1) → ${pct(s.q5Rate)} (Q5) = **${(s.delta * 100).toFixed(1)}pp** ${arrow}`,
    );
  }
  lines.push("");

  lines.push(
    "**Estadisticas desperdicio:** ASPD, REF, MSPD, FULGOR, D_FULGOR, R_FULGOR **NUNCA** se usan en formulas de daño, reaccion o fatiga. Solo subirlas resta puntos a HP/ATK/DEF.",
  );
  lines.push("");

  lines.push("## Winrate by Level Range");
  lines.push("| Level | Wins | Total | Win Rate |");
  lines.push("|-------|------|-------|----------|");
  for (const b of levelBuckets) {
    const d = winrateByLevelBucket[b];
    lines.push(`| ${b} | ${d.wins} | ${d.total} | ${d.total > 0 ? pct(d.wins / d.total) : "-"} |`);
  }
  lines.push("");

  lines.push("## Winrate by Stat Quintile");
  lines.push("Each stat split into 5 equal-sized buckets (Q1 = lowest 20%, Q5 = highest 20%)");
  lines.push("");
  for (const key of STAT_KEYS) {
    lines.push(`### ${key.toUpperCase()}`);
    lines.push("| Bucket | Wins | Total | Win Rate |");
    lines.push("|--------|------|-------|----------|");
    const bLabels = ["Q1-bajo", "Q2", "Q3", "Q4", "Q5-alto"];
    for (const lb of bLabels) {
      const d = statWinrate[key][lb];
      lines.push(`| ${lb} | ${d.wins} | ${d.total} | ${d.total > 0 ? pct(d.wins / d.total) : "-"} |`);
    }
    lines.push("");
  }

  lines.push("## Utility Investment (HP+ATK+DEF) vs Winrate");
  lines.push("Que porcentaje del nivel total se invirtio en las 3 unicas stats que importan");
  lines.push("| % en HP+ATK+DEF | Wins | Total | Win Rate |");
  lines.push("|-----------------|------|-------|----------|");
  for (const [key, d] of Object.entries(utilityCorr)) {
    if (d.total > 0) lines.push(`| ${key}% | ${d.wins} | ${d.total} | ${pct(d.wins / d.total)} |`);
  }
  lines.push("");

  lines.push("## Archetype Analysis");
  lines.push("Agrupacion por estrategia de asignacion de puntos");
  lines.push("| Archetype | Wins | Total | Win Rate |");
  lines.push("|-----------|------|-------|----------|");
  const archSorted = Object.entries(archetypes).sort((a, b) => b[1].wins / b[1].total - a[1].wins / a[1].total);
  for (const [arch, d] of archSorted) {
    lines.push(`| ${arch} | ${d.wins} | ${d.total} | ${pct(d.wins / d.total)} |`);
  }
  lines.push("");

  lines.push("## Top 15 Binary Signatures (H=above median, L=below)");
  lines.push("Order: " + STAT_KEYS.join(" "));
  lines.push("| Signature | Wins | Total | Win Rate |");
  lines.push("|-----------|------|-------|----------|");
  for (const b of topSigs) {
    lines.push(`| ${b.sig} | ${b.wins} | ${b.total} | ${pct(b.rate)} |`);
  }
  lines.push("");

  lines.push("## Bottom 15 Binary Signatures");
  lines.push("| Signature | Wins | Total | Win Rate |");
  lines.push("|-----------|------|-------|----------|");
  for (const b of bottomSigs) {
    lines.push(`| ${b.sig} | ${b.wins} | ${b.total} | ${pct(b.rate)} |`);
  }
  lines.push("");

  const maxHpSorted = [...maxHpSeen].sort((a, b) => a - b);
  lines.push("## HP Range");
  lines.push(`| Min | Q25 | Q50 | Q75 | Max |`);
  lines.push(`|-----|-----|-----|-----|-----|`);
  const n = maxHpSorted.length;
  lines.push(
    `| ${maxHpSorted[0]} | ${maxHpSorted[Math.floor(n * 0.25)]} | ${maxHpSorted[Math.floor(n * 0.5)]} | ${maxHpSorted[Math.floor(n * 0.75)]} | ${maxHpSorted[n - 1]} |`,
  );
  lines.push("");

  const outDir = path.join(__dirname, "simulation_output");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "random_report.md"), lines.join("\n"));
  fs.writeFileSync(path.join(outDir, "random_fighters.json"), JSON.stringify(allFighters, null, 2));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Done. ${NUM_SIMS} simulations in ${elapsed}s.`);
  console.log(`  Report:  ${path.join(outDir, "random_report.md")}`);
  console.log(`  Raw:     ${path.join(outDir, "random_fighters.json")}`);
}

main();
