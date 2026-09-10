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

const { NEXT_TIER, CRAFTING_RECIPES, normalizeMaterialId, normalizeRecipeKey, refineMaterial, craftEquipment } =
  _require("../src/services/rpg/craftingService");

// ── Catálogo de ítems de prueba ───────────────────────────────────────────────
const TEST_CATALOG = {
  trozo_de_acero: { id: "trozo_de_acero", name: "Trozo de Hierro", categories: ["material"] },
  espada_de_acero: { id: "espada_de_acero", name: "Espada de Hierro", categories: ["weapon"] },
  espada_larga_de_acero: { id: "espada_larga_de_acero", name: "Espada Larga de Hierro", categories: ["weapon"] },
  pechera_de_acero: { id: "pechera_de_acero", name: "Pechera de Hierro", categories: ["armor"] },
  pechera_de_mitril: { id: "pechera_de_mitril", name: "Pechera de Mitril", categories: ["armor"] },
  casco_de_acero: {
    id: "casco_de_acero",
    name: "Casco de Hierro",
    categories: ["armor"],
    modules: { armor: { slot: "cabeza", coverage: "media", bonusDef: 4 } },
  },
  casco_ligera_de_acero: {
    id: "casco_ligera_de_acero",
    name: "Casco Ligera de Hierro",
    categories: ["armor"],
    modules: { armor: { slot: "cabeza", coverage: "ligera", bonusDef: 4 } },
  },
  casco_total_de_acero: {
    id: "casco_total_de_acero",
    name: "Casco Total de Hierro",
    categories: ["armor"],
    modules: { armor: { slot: "cabeza", coverage: "total", bonusDef: 4 } },
  },
  baculo_de_mitril: { id: "baculo_de_mitril", name: "Báculo de Mitril", categories: ["weapon"] },
  varita_de_mitril: {
    id: "varita_de_mitril",
    name: "Varita de Mitril",
    categories: ["focus"],
    modules: { focus: { slotHeld: "1h" } },
  },
  tunica_de_mitril: {
    id: "tunica_de_mitril",
    name: "Túnica de Mitril",
    categories: ["armor"],
    modules: { armor: { slot: "pecho", coverage: "ligera", bonusDef: 3 }, buff: { stats: { d_fulgor: 10 } } },
  },
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
    expect(CRAFTING_RECIPES.grimorio).toBeUndefined();
    expect(CRAFTING_RECIPES.tunica.materialCost).toBe(2);
    expect(CRAFTING_RECIPES.espada.materialCost).toBe(2);
    expect(CRAFTING_RECIPES.maza.materialCost).toBe(2);
    expect(CRAFTING_RECIPES.espada_larga.materialCost).toBe(3);
    expect(CRAFTING_RECIPES.pechera.materialCost).toBe(3);
    expect(CRAFTING_RECIPES.escudo.materialCost).toBe(3);
  });

  it("CRAFTING_RECIPES expande armaduras por grado de cobertura", () => {
    // El grado base de cada pieza se forja con la receta base (mismo coste).
    // Los demás grados son recetas propias con igual coste de material.
    const baseCosts = { casco: 2, botas: 2, grebas: 3, pechera: 3, escudo: 3 };
    const baseCoverage = { casco: "media", botas: "ligera", grebas: "media", pechera: "alta", escudo: "media" };
    const grades = ["ligera", "media", "alta", "total"];
    for (const [slot, cost] of Object.entries(baseCosts)) {
      expect(CRAFTING_RECIPES[slot].materialCost).toBe(cost);
      for (const grade of grades) {
        if (grade === baseCoverage[slot]) continue;
        const key = `${slot}_${grade}`;
        expect(CRAFTING_RECIPES[key]).toBeDefined();
        expect(CRAFTING_RECIPES[key].materialCost).toBe(cost);
        expect(CRAFTING_RECIPES[key].baseType).toBe(key);
      }
    }
  });

  it("normalizeMaterialId resuelve por clave y por nombre", () => {
    expect(normalizeMaterialId("acero")).toBe("acero");
    expect(normalizeMaterialId("acero")).toBe("acero");
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
      { itemId: "trozo_de_acero", variantKey: "tier:E", quantity: 5, metadata: { tier: "E" } },
    ]);

    const res = await refineMaterial({ characterId: 1, creatorId: "u1", materialId: "acero", tier: "E", amount: 1 });

    expect(res.sourceTier).toBe("E");
    expect(res.targetTier).toBe("D");
    expect(res.consumedAmount).toBe(2);
    expect(res.producedAmount).toBe(1);
    expect(spyRemove).toHaveBeenCalledWith(1, "u1", "trozo_de_acero", 2, "tier:E");
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "trozo_de_acero", 1, { tier: "D" });
  });

  it("lanza error si no hay suficientes materiales", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_acero", quantity: 1, metadata: { tier: "E" } }]);

    await expect(
      refineMaterial({ characterId: 1, creatorId: "u1", materialId: "acero", tier: "E", amount: 1 }),
    ).rejects.toThrow(/necesitas/i);
  });

  it("lanza error al intentar refinar Tier N (techo máximo)", async () => {
    await expect(
      refineMaterial({ characterId: 1, creatorId: "u1", materialId: "acero", tier: "N", amount: 1 }),
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
      { itemId: "trozo_de_acero", variantKey: "tier:E", quantity: 5, metadata: { tier: "E" } },
    ]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "espada",
      materialId: "acero",
      tier: "E",
    });

    expect(res.craftedItem.id).toBe("espada_de_acero");
    expect(res.materialCost).toBe(2);
    expect(res.tier).toBe("E");
    expect(spyRemove).toHaveBeenCalledWith(1, "u1", "trozo_de_acero", 2, "tier:E");
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "espada_de_acero", 1, { tier: "E", crafted: true });
  });

  it("forja una espada larga distinta a la espada normal, consumiendo 3 unidades", async () => {
    spyGet.mockResolvedValue([
      { itemId: "trozo_de_acero", variantKey: "tier:E", quantity: 5, metadata: { tier: "E" } },
    ]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "espada_larga",
      materialId: "acero",
      tier: "E",
    });

    expect(res.craftedItem.id).toBe("espada_larga_de_acero");
    expect(res.materialCost).toBe(3);
    expect(spyRemove).toHaveBeenCalledWith(1, "u1", "trozo_de_acero", 3, "tier:E");
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "espada_larga_de_acero", 1, { tier: "E", crafted: true });
  });

  it("forja una armadura por grado de cobertura (casco ligera)", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_acero", quantity: 5, metadata: { tier: "E" } }]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "casco_ligera",
      materialId: "acero",
      tier: "E",
    });

    expect(res.craftedItem.id).toBe("casco_ligera_de_acero");
    expect(res.craftedItem.modules.armor.coverage).toBe("ligera");
    expect(res.materialCost).toBe(2);
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "casco_ligera_de_acero", 1, { tier: "E", crafted: true });
  });

  it("forja el grado base de un slot con la receta base (casco → media)", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_acero", quantity: 5, metadata: { tier: "E" } }]);

    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "casco",
      materialId: "acero",
      tier: "E",
    });

    expect(res.craftedItem.id).toBe("casco_de_acero");
    expect(res.craftedItem.modules.armor.coverage).toBe("media");
  });

  it("forja una túnica de mago consumiendo solo 2 unidades (equipo mágico asequible)", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_mitril", quantity: 4, metadata: { tier: "S" } }]);

    // La receta 'tunica' produce un ítem propio (tunica_de_mitril), distinto de la pechera.
    const res = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "tunica",
      materialId: "mitril",
      tier: "S",
    });

    expect(res.materialCost).toBe(2);
    expect(res.tier).toBe("S");
    expect(res.craftedItem.id).toBe("tunica_de_mitril");
    expect(spyAdd).toHaveBeenCalledWith(1, "u1", "tunica_de_mitril", 1, { tier: "S", crafted: true });
  });

  it("varita y báculo producen ítems distintos", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_mitril", quantity: 5, metadata: { tier: "A" } }]);

    const varita = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "varita",
      materialId: "mitril",
      tier: "A",
    });
    const baculo = await craftEquipment({
      characterId: 1,
      creatorId: "u1",
      recipeType: "baculo",
      materialId: "mitril",
      tier: "A",
    });

    expect(varita.craftedItem.id).toBe("varita_de_mitril");
    expect(baculo.craftedItem.id).toBe("baculo_de_mitril");
    expect(varita.craftedItem.id).not.toBe(baculo.craftedItem.id);
  });

  it("grimorio NO es una receta de crafteo convencional", async () => {
    expect(CRAFTING_RECIPES.grimorio).toBeUndefined();
  });

  it("lanza error si no hay material suficiente para forjar", async () => {
    spyGet.mockResolvedValue([{ itemId: "trozo_de_acero", quantity: 1, metadata: { tier: "B" } }]);

    await expect(
      craftEquipment({ characterId: 1, creatorId: "u1", recipeType: "pechera", materialId: "acero", tier: "B" }),
    ).rejects.toThrow(/necesitas/i);
  });

  it("lanza error con receta no válida", async () => {
    await expect(
      craftEquipment({ characterId: 1, creatorId: "u1", recipeType: "espada_ultrapoderosa", materialId: "acero" }),
    ).rejects.toThrow(/no válido/i);
  });
});
