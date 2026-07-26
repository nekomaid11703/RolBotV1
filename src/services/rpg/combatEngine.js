// @ts-nocheck
const { DAMAGE_MIN, BLOCK_REDUCTION } = require("../../config/combatConfig");
const { applyFatiguePenalties } = require("./fatigueEngine");
/**
 * @constant moduleRegistry
 */
const moduleRegistry = require("../../modules/moduleRegistry");
const { randomFloat } = require("../../utils/randomUtils");

/**
 * Normaliza las estadísticas a un formato consistente con valores por defecto.
 * @param {*} stats - Estadísticas del personaje
 * @returns {*} Estadísticas normalizadas con todas las claves requeridas
 */
function normalizeStats(stats = {}) {
  return {
    atk: Number(stats.atk ?? stats.fuerza ?? stats.str ?? 1),
    def: Number(stats.def ?? stats.defensa ?? 1),
    aspd: Number(stats.aspd ?? stats.velocidad_ataque ?? 1),
    ref: Number(stats.ref ?? stats.reflejos ?? 1),
    mspd: Number(stats.mspd ?? stats.velocidad_movimiento ?? 1),
    fulgor: Number(stats.fulgor ?? stats.capacidad_magica ?? stats.magic ?? 1),
    d_fulgor: Number(stats.d_fulgor ?? stats.dominio_magico ?? stats.dmagic ?? 1),
    r_fulgor: Number(stats.r_fulgor ?? stats.resistencia_magica ?? stats.rmagic ?? 1),
  };
}

/**
 * Aplica penalizaciones por fatiga y estado a las estadísticas del personaje.
 * @param {*} stats - Estadísticas base del personaje
 * @param {number} hp - Puntos de vida actuales
 * @param {number} [fatigue] - Nivel de fatiga actual
 * @param {number} [resistance] - Resistencia a fatiga
 * @returns {*} Estadísticas con penalizaciones aplicadas
 */
function applyPenalties(stats, hp, fatigue = 0, resistance = 0) {
  /**
   * @constant normalized
   */
  const normalized = normalizeStats(stats);
  /**
   * @constant fatigueApplied
   */
  const fatigueApplied = fatigue > 0 ? applyFatiguePenalties(normalized, fatigue, resistance) : normalized;

  /**
   * @constant penalized
   * @type {Object}
   */
  const penalized = {};
  for (const key of Object.keys(fatigueApplied)) {
    penalized[key] = Math.max(0, Math.round(fatigueApplied[key]));
  }
  return penalized;
}

/**
 * Calcula el daño base de un ataque entre atacante y defensor.
 * @param {*} attackerStats - Estadísticas del atacante
 * @param {*} defenderStats - Estadísticas del defensor
 * @param {number} attackerHp - HP del atacante
 * @param {number} defenderHp - HP del defensor
 * @param {number} [attackerFatigue] - Fatiga del atacante
 * @param {number} [defenderFatigue] - Fatiga del defensor
 * @param {number} [attackerRes] - Resistencia del atacante
 * @param {number} [defenderRes] - Resistencia del defensor
 * @returns {number} Daño calculado (mínimo DAMAGE_MIN)
 */
function calculateDamage(
  attackerStats,
  defenderStats,
  attackerHp,
  defenderHp,
  attackerFatigue = 0,
  defenderFatigue = 0,
  attackerRes = 0,
  defenderRes = 0,
) {
  /**
   * @constant atkPenalized
   */
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);
  /**
   * @constant defPenalized
   */
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);

  /**
   * @constant rawDamage
   */
  const rawDamage = Math.floor(atkPenalized.atk * (100 / (100 + defPenalized.def)));
  return Number.isFinite(rawDamage) ? Math.max(DAMAGE_MIN, rawDamage) : DAMAGE_MIN;
}

/**
 * Determina si el defensor puede reaccionar al ataque (reflejos vs velocidad de ataque).
 * @param {*} defenderStats - Estadísticas del defensor
 * @param {number} defenderHp - HP del defensor
 * @param {*} attackerStats - Estadísticas del atacante
 * @param {number} attackerHp - HP del atacante
 * @param {number} [defenderFatigue] - Fatiga del defensor
 * @param {number} [attackerFatigue] - Fatiga del atacante
 * @param {number} [defenderRes] - Resistencia del defensor
 * @param {number} [attackerRes] - Resistencia del atacante
 * @returns {boolean} true si el defensor puede reaccionar
 */
function canReact(
  defenderStats,
  defenderHp,
  attackerStats,
  attackerHp,
  defenderFatigue = 0,
  attackerFatigue = 0,
  defenderRes = 0,
  attackerRes = 0,
) {
  /**
   * @constant defPenalized
   */
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);
  /**
   * @constant atkPenalized
   */
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);
  return defPenalized.ref > atkPenalized.aspd;
}

/**
 * Evalúa si esquivar resultará en dodge exitoso (sin cálculo mental para el jugador).
 * @param {*} defenderStats - Estadísticas del defensor
 * @param {number} defenderHp - HP del defensor
 * @param {*} attackerStats - Estadísticas del atacante
 * @param {number} attackerHp - HP del atacante
 * @param {number} [defenderFatigue] - Fatiga del defensor
 * @param {number} [attackerFatigue] - Fatiga del atacante
 * @param {number} [defenderRes] - Resistencia del defensor
 * @param {number} [attackerRes] - Resistencia del atacante
 * @returns {boolean} true si el jugador podrá esquivar completamente
 */
function evaluateDodgeFeasibility(
  defenderStats,
  defenderHp,
  attackerStats,
  attackerHp,
  defenderFatigue = 0,
  attackerFatigue = 0,
  defenderRes = 0,
  attackerRes = 0,
) {
  /**
   * @constant defPenalized
   */
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);
  /**
   * @constant atkPenalized
   */
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);
  return defPenalized.mspd > atkPenalized.aspd;
}

/**
 * Evalúa la probabilidad de huida basada en MSPD comparativo.
 * @param {*} fleerStats - Estadísticas del que huye
 * @param {number} fleerHp - HP del que huye
 * @param {*} pursuerStats - Estadísticas del perseguidor
 * @param {number} pursuerHp - HP del perseguidor
 * @param {number} [fleerFatigue] - Fatiga del que huye
 * @param {number} [pursuerFatigue] - Fatiga del perseguidor
 * @param {number} [fleerRes] - Resistencia del que huye
 * @param {number} [pursuerRes] - Resistencia del perseguidor
 * @returns {{ chance: number, roll: number, success: boolean }} Resultado de la tirada de huida
 */
function rollFlee(
  fleerStats,
  fleerHp,
  pursuerStats,
  pursuerHp,
  fleerFatigue = 0,
  pursuerFatigue = 0,
  fleerRes = 0,
  pursuerRes = 0,
) {
  /**
   * @constant fleerPenalized
   */
  const fleerPenalized = applyPenalties(fleerStats, fleerHp, fleerFatigue, fleerRes);
  /**
   * @constant pursuerPenalized
   */
  const pursuerPenalized = applyPenalties(pursuerStats, pursuerHp, pursuerFatigue, pursuerRes);

  /**
   * @variable chance
   * @type {any}
   */
  let chance;
  if (fleerPenalized.mspd > pursuerPenalized.mspd) {
    chance = 1.0; // Garantizado
  } else if (fleerPenalized.mspd === pursuerPenalized.mspd) {
    chance = 0.5;
  } else {
    chance = 0.25;
  }

  /**
   * @constant roll
   */
  const roll = randomFloat();
  return { chance, roll, success: roll < chance };
}

/**
 * Intenta bloquear un ataque entrante, reduciendo el daño según BLOCK_REDUCTION.
 * @param {number} incomingDamage - Daño entrante a bloquear
 * @returns {{ blocked: boolean, damage: number }} Resultado del bloqueo con daño reducido
 */
function attemptBlock(incomingDamage) {
  return {
    blocked: true,
    damage: Math.max(DAMAGE_MIN, Math.round(incomingDamage * (1 - BLOCK_REDUCTION))),
  };
}

/**
 * Intenta esquivar un ataque basado en velocidad de movimiento vs velocidad de ataque.
 * @param {*} defenderStats - Estadísticas del defensor
 * @param {number} defenderHp - HP del defensor
 * @param {*} attackerStats - Estadísticas del atacante
 * @param {number} attackerHp - HP del atacante
 * @param {number} [defenderFatigue] - Fatiga del defensor
 * @param {number} [attackerFatigue] - Fatiga del atacante
 * @param {number} [defenderRes] - Resistencia del defensor
 * @param {number} [attackerRes] - Resistencia del atacante
 * @returns {{ dodged: boolean, damage: (number|null) }} Resultado del intento de esquiva
 */
function attemptDodge(
  defenderStats,
  defenderHp,
  attackerStats,
  attackerHp,
  defenderFatigue = 0,
  attackerFatigue = 0,
  defenderRes = 0,
  attackerRes = 0,
) {
  /**
   * @constant defPenalized
   */
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);
  /**
   * @constant atkPenalized
   */
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);

  if (defPenalized.mspd > atkPenalized.aspd) {
    return { dodged: true, damage: 0 };
  }
  return { dodged: false, damage: null };
}

/**
 * Ejecuta la fase de ataque de un turno, calculando daño base y posibilidad de reacción.
 * @param {*} attackerChar - Personaje atacante
 * @param {*} defenderChar - Personaje defensor
 * @param {number} defenderHp - HP actual del defensor
 * @param {number} attackerHp - HP actual del atacante
 * @param {number} [attackerFatigue] - Fatiga del atacante
 * @param {number} [defenderFatigue] - Fatiga del defensor
 * @returns {*} Información del ataque ejecutado
 */
function executeAttack(attackerChar, defenderChar, defenderHp, attackerHp, attackerFatigue = 0, defenderFatigue = 0) {
  /**
   * @constant attackerStats
   */
  const attackerStats = attackerChar.stats || {};
  /**
   * @constant defenderStats
   */
  const defenderStats = defenderChar.stats || {};
  /**
   * @constant attackerRes
   */
  const attackerRes = attackerStats.def || 0;
  /**
   * @constant defenderRes
   */
  const defenderRes = defenderStats.def || 0;

  /**
   * @constant baseDamage
   */
  const baseDamage = calculateDamage(
    attackerStats,
    defenderStats,
    attackerHp,
    defenderHp,
    attackerFatigue,
    defenderFatigue,
    attackerRes,
    defenderRes,
  );
  /**
   * @constant reactPossible
   */
  const reactPossible = canReact(
    defenderStats,
    defenderHp,
    attackerStats,
    attackerHp,
    defenderFatigue,
    attackerFatigue,
    defenderRes,
    attackerRes,
  );

  return {
    attackerName: attackerChar.name,
    defenderName: defenderChar.name,
    baseDamage,
    canReact: reactPossible,
    defenderHpBefore: defenderHp,
  };
}

/**
 * Ejecuta la reacción del defensor (esquivar, bloquear o ninguna) y aplica el daño final.
 * @param {string} reactionType - Tipo de reacción ('dodge', 'block', 'none')
 * @param {number} baseDamage - Daño base antes de reacción
 * @param {*} defenderChar - Personaje defensor
 * @param {number} defenderHp - HP actual del defensor
 * @param {*} attackerChar - Personaje atacante
 * @param {number} attackerHp - HP actual del atacante
 * @param {number} [defenderFatigue] - Fatiga del defensor
 * @param {number} [attackerFatigue] - Fatiga del atacante
 * @returns {*} Resultado completo de la reacción con daño final
 */
function executeReaction(
  reactionType,
  baseDamage,
  defenderChar,
  defenderHp,
  attackerChar,
  attackerHp,
  defenderFatigue = 0,
  attackerFatigue = 0,
) {
  /**
   * @constant attackerStats
   */
  const attackerStats = attackerChar.stats || {};
  /**
   * @constant defenderStats
   */
  const defenderStats = defenderChar.stats || {};
  /**
   * @constant attackerRes
   */
  const attackerRes = attackerStats.def || 0;
  /**
   * @constant defenderRes
   */
  const defenderRes = defenderStats.def || 0;

  /**
   * @variable finalDamage
   * @type {any}
   */
  let finalDamage;
  /**
   * @variable reaction
   * @type {any}
   */
  let reaction;
  /**
   * @variable dodged
   * @type {boolean}
   */
  let dodged = false;

  if (reactionType === "dodge") {
    /**
     * @constant dodgeResult
     */
    const dodgeResult = attemptDodge(
      defenderStats,
      defenderHp,
      attackerStats,
      attackerHp,
      defenderFatigue,
      attackerFatigue,
      defenderRes,
      attackerRes,
    );
    if (dodgeResult.dodged) {
      finalDamage = 0;
      dodged = true;
      reaction = "dodge";
    } else {
      finalDamage = baseDamage;
      reaction = "dodge_failed";
    }
  } else if (reactionType === "block") {
    /**
     * @constant blockResult
     */
    const blockResult = attemptBlock(baseDamage);
    finalDamage = blockResult.damage;
    reaction = "block";
  } else {
    reaction = "none";
    finalDamage = baseDamage;
  }

  /**
   * @constant defenderHpAfter
   */
  const defenderHpAfter = Math.max(0, defenderHp - finalDamage);

  return {
    attackerName: attackerChar.name,
    defenderName: defenderChar.name,
    baseDamage,
    reaction,
    finalDamage,
    dodged,
    defenderHpBefore: defenderHp,
    defenderHpAfter,
    ko: defenderHpAfter <= 0,
  };
}

/**
 * La IA elige la mejor reacción disponible (esquivar, bloquear o ninguna).
 * @param {*} defenderChar - Personaje defensor (IA)
 * @param {number} defenderHp - HP del defensor
 * @param {*} attackerChar - Personaje atacante
 * @param {number} baseDamage - Daño base del ataque
 * @param {number} attackerHp - HP del atacante
 * @param {number} [defenderFatigue] - Fatiga del defensor
 * @param {number} [attackerFatigue] - Fatiga del atacante
 * @returns {string} Reacción elegida ('dodge', 'block', 'none')
 */
function chooseAiReaction(
  defenderChar,
  defenderHp,
  attackerChar,
  baseDamage,
  attackerHp,
  defenderFatigue = 0,
  attackerFatigue = 0,
) {
  /**
   * @constant attackerStats
   */
  const attackerStats = attackerChar.stats || {};
  /**
   * @constant defenderStats
   */
  const defenderStats = defenderChar.stats || {};
  /**
   * @constant attackerRes
   */
  const attackerRes = attackerStats.def || 0;
  /**
   * @constant defenderRes
   */
  const defenderRes = defenderStats.def || 0;

  /**
   * @constant reactPossible
   */
  const reactPossible = canReact(
    defenderStats,
    defenderHp,
    attackerStats,
    attackerHp,
    defenderFatigue,
    attackerFatigue,
    defenderRes,
    attackerRes,
  );
  if (!reactPossible) {
    return "none";
  }

  /**
   * @constant dodgeCheck
   */
  const dodgeCheck = attemptDodge(
    defenderStats,
    defenderHp,
    attackerStats,
    attackerHp,
    defenderFatigue,
    attackerFatigue,
    defenderRes,
    attackerRes,
  );
  if (dodgeCheck.dodged) {
    return "dodge";
  }
  return "block";
}

/**
 * Ejecuta un turno completo de combate: ataque + reacción (elegida o automática).
 * @param {*} attackerChar - Personaje atacante
 * @param {*} defenderChar - Personaje defensor
 * @param {number} defenderHp - HP del defensor
 * @param {number} attackerHp - HP del atacante
 * @param {string|null} [chosenReaction] - Reacción forzada (null para IA)
 * @param {number} [attackerFatigue] - Fatiga del atacante
 * @param {number} [defenderFatigue] - Fatiga del defensor
 * @returns {*} Resultado completo del turno
 */
function executeTurn(
  attackerChar,
  defenderChar,
  defenderHp,
  attackerHp,
  chosenReaction = null,
  attackerFatigue = 0,
  defenderFatigue = 0,
) {
  /**
   * @constant attackInfo
   */
  const attackInfo = executeAttack(
    attackerChar,
    defenderChar,
    defenderHp,
    attackerHp,
    attackerFatigue,
    defenderFatigue,
  );
  if (!attackInfo.canReact) {
    return executeReaction(
      "none",
      attackInfo.baseDamage,
      defenderChar,
      defenderHp,
      attackerChar,
      attackerHp,
      defenderFatigue,
      attackerFatigue,
    );
  }

  /**
   * @constant reaction
   */
  const reaction =
    chosenReaction ||
    chooseAiReaction(
      defenderChar,
      defenderHp,
      attackerChar,
      attackInfo.baseDamage,
      attackerHp,
      defenderFatigue,
      attackerFatigue,
    );
  return executeReaction(
    reaction,
    attackInfo.baseDamage,
    defenderChar,
    defenderHp,
    attackerChar,
    attackerHp,
    defenderFatigue,
    attackerFatigue,
  );
}

/**
 * Calcula la recompensa de XP basada en el nivel del enemigo y si el jugador ganó.
 * @param {number} [enemyLevel] - Nivel del enemigo derrotado
 * @param {boolean} [isWinner] - true si el jugador ganó el combate
 * @returns {number} Puntos de XP otorgados
 */
function calculateXpReward(enemyLevel = 1, isWinner = true) {
  /**
   * @constant lvl
   */
  const lvl = Math.max(1, Number(enemyLevel) || 1);
  /**
   * @constant baseXp
   */
  const baseXp = 50 + lvl * 2;
  return isWinner ? baseXp : Math.round(baseXp * 0.3);
}

/**
 * Aplica modificadores de módulos al daño de ataque.
 * @param {*} character - Personaje con módulos equipados
 * @param {number} baseDamage - Daño base antes de modificadores
 * @param {*} [context] - Contexto adicional para los módulos
 * @returns {number} Daño modificado
 */
function applyAttackModifiers(character, baseDamage, context = {}) {
  /**
   * @constant modules
   */
  const modules = character.slots?.modules;
  if (!modules) return baseDamage;

  /**
   * @variable modified
   * @type {any}
   */
  let modified = baseDamage;
  for (const [type, config] of Object.entries(modules)) {
    /**
     * @constant mod
     */
    const mod = moduleRegistry.createInstance(type, config);
    if (mod && mod.constructor.triggers.includes("Attack")) {
      /**
       * @constant result
       */
      const result = mod.onAttack({ ...context, baseDamage, character });
      if (result && typeof result.damageMod === "number") {
        modified = Math.max(0, modified + result.damageMod);
      }
    }
  }
  return modified;
}

/**
 * Aplica modificadores de módulos al daño recibido.
 * @param {*} character - Personaje con módulos equipados
 * @param {number} incomingDamage - Daño entrante antes de modificadores
 * @param {*} [context] - Contexto adicional para los módulos
 * @returns {number} Daño modificado tras recibir el golpe
 */
function applyHitModifiers(character, incomingDamage, context = {}) {
  /**
   * @constant modules
   */
  const modules = character.slots?.modules;
  if (!modules) return incomingDamage;

  /**
   * @variable modified
   * @type {any}
   */
  let modified = incomingDamage;
  for (const [type, config] of Object.entries(modules)) {
    /**
     * @constant mod
     */
    const mod = moduleRegistry.createInstance(type, config);
    if (mod && mod.constructor.triggers.includes("Hit")) {
      /**
       * @constant result
       */
      const result = mod.onHit({ ...context, incomingDamage, character });
      if (result && typeof result.damageMod === "number") {
        modified = Math.max(0, modified + result.damageMod);
      }
    }
  }
  return modified;
}

module.exports = {
  normalizeStats,
  applyPenalties,
  calculateDamage,
  canReact,
  evaluateDodgeFeasibility,
  rollFlee,
  attemptBlock,
  attemptDodge,
  executeAttack,
  executeReaction,
  chooseAiReaction,
  executeTurn,
  calculateXpReward,
  applyAttackModifiers,
  applyHitModifiers,
};
