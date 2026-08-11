// @ts-nocheck
const { getActiveCharacter, addXp, setHp } = require("../../../services/characterService");
const {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
} = require("../../../services/rpg/combatState");
const { runDummyTurn } = require("../../../services/rpg/dummyTurnService");
const {
  executeAttack,
  executeReaction,
  chooseAiReaction,
  calculateXpReward,
  checkAttackRange,
} = require("../../../services/rpg/combatEngine");
const { calcFatigueCost, capFatigue } = require("../../../services/rpg/fatigueEngine");
const { formatActionMenu, formatReactionPrompt, buildFatigueBar } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");
const {
  getEquippedItems,
  resolveAttackerWeapon,
  resolveDefenderArmor,
} = require("../../../services/rpg/equipmentResolverService");
const { persistDurability } = require("../../../services/rpg/durabilityPersistenceService");

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
    return { weaponInfo, armorEntry, weaponDef: weaponEntry?.def || null };
  } catch {
    return { weaponInfo: null, armorEntry: null, weaponDef: null };
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
async function applyDurabilityHit(armorEntry, armorDurability, defenderChar, defenderUserId) {
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
    armorEntry?.instance || null,
  );

  /**
   * Persiste la durabilidad desgastada de la armadura del defensor. En PvE el
   * dummy sincroniza su equipo en memoria (no toca la DB).
   */
  await applyDurabilityHit(
    armorEntry,
    armorEntry?.instance || null,
    defenderSlot.character,
    defenderSlot.userId || ctx.sender,
  );

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

  lines.push(
    `\u2764\uFE0F *${defenderSlot.character.name}*: ${reactionResult.defenderHpBefore}\u2192${reactionResult.defenderHpAfter}`,
  );
  lines.push(`\u26A1 ${buildFatigueBar(attackerSlot.fatigue, attackerSlot.character.stats.def || 1)}`);

  if (reactionResult.ko) {
    /**
     * @constant xpReward
     */
    const xpReward = calculateXpReward(defenderSlot.character.nivel || 1, true);
    await endSession(session.id, attackerSlot.character.id);
    await addXp({ creatorId: ctx.sender, characterName: attackerSlot.character.name, cantidad: xpReward });

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
  const { evaluateDodgeFeasibility } = require("../../../services/rpg/combatEngine");
  /**
   * @constant canDodge
   */
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

  /**
   * @constant gearLines
   */
  const gearLines = weaponDef ? [`${weaponDef.name} (${attackInfo.damageNature} \u00B7 ${attackInfo.baseDamage})`] : [];

  /**
   * @constant lines
   * @type {*[]}
   */
  const lines = [
    "",
    `\u2694\uFE0F *${attackerSlot.character.name}* \u2192 *${defenderSlot.character.name}*`,
    ...gearLines,
    `\uD83D\uDCA5 Base: ${attackInfo.baseDamage}`,
    `\u26A1 ${buildFatigueBar(attackerSlot.fatigue, attackerSlot.character.stats.def || 1)}`,
    "",
    "\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726",
    formatReactionPrompt(attackerSlot.character.name, defenderSlot.character.name, attackInfo.baseDamage, canDodge),
  ];

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
    armorEntry?.instance || null,
  );

  /**
   * Persiste la durabilidad desgastada de la armadura del defensor (PvP real).
   */
  await applyDurabilityHit(
    armorEntry,
    armorEntry?.instance || null,
    defenderSlot.character,
    defenderSlot.userId || ctx.sender,
  );

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
    `\u2764\uFE0F *${defenderSlot.character.name}*: ${reactionResult.defenderHpBefore}\u2192${reactionResult.defenderHpAfter}`,
    `\u26A1 ${buildFatigueBar(attackerSlot.fatigue, attackerSlot.character.stats.def || 1)}`,
  ];

  if (reactionResult.ko) {
    /**
     * @constant xpReward
     */
    const xpReward = calculateXpReward(defenderSlot.character.nivel || 1, true);
    await endSession(session.id, attackerSlot.character.id);
    await addXp({
      creatorId: attackerSlot.userId,
      characterName: attackerSlot.character.name,
      cantidad: xpReward,
    });
    await setHp({ creatorId: defenderSlot.userId, characterName: defenderSlot.character.name, hp: 0 });

    lines.push("");
    lines.push(`\uD83D\uDC80 *${defenderSlot.character.name}* cay\u00F3`);
    lines.push(`\uD83C\uDFC6 +${xpReward} XP`);
    return ctx.reply(box("\u2694\uFE0F ATAQUE", lines));
  }

  lines.push("");
  lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
  lines.push(formatActionMenu(defenderSlot.character.name));

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
    const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
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

    /**
     * Resuelve el equipo antes de validar el alcance para respetar el rango
     * propio del arma equipada.
     */
    const { weaponInfo, armorEntry, weaponDef } = await resolveCombatEquipment(
      attackerSlot.character,
      defenderSlot.character,
    );

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

    if (session.isPvE) {
      return handlePvE(
        ctx,
        session,
        attackerSlot,
        defenderSlot,
        attackInfo,
        isChallenger,
        weaponInfo,
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
      armorEntry,
      weaponDef,
    );
  },
};
