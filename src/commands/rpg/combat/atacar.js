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
const { calcFatigueCost, calcFatigueRecovery, capFatigue } = require("../../../services/rpg/fatigueEngine");
const { formatActionMenu, formatReactionPrompt, buildFatigueBar } = require("../../../services/rpg/combatMessages");
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
        return ctx.reply("\u274C No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
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
            `\u2694\uFE0F Tu personaje activo (**${activeChar.name}**) no est\u00E1 en combate.\n\n` +
              `\uD83D\uDCA1 Tu personaje **${charInCombatName}** tiene un combate activo.\n` +
              `Usa \`/switch_pj ${charInCombatName}\` para retomar su turno.`,
          );
        }

        return ctx.reply("\u274C No est\u00E1s en combate. Usa `/retar @usuario` o `/retar dummy`.");
      }

      if (session.status === "waiting_reaction") {
        return ctx.reply("\u274C Hay ataque pendiente. Usa `/esquivar` o `/bloquear`.");
      }

      if (String(session.currentTurnCharId) !== String(activeChar.id)) {
        return ctx.reply(`\u274C No es tu turno. Espera.`);
      }

      const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
      const attackerSlot = isChallenger ? session.challenger : session.defender;
      const defenderSlot = isChallenger ? session.defender : session.challenger;

      const attackFatigueCost = calcFatigueCost("attack", attackerSlot.character.stats);
      attackerSlot.fatigue = capFatigue(attackerSlot.fatigue + attackFatigueCost);

      const attackInfo = executeAttack(
        attackerSlot.character,
        defenderSlot.character,
        defenderSlot.hp,
        attackerSlot.hp,
        attackerSlot.fatigue,
        defenderSlot.fatigue,
      );

      if (session.isPvE) {
        let aiReaction = "none";
        if (attackInfo.canReact) {
          aiReaction = chooseAiReaction(
            defenderSlot.character,
            defenderSlot.hp,
            attackerSlot.character,
            attackInfo.baseDamage,
            attackerSlot.hp,
            defenderSlot.fatigue,
            attackerSlot.fatigue,
          );
        }

        const reactionResult = executeReaction(
          aiReaction,
          attackInfo.baseDamage,
          defenderSlot.character,
          defenderSlot.hp,
          attackerSlot.character,
          attackerSlot.hp,
          defenderSlot.fatigue,
          attackerSlot.fatigue,
        );

        const newAttackerHp = isChallenger ? session.challenger.hp : reactionResult.defenderHpAfter;
        const newDefenderHp = isChallenger ? reactionResult.defenderHpAfter : session.defender.hp;

        advanceTurn(session.id, newAttackerHp, newDefenderHp, session.isPvE);

        const lines = [];
        lines.push("");
        lines.push(`\u2694\uFE0F *${attackerSlot.character.name}* \u2192 *${defenderSlot.character.name}*`);

        if (reactionResult.reaction === "dodge") {
          lines.push(`\uD83D\uDCA8 *${defenderSlot.character.name}* esquiv\u00F3 (0)`);
        } else if (reactionResult.reaction === "block") {
          lines.push(
            `\uD83D\uDEE1\uFE0F *${defenderSlot.character.name}* bloque\u00F3 ${attackInfo.baseDamage}\u2192${reactionResult.finalDamage}`,
          );
        } else {
          lines.push(`\uD83D\uDCA5 Da\u00F1o: ${reactionResult.finalDamage}`);
        }
        lines.push(
          `\u2764\uFE0F *${defenderSlot.character.name}*: ${reactionResult.defenderHpBefore}\u2192${reactionResult.defenderHpAfter}`,
        );
        lines.push(`\u26A1 ${buildFatigueBar(attackerSlot.fatigue, attackerSlot.character.stats.def || 1)}`);

        if (reactionResult.ko) {
          const xpReward = calculateXpReward(defenderSlot.character.nivel || 1, true);
          endSession(session.id, attackerSlot.character.id);
          try {
            await addXp({ creatorId: ctx.sender, characterName: attackerSlot.character.name, cantidad: xpReward });
          } catch (_e) {}

          lines.push("");
          lines.push(`\uD83D\uDC80 *${defenderSlot.character.name}* cay\u00F3`);
          lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
          return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
        }

        const dummyAttack = executeAttack(
          defenderSlot.character,
          attackerSlot.character,
          attackerSlot.hp,
          defenderSlot.hp,
          defenderSlot.fatigue,
          attackerSlot.fatigue,
        );

        if (dummyAttack.canReact) {
          const { evaluateDodgeFeasibility } = require("../../../services/rpg/combatEngine");
          const canDodge = evaluateDodgeFeasibility(
            attackerSlot.character.stats,
            attackerSlot.hp,
            defenderSlot.character.stats,
            defenderSlot.hp,
            attackerSlot.fatigue,
            defenderSlot.fatigue,
            attackerSlot.character.stats.def || 0,
            defenderSlot.character.stats.def || 0,
          );

          await setPendingReaction(session.id, {
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
          lines.push(`\uD83E\uDD16 Contraataque (${dummyAttack.baseDamage})`);
          lines.push("");
          lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
          lines.push(
            formatReactionPrompt(
              defenderSlot.character.name,
              attackerSlot.character.name,
              dummyAttack.baseDamage,
              canDodge,
            ),
          );

          return ctx.reply(box("\uD83E\uDD16 CONTRAATAQUE", lines));
        }

        const dummyReaction = executeReaction(
          "none",
          dummyAttack.baseDamage,
          attackerSlot.character,
          attackerSlot.hp,
          defenderSlot.character,
          defenderSlot.hp,
          attackerSlot.fatigue,
          defenderSlot.fatigue,
        );

        const finalAttackerHp = isChallenger ? dummyReaction.defenderHpAfter : newAttackerHp;
        const finalDefenderHp = isChallenger ? newDefenderHp : dummyReaction.defenderHpAfter;

        advanceTurn(session.id, finalAttackerHp, finalDefenderHp);

        lines.push("");
        lines.push(`\uD83E\uDD16 *${defenderSlot.character.name}* contraataca`);
        lines.push(`\uD83D\uDCA5 Da\u00F1o: ${dummyReaction.finalDamage}`);
        lines.push(
          `\u2764\uFE0F *${attackerSlot.character.name}*: ${dummyReaction.defenderHpBefore}\u2192${dummyReaction.defenderHpAfter}`,
        );

        if (dummyReaction.ko) {
          endSession(session.id, defenderSlot.character.id);
          try {
            await setHp({ creatorId: ctx.sender, characterName: attackerSlot.character.name, hp: 0 });
          } catch (_e) {}
          lines.push("");
          lines.push(`\uD83D\uDC80 *${attackerSlot.character.name}* cay\u00F3`);
          return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
        }

        lines.push("");
        lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
        lines.push(formatActionMenu(attackerSlot.character.name));

        return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
      }

      if (attackInfo.canReact) {
        const { evaluateDodgeFeasibility } = require("../../../services/rpg/combatEngine");
        const canDodge = evaluateDodgeFeasibility(
          defenderSlot.character.stats,
          defenderSlot.hp,
          attackerSlot.character.stats,
          attackerSlot.hp,
          defenderSlot.fatigue,
          attackerSlot.fatigue,
          defenderSlot.character.stats.def || 0,
          attackerSlot.character.stats.def || 0,
        );

        await setPendingReaction(session.id, {
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
          `\u2694\uFE0F *${attackerSlot.character.name}* \u2192 *${defenderSlot.character.name}*`,
          `\uD83D\uDCA5 Base: ${attackInfo.baseDamage}`,
          `\u26A1 ${buildFatigueBar(attackerSlot.fatigue, attackerSlot.character.stats.def || 1)}`,
          "",
          "\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726",
          formatReactionPrompt(
            attackerSlot.character.name,
            defenderSlot.character.name,
            attackInfo.baseDamage,
            canDodge,
          ),
        ];

        return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
      }

      const reactionResult = executeReaction(
        "none",
        attackInfo.baseDamage,
        defenderSlot.character,
        defenderSlot.hp,
        attackerSlot.character,
        attackerSlot.hp,
        defenderSlot.fatigue,
        attackerSlot.fatigue,
      );

      const newAttackerHp = isChallenger ? session.challenger.hp : reactionResult.defenderHpAfter;
      const newDefenderHp = isChallenger ? reactionResult.defenderHpAfter : session.defender.hp;

      advanceTurn(session.id, newAttackerHp, newDefenderHp);

      const lines = [
        "",
        `\u2694\uFE0F *${attackerSlot.character.name}* \u2192 *${defenderSlot.character.name}*`,
        `\uD83D\uDCA5 Da\u00F1o: ${reactionResult.finalDamage}`,
        `\u2764\uFE0F *${defenderSlot.character.name}*: ${reactionResult.defenderHpBefore}\u2192${reactionResult.defenderHpAfter}`,
        `\u26A1 ${buildFatigueBar(attackerSlot.fatigue, attackerSlot.character.stats.def || 1)}`,
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
        lines.push(`\uD83D\uDC80 *${defenderSlot.character.name}* cay\u00F3`);
        lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
        return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
      }

      lines.push("");
      lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
      lines.push(formatActionMenu(defenderSlot.character.name));

      return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
