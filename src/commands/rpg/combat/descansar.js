const { getActiveCharacter, setHp } = require("../../../services/characterService");
const {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
  getEffectKoOutcome,
} = require("../../../services/rpg/combatState");
const { executeAttack, executeReaction, evaluateDodgeFeasibility } = require("../../../services/rpg/combatEngine");
const { calcFatigueRecovery, capFatigue } = require("../../../services/rpg/fatigueEngine");
const { formatActionMenu, formatReactionPrompt, buildFatigueBar, buildSituationalCtx } = require("../../../services/rpg/combatMessages");
const { box } = require("../../../utils/boxUtils");
const {
  resolveAttackerWeapon,
  resolveDefenderArmor,
  createArmorDurabilityAdapter,
} = require("../../../services/rpg/equipmentResolverService");
const { persistArmorDurability } = require("../../../services/rpg/durabilityPersistenceService");

async function getRestContext(ctx) {
  const activeChar = await getActiveCharacter({ creatorId: ctx.sender });
  if (!activeChar) return { error: "❌ No tienes un personaje activo." };

  const session = findSessionByCharacter(activeChar.id);
  if (!session) {
    const userSession = findSessionByUser(ctx.sender);
    if (userSession) {
      const charInCombatName =
        userSession.challenger.userId === ctx.sender
          ? userSession.challenger.character.name
          : userSession.defender.character.name;
      return {
        error:
          `\u2694\uFE0F Tu personaje activo (**${activeChar.name}**) no est\u00E1 en combate.\n\n` +
          `\uD83D\uDCA1 Tu personaje **${charInCombatName}** tiene un combate activo.\n` +
          `Usa \`/switch_pj ${charInCombatName}\` para retomar su turno.`,
      };
    }
    return { error: "\u274C No est\u00E1s en combate. Usa `/retar @usuario` o `/retar dummy`." };
  }

  if (session.status === "waiting_reaction") {
    return { error: "\u274C Hay ataque pendiente. Usa `/esquivar` o `/bloquear`." };
  }

  if (String(session.currentTurnCharId) !== String(activeChar.id)) {
    return { error: "\u274C No es tu turno. Espera." };
  }

  const isChallenger = String(session.challenger.characterId) === String(activeChar.id);
  const resterSlot = isChallenger ? session.challenger : session.defender;
  const opponentSlot = isChallenger ? session.defender : session.challenger;

  return { session, activeChar, isChallenger, resterSlot, opponentSlot };
}

/**
 * Calcula la recuperación de Fulgor en un turno de descanso.
 * Recupera base + (d_fulgor / 5), con mínimo 2 y máximo 20.
 * @param {object} stats - Stats del personaje
 * @param {number} currentSpent - Fulgor ya gastado
 * @param {number} maxFulgor - Máximo de Fulgor disponible
 * @returns {{recovered: number, newSpent: number}}
 */
function calcFulgorRecovery(stats, currentSpent, maxFulgor) {
  if (currentSpent <= 0) return { recovered: 0, newSpent: 0 };
  const base = 2 + Math.floor((stats.d_fulgor || 0) / 5);
  const recovered = Math.min(Math.min(base, 20), currentSpent);
  return { recovered, newSpent: Math.max(0, currentSpent - recovered) };
}

function buildRestLines(resterSlot, recovery, fulgorRecovered) {
  const lines = [];
  lines.push("");
  lines.push(`💤 *${resterSlot.character.name}* descansa y medita`);
  lines.push(`⚡ Fatiga -${recovery}  |  ✨ Fulgor +${fulgorRecovered}`);
  lines.push(`Fat ${buildFatigueBar(resterSlot.fatigue, resterSlot.character.stats.def || 1)}`);
  return lines;
}

function buildDummyAttackLines(lines, opponentSlot, resterSlot, dummyAttack) {
  lines.push("");
  lines.push(`\uD83E\uDD16 *${opponentSlot.character.name}* ataca (${dummyAttack.baseDamage})`);
  return lines;
}

function buildKoLines(lines, resterSlot) {
  lines.push("");
  lines.push(`\uD83D\uDC80 *${resterSlot.character.name}* cay\u00F3`);
  return lines;
}

function buildDivider(lines) {
  lines.push("");
  lines.push("\u2726 \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \u2726");
}

async function handlePvECounterattack(ctx, session, resterSlot, opponentSlot, isChallenger, lines) {
  const [weaponInfo, armor] = await Promise.all([
    resolveAttackerWeapon(opponentSlot.character).catch(() => null),
    resolveDefenderArmor(resterSlot.character).catch(() => null),
  ]);
  const dummyAttack = executeAttack(
    opponentSlot.character,
    resterSlot.character,
    resterSlot.hp,
    opponentSlot.hp,
    opponentSlot.fatigue,
    resterSlot.fatigue,
    weaponInfo,
  );

  if (dummyAttack.canReact) {
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

    await advanceTurn(session.id, resterSlot.hp, opponentSlot.hp);

    await setPendingReaction(session.id, {
      attackerChar: opponentSlot.character,
      defenderChar: resterSlot.character,
      attackerUserId: opponentSlot.userId,
      defenderUserId: resterSlot.userId,
      baseDamage: dummyAttack.baseDamage,
      materialDamage: dummyAttack.materialDamage,
      defenderHp: resterSlot.hp,
      isChallengerAttacking: !isChallenger,
      canDodgeSuccessfully: canDodge,
    });

    buildDummyAttackLines(lines, opponentSlot, resterSlot, dummyAttack);
    buildDivider(lines);
    lines.push(
      formatReactionPrompt(opponentSlot.character.name, resterSlot.character.name, dummyAttack.baseDamage, canDodge),
    );

    return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
  }

  const dummyReaction = executeReaction(
    "none",
    dummyAttack.baseDamage,
    resterSlot.character,
    resterSlot.hp,
    opponentSlot.character,
    opponentSlot.hp,
    resterSlot.fatigue,
    opponentSlot.fatigue,
    dummyAttack.materialDamage,
    createArmorDurabilityAdapter(armor),
  );
  await persistArmorDurability(resterSlot.character, resterSlot.userId || ctx.sender, armor);

  const finalAttackerHp = isChallenger ? dummyReaction.defenderHpAfter : opponentSlot.hp;
  const finalDefenderHp = isChallenger ? opponentSlot.hp : dummyReaction.defenderHpAfter;

  await advanceTurn(session.id, finalAttackerHp, finalDefenderHp);
  const effectKo = getEffectKoOutcome(session);

  buildDummyAttackLines(lines, opponentSlot, resterSlot, dummyAttack);
  lines.push(`\uD83D\uDCA5 Da\u00F1o: ${dummyReaction.finalDamage}`);
  lines.push(
    `\u2764\uFE0F *${resterSlot.character.name}*: ${dummyReaction.defenderHpBefore}\u2192${dummyReaction.defenderHpAfter}`,
  );
  if (effectKo) {
    lines.push(`\uD83D\uDC80 *${effectKo.loser.character.name}* cayó por un estado`);
    return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
  }

  if (dummyReaction.ko) {
    buildKoLines(lines, resterSlot);
    await endSession(session.id, opponentSlot.character.id);
    await setHp({ creatorId: ctx.sender, characterName: resterSlot.character.name, hp: 0 });
    return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
  }

  buildDivider(lines);
  lines.push(formatActionMenu(resterSlot.character.name));
  return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
}

async function handlePvPRest(ctx, session, resterSlot, opponentSlot, lines) {
  await advanceTurn(session.id, resterSlot.hp, opponentSlot.hp);

  buildDivider(lines);
  const nextTurnCharName =
    session.currentTurnCharId === session.challenger.characterId
      ? session.challenger.character.name
      : session.defender.character.name;
  const nextSlot = session.currentTurnCharId === session.challenger.characterId ? session.challenger : session.defender;
  const nextOpp = session.currentTurnCharId === session.challenger.characterId ? session.defender : session.challenger;
  const situCtx = buildSituationalCtx(nextSlot, nextOpp, session.distance);
  lines.push(formatActionMenu(nextTurnCharName, session, situCtx));

  return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
}

module.exports = {
  name: "descansar",
  aliases: ["rest", "recuperar", "respirar", "meditar"],
  description: "Recupera fatiga Y Fulgor saltándote tu turno. Más efectivo cuanto más especializado estés.",
  category: "rpg",

  async execute(ctx) {
    const restCtx = await getRestContext(ctx);
    if (restCtx.error) return ctx.reply(restCtx.error);

    const recovery = calcFatigueRecovery(
      "rest",
      restCtx.resterSlot.fatigue,
      restCtx.resterSlot.character.stats.def || 1,
    );
    restCtx.resterSlot.fatigue = capFatigue(restCtx.resterSlot.fatigue - recovery);

    // Recuperar Fulgor (meditación integrada)
    const maxFulgor = Math.min(100, Math.max(10, (restCtx.resterSlot.character.stats?.fulgor || 1) * 2));
    const currentSpent = restCtx.resterSlot.spentFulgor || 0;
    const { recovered: fulgorRecovered, newSpent } = calcFulgorRecovery(
      restCtx.resterSlot.character.stats,
      currentSpent,
      maxFulgor,
    );
    restCtx.resterSlot.spentFulgor = newSpent;

    const lines = buildRestLines(restCtx.resterSlot, recovery, fulgorRecovered);

    if (restCtx.session.isPvE) {
      return handlePvECounterattack(
        ctx,
        restCtx.session,
        restCtx.resterSlot,
        restCtx.opponentSlot,
        restCtx.isChallenger,
        lines,
      );
    }

    return handlePvPRest(ctx, restCtx.session, restCtx.resterSlot, restCtx.opponentSlot, lines);
  },
};
