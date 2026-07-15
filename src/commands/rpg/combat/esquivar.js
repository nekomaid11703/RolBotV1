// @ts-nocheck
/**
 * esquivar.js — Comando de esquiva táctica D20
 *
 * Aliases: .e, /dodge, /esquiva
 * Resuelve una acción defensiva de esquiva mediante D20.
 * Establece un valor de esquiva que se compara contra ataques entrantes.
 */

const stateManager = require("../../../services/rpg/combatStateManager");
const turnManager = require("../../../services/rpg/combatTurnManager");
const combatEngine = require("../../../services/rpg/combatEngine");
const { formatError } = require("../../../utils/messageFormatUtils");
const { logError } = require("../../../services/loggerService");
const { RPG_CONFIG } = require("../../../config/rpg.config");

module.exports = {
  name: "esquivar",
  aliases: ["dodge", "esquiva", "e"],
  description: "Esquiva en combate. Usa: .e",
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

      // Resolver esquiva D20
      const result = combatEngine.resolveDodge(participant);

      // Reacción WhatsApp
      const reaction = result.isCrit
        ? RPG_CONFIG.reactions.critSuccess
        : result.isPifia
          ? RPG_CONFIG.reactions.critFail
          : RPG_CONFIG.reactions.dodge;
      await ctx.react(reaction);

      // Reset skips consecutivos
      participant.consecutiveSkips = 0;

      // Si hay contraataque crítico, aplicar daño al primer enemigo
      if (result.counterDamage > 0) {
        const enemies = turnManager
          .getAliveParticipants(room, room.startedVia === "pvp" ? null : "enemies")
          .filter((e) => e.id !== ctx.sender);
        if (enemies.length > 0) {
          const target = enemies[0];
          target.hp = Math.max(0, target.hp - result.counterDamage);
          if (target.hp <= 0) target.ko = true;
          result.details += ` → *${target.name}* recibe *${result.counterDamage}* de contraataque.`;
          if (target.ko) result.details += " 💀 K.O.!";
        }
      }

      // Verificar victoria (en caso de contraataque mortal)
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
      logError({ source: "esquivar", error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};
