// @ts-nocheck
const { box } = require("../../utils/boxUtils");
const { setHp } = require("../characterService");
const {
  checkAttackRange,
  executeAttack,
  executeReaction,
  evaluateDodgeFeasibility,
} = require("./combatEngine");
const {
  capFatigue,
  calculateMovementFatigue,
  getMovementRange,
} = require("./fatigueEngine");
const {
  advanceTurn,
  setPendingReaction,
  updateDistance,
  endSession,
} = require("./combatState");
const { resolveAttackerWeapon } = require("./equipmentResolverService");
const { formatReactionPrompt, buildFatigueBar } = require("./combatMessages");

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
  const dummyAttack = executeAttack(
    dummySlot.character,
    playerSlot.character,
    playerSlot.hp,
    dummySlot.hp,
    dummySlot.fatigue,
    playerSlot.fatigue,
    dummyWeapon,
  );

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
      baseDamage: dummyAttack.baseDamage,
      defenderHp: playerSlot.hp,
      isChallengerAttacking: !playerIsChallenger,
      canDodgeSuccessfully: canDodge,
    });

    lines.push("");
    lines.push(`\uD83E\uDD16 *${dummySlot.character.name}* ataca`);
    lines.push(`\uD83D\uDCA5 Base: ${dummyAttack.baseDamage}`);
    lines.push("");
    lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
    lines.push(
      formatReactionPrompt(dummySlot.character.name, playerSlot.character.name, dummyAttack.baseDamage, canDodge),
    );
    return ctx.reply(box("\uD83E\uDD16 TURNO DEL DUMMY", lines));
  }

  const dummyReaction = executeReaction(
    "none",
    dummyAttack.baseDamage,
    playerSlot.character,
    playerSlot.hp,
    dummySlot.character,
    dummySlot.hp,
    playerSlot.fatigue,
    dummySlot.fatigue,
  );

  const playerHpAfter = dummyReaction.defenderHpAfter;
  const newChallengerHp = playerIsChallenger ? playerHpAfter : session.challenger.hp;
  const newDefenderHp = playerIsChallenger ? session.defender.hp : playerHpAfter;
  await advanceTurn(session.id, newChallengerHp, newDefenderHp);

  lines.push("");
  lines.push(`\uD83E\uDD16 *${dummySlot.character.name}* ataca`);
  lines.push(`\uD83D\uDCA5 Da\u00F1o: ${dummyReaction.finalDamage}`);
  lines.push(
    `\u2764\uFE0F *${playerSlot.character.name}*: ${dummyReaction.defenderHpBefore}\u2192${dummyReaction.defenderHpAfter}`,
  );
  lines.push(`\u26A1 ${buildFatigueBar(dummySlot.fatigue, dummySlot.character.stats.def || 1)}`);

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

  const dummyWeapon = await resolveAttackerWeapon(dummySlot.character).catch(() => null);
  const { canAttack } = checkAttackRange(
    distance,
    dummySlot.character.stats,
    dummyWeapon?.weaponRange ?? 0,
  );

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
