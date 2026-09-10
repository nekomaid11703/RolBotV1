// @ts-nocheck
const { MATERIALS } = require("../../data/materialData");
const { getItem } = require("../../data/items");
const { EXPEDITION_ZONES } = require("../../config/expeditionConfig");
const { SHOPS } = require("../../config/shopConfig");
const { JOBS, trainingPointsForJob } = require("../../config/jobConfig");
const { TOOL_UPGRADE_COSTS, TOOLS } = require("../../config/toolsConfig");
const { TIERS } = require("../../config/tierConfig");
const { xpForNextLevel, LEVEL_INITIAL, LEVEL_MAX } = require("../../config/characterConfig");
const {
  MATERIAL_ROLLS_BY_DURATION,
  rarityBandProbabilities,
  rarityRatioForLevel,
  DROP_QTY_BY_RARITY,
  AXIS_TOOL,
} = require("../../config/rarityDropConfig");
const { calculateXpReward } = require("./combatEngine");
const { materialForBandAxis } = require("./rarityDropService");
const { jobXpForLevel, expeditionXpForLevel } = require("./xpRewardService");
const {
  PROGRESSION_COHORTS,
  PLAY_STYLES,
  BALANCE_TARGETS,
  PROGRESSION_HORIZONS_DAYS,
  JOB_TRAINING,
  DESIGN_TARGETS,
  MATERIAL_LEVEL_ANCHOR,
  ANCHOR_POLICY,
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

/**
 * Zonas que aportan un eje (multiplicador > 0).
 * @param {string} axis
 * @returns {Array<{zone: object, weight: number}>}
 */
function zonesForAxis(axis) {
  const result = [];
  for (const zone of Object.values(EXPEDITION_ZONES)) {
    const weight = Number(zone.axisWeights?.[axis]) || 0;
    if (weight > 0) result.push({ zone, weight });
  }
  return result;
}

function getMaterialSources() {
  const sources = Object.fromEntries(
    Object.keys(MATERIALS)
      .filter((id) => id !== "etereo")
      .map((id) => [id, []]),
  );

  for (const [materialId, material] of Object.entries(MATERIALS)) {
    if (materialId === "etereo") continue;
    for (const { zone, weight } of zonesForAxis(material.archetype)) {
      sources[materialId].push({
        type: "expedition",
        id: zone.id,
        toolReq: AXIS_TOOL[material.archetype] || "?",
        axis: material.archetype,
        weight,
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

function averageBandQty(rarity) {
  const [min, max] = DROP_QTY_BY_RARITY[rarity] || [1, 1];
  return (min + max) / 2;
}

function zoneToolExpectedValue(zone, toolId, toolLevel) {
  if (!zone) return 0;
  const weights = zone.axisWeights || {};
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + Math.max(0, Number(weight) || 0), 0);

  // Valor esperado de materiales cuyo eje recolecta esta herramienta.
  let materialValue = 0;
  if (totalWeight > 0) {
    const bandProbabilities = rarityBandProbabilities({ toolLevel });
    const rolls = MATERIAL_ROLLS_BY_DURATION.corta || 2;
    let perRollValue = 0;
    for (const [axis, weight] of Object.entries(weights)) {
      if (AXIS_TOOL[axis] !== toolId) continue;
      const axisProbability = Math.max(0, Number(weight) || 0) / totalWeight;
      if (axisProbability <= 0) continue;
      for (const [rarity, bandProbability] of Object.entries(bandProbabilities)) {
        const materialId = materialForBandAxis(rarity, axis);
        if (!materialId) continue;
        const value = averageBandQty(rarity) * materialPrice(`trozo_de_${materialId}`);
        perRollValue += axisProbability * bandProbability * value;
      }
    }
    materialValue = perRollValue * rolls;
  }

  // Drops planos no-material (pescado/hierbas): chance = weight/100, durMult corta = 1
  let flatValue = 0;
  for (const loot of zone.lootTable || []) {
    if (loot.toolReq !== toolId) continue;
    if ((loot.minToolLevel || 1) > toolLevel) continue;
    const avgQty = ((Number(loot.minQty) || 0) + (Number(loot.maxQty) || 0)) / 2;
    flatValue += (loot.weight / 100) * avgQty * materialPrice(loot.itemId);
  }

  return materialValue + flatValue;
}

function zoneForTool(toolId) {
  const candidates = Object.values(EXPEDITION_ZONES).filter((zone) => {
    const inAxes = Object.entries(zone.axisWeights || {}).some(
      ([axis, weight]) => AXIS_TOOL[axis] === toolId && Number(weight) > 0,
    );
    const inFlat = (zone.lootTable || []).some((entry) => entry.toolReq === toolId);
    return inAxes || inFlat;
  });
  if (candidates.length === 0) return null;
  // Preferir zonas donde subir de nivel se traduce en más valor (crecimiento L1→L10).
  const score = (zone) => zoneToolExpectedValue(zone, toolId, 10) - zoneToolExpectedValue(zone, toolId, 1);
  return candidates.reduce((best, zone) => {
    const bestScore = score(best);
    const zoneScore = score(zone);
    return zoneScore > bestScore ||
      (zoneScore === bestScore && zoneToolExpectedValue(zone, toolId, 10) > zoneToolExpectedValue(best, toolId, 10))
      ? zone
      : best;
  });
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
  const material = MATERIALS[materialId];
  if (!material) return null;
  const axis = material.archetype;
  const tool = AXIS_TOOL[axis] || "?";
  const toolLevel = Math.max(1, Number(CRAFTING_POLICY.acquisitionToolLevel) || 1);
  const rolls = MATERIAL_ROLLS_BY_DURATION.corta || 2;
  const bandProbability = rarityBandProbabilities({ toolLevel })[material.rarity] || 0;
  const avgQty = averageBandQty(material.rarity);
  const round2 = (value) => Math.round(value * 100) / 100;

  let best = null;
  for (const zone of Object.values(EXPEDITION_ZONES)) {
    const weight = Math.max(0, Number(zone.axisWeights?.[axis]) || 0);
    if (weight <= 0) continue;
    const totalWeight = Object.values(zone.axisWeights || {}).reduce(
      (sum, value) => sum + Math.max(0, Number(value) || 0),
      0,
    );
    if (totalWeight <= 0) continue;

    const unitsPerRun = rolls * (weight / totalWeight) * bandProbability * avgQty;
    if (unitsPerRun <= 0) continue;

    const energyPerRun = zone.energyCosts?.corta || 15;
    const runsPerDay = Math.max(1, Math.floor(100 / energyPerRun));
    if (!best || unitsPerRun > best.unitsPerRun) {
      best = {
        zone: zone.id,
        tool,
        toolLevel,
        unitsPerRun: round2(unitsPerRun),
        runsPerDay,
        unitsPerDay: round2(unitsPerRun * runsPerDay),
      };
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
    if (source.type === "expedition") return `Exp. ${source.id} (${source.toolReq}; ${source.axis})`;
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

/**
 * Anclajes material ↔ nivel (B5/B6): a qué nivel de equilibrio pertenece cada
 * rareza y cuántos días/minutos de juego (2 h/día regular) cuesta alcanzarlo.
 * @returns {{policy: object, anchors: Array<object>}}
 */
function buildMaterialAnchors() {
  const policy = ANCHOR_POLICY;
  const anchors = Object.entries(MATERIAL_LEVEL_ANCHOR).map(([rarity, targetLevel]) => {
    let level = LEVEL_INITIAL;
    let days = 0;
    let guard = 0;
    while (level < targetLevel && guard < LEVEL_MAX * 2) {
      const need = xpForNextLevel(level);
      const perDay =
        policy.referenceCombatsPerDay * calculateXpReward(level, true) +
        policy.referenceExpeditionsPerDay * expeditionXpForLevel(level, policy.referenceExpeditionXpWeight);
      if (perDay <= 0) break;
      days += need / perDay;
      level += 1;
      guard += 1;
    }
    const roundedDays = Math.round(days * 10) / 10;
    return {
      rarity,
      equilibriumLevel: targetLevel,
      daysToReach: roundedDays,
      minutesToReach: Math.round(roundedDays * policy.sessionMinutesPerDay),
    };
  });
  return { policy, anchors };
}

/**
 * Guardas de la ley de obtención R(L) (B8.2b): "16:1 en L1" y "~1 mítico/16 en L10".
 * @returns {object}
 */
function buildRarityChecks() {
  const l1 = rarityBandProbabilities({ toolLevel: 1, floorRarity: "comun" });
  const l10 = rarityBandProbabilities({ toolLevel: 10, floorRarity: "comun" });
  const l1PocoOverComun = (l1.poco_comun || 0) / (l1.comun || 1);
  const tolerance = 0.01;
  return {
    rL1: Math.round(rarityRatioForLevel(1) * 100) / 100,
    rL10: Math.round(rarityRatioForLevel(10) * 100) / 100,
    bands: { L1: l1, L10: l10 },
    checks: {
      l1SixteenToOne: Math.abs(l1PocoOverComun - 1 / 16) < tolerance,
      l10MythicSixteenToOne: Math.abs((l10.mitico || 0) - 0.0625) < tolerance,
    },
  };
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
  const rarityDrop = buildRarityChecks();
  const materialAnchors = buildMaterialAnchors();
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
    rarityDrop,
    materialAnchors,
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
  buildRarityChecks,
  buildMaterialAnchors,
  getDailyRates,
  simulateLongitudinal,
  estimateCohortProgress,
  buildProgressionReport,
};
