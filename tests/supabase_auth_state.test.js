const cachedModules = new Map();

function mockCommonJsModule(request, exports) {
  const fileName = require.resolve(request);
  cachedModules.set(fileName, require.cache[fileName]);
  require.cache[fileName] = { id: fileName, filename: fileName, loaded: true, exports };
}

function loadAuthState(supabase) {
  mockCommonJsModule("../src/database/supabase", { supabase });
  mockCommonJsModule("../src/services/loggerService", { logError: vi.fn().mockResolvedValue(undefined) });

  const modulePath = require.resolve("../src/core/supabaseAuthState");
  delete require.cache[modulePath];
  return { modulePath, ...require(modulePath) };
}

afterEach(() => {
  delete require.cache[require.resolve("../src/core/supabaseAuthState")];
  for (const [fileName, cached] of cachedModules) {
    if (cached) require.cache[fileName] = cached;
    else delete require.cache[fileName];
  }
  cachedModules.clear();
});

describe("Supabase auth state", () => {
  // Estos tests cargan el estado de Baileys de verdad (red + cripto async).
  // Bajo la suite paralela completa la contención de CPU dispara el timeout de
  // 10s pese a tardar ~2s en solitario; 30s dejan margen estable.
  it("no crea credenciales nuevas cuando falla la lectura de la sesión", { timeout: 30000 }, async () => {
    const upsert = vi.fn();
    const query = {
      select: vi.fn(() => query),
      eq: vi.fn(() => query),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { code: "PGRST500", message: "database unavailable" },
      }),
      upsert,
    };
    const supabase = { from: vi.fn(() => query) };
    const { useSupabaseAuthState } = loadAuthState(supabase);

    await expect(useSupabaseAuthState("test-session")).rejects.toMatchObject({ message: "database unavailable" });
    expect(upsert).not.toHaveBeenCalled();
  });

  it("agrupa las claves en una consulta y reutiliza la caché de Baileys", { timeout: 30000 }, async () => {
    const inQuery = vi.fn().mockResolvedValue({
      data: [
        { id: "session-a", data: { value: "A" } },
        { id: "session-b", data: { value: "B" } },
      ],
      error: null,
    });
    const query = {
      select: vi.fn(() => query),
      eq: vi.fn(() => query),
      single: vi.fn().mockResolvedValue({ data: { data: { registered: true } }, error: null }),
      in: inQuery,
    };
    const supabase = { from: vi.fn(() => query) };
    const { useSupabaseAuthState } = loadAuthState(supabase);
    const { state } = await useSupabaseAuthState("test-session");

    await expect(state.keys.get("session", ["a", "b", "a"])).resolves.toEqual({
      a: { value: "A" },
      b: { value: "B" },
    });
    await expect(state.keys.get("session", ["a", "b"])).resolves.toEqual({
      a: { value: "A" },
      b: { value: "B" },
    });

    expect(inQuery).toHaveBeenCalledOnce();
    expect(inQuery).toHaveBeenCalledWith("id", ["session-a", "session-b"]);
  });
});
