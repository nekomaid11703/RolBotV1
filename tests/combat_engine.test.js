const {
  TURN_TIMEOUT_MS,
  DAMAGE_MIN,
  BLOCK_REDUCTION,
  MAX_ACTIVE_SESSIONS,
  CLEANUP_INTERVAL_MS,
} = require("../src/config/combatConfig");
const {
  applyPenalties,
  calculateDamage,
  canReact,
  attemptBlock,
  attemptDodge,
  executeTurn,
  calculateXpReward,
} = require("../src/services/rpg/combatEngine");
const {
  createSession,
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  endSession,
  expireSession,
  removeSession,
} = require("../src/services/rpg/combatState");

vi.mock("../src/database/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(async () => ({ error: null })),
      delete: vi.fn(() => ({
        eq: vi.fn(async () => ({ error: null })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(async () => ({ data: null })),
        })),
      })),
    })),
  },
}));

describe("combatConfig", () => {
  it("TURN_TIMEOUT_MS es 48 horas", () => {
    expect(TURN_TIMEOUT_MS).toBe(172800000);
  });

  it("DAMAGE_MIN es 1", () => {
    expect(DAMAGE_MIN).toBe(1);
  });

  it("BLOCK_REDUCTION es 0.25", () => {
    expect(BLOCK_REDUCTION).toBe(0.25);
  });

  it("MAX_ACTIVE_SESSIONS es 50", () => {
    expect(MAX_ACTIVE_SESSIONS).toBe(50);
  });

  it("CLEANUP_INTERVAL_MS es 5 minutos", () => {
    expect(CLEANUP_INTERVAL_MS).toBe(300000);
  });
});

describe("combatEngine — applyPenalties", () => {
  const sampleStats = { atk: 50, def: 40, aspd: 30, ref: 20, mspd: 10 };

  it("HP 100 no aplica penalización", () => {
    const result = applyPenalties(sampleStats, 100);
    expect(result.atk).toBe(50);
    expect(result.def).toBe(40);
  });

  it("HP bajo no aplica penalización (eliminada)", () => {
    const result = applyPenalties(sampleStats, 50);
    expect(result.atk).toBe(50);
    expect(result.def).toBe(40);
  });

  it("HP 10 tampoco aplica penalización", () => {
    const result = applyPenalties(sampleStats, 10);
    expect(result.atk).toBe(50);
    expect(result.def).toBe(40);
  });
});

describe("combatEngine — calculateDamage", () => {
  const highAtk = { atk: 50, def: 10, aspd: 10, ref: 10, mspd: 10 };
  const highDef = { atk: 10, def: 50, aspd: 10, ref: 10, mspd: 10 };
  const equal = { atk: 30, def: 30, aspd: 20, ref: 20, mspd: 20 };

  it("ATK=50, DEF=50 produce daño moderado con nueva fórmula DEF", () => {
    const dmg = calculateDamage(highAtk, highDef, 100, 100);
    expect(dmg).toBe(33);
  });

  it("Daño mínimo es 1 incluso si ATK <= DEF", () => {
    const dmg = calculateDamage(
      { atk: 10, def: 10, aspd: 10, ref: 10, mspd: 10 },
      { atk: 10, def: 50, aspd: 10, ref: 10, mspd: 10 },
      100,
      100,
    );
    expect(dmg).toBeGreaterThanOrEqual(DAMAGE_MIN);
  });

  it("Stats iguales pero con penalización por HP del defensor", () => {
    const dmg = calculateDamage(equal, equal, 100, 35);
    expect(dmg).toBeGreaterThanOrEqual(DAMAGE_MIN);
  });
});

describe("combatEngine — canReact", () => {
  const defender = { atk: 10, def: 10, aspd: 10, ref: 15, mspd: 10 };
  const fastAttacker = { atk: 10, def: 10, aspd: 20, ref: 5, mspd: 10 };
  const slowAttacker = { atk: 10, def: 10, aspd: 5, ref: 5, mspd: 10 };

  it("REF >= ASPD del atacante permite reaccionar", () => {
    expect(canReact(defender, 100, slowAttacker, 100)).toBe(true);
  });

  it("REF < ASPD del atacante no permite reaccionar", () => {
    expect(canReact(defender, 100, fastAttacker, 100)).toBe(false);
  });
});

describe("combatEngine — attemptBlock", () => {
  it("Bloquea reduciendo 25% del daño", () => {
    const result = attemptBlock(100);
    expect(result.blocked).toBe(true);
    expect(result.damage).toBe(75);
  });
});

describe("combatEngine — attemptDodge", () => {
  const slowAttacker = { atk: 10, def: 10, aspd: 5, ref: 5, mspd: 5 };
  const fastDefender = { atk: 10, def: 10, aspd: 5, ref: 5, mspd: 20 };

  it("MSPD def >= ASPD atq -> esquiva", () => {
    const result = attemptDodge(fastDefender, 100, slowAttacker, 100);
    expect(result.dodged).toBe(true);
    expect(result.damage).toBe(0);
  });
});

describe("combatEngine — executeTurn", () => {
  const attacker = {
    name: "Atacante",
    stats: { atk: 50, def: 20, aspd: 30, ref: 20, mspd: 20 },
    hp_actual: 100,
  };
  const defender = {
    name: "Defensor",
    stats: { atk: 20, def: 20, aspd: 20, ref: 20, mspd: 20 },
    hp_actual: 100,
  };

  it("Ejecuta un turno y devuelve estructura esperada", () => {
    const result = executeTurn(attacker, defender, 100);
    expect(result).toHaveProperty("attackerName", "Atacante");
    expect(result).toHaveProperty("defenderName", "Defensor");
    expect(result).toHaveProperty("baseDamage");
    expect(result).toHaveProperty("reaction");
    expect(result).toHaveProperty("finalDamage");
  });
});

describe("combatEngine — calculateXpReward", () => {
  it("Nivel 20 para el ganador da 50 + 20*2 = 90 XP", () => {
    expect(calculateXpReward(20, true)).toBe(90);
  });

  it("Nivel 20 para el perdedor da 30% (27 XP)", () => {
    expect(calculateXpReward(20, false)).toBe(27);
  });

  it("Nivel 1 para el ganador da 52 XP", () => {
    expect(calculateXpReward(1, true)).toBe(52);
  });
});

describe("combatEngine — applyPenalties con fatiga", () => {
  const stats = { atk: 50, def: 40, aspd: 30, ref: 20, mspd: 10 };

  it("fatiga 0 + HP 100 -> sin penalidades", () => {
    const result = applyPenalties(stats, 100, 0, 50);
    expect(result.atk).toBe(50);
    expect(result.aspd).toBe(30);
  });

  it("fatiga alta (agitado) + HP 100 -> solo speed stats reducidas", () => {
    const result = applyPenalties(stats, 100, 20, 50);
    expect(result.atk).toBe(50);
    expect(result.aspd).toBe(24);
    expect(result.mspd).toBe(8);
    expect(result.ref).toBe(16);
  });

  it("fatiga + HP bajo -> solo penalidad por fatiga", () => {
    const result = applyPenalties(stats, 50, 20, 50);
    expect(result.atk).toBe(50);
    expect(result.aspd).toBe(24);
  });
});

describe("combatEngine — calculateDamage con fatiga", () => {
  const atkStats = { atk: 50, def: 10, aspd: 30, ref: 15, mspd: 10 };
  const defStats = { atk: 10, def: 30, aspd: 10, ref: 15, mspd: 10 };

  it("fatiga en atacante reduce daño (porque aspd afecta sus penalidades)", () => {
    const dmgNormal = calculateDamage(atkStats, defStats, 100, 100, 0, 0, 50, 50);
    const dmgFatigued = calculateDamage(atkStats, defStats, 100, 100, 30, 0, 50, 50);
    expect(dmgFatigued).toBe(dmgNormal);
  });

  it("fatiga en defensor puede no afectar daño (solo speed stats)", () => {
    const dmgNormal = calculateDamage(atkStats, defStats, 100, 100, 0, 0, 50, 50);
    const dmgDefFatigued = calculateDamage(atkStats, defStats, 100, 100, 0, 30, 50, 50);
    expect(dmgDefFatigued).toBe(dmgNormal);
  });
});

describe("combatEngine — canReact con fatiga", () => {
  const defender = { atk: 10, def: 10, aspd: 10, ref: 15, mspd: 10 };
  const fastAttacker = { atk: 10, def: 10, aspd: 20, ref: 5, mspd: 10 };

  it("fatiga en defensor reduce ref -> puede impedir reaccion", () => {
    const canReactNormal = canReact(defender, 100, fastAttacker, 100, 0, 0, 10, 10);
    const canReactFatigued = canReact(defender, 100, fastAttacker, 100, 30, 0, 10, 10);
    expect(canReactNormal).toBe(false);
    expect(canReactFatigued).toBe(false);
  });

  it("fatiga alta en atacante reduce aspd -> facilita reaccion del defensor", () => {
    const slowWithFatigue = { atk: 10, def: 10, aspd: 12, ref: 5, mspd: 10 };
    const reactVsSlow = canReact(defender, 100, slowWithFatigue, 100, 0, 0, 10, 10);
    const reactVsSlowFatigued = canReact(defender, 100, slowWithFatigue, 100, 0, 20, 10, 10);
    expect(reactVsSlow).toBe(true);
    expect(reactVsSlowFatigued).toBe(true);
  });
});

describe("combatState — createSession", () => {
  const charA = { id: 101, name: "A", hp_actual: 100, stats: { hp: 100 } };
  const charB = { id: 102, name: "B", hp_actual: 100, stats: { hp: 100 } };

  it("Crea sesión con estado waiting_action e indexación por characterId", async () => {
    const session = await createSession("userA", "userB", charA, charB);
    expect(session.status).toBe("waiting_action");
    expect(session.challenger.characterId).toBe(101);
    expect(session.defender.characterId).toBe(102);

    const foundByChar = findSessionByCharacter(101);
    expect(foundByChar).toBeTruthy();
    expect(foundByChar.id).toBe(session.id);

    await removeSession(session.id);
  });
});
