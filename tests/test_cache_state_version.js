const path = require('path');
const crypto = require('crypto');

const turnManager = require('../src/services/rpg/combatTurnManager');

const helpers = require('./test_helpers');
const { assert, assertEqual, assertDeepEqual, printResults, createMockParticipant, createMockRoom } = helpers;

// Replicate the exact getCacheKey logic from combatRefereeService.js
function getCacheKey(roomId, playerId, stateVersion, text) {
  const raw = `${roomId || ''}:${playerId || ''}:${stateVersion || 0}:${text}`;
  return crypto.createHash('md5').update(raw).digest('hex');
}

async function run() {
  console.log('=== TEST: Cache State Version + Per-Player Limit ===\n');

  // ──────────────────────────────────────────────
  // Fix: Cache key includes stateVersion
  // ──────────────────────────────────────────────
  console.log('--- Fix 1: Cache key with stateVersion ---');

  // 1a. Same text, same stateVersion → same key
  const key1a = getCacheKey('room1', 'player1', 3, 'Ataco con furia');
  const key1a2 = getCacheKey('room1', 'player1', 3, 'Ataco con furia');
  assert(key1a === key1a2, 'same room+player+version+text → same key');

  // 1b. Different stateVersion → different key (even with same text)
  const key1b = getCacheKey('room1', 'player1', 2, 'Ataco con furia');
  assert(key1a !== key1b, 'different stateVersion → different key');

  // 1c. Different room → different key
  const key1c = getCacheKey('room2', 'player1', 3, 'Ataco con furia');
  assert(key1a !== key1c, 'different room → different key');

  // 1d. Different player → different key
  const key1d = getCacheKey('room1', 'player2', 3, 'Ataco con furia');
  assert(key1a !== key1d, 'different player → different key');

  // 1e. Different text → different key
  const key1e = getCacheKey('room1', 'player1', 3, 'Defiendo');
  assert(key1a !== key1e, 'different text → different key');

  // 1f. stateVersion 0 vs undefined → same key
  const key1f0 = getCacheKey('room1', 'player1', 0, 'test');
  const key1fU = getCacheKey('room1', 'player1', undefined, 'test');
  assert(key1f0 === key1fU, 'stateVersion 0 and undefined produce same key');

  // ──────────────────────────────────────────────
  // Fix: advanceTurn increments stateVersion
  // ──────────────────────────────────────────────
  console.log('\n--- Fix 2: advanceTurn increments stateVersion ---');

  // 2a. Room without stateVersion gets initialized on first advanceTurn
  const room2a = createMockRoom({ stateVersion: undefined, turnQueue: [{ participantId: 'p1' }, { participantId: 'p2' }], currentTurnIndex: 0 });
  assert(room2a.stateVersion === undefined, 'new room has no stateVersion');
  const pA = createMockParticipant({ id: 'p1', team: 'players', ko: false });
  const pB = createMockParticipant({ id: 'p2', team: 'enemies', ko: false });
  room2a.participants = [pA, pB];

  turnManager.advanceTurn(room2a);
  assert(typeof room2a.stateVersion === 'number', 'stateVersion initialized by advanceTurn');
  assert(room2a.stateVersion >= 1, 'stateVersion >= 1 after first advanceTurn');

  // 2b. stateVersion increments on each advanceTurn
  const room2b = createMockRoom({ stateVersion: 5, turnQueue: [{ participantId: 'p1' }, { participantId: 'p2' }], currentTurnIndex: 0 });
  room2b.participants = [pA, pB];
  turnManager.advanceTurn(room2b);
  assert(room2b.stateVersion === 6, 'stateVersion 5 → 6 after advanceTurn');
  turnManager.advanceTurn(room2b);
  assert(room2b.stateVersion === 7, 'stateVersion 6 → 7 after second advanceTurn');

  // 2c. stateVersion persists across room operations
  const room2c = createMockRoom({ stateVersion: 10, turnQueue: [{ participantId: 'p1' }, { participantId: 'p2' }], currentTurnIndex: 0 });
  room2c.participants = [pA, pB];
  turnManager.advanceTurn(room2c);
  assert(room2c.stateVersion === 11, 'stateVersion increments in subsequent calls');

  // ──────────────────────────────────────────────
  // Resumen
  // ──────────────────────────────────────────────
  const ok = printResults('Cache State Version');
  if (!ok) process.exit(1);
}

run().catch(err => { console.error('FATAL:', err); process.exit(1); });
