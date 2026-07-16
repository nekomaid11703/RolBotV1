const path = require("path");
const fs = require("fs");

const { box, formatCommandUsage, formatCommandForm, formatError } = require(
  path.join(__dirname, "../src/utils/messageFormatUtils"),
);

const srcContent = fs.readFileSync(path.join(__dirname, "../src/utils/messageFormatUtils.js"), "utf8");

describe("Pureza del módulo", () => {
  const forbiddenImports = ["supabase", "characterService", "economyService", "loggerService", "aiService"];
  for (const imp of forbiddenImports) {
    it(`no importa '${imp}'`, () => {
      expect(srcContent.includes(`require`) && srcContent.includes(imp)).toBe(false);
    });
  }
});

describe("box()", () => {
  it("Genera una caja con título y líneas de cuerpo", () => {
    const result = box("🎲 Tirada", ["Línea 1", "Línea 2"]);
    expect(result.includes("🎲 Tirada")).toBe(true);
    expect(result.includes("Línea 1")).toBe(true);
    expect(result.includes("Línea 2")).toBe(true);
    expect(result.trimStart().startsWith("╭")).toBe(true);
    const lastLine = result.trimEnd().split("\n").pop();
    expect(lastLine.startsWith("╰")).toBe(true);
  });
  it("Ignora líneas null o undefined en el cuerpo", () => {
    const result = box("Test", [null, undefined, "visible"]);
    const lines = result.split("\n");
    expect(lines.length).toBe(4);
    expect(result.includes("visible")).toBe(true);
  });
  it("Línea vacía '' se convierte en '│ ' vacío", () => {
    const result = box("Test", [""]);
    expect(result.includes("│")).toBe(true);
  });
  it("Funciona con cuerpo vacío (solo título)", () => {
    const result = box("Solo Título", []);
    expect(result.includes("Solo Título")).toBe(true);
    expect(result.split("\n").length).toBe(3);
  });
  it("Convierte valores no-string a string", () => {
    const result = box("Test", [42, true, { key: "val" }]);
    expect(result.includes("42")).toBe(true);
    expect(result.includes("true")).toBe(true);
  });
});

describe("formatCommandUsage()", () => {
  it("Retorna un string que contiene '*Uso*'", () => {
    const result = formatCommandUsage({ title: "Test", usage: "/test" });
    expect(typeof result).toBe("string");
    expect(result.includes("*Uso*")).toBe(true);
  });
  it("El ejemplo aparece en el output", () => {
    const result = formatCommandUsage({ title: "Test", usage: "/test @x", example: "/test @Kael" });
    expect(result.includes("/test @Kael")).toBe(true);
  });
  it("No incluye líneas null/undefined en el output final", () => {
    const result = formatCommandUsage({ title: "Test", usage: "/test" });
    expect(result.includes("null")).toBe(false);
    expect(result.includes("undefined")).toBe(false);
  });
});

describe("formatCommandForm()", () => {
  it("Retorna un string que contiene '*Plantilla*'", () => {
    const result = formatCommandForm({ title: "Formulario", command: "/form", fields: ["Campo A"] });
    expect(typeof result).toBe("string");
    expect(result.includes("*Plantilla*")).toBe(true);
  });
});

describe("formatError()", () => {
  it("Contiene el mensaje de error y el ícono '❌'", () => {
    const result = formatError("Algo salió mal");
    expect(result.includes("❌")).toBe(true);
    expect(result.includes("Algo salió mal")).toBe(true);
    expect(result.includes("No se pudo completar")).toBe(true);
  });
  it("Incluye el hint cuando se proporciona", () => {
    const result = formatError("Error fatal", "Usa /help para más info");
    expect(result.includes("Usa /help para más info")).toBe(true);
  });
  it("Funciona correctamente sin hint (solo mensaje)", () => {
    const result = formatError("Sin hint");
    expect(result.includes("null")).toBe(false);
    expect(result.includes("undefined")).toBe(false);
  });
  it("El mensaje de error largo no rompe el formato", () => {
    const longMsg = "Error: ".padEnd(300, "x");
    const result = formatError(longMsg);
    expect(result.includes("❌")).toBe(true);
    expect(typeof result).toBe("string");
  });
});

describe("Casos Edge", () => {
  it("formatError con string vacío no rompe", () => {
    expect(typeof formatError("")).toBe("string");
  });
  it("box() con título muy largo no rompe", () => {
    const longTitle = "Título".padEnd(200, " largo");
    const result = box(longTitle, ["contenido"]);
    expect(result.includes("contenido")).toBe(true);
  });
  it("formatCommandUsage con título en minúsculas lo convierte a MAYÚSCULAS", () => {
    const result = formatCommandUsage({ title: "minúsculas", usage: "/cmd" });
    expect(result.includes("MINÚSCULAS")).toBe(true);
  });
});
