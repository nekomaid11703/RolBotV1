// @ts-nocheck
"use strict";

const { executeAttack, executeReaction, chooseAiReaction, getEffectiveWeaponRange } = require("../../src/services/rpg/combatEngine");
const { BASE_ATTACK_RANGE, KITE_FATIGUE_MULTIPLIER } = require("../../src/config/combatConfig");
const { getArmorMode, applyArmorMode } = require("./experimentalArmor");
const {
  calcFatigueRecovery,
  calcFatigueCost,
  capFatigue,
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
  KITE_MOVE_RATIO,
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
  const maxResist = pieces.reduce((a, p) => a + (p.maxResist || 0), 0);
  const bonusDef = pieces.reduce((a, p) => a + (p.bonusDef || 0), 0);

  return {
    maxResist,
    bonusDef,
    get currentResist() {
      return pieces.reduce((a, p) => a + Math.max(0, p.currentResist ?? p.maxResist), 0);
    },
    get isBroken() {
      return pieces.length > 0 && pieces.every((p) => (p.currentResist ?? p.maxResist) <= 0);
    },
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
    defenderState.fatigue = capFatigue(defenderState.fatigue + calcFatigueCost("dodge", defenderState.fighter.stats));
  } else if (reaction === "block") {
    defenderState.fatigue = capFatigue(defenderState.fatigue + calcFatigueCost("block", defenderState.fighter.stats));
    const recovery = calcFatigueRecovery("block", defenderState.fatigue, defenderState.fighter.stats.def || 1);
    defenderState.fatigue = capFatigue(defenderState.fatigue - recovery);
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
  state.fatigue = capFatigue(state.fatigue + ITEM_USE_FATIGUE_COST);
  return { name: item.name, heal };
}

/**
 * Ejecuta un ataque completo del actor contra el oponente (con reacción).
 * Consume 1 unidad de munición si el arma es a distancia (arco).
 * @param {object} actor
 * @param {object} opponent
 * @param {number} [distance] - Distancia del ataque (metros)
 * @returns {object} Entrada de log del ataque
 */
function performAttack(actor, opponent, distance = 0) {
  const attackerChar = characterShape(actor.fighter, actor.hp);
  const defenderChar = characterShape(opponent.fighter, opponent.hp);
  let weaponInfo = actor.fighter.equipment.weapon;
  if (weaponInfo?.ranged && (actor.ammo || 0) <= 0) weaponInfo = null;
  const armorDurability = opponent.fighter.equipment.armorList?.length
    ? createDurability(opponent.fighter.equipment.armorList)
    : null;

  if (weaponInfo?.ranged) {
    actor.ammo = Math.max(0, (actor.ammo || 0) - 1);
  }

  const attackInfo = executeAttack(
    attackerChar,
    defenderChar,
    opponent.hp,
    actor.hp,
    actor.fatigue,
    opponent.fatigue,
    weaponInfo,
    distance,
  );

  const reactionType = attackInfo.canReact
    ? chooseAiReaction(defenderChar, opponent.hp, attackerChar, attackInfo.baseDamage, actor.hp, opponent.fatigue, actor.fatigue, attackInfo.distanceRefBonus, opponent.fighter.equipment)
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

  actor.fatigue = capFatigue(actor.fatigue + calcFatigueCost("attack", actor.fighter.stats));
  applyReactionFatigue(reactionResult.reaction, opponent);

  // ── Modo de armadura del MOTOR REAL (Fase C Iteración 1) ──
  // executeReaction ya aplica "full" (bonusDef→DEF + soak + overflow→HP)
  // gobernado por las constantes de combatConfig.js. La capa experimental se
  // mantiene como no-op (ARMOR_MODE="actual") para no doble-aplicar.
  const armorMode = getArmorMode(require("./config").ARMOR_MODE);
  const expResult = applyArmorMode(armorMode, {
    baseDamage: attackInfo.baseDamage,
    materialDamage: attackInfo.materialDamage,
    finalDamage: reactionResult.finalDamage,
    dodged: reactionResult.dodged,
    defenderStats: defenderChar.stats || {},
    armorBonusDef: opponent.fighter.equipment?.armor?.bonusDef || 0,
    armorAbsorption: reactionResult.armorAbsorption,
  });

  const hpBefore = opponent.hp;
  const finalDamage = Math.max(0, expResult.finalDamage);
  opponent.hp = Math.max(0, opponent.hp - finalDamage);
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
    armorMode: armorMode.id,
    soakApplied: reactionResult.soakApplied ?? expResult.soakApplied,
    defReduction: reactionResult.defReduction ?? expResult.defReduction,
    overflowToHp: reactionResult.overflowToHp ?? expResult.overflowToHp,
    overflow: reactionResult.armorAbsorption?.overflow || 0,
  };
}

/**
 * Half-turn de descanso: el descansante recupera fatiga y el oponente ataca.
 * @param {object} rester
 * @param {object} attacker
 * @param {number} roundNum
 * @param {boolean} isA
 * @param {string} actorTag
 * @param {number} [distance] - Distancia actual del combate
 */
function restHalfTurn(rester, attacker, roundNum, isA, actorTag, distance = 0) {
  const entries = [];

  const resistance = rester.fighter.stats.def || 1;
  const recovery = calcFatigueRecovery("rest", rester.fatigue, resistance);
  rester.fatigue = capFatigue(rester.fatigue - recovery);
  rester.rests++;

  entries.push({
    round: roundNum,
    half: isA ? 1 : 2,
    attacker: `${actorTag}_rest`,
    action: "rest",
    recovery,
    hpAfter: rester.hp,
  });

  const counter = performAttack(attacker, rester, distance);
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
    const rest = restHalfTurn(actor, opponent, roundNum, isA, actorTag, distance);
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
      actor.fatigue = capFatigue(actor.fatigue + getMovementFatigueWithCoverage(meters, actor.fighter.equipment.armorList || [], actor.fighter.stats.def));
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

  let weaponInfo = actor.fighter.equipment.weapon || null;
  // Sin munición, el arquero no dispara: pasa a luchar desarmado (se acerca).
  if (weaponInfo?.ranged && (actor.ammo || 0) <= 0) weaponInfo = null;
  const isRanged = Boolean(weaponInfo?.ranged);
  const naturalRange = BASE_ATTACK_RANGE + (weaponInfo?.weaponRange || 0);
  // Alcance de ataque efectivo: el arco usa alcance dinámico (ATK + perillas),
  // el melee usa su rango natural (alcance del arma + base).
  const attackRange = isRanged ? getEffectiveWeaponRange(weaponInfo, actor.fighter.stats) : naturalRange;

  const coverage = getCoverage(actor.fighter.equipment.armorList || []);
  const mspd = Math.max(1, Math.floor((actor.fighter.stats.mspd || 0) * (1 - coverage.mspdPenalty)));
  const movementRange = getMovementRange(mspd);

  // ── Modelo de 1 acción por turno (Opción 1) ──
  // En rango al inicio del turno: atacar (el arquero reposiciona para kitear y
  // mantener distancia, pagando fatiga ×KITE_FATIGUE_MULTIPLIER).
  // Fuera de rango: el turno solo se usa para acercarse (advance), sin atacar.
  if (distance <= attackRange) {
    let attackDistance = distance;
    if (isRanged) {
      // Kite: retroceder hasta el 60% del alcance efectivo (daño útil) sin salir
      // del rango ni del techo del mapa. Retroceder mientras se dispara no puede
      // ser a velocidad de carrera: el retroceso del kite se limita a una
      // fracción del movementRange (KITE_MOVE_RATIO) para que el melee pueda
      // cerrar distancia. El defensor no gana reflejos por esto.
      const ideal = attackRange * 0.6;
      const kiteMeters = Math.max(1, Math.floor(movementRange * KITE_MOVE_RATIO));
      const meters = Math.min(kiteMeters, Math.max(0, ideal - distance), MAX_DISTANCE - distance);
      if (meters > 0) {
        distance += meters;
        actor.fatigue = capFatigue((actor.fatigue + getMovementFatigueWithCoverage(meters, actor.fighter.equipment.armorList || [], actor.fighter.stats.def)) * KITE_FATIGUE_MULTIPLIER);
        actor.retreats++;
        entries.push({
          round: roundNum,
          half: isA ? 1 : 2,
          attacker: `${actorTag}_kite`,
          action: "retreat",
          meters,
          distance,
          hpAfter: actor.hp,
        });
        attackDistance = distance;
      }
    }

    const attack = performAttack(actor, opponent, attackDistance);
    entries.push({ round: roundNum, half: isA ? 1 : 2, attacker: actorTag, ...attack });

    return { entries, distance, ko: opponent.hp <= 0, winner: opponent.hp <= 0 ? (isA ? "A" : "B") : null };
  }

  // Fuera de todos los círculos: acercarse. Si el movementRange alcanza el
  // rango de ataque, el melee avanza Y ataca en el mismo turno (simétrico al
  // kite+disparo del arquero, que ya hace 2 acciones por turno). Sin esta
  // simetría, el melee gasta cada turno avanzando sin golpear y el arquero
  // acumula daño gratis. El arquero avanza hasta el 60% de su alcance.
  const target = isRanged ? attackRange * 0.6 : attackRange;
  const meters = Math.min(movementRange, Math.max(0, distance - target));
  if (meters > 0) {
    distance -= meters;
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

  // El movimiento llegó a rango de ataque: atacar en el mismo turno.
  if (!isRanged && distance <= attackRange) {
    const attack = performAttack(actor, opponent, distance);
    entries.push({ round: roundNum, half: isA ? 1 : 2, attacker: actorTag, ...attack });
    // El coste de fatiga del avance se paga DESPUÉS del golpe: el movimiento
    // hacia el objetivo no debe penalizar la precisión del ataque del mismo
    // turno (si se paga antes, el ASPD colapsa y el defensor esquiva siempre
    // a niveles bajos, volviendo inútil al melee).
    if (meters > 0) {
      actor.fatigue = capFatigue(actor.fatigue + getMovementFatigueWithCoverage(meters, actor.fighter.equipment.armorList || [], actor.fighter.stats.def));
    }
    return { entries, distance, ko: opponent.hp <= 0, winner: opponent.hp <= 0 ? (isA ? "A" : "B") : null };
  }

  if (meters > 0) {
    actor.fatigue = capFatigue(actor.fatigue + getMovementFatigueWithCoverage(meters, actor.fighter.equipment.armorList || [], actor.fighter.stats.def));
  }
  return { entries, distance, ko: false };
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
    ammo: fighterA.equipment?.ammo?.count || 0,
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
    ammo: fighterB.equipment?.ammo?.count || 0,
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
    stateA: { hp: stateA.hp, fatigue: stateA.fatigue, rests: stateA.rests, advances: stateA.advances, retreats: stateA.retreats, damageDealt: stateA.damageDealt, damageTaken: stateA.damageTaken, itemsLeft: stateA.items.length, ammoLeft: stateA.ammo },
    stateB: { hp: stateB.hp, fatigue: stateB.fatigue, rests: stateB.rests, advances: stateB.advances, retreats: stateB.retreats, damageDealt: stateB.damageDealt, damageTaken: stateB.damageTaken, itemsLeft: stateB.items.length, ammoLeft: stateB.ammo },
  };
}

module.exports = { simulateCombat, characterShape };
