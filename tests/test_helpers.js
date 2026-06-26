const path = require('path');

let passed = 0;
let failed = 0;

function resetCounters() {
  passed = 0;
  failed = 0;
}

function assert(condition, name) {
  if (condition) { console.log(`  \u2705 ${name}`); passed++; }
  else { console.log(`  \u274c ${name}`); failed++; }
}

function assertEqual(a, b, name) {
  const ok = a === b;
  if (ok) { console.log(`  \u2705 ${name}`); passed++; }
  else { console.log(`  \u274c ${name} -- esperado ${JSON.stringify(b)}, obtenido ${JSON.stringify(a)}`); failed++; }
}

function assertDeepEqual(a, b, name) {
  const aStr = JSON.stringify(a);
  const bStr = JSON.stringify(b);
  const ok = aStr === bStr;
  if (ok) { console.log(`  \u2705 ${name}`); passed++; }
  else { console.log(`  \u274c ${name} -- esperado ${bStr}, obtenido ${aStr}`); failed++; }
}

function printResults(label) {
  const total = passed + failed;
  console.log(`\nResultados ${label}: ${passed} pasaron, ${failed} fallaron de ${total} pruebas`);
  resetCounters();
  return failed === 0;
}

function createMockParticipant(overrides = {}) {
  return {
    id: 'test-player-1',
    name: 'TestPlayer',
    team: 'players',
    hp: 100,
    maxHp: 100,
    fulgor: 50,
    maxFulgor: 50,
    fatigue: 0,
    fuerza: 7,
    reflejos: 6,
    velocidad_ataque: 5,
    precision: 6,
    velocidad_desplazamiento: 5,
    dominio_fulgor: 3,
    resistencia_fisica: 5,
    resistencia_magica: 3,
    ko: false,
    stunned: false,
    defending: false,
    defenseMultiplier: 1,
    bodyParts: {
      cabeza: 10, cuello: 5, pecho: 20, abdomen: 15, espalda: 15,
      brazo_izq: 10, brazo_der: 10, mano_izq: 5, mano_der: 5,
      pierna_izq: 12, pierna_der: 12, pie_izq: 5, pie_der: 5,
    },
    equipped: {},
    buffs: [],
    cooldowns: {},
    ...overrides,
  };
}

function createMockEnemy(overrides = {}) {
  return createMockParticipant({
    id: 'enemy:goblin_001',
    name: 'Goblin',
    team: 'enemies',
    hp: 40,
    maxHp: 40,
    fuerza: 4,
    reflejos: 4,
    velocidad_ataque: 4,
    precision: 3,
    ...overrides,
  });
}

function createMockRoom(overrides = {}) {
  return {
    id: 'room-test-001',
    participants: [],
    turnCount: 0,
    round: 1,
    status: 'active',
    currentTurnIndex: 0,
    location: { zone: 'bosque', region: 'valle_verde', locationId: 'bosque_01' },
    lastActionAt: Date.now(),
    koThreshold: 30,
    activeEffects: [],
    stateVersion: 0,
    ...overrides,
  };
}

function createMockInventory(overrides = {}) {
  return {
    items: [],
    equipped: {},
    capacityBase: 50,
    capacityBonus: 0,
    ...overrides,
  };
}

module.exports = {
  assert, assertEqual, assertDeepEqual, printResults, resetCounters,
  createMockParticipant, createMockEnemy, createMockRoom, createMockInventory,
};
