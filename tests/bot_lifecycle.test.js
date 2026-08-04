const { cleanupSock } = require("../src/core/bot");
const { startMidnightReview, stopMidnightReview } = require("../src/services/schedulerService");
const { startDashboard, stopDashboard } = require("../src/services/statusDashboard");

describe("WhatsApp lifecycle", () => {
  afterEach(() => {
    stopMidnightReview();
    stopDashboard();
    vi.useRealTimers();
  });

  it("removes Baileys event listeners and ends the socket even if one listener cleanup fails", () => {
    const removeAllListeners = vi.fn((event) => {
      if (event === "connection.update") throw new Error("already closed");
    });
    const sock = { ev: { removeAllListeners }, end: vi.fn() };

    cleanupSock(sock);

    expect(removeAllListeners).toHaveBeenCalledTimes(3);
    expect(removeAllListeners).toHaveBeenCalledWith("connection.update");
    expect(removeAllListeners).toHaveBeenCalledWith("creds.update");
    expect(removeAllListeners).toHaveBeenCalledWith("messages.upsert");
    expect(sock.end).toHaveBeenCalledOnce();
  });

  it("keeps a single cancelable midnight timer", () => {
    vi.useFakeTimers();

    startMidnightReview({ id: "first" });
    startMidnightReview({ id: "latest" });

    expect(vi.getTimerCount()).toBe(1);
    stopMidnightReview();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not start the dashboard outside an interactive terminal", () => {
    vi.useFakeTimers();
    const ownDescriptor = Object.getOwnPropertyDescriptor(process.stdout, "isTTY");
    Object.defineProperty(process.stdout, "isTTY", { configurable: true, value: false });

    try {
      startDashboard();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      if (ownDescriptor) Object.defineProperty(process.stdout, "isTTY", ownDescriptor);
      else delete process.stdout.isTTY;
    }
  });
});
