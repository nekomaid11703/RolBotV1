const { SESSION_STATES, TURN_TIMEOUT_MS } = require("../src/config/combatConfig");
const {
  generateDummyCharacter,
  isSessionActive,
  isSessionExpired,
  getSession,
  findSessionByCharacter,
  findSessionByUser,
} = require("../src/services/rpg/combatState");

vi.mock("../src/database/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(async () => ({ error: null })),
      delete: vi.fn(() => ({
        eq: vi.fn(async () => ({ error: null })),
      })),
      select: vi.fn(() => ({
        in: vi.fn(async () => ({ data: [], error: null })),
      })),
    })),
  },
}));

describe("combatState — generateDummyCharacter", () => {
  it("genera un dummy con id que empieza por dummy_", () => {
    const challenger = { stats: { atk: 10, def: 8, aspd: 6, ref: 5, mspd: 5 } };
    const dummy = generateDummyCharacter(challenger);
    expect(dummy.id).toMatch(/^dummy_/);
  });

  it("nombre es Maniqui de Practica", () => {
    const challenger = { stats: { atk: 10, def: 8, aspd: 6, ref: 5, mspd: 5 } };
    const dummy = generateDummyCharacter(challenger);
    expect(dummy.name).toBe("Maniqu\u00ed de Pr\u00e1ctica");
  });

  it("nivel suma total de puntos del jugador", () => {
    const challenger = { stats: { atk: 10, def: 8, aspd: 6, ref: 5, mspd: 5 } };
    const dummy = generateDummyCharacter(challenger);
    expect(dummy.nivel).toBe(34);
  });

  it("hp_actual es el doble de stats.hp del dummy", () => {
    const challenger = { stats: { atk: 10, def: 8, aspd: 6, ref: 5, mspd: 5 } };
    const dummy = generateDummyCharacter(challenger);
    expect(dummy.hp_actual).toBe(dummy.stats.hp * 2);
    expect(dummy.hp_actual).toBeGreaterThan(0);
  });

  it("todos los stats son >= 1", () => {
    const challenger = { stats: { atk: 10, def: 8, aspd: 6, ref: 5, mspd: 5 } };
    const dummy = generateDummyCharacter(challenger);
    for (const key of ["atk", "def", "aspd", "ref", "mspd", "fulgor", "d_fulgor", "r_fulgor"]) {
      expect(dummy.stats[key]).toBeGreaterThanOrEqual(1);
    }
  });

  it("usa 20 como total por defecto si stats vacios", () => {
    const challenger = { stats: {} };
    const dummy = generateDummyCharacter(challenger);
    expect(dummy.nivel).toBe(20);
  });
});

describe("combatState — isSessionActive", () => {
  it("retorna false para null", () => {
    expect(isSessionActive(null)).toBe(false);
  });

  it("retorna true para WAITING_ACTION", () => {
    expect(isSessionActive({ status: SESSION_STATES.WAITING_ACTION })).toBe(true);
  });

  it("retorna true para WAITING_REACTION", () => {
    expect(isSessionActive({ status: SESSION_STATES.WAITING_REACTION })).toBe(true);
  });

  it("retorna false para COMPLETED", () => {
    expect(isSessionActive({ status: SESSION_STATES.COMPLETED })).toBe(false);
  });

  it("retorna false para EXPIRED", () => {
    expect(isSessionActive({ status: SESSION_STATES.EXPIRED })).toBe(false);
  });
});

describe("combatState — isSessionExpired", () => {
  it("retorna false para null", () => {
    expect(isSessionExpired(null)).toBe(false);
  });

  it("retorna false para COMPLETED aunque tiempo excedido", () => {
    const session = {
      status: SESSION_STATES.COMPLETED,
      lastTurnAt: Date.now() - TURN_TIMEOUT_MS - 1000,
    };
    expect(isSessionExpired(session)).toBe(false);
  });

  it("retorna false para EXPIRED aunque tiempo excedido", () => {
    const session = {
      status: SESSION_STATES.EXPIRED,
      lastTurnAt: Date.now() - TURN_TIMEOUT_MS - 1000,
    };
    expect(isSessionExpired(session)).toBe(false);
  });

  it("retorna true cuando tiempo excedido y sesion activa", () => {
    const session = {
      status: SESSION_STATES.WAITING_ACTION,
      lastTurnAt: Date.now() - TURN_TIMEOUT_MS - 1000,
    };
    expect(isSessionExpired(session)).toBe(true);
  });

  it("retorna false cuando tiempo no excedido", () => {
    const session = {
      status: SESSION_STATES.WAITING_ACTION,
      lastTurnAt: Date.now(),
    };
    expect(isSessionExpired(session)).toBe(false);
  });
});
