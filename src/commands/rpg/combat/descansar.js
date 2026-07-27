// @ts-nocheck
const { getActiveCharacter, setHp } = require("../../../services/characterService");
const {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
} = require("../../../services/rpg/combatState");
const { executeAttack, executeReaction, evaluateDodgeFeasibility } = require("../../../services/rpg/combatEngine");
const { calcFatigueRecovery, capFatigue } = require("../../../services/rpg/fatigueEngine");
const { formatActionMenu, formatReactionPrompt, buildFatigueBar } = require("../../../services/rpg/combatMessages");
const { formatError } = require("../../../utils/formatErrorUtils");
const { box } = require("../../../utils/boxUtils");

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

function buildRestLines(resterSlot, recovery) {
  const lines = [];
  lines.push("");
  lines.push(`\uD83D\uDCA4 *${resterSlot.character.name}* descansa`);
  lines.push(`\u2728 Fatiga -${recovery}`);
  lines.push(`\u26A1 ${buildFatigueBar(resterSlot.fatigue, resterSlot.character.stats.def || 1)}`);
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
  const dummyAttack = executeAttack(
    opponentSlot.character,
    resterSlot.character,
    resterSlot.hp,
    opponentSlot.hp,
    opponentSlot.fatigue,
    resterSlot.fatigue,
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

    advanceTurn(session.id, resterSlot.hp, opponentSlot.hp);

    await setPendingReaction(session.id, {
      attackerChar: opponentSlot.character,
      defenderChar: resterSlot.character,
      attackerUserId: opponentSlot.userId,
      defenderUserId: resterSlot.userId,
      baseDamage: dummyAttack.baseDamage,
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
  );

  const finalAttackerHp = isChallenger ? dummyReaction.defenderHpAfter : opponentSlot.hp;
  const finalDefenderHp = isChallenger ? opponentSlot.hp : dummyReaction.defenderHpAfter;

  advanceTurn(session.id, finalAttackerHp, finalDefenderHp);

  buildDummyAttackLines(lines, opponentSlot, resterSlot, dummyAttack);
  lines.push(`\uD83D\uDCA5 Da\u00F1o: ${dummyReaction.finalDamage}`);
  lines.push(
    `\u2764\uFE0F *${resterSlot.character.name}*: ${dummyReaction.defenderHpBefore}\u2192${dummyReaction.defenderHpAfter}`,
  );

  if (dummyReaction.ko) {
    buildKoLines(lines, resterSlot);
    endSession(session.id, opponentSlot.character.id);
    try {
      await setHp({ creatorId: ctx.sender, characterName: resterSlot.character.name, hp: 0 });
    } catch (_e) {
      /* empty */
    }
    return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
  }

  buildDivider(lines);
  lines.push(formatActionMenu(resterSlot.character.name));
  return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
}

function handlePvPRest(ctx, session, resterSlot, opponentSlot, lines) {
  advanceTurn(session.id, resterSlot.hp, opponentSlot.hp);

  buildDivider(lines);
  const nextTurnCharName =
    session.currentTurnCharId === session.challenger.characterId
      ? session.challenger.character.name
      : session.defender.character.name;
  lines.push(formatActionMenu(nextTurnCharName));

  return ctx.reply(box("\uD83D\uDCA4 DESCANSO", lines));
}

module.exports = {
  name: "descansar",
  aliases: ["rest", "recuperar", "respirar"],
  description: "Recupera fatiga saltándote tu turno. Más efectivo cuanto menos fatigado estés.",
  category: "rpg",

  async execute(ctx) {
    try {
      const restCtx = await getRestContext(ctx);
      if (restCtx.error) return ctx.reply(restCtx.error);

      const recovery = calcFatigueRecovery(
        "rest",
        restCtx.resterSlot.fatigue,
        restCtx.resterSlot.character.stats.def || 1,
      );
      restCtx.resterSlot.fatigue = capFatigue(restCtx.resterSlot.fatigue - recovery);

      const lines = buildRestLines(restCtx.resterSlot, recovery);

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
    } catch (error) {
      return ctx.reply(formatError(error.message));
    }
  },
};
