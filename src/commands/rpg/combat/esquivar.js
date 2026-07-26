// @ts-nocheck
const { getActiveCharacter, addXp, setHp } = require("../../../services/characterService");
const { findSessionByCharacter, advanceTurn, endSession } = require("../../../services/rpg/combatState");
const { executeReaction, calculateXpReward } = require("../../../services/rpg/combatEngine");
const { calcFatigueCost, capFatigue } = require("../../../services/rpg/fatigueEngine");
const { formatActionMenu, buildFatigueBar } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "esquivar",
  aliases: ["dodge", "esquive"],
  description: "Intenta esquivar un ataque en curso si tus estadísticas lo permiten.",
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
        return ctx.reply("\u274C No est\u00E1s en combate.");
      }

      if (session.status !== "waiting_reaction" || !session.pendingAttack) {
        return ctx.reply("\u274C No hay ataque pendiente. Usa `/estado`.");
      }

      /**
       * @constant pending
       */
      const pending = session.pendingAttack;
      if (String(pending.defenderChar.id) !== String(activeChar.id)) {
        return ctx.reply("\u274C No eres el defensor.");
      }

      /**
       * @constant isDefenderChallenger
       */
      const isDefenderChallenger = String(session.challenger.characterId) === String(activeChar.id);
      /**
       * @constant defenderSlot
       */
      const defenderSlot = isDefenderChallenger ? session.challenger : session.defender;
      /**
       * @constant attackerSlot
       */
      const attackerSlot = isDefenderChallenger ? session.defender : session.challenger;

      /**
       * @constant dodgeFatigueCost
       */
      const dodgeFatigueCost = calcFatigueCost("dodge", defenderSlot.character.stats);
      defenderSlot.fatigue = capFatigue(defenderSlot.fatigue + dodgeFatigueCost);

      /**
       * @constant reactionResult
       */
      const reactionResult = executeReaction(
        "dodge",
        pending.baseDamage,
        pending.defenderChar,
        pending.defenderHp,
        pending.attackerChar,
        attackerSlot.hp,
        defenderSlot.fatigue,
        attackerSlot.fatigue,
      );

      /**
       * @constant newAttackerHp
       */
      const newAttackerHp = pending.isChallengerAttacking ? session.challenger.hp : reactionResult.defenderHpAfter;
      /**
       * @constant newDefenderHp
       */
      const newDefenderHp = pending.isChallengerAttacking ? reactionResult.defenderHpAfter : session.defender.hp;

      advanceTurn(session.id, newAttackerHp, newDefenderHp);

      /**
       * @constant lines
       * @type {Array}
       */
      const lines = [];
      lines.push("");
      if (reactionResult.dodged) {
        lines.push(`\uD83D\uDCA8 *${activeChar.name}* esquiv\u00F3 (0)`);
      } else {
        lines.push(`\u274C *${activeChar.name}* fall\u00F3 esquiva`);
        lines.push(`\uD83D\uDCA5 Da\u00F1o: ${reactionResult.finalDamage}`);
      }
      lines.push(
        `\u2764\uFE0F *${activeChar.name}*: ${reactionResult.defenderHpBefore}\u2192${reactionResult.defenderHpAfter}`,
      );
      lines.push(`\u26A1 ${buildFatigueBar(defenderSlot.fatigue, defenderSlot.character.stats.def || 1)}`);

      if (reactionResult.ko) {
        /**
         * @constant winnerChar
         */
        const winnerChar = pending.attackerChar;
        /**
         * @constant xpReward
         */
        const xpReward = calculateXpReward(activeChar.nivel || 1, true);
        endSession(session.id, winnerChar.id);

        try {
          await addXp({ creatorId: pending.attackerUserId, characterName: winnerChar.name, cantidad: xpReward });
          await setHp({ creatorId: ctx.sender, characterName: activeChar.name, hp: 0 });
        } catch {
          /* non-critical on KO */
        }

        lines.push("");
        lines.push(`\uD83D\uDC80 *${activeChar.name}* cay\u00F3`);
        lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
        return ctx.reply(box("\uD83D\uDCA8 ESQUIVA", lines));
      }

      /**
       * @constant nextTurnCharName
       */
      const nextTurnCharName =
        session.currentTurnCharId === session.challenger.characterId
          ? session.challenger.character.name
          : session.defender.character.name;
      lines.push("");
      lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
      lines.push(formatActionMenu(nextTurnCharName));

      return ctx.reply(box("\uD83D\uDCA8 ESQUIVA", lines));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
