#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * Runner de experimentos de balance.
 *
 * Aplica overrides de constantes del MOTOR (src/config) en memoria,
 * limpia el require cache del subtree motor+simulador para que las
 * desestructuraciones se re-ejecuten con los valores mutados, y corre
 * una simulación que escribe en simulation_output/experiments/.
 *
 * NO toca archivos fuente: el baseline (raw_data.json) queda intacto.
 *
 * Uso:
 *   node scripts/simulate_combat/run_experiments.js -n 2000 --tag exp_fatiga_050 \
 *     --overrides combatConfig.FATIGUE_ATK_COST_SCALE=0.025,combatBalance.FATIGUE_BASE_PER_METER=0.5
 *
 * Módulos soportados: combatConfig | combatBalance | tierConfig
 * (tierConfig: solo valores planos del export, p.ej. TIERS.C.mult; las
 *  funciones getTierPenaltyBonus/getSpecialTierMult usan constantes
 *  internas del módulo y requieren editar tierConfig.js a mano).
 */

const path = require("path");
const fs = require("fs");

const SIM_DIR = __dirname; // scripts/simulate_combat
const REPO_ROOT = path.join(SIM_DIR, "..", "..");

const MODULES = {
  combatConfig: path.join(REPO_ROOT, "src", "config", "combatConfig.js"),
  combatBalance: path.join(REPO_ROOT, "src", "config", "combatBalance.js"),
  tierConfig: path.join(REPO_ROOT, "src", "config", "tierConfig.js"),
};

function printUsage() {
  console.log(`Uso:
  node scripts/simulate_combat/run_experiments.js -n <sims> --tag <nombre> [--overrides mod.KEY=val,...] [-v]

Opciones:
  -n, --num-sims <n>     Número de simulaciones (default: 500)
  --tag <nombre>         Nombre del experimento (salida: simulation_output/experiments/<tag>_raw.json y <tag>_report.md)
  --overrides <lista>    Lista separada por comas: modulo.CONSTANTE=valor (modulo: combatConfig|combatBalance|tierConfig)
  -v, --verbose          Salida progreso
  -h, --help             Esta ayuda`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { numSims: 500, tag: null, overrides: [], verbose: false, help: false };
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
      case "--tag":
        opts.tag = args[++i];
        break;
      case "--overrides":
        opts.overrides = String(args[++i] || "")
          .split(",")
          .filter(Boolean)
          .map((raw) => {
            const eq = raw.lastIndexOf("=");
            const modKey = raw.slice(0, eq);
            const value = Number(raw.slice(eq + 1));
            const dot = modKey.lastIndexOf(".");
            return { mod: modKey.slice(0, dot), key: modKey.slice(dot + 1), value };
          });
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
        console.error(`Opción desconocida: ${args[i]}`);
        process.exit(1);
    }
  }
  if (!opts.tag) {
    console.error("Error: --tag es obligatorio");
    process.exit(1);
  }
  return opts;
}

function applyOverrides(overrides) {
  const loaded = {};
  for (const mod of Object.keys(MODULES)) loaded[mod] = require(MODULES[mod]);

  const applied = [];
  for (const { mod, key, value } of overrides) {
    if (!loaded[mod]) throw new Error(`Módulo desconocido: ${mod} (esperado: ${Object.keys(MODULES).join(" | ")})`);
    if (!(key in loaded[mod])) {
      throw new Error(`${mod} no exporta "${key}"`);
    }
    const before = loaded[mod][key];
    loaded[mod][key] = value;
    applied.push(`${mod}.${key} = ${value} (antes: ${JSON.stringify(before)})`);
  }
  // Los módulos del motor desestructuran las constantes al requerir; limpiar el
  // cache obliga a re-ejecutar la desestructuración con los valores mutados.
  for (const key of Object.keys(require.cache)) {
    const k = key.replace(/\\/g, "/");
    if (
      k.includes("/src/config/") ||
      k.includes("/src/services/rpg/") ||
      k.includes("/scripts/simulate_combat/")
    ) {
      delete require.cache[key];
    }
  }
  return applied;
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    printUsage();
    process.exit(0);
  }

  const applied = applyOverrides(opts.overrides);
  console.log("Overrides aplicados:");
  for (const line of applied) console.log(`  - ${line}`);

  const { runSimulation } = require(path.join(SIM_DIR, "..", "simulate_combat.js"));
  const outDir = path.join(SIM_DIR, "..", "simulation_output");
  runSimulation({ numSims: opts.numSims, verbose: opts.verbose }, outDir, opts.tag);

  const metaPath = path.join(outDir, "experiments", `${opts.tag}_overrides.json`);
  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      {
        tag: opts.tag,
        timestamp: new Date().toISOString(),
        numSims: opts.numSims,
        overrides: opts.overrides.map((o) => ({ ...o })),
      },
      null,
      2,
    ),
  );
  console.log(`  Overrides: ${metaPath}`);
}

main();
