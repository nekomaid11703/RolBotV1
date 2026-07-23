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
  it("attack cuesta 3", () => {
    expect(FATIGUE_COSTS.attack).toBe(3);
  });

  it("dodge cuesta 6", () => {
    expect(FATIGUE_COSTS.dodge).toBe(6);
  });

  it("block cuesta 1", () => {
    expect(FATIGUE_COSTS.block).toBe(1);
  });

  it("flee cuesta 4", () => {
    expect(FATIGUE_COSTS.flee).toBe(4);
  });

  it("useItem cuesta 2", () => {
    expect(FATIGUE_COSTS.useItem).toBe(2);
  });
});

describe("FATIGUE_RECOVERY", () => {
  it("block recupera 3", () => {
    expect(FATIGUE_RECOVERY.block).toBe(3);
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
  it("retorna costo de dodge", () => {
    expect(calcFatigueCost("dodge")).toBe(6);
  });

  it("retorna 0 para accion desconocida", () => {
    expect(calcFatigueCost("unknown")).toBe(0);
  });
});

describe("calcFatigueRecovery", () => {
  it("block en pleno recupera 3", () => {
    const recovery = calcFatigueRecovery("block", 5, 50);
    expect(recovery).toBe(3);
  });

  it("block en agitado recupera 1 (3 * 0.5 redondeado)", () => {
    const recovery = calcFatigueRecovery("block", 20, 50);
    expect(recovery).toBe(1);
  });

  it("block en cansado recupera 0 (3 * 0.25 = 0.75 -> 0)", () => {
    const recovery = calcFatigueRecovery("block", 40, 50);
    expect(recovery).toBe(0);
  });

  it("block en fatigado recupera 0 (3 * 0.125 = 0.375 -> 0)", () => {
    const recovery = calcFatigueRecovery("block", 48, 50);
    expect(recovery).toBe(0);
  });

  it("rest en pleno recupera 5", () => {
    const recovery = calcFatigueRecovery("rest", 0, 50);
    expect(recovery).toBe(5);
  });

  it("retorna 0 para metodo desconocido", () => {
    expect(calcFatigueRecovery("unknown", 0, 50)).toBe(0);
  });
});
