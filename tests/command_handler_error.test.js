const cachedModules = new Map();

function mockCommonJsModule(request, exports) {
  const fileName = require.resolve(request);
  cachedModules.set(fileName, require.cache[fileName]);
  require.cache[fileName] = { id: fileName, filename: fileName, loaded: true, exports };
}

const logCommand = vi.fn();
const logError = vi.fn();

mockCommonJsModule("../src/utils/groupUtils", {
  isAdmin: vi.fn(),
  isBotAdmin: vi.fn(),
  isOnGroup: vi.fn(() => false),
});
mockCommonJsModule("../src/utils/permissionUtils", { isOwner: vi.fn() });
mockCommonJsModule("../src/services/permissionService", {
  hasEconomyPermission: vi.fn(),
  hasPermissionForCategory: vi.fn(),
  getCategoryLabel: vi.fn(),
});
mockCommonJsModule("../src/services/userService", { recordUserActivity: vi.fn() });
mockCommonJsModule("../src/services/loggerService", { logSystem: vi.fn(), logCommand, logError });
mockCommonJsModule("../src/services/stats", {
  incrementCommands: vi.fn(),
  incrementErrors: vi.fn(),
  addEvent: vi.fn(),
});

const handlerPath = require.resolve("../src/core/commandHandler");
delete require.cache[handlerPath];
const { handleCommand } = require("../src/core/commandHandler");
const { commands, aliases } = require("../src/core/commandRegistry");

afterEach(() => {
  commands.clear();
  aliases.clear();
  vi.clearAllMocks();
});

afterAll(() => {
  delete require.cache[handlerPath];
  for (const [fileName, cached] of cachedModules) {
    if (cached) require.cache[fileName] = cached;
    else delete require.cache[fileName];
  }
});

it("registra un fallo del comando y responde con un ID seguro", async () => {
  commands.set("falla", {
    name: "falla",
    execute: async () => {
      throw new Error("detalle-interno-no-exponer");
    },
  });
  const reply = vi.fn();

  await handleCommand({
    text: "/falla",
    sender: "user@s.whatsapp.net",
    senderJid: "user@s.whatsapp.net",
    senderNumber: "595981000000",
    userName: "Tester",
    from: "chat@s.whatsapp.net",
    reply,
  });

  const errorCommandLog = logCommand.mock.calls.find(([entry]) => entry.status === "error")[0];
  const correlationId = errorCommandLog.reason.match(/[0-9a-f]{8}/)[0];

  expect(logCommand).not.toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
  expect(errorCommandLog.reason).toBe(`Error interno [ID: ${correlationId}]`);
  expect(logError).toHaveBeenCalledWith(
    expect.objectContaining({ context: expect.objectContaining({ correlationId }) }),
  );
  expect(reply).toHaveBeenCalledWith(expect.stringContaining(`ID: ${correlationId}`));
  expect(reply.mock.calls[0][0]).not.toContain("detalle-interno-no-exponer");
});
