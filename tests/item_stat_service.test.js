// @ts-nocheck
/**
 * itemStatService unit tests: fórmula base × tier × material.
 */

const { createItemDefinition } = require("../src/services/rpg/itemFactory");
const {
  getWeaponStats,
  getArmorStats,
  getArtifactStats,
  getMaterialCost,
} = require("../src/services/rpg/itemStatService");

describe("getWeaponStats — base × tier × material", () => {
  it("Aplica el multiplicador de tier al daño base", () => {
    const base = getWeaponStats(createItemDefinition({ id: "esp", type: "weapon", material: "madera", tier: "E" }));
    const alto = getWeaponStats(createItemDefinition({ id: "esp", type: "weapon", material: "madera", tier: "N" }));
    expect(base.baseDamage).toBeGreaterThan(0);
    expect(alto.baseDamage).toBeGreaterThan(base.baseDamage);
  });

  it("El material con mayor afilabilidad produce más daño al mismo tier", () => {
    const madera = getWeaponStats(createItemDefinition({ id: "a", type: "weapon", material: "madera", tier: "B" }));
    const acero = getWeaponStats(createItemDefinition({ id: "b", type: "weapon", material: "acero", tier: "B" }));
    expect(acero.baseDamage).toBeGreaterThanOrEqual(madera.baseDamage);
  });

  it("Conserva naturaleza de daño, manos y tier normalizado", () => {
    const stats = getWeaponStats(
      createItemDefinition({
        id: "lanza",
        type: "weapon",
        material: "hierro",
        tier: "B",
        modules: { weapon: { damageNature: "perforante", hands: 2 } },
      }),
    );
    expect(stats.damageNature).toBe("perforante");
    expect(stats.hands).toBe(2);
    expect(stats.tier).toBe("B");
  });
});

describe("getArmorStats", () => {
  it("Deriva maxResist y bonusDef de la resistencia del material × tier", () => {
    const stats = getArmorStats(createItemDefinition({ id: "pech", type: "armor", material: "titanio", tier: "A" }));
    expect(stats.maxResist).toBeGreaterThan(0);
    expect(stats.bonusDef).toBeGreaterThan(0);
    expect(stats.coverage).toBe("media");
    expect(stats.slot).toBe("pecho");
  });
});

describe("getArtifactStats", () => {
  it("Devuelve buffs y efectos configurados", () => {
    const stats = getArtifactStats(
      createItemDefinition({
        id: "amuleto",
        type: "artifact",
        modules: { buff: { stats: { atk: 5 }, effects: ["+10 ASPD"] } },
      }),
    );
    expect(stats.buffs).toEqual({ atk: 5 });
    expect(stats.effects).toContain("+10 ASPD");
  });
});

describe("getMaterialCost", () => {
  it("Usa basePrice cuando existe y es positivo", () => {
    const cost = getMaterialCost(createItemDefinition({ id: "x", type: "weapon", basePrice: 500 }));
    expect(cost.baseCost).toBe(500);
  });

  it("Calcula un coste por defecto según rareza y tier", () => {
    const comun = getMaterialCost(createItemDefinition({ id: "x", type: "weapon", rarity: "comun", tier: "E" }));
    const raro = getMaterialCost(createItemDefinition({ id: "y", type: "weapon", rarity: "epico", tier: "A" }));
    expect(comun.baseCost).toBeGreaterThan(0);
    expect(raro.baseCost).toBeGreaterThan(comun.baseCost);
  });
});
