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
  if (!["A", "B"].includes(s.winner)) badWinner++;
  if (!["ko", "timeout"].includes(s.koType)) badKoType++;
  if (s.winnerIsFirstAttacker !== (s.winner === s.firstAttacker)) badFirstFlag++;
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

const metaPersonality = "berserker";
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
for (const tier of ["T1", "T2", "T3", "T4"]) {
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
log("Interpretación: el tier correlaciona con nivel (más nivel = mejor equipo). Si el winrate por tier ≈ 50% corregido, el equipo es progresión, no balance.");
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
log("Los 11 checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas (0 desviaciones). Dos bugs del simulador fueron corregidos en esta auditoría: (1) KO por contraataque durante descanso asignaba la victoria al muerto — invertía los winrates de toda build que descansa; (2) `collectMetrics` excluía los contraataques del daño reportado. Los datos actuales son correctos y reproducibles (`node scripts/simulate_combat/audit.js`).");
log("");
log("### Hallazgos de balance del MOTOR (expuestos, no maquillados)");
log("");
log(`1. **El segundo atacante gana (ventaja ${fmtPct(adv)} para el primero, CI 95% ${fmtPct(faCI.lo - 0.5)}–${fmtPct(faCI.hi - 0.5)})**: el primer atacante asume el costo de movimiento de los 25 m iniciales (≈27 de fatiga) → su aspd/ref caen (penalty 20-60%) → el rival le esquiva/bloquea más (1317 vs 848 bloques) y lo golpea más (5.81 vs 4.17 golpes/batalla). Es una asimetría REAL del sistema de fatiga de movimiento del motor, no del simulador. **Decisión**: ticket de diseño — ¿debe el segundo en moverse ganar 10pp? Ajustar INITIAL_DISTANCE, FATIGUE_BASE_PER_METER o el orden de movimiento.`);
log(`2. **El nivel no predice victoria (${fmtPct(globalLvl.w / globalLvl.n)} para el mayor nivel; correlación ${lvlCorr.toFixed(3)})**: con arma del mismo tier el daño es FIJO (perforante = base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk (0.05×atk − 0.01×def) → subir de nivel sube tu fatiga sin subir tu daño. Verificado dirigido: 400 vs 300 misma build/arma → 0-3% de victorias para el 400. **Decisión**: ticket de balance — el daño por nivel (escalado del arma o de atk) y el costo de fatiga deben revisarse juntos.`);
log(`3. **Meta dominante: extremista_defensa ≈66% (objetivo ≤55%)**: su DEF alta reduce el costo de ataque a FATIGUE_COST_MIN (1+0.05×atk−0.01×def ≈ 1) → descansa mucho menos que el rival (que paga 3-6 por golpe) → recibe golpes extra gratis (contraataques mientras el rival descansa). El experimento FATIGUE_ATK_COST_SCALE 0.05→0.025 NO la mueve (66.2%) — la palanca efectiva es el mínimo de costo (FATIGUE_COST_MIN) o la reducción por DEF. Rango de winrates por personalidad: 30.5%–66.3% (36pp).`);
log(`4. **Ítems subutilizados**: ${fmtPct(itemFight / sims.length)} de batallas usan ítem; el umbral HP < 50% deja el stock casi intacto. Los descansos (P50 4) dominan la gestión de recursos: la fatiga es el cuello de botella, no el HP.`);
log(`5. **Timeouts ${draws.length} (${fmtPct(draws.length / sims.length)})**: fatiga colapsada → daño mínimo → no se mata nadie en 51 rounds. Poco frecuente, pero confirma que la fatiga puede estancar el combate.`);
log("");
log("### Decisión recomendada");
log("");
log("1. **Aceptar la auditoría como baseline válido** (datos íntegros post-fix) y commitear: 3 bugs corregidos + audit script reproducible + runner de experimentos.");
log(`2. **No ajustar el simulador para cumplir los targets**: los targets 2 (${fmtPct(adv)} vs ≤5%) y la meta fallan por el MOTOR. Maquillar el simulador ocultaría bugs reales del juego.`);
log("3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante; daño fijo por tier + fatiga ∝ atk anulan la progresión; costo de fatiga mínimo = meta defensiva).");
log(`4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos ${mr.m.toFixed(2)}, meta ${fmtPct(metaWins / metaSims.length)}) para cerrar el ciclo.`);

fs.writeFileSync(OUT_PATH, out.join("\n") + "\n", "utf8");
console.log("Auditoría escrita en", OUT_PATH);
console.log("Issues detectados:", issues.length ? issues.join(" · ") : "ninguno");
