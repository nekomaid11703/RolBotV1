// @ts-nocheck
const spellCommand = require("../src/commands/rpg/combat/spell");
const equiparSpellCommand = require("../src/commands/rpg/inventory/equipar_spell");
const characterService = require("../src/services/characterService");
const combatState = require("../src/services/rpg/combatState");
const spellContainerService = require("../src/services/rpg/spellContainerService");

const equipmentService = require("../src/services/rpg/equipmentService");

describe("Comando /spell y /equipar_spell", () => {
  let mockCtx;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(equipmentService, "getEquippedSlots").mockResolvedValue({});
    mockCtx = {
      sender: "123456789",
      args: [],
      reply: vi.fn(),
    };
  });

  it("devuelve error si el usuario no tiene personaje activo", async () => {
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(null);

    await spellCommand.execute(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("No tienes un personaje activo"));
  });

  it("muestra el menú interactivo /spell cuando no hay subcomandos", async () => {
    const mockChar = {
      id: 1,
      name: "MagoPrueba",
      raza: "humano",
      clase: "mago",
      nivel: 20,
      stats: { fulgor: 20 },
      hp_actual: 40,
    };
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);
    vi.spyOn(combatState, "findSessionByCharacter").mockReturnValue(null);
    vi.spyOn(spellContainerService, "getActiveSpells").mockResolvedValue({
      slots: { spell_1: null, spell_2: null, spell_3: null, spell_4: null },
      activeSpells: [],
      activeCount: 0,
      maxSlots: 4,
    });

    await spellCommand.execute(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("MENU DE HECHIZOS"));
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("HECHIZOS EQUIPADOS"));
  });

  it("responde al subcomando /spell contenedores", async () => {
    const mockChar = { id: 1, name: "MagoPrueba", stats: { fulgor: 20 } };
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);
    vi.spyOn(spellContainerService, "getSpellContainersInInventory").mockResolvedValue([
      { index: 1, itemId: "grimorio", name: "Grimorio", quantity: 1, capacity: 4 },
    ]);

    mockCtx.args = ["contenedores"];
    await spellCommand.execute(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("CONTENEDORES EN INVENTARIO"));
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("Grimorio"));
  });

  it("comando /equipar_spell muestra ayuda si no recibe argumentos", async () => {
    const mockChar = { id: 1, name: "MagoPrueba", stats: { fulgor: 20 } };
    vi.spyOn(characterService, "getActiveCharacter").mockResolvedValue(mockChar);

    await equiparSpellCommand.execute(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalledWith(expect.stringContaining("EQUIPAR HECHIZO"));
  });
});
