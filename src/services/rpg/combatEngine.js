const { calculateDamage, calculateHitChance } = require('./statCalculator');
const { validateFlee, validateXP } = require('./ruleEngine');
const { addMoney } = require('../economyService');
const { getEnemy } = require('./enemies');
const { RPG_CONFIG } = require('../../config/rpg.config');
const { updateCharacterStats } = require('../characterService');

const activeCombats = new Map();

const LINE = "✦ ━━━━━━━━━━━━━━ ✦";

function calcLevel(exp) {
  let level = 1;
  let needed = RPG_CONFIG.baseXP;
  let total = 0;
  while (total + needed <= (exp || 0) && level < RPG_CONFIG.maxLevel) {
    total += needed;
    level++;
    needed = Math.floor(RPG_CONFIG.baseXP * Math.pow(RPG_CONFIG.xpScaleFactor, level - 1));
  }
  return level;
}

function getCombatStats(character) {
  const s = character.stats || {};
  const level = calcLevel(s.exp);
  const hpBase = (s.vida || 100) + (level - 1) * RPG_CONFIG.hpPerLevel;
  const mpBase = RPG_CONFIG.defaultStats.mp + (level - 1) * RPG_CONFIG.mpPerLevel;
  return {
    hp: hpBase,
    mp: mpBase,
    fuerza: s.fuerza || 5,
    defensa: s.defensa || 5,
    agilidad: s.agilidad || 5,
    magia: s.inteligencia || 3,
    percepcion: s.suerte || 3,
    carisma: 1,
    level,
  };
}

function getCombatState(userId) {
  return activeCombats.get(userId) || null;
}

function getEnemyStats(enemy) {
  return {
    fuerza: enemy.stats.fuerza || 3,
    defensa: enemy.stats.defensa || 2,
    agilidad: enemy.stats.agilidad || 2,
    magia: enemy.stats.magia || 2,
    percepcion: enemy.stats.percepcion || 2,
    carisma: enemy.stats.carisma || 2,
    hp: enemy.hp || 30,
    mp: enemy.mp || 5,
  };
}

function roll(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatCombatStatus(state) {
  const pHpBar = createBar(state.playerHp, state.playerMaxHp, 10);
  const eHpBar = createBar(state.enemyHp, state.enemyMaxHp, 10);

  return [
    LINE,
    `⚔️ *COMBATE*`,
    LINE,
    '',
    `👤 *TÚ* — ${pHpBar} ${state.playerHp}/${state.playerMaxHp} HP`,
    `👾 *${state.enemy.name}* — ${eHpBar} ${state.enemyHp}/${state.enemyMaxHp} HP`,
    `🔄 Turno: ${state.turn === 'player' ? 'Tuyo' : 'Enemigo'}`,
    LINE,
  ].join('\n');
}

function createBar(current, max, segments) {
  const ratio = Math.max(0, Math.min(1, (current || 0) / (max || 1)));
  const filled = Math.round(ratio * segments);
  const empty = segments - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function formatCombatEnd(combat, won, reward = null) {
  const lines = [
    LINE,
    won ? '🎉 *VICTORIA!*' : '💀 *DERROTA*',
    LINE,
    '',
  ];

  if (won && reward) {
    lines.push(`Has derrotado a *${combat.enemy.name}*!`);
    if (reward.stelas) lines.push(`💰 +${reward.stelas} ✦ estelas`);
    if (reward.xp) lines.push(`⭐ +${reward.xp} XP`);
  } else if (won) {
    lines.push(`Has derrotado a *${combat.enemy.name}*!`);
  } else {
    lines.push(`Has sido derrotado por *${combat.enemy.name}*.`);
  }

  lines.push('', LINE);
  return lines.join('\n');
}

function formatFleeResult(success, enemyName) {
  return [
    LINE,
    '🏃 *HUIDA*',
    LINE,
    '',
    success
      ? `Lograste escapar de *${enemyName}*!`
      : `No pudiste escapar de *${enemyName}*!`,
    '',
    LINE,
  ].join('\n');
}

function formatDefendMessage(enemyName, damageTaken) {
  return [
    LINE,
    '🛡️ *DEFENSA*',
    LINE,
    '',
    `Te pones en guardia frente a *${enemyName}*.`,
    damageTaken > 0
      ? `El enemigo ataca pero solo recibes *${damageTaken}* de daño.`
      : `El enemigo ataca pero *bloqueas todo el daño*!`,
    '',
    LINE,
  ].join('\n');
}

function generateReward(enemy, characterLevel) {
  const r = enemy.reward;
  const stelas = roll(r.stelasMin, r.stelasMax);
  const xp = validateXP(characterLevel, enemy.level);
  return { stelas, xp };
}

async function startCombat(userId, character, enemyId) {
  const enemy = getEnemy(enemyId);
  if (!enemy) return { error: `Enemigo "${enemyId}" no encontrado. Usa: /atacar <enemigo>.` };

  if (activeCombats.has(userId)) {
    return { error: 'Ya estás en combate! Usa /huir para escapar.' };
  }

  const playerStats = getCombatStats(character);
  const playerMaxHp = playerStats.hp;
  const playerMaxMp = playerStats.mp;
  const enemyStats = getEnemyStats(enemy);
  const enemyMaxHp = enemyStats.hp;

  const combat = {
    userId,
    characterName: character.name,
    characterLevel: playerStats.level,
    characterSlug: character.slug || character.name,
    enemy: { ...enemy },
    playerHp: playerMaxHp,
    playerMaxHp,
    playerMp: playerMaxMp,
    playerMaxMp,
    playerStats,
    enemyHp: enemyMaxHp,
    enemyMaxHp,
    enemyStats,
    turn: 'player',
    turnCount: 0,
    defending: false,
    startedAt: Date.now(),
  };

  activeCombats.set(userId, combat);
  return { combat, message: formatCombatStatus(combat) };
}

async function processAttack(userId) {
  const combat = activeCombats.get(userId);
  if (!combat) return { error: 'No estás en combate. Usa /atacar <enemigo> para iniciar uno.' };
  if (combat.turn !== 'player') return { error: 'No es tu turno!' };

  combat.defending = false;
  combat.turnCount++;

  const hitChance = calculateHitChance(combat.playerStats, combat.enemyStats);
  const hit = Math.random() < hitChance;

  let playerDamage = 0;
  let crit = false;

  if (hit) {
    crit = Math.random() < 0.1;
    playerDamage = calculateDamage(combat.playerStats, combat.enemyStats, { crit, physical: true });
    combat.enemyHp = Math.max(0, combat.enemyHp - playerDamage);
  }

  const attackLines = [
    LINE,
    `⚔️ *ATACAS*`,
    LINE,
    '',
  ];

  if (!hit) {
    attackLines.push(`Fallaste el ataque contra *${combat.enemy.name}*!`);
  } else {
    const critText = crit ? ' 💥 *CRÍTICO*!' : '';
    attackLines.push(`Golpeas a *${combat.enemy.name}* causando *${playerDamage}* de daño${critText}!`);
  }

  if (combat.enemyHp <= 0) {
    const reward = generateReward(combat.enemy, combat.characterLevel);

    try {
      await addMoney(userId, reward.stelas, {
        userName: combat.characterName,
        registration: { source: 'combat', scope: 'self', createdBy: userId },
      });
    } catch {}

    attackLines.push('', `🎉 Has derrotado a *${combat.enemy.name}*!`);
    attackLines.push(`💰 +${reward.stelas} ✦ estelas`);
    attackLines.push(`⭐ +${reward.xp} XP`);

    if (combat.characterSlug) {
      try {
        await updateCharacterStats({
          creatorId: userId,
          characterName: combat.characterSlug,
          patch: { exp: reward.xp },
        });
      } catch {}
    }

    attackLines.push('', LINE);
    activeCombats.delete(userId);
    return { message: attackLines.join('\n'), ended: true, won: true, reward };
  }

  combat.turn = 'enemy';
  const enemyResult = await processEnemyTurn(combat);

  attackLines.push('', enemyResult.message);

  if (combat.playerHp <= 0) {
    attackLines.push('', `💀 Has sido derrotado por *${combat.enemy.name}*!`, '', LINE);
    activeCombats.delete(userId);
    return { message: attackLines.join('\n'), ended: true, won: false };
  }

  combat.turn = 'player';
  attackLines.push('', formatCombatStatus(combat));
  return { message: attackLines.join('\n'), ended: false };
}

async function processEnemyTurn(combat) {
  const hitChance = calculateHitChance(combat.enemyStats, combat.playerStats);
  const hit = Math.random() < hitChance;

  let damage = 0;
  let crit = false;

  if (hit) {
    crit = Math.random() < 0.08;
    damage = calculateDamage(combat.enemyStats, combat.playerStats, { crit, physical: true });

    if (combat.defending) {
      damage = Math.max(1, Math.round(damage * 0.4));
    }

    combat.playerHp = Math.max(0, combat.playerHp - damage);
  }

  const lines = [];

  lines.push(`🗣️ *${combat.enemy.name}* contraataca!`);

  if (!hit) {
    lines.push(`*${combat.enemy.name}* falló su ataque!`);
  } else {
    const critText = crit ? ' 💥 *CRÍTICO*!' : '';
    const defText = combat.defending ? ' (bloqueaste la mayoría)' : '';
    lines.push(`Recibes *${damage}* de daño${critText}${defText}`);
  }

  return { message: lines.join('\n'), damage };
}

async function processDefend(userId) {
  const combat = activeCombats.get(userId);
  if (!combat) return { error: 'No estás en combate.' };
  if (combat.turn !== 'player') return { error: 'No es tu turno!' };

  combat.defending = true;
  combat.turnCount++;
  combat.turn = 'enemy';

  const enemyResult = await processEnemyTurn(combat);

  let damageTaken = 0;
  if (combat.playerHp < (combat.playerMaxHp - (enemyResult.damage || 0))) {
    damageTaken = enemyResult.damage || 0;
  }

  if (combat.playerHp <= 0) {
    const msg = [
      formatDefendMessage(combat.enemy.name, damageTaken),
      '',
      `💀 Has sido derrotado por *${combat.enemy.name}*!`,
      '',
      LINE,
    ].join('\n');
    activeCombats.delete(userId);
    return { message: msg, ended: true, won: false };
  }

  combat.turn = 'player';
  const msg = [
    formatDefendMessage(combat.enemy.name, damageTaken),
    '',
    formatCombatStatus(combat),
  ].join('\n');

  return { message: msg, ended: false };
}

async function processFlee(userId) {
  const combat = activeCombats.get(userId);
  if (!combat) return { error: 'No estás en combate.' };

  const chance = validateFlee(combat.playerStats.agilidad || 5, combat.enemy.level);
  const success = Math.random() < chance;

  if (success) {
    activeCombats.delete(userId);
    return { message: formatFleeResult(true, combat.enemy.name), fled: true };
  }

  combat.defending = false;
  combat.turnCount++;
  combat.turn = 'enemy';

  const enemyResult = await processEnemyTurn(combat);

  const lines = [
    formatFleeResult(false, combat.enemy.name),
    '',
    enemyResult.message,
  ];

  if (combat.playerHp <= 0) {
    lines.push('', `💀 Has sido derrotado por *${combat.enemy.name}*!`, '', LINE);
    activeCombats.delete(userId);
    return { message: lines.join('\n'), ended: true, won: false };
  }

  combat.turn = 'player';
  lines.push('', formatCombatStatus(combat));
  return { message: lines.join('\n'), fled: false };
}

function endCombat(userId) {
  activeCombats.delete(userId);
}

module.exports = {
  getCombatState,
  startCombat,
  processAttack,
  processDefend,
  processFlee,
  endCombat,
  formatCombatStatus,
  formatCombatEnd,
};
