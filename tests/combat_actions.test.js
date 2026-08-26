// @ts-nocheck
const { COMBAT_ACTIONS, REACTION_ACTIONS } = require("../src/data/combatActions");
const { formatActionMenu, formatReactionPrompt } = require("../src/services/rpg/combatMessages");

describe("combatActions — registro declarativo de acciones", () => {
  it("COMBAT_ACTIONS incluye ataque, consumible, descanso, huida y movimiento", () => {
    const commands = COMBAT_ACTIONS.map((a) => a.command);
    expect(commands).toEqual(expect.arrayContaining(["atacar", "usar", "descansar", "huir", "avanzar", "retroceder"]));
  });

  it("Cada acción de turno tiene command y label", () => {
    for (const a of COMBAT_ACTIONS) {
      expect(a.command).toBeTruthy();
      expect(a.label).toBeTruthy();
    }
  });

  it("REACTION_ACTIONS expone esquivar y bloquear con render", () => {
    expect(REACTION_ACTIONS.map((a) => a.command)).toEqual(["esquivar", "bloquear"]);
    for (const a of REACTION_ACTIONS) {
      expect(typeof a.render).toBe("function");
    }
  });

  it("El menú de acción refleja el registro (incluye avanzar/retroceder)", () => {
    const menu = formatActionMenu("Kael");
    expect(menu).toContain("/atacar");
    expect(menu).toContain("/usar");
    expect(menu).toContain("/huir");
    expect(menu).toContain("/descansar");
    expect(menu).toContain("/avanzar");
    expect(menu).toContain("/retroceder");
  });

  it("El prompt de reacción refleja el registro", () => {
    const prompt = formatReactionPrompt("A", "B", 20, true);
    expect(prompt).toContain("/esquivar");
    expect(prompt).toContain("/bloquear");
    expect(prompt).toContain("0");
  });
});
