// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
const { EXPEDITION_ZONES } = require("../src/config/expeditionConfig");
const { JOBS } = require("../src/config/jobConfig");
const { TOOLS, TOOL_UPGRADE_COSTS, getInventorySlotsByMochilaLevel } = require("../src/config/toolsConfig");
const activityEngine = require("../src/services/rpg/activityEngineService");
const toolService = require("../src/services/rpg/toolService");
const inventoryService = require("../src/services/rpg/inventoryService");
const { jobXpForLevel } = require("../src/services/rpg/xpRewardService");
const economyService = require("../src/services/economyService");
const characterService = require("../src/services/characterService");
const { supabase } = require("../src/database/supabase");
const { getItem } = require("../src/data/items");

describe("Fase 2: Expediciones, Herramientas, Trabajos y Expansión de Inventario", () => {
  const mockUserId = "test_user_phase2";
  const mockCharId = 101;
  let mockCharacter;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockCharacter = {
      id: mockCharId,
      name: "Explorador",
      player_phone: mockUserId,
      nivel: 3,
      stats: { hp: 10, atk: 10, def: 10, aspd: 10, ref: 10, mspd: 10, fulgor: 10, d_fulgor: 10, r_fulgor: 10 },
      slots: {
        tools: {
          pico: { level: 1 },
          hacha: { level: 1 },
          cana: { level: 1 },
          bolsa: { level: 1 },
          mochila: { level: 1 },
        },
        energy: { current: 100, max: 100, date: new Date().toISOString().split("T")[0] },
      },
    };

    vi.spyOn(supabase, "from").mockImplementation((table) => {
      if (table === "characters") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: mockCharacter, error: null }),
            }),
          }),
          update: (payload) => ({
            eq: () => {
              Object.assign(mockCharacter, payload);
              return { error: null, data: mockCharacter };
            },
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
            maybeSingle: async () => ({ data: null }),
          }),
        }),
      };
    });
  });

  describe("Regla de Oro: Cero Ítems Lastre", () => {
    it("todos los drops de las zonas (rarityPool + lootTable) existen en el catálogo", () => {
      for (const [zoneId, zone] of Object.entries(EXPEDITION_ZONES)) {
        const flatDrops = zone.lootTable || [];
        const materialDrops = Object.values(zone.rarityPool || {}).flat();
        for (const drop of [...flatDrops, ...materialDrops]) {
          const itemDef = getItem(drop.itemId);
          expect(
            itemDef,
            `Ítem "${drop.itemId}" en zona "${zoneId}" debe existir en items.js / materialFamilies.js`,
          ).toBeDefined();
          const hasCategory = Array.isArray(itemDef.categories) && itemDef.categories.length > 0;
          const hasModules = itemDef.modules && Object.keys(itemDef.modules).length > 0;
          expect(hasCategory || hasModules).toBe(true);
        }
      }
    });

    it("cada zona declara piso y pool de rareza con bandas en o por encima del piso", () => {
      for (const [zoneId, zone] of Object.entries(EXPEDITION_ZONES)) {
        expect(zone.floorRarity, `zona ${zoneId} debe declarar floorRarity`).toBeTruthy();
        const order = ["comun", "poco_comun", "raro", "epico", "legendario", "mitico"];
        const floorIdx = order.indexOf(zone.floorRarity);
        for (const band of Object.keys(zone.rarityPool || {})) {
          const bandIdx = order.indexOf(band);
          expect(bandIdx, `banda ${band} en ${zoneId} bajo el piso ${zone.floorRarity}`).toBeGreaterThanOrEqual(
            floorIdx,
          );
          expect((zone.rarityPool[band] || []).length).toBeGreaterThan(0);
        }
      }
    });

    it("los nuevos consumibles pescado_fresco y hierba_medicinal poseen módulos de energía y curación", () => {
      const pez = getItem("pescado_fresco");
      expect(pez.modules.energy.amount).toBe(25);
      expect(pez.modules.heal.amount).toBe(10);

      const hierba = getItem("hierba_medicinal");
      expect(hierba.modules.heal.amount).toBe(20);
      expect(hierba.modules.curePoison).toBe(true);
    });
  });

  describe("Progresión de Herramientas y Expansión de Mochila", () => {
    it("la mochila expande el inventario desde 20 slots en Nivel 1 hasta 38 slots en Nivel 10", () => {
      expect(getInventorySlotsByMochilaLevel(1)).toBe(20);
      expect(getInventorySlotsByMochilaLevel(2)).toBe(22);
      expect(getInventorySlotsByMochilaLevel(5)).toBe(28);
      expect(getInventorySlotsByMochilaLevel(10)).toBe(38);
    });

    it("upgradeTool valida stelas y materiales requeridos antes de subir de nivel", async () => {
      vi.spyOn(economyService, "getBalance").mockResolvedValue(10); // Insuficiente para nivel 2 (60 stelas)
      const res = await toolService.upgradeTool({
        userId: mockUserId,
        characterId: mockCharId,
        toolId: "pico",
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain("Stelas insuficientes");
    });

    it("upgradeTool sube exitosamente de nivel y descuenta recursos cuando se cumplen los requisitos", async () => {
      vi.spyOn(economyService, "getBalance").mockResolvedValue(1000);
      vi.spyOn(economyService, "removeMoney").mockResolvedValue(750);
      vi.spyOn(inventoryService, "getInventory").mockResolvedValue([
        { item_id: "trozo_de_madera", quantity: 10 },
        { item_id: "trozo_de_piedra", quantity: 10 },
      ]);
      vi.spyOn(inventoryService, "removeItem").mockResolvedValue({ success: true });

      const res = await toolService.upgradeTool({
        userId: mockUserId,
        characterId: mockCharId,
        toolId: "pico",
      });

      expect(res.success).toBe(true);
      expect(res.oldLevel).toBe(1);
      expect(res.newLevel).toBe(2);
      expect(mockCharacter.slots.tools.pico.level).toBe(2);
    });
  });

  describe("Control de Energía y Expediciones", () => {
    it("consume energía al iniciar una expedición y bloquea si no alcanza", async () => {
      mockCharacter.slots.energy.current = 5; // Cuesta 15 la expedición corta

      const res = await activityEngine.startExpedition({
        userId: mockUserId,
        characterId: mockCharId,
        zoneId: "bosque",
        durationType: "corta",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Energía insuficiente");
    });

    it("inicia expedición correctamente y reporta al personaje como ocupado", async () => {
      const res = await activityEngine.startExpedition({
        userId: mockUserId,
        characterId: mockCharId,
        zoneId: "bosque",
        durationType: "corta",
      });

      expect(res.success).toBe(true);
      expect(res.activity.zoneId).toBe("bosque");
      expect(res.remainingEnergy).toBe(85);

      const busyState = await activityEngine.isCharacterBusy(mockCharId);
      expect(busyState.busy).toBe(true);
      expect(busyState.activity.type).toBe("expedition");
    });

    it("impide reclamar la expedición antes de tiempo", async () => {
      mockCharacter.slots.activity = {
        type: "expedition",
        zoneId: "bosque",
        startedAt: Date.now(),
        finishesAt: Date.now() + 600000, // Falta 10 minutos
      };

      const res = await activityEngine.claimActivity({
        userId: mockUserId,
        characterId: mockCharId,
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("aún no ha finalizado");
    });

    it("reclama botín, XP y stelas una vez transcurrido el tiempo", async () => {
      mockCharacter.slots.activity = {
        type: "expedition",
        zoneId: "bosque",
        startedAt: Date.now() - 700000,
        finishesAt: Date.now() - 100000,
        durationType: "corta",
      };

      vi.spyOn(inventoryService, "addItem").mockResolvedValue({ success: true });
      vi.spyOn(economyService, "addMoney").mockResolvedValue(100);
      vi.spyOn(characterService, "addXp").mockResolvedValue({});

      const res = await activityEngine.claimActivity({
        userId: mockUserId,
        characterId: mockCharId,
      });

      expect(res.success).toBe(true);
      expect(res.type).toBe("expedition");
      expect(res.loot.length).toBeGreaterThan(0);
      expect(res.stelas).toBeGreaterThan(0);
      expect(mockCharacter.slots.activity).toBeUndefined();
    });
  });

  describe("Sistema de Trabajos Urbanos", () => {
    it("existen 20 trabajos configurados", () => {
      expect(Object.keys(JOBS)).toHaveLength(20);
    });

    it("bloquea el trabajo si no se cumplen los requisitos de estadísticas", async () => {
      mockCharacter.stats.def = 2; // vigilante_porton pide def >= 10
      const res = await activityEngine.startJob({
        userId: mockUserId,
        characterId: mockCharId,
        jobId: "vigilante_porton",
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("No cumples los requisitos");
    });

    it("inicia trabajo con éxito y al reclamar otorga salario y XP", async () => {
      mockCharacter.slots.activity = {
        type: "job",
        jobId: "ayudante_panaderia",
        startedAt: Date.now() - 1500000,
        finishesAt: Date.now() - 100000,
      };

      vi.spyOn(economyService, "addMoney").mockResolvedValue(500);
      vi.spyOn(characterService, "addXp").mockResolvedValue({});

      const res = await activityEngine.claimActivity({
        userId: mockUserId,
        characterId: mockCharId,
      });

      expect(res.success).toBe(true);
      expect(res.type).toBe("job");
      expect(res.stelas).toBe(120);
      expect(res.xp).toBe(jobXpForLevel(mockCharacter.nivel, 35));
      expect(res.statTrained).toBe("def");
    });
  });
});
