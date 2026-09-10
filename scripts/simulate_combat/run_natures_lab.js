#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * Laboratorio de NATURALEZAS DE DAÑO (Fase B, Paso 3).
 *
 * Compara las 4 naturalezas + desarmado en condiciones EQUIVALENTES para
 * aislar la diferencia de fórmula (no del arma). Todos los fighters usan la
 * MISMA build neutra y el MISMO nominalDamage de arma; solo cambia
 * damageNature. Así medimos cuánto DPS produce cada fórmula y cuántos turnos
 * tarda en resolverse un combate.
 *
 * Targets de balance (decisión Fase B):
 *   - Espejo (winrate ~50%): 7 turnos de media (ideal).
 *   - Cross con counter (desventaja): máximo 20 turnos.
 *   - Ninguna naturaleza debe dominar el meta en ningún bracket de nivel.
 *
 * Uso:
 *   node scripts/simulate_combat/run_natures_lab.js -n 500 --level 300
 *   node scripts/simulate_combat/run_natures_lab.js -n 300 --level 100
 *   node scripts/simulate_combat/run_natures_lab.js -n 300 --level 500
 *   node scripts/simulate_combat/run_natures_lab.js -n 400 --nominal 20 --tier B
 *   node scripts/simulate_combat/run_natures_lab.js -n 200 --builds cortante,perforante --mirror-only
 *
 * Opciones:
 *   -n, --num-sims <n>     Simulaciones por par (default: 500)
 *   --level <n>            Nivel objetivo (default: 300)
 *   --nominal <n>          NominalDamage del arma para TODAS las naturalezas (default: 20)
 *   --tier <T>             Tier del arma y la flecha (default: B)
 *   --builds <lista>       Subconjunto de naturalezas (default: todas)
 *   --mirror-only          Solo espejos (naturaleza vs sí misma)
 *   --max-rounds <n>       Techo de rounds (default: 30)
 *   --tag <nombre>         Tag de salida (default: natures_lab)
 *   -v, --verbose          Salida progreso
 *   -h, --help             Esta ayuda
 */

const path = require("path");
const fs = require("fs");
const { buildStressFighter } = require("./stress_personalities");
const { getWeaponStats, getProjectileStats } = require("../../src/services/rpg/itemStatService");

const SIM_DIR = __dirname;
const OUT_DIR = path.join(SIM_DIR, "..", "simulation_output");
const EXPERIMENTS_DIR = path.join(OUT_DIR, "experiments");

// Build NEUTRA: reparte el presupuesto de forma balanceada (todas las stats
// reciben peso similar) → la única variable del experimento es la fórmula.
const NEUTRAL_BUILD = {
  atk: 20,
  def: 20,
  aspd: 20,
  ref: 20,
  mspd: 20,
  hp: 20,
};

const NATURES = {
  cortante: { name: "Cortante", melee: true },
  contundente: { name: "Contundente", melee: true },
  perforante: { name: "Perforante", melee: true },
  proyectil: { name: "Proyectil", melee: false },
  desarmado: { name: "Desarmado", melee: true },
};

/**
 * Construye un arma con la fórmula REAL del motor para una naturaleza.
 * @param {string} nature - damageNature
 * @param {number} nominal - nominalDamage del arma (igual para todas)
 * @param {string} tier - tier del arma/flecha
 * @returns {object|null} weaponInfo con stats derivadas
 */
function buildLabWeapon(nature, nominal, tier) {
  if (nature === "desarmado") return null;
  const ranged = nature === "proyectil";
  const weaponStats = getWeaponStats({
    tier,
    material: "hierro",
    modules: {
      weapon: {
        damageNature: nature,
        baseDamage: nominal,
        hands: ranged ? 2 : 1,
        weaponRange: ranged ? 20 : 1,
        ranged,
      },
    },
  });

  let arrow = null;
  if (ranged) {
    const arrowStats = getProjectileStats({
      tier,
      material: "hierro",
      modules: { weapon: { damageNature: "proyectil", baseDamage: nominal, hands: 1, weaponRange: 0 } },
    });
    arrow = { id: "flecha_lab", name: "Flecha Lab", tier, baseDamage: arrowStats.baseDamage, damageNature: "proyectil", material: "hierro" };
  }

  return {
    id: `lab_${nature}`,
    name: `Lab ${nature}`,
    ...weaponStats,
    arrow,
    ammoCount: arrow ? 30 : 0,
  };
}

/**
 * Construye un fighter de laboratorio: build neutra + arma de la naturaleza.
 * @param {string} nature - damageNature
 * @param {number} nivel - nivel objetivo
 * @param {object} opts - { nominal, tier, maxRounds }
 * @returns {object} Fighter listo para simulateCombat
 */
function buildLabFighter(nature, nivel, opts) {
  const fighter = buildStressFighter("el_misil", nivel, {});
  // Reemplazar la build por la NEUTRAL: reparte el presupuesto equitativamente.
  const PHYSICAL = ["atk", "def", "aspd", "ref", "mspd"];
  const totalW = Object.values(NEUTRAL_BUILD).reduce((a, b) => a + b, 0);
  const stats = { atk: 1, def: 1, aspd: 1, ref: 1, mspd: 1, hp: 1 };
  const budget = Math.max(nivel - (PHYSICAL.length + 1), 0);
  for (const k of [...PHYSICAL, "hp"]) {
    stats[k] += Math.floor((NEUTRAL_BUILD[k] / totalW) * budget);
  }
  const leftover = budget - (Object.values(stats).reduce((a, b) => a + b, 0) - (PHYSICAL.length + 1));
  // Asignar el resto (por redondeo) a atk/hp para no perder presupuesto.
  stats.atk += Math.floor(leftover / 2);
  stats.hp += leftover - Math.floor(leftover / 2);

  const hpMult = 3;
  return {
    name: NATURES[nature].name,
    stats: { ...stats, fulgor: 1, d_fulgor: 1, r_fulgor: 1 },
    nivel: Math.max(nivel, Object.values(stats).reduce((a, b) => a + b, 0)),
    race: "lab",
    personality: nature,
    hp: stats.hp * hpMult,
    equipment: {
      tierKey: opts.tier,
      weapon: buildLabWeapon(nature, opts.nominal, opts.tier),
      armorList: [],
      armor: null,
      shield: null,
      amulet: null,
      ammo: null,
    },
    loadout: [],
  };
}

/**
 * Prepara el ammo del fighter (el combatLoop lee equipment.ammo.count).
 * @param {object} fighter
 */
function attachAmmo(fighter) {
  const w = fighter.equipment?.weapon;
  if (w?.arrow) {
    fighter.equipment.ammo = {
      id: w.arrow.id,
      name: w.arrow.name,
      count: w.ammoCount,
      baseDamage: w.arrow.baseDamage,
      tier: w.arrow.tier,
      material: w.arrow.material,
    };
  } else {
    fighter.equipment.ammo = null;
  }
  return fighter;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { numSims: 500, level: 300, nominal: 20, tier: "B", builds: null, mirrorOnly: false, maxRounds: 30, tag: null, verbose: false, help: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-n":
      case "--num-sims":
        opts.numSims = parseInt(args[++i], 10);
        break;
      case "--level":
        opts.level = parseInt(args[++i], 10);
        break;
      case "--nominal":
        opts.nominal = parseInt(args[++i], 10);
        break;
      case "--tier":
        opts.tier = String(args[++i] || "B").toUpperCase();
        break;
      case "--builds":
        opts.builds = String(args[++i] || "")
          .split(",")
          .filter(Boolean);
        break;
      case "--mirror-only":
        opts.mirrorOnly = true;
        break;
      case "--max-rounds":
        opts.maxRounds = parseInt(args[++i], 10);
        break;
      case "--tag":
        opts.tag = args[++i];
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
  return opts;
}

function printUsage() {
  console.log(`Uso:
  node scripts/simulate_combat/run_natures_lab.js -n <sims> [--level <n>] [--nominal <n>] [--tier <T>] [--builds a,b,c] [--mirror-only] [--tag <t>] [-v]

Opciones:
  -n, --num-sims <n>     Simulaciones por par (default: 500)
  --level <n>            Nivel objetivo (default: 300)
  --nominal <n>          NominalDamage del arma para TODAS las naturalezas (default: 20)
  --tier <T>             Tier del arma y la flecha (default: B)
  --builds <lista>       Subconjunto de naturalezas (default: todas)
  --mirror-only          Solo espejos (naturaleza vs sí misma)
  --max-rounds <n>       Techo de rounds (default: 30)
  --tag <nombre>         Tag de salida (default: natures_lab)
  -v, --verbose          Salida progreso
  -h, --help             Esta ayuda`);
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    printUsage();
    process.exit(0);
  }

  const buildKeys = opts.builds && opts.builds.length ? opts.builds : Object.keys(NATURES);

  // Setea el techo de rounds del simulador ANTES de requerir combatLoop.
  const config = require("./config");
  config.MAX_ROUNDS = opts.maxRounds;
  const { simulateCombat } = require("./combatLoop");

  fs.mkdirSync(EXPERIMENTS_DIR, { recursive: true });

  const tag = opts.tag || `natures_lab_lv${opts.level}_nom${opts.nominal}_${opts.tier}`;
  const allRows = [];

  console.log(`Laboratorio de naturalezas | nivel=${opts.level} | nominal=${opts.nominal} | tier=${opts.tier} | maxRounds=${opts.maxRounds}`);
  console.log(`Naturalezas: ${buildKeys.join(", ")}${opts.mirrorOnly ? " (solo espejos)" : ""}`);
  console.log("");

  const pairs = [];
  for (const a of buildKeys) {
    for (const b of buildKeys) {
      if (opts.mirrorOnly && a !== b) continue;
      pairs.push([a, b]);
    }
  }

  for (const [aKey, bKey] of pairs) {
    let winsA = 0;
    let winsB = 0;
    let timeouts = 0;
    let roundsTotal = 0;
    let maxRoundsSeen = 0;
    let dmgABad = 0;
    let dmgBBad = 0;
    let hitsA = 0;
    let hitsB = 0;
    let dmgSumA = 0;
    let dmgSumB = 0;

    for (let i = 0; i < opts.numSims; i++) {
      // Alterna el orden de ataque para anular el sesgo del primer atacante
      // (hallazgo previo: A ataca primero y tiende a perder). Con swap, el
      // winrate mide el matchup real de naturalezas, no el orden de turno.
      const swap = i % 2 === 1;
      const fa = attachAmmo(buildLabFighter(swap ? bKey : aKey, opts.level, { nominal: opts.nominal, tier: opts.tier }));
      const fb = attachAmmo(buildLabFighter(swap ? aKey : bKey, opts.level, { nominal: opts.nominal, tier: opts.tier }));

      const r = simulateCombat(fa, fb);

      const winnerKey = r.winner === "A" ? (swap ? "B" : "A") : r.winner === "B" ? (swap ? "A" : "B") : null;
      if (winnerKey === "A") winsA++;
      else if (winnerKey === "B") winsB++;
      else timeouts++;

      // Daño promedio por golpe por lado (mide la fórmula, no el orden).
      for (const entry of r.log) {
        if (!entry || entry.action !== "attack" || typeof entry.finalDamage !== "number") continue;
        const isA = String(entry.attacker).startsWith("A");
        const isB = String(entry.attacker).startsWith("B");
        if (isA) {
          hitsA++;
          dmgSumA += entry.finalDamage;
        } else if (isB) {
          hitsB++;
          dmgSumB += entry.finalDamage;
        }
      }

      roundsTotal += r.totalRounds || 0;
      if ((r.totalRounds || 0) > maxRoundsSeen) maxRoundsSeen = r.totalRounds;
    }

    const row = {
      buildA: aKey,
      buildB: bKey,
      winsA,
      winsB,
      timeouts,
      winrateA: (winsA / opts.numSims) * 100,
      avgRounds: roundsTotal / opts.numSims,
      maxRounds: maxRoundsSeen,
      dmgABad,
      dmgBBad,
      avgDmgA: hitsA ? Math.round((dmgSumA / hitsA) * 10) / 10 : null,
      avgDmgB: hitsB ? Math.round((dmgSumB / hitsB) * 10) / 10 : null,
    };
    allRows.push(row);

    if (opts.verbose) {
      console.log(`${aKey} vs ${bKey}: A=${row.winrateA.toFixed(1)}% B=${(100 - row.winrateA).toFixed(1)}% t/o=${timeouts} avgR=${row.avgRounds.toFixed(1)} maxR=${row.maxRounds} dmgA=${row.avgDmgA} dmgB=${row.avgDmgB}`);
    }
  }

  // ── Reporte ──
  const lines = [];
  lines.push(`# Laboratorio de Naturalezas — Fase B`);
  lines.push("");
  lines.push(`Config: sims=${opts.numSims}/par | nivel=${opts.level} | nominalDamage=${opts.nominal} | tier=${opts.tier} | maxRounds=${opts.maxRounds}`);
  lines.push(`Build: NEUTRAL (misma stats para todas; solo cambia la fórmula del arma)`);
  lines.push(`Método: swap de orden de ataque por sim (anula el sesgo del primer atacante)`);
  lines.push("");
  lines.push(`## Espejos (winrate ~50%, mide turnos)`);
  lines.push(`Target: 7 turnos de media | desventaja ≤ ${opts.maxRounds}`);
  lines.push("");
  lines.push(`| Naturaleza | avgRounds | maxRounds | timeouts | avgDmg/golpe |`);
  lines.push(`| --- | --- | --- | --- | --- |`);
  for (const r of allRows.filter((x) => x.buildA === x.buildB)) {
    const flag = Math.abs(r.avgRounds - 7) <= 1.5 ? "✅" : Math.abs(r.avgRounds - 7) <= 3 ? "⚠️" : "❌";
    lines.push(`| ${r.buildA} | ${r.avgRounds.toFixed(1)} ${flag} | ${r.maxRounds} | ${r.timeouts} | ${r.avgDmgA ?? "-"} |`);
  }

  if (!opts.mirrorOnly) {
    lines.push("");
    lines.push(`## Cross (naturaleza A vs B, winrate sin sesgo de orden)`);
    lines.push(`| Naturaleza A | Naturaleza B | winrate A% | avgRounds | maxRounds | timeouts | dmgA | dmgB |`);
    lines.push(`| --- | --- | --- | --- | --- | --- | --- | --- |`);
    for (const r of allRows.filter((x) => x.buildA !== x.buildB)) {
      lines.push(`| ${r.buildA} | ${r.buildB} | ${r.winrateA.toFixed(1)} | ${r.avgRounds.toFixed(1)} | ${r.maxRounds} | ${r.timeouts} | ${r.avgDmgA ?? "-"} | ${r.avgDmgB ?? "-"} |`);
    }
  }

  lines.push("");
  lines.push(`## Invariantes`);
  const timeoutsPairs = allRows.filter((r) => r.timeouts > 0);
  lines.push(`- Sin timeouts: ${timeoutsPairs.length ? "❌ VIOLADO" : "✅ OK"}`);
  lines.push(`- Espejo en target 7 ±1.5: ${allRows.filter((r) => r.buildA === r.buildB && Math.abs(r.avgRounds - 7) <= 1.5).length}/${allRows.filter((r) => r.buildA === r.buildB).length}`);

  const mdName = path.join("experiments", `${tag}_report.md`);
  fs.writeFileSync(path.join(OUT_DIR, mdName), lines.join("\n"));

  const raw = {
    config: { numSims: opts.numSims, level: opts.level, nominal: opts.nominal, tier: opts.tier, mirrorOnly: opts.mirrorOnly, maxRounds: opts.maxRounds, builds: buildKeys },
    rows: allRows,
    invariantes: {
      noTimeouts: timeoutsPairs.length === 0,
      timeoutsPairs,
    },
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(OUT_DIR, path.join("experiments", `${tag}_raw.json`)), JSON.stringify(raw, null, 2));

  console.log("");
  console.log(`Invariante sin timeouts: ${raw.invariantes.noTimeouts ? "✅ OK" : "❌ VIOLADO (ver reporte)"}`);
  console.log(`  Report: ${path.join(OUT_DIR, mdName)}`);
  console.log(`  Raw:    ${path.join(OUT_DIR, path.join("experiments", `${tag}_raw.json`))}`);
}

main();
