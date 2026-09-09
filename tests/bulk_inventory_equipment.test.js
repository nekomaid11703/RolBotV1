// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRequire } from "module";

const _require = createRequire(import.meta.url);

const mockInventoryRows = [
  { item_id: "pocion", quantity: 5 },
  { item_id: "espada_de_hierro", quantity: 1 },
];

const mockEquippedSlots = {
  cabeza: "casco_de_hierro",
  pecho: "pechera_de_mitril",
  mano_der: "espada_de_hierro",
  mano_izq: "__2h:espada_de_hierro",
};

// Supabase mock setup via require.cache
const supabasePath = _require.resolve("../src/database/supabase");

_require.cache[supabasePath] = {
  id: supabasePath,
  filename: supabasePath,
  loaded: true,
  exports: {
    supabase: {
      from: vi.fn((table) => {
        if (table === "inventory") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: mockInventoryRows, error: null }),
              }),
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
            insert: vi.fn().mockResolvedValue({ error: null }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }),
          };
        }
        if (table === "characters") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { equipped_slots: mockEquippedSlots }, error: null }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    },
  },
};

const inventoryService = _require("../src/services/rpg/inventoryService");
const equipmentService = _require("../src/services/rpg/equipmentService");

describe("Comandos Masivos y Tolerancia a Fallos de Inventario/Equipamiento", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clearInventory elimina de forma segura las filas del inventario", async () => {
    const res = await inventoryService.clearInventory(1, "user1");
    expect(res.deletedCount).toBe(6);
  });

  it("unequipItem desequipa sin retirar la fila del inventario", async () => {
    const spyAdd = vi.spyOn(inventoryService, "addItem").mockResolvedValue({ success: true });

    const res = await equipmentService.unequipItem({ characterId: 1, creatorId: "u1", slot: "cabeza" });

    expect(res.unequipped).toBe("casco_de_hierro");
    expect(res.slot).toBe("cabeza");
    expect(res.returnedToInventory).toBe(true);
    expect(spyAdd).not.toHaveBeenCalled();
  });

  it("unequipAllItems desequipa todos los slots ocupados sin duplicar inventario", async () => {
    const spyAdd = vi.spyOn(inventoryService, "addItem").mockResolvedValue({ success: true });

    const res = await equipmentService.unequipAllItems({ characterId: 1, creatorId: "u1" });

    expect(res.totalUnequipped).toBe(3); // cabeza, pecho, mano_der (mano_izq es marcador)
    expect(spyAdd).not.toHaveBeenCalled();
  });

  it("equipItem conserva el ítem en inventario y referencia su variante", async () => {
    const spyRemove = vi.spyOn(inventoryService, "removeItem").mockResolvedValue({ success: true });
    const itemsPath = _require.resolve("../src/data/items");
    _require.cache[itemsPath] = {
      id: itemsPath,
      filename: itemsPath,
      loaded: true,
      exports: {
        getItem: (id) =>
          id === "espada_de_hierro"
            ? { id: "espada_de_hierro", categories: ["weapon"], modules: { weapon: { hands: 1 } } }
            : null,
        getItemsByCategory: vi.fn(),
        ITEMS: {},
      },
    };
    delete _require.cache[_require.resolve("../src/services/rpg/equipmentService")];
    const equipMod = _require("../src/services/rpg/equipmentService");

    const res = await equipMod.equipItem({
      characterId: 1,
      creatorId: "u1",
      itemId: "espada_de_hierro",
      slot: "mano_der",
    });

    expect(res.equipped).toBe("espada_de_hierro");
    expect(spyRemove).not.toHaveBeenCalled();
  });
});
