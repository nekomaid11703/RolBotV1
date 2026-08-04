// @ts-nocheck
/**
 * equipmentResolverService unit tests: equipped_slots + inventory.metadata →
 * payload de combate (weaponInfo / armorDurability).
 */

let mockSlots = {};
let mockInventory = [];

function setupMocks() {
  mockSlots = {};
  mockInventory = [];

  const supabasePath = require.resolve("../src/database/supabase");
  const loggerPath = require.resolve("../src/services/loggerService");
  const columnRegistryPath = require.resolve("../src/database/columnRegistry");
  const safeQueryPath = require.resolve("../src/utils/safeQuery");

  const mockFrom = vi.fn().mockImplementation((table) => {
    if (table === "characters") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { equipped_slots: mockSlots }, error: null }),
          }),
        }),
        update: vi.fn(),
      };
    }
    if (table === "inventory") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockInventory, error: null }),
          }),
        }),
        update: vi.fn(),
        delete: vi.fn(),
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

  // Catálogo sintético con 2 piezas de armadura y 1 arma (misma forma que data/items)
  const itemsPath = require.resolve("../src/data/items");
  require.cache[itemsPath] = {
    id: itemsPath,
    filename: itemsPath,
    loaded: true,
    exports: {
      getItem: (id) => ({ espada_mano, pechera_hierro, amuleto_guardian })[id] || null,
      getItemsByCategory: vi.fn(),
      ITEMS: {},
    },
  };

  delete require.cache[require.resolve("../src/services/rpg/equipmentService")];
  delete require.cache[require.resolve("../src/services/rpg/equipmentResolverService")];
}

const espada_mano = {
  id: "espada_mano",
  type: "weapon",
  categories: ["weapon"],
  material: "acero",
  tier: "B",
  modules: { weapon: { damageNature: "cortante", hands: 1, baseDamage: 20 } },
};

const pechera_hierro = {
  id: "pechera_hierro",
  type: "armor",
  categories: ["armor"],
  material: "hierro",
  tier: "C",
  modules: { armor: { slot: "pecho", coverage: "alta" } },
};

const amuleto_guardian = {
  id: "amuleto_guardian",
  type: "artifact",
  categories: ["artifact"],
  modules: { buff: { stats: { atk: 5 } } },
};

describe("resolveAttackerWeapon", () => {
  beforeEach(() => setupMocks());

  it("Devuelve weaponInfo del arma equipada en mano_der", async () => {
    mockSlots = { mano_der: "espada_mano" };
    mockInventory = [{ item_id: "espada_mano", quantity: 1, metadata: {} }];
    const { resolveAttackerWeapon } = require("../src/services/rpg/equipmentResolverService");
    const weapon = await resolveAttackerWeapon({ id: 1 });
    expect(weapon).not.toBeNull();
    expect(weapon.damageNature).toBe("cortante");
    expect(weapon.baseDamage).toBeGreaterThan(0);
  });

  it("Devuelve null sin arma equipada (backward-compat)", async () => {
    mockSlots = {};
    const { resolveAttackerWeapon } = require("../src/services/rpg/equipmentResolverService");
    expect(await resolveAttackerWeapon({ id: 1 })).toBeNull();
  });
});

describe("resolveDefenderArmor", () => {
  beforeEach(() => setupMocks());

  it("Construye DurabilityModule por pieza con metadata", async () => {
    mockSlots = { pecho: "pechera_hierro" };
    mockInventory = [
      { item_id: "pechera_hierro", quantity: 1, metadata: { durability: { maxResist: 80, currentResist: 40, isRepairable: true } } },
    ];
    const { resolveDefenderArmor } = require("../src/services/rpg/equipmentResolverService");
    const armor = await resolveDefenderArmor(1);
    expect(armor.list.length).toBe(1);
    expect(armor.totalMaxResist).toBe(80);
    expect(armor.totalCurrentResist).toBe(40);
  });

  it("Sin armadura devuelve totales a 0", async () => {
    mockSlots = {};
    const { resolveDefenderArmor } = require("../src/services/rpg/equipmentResolverService");
    const armor = await resolveDefenderArmor(1);
    expect(armor.list.length).toBe(0);
    expect(armor.totalMaxResist).toBe(0);
  });
});

describe("resolveArtifacts", () => {
  beforeEach(() => setupMocks());

  it("Recoge buffs de artefactos equipados", async () => {
    mockSlots = { artefacto_1: "amuleto_guardian" };
    mockInventory = [{ item_id: "amuleto_guardian", quantity: 1, metadata: {} }];
    const { resolveArtifacts } = require("../src/services/rpg/equipmentResolverService");
    const artifacts = await resolveArtifacts({ id: 1 });
    expect(artifacts.length).toBe(1);
    expect(artifacts[0].buffs).toEqual({ atk: 5 });
  });
});