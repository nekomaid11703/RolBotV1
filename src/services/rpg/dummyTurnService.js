// @ts-nocheck
const { box } = require("../../utils/boxUtils");
const { setHp } = require("../characterService");
const { checkAttackRange, executeAttack, executeReaction, evaluateDodgeFeasibility } = require("./combatEngine");
const {
  capFatigue,
  calculateMovementFatigue,
  getMovementRange,
  getCastCost,
  getCastEfficiency,
} = require("./fatigueEngine");
const {
  advanceTurn,
  setPendingReaction,
  updateDistance,
  endSession,
  applyElementalAttack,
  applySpellHits,
  applySpellCastEffects,
  getDamageMultiplier,
  isActionBlocked,
  getEffectKoOutcome,
} = require("./combatState");
const {
  resolveAttackerWeapon,
  resolveDefenderArmor,
  createArmorDurabilityAdapter,
} = require("./equipmentResolverService");
const { persistArmorDurability } = require("./durabilityPersistenceService");
const {
  formatReactionPrompt,
  buildFatigueBar,
  formatElementReactionLine,
  formatEffectEventLines,
} = require("./combatMessages");

/**
 * Devuelve los slots de jugador y dummy según quién sea el retador.
 * @param {*} session - Sesión de combate
 * @param {boolean} playerIsChallenger - true si el jugador es el retador
 * @returns {{ playerSlot: object, dummySlot: object }}
 */
function getSlots(session, playerIsChallenger) {
  return {
    playerSlot: playerIsChallenger ? session.challenger : session.defender,
    dummySlot: playerIsChallenger ? session.defender : session.challenger,
  };
}

/**
 * Ejecuta el ataque del dummy en su turno (Opción 1: en rango → atacar).
 * Si el jugador puede reaccionar, se queda en waiting_reaction; si no, se
 * aplica el daño y el turno vuelve al jugador.
 * @param {*} ctx - Contexto del comando
 * @param {*} session - Sesión de combate
 * @param {*} playerSlot - Slot del jugador
 * @param {*} dummySlot - Slot del dummy
 * @param {boolean} playerIsChallenger - true si el jugador es el retador
 * @param {object|null} dummyWeapon - Arma resuelta del dummy
 * @param {string[]} lines - Líneas previas a añadir al box
 * @returns {Promise<any>} Resultado de ctx.reply
 */
async function executeDummyAttack(ctx, session, playerSlot, dummySlot, playerIsChallenger, dummyWeapon, lines) {
  const armor = await resolveDefenderArmor(playerSlot.character).catch(() => null);
  const dummyAttack = executeAttack(
    dummySlot.character,
    playerSlot.character,
    playerSlot.hp,
    dummySlot.hp,
    dummySlot.fatigue,
    playerSlot.fatigue,
    dummyWeapon,
  );

  // Lanzamiento mágico (módulo spell): aplicar batería de fulgor y dilución.
  // El arma resuelta con `fulgorCost > 0` es un hechizo: el daño escala por la
  // eficiencia del lanzamiento (getCastEfficiency) y la batería se descuenta.
  const costeHechizo = dummyWeapon?.fulgorCost
    ? getCastCost(dummySlot.character.stats.d_fulgor || 0, dummyWeapon.fulgorCost)
    : 0;
  const esHechizo = costeHechizo > 0;
  let baseDamage = dummyAttack.baseDamage;
  let materialDamage = dummyAttack.materialDamage;
  let fulgorGastado = 0;

  if (esHechizo) {
    const eff = getCastEfficiency(dummySlot.fulgor ?? 0, costeHechizo);
    baseDamage = Math.max(1, Math.floor(baseDamage * eff));
    fulgorGastado = Math.min(costeHechizo, dummySlot.fulgor ?? 0);
    dummySlot.fulgor = Math.max(0, (dummySlot.fulgor ?? 0) - fulgorGastado);
  }
  baseDamage = Math.max(1, Math.floor(baseDamage * getDamageMultiplier(dummySlot)));

  // Reacción elemental (Fase 4): si el ataque trae elemento, resolver la
  // imbuición sobre el objetivo y amplificar el daño por el canal de la
  // reacción en el instante (sesión persistida en applyElementalHit).
  let elementReaction = null;
  if (dummyWeapon?.spell?.hits?.length) {
    const amp = await applySpellHits(session.id, playerSlot, dummyWeapon.spell.hits, baseDamage, materialDamage);
    elementReaction = amp.reactions[amp.reactions.length - 1] || null;
    baseDamage = amp.baseDamage;
    materialDamage = amp.materialDamage;
  } else if (dummyAttack.element || dummyWeapon?.element) {
    const amp = await applyElementalAttack(
      session.id,
      playerSlot,
      dummyWeapon?.element || dummyAttack.element,
      baseDamage,
      materialDamage,
    );
    elementReaction = amp.reaction;
    baseDamage = amp.baseDamage;
    materialDamage = amp.materialDamage;
  }
  let effectEvents = [];
  if (dummyWeapon?.spell?.effects?.length) {
    effectEvents = await applySpellCastEffects(
      session.id,
      dummySlot,
      playerSlot,
      dummyWeapon.spell.effects,
      dummyWeapon.spell.application,
    );
  }

  if (dummyAttack.canReact) {
    const canDodge = evaluateDodgeFeasibility(
      playerSlot.character.stats,
      playerSlot.hp,
      dummySlot.character.stats,
      dummySlot.hp,
      playerSlot.fatigue,
      dummySlot.fatigue,
      playerSlot.character.stats.def || 0,
      dummySlot.character.stats.def || 0,
    );

    await setPendingReaction(session.id, {
      attackerChar: dummySlot.character,
      defenderChar: playerSlot.character,
      attackerUserId: dummySlot.userId,
      defenderUserId: playerSlot.userId,
      baseDamage,
      materialDamage,
      defenderHp: playerSlot.hp,
      isChallengerAttacking: !playerIsChallenger,
      canDodgeSuccessfully: canDodge,
    });

    lines.push("");
    lines.push(`\uD83E\uDD16 *${dummySlot.character.name}* ${esHechizo ? "lanza" : "ataca"}`);
    lines.push(`\uD83D\uDCA5 Base: ${baseDamage}`);
    if (esHechizo) lines.push(`\uD83D\uDD0B Fulgor: ${fulgorGastado} usado`);
    const elemLine = formatElementReactionLine(elementReaction);
    if (elemLine) lines.push(elemLine);
    lines.push(...formatEffectEventLines(effectEvents));
    lines.push("");
    lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
    lines.push(formatReactionPrompt(dummySlot.character.name, playerSlot.character.name, baseDamage, canDodge));
    return ctx.reply(box("\uD83E\uDD16 TURNO DEL DUMMY", lines));
  }

  const dummyReaction = executeReaction(
    "none",
    baseDamage,
    playerSlot.character,
    playerSlot.hp,
    dummySlot.character,
    dummySlot.hp,
    playerSlot.fatigue,
    dummySlot.fatigue,
    materialDamage,
    createArmorDurabilityAdapter(armor),
  );
  await persistArmorDurability(playerSlot.character, playerSlot.userId || ctx.sender, armor);

  const playerHpAfter = dummyReaction.defenderHpAfter;
  const newChallengerHp = playerIsChallenger ? playerHpAfter : session.challenger.hp;
  const newDefenderHp = playerIsChallenger ? session.defender.hp : playerHpAfter;
  await advanceTurn(session.id, newChallengerHp, newDefenderHp);
  const effectKo = getEffectKoOutcome(session);

  lines.push("");
  lines.push(`\uD83E\uDD16 *${dummySlot.character.name}* ataca`);
  lines.push(`\uD83D\uDCA5 Da\u00F1o: ${dummyReaction.finalDamage}`);
  const elemLine = formatElementReactionLine(elementReaction);
  if (elemLine) lines.push(elemLine);
  lines.push(...formatEffectEventLines(effectEvents));
  lines.push(
    `\u2764\uFE0F *${playerSlot.character.name}*: ${dummyReaction.defenderHpBefore}\u2192${dummyReaction.defenderHpAfter}`,
  );
  lines.push(`\u26A1 ${buildFatigueBar(dummySlot.fatigue, dummySlot.character.stats.def || 1)}`);
  if (effectKo) {
    lines.push(`\uD83D\uDC80 *${effectKo.loser.character.name}* cayó por un estado`);
    return ctx.reply(box("\uD83E\uDD16 TURNO DEL DUMMY", lines));
  }

  if (dummyReaction.ko) {
    await endSession(session.id, dummySlot.character.id);
    await setHp({ creatorId: playerSlot.userId || ctx.sender, characterName: playerSlot.character.name, hp: 0 });

    lines.push("");
    lines.push(`\uD83D\uDC80 *${playerSlot.character.name}* cay\u00F3`);
    return ctx.reply(box("\uD83E\uDD16 TURNO DEL DUMMY", lines));
  }

  const nextTurnCharName =
    session.currentTurnCharId === session.challenger.characterId
      ? session.challenger.character.name
      : session.defender.character.name;
  lines.push("");
  lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
  lines.push(require("./combatMessages").formatActionMenu(nextTurnCharName));

  return ctx.reply(box("\uD83E\uDD16 TURNO DEL DUMMY", lines));
}

/**
 * Ejecuta el movimiento del dummy en su turno (Opción 1: fuera de rango → solo
 * mover, sin atacar). Consume el turno del dummy.
 * @param {*} ctx - Contexto del comando
 * @param {*} session - Sesión de combate
 * @param {*} playerSlot - Slot del jugador
 * @param {*} dummySlot - Slot del dummy
 * @param {boolean} playerIsChallenger - true si el jugador es el retador
 * @param {string[]} lines - Líneas previas a añadir al box
 * @returns {Promise<any>} Resultado de ctx.reply
 */
async function executeDummyAdvance(ctx, session, playerSlot, dummySlot, playerIsChallenger, lines) {
  const distance = session.distance ?? 5;
  const maxMove = getMovementRange(dummySlot.character.stats.mspd || 0);
  const moveMeters = Math.min(maxMove, Math.max(0, distance));
  const newDistance = Math.max(0, distance - moveMeters);
  const fatigueCost = calculateMovementFatigue(moveMeters);
  dummySlot.fatigue = capFatigue(dummySlot.fatigue + fatigueCost);

  await updateDistance(session.id, newDistance);
  await advanceTurn(session.id, session.challenger.hp, session.defender.hp);

  lines.push("");
  lines.push(
    `\uD83D\uDEB6 *${dummySlot.character.name}* avanza ${moveMeters}m  |  Distancia: ${newDistance}m  |  Fatiga: +${fatigueCost}`,
  );
  if (newDistance <= 0) {
    lines.push(`\u26A0\uFE0F *${dummySlot.character.name}* qued\u00F3 a la distancia cero.`);
  }
  lines.push("");
  lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
  lines.push(require("./combatMessages").formatActionMenu(playerSlot.character.name));

  return ctx.reply(box("\uD83E\uDD16 TURNO DEL DUMMY", lines));
}

/**
 * Ejecuta el turno completo del dummy (Opción 1 del modelo de movimiento):
 * en rango al inicio → ataca; fuera de rango → solo avanza consumiendo su turno.
 * @param {*} ctx - Contexto del comando
 * @param {*} session - Sesión de combate (el turno YA es del dummy)
 * @param {boolean} playerIsChallenger - true si el jugador es el retador
 * @param {string[]} [lines] - Líneas previas al box
 * @returns {Promise<any>} Resultado de ctx.reply
 */
async function runDummyTurn(ctx, session, playerIsChallenger, lines = []) {
  const { playerSlot, dummySlot } = getSlots(session, playerIsChallenger);
  const distance = session.distance ?? 5;

  if (isActionBlocked(dummySlot, "attack") || isActionBlocked(dummySlot, "move")) {
    await advanceTurn(session.id, session.challenger.hp, session.defender.hp);
    lines.push(`\u2744\uFE0F *${dummySlot.character.name}* está congelado y pierde el turno.`);
    return ctx.reply(box("\uD83E\uDD16 TURNO DEL DUMMY", lines));
  }

  const dummyWeapon = await resolveAttackerWeapon(dummySlot.character).catch(() => null);
  const { canAttack } = checkAttackRange(distance, dummySlot.character.stats, dummyWeapon?.weaponRange ?? 0);

  if (canAttack) {
    return executeDummyAttack(ctx, session, playerSlot, dummySlot, playerIsChallenger, dummyWeapon, lines);
  }
  return executeDummyAdvance(ctx, session, playerSlot, dummySlot, playerIsChallenger, lines);
}

module.exports = {
  runDummyTurn,
  executeDummyAttack,
  executeDummyAdvance,
};
