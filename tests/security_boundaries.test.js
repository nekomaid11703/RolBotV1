const crypto = require("crypto");
const fs = require("fs");
const fsp = require("fs/promises");
const os = require("os");
const path = require("path");
const { Readable } = require("stream");

const downloadMediaMessage = vi.fn();
const discover = vi.fn();
const setStoredVersion = vi.fn();
const supabase = { from: vi.fn(), rpc: vi.fn() };
const cachedModules = new Map();

function mockCommonJsModule(request, exports) {
  const fileName = require.resolve(request);
  cachedModules.set(fileName, require.cache[fileName]);
  require.cache[fileName] = { id: fileName, filename: fileName, loaded: true, exports };
}

mockCommonJsModule("@whiskeysockets/baileys", { downloadMediaMessage });
mockCommonJsModule("../src/database/supabase", { supabase });
mockCommonJsModule("../src/database/columnRegistry", { discover });
mockCommonJsModule("../src/database/schemaVersion", { setStoredVersion });
mockCommonJsModule("../src/utils/groupUtils", { getGroupMetadata: vi.fn() });
mockCommonJsModule("../src/services/loggerService", { logSystem: vi.fn(), logError: vi.fn() });

const bugReportServicePath = require.resolve("../src/services/bugReportService");
delete require.cache[bugReportServicePath];
const { createReport } = require("../src/services/bugReportService");
const schemaMigrationPath = require.resolve("../src/database/schemaMigration");
delete require.cache[schemaMigrationPath];
const { runStartupMigration } = require("../src/database/schemaMigration");
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

afterAll(() => {
  delete require.cache[bugReportServicePath];
  delete require.cache[schemaMigrationPath];
  for (const [fileName, cached] of cachedModules) {
    if (cached) require.cache[fileName] = cached;
    else delete require.cache[fileName];
  }
});

const ORIGINAL_OWNER_PHONE = process.env.OWNER_PHONE;
const ORIGINAL_OWNER_ALIASES = process.env.OWNER_ALIASES;

function restoreEnv(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

function loadOwnerConfig(aliases) {
  process.env.OWNER_PHONE = "595981000000";
  process.env.OWNER_ALIASES = aliases;
  delete require.cache[require.resolve("../src/config/permissionsConfig")];
  return require("../src/config/permissionsConfig");
}

function loadOwnerChecker(aliases) {
  const permissionPath = require.resolve("../src/utils/permissionUtils");
  const previous = require.cache[permissionPath];
  loadOwnerConfig(aliases);
  delete require.cache[permissionPath];
  const { isOwner } = require(permissionPath);
  if (previous) require.cache[permissionPath] = previous;
  else delete require.cache[permissionPath];
  return isOwner;
}

function imageMessage(mimetype, fileLength) {
  return { message: { imageMessage: { mimetype, fileLength } } };
}

describe("owner aliases trust boundary", () => {
  afterEach(() => {
    restoreEnv("OWNER_PHONE", ORIGINAL_OWNER_PHONE);
    restoreEnv("OWNER_ALIASES", ORIGINAL_OWNER_ALIASES);
    delete require.cache[require.resolve("../src/config/permissionsConfig")];
  });

  it("no inventa aliases cuando OWNER_ALIASES no fue configurado", () => {
    expect(loadOwnerConfig("").OWNERS[0].aliases).toEqual([]);
  });

  it("normaliza y deduplica solo los aliases configurados", () => {
    expect(loadOwnerConfig(" 123@LID,123@lid, 456@S.WHATSAPP.NET ").OWNERS[0].aliases).toEqual([
      "123@lid",
      "456@s.whatsapp.net",
    ]);
  });

  it("rechaza un LID no configurado y acepta solo el alias explícito", () => {
    const externalLid = "999999999999999@lid";
    expect(loadOwnerChecker("")({ jid: externalLid })).toBe(false);
    expect(loadOwnerChecker(externalLid)({ jid: externalLid })).toBe(true);
  });
});

describe("bug report image trust boundary", () => {
  let insert;
  let tempDir;

  beforeEach(async () => {
    vi.clearAllMocks();
    insert = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockImplementation(() => {
      const query = { data: [], error: null, insert };
      for (const method of ["select", "eq", "filter", "gte", "order"]) {
        query[method] = vi.fn(() => query);
      }
      return query;
    });
    tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), "rolbot-bug-security-"));
    vi.spyOn(process, "cwd").mockReturnValue(tempDir);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    if (tempDir) await fsp.rm(tempDir, { recursive: true, force: true });
  });

  async function createWithImage(msg) {
    return createReport({
      sock: null,
      groupId: null,
      userId: "security-test-user",
      userName: "Security test",
      description: "reporte de prueba",
      msg,
    });
  }

  it("rechaza MIME fuera de la allowlist antes de descargar", async () => {
    await expect(createWithImage(imageMessage("image/svg+xml", 128))).rejects.toThrow("Formato de imagen");
    expect(downloadMediaMessage).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
  });

  it("rechaza el tamaño declarado mayor a 5 MiB antes de descargar", async () => {
    const declaredSize = { toString: () => String(MAX_IMAGE_BYTES + 1) };
    await expect(createWithImage(imageMessage("image/jpeg", declaredSize))).rejects.toThrow("5 MiB");
    expect(downloadMediaMessage).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
  });

  it("corta el stream al superar 5 MiB y elimina el archivo parcial", async () => {
    const id = "00000000-0000-4000-8000-000000000001";
    vi.spyOn(crypto, "randomUUID").mockReturnValue(id);
    downloadMediaMessage.mockResolvedValue(Readable.from([Buffer.alloc(MAX_IMAGE_BYTES), Buffer.alloc(1)]));

    await expect(createWithImage(imageMessage("image/png", MAX_IMAGE_BYTES))).rejects.toThrow("5 MiB");
    await expect(fsp.access(path.join(tempDir, "bugs", "media", `${id}.png`))).rejects.toThrow();
    expect(insert).not.toHaveBeenCalled();
  });

  it("usa stream y un nombre generado con extensión fija para imágenes válidas", async () => {
    const id = "00000000-0000-4000-8000-000000000002";
    const payload = Buffer.from("safe-image");
    vi.spyOn(crypto, "randomUUID").mockReturnValue(id);
    downloadMediaMessage.mockResolvedValue(Readable.from([payload]));
    const msg = imageMessage(" IMAGE/PNG; name=../../escape.js ", payload.length);

    const report = await createWithImage(msg);

    expect(downloadMediaMessage).toHaveBeenCalledWith(msg, "stream", {}, {});
    expect(report.mediaUrl).toBe(`bugs/media/${id}.png`);
    await expect(fsp.readFile(path.join(tempDir, report.mediaUrl))).resolves.toEqual(payload);
    expect(insert).toHaveBeenCalledOnce();
  });

  it("elimina la imagen si Supabase rechaza el reporte", async () => {
    const id = "00000000-0000-4000-8000-000000000003";
    vi.spyOn(crypto, "randomUUID").mockReturnValue(id);
    downloadMediaMessage.mockResolvedValue(Readable.from([Buffer.from("safe-image")]));
    insert.mockResolvedValueOnce({ error: { message: "database unavailable" } });

    await expect(createWithImage(imageMessage("image/webp", 10))).rejects.toThrow("Error guardando reporte");
    await expect(fsp.access(path.join(tempDir, "bugs", "media", `${id}.webp`))).rejects.toThrow();
  });
});

describe("inventory SQL trust boundary", () => {
  const migrationDir = path.join(__dirname, "../src/database/migrations");

  it.each(["001_create_inventory.sql", "004_harden_inventory_access.sql"])(
    "%s mantiene RLS forzado y acceso exclusivo de service_role",
    (fileName) => {
      const sql = fs.readFileSync(path.join(migrationDir, fileName), "utf8");
      expect(sql).toMatch(/ENABLE ROW LEVEL SECURITY/i);
      expect(sql).toMatch(/FORCE ROW LEVEL SECURITY/i);
      expect(sql).toMatch(/REVOKE ALL PRIVILEGES ON TABLE inventory FROM PUBLIC, anon, authenticated/i);
      expect(sql).toMatch(/GRANT ALL PRIVILEGES ON TABLE inventory TO service_role/i);
      expect(sql).not.toMatch(/DISABLE ROW LEVEL SECURITY/i);
      expect(sql).not.toMatch(/GRANT[^;]+TO\s+(?:anon|authenticated)/i);
    },
  );

  it.each(["003_remediation_item_equipment.sql", "004_harden_inventory_access.sql"])(
    "%s protege combat_sessions y persiste la distancia",
    (fileName) => {
      const sql = fs.readFileSync(path.join(migrationDir, fileName), "utf8");
      expect(sql).toMatch(/combat_sessions ENABLE ROW LEVEL SECURITY/i);
      expect(sql).toMatch(/combat_sessions FORCE ROW LEVEL SECURITY/i);
      expect(sql).toMatch(/"?distance"? INTEGER NOT NULL DEFAULT 5 CHECK \(distance >= 0\)/i);
      expect(sql).toMatch(/REVOKE ALL PRIVILEGES ON TABLE combat_sessions FROM PUBLIC, anon, authenticated/i);
      expect(sql).toMatch(/GRANT ALL PRIVILEGES ON TABLE combat_sessions TO service_role/i);
      expect(sql).not.toMatch(/GRANT[^;]+combat_sessions[^;]+TO\s+(?:anon|authenticated)/i);
    },
  );

  it("004_harden_inventory_access.sql protege las tablas privadas del backend", () => {
    const sql = fs.readFileSync(path.join(migrationDir, "004_harden_inventory_access.sql"), "utf8");
    for (const table of ["bot_auth_state", "players", "groups", "group_members", "characters"]) {
      expect(sql).toMatch(new RegExp(`${table} ENABLE ROW LEVEL SECURITY`, "i"));
      expect(sql).toMatch(new RegExp(`${table} FORCE ROW LEVEL SECURITY`, "i"));
    }
    expect(sql).toMatch(
      /REVOKE ALL PRIVILEGES ON TABLE bot_auth_state, players, groups, group_members, characters\s+FROM PUBLIC, anon, authenticated/i,
    );
    expect(sql).toMatch(
      /GRANT ALL PRIVILEGES ON TABLE bot_auth_state, players, groups, group_members, characters\s+TO service_role/i,
    );
  });
});

describe("automatic database trust boundary", () => {
  it("crea combat_sessions con RLS forzado y acceso exclusivo de service_role", async () => {
    vi.clearAllMocks();
    discover.mockResolvedValue({});
    supabase.rpc.mockResolvedValue({ error: null });

    await runStartupMigration();

    expect(supabase.rpc).toHaveBeenCalledOnce();
    const sql = supabase.rpc.mock.calls[0][1].query;
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS "combat_sessions"/i);
    expect(sql).toMatch(/distance" INTEGER NOT NULL DEFAULT 5 CHECK \(distance >= 0\)/i);
    expect(sql).toMatch(/ALTER TABLE combat_sessions ENABLE ROW LEVEL SECURITY/i);
    expect(sql).toMatch(/ALTER TABLE combat_sessions FORCE ROW LEVEL SECURITY/i);
    expect(sql).toMatch(/REVOKE ALL PRIVILEGES ON TABLE combat_sessions FROM PUBLIC, anon, authenticated/i);
    expect(sql).toMatch(/GRANT ALL PRIVILEGES ON TABLE combat_sessions TO service_role/i);
    expect(sql).not.toMatch(/GRANT[^;]+TO\s+(?:anon|authenticated)/i);
  });

  it("requiere una variable de entorno nombrada explícitamente para service_role", () => {
    const root = path.join(__dirname, "..");
    const source = fs.readFileSync(path.join(root, "src/database/supabase.js"), "utf8");
    const example = fs.readFileSync(path.join(root, ".env.example"), "utf8");

    expect(source).toContain("process.env.SUPABASE_SERVICE_ROLE_KEY");
    expect(source).toContain("process.env.SUPABASE_KEY");
    expect(source).toContain("WARN: SUPABASE_KEY está deprecada");
    expect(example).toMatch(/^SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui$/m);
    expect(example).toContain("# Compatibilidad temporal (deprecada): SUPABASE_KEY=");
  });
});
