const { getRefineLadder, buildForgeEconomics } = require("../src/services/rpg/progressionAnalyticsService");
const { TIERS } = require("../src/config/tierConfig");
const { refineMaterial } = require("../src/services/rpg/craftingService");
const { createRequire } = require("module");

const _require = createRequire(import.meta.url);
const inventoryService = _require("../src/services/rpg/inventoryService");

describe("B7 — escalera de refinamiento", () => {
  it("cada tier requiere 2× unidades del anterior (E→N = 2^6)", () => {
    const ladder = getRefineLadder();
    expect(ladder).toHaveLength(6);
    const tierN = ladder[ladder.length - 1];
    expect(tierN.tier).toBe("N");
    expect(tierN.unitsEForOne).toBe(64);
    expect(tierN.unitsEForSampleCraft).toBe(128);
  });

  it("el poder relativo por tier crece y es monótono", () => {
    const ladder = getRefineLadder();
    for (let i = 0; i < ladder.length; i += 1) {
      expect(ladder[i].relativePowerVsE).toBeCloseTo(ladder[i].multiplier / TIERS.E.mult, 5);
      if (i > 0) expect(ladder[i].relativePowerVsE).toBeGreaterThan(ladder[i - 1].relativePowerVsE);
    }
    expect(ladder[ladder.length - 1].relativePowerVsE).toBeCloseTo(1.84 / 1.12, 5);
  });
});

describe("B8 — refinado universal (sin techo por rareza)", () => {
  it("cualquier material puede refinar y el tope es solo Tier N", async () => {
    vi.spyOn(inventoryService, "getInventoryList").mockResolvedValue([
      { itemId: "trozo_de_piedra", quantity: 5, metadata: { tier: "E" } },
      { itemId: "trozo_de_filo_estelar", quantity: 2, metadata: { tier: "A" } },
    ]);
    vi.spyOn(inventoryService, "removeItem").mockResolvedValue({});
    vi.spyOn(inventoryService, "addItem").mockResolvedValue({});
    // Un común también refina (E→D): la rareza no bloquea, el coste sí escala.
    await expect(
      refineMaterial({ characterId: 1, creatorId: "u", materialId: "piedra", tier: "E" }),
    ).resolves.toBeDefined();
    // El mítico llega hasta N (A→S aquí: siguiente paso permitido).
    await expect(
      refineMaterial({ characterId: 1, creatorId: "u", materialId: "filo_estelar", tier: "A" }),
    ).resolves.toBeDefined();
    vi.restoreAllMocks();
    await expect(
      refineMaterial({ characterId: 1, creatorId: "u", materialId: "filo_estelar", tier: "N" }),
    ).rejects.toThrow(/rango máximo/);
  });
});

describe("B7 — economía forjar vs comprar", () => {
  it("permite forjar todos los tiers y el tiempo crece con la rareza", () => {
    const economics = buildForgeEconomics();
    const oro = economics.materials.find((material) => material.material === "oro");
    expect(oro.acquisition).not.toBeNull();
    for (const tier of oro.tiers) {
      expect(tier.daysForge).toBeGreaterThan(0);
    }
    expect(oro.tiers[oro.tiers.length - 1].daysForge).toBeGreaterThan(oro.tiers[0].daysForge);
  });

  it("todo el muestreo tiene ruta por eje (titanio/mitril incluidos)", () => {
    const economics = buildForgeEconomics();
    expect(economics.checks.unreachableMaterialsInForge).toEqual([]);
    const titanio = economics.materials.find((material) => material.material === "titanio");
    expect(titanio.acquisition).not.toBeNull();
    expect(titanio.tiers[0].daysForge).toBeGreaterThan(0);
  });

  it("forjar/refinar ahorra stelas frente a comprar (P1: la compra paga con dinero)", () => {
    const economics = buildForgeEconomics();
    expect(economics.checks.directBuyAvailableForE).toBe(true);
    expect(economics.checks.forgeSavesStelas).toBe(true);
    expect(economics.checks.refiningSavesStelas).toBe(true);
    const acero = economics.materials.find((material) => material.material === "acero");
    expect(acero.refined).not.toBeNull();
    expect(acero.refined.unitsE).toBe(2);
    // Forjar es más lento que comprar (trade-off tiempo vs stelas).
    expect(acero.forgeVsBuyRatioE).toBeGreaterThan(1);
  });
});
