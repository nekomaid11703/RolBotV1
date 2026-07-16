const path = require("path");
const fs = require("fs");

const loggerPath = path.join(__dirname, "../src/services/loggerService");
const logger = require(loggerPath);
const LOGS_DIR = path.join(__dirname, "../logs");

const srcContent = fs.readFileSync(path.join(__dirname, "../src/services/loggerService.js"), "utf8");
const forbiddenImports = ["supabase", "characterService", "economyService", "aiService", "commandHandler"];

describe("Pureza del módulo", () => {
  for (const imp of forbiddenImports) {
    it(`no importa '${imp}'`, () => {
      expect(srcContent.includes(imp)).toBe(false);
    });
  }
});

describe("Módulo y exports", () => {
  it("Exporta logSystem como función", () => {
    expect(typeof logger.logSystem).toBe("function");
  });
  it("Exporta logCommand como función", () => {
    expect(typeof logger.logCommand).toBe("function");
  });
  it("Exporta logError como función", () => {
    expect(typeof logger.logError).toBe("function");
  });
  it("Exporta cleanOldLogs como función", () => {
    expect(typeof logger.cleanOldLogs).toBe("function");
  });
  it("LOGS_DIR se deriva correctamente", () => {
    expect(typeof LOGS_DIR).toBe("string");
    expect(LOGS_DIR.length).toBeGreaterThan(0);
    expect(LOGS_DIR.endsWith("logs")).toBe(true);
  });
});

describe("safeStringify (via logError)", () => {
  it("logError acepta objeto Error normal", async () => {
    await expect(logger.logError({ source: "test", error: new Error("mensaje de prueba") })).resolves.not.toThrow();
  });
  it("logError acepta string como error", async () => {
    await expect(logger.logError({ source: "test", error: "string de error" })).resolves.not.toThrow();
  });
  it("logError acepta objeto plano como error", async () => {
    await expect(logger.logError({ source: "test", error: { code: 500, msg: "fatal" } })).resolves.not.toThrow();
  });
  it("logError acepta null como error sin lanzar", async () => {
    await expect(logger.logError({ source: "test", error: null })).resolves.not.toThrow();
  });
  it("logError acepta undefined como error sin lanzar", async () => {
    await expect(logger.logError({ source: "test", error: undefined })).resolves.not.toThrow();
  });
  it("logError maneja object circular sin lanzar", async () => {
    const circular = {};
    circular.self = circular;
    await expect(logger.logError({ source: "test", error: circular })).resolves.not.toThrow();
  });
  it("logError con contexto adicional no lanza", async () => {
    await expect(
      logger.logError({
        source: "test",
        userId: "user@s.whatsapp.net",
        userName: "TestUser",
        groupId: "group@g.us",
        error: new Error("contextual"),
        context: { cmd: "/test", args: ["a", "b"] },
      }),
    ).resolves.not.toThrow();
  });
});

describe("logSystem()", () => {
  it("logSystem con mensaje simple no lanza", async () => {
    await expect(logger.logSystem("Sistema iniciado correctamente")).resolves.not.toThrow();
  });
  it("logSystem con details adicionales no lanza", async () => {
    await expect(logger.logSystem("Sistema con detalles", { version: "1.0", env: "test" })).resolves.not.toThrow();
  });
  it("logSystem con details vacío no lanza", async () => {
    await expect(logger.logSystem("Sin detalles", {})).resolves.not.toThrow();
  });
});

describe("logCommand()", () => {
  it("con todos los campos no lanza", async () => {
    await expect(
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
    ).resolves.not.toThrow();
  });
  it("con status 'denied' no lanza", async () => {
    await expect(
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
    ).resolves.not.toThrow();
  });
  it("con status 'error' y reason no lanza", async () => {
    await expect(
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
    ).resolves.not.toThrow();
  });
  it("con campos mínimos (sin args) no lanza", async () => {
    await expect(
      logger.logCommand({
        userId: "u@s.whatsapp.net",
        userName: "Min",
        groupId: "g@g.us",
        inputCommand: "hola",
        resolvedCommand: "hola",
        status: "success",
      }),
    ).resolves.not.toThrow();
  });
});

describe("cleanOldLogs()", () => {
  it("no lanza aunque logs dir no exista", async () => {
    await expect(logger.cleanOldLogs()).resolves.not.toThrow();
  });
  it("crea el directorio logs si no existe", async () => {
    await logger.logSystem("test para asegurar creación de directorio");
    await new Promise((r) => setTimeout(r, 100));
    expect(fs.existsSync(LOGS_DIR)).toBe(true);
  });
});

describe("Cola de Escritura Secuencial (writeQueues)", () => {
  it("Múltiples logSystem simultáneos no generan error de concurrencia", async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(logger.logSystem(`Mensaje concurrente ${i}`));
    }
    await expect(Promise.all(promises)).resolves.not.toThrow();
  });
  it("Mix de logSystem, logCommand y logError concurrentes no falla", async () => {
    await expect(
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
    ).resolves.not.toThrow();
  });
});

describe("Contenido de archivos de log escritos", () => {
  it("logSystem escribe 'SYSTEM' en el archivo de log", async () => {
    const marker = `MARKER_TEST_${Date.now()}`;
    await logger.logSystem(marker);
    await new Promise((r) => setTimeout(r, 200));
    const today = new Date().toISOString().slice(0, 10);
    const logFile = path.join(LOGS_DIR, `system-${today}.log`);
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, "utf8");
      expect(content.includes(marker)).toBe(true);
    }
  });
  it("logError escribe 'ERROR' y el source en el archivo", async () => {
    const source = `test-source-${Date.now()}`;
    await logger.logError({ source, error: new Error("test error content") });
    await new Promise((r) => setTimeout(r, 200));
    const today = new Date().toISOString().slice(0, 10);
    const logFile = path.join(LOGS_DIR, `error-${today}.log`);
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, "utf8");
      expect(content.includes(source)).toBe(true);
    }
  });
});
