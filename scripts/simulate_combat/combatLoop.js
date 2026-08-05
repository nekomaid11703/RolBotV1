// @ts-nocheck
"use strict";

const { executeAttack, executeReaction, chooseAiReaction, checkAttackRange } = require("../../src/services/rpg/combatEngine");
const {
  calcFatigueRecovery,
  calcFatigueCost,
  getFatigueLevel,
  getMovementRange,
} = require("../../src/services/rpg/fatigueEngine");
const { getCoverage, getMovementFatigueWithCoverage } = require("../../src/services/rpg/armorSetService");
const {
  MAX_ROUNDS,
  FATIGUE_SNAPSHOT_TURNS,
  REST_FATIGUE_RATIO,
  REST_LOW_HP_RATIO,
  REST_LOW_FATIGUE_RATIO,
  ITEM_USE_HP_RATIO,
  ITEM_USE_MAX_FATIGUE_RATIO,
  ITEM_USE_FATIGUE_COST,
  INITIAL_DISTANCE,
  MAX_DISTANCE,
  RETREAT_HP_RATIO,
  RETREAT_MAX_DISTANCE,
  RETREAT_MAX_FATIGUE_RATIO,
} = require("./config");

/**
 *
 * @param fighter
 * @param currentHp
 */
function characterShape(fighter, currentHp) {
  return { name: fighter.name, stats: fighter.stats, hp_actual: currentHp };
}

/**
 *
 * @param state
 */
function fatigueRatio(state) {
  const resistance = state.fighter.stats.def || 1;
  return getFatigueLevel(state.fatigue, resistance).ratio;
}

/**
 * Wrapper de durabilidad de armadura con el mismo contrato que el motor real
 * (DurabilityModule.absorbDamage).
 *
 * Mecánica VALIDADA en la simulación (pendiente en el motor real): el daño
 * material se reparte entre las piezas de la lista EN ORDEN — cada pieza
 * absorbe hasta su resistencia y el exceso pasa a la siguiente. El motor real
 * hoy solo impacta la primera pieza (atacar.js: armor.list[0]).
 * @param {Array<object>} armorPieces - Piezas con currentResist (se mutan)
 */
function createDurability(armorPieces) {
  const pieces = (armorPieces || []).filter((p) => p && typeof p.currentResist === "number");

  return {
    absorbDamage(materialDamage) {
      let remaining = materialDamage;
      for (const piece of pieces) {
        if (remaining <= 0) break;
        const absorbed = Math.min(piece.currentResist, remaining);
        piece.currentResist = Math.max(0, piece.currentResist - absorbed);
        remaining -= absorbed;
      }
      const allBroken = pieces.length > 0 && pieces.every((p) => p.currentResist <= 0);
      return {
        absorbed: materialDamage - remaining,
        overflow: remaining,
        isBroken: allBroken,
        isDestroyed: allBroken,
      };
    },
  };
}

/**
 *
 * @param reaction
 * @param defenderState
 */
function applyReactionFatigue(reaction, defenderState) {
  if (reaction === "dodge") {
    defenderState.fatigue += calcFatigueCost("dodge", defenderState.fighter.stats);
  } else if (reaction === "block") {
    defenderState.fatigue += calcFatigueCost("block", defenderState.fighter.stats);
    const recovery = calcFatigueRecovery("block", defenderState.fatigue, defenderState.fighter.stats.def || 1);
    defenderState.fatigue = Math.max(0, defenderState.fatigue - recovery);
  }
}

/**
 *
 * @param state
 */
function shouldRest(state) {
  const ratio = fatigueRatio(state);
  if (ratio > REST_FATIGUE_RATIO) return true;
  if (ratio > REST_LOW_FATIGUE_RATIO && state.hp < state.fighter.hp * REST_LOW_HP_RATIO) return true;
  return false;
}

/**
 *
 * @param state
 */
function shouldUseItem(state) {
  if (state.items.length === 0) return false;
  if (state.hp >= state.fighter.hp * ITEM_USE_HP_RATIO) return false;
  if (fatigueRatio(state) > ITEM_USE_MAX_FATIGUE_RATIO) return false;
  return true;
}

/**
 *
 * @param state
 * @param distance
 */
function shouldRetreat(state, distance) {
  if (state.hp >= state.fighter.hp * RETREAT_HP_RATIO) return false;
  if (distance >= RETREAT_MAX_DISTANCE) return false;
  if (fatigueRatio(state) > RETREAT_MAX_FATIGUE_RATIO) return false;
  return true;
}

/**
 *
 * @param state
 */
function useItem(state) {
  const item = state.items[0];
  const maxHp = state.fighter.hp;
  const heal = Math.min(item.heal, Math.max(0, maxHp - state.hp));
  state.hp += heal;
  state.items.shift();
  state.fatigue += ITEM_USE_FATIGUE_COST;
  return { name: item.name, heal };
}

/**
 * Ejecuta un ataque completo del actor contra el oponente (con reacción).
 * @param {object} actor
 * @param {object} opponent
 * @returns {object} Entrada de log del ataque
 */
function performAttack(actor, opponent) {
  const attackerChar = characterShape(actor.fighter, actor.hp);
  const defenderChar = characterShape(opponent.fighter, opponent.hp);
  const weaponInfo = actor.fighter.equipment.weapon;
  const armorDurability = opponent.fighter.equipment.armorList?.length
    ? createDurability(opponent.fighter.equipment.armorList)
    : null;

  const attackInfo = executeAttack(
    attackerChar,
    defenderChar,
    opponent.hp,
    actor.hp,
    actor.fatigue,
    opponent.fatigue,
    weaponInfo,
  );

  const reactionType = attackInfo.canReact
    ? chooseAiReaction(defenderChar, opponent.hp, attackerChar, attackInfo.baseDamage, actor.hp, opponent.fatigue, actor.fatigue)
    : "none";

  const reactionResult = executeReaction(
    reactionType,
    attackInfo.baseDamage,
    defenderChar,
    opponent.hp,
    attackerChar,
    actor.hp,
    opponent.fatigue,
    actor.fatigue,
    attackInfo.materialDamage,
    armorDurability,
  );

  actor.fatigue += calcFatigueCost("attack", actor.fighter.stats);
  applyReactionFatigue(reactionResult.reaction, opponent);

  const hpBefore = opponent.hp;
  const finalDamage = reactionResult.finalDamage;
  opponent.hp = reactionResult.defenderHpAfter;
  actor.damageDealt += finalDamage;
  opponent.damageTaken += finalDamage;

  return {
    action: "attack",
    weapon: weaponInfo?.name || "desarmado",
    damageNature: attackInfo.damageNature,
    baseDamage: attackInfo.baseDamage,
    materialDamage: attackInfo.materialDamage,
    reaction: reactionResult.reaction,
    finalDamage,
    dodged: reactionResult.dodged,
    defenderHpBefore: hpBefore,
    hpAfter: opponent.hp,
  };
}

/**
 * Half-turn de descanso: el descansante recupera fatiga y el oponente ataca.
 * @param {object} rester
 * @param {object} attacker
 * @param {number} roundNum
 * @param {boolean} isA
 * @param {string} actorTag
 */
function restHalfTurn(rester, attacker, roundNum, isA, actorTag) {
  const entries = [];

  const resistance = rester.fighter.stats.def || 1;
  const recovery = calcFatigueRecovery("rest", rester.fatigue, resistance);
  rester.fatigue = Math.max(0, rester.fatigue - recovery);
  rester.rests++;

  entries.push({
    round: roundNum,
    half: isA ? 1 : 2,
    attacker: `${actorTag}_rest`,
    action: "rest",
    recovery,
    hpAfter: rester.hp,
  });

  const counter = performAttack(attacker, rester);
  const counterTag = isA ? "B_counter" : "A_counter";
  entries.push({ round: roundNum, half: isA ? 1 : 2, attacker: counterTag, ...counter });

  return { entries, ko: rester.hp <= 0, winner: rester.hp <= 0 ? (isA ? "B" : "A") : null };
}

/**
 * Ejecuta el medio turno de un combatiente.
 * Cadena de decisión (config-driven): descanso > ítem > retirada > avance > ataque.
 * @param {object} actor
 * @param {object} opponent
 * @param {number} distance
 * @param {number} roundNum
 * @param {boolean} isA
 * @returns {{ entries: Array, distance: number, ko: boolean }}
 */
function executeHalfTurn(actor, opponent, distance, roundNum, isA) {
  const entries = [];
  const actorTag = isA ? "A" : "B";

  if (shouldRest(actor)) {
    const rest = restHalfTurn(actor, opponent, roundNum, isA, actorTag);
    return { entries: rest.entries, distance, ko: rest.ko, winner: rest.winner };
  }

  if (shouldUseItem(actor)) {
    const used = useItem(actor);
    entries.push({
      round: roundNum,
      half: isA ? 1 : 2,
      attacker: `${actorTag}_item`,
      action: "item",
      item: used.name,
      heal: used.heal,
      hpAfter: actor.hp,
    });
    return { entries, distance, ko: false };
  }

  if (shouldRetreat(actor, distance)) {
    const coverage = getCoverage(actor.fighter.equipment.armorList || []);
    const mspd = Math.max(1, Math.floor((actor.fighter.stats.mspd || 0) * (1 - coverage.mspdPenalty)));
    const meters = Math.min(getMovementRange(mspd), MAX_DISTANCE - distance);
    if (meters > 0) {
      distance += meters;
      actor.fatigue += getMovementFatigueWithCoverage(meters, actor.fighter.equipment.armorList || []);
      actor.retreats++;
      entries.push({
        round: roundNum,
        half: isA ? 1 : 2,
        attacker: `${actorTag}_retreat`,
        action: "retreat",
        meters,
        distance,
        hpAfter: actor.hp,
      });
    }
    return { entries, distance, ko: false };
  }

  const weaponRange = actor.fighter.equipment.weapon?.weaponRange || 0;
  const { canAttack } = checkAttackRange(distance, actor.fighter.stats, weaponRange);

  if (!canAttack) {
    const coverage = getCoverage(actor.fighter.equipment.armorList || []);
    const mspd = Math.max(1, Math.floor((actor.fighter.stats.mspd || 0) * (1 - coverage.mspdPenalty)));
    const meters = Math.min(getMovementRange(mspd), distance);
    if (meters > 0) {
      distance -= meters;
      actor.fatigue += getMovementFatigueWithCoverage(meters, actor.fighter.equipment.armorList || []);
      actor.advances++;
      entries.push({
        round: roundNum,
        half: isA ? 1 : 2,
        attacker: `${actorTag}_advance`,
        action: "advance",
        meters,
        distance,
        hpAfter: actor.hp,
      });
    }
    return { entries, distance, ko: false };
  }

  const attack = performAttack(actor, opponent);
  entries.push({ round: roundNum, half: isA ? 1 : 2, attacker: actorTag, ...attack });

  return { entries, distance, ko: opponent.hp <= 0, winner: opponent.hp <= 0 ? (isA ? "A" : "B") : null };
}

/**
 *
 * @param fighterA
 * @param fighterB
 */
function simulateCombat(fighterA, fighterB) {
  const stateA = {
    fighter: fighterA,
    hp: fighterA.hp,
    fatigue: 0,
    items: [...fighterA.loadout],
    rests: 0,
    advances: 0,
    retreats: 0,
    damageDealt: 0,
    damageTaken: 0,
  };
  const stateB = {
    fighter: fighterB,
    hp: fighterB.hp,
    fatigue: 0,
    items: [...fighterB.loadout],
    rests: 0,
    advances: 0,
    retreats: 0,
    damageDealt: 0,
    damageTaken: 0,
  };

  let distance = INITIAL_DISTANCE;

  const log = [];
  const fatigueSnapshotsA = {};
  const fatigueSnapshotsB = {};
  const hpCurveA = [stateA.hp];
  const hpCurveB = [stateB.hp];
  const distanceCurve = [distance];

  let round = 0;
  let winner = null;
  let koType = null;

  while (round < MAX_ROUNDS) {
    const roundNum = round + 1;

    const halfA = executeHalfTurn(stateA, stateB, distance, roundNum, true);
    for (const entry of halfA.entries) log.push(entry);
    distance = halfA.distance;
    distanceCurve.push(distance);
    if (halfA.winner) {
      winner = halfA.winner;
      koType = "ko";
      break;
    }

    if (FATIGUE_SNAPSHOT_TURNS.includes(roundNum)) {
      fatigueSnapshotsA[roundNum] = stateA.fatigue;
      fatigueSnapshotsB[roundNum] = stateB.fatigue;
    }

    const halfB = executeHalfTurn(stateB, stateA, distance, roundNum, false);
    for (const entry of halfB.entries) log.push(entry);
    distance = halfB.distance;
    distanceCurve.push(distance);
    if (halfB.winner) {
      winner = halfB.winner;
      koType = "ko";
      break;
    }

    if (FATIGUE_SNAPSHOT_TURNS.includes(roundNum)) {
      fatigueSnapshotsA[roundNum] = stateA.fatigue;
      fatigueSnapshotsB[roundNum] = stateB.fatigue;
    }

    hpCurveA.push(stateA.hp);
    hpCurveB.push(stateB.hp);
    round++;
  }

  if (!winner) {
    koType = "timeout";
    if (stateA.hp > stateB.hp) winner = "A";
    else if (stateB.hp > stateA.hp) winner = "B";
    else winner = "draw";
  }

  for (const turn of FATIGUE_SNAPSHOT_TURNS) {
    if (!(turn in fatigueSnapshotsA)) fatigueSnapshotsA[turn] = stateA.fatigue;
    if (!(turn in fatigueSnapshotsB)) fatigueSnapshotsB[turn] = stateB.fatigue;
  }

  return {
    fighterA: { ...fighterA },
    fighterB: { ...fighterB },
    winner,
    koType,
    firstAttacker: "A",
    totalRounds: round + (winner ? 1 : 0),
    log,
    fatigueCurveA: fatigueSnapshotsA,
    fatigueCurveB: fatigueSnapshotsB,
    hpCurveA,
    hpCurveB,
    distanceCurve,
    stateA: { hp: stateA.hp, fatigue: stateA.fatigue, rests: stateA.rests, advances: stateA.advances, retreats: stateA.retreats, damageDealt: stateA.damageDealt, damageTaken: stateA.damageTaken, itemsLeft: stateA.items.length },
    stateB: { hp: stateB.hp, fatigue: stateB.fatigue, rests: stateB.rests, advances: stateB.advances, retreats: stateB.retreats, damageDealt: stateB.damageDealt, damageTaken: stateB.damageTaken, itemsLeft: stateB.items.length },
  };
}

module.exports = { simulateCombat, characterShape };
