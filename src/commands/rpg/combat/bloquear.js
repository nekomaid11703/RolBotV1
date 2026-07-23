// @ts-nocheck
const { getActiveCharacter, addXp, setHp } = require("../../../services/characterService");
const { findSessionByCharacter, advanceTurn, endSession } = require("../../../services/rpg/combatState");
const { executeReaction, calculateXpReward } = require("../../../services/rpg/combatEngine");
const { calcFatigueCost, calcFatigueRecovery } = require("../../../services/rpg/fatigueEngine");
const { formatActionMenu } = require("../../../services/rpg/combatMessages");
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
        return ctx.reply("❌ Tu personaje no está en un combate activo.");
      }

      if (session.status !== "waiting_reaction" || !session.pendingAttack) {
        return ctx.reply("❌ No hay ningún ataque pendiente al que debas reaccionar. Usa `/estado`.");
      }

      const pending = session.pendingAttack;
      if (String(pending.defenderChar.id) !== String(activeChar.id)) {
        return ctx.reply("❌ No eres el defensor del ataque actual.");
      }

      const isDefenderChallenger = String(session.challenger.characterId) === String(activeChar.id);
      const defenderSlot = isDefenderChallenger ? session.challenger : session.defender;
      const attackerSlot = isDefenderChallenger ? session.defender : session.challenger;

      const blockCost = calcFatigueCost("block");
      const blockRecovery = calcFatigueRecovery("block", defenderSlot.fatigue, defenderSlot.character.stats.def || 1);
      defenderSlot.fatigue = Math.max(0, defenderSlot.fatigue + blockCost - blockRecovery);

      const reactionResult = executeReaction(
        "block",
        pending.baseDamage,
        pending.defenderChar,
        pending.defenderHp,
        pending.attackerChar,
        defenderSlot.fatigue,
        attackerSlot.fatigue,
      );

      const newAttackerHp = pending.isChallengerAttacking ? session.challenger.hp : reactionResult.defenderHpAfter;
      const newDefenderHp = pending.isChallengerAttacking ? reactionResult.defenderHpAfter : session.defender.hp;

      advanceTurn(session.id, newAttackerHp, newDefenderHp);

      const lines = [];
      lines.push("");
      lines.push(`🛡️  ¡*${activeChar.name}* bloqueó el ataque de *${pending.attackerChar.name}*!`);
      lines.push(`💥  Daño base: ${pending.baseDamage} → ${reactionResult.finalDamage} (reducido 25%)`);
      lines.push(
        `❤️  HP de *${activeChar.name}*: ${reactionResult.defenderHpBefore} → ${reactionResult.defenderHpAfter}`,
      );
      lines.push(`⚡ Fatiga: ${defenderSlot.fatigue} (−${blockRecovery} por bloqueo)`);

      if (reactionResult.ko) {
        const winnerChar = pending.attackerChar;
        const xpReward = calculateXpReward(activeChar.nivel || 1, true);
        endSession(session.id, winnerChar.id);

        try {
          await addXp({ creatorId: pending.attackerUserId, characterName: winnerChar.name, cantidad: xpReward });
          await setHp({ creatorId: ctx.sender, characterName: activeChar.name, hp: 0 });
        } catch (_e) {}

        lines.push("");
        lines.push(`💀  ¡*${activeChar.name}* ha caído en combate!`);
        lines.push(`🏆  ¡*${winnerChar.name}* gana el combate! (+${xpReward} XP)`);
        return ctx.reply(box("⚔️ REACCIÓN DE COMBATE", lines));
      }

      const nextTurnCharName =
        session.currentTurnCharId === session.challenger.characterId
          ? session.challenger.character.name
          : session.defender.character.name;
      lines.push("");
      lines.push("✦ ━━━━━━━━━━━━━━ ✦");
      lines.push(formatActionMenu(nextTurnCharName));

      return ctx.reply(box("⚔️ REACCIÓN DE COMBATE", lines));
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
