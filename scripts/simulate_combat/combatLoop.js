// @ts-nocheck
"use strict";

const { executeTurn, executeAttack } = require("../../src/services/rpg/combatEngine");
const { calcFatigueRecovery, getFatigueLevel } = require("../../src/services/rpg/fatigueEngine");
const { FATIGUE_COSTS } = require("../../src/config/combatConfig");
const { MAX_ROUNDS, FATIGUE_SNAPSHOT_TURNS } = require("./config");

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
 * @param reaction
 * @param defenderState
 */
function applyReactionFatigue(reaction, defenderState) {
  if (reaction === "dodge") {
    defenderState.fatigue += FATIGUE_COSTS.dodge;
  } else if (reaction === "block") {
    defenderState.fatigue += FATIGUE_COSTS.block;
    const recovery = calcFatigueRecovery("block", defenderState.fatigue, defenderState.fighter.stats.def || 1);
    defenderState.fatigue = Math.max(0, defenderState.fatigue - recovery);
  }
}

/**
 *
 * @param fighterState
 */
function shouldRest(fighterState) {
  const resistance = fighterState.fighter.stats.def || 1;
  const { ratio } = getFatigueLevel(fighterState.fatigue, resistance);
  if (ratio > 0.5) return true;
  if (ratio > 0.3 && fighterState.hp < 50) return true;
  return false;
}

/**
 *
 * @param resterState
 * @param attackerState
 * @param resterIsA
 * @param roundNum
 */
function executeRestTurn(resterState, attackerState, resterIsA, roundNum) {
  const logEntries = [];
  const resistance = resterState.fighter.stats.def || 1;
  const recovery = calcFatigueRecovery("rest", resterState.fatigue, resistance);
  resterState.fatigue = Math.max(0, resterState.fatigue - recovery);

  logEntries.push({
    round: roundNum,
    half: resterIsA ? 1 : 2,
    attacker: resterIsA ? "A_rest" : "B_rest",
    baseDamage: 0,
    reaction: "rest",
    finalDamage: 0,
    dodged: false,
    hpAfter: resterState.hp,
    recovery,
  });

  const attackerChar = characterShape(attackerState.fighter, attackerState.hp);
  const resterChar = characterShape(resterState.fighter, resterState.hp);

  attackerState.fatigue += FATIGUE_COSTS.attack;

  const reactionResult = executeTurn(
    attackerChar,
    resterChar,
    resterState.hp,
    null,
    attackerState.fatigue,
    resterState.fatigue,
  );

  applyReactionFatigue(reactionResult.reaction, resterState);
  resterState.hp = reactionResult.defenderHpAfter;

  logEntries.push({
    round: roundNum,
    half: resterIsA ? 1 : 2,
    attacker: resterIsA ? "B_counter" : "A_counter",
    baseDamage: reactionResult.baseDamage,
    reaction: reactionResult.reaction,
    finalDamage: reactionResult.finalDamage,
    dodged: reactionResult.dodged,
    hpAfter: resterState.hp,
  });

  return { logEntries, resterKo: resterState.hp <= 0 };
}

/**
 *
 * @param fighterA
 * @param fighterB
 */
function simulateCombat(fighterA, fighterB) {
  const stateA = { fighter: fighterA, hp: fighterA.hp, fatigue: 0 };
  const stateB = { fighter: fighterB, hp: fighterB.hp, fatigue: 0 };

  const log = [];
  const fatigueSnapshotsA = {};
  const fatigueSnapshotsB = {};
  const hpCurveA = [stateA.hp];
  const hpCurveB = [stateB.hp];

  let round = 0;
  let winner = null;
  let koType = null;

  while (round < MAX_ROUNDS) {
    const roundNum = round + 1;

    // HALF-TURN 1: A acts
    if (shouldRest(stateA)) {
      const rest = executeRestTurn(stateA, stateB, true, roundNum);
      for (const e of rest.logEntries) log.push(e);
      if (rest.resterKo) {
        winner = "B";
        koType = "ko";
        break;
      }
    } else {
      const attackerCharA = characterShape(stateA.fighter, stateA.hp);
      const defenderCharB = characterShape(stateB.fighter, stateB.hp);
      const result1 = executeTurn(attackerCharA, defenderCharB, stateB.hp, null, stateA.fatigue, stateB.fatigue);
      stateA.fatigue += FATIGUE_COSTS.attack;
      applyReactionFatigue(result1.reaction, stateB);
      stateB.hp = result1.defenderHpAfter;
      log.push({
        round: roundNum,
        half: 1,
        attacker: "A",
        baseDamage: result1.baseDamage,
        reaction: result1.reaction,
        finalDamage: result1.finalDamage,
        dodged: result1.dodged,
        hpAfter: stateB.hp,
      });
      if (stateB.hp <= 0) {
        winner = "A";
        koType = "ko";
        break;
      }
    }

    if (FATIGUE_SNAPSHOT_TURNS.includes(roundNum)) {
      fatigueSnapshotsA[roundNum] = stateA.fatigue;
      fatigueSnapshotsB[roundNum] = stateB.fatigue;
    }

    // HALF-TURN 2: B acts
    if (shouldRest(stateB)) {
      const rest = executeRestTurn(stateB, stateA, false, roundNum);
      for (const e of rest.logEntries) log.push(e);
      if (rest.resterKo) {
        winner = "A";
        koType = "ko";
        break;
      }
    } else {
      const attackerCharB = characterShape(stateB.fighter, stateB.hp);
      const defenderCharA = characterShape(stateA.fighter, stateA.hp);
      const result2 = executeTurn(attackerCharB, defenderCharA, stateA.hp, null, stateB.fatigue, stateA.fatigue);
      stateB.fatigue += FATIGUE_COSTS.attack;
      applyReactionFatigue(result2.reaction, stateA);
      stateA.hp = result2.defenderHpAfter;
      log.push({
        round: roundNum,
        half: 2,
        attacker: "B",
        baseDamage: result2.baseDamage,
        reaction: result2.reaction,
        finalDamage: result2.finalDamage,
        dodged: result2.dodged,
        hpAfter: stateA.hp,
      });
      if (stateA.hp <= 0) {
        winner = "B";
        koType = "ko";
        break;
      }
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
    totalRounds: round + (winner ? 1 : 0),
    log,
    fatigueCurveA: fatigueSnapshotsA,
    fatigueCurveB: fatigueSnapshotsB,
    hpCurveA,
    hpCurveB,
  };
}

module.exports = { simulateCombat, characterShape };
