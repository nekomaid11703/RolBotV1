#!/usr/bin/env node
// @ts-nocheck
"use strict";

const path = require("path");
const fs = require("fs");
const { parseArgs, printUsage } = require("./simulate_combat/config");
const { generateFighterPair } = require("./simulate_combat/fighterGenerator");
const { simulateCombat } = require("./simulate_combat/combatLoop");
const { collectMetrics } = require("./simulate_combat/metricsCollector");
const { aggregate } = require("./simulate_combat/aggregator");
const { formatMarkdownReport } = require("./simulate_combat/formatters");

/**
 *
 */
function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    printUsage();
    process.exit(0);
  }

  const startTime = Date.now();
  const allMetrics = [];

  for (let i = 0; i < opts.numSims; i++) {
    const { fighterA, fighterB } = generateFighterPair();
    const result = simulateCombat(fighterA, fighterB);
    const metrics = collectMetrics(result);
    allMetrics.push(metrics);

    if (opts.verbose && (i + 1) % 10 === 0) {
      process.stdout.write(`\r  Simulating ${i + 1}/${opts.numSims}...`);
    }
  }

  if (opts.verbose) {
    console.log("");
    console.log("");
  }

  const report = aggregate(allMetrics);

  const outDir = path.join(__dirname, "simulation_output");
  fs.mkdirSync(outDir, { recursive: true });

  const rawOutput = {
    config: {
      numSims: opts.numSims,
      maxRounds: 50,
      timestamp: new Date().toISOString(),
    },
    metrics: allMetrics,
    report,
  };

  fs.writeFileSync(path.join(outDir, "raw_data.json"), JSON.stringify(rawOutput, null, 2));

  const markdown = formatMarkdownReport(report, opts);
  fs.writeFileSync(path.join(outDir, "report.md"), markdown);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Done. ${opts.numSims} simulations in ${elapsed}s.`);
  console.log(`  Raw data: ${path.join(outDir, "raw_data.json")}`);
  console.log(`  Report:   ${path.join(outDir, "report.md")}`);
}

main();
