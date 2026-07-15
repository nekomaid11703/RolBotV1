// @ts-nocheck
/**
 * bloquear.js — Comando de bloqueo táctico D20
 *
 * Aliases: .b, /block, /defender
 * Resuelve una acción de bloqueo mediante D20.
 * Reduce el daño recibido en el turno actual basado en resistencia_fisica.
 */

const stateManager = require("../../../services/rpg/combatStateManager");
const turnManager = require("../../../services/rpg/combatTurnManager");
const combatEngine = require("../../../services/rpg/combatEngine");
const { formatError } = require("../../../utils/messageFormatUtils");
const { logError } = require("../../../services/loggerService");
const { RPG_CONFIG } = require("../../../config/rpg.config");

module.exports = {
  name: "bloquear",
  aliases: ["block", "defender", "defensa", "b"],
  description: "Bloquea en combate. Usa: .b",
  category: "rpg",

  async execute(ctx) {
    try {
      const room = stateManager.getRoomByGroup(ctx.from);
      if (!room || room.status !== "active") {
        return ctx.reply(formatError("No hay combate activo aquí.", "Usa /atacar <enemigo> para iniciar uno."));
      }

      const validation = turnManager.validateTurn(room, ctx.sender);
      if (!validation.valid) {
        if (validation.autoSkip) {
          turnManager.advanceTurn(room);
          await stateManager.updateRoom(room.id, {});
        }
        return ctx.reply(validation.message);
      }

      const participant = validation.participant;

      // Resolver bloqueo D20
      const result = combatEngine.resolveBlock(participant);

      // Reacción WhatsApp
      const reaction = result.isCrit
        ? RPG_CONFIG.reactions.critSuccess
        : result.isPifia
          ? RPG_CONFIG.reactions.critFail
          : RPG_CONFIG.reactions.block;
      await ctx.react(reaction);

      // Reset skips consecutivos
      participant.consecutiveSkips = 0;

      // Si bloqueo crítico aturde al siguiente enemigo
      if (result.stunTarget) {
        const enemies = turnManager
          .getAliveParticipants(room, room.startedVia === "pvp" ? null : "enemies")
          .filter((e) => e.id !== ctx.sender && !e.stunned);
        if (enemies.length > 0) {
          enemies[0].stunned = true;
          result.details += ` *${enemies[0].name}* queda aturdido 1 turno.`;
        }
      }

      // Verificar victoria (en caso de pifia mortal sobre sí mismo)
      const victory = turnManager.checkVictoryConditions(room);
      if (victory.finished) {
        room.status = "finished";
        await stateManager.updateRoom(room.id, {});
        return ctx.reply(`${result.details}\n\n${victory.message}`, { mentions: [] });
      }

      // Avanzar turno
      turnManager.advanceTurn(room);

      // Resolver turnos NPC
      const enemyResults = turnManager.resolveConsecutiveEnemyTurns(room);

      // Respuesta agrupada
      const response = turnManager.buildTurnResponse(room, result.details, enemyResults);

      await stateManager.updateRoom(room.id, {});
      return ctx.reply(response.text, { mentions: response.mentions });
    } catch (error) {
      logError({ source: "bloquear", error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
