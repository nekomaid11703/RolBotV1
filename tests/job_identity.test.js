// @ts-nocheck
/**
 * Identidad de trabajos (P2/Fase 1): pago por tier + trade-off hora/energía.
 * Ningún trabajo debe quedar dominado por otro del MISMO entrenamiento.
 */

const { JOBS, jobRequirementSum, wageMultiplierForJob } = require("../src/config/jobConfig");
const { MINIMUM_WAGE_PER_DAY } = require("../src/config/economyConfig");

function metrics(job) {
  const req = jobRequirementSum(job);
  const perEnergy = job.stelasReward / job.energyCost;
  const perHour = (job.stelasReward / job.durationMinutes) * 60;
  const perDay = Math.floor(100 / job.energyCost) * job.stelasReward;
  return { id: job.id, stat: job.statTrained, req, perEnergy, perHour, perDay };
}

describe("Identidad de trabajos — Fase 1", () => {
  const rows = Object.values(JOBS).map(metrics);

  it("el salario mínimo diario se mantiene (≥720 por 100 de energía)", () => {
    expect(Math.min(...rows.map((r) => r.perDay))).toBeGreaterThanOrEqual(MINIMUM_WAGE_PER_DAY);
  });

  it("ningún trabajo del mismo entrenamiento está dominado en pago por hora y energía", () => {
    const dominated = [];
    for (const job of rows) {
      const better = rows.find(
        (other) =>
          other.id !== job.id &&
          other.stat === job.stat &&
          other.perEnergy >= job.perEnergy &&
          other.perHour >= job.perHour &&
          other.req <= job.req &&
          (other.perEnergy > job.perEnergy || other.perHour > job.perHour),
      );
      if (better) dominated.push(`${job.id}←${better.id}`);
    }
    expect(dominated).toEqual([]);
  });

  it("existe trade-off real hora vs energía entre trabajos", () => {
    const hasTradeoff = rows.some((a) =>
      rows.some((b) => a.id !== b.id && a.perEnergy > b.perEnergy && a.perHour < b.perHour),
    );
    expect(hasTradeoff).toBe(true);
  });

  it("los trabajos mejor pagados exigen más requisitos y rinden más por energía", () => {
    const byReq = [...rows].sort((a, b) => a.req - b.req);
    expect(byReq[byReq.length - 1].perEnergy).toBeGreaterThan(byReq[0].perEnergy);
    const spread = Math.max(...rows.map((r) => r.perDay)) / Math.min(...rows.map((r) => r.perDay));
    expect(spread).toBeGreaterThanOrEqual(1.5);
  });

  it("todos pagan al menos el salario mínimo por energía", () => {
    for (const job of Object.values(JOBS)) {
      expect(wageMultiplierForJob(job)).toBeGreaterThanOrEqual(1);
    }
  });
});
