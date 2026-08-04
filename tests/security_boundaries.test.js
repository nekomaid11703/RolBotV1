const crypto = require("crypto");
const fs = require("fs");
const fsp = require("fs/promises");
const os = require("os");
const path = require("path");
const { Readable } = require("stream");

const downloadMediaMessage = vi.fn();
const supabase = { from: vi.fn() };
const cachedModules = new Map();

function mockCommonJsModule(request, exports) {
  const fileName = require.resolve(request);
  cachedModules.set(fileName, require.cache[fileName]);
  require.cache[fileName] = { id: fileName, filename: fileName, loaded: true, exports };
}

mockCommonJsModule("@whiskeysockets/baileys", { downloadMediaMessage });
mockCommonJsModule("../src/database/supabase", { supabase });
mockCommonJsModule("../src/utils/groupUtils", { getGroupMetadata: vi.fn() });
mockCommonJsModule("../src/services/loggerService", { logSystem: vi.fn(), logError: vi.fn() });

const bugReportServicePath = require.resolve("../src/services/bugReportService");
delete require.cache[bugReportServicePath];
const { createReport } = require("../src/services/bugReportService");
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

afterAll(() => {
  delete require.cache[bugReportServicePath];
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
    const externalLid = "129626508685330@lid";
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

  it.each(["001_create_inventory.sql", "003_harden_inventory_access.sql"])(
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
});
