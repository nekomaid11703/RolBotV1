const { formatCharacter, buildHpBar, formatHpState } = require("../src/utils/characterFormatUtils");

const mockCharacter = {
  name: "Kael",
  clase: "Aventurero",
  rango: "F",
  nivel: 25,
  hp_actual: 75,
  stats: { atk: 4, def: 1, aspd: 3, ref: 1, mspd: 1 },
  slots: {
    historia: "Un viajero que busca reliquias antiguas.",
    habilidades: ["golpe_fuerte"],
  },
  item_count: 3,
};

describe("characterFormatUtils — buildHpBar", () => {
  it("HP 100/100 genera barra llena", () => {
    expect(buildHpBar(100, 100)).toBe("[██████████]");
  });

  it("HP 0/100 genera barra vacía", () => {
    expect(buildHpBar(0, 100)).toBe("[░░░░░░░░░░]");
  });

  it("HP 50/100 genera barra mitad", () => {
    expect(buildHpBar(50, 100)).toBe("[█████░░░░░]");
  });

  it("HP 75/100 genera ~8 llenos y ~2 vacíos (round)", () => {
    const bar = buildHpBar(75, 100);
    expect(bar).toBe("[████████░░]");
  });
});

describe("characterFormatUtils — formatHpState", () => {
  it("HP 75 muestra Óptimas", () => {
    expect(formatHpState(75)).toMatch(/Óptimas/);
  });

  it("HP 45 muestra Lastimado", () => {
    expect(formatHpState(45)).toMatch(/Lastimado/);
  });

  it("HP 10 muestra K.O.", () => {
    expect(formatHpState(10)).toMatch(/K\.O\./);
  });
});

describe("characterFormatUtils — formatCharacter", () => {
  it("Incluye el nombre del personaje en mayúsculas", () => {
    const output = formatCharacter(mockCharacter);
    expect(output).toContain("KAEL");
  });

  it("Incluye la clase", () => {
    const output = formatCharacter(mockCharacter);
    expect(output).toContain("Aventurero");
  });

  it("Incluye el nivel", () => {
    const output = formatCharacter(mockCharacter);
    expect(output).toMatch(/\bNivel 25\b/);
  });

  it("Incluye la barra de HP", () => {
    const output = formatCharacter(mockCharacter);
    expect(output).toContain("75/100");
    expect(output).toContain("Óptimas");
  });

  it("Incluye todas las stats", () => {
    const output = formatCharacter(mockCharacter);
    expect(output).toContain("ATK: 4");
    expect(output).toContain("DEF: 1");
    expect(output).toContain("ASPD: 3");
    expect(output).toContain("REF: 1");
    expect(output).toContain("MSPD: 1");
  });

  it("Incluye las habilidades equipadas", () => {
    const output = formatCharacter(mockCharacter);
    expect(output).toContain("golpe_fuerte");
  });

  it("Incluye el conteo de items", () => {
    const output = formatCharacter(mockCharacter);
    expect(output).toContain("Items: 3");
  });

  it("Incluye la historia si existe", () => {
    const output = formatCharacter(mockCharacter);
    expect(output).toContain("reliquias antiguas");
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

  it("Maneja personaje sin habilidades", () => {
    const noSkills = { ...mockCharacter, slots: { ...mockCharacter.slots, habilidades: [] } };
    const output = formatCharacter(noSkills);
    expect(output).not.toContain("⭐ Habilidades");
  });

  it("Maneja personaje sin historia", () => {
    const noHist = { ...mockCharacter, slots: {} };
    const output = formatCharacter(noHist);
    expect(output).not.toContain("📜");
  });
});
