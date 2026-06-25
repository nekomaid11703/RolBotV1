const { RPG_CONFIG } = require('../../config/rpg.config');

const CR = RPG_CONFIG.combatRoom;

function getNextAliveIndex(room, fromIndex) {
  const total = room.turnQueue.length;
  for (let i = 0; i < total; i++) {
    const idx = (fromIndex + i) % total;
    const entry = room.turnQueue[idx];
    const p = room.participants.find(pp => pp.id === entry.participantId);
    if (p && !p.ko) return idx;
  }
  return -1;
}

function getCurrentParticipant(room) {
  const entry = room.turnQueue[room.currentTurnIndex];
  if (!entry) return null;
  return room.participants.find(p => p.id === entry.participantId) || null;
}

function validateTurn(room, jid) {
  if (room.status !== 'active') {
    return { valid: false, reason: 'finished', message: 'Este combate ya terminó.' };
  }

  const participant = room.participants.find(p => p.id === jid);
  if (!participant) {
    return { valid: false, reason: 'not_participant', message: 'No formas parte de este combate.' };
  }

  if (participant.ko) {
    return { valid: false, reason: 'ko', message: `Estás K.O. No puedes actuar hasta que te recuperes.` };
  }

  const current = getCurrentParticipant(room);
  if (!current) {
    return { valid: false, reason: 'no_turn', message: 'No hay un turno activo en este momento.' };
  }

  if (current.id !== jid) {
    const nextName = current.name || current.id.split('@')[0];
    return { valid: false, reason: 'wrong_turn', message: `⛔ No es tu turno. El turno es de @${nextName}` };
  }

  const timeout = room.turnTimeoutMs || CR.turnTimeoutMs;
  if (Date.now() - participant.lastActionAt > timeout) {
    return { valid: false, reason: 'timeout', message: '⏰ Tu turno expiró por inactividad.', timedOut: true };
  }

  return { valid: true, reason: 'ok', message: '', participant, current };
}

function checkTimeout(room) {
  const current = getCurrentParticipant(room);
  if (!current || current.ko) return null;
  const timeout = room.turnTimeoutMs || CR.turnTimeoutMs;
  if (Date.now() - current.lastActionAt > timeout) {
    return current;
  }
  return null;
}

async function applySkip(room, reason = 'timeout') {
  const current = getCurrentParticipant(room);
  if (!current) return null;

  current.consecutiveSkips++;
  current.fatigue = Math.min(10, current.fatigue + CR.skipFatiguePenalty);
  current.lastActionAt = Date.now();

  const skipCount = current.consecutiveSkips;
  const maxSkips = CR.maxConsecutiveSkips;

  let message;
  if (skipCount >= maxSkips && CR.autoExpelAfterSkips) {
    message = `💀 @${current.name} ha sido expulsado del combate por inactividad prolongada.`;
    current.ko = true;
    current.hp = 0;
  } else if (skipCount === maxSkips - 1) {
    message = `⚠️ @${current.name} perdió su turno (+${CR.skipFatiguePenalty} fatiga). PRÓXIMO SKIP = EXPULSIÓN.`;
  } else {
    message = `⏰ @${current.name} perdió su turno por inactividad (+${CR.skipFatiguePenalty} fatiga).`;
  }

  advanceTurn(room);
  return { participant: current, message, skipCount };
}

function advanceTurn(room) {
  room.turnCount++;

  const nextIdx = getNextAliveIndex(room, room.currentTurnIndex + 1);
  if (nextIdx === -1) {
    room.currentTurnIndex = 0;
    room.status = 'finished';
    return false;
  }

  if (nextIdx <= room.currentTurnIndex) {
    room.round++;
  }

  room.currentTurnIndex = nextIdx;
  room.lastActionAt = Date.now();

  const nextP = getCurrentParticipant(room);
  if (nextP) nextP.lastActionAt = Date.now();

  return true;
}

function skipAllKO(room) {
  let alive = getNextAliveIndex(room, room.currentTurnIndex);
  if (alive === -1) {
    room.status = 'finished';
    return false;
  }
  if (alive !== room.currentTurnIndex) {
    if (alive < room.currentTurnIndex) room.round++;
    room.currentTurnIndex = alive;
  }
  return true;
}

function getNextActiveJid(room) {
  const idx = getNextAliveIndex(room, room.currentTurnIndex);
  if (idx === -1) return null;
  const entry = room.turnQueue[idx];
  return entry ? entry.participantId : null;
}

function getNextActiveParticipant(room) {
  const jid = getNextActiveJid(room);
  if (!jid) return null;
  return room.participants.find(p => p.id === jid) || null;
}

function formatTimeRemaining(room) {
  const current = getCurrentParticipant(room);
  if (!current) return '—';
  const timeout = room.turnTimeoutMs || CR.turnTimeoutMs;
  const elapsed = Date.now() - current.lastActionAt;
  const remaining = Math.max(0, timeout - elapsed);
  const hours = Math.floor(remaining / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m`;
  return '< 1m';
}

function formatHPBar(current, max, segments = 8) {
  const ratio = Math.max(0, Math.min(1, (current || 0) / (max || 1)));
  const filled = Math.round(ratio * segments);
  const empty = segments - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function formatStatus(room) {
  const lines = [];
  const nextP = getNextActiveParticipant(room);
  const currentP = getCurrentParticipant(room);

  lines.push('✦ ━━━━━━━━━━━━━━ ✦');
  lines.push(`⚔️ *COMBATE* — Ronda ${room.round}, Turno #${room.turnCount}`);
  lines.push(`📍 ${room.location.zone || 'desconocido'}`);
  lines.push('✦ ━━━━━━━━━━━━━━ ✦');
  lines.push('');

  const players = room.participants.filter(p => p.team === 'players');
  const enemies = room.participants.filter(p => p.team === 'enemies');

  if (players.length > 0) {
    lines.push('*Jugadores:*');
    for (const p of players) {
      const bar = formatHPBar(p.hp, p.maxHp);
      const koTag = p.ko ? ' 💀' : '';
      const fatigueTag = p.fatigue > 0 ? ` (${p.fatigue} fatiga)` : '';
      const arrow = currentP && currentP.id === p.id ? '► ' : '  ';
      lines.push(`${arrow}${bar} ${p.name}${koTag}${fatigueTag}`);
    }
    lines.push('');
  }

  if (enemies.length > 0) {
    lines.push('*Enemigos:*');
    for (const p of enemies) {
      const bar = formatHPBar(p.hp, p.maxHp);
      const koTag = p.ko ? ' 💀' : '';
      const arrow = currentP && currentP.id === p.id ? '► ' : '  ';
      lines.push(`${arrow}${bar} ${p.name}${koTag}`);
    }
    lines.push('');
  }

  if (currentP && !currentP.ko) {
    lines.push(`► *${currentP.name}* — Es tu turno! (timeout: ${formatTimeRemaining(room)})`);
    lines.push(`   Saltos: ${currentP.consecutiveSkips}/${CR.maxConsecutiveSkips}`);
  } else if (nextP) {
    const nextName = nextP.name || nextP.id.split('@')[0];
    lines.push(`⏳ Turno de *${nextName}*`);
  }

  lines.push('');
  lines.push('✦ ━━━━━━━━━━━━━━ ✦');
  return lines.join('\n');
}

function formatTurnTag(room) {
  const next = getNextActiveParticipant(room);
  if (!next) return '';
  return `@${next.name}`;
}

function getParticipantByJid(room, jid) {
  return room.participants.find(p => p.id === jid) || null;
}

function getAliveParticipants(room, team) {
  return room.participants.filter(p => !p.ko && (!team || p.team === team));
}

function checkVictoryConditions(room) {
  const alivePlayers = getAliveParticipants(room, 'players').length;
  const aliveEnemies = getAliveParticipants(room, 'enemies').length;

  if (alivePlayers === 0) return { finished: true, winner: 'enemies', message: '💀 Todos los jugadores han caído. Derrota.' };
  if (aliveEnemies === 0) return { finished: true, winner: 'players', message: '🎉 Todos los enemigos han sido derrotados. Victoria!' };
  return { finished: false, winner: null, message: '' };
}

module.exports = {
  getCurrentParticipant,
  getNextActiveParticipant,
  getNextActiveJid,
  getParticipantByJid,
  getAliveParticipants,
  validateTurn,
  checkTimeout,
  applySkip,
  advanceTurn,
  skipAllKO,
  formatStatus,
  formatHPBar,
  formatTimeRemaining,
  formatTurnTag,
  checkVictoryConditions,
};
