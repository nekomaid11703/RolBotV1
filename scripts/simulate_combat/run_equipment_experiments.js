#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * Runner de experimentos de equipamiento.
 *
 * Ejecuta la simulación con presets que fuerzan condiciones del catálogo de
 * hierro (amuleto, escudo, cobertura, piezas de set, naturaleza de arma,
 * tier de calidad) para medir su efecto sobre winrate/targets.
 *
 * Uso:
 *   node scripts/simulate_combat/run_equipment_experiments.js -n 1000
 *   node scripts/simulate_combat/run_equipment_experiments.js -n 1000 --only cobertura_total,naturaleza_maza
 *
 * Salida: scripts/simulation_output/experiments/equip_<preset>_raw.json|_report.md
 */

const { runSimulation } = require("../simulate_combat");

const PRESETS = {
  amuleto_off: { amulet: false },
  amuleto_on: { amulet: true },
  escudo_off: { shield: false },
  escudo_on: { shield: true },
  cobertura_ligera: { coverage: "ligera", setPieces: "full", shield: false },
  cobertura_media: { coverage: "media", setPieces: "full", shield: false },
  cobertura_alta: { coverage: "alta", setPieces: "full", shield: false },
  cobertura_total: { coverage: "total", setPieces: "full", shield: false },
  set_off: { setPieces: "max2", shield: false },
  set_on: { setPieces: "full", shield: false },
  naturaleza_espada: { weapon: "espada_de_hierro" },
  naturaleza_estoque: { weapon: "estoque_de_hierro" },
  naturaleza_maza: { weapon: "maza_de_hierro" },
  naturaleza_arco: { weapon: "arco_de_hierro" },
  tier_e: { tier: "E" },
  tier_c: { tier: "C" },
  tier_a: { tier: "A" },
};

function printUsage() {
  console.log(`Uso:
  node scripts/simulate_combat/run_equipment_experiments.js -n <sims> [--only p1,p2,...] [-v]

Opciones:
  -n, --num-sims <n>   Número de simulaciones por preset (default: 500)
  --only <lista>       Solo ejecutar estos presets (separados por coma)
  -v, --verbose        Salida progreso
  -h, --help           Esta ayuda

Presets: ${Object.keys(PRESETS).join(", ")}`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { numSims: 500, only: null, verbose: false, help: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-n":
      case "--num-sims":
        opts.numSims = parseInt(args[++i], 10);
        if (isNaN(opts.numSims) || opts.numSims < 1) {
          console.error("Error: --num-sims debe ser un entero positivo");
          process.exit(1);
        }
        break;
      case "--only":
        opts.only = String(args[++i] || "")
          .split(",")
          .filter(Boolean);
        break;
      case "-v":
      case "--verbose":
        opts.verbose = true;
        break;
      case "-h":
      case "--help":
        opts.help = true;
        break;
      default:
        console.error(`Unknown option: ${args[i]}`);
        process.exit(1);
    }
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    printUsage();
    process.exit(0);
  }

  const names = opts.only ? opts.only.filter((n) => PRESETS[n]) : Object.keys(PRESETS);
  if (opts.only && names.length !== opts.only.length) {
    const missing = opts.only.filter((n) => !PRESETS[n]);
    console.error(`Presets desconocidos: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log(`Ejecutando ${names.length} presets × ${opts.numSims} sims...`);
  console.log("");

  const summary = [];
  for (const name of names) {
    console.log(`▶ ${name}: ${JSON.stringify(PRESETS[name])}`);
    runSimulation({ numSims: opts.numSims, verbose: opts.verbose }, null, `equip_${name}`, PRESETS[name]);
    summary.push({ preset: name, ...PRESETS[name] });
    console.log("");
  }

  console.log("Resumen de presets ejecutados:");
  console.table(summary);
}

if (require.main === module) {
  main();
}

module.exports = { PRESETS, main };
