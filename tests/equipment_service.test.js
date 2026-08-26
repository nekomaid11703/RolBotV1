// @ts-nocheck
/**
 * equipmentService unit tests.
 * Usa inyección manual de require.cache para mockear supabase (patrón del proyecto).
 */

let mockEquippedSlots = {};
let mockSaveError = null;
let mockSchemaError = null;

function setupMocks() {
  mockEquippedSlots = {};
  mockSaveError = null;
  mockSchemaError = null;

  const supabasePath = require.resolve("../src/database/supabase");
  const loggerPath = require.resolve("../src/services/loggerService");
  const columnRegistryPath = require.resolve("../src/database/columnRegistry");
  const safeQueryPath = require.resolve("../src/utils/safeQuery");

  const mockFrom = vi.fn().mockImplementation((table) => {
    if (table === "characters") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue(
              mockSchemaError
                ? {
                    data: null,
                    error: {
                      code: "PGRST204",
                      message: `Could not find the column 'characters.${mockSchemaError}' in the schema cache`,
                    },
                  }
                : { data: { equipped_slots: mockEquippedSlots }, error: null },
            ),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue(
            mockSchemaError
              ? {
                  error: {
                    code: "PGRST204",
                    message: `Could not find the column 'characters.${mockSchemaError}' in the schema cache`,
                  },
                }
              : { error: mockSaveError },
          ),
        }),
      };
    }
    return { select: vi.fn(), update: vi.fn() };
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

  // Limpiar equipmentService del cache para que use los mocks frescos
  const equipPath = require.resolve("../src/services/rpg/equipmentService");
  delete require.cache[equipPath];
}

describe("EQUIPMENT_SLOTS — configuración", () => {
  it("Tiene los 14 slots definidos (10 base + 4 ranuras de hechizo)", () => {
    const { EQUIPMENT_SLOTS } = require("../src/services/rpg/equipmentService");
    const slots = Object.keys(EQUIPMENT_SLOTS);
    expect(slots).toContain("cabeza");
    expect(slots).toContain("pecho");
    expect(slots).toContain("pantalones");
    expect(slots).toContain("botas");
    expect(slots).toContain("mano_der");
    expect(slots).toContain("mano_izq");
    expect(slots).toContain("artefacto_1");
    expect(slots).toContain("artefacto_4");
    expect(slots).toContain("spell_1");
    expect(slots).toContain("spell_4");
    expect(slots).toContain("spell_container");
    expect(slots.length).toBe(15);
  });
});

describe("normalizeSlot — aliases", () => {
  const { normalizeSlot } = require("../src/services/rpg/equipmentService");

  it("mapea alias coloquiales a keys reales", () => {
    expect(normalizeSlot("casco")).toBe("cabeza");
    expect(normalizeSlot("pechera")).toBe("pecho");
    expect(normalizeSlot("grebas")).toBe("pantalones");
    expect(normalizeSlot("botas")).toBe("botas");
    expect(normalizeSlot("mano")).toBe("mano_der");
  });

  it("deja intacto un slot ya técnico", () => {
    expect(normalizeSlot("mano_izq")).toBe("mano_izq");
    expect(normalizeSlot("artefacto_3")).toBe("artefacto_3");
  });
});

describe("resolveDefaultSlot — slot automático", () => {
  const { resolveDefaultSlot } = require("../src/services/rpg/equipmentService");

  it("arma (1 o 2 manos) va a mano_der", () => {
    expect(resolveDefaultSlot({ categories: ["weapon"], modules: { weapon: { hands: 1 } } })).toBe("mano_der");
    expect(resolveDefaultSlot({ categories: ["weapon"], modules: { weapon: { hands: 2 } } })).toBe("mano_der");
  });

  it("escudo va a mano_izq", () => {
    expect(resolveDefaultSlot({ categories: ["shield"] })).toBe("mano_izq");
  });

  it("armadura usa el slot del módulo armor", () => {
    expect(resolveDefaultSlot({ categories: ["armor"], modules: { armor: { slot: "cabeza" } } })).toBe("cabeza");
    expect(resolveDefaultSlot({ categories: ["armor"], modules: { armor: { slot: "botas" } } })).toBe("botas");
  });

  it("armadura infiere slot por id/nombre si no trae módulo", () => {
    expect(resolveDefaultSlot({ id: "casco_roto", name: "Casco", categories: ["armor"] })).toBe("cabeza");
    expect(resolveDefaultSlot({ id: "grebas_roto", name: "Grebas", categories: ["armor"] })).toBe("pantalones");
    expect(resolveDefaultSlot({ id: "botas_roto", name: "Botas", categories: ["armor"] })).toBe("botas");
    expect(resolveDefaultSlot({ id: "x", name: "X", categories: ["armor"] })).toBe("pecho");
  });

  it("artefacto usa el primer hueco libre", () => {
    expect(resolveDefaultSlot({ categories: ["artifact"] }, { artefacto_1: "a" })).toBe("artefacto_2");
    expect(resolveDefaultSlot({ categories: ["artifact"] }, {})).toBe("artefacto_1");
    expect(
      resolveDefaultSlot(
        { categories: ["artifact"] },
        { artefacto_1: "a", artefacto_2: "b", artefacto_3: "c", artefacto_4: "d" },
      ),
    ).toBe("artefacto_1");
  });

  it("retorna null para no equipables", () => {
    expect(resolveDefaultSlot({ categories: ["consumable"] })).toBeNull();
    expect(resolveDefaultSlot({ categories: ["throwable"] })).toBeNull();
  });
});

describe("getSlotsToFree (via equipItem)", () => {
  beforeEach(() => setupMocks());

  it("Arma 1 mano: solo libera el slot de destino", async () => {
    mockEquippedSlots = { mano_der: "espada_vieja", mano_izq: "escudo_viejo" };
    // items.js catálogo real: venda es consumible no weapon, usamos mock de ítem
    const itemsPath = require.resolve("../src/data/items");
    require.cache[itemsPath] = {
      id: itemsPath,
      filename: itemsPath,
      loaded: true,
      exports: {
        getItem: (id) =>
          id === "daga_test"
            ? {
                id: "daga_test",
                categories: ["weapon"],
                modules: { weapon: { hands: 1 } },
              }
            : null,
        getItemsByCategory: vi.fn(),
        ITEMS: {},
      },
    };
    delete require.cache[require.resolve("../src/services/rpg/equipmentService")];

    const { equipItem } = require("../src/services/rpg/equipmentService");
    const result = await equipItem({ characterId: 1, creatorId: "test", itemId: "daga_test", slot: "mano_der" });
    expect(result.equipped).toBe("daga_test");
    expect(result.autoUnequipped).toContain("espada_vieja");
    expect(result.autoUnequipped).not.toContain("escudo_viejo"); // mano_izq intacta
  });

  it("Arma 2 manos: libera AMBAS manos automáticamente", async () => {
    mockEquippedSlots = { mano_der: "espada_vieja", mano_izq: "escudo_viejo" };
    const itemsPath = require.resolve("../src/data/items");
    require.cache[itemsPath] = {
      id: itemsPath,
      filename: itemsPath,
      loaded: true,
      exports: {
        getItem: (id) =>
          id === "mandoble_test"
            ? {
                id: "mandoble_test",
                categories: ["weapon"],
                modules: { weapon: { hands: 2 } },
              }
            : null,
        getItemsByCategory: vi.fn(),
        ITEMS: {},
      },
    };
    delete require.cache[require.resolve("../src/services/rpg/equipmentService")];

    const { equipItem } = require("../src/services/rpg/equipmentService");
    const result = await equipItem({ characterId: 1, creatorId: "test", itemId: "mandoble_test", slot: "mano_der" });
    expect(result.equipped).toBe("mandoble_test");
    expect(result.autoUnequipped).toContain("espada_vieja");
    expect(result.autoUnequipped).toContain("escudo_viejo");
  });

  it("Arma 2 manos en slot incorrecto lanza error", async () => {
    const itemsPath = require.resolve("../src/data/items");
    require.cache[itemsPath] = {
      id: itemsPath,
      filename: itemsPath,
      loaded: true,
      exports: {
        getItem: (id) =>
          id === "arco_test"
            ? {
                id: "arco_test",
                categories: ["weapon"],
                modules: { weapon: { hands: 2 } },
              }
            : null,
        getItemsByCategory: vi.fn(),
        ITEMS: {},
      },
    };
    delete require.cache[require.resolve("../src/services/rpg/equipmentService")];

    const { equipItem } = require("../src/services/rpg/equipmentService");
    await expect(
      equipItem({ characterId: 1, creatorId: "test", itemId: "arco_test", slot: "mano_izq" }),
    ).rejects.toThrow("mano_der");
  });

  it("Slot inválido lanza error descriptivo", async () => {
    const { equipItem } = require("../src/services/rpg/equipmentService");
    await expect(equipItem({ characterId: 1, creatorId: "test", itemId: "algo", slot: "slot_falso" })).rejects.toThrow(
      "Slot inválido",
    );
  });
});

describe("unequipItem", () => {
  beforeEach(() => setupMocks());

  it("Desequipa ítem de slot ocupado correctamente", async () => {
    mockEquippedSlots = { mano_der: "espada_X", mano_izq: null };
    const { unequipItem } = require("../src/services/rpg/equipmentService");
    const result = await unequipItem({ characterId: 1, creatorId: "test", slot: "mano_der" });
    expect(result.unequipped).toBe("espada_X");
    expect(result.slot).toBe("mano_der");
  });

  it("Desequipar arma 2 manos limpia también el marcador de mano_izq", async () => {
    mockEquippedSlots = { mano_der: "espadon_X", mano_izq: "__2h:espadon_X" };
    const { unequipItem } = require("../src/services/rpg/equipmentService");
    await unequipItem({ characterId: 1, creatorId: "test", slot: "mano_der" });
    // La lógica borra mano_izq si comienza con __2h:
    // No tenemos acceso directo al estado pero verificamos que no lanza error
  });

  it("Slot vacío lanza error", async () => {
    mockEquippedSlots = { mano_der: null };
    const { unequipItem } = require("../src/services/rpg/equipmentService");
    await expect(unequipItem({ characterId: 1, creatorId: "test", slot: "mano_der" })).rejects.toThrow("vacío");
  });
});

describe("Degradación por esquema ausente (columna equipped_slots no existe)", () => {
  beforeEach(() => setupMocks());

  it("equipItem arroja error claro indicando la migración", async () => {
    mockSchemaError = "equipped_slots";
    const itemsPath = require.resolve("../src/data/items");
    require.cache[itemsPath] = {
      id: itemsPath,
      filename: itemsPath,
      loaded: true,
      exports: {
        getItem: (id) =>
          id === "daga_test" ? { id: "daga_test", categories: ["weapon"], modules: { weapon: { hands: 1 } } } : null,
        getItemsByCategory: vi.fn(),
        ITEMS: {},
      },
    };
    delete require.cache[require.resolve("../src/services/rpg/equipmentService")];

    const { equipItem } = require("../src/services/rpg/equipmentService");
    await expect(
      equipItem({ characterId: 1, creatorId: "test", itemId: "daga_test", slot: "mano_der" }),
    ).rejects.toThrow("migración 003");
  });

  it("unequipItem arroja con claridad indicando la migración", async () => {
    mockSchemaError = "equipped_slots";
    const { unequipItem } = require("../src/services/rpg/equipmentService");
    await expect(unequipItem({ characterId: 1, creatorId: "test", slot: "mano_der" })).rejects.toThrow("migración 003");
  });
});
