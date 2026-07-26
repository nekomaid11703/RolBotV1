// @ts-nocheck
const { getActiveCharacter, setHp } = require("../../../services/characterService");
const {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
} = require("../../../services/rpg/combatState");
const { executeAttack, executeReaction } = require("../../../services/rpg/combatEngine");
const { calcFatigueRecovery, capFatigue } = require("../../../services/rpg/fatigueEngine");
const { formatActionMenu, formatReactionPrompt, buildFatigueBar } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "descansar",
  aliases: ["rest", "recuperar", "respirar"],
  description: "Recupera fatiga saltándote tu turno. Más efectivo cuanto menos fatigado estés.",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
    try {
      /**
       * @constant activeChar
       */
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo.");
      }

      /**
       * @constant session
       */
      const session = findSessionByCharacter(activeChar.id);
      if (!session) {
        /**
         * @constant userSession
         */
        const userSession = findSessionByUser(ctx.sender);
        if (userSession) {
          /**
           * @constant charInCombatName
           */
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
        return ctx.reply("\u274C No es tu turno. Espera.");
      }

      /**
       * @constant isChallenger
       */
      const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
      /**
       * @constant resterSlot
       */
      const resterSlot = isChallenger ? session.challenger : session.defender;
      /**
       * @constant opponentSlot
       */
      const opponentSlot = isChallenger ? session.defender : session.challenger;

      /**
       * @constant recovery
       */
      const recovery = calcFatigueRecovery("rest", resterSlot.fatigue, resterSlot.character.stats.def || 1);
      resterSlot.fatigue = capFatigue(resterSlot.fatigue - recovery);

      /**
       * @constant lines
       * @type {Array}
       */
      const lines = [];
      lines.push("");
      lines.push(`\uD83D\uDCA4 *${resterSlot.character.name}* descansa`);
      lines.push(`\u2728 Fatiga -${recovery}`);
      lines.push(`\u26A1 ${buildFatigueBar(resterSlot.fatigue, resterSlot.character.stats.def || 1)}`);

      // En PvE, el dummy contraataca automáticamente
      if (session.isPvE) {
        /**
         * @constant dummyAttack
         */
        const dummyAttack = executeAttack(
          opponentSlot.character,
          resterSlot.character,
          resterSlot.hp,
          opponentSlot.hp,
          opponentSlot.fatigue,
          resterSlot.fatigue,
        );

        if (dummyAttack.canReact) {
          const { evaluateDodgeFeasibility } = require("../../../services/rpg/combatEngine");
          /**
           * @constant canDodge
           */
          const canDodge = evaluateDodgeFeasibility(
            resterSlot.character.stats,
            resterSlot.hp,
            opponentSlot.character.stats,
            opponentSlot.hp,
            resterSlot.fatigue,
            opponentSlot.fatigue,
            resterSlot.character.stats.def || 0,
            opponentSlot.character.stats.def || 0,
          );

          advanceTurn(session.id, resterSlot.hp, opponentSlot.hp);

          await setPendingReaction(session.id, {
            attackerChar: opponentSlot.character,
            defenderChar: resterSlot.character,
            attackerUserId: opponentSlot.userId,
            defenderUserId: resterSlot.userId,
            baseDamage: dummyAttack.baseDamage,
            defenderHp: resterSlot.hp,
            isChallengerAttacking: !isChallenger,
            canDodgeSuccessfully: canDodge,
          });

          lines.push("");
          lines.push(`\uD83E\uDD16 *${opponentSlot.character.name}* ataca (${dummyAttack.baseDamage})`);
          lines.push("");
          lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
          lines.push(
            formatReactionPrompt(
              opponentSlot.character.name,
              resterSlot.character.name,
              dummyAttack.baseDamage,
              canDodge,
            ),
          );

          return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
        }

        // Si no puede reaccionar, recibe el daño completo
        /**
         * @constant dummyReaction
         */
        const dummyReaction = executeReaction(
          "none",
          dummyAttack.baseDamage,
          resterSlot.character,
          resterSlot.hp,
          opponentSlot.character,
          opponentSlot.hp,
          resterSlot.fatigue,
          opponentSlot.fatigue,
        );

        /**
         * @constant finalAttackerHp
         */
        const finalAttackerHp = isChallenger ? dummyReaction.defenderHpAfter : opponentSlot.hp;
        /**
         * @constant finalDefenderHp
         */
        const finalDefenderHp = isChallenger ? opponentSlot.hp : dummyReaction.defenderHpAfter;

        advanceTurn(session.id, finalAttackerHp, finalDefenderHp);

        lines.push("");
        lines.push(`\uD83E\uDD16 *${opponentSlot.character.name}* golpea`);
        lines.push(`\uD83D\uDCA5 Da\u00F1o: ${dummyReaction.finalDamage}`);
        lines.push(
          `\u2764\uFE0F *${resterSlot.character.name}*: ${dummyReaction.defenderHpBefore}\u2192${dummyReaction.defenderHpAfter}`,
        );

        if (dummyReaction.ko) {
          lines.push("");
          lines.push(`\uD83D\uDC80 *${resterSlot.character.name}* cay\u00F3`);
          endSession(session.id, opponentSlot.character.id);
          try {
            await setHp({ creatorId: ctx.sender, characterName: resterSlot.character.name, hp: 0 });
          } catch (_e) {}
          return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
        }

        lines.push("");
        lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
        lines.push(formatActionMenu(resterSlot.character.name));

        return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
      }

      // En PvP, solo descansa y pasa el turno
      advanceTurn(session.id, resterSlot.hp, opponentSlot.hp);

      lines.push("");
      lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
      /**
       * @constant nextTurnCharName
       */
      const nextTurnCharName =
        session.currentTurnCharId === session.challenger.characterId
          ? session.challenger.character.name
          : session.defender.character.name;
      lines.push(formatActionMenu(nextTurnCharName));

      return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
