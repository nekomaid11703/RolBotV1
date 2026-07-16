const crypto = require("crypto");

function getCacheKey(roomId, playerId, stateVersion, text) {
  const raw = `${roomId || ""}:${playerId || ""}:${stateVersion || 0}:${text}`;
  return crypto.createHash("md5").update(raw).digest("hex");
}

describe("Cache Key Derivation (versioned)", () => {
  it("same room+player+version+text → same key", () => {
    const key1a = getCacheKey("room1", "player1", 3, "Ataco con furia");
    const key1a2 = getCacheKey("room1", "player1", 3, "Ataco con furia");
    expect(key1a).toBe(key1a2);
  });
  it("different stateVersion → different key", () => {
    const key1a = getCacheKey("room1", "player1", 3, "Ataco con furia");
    const key1b = getCacheKey("room1", "player1", 2, "Ataco con furia");
    expect(key1a).not.toBe(key1b);
  });
  it("different room → different key", () => {
    const key1a = getCacheKey("room1", "player1", 3, "Ataco con furia");
    const key1c = getCacheKey("room2", "player1", 3, "Ataco con furia");
    expect(key1a).not.toBe(key1c);
  });
  it("different player → different key", () => {
    const key1a = getCacheKey("room1", "player1", 3, "Ataco con furia");
    const key1d = getCacheKey("room1", "player2", 3, "Ataco con furia");
    expect(key1a).not.toBe(key1d);
  });
  it("different text → different key", () => {
    const key1a = getCacheKey("room1", "player1", 3, "Ataco con furia");
    const key1e = getCacheKey("room1", "player1", 3, "Defiendo");
    expect(key1a).not.toBe(key1e);
  });
  it("stateVersion 0 and undefined produce same key", () => {
    const key1f0 = getCacheKey("room1", "player1", 0, "test");
    const key1fU = getCacheKey("room1", "player1", undefined, "test");
    expect(key1f0).toBe(key1fU);
  });
});
