const { supabase } = require("../src/database/supabase");
const {
  createDummySession,
  applyElementalHit,
  advanceTurn,
  getSession,
  removeSession,
} = require("../src/services/rpg/combatState");

const createdIds = [];

beforeEach(() => {
  vi.spyOn(supabase, "from").mockImplementation(() => ({
    upsert: vi.fn(async () => ({ error: null })),
    delete: vi.fn(() => ({
      eq: vi.fn(async () => ({ error: null })),
    })),
  }));
});

afterEach(async () => {
  while (createdIds.length) {
    const id = createdIds.pop();
    if (getSession(id)) await removeSession(id);
  }
  vi.restoreAllMocks();
});

describe("combatState — estado de imbuición elemental (Fase 4)", () => {
  const challengerChar = {
    id: 101,
    name: "H\u00e9roe de Prueba",
    hp_actual: 100,
    stats: { hp: 100, atk: 10, def: 8, aspd: 6, ref: 5, mspd: 5 },
  };

  it("sin aura previa: imprime el dominante, multiplicador 1 y sin efectos", async () => {
    const session = await createDummySession("user_test", challengerChar);
    createdIds.push(session.id);

    const res = await applyElementalHit(session.id, session.challenger.characterId, "fuego");

    expect(res.reacciono).toBe(false);
    expect(res.motivo).toBe("imprime_aura");
    expect(res.multiplicador).toBe(1);
    expect(res.efectos).toEqual([]);
    expect(res.sessionAura).toMatchObject({ pasiva: "fuego" });
  });

  it("par con reacción: evento instantáneo (multiplicador + efectos) y consume el aura", async () => {
    const session = await createDummySession("user_test", challengerChar);
    createdIds.push(session.id);
    const id = String(session.challenger.characterId);
    // Imbuir hielo primero (sin reaccion) y luego golpear con fuego.
    await applyElementalHit(session.id, id, "hielo");

    const res = await applyElementalHit(session.id, id, "fuego");

    expect(res.reacciono).toBe(true);
    expect(res.reaction.label).toBe("derretido");
    expect(res.multiplicador).toBe(1.5);
    expect(res.efectos).toEqual(["quemadura"]);
    // El aura pasiva se consumió tras la reacción.
    expect(res.sessionAura).toMatchObject({ pasiva: null, turnos: 0 });
  });

  it("mismo elemento: refresca la ventana sin reaccionar", async () => {
    const session = await createDummySession("user_test", challengerChar);
    createdIds.push(session.id);
    const id = String(session.challenger.characterId);
    await applyElementalHit(session.id, id, "agua");

    const res = await applyElementalHit(session.id, id, "agua");

    expect(res.reacciono).toBe(false);
    expect(res.motivo).toBe("mismo_elemento");
    expect(res.sessionAura).toMatchObject({ pasiva: "agua" });
  });

  it("advanceTurn decae la ventana de la imbuición y la limpia al llegar a cero", async () => {
    const session = await createDummySession("user_test", challengerChar);
    createdIds.push(session.id);
    session.challenger.aura = { pasiva: "fuego", turnos: 1 };

    await advanceTurn(session.id, 100, 100);

    const persisted = getSession(session.id);
    expect(persisted.challenger.aura).toMatchObject({ pasiva: null, turnos: 0 });
  });

  it("advanceTurn decrementa pero no limpia una ventana con turnos restantes", async () => {
    const session = await createDummySession("user_test", challengerChar);
    createdIds.push(session.id);
    session.challenger.aura = { pasiva: "fuego", turnos: 2 };

    await advanceTurn(session.id, 100, 100);

    const persisted = getSession(session.id);
    expect(persisted.challenger.aura).toMatchObject({ pasiva: "fuego", turnos: 1 });
  });
});