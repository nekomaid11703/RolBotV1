const { getActiveCharacter } = require("../../services/characterService");
const stateManager = require("../../services/rpg/combatStateManager");
const turnManager = require("../../services/rpg/combatTurnManager");
const combatEngine = require("../../services/rpg/combatEngine");
const combatNarrator = require("../../services/rpg/combatNarrator");
const combatParser = require("../../services/rpg/combatParser");
const combatValidator = require("../../services/rpg/combatValidator");
const combatLogger = require("../../services/rpg/combatLogger");
const { getAllEnemies } = require("../../services/rpg/enemies");
const { addMoney } = require("../../services/economyService");
const { updateCharacterStats } = require("../../services/characterService");
const invService = require("../../services/rpg/inventoryService");
const enemiesLib = require("../../services/rpg/enemies");
const { formatError } = require("../../utils/messageFormatUtils");

module.exports = {
  name: "atacar",
  aliases: ["attack", "pelear", "a"],
  description: "Ataca en combate o inicia uno nuevo. Usa: /atacar, /atacar goblin, /atacar @usuario brazo",
  category: "rpg",

  async execute(ctx) {
    const groupId = ctx.from;
    const raw = ctx.args.join(" ").trim();

    try {
      let room = stateManager.getRoomByGroup(groupId);

      if (!room) {
        const character = await getActiveCharacter({ creatorId: ctx.sender });
        if (!character) {
          return ctx.reply(formatError("No tienes personaje activo.", "Usa /crear_pj para crear uno o /switch_pj para activarlo."));
        }

        const mentions = ctx.mentions || [];
        if (mentions.length > 0) {
          const targetJid = mentions[0];
          const targetName = raw.replace(/@\S+/g, '').trim() || targetJid.split('@')[0];
          const inv = await invService.getInventory(ctx.sender);
          room = stateManager.createRoom(groupId, [
            stateManager.makeBaseParticipant(ctx.sender, character.name, 'players', character.stats || {}, inv.equipped || {}, await invService.calculateEquipmentBonuses(ctx.sender)),
            stateManager.makeBaseParticipant(targetJid, targetName, 'players'),
          ], { startedVia: 'pvp' });
          await stateManager.updateRoom(room.id, {});
          await ctx.reply(`⚔️ Combate PvP iniciado contra @${targetName}!\n\n${turnManager.formatStatus(room)}`);
          return;
        }

        if (!raw) {
          const available = getAllEnemies().map(e => `• *${e.name}* (nvl ${e.level}) — ${e.description}`).join('\n');
          return ctx.reply([
            "✦ ━━━━━━━━━━━━━━ ✦",
            "⚔️ *SELECCIONA UN ENEMIGO*",
            "✦ ━━━━━━━━━━━━━━ ✦",
            "",
            "Usa: `/atacar <enemigo>` o `/atacar @usuario` para PvP",
            "",
            "Enemigos disponibles:",
            available,
            "",
            "✦ ━━━━━━━━━━━━━━ ✦",
          ].join('\n'));
        }

        const targetEnemy = raw.toLowerCase().replace(/[0-9]+$/, '').trim();
        const quantityMatch = raw.match(/(\d+)\s*$/);
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
        const enemyData = getAllEnemies().find(e => e.id === targetEnemy);
        if (!enemyData) {
          return ctx.reply(formatError("Enemigo no encontrado.", `Usa /atacar para ver la lista.`));
        }

        const inv = await invService.getInventory(ctx.sender);
        room = await stateManager.createCombatRoom(groupId, ctx.sender, character, [enemyData.id], Math.min(quantity, 8), inv.equipped || {}, await invService.calculateEquipmentBonuses(ctx.sender));
        await ctx.react("⚔️");
        return ctx.reply(turnManager.formatStatus(room));
      }

      const participant = turnManager.getParticipantByJid(room, ctx.sender);
      if (!participant) {
        return ctx.reply("No formas parte de este combate. Usa /atacar sin argumentos para unirte.");
      }

      const validation = turnManager.validateTurn(room, ctx.sender);
      if (!validation.valid && validation.reason !== 'timeout') {
        if (validation.reason === 'wrong_turn') {
          const next = turnManager.getNextActiveParticipant(room);
          return ctx.reply(`⛔ No es tu turno. El turno es de @${next ? next.name : '...'}`);
        }
        return ctx.reply(validation.message);
      }

      if (validation.timedOut) {
        const skipResult = await turnManager.applySkip(room, 'timeout');
        if (skipResult) {
          await stateManager.updateRoom(room.id, {});
          if (skipResult.participant.ko) {
            await ctx.reply(skipResult.message);
            return;
          }
          await ctx.reply(skipResult.message);
        }
      }

      const parsed = combatParser.parse(raw, { mentions: ctx.mentions, room, sender: ctx.sender });
      const vResult = combatValidator.validate(raw, { parsed, room, participant });

      if (vResult.sanction) {
        participant.fatigue = Math.min(10, (participant.fatigue || 0) + 5);
        turnManager.advanceTurn(room);
        await stateManager.updateRoom(room.id, {});
        await ctx.reply(vResult.messages.join('\n'));
        return;
      }

      if (vResult.messages.length > 0) {
        await ctx.reply(vResult.messages.join('\n'));
      }

      if (!vResult.valid) {
        return;
      }

      const zone = parsed.zone || 'pecho';
      let targetJid = parsed.target;

      if (!targetJid) {
        const mentionTarget = ctx.mentions ? ctx.mentions[0] : null;
        if (mentionTarget) {
          targetJid = mentionTarget;
        } else {
          const aliveEnemies = turnManager.getAliveParticipants(room, 'enemies');
          if (aliveEnemies.length === 0) {
            targetJid = turnManager.getNextActiveJid(room);
          } else {
            const targetName = ctx.args[0]?.toLowerCase();
            const match = aliveEnemies.find(e =>
              e.name.toLowerCase().startsWith(targetName) || e.id.includes(targetName || '')
            );
            targetJid = match ? match.id : aliveEnemies[0].id;
          }
        }
      }

      if (!targetJid) return ctx.reply("No hay objetivo disponible para atacar.");

      const actionResult = await combatEngine.processAttack(room, ctx.sender, targetJid, zone);
      if (actionResult.error) return ctx.reply(actionResult.error);

      const narrative = await combatNarrator.narrate(actionResult);
      const formatMsg = combatEngine.formatActionResult(actionResult);

      await combatLogger.logAction(room, combatLogger.mapActionResultToLogEntry(room, actionResult, narrative.narrative));

      if (actionResult.result.ko) {
        const victoria = turnManager.checkVictoryConditions(room);
        if (victoria.finished && victoria.winner === 'players') {
          const reward = combatEngine.generateReward(room);
          const enemyIds = room.participants.filter(p => p.team === 'enemies').map(p => p.id.replace(/^enemy:/, '').replace(/_\d+$/, ''));
          const loot = enemiesLib.generateLootForEnemies(enemyIds);
          for (const p of turnManager.getAliveParticipants(room, 'players')) {
            try {
              await addMoney(p.id, reward.stelas, {
                userName: p.name,
                registration: { source: 'combat', scope: 'self', createdBy: p.id },
              });
            } catch {}
            try {
              await updateCharacterStats({
                creatorId: p.id,
                characterName: p.name,
                patch: { exp: reward.xp },
              });
            } catch {}
            for (const drop of loot) {
              try { await invService.addItem(p.id, drop.itemId, drop.quantity); } catch {}
            }
          }
          const lootMsg = loot.length > 0 ? `\n\n🎒 Botín: ${loot.map(l => `${l.quantity}x ${itemsData.getItem(l.itemId)?.name || l.itemId}`).join(', ')}` : '';
          await combatLogger.logCombatEnd(room.id, {
            winner: 'players', rounds: room.round, totalTurns: room.turnCount,
            participants: room.participants.map(p => p.name),
            reward, duration: Date.now() - room.createdAt,
          });
          await stateManager.finishRoom(room.id);
          await ctx.reply(`${formatMsg}\n\n${narrative.narrative}\n\n${victoria.message}${lootMsg}`);
          return;
        }

        const next = turnManager.getNextActiveParticipant(room);
        const nextTag = next ? `\n► @${next.name} — Es tu turno!` : '\n🏁 Combate terminado.';
        await stateManager.updateRoom(room.id, {});
        await ctx.reply(`${formatMsg}\n\n${narrative.narrative}${nextTag}`);
        return;
      }

      const alive = turnManager.advanceTurn(room);
      if (!alive) {
        room.status = 'finished';
        await stateManager.updateRoom(room.id, {});
        const victoria = turnManager.checkVictoryConditions(room);
        await combatLogger.logCombatEnd(room.id, {
          winner: victoria.winner || 'none', rounds: room.round, totalTurns: room.turnCount,
          participants: room.participants.map(p => p.name), duration: Date.now() - room.createdAt,
        });
        await ctx.reply(`${formatMsg}\n\n${narrative.narrative}\n\n${victoria.message}`);
        return;
      }

      while (turnManager.getCurrentParticipant(room) && turnManager.getCurrentParticipant(room).team === 'enemies') {
        const enemyAction = await combatEngine.autoResolveEnemyTurn(room);
        if (!enemyAction) break;

        const enemyNarrative = await combatNarrator.narrate(enemyAction);
        const enemyMsg = combatEngine.formatActionResult(enemyAction);
        await combatLogger.logAction(room, combatLogger.mapActionResultToLogEntry(room, enemyAction, enemyNarrative.narrative));
        await ctx.reply(`${enemyMsg}\n\n${enemyNarrative.narrative}`);

        if (enemyAction.result.ko) {
          const victoria = turnManager.checkVictoryConditions(room);
          if (victoria.finished) {
            room.status = 'finished';
            if (victoria.winner === 'players') {
              const reward = combatEngine.generateReward(room);
              const enemyIds = room.participants.filter(p => p.team === 'enemies').map(p => p.id.replace(/^enemy:/, '').replace(/_\d+$/, ''));
              const loot = enemiesLib.generateLootForEnemies(enemyIds);
              for (const p of turnManager.getAliveParticipants(room, 'players')) {
                try {
                  await addMoney(p.id, reward.stelas, {
                    userName: p.name,
                    registration: { source: 'combat', scope: 'self', createdBy: p.id },
                  });
                } catch {}
                try {
                  await updateCharacterStats({
                    creatorId: p.id, characterName: p.name, patch: { exp: reward.xp },
                  });
                } catch {}
                for (const drop of loot) {
                  try { await invService.addItem(p.id, drop.itemId, drop.quantity); } catch {}
                }
              }
                const lootMsg = loot.length > 0 ? `\n\n🎒 Botín: ${loot.map(l => `${l.quantity}x ${itemsData.getItem(l.itemId)?.name || l.itemId}`).join(', ')}` : '';
              await combatLogger.logCombatEnd(room.id, {
                winner: 'players', rounds: room.round, totalTurns: room.turnCount,
                participants: room.participants.map(p => p.name), reward, duration: Date.now() - room.createdAt,
              });
            } else {
              var lootMsg = '';
            }
            await stateManager.updateRoom(room.id, {});
            await ctx.reply(victoria.message + (typeof lootMsg !== 'undefined' ? lootMsg : ''));
            return;
          }
          const next = turnManager.getNextActiveParticipant(room);
          await stateManager.updateRoom(room.id, {});
          await ctx.reply(next ? `► @${next.name} — Es tu turno!` : '🏁 Combate terminado.');
          return;
        }

        const stillAlive = turnManager.advanceTurn(room);
        if (!stillAlive) {
          room.status = 'finished';
          await stateManager.updateRoom(room.id, {});
          const victoria = turnManager.checkVictoryConditions(room);
          await combatLogger.logCombatEnd(room.id, {
            winner: victoria.winner || 'none', rounds: room.round, totalTurns: room.turnCount,
            participants: room.participants.map(p => p.name), duration: Date.now() - room.createdAt,
          });
          await ctx.reply(victoria.message);
          return;
        }
      }

      await stateManager.updateRoom(room.id, {});
      const nextTag = turnManager.formatTurnTag(room);
      await ctx.reply(`${formatMsg}\n\n${narrative.narrative}\n\n► @${nextTag} — Es tu turno!`);

    } catch (error) {
      console.error('atacar error:', error);
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
