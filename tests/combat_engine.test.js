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
} = require("../src/services/rpg/combatEngine");
const { createSession, findSessionByCharacter, removeSession } = require("../src/services/rpg/combatState");
const { supabase } = require("../src/database/supabase");

beforeEach(() => {
  vi.spyOn(supabase, "from").mockImplementation(() => ({
    upsert: vi.fn(async () => ({ error: null })),
    delete: vi.fn(() => ({
      eq: vi.fn(async () => ({ error: null })),
    })),
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn(async () => ({ data: null })),
      })),
    })),
  }));
});

afterEach(() => vi.restoreAllMocks());

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

  it("HP 50 aplica penalización 0.2 (Lastimado)", () => {
    const result = applyPenalties(sampleStats, 50);
    expect(result.atk).toBe(40);
    expect(result.def).toBe(32);
  });

  it("HP 30 aplica penalización 0.5 (Incapacitado)", () => {
    const result = applyPenalties(sampleStats, 30);
    expect(result.atk).toBe(25);
    expect(result.def).toBe(20);
  });

  it("HP 10 aplica penalización 1.0 (K.O.)", () => {
    const result = applyPenalties(sampleStats, 10);
    expect(result.atk).toBe(0);
    expect(result.def).toBe(0);
  });
});

describe("combatEngine — calculateDamage", () => {
  const highAtk = { atk: 50, def: 10, aspd: 10, ref: 10, mspd: 10 };
  const highDef = { atk: 10, def: 50, aspd: 10, ref: 10, mspd: 10 };
  const equal = { atk: 30, def: 30, aspd: 20, ref: 20, mspd: 20 };

  it("ATK igual a DEF da daño mínimo (DAMAGE_MIN)", () => {
    const dmg = calculateDamage(highAtk, highDef, 100, 100);
    expect(dmg).toBe(DAMAGE_MIN);
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

  it("no publica en memoria una sesión que Supabase rechazó", async () => {
    const failedA = { ...charA, id: 201 };
    const failedB = { ...charB, id: 202 };
    supabase.from.mockReturnValueOnce({
      upsert: vi.fn(async () => ({ error: new Error("database unavailable") })),
    });

    await expect(createSession("userA", "userB", failedA, failedB)).rejects.toThrow("database unavailable");
    expect(findSessionByCharacter(failedA.id)).toBeNull();
  });
});
