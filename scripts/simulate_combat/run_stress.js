#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * Runner de ESTRÉS matemático (Fase A del plan de balance).
 *
 * Construye fighters deterministas desde STRESS_BUILDS (sin jitter ni magia
 * aleatoria), les aplica equipo según la sub-fase y barre todos los pares
 * (incluidos espejos), verificando los INVARIANTES de la base:
 *   1. El daño por golpe NUNCA es 0, negativo, NaN o Infinity.
 *   2. Los combates terminan por KO en ≤ maxRounds turnos (sin timeout).
 *
 * Sub-fases (--phase):
 *   none   — sin equipamiento: stats puras, fórmulas cuerpo a cuerpo
 *   weapon — solo arma (naturaleza forzada), sin armadura
 *   full   — arma + armadura + set + escudo + amuleto (capa completa)
 *
 * Variantes de nivel:
 *   --level 300      nivel medio (presupuesto ~300)
 *   --level 100      nivel bajo (piso de daño)
 *   --clamp          todas las stats al clamp máximo (techo absoluto)
 *
 * Uso:
 *   node scripts/simulate_combat/run_stress.js -n 2000 --phase weapon --weapon espada --level 300
 *   node scripts/simulate_combat/run_stress.js -n 1000 --phase none --level 100
 *   node scripts/simulate_combat/run_stress.js -n 1000 --phase full --clamp
 *   node scripts/simulate_combat/run_stress.js -n 800 --phase weapon --weapon todos --level 300
 *
 * Opciones:
 *   -n, --num-sims <n>     Simulaciones por par (default: 1000)
 *   --phase <fase>         none | weapon | full (default: none)
 *   --weapon <lista>       none | espada | estoque | maza | arco | todos (default: espada)
 *   --level <n>            Nivel objetivo (default: 300)
 *   --clamp                Variante max-clamp: todas las stats al clamp
 *   --max-rounds <n>       Techo de rounds para el invariante (default: 30)
 *   --builds <lista>       Subconjunto de builds (default: todas)
 *   --tag <nombre>         Tag de salida (default: stress)
 *   -v, --verbose          Salida progreso
 *   -h, --help             Esta ayuda
 */

const path = require("path");
const fs = require("fs");
const { STRESS_BUILDS, buildStressFighter } = require("./stress_personalities");
const { getWeaponStats, getProjectileStats } = require("../../src/services/rpg/itemStatService");
const { getMaterialStats } = require("../../src/data/materialData");

const SIM_DIR = __dirname;
const WEAPON_POOL = {
  espada: { name: "Espada", nominalDamage: 20, damageNature: "cortante", hands: 1, weaponRange: 1, ranged: false },
  estoque: { name: "Estoque", nominalDamage: 14, damageNature: "perforante", hands: 1, weaponRange: 1, ranged: false },
  maza: { name: "Maza", nominalDamage: 22, damageNature: "contundente", hands: 1, weaponRange: 1, ranged: false },
  arco: { name: "Arco", nominalDamage: 0, damageNature: "proyectil", hands: 2, weaponRange: 20, ranged: true },
};

/**
 * Construye un arma determinista con la fórmula REAL del motor.
 * baseDamage = round(nominal × mult(tier) × afilabilidad/EDGE_SCALE)
 * @param {string} natureKey - clave de WEAPON_POOL
 * @param {string} [tier] - Tier de calidad (default "S")
 * @returns {object|null} weaponInfo
 */
function buildStressWeapon(natureKey, tier = "S") {
  const entry = WEAPON_POOL[natureKey];
  if (!entry) return null;
  const stats = getWeaponStats({
    tier,
    material: "hierro",
    modules: {
      weapon: {
        damageNature: entry.damageNature,
        baseDamage: entry.nominalDamage,
        hands: entry.hands,
        weaponRange: entry.weaponRange,
        ranged: entry.ranged,
      },
    },
  });

  let arrow = null;
  let ammoCount = 0;
  if (entry.ranged) {
    const arrowStats = getProjectileStats({
      tier,
      material: "hierro",
      modules: { weapon: { damageNature: "proyectil", baseDamage: 12, hands: 1, weaponRange: 0 } },
    });
    arrow = { id: "flecha_estres", name: "Flecha de Estrés", tier, baseDamage: arrowStats.baseDamage, damageNature: "proyectil", material: "hierro" };
    ammoCount = 30;
  }

  return {
    id: `estres_${natureKey}`,
    name: `${entry.name} de Estrés`,
    ...stats,
    arrow,
    ammoCount,
  };
}

/**
 * Construye una pieza de armadura determinista con la fórmula real.
 * @param {string} slot - slot corporal
 * @param {string} [coverage] - cobertura
 * @param {string} [tier] - tier
 * @returns {object} pieza con currentResist/maxResist
 */
function buildStressArmor(slot, coverage = "total", tier = "S") {
  const stats = getArmorStatsViaService({ tier, material: "hierro", modules: { armor: { slot, coverage } } });
  return {
    id: `${slot}_${coverage}`,
    name: `${slot} de Estrés`,
    material: "hierro",
    tier,
    slot,
    coverage,
    maxResist: stats.maxResist,
    currentResist: stats.maxResist,
    bonusDef: stats.bonusDef,
    setId: "set_estres",
  };
}

function getArmorStatsViaService(def) {
  // Reutiliza getArmorStats de itemStatService (misma fórmula que el motor)
  const tier = normalizeTier(def.tier || "E");
  const mat = getMaterialStats(def.material || "madera", tier);
  const armor = def.modules?.armor || {};
  const maxResist = Math.max(1, Math.round(mat.resistencia_material));
  return { maxResist, bonusDef: Math.round(maxResist / 2), coverage: armor.coverage || "media", slot: armor.slot || "pecho" };
}

function normalizeTier(t) {
  return String(t || "E").toUpperCase();
}

/**
 * Aplica el equipo según la sub-fase a un fighter de estrés.
 * @param {object} fighter - fighter de buildStressFighter
 * @param {string} phase - none | weapon | full
 * @param {string} weaponKey - clave de WEAPON_POOL (ignorada si phase=none)
 */
function applyPhaseEquipment(fighter, phase, weaponKey) {
  const eq = { tierKey: "S", weapon: null, armorList: [], armor: null, shield: null, amulet: null, ammo: null };

  if (phase !== "none" && weaponKey && WEAPON_POOL[weaponKey]) {
    eq.weapon = buildStressWeapon(weaponKey);
    if (eq.weapon?.arrow) eq.ammo = { id: eq.weapon.arrow.id, name: eq.weapon.arrow.name, count: eq.weapon.ammoCount, baseDamage: eq.weapon.arrow.baseDamage, tier: eq.weapon.arrow.tier, material: eq.weapon.arrow.material };
  }

  if (phase === "full") {
    const slots = ["cabeza", "pecho", "pantalones", "botas"];
    for (const slot of slots) {
      const piece = buildStressArmor(slot, "total");
      eq.armorList.push(piece);
    }
    const shield = buildStressArmor("mano_izq", "alta");
    shield.id = "escudo_estres";
    shield.name = "Escudo de Estrés";
    eq.armorList.push(shield);
    eq.shield = shield;
    const totalResist = eq.armorList.reduce((a, p) => a + (p.maxResist || 0), 0);
    const totalBonus = eq.armorList.reduce((a, p) => a + (p.bonusDef || 0), 0);
    eq.armor = { bonusDef: totalBonus, maxResist: totalResist, pieces: eq.armorList.length };
    eq.amulet = { id: "amuleto_estres", name: "Amuleto de Estrés", slot: "artefacto_1", buff: { atk: 5 } };
  }

  fighter.equipment = eq;
  return fighter;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { numSims: 1000, phase: "none", weapon: "espada", level: 300, clamp: false, maxRounds: 30, builds: null, tag: null, verbose: false, help: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-n":
      case "--num-sims":
        opts.numSims = parseInt(args[++i], 10);
        break;
      case "--phase":
        opts.phase = args[++i];
        if (!["none", "weapon", "full"].includes(opts.phase)) {
          console.error(`Error: fase desconocida "${opts.phase}" (esperado: none|weapon|full)`);
          process.exit(1);
        }
        break;
      case "--weapon":
        opts.weapon = args[++i];
        break;
      case "--level":
        opts.level = parseInt(args[++i], 10);
        break;
      case "--clamp":
        opts.clamp = true;
        break;
      case "--max-rounds":
        opts.maxRounds = parseInt(args[++i], 10);
        break;
      case "--builds":
        opts.builds = String(args[++i] || "")
          .split(",")
          .filter(Boolean);
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
  node scripts/simulate_combat/run_stress.js -n <sims> [--phase none|weapon|full] [--weapon espada|estoque|maza|arco|todos] [--level <n>] [--clamp] [--max-rounds <n>] [--builds a,b,c] [--tag <t>] [-v]

Opciones:
  -n, --num-sims <n>     Simulaciones por par (default: 1000)
  --phase <fase>         none | weapon | full (default: none)
  --weapon <lista>       none | espada | estoque | maza | arco | todos (default: espada)
  --level <n>            Nivel objetivo (default: 300)
  --clamp                Variante max-clamp: todas las stats al clamp
  --max-rounds <n>       Techo de rounds para el invariante (default: 30)
  --builds <lista>       Subconjunto de builds (default: todas)
  --tag <nombre>         Tag de salida (default: stress)
  -v, --verbose          Salida progreso
  -h, --help             Esta ayuda`);
}

function analyzeCombatLog(result) {
  let dmgMin = Infinity;
  let dmgMax = -Infinity;
  let dmgTotal = 0;
  let hits = 0;
  let badDamage = 0;
  let badReasons = [];
  let dodges = 0;
  for (const entry of result.log) {
    if (entry.action !== "attack") continue;
    const d = entry.finalDamage;
    const base = entry.baseDamage;
    hits++;
    // Esquiva legítima: finalDamage=0 porque el defensor esquivó → NO es daño inválido.
    if (entry.dodged === true) {
      dodges++;
      continue;
    }
    // baseDamage es el daño calculado puro por la fórmula: NUNCA debe ser 0/negativo/NaN/Inf.
    if (typeof base !== "number" || Number.isNaN(base) || !Number.isFinite(base) || base < 0) {
      badDamage++;
      badReasons.push(`baseDamage inválido=${JSON.stringify(base)}`);
      continue;
    }
    if (typeof d !== "number" || Number.isNaN(d) || !Number.isFinite(d)) {
      badDamage++;
      badReasons.push(`finalDamage no-finito=${JSON.stringify(d)}`);
      continue;
    }
    if (d < 0) {
      badDamage++;
      badReasons.push(`finalDamage negativo=${d}`);
      continue;
    }
    if (d === 0 && base > 0) {
      badDamage++;
      badReasons.push(`finalDamage=0 sin esquiva (nature=${entry.damageNature || "?"}, weapon=${entry.weapon || "?"})`);
      continue;
    }
    if (d < dmgMin) dmgMin = d;
    if (d > dmgMax) dmgMax = d;
    dmgTotal += d;
  }
  return {
    hits,
    dodges,
    dmgMin: hits ? dmgMin : null,
    dmgMax: hits ? dmgMax : null,
    dmgAvg: hits ? dmgTotal / Math.max(1, hits) : null,
    badDamage,
    badReasons: badReasons.slice(0, 8),
  };
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    printUsage();
    process.exit(0);
  }

  const buildKeys = opts.builds && opts.builds.length ? opts.builds : Object.keys(STRESS_BUILDS);
  const weaponKeys = opts.phase === "none"
    ? ["none"]
    : opts.weapon === "todos"
      ? Object.keys(WEAPON_POOL)
      : [opts.weapon];

  // Setea el techo de rounds del simulador al maxRounds pedido (invariante ≤30)
  const config = require("./config");
  config.MAX_ROUNDS = opts.maxRounds;
  // combatLoop desestructura MAX_ROUNDS al requerir; requerirlo DESPUÉS de mutar
  const { simulateCombat } = require("./combatLoop");

  const clampMax = opts.clamp ? 100 : null;
  const nivel = opts.clamp ? 500 : opts.level;

  const outDir = path.join(SIM_DIR, "..", "simulation_output");
  const experimentsDir = path.join(outDir, "experiments");
  fs.mkdirSync(experimentsDir, { recursive: true });

  const tag = opts.tag || `stress_${opts.phase}_${opts.clamp ? "clamp" : `lv${opts.level}`}`;
  const allRows = [];
  const badSummary = [];

  console.log(`Fase ${opts.phase.toUpperCase()} | nivel=${nivel}${opts.clamp ? " (clamp)" : ""} | maxRounds=${opts.maxRounds} | builds=${buildKeys.join(",")}`);
  console.log(`Armas: ${weaponKeys.join(", ")}`);
  console.log("");

  for (const wKey of weaponKeys) {
    for (const aKey of buildKeys) {
      for (const bKey of buildKeys) {
        let winsA = 0;
        let winsB = 0;
        let timeouts = 0;
        const dmgStatsA = { hits: 0, bad: 0, reasons: [] };
        const dmgStatsB = { hits: 0, bad: 0, reasons: [] };
        let roundsTotal = 0;
        let maxRoundsSeen = 0;

        for (let i = 0; i < opts.numSims; i++) {
          const fa = applyPhaseEquipment(buildStressFighter(aKey, nivel, clampMax ? { clampMax } : {}), opts.phase, wKey === "none" ? null : wKey);
          const fb = applyPhaseEquipment(buildStressFighter(bKey, nivel, clampMax ? { clampMax } : {}), opts.phase, wKey === "none" ? null : wKey);

          const r = simulateCombat(fa, fb);
          const logA = analyzeCombatLog({ ...r, log: r.log.filter((e) => e.attacker && String(e.attacker).startsWith("A")) });
          const logB = analyzeCombatLog({ ...r, log: r.log.filter((e) => e.attacker && String(e.attacker).startsWith("B")) });

          dmgStatsA.hits += logA.hits;
          dmgStatsA.bad += logA.badDamage;
          dmgStatsA.reasons.push(...logA.badReasons);
          dmgStatsB.hits += logB.hits;
          dmgStatsB.bad += logB.badDamage;
          dmgStatsB.reasons.push(...logB.badReasons);

          if (r.winner === "A") winsA++;
          else if (r.winner === "B") winsB++;
          else if (r.koType === "timeout") timeouts++;
          else if (r.winner === "draw") timeouts++; // empate por timeout

          roundsTotal += r.totalRounds || 0;
          if ((r.totalRounds || 0) > maxRoundsSeen) maxRoundsSeen = r.totalRounds;
        }

        const row = {
          fase: opts.phase,
          arma: wKey,
          buildA: aKey,
          buildB: bKey,
          winsA,
          winsB,
          timeouts,
          winrateA: (winsA / opts.numSims) * 100,
          avgRounds: roundsTotal / opts.numSims,
          maxRounds: maxRoundsSeen,
          dmgABad: dmgStatsA.bad,
          dmgBBad: dmgStatsB.bad,
        };
        allRows.push(row);

        if (dmgStatsA.bad || dmgStatsB.bad || timeouts > 0) {
          badSummary.push({ ...row, dmgAReasons: dmgStatsA.reasons.slice(0, 4), dmgBReasons: dmgStatsB.reasons.slice(0, 4) });
        }

        if (opts.verbose) {
          console.log(`${aKey} vs ${bKey} (${wKey}): A=${(row.winrateA).toFixed(1)}% B=${(100 - row.winrateA).toFixed(1)}% timeout=${timeouts} dmgBad(A/B)=${dmgStatsA.bad}/${dmgStatsB.bad}`);
        }
      }
    }
  }

  // ── Reporte ──
  const lines = [];
  lines.push(`# Stress Test — Fase A (${opts.phase})`);
  lines.push("");
  lines.push(`Config: sims=${opts.numSims}/par | nivel=${nivel}${opts.clamp ? " (clamp)" : ""} | maxRounds=${opts.maxRounds} | armas=${weaponKeys.join(", ")}`);
  lines.push(`Builds: ${buildKeys.join(", ")}`);
  lines.push("");
  lines.push(`## Invariantes`);
  lines.push(`- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ${badSummary.some((b) => b.dmgABad || b.dmgBBad) ? "❌ VIOLADO" : "✅ OK"}`);
  lines.push(`- Combates resueltos por KO en ≤ ${opts.maxRounds} turnos (sin timeout): ${badSummary.some((b) => b.timeouts > 0) ? "❌ VIOLADO" : "✅ OK"}`);
  lines.push("");

  const timeouts = badSummary.filter((b) => b.timeouts > 0);
  const dmgBad = badSummary.filter((b) => b.dmgABad || b.dmgBBad);
  if (timeouts.length) {
    lines.push(`## ⚠️ Timeouts detectados (${timeouts.length} pares)`);
    lines.push(`| Build A | Build B | Arma | timeouts | maxRounds |`);
    lines.push(`| --- | --- | --- | --- | --- |`);
    for (const b of timeouts) lines.push(`| ${b.buildA} | ${b.buildB} | ${b.arma} | ${b.timeouts} | ${b.maxRounds} |`);
    lines.push("");
  }
  if (dmgBad.length) {
    lines.push(`## ⚠️ Daño inválido detectado (${dmgBad.length} pares)`);
    lines.push(`| Build A | Build B | Arma | bad A | bad B | razones |`);
    lines.push(`| --- | --- | --- | --- | --- | --- |`);
    for (const b of dmgBad) {
      lines.push(`| ${b.buildA} | ${b.buildB} | ${b.arma} | ${b.dmgABad} | ${b.dmgBBad} | ${(b.dmgAReasons || []).concat(b.dmgBReasons || []).join("; ")} |`);
    }
    lines.push("");
  }

  lines.push(`## Resultados por par (winrate A)`);
  lines.push(`| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |`);
  lines.push(`| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`);
  for (const r of allRows) {
    lines.push(`| ${r.buildA} | ${r.buildB} | ${r.arma} | ${r.winsA} | ${r.winsB} | ${r.timeouts} | ${r.winrateA.toFixed(1)} | ${r.avgRounds.toFixed(1)} | ${r.maxRounds} | ${r.dmgABad}/${r.dmgBBad} |`);
  }

  const mdName = path.join("experiments", `${tag}_report.md`);
  fs.writeFileSync(path.join(outDir, mdName), lines.join("\n"));

  const raw = {
    config: { numSims: opts.numSims, phase: opts.phase, weapon: opts.weapon, level: nivel, clamp: opts.clamp, maxRounds: opts.maxRounds, builds: buildKeys },
    rows: allRows,
    invariantes: {
      damageValid: !dmgBad.length,
      noTimeouts: !timeouts.length,
      timeouts,
      dmgBad,
    },
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(outDir, path.join("experiments", `${tag}_raw.json`)), JSON.stringify(raw, null, 2));

  console.log("");
  console.log(`Invariante daño válido: ${raw.invariantes.damageValid ? "✅ OK" : "❌ VIOLADO (ver reporte)"}`);
  console.log(`Invariante sin timeouts: ${raw.invariantes.noTimeouts ? "✅ OK" : "❌ VIOLADO (ver reporte)"}`);
  console.log(`  Report: ${path.join(outDir, mdName)}`);
  console.log(`  Raw:    ${path.join(outDir, path.join("experiments", `${tag}_raw.json`))}`);
}

main();
