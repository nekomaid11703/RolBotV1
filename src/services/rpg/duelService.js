const stateManager = require('./combatStateManager');
const turnManager = require('./combatTurnManager');
const { addMoney, removeMoney, getBalance } = require('../economyService');
const { logError } = require('../loggerService');

const pendingChallenges = new Map();

function getChallengeKey(targetId, groupId) {
  return `${targetId}:${groupId}`;
}

function createChallenge(challengerId, challengerName, targetId, targetName, groupId, betAmount = 0) {
  const key = getChallengeKey(targetId, groupId);
  if (pendingChallenges.has(key)) {
    return { error: `${targetName} ya tiene un duelo pendiente.` };
  }

  if (challengerId === targetId) {
    return { error: 'No puedes desafiarte a ti mismo.' };
  }

  const challenge = {
    challengerId,
    challengerName,
    targetId,
    targetName,
    groupId,
    betAmount: Math.max(0, Math.floor(betAmount)),
    createdAt: Date.now(),
    timeout: null,
  };

  challenge.timeout = setTimeout(() => {
    const existing = pendingChallenges.get(key);
    if (existing && existing.challengerId === challengerId) {
      pendingChallenges.delete(key);
    }
  }, 60000);

  pendingChallenges.set(key, challenge);

  const betMsg = challenge.betAmount > 0 ? ` con apuesta de ${challenge.betAmount} estelas` : '';

  return {
    success: true,
    challenge,
    message: `⚔️ ${challengerName} reta a ${targetName} a un duelo${betMsg}!\n${targetName}, usa /aceptar @${challengerName} para aceptar o /rechazar @${challengerName} para rechazar.\n⏰ Expira en 60 segundos.`,
  };
}

function getChallengeForTarget(targetId, groupId) {
  const key = getChallengeKey(targetId, groupId);
  return pendingChallenges.get(key) || null;
}

async function acceptChallenge(targetId, groupId) {
  const challenge = getChallengeForTarget(targetId, groupId);
  if (!challenge) {
    return { error: 'No tienes un duelo pendiente.' };
  }

  clearTimeout(challenge.timeout);
  pendingChallenges.delete(getChallengeKey(targetId, groupId));

  const challengerName = challenge.challengerName;
  const targetName = challenge.targetName;

  if (challenge.betAmount > 0) {
    try {
      await removeMoney(challenge.challengerId, challenge.betAmount, { userName: challengerName });
    } catch (e) {
      return { error: `${challengerName} no tiene suficientes estelas (${e.message}).` };
    }
    try {
      await removeMoney(targetId, challenge.betAmount, { userName: targetName });
    } catch (e) {
      await addMoney(challenge.challengerId, challenge.betAmount, { userName: challengerName });
      return { error: `No tienes suficientes estelas (${e.message}).` };
    }
  }

  const participants = [
    stateManager.makeBaseParticipant(challenge.challengerId, challengerName, 'players', {}, {}, {}, 'challenger'),
    stateManager.makeBaseParticipant(targetId, targetName, 'players', {}, {}, {}, 'target'),
  ];

  const room = stateManager.createRoom(groupId, participants, {
    startedVia: 'pvp',
    betAmount: challenge.betAmount,
    challengerId: challenge.challengerId,
    targetId: targetId,
  });

  await stateManager.saveToSupabase(room);

  const betMsg = challenge.betAmount > 0 ? `\n💰 ${challenge.betAmount} estelas en juego de cada uno.` : '';
  return {
    success: true,
    room,
    message: `⚔️ *DUELO ACEPTADO* ⚔️\n${challengerName} vs ${targetName}${betMsg}\n\n${turnManager.formatStatus(room)}`,
  };
}

function rejectChallenge(targetId, groupId) {
  const challenge = getChallengeForTarget(targetId, groupId);
  if (!challenge) {
    return { error: 'No tienes un duelo pendiente.' };
  }

  clearTimeout(challenge.timeout);
  pendingChallenges.delete(getChallengeKey(targetId, groupId));

  return {
    success: true,
    message: `❌ ${challenge.targetName} rechazó el duelo de ${challenge.challengerName}.`,
  };
}

function cancelChallenge(challengerId, groupId) {
  for (const [key, challenge] of pendingChallenges.entries()) {
    if (challenge.challengerId === challengerId && challenge.groupId === groupId) {
      clearTimeout(challenge.timeout);
      pendingChallenges.delete(key);
      return { success: true, message: 'Duelo cancelado.' };
    }
  }
  return { error: 'No tienes un duelo pendiente para cancelar.' };
}

async function handlePvPVictory(room, winnerId, loserId) {
  const betAmount = room.betAmount || 0;
  if (betAmount > 0) {
    const pot = betAmount * 2;
    try {
      await addMoney(winnerId, pot, { userName: room.participants.find(p => p.id === winnerId)?.name || 'Ganador' });
    } catch (e) {
      logError({ source: 'duelService.handlePvPVictory', error: e });
    }
  }
  return betAmount > 0 ? `\n💰 ${winnerId === room.challengerId ? room.challengerName || 'Ganador' : 'Ganador'} gana ${betAmount * 2} estelas!` : '';
}

function getStatus() {
  const active = pendingChallenges.size;
  return { pendingChallenges: active };
}

module.exports = {
  createChallenge,
  getChallengeForTarget,
  acceptChallenge,
  rejectChallenge,
  cancelChallenge,
  handlePvPVictory,
  getStatus,
};
