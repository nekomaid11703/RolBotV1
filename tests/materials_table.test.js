const { getMaterialsTable, getMaterialsTableMarkdown } = require("../src/services/rpg/progressionAnalyticsService");
const { MATERIALS } = require("../src/data/materialData");

describe("tabla de accesibilidad de materiales", () => {
  it("incluye todos los materiales salvo el conceptual etéreo", () => {
    const expected = Object.keys(MATERIALS).filter((id) => id !== "etereo").length;
    const rows = getMaterialsTable();
    expect(rows).toHaveLength(expected);
    for (const row of rows) {
      expect(row.name).toBeTruthy();
      expect(typeof row.afilabilidad).toBe("number");
      expect(typeof row.conduccionMagica).toBe("number");
      expect(typeof row.resistenciaMaterial).toBe("number");
      expect(typeof row.flexibilidad).toBe("number");
      expect(row.acquisition.length).toBeGreaterThan(0);
    }
  });

  it("marca como sin ruta los materiales sin método de obtención", () => {
    const rows = getMaterialsTable();
    const sinRuta = rows.filter((row) => row.unreachable).map((row) => row.id);
    expect(sinRuta).toEqual(
      expect.arrayContaining([
        "obsidiana",
        "coraza_desgastada",
        "coraza_robusta",
        "madera_ebano",
        "titanio",
        "mitril",
        "piel_bestial",
        "madera_noble",
        "mineral_palido",
        "obsidiana_azul",
        "luminita",
        "madera_tetrica",
        "filo_estelar",
        "fulgorita",
        "piel_titan",
        "madera_irminsul",
      ]),
    );
    expect(sinRuta).toHaveLength(16);
  });

  it("describe los métodos de acero (expedición y tienda)", () => {
    const rows = getMaterialsTable();
    const acero = rows.find((row) => row.id === "acero");
    expect(acero.acquisition.some((text) => text.startsWith("Exp."))).toBe(true);
    expect(acero.acquisition.some((text) => text.startsWith("Tienda"))).toBe(true);
  });

  it("genera markdown con cabecera y una fila por material", () => {
    const markdown = getMaterialsTableMarkdown();
    expect(markdown).toContain("| Material |");
    expect(markdown).toContain("SIN RUTA");
    expect(markdown.split("\n").filter((line) => line.startsWith("| ") && line.includes("`"))).toHaveLength(
      Object.keys(MATERIALS).filter((id) => id !== "etereo").length,
    );
  });
});
