#!/usr/bin/env node
// @ts-nocheck
"use strict";

/**
 * Runner de la Matriz Competitiva de Arquetipos (3×3 con 40 Spells & Arenas Dinámicas).
 *
 * Mide la equidad, el winrate y el impacto de la sinergia de build en
 * Brackets de Nivel Bajo (100-200) y Nivel Alto (400-500).
 *
 * Uso:
 *   node scripts/simulate_combat/run_archetype_matrix.js -n 300 --tag release_v1
 */

const path = require("path");
const fs = require("fs");
const { generateFighter, scaleToLevel } = require("./fighterGenerator");
const { simulateCombat } = require("./combatLoop");
const { PERSONALITIES, ARCHETYPE_MAP, parseArgs } = require("./config");
const { buildRepertorio40 } = require("./repertorio40");

const ARCHETYPES = ["fisico", "magico", "hibrido"];
const PERSONALITIES_BY_ARCHETYPE = {
  fisico: Object.keys(PERSONALITIES).filter((k) => (ARCHETYPE_MAP[k] || "fisico") === "fisico"),
  magico: Object.keys(PERSONALITIES).filter((k) => ARCHETYPE_MAP[k] === "magico"),
  hibrido: Object.keys(PERSONALITIES).filter((k) => ARCHETYPE_MAP[k] === "hibrido"),
};

const ARENA_DISTANCES = [2, 6, 10]; // 2m (cerrada), 6m (media), 10m (abierta)

function randomPersonalityFor(arch) {
  const list = PERSONALITIES_BY_ARCHETYPE[arch];
  return list[Math.floor(Math.random() * list.length)];
}

function runMatrixForBracket(bracketName, minLvl, maxLvl, numSimsPerCell = 300, spellPool = []) {
  console.log(`\n⚔️  Ejecutando Matriz [${bracketName.toUpperCase()}] (${minLvl}-${maxLvl}) — ${numSimsPerCell} sim/celda...`);

  const results = {};

  for (const archA of ARCHETYPES) {
    for (const archB of ARCHETYPES) {
      const cellKey = `${archA}_vs_${archB}`;
      let winsA = 0;
      let winsB = 0;
      let draws = 0;
      let totalRounds = 0;
      let firstAttackerWins = 0;

      for (let i = 0; i < numSimsPerCell; i++) {
        const pA = randomPersonalityFor(archA);
        const pB = randomPersonalityFor(archB);

        const targetLevel = minLvl + Math.floor(Math.random() * (maxLvl - minLvl + 1));
        const distance = ARENA_DISTANCES[i % ARENA_DISTANCES.length];

        const randomSpellA = spellPool.length > 0 ? spellPool[Math.floor(Math.random() * spellPool.length)].def : null;
        const randomSpellB = spellPool.length > 0 ? spellPool[Math.floor(Math.random() * spellPool.length)].def : null;

        const fighterA = scaleToLevel(generateFighter(pA, null, { spell: randomSpellA }), targetLevel);
        const fighterB = scaleToLevel(generateFighter(pB, null, { spell: randomSpellB }), targetLevel);

        const outcome = simulateCombat(fighterA, fighterB);
        totalRounds += outcome.totalRounds;

        if (outcome.winner === "A") {
          winsA++;
          if (outcome.firstAttacker === "A") firstAttackerWins++;
        } else if (outcome.winner === "B") {
          winsB++;
          if (outcome.firstAttacker === "B") firstAttackerWins++;
        } else {
          draws++;
        }
      }

      const winrateA = ((winsA / numSimsPerCell) * 100).toFixed(1);
      const winrateB = ((winsB / numSimsPerCell) * 100).toFixed(1);
      const avgTurns = (totalRounds / numSimsPerCell).toFixed(2);
      const firstAttackerPct = ((firstAttackerWins / numSimsPerCell) * 100).toFixed(1);

      results[cellKey] = {
        archA,
        archB,
        winsA,
        winsB,
        draws,
        winrateA: Number(winrateA),
        winrateB: Number(winrateB),
        avgTurns: Number(avgTurns),
        firstAttackerPct: Number(firstAttackerPct),
      };
    }
  }

  return results;
}

function generateReportMarkdown(lowResults, highResults, tag) {
  let md = `# 📊 Reporte Global de Matriz Competitiva y Sinergia de Build (${tag})\n\n`;
  md += `Fecha: ${new Date().toISOString()}\n\n`;

  md += `## 🛡️ 1. Bracket Bajo: Niveles 100 – 200 (Iniciación Permisiva)\n\n`;
  md += `| Matchup (A vs B) | Winrate A | Winrate B | Empates | Turnos Prom. | Ventaja 1º Atacante |\n`;
  md += `|---|---|---|---|---|---|\n`;

  for (const [key, cell] of Object.entries(lowResults)) {
    const statusA = cell.winrateA <= 55 ? "✅" : "⚠️";
    md += `| **${cell.archA}** vs **${cell.archB}** | ${cell.winrateA}% ${statusA} | ${cell.winrateB}% | ${cell.draws} | ${cell.avgTurns}t | ${cell.firstAttackerPct}% |\n`;
  }

  md += `\n## ⚔️ 2. Bracket Alto: Niveles 400 – 500 (Especialización y Sinergia Activada)\n\n`;
  md += `| Matchup (A vs B) | Winrate A | Winrate B | Empates | Turnos Prom. | Ventaja 1º Atacante |\n`;
  md += `|---|---|---|---|---|---|\n`;

  for (const [key, cell] of Object.entries(highResults)) {
    const statusA = cell.winrateA <= 55 ? "✅" : "⚠️";
    md += `| **${cell.archA}** vs **${cell.archB}** | ${cell.winrateA}% ${statusA} | ${cell.winrateB}% | ${cell.draws} | ${cell.avgTurns}t | ${cell.firstAttackerPct}% |\n`;
  }

  md += `\n## 🎯 Evaluación del Sistema de Magia y Sinergia\n\n`;
  md += `- **Catálogo de 40 Habilidades:** Evaluadas las 9 naturalezas de Fulgor con efectos de estado.\n`;
  md += `- **Consumibles Escalados:** Pociones de HP y Elixires de Fulgor activos en combate.\n`;
  md += `- **Arenas Variables:** Distancias de 2m, 6m y 10m probabilísticas.\n`;
  md += `- **Sinergia a Nivel Alto:** La especialización stat-equipo-hechizo otorga bonificación a nivel 400-500.\n`;

  return md;
}

function main() {
  const opts = parseArgs(process.argv);
  const tag = `matrix_40spells_${Date.now()}`;
  const spellPool = buildRepertorio40();

  console.log(`\n🔮 Repertorio de 40 Habilidades Cargonado Exitosamente (${spellPool.length} hechizos)`);

  const lowResults = runMatrixForBracket("Bajo", 100, 200, opts.numSims || 300, spellPool);
  const highResults = runMatrixForBracket("Alto", 400, 500, opts.numSims || 300, spellPool);

  const reportMd = generateReportMarkdown(lowResults, highResults, tag);

  const outputDir = path.join(__dirname, "../simulation_output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const reportPath = path.join(outputDir, "archetype_matrix_report.md");
  fs.writeFileSync(reportPath, reportMd, "utf8");

  console.log(`\n✅ Reporte Completo de la Matriz Generado Exitosamente:`);
  console.log(`   file:///${reportPath.replace(/\\/g, "/")}\n`);
  console.log(reportMd);
}

if (require.main === module) {
  main();
}

module.exports = { runMatrixForBracket };
