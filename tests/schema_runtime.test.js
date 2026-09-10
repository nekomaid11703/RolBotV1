const { supabase } = require("../src/database/supabase");
const { discover, KNOWN_SCHEMA } = require("../src/database/columnRegistry");
const { checkHealth } = require("../src/database/schemaValidator");
const schemaVersion = require("../src/database/schemaVersion");
const loggerService = require("../src/services/loggerService");

const schemaMigrationPath = require.resolve("../src/database/schemaMigration");

function mockSchema(missing = {}) {
  const available = Object.fromEntries(
    Object.entries(KNOWN_SCHEMA).map(([table, columns]) => [
      table,
      new Set(columns.filter((column) => !(missing[table] || []).includes(column))),
    ]),
  );

  return vi.spyOn(supabase, "from").mockImplementation((table) => ({
    select: vi.fn((selection) => ({
      limit: vi.fn(async () => {
        if (selection === "*") return { data: [], error: null };
        const missingColumn = selection.split(",").find((column) => !available[table]?.has(column));
        if (missingColumn) {
          return {
            data: null,
            error: { code: "PGRST204", message: `Could not find the '${missingColumn}' column` },
          };
        }
        return { data: [], error: null };
      }),
    })),
  }));
}

afterEach(() => {
  vi.restoreAllMocks();
  delete require.cache[schemaMigrationPath];
});

it("no confunde columnas conocidas con columnas existentes en una tabla vacía", async () => {
  mockSchema({ combat_sessions: ["distance"] });

  const registry = await discover(true);

  expect(registry.combat_sessions.has("id")).toBe(true);
  expect(registry.combat_sessions.has("distance")).toBe(false);
});

it("trata combat_sessions.distance ausente como error de health", async () => {
  mockSchema({ combat_sessions: ["distance"] });

  const health = await checkHealth();

  expect(health.errors).toEqual([expect.stringContaining('Tabla "combat_sessions" inaccesible o incompleta')]);
  expect(health.errors[0]).toContain("distance");
  expect(health.warnings).toEqual([]);
});

it("no registra la versión cuando aún faltan columnas", async () => {
  mockSchema({ combat_sessions: ["distance"] });
  const setStoredVersion = vi.spyOn(schemaVersion, "setStoredVersion").mockResolvedValue(undefined);
  vi.spyOn(loggerService, "logSystem").mockResolvedValue(undefined);
  delete require.cache[schemaMigrationPath];
  const { runStartupMigration } = require(schemaMigrationPath);

  const result = await runStartupMigration();

  expect(result.ok).toBe(false);
  expect(result.sql).toContain(
    'ALTER TABLE "combat_sessions" ADD COLUMN IF NOT EXISTS "distance" integer NOT NULL DEFAULT 5 CHECK (distance >= 0);',
  );
  expect(setStoredVersion).not.toHaveBeenCalled();
});
