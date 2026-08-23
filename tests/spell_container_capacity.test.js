import { describe, it, expect, vi } from "vitest";
const itemCatalog = require("../src/data/itemCatalog");
const {
  CONTAINER_CAPACITIES,
  getSpellSlotCost,
  getEquippedContainer,
  equipActiveSpell,
} = require("../src/services/rpg/spellContainerService");
const equipmentService = require("../src/services/rpg/equipmentService");

describe("Contenedores de Hechizos — Capacidades y Ranuras por Tier", () => {
  it("debe tener definidas las capacidades de ranuras para todos los contenedores", () => {
    expect(CONTAINER_CAPACITIES.pergamino).toBe(1);
    expect(CONTAINER_CAPACITIES.libreta_desgastada).toBe(4);
    expect(CONTAINER_CAPACITIES.grimorio).toBe(12);
    expect(CONTAINER_CAPACITIES.grimorio_arcano).toBe(24);
  });

  it("debe calcular el coste de ranuras por Tier correctamente", () => {
    expect(getSpellSlotCost("S")).toBe(4);
    expect(getSpellSlotCost("A")).toBe(3);
    expect(getSpellSlotCost("B")).toBe(2);
    expect(getSpellSlotCost("C")).toBe(2);
    expect(getSpellSlotCost("D")).toBe(1);
    expect(getSpellSlotCost("E")).toBe(1);
  });

  it("Grimorio Arcano debe poder albergar 6 hechizos Tier S de 4 slots cada uno", () => {
    const tierSCost = getSpellSlotCost("S");
    const maxTierS = CONTAINER_CAPACITIES.grimorio_arcano / tierSCost;
    expect(maxTierS).toBe(6);
  });

  it("debe rechazar equipar un hechizo Tier S si el contenedor no tiene capacidad suficiente", async () => {
    // Registrar hechizo Tier S de prueba (clave en minúsculas para getItem)
    if (!itemCatalog.load("hechizo_mitico_s")) {
      itemCatalog.register("hechizo_mitico_s", () => ({
        id: "hechizo_mitico_s",
        name: "Hechizo Mítico",
        type: "spell",
        tier: "S",
        categories: ["spell"],
        modules: { spell: { tier: "S", fulgorCost: 50 } },
      }));
    }

    // Caso 1: Con Pergamino (capacidad 1), equipar un Tier S (4 slots) debe fallar por capacidad insuficiente
    vi.spyOn(equipmentService, "getEquippedSlots").mockResolvedValue({
      spell_container: "pergamino",
      spell_1: null,
      spell_2: null,
      spell_3: null,
      spell_4: null,
    });

    await expect(
      equipActiveSpell({
        characterId: 101,
        creatorId: "user_1",
        spellId: "hechizo_mitico_s",
        slot: "spell_1",
      }),
    ).rejects.toThrow("Capacidad insuficiente");

    // Caso 2: Con Grimorio Arcano (capacidad 24), equipar un Tier S debe funcionar limpiamente
    vi.spyOn(equipmentService, "getEquippedSlots").mockResolvedValue({
      spell_container: "grimorio_arcano",
      spell_1: null,
      spell_2: null,
      spell_3: null,
      spell_4: null,
    });
    vi.spyOn(equipmentService, "equipItem").mockResolvedValue({
      equipped: "hechizo_mitico_s",
      slot: "spell_1",
      autoUnequipped: [],
    });

    const res = await equipActiveSpell({
      characterId: 101,
      creatorId: "user_1",
      spellId: "hechizo_mitico_s",
      slot: "spell_1",
    });
    expect(res.equipped).toBe("hechizo_mitico_s");
  });
});
