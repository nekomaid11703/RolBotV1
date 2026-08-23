// @ts-nocheck
const { getActiveCharacter, setHp } = require("../../../services/characterService");
const {
  findSessionByCharacter,
  endSession,
  advanceTurn,
  setPendingReaction,
  getEffectKoOutcome,
} = require("../../../services/rpg/combatState");
const { rollFlee, executeAttack, executeReaction } = require("../../../services/rpg/combatEngine");
const { calcFatigueCost, capFatigue } = require("../../../services/rpg/fatigueEngine");
const {
  formatFlee,
  formatActionMenu,
  formatReactionPrompt,
  buildFatigueBar,
  buildSituationalCtx,
} = require("../../../services/rpg/combatMessages");
const { box } = require("../../../utils/boxUtils");
const {
  resolveAttackerWeapon,
  resolveDefenderArmor,
  createArmorDurabilityAdapter,
} = require("../../../services/rpg/equipmentResolverService");
const { persistArmorDurability } = require("../../../services/rpg/durabilityPersistenceService");

module.exports = {
  name: "huir",
  aliases: ["flee", "escapar", "run"],
  description: "Intenta escapar del combate activo.",
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
      return ctx.reply("\u274C No tienes un personaje activo.");
    }

    /**
     * @constant session
     */
    const session = findSessionByCharacter(activeChar.id);
    if (!session) {
      return ctx.reply("\u274C No est\u00E1s en combate.");
    }

    if (session.status === "waiting_reaction") {
      return ctx.reply("\u274C Hay ataque pendiente. Usa `/esquivar` o `/bloquear`.");
    }

    if (String(session.currentTurnCharId) !== String(activeChar.id)) {
      return ctx.reply("\u274C No es tu turno.");
    }

    /**
     * @constant isChallenger
     */
    const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
    /**
     * @constant fleerSlot
     */
    const fleerSlot = isChallenger ? session.challenger : session.defender;
    /**
     * @constant pursuerSlot
     */
    const pursuerSlot = isChallenger ? session.defender : session.challenger;

    /**
     * @constant fleeCost
     */
    const fleeCost = calcFatigueCost("flee", fleerSlot.character.stats);
    fleerSlot.fatigue = capFatigue(fleerSlot.fatigue + fleeCost);

    // En PvE (Dummy), la huida siempre tiene éxito y no da recompensa
    if (session.isPvE) {
      await endSession(session.id, null);
      return ctx.reply(
        formatFlee(fleerSlot.character.name, true, 1.0, fleerSlot.fatigue, fleerSlot.character.stats.def || 1),
      );
    }

    // En PvP, se evalúa la huida según MSPD comparativo
    /**
     * @constant fleeResult
     */
    const fleeResult = rollFlee(
      fleerSlot.character.stats,
      fleerSlot.hp,
      pursuerSlot.character.stats,
      pursuerSlot.hp,
      fleerSlot.fatigue,
      pursuerSlot.fatigue,
      fleerSlot.character.stats.def || 0,
      pursuerSlot.character.stats.def || 0,
    );

    if (fleeResult.success) {
      await endSession(session.id, null);
      return ctx.reply(
        formatFlee(
          fleerSlot.character.name,
          true,
          fleeResult.chance,
          fleerSlot.fatigue,
          fleerSlot.character.stats.def || 1,
        ),
      );
    }

    // Si la huida falla, el jugador pierde el turno y sufre el ataque automático del perseguidor
    const lines = [];
    lines.push("");
    lines.push(`\u274C *${fleerSlot.character.name}* fue interceptado`);
    lines.push(`🎯 Probabilidad de escape: ${Math.round(fleeResult.chance * 100)}%`);
    lines.push(`\u26A1 ${buildFatigueBar(fleerSlot.fatigue, fleerSlot.character.stats.def || 1)}`);

    /**
     * @constant attackInfo
     */
    const [weaponInfo, armor] = await Promise.all([
      resolveAttackerWeapon(pursuerSlot.character).catch(() => null),
      resolveDefenderArmor(fleerSlot.character).catch(() => null),
    ]);
    const attackInfo = executeAttack(
      pursuerSlot.character,
      fleerSlot.character,
      fleerSlot.hp,
      pursuerSlot.hp,
      pursuerSlot.fatigue,
      fleerSlot.fatigue,
      weaponInfo,
    );

    if (attackInfo.canReact) {
      const { evaluateDodgeFeasibility } = require("../../../services/rpg/combatEngine");
      /**
       * @constant canDodge
       */
      const canDodge = evaluateDodgeFeasibility(
        fleerSlot.character.stats,
        fleerSlot.hp,
        pursuerSlot.character.stats,
        pursuerSlot.hp,
        fleerSlot.fatigue,
        pursuerSlot.fatigue,
        fleerSlot.character.stats.def || 0,
        pursuerSlot.character.stats.def || 0,
      );

      await setPendingReaction(session.id, {
        attackerChar: pursuerSlot.character,
        defenderChar: fleerSlot.character,
        attackerUserId: pursuerSlot.userId,
        defenderUserId: fleerSlot.userId,
        baseDamage: attackInfo.baseDamage,
        materialDamage: attackInfo.materialDamage,
        defenderHp: fleerSlot.hp,
        isChallengerAttacking: !isChallenger,
        canDodgeSuccessfully: canDodge,
      });

      lines.push("");
      lines.push(`\u2694\uFE0F Contraataque (${attackInfo.baseDamage})`);
      lines.push("");
      lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
      lines.push(
        formatReactionPrompt(pursuerSlot.character.name, fleerSlot.character.name, attackInfo.baseDamage, canDodge),
      );

      return ctx.reply(box("\uD83C\uDFC3 HUIDA", lines));
    }

    /**
     * @constant reactionResult
     */
    const reactionResult = executeReaction(
      "none",
      attackInfo.baseDamage,
      fleerSlot.character,
      fleerSlot.hp,
      pursuerSlot.character,
      pursuerSlot.hp,
      fleerSlot.fatigue,
      pursuerSlot.fatigue,
      attackInfo.materialDamage,
      createArmorDurabilityAdapter(armor),
    );
    await persistArmorDurability(fleerSlot.character, fleerSlot.userId || ctx.sender, armor);

    /**
     * @constant newFleerHp
     */
    const newFleerHp = reactionResult.defenderHpAfter;
    /**
     * @constant newAttackerHp
     */
    const newAttackerHp = pursuerSlot.hp;

    await advanceTurn(session.id, isChallenger ? newFleerHp : newAttackerHp, isChallenger ? newAttackerHp : newFleerHp);
    const effectKo = getEffectKoOutcome(session);

    lines.push("");
    lines.push(`\u2694\uFE0F *${pursuerSlot.character.name}* golpea`);
    lines.push(`\uD83D\uDCA5 Da\u00F1o: ${reactionResult.finalDamage}`);
    lines.push(`\u2764\uFE0F *${fleerSlot.character.name}*: ${reactionResult.defenderHpBefore}\u2192${newFleerHp}`);
    if (effectKo) {
      lines.push(`\uD83D\uDC80 *${effectKo.loser.character.name}* cayó por un estado`);
      return ctx.reply(box("\uD83C\uDFC3 HUIDA", lines));
    }

    if (reactionResult.ko) {
      await endSession(session.id, pursuerSlot.character.id);
      await setHp({ creatorId: ctx.sender, characterName: fleerSlot.character.name, hp: 0 });
      lines.push("");
      lines.push(`\uD83D\uDC80 *${fleerSlot.character.name}* cay\u00F3`);
      return ctx.reply(box("\uD83C\uDFC3 HUIDA", lines));
    }

    lines.push("");
    lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
    const nextSlot = session.currentTurnCharId === session.challenger.characterId ? session.challenger : session.defender;
    const nextOpp = session.currentTurnCharId === session.challenger.characterId ? session.defender : session.challenger;
    const situCtx = buildSituationalCtx(nextSlot, nextOpp, session.distance);
    lines.push(formatActionMenu(pursuerSlot.character.name, session, situCtx));

    return ctx.reply(box("\uD83C\uDFC3 HUIDA", lines));
  },
};
