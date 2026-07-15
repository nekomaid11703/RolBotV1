// @ts-nocheck
/**
 * combatEngine.js — Motor de Combate Táctico D20
 *
 * Sistema determinista basado en un dado de 20 caras (D20).
 * - Estadísticas: 6 atributos, rango [1, 20], escalado ×5 en nivel 20.
 * - Acciones: atacar, esquivar, bloquear, usar (ítems/habilidades).
 * - Críticos: 20 = Éxito Crítico, 1 = Pifia.
 *
 * NO depende de IA ni narrativa. Todo es cálculo local.
 */

const { RPG_CONFIG } = require("../../config/rpg.config");
const { roll } = require("../../utils/roll");

const D20 = RPG_CONFIG.d20;
const COMBAT = RPG_CONFIG.combat;
const STATS = RPG_CONFIG.stats;

// ═══════════════════════════════════════════════════════════════════════
//  UTILIDADES MATEMÁTICAS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Calcula el multiplicador de una estadística según su nivel (1-20).
 * M(L) = 1 + (L - 1) * (4/19)
 * Nivel 1 → ×1.0, Nivel 20 → ×5.0
 * @param {number} level - Nivel de la estadística [1, 20]
 * @returns {number} Multiplicador
 */
function getStatMultiplier(level) {
  const clamped = Math.max(STATS.min, Math.min(STATS.max, level));
  return 1 + (clamped - 1) * STATS.scaleFactor;
}

/**
 * Lanza un dado de N caras.
 * @param {number} sides - Número de caras (default 20)
 * @returns {number} Resultado [1, sides]
 */
function rollD(sides = 20) {
  return roll(1, sides);
}

/**
 * Lanza un dado de daño base (D10 por defecto).
 * @returns {number} Resultado [1, 10]
 */
function rollBaseDamage() {
  return roll(COMBAT.baseDamageMin, COMBAT.baseDamageMax);
}

function _clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ═══════════════════════════════════════════════════════════════════════
//  RESOLUCIÓN DE ACCIONES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Resuelve un ataque D20.
 *
 * @param {object} attacker - Participante atacante
 * @param {object} defender - Participante defensor
 * @returns {object} Resultado del ataque
 */
function resolveAttack(attacker, defender) {
  const d20 = rollD(20);
  const isCrit = d20 === D20.critSuccess;
  const isPifia = d20 === D20.critFail;

  const result = {
    d20,
    isCrit,
    isPifia,
    hit: false,
    damage: 0,
    defenderKO: false,
    attackerVulnerable: false,
    details: "",
  };

  // ── Pifia (1): Fallo total, atacante queda vulnerable ────────────
  if (isPifia) {
    result.attackerVulnerable = true;
    attacker.efectos_activos = attacker.efectos_activos || [];
    attacker.efectos_activos.push({ tipo: "vulnerable", duracion: 1 });
    result.details = `💀 PIFIA — ${attacker.name} falla estrepitosamente y queda vulnerable.`;
    return result;
  }

  // ── Crítico (20): Daño máximo × M(fuerza) × 1.5, ignora defensa ─
  if (isCrit) {
    const maxDamage = COMBAT.baseDamageMax; // Daño máximo del dado
    const multFuerza = getStatMultiplier(attacker.fuerza || STATS.defaultValue);
    let damage = Math.round(maxDamage * multFuerza * D20.critDamageMultiplier);

    // Aplicar vulnerabilidad del defensor
    if (hasEffect(defender, "vulnerable")) {
      damage = Math.round(damage * D20.vulnerableMultiplier);
      removeEffect(defender, "vulnerable");
    }

    result.hit = true;
    result.damage = Math.max(COMBAT.minDamage, damage);
    defender.hp = Math.max(0, defender.hp - result.damage);
    result.defenderKO = defender.hp <= 0;
    if (result.defenderKO) defender.ko = true;
    result.details = `💥 ¡CRÍTICO! ${attacker.name} asesta un golpe devastador: *${result.damage}* de daño.`;
    return result;
  }

  // ── Resolución normal (2-19) ────────────────────────────────────
  const multVelocidad = getStatMultiplier(attacker.velocidad || STATS.defaultValue);
  const valorAcierto = d20 * multVelocidad;

  // Defensa pasiva del defensor
  const multReflejos = getStatMultiplier(defender.reflejos || STATS.defaultValue);
  let defensaPasiva = COMBAT.passiveDefenseBase * multReflejos;

  // Si el defensor está esquivando activamente, usar su valor de esquiva en su lugar
  if (hasEffect(defender, "dodging") && defender._dodgeValue) {
    defensaPasiva = defender._dodgeValue;
  }

  // Si el defensor tiene defensa pasiva reducida a 0 (pifia de esquiva)
  if (hasEffect(defender, "dodge_pifia")) {
    defensaPasiva = 0;
    removeEffect(defender, "dodge_pifia");
  }

  if (valorAcierto < defensaPasiva) {
    // Fallo: no conecta
    result.details = `💨 ${attacker.name} ataca (${d20}) pero ${defender.name} evita el golpe. [${Math.round(valorAcierto)} vs ${Math.round(defensaPasiva)}]`;
    return result;
  }

  // ── Impacto: Calcular daño ──────────────────────────────────────
  result.hit = true;
  const baseDamage = rollBaseDamage();
  const multFuerza = getStatMultiplier(attacker.fuerza || STATS.defaultValue);
  const multResistencia = getStatMultiplier(defender.resistencia_fisica || STATS.defaultValue);
  const defenseReduction = COMBAT.defenseReductionBase * multResistencia;

  let damage = Math.round(baseDamage * multFuerza - defenseReduction);

  // Aplicar vulnerabilidad del defensor
  if (hasEffect(defender, "vulnerable")) {
    damage = Math.round(damage * D20.vulnerableMultiplier);
    removeEffect(defender, "vulnerable");
  }

  // Aplicar bloqueo activo
  if (hasEffect(defender, "blocking") && defender._blockValue) {
    damage = Math.max(0, damage - defender._blockValue);
  }

  // Aplicar pifia de esquiva (daño ×1.5)
  if (hasEffect(defender, "dodge_pifia_damage")) {
    damage = Math.round(damage * D20.pifiaReceivedMultiplier);
    removeEffect(defender, "dodge_pifia_damage");
  }

  result.damage = Math.max(COMBAT.minDamage, damage);
  defender.hp = Math.max(0, defender.hp - result.damage);
  result.defenderKO = defender.hp <= 0;
  if (result.defenderKO) defender.ko = true;

  const koTag = result.defenderKO ? " 💀 K.O.!" : "";
  result.details = `⚔️ ${attacker.name} (${d20}) golpea a ${defender.name}: *${result.damage}* de daño.${koTag} [${Math.round(valorAcierto)} vs ${Math.round(defensaPasiva)}]`;

  return result;
}

/**
 * Resuelve una acción de esquivar (D20).
 * Establece un estado defensivo para el turno actual.
 *
 * @param {object} participant - El que esquiva
 * @returns {object} Resultado de la esquiva
 */
function resolveDodge(participant) {
  const d20 = rollD(20);
  const isCrit = d20 === D20.critSuccess;
  const isPifia = d20 === D20.critFail;

  const result = {
    d20,
    isCrit,
    isPifia,
    counterDamage: 0,
    details: "",
  };

  // Limpiar efectos defensivos anteriores
  removeEffect(participant, "dodging");
  removeEffect(participant, "blocking");

  if (isPifia) {
    // Pifia: Defensa pasiva = 0 y daño recibido ×1.5
    participant.efectos_activos = participant.efectos_activos || [];
    participant.efectos_activos.push({ tipo: "dodge_pifia", duracion: 1 });
    participant.efectos_activos.push({ tipo: "dodge_pifia_damage", duracion: 1 });
    result.details = `💀 PIFIA — ${participant.name} tropieza al esquivar. Defensa pasiva reducida a 0 y daño recibido ×1.5.`;
    return result;
  }

  if (isCrit) {
    // Crítico: Esquiva automática + contraataque
    participant.efectos_activos = participant.efectos_activos || [];
    participant.efectos_activos.push({ tipo: "dodging", duracion: 1 });
    participant._dodgeValue = Infinity; // Esquiva todo
    result.counterDamage = D20.critDodgeCounterDamage;
    result.details = `💥 ¡ESQUIVA CRÍTICA! ${participant.name} esquiva cualquier ataque y contraataca con *${result.counterDamage}* de daño.`;
    return result;
  }

  // Normal: Calcular valor de esquiva
  const multReflejos = getStatMultiplier(participant.reflejos || STATS.defaultValue);
  const valorEsquiva = d20 * multReflejos;
  participant.efectos_activos = participant.efectos_activos || [];
  participant.efectos_activos.push({ tipo: "dodging", duracion: 1 });
  participant._dodgeValue = valorEsquiva;

  result.details = `💨 ${participant.name} se prepara para esquivar (${d20}). Valor de esquiva: *${Math.round(valorEsquiva)}*.`;
  return result;
}

/**
 * Resuelve una acción de bloquear (D20).
 *
 * @param {object} participant - El que bloquea
 * @returns {object} Resultado del bloqueo
 */
function resolveBlock(participant) {
  const d20 = rollD(20);
  const isCrit = d20 === D20.critSuccess;
  const isPifia = d20 === D20.critFail;

  const result = {
    d20,
    isCrit,
    isPifia,
    stunTarget: false,
    extraDamageReceived: 0,
    details: "",
  };

  // Limpiar efectos defensivos anteriores
  removeEffect(participant, "dodging");
  removeEffect(participant, "blocking");

  if (isPifia) {
    // Pifia: Defensa colapsa, recibe impacto completo + daño extra
    result.extraDamageReceived = D20.blockCollapseExtraDamage;
    participant.hp = Math.max(0, participant.hp - result.extraDamageReceived);
    result.details = `💀 PIFIA — La guardia de ${participant.name} colapsa. Recibe *${result.extraDamageReceived}* de daño adicional.`;
    if (participant.hp <= 0) {
      participant.ko = true;
      result.details += " 💀 K.O.!";
    }
    return result;
  }

  if (isCrit) {
    // Crítico: Bloquea 100% y aturde al atacante
    participant.efectos_activos = participant.efectos_activos || [];
    participant.efectos_activos.push({ tipo: "blocking", duracion: 1 });
    participant._blockValue = Infinity;
    result.stunTarget = true;
    result.details = `💥 ¡BLOQUEO PERFECTO! ${participant.name} bloquea todo el daño y aturde al atacante por 1 turno.`;
    return result;
  }

  // Normal: Calcular valor de bloqueo
  const multResistencia = getStatMultiplier(participant.resistencia_fisica || STATS.defaultValue);
  const valorBloqueo = d20 * multResistencia;
  participant.efectos_activos = participant.efectos_activos || [];
  participant.efectos_activos.push({ tipo: "blocking", duracion: 1 });
  participant._blockValue = valorBloqueo;

  result.details = `🛡️ ${participant.name} levanta la guardia (${d20}). Reducción de daño: *${Math.round(valorBloqueo)}*.`;
  return result;
}

/**
 * Resuelve el uso de un ítem consumible en combate (D20).
 *
 * @param {object} participant - El que usa el ítem
 * @param {object} item - Datos del ítem (debe tener efecto y potencia)
 * @returns {object} Resultado del uso
 */
function resolveUseItem(participant, item) {
  const d20 = rollD(20);
  const isCrit = d20 === D20.critSuccess;
  const isPifia = d20 === D20.critFail;

  const result = {
    d20,
    isCrit,
    isPifia,
    effectApplied: false,
    healAmount: 0,
    consumed: true,
    details: "",
  };

  if (isPifia) {
    // Pifia: El ítem se desperdicia
    result.consumed = true;
    result.effectApplied = false;
    result.details = `💀 PIFIA — ${participant.name} intenta usar ${item.name} pero se le resbala de las manos. Desperdiciado.`;
    return result;
  }

  if (item.efecto === "cura" && item.potencia) {
    let healAmount = item.potencia;
    if (isCrit) {
      healAmount = Math.round(healAmount * 2); // Crítico duplica curación
      result.details = `💥 ¡CURACIÓN CRÍTICA! ${participant.name} usa ${item.name}: +*${healAmount}* HP.`;
    } else {
      result.details = `🧪 ${participant.name} usa ${item.name} (${d20}): +*${healAmount}* HP.`;
    }
    participant.hp = Math.min(participant.maxHp, participant.hp + healAmount);
    result.healAmount = healAmount;
    result.effectApplied = true;
    return result;
  }

  // Ítem genérico: efecto aplicado con éxito
  result.effectApplied = true;
  result.details = `🧪 ${participant.name} usa ${item.name} (${d20}). Efecto aplicado.`;
  return result;
}

/**
 * Resuelve el uso de una habilidad activa en combate (D20).
 *
 * @param {object} caster - El que lanza la habilidad
 * @param {object} target - Objetivo de la habilidad (puede ser null si es self)
 * @param {object} ability - Datos de la habilidad
 * @returns {object} Resultado del uso de habilidad
 */
function resolveAbility(caster, target, ability) {
  const d20 = rollD(20);
  const isCrit = d20 === D20.critSuccess;
  const isPifia = d20 === D20.critFail;

  const result = {
    d20,
    isCrit,
    isPifia,
    damage: 0,
    heal: 0,
    targetKO: false,
    details: "",
  };

  if (isPifia) {
    result.details = `💀 PIFIA — ${caster.name} intenta usar *${ability.name}* pero la habilidad falla catastróficamente.`;
    return result;
  }

  const multDominio = getStatMultiplier(caster.dominio_magico || STATS.defaultValue);

  if (ability.type === "damage" && target) {
    const baseDmg = ability.baseDamage || COMBAT.baseDamageMax;
    let damage = Math.round(baseDmg * multDominio);

    if (isCrit) {
      damage = Math.round(damage * D20.critDamageMultiplier);
    }

    // Resistencia mágica del objetivo
    const multResMagica = getStatMultiplier(target.resistencia_magica || STATS.defaultValue);
    const magicDefense = COMBAT.defenseReductionBase * multResMagica;
    damage = Math.max(COMBAT.minDamage, damage - Math.round(magicDefense));

    result.damage = damage;
    target.hp = Math.max(0, target.hp - damage);
    result.targetKO = target.hp <= 0;
    if (result.targetKO) target.ko = true;

    const critTag = isCrit ? "💥 ¡CRÍTICO! " : "";
    const koTag = result.targetKO ? " 💀 K.O.!" : "";
    result.details = `✨ ${critTag}${caster.name} lanza *${ability.name}* (${d20}) contra ${target.name}: *${damage}* de daño mágico.${koTag}`;
    return result;
  }

  if (ability.type === "heal") {
    let heal = ability.potencia || 20;
    heal = Math.round(heal * multDominio);
    if (isCrit) heal = Math.round(heal * 2);

    const healTarget = target || caster;
    healTarget.hp = Math.min(healTarget.maxHp, healTarget.hp + heal);
    result.heal = heal;

    const critTag = isCrit ? "💥 ¡CRÍTICO! " : "";
    result.details = `✨ ${critTag}${caster.name} lanza *${ability.name}* (${d20}): +*${heal}* HP a ${healTarget.name}.`;
    return result;
  }

  // Habilidad genérica (buff/debuff)
  result.details = `✨ ${caster.name} usa *${ability.name}* (${d20}). Efecto aplicado.`;
  return result;
}

// ═══════════════════════════════════════════════════════════════════════
//  IA ENEMIGA (Resolución automática de turnos NPC)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Resuelve automáticamente el turno de un enemigo (NPC).
 * Elige la acción más lógica (atacar) y selecciona un objetivo aleatorio.
 *
 * @param {object} room - Sala de combate
 * @param {object} enemy - Participante NPC
 * @param {object[]} alivePlayers - Jugadores vivos
 * @returns {object} Resultado del turno
 */
function resolveEnemyTurn(room, enemy, alivePlayers) {
  if (!alivePlayers || alivePlayers.length === 0) return null;

  // Seleccionar un objetivo aleatorio entre jugadores vivos
  const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];

  // Enemigos siempre atacan (simplificación determinista)
  const attackResult = resolveAttack(enemy, target);

  return {
    enemy,
    target,
    action: "attack",
    result: attackResult,
  };
}

// ═══════════════════════════════════════════════════════════════════════
//  RECOMPENSAS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Genera recompensas al finalizar un combate con victoria.
 *
 * @param {object} room - Sala de combate finalizada
 * @returns {object} Recompensas por jugador { stelas, xp }
 */
function generateReward(room) {
  const enemies = room.participants.filter((p) => p.team === "enemies" && p.ko);
  const alivePlayers = room.participants.filter((p) => p.team === "players" && !p.ko);

  let totalStelas = 0;
  let totalXp = 0;

  for (const e of enemies) {
    totalStelas += roll(e.reward?.stelasMin || 3, e.reward?.stelasMax || 15);
    totalXp += e.reward?.xp || roll(10, 30);
  }

  return {
    stelas: Math.round(totalStelas / Math.max(1, alivePlayers.length)),
    xp: Math.round(totalXp / Math.max(1, alivePlayers.length)),
  };
}

// ═══════════════════════════════════════════════════════════════════════
//  GESTIÓN DE EFECTOS ACTIVOS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Comprueba si un participante tiene un efecto activo.
 * @param {object} participant
 * @param {string} tipo - Nombre del efecto
 * @returns {boolean}
 */
function hasEffect(participant, tipo) {
  return (participant.efectos_activos || []).some((e) => e.tipo === tipo);
}

/**
 * Elimina un efecto activo de un participante.
 * @param {object} participant
 * @param {string} tipo
 */
function removeEffect(participant, tipo) {
  if (!participant.efectos_activos) return;
  participant.efectos_activos = participant.efectos_activos.filter((e) => e.tipo !== tipo);
}

/**
 * Reduce la duración de todos los efectos activos en 1 turno.
 * Elimina los que hayan expirado.
 * @param {object} participant
 */
function tickEffects(participant) {
  if (!participant.efectos_activos) return;
  participant.efectos_activos = participant.efectos_activos.filter((e) => {
    e.duracion--;
    return e.duracion > 0;
  });
  // Limpiar valores temporales de esquiva/bloqueo cuando sus efectos expiren
  if (!hasEffect(participant, "dodging")) delete participant._dodgeValue;
  if (!hasEffect(participant, "blocking")) delete participant._blockValue;
}

function reduceBuffTimers(participant) {
  if (!participant.buffs) return participant;
  participant.buffs = participant.buffs.map((b) => ({ ...b, duration: b.duration - 1 })).filter((b) => b.duration > 0);
  return participant;
}

function processAttack(room, attackerId, targetId, zone, options = {}) {
  const turnManager = require("./combatTurnManager");
  const attacker = turnManager.getParticipantByJid(room, attackerId);
  const defender = turnManager.getParticipantByJid(room, targetId);
  if (!attacker) return { error: "Atacante no encontrado" };
  if (!defender) return { error: "Objetivo no encontrado" };
  const opts = { damageType: "impacto", moveNumber: 1, damageMultiplier: 1, ...options };
  const atkStats = getEffectiveStats(attacker, room?.activeEffects);
  const result = resolveAttack(atkStats, defender);
  if (opts.damageMultiplier !== 1) result.damage = Math.round(result.damage * opts.damageMultiplier);
  return result;
}

function calculateDamageFormula(attacker, defender, zone, options = {}) {
  const atkStats = getEffectiveStats(attacker, options?.activeEffects);
  const atkFuerza = atkStats.fuerza || 5;
  const defRes = defender.resistencia_fisica || 5;
  const zoneMult = { cabeza: 1.5, pecho: 1.0, abdomen: 1.0, extremidad: 0.7 }[zone] || 1.0;
  const baseDamage = Math.max(1, Math.round(atkFuerza * zoneMult - defRes * 0.5));
  return { baseDamage, damageType: "impacto", zone, atkStat: atkFuerza, defStat: defRes };
}

function getEffectiveStats(participant, activeEffects) {
  const result = { ...participant };
  if (Array.isArray(participant.buffs)) {
    for (const buff of participant.buffs) {
      if (buff.stat && typeof buff.value === "number") {
        result[buff.stat] = (result[buff.stat] || 0) + buff.value;
      }
    }
  }
  if (Array.isArray(activeEffects) && activeEffects.length > 0) {
    const env = require("./environmentalEffects");
    const rules = env.getEffectiveRules(activeEffects);
    for (const [stat, delta] of Object.entries(rules)) {
      result[stat] = Math.max(1, (result[stat] || 5) + delta);
    }
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════════

module.exports = {
  // Utilidades
  getStatMultiplier,
  rollD,
  rollBaseDamage,

  // Resolución de acciones
  resolveAttack,
  resolveDodge,
  resolveBlock,
  resolveUseItem,
  resolveAbility,

  // Procesamiento
  processAttack,

  // IA Enemiga
  resolveEnemyTurn,

  // Recompensas
  generateReward,

  // Efectos
  hasEffect,
  removeEffect,
  tickEffects,
  getEffectiveStats,
  reduceBuffTimers,
  calculateDamageFormula,
};
