// @ts-nocheck
const { supabase } = require("../src/database/supabase");
const { getItem } = require("../src/data/items");
const {
  CONTAINER_CAPACITIES,
  ACTIVE_SPELL_SLOTS,
  getActiveSpells,
  getSpellContainersInInventory,
  equipActiveSpell,
  unequipActiveSpell,
  getSpellDetails,
} = require("../src/services/rpg/spellContainerService");

describe("spellContainerService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("registra las definiciones de los contenedores de hechizos en el catálogo", () => {
    const libreta = getItem("libreta_desgastada");
    const pergamino = getItem("pergamino");
    const grimorio = getItem("grimorio");
    const grimorioArcano = getItem("grimorio_arcano");

    expect(libreta).toBeTruthy();
    expect(libreta.modules?.spellContainer?.capacity).toBe(2);

    expect(pergamino).toBeTruthy();
    expect(pergamino.modules?.spellContainer?.capacity).toBe(1);

    expect(grimorio).toBeTruthy();
    expect(grimorio.modules?.spellContainer?.capacity).toBe(4);

    expect(grimorioArcano).toBeTruthy();
    expect(grimorioArcano.modules?.spellContainer?.capacity).toBe(8);
  });

  it("mantiene exactamente 4 slots de hechizos activos", () => {
    expect(ACTIVE_SPELL_SLOTS).toEqual(["spell_1", "spell_2", "spell_3", "spell_4"]);
  });

  it("getActiveSpells obtiene las ranuras activas equipadas", async () => {
    vi.spyOn(supabase, "from").mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              equipped_slots: {
                spell_1: "venda", // fallback item
              },
            },
            error: null,
          }),
        }),
      }),
    }));

    const result = await getActiveSpells(101);
    expect(result.maxSlots).toBe(4);
    expect(result.slots.spell_1).toBe("venda");
    expect(result.slots.spell_2).toBeNull();
    expect(result.activeCount).toBe(1);
  });

  it("getSpellDetails extrae metadatos técnicos de un hechizo", () => {
    // Registra o prueba un id de hechizo genérico
    const details = getSpellDetails("venda"); // ítem general como fallback
    expect(details).toBeTruthy();
    expect(details.id).toBe("venda");
  });
});
