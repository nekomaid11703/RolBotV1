const { combatVictoryXp, jobXpForLevel, expeditionXpForLevel } = require("../src/services/rpg/xpRewardService");
const { XP_RULES } = require("../src/config/progressionBalance");
const { calculateXpReward } = require("../src/services/rpg/combatEngine");

describe("B1 — prima de riesgo en combate (P1)", () => {
  it("el PvE igual paga la XP base sin prima", () => {
    expect(combatVictoryXp({ winnerLevel: 100, loserLevel: 100, isPvE: true })).toBe(calculateXpReward(100, true));
  });

  it("el PvP igual aplica la prima mínima de riesgo", () => {
    expect(combatVictoryXp({ winnerLevel: 100, loserLevel: 100, isPvE: false })).toBe(
      Math.floor(calculateXpReward(100, true) * XP_RULES.pvpRiskPremium),
    );
  });

  it("vencer a un rival de nivel superior suma bonus por hueco", () => {
    const xp = combatVictoryXp({ winnerLevel: 100, loserLevel: 200, isPvE: false });
    const base = Math.floor(calculateXpReward(200, true) * XP_RULES.pvpRiskPremium);
    expect(xp).toBe(base * 2);
  });

  it("el multiplicador total queda acotado por maxRiskMultiplier", () => {
    const xp = combatVictoryXp({ winnerLevel: 100, loserLevel: 500, isPvE: false });
    const base = Math.floor(calculateXpReward(500, true) * XP_RULES.pvpRiskPremium);
    expect(xp).toBe(base * XP_RULES.maxRiskMultiplier);
  });
});

describe("B1 — XP de actividades por tramo de nivel", () => {
  it("los trabajos escalan con el nivel del personaje", () => {
    expect(jobXpForLevel(200, 35)).toBeGreaterThan(jobXpForLevel(100, 35));
    expect(jobXpForLevel(500, 110)).toBeGreaterThan(jobXpForLevel(100, 110));
  });

  it("una jornada de trabajo no supera el 15% de una victoria del mismo nivel", () => {
    for (const level of [100, 200, 300, 400, 500]) {
      const bestJobWeight = 110;
      expect(jobXpForLevel(level, bestJobWeight)).toBeLessThanOrEqual(0.15 * calculateXpReward(level, true));
    }
  });

  it("las expediciones escalan con la duración y el nivel", () => {
    expect(expeditionXpForLevel(100, 40)).toBeGreaterThan(1);
    expect(expeditionXpForLevel(300, 275)).toBeGreaterThan(expeditionXpForLevel(300, 40));
  });
});
