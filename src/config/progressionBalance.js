const PROGRESSION_COHORTS = [
  { id: "entry", level: 100, equipment: "none", toolLevel: 1 },
  { id: "early", level: 150, equipment: "starter", toolLevel: 3 },
  { id: "mid", level: 200, equipment: "range", toolLevel: 5 },
  { id: "late", level: 300, equipment: "optimized", toolLevel: 7 },
  { id: "endgame", level: 400, equipment: "complete", toolLevel: 9 },
  { id: "cap", level: 500, equipment: "complete", toolLevel: 10 },
];

const PLAY_STYLES = {
  casual: { dailyEnergy: 40, combatsPerDay: 1 },
  regular: { dailyEnergy: 70, combatsPerDay: 3 },
  dedicated: { dailyEnergy: 100, combatsPerDay: 6 },
};

const BALANCE_TARGETS = {
  maxExpectedJobStatsPerDay: 0.25,
  maxExpectedJobStatsPerWeek: 1,
  requiredMaterialSources: 1,
};

const JOB_TRAINING = {
  pointsPerStatPoint: 24,
  weeklyCapPerStat: 1,
};

/**
 * Reglas de XP por tramo (B1). Las actividades no-combate expresan su XP como
 * fracción del requisito del nivel actual; el PvP añade prima de riesgo (P1).
 */
const XP_RULES = {
  pvpRiskPremium: 1.25,
  levelGapPremiumScale: 1,
  maxRiskMultiplier: 3,
  jobShareBase: 0.01,
  jobShareReference: 35,
  expeditionShareBase: 0.04,
  expeditionShareReference: 110,
  // B1 (revisado): el valor de una jornada laboral incluye el equivalente XP de
  // su entrenamiento de atributo (1 punto = xpForNextLevel según B5). El total
  // no debe superar la XP de combate diaria del mismo perfil (sin riesgo).
  jobMaxValueRatioOfCombat: 1,
};

/**
 * Restricciones de diseño aprobadas (P1-P5). Son objetivos medibles, no
 * implementaciones; cada trozo Bn declara cuáles satisface y cómo las mide.
 */
const DESIGN_TARGETS = {
  // P1: el tiempo no debe ser la única moneda. El XP debe incluir prima por
  // riesgo o maestría frente al resultado de menor esfuerzo (mínimo 1.25x).
  minRiskXpPremium: 1.25,
  // P2: momentos de reconocimiento (logros visibles) por semana objetivo.
  minAchievementMomentsPerWeek: 2,
  // P3: momentos de sorpresa/recompensa memorable por semana objetivo.
  minSurpriseMomentsPerWeek: 3,
  // P4: solapamiento máximo de recompensas entre vías distintas.
  maxRewardOverlapBetweenPaths: 0.35,
  // P5: mínimo de estilos/builds viables por cohorte de nivel.
  minViableStylesPerCohort: 3,
};

const PROGRESSION_HORIZONS_DAYS = [1, 7, 30, 90, 180];

const TOOL_POLICY = {
  paybackExpeditionsLimit: 10,
  incomeStyle: "regular",
};

/**
 * Política de forja/refinamiento (B7). El refinado debe seguir siendo una vía
 * competitiva frente a la compra directa: el análisis del reporte compara
 * tiempo de forja vs tiempo de compra por tier y lo expone por material.
 */
const CRAFTING_POLICY = {
  acquisitionToolLevel: 5,
  sampleRecipeCost: 2, // equivalente de la receta "espada" (materialCost 2)
};

module.exports = {
  PROGRESSION_COHORTS,
  PLAY_STYLES,
  BALANCE_TARGETS,
  PROGRESSION_HORIZONS_DAYS,
  JOB_TRAINING,
  DESIGN_TARGETS,
  XP_RULES,
  TOOL_POLICY,
  CRAFTING_POLICY,
};
