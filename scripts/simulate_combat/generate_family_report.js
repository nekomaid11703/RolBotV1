#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * Informe detallado de equipamientos generados por el generador de familias.
 *
 * Genera N fighters y muestra para cada uno: stats, arma (naturaleza, tier,
 * material, daño base, alcance), munición, piezas de armadura (slot, cobertura,
 * material, tier, maxResist, bonusDef), escudo, amuleto, piezas de set y bono
 * de set activo.
 *
 * Uso:
 *   node scripts/simulate_combat/generate_family_report.js -n 5
 *   node scripts/simulate_combat/generate_family_report.js -n 5 --weapon arco_de_hierro
 *   node scripts/simulate_combat/generate_family_report.js -n 5 --material titanio --tier S
 *
 * Salida: scripts/simulation_output/family_report.md
 */

const { generateFighter } = require("./fighterGenerator");
const { MATERIALS, getMaterialStats } = require("../../src/data/materialData");
const { getSpecialTierMult } = require("../../src/config/tierConfig");
const { SET_BONUS, SET_BONUS_THRESHOLD } = require("./config");
const { materialName } = require("./familyGenerator");

const TIER_LABELS = { E: "Escaso", D: "Distinguido", C: "Notable", B: "Bueno", A: "Alto", S: "Supremo", N: "Nirvana" };
const RARITY_LABELS = { comun: "Común", poco_comun: "Poco común", raro: "Raro", epico: "Épico", legendario: "Legendario", mitico: "Mítico" };

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { num: 5, verbose: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-n":
      case "--num":
        opts.num = parseInt(args[++i], 10);
        break;
      case "--weapon":
        opts.weapon = args[++i];
        break;
      case "--material":
        opts.material = args[++i];
        break;
      case "--tier":
        opts.tier = args[++i];
        break;
      case "--family":
        opts.family = args[++i];
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

function materialLine(material, tier) {
  const stats = getMaterialStats(material, tier);
  return `afil:${stats.afilabilidad} | conj:${stats.conduccion_magica} | res:${stats.resistencia_material} | flex:${stats.flexibilidad}`;
}

function weaponLine(w) {
  const tierLabel = TIER_LABELS[w.tier] || w.tier;
  const specialMult = getSpecialTierMult(w.tier);
  const parts = [
    `**${w.name}**`,
    `[${w.damageNature}]`,
    `tier ${w.tier} (${tierLabel})`,
    `mat: ${materialName(w.material)} (${RARITY_LABELS[MATERIALS[w.material]?.rarity] || w.material})`,
    `daño: ${w.baseDamage}`,
    `alcance: ${w.weaponRange}m`,
    `manos: ${w.hands}`,
  ];
  if (w.damageNature === "perforante") parts.push(`mult especial: ×${specialMult}`);
  if (w.ranged) {
    parts.push(`**MUNICIÓN:** ${w.arrow?.name || "?"} (flecha, tier ${w.arrow?.tier}, daño ${w.arrow?.baseDamage})`);
  }
  return parts.join(" | ");
}

function armorLine(p) {
  const tierLabel = TIER_LABELS[p.tier] || p.tier;
  return [
    `**${p.name}**`,
    `[${p.slot}]`,
    `cob: ${p.coverage}`,
    `tier ${p.tier} (${tierLabel})`,
    `mat: ${materialName(p.material)} (${RARITY_LABELS[MATERIALS[p.material]?.rarity] || p.material})`,
    `maxResist: ${p.maxResist}`,
    `bonusDef: ${p.bonusDef}`,
  ].join(" | ");
}

function fighterSection(f, idx, opts) {
  const eq = f.equipment;
  const lines = [];
  lines.push(`## Maniquí ${idx}: ${f.name}`);
  lines.push("");
  lines.push(`| Campo | Valor |`);
  lines.push(`|-------|-------|`);
  lines.push(`| Raza | ${f.race} |`);
  lines.push(`| Personalidad | ${f.personality} |`);
  lines.push(`| Nivel | ${f.nivel} |`);
  lines.push(`| HP | ${f.hp} |`);
  lines.push(`| Familia de ítems | ${eq.family} |`);
  lines.push(`| Tier dominante (tierKey) | ${eq.tierKey} (${TIER_LABELS[eq.tierKey] || eq.tierKey}) |`);
  lines.push(`| Set pieces | ${eq.setPieces}/${SET_BONUS_THRESHOLD} |`);
  lines.push(`| Bono de set activo | ${eq.setBonusActive ? "**SÍ**" : "no"} |`);
  if (eq.setBonusActive) {
    const bonusStr = Object.entries(SET_BONUS).map(([k, v]) => `+${v} ${k}`).join(", ");
    lines.push(`| Bono aplicado | ${bonusStr} |`);
  }
  lines.push(`| Amuleto | ${eq.amulet ? eq.amulet.name : "no"} |`);
  if (eq.amulet) {
    const buffStr = Object.entries(eq.amulet.buff || {}).map(([k, v]) => `+${v} ${k}`).join(", ");
    lines.push(`| Buff amuleto | ${buffStr} |`);
  }
  lines.push(`| Munición | ${eq.ammo ? `${eq.ammo.count}x ${eq.ammo.name}` : "no aplica"} |`);
  lines.push(`| Armadura total | bonusDef ${eq.armor?.bonusDef || 0} | maxResist ${eq.armor?.maxResist || 0} | ${eq.armor?.pieces || 0} piezas |`);
  lines.push("");

  lines.push("### Stats");
  lines.push("");
  const statsKeys = ["atk", "def", "aspd", "ref", "mspd", "hp", "fulgor", "d_fulgor", "r_fulgor"];
  const statLabels = { atk: "ATK", def: "DEF", aspd: "ASPD", ref: "REF", mspd: "MSPD", hp: "HP", fulgor: "Fulgor", d_fulgor: "D. Fulgor", r_fulgor: "R. Fulgor" };
  lines.push(`| ${statsKeys.map((k) => statLabels[k]).join(" | ")} |`);
  lines.push(`| ${statsKeys.map(() => "---").join(" | ")} |`);
  lines.push(`| ${statsKeys.map((k) => f.stats[k] ?? "-").join(" | ")} |`);
  lines.push("");

  lines.push("### Arma");
  lines.push("");
  if (eq.weapon) {
    lines.push(weaponLine(eq.weapon));
    lines.push("");
    const baseStats = MATERIALS[eq.weapon.material]?.baseStats || {};
    lines.push(`Material base (${materialName(eq.weapon.material)}, tier ${eq.weapon.tier}): ${materialLine(eq.weapon.material, eq.weapon.tier)}`);
    lines.push("");
    lines.push(`Base nominal del pool: ${eq.weapon.nominalDamage || "0 (el daño lo aporta el proyectil)"}`);
  } else {
    lines.push("*Desarmado*");
  }
  lines.push("");

  lines.push("### Armadura (piezas)");
  lines.push("");
  if (eq.armorList.length) {
    lines.push("| Pieza | Slot | Cobertura | Tier | Material | maxResist | bonusDef |");
    lines.push("|-------|------|-----------|------|----------|-----------|----------|");
    for (const p of eq.armorList) {
      lines.push(
        `| ${p.name} | ${p.slot} | ${p.coverage} | ${p.tier} | ${materialName(p.material)} | ${p.maxResist} | ${p.bonusDef} |`,
      );
    }
  } else {
    lines.push("*Sin armadura*");
  }
  lines.push("");

  // Detalle material por pieza
  lines.push("### Stats de material por pieza");
  lines.push("");
  lines.push("| Pieza | Material | Afilabilidad | Conducción mágica | Resistencia | Flexibilidad |");
  lines.push("|-------|----------|--------------|-------------------|-------------|--------------|");
  if (eq.weapon) {
    const ms = getMaterialStats(eq.weapon.material, eq.weapon.tier);
    lines.push(`| Arma (${eq.weapon.name}) | ${materialName(eq.weapon.material)} | ${ms.afilabilidad} | ${ms.conduccion_magica} | ${ms.resistencia_material} | ${ms.flexibilidad} |`);
  }
  for (const p of eq.armorList) {
    const ms = getMaterialStats(p.material, p.tier);
    lines.push(`| ${p.name} | ${materialName(p.material)} | ${ms.afilabilidad} | ${ms.conduccion_magica} | ${ms.resistencia_material} | ${ms.flexibilidad} |`);
  }
  lines.push("");
  return lines;
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    console.log(`Uso:
  node scripts/simulate_combat/generate_family_report.js [-n N] [--weapon id] [--material id] [--tier E|D|C|B|A|S] [--family id]
  node scripts/simulate_combat/generate_family_report.js -n 8 --weapon arco_de_hierro`);
    return;
  }

  const eqOpts = {};
  if (opts.weapon) eqOpts.weapon = opts.weapon;
  if (opts.material) eqOpts.material = opts.material;
  if (opts.tier) eqOpts.tier = opts.tier;
  if (opts.family) eqOpts.family = opts.family;

  const fs = require("fs");
  const path = require("path");
  const lines = [];
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  lines.push("# Informe de Equipamientos Generados (familia tester)");
  lines.push(`Generado: ${now} | ${opts.num} maniquíes | Familia: ${opts.family || "aleatoria"}`);
  if (opts.weapon) lines.push(`Arma forzada: ${opts.weapon}`);
  if (opts.material) lines.push(`Material forzado: ${opts.material}`);
  if (opts.tier) lines.push(`Tier forzado: ${opts.tier}`);
  lines.push("");
  lines.push("> Los ítems son PREVIEW/TESTER: derivados con las fórmulas reales del motor");
  lines.push("> (`base × tier × material`), en memoria, sin registrar en el catálogo real.");
  lines.push("> Rareza de material: común < poco común < raro < épico < legendario < mítico.");
  lines.push("> Tier por material: común→C, poco común→B, raro→A, épico/legendario/mítico→S.");
  lines.push("");

  for (let i = 0; i < opts.num; i++) {
    const fighter = generateFighter(null, null, eqOpts);
    lines.push(...fighterSection(fighter, i + 1, opts));
  }

  const outDir = path.join(__dirname, "..", "simulation_output");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "family_report.md");
  fs.writeFileSync(outFile, lines.join("\n") + "\n");

  console.log(`Informe generado: ${outFile}`);
  if (opts.verbose) {
    console.log("");
    console.log(lines.join("\n"));
  }
}

if (require.main === module) {
  main();
}

module.exports = { fighterSection };
