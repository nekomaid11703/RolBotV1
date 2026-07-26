// @ts-nocheck
const { getActiveCharacter, addXp, setHp } = require("../../../services/characterService");
const { findSessionByCharacter, advanceTurn, endSession } = require("../../../services/rpg/combatState");
const { executeReaction, calculateXpReward } = require("../../../services/rpg/combatEngine");
const { calcFatigueCost, calcFatigueRecovery, capFatigue } = require("../../../services/rpg/fatigueEngine");
const { formatActionMenu, buildFatigueBar } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");

module.exports = {
  name: "bloquear",
  aliases: ["block", "bloqueo"],
  description: "Bloquea un ataque en curso para reducir el daño recibido un 25%.",
  category: "rpg",

  async execute(ctx) {
    try {
      const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
      if (!activeChar) {
        return ctx.reply("❌ No tienes un personaje activo.");
      }

      const session = findSessionByCharacter(activeChar.id);
      if (!session) {
        return ctx.reply("\u274C No est\u00E1s en combate.");
      }

      if (session.status !== "waiting_reaction" || !session.pendingAttack) {
        return ctx.reply("\u274C No hay ataque pendiente. Usa `/estado`.");
      }

      const pending = session.pendingAttack;
      if (String(pending.defenderChar.id) !== String(activeChar.id)) {
        return ctx.reply("\u274C No eres el defensor.");
      }

      const isDefenderChallenger = String(session.challenger.characterId) === String(activeChar.id);
      const defenderSlot = isDefenderChallenger ? session.challenger : session.defender;
      const attackerSlot = isDefenderChallenger ? session.defender : session.challenger;

      const blockCost = calcFatigueCost("block", defenderSlot.character.stats);
      const blockRecovery = calcFatigueRecovery("block", defenderSlot.fatigue, defenderSlot.character.stats.def || 1);
      defenderSlot.fatigue = capFatigue(defenderSlot.fatigue + blockCost - blockRecovery);

      const reactionResult = executeReaction(
        "block",
        pending.baseDamage,
        pending.defenderChar,
        pending.defenderHp,
        pending.attackerChar,
        attackerSlot.hp,
        defenderSlot.fatigue,
        attackerSlot.fatigue,
      );

      const newAttackerHp = pending.isChallengerAttacking ? session.challenger.hp : reactionResult.defenderHpAfter;
      const newDefenderHp = pending.isChallengerAttacking ? reactionResult.defenderHpAfter : session.defender.hp;

      advanceTurn(session.id, newAttackerHp, newDefenderHp);

      const lines = [];
      lines.push("");
      lines.push(`\uD83D\uDEE1\uFE0F *${activeChar.name}* bloque\u00F3`);
      lines.push(`\uD83D\uDCA5 ${pending.baseDamage}\u2192${reactionResult.finalDamage} (\u221225%)`);
      lines.push(
        `\u2764\uFE0F *${activeChar.name}*: ${reactionResult.defenderHpBefore}\u2192${reactionResult.defenderHpAfter}`,
      );
      lines.push(`\u26A1 ${buildFatigueBar(defenderSlot.fatigue, defenderSlot.character.stats.def || 1)}`);

      if (reactionResult.ko) {
        const winnerChar = pending.attackerChar;
        const xpReward = calculateXpReward(activeChar.nivel || 1, true);
        endSession(session.id, winnerChar.id);

        try {
          await addXp({ creatorId: pending.attackerUserId, characterName: winnerChar.name, cantidad: xpReward });
          await setHp({ creatorId: ctx.sender, characterName: activeChar.name, hp: 0 });
        } catch { /* non-critical on KO */ }

        lines.push("");
        lines.push(`\uD83D\uDC80 *${activeChar.name}* cay\u00F3`);
        lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
        return ctx.reply(box("\uD83D\uDEE1\uFE0F BLOQUEO", lines));
      }

      const nextTurnCharName =
        session.currentTurnCharId === session.challenger.characterId
          ? session.challenger.character.name
          : session.defender.character.name;
      lines.push("");
      lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
      lines.push(formatActionMenu(nextTurnCharName));

      return ctx.reply(box("\uD83D\uDEE1\uFE0F BLOQUEO", lines));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
