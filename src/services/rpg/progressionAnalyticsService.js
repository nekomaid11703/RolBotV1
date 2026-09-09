// @ts-nocheck
const { MATERIALS } = require("../../data/materialData");
const { getItem } = require("../../data/items");
const { EXPEDITION_ZONES } = require("../../config/expeditionConfig");
const { SHOPS } = require("../../config/shopConfig");
const { JOBS, trainingPointsForJob } = require("../../config/jobConfig");
const { TOOL_UPGRADE_COSTS, TOOLS } = require("../../config/toolsConfig");
const { TIERS } = require("../../config/tierConfig");
const { xpForNextLevel, LEVEL_MAX } = require("../../config/characterConfig");
const { calculateXpReward } = require("./combatEngine");
const { jobXpForLevel } = require("./xpRewardService");
const {
  PROGRESSION_COHORTS,
  PLAY_STYLES,
  BALANCE_TARGETS,
  PROGRESSION_HORIZONS_DAYS,
  JOB_TRAINING,
  DESIGN_TARGETS,
  XP_RULES,
  TOOL_POLICY,
  CRAFTING_POLICY,
} = require("../../config/progressionBalance");

const TIER_ORDER = Object.values(TIERS)
  .sort((a, b) => a.rank - b.rank)
  .map((tier) => tier.name);

const MATERIAL_PRICE_BY_RARITY = { comun: 80, poco_comun: 160, raro: 320, epico: 640, legendario: 1280, mitico: 2560 };

function materialIdFromItem(itemId) {
  const prefix = "trozo_de_";
  return String(itemId || "").startsWith(prefix) ? String(itemId).slice(prefix.length) : null;
}

function getMaterialSources() {
  const sources = Object.fromEntries(
    Object.keys(MATERIALS)
      .filter((id) => id !== "etereo")
      .map((id) => [id, []]),
  );

  for (const zone of Object.values(EXPEDITION_ZONES)) {
    for (const loot of zone.lootTable || []) {
      const materialId = materialIdFromItem(loot.itemId);
      if (materialId && sources[materialId])
        sources[materialId].push({
          type: "expedition",
          id: zone.id,
          toolReq: loot.toolReq || "?",
          minToolLevel: loot.minToolLevel || 1,
          weight: loot.weight,
        });
    }
  }
  for (const shop of Object.values(SHOPS)) {
    for (const item of [...(shop.items || []), ...(shop.rotatingPool || [])]) {
      const materialId = materialIdFromItem(item.itemId);
      if (materialId && sources[materialId])
        sources[materialId].push({ type: "shop", id: shop.id, tier: item.metadata?.tier || "E" });
    }
  }
  return sources;
}

function getRequiredMaterials() {
  const required = new Set();
  for (const cost of Object.values(TOOL_UPGRADE_COSTS)) {
    for (const material of cost.materials || []) {
      const materialId = materialIdFromItem(material.itemId);
      if (materialId) required.add(materialId);
    }
  }
  return [...required];
}

function getAvailabilityReport() {
  const sources = getMaterialSources();
  const required = getRequiredMaterials();
  const unreachable = Object.keys(sources).filter((id) => sources[id].length === 0);
  const blockedRequirements = required.filter((id) => !sources[id]?.length);
  return { sources, required, unreachable, blockedRequirements };
}

function getLevelCurveBands() {
  const ranges = [
    { from: 100, to: 199 },
    { from: 200, to: 299 },
    { from: 300, to: 399 },
    { from: 400, to: 499 },
    { from: 500, to: 500 },
  ];
  return ranges.map(({ from, to }) => {
    const measureAt = Math.min(to, LEVEL_MAX - 1);
    let bandTotalXp = 0;
    for (let level = from; level <= measureAt; level += 1) bandTotalXp += xpForNextLevel(level);
    return {
      from,
      to,
      firstLevelXp: xpForNextLevel(from),
      bandTotalXp,
      winsPerStatPointAtStart: xpForNextLevel(from) / calculateXpReward(from, true),
      winsPerStatPointAtEnd: xpForNextLevel(measureAt) / calculateXpReward(measureAt, true),
    };
  });
}

function materialPrice(itemId) {
  const def = getItem(itemId);
  if (def?.basePrice) return Number(def.basePrice) || 0;
  const materialId = materialIdFromItem(itemId);
  if (!materialId || !MATERIALS[materialId]) return 0;
  return MATERIAL_PRICE_BY_RARITY[MATERIALS[materialId].rarity] || 80;
}

function toolBonusForLevel(level) {
  return level >= 2 ? Number(TOOL_UPGRADE_COSTS[level]?.lootBonus) || 0 : 0;
}

function zoneForTool(toolId) {
  const candidates = Object.values(EXPEDITION_ZONES).filter((zone) =>
    (zone.lootTable || []).some((entry) => entry.toolReq === toolId),
  );
  if (candidates.length === 0) return null;
  // Zona de referencia: la que maximiza el valor esperado a nivel maestro,
  // donde la herramienta genera más botín y debe amortizar su mejora.
  return candidates.reduce((best, zone) =>
    zoneToolExpectedValue(zone, toolId, 10) > zoneToolExpectedValue(best, toolId, 10) ? zone : best,
  );
}

function zoneToolExpectedValue(zone, toolId, toolLevel) {
  if (!zone) return 0;
  const bonus = toolBonusForLevel(toolLevel);
  let expected = 0;
  for (const entry of zone.lootTable || []) {
    if (entry.toolReq !== toolId) continue;
    if ((entry.minToolLevel || 1) > toolLevel) continue;
    const chance = (entry.weight / 100) * (1 + bonus);
    const avgQty = ((entry.minQty || 0) + (entry.maxQty || 0)) / 2;
    expected += chance * avgQty * materialPrice(entry.itemId);
  }
  return expected;
}

function dailyStelasIncome() {
  const style = PLAY_STYLES[TOOL_POLICY.incomeStyle] || PLAY_STYLES.regular;
  const rates = getJobRates();
  const bestStelas = rates.reduce((best, job) => (job.stelasPerHour > best.stelasPerHour ? job : best), rates[0]);
  const jobsPerDay = Math.max(0, Math.floor(style.dailyEnergy / (JOBS[bestStelas.id].energyCost || 1)));
  return jobsPerDay * JOBS[bestStelas.id].stelasReward;
}

function buildToolMetrics() {
  const availability = getAvailabilityReport();
  const blockedSet = new Set(availability.blockedRequirements);
  const stelasPerDay = dailyStelasIncome();
  const tools = [];

  for (const [toolId, toolDef] of Object.entries(TOOLS)) {
    const zone = zoneForTool(toolId);
    const upgrades = [];
    for (let to = 2; to <= 10; to += 1) {
      const cost = TOOL_UPGRADE_COSTS[to];
      const costStelas = Number(cost?.stelas) || 0;
      const materialCost = (cost?.materials || []).reduce(
        (sum, material) => sum + materialPrice(material.itemId) * material.quantity,
        0,
      );
      const totalCost = costStelas + materialCost;
      const sourceBlocked = (cost?.materials || []).some((material) => {
        const id = materialIdFromItem(material.itemId);
        return id ? blockedSet.has(id) : false;
      });
      const isExpansion = toolId === "mochila";
      let delta = null;
      let paybackExpeditions = null;
      if (zone) {
        delta = zoneToolExpectedValue(zone, toolId, to) - zoneToolExpectedValue(zone, toolId, to - 1);
        if (delta > 0) paybackExpeditions = Math.ceil(totalCost / delta);
      }
      upgrades.push({
        upgradeTo: to,
        costStelas,
        materialCost,
        totalCost,
        sourceBlocked,
        isExpansion,
        unlockedValueDeltaPerRun: delta === null ? null : Math.round(delta * 100) / 100,
        paybackExpeditions,
        withinPaybackLimit: paybackExpeditions !== null && paybackExpeditions <= TOOL_POLICY.paybackExpeditionsLimit,
        daysStelas: Math.ceil(totalCost / Math.max(1, stelasPerDay)),
      });
    }
    tools.push({
      tool: toolId,
      toolName: toolDef.name,
      zone: zone?.id || null,
      upgrades,
    });
  }

  const blockedUpgrades = tools.flatMap((t) =>
    t.upgrades.filter((u) => u.sourceBlocked).map((u) => `${t.tool}→nivel${u.upgradeTo}`),
  );
  const overLimit = tools.flatMap((t) =>
    t.upgrades
      .filter((u) => !u.isExpansion && u.paybackExpeditions !== null && !u.withinPaybackLimit)
      .map((u) => `${t.tool}→nivel${u.upgradeTo}`),
  );

  return {
    tools,
    dailyStelasIncome: stelasPerDay,
    policy: { paybackExpeditionsLimit: TOOL_POLICY.paybackExpeditionsLimit },
    warnings: {
      blockedUpgrades,
      overLimitPaybackUpgrades: overLimit,
      hasBlockedUpgrades: blockedUpgrades.length > 0,
      hasOverLimitPayback: overLimit.length > 0,
    },
  };
}

function getRefineLadder() {
  return TIER_ORDER.slice(1).map((tier, index) => {
    const steps = index + 1;
    const unitsEForOne = Math.pow(2, steps);
    const mult = TIERS[tier].mult;
    return {
      tier,
      multiplier: mult,
      relativePowerVsE: mult / TIERS.E.mult,
      unitsEForOne,
      unitsEForSampleCraft: unitsEForOne * CRAFTING_POLICY.sampleRecipeCost,
      sampleRecipeCost: CRAFTING_POLICY.sampleRecipeCost,
    };
  });
}

function getMaterialAcquisitionRate(materialId) {
  const itemId = `trozo_de_${materialId}`;
  let best = null;
  for (const zone of Object.values(EXPEDITION_ZONES)) {
    for (const entry of zone.lootTable || []) {
      if (entry.itemId !== itemId) continue;
      const toolLevel = Math.max(CRAFTING_POLICY.acquisitionToolLevel, entry.minToolLevel || 1);
      const bonus = toolBonusForLevel(toolLevel);
      const chance = (entry.weight / 100) * (1 + bonus);
      const avgQty = ((entry.minQty || 0) + (entry.maxQty || 0)) / 2;
      const unitsPerRun = chance * avgQty;
      const energyPerRun = zone.energyCosts?.corta || 15;
      const runsPerDay = Math.max(1, Math.floor(100 / energyPerRun));
      if (!best || unitsPerRun > best.unitsPerRun) {
        best = {
          zone: zone.id,
          tool: entry.toolReq,
          toolLevel,
          unitsPerRun,
          runsPerDay,
          unitsPerDay: unitsPerRun * runsPerDay,
        };
      }
    }
  }
  return best;
}

function getDirectForgeAlternative(materialId) {
  const itemId = `espada_de_${materialId}`;
  for (const shop of Object.values(SHOPS)) {
    for (const item of [...(shop.items || []), ...(shop.rotatingPool || [])]) {
      if (item.itemId === itemId) return { shopId: shop.id, price: item.basePrice, tier: item.metadata?.tier || "E" };
    }
  }
  return null;
}

function buildForgeEconomics() {
  const ladder = getRefineLadder();
  const stelasPerDay = dailyStelasIncome();
  const sampleMaterials = ["acero", "plata", "oro", "cuarzo", "titanio", "mitril"];
  const materials = sampleMaterials.map((materialId) => {
    const rarity = MATERIALS[materialId]?.rarity;
    const rate = getMaterialAcquisitionRate(materialId);
    const direct = getDirectForgeAlternative(materialId);
    const tiers = TIER_ORDER.slice(1).map((tier) => {
      const ladderRow = ladder.find((row) => row.tier === tier);
      const unitsForSampleCraft = ladderRow.unitsEForSampleCraft;
      return {
        tier,
        unitsForSampleCraft,
        daysForge: rate && rate.unitsPerDay > 0 ? unitsForSampleCraft / rate.unitsPerDay : null,
      };
    });
    const tierD = tiers[0];
    const daysDirectBuy = direct && stelasPerDay > 0 ? direct.price / stelasPerDay : null;
    return {
      material: materialId,
      materialName: MATERIALS[materialId]?.name || materialId,
      rarity,
      acquisition: rate,
      directAlternative: direct,
      daysDirectBuy,
      directDominatesTierD:
        direct !== null && tierD.daysForge !== null && daysDirectBuy !== null && tierD.daysForge > daysDirectBuy,
      tiers,
    };
  });
  return {
    ladder,
    materials,
    dailyStelasIncome: stelasPerDay,
    checks: {
      directBuyDominatesSomeForge: materials.some((material) => material.directDominatesTierD),
      unreachableMaterialsInForge: materials
        .filter((material) => material.acquisition === null)
        .map((material) => material.material),
    },
  };
}

function describeSourceList(sourceList) {
  if (!Array.isArray(sourceList) || sourceList.length === 0) return ["SIN RUTA"];
  return sourceList.map((source) => {
    if (source.type === "expedition") return `Exp. ${source.id} (${source.toolReq} ≥${source.minToolLevel})`;
    if (source.type === "shop") return `Tienda ${source.id}`;
    return source.type;
  });
}

function getMaterialsTable() {
  const sources = getMaterialSources();
  const rows = [];
  for (const [id, material] of Object.entries(MATERIALS)) {
    if (id === "etereo") continue;
    rows.push({
      id,
      name: material.name,
      rarity: material.rarity,
      archetype: material.archetype || "—",
      afilabilidad: material.baseStats.afilabilidad,
      conduccionMagica: material.baseStats.conduccion_magica,
      resistenciaMaterial: material.baseStats.resistencia_material,
      flexibilidad: material.baseStats.flexibilidad,
      acquisition: describeSourceList(sources[id]),
      unreachable: sources[id].length === 0,
    });
  }
  return rows;
}

function getMaterialsTableMarkdown() {
  const rows = getMaterialsTable();
  const header = [
    "| Material | Rareza | Arquetipo | Afil. | Conduc. | Resist. | Flex. | Métodos de obtención actuales |",
    "|---|---|---|---|---|---|---|---|",
  ];
  const lines = rows.map(
    (row) =>
      `| ${row.name} (\`${row.id}\`) | ${row.rarity} | ${row.archetype} | ${row.afilabilidad} | ${row.conduccionMagica} | ${row.resistenciaMaterial} | ${row.flexibilidad} | ${row.acquisition.join(", ")} |`,
  );
  return [
    "# Materiales: stats, rareza y métodos de obtención",
    "",
    "Fuente: catálogo `src/data/materialData.js`, zonas `expeditionConfig.js` y tiendas `shopConfig.js`.",
    "",
    ...header,
    ...lines,
    "",
  ].join("\n");
}

function effectiveStatsPerDay(pointsPerDay) {
  const uncapped = pointsPerDay / JOB_TRAINING.pointsPerStatPoint;
  return Math.min(uncapped, JOB_TRAINING.weeklyCapPerStat / 7);
}

function getJobRates() {
  return Object.values(JOBS).map((job) => {
    const trainingPoints = trainingPointsForJob(job);
    return {
      id: job.id,
      statTrained: job.statTrained,
      xpPerHour: (job.xpReward * 60) / job.durationMinutes,
      stelasPerHour: (job.stelasReward * 60) / job.durationMinutes,
      trainingPoints,
      trainingPointsPerHour: (trainingPoints * 60) / job.durationMinutes,
      trainingPointsPerEnergy: trainingPoints / job.energyCost,
    };
  });
}

function getJobRewardDominance() {
  const rates = getJobRates();
  const best = (key) => rates.reduce((acc, job) => (job[key] > acc[key] ? job : acc), rates[0]);
  const bestXp = best("xpPerHour");
  const bestStelas = best("stelasPerHour");
  const bestTraining = best("trainingPointsPerEnergy");
  const singleDominantJob = bestXp.id === bestStelas.id && bestStelas.id === bestTraining.id ? bestXp.id : null;
  return { bestXp: bestXp.id, bestStelas: bestStelas.id, bestTraining: bestTraining.id, singleDominantJob };
}

function getDailyRates(cohort, style) {
  const combatXpPerDay = calculateXpReward(cohort.level, true) * style.combatsPerDay;
  const jobRates = getJobRates();
  const bestJob = jobRates.reduce((best, job) => (job.xpPerHour > best.xpPerHour ? job : best), jobRates[0]);
  const jobsPerDay = Math.max(0, Math.floor(style.dailyEnergy / (JOBS[bestJob.id].energyCost || 1)));
  const trainingPointsPerDay = jobsPerDay * bestJob.trainingPoints;
  const expectedJobStatsPerDay = effectiveStatsPerDay(trainingPointsPerDay);
  const jobXpPerDay = jobsPerDay * jobXpForLevel(cohort.level, JOBS[bestJob.id].xpReward);
  // B1 (revisado): el entrenamiento de atributo tiene valor XP equivalente
  // (1 punto = el XP de un nivel completo, política B5) y se suma al valor
  // real de la jornada laboral.
  const statEquivalentXpPerDay = expectedJobStatsPerDay * xpForNextLevel(cohort.level);
  const jobValuePerDay = jobXpPerDay + statEquivalentXpPerDay;
  return {
    job: { id: bestJob.id, jobsPerDay },
    jobXpPerDay,
    jobStatEquivalentXpPerDay: statEquivalentXpPerDay,
    jobValuePerDay,
    jobValueCombatRatio: jobValuePerDay / Math.max(1, combatXpPerDay),
    combatXpPerDay,
    trainingPointsPerDay,
    expectedJobStatsPerDay,
  };
}

function resolveLevel(level, xpAmount) {
  let current = level;
  let xp = xpAmount;
  while (current < LEVEL_MAX && xp >= xpForNextLevel(current)) {
    xp -= xpForNextLevel(current);
    current += 1;
  }
  return current;
}

function simulateLongitudinal(cohort, styleId, style, days) {
  const { job, jobXpPerDay, expectedJobStatsPerDay } = getDailyRates(cohort, style);
  const dayStartLevel = cohort.level;
  let level = dayStartLevel;
  for (let day = 0; day < days; day += 1) {
    const dailyCombatXp = calculateXpReward(level, true) * style.combatsPerDay;
    level = resolveLevel(level, dailyCombatXp + jobXpPerDay);
  }
  return {
    cohort: cohort.id,
    style: styleId,
    days,
    startLevel: dayStartLevel,
    endLevel: level,
    levelsGained: level - dayStartLevel,
    cumulativeJobStats: expectedJobStatsPerDay * days,
    bestJobId: job.id,
  };
}

function estimateCohortProgress(cohort, style) {
  const nextLevelXp = xpForNextLevel(cohort.level);
  const rates = getDailyRates(cohort, style);
  return {
    level: cohort.level,
    dailyEnergy: style.dailyEnergy,
    combatsPerDay: style.combatsPerDay,
    xpToNextLevel: nextLevelXp,
    combatXpPerDay: rates.combatXpPerDay,
    jobXpPerDay: rates.jobXpPerDay,
    jobStatEquivalentXpPerDay: rates.jobStatEquivalentXpPerDay,
    jobValuePerDay: rates.jobValuePerDay,
    jobValueCombatRatio: rates.jobValueCombatRatio,
    expectedJobStatsPerDay: rates.expectedJobStatsPerDay,
    daysPerLevelFromCombat: nextLevelXp / Math.max(1, rates.combatXpPerDay),
  };
}

function buildProgressionReport() {
  const availability = getAvailabilityReport();
  const cohorts = PROGRESSION_COHORTS.flatMap((cohort) =>
    Object.entries(PLAY_STYLES).map(([styleId, style]) => ({
      cohort: cohort.id,
      style: styleId,
      ...estimateCohortProgress(cohort, style),
    })),
  );
  const longitudinal = PROGRESSION_COHORTS.flatMap((cohort) =>
    Object.entries(PLAY_STYLES).flatMap(([styleId, style]) =>
      PROGRESSION_HORIZONS_DAYS.map((days) => simulateLongitudinal(cohort, styleId, style, days)),
    ),
  );
  const curveBands = getLevelCurveBands();
  const jobRates = getJobRates();
  const jobDominance = getJobRewardDominance();
  const toolMetrics = buildToolMetrics();
  const forgeEconomics = buildForgeEconomics();
  const maxStatsPerDay = Math.max(...cohorts.map((row) => row.expectedJobStatsPerDay));
  const maxLongitudinalStats = Math.max(...longitudinal.map((row) => row.cumulativeJobStats));
  const maxJobValueCombatRatio = Math.max(...cohorts.map((row) => row.jobValueCombatRatio));
  return {
    availability,
    cohorts,
    longitudinal,
    curveBands,
    jobRates,
    jobDominance,
    toolMetrics,
    forgeEconomics,
    design: {
      targets: DESIGN_TARGETS,
      checks: {
        // P4/P5 en trabajos: si un solo empleo dominara XP, stelas y
        // entrenamiento a la vez, no existirían decisiones entre recompensas.
        jobSingleDominant: jobDominance.singleDominantJob !== null,
        // B1 (revisado): el valor laboral total (XP + equivalente del punto de
        // stat) no debe superar la XP de combate diaria del mismo perfil.
        jobValueWithinCombat: maxJobValueCombatRatio <= XP_RULES.jobMaxValueRatioOfCombat,
      },
    },
    warnings: {
      unreachableMaterials: availability.unreachable,
      blockedRequirements: availability.blockedRequirements,
      jobStatRateExceedsTarget: maxStatsPerDay > BALANCE_TARGETS.maxExpectedJobStatsPerDay,
      jobStatsDominated: maxLongitudinalStats >= 50,
      jobValueExceedsCombat: maxJobValueCombatRatio > XP_RULES.jobMaxValueRatioOfCombat,
    },
  };
}

module.exports = {
  getMaterialSources,
  getRequiredMaterials,
  getAvailabilityReport,
  getJobRates,
  getJobRewardDominance,
  getLevelCurveBands,
  buildToolMetrics,
  getRefineLadder,
  buildForgeEconomics,
  getMaterialsTable,
  getMaterialsTableMarkdown,
  getDailyRates,
  simulateLongitudinal,
  estimateCohortProgress,
  buildProgressionReport,
};
