const stateManager = require("../../services/rpg/combatStateManager");
const turnManager = require("../../services/rpg/combatTurnManager");
const combatEngine = require("../../services/rpg/combatEngine");
const combatNarrator = require("../../services/rpg/combatNarrator");
const combatLogger = require("../../services/rpg/combatLogger");
const invService = require("../../services/rpg/inventoryService");
const refereeService = require("../../services/rpg/combatRefereeService");
const enemiesLib = require("../../services/rpg/enemies");
const { addMoney } = require("../../services/economyService");
const { updateCharacterStats } = require("../../services/characterService");
const itemsData = require("../../services/rpg/items");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "rol",
  aliases: ["rp", "r", "actuar", "hago", "rolear"],
  description: "Realiza una acción en combate mediante rol. Usa: /rol <texto descriptivo>",
  category: "rpg",

  async execute(ctx) {
    const groupId = ctx.from;
    const raw = (ctx.args || []).join(" ").trim();

    if (!raw) {
      return ctx.reply("Describe tu acción. Ej: `/rol ataco al goblin en la cabeza con mi espada` o `/rol me cubro detrás del escudo`");
    }

    try {
      const room = stateManager.getRoomByGroup(groupId);
      if (!room) {
        return ctx.reply(formatError("No hay combate activo aquí.", "Usa /atacar <enemigo> para iniciar uno."));
      }

      if (room.status !== 'active') {
        return ctx.reply("Este combate ya terminó. Usa /atacar para iniciar uno nuevo.");
      }

      const participant = turnManager.getParticipantByJid(room, ctx.sender);
      if (!participant) {
        return ctx.reply("No formas parte de este combate.");
      }

      const validation = turnManager.validateTurn(room, ctx.sender);
      if (!validation.valid) {
        if (validation.reason === 'wrong_turn') {
          return ctx.reply(`⛔ No es tu turno.`);
        }
        if (validation.reason === 'stunned') {
          turnManager.advanceTurn(room);
          await stateManager.updateRoom(room.id, {});
          return ctx.reply(validation.message);
        }
        return ctx.reply(validation.message);
      }

      const inventory = await invService.getInventory(ctx.sender);
      const result = await refereeService.processRoleplay(raw, room, participant, inventory);

      if (result.error) {
        return ctx.reply(`❌ ${result.error}`);
      }

      if (result.cartaBlanca) {
        await stateManager.updateRoom(room.id, {});
        const freeActionMsg = result.cartaBlancaTarget
          ? await handleFreeAction(room, result.cartaBlancaTarget)
          : '';
        turnManager.advanceTurn(room);
        const nextTag = getNextTurnTag(room);
        return ctx.reply(`${result.mechanical}\n\n${result.narrative}${freeActionMsg}${nextTag}`);
      }

      if (!result.success && result.narrative) {
        await stateManager.updateRoom(room.id, {});
        return ctx.reply(result.narrative);
      }

      if (result.actionResult) {
        await combatLogger.logAction(room, combatLogger.mapActionResultToLogEntry(room, result.actionResult, result.narrative));

        if (result.actionResult.result && result.actionResult.result.ko) {
          const victoria = turnManager.checkVictoryConditions(room);
          if (victoria.finished) {
            return await handleVictory(room, ctx, result, victoria);
          }
        }

        await stateManager.updateRoom(room.id, {});
        const messages = buildMessages(room, result);
        return ctx.reply(messages.join('\n'));
      }

      await stateManager.updateRoom(room.id, {});
      return ctx.reply(`${result.mechanical || ''}\n\n${result.narrative || ''}`);

    } catch (error) {
      console.error('rol error:', error);
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};

function buildMessages(room, result) {
  const lines = [];
  if (result.mechanical) lines.push(result.mechanical);
  if (result.narrative) lines.push('', result.narrative);

  const alive = turnManager.advanceTurn(room);
  if (!alive) {
    room.status = 'finished';
    lines.push('', '🏁 El combate ha terminado.');
    return lines;
  }

  const enemyMessages = [];
  while (true) {
    const current = turnManager.getCurrentParticipant(room);
    if (!current) break;

    if (current.stunned) {
      current.stunned = false;
      enemyMessages.push(`⏭️ @${current.name} está aturdido y pierde el turno.`);
      const stillAlive = turnManager.advanceTurn(room);
      if (!stillAlive) { room.status = 'finished'; lines.push('', '🏁 El combate ha terminado.'); return lines; }
      continue;
    }

    if (current.team !== 'enemies') break;
    if (current.ko) { turnManager.advanceTurn(room); continue; }

    const enemyResult = processEnemyTurn(room, current);
    if (!enemyResult) break;

    enemyMessages.push(enemyResult.mechanical, '', enemyResult.narrative);

    if (enemyResult.ko) {
      const victoria = turnManager.checkVictoryConditions(room);
      if (victoria.finished) {
        lines.push('', ...enemyMessages, '', victoria.message);
        return lines;
      }
    }

    const stillAlive = turnManager.advanceTurn(room);
    if (!stillAlive) { room.status = 'finished'; lines.push('', ...enemyMessages, '', '🏁 El combate ha terminado.'); return lines; }
  }

  if (enemyMessages.length > 0) {
    lines.push('', ...enemyMessages);
  }

  const next = turnManager.getCurrentParticipant(room);
  if (next) {
    lines.push('', `► @${next.name} — Es tu turno!`);
  }

  return lines;
}

function processEnemyTurn(room, enemy) {
  const actionResult = combatEngine.autoResolveEnemyTurn(room);
  if (!actionResult) return null;

  const narrative = combatNarrator.generateTemplateNarrative(actionResult);
  const mechanical = combatEngine.formatActionResult(actionResult);

  combatLogger.logAction(room, combatLogger.mapActionResultToLogEntry(room, actionResult, narrative));

  return {
    mechanical,
    narrative,
    ko: actionResult.result && actionResult.result.ko,
    actionResult,
  };
}

async function handleVictory(room, ctx, result, victoria) {
  room.status = 'finished';
  if (victoria.winner === 'players') {
    const reward = combatEngine.generateReward(room);
    const enemyIds = room.participants.filter(p => p.team === 'enemies').map(p => p.id.replace(/^enemy:/, '').replace(/_\d+$/, ''));
    const loot = enemiesLib.generateLootForEnemies(enemyIds);
    for (const p of turnManager.getAliveParticipants(room, 'players')) {
      try { await addMoney(p.id, reward.stelas, { userName: p.name, registration: { source: 'combat', scope: 'self', createdBy: p.id } }); } catch {}
      try { await updateCharacterStats({ creatorId: p.id, characterName: p.name, patch: { exp: reward.xp } }); } catch {}
      for (const drop of loot) { try { await invService.addItem(p.id, drop.itemId, drop.quantity); } catch {} }
    }
    const lootMsg = loot.length > 0 ? `\n\n🎒 Botín: ${loot.map(l => `${l.quantity}x ${itemsData.getItem(l.itemId)?.name || l.itemId}`).join(', ')}` : '';
    await combatLogger.logCombatEnd(room.id, {
      winner: 'players', rounds: room.round, totalTurns: room.turnCount,
      participants: room.participants.map(p => p.name), reward, duration: Date.now() - room.createdAt,
    });
    await stateManager.updateRoom(room.id, {});
    return ctx.reply(`${result.mechanical || ''}\n\n${result.narrative}\n\n${victoria.message}${lootMsg}`);
  }
  await combatLogger.logCombatEnd(room.id, {
    winner: victoria.winner || 'enemies', rounds: room.round, totalTurns: room.turnCount,
    participants: room.participants.map(p => p.name), duration: Date.now() - room.createdAt,
  });
  await stateManager.updateRoom(room.id, {});
  return ctx.reply(`${result.mechanical || ''}\n\n${result.narrative}\n\n${victoria.message}`);
}

function getNextTurnTag(room) {
  const next = turnManager.getCurrentParticipant(room);
  if (!next) return '';
  if (next.id.startsWith('enemy:')) return '';
  return `\n► @${next.name} — Es tu turno!`;
}

async function handleFreeAction(room, targetJid) {
  try {
    const result = await refereeService.autoResolveStunnedOpponent(room, targetJid);
    if (!result) return '';
    if (result.type === 'player_action_required') {
      return `\n\n🎯 ${result.message}`;
    }
    if (result.action) {
      const narrative = await combatNarrator.narrate(result);
      const mechanical = combatEngine.formatActionResult(result);
      return `\n\n*Acción libre del defensor:*\n${mechanical}\n${narrative.narrative}`;
    }
  } catch {}
  return '';
}
