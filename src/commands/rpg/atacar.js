const { getActiveCharacter } = require("../../services/characterService");
const stateManager = require("../../services/rpg/combatStateManager");
const turnManager = require("../../services/rpg/combatTurnManager");
const combatEngine = require("../../services/rpg/combatEngine");
const combatNarrator = require("../../services/rpg/combatNarrator");
const { getAllEnemies } = require("../../services/rpg/enemies");
const { formatError } = require("../../utils/messageFormatUtils");

const VALID_ZONES = ['cabeza','cuello','pecho','abdomen','brazo_izq','brazo_der','mano_izq','mano_der','pierna_izq','pierna_der','pie_izq','pie_der'];

function parseZone(args) {
  const zone = args[args.length - 1]?.toLowerCase().replace(/[áéíóú]/g, (c) => ({'á':'a','é':'e','í':'i','ó':'o','ú':'u'})[c]);
  if (zone && VALID_ZONES.includes(zone)) {
    args.pop();
    return zone;
  }
  if (zone === 'brazo') return 'brazo_der';
  if (zone === 'pierna') return 'pierna_der';
  if (zone === 'mano') return 'mano_der';
  if (zone === 'pie') return 'pie_der';
  return 'pecho';
}

module.exports = {
  name: "atacar",
  aliases: ["attack", "pelear", "a"],
  description: "Ataca en combate o inicia uno nuevo. Usa: /atacar, /atacar goblin, /atacar @usuario brazo",
  category: "rpg",

  async execute(ctx) {
    const groupId = ctx.from;
    const args = ctx.args.slice();
    const raw = ctx.args.join(" ").trim().toLowerCase();

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
          room = stateManager.createRoom(groupId, [
            stateManager.makeBaseParticipant(ctx.sender, character.name, 'players', character.stats || {}),
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

        const targetEnemy = raw.replace(/[0-9]+$/, '').trim();
        const quantityMatch = raw.match(/(\d+)\s*$/);
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
        const enemyData = getAllEnemies().find(e => e.id === targetEnemy);
        if (!enemyData) {
          return ctx.reply(formatError("Enemigo no encontrado.", `Usa /atacar para ver la lista.`));
        }

        room = await stateManager.createCombatRoom(groupId, ctx.sender, character, [enemyData.id], Math.min(quantity, 8));
        await ctx.react("⚔️");
        return ctx.reply(turnManager.formatStatus(room));
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

      const zone = parseZone(args);

      const mentionTarget = ctx.mentions ? ctx.mentions[0] : null;
      let targetJid = null;

      if (mentionTarget) {
        targetJid = mentionTarget;
      } else {
        const aliveEnemies = turnManager.getAliveParticipants(room, 'enemies');
        if (aliveEnemies.length === 0) {
          targetJid = turnManager.getNextActiveJid(room);
        } else {
          const targetName = args[0]?.toLowerCase();
          const match = aliveEnemies.find(e => e.name.toLowerCase().startsWith(targetName) || e.id.includes(targetName || ''));
          targetJid = match ? match.id : aliveEnemies[0].id;
        }
      }

      if (!targetJid) return ctx.reply("No hay objetivo disponible para atacar.");

      const actionResult = await combatEngine.processAttack(room, ctx.sender, targetJid, zone);
      if (actionResult.error) return ctx.reply(actionResult.error);

      const narrative = await combatNarrator.narrate(actionResult);
      const formatMsg = combatEngine.formatActionResult(actionResult);

      if (actionResult.result.ko) {
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
        const victorias = turnManager.checkVictoryConditions(room);
        await ctx.reply(`${formatMsg}\n\n${narrative.narrative}\n\n${victorias.message}`);
        return;
      }

      while (turnManager.getCurrentParticipant(room) && turnManager.getCurrentParticipant(room).team === 'enemies') {
        const enemyAction = await combatEngine.autoResolveEnemyTurn(room);
        if (!enemyAction) break;
        const enemyNarrative = await combatNarrator.narrate(enemyAction);
        const enemyMsg = combatEngine.formatActionResult(enemyAction);
        await ctx.reply(`${enemyMsg}\n\n${enemyNarrative.narrative}`);

        if (enemyAction.result.ko) {
          const next = turnManager.getNextActiveParticipant(room);
          const nextTag = next ? `► @${next.name} — Es tu turno!` : '🏁 Combate terminado.';
          await stateManager.updateRoom(room.id, {});
          await ctx.reply(nextTag);
          return;
        }

        const stillAlive = turnManager.advanceTurn(room);
        if (!stillAlive) {
          room.status = 'finished';
          await stateManager.updateRoom(room.id, {});
          const victorias = turnManager.checkVictoryConditions(room);
          await ctx.reply(victorias.message);
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
