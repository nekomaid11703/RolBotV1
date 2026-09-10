// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../src/database/supabase", () => ({
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

const forjarModule = require("../src/commands/rpg/crafting/forjar");
const craftingService = require("../src/services/rpg/craftingService");
const characterService = require("../src/services/characterService");

function makeCtx(args) {
  return {
    args,
    sender: "u1",
    from: "g1",
    senderJid: "u1",
    reply: vi.fn(async (m) => String(m)),
  };
}

function run(args) {
  return forjarModule.execute(makeCtx(args)).then((r) => r);
}

describe("forjar — module info", () => {
  it("tiene name, aliases y description", () => {
    expect(forjarModule.name).toBe("forjar");
    expect(forjarModule.aliases).toContain("craftear");
    expect(forjarModule.aliases).toContain("craft");
    expect(forjarModule.description).toContain("Forja");
  });

  it("ejecuta sin argumentos → menú de secciones", async () => {
    const out = await run([]);
    expect(out).toContain("elige una sección");
    expect(out).toContain("ARMAS");
    expect(out).toContain("HERRAMIENTAS");
  });
});

describe("forjar — sin información engañosa", () => {
  it("receta sin material guía a añadirlo (no muestra stats)", async () => {
    const out = await run(["espada"]);
    expect(out).toContain("Para ver las estadísticas reales");
    expect(out).toContain("material");
    // No debe inventar stats con material representativo
    expect(out).not.toContain("Daño base");
    expect(out).not.toContain("PREVIEW");
  });

  it("el listado de sección NO incluye pistas con daño representativo", async () => {
    const out = await run(["armas"]);
    expect(out).toContain("ARMA");
    expect(out).toContain("espada");
    expect(out).not.toContain("20dmg");
    expect(out).not.toContain("▸");
  });
});

describe("forjar — confirmación con stats reales del material", () => {
  beforeEach(() => {
    forjarModule.pendingForges.clear();
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue({ id: 1, name: "Kael", creator_id: "u1" });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra confirmación con estadísticas reales del material y tier pedido", async () => {
    const out = await run(["espada", "mitril", "B"]);
    expect(out).toContain("CONFIRMA FORJA");
    expect(out).toContain("Mitril");
    expect(out).toContain("Tier B");
    expect(out).toContain("Daño (Tier B)");
    expect(out).toContain("¿Confirmas la forja?");
    // El daño de la confirmación escala con material+tier (no el genérico 20)
    expect(out).not.toContain("Daño base: 20");
    // limpiar pendiente para no disparar el timer en testes posteriores
    await run(["no"]);
  });

  it("confirma con /forjar si → ejecuta el crafteo (spy)", async () => {
    await run(["espada", "acero", "E"]);
    const spy = vi.spyOn(craftingService, "craftEquipment").mockResolvedValue({
      craftedItem: { name: "Espada de Hierro" },
      materialName: "acero",
      materialCost: 2,
      tier: "E",
      producedQuantity: 1,
    });
    const out = await run(["si"]);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ characterId: 1, recipeType: "espada", materialId: "acero", tier: "E" }),
    );
    expect(out).toContain("FORJA EXITOSA");
    expect(out).toContain("Espada de Hierro");
  });

  it("rechaza confirmar sin forja pendiente", async () => {
    const out = await run(["si"]);
    expect(out).toContain("No hay ninguna forja pendiente");
  });

  it("cancela una forja pendiente con /forjar no", async () => {
    await run(["espada", "acero", "E"]);
    const out = await run(["no"]);
    expect(out).toContain("Forja cancelada");
    // Tras cancelar no queda forja pendiente: confirmar no debe forjar nada
    const after = await run(["si"]);
    expect(after).toContain("No hay ninguna forja pendiente");
  });
});
