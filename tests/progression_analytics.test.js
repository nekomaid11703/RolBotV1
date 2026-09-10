const {
  getAvailabilityReport,
  buildProgressionReport,
  buildMaterialAnchors,
  buildEconomyReport,
  buildBuildPowerReport,
} = require("../src/services/rpg/progressionAnalyticsService");
const { JOB_TRAINING } = require("../src/config/progressionBalance");

describe("progression analytics", () => {
  it("todos los materiales requeridos tienen fuente por eje/zona", () => {
    const report = getAvailabilityReport();
    expect(report.blockedRequirements).toEqual([]);
    expect(report.unreachable).toEqual([]);
  });

  it("mide cohortes de nivel bajo, medio y alto sin exceder el objetivo de stats por trabajo", () => {
    const report = buildProgressionReport();
    expect(report.cohorts.map((row) => row.level)).toEqual(expect.arrayContaining([100, 300, 500]));
    for (const row of report.cohorts) {
      expect(row.expectedJobStatsPerDay).toBeLessThanOrEqual(JOB_TRAINING.weeklyCapPerStat / 7);
    }
    expect(report.warnings.jobStatRateExceedsTarget).toBe(false);
  });

  it("proyecta niveles y stats por trabajo acotadas por el tope semanal en horizontes largos", () => {
    const report = buildProgressionReport();
    const horizon = report.longitudinal.filter(
      (row) => row.cohort === "endgame" && row.style === "dedicated" && row.days === 30,
    );
    expect(horizon).toHaveLength(1);
    expect(horizon[0].levelsGained).toBeGreaterThan(0);
    expect(horizon[0].cumulativeJobStats).toBeLessThan(10);
    expect(report.warnings.jobStatsDominated).toBe(false);
  });

  it("incluye el valor del punto de stat en el valor laboral y no supera el combate del mismo perfil", () => {
    const report = buildProgressionReport();
    for (const row of report.cohorts) {
      expect(row.jobStatEquivalentXpPerDay).toBeGreaterThan(0);
      expect(row.jobValuePerDay).toBe(row.jobXpPerDay + row.jobStatEquivalentXpPerDay);
      expect(row.jobValueCombatRatio).toBeLessThanOrEqual(1);
    }
    expect(report.design.checks.jobValueWithinCombat).toBe(true);
    expect(report.warnings.jobValueExceedsCombat).toBe(false);
  });

  it("ancla cada rareza a un nivel de equilibrio y a su tiempo de progresión (cap ~90 días)", () => {
    const { anchors } = buildMaterialAnchors();
    expect(anchors.map((row) => row.rarity)).toEqual(["comun", "poco_comun", "raro", "epico", "legendario", "mitico"]);
    for (let i = 1; i < anchors.length; i += 1) {
      expect(anchors[i].equilibriumLevel).toBeGreaterThanOrEqual(anchors[i - 1].equilibriumLevel);
      expect(anchors[i].minutesToReach).toBeGreaterThanOrEqual(anchors[i - 1].minutesToReach);
    }
    const cap = anchors.find((row) => row.rarity === "mitico");
    expect(cap.equilibriumLevel).toBe(500);
    expect(cap.minutesToReach).toBeGreaterThan(9000);
    expect(cap.minutesToReach).toBeLessThan(13000);
  });

  it("el ingreso diario crece con la progresión vía herramientas/materiales", () => {
    const economy = buildEconomyReport();
    expect(economy.cohorts).toHaveLength(6);
    expect(economy.checks.incomeGrowsWithProgression).toBe(true);
    expect(economy.checks.materialIncomeScalesWithTool).toBe(true);
    for (const row of economy.cohorts) {
      expect(row.totalIncomePerDay).toBeGreaterThan(0);
      expect(row.gearCost).toBeGreaterThan(0);
      expect(row.daysToGear).toBeGreaterThan(0);
    }
  });

  it("B6: al menos 3 estilos de build viables por cohorte (P5)", () => {
    const power = buildBuildPowerReport();
    expect(power.checks.viableStylesPerCohort).toBe(true);
    expect(power.cohorts).toHaveLength(6);
    for (const row of power.cohorts) {
      expect(row.builds).toHaveLength(4);
      expect(row.viableStyles).toBeGreaterThanOrEqual(3);
      expect(row.bestScore).toBeGreaterThan(0);
    }
  });
});
