// @ts-nocheck
const { getActiveCharacter, addXp, setHp } = require("../../../services/characterService");
const {
  findSessionByCharacter,
  advanceTurn,
  endSession,
  getEffectKoOutcome,
  isActionBlocked,
} = require("../../../services/rpg/combatState");
const { executeReaction } = require("../../../services/rpg/combatEngine");
const { combatVictoryXp } = require("../../../services/rpg/xpRewardService");
const { calcFatigueCost, calcFatigueRecovery, capFatigue } = require("../../../services/rpg/fatigueEngine");
const {
  formatActionMenu,
  formatCombatResult,
  buildEnergyBar,
  buildSituationalCtx,
} = require("../../../services/rpg/combatMessages");
const { divider } = require("../../../utils/boxUtils");
const {
  resolveDefenderArmor,
  createArmorDurabilityAdapter,
} = require("../../../services/rpg/equipmentResolverService");
const { persistArmorDurability } = require("../../../services/rpg/durabilityPersistenceService");

module.exports = {
  name: "bloquear",
  aliases: ["block", "bloqueo"],
  description: "Bloquea un ataque en curso para reducir el daño recibido un 25%.",
  category: "rpg",

  /**
   * Executes the .
   * @async
   * @param {*} ctx - execution context.
   * @returns {any}
   */
  async execute(ctx) {
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

    // E-15: Personajes congelados, paralizados o atrapados no pueden bloquear.
    if (isActionBlocked(defenderSlot, "block")) {
      return ctx.reply("❌ Estás incapacitado y no puedes bloquear.");
    }

    /**
     * @constant blockCost
     */
    const blockCost = calcFatigueCost("block", defenderSlot.character.stats);
    /**
     * @constant blockRecovery
     */
    const blockRecovery = calcFatigueRecovery("block", defenderSlot.fatigue, defenderSlot.character.stats.def || 1);
    // E-12: Bloquear NUNCA puede recuperar fatiga neta — coste mínimo garantizado de 1.
    defenderSlot.fatigue = capFatigue(defenderSlot.fatigue + Math.max(1, blockCost - blockRecovery));

    /**
     * @constant reactionResult
     */
    const armor = await resolveDefenderArmor(defenderSlot.character).catch(() => null);
    const reactionResult = executeReaction(
      "block",
      pending.baseDamage,
      pending.defenderChar,
      pending.defenderHp,
      pending.attackerChar,
      attackerSlot.hp,
      defenderSlot.fatigue,
      attackerSlot.fatigue,
      pending.materialDamage || 0,
      createArmorDurabilityAdapter(armor),
    );
    await persistArmorDurability(defenderSlot.character, defenderSlot.userId, armor);

    /**
     * @constant newAttackerHp
     */
    const newAttackerHp = pending.isChallengerAttacking ? session.challenger.hp : reactionResult.defenderHpAfter;
    /**
     * @constant newDefenderHp
     */
    const newDefenderHp = pending.isChallengerAttacking ? reactionResult.defenderHpAfter : session.defender.hp;

    await advanceTurn(session.id, newAttackerHp, newDefenderHp);

    const effectKo = getEffectKoOutcome(session);

    /**
     * @constant lines
     * @type {*[]}
     */
    const lines = [];
    lines.push("");
    lines.push(`\uD83D\uDEE1\uFE0F *${activeChar.name}* bloque\u00F3`);
    const absorbed = pending.baseDamage - reactionResult.finalDamage;
    lines.push(
      `\uD83D\uDCA5 ${pending.baseDamage} \u2192 ${reactionResult.finalDamage} (\uD83D\uDEE1\uFE0F absorbi\u00F3 ${absorbed})`,
    );
    lines.push(
      `\u2764\uFE0F *${activeChar.name}*: ${reactionResult.defenderHpBefore}\u2192${reactionResult.defenderHpAfter}`,
    );
    lines.push(buildEnergyBar(defenderSlot.fatigue, defenderSlot.character.stats.def || 1));

    if (effectKo) {
      let xpReward = 0;
      if (!effectKo.winner.isBot) {
        xpReward = combatVictoryXp({
          winnerLevel: effectKo.winner.character.nivel,
          loserLevel: effectKo.loser.character.nivel,
          isPvE: Boolean(session.isPvE),
        });
        await addXp({
          creatorId: effectKo.winner.userId,
          characterName: effectKo.winner.character.name,
          cantidad: xpReward,
        });
      }
      if (!effectKo.loser.isBot) {
        await setHp({ creatorId: effectKo.loser.userId, characterName: effectKo.loser.character.name, hp: 0 });
      }
      lines.push(`\uD83D\uDC80 *${effectKo.loser.character.name}* cayó por un estado`);
      if (xpReward > 0) lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
      return ctx.reply(formatCombatResult("\uD83D\uDEE1\uFE0F BLOQUEO", lines));
    }

    if (reactionResult.ko) {
      /**
       * @constant winnerChar
       */
      const winnerChar = pending.attackerChar;
      /**
       * @constant xpReward
       */
      const xpReward = combatVictoryXp({
        winnerLevel: winnerChar.nivel,
        loserLevel: activeChar.nivel || 1,
        isPvE: Boolean(session.isPvE),
      });
      await endSession(session.id, winnerChar.id);

      // Los bots/dummies no son personajes reales en DB: no otorgan XP ni HP persistido.
      if (!attackerSlot.isBot) {
        await addXp({ creatorId: pending.attackerUserId, characterName: winnerChar.name, cantidad: xpReward });
      }
      await setHp({ creatorId: ctx.sender, characterName: activeChar.name, hp: 0 });

      lines.push("");
      lines.push(`\uD83D\uDC80 *${activeChar.name}* cay\u00F3`);
      if (!attackerSlot.isBot) lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
      return ctx.reply(formatCombatResult("\uD83D\uDEE1\uFE0F BLOQUEO", lines));
    }

    /**
     * @constant nextTurnCharName
     */
    const nextTurnCharName =
      session.currentTurnCharId === session.challenger.characterId
        ? session.challenger.character.name
        : session.defender.character.name;
    lines.push("");
    lines.push(divider());
    const nextSlot =
      session.currentTurnCharId === session.challenger.characterId ? session.challenger : session.defender;
    const nextOpp =
      session.currentTurnCharId === session.challenger.characterId ? session.defender : session.challenger;
    const situCtx = buildSituationalCtx(nextSlot, nextOpp, session.distance);
    lines.push(formatActionMenu(nextTurnCharName, session, situCtx));

    return ctx.reply(formatCombatResult("\uD83D\uDEE1\uFE0F BLOQUEO", lines));
  },
};
