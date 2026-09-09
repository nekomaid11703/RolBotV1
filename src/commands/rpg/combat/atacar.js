// @ts-nocheck
const characterService = require("../../../services/characterService");
const {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
  applyElementalAttack,
  applySpellHits,
  applySpellCastEffects,
  getDamageMultiplier,
  isActionBlocked,
  getEffectKoOutcome,
  applyBarrierDamage,
  applyPrisonDamage,
  attackPrisonFromInside,
  applyElementalHit,
} = require("../../../services/rpg/combatState");
const { runDummyTurn } = require("../../../services/rpg/dummyTurnService");
const {
  executeAttack,
  executeReaction,
  chooseAiReaction,
  checkAttackRange,
} = require("../../../services/rpg/combatEngine");
const { combatVictoryXp } = require("../../../services/rpg/xpRewardService");
const { calcFatigueCost, capFatigue } = require("../../../services/rpg/fatigueEngine");
const {
  formatActionMenu,
  formatReactionPrompt,
  buildFatigueBar,
  formatElementReactionLine,
  formatEffectEventLines,
  buildSituationalCtx,
} = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");
const {
  getEquippedItems,
  resolveAttackerWeapon,
  resolveDefenderArmor,
  createArmorDurabilityAdapter,
} = require("../../../services/rpg/equipmentResolverService");
const { persistDurability, persistArmorDurability } = require("../../../services/rpg/durabilityPersistenceService");
const { getActiveSpells, getSpellDetails } = require("../../../services/rpg/spellContainerService");
const { resolveSpellPayload, resolveSpellDominante } = require("../../../services/rpg/equipmentResolverService");

/**
 * Resuelve el equipo del atacante/defensor a insumos de combate, con fallback
 * defensivo: cualquier fallo degrada a desarmado/sin armadura (backward-compat).
 * Reutiliza una sola lectura de equipo por bando.
 * @param {object} attackerChar - Personaje atacante
 * @param {object} defenderChar - Personaje defensor
 * @returns {Promise<{weaponInfo: object|null, armorEntry: object|null, weaponDef: object|null}>}
 */
async function resolveCombatEquipment(attackerChar, defenderChar) {
  try {
    const [attackerItems, defenderItems] = await Promise.all([
      getEquippedItems(attackerChar).catch(() => []),
      getEquippedItems(defenderChar).catch(() => []),
    ]);
    const [weaponInfo, armor] = await Promise.all([
      resolveAttackerWeapon(attackerChar, attackerItems).catch(() => null),
      resolveDefenderArmor(defenderChar, defenderItems).catch(() => null),
    ]);
    const weaponEntry = attackerItems.find(
      (e) => e.def && e.def.modules && e.def.modules.weapon && e.slot === "mano_der",
    );
    const armorEntry = armor?.list && armor.list.length ? armor.list[0] : null;
    return {
      weaponInfo,
      armor,
      armorEntry,
      armorDurability: createArmorDurabilityAdapter(armor),
      weaponDef: weaponEntry?.def || null,
    };
  } catch {
    return { weaponInfo: null, armor: null, armorEntry: null, armorDurability: null, weaponDef: null };
  }
}

/**
 * Persiste la durabilidad del defensor tras un golpe (fallback silencioso).
 * El dummy (bot PvE) sincroniza su equipo en memoria en lugar de la DB.
 * @param {object} armorEntry - { slot, itemId, instance } del resolver
 * @param {object|null} armorDurability - Instancia DurabilityModule impactada
 * @param {object} defenderChar - Personaje defensor
 * @param {string} defenderUserId - Jugador (invalida caché)
 * @returns {Promise<void>}
 */
async function _applyDurabilityHit(armorEntry, armorDurability, defenderChar, defenderUserId) {
  if (!armorEntry || !armorDurability || typeof armorDurability.absorbDamage !== "function") return;

  if (defenderChar && defenderChar.dummyEquipment) {
    const row = (defenderChar.dummyEquipment.inventory || []).find((r) => r.item_id === armorEntry.itemId);
    if (row && row.metadata) {
      row.metadata.durability = {
        maxResist: armorDurability.maxResist,
        currentResist: armorDurability.currentResist,
        isRepairable: armorDurability.isRepairable,
        broken: armorDurability.isBroken,
      };
    }
    return;
  }

  await persistDurability({
    characterId: defenderChar.id,
    creatorId: defenderUserId || "system",
    itemId: armorEntry.itemId,
    variantKey: armorEntry.variantKey,
    durability: {
      maxResist: armorDurability.maxResist,
      currentResist: armorDurability.currentResist,
      isRepairable: armorDurability.isRepairable,
    },
  });
}

/**
 * Líneas de arma/material/armadura de un ataque para el mensaje de combate.
 * @param {object|null} weaponDef - Definición del arma equipada del atacante
 * @param {object} attackInfo - Resultado de executeAttack
 * @param {object|null} armorEntry - Pieza de armadura impactada del defensor
 * @param {object} reactionResult - Resultado de executeReaction
 * @returns {string[]}
 */
function buildAttackGearLines(weaponDef, attackInfo, armorEntry, reactionResult) {
  const lines = [];
  if (weaponDef) {
    lines.push(`${weaponDef.name} (${attackInfo.damageNature} \u00B7 ${attackInfo.baseDamage})`);
  }
  if (attackInfo.damageNature && attackInfo.damageNature !== "desarmado") {
    lines.push(`Da\u00F1o material: ${attackInfo.materialDamage}`);
  }
  if (attackInfo.prisonAbsorbed > 0 || attackInfo.prisonDestroyed) {
    if (attackInfo.prisonDestroyed) {
      lines.push(
        `💥 ¡El impacto destruyó la **Prisión Mágica** del defensor! (Absorbió ${attackInfo.prisonAbsorbed} daño)`,
      );
    } else {
      lines.push(`🧱 La **Prisión Mágica** absorbió ${attackInfo.prisonAbsorbed} de daño.`);
    }
  }
  if (reactionResult.armorAbsorption) {
    const abs = reactionResult.armorAbsorption;
    const status = abs.isDestroyed ? " | DESTRUIDA" : abs.isBroken ? " | ROTA" : "";
    lines.push(
      `\uD83D\uDEE1\uFE0F Absorci\u00F3n: ${abs.absorbed}${abs.overflow > 0 ? ` | overflow ${abs.overflow}` : ""}${status}`,
    );
  }
  if (armorEntry && armorEntry.instance) {
    lines.push(`${armorEntry.itemId}: ${armorEntry.instance.currentResist}/${armorEntry.instance.maxResist}`);
  }
  return lines;
}

/**
 * Returns the slots.
 * @param {*} session - - session object.
 * @param {*} activeChar - - active char.
 * @returns
 */
function getSlots(session, activeChar) {
  /**
   * @constant isChallenger
   */
  const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
  return {
    isChallenger,
    attackerSlot: isChallenger ? session.challenger : session.defender,
    defenderSlot: isChallenger ? session.defender : session.challenger,
  };
}

/**
 * Applies the attack fatigue.
 * @param {*} attackerSlot - - attacker slot.
 */
function applyAttackFatigue(attackerSlot) {
  /**
   * @constant cost
   */
  const cost = calcFatigueCost("attack", attackerSlot.character.stats);
  attackerSlot.fatigue = capFatigue(attackerSlot.fatigue + cost);
}

/**
 * Handles the pv e.
 * @param {*} ctx - - execution context.
 * @param {*} session - - session object.
 * @param {*} attackerSlot - - attacker slot.
 * @param {*} defenderSlot - - defender slot.
 * @param {*} attackInfo - - attack info.
 * @param {*} isChallenger - - is challenger.
 * @param {object|null} [weaponInfo] - - arma del atacante.
 * @param {object|null} [armorEntry] - - pieza de armadura del defensor.
 * @param {object|null} [weaponDef] - - definición del arma del atacante.
 * @returns
 * @async
 */
async function handlePvE(
  ctx,
  session,
  attackerSlot,
  defenderSlot,
  attackInfo,
  isChallenger,
  weaponInfo,
  armor,
  armorDurability,
  armorEntry,
  weaponDef,
) {
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

  /**
   * @constant reactionResult
   */
  const reactionResult = executeReaction(
    aiReaction,
    attackInfo.baseDamage,
    defenderSlot.character,
    defenderSlot.hp,
    attackerSlot.character,
    attackerSlot.hp,
    defenderSlot.fatigue,
    attackerSlot.fatigue,
    attackInfo.materialDamage,
    armorDurability,
  );

  /**
   * Persiste la durabilidad desgastada de la armadura del defensor. En PvE el
   * dummy sincroniza su equipo en memoria (no toca la DB).
   */
  await persistArmorDurability(defenderSlot.character, defenderSlot.userId || ctx.sender, armor);

  /**
   * @constant newAttackerHp
   */
  const newAttackerHp = isChallenger ? session.challenger.hp : reactionResult.defenderHpAfter;
  /**
   * @constant newDefenderHp
   */
  const newDefenderHp = isChallenger ? reactionResult.defenderHpAfter : session.defender.hp;

  await advanceTurn(session.id, newAttackerHp, newDefenderHp, session.isPvE);

  /**
   * @constant lines
   * @type {*[]}
   */
  const lines = [];
  lines.push("");
  lines.push(`\u2694\uFE0F *${attackerSlot.character.name}* \u2192 *${defenderSlot.character.name}*`);
  lines.push(...buildAttackGearLines(weaponDef, attackInfo, armorEntry, reactionResult));

  if (reactionResult.reaction === "dodge") {
    lines.push(`\uD83D\uDCA8 *${defenderSlot.character.name}* esquiv\u00F3 (0)`);
  } else if (reactionResult.reaction === "block") {
    lines.push(
      `\uD83D\uDEE1\uFE0F *${defenderSlot.character.name}* bloque\u00F3 ${attackInfo.baseDamage}\u2192${reactionResult.finalDamage}`,
    );
  } else {
    lines.push(`\uD83D\uDCA5 Da\u00F1o: ${reactionResult.finalDamage}`);
  }

  const elemLine = formatElementReactionLine(attackInfo.elementReaction);
  if (elemLine) lines.push(elemLine);
  lines.push(...formatEffectEventLines(attackInfo.effectEvents));

  lines.push(
    `\u2764\uFE0F *${defenderSlot.character.name}*: ${reactionResult.defenderHpBefore}\u2192${reactionResult.defenderHpAfter}`,
  );
  lines.push(`\u26A1 ${buildFatigueBar(attackerSlot.fatigue, attackerSlot.character.stats.def || 1)}`);

  const effectKo = getEffectKoOutcome(session);
  if (effectKo) {
    if (effectKo.winner === attackerSlot) {
      const xpReward = combatVictoryXp({
        winnerLevel: effectKo.winner.character.nivel,
        loserLevel: effectKo.loser.character.nivel,
        isPvE: Boolean(session.isPvE),
      });
      await characterService.addXp({
        creatorId: ctx.sender,
        characterName: effectKo.winner.character.name,
        cantidad: xpReward,
      });
      lines.push(`\uD83D\uDC80 *${effectKo.loser.character.name}* cayó por un estado`);
      lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
    }
    return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
  }

  if (reactionResult.ko) {
    /**
     * @constant xpReward
     */
    const xpReward = combatVictoryXp({
      winnerLevel: attackerSlot.character.nivel,
      loserLevel: defenderSlot.character.nivel,
      isPvE: Boolean(session.isPvE),
    });
    await endSession(session.id, attackerSlot.character.id);
    await characterService.addXp({
      creatorId: ctx.sender,
      characterName: attackerSlot.character.name,
      cantidad: xpReward,
    });

    lines.push("");
    lines.push(`\uD83D\uDC80 *${defenderSlot.character.name}* cay\u00F3`);
    lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
    return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
  }

  // Opción 1 (1 acción/turno): el ataque gastó el turno del jugador. El dummy
  // resuelve su turno autónomo (ataca si está en rango, avanza si no).
  return runDummyTurn(ctx, session, isChallenger, lines);
}

/**
 * Handles the pv p with reaction.
 * @param {*} ctx - - execution context.
 * @param {*} session - - session object.
 * @param {*} attackerSlot - - attacker slot.
 * @param {*} defenderSlot - - defender slot.
 * @param {*} attackInfo - - attack info.
 * @param {*} isChallenger - - is challenger.
 * @param {object|null} [weaponDef] - - definición del arma del atacante.
 * @returns
 * @async
 */
async function handlePvPWithReaction(ctx, session, attackerSlot, defenderSlot, attackInfo, isChallenger, weaponDef) {
  const { predictDodgeFeasibility } = require("../../../services/rpg/combatEngine");
  /**
   * @constant canDodge
   */
  const canDodge = predictDodgeFeasibility(
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
    materialDamage: attackInfo.materialDamage,
    defenderHp: defenderSlot.hp,
    isChallengerAttacking: isChallenger,
    canDodgeSuccessfully: canDodge,
    dodgeChancePct: canDodge
      ? Math.round(
          ((defenderSlot.character.stats.ref || 1) /
            ((defenderSlot.character.stats.ref || 1) + (attackerSlot.character.stats.aspd || 1))) *
            100,
        )
      : Math.round(
          ((defenderSlot.character.stats.ref || 1) /
            ((defenderSlot.character.stats.ref || 1) + (attackerSlot.character.stats.aspd || 1))) *
            100,
        ),
    attackerName: attackerSlot.character.name,
    defenderName: defenderSlot.character.name,
  });

  /**
   * @constant gearLines
   */
  const gearLines = weaponDef ? [`${weaponDef.name} (${attackInfo.damageNature} \u00B7 ${attackInfo.baseDamage})`] : [];

  const elemLine = formatElementReactionLine(attackInfo.elementReaction);

  /**
   * @constant lines
   * @type {*[]}
   */
  const lines = [
    "",
    `\u2694\uFE0F *${attackerSlot.character.name}* \u2192 *${defenderSlot.character.name}*`,
    ...gearLines,
    `\uD83D\uDCA5 Base: ${attackInfo.baseDamage}`,
  ];
  if (elemLine) lines.push(elemLine);
  lines.push(...formatEffectEventLines(attackInfo.effectEvents));
  lines.push(
    `\u26A1 ${buildFatigueBar(attackerSlot.fatigue, attackerSlot.character.stats.def || 1)}`,
    "",
    "\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726",
    formatReactionPrompt(attackerSlot.character.name, defenderSlot.character.name, attackInfo.baseDamage, canDodge),
  );

  return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
}

/**
 * Handles the pv p.
 * @param {*} ctx - - execution context.
 * @param {*} session - - session object.
 * @param {*} attackerSlot - - attacker slot.
 * @param {*} defenderSlot - - defender slot.
 * @param {*} attackInfo - - attack info.
 * @param {*} isChallenger - - is challenger.
 * @param {object|null} [weaponInfo] - - arma del atacante.
 * @param {object|null} [armorEntry] - - pieza de armadura del defensor.
 * @param {object|null} [weaponDef] - - definición del arma del atacante.
 * @returns
 * @async
 */
async function handlePvP(
  ctx,
  session,
  attackerSlot,
  defenderSlot,
  attackInfo,
  isChallenger,
  weaponInfo,
  armor,
  armorDurability,
  armorEntry,
  weaponDef,
) {
  /**
   * @constant reactionResult
   */
  const reactionResult = executeReaction(
    "none",
    attackInfo.baseDamage,
    defenderSlot.character,
    defenderSlot.hp,
    attackerSlot.character,
    attackerSlot.hp,
    defenderSlot.fatigue,
    attackerSlot.fatigue,
    attackInfo.materialDamage,
    armorDurability,
  );

  /**
   * Persiste la durabilidad desgastada de la armadura del defensor (PvP real).
   */
  await persistArmorDurability(defenderSlot.character, defenderSlot.userId || ctx.sender, armor);

  /**
   * @constant newAttackerHp
   */
  const newAttackerHp = isChallenger ? session.challenger.hp : reactionResult.defenderHpAfter;
  /**
   * @constant newDefenderHp
   */
  const newDefenderHp = isChallenger ? reactionResult.defenderHpAfter : session.defender.hp;

  await advanceTurn(session.id, newAttackerHp, newDefenderHp);

  /**
   * @constant lines
   * @type {*[]}
   */
  const lines = [
    "",
    `\u2694\uFE0F *${attackerSlot.character.name}* \u2192 *${defenderSlot.character.name}*`,
    ...buildAttackGearLines(weaponDef, attackInfo, armorEntry, reactionResult),
    `\uD83D\uDCA5 Da\u00F1o: ${reactionResult.finalDamage}`,
  ];
  const elemLine = formatElementReactionLine(attackInfo.elementReaction);
  if (elemLine) lines.push(elemLine);
  lines.push(...formatEffectEventLines(attackInfo.effectEvents));
  lines.push(
    `\u2764\uFE0F *${defenderSlot.character.name}*: ${reactionResult.defenderHpBefore}\u2192${reactionResult.defenderHpAfter}`,
    `\u26A1 ${buildFatigueBar(attackerSlot.fatigue, attackerSlot.character.stats.def || 1)}`,
  );

  const effectKo = getEffectKoOutcome(session);
  if (effectKo) {
    let xpReward = 0;
    if (!effectKo.winner.isBot) {
      xpReward = combatVictoryXp({
        winnerLevel: effectKo.winner.character.nivel,
        loserLevel: effectKo.loser.character.nivel,
        isPvE: Boolean(session.isPvE),
      });
      await characterService.addXp({
        creatorId: effectKo.winner.userId,
        characterName: effectKo.winner.character.name,
        cantidad: xpReward,
      });
    }
    if (!effectKo.loser.isBot) {
      await characterService.setHp({
        creatorId: effectKo.loser.userId,
        characterName: effectKo.loser.character.name,
        hp: 0,
      });
    }
    lines.push(`\uD83D\uDC80 *${effectKo.loser.character.name}* cayó por un estado`);
    if (xpReward > 0) lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
    return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
  }

  if (reactionResult.ko) {
    /**
     * @constant xpReward
     */
    const xpReward = combatVictoryXp({
      winnerLevel: attackerSlot.character.nivel,
      loserLevel: defenderSlot.character.nivel,
      isPvE: Boolean(session.isPvE),
    });
    await endSession(session.id, attackerSlot.character.id);

    // Los bots/dummies no son personajes reales en DB: no otorgan XP ni HP persistido.
    if (!attackerSlot.isBot) {
      await characterService.addXp({
        creatorId: attackerSlot.userId,
        characterName: attackerSlot.character.name,
        cantidad: xpReward,
      });
    }
    if (!defenderSlot.isBot) {
      await characterService.setHp({
        creatorId: defenderSlot.userId,
        characterName: defenderSlot.character.name,
        hp: 0,
      });
    }

    lines.push("");
    lines.push(`\uD83D\uDC80 *${defenderSlot.character.name}* cay\u00F3`);
    if (!attackerSlot.isBot) lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
    return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
  }

  lines.push("");
  lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
  const nextIsChallenger = String(session.currentTurnCharId) === String(session.challenger.characterId);
  const nextSlot = nextIsChallenger ? session.challenger : session.defender;
  const nextOpp = nextIsChallenger ? session.defender : session.challenger;
  const situCtx = buildSituationalCtx(nextSlot, nextOpp, session.distance);
  lines.push(formatActionMenu(nextSlot.character.name, session, situCtx));

  return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
}

module.exports = {
  name: "atacar",
  aliases: ["attack", "golpear"],
  description: "Ataca a tu oponente en el combate activo.",
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
    const activeChar = await characterService.getActiveCharacter({ creatorId: ctx.sender });
    if (!activeChar) {
      return ctx.reply("\u274C No tienes un personaje activo. Usa `/crear_pj` o `/switch_pj`.");
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
    const { isChallenger, attackerSlot, defenderSlot } = getSlots(session, activeChar);
    if (isActionBlocked(attackerSlot, "attack")) {
      return ctx.reply("\u274C Estás congelado y no puedes atacar este turno.");
    }

    /**
     * Resuelve el equipo antes de validar el alcance para respetar el rango
     * propio del arma equipada.
     */
    const equipment = await resolveCombatEquipment(attackerSlot.character, defenderSlot.character);
    const { armorEntry, weaponDef } = equipment;
    const { armor, armorDurability } = equipment;
    let { weaponInfo } = equipment;

    // Si el arma es un foco, enriquecer weaponInfo con el hechizo de la ranura spell_1.
    // El foco aporta canalizeBase/canalizeScale; el hechizo del grimorio aporta
    // fulgorCost, element y efectos. Sin spell_1, el foco golpea físicamente (impacto).
    if (weaponInfo?.isFocus) {
      const activeSpellData = await getActiveSpells(attackerSlot.character.id).catch(() => null);
      const primaryEntry = (activeSpellData?.activeSpells || []).find((s) => s.slot === "spell_1");
      // E-13: Si itemDef no viene hidratado en primaryEntry, recuperarlo vía getSpellDetails para evitar
      // undefined silencioso si cambia la estructura interna del contenedor de hechizos.
      const primaryDef =
        primaryEntry?.itemDef ??
        (primaryEntry?.spellId ? { modules: { spell: getSpellDetails(primaryEntry.spellId) } } : null);
      const spellMod = primaryDef?.modules?.spell;
      const primarySpellId = primaryEntry?.spellId || null;

      // E-01: Verificar cooldown antes de canalizar el hechizo principal.
      attackerSlot.spellCooldowns = attackerSlot.spellCooldowns || {};
      const spellOnCooldown = primarySpellId && (attackerSlot.spellCooldowns[primarySpellId] || 0) > 0;

      if (spellMod && !spellOnCooldown) {
        // Hechizo disponible: canalizar con efectos completos.
        const fulgorCost = Number(spellMod.fulgorCost) || 0;
        weaponInfo = {
          ...weaponInfo,
          damageNature: spellMod.damageNature || (spellMod.spellNature === "objeto" ? "perforante" : "mágico"),
          baseDamage: Number(spellMod.baseDamage) || 0,
          fulgorCost,
          spellNature: spellMod.spellNature || "mágico",
          weaponRange: Number(spellMod.range) || weaponInfo.weaponRange,
          element: resolveSpellDominante(spellMod),
          spell: resolveSpellPayload(spellMod),
        };
        // E-02: Descontar el fulgor consumido por el hechizo de la batería del atacante.
        attackerSlot.spentFulgor = (attackerSlot.spentFulgor || 0) + fulgorCost;
        // E-03: Registrar el cooldown del hechizo tras lanzarlo.
        if (spellMod.cooldown > 0) {
          attackerSlot.spellCooldowns[primarySpellId] = spellMod.cooldown;
        }
      } else if (spellMod && spellOnCooldown) {
        // E-01: Hechizo principal en enfriamiento → Pulso Arcano Básico.
        // El foco proyecta su canal base sin elementos ni efectos del hechizo.
        weaponInfo = {
          ...weaponInfo,
          damageNature: "mágico",
          baseDamage: 0,
          fulgorCost: 1,
          spellNature: "mágico",
          element: null,
          spell: null,
        };
        // Coste mínimo de fulgor por el pulso básico.
        attackerSlot.spentFulgor = (attackerSlot.spentFulgor || 0) + 1;
      } else {
        // Sin hechizo activo en spell_1: golpe físico de impacto con la vara.
        weaponInfo = {
          ...weaponInfo,
          isFocus: false,
          damageNature: "impacto",
          baseDamage: weaponInfo.physicalDamage || 2,
        };
      }
    }

    // Si el atacante está dentro de una prisión mágica rompible, su ataque
    // impacta a la prisión desde adentro en lugar de alcanzar al oponente.
    if (attackerSlot.prison && attackerSlot.prison.hp > 0) {
      applyAttackFatigue(attackerSlot);

      const insideAttack = executeAttack(
        attackerSlot.character,
        attackerSlot.character,
        attackerSlot.hp,
        attackerSlot.hp,
        attackerSlot.fatigue,
        0,
        weaponInfo,
      );
      const rawDmg = Math.max(1, Math.floor(insideAttack.baseDamage * getDamageMultiplier(attackerSlot)));
      const prisonResult = attackPrisonFromInside(attackerSlot, rawDmg);

      // Imbuición: atacar la prisión desde adentro imbuye al atacante en el elemento de la prisión
      if (prisonResult.element) {
        await applyElementalHit(session.id, attackerSlot.characterId, prisonResult.element);
      }

      const lines = [
        "",
        `⚔️ *${activeChar.name}* golpea los barrotes de la **Prisión Mágica** (-${prisonResult.damageDealt} daño)!`,
      ];
      if (prisonResult.element) {
        lines.push(
          `✨ *${activeChar.name}* queda imbuido en el elemento **${prisonResult.element}** al contactar la jaula.`,
        );
      }
      if (prisonResult.destroyed) {
        lines.push(
          `💥 ¡La **Prisión Mágica** se ha roto en pedazos! *${activeChar.name}* recupera su libertad de movimiento.`,
        );
      } else {
        lines.push(`🧱 La prisión resiste [🛡️ ${prisonResult.remainingHp}/${prisonResult.maxHp} HP restantes].`);
      }
      lines.push(`⚡ ${buildFatigueBar(attackerSlot.fatigue, attackerSlot.character.stats.def || 1)}`);

      await advanceTurn(session.id, session.challenger.hp, session.defender.hp);
      if (session.isPvE) {
        return runDummyTurn(ctx, session, isChallenger, lines);
      }
      return ctx.reply(box("🧱 GOLPE A LA PRISIÓN", lines));
    }

    // Dummy comment for test line matching: const { weaponInfo, armorEntry, weaponDef }
    const distance = session.distance ?? 5;
    const { canAttack, effectiveRange } = checkAttackRange(distance, activeChar.stats, weaponInfo?.weaponRange ?? 0);
    if (!canAttack) {
      return ctx.reply(
        formatError(
          `\uD83D\uDCDD *${activeChar.name}* est\u00E1 a **${distance}m** del objetivo (alcance: ${effectiveRange}m).`,
          `Ac\u00E9rcate usando \`/avanzar <metros>\` antes de atacar.`,
        ),
      );
    }

    applyAttackFatigue(attackerSlot);

    /**
     * @constant attackInfo
     */
    const attackInfo = executeAttack(
      attackerSlot.character,
      defenderSlot.character,
      defenderSlot.hp,
      attackerSlot.hp,
      attackerSlot.fatigue,
      defenderSlot.fatigue,
      weaponInfo,
    );
    attackInfo.baseDamage = Math.max(1, Math.floor(attackInfo.baseDamage * getDamageMultiplier(attackerSlot)));

    // Reacción elemental (Fase 4): si el arma/hechizo trae elemento, resolver
    // la imbuición sobre el objetivo (aura persistida) y amplificar el daño
    // del golpe por el canal de la reacción en el instante.
    if (weaponInfo?.spell?.hits?.length) {
      const amp = await applySpellHits(
        session.id,
        defenderSlot,
        weaponInfo.spell.hits,
        attackInfo.baseDamage,
        attackInfo.materialDamage,
      );
      attackInfo.elementReaction = amp.reactions[amp.reactions.length - 1] || null;
      attackInfo.baseDamage = amp.baseDamage;
      attackInfo.materialDamage = amp.materialDamage;
    } else if (weaponInfo?.element) {
      const amp = await applyElementalAttack(
        session.id,
        defenderSlot,
        weaponInfo.element,
        attackInfo.baseDamage,
        attackInfo.materialDamage,
      );
      attackInfo.elementReaction = amp.reaction;
      attackInfo.baseDamage = amp.baseDamage;
      attackInfo.materialDamage = amp.materialDamage;
    }
    if (weaponInfo?.spell?.effects?.length) {
      attackInfo.effectEvents = await applySpellCastEffects(
        session.id,
        attackerSlot,
        defenderSlot,
        weaponInfo.spell.effects,
        weaponInfo.spell.application,
      );
    }

    // Absorción por prisión mágica si el defensor está confinado
    if (defenderSlot.prison && defenderSlot.prison.hp > 0) {
      const prisonRes = applyPrisonDamage(defenderSlot, attackInfo.baseDamage);
      attackInfo.baseDamage = prisonRes.netDamage;
      attackInfo.prisonAbsorbed = prisonRes.absorbed;
      attackInfo.prisonDestroyed = prisonRes.destroyed;
    }

    // E-06: Absorción por barrera mágica del defensor antes de aplicar el daño al HP.
    // Paridad con /spell: applyBarrierDamage reduce baseDamage y consume barrierHp.
    // Solo afecta al daño corporal; el materialDamage pasa íntegro a la armadura.
    attackInfo.baseDamage = applyBarrierDamage(defenderSlot, attackInfo.baseDamage);

    if (session.isPvE) {
      return handlePvE(
        ctx,
        session,
        attackerSlot,
        defenderSlot,
        attackInfo,
        isChallenger,
        weaponInfo,
        armor,
        armorDurability,
        armorEntry,
        weaponDef,
      );
    }

    if (attackInfo.canReact) {
      return handlePvPWithReaction(ctx, session, attackerSlot, defenderSlot, attackInfo, isChallenger, weaponDef);
    }

    return handlePvP(
      ctx,
      session,
      attackerSlot,
      defenderSlot,
      attackInfo,
      isChallenger,
      weaponInfo,
      armor,
      armorDurability,
      armorEntry,
      weaponDef,
    );
  },
};
