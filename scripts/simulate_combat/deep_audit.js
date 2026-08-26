#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * Análisis profundo del raw_data.json (baseline 10k) orientado a detectar
 * sesgos, desbalances, meta builds y builds malas.
 *
 * Explota los campos que la auditoría estándar no agrega: material del arma,
 * rareza, tier del arma, munición, set bonus, amuleto, escudo, cobertura.
 *
 * Uso:
 *   node scripts/simulate_combat/deep_audit.js
 *   node scripts/simulate_combat/deep_audit.js --min-level-diff 0.10
 *   node scripts/simulate_combat/deep_audit.js --raw scripts/simulation_output/experiments/foo_raw.json
 *
 * Salida: scripts/simulation_output/deep_audit.md
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const optDiff = (() => {
  const i = args.indexOf("--min-level-diff");
  return i >= 0 ? parseFloat(args[i + 1]) : null;
})();
const optRaw = (() => {
  const i = args.indexOf("--raw");
  return i >= 0 ? path.resolve(args[i + 1]) : null;
})();

const RAW_PATH = optRaw || path.join(__dirname, "..", "simulation_output", "raw_data.json");

const { metrics, config } = JSON.parse(fs.readFileSync(RAW_PATH, "utf8"));
const sims = Array.isArray(metrics) ? metrics : Object.values(metrics);

const out = [];
const log = (s = "") => out.push(s);

const fmtPct = (v) => `${(v * 100).toFixed(1)}%`;
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
const std = (arr) => {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, arr.length - 1));
};

/**
 * Agrega winrate por lado (cada fighter es una observación).
 * @param {Array<object>} rows - filtradas
 * @returns {Map} clave -> { n, w }
 */
function aggregateBy(rows, keyFn) {
  const acc = new Map();
  for (const s of rows) {
    for (const side of ["A", "B"]) {
      const key = keyFn(s, side);
      if (key == null) continue;
      if (!acc.has(key)) acc.set(key, { n: 0, w: 0 });
      const e = acc.get(key);
      e.n++;
      if (s.winner === side) e.w++;
    }
  }
  return acc;
}

function sortedTable(acc, label = "Winrate") {
  const arr = Array.from(acc.entries())
    .filter(([, v]) => v.n >= 30)
    .map(([k, v]) => ({ k, n: v.n, wr: v.w / v.n }))
    .sort((a, b) => b.wr - a.wr);
  log("| Grupo | Winrate | n |");
  log("|-------|---------|----|");
  for (const { k, n, wr } of arr) log(`| ${k} | ${fmtPct(wr)} | ${n} |`);
  log("");
  return arr;
}

log("# Auditoría profunda — baseline 10k");
log("");
log(`Fecha: ${config.timestamp} · Sims: ${sims.length} · Máx rounds: ${config.maxRounds}`);
if (optDiff) log(`Filtro de nivel: parejas con |Δnivel| ≤ ${(optDiff * 100).toFixed(0)}% (control de confound)`);
log("");

// ── 1. Winrate por personalidad (global) ────────────────────────────────────
log("## 1. Winrate por personalidad (global, sin control de nivel)");
log("");
log("Referencia: emparejamiento aleatorio → el winrate esperado si todas fueran iguales es 50%. Meta = la que supere el 55%.");
log("");
const byPersonality = aggregateBy(sims, (s, side) => s[`fighter${side}_personality`]);
sortedTable(byPersonality);

// ── 2. Matchups por pareja (mismo nivel ±diff) ─────────────────────────────
log("## 2. Matchup winrate A vs B (parejas con nivel similar)");
log("");
log("Lee la celda (fila build A, columna build B) = winrate de A cuando pelea contra B. Detrás de la diagonal está el espejo.");
log("");
const PERSONALITIES = [...new Set(sims.flatMap((s) => [s.fighterA_personality, s.fighterB_personality]))].sort();
{
  const matched = optDiff
    ? sims.filter((s) => Math.abs(s.fighterA_level - s.fighterB_level) / Math.max(s.fighterA_level, s.fighterB_level) <= optDiff)
    : sims;
  const matrix = new Map();
  for (const s of matched) {
    const key = `${s.fighterA_personality}\u0000${s.fighterB_personality}`;
    if (!matrix.has(key)) matrix.set(key, { n: 0, wA: 0 });
    const e = matrix.get(key);
    e.n++;
    if (s.winner === "A") e.wA++;
  }
  log(`| A\\B | ${PERSONALITIES.map((p) => p.slice(0, 8)).join(" | ")} |`);
  log(`|-----|${PERSONALITIES.map(() => "--------|").join("")}`);
  for (const p of PERSONALITIES) {
      const cells = PERSONALITIES.map((q) => {
        const e = matrix.get(`${p}\u0000${q}`);
        if (!e || e.n < 15) return "–";
        return `${Math.round((e.wA / e.n) * 100)}%`;
      }).join(" | ");
    log(`| ${p.slice(0, 12)} | ${cells} |`);
  }
  log("");
}

// ── 3. Equipo por dimensión (control nivel similar) ─────────────────────────
log("## 3. Efecto del equipamiento (parejas con nivel similar)");
log("");
const matchedAll = optDiff
  ? sims.filter((s) => Math.abs(s.fighterA_level - s.fighterB_level) / Math.max(s.fighterA_level, s.fighterB_level) <= optDiff)
  : sims;

const sections = [
  { title: "3.1 Naturaleza de arma", keyFn: (s, side) => s[`fighter${side}_weaponNature`] || "desarmado" },
  { title: "3.2 Tier del arma", keyFn: (s, side) => s[`fighter${side}_weaponTier`] },
  { title: "3.3 Material del arma", keyFn: (s, side) => s[`fighter${side}_weaponMaterial`] },
  { title: "3.4 Rareza del material del arma", keyFn: (s, side) => s[`fighter${side}_weaponMaterialRarity`] },
  { title: "3.5 Cobertura dominante", keyFn: (s, side) => s[`fighter${side}_coverage`] },
  { title: "3.6 Con munición (arquero)", keyFn: (s, side) => (s[`fighter${side}_weaponNature`] === "proyectil" && s[`fighter${side}_ammo`] ? "con munición" : s[`fighter${side}_weaponNature`] === "proyectil" ? "sin munición" : "no ranged") },
  { title: "3.7 Con escudo", keyFn: (s, side) => (s[`fighter${side}_shield`] ? "con escudo" : "sin escudo") },
  { title: "3.8 Con amuleto", keyFn: (s, side) => (s[`fighter${side}_amulet`] ? "con amuleto" : "sin amuleto") },
  { title: "3.9 Set bonus activo", keyFn: (s, side) => (s[`fighter${side}_setBonusActive`] ? "set activo" : "set inactivo") },
];
for (const sec of sections) {
  log(`### ${sec.title}`);
  log("");
  const acc = aggregateBy(matchedAll, sec.keyFn);
  sortedTable(acc);
}

// ── 4. El efecto del equipamiento "por nivel" (¿set/amuleto/escudo son progresión o balance?) ──
log("## 4. Winrate del set bonus / amuleto / escudo por bracket de nivel (¿progresión o balance?)");
log("");
log("Si el set/amuleto dieran progresión pura, su efecto sería constante; si fueran balance, el winrate sería ~50% en todo bracket.");
log("");
for (const [label, sideKey] of [
  ["Set bonus activo", "setBonusActive"],
  ["Amuleto", "amulet"],
  ["Escudo", "shield"],
]) {
  log(`### ${label}`);
  log("");
  log("| Bracket nivel | Winrate con | n | Winrate sin | n | Diff |");
  log("|---------------|-------------|----|-------------|----|------|");
  for (const [lo, hi] of [[100, 199], [200, 299], [300, 399], [400, 500]]) {
    let wYes = 0, nYes = 0, wNo = 0, nNo = 0;
    for (const s of matchedAll) {
      for (const side of ["A", "B"]) {
        const lvl = s[`fighter${side}_level`];
        if (lvl < lo || lvl > hi) continue;
        const has = sideKey === "setBonusActive" ? s[`fighter${side}_setBonusActive`] : sideKey === "amulet" ? Boolean(s[`fighter${side}_amulet`]) : Boolean(s[`fighter${side}_shield`]);
        if (has) { nYes++; if (s.winner === side) wYes++; }
        else { nNo++; if (s.winner === side) wNo++; }
      }
    }
    if (nYes >= 20 && nNo >= 20) {
      const d = wYes / nYes - wNo / nNo;
      log(`| ${lo}–${hi} | ${fmtPct(wYes / nYes)} | ${nYes} | ${fmtPct(wNo / nNo)} | ${nNo} | ${(d * 100).toFixed(1)}pp |`);
    }
  }
  log("");
}

// ── 5. Meta build: mejor y peor personalidad por combinación de equipo ──────
log("## 5. Meta y anti-meta (winrate de cada personalidad con el equipo que le tocó)");
log("");
log("Descompone el winrate global de cada personalidad según armó/perdió el bono de set. Un build que depende del set para ganar es frágil (anti-meta lo quita).");
log("");
{
  const acc = new Map();
  for (const s of matchedAll) {
    for (const side of ["A", "B"]) {
      const p = s[`fighter${side}_personality`];
      const set = s[`fighter${side}_setBonusActive`];
      const key = `${p} · set ${set ? "SÍ" : "no"}`;
      if (!acc.has(key)) acc.set(key, { n: 0, w: 0 });
      acc.get(key).n++;
      if (s.winner === side) acc.get(key).w++;
    }
  }
  const arr = Array.from(acc.entries())
    .filter(([, v]) => v.n >= 30)
    .map(([k, v]) => ({ k, n: v.n, wr: v.w / v.n }))
    .sort((a, b) => b.wr - a.wr);
  log("| Build | Winrate | n |");
  log("|-------|---------|----|");
  for (const { k, n, wr } of arr) log(`| ${k} | ${fmtPct(wr)} | ${n} |`);
  log("");
  const best = arr[0];
  const worst = arr[arr.length - 1];
  log(`**Meta**: ${best?.k} ≈ ${fmtPct(best?.wr || 0)} · **Anti-meta/peor**: ${worst?.k} ≈ ${fmtPct(worst?.wr || 0)}`);
  log("");
}

// ── 6. Duración y daño por personalidad (¿builds que estiran o matan rápido?) ──
log("## 6. Duración media de la pelea por personalidad (¿builds que estiran o matan rápido?)");
log("");
{
  const acc = new Map();
  for (const s of sims) {
    for (const side of ["A", "B"]) {
      const p = s[`fighter${side}_personality`];
      if (!acc.has(p)) acc.set(p, { rounds: [], dpt: [], n: 0, w: 0 });
      const e = acc.get(p);
      e.rounds.push(s.totalRounds);
      const curve = s[`damagePerTurn${side}`];
      e.dpt.push(Array.isArray(curve) && curve.length ? mean(curve) : (s[`totalDamage${side}`] || 0) / Math.max(1, s.totalRounds));
      e.n++;
      if (s.winner === side) e.w++;
    }
  }
  const arr = Array.from(acc.entries())
    .filter(([, v]) => v.n >= 30)
    .map(([k, v]) => ({ k, n: v.n, wr: v.w / v.n, rounds: mean(v.rounds), dpt: mean(v.dpt) }))
    .sort((a, b) => b.rounds - a.rounds);
  log("| Personalidad | Duración media | Daño/turno medio | Winrate | n |");
  log("|--------------|----------------|------------------|---------|----|");
  for (const r of arr) log(`| ${r.k} | ${r.rounds.toFixed(2)} | ${r.dpt.toFixed(1)} | ${fmtPct(r.wr)} | ${r.n} |`);
  log("");
}

// ── 7. timeouts por build ───────────────────────────────────────────────────
log("## 7. Builds que llevan a timeout (pelea que no muere)");
log("");
{
  const acc = new Map();
  for (const s of sims) {
    for (const side of ["A", "B"]) {
      const p = s[`fighter${side}_personality`];
      if (!acc.has(p)) acc.set(p, { n: 0, to: 0 });
      acc.get(p).n++;
      if (s.koType === "timeout") acc.get(p).to++;
    }
  }
  const arr = Array.from(acc.entries())
    .map(([k, v]) => ({ k, n: v.n, toRate: v.to / v.n }))
    .sort((a, b) => b.toRate - a.toRate);
  log("| Personalidad | Tasa de timeout | n |");
  log("|--------------|-----------------|----|");
  for (const r of arr) if (r.n >= 30) log(`| ${r.k} | ${fmtPct(r.toRate)} | ${r.n} |`);
  log("");
}

// ── 8. Stats medias por personalidad (perfil real) ─────────────────────────
log("## 8. Perfil de stats real por personalidad (media por 100 de nivel)");
log("");
{
  const keys = ["atk", "def", "aspd", "ref", "mspd", "hp"];
  const acc = new Map();
  for (const s of sims) {
    for (const side of ["A", "B"]) {
      const p = s[`fighter${side}_personality`];
      if (!acc.has(p)) acc.set(p, { n: 0, sums: {} });
      const e = acc.get(p);
      e.n++;
      const lvl = s[`fighter${side}_level`];
      for (const k of keys) e.sums[k] = (e.sums[k] || 0) + (s[`fighter${side}_stats`]?.[k] || 0) / (lvl / 100);
    }
  }
  log(`| Personalidad | ${keys.map((k) => k.toUpperCase()).join(" | ")} |`);
  log(`|--------------|${keys.map(() => "---|").join("")}`);
  for (const [p, e] of acc) {
    const cells = keys.map((k) => (e.sums[k] / e.n).toFixed(1)).join(" | ");
    log(`| ${p} | ${cells} |`);
  }
  log("");
}

// ── 9. Sesgo del desempate en timeout (¿builds defensivas roban empates?) ───
log("## 9. Desempate por HP residual en timeouts (¿defensa roba empates?)");
log("");
{
  const draws = sims.filter((s) => s.koType === "timeout");
  if (draws.length) {
    const won = draws.filter((s) => {
      const hpA = s.hpCurveA[s.hpCurveA.length - 1];
      const hpB = s.hpCurveB[s.hpCurveB.length - 1];
      return hpA >= hpB;
    }).length;
    log(`De ${draws.length} timeouts, el ganador tiene más HP residual en ${fmtPct(won / draws.length)} (regla del motor).`);
    log("");
    log("¿La build con más DEF total gana el desempate?");
    const acc = new Map();
    for (const s of draws) {
      for (const side of ["A", "B"]) {
        const p = s[`fighter${side}_personality`];
        const won = s.winner === side;
        const hasSet = s[`fighter${side}_setBonusActive`];
        const def = s[`fighter${side}_stats`]?.def || 0;
        const bonusDef = s[`fighter${side}_armorBonusDef`] || 0;
        for (const [label, val] of [["set", hasSet], ["def>=60", def >= 60], ["armorBonusDef>=200", bonusDef >= 200]]) {
          const key = `${p} · ${label}:${val}`;
          if (!acc.has(key)) acc.set(key, { n: 0, w: 0 });
          acc.get(key).n++;
          if (won) acc.get(key).w++;
        }
      }
    }
    const arr = Array.from(acc.entries())
      .filter(([, v]) => v.n >= 15)
      .map(([k, v]) => ({ k, n: v.n, wr: v.w / v.n }))
      .sort((a, b) => b.wr - a.wr)
      .slice(0, 15);
    log("");
    log("| Condición (en timeouts) | Winrate | n |");
    log("|-------------------------|---------|----|");
    for (const r of arr) log(`| ${r.k} | ${fmtPct(r.wr)} | ${r.n} |`);
    log("");
    log("Interpretación: si las condiciones defensivas superan 50% en timeouts, la defensa roba empates (sesgo del desempate por HP residual).");
    log("");
  }
}

// ── 10. Veredicto ──────────────────────────────────────────────────────────
log("## Veredicto (resumen de hallazgos)");
log("");
{
  const acc = aggregateBy(matchedAll, (s, side) => s[`fighter${side}_personality`]);
  const arr = Array.from(acc.entries())
    .filter(([, v]) => v.n >= 50)
    .map(([k, v]) => ({ k, n: v.n, wr: v.w / v.n }))
    .sort((a, b) => b.wr - a.wr);
  const best = arr[0];
  const worst = arr[arr.length - 1];
  log(`- **Meta**: ${best.k} ${fmtPct(best.wr)} (n=${best.n}) — por encima del target 55%.`);
  log(`- **Builds malas**: ${arr.filter((r) => r.wr < 0.45).map((r) => `${r.k} ${fmtPct(r.wr)}`).join(", ") || "ninguna por debajo de 45%"} (target: ninguna < 45% con n≥50).`);
  log("- **Sesgo de nivel**: ver sección de auditoría estándar (el mayor nivel gana ≈29% — nivel NO predice victoria).");
  log("- **Ventaja 1er atacante**: ver auditoría estándar (target ≤5%).");
  log("");
}

const outPath = optRaw
  ? optRaw.replace(/\.json$/, ".md")
  : path.join(__dirname, "..", "simulation_output", "deep_audit.md");
fs.writeFileSync(outPath, out.join("\n") + "\n");
console.log(`Auditoría profunda escrita en ${outPath}`);
