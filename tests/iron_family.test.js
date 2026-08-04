// @ts-nocheck
/**
 * Familia del Hierro — validación end-to-end de las primeras definiciones:
 * factory, estadísticas, puente getItem, set bonus y arma no equipable.
 */

const { IRON_ITEMS, IRON_STATS } = require("../src/data/ironFamily");
const { getItem, getItemsByCategory } = require("../src/data/items");
const { buildItem } = require("../src/services/rpg/itemFactory");
const { getWeaponStats, getArmorStats } = require("../src/services/rpg/itemStatService");
const { resolveSetBonuses } = require("../src/services/rpg/armorSetService");
const { ARMOR_SETS, getSet } = require("../src/data/armorSets");
const { EQUIPMENT_SLOTS } = require("../src/services/rpg/equipmentService");

describe("IRON_STATS — material hierro", () => {
  it("Expone las 4 estadísticas base del hierro", () => {
    expect(IRON_STATS).toEqual({
      afilabilidad: 45,
      conduccion_magica: 20,
      resistencia_material: 55,
      flexibilidad: 25,
    });
  });
});

describe("Familia del hierro — definiciones", () => {
  it("Registra las 7 definiciones (1 arma + 4 armadura + 1 artefacto + 1 arrojadiza)", () => {
    expect(Object.keys(IRON_ITEMS)).toHaveLength(7);
  });

  it("Todas las definiciones se construyen sin errores (factory)", () => {
    for (const [id, def] of Object.entries(IRON_ITEMS)) {
      expect(def.id).toBe(id);
      expect(def.material).toBe("hierro");
      expect(def.metadata.tier).toBe("E");
    }
  });

  it("getItem resuelve la familia a través del puente del catálogo", () => {
    expect(getItem("espada_de_hierro").id).toBe("espada_de_hierro");
    expect(getItem("kunai_de_hierro").id).toBe("kunai_de_hierro");
    expect(getItem("no_existe")).toBeNull();
  });

  it("getItemsByCategory mantiene el catálogo base (no contamina)", () => {
    expect(getItemsByCategory("weapon")).toHaveLength(0);
  });
});

describe("Espada de Hierro (arma equipable)", () => {
  const def = IRON_ITEMS.espada_de_hierro;

  it("Deriva durabilidad desde la resistencia del hierro", () => {
    expect(def.metadata.durability.maxResist).toBeGreaterThan(0);
    expect(def.metadata.durability.currentResist).toBe(def.metadata.durability.maxResist);
  });

  it("getWeaponStats resuelve cortante/1 mano con daño base > 0", () => {
    const stats = getWeaponStats(def);
    expect(stats.damageNature).toBe("cortante");
    expect(stats.hands).toBe(1);
    expect(stats.baseDamage).toBeGreaterThan(0);
  });

  it("buildItem instancia un Entity con módulo weapon", () => {
    const entity = buildItem("espada_de_hierro");
    expect(entity.modules.map((m) => m.constructor.type)).toContain("weapon");
  });
});

describe("Set de armadura de hierro", () => {
  it("Las 4 piezas pertenecen a set_hierro con slots correctos", () => {
    const slots = {
      casco_de_hierro: "cabeza",
      pechera_de_hierro: "pecho",
      grebas_de_hierro: "pantalones",
      botas_de_hierro: "botas",
    };
    for (const [id, slot] of Object.entries(slots)) {
      const stats = getArmorStats(IRON_ITEMS[id]);
      expect(stats.slot).toBe(slot);
      expect(stats.setId).toBe("set_hierro");
      expect(stats.maxResist).toBeGreaterThan(0);
    }
  });

  it("Con ≥3 piezas se activa el bono del set", () => {
    const parts = ["casco", "pechera", "grebas", "botas"].map((k) => IRON_ITEMS[k + "_de_hierro"]);
    const result = resolveSetBonuses(parts, ARMOR_SETS);
    const set = result.find((r) => r.setId === "set_hierro");
    expect(set.count).toBe(4);
    expect(set.active).toBe(true);
    expect(set.bonus).toEqual({ def: 10 });
  });

  it("getSet devuelve la definición del set", () => {
    expect(getSet("set_hierro").bonus).toEqual({ def: 10 });
    expect(getSet("set_inexistente")).toBeNull();
  });
});

describe("Amuleto de Hierro (artefacto)", () => {
  it("Porta buff de ataque +5", () => {
    const buff = IRON_ITEMS.amuleto_de_hierro.modules.buff;
    expect(buff.stats).toEqual({ atk: 5 });
  });
});

describe("Kunai de Hierro (arma no equipable / arrojadiza)", () => {
  const def = IRON_ITEMS.kunai_de_hierro;

  it("Es tipo throwable, apilable y sin durabilidad persistente", () => {
    expect(def.type).toBe("throwable");
    expect(def.maxStack).toBeGreaterThan(1);
    expect(def.metadata.durability).toBeUndefined();
  });

  it("No es equipable en ningún slot", () => {
    for (const slot of Object.keys(EQUIPMENT_SLOTS)) {
      expect(EQUIPMENT_SLOTS[slot].accepts).not.toContain("throwable");
    }
  });

  it("buildItem instancia un Entity con módulo throwable", () => {
    const entity = buildItem("kunai_de_hierro");
    expect(entity.modules.map((m) => m.constructor.type)).toContain("throwable");
  });

  it("El disparo Throw devuelve payload perforante que consume la pieza", () => {
    const entity = buildItem("kunai_de_hierro");
    const [throwResult] = entity.trigger("Throw", {});
    expect(throwResult.result.damageNature).toBe("perforante");
    expect(throwResult.result.baseDamage).toBe(14);
    expect(throwResult.result.consumedOnUse).toBe(true);
  });
});

describe("Resolución de equipo (puente real al catálogo)", () => {
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
      exports: { filterExisting: vi.fn((_t, p) => p) },
    };
    require.cache[safeQueryPath] = {
      id: safeQueryPath,
      filename: safeQueryPath,
      loaded: true,
      exports: { invalidateUserCache: vi.fn() },
    };

    delete require.cache[require.resolve("../src/services/rpg/equipmentService")];
    delete require.cache[require.resolve("../src/services/rpg/equipmentResolverService")];
  }

  beforeEach(() => setupMocks());

  it("Espada equipada en mano_der → weaponInfo de combate", async () => {
    mockSlots = { mano_der: "espada_de_hierro" };
    mockInventory = [{ item_id: "espada_de_hierro", quantity: 1, metadata: IRON_ITEMS.espada_de_hierro.metadata }];
    const { resolveAttackerWeapon } = require("../src/services/rpg/equipmentResolverService");
    const weapon = await resolveAttackerWeapon({ id: 1 });
    expect(weapon).not.toBeNull();
    expect(weapon.damageNature).toBe("cortante");
    expect(weapon.baseDamage).toBeGreaterThan(0);
  });

  it("Pechera equipada con metadata → DurabilityModule de la pieza", async () => {
    mockSlots = { pecho: "pechera_de_hierro" };
    mockInventory = [
      {
        item_id: "pechera_de_hierro",
        quantity: 1,
        metadata: { durability: { maxResist: 62, currentResist: 30, isRepairable: true } },
      },
    ];
    const { resolveDefenderArmor } = require("../src/services/rpg/equipmentResolverService");
    const armor = await resolveDefenderArmor(1);
    expect(armor.list.length).toBe(1);
    expect(armor.totalMaxResist).toBe(62);
    expect(armor.totalCurrentResist).toBe(30);
  });
});
