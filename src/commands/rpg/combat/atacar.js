// @ts-nocheck
const { getActiveCharacter, addXp, setHp } = require("../../../services/characterService");
const {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
} = require("../../../services/rpg/combatState");
const {
  executeAttack,
  executeReaction,
  chooseAiReaction,
  calculateXpReward,
} = require("../../../services/rpg/combatEngine");
const { formatActionMenu, formatReactionPrompt, formatVictory } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "atacar",
  aliases: ["attack", "golpear"],
  description: "Ataca a tu oponente en el combate activo.",
  category: "rpg",

  async execute(ctx) {
    try {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
      }

      const session = findSessionByCharacter(activeChar.id);

      if (!session) {
        const userSession = findSessionByUser(ctx.sender);
        if (userSession) {
          const charInCombatName =
            userSession.challenger.userId === ctx.sender
              ? userSession.challenger.character.name
              : userSession.defender.character.name;

          return ctx.reply(
            `⚔️ Tu personaje activo (**${activeChar.name}**) no está en combate.\n\n` +
              `💡 Tu personaje **${charInCombatName}** tiene un combate activo.\n` +
              `Usa \`/switch_pj ${charInCombatName}\` para retomar su turno.`,
          );
        }

        return ctx.reply("❌ Tu personaje activo no está en un combate. Usa `/retar @usuario` o `/retar dummy`.");
      }

      if (session.status === "waiting_reaction") {
        return ctx.reply("❌ Hay un ataque en curso pendiente de reacción. Usa `/esquivar` o `/bloquear`.");
      }

      if (String(session.currentTurnCharId) !== String(activeChar.id)) {
        return ctx.reply(`❌ No es el turno de **${activeChar.name}**. Espera a que tu oponente tome su acción.`);
      }

      const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
      const attackerSlot = isChallenger ? session.challenger : session.defender;
      const defenderSlot = isChallenger ? session.defender : session.challenger;

      const attackInfo = executeAttack(attackerSlot.character, defenderSlot.character, defenderSlot.hp);

      // In PvE (Dummy mode)
      if (session.isPvE) {
        let aiReaction = "none";
        if (attackInfo.canReact) {
          aiReaction = chooseAiReaction(
            defenderSlot.character,
            defenderSlot.hp,
            attackerSlot.character,
            attackInfo.baseDamage,
          );
        }

        const reactionResult = executeReaction(
          aiReaction,
          attackInfo.baseDamage,
          defenderSlot.character,
          defenderSlot.hp,
          attackerSlot.character,
        );

        const newAttackerHp = isChallenger ? session.challenger.hp : reactionResult.defenderHpAfter;
        const newDefenderHp = isChallenger ? reactionResult.defenderHpAfter : session.defender.hp;

        advanceTurn(session.id, newAttackerHp, newDefenderHp);

        const lines = [];
        lines.push("");
        lines.push(`⚔️  *${attackerSlot.character.name}* ataca a *${defenderSlot.character.name}*`);

        if (reactionResult.reaction === "dodge") {
          lines.push(`💨  ¡*${defenderSlot.character.name}* esquivó el ataque! (Daño: 0)`);
        } else if (reactionResult.reaction === "block") {
          lines.push(
            `🛡️  ¡*${defenderSlot.character.name}* bloqueó! Daño: ${attackInfo.baseDamage} → ${reactionResult.finalDamage}`,
          );
        } else {
          lines.push(`💥  Daño infligido: ${reactionResult.finalDamage}`);
        }
        lines.push(
          `❤️  HP de *${defenderSlot.character.name}*: ${reactionResult.defenderHpBefore} → ${reactionResult.defenderHpAfter}`,
        );

        if (reactionResult.ko) {
          const xpReward = calculateXpReward(defenderSlot.character.nivel || 20, true);
          endSession(session.id, attackerSlot.character.id);
          try {
            await addXp({ creatorId: ctx.sender, characterName: attackerSlot.character.name, cantidad: xpReward });
          } catch (_e) {}

          lines.push("");
          lines.push(`💀  ¡*${defenderSlot.character.name}* ha caído!`);
          lines.push(`🏆  ¡*${attackerSlot.character.name}* gana el combate! (+${xpReward} XP)`);
          return ctx.reply(box("⚔️ RESUMEN DE TURNO", lines));
        }

        // Dummy counterattacks automatically in the same turn flow
        const dummyAttack = executeAttack(defenderSlot.character, attackerSlot.character, attackerSlot.hp);

        if (dummyAttack.canReact) {
          const { evaluateDodgeFeasibility } = require("../../../services/rpg/combatEngine");
          const canDodge = evaluateDodgeFeasibility(
            attackerSlot.character.stats,
            attackerSlot.hp,
            defenderSlot.character.stats,
            defenderSlot.character.hp_actual || 100,
          );

          // Store pending reaction for player
          setPendingReaction(session.id, {
            attackerChar: defenderSlot.character,
            defenderChar: attackerSlot.character,
            attackerUserId: defenderSlot.userId,
            defenderUserId: attackerSlot.userId,
            baseDamage: dummyAttack.baseDamage,
            defenderHp: attackerSlot.hp,
            isChallengerAttacking: false,
            canDodgeSuccessfully: canDodge,
          });

          lines.push("");
          lines.push(
            `🤖  *${defenderSlot.character.name}* se prepara para contraatacar (Daño base: ${dummyAttack.baseDamage})`,
          );
          lines.push("");
          lines.push("✦ ━━━━━━━━━━━━━━ ✦");
          lines.push(
            formatReactionPrompt(
              defenderSlot.character.name,
              attackerSlot.character.name,
              dummyAttack.baseDamage,
              canDodge,
            ),
          );

          return ctx.reply(box("⚔️ CONTRAATAQUE DEL MANIQUÍ", lines));
        } else {
          // Dummy counterattacks without player reaction
          const dummyReaction = executeReaction(
            "none",
            dummyAttack.baseDamage,
            attackerSlot.character,
            attackerSlot.hp,
            defenderSlot.character,
          );

          const finalAttackerHp = isChallenger ? dummyReaction.defenderHpAfter : newAttackerHp;
          const finalDefenderHp = isChallenger ? newDefenderHp : dummyReaction.defenderHpAfter;

          advanceTurn(session.id, finalAttackerHp, finalDefenderHp);

          lines.push("");
          lines.push(`🤖  *${defenderSlot.character.name}* contraataca a *${attackerSlot.character.name}*`);
          lines.push(`💥  Daño recibido: ${dummyReaction.finalDamage}`);
          lines.push(
            `❤️  HP de *${attackerSlot.character.name}*: ${dummyReaction.defenderHpBefore} → ${dummyReaction.defenderHpAfter}`,
          );

          if (dummyReaction.ko) {
            endSession(session.id, defenderSlot.character.id);
            try {
              await setHp({ creatorId: ctx.sender, characterName: attackerSlot.character.name, hp: 0 });
            } catch (_e) {}
            lines.push("");
            lines.push(`💀  ¡*${attackerSlot.character.name}* ha sido derrotado por el maniquí!`);
            return ctx.reply(box("⚔️ RESUMEN DE TURNO", lines));
          }

          lines.push("");
          lines.push("✦ ━━━━━━━━━━━━━━ ✦");
          lines.push(formatActionMenu(attackerSlot.character.name));

          return ctx.reply(box("⚔️ RESUMEN DE TURNO", lines));
        }
      }

      // In PvP mode
      if (attackInfo.canReact) {
        const { evaluateDodgeFeasibility } = require("../../../services/rpg/combatEngine");
        const canDodge = evaluateDodgeFeasibility(
          defenderSlot.character.stats,
          defenderSlot.hp,
          attackerSlot.character.stats,
          attackerSlot.character.hp_actual || 100,
        );

        setPendingReaction(session.id, {
          attackerChar: attackerSlot.character,
          defenderChar: defenderSlot.character,
          attackerUserId: attackerSlot.userId,
          defenderUserId: defenderSlot.userId,
          baseDamage: attackInfo.baseDamage,
          defenderHp: defenderSlot.hp,
          isChallengerAttacking: isChallenger,
          canDodgeSuccessfully: canDodge,
        });

        const lines = [
          "",
          `⚔️  *${attackerSlot.character.name}* ha lanzado un ataque contra *${defenderSlot.character.name}*`,
          `💥  Daño base del ataque: ${attackInfo.baseDamage}`,
          "",
          "✦ ━━━━━━━━━━━━━━ ✦",
          formatReactionPrompt(
            attackerSlot.character.name,
            defenderSlot.character.name,
            attackInfo.baseDamage,
            canDodge,
          ),
        ];

        return ctx.reply(box("⚡ ATAQUE EN CURSO", lines));
      } else {
        const reactionResult = executeReaction(
          "none",
          attackInfo.baseDamage,
          defenderSlot.character,
          defenderSlot.hp,
          attackerSlot.character,
        );

        const newAttackerHp = isChallenger ? session.challenger.hp : reactionResult.defenderHpAfter;
        const newDefenderHp = isChallenger ? reactionResult.defenderHpAfter : session.defender.hp;

        advanceTurn(session.id, newAttackerHp, newDefenderHp);

        const lines = [
          "",
          `⚔️  *${attackerSlot.character.name}* ataca a *${defenderSlot.character.name}*`,
          `💥  Daño infligido: ${reactionResult.finalDamage}`,
          `❤️  HP de *${defenderSlot.character.name}*: ${reactionResult.defenderHpBefore} → ${reactionResult.defenderHpAfter}`,
        ];

        if (reactionResult.ko) {
          const xpReward = calculateXpReward(defenderSlot.character.nivel || 1, true);
          endSession(session.id, attackerSlot.character.id);
          try {
            await addXp({
              creatorId: attackerSlot.userId,
              characterName: attackerSlot.character.name,
              cantidad: xpReward,
            });
            await setHp({ creatorId: defenderSlot.userId, characterName: defenderSlot.character.name, hp: 0 });
          } catch (_e) {}

          lines.push("");
          lines.push(`💀  ¡*${defenderSlot.character.name}* ha caído!`);
          lines.push(`🏆  ¡*${attackerSlot.character.name}* gana el combate! (+${xpReward} XP)`);
          return ctx.reply(box("⚔️ RESUMEN DE TURNO", lines));
        }

        lines.push("");
        lines.push("✦ ━━━━━━━━━━━━━━ ✦");
        lines.push(formatActionMenu(defenderSlot.character.name));

        return ctx.reply(box("⚔️ RESUMEN DE TURNO", lines));
      }
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
