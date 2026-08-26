// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRequire } from "module";

// createRequire nos da el require() de Node.js desde un contexto ESM.
// Esto devuelve el MISMO objeto CJS que craftingService captura internamente,
// lo que permite que vi.spyOn mute la referencia correcta.
const _require = createRequire(import.meta.url);

// Cargar los módulos CJS reales ANTES de los mocks para evitar que vi.mock
// los intercepte en el nivel de require (ya que en CJS se cachean globalmente)
const inventoryService = _require("../src/services/rpg/inventoryService");
const itemsModule = _require("../src/data/items");

// Mocks mínimos para evitar conexión real a Supabase
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

const {
  NEXT_TIER,
  CRAFTING_RECIPES,
  normalizeMaterialId,
  normalizeRecipeKey,
  refineMaterial,
  craftEquipment,
} = _require("../src/services/rpg/craftingService");

// ── Catálogo de ítems de prueba ───────────────────────────────────────────────
const TEST_CATALOG = {
  lingote_de_hierro: { id: "lingote_de_hierro", name: "Lingote de Hierro", categories: ["material"] },
  espada_de_hierro: { id: "espada_de_hierro", name: "Espada de Hierro", categories: ["weapon"] },
  pechera_de_hierro: { id: "pechera_de_hierro", name: "Pechera de Hierro", categories: ["armor"] },
  pechera_de_mitril: { id: "pechera_de_mitril", name: "Pechera de Mitril", categories: ["armor"] },
  baculo_de_mitril: { id: "baculo_de_mitril", name: "Báculo de Mitril", categories: ["weapon"] },
  varita_de_mitril: { id: "varita_de_mitril", name: "Varita de Mitril", categories: ["weapon"] },
  grimorio_de_mitril: { id: "grimorio_de_mitril", name: "Grimorio Arcano de Mitril", categories: ["spell_container"] },
};

// ── Tests de constantes ───────────────────────────────────────────────────────
describe("craftingService — constantes y helpers", () => {
  it("NEXT_TIER cubre la cadena completa E→D→C→B→A→S→N", () => {
    expect(NEXT_TIER["E"]).toBe("D");
    expect(NEXT_TIER["D"]).toBe("C");
    expect(NEXT_TIER["C"]).toBe("B");
    expect(NEXT_TIER["B"]).toBe("A");
    expect(NEXT_TIER["A"]).toBe("S");
    expect(NEXT_TIER["S"]).toBe("N");
    expect(NEXT_TIER["N"]).toBeUndefined();
  });

  it("CRAFTING_RECIPES tiene costes correctos por categoría", () => {
    expect(CRAFTING_RECIPES.varita.materialCost).toBe(1);
    expect(CRAFTING_RECIPES.baculo.materialCost).toBe(2);
    expect(CRAFTING_RECIPES.grimorio.materialCost).toBe(2);
    expect(CRAFTING_RECIPES.tunica.materialCost).toBe(2);
    expect(CRAFTING_RECIPES.espada.materialCost).toBe(2);
    expect(CRAFTING_RECIPES.maza.materialCost).toBe(2);
    expect(CRAFTING_RECIPES.espada_larga.materialCost).toBe(3);
    expect(CRAFTING_RECIPES.pechera.materialCost).toBe(3);
    expect(CRAFTING_RECIPES.escudo.materialCost).toBe(3);
  });

  it("normalizeMaterialId resuelve por clave y por nombre", () => {
    expect(normalizeMaterialId("hierro")).toBe("hierro");
    expect(normalizeMaterialId("Hierro")).toBe("hierro");
    expect(normalizeMaterialId("no_existe")).toBeNull();
  });

  it("normalizeRecipeKey resuelve recetas válidas", () => {
    expect(normalizeRecipeKey("espada")).toBe("espada");
    expect(normalizeRecipeKey("tunica")).toBe("tunica");
    expect(normalizeRecipeKey("receta_inexistente")).toBeNull();
  });
});

// ── Tests de refineMaterial ───────────────────────────────────────────────────
describe("craftingService — refineMaterial", () => {
  let spyGet, spyRemove, spyAdd;

  beforeEach(() => {
    // spyOn sobre el objeto CJS real — misma referencia que craftingService usa
    spyGet = vi.spyOn(inventoryService, "getInventoryList").mockResolvedValue([]);
    spyRemove = vi.spyOn(inventoryService, "removeItem").mockResolvedValue({ success: true });
    spyAdd = vi.spyOn(inventoryService, "addItem").mockResolvedValue({ success: true });
    vi.spyOn(itemsModule, "getItem").mockImplementation((id) => TEST_CATALOG[id] || null);
  });

  afterEach(() => vi.restoreAllMocks());

  it("consume 2 unidades Tier E y produce 1 unidad Tier D", async () => {
    spyGet.mockResolvedValue([
      { itemId: "lingote_de_hierro", quantity: 5, metadata: { tier: "E" } },
    ]);

    const res = await refineMaterial({ characterId: 1, creatorId: "u1", materialId: "hierro", tier: "E", amount: 1 });

    expect(res.sourceTier).toBe("E");
    expect(res.targetTier).toBe("D");
    expect(res.consumedAmount).toBe(2);
    expect(res.producedAmount).toBe(1);
    expect(spyRemove).toHaveBeenCalledWith(expect.objectContaining({ quantity: 2 }));
    expect(spyAdd).toHaveBeenCalledWith(expect.objectContaining({ quantity: 1, metadata: { tier: "D" } }));
  });

  it("lanza error si no hay suficientes materiales", async () => {
    spyGet.mockResolvedValue([
      { itemId: "lingote_de_hierro", quantity: 1, metadata: { tier: "E" } },
    ]);

    await expect(
      refineMaterial({ characterId: 1, creatorId: "u1", materialId: "hierro", tier: "E", amount: 1 }),
    ).rejects.toThrow(/necesitas/i);
  });

  it("lanza error al intentar refinar Tier N (techo máximo)", async () => {
    await expect(
      refineMaterial({ characterId: 1, creatorId: "u1", materialId: "hierro", tier: "N", amount: 1 }),
    ).rejects.toThrow(/nirvana|máximo/i);
  });

  it("lanza error si el material no existe", async () => {
    await expect(
      refineMaterial({ characterId: 1, creatorId: "u1", materialId: "adamantio_falso", tier: "E" }),
    ).rejects.toThrow();
  });
});

// ── Tests de craftEquipment ───────────────────────────────────────────────────
describe("craftingService — craftEquipment", () => {
  let spyGet, spyRemove, spyAdd, spyGetItem;

  beforeEach(() => {
    spyGet = vi.spyOn(inventoryService, "getInventoryList").mockResolvedValue([]);
    spyRemove = vi.spyOn(inventoryService, "removeItem").mockResolvedValue({ success: true });
    spyAdd = vi.spyOn(inventoryService, "addItem").mockResolvedValue({ success: true });
    spyGetItem = vi.spyOn(itemsModule, "getItem").mockImplementation((id) => TEST_CATALOG[id] || null);
  });

  afterEach(() => vi.restoreAllMocks());

  it("forja una espada de hierro consumiendo 2 unidades Tier E", async () => {
    spyGet.mockResolvedValue([
      { itemId: "lingote_de_hierro", quantity: 5, metadata: { tier: "E" } },
    ]);

    const res = await craftEquipment({ characterId: 1, creatorId: "u1", recipeType: "espada", materialId: "hierro", tier: "E" });

    expect(res.craftedItem.id).toBe("espada_de_hierro");
    expect(res.materialCost).toBe(2);
    expect(res.tier).toBe("E");
    expect(spyRemove).toHaveBeenCalledWith(expect.objectContaining({ quantity: 2 }));
  });

  it("forja una túnica de mago consumiendo solo 2 unidades (equipo mágico asequible)", async () => {
    spyGet.mockResolvedValue([
      { itemId: "lingote_de_mitril", quantity: 4, metadata: { tier: "S" } },
    ]);

    // La receta 'tunica' usa baseType 'pechera', por lo que el ítem forjado es pechera_de_mitril
    const res = await craftEquipment({ characterId: 1, creatorId: "u1", recipeType: "tunica", materialId: "mitril", tier: "S" });

    expect(res.materialCost).toBe(2);
    expect(res.tier).toBe("S");
    expect(res.craftedItem.id).toBe("pechera_de_mitril");
  });

  it("forja un grimorio de mitril consumiendo 2 unidades (contenedor mágico asequible)", async () => {
    spyGet.mockResolvedValue([
      { itemId: "lingote_de_mitril", quantity: 3, metadata: { tier: "A" } },
    ]);

    const res = await craftEquipment({ characterId: 1, creatorId: "u1", recipeType: "grimorio", materialId: "mitril", tier: "A" });

    expect(res.materialCost).toBe(2);
    expect(res.craftedItem.id).toBe("grimorio_de_mitril");
  });

  it("lanza error si no hay material suficiente para forjar", async () => {
    spyGet.mockResolvedValue([
      { itemId: "lingote_de_hierro", quantity: 1, metadata: { tier: "B" } },
    ]);

    await expect(
      craftEquipment({ characterId: 1, creatorId: "u1", recipeType: "pechera", materialId: "hierro", tier: "B" }),
    ).rejects.toThrow(/necesitas/i);
  });

  it("lanza error con receta no válida", async () => {
    await expect(
      craftEquipment({ characterId: 1, creatorId: "u1", recipeType: "espada_ultrapoderosa", materialId: "hierro" }),
    ).rejects.toThrow(/no válido/i);
  });
});
