// @ts-nocheck
/**
 * armorSetService unit tests: cobertura de armadura y bonos de set.
 */

const {
  getCoverage,
  getMovementFatigueWithCoverage,
  countSetPieces,
  resolveSetBonuses,
  SET_BONUS_THRESHOLD,
} = require("../src/services/rpg/armorSetService");

describe("getCoverage", () => {
  it("Sin armadura retorna cobertura 'ninguna' sin penalización", () => {
    const effect = getCoverage([]);
    expect(effect.coverage).toBe("ninguna");
    expect(effect.mspdPenalty).toBe(0);
  });

  it("Usa la pieza más pesada (mayor penalización MSPD)", () => {
    const effect = getCoverage([
      { coverage: "ligera" },
      { coverage: "total" },
    ]);
    expect(effect.coverage).toBe("total");
    expect(effect.mspdPenalty).toBe(0.4);
  });
});

describe("getMovementFatigueWithCoverage", () => {
  it("Multiplica la fatiga de movimiento por la cobertura", () => {
    const sinArm = getMovementFatigueWithCoverage(10, []);
    const conTotal = getMovementFatigueWithCoverage(10, [{ coverage: "total" }]);
    expect(conTotal).toBeGreaterThan(sinArm);
  });
});

describe("countSetPieces / resolveSetBonuses", () => {
  it("Cuenta piezas por setId", () => {
    const counts = countSetPieces([
      { setId: "armadura_caballero" },
      { setId: "armadura_caballero" },
      { setId: "otro" },
    ]);
    expect(counts.armadura_caballero).toBe(2);
  });

  it("Activa el bono al tener ≥3 piezas del mismo set", () => {
    const parts = [
      { setId: "guardian", coverage: "alta" },
      { setId: "guardian", coverage: "alta" },
      { setId: "guardian", coverage: "alta" },
    ];
    const sets = { guardian: { bonus: { def: 20 } } };
    const result = resolveSetBonuses(parts, sets);
    expect(result[0].count).toBe(3);
    expect(result[0].active).toBe(true);
    expect(result[0].bonus).toEqual({ def: 20 });
  });

  it("No activa el bono con 2 piezas", () => {
    const parts = [
      { setId: "guardian" },
      { setId: "guardian" },
    ];
    const result = resolveSetBonuses(parts, { guardian: { bonus: { def: 20 } } });
    expect(result[0].active).toBe(false);
    expect(result[0].bonus).toBeNull();
  });
});