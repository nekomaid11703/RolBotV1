#!/usr/bin/env node
// @ts-nocheck
"use strict";

const path = require("path");
const fs = require("fs");
const { parseArgs, printUsage, SIM_CONFIG, MAX_ROUNDS } = require("./simulate_combat/config");
const { generateFighterPair } = require("./simulate_combat/fighterGenerator");
const { simulateCombat } = require("./simulate_combat/combatLoop");
const { collectMetrics } = require("./simulate_combat/metricsCollector");
const { aggregate } = require("./simulate_combat/aggregator");
const { formatMarkdownReport } = require("./simulate_combat/formatters");

/**
 * Ejecuta la simulación y escribe los outputs.
 * @param {object} opts - Opciones ya parseadas (numSims, verbose, ...)
 * @param {string|null} [outDir] - Directorio de salida (default: simulation_output)
 * @param {string|null} [tag] - Si se indica, escribe en outDir/experiments/<tag>_raw.json y <tag>_report.md
 * @param {object} [fighterOpts] - Opciones de generación de equipo (presets de experimento)
 */
function runSimulation(opts, outDir = null, tag = null, fighterOpts = null) {
  const startTime = Date.now();
  const allMetrics = [];

  for (let i = 0; i < opts.numSims; i++) {
    const { fighterA, fighterB } = generateFighterPair(fighterOpts);
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

  const baseDir = outDir || path.join(__dirname, "simulation_output");
  fs.mkdirSync(baseDir, { recursive: true });
  const experimentsDir = path.join(baseDir, "experiments");
  fs.mkdirSync(experimentsDir, { recursive: true });

  const rawName = tag ? path.join("experiments", `${tag}_raw.json`) : "raw_data.json";
  const mdName = tag ? path.join("experiments", `${tag}_report.md`) : "report.md";

  const rawOutput = {
    config: {
      numSims: opts.numSims,
      maxRounds: MAX_ROUNDS,
      timestamp: new Date().toISOString(),
      simConfig: SIM_CONFIG,
      fighterOpts: fighterOpts || null,
    },
    metrics: allMetrics,
    report,
  };

  fs.writeFileSync(path.join(baseDir, rawName), JSON.stringify(rawOutput, null, 2));

  const markdown = formatMarkdownReport(report, opts);
  fs.writeFileSync(path.join(baseDir, mdName), markdown);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Done. ${opts.numSims} simulations in ${elapsed}s.`);
  console.log(`  Raw data: ${path.join(baseDir, rawName)}`);
  console.log(`  Report:   ${path.join(baseDir, mdName)}`);
}

/**
 *
 */
function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    printUsage();
    process.exit(0);
  }

  runSimulation(opts);
}

if (require.main === module) {
  main();
}

module.exports = { runSimulation, main };
