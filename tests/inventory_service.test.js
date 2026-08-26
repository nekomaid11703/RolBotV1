/**
 * inventoryService tests.
 * Uses manual module mocking via require.cache injection
 * since vi.mock does not intercept CJS require() calls in this vitest version.
 */

const MOCK_INVENTORY_DATA = { data: [], error: null };
let mockOrderImpl = vi.fn().mockResolvedValue(MOCK_INVENTORY_DATA);

function setupSupabaseMock() {
  const mockUpdateEq = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: null }),
  });
  const mockDeleteEq = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: null }),
  });
  const mockOrder = mockOrderImpl;
  const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
  const mockInsert = vi.fn().mockResolvedValue({ error: null, data: null });
  const mockUpdateFn = vi.fn().mockReturnValue({ eq: mockUpdateEq });
  const mockDeleteFn = vi.fn().mockReturnValue({ eq: mockDeleteEq });
  const mockFrom = vi.fn().mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdateFn,
    delete: mockDeleteFn,
  });

  const mockSupabase = { from: mockFrom };

  // Inject mock into require.cache BEFORE inventoryService is loaded
  const supabasePath = require.resolve("../src/database/supabase");
  const characterServicePath = require.resolve("../src/services/characterService");
  const loggerServicePath = require.resolve("../src/services/loggerService");
  const safeQueryPath = require.resolve("../src/utils/safeQuery");

  require.cache[supabasePath] = {
    id: supabasePath,
    filename: supabasePath,
    loaded: true,
    exports: { supabase: mockSupabase },
  };

  require.cache[characterServicePath] = {
    id: characterServicePath,
    filename: characterServicePath,
    loaded: true,
    exports: {
      getActiveCharacter: vi.fn().mockResolvedValue(null),
      setHp: vi.fn().mockResolvedValue(undefined),
    },
  };

  require.cache[loggerServicePath] = {
    id: loggerServicePath,
    filename: loggerServicePath,
    loaded: true,
    exports: { logError: vi.fn() },
  };

  require.cache[safeQueryPath] = {
    id: safeQueryPath,
    filename: safeQueryPath,
    loaded: true,
    exports: { invalidateUserCache: vi.fn() },
  };

  return {
    mockFrom,
    mockSelect,
    mockEq,
    mockOrder,
    mockInsert,
    mockUpdateFn,
    mockUpdateEq,
    mockDeleteFn,
    mockDeleteEq,
    mockSupabase,
  };
}

function clearCache() {
  const inventoryServicePath = require.resolve("../src/services/rpg/inventoryService");
  const columnRegistryPath = require.resolve("../src/database/columnRegistry");
  delete require.cache[inventoryServicePath];
  delete require.cache[columnRegistryPath];
}

let mocks;

beforeEach(() => {
  clearCache();
  mockOrderImpl = vi.fn().mockResolvedValue(MOCK_INVENTORY_DATA);
  mocks = setupSupabaseMock();
});

afterEach(() => {
  clearCache();
});

function loadService() {
  return require("../src/services/rpg/inventoryService");
}

const { MAX_INVENTORY_SIZE, MAX_STACK_SIZE } = require("../src/config/inventoryConfig");

describe("getInventory", () => {
  it("retorna filas cuando hay datos", async () => {
    const data = [
      { item_id: "venda", quantity: 3 },
      { item_id: "pocion", quantity: 1 },
    ];
    mocks.mockOrder.mockResolvedValue({ data, error: null });
    const { getInventory } = loadService();
    const result = await getInventory(1);
    expect(result).toEqual(data);
  });

  it("retorna array vacio si no hay datos", async () => {
    const { getInventory } = loadService();
    const result = await getInventory(99);
    expect(result).toEqual([]);
  });

  it("retorna array vacio si hay error", async () => {
    mocks.mockOrder.mockResolvedValue({ data: null, error: new Error("DB error") });
    const { getInventory } = loadService();
    const result = await getInventory(1);
    expect(result).toEqual([]);
    expect(mocks.mockOrder.mock.calls[0][0]).toBe("item_id");
  });
});

describe("getInventoryList", () => {
  it("enumera el inventario con índice 1-based y datos del catálogo", async () => {
    mocks.mockOrder.mockResolvedValue({
      data: [
        { item_id: "pocion", quantity: 2 },
        { item_id: "venda", quantity: 3 },
      ],
      error: null,
    });
    const { getInventoryList } = loadService();
    const result = await getInventoryList(1);
    expect(result).toEqual([
      {
        index: 1,
        itemId: "pocion",
        name: "Poción",
        quantity: 2,
        metadata: {},
        categories: ["consumable"],
        modules: { heal: { amount: 40 } },
      },
      {
        index: 2,
        itemId: "venda",
        name: "Venda",
        quantity: 3,
        metadata: {},
        categories: ["consumable"],
        modules: { heal: { amount: 15 } },
      },
    ]);
  });

  it("mantiene el item_id como nombre si el ítem no está en catálogo", async () => {
    mocks.mockOrder.mockResolvedValue({ data: [{ item_id: "desconocido", quantity: 1 }], error: null });
    const { getInventoryList } = loadService();
    const result = await getInventoryList(1);
    expect(result[0].name).toBe("desconocido");
    expect(result[0].categories).toEqual([]);
  });
});

describe("addItem", () => {
  it("agrega un item nuevo al inventario vacio", async () => {
    const { addItem } = loadService();
    const result = await addItem(1, "user1", "venda", 2);
    expect(result).toEqual({ itemId: "venda", quantity: 2, total: 2 });
  });

  it("incrementa cantidad de un item existente", async () => {
    mocks.mockOrder.mockResolvedValue({ data: [{ item_id: "venda", quantity: 5 }], error: null });
    const { addItem } = loadService();
    const result = await addItem(1, "user1", "venda", 3);
    expect(result).toEqual({ itemId: "venda", quantity: 3, total: 8 });
  });

  it("lanza error si el item no existe", async () => {
    const { addItem } = loadService();
    await expect(addItem(1, "user1", "inexistente", 1)).rejects.toThrow('El ítem "inexistente" no existe.');
  });

  it("lanza error si el inventario esta lleno (nuevo item distinto)", async () => {
    const full = Array.from({ length: MAX_INVENTORY_SIZE }, (_, i) => ({
      item_id: `item_${i}`,
      quantity: 1,
    }));
    mocks.mockOrder.mockResolvedValue({ data: full, error: null });
    const { addItem } = loadService();
    await expect(addItem(1, "user1", "venda", 1)).rejects.toThrow(
      `Inventario lleno (máx. ${MAX_INVENTORY_SIZE} tipos de items distintos).`,
    );
  });

  it("permite agregar si el item ya existe aunque inv este lleno", async () => {
    const full = Array.from({ length: MAX_INVENTORY_SIZE }, (_, i) => ({
      item_id: i === 0 ? "venda" : `item_${i}`,
      quantity: 1,
    }));
    mocks.mockOrder.mockResolvedValue({ data: full, error: null });
    const { addItem } = loadService();
    const result = await addItem(1, "user1", "venda", 5);
    expect(result.total).toBe(6);
  });

  it("lanza error si se excede el stack maximo", async () => {
    mocks.mockOrder.mockResolvedValue({ data: [{ item_id: "venda", quantity: MAX_STACK_SIZE }], error: null });
    const { addItem } = loadService();
    await expect(addItem(1, "user1", "venda", 1)).rejects.toThrow(
      `No puedes tener más de ${MAX_STACK_SIZE} unidades del mismo ítem por ranura.`,
    );
  });

  it("usa cantidad por defecto 1 si no se especifica", async () => {
    const { addItem } = loadService();
    const result = await addItem(1, "user1", "pocion");
    expect(result.quantity).toBe(1);
  });
});

describe("removeItem", () => {
  beforeEach(() => {
    mocks.mockOrder.mockResolvedValue({ data: [{ item_id: "venda", quantity: 10 }], error: null });
  });

  it("reduce cantidad de un item", async () => {
    const { removeItem } = loadService();
    const result = await removeItem(1, "user1", "venda", 3);
    expect(result).toEqual({ itemId: "venda", removed: 3, remaining: 7 });
  });

  it("elimina la fila si la cantidad llega a 0", async () => {
    const { removeItem } = loadService();
    const result = await removeItem(1, "user1", "venda", 10);
    expect(result).toEqual({ itemId: "venda", removed: 10, remaining: 0 });
  });

  it("lanza error si no hay suficientes items", async () => {
    const { removeItem } = loadService();
    await expect(removeItem(1, "user1", "venda", 20)).rejects.toThrow('No tienes suficientes "venda".');
  });

  it("lanza error si el item no existe en inventario", async () => {
    mocks.mockOrder.mockResolvedValue({ data: [], error: null });
    const { removeItem } = loadService();
    await expect(removeItem(1, "user1", "venda", 1)).rejects.toThrow('No tienes suficientes "venda".');
  });
});

describe("useItem", () => {
  const mockCharacter = {
    id: 1,
    name: "Kael",
    creatorId: "user1",
    hp_actual: 50,
    stats: { hp: 50 },
  };

  beforeEach(() => {
    const charService = require.cache[require.resolve("../src/services/characterService")];
    if (charService) {
      charService.exports.getActiveCharacter.mockResolvedValue(mockCharacter);
    }
    mocks.mockOrder.mockResolvedValue({ data: [{ item_id: "pocion", quantity: 2 }], error: null });
  });

  it("lanza error si no hay personaje activo", async () => {
    const charService = require.cache[require.resolve("../src/services/characterService")];
    charService.exports.getActiveCharacter.mockResolvedValue(null);
    const { useItem } = loadService();
    await expect(useItem("user1", "pocion")).rejects.toThrow("No tienes un personaje activo.");
  });

  it("lanza error si el item no existe", async () => {
    const { useItem } = loadService();
    await expect(useItem("user1", "inexistente")).rejects.toThrow('El ítem "inexistente" no existe.');
  });

  // All catalog items are consumable; no non-consumable items exist yet to test that path.

  it("lanza error si no tienes el item en inventario", async () => {
    mocks.mockOrder.mockResolvedValue({ data: [], error: null });
    const { useItem } = loadService();
    await expect(useItem("user1", "pocion")).rejects.toThrow('No tienes "Poción" en tu inventario.');
  });

  it("lanza error si el hp ya esta al maximo", async () => {
    const charService = require.cache[require.resolve("../src/services/characterService")];
    charService.exports.getActiveCharacter.mockResolvedValue({ ...mockCharacter, hp_actual: 100 });
    const { useItem } = loadService();
    await expect(useItem("user1", "pocion")).rejects.toThrow("Tu personaje ya tiene la vida al máximo.");
  });

  it("cura al personaje y descuenta el item", async () => {
    const { useItem } = loadService();
    const result = await useItem("user1", "pocion");
    expect(result).toMatchObject({
      characterId: 1,
      itemName: "Poción",
      hpBefore: 50,
      hpAfter: 90,
    });
    expect(result.modules).toEqual({ heal: { amount: 40 } });
    const charService = require.cache[require.resolve("../src/services/characterService")];
    expect(charService.exports.setHp).toHaveBeenCalledWith(
      expect.objectContaining({ creatorId: "user1", characterName: "Kael", hp: 90 }),
    );
  });

  it("no sobrepasa el maxHp al curar", async () => {
    const charService = require.cache[require.resolve("../src/services/characterService")];
    charService.exports.getActiveCharacter.mockResolvedValue({ ...mockCharacter, hp_actual: 95 });
    const { useItem } = loadService();
    const result = await useItem("user1", "pocion");
    expect(result.hpAfter).toBe(100);
  });

  it("elimina el item si era el ultimo", async () => {
    mocks.mockOrder.mockResolvedValue({ data: [{ item_id: "pocion", quantity: 1 }], error: null });
    const { useItem } = loadService();
    const result = await useItem("user1", "pocion");
    expect(result).toBeDefined();
    const charService = require.cache[require.resolve("../src/services/characterService")];
    expect(charService.exports.setHp).toHaveBeenCalled();
  });
});

describe("ensureTestKit", () => {
  it("agrega los 4 items si el inventario esta vacio", async () => {
    const { ensureTestKit } = loadService();
    const added = await ensureTestKit(1, "user1");
    expect(added).toEqual(["venda", "pocion", "tonico", "antidoto"]);
  });

  it("no agrega items que ya existen", async () => {
    mocks.mockOrder.mockResolvedValue({
      data: [
        { item_id: "venda", quantity: 1 },
        { item_id: "pocion", quantity: 2 },
      ],
      error: null,
    });
    const { ensureTestKit } = loadService();
    const added = await ensureTestKit(1, "user1");
    expect(added).toEqual(["tonico", "antidoto"]);
  });

  it("no agrega nada si ya existen todos", async () => {
    mocks.mockOrder.mockResolvedValue({
      data: [
        { item_id: "venda", quantity: 1 },
        { item_id: "pocion", quantity: 1 },
        { item_id: "tonico", quantity: 1 },
        { item_id: "antidoto", quantity: 1 },
      ],
      error: null,
    });
    const { ensureTestKit } = loadService();
    const added = await ensureTestKit(1, "user1");
    expect(added).toEqual([]);
  });

  it("continua si falla al agregar un item (logea error)", async () => {
    let callCount = 0;
    mocks.mockInsert.mockImplementation(async () => {
      callCount++;
      if (callCount === 1) return { error: new Error("insert failed") };
      return { error: null, data: null };
    });
    const { ensureTestKit } = loadService();
    const added = await ensureTestKit(1, "user1");
    expect(added.length).toBe(3);
  });
});
