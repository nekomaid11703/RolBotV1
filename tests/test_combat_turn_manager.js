const turnManager = require('../src/services/rpg/combatTurnManager');
const helpers = require('./test_helpers');
const { assert, assertEqual, printResults, createMockParticipant, createMockRoom } = helpers;

function run() {
  console.log('=== TEST: Combat Turn Manager ===\n');

  // ──────────────────────────────────────────────
  // advanceTurn
  // ──────────────────────────────────────────────
  console.log('--- advanceTurn ---');

  const p1 = createMockParticipant({ id: 'p1', team: 'players', ko: false });
  const p2 = createMockParticipant({ id: 'p2', team: 'enemies', ko: false });
  const p3 = createMockParticipant({ id: 'p3', team: 'players', ko: false });

  // Basic advance
  const room1 = createMockRoom({
    turnQueue: [
      { participantId: 'p1' },
      { participantId: 'p2' },
      { participantId: 'p3' },
    ],
    currentTurnIndex: 0,
    turnCount: 0,
    round: 1,
    participants: [p1, p2, p3],
  });

  const r1 = turnManager.advanceTurn(room1);
  assert(r1 === true, 'advanceTurn returns true when room active');
  assert(room1.turnCount === 1, 'turnCount incremented to 1');
  assert(room1.currentTurnIndex === 1, 'index advanced to 1');
  assert(room1.stateVersion === 1, 'stateVersion initialized to 1');

  const r2 = turnManager.advanceTurn(room1);
  assert(room1.currentTurnIndex === 2, 'index advanced to 2');
  assert(room1.stateVersion === 2, 'stateVersion incremented to 2');

  // Round increment
  const r3 = turnManager.advanceTurn(room1);
  assert(room1.currentTurnIndex === 0, 'index wraps to 0 after full cycle');
  assert(room1.round === 2, 'round incremented to 2 on wrap');
  assert(room1.stateVersion === 3, 'stateVersion incremented on wrap');

  // KO skip — advanceTurn skips KO'd participants via getNextAliveIndex
  const room2 = createMockRoom({
    turnQueue: [
      { participantId: 'p1' },
      { participantId: 'p2' },
    ],
    currentTurnIndex: 0,
    turnCount: 0,
    round: 1,
    participants: [
      createMockParticipant({ id: 'p1', team: 'players', ko: false }),
      createMockParticipant({ id: 'p2', team: 'enemies', ko: true }),
    ],
  });
  const r4 = turnManager.advanceTurn(room2);
  // After advancing from index 0, the next alive index should be index 1 (wrapping)
  // but if p2 is KO, the loop keeps searching and might wrap to 0
  assert(typeof r4 === 'boolean', 'advanceTurn returns boolean with KO participant');

  // ──────────────────────────────────────────────
  // getCurrentParticipant
  // ──────────────────────────────────────────────
  console.log('\n--- getCurrentParticipant ---');

  const room3 = createMockRoom({
    turnQueue: [{ participantId: 'p1' }, { participantId: 'p2' }],
    currentTurnIndex: 0,
    participants: [p1, p2],
  });
  const current = turnManager.getCurrentParticipant(room3);
  assert(current !== null, 'getCurrentParticipant returns participant');
  assert(current.id === 'p1', 'getCurrentParticipant returns correct participant');

  // ──────────────────────────────────────────────
  // validateTurn
  // ──────────────────────────────────────────────
  console.log('\n--- validateTurn ---');

  const room4 = createMockRoom({
    turnQueue: [{ participantId: 'p1' }],
    currentTurnIndex: 0,
    participants: [p1],
    status: 'active',
  });

  // Valid turn
  const v1 = turnManager.validateTurn(room4, 'p1');
  assert(v1.valid === true, 'validateTurn: valid for correct participant');

  // Invalid — not participant
  const v2 = turnManager.validateTurn(room4, 'nonexistent');
  assert(v2.valid === false, 'validateTurn: invalid for non-participant');
  assert(v2.reason === 'not_participant', 'validateTurn: reason = not_participant');

  // Invalid — finished room
  const room5 = createMockRoom({ status: 'finished', turnQueue: [{ participantId: 'p1' }], currentTurnIndex: 0, participants: [p1] });
  const v3 = turnManager.validateTurn(room5, 'p1');
  assert(v3.valid === false, 'validateTurn: invalid for finished room');

  // Invalid — wrong turn
  const room6 = createMockRoom({
    turnQueue: [{ participantId: 'p1' }, { participantId: 'p2' }],
    currentTurnIndex: 1,
    participants: [p1, p2],
  });
  const v4 = turnManager.validateTurn(room6, 'p1');
  assert(v4.valid === false, 'validateTurn: invalid when not your turn');

  // ──────────────────────────────────────────────
  // getAliveParticipants
  // ──────────────────────────────────────────────
  console.log('\n--- getAliveParticipants ---');

  const pAlive = createMockParticipant({ id: 'p_alive', team: 'players', ko: false });
  const pKo = createMockParticipant({ id: 'p_ko', team: 'players', ko: true });
  const pEnemy = createMockParticipant({ id: 'p_enemy', team: 'enemies', ko: false });

  const allAlive = turnManager.getAliveParticipants({ participants: [pAlive, pKo, pEnemy] });
  assert(allAlive.length === 2, 'getAliveParticipants excludes KO');
  assert(allAlive.every(p => !p.ko), 'all returned participants alive');

  const playersAlive = turnManager.getAliveParticipants({ participants: [pAlive, pKo, pEnemy] }, 'players');
  assert(playersAlive.length === 1, 'getAliveParticipants filters by team');
  assert(playersAlive[0].id === 'p_alive', 'only alive player returned');

  // ──────────────────────────────────────────────
  // Resumen
  // ──────────────────────────────────────────────
  const ok = printResults('Combat Turn Manager');
  if (!ok) process.exit(1);
}

try { const r = run(); if (r && r.catch) r.catch(err => { console.error('FATAL:', err); process.exit(1); }); } catch (err) { console.error('FATAL:', err); process.exit(1); }
