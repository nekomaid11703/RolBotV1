/**
 * test_message_format_utils.js
 * Suite de pruebas unitarias para src/utils/messageFormatUtils.js
 *
 * Cobertura: box, formatCommandUsage, formatCommandForm,
 *            formatFeedback, formatError, y funciones internas.
 *
 * Ejecutar: node tests/test_message_format_utils.js
 */

const assert = require("assert");
const path = require("path");

const {
  LINE,
  BOX_TOP,
  BOX_BTM,
  BAR,
  box,
  buildUsageBody,
  buildFormBody,
  buildFeedbackBody,
  formatCommandUsage,
  formatCommandForm,
  formatFeedback,
  formatError,
} = require(path.join(__dirname, "../src/utils/messageFormatUtils"));

// ─── Verificación de Pureza: sin importaciones de negocio ─────────────────────
const fs = require("fs");
const srcContent = fs.readFileSync(path.join(__dirname, "../src/utils/messageFormatUtils.js"), "utf8");
const forbiddenImports = ["supabase", "characterService", "economyService", "loggerService", "aiService"];
for (const imp of forbiddenImports) {
  assert.ok(
    !srcContent.includes(`require`) || !srcContent.includes(imp),
    `PUREZA VIOLADA: messageFormatUtils.js no debe importar '${imp}'`,
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

// ─── Constantes Exportadas ────────────────────────────────────────────────────
console.log("\n📦 Constantes exportadas");

test("LINE es un string no vacío", () => {
  assert.strictEqual(typeof LINE, "string");
  assert.ok(LINE.length > 0);
});

test("BOX_TOP empieza con '╭'", () => {
  assert.ok(BOX_TOP.startsWith("╭"));
});

test("BOX_BTM empieza con '╰'", () => {
  assert.ok(BOX_BTM.startsWith("╰"));
});

test("BAR es el prefijo de línea de caja", () => {
  assert.ok(BAR.includes("│"));
});

// ─── box() ────────────────────────────────────────────────────────────────────
console.log("\n📦 box()");

test("Genera una caja con título y líneas de cuerpo", () => {
  const result = box("🎲 Tirada", ["Línea 1", "Línea 2"]);
  assert.ok(result.includes("🎲 Tirada"), "Debe contener el título");
  assert.ok(result.includes("Línea 1"));
  assert.ok(result.includes("Línea 2"));
  assert.ok(result.startsWith(BOX_TOP));
  assert.ok(result.endsWith(BOX_BTM));
});

test("Ignora líneas null o undefined en el cuerpo", () => {
  const result = box("Test", [null, undefined, "visible"]);
  const lines = result.split("\n");
  // Debe haber: BOX_TOP, título, línea visible, BOX_BTM = 4 líneas
  assert.strictEqual(lines.length, 4);
  assert.ok(result.includes("visible"));
});

test("Línea vacía '' se convierte en '│ ' vacío", () => {
  const result = box("Test", [""]);
  assert.ok(result.includes(BAR.trimEnd() + "\n") || result.includes(`\n${BAR.trimEnd()}\n`) || result.includes(BAR));
});

test("Funciona con cuerpo vacío (solo título)", () => {
  const result = box("Solo Título", []);
  assert.ok(result.includes("Solo Título"));
  const lines = result.split("\n");
  assert.strictEqual(lines.length, 3); // TOP, título, BTM
});

test("Convierte valores no-string a string", () => {
  const result = box("Test", [42, true, { key: "val" }]);
  assert.ok(result.includes("42"));
  assert.ok(result.includes("true"));
});

// ─── buildUsageBody() ────────────────────────────────────────────────────────
console.log("\n📦 buildUsageBody()");

test("Genera cuerpo de uso con todos los campos", () => {
  const body = buildUsageBody({
    icon: "🎯",
    title: "Atacar",
    description: "Ataca a un enemigo",
    usage: "/atacar @usuario",
    example: "/atacar @Kael",
    notes: ["Solo en combate", "Requiere arma"],
  });
  assert.ok(Array.isArray(body));
  const joined = body.join("\n");
  assert.ok(joined.includes("*ATACAR*"));
  assert.ok(joined.includes("*Uso*"));
  assert.ok(joined.includes("/atacar @usuario"));
  assert.ok(joined.includes("*Ejemplo*"));
  assert.ok(joined.includes("/atacar @Kael"));
  assert.ok(joined.includes("*Notas*"));
  assert.ok(joined.includes("Solo en combate"));
});

test("Funciona sin description, example y notes", () => {
  const body = buildUsageBody({
    title: "Minimal",
    usage: "/min",
  });
  const joined = body.join("\n");
  assert.ok(joined.includes("*Uso*"));
  assert.ok(!joined.includes("*Ejemplo*"));
  assert.ok(!joined.includes("*Notas*"));
});

test("Usa 'COMANDO' como título por defecto cuando no se pasa title", () => {
  const body = buildUsageBody({ usage: "/test" });
  assert.ok(body.join("\n").includes("*COMANDO*"));
});

// ─── buildFormBody() ─────────────────────────────────────────────────────────
console.log("\n📦 buildFormBody()");

test("Genera cuerpo de formulario con campos y ejemplo", () => {
  const body = buildFormBody({
    icon: "📋",
    title: "Crear PJ",
    description: "Crea un personaje",
    command: "/crear_pj",
    fields: ["Nombre", "Clase", "Historia"],
    example: ["/crear_pj", "Nombre: Kael", "Clase: Guerrero", "Historia: Un héroe."],
    notes: ["Nombre requerido"],
  });
  const joined = body.join("\n");
  assert.ok(joined.includes("*CREAR PJ*"));
  assert.ok(joined.includes("*Plantilla*"));
  assert.ok(joined.includes("Nombre: "));
  assert.ok(joined.includes("*Ejemplo*"));
  assert.ok(joined.includes("Un héroe."));
  assert.ok(joined.includes("*Notas*"));
});

test("Funciona con fields vacío y sin example ni notes", () => {
  const body = buildFormBody({ title: "Vacío", command: "/vacio", fields: [] });
  const joined = body.join("\n");
  assert.ok(joined.includes("*Plantilla*"));
  assert.ok(!joined.includes("*Ejemplo*"));
  assert.ok(!joined.includes("*Notas*"));
});

// ─── formatCommandUsage() ────────────────────────────────────────────────────
console.log("\n📦 formatCommandUsage()");

test("Retorna un string que contiene '*Uso*'", () => {
  const result = formatCommandUsage({ title: "Test", usage: "/test" });
  assert.strictEqual(typeof result, "string");
  assert.ok(result.includes("*Uso*"));
});

test("El ejemplo aparece en el output", () => {
  const result = formatCommandUsage({
    title: "Test",
    usage: "/test @x",
    example: "/test @Kael",
  });
  assert.ok(result.includes("/test @Kael"));
});

test("No incluye líneas null/undefined en el output final", () => {
  const result = formatCommandUsage({ title: "Test", usage: "/test" });
  assert.ok(!result.includes("null"));
  assert.ok(!result.includes("undefined"));
});

// ─── formatCommandForm() ─────────────────────────────────────────────────────
console.log("\n📦 formatCommandForm()");

test("Retorna un string que contiene '*Plantilla*'", () => {
  const result = formatCommandForm({
    title: "Formulario",
    command: "/form",
    fields: ["Campo A"],
  });
  assert.strictEqual(typeof result, "string");
  assert.ok(result.includes("*Plantilla*"));
});

// ─── formatFeedback() ────────────────────────────────────────────────────────
console.log("\n📦 formatFeedback()");

test("Contiene el título e ícono proporcionados", () => {
  const result = formatFeedback({
    icon: "⚠️",
    title: "Advertencia",
    lines: ["Esto es un aviso"],
  });
  assert.ok(result.includes("⚠️"));
  assert.ok(result.includes("*Advertencia*"));
  assert.ok(result.includes("Esto es un aviso"));
});

test("Usa valores por defecto cuando no se pasan parámetros", () => {
  const result = formatFeedback({});
  assert.ok(result.includes("ℹ️"));
  assert.ok(result.includes("*Aviso*"));
});

test("Maneja array de lines vacío", () => {
  const result = formatFeedback({ lines: [] });
  assert.strictEqual(typeof result, "string");
  assert.ok(result.length > 0);
});

// ─── formatError() ───────────────────────────────────────────────────────────
console.log("\n📦 formatError()");

test("Contiene el mensaje de error y el ícono '❌'", () => {
  const result = formatError("Algo salió mal");
  assert.ok(result.includes("❌"));
  assert.ok(result.includes("Algo salió mal"));
  assert.ok(result.includes("No se pudo completar"));
});

test("Incluye el hint cuando se proporciona", () => {
  const result = formatError("Error fatal", "Usa /help para más info");
  assert.ok(result.includes("Usa /help para más info"));
});

test("Funciona correctamente sin hint (solo mensaje)", () => {
  const result = formatError("Sin hint");
  assert.ok(!result.includes("null"));
  assert.ok(!result.includes("undefined"));
});

test("El mensaje de error largo no rompe el formato", () => {
  const longMsg = "Error: ".padEnd(300, "x");
  const result = formatError(longMsg);
  assert.ok(result.includes("❌"));
  assert.strictEqual(typeof result, "string");
});

// ─── Casos Edge Generales ─────────────────────────────────────────────────────
console.log("\n📦 Casos Edge");

test("formatError con string vacío no rompe", () => {
  const result = formatError("");
  assert.strictEqual(typeof result, "string");
});

test("box() con título muy largo no rompe", () => {
  const longTitle = "Título".padEnd(200, " largo");
  const result = box(longTitle, ["contenido"]);
  assert.ok(result.includes("contenido"));
});

test("formatCommandUsage con título en minúsculas lo convierte a MAYÚSCULAS", () => {
  const result = formatCommandUsage({ title: "minúsculas", usage: "/cmd" });
  assert.ok(result.includes("MINÚSCULAS"));
});

// ─── Resultado Final ──────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`Resultados: ${passed} pasaron, ${failed} fallaron de ${passed + failed} pruebas`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Todas las pruebas pasaron correctamente.");
  process.exit(0);
}
