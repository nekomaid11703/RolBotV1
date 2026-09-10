// @ts-nocheck
/**
 * Guardas de la ley de obtención universal R(L) (B8.2b).
 * Pruebas puras sobre la curva (sin DB) y sobre las primitivas de muestreo.
 */

const {
  RARITY_BANDS,
  rarityRatioForLevel,
  rarityBandProbabilities,
  MATERIAL_ROLLS_BY_DURATION,
} = require("../src/config/rarityDropConfig");
const { resolveZoneMaterialContext, sampleBand, weightedEntry } = require("../src/services/rpg/rarityDropService");
const { EXPEDITION_ZONES } = require("../src/config/expeditionConfig");

describe("Ley R(L) — curva geométrica de rareza", () => {
  it("R(1)=16 y R(10)=1.39, con suavizado monótono decreciente", () => {
    expect(rarityRatioForLevel(1)).toBeCloseTo(16, 5);
    expect(rarityRatioForLevel(10)).toBeCloseTo(1.39, 2);
    for (let level = 2; level <= 10; level += 1) {
      expect(rarityRatioForLevel(level)).toBeLessThan(rarityRatioForLevel(level - 1));
    }
  });

  it("las probabilidades por banda suman 1 y respetan P(i+1)=P(i)/R(L)", () => {
    for (const level of [1, 5, 10]) {
      const probabilities = rarityBandProbabilities({ toolLevel: level, floorRarity: "comun" });
      const sum = Object.values(probabilities).reduce((acc, value) => acc + value, 0);
      expect(sum).toBeCloseTo(1, 5);
      const ratio = rarityRatioForLevel(level);
      for (let index = 1; index < RARITY_BANDS.length; index += 1) {
        expect(probabilities[RARITY_BANDS[index]]).toBeCloseTo(probabilities[RARITY_BANDS[index - 1]] / ratio, 5);
      }
    }
  });

  it('guarda "16:1 en L1": P(poco)/P(común) = 1/16', () => {
    const L1 = rarityBandProbabilities({ toolLevel: 1, floorRarity: "comun" });
    expect(L1.poco_comun / L1.comun).toBeCloseTo(1 / 16, 5);
  });

  it('guarda "~1 mítico/16 en L10": P(mítico) ≈ 1/16', () => {
    const L10 = rarityBandProbabilities({ toolLevel: 10, floorRarity: "comun" });
    expect(L10.mitico).toBeCloseTo(1 / 16, 2);
  });

  it("subir de herramienta aumenta la probabilidad de la rareza siguiente", () => {
    const minas = EXPEDITION_ZONES.minas;
    const bands = Object.keys(minas.rarityPool);
    const pL1 = rarityBandProbabilities({ toolLevel: 1, floorRarity: minas.floorRarity, accessibleBands: bands });
    const pL10 = rarityBandProbabilities({ toolLevel: 10, floorRarity: minas.floorRarity, accessibleBands: bands });
    expect(pL10.poco_comun).toBeGreaterThan(pL1.poco_comun);
    expect(pL1.poco_comun / pL1.comun).toBeCloseTo(1 / 16, 4);
  });
});

describe("Muestreo de rareza y material", () => {
  it("el piso de la zona excluye bandas inferiores y renomaliza", () => {
    const zone = {
      floorRarity: "raro",
      rarityPool: {
        comun: [{ itemId: "a", weight: 1, toolReq: "pico" }],
        poco_comun: [{ itemId: "b", weight: 1, toolReq: "pico" }],
        raro: [{ itemId: "c", weight: 1, toolReq: "pico" }],
      },
    };
    const context = resolveZoneMaterialContext(zone, { pico: { level: 5 } });
    expect(context).not.toBeNull();
    expect(context.bandKeys).toEqual(["raro"]);
    expect(context.toolLevel).toBe(5);
  });

  it("sampleBand elige según las probabilidades acumuladas", () => {
    const probabilities = { comun: 0.6, poco_comun: 0.4 };
    expect(sampleBand(probabilities, () => 0.1)).toBe("comun");
    expect(sampleBand(probabilities, () => 0.7)).toBe("poco_comun");
    expect(sampleBand(probabilities, () => 0.999)).toBe("poco_comun");
  });

  it("weightedEntry pondera por weight", () => {
    const entries = [
      { itemId: "comun", weight: 1 },
      { itemId: "raro", weight: 3 },
    ];
    expect(weightedEntry(entries, () => 0.1).itemId).toBe("comun");
    expect(weightedEntry(entries, () => 0.5).itemId).toBe("raro");
  });

  it("las tiradas de material dependen de la duración", () => {
    expect(MATERIAL_ROLLS_BY_DURATION.corta).toBe(2);
    expect(MATERIAL_ROLLS_BY_DURATION.media).toBe(3);
    expect(MATERIAL_ROLLS_BY_DURATION.larga).toBe(5);
  });
});
