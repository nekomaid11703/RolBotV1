// @ts-nocheck
/**
 * Ley R(L) (B8.2b) + identidad por eje de zona (P2).
 * Pruebas puras, sin DB.
 */

const {
  RARITY_BANDS,
  MATERIAL_AXES,
  rarityRatioForLevel,
  rarityBandProbabilities,
  MATERIAL_ROLLS_BY_DURATION,
} = require("../src/config/rarityDropConfig");
const {
  materialForBandAxis,
  resolveZoneAxisContext,
  chooseAxis,
  sampleBand,
} = require("../src/services/rpg/rarityDropService");

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
      const probabilities = rarityBandProbabilities({ toolLevel: level });
      const sum = Object.values(probabilities).reduce((acc, value) => acc + value, 0);
      expect(sum).toBeCloseTo(1, 5);
      const ratio = rarityRatioForLevel(level);
      for (let index = 1; index < RARITY_BANDS.length; index += 1) {
        expect(probabilities[RARITY_BANDS[index]]).toBeCloseTo(probabilities[RARITY_BANDS[index - 1]] / ratio, 5);
      }
    }
  });

  it('guarda "16:1 en L1": P(poco)/P(común) = 1/16', () => {
    const L1 = rarityBandProbabilities({ toolLevel: 1 });
    expect(L1.poco_comun / L1.comun).toBeCloseTo(1 / 16, 5);
  });

  it('guarda "~1 mítico/16 en L10": P(mítico) ≈ 1/16', () => {
    const L10 = rarityBandProbabilities({ toolLevel: 10 });
    expect(L10.mitico).toBeCloseTo(1 / 16, 2);
  });

  it("subir de herramienta aumenta la probabilidad de todas las rarezas superiores", () => {
    const pL1 = rarityBandProbabilities({ toolLevel: 1 });
    const pL10 = rarityBandProbabilities({ toolLevel: 10 });
    for (const band of ["poco_comun", "raro", "epico", "legendario", "mitico"]) {
      expect(pL10[band]).toBeGreaterThan(pL1[band]);
    }
  });
});

describe("Identidad por eje y material canónico", () => {
  it("el canon cubre las 24 combinaciones rareza × eje", () => {
    const rarities = ["comun", "poco_comun", "raro", "epico", "legendario", "mitico"];
    for (const rarity of rarities) {
      for (const axis of MATERIAL_AXES) {
        expect(materialForBandAxis(rarity, axis), `falta ${rarity}/${axis}`).toBeTruthy();
      }
    }
    expect(materialForBandAxis("comun", "flex")).toBe("madera");
    expect(materialForBandAxis("raro", "filo")).toBe("obsidiana");
    expect(materialForBandAxis("mitico", "cond")).toBe("fulgorita");
  });

  it("el contexto de zona filtra ejes por herramienta poseída y normaliza pesos", () => {
    const zone = { axisWeights: { filo: 1, flex: 1, cond: 1 } };
    const onlyPico = resolveZoneAxisContext(zone, { pico: { level: 2 } });
    expect(onlyPico.axes.map((entry) => entry.axis)).toEqual(["filo", "cond"]);
    expect(onlyPico.axes[0].toolLevel).toBe(2);
    expect(onlyPico.axes[0].probability).toBeCloseTo(0.5, 5);

    const noTools = resolveZoneAxisContext(zone, {});
    expect(noTools.axes).toEqual([]);
  });

  it("chooseAxis respeta las probabilidades (RNG inyectable)", () => {
    const context = {
      axes: [
        { axis: "filo", tool: "pico", toolLevel: 1, probability: 0.25 },
        { axis: "flex", tool: "hacha", toolLevel: 1, probability: 0.75 },
      ],
    };
    expect(chooseAxis(context, () => 0.1).axis).toBe("filo");
    expect(chooseAxis(context, () => 0.5).axis).toBe("flex");
    expect(chooseAxis(context, () => 0.999).axis).toBe("flex");
    expect(chooseAxis({ axes: [] }, () => 0.5)).toBeNull();
  });

  it("sampleBand elige según las probabilidades acumuladas", () => {
    const probabilities = { comun: 0.6, poco_comun: 0.4 };
    expect(sampleBand(probabilities, () => 0.1)).toBe("comun");
    expect(sampleBand(probabilities, () => 0.7)).toBe("poco_comun");
    expect(sampleBand(probabilities, () => 0.999)).toBe("poco_comun");
  });

  it("las tiradas de material dependen de la duración", () => {
    expect(MATERIAL_ROLLS_BY_DURATION.corta).toBe(2);
    expect(MATERIAL_ROLLS_BY_DURATION.media).toBe(3);
    expect(MATERIAL_ROLLS_BY_DURATION.larga).toBe(5);
  });
});
