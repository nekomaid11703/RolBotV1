const crypto = require("crypto");

const helpers = require("./test_helpers");
const { assert, printResults } = helpers;

function getCacheKey(roomId, playerId, stateVersion, text) {
  const raw = `${roomId || ""}:${playerId || ""}:${stateVersion || 0}:${text}`;
  return crypto.createHash("md5").update(raw).digest("hex");
}

async function run() {
  console.log("=== TEST: Cache Key Derivation (versioned) ===\n");

  console.log("--- Cache key composition ---");

  const key1a = getCacheKey("room1", "player1", 3, "Ataco con furia");
  const key1a2 = getCacheKey("room1", "player1", 3, "Ataco con furia");
  assert(key1a === key1a2, "same room+player+version+text → same key");

  const key1b = getCacheKey("room1", "player1", 2, "Ataco con furia");
  assert(key1a !== key1b, "different stateVersion → different key");

  const key1c = getCacheKey("room2", "player1", 3, "Ataco con furia");
  assert(key1a !== key1c, "different room → different key");

  const key1d = getCacheKey("room1", "player2", 3, "Ataco con furia");
  assert(key1a !== key1d, "different player → different key");

  const key1e = getCacheKey("room1", "player1", 3, "Defiendo");
  assert(key1a !== key1e, "different text → different key");

  const key1f0 = getCacheKey("room1", "player1", 0, "test");
  const key1fU = getCacheKey("room1", "player1", undefined, "test");
  assert(key1f0 === key1fU, "stateVersion 0 and undefined produce same key");

  const ok = printResults("Cache Key");
  if (!ok) process.exit(1);
}

run().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
