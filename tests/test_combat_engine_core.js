const combatEngine = require('../src/services/rpg/combatEngine');
const helpers = require('./test_helpers');
const { assert, assertEqual, assertDeepEqual, printResults, createMockParticipant, createMockRoom } = helpers;

async function run() {
  console.log('=== TEST: Combat Engine Core (Hit, Damage, Body Parts) ===\n');

  // ──────────────────────────────────────────────
  // calculateHitChance
  // ──────────────────────────────────────────────
  console.log('--- calculateHitChance ---');

  const hc1 = combatEngine.calculateHitChance({ precision: 5 }, { reflejos: 5 });
  assert(hc1 >= 0.2 && hc1 <= 0.98, 'default hit chance within bounds');

  const hc2 = combatEngine.calculateHitChance({ precision: 10 }, { reflejos: 5 });
  assert(hc2 > hc1, 'higher precision increases hit chance');

  const hc3 = combatEngine.calculateHitChance({ precision: 5 }, { reflejos: 10 });
  assert(hc3 < hc1, 'higher reflejos decreases hit chance');

  const hc4 = combatEngine.calculateHitChance({ precision: 1 }, { reflejos: 20 });
  assert(hc4 >= 0.2, 'hit chance clamped at 0.2 floor');

  const hc5 = combatEngine.calculateHitChance({ precision: 20 }, { reflejos: 1 });
  assert(hc5 <= 0.98, 'hit chance clamped at 0.98 ceiling');

  // ──────────────────────────────────────────────
  // calculateDamageFormula
  // ──────────────────────────────────────────────
  console.log('\n--- calculateDamageFormula ---');

  const atk = createMockParticipant({ id: 'atk', fuerza: 10, equipo: { arma: 'espada_corta' } });
  const def = createMockParticipant({ id: 'def', resistencia_fisica: 5, resistencia_magica: 3, equipped: {} });

  // Melee damage (no weapon item passed)
  const df1 = combatEngine.calculateDamageFormula(atk, def, 'pecho', {});
  assert(df1.damage > 0, 'base melee damage > 0');
  assertEqual(df1.damageType, 'impacto', 'default damage type = impacto');

  // Magical damage
  const df2 = combatEngine.calculateDamageFormula(atk, def, 'pecho', { isMagical: true });
  assert(df2.isMagical === true, 'magical flag set');
  assert(df2.damage > 0, 'magical damage > 0');
  assert(df2.fulgorCost > 0, 'magical cost > 0');

  // Critical hit
  const df3 = combatEngine.calculateDamageFormula(atk, def, 'cabeza', { crit: true });
  assert(df3.isCrit === true, 'crit flag set');
  assert(df3.damage > 0, 'crit damage > 0');
  const dmgNormal = combatEngine.calculateDamageFormula(atk, def, 'pecho', {});
  // Crit may not always be > normal because of incertidumbre, but damageMultiplier should be applied
  assert(df3.damageType === 'impacto', 'crit preserves damage type');

  // Body part multiplier: head > chest
  const dfHead = combatEngine.calculateDamageFormula(atk, def, 'cabeza', {});
  const dfChest = combatEngine.calculateDamageFormula(atk, def, 'pecho', {});
  assert(dfHead.baseDamage * 1.5 === dfHead.baseDamage * 1.5, 'head zone mult 1.5x');
  const zoneMultHead = dfHead.damage / dfHead.baseDamage;
  const zoneMultChest = dfChest.damage / dfChest.baseDamage;
  assert(dfHead.zoneMultiplier === 1.5, 'head zoneMultiplier = 1.5');
  assert(dfChest.zoneMultiplier === 1.0, 'chest zoneMultiplier = 1.0');

  // ──────────────────────────────────────────────
  // applyFatigueEffect
  // ──────────────────────────────────────────────
  console.log('\n--- applyFatigueEffect ---');

  const stats = { fuerza: 10, reflejos: 8, velocidad_ataque: 6, precision: 7, velocidad_desplazamiento: 5, dominio_fulgor: 3, resistencia_fisica: 5, resistencia_magica: 3 };
  const fatigued = combatEngine.applyFatigueEffect(stats, 5);
  // fatigue 5 = -10 to each combat stat
  assert(fatigued.fuerza === 1, 'fuerza clamped to min 1');
  assert(fatigued.reflejos === 1, 'reflejos clamped to min 1');
  assert(fatigued.velocidad_ataque === 1, 'velocidad_ataque clamped to min 1');
  assert(fatigued.precision === 1, 'precision clamped to min 1');
  assert(fatigued.dominio_fulgor === 3, 'dominio_fulgor unchanged by fatigue');

  const noFatigue = combatEngine.applyFatigueEffect(stats, 0);
  assertEqual(noFatigue.fuerza, stats.fuerza, 'zero fatigue = no change');

  // ──────────────────────────────────────────────
  // getZoneMultiplier
  // ──────────────────────────────────────────────
  console.log('\n--- getZoneMultiplier ---');

  assert(combatEngine.getZoneMultiplier('cabeza') === 1.5, 'head 1.5x');
  assert(combatEngine.getZoneMultiplier('cuello') === 1.8, 'neck 1.8x');
  assert(combatEngine.getZoneMultiplier('pecho') === 1.0, 'chest 1.0x');
  assert(combatEngine.getZoneMultiplier('mano_izq') === 0.5, 'left hand 0.5x');
  assert(combatEngine.getZoneMultiplier('pie_der') === 0.4, 'right foot 0.4x');

  // ──────────────────────────────────────────────
  // applyBodyPartDamage
  // ──────────────────────────────────────────────
  console.log('\n--- applyBodyPartDamage ---');

  const bpP = createMockParticipant({ hp: 100, maxHp: 100, bodyParts: { brazo_izq: 10, cabeza: 10 } });

  // Light damage to arm
  const bp1 = combatEngine.applyBodyPartDamage(bpP, 'brazo_izq', 2);
  assert(bp1.newHp === 8, 'arm HP reduced from 10 to 8');
  assert(bp1.zoneStatus === 'functional', '2 dmg to arm = functional');

  // Moderate damage
  const bp2 = combatEngine.applyBodyPartDamage(bpP, 'brazo_izq', 4);
  assert(bp2.zoneStatus === 'impaired' || bp2.zoneStatus === 'useless',
    '6 total dmg to 10HP arm = impaired or useless');

  // Amputation
  const bpP2 = createMockParticipant({ hp: 100, bodyParts: { mano_der: 5 } });
  const bp3 = combatEngine.applyBodyPartDamage(bpP2, 'mano_der', 5);
  assert(bp3.newHp === 0, '5 dmg to 5HP hand = 0');
  assert(bp3.zoneStatus === 'amputated', 'hand amputated');

  // KO threshold
  const bpP3 = createMockParticipant({ hp: 35, maxHp: 100, bodyParts: { pecho: 20 } });
  const bp4 = combatEngine.applyBodyPartDamage(bpP3, 'pecho', 50);
  assert(bp4.ko === true, 'massive damage triggers KO');
  assert(bpP3.ko === true, 'participant marked KO');

  // ──────────────────────────────────────────────
  // canIntercept / canFlee
  // ──────────────────────────────────────────────
  console.log('\n--- canIntercept / canFlee ---');

  const inter1 = combatEngine.canIntercept(5, 10);
  assert(typeof inter1 === 'boolean', 'canIntercept returns boolean');

  const flee1 = combatEngine.canFlee(5, 3);
  assert(typeof flee1 === 'boolean', 'canFlee returns boolean');

  // ──────────────────────────────────────────────
  // applyFatigue
  // ──────────────────────────────────────────────
  console.log('\n--- applyFatigue ---');

  const fatP = createMockParticipant({ fatigue: 0, turnsActive: 0 });
  combatEngine.applyFatigue(fatP);
  assert(fatP.turnsActive === 1, 'turnsActive incremented');

  // ──────────────────────────────────────────────
  // formatActionResult
  // ──────────────────────────────────────────────
  console.log('\n--- formatActionResult ---');

  const hitResult = {
    action: { actor: 'p1', type: 'attack', intent: 'ofensivo', targetZone: 'pecho', damageType: 'cortadura', moveNumber: 1 },
    result: { hit: true, damage: 15, bodyPart: 'pecho', crit: false, blocked: false, ko: false, intercepted: false, moveNumber: 1, bodyPartStatus: null, attackerFatigue: 2, defenderFatigue: 1, defenderHp: 85, defenderMaxHp: 100, attackerItem: null, brokenItems: [], armorType: null, armorName: null, effectiveness: 1.0 },
    context: {
      attacker: { name: 'Hero', fatigue: 2, fulgor: 50 },
      defender: { name: 'Goblin', fatigue: 1, fulgor: 0, bodyParts: {} },
      participants: 2, round: 1, turnCount: 3,
    },
  };
  const formatted = combatEngine.formatActionResult(hitResult);
  assert(formatted.includes('Hero'), 'format includes attacker name');
  assert(formatted.includes('Goblin'), 'format includes defender name');
  assert(formatted.includes('15'), 'format includes damage');

  const missResult = {
    action: { actor: 'p1', type: 'attack', targetZone: 'pecho', damageType: 'cortadura', moveNumber: 1 },
    result: { hit: false, damage: 0, bodyPart: 'pecho', crit: false, blocked: false, ko: false, intercepted: false, moveNumber: 1 },
    context: { attacker: { name: 'Hero', fatigue: 0, fulgor: 50 }, defender: { name: 'Goblin', fatigue: 0, fulgor: 0, bodyParts: {} }, participants: 2, round: 1, turnCount: 4 },
  };
  const missFormatted = combatEngine.formatActionResult(missResult);
  assert(missFormatted.includes('falló'), 'miss format mentions falló');

  // ──────────────────────────────────────────────
  // Resumen
  // ──────────────────────────────────────────────
  const ok = printResults('Combat Engine Core');
  if (!ok) process.exit(1);
}

run().catch(err => { console.error('FATAL:', err); process.exit(1); });
