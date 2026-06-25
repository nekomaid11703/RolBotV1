const { RPG_CONFIG } = require('../../config/rpg.config');
const turnManager = require('./combatTurnManager');
const stateManager = require('./combatStateManager');

const CR = RPG_CONFIG.combatRoom;

function roll(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function applyFatigueEffect(stats, fatigue) {
  if (fatigue <= 0) return stats;
  const penalty = fatigue * 2;
  return {
    fuerza: Math.max(1, stats.fuerza - penalty),
    reflejos: Math.max(1, stats.reflejos - penalty),
    velocidad_ataque: Math.max(1, stats.velocidad_ataque - penalty),
    precision: Math.max(1, stats.precision - penalty),
    velocidad_desplazamiento: Math.max(1, stats.velocidad_desplazamiento - penalty),
    dominio_fulgor: stats.dominio_fulgor,
    resistencia_fisica: stats.resistencia_fisica,
    resistencia_magica: stats.resistencia_magica,
  };
}

function getEffectiveStats(participant) {
  return applyFatigueEffect(participant, participant.fatigue);
}

function calculateHitChance(attackerStats, defenderStats) {
  const atkPrecision = attackerStats.precision || 5;
  const defReflejos = defenderStats.reflejos || 5;
  const base = RPG_CONFIG.combat.baseHitChance || 0.85;
  const diff = (atkPrecision - defReflejos) * 0.03;
  return clamp(base + diff, 0.2, 0.98);
}

function calculateDamageFormula(attacker, defender, targetZone, options = {}) {
  const aStats = getEffectiveStats(attacker);
  const dStats = getEffectiveStats(defender);

  let baseDamage = 0;
  const damageType = options.damageType || 'impacto';
  const isMagical = options.isMagical || false;

  if (isMagical) {
    const dominio = aStats.dominio_fulgor || 1;
    const precision = aStats.precision || 5;
    baseDamage = dominio * (precision / 5);
    const cost = Math.round(baseDamage * 0.3);
    attacker.fulgor = Math.max(0, (attacker.fulgor || 0) - cost);
  } else if (damageType === 'cortadura') {
    baseDamage = (aStats.fuerza || 5) * 1.2;
  } else {
    baseDamage = (aStats.fuerza || 5);
  }

  let defense = 0;
  if (damageType === 'cortadura') {
    defense = 0;
  } else if (isMagical) {
    defense = dStats.resistencia_magica || 3;
  } else {
    defense = dStats.resistencia_fisica || 5;
  }

  const zoneMult = getZoneMultiplier(targetZone);
  let damage = Math.max(1, baseDamage * zoneMult - defense);

  if (options.crit) {
    damage *= RPG_CONFIG.combat.critMultiplier || 1.5;
  }

  if (attacker.fatigue > 0) {
    damage *= Math.max(0.5, 1 - attacker.fatigue * 0.05);
  }

  if (defender.defending) {
    damage *= 0.4;
  }

  damage = Math.round(damage);

  const incertidumbre = roll(
    Math.round(damage * CR.incertidumbreMin),
    Math.round(damage * CR.incertidumbreMax)
  );

  return {
    damage: Math.max(CR.koThreshold > 0 ? 1 : 0, incertidumbre),
    baseDamage: Math.round(baseDamage),
    appliedDefense: Math.round(defense),
    zoneMultiplier: zoneMult,
    isCrit: options.crit || false,
    damageType,
    isMagical,
    fulgorCost: isMagical ? Math.round(baseDamage * 0.3) : 0,
  };
}

function getZoneMultiplier(zone) {
  const mults = {
    cabeza: 1.5, cuello: 1.8, pecho: 1.0, abdomen: 1.1,
    brazo_izq: 0.7, brazo_der: 0.7, mano_izq: 0.5, mano_der: 0.5,
    pierna_izq: 0.8, pierna_der: 0.8, pie_izq: 0.4, pie_der: 0.4,
  };
  return mults[zone] || 1.0;
}

function applyBodyPartDamage(participant, zone, damage) {
  const bp = participant.bodyParts;
  const currentHp = bp[zone] || 10;
  const newHp = Math.max(0, currentHp - damage);
  bp[zone] = newHp;

  let zoneStatus = 'functional';
  const baseResistance = {
    cabeza: 10, cuello: 5, pecho: 20, abdomen: 15,
    brazo_izq: 10, brazo_der: 10, mano_izq: 5, mano_der: 5,
    pierna_izq: 12, pierna_der: 12, pie_izq: 5, pie_der: 5,
  };
  const maxHp = baseResistance[zone] || 10;
  const ratio = newHp / maxHp;

  if (newHp <= 0) {
    zoneStatus = 'amputated';
  } else if (ratio < 0.3) {
    zoneStatus = 'useless';
  } else if (ratio < 0.5) {
    zoneStatus = 'impaired';
  }

  participant.hp = Math.max(0, participant.hp - Math.round(damage * 0.6));

  if (participant.hp <= CR.koThreshold) {
    participant.ko = true;
  }

  return { zone, newHp, maxHp, zoneStatus, totalHp: participant.hp, ko: participant.ko };
}

function applyFatigue(participant) {
  const turnsSinceLastRest = participant.turnsActive || 0;
  if (turnsSinceLastRest > CR.fatigueAfterTurns) {
    participant.fatigue = Math.min(10, participant.fatigue + 1);
  }
  participant.turnsActive = (participant.turnsActive || 0) + 1;
  return participant.fatigue;
}

function canIntercept(attackerVel, defenderReflejos) {
  return defenderReflejos >= attackerVel * CR.interceptionSpeedRatio;
}

function canFlee(participantReflejos, enemyVelocidad) {
  return participantReflejos >= enemyVelocidad * CR.fleeReflexRatio;
}

async function processAttack(room, attackerJid, targetJid, targetZone = 'pecho', options = {}) {
  const attacker = turnManager.getParticipantByJid(room, attackerJid);
  const defender = turnManager.getParticipantByJid(room, targetJid);

  if (!attacker) return { error: 'Atacante no encontrado en el combate.' };
  if (!defender) return { error: 'Objetivo no encontrado en el combate.' };
  if (attacker.ko) return { error: 'Estás K.O., no puedes atacar.' };
  if (defender.ko) return { error: `${defender.name} ya está K.O.` };

  const aStats = getEffectiveStats(attacker);
  const dStats = getEffectiveStats(defender);
  const moveNumber = options.moveNumber || 1;
  const isMagical = options.isMagical || false;
  const damageType = options.damageType || (isMagical ? 'magico' : 'impacto');

  let hitResult = { hit: false, intercepted: false, blocked: false, crit: false, damage: 0 };

  if (moveNumber === 1 && defender.team !== attacker.team) {
    const intercepted = canIntercept(aStats.velocidad_ataque, dStats.reflejos);
    if (intercepted) {
      hitResult.intercepted = true;
      hitResult.hit = false;
    }
  }

  if (!hitResult.intercepted) {
    const hitChance = calculateHitChance(aStats, dStats);
    hitResult.hit = Math.random() < hitChance;

    if (hitResult.hit) {
      const critChance = clamp(aStats.precision * 0.02, 0.02, 0.25);
      hitResult.crit = Math.random() < critChance;

      const formulaResult = calculateDamageFormula(attacker, defender, targetZone, {
        damageType,
        isMagical,
        crit: hitResult.crit,
      });

      hitResult.damage = formulaResult.damage;

      const bodyResult = applyBodyPartDamage(defender, targetZone, hitResult.damage);
      hitResult.bodyPartResult = bodyResult;
      hitResult.ko = defender.ko;

      hitResult.blocked = defender.defending && hitResult.damage < formulaResult.baseDamage * 0.5;
    }
  }

  attacker.defending = false;

  const fatigue = applyFatigue(attacker);

  const result = {
    hit: hitResult.hit,
    damage: hitResult.damage,
    bodyPart: targetZone,
    crit: hitResult.crit,
    blocked: hitResult.blocked,
    ko: defender.ko,
    intercepted: hitResult.intercepted,
    damageType,
    moveNumber,
    bodyPartStatus: hitResult.bodyPartResult?.zoneStatus || null,
    attackerFatigue: fatigue,
    defenderFatigue: defender.fatigue,
    defenderHp: defender.hp,
    defenderMaxHp: defender.maxHp,
  };

  return {
    action: {
      actor: attackerJid,
      type: 'attack',
      intent: 'ofensivo',
      targetZone,
      damageType,
      moveNumber,
    },
    result,
    context: {
      attacker: { name: attacker.name, fatigue: attacker.fatigue, fulgor: attacker.fulgor },
      defender: { name: defender.name, fatigue: defender.fatigue, fulgor: defender.fulgor, bodyParts: defender.bodyParts },
      location: room.location,
      participants: turnManager.getAliveParticipants(room).length,
      round: room.round,
      turnCount: room.turnCount,
    },
  };
}

async function processDefend(room, participantJid) {
  const p = turnManager.getParticipantByJid(room, participantJid);
  if (!p) return { error: 'No estás en este combate.' };
  if (p.ko) return { error: 'Estás K.O.' };

  p.defending = true;
  applyFatigue(p);

  return {
    action: { actor: participantJid, type: 'defend', intent: 'defensivo', targetZone: 'general', damageType: 'none', moveNumber: 1 },
    result: { hit: false, damage: 0, bodyPart: 'general', crit: false, blocked: false, ko: false, intercepted: false, moveNumber: 1 },
    context: {
      attacker: { name: p.name, fatigue: p.fatigue, fulgor: p.fulgor },
      defender: { name: p.name, fatigue: p.fatigue, fulgor: p.fulgor, bodyParts: p.bodyParts },
      location: room.location,
      participants: turnManager.getAliveParticipants(room).length,
      round: room.round,
      turnCount: room.turnCount,
    },
  };
}

async function processFlee(room, participantJid) {
  const p = turnManager.getParticipantByJid(room, participantJid);
  if (!p) return { error: 'No estás en este combate.' };
  if (p.ko) return { error: 'Estás K.O., no puedes huir.' };

  const enemies = turnManager.getAliveParticipants(room, 'enemies');
  const fastestEnemy = enemies.sort((a, b) => b.velocidad_ataque - a.velocidad_ataque)[0];

  let success = true;
  let fleeBlocked = false;

  if (fastestEnemy) {
    const canEscape = canFlee(p.reflejos, fastestEnemy.velocidad_ataque);
    success = canEscape && Math.random() < 0.6;
    if (!success) fleeBlocked = true;
  }

  if (success) {
    p.ko = true;
    p.hp = 0;
  }

  return {
    action: { actor: participantJid, type: 'flee', intent: 'retirada', targetZone: 'general', damageType: 'none', moveNumber: 1 },
    result: {
      hit: success,
      damage: 0,
      bodyPart: 'general',
      crit: false,
      blocked: false,
      ko: success,
      intercepted: fleeBlocked,
      moveNumber: 1,
    },
    context: {
      attacker: { name: p.name, fatigue: p.fatigue, fulgor: p.fulgor },
      defender: fastestEnemy ? { name: fastestEnemy.name, fatigue: fastestEnemy.fatigue, fulgor: fastestEnemy.fulgor, bodyParts: fastestEnemy.bodyParts } : null,
      location: room.location,
      participants: turnManager.getAliveParticipants(room).length,
      round: room.round,
      turnCount: room.turnCount,
    },
  };
}

async function autoResolveEnemyTurn(room) {
  const current = turnManager.getCurrentParticipant(room);
  if (!current || current.team !== 'enemies' || current.ko) return null;

  const targets = turnManager.getAliveParticipants(room, 'players');
  if (targets.length === 0) return null;

  const target = targets.sort((a, b) => a.reflejos - b.reflejos)[0];
  const zones = ['cabeza', 'pecho', 'abdomen', 'brazo_izq', 'brazo_der', 'pierna_izq', 'pierna_der'];
  const zone = zones[Math.floor(Math.random() * zones.length)];

  const attackResult = await processAttack(room, current.id, target.id, zone);

  return attackResult;
}

function generateReward(room) {
  const enemies = room.participants.filter(p => p.team === 'enemies' && p.ko);
  const players = turnManager.getAliveParticipants(room, 'players');

  let totalStelas = 0;
  let totalXp = 0;

  for (const e of enemies) {
    const stelas = roll(3, 15);
    const xp = roll(10, 30);
    totalStelas += stelas;
    totalXp += xp;
  }

  const perPlayer = {
    stelas: Math.round(totalStelas / Math.max(1, players.length)),
    xp: Math.round(totalXp / Math.max(1, players.length)),
  };

  return perPlayer;
}

function formatActionResult(actionResult) {
  const { action, result, context } = actionResult;
  const aName = context.attacker.name;
  const dName = context.defender ? context.defender.name : 'nadie';
  const lines = [];

  if (action.type === 'attack') {
    if (result.intercepted) {
      lines.push(`🛡️ ${dName} interceptó el ataque de ${aName}!`);
    } else if (!result.hit) {
      lines.push(`💨 ${aName} falló el ataque contra ${dName}.`);
    } else {
      const zoneLabel = result.bodyPart.replace(/_/g, ' ');
      const critTag = result.crit ? ' 💥 CRÍTICO!' : '';
      const statusTag = result.bodyPartStatus === 'amputated' ? ' ⚠️ AMPUTACIÓN' :
                        result.bodyPartStatus === 'useless' ? ' ⛔ INUTILIZADA' : '';
      const koTag = result.ko ? ' 💀 K.O.!' : '';
      lines.push(`⚔️ ${aName} golpea a ${dName} en ${zoneLabel} causando *${result.damage}* de daño${critTag}${statusTag}${koTag}`);
    }
    if (context.attacker.fatigue > 3) {
      lines.push(`😮‍💨 ${aName} muestra signos de fatiga (${context.attacker.fatigue})`);
    }
  } else if (action.type === 'defend') {
    lines.push(`🛡️ ${aName} se pone en guardia.`);
  } else if (action.type === 'flee') {
    if (result.hit) {
      lines.push(`🏃 ${aName} logró huir del combate!`);
    } else {
      lines.push(`🚫 ${aName} no pudo huir!`);
    }
  }

  return lines.join('\n');
}

module.exports = {
  calculateDamageFormula,
  calculateHitChance,
  applyFatigue,
  applyFatigueEffect,
  getEffectiveStats,
  applyBodyPartDamage,
  canIntercept,
  canFlee,
  processAttack,
  processDefend,
  processFlee,
  autoResolveEnemyTurn,
  generateReward,
  formatActionResult,
};
