// @ts-nocheck
const abilitiesData = require("./abilities");
const combatEngine = require("./combatEngine");
const turnManager = require("./combatTurnManager");
const stateManager = require("./combatStateManager");

async function executeAbility(room, participant, targetId, abilityId, options = {}) {
  const ability = abilitiesData.getAbility(abilityId);
  if (!ability) return { error: `Habilidad "${abilityId}" desconocida.` };

  const check = abilitiesData.canUseAbility(participant, abilityId);
  if (!check.canUse) return { error: check.reason };

  if (check.requiresTarget && !targetId) {
    return { error: `${ability.name} requiere un objetivo específico.` };
  }

  if (targetId) {
    const target = turnManager.getParticipantByJid(room, targetId);
    if (!target) return { error: "Objetivo no encontrado." };
    if (target.ko) return { error: `${target.name} ya está K.O.` };
    if (ability.conditions && ability.conditions.target_hp_under) {
      const ratio = target.hp / (target.maxHp || target.hp || 100);
      if (ratio > ability.conditions.target_hp_under) {
        return {
          error: `${ability.name} solo funciona contra objetivos debilitados (<${Math.round(ability.conditions.target_hp_under * 100)}% HP). ${target.name} tiene ${Math.round(ratio * 100)}% HP.`,
        };
      }
    }
  }

  abilitiesData.applyAbilityCosts(participant, abilityId);

  const overallResult = {
    abilityId,
    abilityName: ability.name,
    effects: [],
    narrative: ability.narrative,
    brokenItems: [],
  };

  for (const effect of ability.effects) {
    const result = await applyEffect(effect, room, participant, targetId, options);
    if (result) {
      overallResult.effects.push(result);
      if (result.brokenItems) {
        overallResult.brokenItems = overallResult.brokenItems.concat(result.brokenItems);
      }
    }
  }

  await stateManager.updateRoom(room.id, {});
  return overallResult;
}

async function applyEffect(effect, room, participant, targetId, options) {
  switch (effect.type) {
    case "damage_multiplier": {
      const target = targetId ? turnManager.getParticipantByJid(room, targetId) : null;
      if (!target) return null;
      const zone = options.zone || "pecho";
      const dmgType = options.damageType || "impacto";
      const atkOpts = { damageType: dmgType, moveNumber: 1 };

      if (effect.value !== 1.0) {
        atkOpts.damageMultiplier = effect.value;
      }

      const aResult = await combatEngine.processAttack(room, participant.id, targetId, zone, atkOpts);

      if (aResult.error) return { error: aResult.error };
      return {
        type: "damage_multiplier",
        multiplier: effect.value,
        actionResult: aResult,
        summary: `${target.name} recibe ataque con multiplicador x${effect.value}`,
      };
    }

    case "damage_bonus": {
      const target = targetId ? turnManager.getParticipantByJid(room, targetId) : null;
      if (!target) return null;
      const zone = options.zone || "pecho";
      const atkOpts = { damageType: options.damageType || "impacto", moveNumber: 1, damageMultiplier: 1 };
      const aResult = await combatEngine.processAttack(room, participant.id, targetId, zone, atkOpts);
      if (aResult.error) return { error: aResult.error };
      return {
        type: "damage_bonus",
        damage: aResult.result.damage,
        actionResult: aResult,
        summary: `${target.name} recibe ${aResult.result.damage} daño adicional.`,
      };
    }

    case "heal_percent": {
      const healAmount = Math.round((participant.maxHp || 100) * effect.value);
      const healed = Math.min(participant.maxHp, participant.hp + healAmount) - participant.hp;
      participant.hp = Math.min(participant.maxHp, participant.hp + healAmount);
      return {
        type: "heal",
        amount: healed,
        summary: `Se cura ${healed} HP.`,
      };
    }

    case "heal_flat": {
      const flatHeal = effect.value;
      const healed = Math.min(participant.maxHp, participant.hp + flatHeal) - participant.hp;
      participant.hp = Math.min(participant.maxHp, participant.hp + flatHeal);
      return {
        type: "heal",
        amount: healed,
        summary: `Se cura ${healed} HP.`,
      };
    }

    case "stat_debuff_self": {
      if (!participant.buffs) participant.buffs = [];
      participant.buffs.push({
        stat: effect.stat,
        value: effect.value,
        duration: effect.duration || 1,
        type: "debuff",
      });
      return {
        type: "debuff",
        stat: effect.stat,
        value: effect.value,
        duration: effect.duration,
        summary: `${effect.stat} reducido en ${Math.abs(effect.value)} por ${effect.duration} turno(s).`,
      };
    }

    case "buff": {
      if (!participant.buffs) participant.buffs = [];
      participant.buffs.push({
        stat: effect.stat,
        value: effect.value,
        duration: effect.duration || 2,
        type: "buff",
      });
      return {
        type: "buff",
        stat: effect.stat,
        value: effect.value,
        duration: effect.duration,
        summary: `${effect.stat} aumentado en +${effect.value} por ${effect.duration} turno(s).`,
      };
    }

    case "multi_attack": {
      const target = targetId ? turnManager.getParticipantByJid(room, targetId) : null;
      if (!target) return null;
      const attacks = effect.value;
      const damageProg = options.damageProgression || null;
      const results = [];

      for (let i = 0; i < attacks; i++) {
        const mult = damageProg && damageProg[i] !== undefined ? damageProg[i] : 1.0;
        const zone = options.zone || "pecho";
        const atkOpts = { damageType: options.damageType || "impacto", moveNumber: i + 1 };

        if (mult !== 1.0) atkOpts.damageMultiplier = mult;

        const aResult = await combatEngine.processAttack(room, participant.id, targetId, zone, atkOpts);

        if (aResult.error) break;
        results.push(aResult);

        if (target.ko) break;
      }

      return {
        type: "multi_attack",
        attackCount: results.length,
        results,
        summary: `${results.length} golpe(s) conectado(s).`,
      };
    }

    case "damage_progression": {
      return null;
    }

    case "ignore_armor": {
      const target = targetId ? turnManager.getParticipantByJid(room, targetId) : null;
      if (!target) return null;
      const zone = options.zone || "pecho";
      const atkOpts = { damageType: options.damageType || "perforacion", moveNumber: 1, ignoreArmor: true };

      const aResult = await combatEngine.processAttack(room, participant.id, targetId, zone, atkOpts);

      if (aResult.error) return { error: aResult.error };
      return {
        type: "ignore_armor",
        actionResult: aResult,
        summary: `Ataque que ignora armadura contra ${target.name}.`,
      };
    }

    case "defense_multiplier": {
      participant.defending = true;
      if (!participant.defenseMultiplier) participant.defenseMultiplier = 1;
      participant.defenseMultiplier = effect.value;
      return {
        type: "defense_multiplier",
        multiplier: effect.value,
        summary: `Defensa multiplicada x${effect.value}.`,
      };
    }

    case "aoe_damage": {
      const stat = effect.stat || "dominio_fulgor";
      const statValue = participant[stat] || 1;
      const baseDmg = Math.round(statValue * (effect.value || 1.0));
      const results = [];

      let affected;
      if (room.startedVia === "pvp" && participant.bando) {
        affected = turnManager
          .getAliveParticipants(room)
          .filter((p) => p.id !== participant.id && p.bando !== participant.bando);
      } else {
        const enemies = turnManager.getAliveParticipants(room, "enemies");
        const players = turnManager.getAliveParticipants(room, "players").filter((p) => p.id !== participant.id);
        affected = participant.team === "players" ? enemies : players;
      }

      for (const target of affected) {
        target.hp = Math.max(0, target.hp - baseDmg);
        if (target.hp <= 0) target.ko = true;
        results.push({ target: target.name, damage: baseDmg, ko: target.ko });
      }

      return {
        type: "aoe_damage",
        damage: baseDmg,
        targets: results.map((r) => r.target).join(", "),
        results,
        summary: `${baseDmg} daño en área a: ${results.map((r) => r.target + (r.ko ? " [KO]" : "")).join(", ")}.`,
      };
    }

    case "crit_guaranteed": {
      return {
        type: "crit_guaranteed",
        summary: "Golpe crítico garantizado.",
      };
    }

    case "shield": {
      if (!participant.buffs) participant.buffs = [];
      const shieldValue = Math.round((participant[effect.stat || "dominio_fulgor"] || 1) * (effect.value || 0.4));
      participant.buffs.push({
        stat: "shield",
        value: shieldValue,
        duration: effect.duration || 3,
        type: "shield",
      });
      return {
        type: "shield",
        value: shieldValue,
        duration: effect.duration,
        summary: `Escudo de ${shieldValue} daño absorbido por ${effect.duration} turno(s).`,
      };
    }

    case "dot": {
      if (!targetId) return null;
      const target = turnManager.getParticipantByJid(room, targetId);
      if (!target) return null;
      if (!target.dots) target.dots = [];
      target.dots.push({
        damage: effect.value,
        duration: effect.duration || 3,
        type: effect.dotType || "bleed",
      });
      return {
        type: "dot",
        damage: effect.value,
        duration: effect.duration,
        summary: `${target.name} recibe ${effect.value} daño por ${effect.duration} turno(s).`,
      };
    }

    default:
      return null;
  }
}

async function applyDotEffects(room) {
  let anyApplied = false;
  for (const participant of room.participants) {
    if (participant.ko || !participant.dots) continue;
    const activeDots = [];
    for (const dot of participant.dots) {
      if (dot.duration <= 0) continue;
      dot.duration--;
      participant.hp = Math.max(0, (participant.hp || 100) - dot.damage);
      if (participant.hp <= 0) participant.ko = true;
      anyApplied = true;
      if (dot.duration > 0) activeDots.push(dot);
    }
    participant.dots = activeDots;
  }
  return anyApplied;
}

function formatAbilityResult(abilityResult) {
  if (!abilityResult) return "";
  const parts = [`⚡ *${abilityResult.abilityName}*`];
  for (const effect of abilityResult.effects) {
    if (effect && effect.summary) parts.push(` • ${effect.summary}`);
  }
  return parts.join("\n");
}

module.exports = {
  executeAbility,
  applyEffect,
  applyDotEffects,
  formatAbilityResult,
};
