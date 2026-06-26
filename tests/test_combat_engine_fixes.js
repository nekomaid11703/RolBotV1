const path = require('path');

const combatEngine = require('../src/services/rpg/combatEngine');
const envEffects = require('../src/services/rpg/environmentalEffects');
const abilityEngine = require('../src/services/rpg/abilityEngine');
const abilities = require('../src/services/rpg/abilities');

const helpers = require('./test_helpers');
const { assert, assertEqual, assertDeepEqual, printResults, createMockParticipant, createMockRoom } = helpers;

async function run() {
  console.log('=== TEST: Combat Engine Fixes (Buffs, Golpe de Gracia, Efectos Ambientales) ===\n');

  // ──────────────────────────────────────────────
  // Fix 1: Buffs nunca expiran
  // ──────────────────────────────────────────────
  console.log('--- Fix 1: Buffs expiration ---');

  // 1a. getEffectiveStats con buff activo NO muta al participante
  const p1 = createMockParticipant({ fuerza: 7, reflejos: 5 });
  const originalFuerza = p1.fuerza;
  const originalReflejos = p1.reflejos;
  p1.buffs = [{ stat: 'fuerza', value: 3, duration: 2, type: 'buff' }];
  const stats1 = combatEngine.getEffectiveStats(p1);
  assert(stats1.fuerza === 10, 'getEffectiveStats apply buff (+3 fuerza = 10)');
  assert(p1.fuerza === originalFuerza, 'participant original fuerza unchanged');
  assert(p1.reflejos === originalReflejos, 'participant original reflejos unchanged');

  // 1b. reduceBuffTimers decrements duration and removes expired
  const buffs = [{ stat: 'fuerza', value: 3, duration: 1, type: 'buff' }];
  p1.buffs = buffs;
  combatEngine.reduceBuffTimers(p1);
  assert(p1.buffs.length === 0, 'reduceBuffTimers removes expired buff');
  assert(p1.fuerza === originalFuerza, 'stats unchanged after buff expiration');

  // 1c. Multi-turn buff expires after N reductions
  const p1c = createMockParticipant({ fuerza: 7 });
  p1c.buffs = [{ stat: 'fuerza', value: 3, duration: 3, type: 'buff' }];
  combatEngine.reduceBuffTimers(p1c);
  assert(p1c.buffs.length === 1, 'buff persists after 1 reduction');
  assert(p1c.buffs[0].duration === 2, 'duration decreased from 3 to 2');
  combatEngine.reduceBuffTimers(p1c);
  combatEngine.reduceBuffTimers(p1c);
  assert(p1c.buffs.length === 0, 'buff removed after 3 reductions');

  // 1d. Shield buffs are ignored by getEffectiveStats stat application
  const p1d = createMockParticipant({ fuerza: 7 });
  p1d.buffs = [{ type: 'shield', value: 15, duration: 3, stat: 'shield' }];
  const stats1d = combatEngine.getEffectiveStats(p1d);
  assert(stats1d.fuerza === 7, 'shield buff does not affect stats');
  assert(p1d.fuerza === 7, 'participant fuerza unchanged with shield');

  // 1e. Fatigue + Buffs stack correctly
  const p1e = createMockParticipant({ fuerza: 10, fatigue: 3 });
  p1e.buffs = [{ stat: 'fuerza', value: 5, duration: 2, type: 'buff' }];
  const stats1e = combatEngine.getEffectiveStats(p1e);
  // fatigue 3 = -6 fuerza → 10-6=4, then buff +5 → 9
  assert(stats1e.fuerza === 9, 'fatigue + buff correct: 10-6+5=9');

  // ──────────────────────────────────────────────
  // Fix 2: Golpe de Gracia - validación HP
  // ──────────────────────────────────────────────
  console.log('\n--- Fix 2: Golpe de Gracia HP validation ---');

  // 2a. canUseAbility returns requiresTarget for golpe_de_gracia
  const p2a = createMockParticipant({ fuerza: 7, precision: 6, fulgor: 50, fatigue: 1 });
  const check = abilities.canUseAbility(p2a, 'golpe_de_gracia');
  assert(check.canUse === true, 'canUseAbility: golpe_de_gracia usable with stats');
  assert(check.requiresTarget === true, 'golpe_de_gracia requires target');

  // 2b. executeAbility rejects if target HP > 25%
  // Mock turnManager.getParticipantByJid
  const room2b = createMockRoom();
  const attacker2b = createMockParticipant({ id: 'p1', fulgor: 50 });
  const target2b = createMockParticipant({ id: 'p2', hp: 80, maxHp: 100 }); // 80% HP
  room2b.participants = [attacker2b, target2b];

  // Temporarily override turnManager
  const turnManager = require('../src/services/rpg/combatTurnManager');
  const origGetByJid = turnManager.getParticipantByJid;
  turnManager.getParticipantByJid = (room, jid) => room.participants.find(p => p.id === jid);

  const result2b = await abilityEngine.executeAbility(room2b, attacker2b, 'p2', 'golpe_de_gracia');
  assert(result2b.error && result2b.error.includes('solo funciona contra objetivos debilitados'),
    'golpe_de_gracia on 80% HP target returns error');

  // 2c. executeAbility succeeds if target HP < 25%
  const target2c = createMockParticipant({ id: 'p2', hp: 20, maxHp: 100 }); // 20% HP
  const room2c = createMockRoom({ participants: [attacker2b, target2c] });
  turnManager.getParticipantByJid = (room, jid) => room.participants.find(p => p.id === jid);
  // Mock stateManager.updateRoom to avoid Supabase
  const stateManager = require('../src/services/rpg/combatStateManager');
  const origUpdateRoom = stateManager.updateRoom;
  stateManager.updateRoom = async () => {};

  const result2c = await abilityEngine.executeAbility(room2c, attacker2b, 'p2', 'golpe_de_gracia');
  assert(!result2c.error, 'golpe_de_gracia on 20% HP target succeeds');

  // 2d. executeAbility rejects if target is KO
  const attacker2d = createMockParticipant({ id: 'p1', fulgor: 50 });
  const target2d = createMockParticipant({ id: 'p2', hp: 0, maxHp: 100, ko: true });
  const room2d = createMockRoom({ participants: [attacker2d, target2d] });
  turnManager.getParticipantByJid = (room, jid) => room.participants.find(p => p.id === jid);
  const result2d = await abilityEngine.executeAbility(room2d, attacker2d, 'p2', 'golpe_de_gracia');
  assert(result2d.error && result2d.error.includes('K.O.'), 'golpe_de_gracia on KO target returns error');

  // 2e. canUseAbility with cooldown active rejects
  const p2e = createMockParticipant({ cooldowns: { golpe_de_gracia: 3 } });
  const check2e = abilities.canUseAbility(p2e, 'golpe_de_gracia');
  assert(check2e.canUse === false, 'golpe_de_gracia on cooldown rejected');

  // Restore mocks
  turnManager.getParticipantByJid = origGetByJid;
  stateManager.updateRoom = origUpdateRoom;

  // ──────────────────────────────────────────────
  // Fix 3: Efectos ambientales con efecto mecánico
  // ──────────────────────────────────────────────
  console.log('\n--- Fix 3: Environmental effects mechanics ---');

  // 3a. getEffectiveStats with activeEffects applies env rules
  const p3a = createMockParticipant({ precision: 10, reflejos: 8, dominio_fulgor: 5 });
  const stats3a = combatEngine.getEffectiveStats(p3a, ['oscuridad']);
  // oscuridad: precision -4, reflejos -2, dominio_fulgor -2
  assert(stats3a.precision === 6, 'oscuridad: precision 10-4=6');
  assert(stats3a.reflejos === 6, 'oscuridad: reflejos 8-2=6');
  assert(stats3a.dominio_fulgor === 3, 'oscuridad: dominio_fulgor 5-2=3');

  // 3b. Multiple effects stack (combined effects ADD to individual ones)
  const stats3b = combatEngine.getEffectiveStats(p3a, ['oscuridad', 'terreno_pantanoso']);
  // Individual: oscuridad(prec -4, ref -2, dom -2) + terreno_pantanoso(vel -3, ref -2, fuer -1)
  // Combined cienaga_cegadora: prec -6, ref -4, vel_desp -4
  // Total: prec -10, ref -8, vel_desp -7, dom -2, fuer -1
  // precision: 10-10=0 → Math.max(1, 0)=1
  assert(stats3b.precision === 1, 'oscuridad+pantano combined: precision 1');
  assert(stats3b.reflejos === 1, 'oscuridad+pantano combined: reflejos 1');
  assert(stats3b.velocidad_desplazamiento === 1, 'oscuridad+pantano combined: vel_desp 1');

  // 3c. Beneficial effects (terreno_elevado: +2 precision, +1 fuerza)
  const p3c = createMockParticipant({ precision: 5, fuerza: 5 });
  const stats3c = combatEngine.getEffectiveStats(p3c, ['terreno_elevado']);
  assert(stats3c.precision === 7, 'terreno_elevado: precision 5+2=7');
  assert(stats3c.fuerza === 6, 'terreno_elevado: fuerza 5+1=6');

  // 3d. No activeEffects = no change
  const p3d = createMockParticipant({ precision: 10 });
  const stats3d = combatEngine.getEffectiveStats(p3d);
  assert(stats3d.precision === 10, 'no activeEffects: precision unchanged');

  // 3e. Empty activeEffects = no change
  const stats3e = combatEngine.getEffectiveStats(p3d, []);
  assert(stats3e.precision === 10, 'empty activeEffects: precision unchanged');

  // 3f. Combined effects apply additional rules
  const stats3f = combatEngine.getEffectiveStats(createMockParticipant({ precision: 15, reflejos: 10 }), ['lluvia_torrencial', 'fuego_activo']);
  // lluvia: prec -3, ref -2. fuego_activo: no rules. Combined: vapor_ardiente: prec -5, ref -3, res_fis -2
  // Total: prec 15-3-5=7, ref 10-2-3=5
  assert(stats3f.precision === 7, 'lluvia+fuego combined: precision 15-3-5=7');
  assert(stats3f.reflejos === 5, 'lluvia+fuego combined: reflejos 10-2-3=5');

  // ──────────────────────────────────────────────
  // Fix 4: Efectos ambientales con expiración
  // ──────────────────────────────────────────────
  console.log('\n--- Fix 4: Environmental effects expiration ---');

  // 4a. getEffectDuration returns duration from registry
  assert(envEffects.getEffectDuration('viento_fuerte') === 5, 'viento_fuerte duration = 5');
  assert(envEffects.getEffectDuration('fuego_activo') === 4, 'fuego_activo duration = 4');
  assert(envEffects.getEffectDuration('nonexistent') === 0, 'unknown effect duration = 0');

  // 4b. reduceEffectDurations decrements and returns expired
  const room4b = { effectDurations: { viento_fuerte: 3, fuego_activo: 1 } };
  const expired1 = envEffects.reduceEffectDurations(room4b);
  assert(room4b.effectDurations.viento_fuerte === 2, 'viento_fuerte duration 3→2');
  assert(expired1.includes('fuego_activo'), 'fuego_activo reported as expired');
  assert(room4b.effectDurations.fuego_activo === undefined, 'fuego_activo removed from effectDurations');

  // 4c. removeExpiredEffects cleans up room.activeEffects
  const room4c = {
    effectDurations: { viento_fuerte: 3, fuego_activo: 0 },
    activeEffects: ['viento_fuerte', 'fuego_activo'],
  };
  envEffects.removeExpiredEffects(room4c);
  assertDeepEqual(room4c.activeEffects, ['viento_fuerte'], 'removeExpiredEffects removes fuego_activo from activeEffects');
  assert(room4c.effectDurations.fuego_activo === undefined, 'fuego_activo duration entry removed');

  // 4d. Multiple expired effects cleaned up together
  const room4d = {
    effectDurations: { a: 0, b: 0, c: 1 },
    activeEffects: ['a', 'b', 'c', 'd'],
  };
  envEffects.removeExpiredEffects(room4d);
  assertDeepEqual(room4d.activeEffects.sort(), ['c', 'd'], 'only non-expired effects remain');

  // 4e. Duration initialized when effect is first added (test applyEnvironmentalEffect logic)
  // This is tested implicitly via applyEnvironmentalEffect in combatRefereeService
  // which calls envEffects.getEffectDuration and sets room.effectDurations[eid] = dur
  assert(envEffects.getEffectDuration('terreno_elevado') === 5, 'terreno_elevado duration = 5');

  // 4f. Fire effect DOT + duration
  assert(envEffects.getDamagePerTurn('fuego_activo') === 5, 'fuego_activo DPT = 5');
  assert(envEffects.getEffectDuration('fuego_activo') === 4, 'fuego_activo duration = 4');

  // ──────────────────────────────────────────────
  // Fix 5: calculateDamageFormula con activeEffects
  // ──────────────────────────────────────────────
  console.log('\n--- Fix 5: Damage formula with env effects ---');

  const p5a = createMockParticipant({ id: 'atk', fuerza: 10, precision: 8, team: 'players' });
  const p5b = createMockParticipant({ id: 'def', reflejos: 8, resistencia_fisica: 5, team: 'enemies' });
  p5b.equipped = {};
  const formula5a = combatEngine.calculateDamageFormula(p5a, p5b, 'pecho', {});
  // Without env effects: base dmg = fuerza 10, zoneMult 1.0, def res_fis 5
  // damage = 10*1.0 - 5 = 5, then incertidumbre applied
  assert(formula5a.baseDamage >= 10, 'no env: baseDamage from fuerza 10');

  // With oscuridad applied to attacker: precision -4 → lower crit chance, but damage calc uses fuerza
  // The important thing is it doesn't crash and uses eval correctly
  const formula5b = combatEngine.calculateDamageFormula(p5a, p5b, 'pecho', { activeEffects: ['oscuridad'] });
  assert(formula5b.baseDamage >= 10, 'oscuridad: baseDamage unchanged (baseDamage uses fuerza, not precision)');

  // Verificar que activeEffects llegan a getEffectiveStats internamente
  // Precisa atacante con -4 precisión: no afecta daño base, pero afecta hit chance y crit
  // Lo importante es que no crashea y los stats se modifican internamente
  assert(formula5b.damageType === 'impacto', 'damage type correct with env effects');

  // ──────────────────────────────────────────────
  // Resumen
  // ──────────────────────────────────────────────
  const ok = printResults('Combat Engine Fixes');
  if (!ok) process.exit(1);
}

run().catch(err => { console.error('FATAL:', err); process.exit(1); });
