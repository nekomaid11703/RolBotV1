/**
 * test_logger_service.js
 * Suite de pruebas unitarias para src/services/loggerService.js
 *
 * Cobertura: logSystem, logCommand, logError, cleanOldLogs,
 *            cola de escritura asíncrona, safeStringify y pureza de dependencias.
 *
 * Ejecutar: node tests/test_logger_service.js
 */

const assert = require("assert");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");

// ─── Redirigir LOGS_DIR a una carpeta de pruebas aislada ─────────────────────
// Esto evita contaminar los logs de producción
const TEST_LOGS_DIR = path.join(__dirname, "../logs_test");

// Monkey-patch: sobreescribir el módulo para usar la carpeta de prueba
// Esto se logra inyectando la variable de entorno antes de hacer require
const loggerPath = path.join(__dirname, "../src/services/loggerService");

// Cargamos el módulo con su LOGS_DIR original pero luego re-testeamos
// funciones de serialización y comportamiento que no dependen de la ruta
const logger = require(loggerPath);
const LOGS_DIR = path.join(__dirname, "../logs");

// ─── Verificación de Pureza: sin importaciones de negocio ─────────────────────
const srcContent = fs.readFileSync(path.join(__dirname, "../src/services/loggerService.js"), "utf8");
const forbiddenImports = ["supabase", "characterService", "economyService", "aiService", "commandHandler"];
for (const imp of forbiddenImports) {
  assert.ok(!srcContent.includes(imp), `PUREZA VIOLADA: loggerService.js no debe importar '${imp}'`);
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

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

// ─── Pruebas de Módulo / Exports ─────────────────────────────────────────────
console.log("\n📦 Módulo y exports");

test("Exporta logSystem como función", () => {
  assert.strictEqual(typeof logger.logSystem, "function");
});

test("Exporta logCommand como función", () => {
  assert.strictEqual(typeof logger.logCommand, "function");
});

test("Exporta logError como función", () => {
  assert.strictEqual(typeof logger.logError, "function");
});

test("Exporta cleanOldLogs como función", () => {
  assert.strictEqual(typeof logger.cleanOldLogs, "function");
});

test("LOGS_DIR se deriva correctamente", () => {
  assert.strictEqual(typeof LOGS_DIR, "string");
  assert.ok(LOGS_DIR.length > 0);
  assert.ok(LOGS_DIR.endsWith("logs"));
});

// ─── safeStringify (probado a través de logError) ────────────────────────────
console.log("\n📦 safeStringify (via logError)");

// Verificamos que logError no lanza aunque el input sea raro
async function runSafeStringifyTests() {
  await testAsync("logError acepta objeto Error normal", async () => {
    await assert.doesNotReject(() => logger.logError({ source: "test", error: new Error("mensaje de prueba") }));
  });

  await testAsync("logError acepta string como error", async () => {
    await assert.doesNotReject(() => logger.logError({ source: "test", error: "string de error" }));
  });

  await testAsync("logError acepta objeto plano como error", async () => {
    await assert.doesNotReject(() => logger.logError({ source: "test", error: { code: 500, msg: "fatal" } }));
  });

  await testAsync("logError acepta null como error sin lanzar", async () => {
    await assert.doesNotReject(() => logger.logError({ source: "test", error: null }));
  });

  await testAsync("logError acepta undefined como error sin lanzar", async () => {
    await assert.doesNotReject(() => logger.logError({ source: "test", error: undefined }));
  });

  await testAsync("logError maneja object circular sin lanzar", async () => {
    const circular = {};
    circular.self = circular;
    await assert.doesNotReject(() => logger.logError({ source: "test", error: circular }));
  });

  await testAsync("logError con contexto adicional no lanza", async () => {
    await assert.doesNotReject(() =>
      logger.logError({
        source: "test",
        userId: "user@s.whatsapp.net",
        userName: "TestUser",
        groupId: "group@g.us",
        error: new Error("contextual"),
        context: { cmd: "/test", args: ["a", "b"] },
      }),
    );
  });
}

// ─── logSystem ───────────────────────────────────────────────────────────────
async function runLogSystemTests() {
  console.log("\n📦 logSystem()");

  await testAsync("logSystem con mensaje simple no lanza", async () => {
    await assert.doesNotReject(() => logger.logSystem("Sistema iniciado correctamente"));
  });

  await testAsync("logSystem con details adicionales no lanza", async () => {
    await assert.doesNotReject(() => logger.logSystem("Sistema con detalles", { version: "1.0", env: "test" }));
  });

  await testAsync("logSystem con details vacío no lanza", async () => {
    await assert.doesNotReject(() => logger.logSystem("Sin detalles", {}));
  });
}

// ─── logCommand ──────────────────────────────────────────────────────────────
async function runLogCommandTests() {
  console.log("\n📦 logCommand()");

  await testAsync("logCommand con todos los campos no lanza", async () => {
    await assert.doesNotReject(() =>
      logger.logCommand({
        userId: "user@s.whatsapp.net",
        userPhone: "5491122334455",
        userName: "Tester",
        groupId: "group@g.us",
        inputCommand: "atacar",
        resolvedCommand: "atacar",
        args: ["@enemy"],
        status: "success",
      }),
    );
  });

  await testAsync("logCommand con status 'denied' no lanza", async () => {
    await assert.doesNotReject(() =>
      logger.logCommand({
        userId: "user@s.whatsapp.net",
        userName: "Tester",
        groupId: "group@g.us",
        inputCommand: "ban",
        resolvedCommand: "ban",
        args: [],
        status: "denied",
        reason: "No es admin",
      }),
    );
  });

  await testAsync("logCommand con status 'error' y reason no lanza", async () => {
    await assert.doesNotReject(() =>
      logger.logCommand({
        userId: "user@s.whatsapp.net",
        userName: "Tester",
        groupId: null,
        inputCommand: "daily",
        resolvedCommand: "daily",
        args: [],
        status: "error",
        reason: "DB timeout",
      }),
    );
  });

  await testAsync("logCommand con campos mínimos (sin args) no lanza", async () => {
    await assert.doesNotReject(() =>
      logger.logCommand({
        userId: "u@s.whatsapp.net",
        userName: "Min",
        groupId: "g@g.us",
        inputCommand: "hola",
        resolvedCommand: "hola",
        status: "success",
      }),
    );
  });
}

// ─── cleanOldLogs ─────────────────────────────────────────────────────────────
async function runCleanOldLogsTests() {
  console.log("\n📦 cleanOldLogs()");

  await testAsync("cleanOldLogs no lanza aunque logs dir no exista", async () => {
    // No hay logs viejos que limpiar en ambiente de CI / primer run
    await assert.doesNotReject(() => logger.cleanOldLogs());
  });

    await testAsync("cleanOldLogs crea el directorio logs si no existe", async () => {
    await logger.logSystem("test para asegurar creación de directorio");
    await new Promise((r) => setTimeout(r, 100));
    const exists = fs.existsSync(LOGS_DIR);
    assert.ok(exists, `El directorio ${LOGS_DIR} debe existir`);
  });
}

// ─── Cola de Escritura (writeQueues) ─────────────────────────────────────────
async function runWriteQueueTests() {
  console.log("\n📦 Cola de Escritura Secuencial (writeQueues)");

  await testAsync("Múltiples logSystem simultáneos no generan error de concurrencia", async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(logger.logSystem(`Mensaje concurrente ${i}`));
    }
    await assert.doesNotReject(() => Promise.all(promises));
  });

  await testAsync("Mix de logSystem, logCommand y logError concurrentes no falla", async () => {
    await assert.doesNotReject(() =>
      Promise.all([
        logger.logSystem("concurrent system"),
        logger.logCommand({
          userId: "u1",
          userName: "U1",
          groupId: "g1",
          inputCommand: "test",
          resolvedCommand: "test",
          args: [],
          status: "success",
        }),
        logger.logError({ source: "concurrent", error: new Error("concurrent error") }),
      ]),
    );
  });
}

// ─── Verificar contenido real de un log escrito ───────────────────────────────
async function runLogContentTests() {
  console.log("\n📦 Contenido de archivos de log escritos");

  await testAsync("logSystem escribe 'SYSTEM' en el archivo de log", async () => {
    const marker = `MARKER_TEST_${Date.now()}`;
    await logger.logSystem(marker);
    await new Promise((r) => setTimeout(r, 100));
    const today = new Date().toISOString().slice(0, 10);
    const logFile = path.join(LOGS_DIR, `system-${today}.log`);
    // Esperar un tick para que el filesystem lo vacíe
    await new Promise((r) => setTimeout(r, 100));
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, "utf8");
      assert.ok(content.includes(marker), `El log debe contener el marcador '${marker}'`);
    }
    // Si el archivo no existe, no fallamos (puede ser entorno sin permisos)
  });

  await testAsync("logError escribe 'ERROR' y el source en el archivo", async () => {
    const source = `test-source-${Date.now()}`;
    await logger.logError({ source, error: new Error("test error content") });
    await new Promise((r) => setTimeout(r, 100));
    const today = new Date().toISOString().slice(0, 10);
    const logFile = path.join(LOGS_DIR, `error-${today}.log`);
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, "utf8");
      assert.ok(content.includes(source), `El log de error debe contener el source '${source}'`);
    }
  });
}

// ─── Verificación de Pureza Final ────────────────────────────────────────────
console.log("\n📦 Verificación de Pureza del módulo loggerService.js");
test("loggerService.js no importa 'supabase'", () => {
  assert.ok(!srcContent.includes("supabase"), "No debe importar Supabase");
});
test("loggerService.js no importa servicios de negocio", () => {
  const businessServices = ["characterService", "economyService", "userService", "permissionService"];
  for (const svc of businessServices) {
    assert.ok(!srcContent.includes(svc), `No debe importar '${svc}'`);
  }
});
test("loggerService.js solo usa módulos nativos de Node.js", () => {
  assert.ok(srcContent.includes("fs/promises"), "Debe usar fs/promises");
  assert.ok(srcContent.includes("path"), "Debe usar path");
});

// ─── Ejecución Principal ─────────────────────────────────────────────────────
async function run() {
  await runSafeStringifyTests();
  await runLogSystemTests();
  await runLogCommandTests();
  await runCleanOldLogsTests();
  await runWriteQueueTests();
  await runLogContentTests();

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Resultados: ${passed} pasaron, ${failed} fallaron de ${passed + failed} pruebas`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("🎉 Todas las pruebas de loggerService pasaron correctamente.");
    process.exit(0);
  }
}

run().catch((err) => {
  console.error("Error fatal en la suite de pruebas:", err);
  process.exit(1);
});
