#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * Laboratorio de BALANCE ARMA-vs-ARMADURA (Fase C).
 *
 * Mide cómo cada naturaleza de arma se cruza contra SÍ MISMA bajo DISTINTOS
 * GRADOS DE COBERTURA de armadura. El diseño sigue la especificación:
 *   - Se selecciona un arma a balancear.
 *   - Se equipan dos dummys idénticos en stats, nivel e IA; la única variable
 *     es el GRADO DE COBERTURA de la armadura de cada lado.
 *   - Pelean entre sí; cada `--sims` combates (1000 por defecto) se rota UNA
 *     parte de la armadura (cambiando su cobertura: none/ligera/media/alta/
 *     total), hasta cubrir todas las armaduras.
 *   - Se recolecta: duración, daño promedio, winrate A/B, equipamiento usado
 *     y la matriz arma-vs-grados-de-armadura (cA × cB).
 *   - Se analiza para decidir si modificar el arma, la armadura o ambas.
 *
 * La matriz completa (cobertura de A × cobertura de B) es la señal real: la
 * diagonal (espejo) debe quedar ~50%, y las celdas off-diagonal muestran cuánto
 * "protege" cada grado de cobertura contra la misma arma, informando si el
 * problema está en el arma, en la armadura o en ambos.
 *
 * Uso:
 *   node scripts/simulate_combat/run_phase_c.js -n 1000 --level 300
 *   node scripts/simulate_combat/run_phase_c.js --weapon cortante,perforante -n 1000 --level 300
 *   node scripts/simulate_combat/run_phase_c.js --archetype minmax -n 1000 --level 300
 *   node scripts/simulate_combat/run_phase_c.js --coverage none,ligera,media,alta,total -n 1000 --level 100
 *   node scripts/simulate_combat/run_phase_c.js --mirror-only -n 1000 --level 300
 *
 * Opciones:
 *   -n, --num-sims <n>     Simulaciones por par de cobertura (default: 1000)
 *   --weapon <lista>       Naturalezas a balancear (default: todas)
 *   --archetype <key>      Reparto de stats del espejo: nivelado | minmax | mixto (default: nivelado)
 *   --coverage <lista>     Grados de cobertura a rotar (default: none,ligera,media,alta,total)
 *   --mirror-only          Solo la diagonal (espejo; winrate esperado ~50%)
 *   --level <n>            Nivel objetivo (default: 300)
 *   --nominal <n>          NominalDamage del arma (default: 20)
 *   --tier <T>             Tier del arma/flecha (default: B)
 *   --max-rounds <n>       Techo de rounds (default: 30)
 *   --tag <nombre>         Tag de salida (default: phase_c)
 *   -v, --verbose          Salida progreso
 *   -h, --help             Esta ayuda
 */

const path = require("path");
const fs = require("fs");
const { buildStressFighter } = require("./stress_personalities");
const { deriveArmorPiece } = require("./fighterGenerator");
const { rollMaterial, rollTier, getFamily } = require("./familyGenerator");
const { MATERIALS } = require("../../src/data/materialData");
const { getWeaponStats, getProjectileStats } = require("../../src/services/rpg/itemStatService");

const SIM_DIR = __dirname;
const OUT_DIR = path.join(SIM_DIR, "..", "simulation_output");
const EXPERIMENTS_DIR = path.join(OUT_DIR, "experiments");

const ARMOR_SLOTS = ["cabeza", "pecho", "pantalones", "botas"];

const NATURES = {
  cortante: { name: "Cortante", melee: true },
  contundente: { name: "Contundente", melee: true },
  perforante: { name: "Perforante", melee: true },
  proyectil: { name: "Proyectil", melee: false },
};

// Arquetipos de reparto de stats para el espejo (misma distribución en ambos).
// Las stats se derivan determinísticamente a un nivel fijo (sin jitter).
const ARCHETYPES = {
  nivelado: { label: "Nivelado", weights: { atk: 20, def: 20, aspd: 20, ref: 20, mspd: 20, hp: 20 } },
  minmax: { label: "Minmax ATK", weights: { atk: 55, aspd: 15, hp: 1, def: 1, ref: 1, mspd: 1 } },
  mixto: { label: "Mixto", weights: { atk: 30, aspd: 20, ref: 15, hp: 5, def: 1, mspd: 1 } },
};

const COVERAGES = {
  none: { label: "None" },
  ligera: { label: "Ligera" },
  media: { label: "Media" },
  alta: { label: "Alta" },
  total: { label: "Total" },
};

/**
 * Asigna el presupuesto (nivel) entre stats según pesos de forma determinista
 * (sin Math.random): reparto proporcional con piso 1 y redistribución del resto.
 * @param {Record<string, number>} weights
 * @param {number} nivel - Presupuesto total
 * @param {object} [opts] - { clampMax }
 * @returns {object} stats { atk, def, aspd, ref, mspd, hp }
 */
function allocateStats(weights, nivel, opts = {}) {
  const clampMax = opts.clampMax ?? 100;
  const PHYSICAL = ["atk", "def", "aspd", "ref", "mspd"];
  const stats = { atk: 1, def: 1, aspd: 1, ref: 1, mspd: 1, hp: 1 };
  let budget = Math.max(nivel - (PHYSICAL.length + 1), 0);
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0);

  // Reparto proporcional determinista: asigna en orden de peso mayor primero
  // el piso proporcional (floor), luego reparte el residuo por entero.
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

/**
 * Construye un arma con la fórmula REAL del motor para una naturaleza.
 * @param {string} nature - damageNature
 * @param {number} nominal - nominalDamage del arma (igual para todas)
 * @param {string} tier - tier del arma/flecha
 * @param {string} [material] - Material del arma/flecha (default: hierro)
 * @returns {object|null} weaponInfo con stats derivadas
 */
function buildLabWeapon(nature, nominal, tier, material = "hierro") {
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

  return {
    id: `lab_${nature}`,
    name: `Lab ${nature}`,
    ...weaponStats,
    arrow,
    ammoCount: arrow ? 30 : 0,
  };
}

/**
 * Construye el set de armadura completo (4 piezas) a un grado de cobertura.
 * @param {string} coverage - none | ligera | media | alta | total
 * @param {string} tier
 * @param {string} [material] - Material de las piezas (default: hierro)
 * @returns {{ armorList: Array<object>, armor: object|null }}
 */
function buildArmorSet(coverage, tier, material = "hierro") {
  if (coverage === "none") return { armorList: [], armor: null };
  const armorList = ARMOR_SLOTS.map((slot) => deriveArmorPiece(slot, coverage, tier, material));
  const maxResist = armorList.reduce((acc, p) => acc + p.maxResist, 0);
  const bonusDef = armorList.reduce((acc, p) => acc + p.bonusDef, 0);
  return { armorList, armor: { bonusDef, maxResist, pieces: armorList.length } };
}

/**
 * Resuelve el material del laboratorio: forzado (`--material <id>`) o NATURAL
 * (`--material natural`): sortea el material con el generador de familias según
 * el nivel (peso por rareza desplazado por nivel), igual que el juego real.
 * @param {number} nivel
 * @param {string} materialOpt - "natural" | id de material
 * @returns {{ material: string, natural: boolean }}
 */
function resolveMaterial(nivel, materialOpt) {
  if (materialOpt && materialOpt !== "natural") {
    if (!MATERIALS[materialOpt]) {
      console.error(`Material desconocido: ${materialOpt} (ids: ${Object.keys(MATERIALS).join(", ")})`);
      process.exit(1);
    }
    return { material: materialOpt, natural: false };
  }
  const family = getFamily("hierro") || null;
  return { material: family ? rollMaterial(nivel, family) : "hierro", natural: true };
}

/**
 * Construye un fighter de laboratorio Fase C: espejo idéntico (stats del
 * arquetipo + arma de la naturaleza + armadura del grado de cobertura).
 * @param {string} nature - damageNature
 * @param {number} nivel - nivel objetivo
 * @param {object} opts - { nominal, tier, coverage, archetype, maxRounds, material }
 * @returns {object} Fighter listo para simulateCombat
 */
function buildPhaseCFighter(nature, nivel, opts) {
  const archetype = ARCHETYPES[opts.archetype] || ARCHETYPES.nivelado;
  const stats = allocateStats(archetype.weights, nivel, {});
  const hpMult = 3;
  const material = opts.material || "hierro";
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

/**
 * Mide cuánta resistencia material absorbió la armadura de un fighter tras
 * el combate (maxResist inicial − currentResist final). Se leen los campos
 * que la simulación muta in-place en las piezas de armorList.
 * @param {object} fighter
 * @returns {{ maxResist: number, absorbed: number, broken: number }}
 */
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

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { numSims: 1000, weapon: null, archetype: "nivelado", coverage: null, mirrorOnly: false, level: 300, nominal: 20, tier: "B", material: "natural", maxRounds: 30, tag: null, verbose: false, help: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-n":
      case "--num-sims":
        opts.numSims = parseInt(args[++i], 10);
        break;
      case "--weapon":
        opts.weapon = String(args[++i] || "")
          .split(",")
          .filter(Boolean);
        break;
      case "--archetype":
        opts.archetype = String(args[++i] || "nivelado");
        break;
      case "--coverage":
        opts.coverage = String(args[++i] || "")
          .split(",")
          .filter(Boolean);
        break;
      case "--mirror-only":
        opts.mirrorOnly = true;
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
      case "--material":
        opts.material = String(args[++i] || "natural");
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
  node scripts/simulate_combat/run_phase_c.js -n <sims> [--weapon a,b,c] [--archetype <key>] [--coverage a,b,c] [--level <n>] [--nominal <n>] [--tier <T>] [--material <id|natural>] [--tag <t>] [-v]

Opciones:
  -n, --num-sims <n>     Simulaciones por bloque de cobertura (default: 1000)
  --weapon <lista>       Naturalezas a balancear (default: todas)
  --archetype <key>      Reparto de stats: nivelado | minmax | mixto (default: nivelado)
  --coverage <lista>     Grados de cobertura a rotar (default: none,ligera,media,alta,total)
  --mirror-only          Solo la diagonal (espejo; winrate esperado ~50%)
  --level <n>            Nivel objetivo (default: 300)
  --nominal <n>          NominalDamage del arma (default: 20)
  --tier <T>             Tier del arma/armadura (default: B)
  --material <id|natural> Material del arma/armadura: id del catálogo o "natural"
                         (default: natural — sortea por nivel con el generador de familias)
  --max-rounds <n>       Techo de rounds (default: 30)
  --tag <nombre>         Tag de salida (default: phase_c)
  -v, --verbose          Salida progreso
  -h, --help             Esta ayuda`);
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    printUsage();
    process.exit(0);
  }

  if (!ARCHETYPES[opts.archetype]) {
    console.error(`Arquetipo desconocido: ${opts.archetype} (${Object.keys(ARCHETYPES).join(" | ")})`);
    process.exit(1);
  }

  const weaponKeys = opts.weapon && opts.weapon.length ? opts.weapon : Object.keys(NATURES);
  const coverageKeys = opts.coverage && opts.coverage.length ? opts.coverage : Object.keys(COVERAGES);

  // Setea el techo de rounds del simulador ANTES de requerir combatLoop.
  const config = require("./config");
  config.MAX_ROUNDS = opts.maxRounds;
  const { simulateCombat } = require("./combatLoop");

  const { material, natural } = resolveMaterial(opts.level, opts.material);
  const materialLabel = natural ? `${material} (natural)` : material;

  fs.mkdirSync(EXPERIMENTS_DIR, { recursive: true });

  const tag = opts.tag || `phase_c_lv${opts.level}_${opts.archetype}_${opts.tier}_${material}`;
  const allRows = [];

  // Pares de cobertura: matriz completa (A×B) o solo diagonal (espejo).
  const pairs = [];
  for (const cA of coverageKeys) {
    for (const cB of coverageKeys) {
      if (opts.mirrorOnly && cA !== cB) continue;
      pairs.push([cA, cB]);
    }
  }

  console.log(`Laboratorio Fase C: arma-vs-cobertura | nivel=${opts.level} | nominal=${opts.nominal} | tier=${opts.tier} | material=${materialLabel} | maxRounds=${opts.maxRounds}`);
  console.log(`Dummys idénticos (misma stats/nivel/IA); variable = cobertura de armadura | arquetipo=${opts.archetype} (${ARCHETYPES[opts.archetype].label}) | sims/par=${opts.numSims}`);
  console.log(`Armas: ${weaponKeys.join(", ")}`);
  console.log(`Coberturas: ${coverageKeys.map((c) => COVERAGES[c]?.label || c).join(" → ")}${opts.mirrorOnly ? " (solo espejo)" : ""}`);
  console.log("");

  for (const nature of weaponKeys) {
    for (const [covA, covB] of pairs) {
      let winsCovA = 0;
      let winsCovB = 0;
      let timeouts = 0;
      let roundsTotal = 0;
      let maxRoundsSeen = 0;
      let hitsCovA = 0;
      let hitsCovB = 0;
      let dmgSumCovA = 0;
      let dmgSumCovB = 0;
      let materialCovA = 0;
      let materialCovB = 0;
      let absorbSumCovA = 0;
      let absorbSumCovB = 0;
      let maxResistSumCovA = 0;
      let brokenSumCovA = 0;

      for (let i = 0; i < opts.numSims; i++) {
        // Alterna el orden de ataque para anular el sesgo del primer atacante.
        // `fa` y `fb` se construyen SIN swap; el swap solo cambia quién ataca
        // primero. Las métricas se acumulan por COBERTURA, no por posición.
        const swap = i % 2 === 1;
        const fa = attachAmmo(buildPhaseCFighter(nature, opts.level, { ...opts, coverage: covA, material }));
        const fb = attachAmmo(buildPhaseCFighter(nature, opts.level, { ...opts, coverage: covB, material }));

        const r = simulateCombat(swap ? fb : fa, swap ? fa : fb);

        // El log etiqueta "A"/"B" según la posición; mapea a cobertura.
        const prefixCovA = swap ? "B" : "A";
        const prefixCovB = swap ? "A" : "B";
        const winnerCovA = r.winner === prefixCovA;
        const winnerCovB = r.winner === prefixCovB;
        if (winnerCovA) winsCovA++;
        else if (winnerCovB) winsCovB++;
        else timeouts++;

        for (const entry of r.log) {
          if (!entry || entry.action !== "attack" || typeof entry.finalDamage !== "number") continue;
          const isCovA = String(entry.attacker).startsWith(prefixCovA);
          if (isCovA) {
            hitsCovA++;
            dmgSumCovA += entry.finalDamage;
            materialCovA += entry.materialDamage || 0;
          } else {
            hitsCovB++;
            dmgSumCovB += entry.finalDamage;
            materialCovB += entry.materialDamage || 0;
          }
        }

        roundsTotal += r.totalRounds || 0;
        if ((r.totalRounds || 0) > maxRoundsSeen) maxRoundsSeen = r.totalRounds;

        const ca = armorConsumption(swap ? fb : fa);
        const cb = armorConsumption(swap ? fa : fb);
        absorbSumCovA += ca.absorbed;
        absorbSumCovB += cb.absorbed;
        maxResistSumCovA += ca.maxResist;
        brokenSumCovA += ca.broken;
      }

      const row = {
        weapon: nature,
        covA,
        covB,
        winsA: winsCovA,
        winsB: winsCovB,
        timeouts,
        winrateA: (winsCovA / opts.numSims) * 100,
        avgRounds: roundsTotal / opts.numSims,
        maxRounds: maxRoundsSeen,
        avgDmgA: hitsCovA ? Math.round((dmgSumCovA / hitsCovA) * 10) / 10 : null,
        avgDmgB: hitsCovB ? Math.round((dmgSumCovB / hitsCovB) * 10) / 10 : null,
        avgMaterialPerHitA: hitsCovA ? Math.round((materialCovA / hitsCovA) * 10) / 10 : null,
        avgMaterialPerHitB: hitsCovB ? Math.round((materialCovB / hitsCovB) * 10) / 10 : null,
        avgAbsorbedPerFightA: Math.round((absorbSumCovA / opts.numSims) * 10) / 10,
        avgAbsorbedPerFightB: Math.round((absorbSumCovB / opts.numSims) * 10) / 10,
        avgMaxResistA: Math.round((maxResistSumCovA / opts.numSims) * 10) / 10,
        avgBrokenPiecesA: Math.round((brokenSumCovA / opts.numSims) * 10) / 10,
      };
      allRows.push(row);

      if (opts.verbose) {
        console.log(`  ${nature.padEnd(11)} ${covA.padEnd(8)} vs ${covB.padEnd(8)} → winrateA=${row.winrateA.toFixed(1)}% avgR=${row.avgRounds.toFixed(1)} maxR=${row.maxRounds} t/o=${timeouts} dmgA=${row.avgDmgA} matA=${row.avgMaterialPerHitA} absorbA=${row.avgAbsorbedPerFightA}`);
      }
    }
  }

  // ── Reporte ──
  const lines = [];
  lines.push(`# Laboratorio Fase C — Arma vs Grados de Armadura`);
  lines.push("");
  lines.push(`Config: sims/par=${opts.numSims} | nivel=${opts.level} | nominalDamage=${opts.nominal} | tier=${opts.tier} | material=${materialLabel} | maxRounds=${opts.maxRounds}`);
  lines.push(`Dummys idénticos en stats, nivel e IA; única variable = cobertura de armadura | arquetipo=${opts.archetype} (${ARCHETYPES[opts.archetype].label})`);
  lines.push(`Método: swap de orden de ataque por sim (anula el sesgo del primer atacante); cada ${opts.numSims} combates se rota el grado de cobertura de la armadura.`);
  lines.push("");
  lines.push(`Armadura por grado: cobertura afecta MSPD (penalización 0.1→0.4) y fatiga de movimiento (×1.05→×1.5); la pieza más pesada manda.`);
  lines.push(`Nota: la armadura NO mitiga el daño corporal (el bonusDef solo sesga la reacción de bloqueo); absorbe daño material (durabilidad).`);
  lines.push(`Lectura: la DIAGONAL (espejo) debe quedar ~50%. Las celdas off-diagonal muestran cuánto protege la cobertura de A contra la cobertura de B con la misma arma.`);
  lines.push("");

  for (const w of weaponKeys) {
    lines.push(`## ${NATURES[w]?.name || w} — winrate A% (A=covA vs B=covB, misma arma)`);
    lines.push(`| A\\B | ${coverageKeys.map((c) => COVERAGES[c]?.label || c).join(" | ")} |`);
    lines.push(`| --- | ${coverageKeys.map(() => "---").join(" | ")} |`);
    for (const cA of coverageKeys) {
      const cells = coverageKeys.map((cB) => {
        const r = allRows.find((x) => x.weapon === w && x.covA === cA && x.covB === cB);
        return r ? `${r.winrateA.toFixed(1)}%` : "-";
      });
      lines.push(`| ${COVERAGES[cA]?.label || cA} | ${cells.join(" | ")} |`);
    }
    lines.push("");
  }

  lines.push(`## Duración por par (avgRounds)`);
  lines.push(`| Arma | Par (A vs B) | avgRounds | maxRounds | t/o |`);
  lines.push(`| --- | --- | --- | --- | --- |`);
  for (const r of allRows) {
    lines.push(`| ${r.weapon} | ${r.covA} vs ${r.covB} | ${r.avgRounds.toFixed(1)} | ${r.maxRounds} | ${r.timeouts} |`);
  }

  lines.push("");
  lines.push(`## Daño promedio por golpe (A)`);
  lines.push(`| Arma | Par (A vs B) | dmgA | dmgB | mat/hitA | absorbA | maxResistA | piezasRotasA |`);
  lines.push(`| --- | --- | --- | --- | --- | --- | --- | --- |`);
  for (const r of allRows) {
    lines.push(`| ${r.weapon} | ${r.covA} vs ${r.covB} | ${r.avgDmgA ?? "-"} | ${r.avgDmgB ?? "-"} | ${r.avgMaterialPerHitA ?? "-"} | ${r.avgAbsorbedPerFightA} | ${r.avgMaxResistA} | ${r.avgBrokenPiecesA} |`);
  }

  lines.push("");
  lines.push(`## Invariantes`);
  const espejo = allRows.filter((r) => r.covA === r.covB);
  const outOfBand = espejo.filter((r) => Math.abs(r.winrateA - 50) > 5);
  lines.push(`- Winrate espejo en 50±5%: ${outOfBand.length ? "❌ VIOLADO" : "✅ OK"}`);
  lines.push(`- Sin timeouts: ${allRows.filter((r) => r.timeouts > 0).length ? "❌ VIOLADO" : "✅ OK"}`);
  if (outOfBand.length) {
    lines.push(`  Fuera de banda: ${outOfBand.map((r) => `${r.weapon}/${r.covA}=${r.winrateA.toFixed(1)}%`).join(", ")}`);
  }

  const mdName = path.join("experiments", `${tag}_report.md`);
  fs.writeFileSync(path.join(OUT_DIR, mdName), lines.join("\n"));

  const raw = {
    config: { numSims: opts.numSims, weapon: weaponKeys, archetype: opts.archetype, coverage: coverageKeys, mirrorOnly: opts.mirrorOnly, level: opts.level, nominal: opts.nominal, tier: opts.tier, material, materialNatural: natural, maxRounds: opts.maxRounds },
    rows: allRows,
    invariantes: {
      mirrorInBand: outOfBand.length === 0,
      noTimeouts: allRows.filter((r) => r.timeouts > 0).length === 0,
    },
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(OUT_DIR, path.join("experiments", `${tag}_raw.json`)), JSON.stringify(raw, null, 2));

  console.log("");
  console.log(`Invariante winrate espejo: ${raw.invariantes.mirrorInBand ? "✅ OK" : "❌ VIOLADO"}`);
  console.log(`Invariante sin timeouts: ${raw.invariantes.noTimeouts ? "✅ OK" : "❌ VIOLADO"}`);
  console.log(`  Report: ${path.join(OUT_DIR, mdName)}`);
  console.log(`  Raw:    ${path.join(OUT_DIR, path.join("experiments", `${tag}_raw.json`))}`);
}

main();
