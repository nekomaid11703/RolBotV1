const { computeJobTraining } = require("../src/services/rpg/jobTrainingService");
const { trainingPointsForJob } = require("../src/config/jobConfig");
const { JOB_TRAINING } = require("../src/config/progressionBalance");

describe("job training acumulado (B2)", () => {
  it("acumula puntos sin conceder +1 hasta cruzar el umbral", () => {
    const r = computeJobTraining({ points: 10, currentPoints: 0, weekGains: 0, weekKey: "2026-W36", statValue: 5 });
    expect(r.statIncreased).toBe(false);
    expect(r.pointsRemaining).toBe(10);
    expect(r.statValue).toBe(5);
  });

  it("convierte exactamente al cruzar el umbral sin regalar fracciones", () => {
    const r = computeJobTraining({
      points: 14,
      currentPoints: JOB_TRAINING.pointsPerStatPoint - 14,
      weekGains: 0,
      trainingWeek: "2026-W36",
      weekKey: "2026-W36",
      statValue: 7,
    });
    expect(r.statIncreased).toBe(true);
    expect(r.pointsRemaining).toBe(0);
    expect(r.statValue).toBe(8);
  });

  it("respeta el tope semanal por atributo", () => {
    let r = computeJobTraining({
      points: JOB_TRAINING.pointsPerStatPoint * 3,
      currentPoints: 0,
      weekGains: 0,
      weekKey: "2026-W36",
      statValue: 1,
    });
    expect(r.statIncreased).toBe(true);
    expect(r.weekGains).toBe(JOB_TRAINING.weeklyCapPerStat);
    expect(r.statValue).toBe(1 + JOB_TRAINING.weeklyCapPerStat);
    expect(r.pointsRemaining).toBeGreaterThan(0);
  });

  it("reinicia la cuenta cuando cambia la semana", () => {
    const r = computeJobTraining({
      points: 5,
      currentPoints: JOB_TRAINING.pointsPerStatPoint,
      weekGains: JOB_TRAINING.weeklyCapPerStat,
      trainingWeek: "2026-W35",
      weekKey: "2026-W36",
      statValue: 9,
    });
    expect(r.weekGains).toBe(0);
    expect(r.pointsRemaining).toBe(5);
    expect(r.statValue).toBe(9);
  });

  it("no acumula puntos cuando la estadística está al tope", () => {
    const r = computeJobTraining({
      points: 10,
      currentPoints: 0,
      weekGains: 0,
      weekKey: "2026-W36",
      statValue: 100,
      statCap: 100,
    });
    expect(r.statIncreased).toBe(false);
    expect(r.statValue).toBe(100);
    expect(r.pointsRemaining).toBe(0);
  });
});

describe("trainingPointsForJob", () => {
  it("escala los puntos con la duración del trabajo", () => {
    expect(trainingPointsForJob({ durationMinutes: 15 })).toBeGreaterThanOrEqual(2);
    expect(trainingPointsForJob({ durationMinutes: 40 })).toBeGreaterThan(
      trainingPointsForJob({ durationMinutes: 15 }),
    );
  });
});
