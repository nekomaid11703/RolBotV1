const { createDummySession, generateDummyCharacter, removeSession } = require("../src/services/rpg/combatState");
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

  it("generateDummyCharacter genera un dummy con suma de stats igual a los puntos totales del jugador", () => {
    const dummy = generateDummyCharacter(challengerChar);

    const playerTotalPoints = 10 + 8 + 6 + 5 + 5 + 4 + 3 + 3; // 44 puntos
    const dummyTotalPoints =
      dummy.stats.atk +
      dummy.stats.def +
      dummy.stats.aspd +
      dummy.stats.ref +
      dummy.stats.mspd +
      dummy.stats.fulgor +
      dummy.stats.d_fulgor +
      dummy.stats.r_fulgor;

    expect(dummyTotalPoints).toBe(playerTotalPoints);
    expect(dummy.nivel).toBe(playerTotalPoints);
    expect(dummy.name).toBe("Maniqu\u00ed de Pr\u00e1ctica");
  });

  it("createDummySession crea una sesion PvE valida", async () => {
    const session = await createDummySession("user123", challengerChar);

    expect(session.isPvE).toBe(true);
    expect(session.challenger.isBot).toBe(false);
    expect(session.defender.isBot).toBe(true);
    expect(session.defender.character.name).toBe("Maniqu\u00ed de Pr\u00e1ctica");

    await removeSession(session.id);
  });

  it("CombatAI.executeAiTurn ejecuta el contraataque de la IA del Dummy", async () => {
    const session = await createDummySession("user123", challengerChar);

    session.currentTurnCharId = session.defender.characterId;

    const result = CombatAI.executeAiTurn(session);

    expect(result).not.toBeNull();
    expect(result.attackerName).toBe("Maniqu\u00ed de Pr\u00e1ctica");
    expect(result.defenderName).toBe("H\u00e9roe de Prueba");
    expect(result.finalDamage).toBeGreaterThanOrEqual(0);

    await removeSession(session.id);
  });
});
