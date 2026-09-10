const { formatCharacter, buildHpBar, formatHpState } = require("../src/utils/characterFormatUtils");

const mockCharacter = {
  name: "Kael",
  clase: "Aventurero",
  rango: "F",
  nivel: 25,
  hp_actual: 75,
  stats: { hp: 50, atk: 4, def: 1, aspd: 3, ref: 1, mspd: 1 },
  slots: {
    historia: "Un viajero que busca reliquias antiguas.",
  },
  item_count: 3,
};

describe("characterFormatUtils — buildHpBar", () => {
  it.each([
    [100, 100, "[██████████]"],
    [0, 100, "[░░░░░░░░░░]"],
    [50, 100, "[█████░░░░░]"],
    [75, 100, "[████████░░]"],
  ])("HP %i/%i genera la barra esperada", (hp, max, expected) => {
    expect(buildHpBar(hp, max)).toBe(expected);
  });
});

describe("characterFormatUtils — formatCharacter", () => {
  it.each([
    ["el nombre", (out) => expect(out).toContain("KAEL")],
    ["la clase", (out) => expect(out).toContain("Aventurero")],
    ["el nivel", (out) => expect(out).toMatch(/\bNivel 25\b/)],
    ["la barra de HP", (out) => expect(out).toContain("75/100")],
    [
      "todas las stats",
      (out) => {
        for (const s of ["ATK: 4", "DEF: 1", "ASPD: 3", "REF: 1", "MSPD: 1"]) expect(out).toContain(s);
      },
    ],
    ["el conteo de items", (out) => expect(out).toContain("Items: 3")],
    ["la historia si existe", (out) => expect(out).toContain("reliquias antiguas")],
  ])("Incluye %s", (label, assert) => {
    assert(formatCharacter(mockCharacter));
  });

  it("Maneja personaje sin stats", () => {
    const minimal = {
      name: "Test",
      clase: "Civil",
      rango: "F",
      nivel: 20,
      hp_actual: 100,
      stats: {},
      slots: {},
      item_count: 0,
    };
    const output = formatCharacter(minimal);
    expect(output).toContain("TEST");
    expect(output).toContain("Civil");
  });

  it("Maneja personaje sin historia", () => {
    const noHist = { ...mockCharacter, slots: {} };
    const output = formatCharacter(noHist);
    expect(output).not.toContain("📜");
  });

  it("Muestra la sección EQUIPO si se pasa equipment resuelto", () => {
    const equipment = {
      weapon: { name: "Espada de Hierro", damageNature: "cortante", baseDamage: 8 },
      armor: [{ name: "Pechera de Hierro", coverage: "pecho", currentResist: 10, maxResist: 10, broken: false }],
      totalCurrentResist: 10,
      totalMaxResist: 10,
      setBonuses: [{ name: "Hierro", count: 4, active: true, bonus: { atk: 5 } }],
      artifacts: [{ name: "Amuleto de Hierro" }],
    };
    const output = formatCharacter(mockCharacter, null, null, equipment);
    expect(output).toContain("EQUIPO");
    expect(output).toContain("Espada de Hierro");
    expect(output).toContain("Pechera de Hierro");
    expect(output).not.toContain("\uD83D\uDDE1\uFE0F");
  });

  it("No muestra la sección EQUIPO sin equipment", () => {
    const output = formatCharacter(mockCharacter);
    expect(output).not.toContain("EQUIPO");
  });
});
