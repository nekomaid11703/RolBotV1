const { FATIGUE_THRESHOLDS, FATIGUE_COSTS, FATIGUE_RECOVERY } = require("../src/config/combatConfig");
const {
  getFatigueLevel,
  applyFatiguePenalties,
  calcFatigueCost,
  calcFatigueRecovery,
} = require("../src/services/rpg/fatigueEngine");

describe("FATIGUE_THRESHOLDS", () => {
  it("pleno hasta 0.33", () => {
    expect(FATIGUE_THRESHOLDS[0].maxRatio).toBe(0.33);
    expect(FATIGUE_THRESHOLDS[0].state).toBe("pleno");
    expect(FATIGUE_THRESHOLDS[0].penalty).toBe(0);
  });

  it("agitado hasta 0.66", () => {
    expect(FATIGUE_THRESHOLDS[1].maxRatio).toBe(0.66);
    expect(FATIGUE_THRESHOLDS[1].state).toBe("agitado");
    expect(FATIGUE_THRESHOLDS[1].penalty).toBe(0.2);
  });

  it("cansado hasta 0.90", () => {
    expect(FATIGUE_THRESHOLDS[2].maxRatio).toBe(0.9);
    expect(FATIGUE_THRESHOLDS[2].state).toBe("cansado");
    expect(FATIGUE_THRESHOLDS[2].penalty).toBe(0.4);
  });

  it("fatigado desde 0.91+", () => {
    expect(FATIGUE_THRESHOLDS[3].maxRatio).toBe(Infinity);
    expect(FATIGUE_THRESHOLDS[3].state).toBe("fatigado");
    expect(FATIGUE_THRESHOLDS[3].penalty).toBe(0.6);
  });
});

describe("FATIGUE_COSTS", () => {
  it("attack cuesta 1", () => {
    expect(FATIGUE_COSTS.attack).toBe(1);
  });

  it("dodge cuesta 4", () => {
    expect(FATIGUE_COSTS.dodge).toBe(4);
  });

  it("block cuesta 0", () => {
    expect(FATIGUE_COSTS.block).toBe(0);
  });

  it("flee cuesta 3", () => {
    expect(FATIGUE_COSTS.flee).toBe(3);
  });

  it("useItem cuesta 1", () => {
    expect(FATIGUE_COSTS.useItem).toBe(1);
  });
});

describe("FATIGUE_RECOVERY", () => {
  it("block recupera 1", () => {
    expect(FATIGUE_RECOVERY.block).toBe(1);
  });

  it("rest recupera 5", () => {
    expect(FATIGUE_RECOVERY.rest).toBe(5);
  });
});

describe("getFatigueLevel", () => {
  it("fatiga 0 devuelve pleno", () => {
    const level = getFatigueLevel(0, 50);
    expect(level.state).toBe("pleno");
    expect(level.penalty).toBe(0);
  });

  it("fatiga baja comparada con resistencia da pleno", () => {
    const level = getFatigueLevel(10, 50);
    expect(level.state).toBe("pleno");
    expect(level.penalty).toBe(0);
  });

  it("fatiga 20 / res 50 = 0.4 da agitado", () => {
    const level = getFatigueLevel(20, 50);
    expect(level.state).toBe("agitado");
    expect(level.penalty).toBe(0.2);
  });

  it("fatiga 40 / res 50 = 0.8 da cansado", () => {
    const level = getFatigueLevel(40, 50);
    expect(level.state).toBe("cansado");
    expect(level.penalty).toBe(0.4);
  });

  it("fatiga 48 / res 50 = 0.96 da fatigado", () => {
    const level = getFatigueLevel(48, 50);
    expect(level.state).toBe("fatigado");
    expect(level.penalty).toBe(0.6);
  });

  it("fatiga supera resistencia da fatigado", () => {
    const level = getFatigueLevel(60, 50);
    expect(level.state).toBe("fatigado");
  });
});

describe("applyFatiguePenalties", () => {
  const stats = { atk: 50, def: 40, aspd: 30, ref: 20, mspd: 10, fulgor: 25 };

  it("fatiga 0 no modifica stats", () => {
    const result = applyFatiguePenalties(stats, 0, 50);
    expect(result).toEqual(stats);
  });

  it("agitado reduce 20% aspd, mspd, ref", () => {
    const result = applyFatiguePenalties(stats, 20, 50);
    expect(result.aspd).toBe(24);
    expect(result.mspd).toBe(8);
    expect(result.ref).toBe(16);
    expect(result.atk).toBe(50);
    expect(result.def).toBe(40);
    expect(result.fulgor).toBe(25);
  });

  it("cansado reduce 40% aspd, mspd, ref", () => {
    const result = applyFatiguePenalties(stats, 40, 50);
    expect(result.aspd).toBe(18);
    expect(result.mspd).toBe(6);
    expect(result.ref).toBe(12);
  });

  it("fatigado reduce 60% aspd, mspd, ref", () => {
    const result = applyFatiguePenalties(stats, 48, 50);
    expect(result.aspd).toBe(12);
    expect(result.mspd).toBe(4);
    expect(result.ref).toBe(8);
  });
});

describe("calcFatigueCost", () => {
  it("retorna costo base de dodge sin stats", () => {
    expect(calcFatigueCost("dodge")).toBe(4);
  });

  it("retorna 0 para accion desconocida", () => {
    expect(calcFatigueCost("unknown")).toBe(0);
  });

  it("attack con ATK=50 escala el costo", () => {
    const cost = calcFatigueCost("attack", { atk: 50, def: 20 });
    expect(cost).toBeGreaterThanOrEqual(1);
  });

  it("dodge con MSPD=30 reduce el costo", () => {
    const cost = calcFatigueCost("dodge", { atk: 10, def: 10, mspd: 30 });
    expect(cost).toBeGreaterThanOrEqual(1);
  });
});

describe("calcFatigueRecovery", () => {
  it("block en pleno con res=50 recupera 11 (1 base + 10 DEF bonus)", () => {
    const recovery = calcFatigueRecovery("block", 5, 50);
    expect(recovery).toBe(11);
  });

  it("block en agitado con res=50 recupera 5 (11 * 0.5 = 5.5 -> 5)", () => {
    const recovery = calcFatigueRecovery("block", 20, 50);
    expect(recovery).toBe(5);
  });

  it("block en cansado con res=50 recupera 2 (11 * 0.25 = 2.75 -> 2)", () => {
    const recovery = calcFatigueRecovery("block", 40, 50);
    expect(recovery).toBe(2);
  });

  it("block en fatigado con res=50 recupera 1 (11 * 0.125 = 1.375 -> 1)", () => {
    const recovery = calcFatigueRecovery("block", 48, 50);
    expect(recovery).toBe(1);
  });

  it("rest en pleno sin DEF recupera 5", () => {
    const recovery = calcFatigueRecovery("rest", 0, 1);
    expect(recovery).toBe(5);
  });

  it("rest en pleno con DEF alto recupera 15 (max)", () => {
    const recovery = calcFatigueRecovery("rest", 0, 50);
    expect(recovery).toBe(15);
  });

  it("retorna 0 para metodo desconocido", () => {
    expect(calcFatigueRecovery("unknown", 0, 50)).toBe(0);
  });
});
