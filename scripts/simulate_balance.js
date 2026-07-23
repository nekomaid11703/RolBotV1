// ==========================================
// simulate_balance.js
// Simula combates necesarios para desbloquear
// todas las habilidades y slots.
// Enemigo: 15% mas fuerte que tu nivel actual
// Uso: node scripts/simulate_balance.js
// ==========================================

const LEVEL_START = 100;

const XP_PER_COMBAT_BASE = 50;
const XP_PER_COMBAT_MULTIPLIER = 2;
const ENEMY_LEVEL_RATIO = 1.15;

// Skills de clase
const SKILL_MILESTONES = [
  { level: 101, desc: "1era skill de clase" },
  { level: 125, desc: "2da skill de clase" },
];

// Slots: empiezas con 2, 3ro a nivel 130, luego cada 30 niveles
/**
 *
 */
function buildSlotMilestones() {
  const slots = [];
  for (let n = 130; n <= 340; n += 30) {
    const slotCount = Math.min(2 + Math.floor((n - 100) / 30), 10);
    slots.push({ level: n, desc: `${slotCount} slots` });
  }
  return slots;
}

const SLOT_MILESTONES = buildSlotMilestones();
const ALL_MILESTONES = [...SKILL_MILESTONES, ...SLOT_MILESTONES].sort((a, b) => a.level - b.level);

/**
 *
 * @param level
 * @param base
 * @param exp
 */
function xpForNextLevel(level, base, exp) {
  return Math.floor(base * Math.pow(level, exp));
}

/**
 *
 * @param currentLevel
 */
function xpPerCombat(currentLevel) {
  const enemyLevel = Math.floor(currentLevel * ENEMY_LEVEL_RATIO);
  return XP_PER_COMBAT_BASE + enemyLevel * XP_PER_COMBAT_MULTIPLIER;
}

/**
 *
 * @param base
 * @param exp
 */
function simulateCurve(base, exp) {
  let level = LEVEL_START;
  let cumulativeCombats = 0;
  let cumulativeXp = 0;
  const milestoneRows = [];

  while (level <= 370) {
    const xpReq = xpForNextLevel(level, base, exp);
    const xpBattle = xpPerCombat(level);
    const combats = Math.ceil(xpReq / xpBattle);
    cumulativeCombats += combats;
    cumulativeXp += xpReq;

    if (level + 1 <= 370) {
      const milestone = ALL_MILESTONES.find((m) => m.level === level + 1);
      if (milestone) {
        milestoneRows.push({
          level: level + 1,
          xpReq,
          enemyLevel: Math.floor(level * ENEMY_LEVEL_RATIO),
          xpBattle,
          combats,
          cumulativeCombats,
          cumulativeXp,
          desc: milestone.desc,
        });
      }
    }

    level++;
  }

  return { milestoneRows };
}

/**
 *
 * @param s
 * @param n
 */
function pad(s, n) {
  return String(s).padStart(n);
}

/**
 *
 * @param label
 * @param rows
 */
function printTable(label, rows) {
  const sep = "+-------+--------+----------+------------+-------------------------------+";
  console.log(`\n--- ${label} ---`);
  console.log(sep);
  console.log("| Nivel  | XP Req | Combates | Acumulados | Desbloqueo                    |");
  console.log(sep);

  for (const r of rows) {
    const lvl = pad(r.level, 5);
    const xp = pad(r.xpReq, 6);
    const cmb = pad(r.combats, 8);
    const acc = pad(r.cumulativeCombats, 10);
    const desc = r.desc.padEnd(29);
    console.log(`|   ${lvl} | ${xp} | ${cmb} | ${acc} | ${desc} |`);
  }

  console.log(sep);
  const last = rows[rows.length - 1];
  const firstBattle = rows[0];
  const lastBattle = rows[rows.length - 1];
  console.log(`  Total XP acumulada: ${last.cumulativeXp.toLocaleString()}`);
  console.log(`  Combates totales:   ${last.cumulativeCombats.toLocaleString()}`);
  console.log(`  XP por combate:     ${firstBattle.xpBattle} (nivel ${firstBattle.level - 1})`);
  console.log(`  XP por combate:     ${lastBattle.xpBattle} (nivel ${lastBattle.level - 1})`);
}

console.log("=".repeat(80));
console.log("  SIMULACION DE BALANCE DE LEVEL UP");
console.log("=".repeat(80));
console.log(`  Nivel inicial:  ${LEVEL_START}`);
console.log(`  Enemigo:        115% mas fuerte que tu nivel actual`);
console.log(`  XP por ataque:  ${XP_PER_COMBAT_BASE} + (enemigoLvl x ${XP_PER_COMBAT_MULTIPLIER})`);
console.log(`\n  HITOS DE DESBLOQUEO:`);
console.log(`  ${"-".repeat(50)}`);
for (const m of ALL_MILESTONES) {
  console.log(`    Nv. ${pad(m.level, 3)} -> ${m.desc}`);
}

// Probar diferentes curvas
const candidates = [
  { base: 8.4, exp: 1.0 },
  { base: 5.3, exp: 1.1 },
  { base: 3.34, exp: 1.2 },
  { base: 2.11, exp: 1.3 },
];

for (const c of candidates) {
  const xp100 = xpForNextLevel(100, c.base, c.exp);
  const combat100 = Math.ceil(xp100 / xpPerCombat(100));
  const { milestoneRows } = simulateCurve(c.base, c.exp);
  printTable(`base=${c.base}, exp=${c.exp} (xp100=${xp100}, combats100=${combat100})`, milestoneRows);
}

console.log("\n" + "=".repeat(80));
console.log("  COMPARATIVO (primera fila = combates en nivel 101)");
console.log("=".repeat(80));
const header = `  ${"HITO".padEnd(25)} |`;
const cols = candidates.map((c) => pad(`b=${c.base}, e=${c.exp}`, 14)).join(" | ");
console.log(`  ${header} ${cols}`);
console.log(`  ${"-".repeat(25)}-+-${candidates.map(() => "-".repeat(16)).join("-+-")}`);

for (const milestone of ALL_MILESTONES) {
  const parts = [`  ${milestone.desc.padEnd(25)} |`];
  for (const c of candidates) {
    const { milestoneRows } = simulateCurve(c.base, c.exp);
    const match = milestoneRows.find((r) => r.level === milestone.level);
    parts.push(pad(match ? match.cumulativeCombats : "?", 14));
  }
  console.log(parts.join(" | "));
}

console.log();
