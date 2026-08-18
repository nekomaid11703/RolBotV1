// @ts-nocheck
const {
  DAMAGE_MIN,
  BLOCK_REDUCTION,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_DISTANCE_BLOCK,
  ASPD_PENALTY_PER_5M,
  DAMAGE_DEFENSE_SCALE,
  DEF_MITIGATION_CAP,
  PIERCE_ATK_SCALE,
  PIERCE_WEAPON_SCALE,
  CONTUNDENTE_BODY_SCALE,
  CONTUNDENTE_MATERIAL_MULT,
  WEAPON_BASE_ATK_WEIGHT,
  WEAPON_ATK_REF,
  DISTANCE_REF_BLOCK,
  DISTANCE_REF_BONUS,
  PROJECTILE_FALL_OFF_RATE,
  PROJECTILE_MIN_SCALE,
  MAX_DISTANCE,
  BOW_DAMAGE_MULT,
  BOW_SPEED_BASE,
  BOW_ASPD_BASE,
  AERO,
  ATK_RANGE_SCALE,
  FALLOFF_K,
  BOW_RANGE_MIN,
  PROJECTILE_ATK_SCALE,
  FULGOR_ATK_SCALE,
  MAGIC_DEFENSE_SCALE,
} = require("../../config/combatConfig");
const { applyFatiguePenalties } = require("./fatigueEngine");
const { randomFloat } = require("../../utils/randomUtils");
const { getTierPenaltyBonus, normalizeTier } = require("../../config/tierConfig");
const {
  BLOCK_PREFER_DEF_THRESHOLD,
  ARMOR_USE_BONUS_DEF_TO_DEF,
  ARMOR_SOAK_RATIO,
  ARMOR_OVERFLOW_TO_HP,
} = require("../../config/combatConfig");

/**
 * Factor de mitigación por DEF con escala y techo tuneables.
 * factor = DAMAGE_DEFENSE_SCALE / (DAMAGE_DEFENSE_SCALE + defEfectiva)
 * defEfectiva = DEF_MITIGATION_CAP > 0 ? min(def, DEF_MITIGATION_CAP) : def
 * @param {number} def
 * @returns {number}
 */
function mitigationFactor(def = 0) {
  const capped = DEF_MITIGATION_CAP > 0 ? Math.min(DEF_MITIGATION_CAP, Math.max(0, def)) : Math.max(0, def);
  return DAMAGE_DEFENSE_SCALE / (DAMAGE_DEFENSE_SCALE + capped);
}

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
   * @type {object}
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
  const rawDamage = Math.floor(atkPenalized.atk * mitigationFactor(defPenalized.def));
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
 * @param attackerAspdPenalty
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
  attackerAspdPenalty = 0,
  distanceRefBonus = 0,
) {
  /**
   * @constant defPenalized
   */
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);
  /**
   * @constant atkPenalized
   */
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);
  return defPenalized.ref + distanceRefBonus > Math.max(0, atkPenalized.aspd + attackerAspdPenalty);
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
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {*} fleerStats
 * @param {*} fleerHp
 * @param {*} pursuerStats
 * @param {*} pursuerHp
 * @param {*} fleerFatigue
 * @param {*} pursuerFatigue
 * @param {*} fleerRes
 * @param {*} pursuerRes
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
 * @param {object} options
 * @param {*} incomingDamage
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
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {object} options
 * @param {*} defenderStats
 * @param {*} defenderHp
 * @param {*} attackerStats
 * @param {*} attackerHp
 * @param {*} defenderFatigue
 * @param {*} attackerFatigue
 * @param {*} defenderRes
 * @param {*} attackerRes
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
 * Alcance efectivo de un arma a distancia (arco):
 * velocidad = atk × ATK_RANGE_SCALE + BOW_SPEED_BASE(tierArco)
 * alcance  = clamp(velocidad × AERO(tierFlecha), BOW_RANGE_MIN, MAX_DISTANCE)
 * Si el weaponInfo ya trae `weaponRange` (arma con alcance fijo), se usa ese.
 * @param {object|null} weaponInfo - Info del arma ({ ranged, tier, weaponRange, arrow })
 * @param {*} [stats] - Stats del atacante (para ATK)
 * @returns {number} Alcance efectivo en metros
 */
function getEffectiveWeaponRange(weaponInfo, stats = {}) {
  if (!weaponInfo?.ranged) return Math.max(1, weaponInfo?.weaponRange || 1);
  const bowTier = normalizeTier(weaponInfo.tier || "E");
  const arrowTier = normalizeTier(weaponInfo.arrow?.tier || bowTier);
  const speed =
    (Number(stats.atk) || 0) * ATK_RANGE_SCALE + (weaponInfo.bowSpeedBase ?? (BOW_SPEED_BASE[bowTier] || 1));
  const range = speed * (AERO[arrowTier] || 1);
  return Math.max(BOW_RANGE_MIN, Math.min(MAX_DISTANCE, Math.round(range)));
}

/**
 * Escala de daño del proyectil según la distancia al borde de su alcance.
 * scale = 1 - (distancia/alcance)^FALLOFF_K → 0 en el borde.
 * @param {object|null} weaponInfo - Info del arma ({ ranged, tier, arrow })
 * @param {number} distance - Distancia del ataque (metros)
 * @param {*} [stats] - Stats del atacante (para el alcance dinámico del arco)
 * @returns {number} Escala de daño (1 en boca de cañón, 0 en el borde)
 */
function getProjectileScale(weaponInfo, distance, stats = {}) {
  const range = getEffectiveWeaponRange(weaponInfo, stats);
  const t = Math.min(1, Math.max(0, distance / range));
  return Math.max(0, 1 - Math.pow(t, FALLOFF_K));
}

/**
 * Calcula la ventaja de reflejos del defensor según la distancia del ataque.
 * Melee: cuenta la distancia de sprint recorrida (distancia − alcance natural).
 * Ranged: cuenta la distancia recorrida por el proyectil.
 * @param {object|null} weaponInfo - Info del arma
 * @param {number} distance - Distancia del ataque (metros)
 * @returns {number} Bonus de REF para el defensor
 */
function getDistanceRefBonus(weaponInfo, distance) {
  if (!weaponInfo) return 0;
  const ranged = Boolean(weaponInfo.ranged);
  const naturalRange = BASE_ATTACK_RANGE + (weaponInfo.weaponRange || 0);
  const coveredDistance = ranged ? distance : Math.max(0, distance - naturalRange);
  return Math.floor(coveredDistance / DISTANCE_REF_BLOCK) * DISTANCE_REF_BONUS;
}

/**
 * Calcula el daño de un arma según su naturaleza (cortante, contundente, perforante).
 * Para combate desarmado o sin weaponInfo, delega a calculateDamage.
 * @param {*} attackerStats - Stats penalizadas del atacante
 * @param {*} defenderStats - Stats penalizadas del defensor
 * @param {object|null} weaponInfo - Info del módulo weapon: { damageNature, tier, baseDamage, ranged, weaponRange }
 * @param {number} [distance] - Distancia del ataque (metros)
 * @returns {{ bodyDamage: number, materialDamage: number, nature: string, ranged: boolean }}
 */
function calculateWeaponDamage(attackerStats, defenderStats, weaponInfo, distance = 0) {
  const nature = weaponInfo?.damageNature || "desarmado";
  const tier = weaponInfo?.tier || "E";
  const weaponBase = Math.max(0, Number(weaponInfo?.baseDamage) || 0);
  const weaponBaseScaled = Math.floor(
    weaponBase *
      (1 -
        WEAPON_BASE_ATK_WEIGHT +
        WEAPON_BASE_ATK_WEIGHT * Math.min(1, Math.max(0, (attackerStats.atk || 0) / WEAPON_ATK_REF))),
  );
  const ranged = Boolean(weaponInfo?.ranged);

  if (!weaponInfo || nature === "desarmado") {
    // Fórmula clásica sin arma: atk del atacante vs def del defensor
    const raw = Math.floor(attackerStats.atk * mitigationFactor(defenderStats.def));
    const bodyDamage = Number.isFinite(raw) ? Math.max(DAMAGE_MIN, raw) : DAMAGE_MIN;
    return { bodyDamage, materialDamage: bodyDamage, nature: "desarmado", ranged: false };
  }

  if (nature === "cortante") {
    // Penetra la defensa natural un 12%-84% según tier
    const penetration = getTierPenaltyBonus(tier);
    const effectiveDef = Math.max(0, Math.floor(defenderStats.def * (1 - penetration)));
    const rawDamage = Math.floor(0.8 * attackerStats.atk) + weaponBaseScaled;
    const bodyDamage = Math.max(DAMAGE_MIN, Math.floor(rawDamage * mitigationFactor(effectiveDef)));
    return { bodyDamage, materialDamage: bodyDamage, nature: "cortante", ranged: false };
  }

  if (nature === "contundente") {
    // Cuerpo: atk mitigado por DEF + componente del arma (CONTUNDENTE_BODY_SCALE).
    // Material: multiplicador fijo (CONTUNDENTE_MATERIAL_MULT) del cuerpo: rompe armadura
    // sin destruirla en un solo golpe (anti-equipamiento, no anti-una-sola-pieza).
    const rawBody =
      Math.floor(attackerStats.atk * mitigationFactor(defenderStats.def)) +
      Math.floor(weaponBaseScaled * CONTUNDENTE_BODY_SCALE);
    const bodyDamage = Math.max(DAMAGE_MIN, rawBody);
    const materialDamage = Math.max(DAMAGE_MIN, Math.floor(bodyDamage * CONTUNDENTE_MATERIAL_MULT));
    return { bodyDamage, materialDamage, nature: "contundente", ranged: false };
  }

  if (nature === "proyectil") {
    // Daño por proyectil (arco + flecha): la flecha aporta baseDamage, el tier del
    // arco multiplica, el falloff decae con la distancia. Ignora DEF natural.
    // Material: mitiga la Resistencia Material (×0.5, spec §2-C).
    const arrowBase = Math.max(0, Number(weaponInfo?.arrow?.baseDamage) || 0);
    if (arrowBase <= 0) {
      // Sin flecha: el arco no aporta daño propio → desarmado.
      const raw = Math.floor(attackerStats.atk * mitigationFactor(defenderStats.def));
      const bodyDamage = Number.isFinite(raw) ? Math.max(DAMAGE_MIN, raw) : DAMAGE_MIN;
      return { bodyDamage, materialDamage: bodyDamage, nature: "desarmado", ranged: false };
    }
    const projectileScale = getProjectileScale(weaponInfo, distance, attackerStats);
    const bowMult = BOW_DAMAGE_MULT[normalizeTier(tier)] || 1.2;
    // El daño del arco escala con ATK del atacante (PROJECTILE_ATK_SCALE) además
    // del daño de la flecha × tier, para no quedarse atrás del melee a nivel alto.
    const atkBonus = Math.floor((Number(attackerStats.atk) || 0) * PROJECTILE_ATK_SCALE);
    const bodyDamage = Math.max(DAMAGE_MIN, Math.floor((arrowBase * bowMult + atkBonus) * projectileScale));
    const materialDamage = Math.max(DAMAGE_MIN, Math.floor(bodyDamage * 0.5));
    return { bodyDamage, materialDamage, nature: "proyectil", ranged: true };
  }

  if (nature === "perforante") {
    // Melee (estoque/lanza/kunai): daño por ATK + componente del arma, ignora DEF natural.
    // Material: mitiga la Resistencia Material (×0.5, spec §2-C).
    const bodyDamage =
      Math.max(DAMAGE_MIN, Math.floor(PIERCE_ATK_SCALE * attackerStats.atk)) +
      Math.floor(weaponBaseScaled * PIERCE_WEAPON_SCALE);
    const materialDamage = Math.max(DAMAGE_MIN, Math.floor(bodyDamage * 0.5));
    return { bodyDamage, materialDamage, nature: "perforante", ranged: false };
  }

  if (nature === "mágico") {
    // Daño mágico directo (espejo de cortante, §11.5.2): término de stats.
    // La habilidad NO tiene obsolescencia; el término plano vive en el FOCO
    // (canalizeBase, espejo de baseDamage) → obsolescencia programada (P2):
    // un foco viejo canaliza menos → el mago necesita forjarse. canalizeScale
    // (si lo expone el foco) multiplica el canal como palanca fina de balance.
    // Mitiga contra la resistencia mágica (r_fulgor) del defensor, no la DEF natural.
    const magicDef = MAGIC_DEFENSE_SCALE / (MAGIC_DEFENSE_SCALE + Math.max(0, defenderStats.r_fulgor || 0));
    const canalizeBase = Math.max(0, Number(weaponInfo?.canalizeBase) || 0);
    const canalize = Math.max(1, Number(weaponInfo?.canalizeScale) || 1);
    const raw = Math.floor(FULGOR_ATK_SCALE * (attackerStats.fulgor || 0) + canalizeBase) * canalize;
    const bodyDamage = Math.max(DAMAGE_MIN, Math.floor(raw * magicDef));
    const materialDamage = Math.max(DAMAGE_MIN, Math.floor(bodyDamage * 0.5));
    return { bodyDamage, materialDamage, nature: "mágico", ranged: false };
  }

  // Naturaleza desconocida: fallback a desarmado
  const raw = Math.floor(attackerStats.atk * mitigationFactor(defenderStats.def));
  const bodyDamage = Number.isFinite(raw) ? Math.max(DAMAGE_MIN, raw) : DAMAGE_MIN;
  return { bodyDamage, materialDamage: bodyDamage, nature: "desarmado", ranged: false };
}

/**
 * Determina la velocidad de reacción del atacante según la naturaleza del arma.
 * Perforante melee: usa ASPD (velocidad natural). Perforante a distancia (arco):
 * usa ATK (fuerza al tensar la cuerda, difícil de reaccionar) + BOW_ASPD_BASE
 * del tier del arco. Resto: ASPD.
 * @param {*} atkPenalized - Stats penalizadas del atacante
 * @param {string} [nature] - Naturaleza del arma
 * @param {object|null} [weaponInfo] - Info del arma ({ ranged, tier, bowAspdBase })
 * @returns {number} Velocidad efectiva del ataque
 */
function resolveAttackerSpeed(atkPenalized, nature, weaponInfo) {
  if (nature === "proyectil") {
    const tier = normalizeTier(weaponInfo.tier || "E");
    const aspdBase = weaponInfo.bowAspdBase ?? (BOW_ASPD_BASE[tier] || 5);
    return atkPenalized.atk + aspdBase;
  }
  return atkPenalized.aspd;
}

/**
 * Ejecuta la fase de ataque de un turno, calculando daño base y posibilidad de reacción.
 * Acepta weaponInfo opcional para aplicar naturaleza de daño del arma equipada.
 * @param {*} attackerChar - Personaje atacante
 * @param {*} defenderChar - Personaje defensor
 * @param {number} defenderHp - HP actual del defensor
 * @param {number} attackerHp - HP actual del atacante
 * @param {number} [attackerFatigue] - Fatiga del atacante
 * @param {number} [defenderFatigue] - Fatiga del defensor
 * @param {object|null} [weaponInfo] - Info del arma equipada ({ damageNature, tier, baseDamage, ranged, weaponRange })
 * @param {number} [distance] - Distancia del ataque (metros)
 * @returns {*} Información del ataque ejecutado
 */
function executeAttack(
  attackerChar,
  defenderChar,
  defenderHp,
  attackerHp,
  attackerFatigue = 0,
  defenderFatigue = 0,
  weaponInfo = null,
  distance = 0,
) {
  const attackerStats = attackerChar.stats || {};
  const defenderStats = defenderChar.stats || {};
  const attackerRes = attackerStats.def || 0;
  const defenderRes = defenderStats.def || 0;

  // Aplicar penalizaciones a stats de ambos
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);

  // Calcular daño según naturaleza del arma (perforante ranged decae con la distancia)
  const damageResult = calculateWeaponDamage(atkPenalized, defPenalized, weaponInfo, distance);

  // Velocidad de ataque efectiva (arco usa ATK, resto usa ASPD)
  const attackerEffectiveSpeed = resolveAttackerSpeed(atkPenalized, damageResult.nature, weaponInfo);

  // Ventaja de reflejos del defensor según la distancia del ataque
  const distanceRefBonus = getDistanceRefBonus(weaponInfo, distance);

  // Chequeo de reacción usando velocidad efectiva y la ventaja por distancia
  const reactPossible = defPenalized.ref + distanceRefBonus > Math.max(0, attackerEffectiveSpeed);

  return {
    attackerName: attackerChar.name,
    defenderName: defenderChar.name,
    baseDamage: damageResult.bodyDamage,
    materialDamage: damageResult.materialDamage,
    damageNature: damageResult.nature,
    ranged: damageResult.ranged,
    canReact: reactPossible,
    distanceRefBonus,
    defenderHpBefore: defenderHp,
  };
}

/**
 * Aplica el daño material a la durabilidad de la armadura equipada del defensor.
 * Si el arma no tiene naturaleza material (desarmado), el overflow es 0.
 * Si no hay armadura, todo el daño material pasa directamente como overflow.
 *
 * @param {number} materialDamage - Daño que impacta la resistencia material
 * @param {object|null} armorDurability - Instancia de DurabilityModule de la armadura del defensor
 * @returns {{ absorbed: number, overflow: number, isBroken: boolean, isDestroyed: boolean }}
 */
function applyMaterialAbsorption(materialDamage, armorDurability) {
  if (!armorDurability || typeof armorDurability.absorbDamage !== "function") {
    // Sin armadura: todo el material damage va como overflow (daño al HP)
    return { absorbed: 0, overflow: materialDamage, isBroken: false, isDestroyed: false };
  }
  return armorDurability.absorbDamage(materialDamage);
}

/**
 * Modo de armadura (Fase C Iteración 1 — aprobado "full"):
 * bonusDef→DEF + soak relativo + overflow→daño a HP (spec §3).
 * Aplica la mecánica validada en el harness experimental a la aplicación de
 * daño real, gobernada por las constantes de combatConfig.js.
 * @param {object} ctx - { finalDamage, materialDamage, dodged, defenderStats, armorBonusDef, armorAbsorption, hasArmor }
 * @returns {{ finalDamage: number, soakApplied: number, defReduction: number, overflowToHp: number }}
 */
function applyArmorMode(ctx) {
  const {
    finalDamage,
    materialDamage,
    dodged,
    defenderStats = {},
    armorBonusDef = 0,
    armorAbsorption = null,
    hasArmor = false,
  } = ctx;

  let outDamage = dodged ? 0 : finalDamage;
  let soakApplied = 0;
  let defReduction = 0;
  let overflowToHp = 0;

  // bonusDef → DEF: mitiga el daño corporal con la fórmula real del motor.
  if (ARMOR_USE_BONUS_DEF_TO_DEF && hasArmor && armorBonusDef > 0) {
    const baseDef = defenderStats.def || 0;
    const factorBase = mitigationFactor(baseDef);
    const factorBoosted = mitigationFactor(baseDef + armorBonusDef);
    if (factorBase > 0) {
      const reductionRatio = 1 - factorBoosted / factorBase;
      defReduction = Math.floor(outDamage * reductionRatio);
      outDamage = Math.max(0, outDamage - defReduction);
    }
  }

  // Soak relativo: la armadura absorbe un % del daño corporal entrante.
  if (ARMOR_SOAK_RATIO > 0 && hasArmor) {
    soakApplied = Math.floor(outDamage * ARMOR_SOAK_RATIO);
    outDamage = Math.max(0, outDamage - soakApplied);
  }

  // Overflow → HP: el material no absorbido por la armadura daña la salud corporal.
  if (ARMOR_OVERFLOW_TO_HP && materialDamage > 0 && !dodged && armorAbsorption) {
    overflowToHp = armorAbsorption.overflow || 0;
    outDamage += overflowToHp;
  }

  return { finalDamage: outDamage, soakApplied, defReduction, overflowToHp };
}

/**
 * Ejecuta la reacción del defensor (esquivar, bloquear o ninguna) y aplica el daño final.
 * Si se proporciona materialDamage y armorDurability, aplica absorción de Resistencia Material
 * antes de calcular el daño al HP corporal.
 *
 * @param {string} reactionType - 'dodge' | 'block' | 'none'
 * @param {number} baseDamage - Daño corporal del ataque (impacta HP)
 * @param {*} defenderChar - Personaje defensor
 * @param {number} defenderHp - HP actual del defensor
 * @param {*} attackerChar - Personaje atacante
 * @param {number} attackerHp - HP actual del atacante
 * @param {number} [defenderFatigue] - Fatiga del defensor
 * @param {number} [attackerFatigue] - Fatiga del atacante
 * @param {number} [materialDamage] - Daño a aplicar a la armadura (opcional)
 * @param {object|null} [armorDurability] - Instancia DurabilityModule de la armadura del defensor
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
  materialDamage = 0,
  armorDurability = null,
) {
  const attackerStats = attackerChar.stats || {};
  const defenderStats = defenderChar.stats || {};
  const attackerRes = attackerStats.def || 0;
  const defenderRes = defenderStats.def || 0;

  let finalDamage;
  let reaction;
  let dodged = false;

  if (reactionType === "dodge") {
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
    const blockResult = attemptBlock(baseDamage);
    finalDamage = blockResult.damage;
    reaction = "block";
  } else {
    reaction = "none";
    finalDamage = baseDamage;
  }

  // Absorción de Resistencia Material: el daño material pasa por la armadura antes que el HP
  let armorAbsorption = null;
  if (materialDamage > 0 && !dodged) {
    armorAbsorption = applyMaterialAbsorption(materialDamage, armorDurability);
  }

  // Modo de armadura (Fase C Iteración 1 — "full"): bonusDef→DEF + soak + overflow→HP.
  // `hasArmor` exige pieza con resistencia disponible (no rota/agotada) para
  // def/soak; el overflow→HP aplica siempre que hubo material no absorbido.
  const hasArmor = Boolean(
    armorDurability &&
    typeof armorDurability.maxResist === "number" &&
    armorDurability.currentResist > 0 &&
    !armorDurability.isBroken,
  );
  const armorBonusDef = hasArmor ? armorDurability.bonusDef || Math.round(armorDurability.maxResist / 2) : 0;
  const armorMode = applyArmorMode({
    finalDamage,
    materialDamage,
    dodged,
    defenderStats,
    armorBonusDef,
    armorAbsorption,
    hasArmor,
  });

  const defenderHpAfter = Math.max(0, defenderHp - armorMode.finalDamage);

  return {
    attackerName: attackerChar.name,
    defenderName: defenderChar.name,
    baseDamage,
    reaction,
    finalDamage: armorMode.finalDamage,
    dodged,
    defenderHpBefore: defenderHp,
    defenderHpAfter,
    ko: defenderHpAfter <= 0,
    armorAbsorption, // null si no hay armadura/material damage
    soakApplied: armorMode.soakApplied,
    defReduction: armorMode.defReduction,
    overflowToHp: armorMode.overflowToHp,
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
 * @param {number} [distanceRefBonus] - Ventaja de reflejos por distancia del atacante
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
  distanceRefBonus = 0,
  defenderEquipment = null,
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
    0,
    distanceRefBonus,
  );
  if (!reactPossible) {
    return "none";
  }

  // IA basada en equipamiento: si el defensor tiene escudo o una armadura con
  // bonusDef alto, prefiere BLOQUEAR (aguanta con durabilidad). Si no, esquiva
  // cuando su MSPD supera la velocidad de ataque (comportamiento anterior).
  const eq = defenderEquipment || {};
  const hasShield = Boolean(eq.shield);
  const armorBonusDef = eq.armor?.bonusDef || 0;
  const preferBlock = hasShield || armorBonusDef >= BLOCK_PREFER_DEF_THRESHOLD;

  if (!preferBlock) {
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
 * Calculate ASPD penalty based on combat distance.
 * @param {number} distance
 * @returns {number}
 */
function getAspdPenalty(distance) {
  const raw = -Math.floor(distance / ASPD_PENALTY_DISTANCE_BLOCK) * ASPD_PENALTY_PER_5M;
  return raw || 0;
}

/**
 * Check if the current distance is within attack range for the combatant.
 * @param {number} distance
 * @param {*} stats
 * @param {number} [weaponRange]
 * @returns {{ canAttack: boolean, effectiveRange: number }}
 */
function checkAttackRange(distance, stats, weaponRange = 0) {
  const mspdBonus = Math.floor((stats.mspd || 0) * MSPD_TO_METERS);
  const effectiveRange = BASE_ATTACK_RANGE + mspdBonus + weaponRange;
  return {
    canAttack: distance <= effectiveRange,
    effectiveRange,
  };
}

module.exports = {
  applyPenalties,
  calculateDamage,
  calculateWeaponDamage,
  applyMaterialAbsorption,
  applyArmorMode,
  resolveAttackerSpeed,
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
  checkAttackRange,
  getAspdPenalty,
  getProjectileScale,
  getEffectiveWeaponRange,
};
