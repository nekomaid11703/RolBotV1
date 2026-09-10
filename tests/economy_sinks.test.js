// @ts-nocheck
/**
 * Inflación y sumideros: venta de ítems (60%), reparación (stelas por
 * resistencia) y reparto de grifos diarios.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
const shopEngine = require("../src/services/rpg/shopEngineService");
const characterService = require("../src/services/characterService");
const economyService = require("../src/services/economyService");
const inventoryService = require("../src/services/rpg/inventoryService");
const equipmentResolver = require("../src/services/rpg/equipmentResolverService");
const durabilityPersistence = require("../src/services/rpg/durabilityPersistenceService");
const { repairEquipped } = require("../src/services/rpg/repairService");
const pricingService = require("../src/services/rpg/pricingService");
const { SELL_RATIO, REPAIR_COST_PER_POINT } = require("../src/config/economyConfig");
const { buildInflationReport } = require("../src/services/rpg/progressionAnalyticsService");

describe("Sumidero: venta de ítems (executeSale)", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("vende al 60% del precio de compra y acredita stelas", async () => {
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue({ id: 9, name: "Tester" });
    vi.spyOn(inventoryService, "getInventoryList").mockResolvedValue([
      { itemId: "trozo_de_acero", quantity: 5, metadata: { tier: "E" }, variantKey: "tier:E" },
    ]);
    const removeSpy = vi.spyOn(inventoryService, "removeItem").mockResolvedValue({});
    const addSpy = vi.spyOn(economyService, "addMoney").mockResolvedValue(1000);

    const buyPrice = pricingService.itemBasePrice("trozo_de_acero", "E");
    const unit = Math.max(1, Math.round(buyPrice * SELL_RATIO));

    const result = await shopEngine.executeSale({ userId: "u1", itemKey: 1, quantity: 3 });

    expect(result.success).toBe(true);
    expect(result.unitPrice).toBe(unit);
    expect(result.totalGained).toBe(unit * 3);
    expect(removeSpy).toHaveBeenCalledWith(9, "u1", "trozo_de_acero", 3, "tier:E");
    expect(addSpy).toHaveBeenCalledWith("u1", unit * 3);
  });

  it("bloquea la venta sin personaje activo", async () => {
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(null);
    const result = await shopEngine.executeSale({ userId: "u1", itemKey: 1 });
    expect(result.success).toBe(false);
    expect(result.error).toContain("No tienes un personaje activo");
  });
});

describe("Sumidero: reparación de equipo (repairEquipped)", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("cobra stelas por resistencia faltante y restaura la durabilidad", async () => {
    vi.spyOn(equipmentResolver, "getEquippedItems").mockResolvedValue([
      {
        slot: "pecho",
        itemId: "pechera_de_acero",
        variantKey: "inst",
        row: { metadata: { durability: { maxResist: 20, currentResist: 12, isRepairable: true } } },
      },
    ]);
    vi.spyOn(economyService, "getBalance").mockResolvedValue(1000);
    const removeSpy = vi.spyOn(economyService, "removeMoney").mockResolvedValue(984);
    const persistSpy = vi.spyOn(durabilityPersistence, "persistDurability").mockResolvedValue("updated");

    const result = await repairEquipped({ userId: "u1", characterId: 9 });

    const expectedCost = Math.ceil(8 * REPAIR_COST_PER_POINT);
    expect(result.success).toBe(true);
    expect(result.totalCost).toBe(expectedCost);
    expect(removeSpy).toHaveBeenCalledWith("u1", expectedCost);
    expect(persistSpy).toHaveBeenCalledTimes(1);
  });

  it("no hace nada si no hay equipo dañado", async () => {
    vi.spyOn(equipmentResolver, "getEquippedItems").mockResolvedValue([
      {
        slot: "pecho",
        itemId: "pechera_de_acero",
        variantKey: "inst",
        row: { metadata: { durability: { maxResist: 20, currentResist: 20, isRepairable: true } } },
      },
    ]);
    const result = await repairEquipped({ userId: "u1", characterId: 9 });
    expect(result.success).toBe(false);
    expect(result.error).toContain("No tienes equipo dañado");
  });
});

describe("Inflación: reparto de grifos", () => {
  it("los trabajos mantienen una cuota sana y ningún grifo domina", () => {
    const report = buildInflationReport();
    expect(report.checks.jobsShareHealthy).toBe(true);
    expect(report.checks.faucetsBalanced).toBe(true);
    expect(report.checks.recurringSinksAvailable).toBe(true);
    const sum = Object.values(report.faucets).reduce((acc, value) => acc + value, 0);
    expect(report.totalFaucetsPerDay).toBe(sum);
  });
});
