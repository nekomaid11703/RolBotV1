const { createDummySession, removeSession } = require("../src/services/rpg/combatState");
const CombatAI = require("../src/services/rpg/combatAI");

vi.mock("../../src/database/supabase", () => ({
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

describe("CombatAI & Dummy Generation", () => {
  const challengerChar = {
    id: 101,
    name: "H\u00e9roe de Prueba",
    hp_actual: 100,
    stats: {
      hp: 100,
      atk: 10,
      def: 8,
      aspd: 6,
      ref: 5,
      mspd: 5,
      fulgor: 4,
      d_fulgor: 3,
      r_fulgor: 3,
    },
  };

  it("createDummySession crea una sesion PvE valida", async () => {
    const session = await createDummySession("user123", challengerChar);

    expect(session.isPvE).toBe(true);
    expect(session.challenger.isBot).toBe(false);
    expect(session.defender.isBot).toBe(true);
    expect(session.defender.character.name).toBe("Maniqu\u00ed de Pr\u00e1ctica");

    await removeSession(session.id);
  });

  it("CombatAI.makeDecision retorna advance cuando está fuera de alcance", async () => {
    const session = await createDummySession("user123", challengerChar);

    session.distance = 10;
    const aiSlot = session.defender;
    const playerSlot = session.challenger;

    const decision = CombatAI.makeDecision(session, aiSlot, playerSlot);

    expect(decision.action).toBe("advance");
    expect(decision.movement).not.toBeNull();
    expect(decision.movement.meters).toBeGreaterThan(0);

    await removeSession(session.id);
  });

  it("CombatAI.makeDecision retorna attack cuando está en alcance", async () => {
    const session = await createDummySession("user123", challengerChar);

    session.distance = 0;
    const aiSlot = session.defender;
    const playerSlot = session.challenger;

    const decision = CombatAI.makeDecision(session, aiSlot, playerSlot);

    expect(decision.action).toBe("attack");
    expect(decision.movement).toBeNull();

    await removeSession(session.id);
  });
});
