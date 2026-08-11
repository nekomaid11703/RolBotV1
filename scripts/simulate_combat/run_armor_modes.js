#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * Harness hermano de Fase C — MODO de armadura × NIVEL con material NATURAL.
 *
 * Mide, para cada nivel objetivo (100/300/500) y cada modo de armadura
 * experimental (actual/def/soak/overflow/full), si la armadura protege el HP
 * real (R3) y si el espejo se mantiene ~50% (R2), usando el material que el
 * generador de familias sortea NATURALMENTE a ese nivel (no hierro forzado).
 *
 * Métricas clave por par de cobertura:
 *   - winrateA   (diagonal espejo debe quedar ~50%)
 *   - avgDmgA    daño promedio al HP por golpe
 *   - avgHpLoss  pérdida de HP promedio por combate (R3: la armadura reduce HP)
 *   - avgOverflow  overflow de material NO absorbido (spec §3: debe ir a HP)
 *   - avgAbsorb   daño material absorbido por la armadura
 *   - avgRounds / timeouts
 *
 * Uso:
 *   node scripts/simulate_combat/run_armor_modes.js -n 1000 --levels 100,300,500 --modes actual,full
 *   node scripts/simulate_combat/run_armor_modes.js -n 1000 --coverage none,total --weapon cortante
 *
 * Opciones:
 *  -n, --num-sims <n>   Simulaciones por par (default: 1000)
 *   --levels <lista>     Niveles a barrer (default: 100,300,500)
 *   --modes <lista>      Modos de armadura (default: actual,def,soak,overflow,full)
 *   --weapon <lista>     Naturalezas (default: todas)
 *   --coverage <lista>   Coberturas (default: none,ligera,media,alta,total)
 *   --mirror-only        Solo diagonal espejo (R2)
 *   --nominal <n>        NominalDamage del arma (default: 20)
 *   --material <id|mapa>  Forzar material en todos los niveles (default: natural)
 *   --mat-a <id>          Material fijo del lado A (cruce A vs B; id único o mapa "nivel:mat")
 *   --mat-b <id>          Material fijo del lado B (cruce A vs B; id único o mapa "nivel:mat")
 *   --tier <t>            Forzar mismo tier a ambos lados (E|D|C|B|A|S) para aislar material
 *   --max-rounds <n>      Techo de rounds (default: 30)
 *   --tag <nombre>        Tag de salida (default: armor_modes)
 *   -v, --verbose         Progreso
 *   -h, --help            Ayuda
 */

const path = require("path");
const fs = require("fs");
const { ARMOR_MODES } = require("./experimentalArmor");
const { buildStressFighter } = require("./stress_personalities");
const { deriveArmorPiece } = require("./fighterGenerator");
const { rollMaterial, getFamily } = require("./familyGenerator");
const { MATERIALS } = require("../../src/data/materialData");
const { getWeaponStats, getProjectileStats } = require("../../src/services/rpg/itemStatService");

const OUT_DIR = path.join(__dirname, "..", "simulation_output");
const EXPERIMENTS_DIR = path.join(OUT_DIR, "experiments");

const ARMOR_SLOTS = ["cabeza", "pecho", "pantalones", "botas"];

const NATURES = {
  cortante: { name: "Cortante", melee: true },
  contundente: { name: "Contundente", melee: true },
  perforante: { name: "Perforante", melee: true },
  proyectil: { name: "Proyectil", melee: false },
};

const COVERAGES = {
  none: { label: "None" },
  ligera: { label: "Ligera" },
  media: { label: "Media" },
  alta: { label: "Alta" },
  total: { label: "Total" },
};

const ARCHETYPES = {
  nivelado: { label: "Nivelado", weights: { atk: 20, def: 20, aspd: 20, ref: 20, mspd: 20, hp: 20 } },
};

function allocateStats(weights, nivel) {
  const clampMax = 100;
  const PHYSICAL = ["atk", "def", "aspd", "ref", "mspd"];
  const stats = { atk: 1, def: 1, aspd: 1, ref: 1, mspd: 1, hp: 1 };
  let budget = Math.max(nivel - (PHYSICAL.length + 1), 0);
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0);
  const order = [...Object.keys(weights)].sort((a, b) => weights[b] - weights[a] || a.localeCompare(b));
  for (const k of order) {
    const share = Math.floor((weights[k] / totalW) * budget);
    stats[k] = Math.min(clampMax, stats[k] + share);
  }
  let remaining = budget;
  for (const k of [...PHYSICAL, "hp"]) remaining -= stats[k] - 1;
  let guard = 0;
  while (remaining > 0 && guard++ < 1_000_000) {
    const open = order.filter((k) => stats[k] < clampMax);
    if (!open.length) break;
    const pick = open[open.length - 1];
    stats[pick] += 1;
    remaining--;
  }
  return stats;
}

function buildLabWeapon(nature, nominal, tier, material) {
  if (nature === "desarmado") return null;
  const ranged = nature === "proyectil";
  const weaponStats = getWeaponStats({
    tier,
    material,
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
      material,
      modules: { weapon: { damageNature: "proyectil", baseDamage: nominal, hands: 1, weaponRange: 0 } },
    });
    arrow = { id: "flecha_lab", name: "Flecha Lab", tier, baseDamage: arrowStats.baseDamage, damageNature: "proyectil", material };
  }
  return { id: `lab_${nature}`, name: `Lab ${nature}`, ...weaponStats, arrow, ammoCount: arrow ? 30 : 0 };
}

function buildArmorSet(coverage, tier, material) {
  if (coverage === "none") return { armorList: [], armor: null };
  const armorList = ARMOR_SLOTS.map((slot) => deriveArmorPiece(slot, coverage, tier, material));
  const maxResist = armorList.reduce((acc, p) => acc + p.maxResist, 0);
  const bonusDef = armorList.reduce((acc, p) => acc + p.bonusDef, 0);
  return { armorList, armor: { bonusDef, maxResist, pieces: armorList.length } };
}

function buildFighter(nature, nivel, opts, side = "A") {
  const stats = allocateStats(ARCHETYPES.nivelado.weights, nivel);
  const hpMult = 3;
  const material = side === "B" ? opts.matB || opts.material : opts.matA || opts.material;
  const armor = buildArmorSet(opts.coverage, opts.tier, material);
  return {
    name: NATURES[nature].name,
    stats: { ...stats, fulgor: 1, d_fulgor: 1, r_fulgor: 1 },
    nivel: Math.max(nivel, Object.values(stats).reduce((a, b) => a + b, 0)),
    race: "lab",
    personality: nature,
    hp: stats.hp * hpMult,
    equipment: {
      tierKey: opts.tier,
      weapon: buildLabWeapon(nature, opts.nominal, opts.tier, material),
      armorList: armor.armorList,
      armor: armor.armor,
      shield: null,
      amulet: null,
      ammo: null,
    },
    loadout: [],
  };
}

function attachAmmo(fighter) {
  const w = fighter.equipment?.weapon;
  if (w?.arrow) {
    fighter.equipment.ammo = { id: w.arrow.id, name: w.arrow.name, count: w.ammoCount, baseDamage: w.arrow.baseDamage, tier: w.arrow.tier, material: w.arrow.material };
  } else {
    fighter.equipment.ammo = null;
  }
  return fighter;
}

function armorConsumption(fighter) {
  const pieces = fighter.equipment.armorList || [];
  let maxResist = 0;
  let absorbed = 0;
  let broken = 0;
  for (const p of pieces) {
    maxResist += p.maxResist || 0;
    absorbed += (p.maxResist || 0) - (p.currentResist ?? p.maxResist);
    if ((p.currentResist ?? p.maxResist) <= 0) broken++;
  }
  return { maxResist, absorbed, broken };
}

/**
 * Tier natural por nivel + rareza del material sorteado (generación real).
 */
function naturalTier(nivel, materialId) {
  const rarity = MATERIALS[materialId]?.rarity || "comun";
  return rollTierForLevel(nivel, rarity);
}

function rollTierForLevel(nivel, rarity) {
  // Misma lógica de brackets que el generador (100-199 E, 200-299 C, 300-399 B, 400-500 A),
  // clampado al piso/techo por rareza (TIER_CAPS de families.config.js).
  const { TIER_ORDER, TIER_CAPS } = require("./families.config");
  const RARITY_MIN_TIER = { comun: "E", poco_comun: "D", raro: "C", epico: "B", legendario: "A", mitico: "S" };
  const minIdx = TIER_ORDER.indexOf(RARITY_MIN_TIER[rarity] || "E");
  const maxIdx = TIER_ORDER.indexOf(TIER_CAPS[rarity] || "B");
  const bracket = [
    { minLevel: 100, maxLevel: 199, idx: TIER_ORDER.indexOf("E") },
    { minLevel: 200, maxLevel: 299, idx: TIER_ORDER.indexOf("C") },
    { minLevel: 300, maxLevel: 399, idx: TIER_ORDER.indexOf("B") },
    { minLevel: 400, maxLevel: 500, idx: TIER_ORDER.indexOf("A") },
  ];
  const base = bracket.find((b) => nivel >= b.minLevel && nivel <= b.maxLevel) || bracket[bracket.length - 1];
  const idx = Math.max(minIdx, Math.min(maxIdx, base.idx));
  return TIER_ORDER[idx];
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { numSims: 1000, levels: [100, 300, 500], modes: Object.keys(ARMOR_MODES), weapon: null, coverage: null, mirrorOnly: false, nominal: 20, material: null, maxRounds: 30, tag: null, verbose: false, help: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-n":
      case "--num-sims":
        opts.numSims = parseInt(args[++i], 10);
        break;
      case "--levels":
        opts.levels = String(args[++i] || "").split(",").map(Number).filter((n) => n > 0);
        break;
      case "--modes":
        opts.modes = String(args[++i] || "").split(",").filter((m) => ARMOR_MODES[m]);
        break;
      case "--weapon":
        opts.weapon = String(args[++i] || "").split(",").filter(Boolean);
        break;
      case "--coverage":
        opts.coverage = String(args[++i] || "").split(",").filter(Boolean);
        break;
      case "--mirror-only":
        opts.mirrorOnly = true;
        break;
      case "--nominal":
        opts.nominal = parseInt(args[++i], 10);
        break;
      case "--material":
        opts.material = String(args[++i] || "");
        break;
      case "--mat-a":
        opts.matA = String(args[++i] || "");
        break;
      case "--mat-b":
        opts.matB = String(args[++i] || "");
        break;
      case "--tier":
        opts.tierForced = String(args[++i] || "").toUpperCase();
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
  node scripts/simulate_combat/run_armor_modes.js -n <sims> [--levels a,b,c] [--modes a,b,c] [--weapon a,b,c] [--coverage a,b,c] [--mirror-only] [--tag t] [-v]

Opciones:
  -n, --num-sims <n>     Simulaciones por par (default: 1000)
  --levels <lista>       Niveles a barrer (default: 100,300,500)
  --modes <lista>        Modos de armadura (default: actual,def,soak,overflow,full)
  --weapon <lista>       Naturalezas (default: todas)
  --coverage <lista>     Coberturas (default: none,ligera,media,alta,total)
  --mirror-only          Solo diagonal espejo (R2)
  --nominal <n>          NominalDamage del arma (default: 20)
  --material <id|mapa>   Forzar material en todos los niveles (default: natural)
  --mat-a <id>           Material fijo del lado A (cruce A vs B; id único o mapa "nivel:mat")
  --mat-b <id>           Material fijo del lado B (cruce A vs B; id único o mapa "nivel:mat")
  --tier <t>             Forzar mismo tier a ambos lados (E|D|C|B|A|S) para aislar material
  --max-rounds <n>       Techo de rounds (default: 30)
  --tag <nombre>         Tag de salida (default: armor_modes)
  -v, --verbose          Salida progreso
  -h, --help             Esta ayuda`);
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    printUsage();
    process.exit(0);
  }
  if (!opts.levels.length) opts.levels = [100, 300, 500];
  if (!opts.modes.length) opts.modes = Object.keys(ARMOR_MODES);

  const weaponKeys = opts.weapon && opts.weapon.length ? opts.weapon : Object.keys(NATURES);
  const coverageKeys = opts.coverage && opts.coverage.length ? opts.coverage : Object.keys(COVERAGES);

  const config = require("./config");
  config.MAX_ROUNDS = opts.maxRounds;
  const { simulateCombat } = require("./combatLoop");

  fs.mkdirSync(EXPERIMENTS_DIR, { recursive: true });

  const tag = opts.tag || `armor_modes_${opts.levels.join("_")}_${opts.modes.join("_")}`;
  const rows = [];

  console.log(`Laboratorio Modos de Armadura × Nivel | sims/par=${opts.numSims} | nominal=${opts.nominal} | maxRounds=${opts.maxRounds}`);
  console.log(`Niveles: ${opts.levels.join(", ")} | Modos: ${opts.modes.join(", ")} | Armas: ${weaponKeys.join(", ")} | Coberturas: ${coverageKeys.join(", ")}${opts.mirrorOnly ? " (solo espejo)" : ""}`);
  console.log(
    "Material por nivel: " +
      (opts.matA || opts.matB
        ? `CRUCE (A=${opts.matA || opts.material}, B=${opts.matB || opts.material}).`
        : opts.material
          ? `FORZADO (${opts.material}).`
          : "NATURAL (sorteado con el generador de familias)."),
  );
  console.log("");

  const pairs = [];
  for (const cA of coverageKeys) {
    for (const cB of coverageKeys) {
      if (opts.mirrorOnly && cA !== cB) continue;
      pairs.push([cA, cB]);
    }
  }

  for (const nivel of opts.levels) {
    const family = getFamily("hierro") || null;
    // --material acepta un id único (acc[0]) o un mapa por nivel (ej: "100:titanio,300:bronce")
    const materialOverride = opts.material
      ? opts.material.split(",").reduce((acc, pair) => {
          const idx = pair.indexOf(":");
          if (idx === -1) {
            acc[0] = pair;
          } else {
            const lv = pair.slice(0, idx);
            const mat = pair.slice(idx + 1);
            acc[lv === "" ? 0 : parseInt(lv, 10)] = mat;
          }
          return acc;
        }, {})
      : null;
    // --mat-a / --mat-b: cruce material vs material (id único o mapa por nivel).
    const parseSide = (raw) =>
      raw
        ? raw.split(",").reduce((acc, pair) => {
            const idx = pair.indexOf(":");
            if (idx === -1) {
              acc[0] = pair;
            } else {
              const lv = pair.slice(0, idx);
              const mat = pair.slice(idx + 1);
              acc[lv === "" ? 0 : parseInt(lv, 10)] = mat;
            }
            return acc;
          }, {})
        : null;
    const matAOverride = parseSide(opts.matA);
    const matBOverride = parseSide(opts.matB);

    const materialA =
      matAOverride?.[nivel] || matAOverride?.[0] || materialOverride?.[nivel] || materialOverride?.[0] || (family ? rollMaterial(nivel, family) : "hierro");
    const materialB =
      matBOverride?.[nivel] || matBOverride?.[0] || materialOverride?.[nivel] || materialOverride?.[0] || (family ? rollMaterial(nivel, family) : "hierro");
    const cross = opts.matA || opts.matB;
    const tier = opts.tierForced || naturalTier(nivel, materialA);
    const tierB = opts.tierForced || naturalTier(nivel, materialB);
    console.log(
      `── Nivel ${nivel} → material ${cross ? "cruce" : materialOverride ? "forzado" : "natural"}: A=${materialA} (${MATERIALS[materialA]?.rarity}) ${cross ? `| B=${materialB} (${MATERIALS[materialB]?.rarity})` : ""} | tier: ${tier}${tier !== tierB ? ` / B:${tierB}` : ""} ──`,
    );

    for (const modeId of opts.modes) {
      config.ARMOR_MODE = modeId;
      const mode = ARMOR_MODES[modeId];

      for (const nature of weaponKeys) {
        for (const [covA, covB] of pairs) {
          let winsA = 0, winsB = 0, timeouts = 0;
          let roundsTotal = 0, maxRoundsSeen = 0;
          let hitsA = 0, dmgSumA = 0;
          let absorbSumA = 0, maxResistSumA = 0, brokenSumA = 0;
          let overflowSum = 0, soakSum = 0, defReductionSum = 0;
          let hpLossA = 0;

          for (let i = 0; i < opts.numSims; i++) {
            const swap = i % 2 === 1;
            const fa = attachAmmo(buildFighter(nature, nivel, { ...opts, coverage: covA, material: materialA, tier, matA: materialA, matB: materialB }, "A"));
            const fb = attachAmmo(buildFighter(nature, nivel, { ...opts, coverage: covB, material: materialB, tier: tierB, matA: materialA, matB: materialB }, "B"));
            const r = simulateCombat(swap ? fb : fa, swap ? fa : fb);

            const prefixCovA = swap ? "B" : "A";
            const prefixCovB = swap ? "A" : "B";
            if (r.winner === prefixCovA) winsA++;
            else if (r.winner === prefixCovB) winsB++;
            else timeouts++;

            for (const entry of r.log) {
              if (!entry || entry.action !== "attack" || typeof entry.finalDamage !== "number") continue;
              const isCovA = String(entry.attacker).startsWith(prefixCovA);
              if (isCovA) {
                hitsA++;
                dmgSumA += entry.finalDamage;
                overflowSum += entry.overflow || 0;
                soakSum += entry.soakApplied || 0;
                defReductionSum += entry.defReduction || 0;
              }
            }

            roundsTotal += r.totalRounds || 0;
            if ((r.totalRounds || 0) > maxRoundsSeen) maxRoundsSeen = r.totalRounds;

            // Pérdida de HP real del portador de covA. El portador de covA es
            // SIEMPRE fa: sin swap va como primer argumento (stateA) y con swap
            // como segundo (stateB); stateA es siempre el primer argumento.
            const covAFinalHp = swap ? r.stateB.hp : r.stateA.hp;
            hpLossA += Math.max(0, fa.hp - covAFinalHp);

            const ca = armorConsumption(fa);
            absorbSumA += ca.absorbed;
            maxResistSumA += ca.maxResist;
            brokenSumA += ca.broken;
          }

          const row = {
            level: nivel,
            material: materialA,
            matB: materialB,
            rarity: MATERIALS[materialA]?.rarity,
            rarityB: MATERIALS[materialB]?.rarity,
            tier,
            tierB,
            mode: modeId,
            modeLabel: mode.label,
            weapon: nature,
            covA,
            covB,
            winsA,
            winsB,
            timeouts,
            winrateA: (winsA / opts.numSims) * 100,
            avgRounds: roundsTotal / opts.numSims,
            maxRounds: maxRoundsSeen,
            avgDmgA: hitsA ? Math.round((dmgSumA / hitsA) * 10) / 10 : null,
            avgHpLossA: Math.round((hpLossA / opts.numSims) * 10) / 10,
            avgOverflowPerHit: hitsA ? Math.round((overflowSum / hitsA) * 10) / 10 : null,
            avgSoakPerHit: hitsA ? Math.round((soakSum / hitsA) * 10) / 10 : null,
            avgDefReductionPerHit: hitsA ? Math.round((defReductionSum / hitsA) * 10) / 10 : null,
            avgAbsorbedPerFightA: Math.round((absorbSumA / opts.numSims) * 10) / 10,
            avgMaxResistA: Math.round((maxResistSumA / opts.numSims) * 10) / 10,
            avgBrokenPiecesA: Math.round((brokenSumA / opts.numSims) * 10) / 10,
          };
          rows.push(row);

          if (opts.verbose) {
            console.log(`  [${modeId.padEnd(8)}] lv${nivel} ${nature.padEnd(11)} ${covA.padEnd(6)} vs ${covB.padEnd(6)} mat ${materialA}${cross ? "vs" + materialB : ""} → winA=${row.winrateA.toFixed(1)}% dmg=${row.avgDmgA} hpLossA=${row.avgHpLossA} ovf=${row.avgOverflowPerHit} soak=${row.avgSoakPerHit} absorb=${row.avgAbsorbedPerFightA}`);
          }
        }
      }
    }
  }

  // ── Reporte ──
  const lines = [];
  lines.push(`# Laboratorio Modos de Armadura × Nivel (Fase C)`);
  lines.push("");
  lines.push(`Config: sims/par=${opts.numSims} | nominal=${opts.nominal} | maxRounds=${opts.maxRounds}`);
  lines.push(`Niveles: ${opts.levels.join(", ")} | Modos: ${opts.modes.join(", ")} | Armas: ${weaponKeys.join(", ")}`);
  lines.push(
    `Material por nivel: ${opts.matA || opts.matB ? `CRUCE (A=${opts.matA || "natural"}, B=${opts.matB || "natural"}).` : opts.material ? `FORZADO (${opts.material}).` : "NATURAL (generador de familias)."}`,
  );
  lines.push("");
  lines.push(`Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.`);
  lines.push(`Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.`);
  lines.push(`Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.`);
  lines.push("");

  for (const nivel of opts.levels) {
    lines.push(`## Nivel ${nivel} — winrate A% (diagonal espejo, fila A = columna B)`);
    lines.push(`| Modo | Arma | ${coverageKeys.map((c) => COVERAGES[c]?.label || c).join(" | ")} |`);
    lines.push(`| --- | --- | ${coverageKeys.map(() => "---").join(" | ")} |`);
    for (const modeId of opts.modes) {
      for (const w of weaponKeys) {
        const cells = coverageKeys.map((cB) => {
          const r = rows.find((x) => x.level === nivel && x.mode === modeId && x.weapon === w && x.covA === cB && x.covB === cB);
          return r ? `${r.winrateA.toFixed(1)}%` : "-";
        });
        lines.push(`| ${modeId} | ${w} | ${cells.join(" | ")} |`);
      }
    }
    lines.push("");
  }

  lines.push(`## Detalle por nivel/modo/arma (espejo + none-vs-total)`);
  lines.push(`| lv | modo | arma | matA vs matB | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |`);
  lines.push(`| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`);
  for (const r of rows) {
    lines.push(`| ${r.level} | ${r.mode} | ${r.weapon} | ${r.material}${r.matB && r.matB !== r.material ? " vs " + r.matB : ""} | ${r.covA} vs ${r.covB} | ${r.winrateA.toFixed(1)} | ${r.avgRounds.toFixed(1)} | ${r.avgDmgA ?? "-"} | ${r.avgHpLossA} | ${r.avgOverflowPerHit ?? "-"} | ${r.avgSoakPerHit ?? "-"} | ${r.avgDefReductionPerHit ?? "-"} | ${r.avgAbsorbedPerFightA} | ${r.avgMaxResistA} | ${r.avgBrokenPiecesA} |`);
  }

  lines.push("");
  lines.push(`## Invariantes (por nivel)`);
  const espejo = rows.filter((r) => r.covA === r.covB);
  for (const nivel of opts.levels) {
    const byMode = espejo.filter((r) => r.level === nivel);
    const outOfBand = byMode.filter((r) => Math.abs(r.winrateA - 50) > 5);
    lines.push(`- Nivel ${nivel}: espejo fuera de 50±5%: ${outOfBand.length ? outOfBand.map((r) => `${r.mode}/${r.weapon}/${r.covA}=${r.winrateA.toFixed(1)}%`).join(", ") : "ninguno ✅"}`);
  }

  const mdName = path.join("experiments", `${tag}_report.md`);
  fs.writeFileSync(path.join(OUT_DIR, mdName), lines.join("\n"));

  const raw = {
    config: { numSims: opts.numSims, levels: opts.levels, modes: opts.modes, weapon: weaponKeys, coverage: coverageKeys, mirrorOnly: opts.mirrorOnly, nominal: opts.nominal, maxRounds: opts.maxRounds },
    rows,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(OUT_DIR, path.join("experiments", `${tag}_raw.json`)), JSON.stringify(raw, null, 2));

  console.log("");
  console.log(`Report: ${path.join(OUT_DIR, mdName)}`);
  console.log(`Raw:    ${path.join(OUT_DIR, path.join("experiments", `${tag}_raw.json`))}`);
}

main();
