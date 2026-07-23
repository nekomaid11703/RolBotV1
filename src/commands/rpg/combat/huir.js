// @ts-nocheck
const { getActiveCharacter } = require("../../../services/characterService");
const {
  findSessionByCharacter,
  findSessionByUser,
  endSession,
  advanceTurn,
  setPendingReaction,
} = require("../../../services/rpg/combatState");
const { rollFlee, executeAttack, executeReaction } = require("../../../services/rpg/combatEngine");
const { formatFlee, formatActionMenu, formatReactionPrompt } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "huir",
  aliases: ["flee", "escapar", "run"],
  description: "Intenta escapar del combate activo.",
  category: "rpg",

  async execute(ctx) {
    try {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo.");
      }

      const session = findSessionByCharacter(activeChar.id);
      if (!session) {
        return ctx.reply("❌ Tu personaje no está en un combate activo.");
      }

      if (session.status === "waiting_reaction") {
        return ctx.reply(
          "❌ Hay un ataque en curso pendiente de respuesta. Primero debes resolverlo con `/esquivar` o `/bloquear`.",
        );
      }

      if (String(session.currentTurnCharId) !== String(activeChar.id)) {
        return ctx.reply(`❌ No es el turno de **${activeChar.name}**. No puedes huir en el turno del oponente.`);
      }

      const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
      const fleerSlot = isChallenger ? session.challenger : session.defender;
      const pursuerSlot = isChallenger ? session.defender : session.challenger;

      // En PvE (Dummy), la huida siempre tiene éxito y no da recompensa
      if (session.isPvE) {
        endSession(session.id, null);
        return ctx.reply(formatFlee(fleerSlot.character.name, true, 1.0));
      }

      // En PvP, se evalúa la huida según MSPD comparativo
      const fleeResult = rollFlee(fleerSlot.character.stats, fleerSlot.hp, pursuerSlot.character.stats, pursuerSlot.hp);

      if (fleeResult.success) {
        endSession(session.id, null);
        return ctx.reply(formatFlee(fleerSlot.character.name, true, fleeResult.chance));
      }

      // Si la huida falla, el jugador pierde el turno y sufre el ataque automático del perseguidor
      const lines = [];
      lines.push("");
      lines.push(`❌  *${fleerSlot.character.name}* intentó huir pero fue alcanzado.`);
      lines.push(`📊  Probabilidad de huida: ${Math.round(fleeResult.chance * 100)}% — ¡Falló!`);

      const attackInfo = executeAttack(pursuerSlot.character, fleerSlot.character, fleerSlot.hp);

      if (attackInfo.canReact) {
        const { evaluateDodgeFeasibility } = require("../../../services/rpg/combatEngine");
        const canDodge = evaluateDodgeFeasibility(
          fleerSlot.character.stats,
          fleerSlot.hp,
          pursuerSlot.character.stats,
          pursuerSlot.character.hp_actual || 100,
        );

        setPendingReaction(session.id, {
          attackerChar: pursuerSlot.character,
          defenderChar: fleerSlot.character,
          attackerUserId: pursuerSlot.userId,
          defenderUserId: fleerSlot.userId,
          baseDamage: attackInfo.baseDamage,
          defenderHp: fleerSlot.hp,
          isChallengerAttacking: !isChallenger,
          canDodgeSuccessfully: canDodge,
        });

        lines.push("");
        lines.push(`⚔️  *${pursuerSlot.character.name}* aprovecha y te ataca (Daño base: ${attackInfo.baseDamage})`);
        lines.push("");
        lines.push("✦ ━━━━━━━━━━━━━━ ✦");
        lines.push(
          formatReactionPrompt(pursuerSlot.character.name, fleerSlot.character.name, attackInfo.baseDamage, canDodge),
        );

        return ctx.reply(box("🏃 HUIDA FALLIDA", lines));
      } else {
        const reactionResult = executeReaction(
          "none",
          attackInfo.baseDamage,
          fleerSlot.character,
          fleerSlot.hp,
          pursuerSlot.character,
        );

        const newFleerHp = reactionResult.defenderHpAfter;
        const newAttackerHp = pursuerSlot.hp;

        advanceTurn(session.id, isChallenger ? newFleerHp : newAttackerHp, isChallenger ? newAttackerHp : newFleerHp);

        lines.push("");
        lines.push(`⚔️  *${pursuerSlot.character.name}* te golpea al intentar escapar.`);
        lines.push(`💥  Daño recibido: ${reactionResult.finalDamage}`);
        lines.push(`❤️  HP de *${fleerSlot.character.name}*: ${reactionResult.defenderHpBefore} → ${newFleerHp}`);

        if (reactionResult.ko) {
          endSession(session.id, pursuerSlot.character.id);
          lines.push("");
          lines.push(`💀  ¡*${fleerSlot.character.name}* ha caído intentando huir!`);
          return ctx.reply(box("🏃 HUIDA FALLIDA", lines));
        }

        lines.push("");
        lines.push("✦ ━━━━━━━━━━━━━━ ✦");
        lines.push(formatActionMenu(pursuerSlot.character.name));

        return ctx.reply(box("🏃 HUIDA FALLIDA", lines));
      }
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
