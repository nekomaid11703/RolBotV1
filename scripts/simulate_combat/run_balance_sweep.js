// @ts-nocheck
"use strict";
/**
 * Harness de balance: aplica overrides de parámetros de combate EN MEMORIA
 * (antes de que cualquier módulo haga destructuring) y corre el lab completo.
 * Permite grid search de fórmulas/fatiga/kite sin editar archivos fuente.
 *
 * Uso:
 *   node run_balance_sweep.js --override FATIGUE_SCALE_PER_5M=0 --override KITE_FATIGUE_MULTIPLIER=3 --nominal 20 --tier B
 */

// ── 1. Parsear overrides ANTES de cualquier require de balance ──
const args = process.argv.slice(2);
function argVal(name, dflt) {
  const i = args.indexOf("--" + name);
  return i >= 0 ? args[i + 1] : dflt;
}
const hasFlag = (name) => args.includes("--" + name);

const overrides = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--override") {
    const kv = args[++i];
    const eq = kv.indexOf("=");
    const key = kv.slice(0, eq);
    let val = kv.slice(eq + 1);
    if (/^-?\d+(\.\d+)?$/.test(val)) val = parseFloat(val);
    else if (val === "true") val = true;
    else if (val === "false") val = false;
    overrides[key] = val;
  }
}

const balance = require("../../src/config/combatBalance");
for (const [k, v] of Object.entries(overrides)) {
  balance[k] = v;
}
// Los módulos que siguen hacen destructuring de combatBalance → toman los valores mutados.

// ── 2. Config del simulador ──
const simConfig = require("./config");
for (const [k, v] of Object.entries(overrides)) {
  if (k in simConfig) simConfig[k] = v;
}

const { simulateCombat } = require("./combatLoop");
const { getWeaponStats, getProjectileStats } = require("../../src/services/rpg/itemStatService");
const { getEffectiveWeaponRange } = require("../../src/services/rpg/combatEngine");

const NEUTRAL = { atk: 20, def: 20, aspd: 20, ref: 20, mspd: 20, hp: 20 };
const NATURES = { cortante: true, contundente: true, perforante: true, proyectil: false, desarmado: true };

const nivel = parseInt(argVal("level", "300"), 10);
const nominal = parseInt(argVal("nominal", "20"), 10);
const tier = String(argVal("tier", "B")).toUpperCase();
const numSims = parseInt(argVal("n", "400"), 10);
const mirrorOnly = hasFlag("mirror-only");

function buildLabFighter(nature, n, nominal, t) {
  const PHYSICAL = ["atk", "def", "aspd", "ref", "mspd"];
  const totalW = Object.values(NEUTRAL).reduce((a, b) => a + b, 0);
  const stats = { atk: 1, def: 1, aspd: 1, ref: 1, mspd: 1, hp: 1 };
  const budget = Math.max(n - (PHYSICAL.length + 1), 0);
  for (const k of [...PHYSICAL, "hp"]) stats[k] += Math.floor((NEUTRAL[k] / totalW) * budget);
  const leftover = budget - (Object.values(stats).reduce((a, b) => a + b, 0) - (PHYSICAL.length + 1));
  stats.atk += Math.floor(leftover / 2);
  stats.hp += leftover - Math.floor(leftover / 2);

  const ranged = nature === "proyectil";
  const ws = getWeaponStats({ tier: t, material: "hierro", modules: { weapon: { damageNature: nature, baseDamage: nominal, hands: ranged ? 2 : 1, weaponRange: ranged ? 20 : 1, ranged } } });
  let arrow = null;
  if (ranged) {
    const as = getProjectileStats({ tier: t, material: "hierro", modules: { weapon: { damageNature: "proyectil", baseDamage: nominal, hands: 1, weaponRange: 0 } } });
    arrow = { id: "flecha_lab", name: "Flecha Lab", tier: t, baseDamage: as.baseDamage, damageNature: "proyectil", material: "hierro" };
  }
  const weapon = { ...ws, arrow, ammoCount: arrow ? 30 : 0 };
  const fighter = {
    name: nature, stats: { ...stats, fulgor: 1, d_fulgor: 1, r_fulgor: 1 }, nivel: n, race: "lab", personality: nature, hp: stats.hp * 3,
    equipment: { tierKey: t, weapon, armorList: [], armor: null, shield: null, amulet: null, ammo: null },
    loadout: [],
  };
  if (arrow) fighter.equipment.ammo = { id: "flecha_lab", name: "Flecha Lab", count: 30, baseDamage: arrow.baseDamage, tier: t, material: "hierro" };
  return fighter;
}

const keys = Object.keys(NATURES).filter((k) => !mirrorOnly || true);
const pairs = [];
for (const a of keys) for (const b of keys) if (!mirrorOnly || a === b) pairs.push([a, b]);

function runPair(aKey, bKey, sims) {
  let winsA = 0, winsB = 0, to = 0, rTot = 0, hitsA = 0, hitsB = 0, dA = 0, dB = 0;
  for (let i = 0; i < sims; i++) {
    const swap = i % 2 === 1;
    const fa = buildLabFighter(swap ? bKey : aKey, nivel, nominal, tier);
    const fb = buildLabFighter(swap ? aKey : bKey, nivel, nominal, tier);
    const r = simulateCombat(fa, fb);
    const wk = r.winner === "A" ? (swap ? "B" : "A") : r.winner === "B" ? (swap ? "A" : "B") : null;
    if (wk === "A") winsA++; else if (wk === "B") winsB++; else to++;
    rTot += r.totalRounds || 0;
    for (const e of r.log) {
      if (!e || e.action !== "attack" || typeof e.finalDamage !== "number") continue;
      if (String(e.attacker).startsWith("A")) { hitsA++; dA += e.finalDamage; } else if (String(e.attacker).startsWith("B")) { hitsB++; dB += e.finalDamage; }
    }
  }
  return { buildA: aKey, buildB: bKey, winrateA: (winsA / sims) * 100, timeouts: to, avgRounds: rTot / sims, avgDmgA: hitsA ? Math.round(dA / hitsA * 10) / 10 : null, avgDmgB: hitsB ? Math.round(dB / hitsB * 10) / 10 : null };
}

const rows = pairs.map(([a, b]) => runPair(a, b, numSims));

// ── Resumen ──
console.log("=== OVERRIDES ===");
console.log(JSON.stringify(overrides));
console.log("=== MATRIZ winrateA% / avgRounds ===");
const names = keys;
let header = "A\\B".padEnd(12);
for (const b of names) header += b.slice(0, 12).padEnd(14);
console.log(header);
for (const a of names) {
  let line = a.padEnd(12);
  for (const b of names) {
    const r = rows.find((x) => x.buildA === a && x.buildB === b);
    line += (r ? r.winrateA.toFixed(0) + "/" + r.avgRounds.toFixed(1) + "/d" + (r.avgDmgA ?? 0).toFixed(0) : "----").padEnd(14);
  }
  console.log(line);
}

// Métricas resumen
const mirrors = rows.filter((r) => r.buildA === r.buildB && r.buildA !== "desarmado");
const cross = rows.filter((r) => r.buildA !== r.buildB);
const nonProj = cross.filter((r) => r.buildA !== "proyectil" && r.buildB !== "proyectil");
const projCross = cross.filter((r) => r.buildA === "proyectil" || r.buildB === "proyectil");
const avgMirrorRounds = mirrors.length ? mirrors.reduce((s, r) => s + r.avgRounds, 0) / mirrors.length : 0;
const worstNonProjBias = nonProj.length ? Math.max(...nonProj.map((r) => Math.abs(r.winrateA - 50))) : 0;
const worstProjBias = projCross.length ? Math.max(...projCross.map((r) => Math.abs(r.winrateA - 50))) : 0;
const avgProjBias = projCross.length ? projCross.reduce((s, r) => s + Math.abs(r.winrateA - 50), 0) / projCross.length : 0;
console.log("=== METRICAS ===");
console.log("avgRounds espejo:", avgMirrorRounds.toFixed(2), "| target 7 ±1.5");
console.log("peor sesgo melee-vs-melee (%pts vs 50):", worstNonProjBias.toFixed(1));
console.log("peor sesgo proyectil vs melee (%pts vs 50):", worstProjBias.toFixed(1), "| promedio:", avgProjBias.toFixed(1));
console.log("mirrors:", JSON.stringify(mirrors.map((r) => ({ n: r.buildA, r: r.avgRounds.toFixed(1), w: r.winrateA.toFixed(0) }))));
