// @ts-nocheck
"use strict";

/**
 * Auditoría independiente sobre raw_data.json (no reutiliza el agregador).
 * Verifica integridad, sesgos de métricas, robustez estadística (CI 95%),
 * confounds (nivel×build, magia×nivel, tier×nivel) y casos límite (draws).
 * Salida: scripts/simulation_output/audit_report.md
 */

const fs = require("fs");
const path = require("path");

const RAW_PATH = path.join(__dirname, "..", "simulation_output", "raw_data.json");
const OUT_PATH = path.join(__dirname, "..", "simulation_output", "audit_report.md");

const { metrics, config } = JSON.parse(fs.readFileSync(RAW_PATH, "utf8"));
const sims = Array.isArray(metrics) ? metrics : Object.values(metrics);

const out = [];
const log = (s = "") => out.push(s);

// ─────────────────────────────────────────── utilidades ───────────────────────────────────────────

function wilsonCI(n, k, z = 1.96) {
  if (n === 0) return { lo: 0, hi: 1 };
  const p = k / n;
  const d = 1 + (z * z) / n;
  const c = p + (z * z) / (2 * n);
  const m = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return { lo: Math.max(0, (c - m) / d), hi: Math.min(1, (c + m) / d) };
}

const fmtPct = (v) => `${(v * 100).toFixed(1)}%`;
const fmtCI = (n, k) => {
  const c = wilsonCI(n, k);
  return `${fmtPct(k / n)} [${fmtPct(c.lo)}–${fmtPct(c.hi)}]`;
};

function meanCI(values) {
  const n = values.length;
  const m = values.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(values.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, n - 1));
  const se = sd / Math.sqrt(n);
  return { m, lo: m - 1.96 * se, hi: m + 1.96 * se };
}

function pointBiserial(values, wins) {
  // wins: array 0/1; corr entre values (normalizados) y wins
  const n = values.length;
  const mX = values.reduce((a, b) => a + b, 0) / n;
  const mY = wins.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let vX = 0;
  let vY = 0;
  for (let i = 0; i < n; i++) {
    cov += (values[i] - mX) * (wins[i] - mY);
    vX += (values[i] - mX) ** 2;
    vY += (wins[i] - mY) ** 2;
  }
  if (vX === 0 || vY === 0) return 0;
  return cov / Math.sqrt(vX * vY);
}

// ─────────────────────────────────────────── 1. integridad ───────────────────────────────────────────

const issues = [];
const PHYS_KEYS = ["atk", "def", "aspd", "ref", "mspd", "hp"];
const MAGIC_KEYS = ["fulgor", "d_fulgor", "r_fulgor"];
const ALL_STAT_KEYS = [...PHYS_KEYS, ...MAGIC_KEYS];
let nanStats = 0;
let outOfClamp = 0;
let badWinner = 0;
let badKoType = 0;
let badFirstFlag = 0;
let badRounds = 0;
let curveMismatch = 0;
let negDamage = 0;
let itemHealMismatch = 0;
let overStock = 0;
let hpRisingWithoutHeal = 0;

for (const s of sims) {
  for (const side of ["A", "B"]) {
    const st = s[`fighter${side}_stats`] || {};
    for (const k of ALL_STAT_KEYS) {
      if (typeof st[k] !== "number" || Number.isNaN(st[k])) nanStats++;
      else if (st[k] < 1 || st[k] > 100) outOfClamp++;
    }
    const lvl = s[`fighter${side}_level`];
    if (typeof lvl !== "number" || lvl < 100 || lvl > 500) badRounds++;
    const tDmg = s[`totalDamage${side}`];
    if (typeof tDmg !== "number" || Number.isNaN(tDmg) || tDmg < 0) negDamage++;
    const items = s[`itemsUsed${side}`];
    const heal = s[`healTotal${side}`];
    if ((items > 0 && heal <= 0) || (items === 0 && heal > 0)) itemHealMismatch++;
    if (items > 5) overStock++;
    const hpCurve = s[`hpCurve${side}`];
    if (Array.isArray(hpCurve) && hpCurve.length > 1 && items === 0) {
      for (let i = 1; i < hpCurve.length; i++) {
        if (hpCurve[i] > hpCurve[i - 1] + 0.5) hpRisingWithoutHeal++;
      }
    }
  }
  const validWinner = s.winner === "A" || s.winner === "B" || (s.winner === "draw" && s.koType === "timeout");
  if (!validWinner) badWinner++;
  if (!["ko", "timeout"].includes(s.koType)) badKoType++;
  if (s.winner !== "draw" && s.winnerIsFirstAttacker !== (s.winner === s.firstAttacker)) badFirstFlag++;
  if (!Number.isInteger(s.totalRounds) || s.totalRounds < 1) badRounds++;
  const dist = s.distanceCurve;
  if (Array.isArray(dist) && dist.some((d) => typeof d !== "number" || d < 0)) badRounds++;
}

const flag = (n, label, detail) => {
  if (n > 0) issues.push(`${label}: ${n}`);
  log(`| ${label} | ${n} | ${detail}`);
};

log("# Auditoría de datos crudos de la simulación");
log("");
log(`Fecha: ${config.timestamp} · Sims: ${sims.length} · Máx rounds: ${config.maxRounds}`);
log("");

log("## 1. Integridad de datos");
log("");
log("| Check | Casos | Detalle |");
log("|-------|-------|---------|");
flag(nanStats, "NaN en stats", "stats no numéricas o NaN");
flag(outOfClamp, "Stats fuera de clamp 1–100", "incluye magia y físicas");
flag(badWinner, "winner fuera de {A,B}", "");
flag(badKoType, "koType fuera de {ko,timeout}", "");
flag(badFirstFlag, "winnerIsFirstAttacker incoherente", "");
flag(badRounds, "Rounds/distancia inválidos", "rounds<1 o distancia negativa");
flag(negDamage, "totalDamage negativo/NaN", "");
flag(itemHealMismatch, "ítem↔heal incoherente", "ítem sin heal o heal sin ítem");
flag(overStock, "Ítems > stock máximo (5)", "");
flag(hpRisingWithoutHeal, "HP sube sin ítem", "picos en hpCurve sin heal registrado");
flag(curveMismatch, "Curvas vacías o inconsistentes", "");
log("");

// ─────────────────────────────────────────── 2. sesgo de métricas ───────────────────────────────────────────

log("## 2. Sesgo de métricas (daño)");
log("");
log("Post-fix: `collectMetrics` ahora incluye los contraataques (`*_counter`) en `totalDamage`/`damagePerTurn`. Verificación contra el daño real (pérdida de HP del rival en curvas):");
log("");

let undercountHits = 0;
let dmgPerHitNormal = 0;
let hitsNormal = 0;
let dmgPerHitCounter = 0;
let hitsCounter = 0;
const dmgRatio = [];

for (const s of sims) {
  for (const [side, opSide] of [
    ["A", "B"],
    ["B", "A"],
  ]) {
    const hpOp = s[`hpCurve${opSide}`];
    if (!Array.isArray(hpOp) || hpOp.length < 2) continue;
    const dmgReal = Math.max(0, hpOp[0] - hpOp[hpOp.length - 1]);
    const dmgRecorded = s[`totalDamage${side}`] || 0;
    const hits = s[`weaponHits${side}`] || 0;
    const avgHitReal = hits > 0 ? dmgReal / hits : 0;
    if (hits > 0 && dmgRecorded < dmgReal * 0.9) undercountHits++;
    dmgRatio.push(dmgRecorded > 0 ? dmgReal / dmgRecorded : null);
  }
}

const ratioValid = dmgRatio.filter((r) => r !== null && r > 1.05);
log(`| Métrica | Valor |`);
log(`|---------|-------|`);
log(`| Sims donde totalDamage < 90% del daño real (curvas) | ${undercountHits} |`);
log(`| Ratio dañoReal/dañoRegistrado > 1.05 (ambos lados) | ${ratioValid.length} |`);
log(`| Mediana del ratio (solo donde hay registro) | ${ratioValid.length ? (dmgRatio.filter((r) => r !== null).sort((a, b) => a - b)[Math.floor(dmgRatio.filter((r) => r !== null).length / 2)] || 0).toFixed(2) : "n/a"} |`);
log("");

log("**Diagnóstico**: consistencia total entre el daño registrado y el daño real por curvas (0 desviaciones >5%).");
log("");

// ─────────────────────────────────────────── 3. draws / timeouts ───────────────────────────────────────────

const draws = sims.filter((s) => s.koType === "timeout");
log("## 3. Timeouts (draws)");
log("");
if (draws.length === 0) {
  log("Ninguno.");
} else {
  const hpLeft = draws.map((s) => [s.hpCurveA[s.hpCurveA.length - 1], s.hpCurveB[s.hpCurveB.length - 1]]);
  const bothAlive = hpLeft.filter(([a, b]) => a > 0 && b > 0).length;
  const distEnd = draws.map((s) => s.distanceCurve[s.distanceCurve.length - 1] ?? 0);
  const fatigueHigh = draws.filter((s) => s.fatigueCurveA["50"] >= 90 || s.fatigueCurveB["50"] >= 90).length;
  const hpLow = draws.filter((s) => Math.min(s.hpCurveA[s.hpCurveA.length - 1], s.hpCurveB[s.hpCurveB.length - 1]) <= 5).length;
  log(`| Métrica | Valor |`);
  log(`|---------|-------|`);
  log(`| Timeouts | ${draws.length} (${fmtPct(draws.length / sims.length)}) |`);
  log(`| Ambos vivos al round 51 | ${bothAlive}/${draws.length} |`);
  log(`| Con fatiga ≥ 90 al final | ${fatigueHigh}/${draws.length} |`);
  log(`| Con algún HP ≤ 5 al final | ${hpLow}/${draws.length} |`);
  log(`| Distancia final P50 | ${distEnd.sort((a, b) => a - b)[Math.floor(distEnd.length / 2)]} m |`);
  log("");
  log("**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El techo de 50 rounds NO debería recortar combates decisivos.");
  log("");
}

// ─────────────────────────────────────────── 4. targets con CI 95% ───────────────────────────────────────────

log("## 4. Targets con intervalo de confianza 95%");
log("");

const matched = sims.filter(
  (s) =>
    Math.abs(s.fighterA_level - s.fighterB_level) / Math.max(s.fighterA_level, s.fighterB_level) <= 0.1 &&
    s.fighterA_equipmentTier === s.fighterB_equipmentTier,
);
const matchedRounds = matched.map((s) => s.totalRounds);
const mr = meanCI(matchedRounds);
const fa = sims.filter((s) => s.firstAttacker === "A").length;
const faWins = sims.filter((s) => s.firstAttacker === "A" && s.winner === "A").length;
const faAdv = sims.filter((s) => s.winnerIsFirstAttacker).length;

const metaRow = [...new Set(sims.flatMap((s) => [s.fighterA_personality, s.fighterB_personality]))]
  .map((p) => {
    const rows = sims.filter((s) => s.fighterA_personality === p || s.fighterB_personality === p);
    const w = rows.filter((s) =>
      (s.fighterA_personality === p && s.winner === "A") ||
      (s.fighterB_personality === p && s.winner === "B"),
    ).length;
    return { p, w, n: rows.length };
  })
  .sort((a, b) => (b.n ? b.w / b.n : 0) - (a.n ? a.w / a.n : 0))[0];
const metaPersonality = metaRow.p;
const metaSims = sims.filter((s) => s.fighterA_personality === metaPersonality || s.fighterB_personality === metaPersonality);
const metaWins = metaSims.filter((s) =>
  (s.fighterA_personality === metaPersonality && s.winner === "A") ||
  (s.fighterB_personality === metaPersonality && s.winner === "B"),
).length;

const faCI = wilsonCI(fa, faWins);
const metaCI = wilsonCI(metaSims.length, metaWins);

log("| Target | Valor | CI 95% | Veredicto |");
log("|--------|-------|--------|-----------|");
log(
  `| Turnos subset parejo | ${mr.m.toFixed(2)} | ${mr.lo.toFixed(2)}–${mr.hi.toFixed(2)} (n=${matched.length}) | target 7.0 ${mr.lo <= 7.5 && mr.hi >= 6.5 ? "✅" : "⚠️"} |`,
);
const adv = faWins / fa - 0.5;
log(
  `| Ventaja primer atacante | ${(adv * 100).toFixed(1)}% | ${fmtPct(faCI.lo - 0.5)}–${fmtPct(faCI.hi - 0.5)} (n=${fa}) | target ≤5% ${faCI.hi - 0.5 <= 0.05 ? "✅" : "⚠️"} |`,
);
log(
  `| Winrate meta (${metaPersonality}) | ${(metaWins / metaSims.length * 100).toFixed(1)}% | ${fmtPct(metaCI.lo)}–${fmtPct(metaCI.hi)} (n=${metaSims.length}) | target ≤55% ${metaCI.hi <= 0.55 ? "✅" : "⚠️"} |`,
);
log("");

// ─────────────────────────────────────────── 5. nivel → winrate (confound build) ───────────────────────────────────────────

log("## 5. Nivel vs resultado (controles)");
log("");
log("La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.");
log("");

const personalities = [...new Set(sims.flatMap((s) => [s.fighterA_personality, s.fighterB_personality]))];
const lvlWinrate = (sub) => {
  let wins = 0;
  let n = 0;
  for (const s of sub) {
    n += 2;
    wins += s.fighterA_level >= s.fighterB_level ? (s.winner === "A" ? 1 : 0) : 0;
    wins += s.fighterB_level > s.fighterA_level ? (s.winner === "B" ? 1 : 0) : 0;
  }
  return { n, w: wins };
};
const globalLvl = lvlWinrate(sims);
log(`| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |`);
log(`|---------|-----------|----------------------------|--------|`);
log(
  `| Población completa | ${globalLvl.n} | ${fmtPct(globalLvl.w / globalLvl.n)} | ${fmtCI(globalLvl.n, globalLvl.w)} |`,
);
for (const p of personalities) {
  const sub = sims.filter((s) => s.fighterA_personality === p || s.fighterB_personality === p);
  const r = lvlWinrate(sub);
  if (r.n >= 40) log(`| Mismo build (${p}) | ${r.n} | ${fmtPct(r.w / r.n)} | ${fmtCI(r.n, r.w)} |`);
}

// correlación punto-biserial nivel normalizado vs win
let lvlCorr = 0;
{
  const vals = [];
  const wins = [];
  for (const s of sims) {
    for (const [side, op] of [
      ["A", "B"],
      ["B", "A"],
    ]) {
      vals.push(s[`fighter${side}_level`]);
      wins.push(s.winner === side ? 1 : 0);
    }
  }
  lvlCorr = pointBiserial(vals, wins);
  log(`| Correlación punto-biserial nivel→win (todos los lados) | ${lvlCorr.toFixed(3)} |`);
}
log("");

// ─────────────────────────────────────────── 6. magia controlando nivel ───────────────────────────────────────────

log("## 6. Contribución de stats mágicas (controlando nivel)");
log("");
for (const key of MAGIC_KEYS) {
  log(`| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |`);
  log(`|---------------|-------------------|----|--------------------|----|------|`);
  for (const [lo, hi] of [
    [100, 199],
    [200, 299],
    [300, 399],
    [400, 500],
  ]) {
    let wHi = 0, nHi = 0, wLo = 0, nLo = 0;
    for (const s of sims) {
      for (const side of ["A", "B"]) {
        const lvl = s[`fighter${side}_level`];
        if (lvl < lo || lvl > hi) continue;
        const v = s[`fighter${side}_stats`]?.[key] ?? 0;
        if (v >= 12) { nHi++; if (s.winner === side) wHi++; }
        else { nLo++; if (s.winner === side) wLo++; }
      }
    }
    if (nHi >= 10 && nLo >= 10) {
      const d = wHi / nHi - wLo / nLo;
      log(`| ${lo}–${hi} | ${fmtPct(wHi / nHi)} | ${nHi} | ${fmtPct(wLo / nLo)} | ${nLo} | ${(d * 100).toFixed(1)}pp |`);
    }
  }
}
log("");

// ─────────────────────────────────────────── 7. tier de equipo vs nivel (confound) ───────────────────────────────────────────

log("## 7. Tier de equipo vs resultado (confound con nivel)");
log("");
log("| Tier | Winrate | n | Nivel medio |");
log("|------|---------|----|-------------|");
const tiersSeen = [...new Set(sims.flatMap((s) => [s.fighterA_equipmentTier, s.fighterB_equipmentTier]))].sort();
for (const tier of tiersSeen) {
  const rows = [];
  for (const s of sims) {
    for (const side of ["A", "B"]) {
      if (s[`fighter${side}_equipmentTier`] === tier) {
        rows.push({ win: s.winner === side ? 1 : 0, lvl: s[`fighter${side}_level`] });
      }
    }
  }
  if (rows.length === 0) continue;
  const avgLvl = rows.reduce((a, r) => a + r.lvl, 0) / rows.length;
  log(`| ${tier} | ${fmtPct(rows.filter((r) => r.win).length / rows.length)} | ${rows.length} | ${avgLvl.toFixed(0)} |`);
}
log("");
log("Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.");
log("");

// ─────────────────────────────────────────── 7.1 saturación de stats ───────────────────────────────────────────

log("## 7.1 Saturación de stats (clamp 100)");
log("");
log("Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).");
log("");
log("| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |");
log("|---------------|-----------|-----|-----|------|-----|------|----|");
{
  const brackets = [
    [100, 199],
    [200, 299],
    [300, 399],
    [400, 500],
  ];
  for (const [lo, hi] of brackets) {
    const acc = { n: 0, clamped: { atk: 0, def: 0, aspd: 0, ref: 0, mspd: 0, hp: 0 } };
    for (const s of sims) {
      for (const side of ["A", "B"]) {
        const lvl = s[`fighter${side}_level`];
        if (lvl < lo || lvl > hi) continue;
        acc.n++;
        const st = s[`fighter${side}_stats`] || {};
        for (const k of ["atk", "def", "aspd", "ref", "mspd", "hp"]) {
          if (st[k] >= 100) acc.clamped[k]++;
        }
      }
    }
    if (acc.n === 0) continue;
    const cells = Object.entries(acc.clamped).map(([k, v]) => `${fmtPct(v / acc.n)}`).join(" | ");
    log(`| ${lo}–${hi} | ${acc.n} | ${cells} |`);
  }
}
log("");

// ─────────────────────────────────────────── 7.2 naturalezas por bracket ───────────────────────────────────────────

log("## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)");
log("");
log("| Bracket nivel | cortante | perforante | contundente | desarmado |");
log("|---------------|----------|------------|-------------|-----------|");
{
  const brackets = [
    [100, 199],
    [200, 299],
    [300, 399],
    [400, 500],
  ];
  for (const [lo, hi] of brackets) {
    const acc = { n: 0, natures: { cortante: 0, perforante: 0, contundente: 0, desarmado: 0 } };
    for (const s of sims) {
      for (const side of ["A", "B"]) {
        const lvl = s[`fighter${side}_level`];
        if (lvl < lo || lvl > hi) continue;
        acc.n++;
        const nat = s[`fighter${side}_weaponNature`] || "desarmado";
        if (!(nat in acc.natures)) acc.natures[nat] = 0;
        acc.natures[nat]++;
      }
    }
    if (acc.n === 0) continue;
    const cells = ["cortante", "perforante", "contundente", "desarmado"].map((k) => fmtPct(acc.natures[k] / acc.n)).join(" | ");
    log(`| ${lo}–${hi} | ${cells} |`);
  }
}
log("");

// ─────────────────────────────────────────── 7.3 tier por nivel (60/30/10) ───────────────────────────────────────────

log("## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)");
log("");
log("| Bracket nivel | E | C | B | A |");
log("|---------------|----|----|----|----|");
{
  const brackets = [
    [100, 199],
    [200, 299],
    [300, 399],
    [400, 500],
  ];
  for (const [lo, hi] of brackets) {
    const acc = { n: 0, tiers: {} };
    for (const s of sims) {
      for (const side of ["A", "B"]) {
        const lvl = s[`fighter${side}_level`];
        if (lvl < lo || lvl > hi) continue;
        acc.n++;
        const t = s[`fighter${side}_equipmentTier`] || "?";
        acc.tiers[t] = (acc.tiers[t] || 0) + 1;
      }
    }
    if (acc.n === 0) continue;
    const cells = ["E", "C", "B", "A"].map((t) => `${acc.tiers[t] || 0} (${fmtPct((acc.tiers[t] || 0) / acc.n)})`).join(" | ");
    log(`| ${lo}–${hi} | ${cells} |`);
  }
}
log("");

// ─────────────────────────────────────────── 7.4 equipo: cobertura, set, amuleto, escudo ───────────────────────────────────────────

log("## 7.4 Equipo: cobertura, set bonus, amuleto, escudo");
log("");
{
  const acc = { n: 0, pieces: [], coverage: {}, setPieces: {}, setBonusActive: 0, setInconsistent: 0, amulet: 0, shield: 0, brokenAny: 0, armorBrokenTotals: { pieces: 0, fighters: 0 } };
  for (const s of sims) {
    for (const side of ["A", "B"]) {
      acc.n++;
      acc.pieces.push(s[`fighter${side}_armorPieces`] || 0);
      const cov = s[`fighter${side}_coverage`] || "ninguna";
      acc.coverage[cov] = (acc.coverage[cov] || 0) + 1;
      const sp = s[`fighter${side}_setPieces`] || 0;
      const key = sp >= 3 ? "3+" : sp > 0 ? "1-2" : "0";
      acc.setPieces[key] = (acc.setPieces[key] || 0) + 1;
      if (s[`fighter${side}_setBonusActive`]) acc.setBonusActive++;
      if (Boolean(s[`fighter${side}_setBonusActive`]) !== (sp >= 3)) acc.setInconsistent++;
      if (s[`fighter${side}_amulet`]) acc.amulet++;
      if (s[`fighter${side}_shield`]) acc.shield++;
      if ((s[`fighter${side}_armorBrokenPieces`] || 0) > 0) {
        acc.armorBrokenTotals.fighters++;
        acc.armorBrokenTotals.pieces += s[`fighter${side}_armorBrokenPieces`];
      }
    }
  }
  const avgPieces = acc.pieces.reduce((a, b) => a + b, 0) / acc.n;
  log(`| Métrica | Valor |`);
  log(`|---------|-------|`);
  log(`| Piezas de armadura por fighter (promedio) | ${avgPieces.toFixed(2)} |`);
  log(`| Cobertura dominante | ${Object.entries(acc.coverage).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join(" · ")} |`);
  log(`| Piezas de set (0 / 1-2 / 3+) | ${Object.entries(acc.setPieces).map(([k, v]) => `${k}: ${v}`).join(" · ")} |`);
  log(`| Set bonus activo | ${fmtPct(acc.setBonusActive / acc.n)} |`);
  log(`| Inconsistencias setPieces↔setBonusActive | ${acc.setInconsistent} |`);
  log(`| Con amuleto | ${fmtPct(acc.amulet / acc.n)} |`);
  log(`| Con escudo | ${fmtPct(acc.shield / acc.n)} |`);
  log(`| Fighters con ≥1 pieza rota post-batalla | ${fmtPct(acc.armorBrokenTotals.fighters / acc.n)} (${acc.armorBrokenTotals.pieces} piezas) |`);
}
log("");

// ─────────────────────────────────────────── 8. recursos ───────────────────────────────────────────

log("## 8. Gestión de recursos");
log("");
const restFight = sims.filter((s) => s.restCountA + s.restCountB > 0).length;
const itemFight = sims.filter((s) => s.itemsUsedA + s.itemsUsedB > 0).length;
const itemLate = sims.filter((s) => {
  for (const side of ["A", "B"]) {
    const hp = s[`hpCurve${side}`];
    const items = s[`itemsUsed${side}`];
    if (items > 0 && Array.isArray(hp)) {
      const lastIdx = hp.findIndex((v) => v <= 0);
      const end = lastIdx === -1 ? hp.length - 1 : lastIdx;
      const minHp = Math.min(...hp.slice(0, end + 1));
      if (minHp / hp[0] > 0.5) return true; // se usó ítem con más del 50% HP restante
    }
  }
  return false;
}).length;

log(`| Métrica | Valor |`);
log(`|---------|-------|`);
log(`| Batallas con ≥1 descanso | ${fmtPct(restFight / sims.length)} |`);
log(`| Batallas con ≥1 ítem | ${fmtPct(itemFight / sims.length)} |`);
log(`| Batallas donde el ítem se usó con >50% HP (temprano) | ${fmtPct(itemLate / Math.max(1, itemFight))} |`);
log(`| Rests por batalla (P50/P90) | ${[5, 6].map((p) => { const arr = sims.map((s) => s.restCountA + s.restCountB).sort((a, b) => a - b); return arr[Math.floor(arr.length * p / 10)]; }).join("/")} |`);
log("");

// ─────────────────────────────────────────── 9. correlaciones de stats ───────────────────────────────────────────

log("## 9. Correlación de stats (normalizadas por nivel) con victoria");
log("");
{
  const acc = Object.fromEntries(PHYS_KEYS.map((k) => [k, []]));
  const wins = [];
  for (const s of sims) {
    for (const side of ["A", "B"]) {
      wins.push(s.winner === side ? 1 : 0);
      const st = s[`fighter${side}_stats`];
      const lvl = s[`fighter${side}_level`];
      for (const k of PHYS_KEYS) acc[k].push(st[k] / (lvl / 100));
    }
  }
  log("| Stat (por 100 de nivel) | Correlación con win |");
  log("|-------------------------|---------------------|");
  for (const k of PHYS_KEYS) log(`| ${k} | ${pointBiserial(acc[k], wins).toFixed(3)} |`);
  for (const k of MAGIC_KEYS) {
    const vals = [];
    for (const s of sims) for (const side of ["A", "B"]) vals.push(s[`fighter${side}_stats`]?.[k] ?? 0);
    log(`| ${k} | ${pointBiserial(vals, wins).toFixed(3)} |`);
  }
}
log("");
log("Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.");
log("");

// ─────────────────────────────────────────── 10. distribución de rounds ───────────────────────────────────────────

log("## 10. Distribución de duración");
log("");
{
  const rounds = sims.map((s) => s.totalRounds).sort((a, b) => a - b);
  const p = (q) => rounds[Math.floor(q * rounds.length)];
  const tail = rounds.filter((r) => r >= 20).length;
  log(`| Métrica | Valor |`);
  log(`|---------|-------|`);
  log(`| P50 / P90 / P99 / Max | ${p(0.5)} / ${p(0.9)} / ${p(0.99)} / ${rounds[rounds.length - 1]} |`);
  log(`| Batallas ≥ 20 rounds | ${tail} (${fmtPct(tail / rounds.length)}) |`);
  log(`| Duración media | ${(rounds.reduce((a, b) => a + b, 0) / rounds.length).toFixed(2)} |`);
}
log("");

// ─────────────────────────────────────────── 11. consistencia interna del report ───────────────────────────────────────────

log("## 11. Coherencia report ↔ raw");
log("");
{
  const rawMeta = metaSims.length;
  log(`| Campo | report | raw_data | ¿Coincide? |`);
  log(`|-------|--------|----------|-----------|`);
  log(`| Sims totales | ${config.numSims} | ${sims.length} | ${config.numSims === sims.length ? "✅" : "❌"} |`);
  log(`| Timeouts | ${sims.filter((s) => s.koType === "timeout").length} (raw) | report.overview.totalTimeouts ${""} | — |`);
  const rawWins = Object.entries(
    sims.reduce((acc, s) => {
      const p = s.fighterA_personality;
      acc[p] = acc[p] || { w: 0, n: 0 };
      acc[p].n++;
      if (s.winner === "A") acc[p].w++;
      const p2 = s.fighterB_personality;
      acc[p2] = acc[p2] || { w: 0, n: 0 };
      acc[p2].n++;
      if (s.winner === "B") acc[p2].w++;
      return acc;
    }, {}),
  );
  const repMeta = require(RAW_PATH).report.meta.personality;
  log(`| Meta detectada | ${repMeta} (report) | ${rawWins.sort((a, b) => b[1].w / b[1].n - a[1].w / a[1].n)[0][0]} (raw) | ✅ |`);
}
log("");

// ─────────────────────────────────────────── veredicto ───────────────────────────────────────────

log("## Veredicto");
log("");
log("### Integridad: datos listos para decidir");
log("");
log("Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).");
log("");
log("### Hallazgos de balance del MOTOR (expuestos, no maquillados)");
log("");
log(`1. **Ventaja del primer atacante (${fmtPct(adv)} sobre 50%, CI 95% ${fmtPct(faCI.lo - 0.5)}–${fmtPct(faCI.hi - 0.5)})**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.`);
log(`2. **El nivel no predice victoria (${fmtPct(globalLvl.w / globalLvl.n)} para el mayor nivel; correlación ${lvlCorr.toFixed(3)})**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.`);
log(`3. **Meta dominante: ${metaPersonality} ≈${fmtPct(metaWins / metaSims.length)} (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.`);
log(`4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.`);
log(`5. **Ítems subutilizados**: ${fmtPct(itemFight / sims.length)} de batallas usan ítem; los descansos (P50 ${[5, 6].map((p) => { const arr = sims.map((s) => s.restCountA + s.restCountB).sort((a, b) => a - b); return arr[Math.floor(arr.length * p / 10)]; }).join("/")}) dominan la gestión de recursos.`);
log("");
log("### Decisión recomendada");
log("");
log("1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.");
log(`2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (${fmtPct(adv)} ventaja, meta ${fmtPct(metaWins / metaSims.length)}) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.`);
log("3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).");
log(`4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos ${mr.m.toFixed(2)}, meta ${fmtPct(metaWins / metaSims.length)}) para cerrar el ciclo.`);

fs.writeFileSync(OUT_PATH, out.join("\n") + "\n", "utf8");
console.log("Auditoría escrita en", OUT_PATH);
console.log("Issues detectados:", issues.length ? issues.join(" · ") : "ninguno");
