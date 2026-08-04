// @ts-nocheck
/**
 * durabilityPersistenceService unit tests: decremento, broken, destroyed y
 * round-trip de metadata en inventory.metadata (patrón require.cache).
 */

let mockInventoryRow = null;
let mockError = null;

function setupMocks() {
  mockInventoryRow = null;
  mockError = null;

  const supabasePath = require.resolve("../src/database/supabase");
  const loggerPath = require.resolve("../src/services/loggerService");
  const columnRegistryPath = require.resolve("../src/database/columnRegistry");
  const safeQueryPath = require.resolve("../src/utils/safeQuery");

  const mockFrom = vi.fn().mockImplementation((table) => {
    if (table !== "inventory") return { select: vi.fn(), update: vi.fn() };

    return {
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi
              .fn()
              .mockResolvedValue(
                mockError ? { data: null, error: mockError } : { data: mockInventoryRow, error: null },
              ),
          }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue(mockError ? { error: mockError } : { error: null }),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    };
  });

  require.cache[supabasePath] = {
    id: supabasePath,
    filename: supabasePath,
    loaded: true,
    exports: { supabase: { from: mockFrom } },
  };
  require.cache[loggerPath] = {
    id: loggerPath,
    filename: loggerPath,
    loaded: true,
    exports: { logError: vi.fn(), logSystem: vi.fn() },
  };
  require.cache[columnRegistryPath] = {
    id: columnRegistryPath,
    filename: columnRegistryPath,
    loaded: true,
    exports: { filterExisting: vi.fn((_t, payload) => payload) },
  };
  require.cache[safeQueryPath] = {
    id: safeQueryPath,
    filename: safeQueryPath,
    loaded: true,
    exports: { invalidateUserCache: vi.fn() },
  };

  delete require.cache[require.resolve("../src/services/rpg/durabilityPersistenceService")];
}

describe("persistDurability", () => {
  beforeEach(() => setupMocks());

  it("Actualiza metadata preservando datos ajenos", async () => {
    mockInventoryRow = { metadata: { tier: "C", material: "hierro" } };
    const { persistDurability } = require("../src/services/rpg/durabilityPersistenceService");
    const result = await persistDurability({
      characterId: 1,
      creatorId: "t",
      itemId: "pechera",
      durability: { maxResist: 100, currentResist: 70, isRepairable: true },
    });
    expect(result).toBe("updated");
  });

  it("Marca broken cuando llega a 0 y es reparable", async () => {
    mockInventoryRow = { metadata: {} };
    const { persistDurability } = require("../src/services/rpg/durabilityPersistenceService");
    const result = await persistDurability({
      characterId: 1,
      creatorId: "t",
      itemId: "pechera",
      durability: { maxResist: 50, currentResist: 0, isRepairable: true },
    });
    expect(result).toBe("updated");
  });

  it("Destruye (elimina del inventario) si no es reparable y llega a 0", async () => {
    mockInventoryRow = { metadata: {} };
    const { persistDurability } = require("../src/services/rpg/durabilityPersistenceService");
    const result = await persistDurability({
      characterId: 1,
      creatorId: "t",
      itemId: "escudo",
      durability: { maxResist: 20, currentResist: 0, isRepairable: false },
    });
    expect(result).toBe("destroyed");
  });
});

describe("readMetadata", () => {
  beforeEach(() => setupMocks());

  it("Devuelve metadata previa", async () => {
    mockInventoryRow = { metadata: { broken: false } };
    const { readMetadata } = require("../src/services/rpg/durabilityPersistenceService");
    const metadata = await readMetadata(1, "pechera");
    expect(metadata.broken).toBe(false);
  });

  it("Devuelve {} si no existe", async () => {
    mockInventoryRow = null;
    const { readMetadata } = require("../src/services/rpg/durabilityPersistenceService");
    expect(await readMetadata(1, "nada")).toEqual({});
  });
});
