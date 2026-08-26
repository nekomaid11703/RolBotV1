// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRequire } from "module";

const _require = createRequire(import.meta.url);

const charServicePath = _require.resolve("../src/services/characterService");
const supabasePath = _require.resolve("../src/database/supabase");

let activeCharMock = null;
let inventoryListMock = [];
let equippedSlotsMock = {};

_require.cache[charServicePath] = {
  id: charServicePath,
  filename: charServicePath,
  loaded: true,
  exports: {
    getActiveCharacter: vi.fn(async () => activeCharMock),
  },
};

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
                order: vi.fn().mockResolvedValue({ data: inventoryListMock, error: null }),
              }),
            }),
          };
        }
        if (table === "characters") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { equipped_slots: equippedSlotsMock }, error: null }),
              }),
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

const itemInfoCommand = _require("../src/commands/rpg/inventory/item_info");

describe("Comando /item_info — Inspeccionar Ítem", () => {
  let mockCtx;

  beforeEach(() => {
    vi.restoreAllMocks();
    activeCharMock = { id: 1, name: "Guerrero" };
    inventoryListMock = [
      { item_id: "espada_de_hierro", quantity: 1, metadata: { tier: "E" } },
      { item_id: "pechera_de_hierro", quantity: 1, metadata: { tier: "E" } },
      { item_id: "amuleto_de_hierro", quantity: 1, metadata: { tier: "E" } },
    ];
    equippedSlotsMock = { mano_der: "espada_de_hierro" };
    mockCtx = {
      sender: "user123",
      args: [],
      reply: vi.fn(),
    };
  });

  it("muestra la ayuda si no se pasan argumentos", async () => {
    await itemInfoCommand.execute(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledTimes(1);
    expect(mockCtx.reply.mock.calls[0][0]).toContain("INSPECCIONAR ÍTEM");
  });

  it("muestra error si no hay personaje activo", async () => {
    mockCtx.args = ["1"];
    activeCharMock = null;

    await itemInfoCommand.execute(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("No tienes un personaje activo"));
  });

  it("muestra la ficha técnica de un arma por posición de inventario", async () => {
    mockCtx.args = ["1"];

    await itemInfoCommand.execute(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledTimes(1);
    const replyText = mockCtx.reply.mock.calls[0][0];
    expect(replyText).toContain("Espada de Hierro");
    expect(replyText).toContain("Tier E");
    expect(replyText).toContain("Equipado en [mano_der]");
    expect(replyText).toContain("Daño Base:");
  });

  it("muestra el bono de conjunto de armadura en /item_info", async () => {
    mockCtx.args = ["2"];

    await itemInfoCommand.execute(mockCtx);

    const replyText = mockCtx.reply.mock.calls[0][0];
    expect(replyText).toContain("Pechera de Hierro");
    expect(replyText).toContain("Bono de Conjunto (3+ piezas):");
  });

  it("muestra las propiedades de artefacto en /item_info", async () => {
    mockCtx.args = ["3"];

    await itemInfoCommand.execute(mockCtx);

    const replyText = mockCtx.reply.mock.calls[0][0];
    expect(replyText).toContain("Amuleto de Hierro");
    expect(replyText).toContain("EFECTOS DE ARTEFACTO:");
  });
});
