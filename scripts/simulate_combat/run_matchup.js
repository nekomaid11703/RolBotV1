#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * Runner de matchup directo entre DOS personalidades forzadas.
 *
 * Genera pares (A=fuerza personalidadA, B=fuerza personalidadB) con niveles
 * parejos (mismo criterio ±LEVEL_DIFF_MAX_PCT que el pool), simula el combate
 * y reporta el winrate de A vs B.
 *
 * Sirve para medir counters: si una build meta pierde contra su mirror counter
 * no está rota (solo faltaba un oponente justo); si no baja aun perdiendo
 * contra su counter, está rota.
 *
 * Uso:
 *   node scripts/simulate_combat/run_matchup.js -n 500 --a extremista_defensa \
 *     --b matatanques --tag match_def_vs_matatanques
 *
 *   node scripts/simulate_combat/run_matchup.js -n 500 --a extremista_defensa \
 *     --b matatanques --tag match_def_vs_matatanques \
 *     --b-weapon estoque_de_hierro
 *
 *   node scripts/simulate_combat/run_matchup.js -n 500 --a extremista_defensa \
 *     --b matatanques --tag match_def_vs_matatanques \
 *     --overrides combatConfig.DEF_MITIGATION_CAP=60,combatBalance.DAMAGE_DEFENSE_SCALE=140
 *
 * Opciones:
 *   -n, --num-sims <n>    Número de simulaciones (default: 500)
 *   --a <personalidad>    Clave de personalidad del lado A
 *   --b <personalidad>    Clave de personalidad del lado B
 *   --a-weapon <id>       Fuerza el arma del lado A (id de IRON_FAMILY.weaponPool)
 *   --b-weapon <id>       Fuerza el arma del lado B (id de IRON_FAMILY.weaponPool)
 *   --tag <nombre>        Nombre del matchup (salida: simulation_output/experiments/<tag>_raw.json y <tag>_report.md)
 *   --overrides <lista>   Igual que run_experiments.js (combatConfig|combatBalance|tierConfig|simConfig)
 *   -v, --verbose         Salida progreso
 *   -h, --help            Esta ayuda
 */

const path = require("path");
const fs = require("fs");

const SIM_DIR = __dirname; // scripts/simulate_combat
const REPO_ROOT = path.join(SIM_DIR, "..", "..");

const MODULES = {
  combatConfig: path.join(REPO_ROOT, "src", "config", "combatConfig.js"),
  combatBalance: path.join(REPO_ROOT, "src", "config", "combatBalance.js"),
  tierConfig: path.join(REPO_ROOT, "src", "config", "tierConfig.js"),
  simConfig: path.join(SIM_DIR, "config.js"),
};

function printUsage() {
  console.log(`Uso:
  node scripts/simulate_combat/run_matchup.js -n <sims> --a <pkey> --b <pkey> --tag <nombre> [--a-weapon <id>] [--b-weapon <id>] [--overrides mod.KEY=val,...] [-v]

Opciones:
  -n, --num-sims <n>     Número de simulaciones (default: 500)
  --a <personalidad>     Clave de personalidad del lado A
  --b <personalidad>     Clave de personalidad del lado B
  --a-weapon <id>        Fuerza el arma del lado A (id de IRON_FAMILY.weaponPool)
  --b-weapon <id>        Fuerza el arma del lado B (id de IRON_FAMILY.weaponPool)
  --tag <nombre>         Nombre del matchup (salida: simulation_output/experiments/<tag>_raw.json y <tag>_report.md)
  --overrides <lista>    Lista separada por comas: modulo.CONSTANTE=valor (modulo: combatConfig|combatBalance|tierConfig|simConfig)
  -v, --verbose          Salida progreso
  -h, --help             Esta ayuda`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { numSims: 500, a: null, b: null, aWeapon: null, bWeapon: null, tag: null, overrides: [], verbose: false, help: false };
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
      case "--a":
        opts.a = args[++i];
        break;
      case "--b":
        opts.b = args[++i];
        break;
      case "--a-weapon":
        opts.aWeapon = args[++i];
        break;
      case "--b-weapon":
        opts.bWeapon = args[++i];
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
            const modPath = raw.slice(0, eq);
            const value = Number(raw.slice(eq + 1));
            const dot = modPath.indexOf(".");
            return { mod: modPath.slice(0, dot), key: modPath.slice(dot + 1), value };
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
  if (!opts.a || !opts.b) {
    console.error("Error: --a y --b son obligatorios");
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
    const parts = key.split(".");
    let cursor = loaded[mod];
    for (let i = 0; i < parts.length - 1; i++) {
      if (cursor[parts[i]] == null || typeof cursor[parts[i]] !== "object") {
        throw new Error(`${mod} no tiene la ruta "${parts.slice(0, i + 1).join(".")}" (objeto)`);
      }
      cursor = cursor[parts[i]];
    }
    const leaf = parts[parts.length - 1];
    if (!(leaf in cursor)) {
      throw new Error(`${mod} no exporta "${key}"`);
    }
    const before = cursor[leaf];
    cursor[leaf] = value;
    applied.push(`${mod}.${key} = ${value} (antes: ${JSON.stringify(before)})`);
  }
  const purgedModules = new Set(Object.values(MODULES).map((p) => path.resolve(p)));
  for (const key of Object.keys(require.cache)) {
    const k = key.replace(/\\/g, "/");
    if (
      (k.includes("/src/config/") ||
        k.includes("/src/services/rpg/") ||
        k.includes("/scripts/simulate_combat/")) &&
      !purgedModules.has(path.resolve(key))
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

  const { generateFighter, scaleToLevel } = require("./fighterGenerator");
  const { simulateCombat } = require("./combatLoop");
  const { LEVEL_MIN, LEVEL_MAX, LEVEL_DIFF_MAX_PCT } = require("./config");

  const personalityA = opts.a;
  const personalityB = opts.b;
  const eqOptsA = opts.aWeapon ? { weapon: opts.aWeapon } : null;
  const eqOptsB = opts.bWeapon ? { weapon: opts.bWeapon } : null;

  let winsA = 0;
  let winsB = 0;
  let koTypes = { A: {}, B: {} };
  let roundsA = 0;
  let roundsB = 0;
  let totalRounds = 0;

  for (let i = 0; i < opts.numSims; i++) {
    const fighterA = generateFighter(personalityA, null, eqOptsA);
    const targetLevelA = LEVEL_MIN + Math.floor(Math.random() * (LEVEL_MAX - LEVEL_MIN + 1));
    const scaledA = scaleToLevel(fighterA, targetLevelA, eqOptsA);

    const minLevel = Math.max(LEVEL_MIN, Math.round(targetLevelA * (1 - LEVEL_DIFF_MAX_PCT)));
    const maxLevel = Math.min(LEVEL_MAX, Math.round(targetLevelA * (1 + LEVEL_DIFF_MAX_PCT)));
    const targetLevelB = minLevel + Math.floor(Math.random() * (maxLevel - minLevel + 1));
    const fighterB = generateFighter(personalityB, null, eqOptsB);
    const scaledB = scaleToLevel(fighterB, targetLevelB, eqOptsB);

    const result = simulateCombat(scaledA, scaledB);

    totalRounds += result.totalRounds || 0;
    if (result.winner === "A") {
      winsA++;
      koTypes.A[result.koType || "ko"] = (koTypes.A[result.koType || "ko"] || 0) + 1;
      roundsA += result.totalRounds || 0;
    } else if (result.winner === "B") {
      winsB++;
      koTypes.B[result.koType || "ko"] = (koTypes.B[result.koType || "ko"] || 0) + 1;
      roundsB += result.totalRounds || 0;
    }

    if (opts.verbose && (i + 1) % 50 === 0) {
      process.stdout.write(`\r  Simulando ${i + 1}/${opts.numSims}...`);
    }
  }
  if (opts.verbose) console.log("");

  const winrateA = (winsA / opts.numSims) * 100;
  const winrateB = (winsB / opts.numSims) * 100;

  console.log(`\n=== Matchup: ${personalityA} (A) vs ${personalityB} (B) ===`);
  console.log(`  A gana: ${winsA}/${opts.numSims} (${winrateA.toFixed(1)}%)`);
  console.log(`  B gana: ${winsB}/${opts.numSims} (${winrateB.toFixed(1)}%)`);
  console.log(`  Rondas medias: total=${(totalRounds / opts.numSims).toFixed(1)}  A=${(roundsA / Math.max(1, winsA)).toFixed(1)}  B=${(roundsB / Math.max(1, winsB)).toFixed(1)}`);

  const outDir = path.join(SIM_DIR, "..", "simulation_output");
  fs.mkdirSync(path.join(outDir, "experiments"), { recursive: true });

  const raw = {
    config: {
      numSims: opts.numSims,
      personalityA,
      personalityB,
      weaponA: opts.aWeapon || null,
      weaponB: opts.bWeapon || null,
      overrides: opts.overrides,
      timestamp: new Date().toISOString(),
    },
    summary: {
      winsA,
      winsB,
      winrateA,
      winrateB,
      avgRounds: totalRounds / opts.numSims,
      avgRoundsA: winsA ? roundsA / winsA : 0,
      avgRoundsB: winsB ? roundsB / winsB : 0,
      koTypes,
    },
  };

  const rawName = path.join("experiments", `${opts.tag}_raw.json`);
  fs.writeFileSync(path.join(outDir, rawName), JSON.stringify(raw, null, 2));

  const lines = [];
  lines.push(`# Matchup ${personalityA} vs ${personalityB}`);
  lines.push("");
  lines.push(`Config: numSims=${opts.numSims}`);
  if (opts.aWeapon) lines.push(`Arma A: ${opts.aWeapon}`);
  if (opts.bWeapon) lines.push(`Arma B: ${opts.bWeapon}`);
  if (opts.overrides.length) lines.push(`Overrides: ${opts.overrides.join(", ")}`);
  lines.push("");
  lines.push(`| | A (${personalityA}) | B (${personalityB}) |`);
  lines.push(`| --- | --- | --- |`);
  lines.push(`| Victorias | ${winsA} | ${winsB} |`);
  lines.push(`| Winrate | ${winrateA.toFixed(1)}% | ${winrateB.toFixed(1)}% |`);
  lines.push(`| Rondas medias | ${(roundsA / Math.max(1, winsA)).toFixed(1)} | ${(roundsB / Math.max(1, winsB)).toFixed(1)} |`);
  lines.push("");
  lines.push("### Tipos de KO (A):");
  for (const [k, v] of Object.entries(koTypes.A)) lines.push(`- ${k}: ${v}`);
  lines.push("");
  lines.push("### Tipos de KO (B):");
  for (const [k, v] of Object.entries(koTypes.B)) lines.push(`- ${k}: ${v}`);
  lines.push("");
  lines.push(`Raw: ${rawName}`);

  const mdName = path.join("experiments", `${opts.tag}_report.md`);
  fs.writeFileSync(path.join(outDir, mdName), lines.join("\n"));
  console.log(`  Raw: ${path.join(outDir, rawName)}`);
  console.log(`  Report: ${path.join(outDir, mdName)}`);
}

main();
