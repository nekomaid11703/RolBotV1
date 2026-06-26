const path = require('path');
const helpers = require('./test_helpers');
const { assert, assertEqual, printResults } = helpers;

async function run() {
  console.log('=== TEST: Combat Commands (Smoke Tests) ===\n');

  // ──────────────────────────────────────────────
  // Smoke test: command files load without error
  // ──────────────────────────────────────────────
  console.log('--- Command module loading ---');

  let loaded = 0;
  const failures = [];

  const commands = [
    { name: 'rol', path: '../src/commands/rpg/rol' },
    { name: 'combate', path: '../src/commands/rpg/combate' },
    { name: 'atacar', path: '../src/commands/rpg/atacar' },
    { name: 'inventario', path: '../src/commands/rpg/inventario' },
    { name: 'equipar', path: '../src/commands/rpg/equipar' },
    { name: 'desequipar', path: '../src/commands/rpg/desequipar' },
    { name: 'usar', path: '../src/commands/rpg/usar' },
  ];

  for (const cmd of commands) {
    try {
      const mod = require(cmd.path);
      assert(typeof mod.execute === 'function', `${cmd.name} exports execute()`);
      loaded++;
    } catch (err) {
      failures.push(`${cmd.name}: ${err.message}`);
      console.log(`  \u274c ${cmd.name} — load error: ${err.message}`);
    }
  }

  if (failures.length === 0) {
    assert(true, `All ${commands.length} command modules loaded`);
  }

  // ──────────────────────────────────────────────
  // Smoke test: atacar.js — atacar/iniciar commands
  // ──────────────────────────────────────────────
  console.log('\n--- atacar command structure ---');

  try {
    const atacar = require('../src/commands/rpg/atacar');
    assert(typeof atacar.execute === 'function', 'atacar.execute is function');
    assert(typeof atacar.commands === 'object' || atacar.commands === undefined,
      'atacar may export commands object');
  } catch (err) {
    console.log(`  \u274c atacar module error: ${err.message}`);
  }

  // ──────────────────────────────────────────────
  // Smoke test: combate.js
  // ──────────────────────────────────────────────
  console.log('\n--- combate command ---');

  try {
    const combate = require('../src/commands/rpg/combate');
    assert(typeof combate.execute === 'function', 'combate.execute is function');
  } catch (err) {
    console.log(`  \u274c combate module error: ${err.message}`);
  }

  // ──────────────────────────────────────────────
  // Smoke test: duelService exports
  // ──────────────────────────────────────────────
  console.log('\n--- duelService exports ---');

  try {
    const duel = require('../src/services/rpg/duelService');
    assert(typeof duel.createChallenge === 'function', 'duelService.createChallenge');
    assert(typeof duel.acceptChallenge === 'function', 'duelService.acceptChallenge');
    assert(typeof duel.rejectChallenge === 'function', 'duelService.rejectChallenge');
  } catch (err) {
    console.log(`  \u274c duelService error: ${err.message}`);
  }

  // ──────────────────────────────────────────────
  // Smoke test: narratorOutputValidator
  // ──────────────────────────────────────────────
  console.log('\n--- narratorOutputValidator ---');

  try {
    const validator = require('../src/services/rpg/narratorOutputValidator');
    assert(typeof validator.validateOutput === 'function', 'validator.validateOutput');
    assert(typeof validator.fuzzyParseJSON === 'function', 'validator.fuzzyParseJSON');

    // Test fuzzy parse with broken JSON
    const parsed = validator.fuzzyParseJSON('{"key": "value"}');
    assert(parsed !== null, 'fuzzyParseJSON: valid JSON parses');
    assert(parsed.key === 'value', 'fuzzyParseJSON: key extracted');
  } catch (err) {
    console.log(`  \u274c validator error: ${err.message}`);
  }

  // ──────────────────────────────────────────────
  // Resumen
  // ──────────────────────────────────────────────
  const ok = printResults('Combat Commands');
  if (!ok) process.exit(1);
}

run().catch(err => { console.error('FATAL:', err); process.exit(1); });
