const db = vi.hoisted(() => ({
  upsert: vi.fn(),
  deleteEq: vi.fn(),
}));

const {
  createSession,
  findSessionByCharacter,
  findSessionByUser,
  getSession,
  removeSession,
  restoreSessions,
  updateDistance,
} = require("../src/services/rpg/combatState");
const { supabase } = require("../src/database/supabase");

const createdIds = [];

function character(id) {
  return { id, hp_actual: 10, stats: { hp: 5 }, slots: {} };
}

beforeEach(() => {
  db.upsert.mockReset().mockResolvedValue({ error: null });
  db.deleteEq.mockReset().mockResolvedValue({ error: null });
  vi.spyOn(supabase, "from").mockImplementation(() => ({
    upsert: db.upsert,
    delete: vi.fn(() => ({ eq: db.deleteEq })),
  }));
});

afterEach(async () => {
  while (createdIds.length) {
    const id = createdIds.pop();
    if (getSession(id)) await removeSession(id);
  }
  vi.restoreAllMocks();
});

it("persiste la distancia inicial y cada cambio", async () => {
  expect(vi.isMockFunction(supabase.from)).toBe(true);
  const session = await createSession("user-a", "user-b", character("char-a"), character("char-b"));
  createdIds.push(session.id);

  expect(db.upsert.mock.calls[0][0]).toMatchObject({ id: session.id, distance: 5 });

  await updateDistance(session.id, 2);

  expect(getSession(session.id).distance).toBe(2);
  expect(db.upsert.mock.calls[1][0]).toMatchObject({ id: session.id, distance: 2 });
});

it("conserva el estado en memoria cuando Supabase rechaza el cambio", async () => {
  const persistenceError = new Error("database unavailable");
  db.upsert.mockResolvedValueOnce({ error: null }).mockResolvedValueOnce({ error: persistenceError });
  const session = await createSession("user-a", "user-b", character("char-a"), character("char-b"));
  createdIds.push(session.id);
  session.challenger.fatigue = 7;
  session.challenger.character.stats.hp = 99;

  await expect(updateDistance(session.id, 1)).rejects.toBe(persistenceError);

  expect(getSession(session.id).distance).toBe(5);
  expect(getSession(session.id).challenger.fatigue).toBe(0);
  expect(getSession(session.id).challenger.character.stats.hp).toBe(5);
});

it("propaga el fallo al restaurar sesiones", async () => {
  const persistenceError = new Error("database unavailable");
  supabase.from.mockImplementation(() => ({
    select: vi.fn(() => ({
      in: vi.fn().mockResolvedValue({ data: null, error: persistenceError }),
    })),
  }));

  await expect(restoreSessions()).rejects.toBe(persistenceError);
});

it.each([
  ["personaje", (session) => findSessionByCharacter(session.challenger.characterId)],
  ["usuario", (session) => findSessionByUser(session.challenger.userId)],
])("mantiene bloqueada la sesión expirada por %s mientras falla su persistencia", async (_label, findSession) => {
  const persistenceError = new Error("database unavailable");
  db.upsert.mockResolvedValueOnce({ error: null }).mockResolvedValueOnce({ error: persistenceError });
  const session = await createSession("user-a", "user-b", character("char-a"), character("char-b"));
  createdIds.push(session.id);
  session.lastTurnAt = 0;

  expect(findSession(session)).toBe(session);
  await vi.waitFor(() => expect(db.upsert).toHaveBeenCalledTimes(2));
});
