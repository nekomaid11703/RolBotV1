// @ts-nocheck
/**
 * habilidad.js — Comando de uso de habilidad activa en combate D20
 *
 * Aliases: .h, /skill, /spell
 * Lanza una habilidad del slot de habilidades del personaje.
 * Resuelve con D20, escala con dominio_magico.
 */

const stateManager = require("../../../services/rpg/combatStateManager");
const turnManager = require("../../../services/rpg/combatTurnManager");
const combatEngine = require("../../../services/rpg/combatEngine");
const abilityLib = require("../../../services/rpg/abilities");
const { formatError } = require("../../../utils/messageFormatUtils");
const { logError } = require("../../../services/loggerService");
const { RPG_CONFIG } = require("../../../config/rpg.config");

module.exports = {
  name: "habilidad",
  aliases: ["skill", "spell", "h"],
  description: "Usa una habilidad activa en combate. Usa: .h <nombre_o_id>",
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
      const raw = ctx.args.join(" ").trim().toLowerCase();

      // Sin argumento: listar habilidades disponibles
      if (!raw) {
        return showAbilities(ctx, participant);
      }

      // Buscar la habilidad por nombre o ID
      let ability = null;
      try {
        ability = abilityLib.getAbility(raw) || abilityLib.findAbilityByName(raw);
      } catch {
        ability = null;
      }

      if (!ability) {
        return ctx.reply(`❌ Habilidad "${raw}" no encontrada. Usa \`.h\` para ver tus habilidades.`);
      }

      // Verificar que el participante tiene la habilidad
      const hasAbility = (participant.habilidades || []).some((h) => (typeof h === "string" ? h : h.id) === ability.id);
      if (!hasAbility) {
        return ctx.reply(`❌ No tienes la habilidad "${ability.name}".`);
      }

      // Seleccionar objetivo
      let target = null;
      if (ability.type === "damage") {
        const enemies = turnManager
          .getAliveParticipants(room, room.startedVia === "pvp" ? null : "enemies")
          .filter((e) => e.id !== ctx.sender);
        if (enemies.length === 0) {
          return ctx.reply("❌ No hay objetivos vivos.");
        }
        target = enemies[0];
      } else if (ability.type === "heal") {
        target = participant; // Self-heal por defecto
      }

      // Resolver habilidad con D20
      const result = combatEngine.resolveAbility(participant, target, ability);

      // Reacción WhatsApp
      const reaction = result.isCrit
        ? RPG_CONFIG.reactions.critSuccess
        : result.isPifia
          ? RPG_CONFIG.reactions.critFail
          : RPG_CONFIG.reactions.use;
      await ctx.react(reaction);

      // Reset skips
      participant.consecutiveSkips = 0;

      // Verificar victoria
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
      logError({ source: "habilidad", error: error instanceof Error ? error : new Error(String(error)) });
      return ctx.reply(`❌ ${error.message}`);
    }
  },
};

function showAbilities(ctx, participant) {
  const abilities = participant.habilidades || [];
  if (abilities.length === 0) {
    return ctx.reply("📚 No tienes habilidades activas disponibles.");
  }

  const lines = ["✦ ━━━ *TUS HABILIDADES* ━━━ ✦", ""];
  for (const h of abilities) {
    const id = typeof h === "string" ? h : h.id;
    const name = typeof h === "string" ? h : h.name || h.id;
    lines.push(`• *${name}* — \`.h ${id}\``);
  }
  lines.push("", "Usa: `.h <nombre>` para lanzar una habilidad.");

  return ctx.reply(lines.join("\n"));
}
