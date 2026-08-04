const cachedModules = new Map();

function mockCommonJsModule(request, exports) {
  const fileName = require.resolve(request);
  cachedModules.set(fileName, require.cache[fileName]);
  require.cache[fileName] = { id: fileName, filename: fileName, loaded: true, exports };
}

const recordUserActivity = vi.fn();
const recordGroupActivity = vi.fn();
const handleCommand = vi.fn();
const logSystem = vi.fn();
const logError = vi.fn();
const incrementMessages = vi.fn();
const createContext = vi.fn(() => ({
  from: "group@g.us",
  sender: "123456@lid",
  senderJid: "123456@lid",
  senderNumber: "595981234567",
  userId: "595981234567@s.whatsapp.net",
  userName: "Neko",
  isGroup: true,
  text: "/balance",
  messageType: "conversation",
}));

mockCommonJsModule("../src/core/context", createContext);
mockCommonJsModule("../src/core/commandHandler", { handleCommand });
mockCommonJsModule("../src/services/userService", { recordUserActivity });
mockCommonJsModule("../src/services/groupActivityService", { recordGroupActivity });
mockCommonJsModule("../src/services/stats", { incrementMessages });
mockCommonJsModule("../src/services/loggerService", { logSystem, logError });

const handlerPath = require.resolve("../src/core/eventHandler");
delete require.cache[handlerPath];
const { registerEvents } = require(handlerPath);

const rawMessage = {
  key: {
    remoteJid: "group@g.us",
    participant: "123456@lid",
    participantPn: "595981234567@s.whatsapp.net",
    fromMe: false,
  },
  pushName: "Neko",
  message: { conversation: "/balance" },
};

function registerMessageListener() {
  let listener;
  registerEvents({
    ev: {
      on: vi.fn((_event, callback) => {
        listener = callback;
      }),
    },
  });
  return listener;
}

describe("eventHandler activity observability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logSystem.mockResolvedValue(undefined);
    logError.mockResolvedValue(undefined);
    handleCommand.mockResolvedValue(undefined);
    recordUserActivity.mockResolvedValue({});
    recordGroupActivity.mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  afterAll(() => {
    delete require.cache[handlerPath];
    for (const [fileName, cached] of cachedModules) {
      if (cached) require.cache[fileName] = cached;
      else delete require.cache[fileName];
    }
  });

  it("persiste con userId canónico conservando el senderJid de routing", async () => {
    const listener = registerMessageListener();

    await listener({ messages: [rawMessage], type: "notify" });

    expect(recordUserActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        creatorId: "595981234567@s.whatsapp.net",
        senderJid: "123456@lid",
      }),
    );
    expect(recordGroupActivity).toHaveBeenCalledWith(
      expect.objectContaining({ memberId: "595981234567@s.whatsapp.net" }),
    );
    expect(logSystem).toHaveBeenCalledWith("MSG_ACTIVITY_OK", expect.any(Object));
  });

  it("encadena recordGroupActivity tras recordUserActivity para respetar el FK group_members->players", async () => {
    const calls = [];
    recordUserActivity.mockImplementation(async () => {
      calls.push("recordUserActivity");
      return {};
    });
    recordGroupActivity.mockImplementation(async () => {
      calls.push("recordGroupActivity");
      return {};
    });
    const listener = registerMessageListener();

    await listener({ messages: [rawMessage], type: "notify" });

    expect(calls).toEqual(["recordUserActivity", "recordGroupActivity"]);
    expect(recordGroupActivity).toHaveBeenCalled();
  });

  it("registra error y no OK cuando falla una escritura de actividad", async () => {
    recordUserActivity.mockRejectedValueOnce(new Error("database unavailable"));
    const listener = registerMessageListener();

    await listener({ messages: [rawMessage], type: "notify" });

    expect(logError).toHaveBeenCalledWith(expect.objectContaining({ source: "recordUserActivity" }));
    expect(logSystem).toHaveBeenCalledWith("MSG_ACTIVITY_ERROR", expect.any(Object));
    expect(logSystem).not.toHaveBeenCalledWith("MSG_ACTIVITY_OK", expect.anything());
    expect(logSystem).not.toHaveBeenCalledWith("MSG_ACTIVITY_TIMEOUT", expect.anything());
  });

  it("distingue un timeout real de un error de persistencia", async () => {
    vi.useFakeTimers();
    recordUserActivity.mockReturnValueOnce(new Promise(() => {}));
    const listener = registerMessageListener();

    const pending = listener({ messages: [rawMessage], type: "notify" });
    await vi.advanceTimersByTimeAsync(15_000);
    await pending;

    expect(logSystem).toHaveBeenCalledWith("MSG_ACTIVITY_TIMEOUT", expect.any(Object));
    expect(logSystem).not.toHaveBeenCalledWith("MSG_ACTIVITY_ERROR", expect.anything());
    expect(logSystem).not.toHaveBeenCalledWith("MSG_ACTIVITY_OK", expect.anything());
  });
});
