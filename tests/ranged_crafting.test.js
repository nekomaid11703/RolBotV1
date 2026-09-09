// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRequire } from "module";

const _require = createRequire(import.meta.url);

const inventoryService = _require("../src/services/rpg/inventoryService");
const itemsModule = _require("../src/data/items");

vi.mock("../../src/database/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));
vi.mock("../../src/utils/safeQuery", () => ({ invalidateUserCache: vi.fn() }));

const { CRAFTING_RECIPES, normalizeRecipeKey, craftEquipment } = _require("../src/services/rpg/craftingService");

const TEST_CATALOG = {
  trozo_de_acero: { id: "trozo_de_acero", name: "Trozo de Hierro", categories: ["material"] },
  arco_de_acero: { id: "arco_de_acero", name: "Arco de Hierro", categories: ["weapon"] },
  ballesta_de_mitril: { id: "ballesta_de_mitril", name: "Ballesta de Mitril", categories: ["weapon"] },
  resortera_de_madera: { id: "resortera_de_madera", name: "Resortera de Madera", categories: ["weapon"] },
  cerbatana_de_piedra: { id: "cerbatana_de_piedra", name: "Cerbatana de Hueso", categories: ["weapon"] },
  flechas_de_acero: { id: "flechas_de_acero", name: "Flechas de Hierro", categories: ["projectile", "ammo"] },
  virotes_de_obsidiana: {
    id: "virotes_de_obsidiana",
    name: "Virotes de Obsidiana",
    categories: ["projectile", "ammo"],
  },
  balines_de_madera: { id: "balines_de_madera", name: "Balines de Madera", categories: ["projectile", "ammo"] },
  dardos_de_piedra: { id: "dardos_de_piedra", name: "Dardos de Hueso", categories: ["projectile", "ammo"] },
};

describe("craftingService — ranged weapons & ammunition", () => {
  it("CRAFTING_RECIPES tiene recetas de armas a distancia correctas", () => {
    expect(CRAFTING_RECIPES.arco.materialCost).toBe(2);
    expect(CRAFTING_RECIPES.ballesta.materialCost).toBe(3);
    expect(CRAFTING_RECIPES.resortera.materialCost).toBe(1);
    expect(CRAFTING_RECIPES.cerbatana.materialCost).toBe(1);

    expect(CRAFTING_RECIPES.arco.baseType).toBe("arco");
    expect(CRAFTING_RECIPES.ballesta.baseType).toBe("ballesta");
    expect(CRAFTING_RECIPES.resortera.baseType).toBe("resortera");
    expect(CRAFTING_RECIPES.cerbatana.baseType).toBe("cerbatana");
  });

  it("CRAFTING_RECIPES tiene recetas de munición con producedQuantity: 16", () => {
    for (const key of ["flechas", "virotes", "balines", "dardos"]) {
      const r = CRAFTING_RECIPES[key];
      expect(r).toBeDefined();
      expect(r.materialCost).toBe(1);
      expect(r.producedQuantity).toBe(16);
    }
  });

  it("normalizeRecipeKey resuelve aliases de munición", () => {
    expect(normalizeRecipeKey("flecha")).toBe("flechas");
    expect(normalizeRecipeKey("virote")).toBe("virotes");
    expect(normalizeRecipeKey("balin")).toBe("balines");
    expect(normalizeRecipeKey("dardo")).toBe("dardos");
  });

  it("normalizeRecipeKey resuelve aliases de armas a distancia", () => {
    expect(normalizeRecipeKey("arco")).toBe("arco");
    expect(normalizeRecipeKey("ballesta")).toBe("ballesta");
    expect(normalizeRecipeKey("resortera")).toBe("resortera");
    expect(normalizeRecipeKey("cerbatana")).toBe("cerbatana");
  });
});

describe("craftingService — ranged craftEquipment", () => {
  let spyGet, spyRemove, spyAdd, spyGetItem;

  beforeEach(() => {
    spyGet = vi.spyOn(inventoryService, "getInventoryList").mockResolvedValue([]);
    spyRemove = vi.spyOn(inventoryService, "removeItem").mockResolvedValue({ success: true });
    spyAdd = vi.spyOn(inventoryService, "addItem").mockResolvedValue({ success: true });
    spyGetItem = vi.spyOn(itemsModule, "getItem").mockImplementation((id) => TEST_CATALOG[id] || null);
  });

  afterEach(() => vi.restoreAllMocks());

  it("forja un arco de hierro consumiendo 2 unidades", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_acero", quantity: 5, metadata: { tier: "E" } }]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "arco",
      materialId: "acero",
      tier: "E",
    });

    expect(res.craftedItem.id).toBe("arco_de_acero");
    expect(res.materialCost).toBe(2);
    expect(res.tier).toBe("E");
    expect(spyRemove).toHaveBeenCalledWith(1, "u1", "trozo_de_acero", 2, "legacy");
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "arco_de_acero", 1, { tier: "E", crafted: true });
  });

  it("forja una ballesta de mitril consumiendo 3 unidades", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_mitril", quantity: 5, metadata: { tier: "A" } }]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "ballesta",
      materialId: "mitril",
      tier: "A",
    });

    expect(res.craftedItem.id).toBe("ballesta_de_mitril");
    expect(res.materialCost).toBe(3);
    expect(res.tier).toBe("A");
    expect(spyRemove).toHaveBeenCalledWith(1, "u1", "trozo_de_mitril", 3, "legacy");
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "ballesta_de_mitril", 1, { tier: "A", crafted: true });
  });

  it("forja una resortera de madera consumiendo 1 unidad", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_madera", quantity: 3, metadata: { tier: "E" } }]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "resortera",
      materialId: "madera",
      tier: "E",
    });

    expect(res.craftedItem.id).toBe("resortera_de_madera");
    expect(res.materialCost).toBe(1);
    expect(spyRemove).toHaveBeenCalledWith(1, "u1", "trozo_de_madera", 1, "legacy");
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "resortera_de_madera", 1, { tier: "E", crafted: true });
  });

  it("forja una cerbatana de hueso consumiendo 1 unidad", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_piedra", quantity: 2, metadata: { tier: "E" } }]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "cerbatana",
      materialId: "piedra",
      tier: "E",
    });

    expect(res.craftedItem.id).toBe("cerbatana_de_piedra");
    expect(res.materialCost).toBe(1);
    expect(spyRemove).toHaveBeenCalledWith(1, "u1", "trozo_de_piedra", 1, "legacy");
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "cerbatana_de_piedra", 1, { tier: "E", crafted: true });
  });

  it("forja flechas de hierro y produce 16 unidades", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_acero", quantity: 3, metadata: { tier: "E" } }]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "flechas",
      materialId: "acero",
      tier: "E",
    });

    expect(res.craftedItem.id).toBe("flechas_de_acero");
    expect(res.materialCost).toBe(1);
    expect(res.producedQuantity).toBe(16);
    expect(spyRemove).toHaveBeenCalledWith(1, "u1", "trozo_de_acero", 1, "legacy");
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "flechas_de_acero", 16, { tier: "E", crafted: true });
  });

  it("forja virotes de obsidiana y produce 16 unidades", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_obsidiana", quantity: 2, metadata: { tier: "C" } }]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "virotes",
      materialId: "obsidiana",
      tier: "C",
    });

    expect(res.craftedItem.id).toBe("virotes_de_obsidiana");
    expect(res.producedQuantity).toBe(16);
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "virotes_de_obsidiana", 16, { tier: "C", crafted: true });
  });

  it("forja balines de madera y produce 16 unidades", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_madera", quantity: 2, metadata: { tier: "E" } }]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "balines",
      materialId: "madera",
      tier: "E",
    });

    expect(res.craftedItem.id).toBe("balines_de_madera");
    expect(res.producedQuantity).toBe(16);
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "balines_de_madera", 16, { tier: "E", crafted: true });
  });

  it("forja dardos de hueso y produce 16 unidades", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_piedra", quantity: 4, metadata: { tier: "D" } }]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "dardos",
      materialId: "piedra",
      tier: "D",
    });

    expect(res.craftedItem.id).toBe("dardos_de_piedra");
    expect(res.producedQuantity).toBe(16);
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "dardos_de_piedra", 16, { tier: "D", crafted: true });
  });

  it("lanza error al forjar munición sin material suficiente", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_acero", quantity: 0, metadata: { tier: "E" } }]);

    await expect(
      craftEquipment({ characterId: 1, creatorId: "u1", recipeType: "flechas", materialId: "acero", tier: "E" }),
    ).rejects.toThrow(/necesitas/i);
  });

  it("lanza error al forjar arma a distancia sin material suficiente", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_acero", quantity: 1, metadata: { tier: "E" } }]);

    await expect(
      craftEquipment({ characterId: 1, creatorId: "u1", recipeType: "arco", materialId: "acero", tier: "E" }),
    ).rejects.toThrow(/necesitas/i);
  });
});
