// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
const shopEngine = require("../src/services/rpg/shopEngineService");
const { getDailyCatalog, getNpcDialogue, executePurchase } = shopEngine;
const characterService = require("../src/services/characterService");
const economyService = require("../src/services/economyService");
const inventoryService = require("../src/services/rpg/inventoryService");

describe("Sistema de Tiendas y Comercio (Fase 1)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    shopEngine._internal.dailyUserPurchases.clear();
    vi.spyOn(inventoryService, "getMaxInventoryCapacity").mockResolvedValue(20);
  });

  describe("Catálogo Determinista y Diálogos", () => {
    it("genera exactamente los mismos precios y stocks en la misma fecha (determinismo)", () => {
      const cat1 = getDailyCatalog("bazar_nixia", "2026-09-03");
      const cat2 = getDailyCatalog("bazar_nixia", "2026-09-03");

      expect(cat1).toHaveLength(cat2.length);
      cat1.forEach((item, i) => {
        expect(item.price).toBe(cat2[i].price);
        expect(item.maxDailyStock).toBe(cat2[i].maxDailyStock);
      });
    });

    it("varía de forma estable entre fechas distintas", () => {
      const catA = getDailyCatalog("bazar_nixia", "2026-09-01");
      const catB = getDailyCatalog("bazar_nixia", "2026-09-02");

      // Al menos algún ítem debe tener precio o stock diferente debido a la semilla
      const isDifferent = catA.some(
        (item, i) => item.price !== catB[i].price || item.maxDailyStock !== catB[i].maxDailyStock,
      );
      expect(isDifferent).toBe(true);
    });

    it("retorna diálogos de Nixia por categoría válidos", () => {
      const loreText = getNpcDialogue("bazar_nixia", "lore");
      expect(typeof loreText).toBe("string");
      expect(loreText.length).toBeGreaterThan(10);

      const consejoText = getNpcDialogue("bazar_nixia", "consejos");
      expect(typeof consejoText).toBe("string");
    });
  });

  describe("Ejecución de Compra (executePurchase)", () => {
    const mockUserId = "user_test_123";
    const mockChar = { id: 99, name: "Aventurero", creatorId: mockUserId };

    it("bloquea la compra si el usuario no tiene un personaje activo", async () => {
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(null);

      const result = await executePurchase({
        userId: mockUserId,
        itemKey: 1,
        quantity: 1,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("No tienes un personaje activo");
    });

    it("bloquea la compra si el saldo de stelas es insuficiente", async () => {
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);
      vi.spyOn(economyService, "getBalance").mockResolvedValue(10); // Solo 10 stelas

      const result = await executePurchase({
        userId: mockUserId,
        itemKey: 1, // Venda cuesta ~100
        quantity: 1,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("No tienes suficientes stelas");
    });

    it("bloquea la compra si el inventario está lleno y el ítem no se stackea", async () => {
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);
      vi.spyOn(economyService, "getBalance").mockResolvedValue(50000);

      // Simular inventario lleno (20 items diferentes)
      const fullInv = Array.from({ length: 20 }, (_, i) => ({ item_id: `otro_item_${i}` }));
      vi.spyOn(inventoryService, "getInventory").mockResolvedValue(fullInv);

      const result = await executePurchase({
        userId: mockUserId,
        itemKey: "venda",
        quantity: 1,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("está llena");
    });

    it("ejecuta la compra con éxito, descontando dinero e insertando el ítem", async () => {
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);
      vi.spyOn(economyService, "getBalance").mockResolvedValue(1000);
      const removeMoneySpy = vi.spyOn(economyService, "removeMoney").mockResolvedValue(900);
      const addItemSpy = vi.spyOn(inventoryService, "addItem").mockResolvedValue({ success: true });
      vi.spyOn(inventoryService, "getInventory").mockResolvedValue([]);

      const result = await executePurchase({
        userId: mockUserId,
        itemKey: 1,
        quantity: 1,
      });

      expect(result.success).toBe(true);
      expect(result.characterName).toBe("Aventurero");
      expect(removeMoneySpy).toHaveBeenCalled();
      expect(addItemSpy).toHaveBeenCalledWith(mockChar.id, mockUserId, expect.any(String), 1, null);
    });

    it("respeta el límite de stock diario y bloquea compras en exceso", async () => {
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);
      vi.spyOn(economyService, "getBalance").mockResolvedValue(50000);
      vi.spyOn(economyService, "removeMoney").mockResolvedValue(40000);
      vi.spyOn(inventoryService, "addItem").mockResolvedValue({ success: true });
      vi.spyOn(inventoryService, "getInventory").mockResolvedValue([]);

      const catalog = getDailyCatalog("bazar_nixia");
      const item1 = catalog[0];

      // Compra que supera el stock diario disponible
      const result = await executePurchase({
        userId: mockUserId,
        itemKey: 1,
        quantity: item1.maxDailyStock + 5,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Stock insuficiente");
    });

    it("reembolsa las stelas si el inventario rechaza la compra", async () => {
      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);
      vi.spyOn(economyService, "getBalance").mockResolvedValue(1000);
      vi.spyOn(economyService, "removeMoney").mockResolvedValue(900);
      const refundSpy = vi.spyOn(economyService, "addMoney").mockResolvedValue(1000);
      vi.spyOn(inventoryService, "getInventory").mockResolvedValue([]);
      vi.spyOn(inventoryService, "addItem").mockRejectedValue(new Error("Inventario lleno"));

      const result = await executePurchase({ userId: mockUserId, itemKey: 1, quantity: 1 });

      expect(result.success).toBe(false);
      expect(result.error).toContain("reembolsadas");
      expect(refundSpy).toHaveBeenCalledWith(mockUserId, expect.any(Number));
    });
  });

  describe("Directorio y Múltiples Tiendas", () => {
    it("lista todas las tiendas configuradas correctamente", () => {
      const { listShops } = shopEngine;
      const shops = listShops();
      expect(shops.length).toBeGreaterThanOrEqual(3);
      const ids = shops.map((s) => s.id);
      expect(ids).toContain("bazar_nixia");
      expect(ids).toContain("tienda_magia");
      expect(ids).toContain("herreria");
    });

    it("resuelve alias amigables para tiendas especializadas", () => {
      const { getShopDefinition } = shopEngine;
      expect(getShopDefinition("magia")?.id).toBe("tienda_magia");
      expect(getShopDefinition("herreria")?.id).toBe("herreria");
      expect(getShopDefinition("forja")?.id).toBe("herreria");
      expect(getShopDefinition("nixia")?.id).toBe("bazar_nixia");
    });

    it("permite comprar artículos de la herrería especificando el shopId", async () => {
      const mockUserId = "user_test_456";
      const mockChar = { id: 88, name: "Guerrero", creatorId: mockUserId };

      vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);
      vi.spyOn(economyService, "getBalance").mockResolvedValue(10000);
      vi.spyOn(economyService, "removeMoney").mockResolvedValue(9500);
      vi.spyOn(inventoryService, "addItem").mockResolvedValue({ success: true });
      vi.spyOn(inventoryService, "getInventory").mockResolvedValue([]);

      const result = await executePurchase({
        userId: mockUserId,
        shopId: "herreria",
        itemKey: 1, // Espada de hierro
        quantity: 1,
      });

      expect(result.success).toBe(true);
      expect(result.item.name).toContain("Espada de Acero");
    });

    it("incluye ofertas rotativas especiales en el catálogo según la fecha", () => {
      const catA = getDailyCatalog("herreria", "2026-09-01");
      const catB = getDailyCatalog("herreria", "2026-09-02");

      // Debe haber al menos un ítem marcado como isSpecial (oferta del día)
      const hasSpecialA = catA.some((item) => item.isSpecial === true);
      const hasSpecialB = catB.some((item) => item.isSpecial === true);
      expect(hasSpecialA).toBe(true);
      expect(hasSpecialB).toBe(true);

      // Los ítems rotativos tienen sus índices 1-based correlativos y correctos
      catA.forEach((item, idx) => {
        expect(item.index).toBe(idx + 1);
      });
    });
  });
});
