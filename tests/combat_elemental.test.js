const { supabase } = require("../src/database/supabase");
const {
  createDummySession,
  applyElementalHit,
  applyElementalAttack,
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

  it("applyElementalAttack escala el daño por el canal cuando reacciona", async () => {
    const session = await createDummySession("user_test", challengerChar);
    createdIds.push(session.id);
    const slot = session.defender;

    // Primero imprime hielo (sin reaccion), luego fuego dispara "derretido" ×1.5.
    await applyElementalHit(session.id, slot.characterId, "hielo");
    const amp = await applyElementalAttack(session.id, slot, "fuego", 100, 50);

    expect(amp.reaction.reacciono).toBe(true);
    expect(amp.reaction.multiplicador).toBe(1.5);
    expect(amp.baseDamage).toBe(150);
    expect(amp.materialDamage).toBe(75);
  });

  it("applyElementalAttack no amplifica cuando el golpe solo imprime el aura", async () => {
    const session = await createDummySession("user_test", challengerChar);
    createdIds.push(session.id);
    const slot = session.defender;

    const amp = await applyElementalAttack(session.id, slot, "fuego", 100, 50);

    expect(amp.reaction.reacciono).toBe(false);
    expect(amp.reaction.motivo).toBe("imprime_aura");
    expect(amp.reaction.multiplicador).toBe(1);
    expect(amp.baseDamage).toBe(100);
    expect(amp.materialDamage).toBe(50);
  });

  it("applyElementalAttack devuelve sin cambios cuando la sesión no existe", async () => {
    const slot = { characterId: "ghost", character: { id: "ghost" } };
    const amp = await applyElementalAttack("no-such-session", slot, "fuego", 100, 50);

    expect(amp.reaction).toBeNull();
    expect(amp.baseDamage).toBe(100);
    expect(amp.materialDamage).toBe(50);
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