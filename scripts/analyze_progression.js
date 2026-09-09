#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const {
  buildProgressionReport,
  getMaterialsTableMarkdown,
} = require("../src/services/rpg/progressionAnalyticsService");

const report = buildProgressionReport();
const outputDir = path.join(__dirname, "progression_output");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "progression_report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outputDir, "materiales.md"), getMaterialsTableMarkdown());
fs.writeFileSync(path.join(__dirname, "../docs/BALANCE_MATERIALES.md"), getMaterialsTableMarkdown());

const lines = [
  "# Progression Balance Report",
  "",
  "## Blocked Requirements",
  ...report.warnings.blockedRequirements.map((id) => `- ${id}`),
  "",
  "## Unreachable Materials",
  ...report.warnings.unreachableMaterials.map((id) => `- ${id}`),
  "",
  "## Cohorts",
];
for (const row of report.cohorts)
  lines.push(
    `- ${row.cohort}/${row.style} (energía ${row.dailyEnergy}, ${row.combatsPerDay} combates/día): XP requerida ${row.xpToNextLevel.toLocaleString()}; combate ${row.combatXpPerDay.toLocaleString()} XP/día; trabajos ${row.jobXpPerDay.toLocaleString()} XP/día + ${Math.round(row.jobStatEquivalentXpPerDay).toLocaleString()} XP-equiv por entrenamiento = valor ${Math.round(row.jobValuePerDay).toLocaleString()} (${(row.jobValueCombatRatio * 100).toFixed(0)}% del combate); ${row.expectedJobStatsPerDay.toFixed(2)} stats/día por trabajo; ${row.daysPerLevelFromCombat.toFixed(2)} días/nivel solo por combate.`,
  );

lines.push("", "## Longitudinal (niveles alcanzados y stats por trabajo acumuladas)");
for (const row of report.longitudinal)
  lines.push(
    `- ${row.cohort}/${row.style} +${row.days}d: nivel ${row.startLevel} → ${row.endLevel} (+${row.levelsGained}); ${Math.round(row.cumulativeJobStats)} stats de trabajo acumuladas.`,
  );

lines.push("", "## Curva de nivel (política B5)");
lines.push(
  `- Nivel = suma de atributos, acotada a [100, 500] (clampLevel). El nivel nunca supera 500 aunque la maestría siga creciendo por trabajos.`,
);
lines.push(`- Victorias iguales por punto de atributo (equivalencia de coste):`);
for (const band of report.curveBands)
  lines.push(
    `  - Niveles ${band.from}-${band.to}: XP 1er nivel ${band.firstLevelXp.toLocaleString()}; total banda ${band.bandTotalXp.toLocaleString()}; victorias/punto ${band.winsPerStatPointAtStart.toFixed(2)} → ${band.winsPerStatPointAtEnd.toFixed(2)}.`,
  );

lines.push("", "## Herramientas (B4)");
lines.push(
  `- Ingreso de stelas de referencia (${report.toolMetrics.policy.paybackExpeditionsLimit ? "regular" : "regular"}): ${report.toolMetrics.dailyStelasIncome} stelas/día; retorno dentro de ${report.toolMetrics.policy.paybackExpeditionsLimit} expediciones como objetivo.`,
);
for (const tool of report.toolMetrics.tools) {
  lines.push(`- ${tool.toolName} (zona: ${tool.zone || "n/a"}):`);
  for (const upgrade of tool.upgrades) {
    const blocked = upgrade.sourceBlocked ? " · BLOQUEADA (sin fuente del material)" : "";
    const expansion = upgrade.isExpansion ? " · expansión (sin retorno directo)" : "";
    const payback =
      upgrade.paybackExpeditions === null
        ? "retorno n/a"
        : `retorno ${upgrade.paybackExpeditions} expediciones${upgrade.withinPaybackLimit ? " ✓" : " ✗"}`;
    lines.push(
      `  - Nv.${upgrade.upgradeTo}: coste ${upgrade.totalCost.toLocaleString()} stelas-equiv (${upgrade.costStelas.toLocaleString()} stelas + ${upgrade.materialCost.toLocaleString()} materiales); valor extra/expedición ${upgrade.unlockedValueDeltaPerRun ?? "n/a"}; ${payback}; ~${upgrade.daysStelas} días de stelas${blocked}${expansion}.`,
    );
  }
}

lines.push("", "## Forja y refinamiento (B7)");
lines.push(`- Escalera 2:1 (unidades Tier E por unidad del tier):`);
for (const step of report.forgeEconomics.ladder)
  lines.push(
    `  - Tier ${step.tier}: multiplicador ${step.multiplier} (poder ${(step.relativePowerVsE * 100).toFixed(0)}% del Tier E); ${step.unitsEForOne} uds. E por unidad; ${step.unitsEForSampleCraft} uds. E por espada.`,
  );
lines.push(`- Comparación forjar vs comprar (espada, ingreso ${report.forgeEconomics.dailyStelasIncome} stelas/día):`);
for (const material of report.forgeEconomics.materials) {
  const blocked = material.acquisition
    ? `${material.acquisition.zone} (${material.acquisition.tool} nv.${material.acquisition.toolLevel}, ${material.acquisition.unitsPerDay.toFixed(1)} uds/día)`
    : "SIN FUENTE JUGABLE";
  const forgeSummary = material.tiers
    .map(
      (tier) =>
        `Tier ${tier.tier} = ${tier.unitsForSampleCraft} uds (${tier.daysForge === null ? "n/a" : tier.daysForge.toFixed(1)} días)`,
    )
    .join(" · ");
  const direct = material.directAlternative
    ? `directa: ${material.directAlternative.tier} en ${material.directAlternative.shopId} (${material.directAlternative.price} stelas → ${material.daysDirectBuy.toFixed(1)} días)${material.directDominatesTierD ? " · DOMINA a forjar en Tier D" : ""}`
    : "sin alternativa directa";
  lines.push(
    `  - ${material.materialName} (${material.rarity}): obtención ${blocked}; forjar espada → ${forgeSummary}; ${direct}.`,
  );
}
lines.push(
  `- La compra directa domina a la forja en algún material Tier D: ${report.forgeEconomics.checks.directBuyDominatesSomeForge}`,
);
lines.push(
  `- Materiales del muestreo sin fuente jugable: ${report.forgeEconomics.checks.unreachableMaterialsInForge.join(", ") || "ninguno"}`,
);

lines.push("", "## Restricciones de diseño (P1-P5)");
lines.push(`- Objetivos configurados: ${JSON.stringify(report.design.targets)}`);
lines.push(
  `- Dominancia en trabajos (P4/P5): ${report.design.checks.jobSingleDominant ? "UN SOLO trabajo domina XP, stelas y entrenamiento → sin decisiones" : "ningún trabajo domina las tres recompensas → hay decisiones entre vías"}`,
);
lines.push(
  `- Valor laboral dentro del combate del mismo perfil (B1): ${report.design.checks.jobValueWithinCombat ? "sí" : "NO — los trabajos superan al combate en valor total"}`,
);
lines.push(
  `- Mejor XP/h: ${report.jobDominance.bestXp} · Mejor stelas/h: ${report.jobDominance.bestStelas} · Mejor entrenamiento/energía: ${report.jobDominance.bestTraining}`,
);

lines.push("", "## Advertencias");
lines.push(`- Materiales sin fuente jugable: ${report.warnings.unreachableMaterials.length}`);
lines.push(`- Requisitos bloqueados: ${report.warnings.blockedRequirements.join(", ") || "ninguno"}`);
lines.push(`- La tasa de stats por trabajo excede el objetivo diario: ${report.warnings.jobStatRateExceedsTarget}`);
lines.push(`- Los trabajos dominan la progresión de atributos a largo plazo: ${report.warnings.jobStatsDominated}`);
lines.push(
  `- El valor laboral total supera la XP de combate del mismo perfil: ${report.warnings.jobValueExceedsCombat}`,
);
fs.writeFileSync(path.join(outputDir, "progression_report.md"), lines.join("\n") + "\n");
console.log(`Progression report written to ${outputDir}`);
