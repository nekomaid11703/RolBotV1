const {
  LEVEL_INITIAL,
  LEVEL_MAX,
  clampLevel,
  calculateLevel,
  xpForNextLevel,
} = require("../src/config/characterConfig");
const { calculateXpReward } = require("../src/services/rpg/combatEngine");
const { getLevelCurveBands } = require("../src/services/rpg/progressionAnalyticsService");

describe("B5 — clampLevel (política nivel ≤ 500)", () => {
  it("mantiene niveles dentro de [100, 500]", () => {
    expect(clampLevel(100)).toBe(100);
    expect(clampLevel(250)).toBe(250);
    expect(clampLevel(500)).toBe(500);
    expect(clampLevel(600)).toBe(500);
    expect(clampLevel(1)).toBe(100);
    expect(clampLevel(NaN)).toBe(100);
  });

  it("redondea hacia abajo", () => {
    expect(clampLevel(150.9)).toBe(150);
  });

  it("calculateLevel nunca supera LEVEL_MAX aunque la suma de atributos crezca", () => {
    const fullStats = {
      hp: 100,
      atk: 100,
      def: 100,
      aspd: 100,
      ref: 100,
      mspd: 100,
      fulgor: 100,
      d_fulgor: 100,
      r_fulgor: 100,
    };
    expect(calculateLevel(fullStats)).toBe(500);
    expect(LEVEL_MAX).toBe(500);
  });
});

describe("B5 — equivalencia de coste de atributo por banda", () => {
  it("un punto de atributo en nivel 100 equivale a 1 victoria igual", () => {
    expect(xpForNextLevel(100)).toBe(5100);
    expect(calculateXpReward(100, true)).toBe(5100);
  });

  it("la curva crece de forma monótona y el coste por punto aumenta en el endgame", () => {
    expect(xpForNextLevel(300)).toBeGreaterThan(xpForNextLevel(200));
    expect(xpForNextLevel(500)).toBeGreaterThan(xpForNextLevel(300));
  });

  it("el reporte de bandas refleja el coste creciente por punto", () => {
    const bands = getLevelCurveBands();
    expect(bands).toHaveLength(5);
    expect(bands[0]).toMatchObject({ from: 100, to: 199 });
    expect(bands[0].winsPerStatPointAtStart).toBeCloseTo(1, 5);
    expect(bands[4].winsPerStatPointAtEnd).toBeGreaterThan(4);
    // La banda 500-500 no tiene transiciones internas (tope); las demás crecen.
    for (let i = 1; i < bands.length - 1; i += 1) {
      expect(bands[i].bandTotalXp).toBeGreaterThan(bands[i - 1].bandTotalXp);
    }
    expect(bands[4].bandTotalXp).toBe(0);
  });
});
