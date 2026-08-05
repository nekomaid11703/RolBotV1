// @ts-nocheck
"use strict";

const { RACES } = require("../../src/config/characterConfig");
const { getWeaponStats, getArmorStats } = require("../../src/services/rpg/itemStatService");
const {
  PERSONALITIES,
  WEIGHT_JITTER,
  GENERATED_STATS,
  PHYSICAL_STATS,
  MAGIC_STATS,
  LEVEL_MIN,
  LEVEL_MAX,
  LEVEL_DIFF_MAX_PCT,
  STAT_CLAMP,
  STAT_SOFT_CAP,
  HP_STAT_MULTIPLIER,
  ITEM_POOL,
  ITEM_STOCK_MIN,
  ITEM_STOCK_MAX,
  IRON_FAMILY,
  ARMOR_SLOTS,
  COVERAGES,
  TIER_BRACKETS,
  TIER_DOWN_CHANCES,
  NO_WEAPON_CHANCE,
  NO_PIECE_CHANCE,
  SHIELD_CHANCE,
  AMULET_CHANCE,
  SET_BONUS_THRESHOLD,
  SET_BONUS,
  MAGIC_ALLOC_CHANCE,
  MAGIC_SHARE_MIN,
  MAGIC_SHARE_MAX,
} = require("./config");

const RACE_KEYS = Object.keys(RACES);
const PERSONALITY_KEYS = Object.keys(PERSONALITIES);

/**
 *
 */
function randomRace() {
  return RACE_KEYS[Math.floor(Math.random() * RACE_KEYS.length)];
}

/**
 *
 */
function randomPersonality() {
  return PERSONALITY_KEYS[Math.floor(Math.random() * PERSONALITY_KEYS.length)];
}

/**
 *
 * @param val
 * @param min
 * @param max
 */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Clampa todas las stats de un objeto stats.
 * @param {object} stats
 * @returns {object}
 */
function clampAll(stats) {
  const out = {};
  for (const [key, value] of Object.entries(stats)) {
    out[key] = clamp(value, STAT_CLAMP.min, STAT_CLAMP.max);
  }
  return out;
}

function softCapWeight(cur, weight) {
  if (cur >= STAT_CLAMP.max) return 0;
  if (cur <= STAT_SOFT_CAP) return Math.max(0.0001, weight || 0);
  // Decay cuadrático: el peso marginal colapsa al acercarse al clamp
  // (diversificación realista del jugador cerca del cap).
  const d = (STAT_CLAMP.max - cur) / (STAT_CLAMP.max - STAT_SOFT_CAP);
  return Math.max(0.0001, (weight || 0) * d * d);
}

/**
 * Asigna un delta de puntos (positivo = subir de nivel, negativo = bajar)
 * repartido punto a punto según los pesos de personalidad — comportamiento
 * de jugador: cada punto nuevo se gasta según la prioridad del estilo.
 *
 * Soft cap: el peso marginal de una stat decae cuadráticamente desde
 * STAT_SOFT_CAP hasta 0 en el clamp. Un jugador que se acerca al cap
 * diversifica hacia sus stats secundarias → evita la saturación que
 * aplana la varianza de los datos.
 * @param {object} baseStats - Stats de partida (no se mutan)
 * @param {number} delta - Puntos a añadir (positivo) o quitar (negativo)
 * @param {object} weights - Pesos por stat
 * @param {Array<string>} keys - Stats que participan
 * @returns {object} Stats resultantes (sin clamp final)
 */
function allocateDelta(baseStats, delta, weights, keys) {
  const result = { ...baseStats };
  if (delta > 0) {
    let remaining = delta;
    let guard = 0;
    while (remaining > 0 && guard++ < 100000) {
      const effective = {};
      let total = 0;
      let hasSpace = false;
      for (const key of keys) {
        const cur = result[key] || 0;
        if (cur >= STAT_CLAMP.max) {
          effective[key] = 0;
          continue;
        }
        effective[key] = softCapWeight(cur, weights[key]);
        total += effective[key];
        hasSpace = true;
      }
      if (!hasSpace || total <= 0) break;
      let roll = Math.random() * total;
      let chosen = null;
      for (const key of keys) {
        if (effective[key] <= 0) continue;
        roll -= effective[key];
        if (roll <= 0) {
          chosen = key;
          break;
        }
      }
      if (!chosen) chosen = keys[keys.length - 1];
      result[chosen] = (result[chosen] || 0) + 1;
      remaining--;
    }
  } else if (delta < 0) {
    let remaining = -delta;
    let guard = 0;
    while (remaining > 0 && guard++ < 100000) {
      let chosen = null;
      let minEff = Infinity;
      for (const key of keys) {
        const cur = result[key] || 0;
        if (cur <= STAT_CLAMP.min) continue;
        const eff = softCapWeight(cur, weights[key]);
        if (eff < minEff) {
          minEff = eff;
          chosen = key;
        }
      }
      if (chosen == null) break;
      result[chosen] = (result[chosen] || 0) - 1;
      remaining--;
    }
  }
  return result;
}

/**
 * Tier probabilístico por bracket de nivel: 60% tier del bracket,
 * 30% uno inferior, 10% dos inferiores (varianza para medir el efecto
 * puro del tier sin confundirlo con el nivel).
 * @param {number} level
 * @returns {string} Tier de calidad (E, C, B, A)
 */
function pickTierByLevel(level) {
  const idx = TIER_BRACKETS.findIndex((b) => level >= b.minLevel && level <= b.maxLevel);
  const baseIdx = idx === -1 ? TIER_BRACKETS.length - 1 : idx;
  const roll = Math.random();
  let chosen = baseIdx;
  if (roll >= TIER_DOWN_CHANCES[0]) chosen = Math.max(0, baseIdx - 1);
  if (roll >= TIER_DOWN_CHANCES[0] + TIER_DOWN_CHANCES[1]) chosen = Math.max(0, baseIdx - 2);
  return TIER_BRACKETS[chosen].tier;
}

/**
 * Deriva las stats de un arma con la fórmula real (base × tier × material).
 * @param {object} poolEntry - Entrada de IRON_FAMILY.weaponPool
 * @param {string} tier
 * @returns {object} Arma con stats derivadas
 */
function deriveWeapon(poolEntry, tier) {
  const def = {
    tier,
    material: IRON_FAMILY.material,
    modules: {
      weapon: {
        damageNature: poolEntry.damageNature,
        baseDamage: poolEntry.nominalDamage,
        hands: poolEntry.hands,
        weaponRange: poolEntry.weaponRange,
      },
    },
  };
  const stats = getWeaponStats(def);
  return { ...poolEntry, ...stats, name: poolEntry.name, tier, material: IRON_FAMILY.material };
}

/**
 * Deriva las stats de una pieza de armadura con la fórmula real
 * (maxResist = round(resistencia × tierMult); bonusDef = round(maxResist / 2)).
 * @param {string} slot
 * @param {string} coverage
 * @param {string} tier
 * @returns {object} Pieza con stats derivadas
 */
function deriveArmorPiece(slot, coverage, tier) {
  const base = IRON_FAMILY.armorSlotBase[slot];
  const suffix = IRON_FAMILY.coverageSuffix[coverage];
  const name = `${base}${suffix ? ` ${suffix}` : ""}`;
  const def = {
    tier,
    material: IRON_FAMILY.material,
    setId: IRON_FAMILY.setId,
    modules: { armor: { slot, coverage } },
  };
  const stats = getArmorStats(def);
  return {
    id: `${slot}_${coverage}`,
    name,
    material: IRON_FAMILY.material,
    tier,
    ...stats,
    currentResist: stats.maxResist,
  };
}

/**
 * Deriva el escudo de hierro (pieza armor en mano_izq, cobertura alta).
 * @param {string} tier
 * @returns {object} Pieza escudo
 */
function deriveShield(tier) {
  const shield = IRON_FAMILY.shield;
  const def = {
    tier,
    material: IRON_FAMILY.material,
    setId: IRON_FAMILY.setId,
    modules: { armor: { slot: shield.slot, coverage: shield.coverage } },
  };
  const stats = getArmorStats(def);
  return {
    id: shield.id,
    name: shield.name,
    material: IRON_FAMILY.material,
    tier,
    ...stats,
    currentResist: stats.maxResist,
  };
}

/**
 * Genera el equipamiento completo de un luchador: arma (3 naturalezas),
 * piezas por slot (4 slots × 4 coberturas), escudo en mano_izq y amuleto.
 * El tier de calidad es probabilístico por bracket de nivel.
 *
 * `opts` permite forzar condiciones (presets de experimento):
 *   tier, weapon (id del pool), coverage (todas las piezas), shield,
 *   amulet, setPieces ("full" | "max2").
 * @param {number} level
 * @param {object} [opts]
 * @returns {{ tierKey: string, weapon: object|null, armorList: Array<object>, armor: object|null, shield: object|null, amulet: object|null, setPieces: number, setBonusActive: boolean }}
 */
function generateEquipment(level, opts = {}) {
  opts = opts || {};
  const tierKey = opts.tier || pickTierByLevel(level);

  const pool = IRON_FAMILY.weaponPool;
  const forcedWeapon = opts.weapon ? pool.find((w) => w.id === opts.weapon) : null;
  const hasWeapon = forcedWeapon ? true : Math.random() >= NO_WEAPON_CHANCE;
  const weapon = hasWeapon
    ? deriveWeapon(forcedWeapon || pool[Math.floor(Math.random() * pool.length)], tierKey)
    : null;

  const armorList = [];
  let forcedCount = null;
  if (opts.setPieces === "full") forcedCount = ARMOR_SLOTS.length;
  else if (opts.setPieces === "max2") forcedCount = 2;
  // La cobertura se sortea UNA vez por fighter (todas las piezas iguales),
  // como haría un jugador coherente con su estilo; sortearla por pieza con
  // "la más pesada manda" aplastaba la varianza (65% terminaban en "total").
  const coverage = opts.coverage || COVERAGES[Math.floor(Math.random() * COVERAGES.length)];
  let added = 0;
  for (const slot of ARMOR_SLOTS) {
    const present = forcedCount != null ? added < forcedCount : Math.random() >= NO_PIECE_CHANCE;
    if (!present) continue;
    armorList.push(deriveArmorPiece(slot, coverage, tierKey));
    added++;
  }

  let shield = null;
  const wantShield = opts.shield != null ? opts.shield : Math.random() < SHIELD_CHANCE;
  if (wantShield) {
    shield = deriveShield(tierKey);
    armorList.push(shield);
  }

  let amulet = null;
  if (opts.amulet != null) {
    if (opts.amulet) amulet = { ...IRON_FAMILY.amulet };
  } else if (Math.random() < AMULET_CHANCE) {
    amulet = { ...IRON_FAMILY.amulet };
  }

  const setPieces = armorList.filter((p) => p.setId === IRON_FAMILY.setId).length;
  const setBonusActive = setPieces >= SET_BONUS_THRESHOLD;

  const armorBonusDef = armorList.reduce((acc, p) => acc + (p.bonusDef || 0), 0);
  const armorMaxResist = armorList.reduce((acc, p) => acc + (p.maxResist || 0), 0);

  return {
    tierKey,
    weapon,
    armorList,
    armor: armorList.length ? { bonusDef: armorBonusDef, maxResist: armorMaxResist, pieces: armorList.length } : null,
    shield,
    amulet,
    setPieces,
    setBonusActive,
  };
}

/**
 * Aplica buffs pasivos de equipo (bono de set + amuleto) a las stats.
 * @param {object} stats
 * @param {object} equipment
 * @returns {object} Stats finales clampadas
 */
function applyEquipmentBuffs(stats, equipment) {
  const buffed = { ...stats };
  if (equipment.setBonusActive) {
    for (const [key, value] of Object.entries(SET_BONUS)) {
      buffed[key] = clamp((buffed[key] || 0) + value, STAT_CLAMP.min, STAT_CLAMP.max);
    }
  }
  if (equipment.amulet) {
    for (const [key, value] of Object.entries(equipment.amulet.buff || {})) {
      buffed[key] = clamp((buffed[key] || 0) + value, STAT_CLAMP.min, STAT_CLAMP.max);
    }
  }
  return buffed;
}

/**
 * Generate healing item loadout scaled by fighter level.
 * @param {number} level
 * @returns {Array<{ name: string, heal: number }>}
 */
function generateLoadout(level) {
  const stock = ITEM_STOCK_MIN + Math.floor(Math.random() * (ITEM_STOCK_MAX - ITEM_STOCK_MIN + 1));
  const pool = ITEM_POOL.filter((item) => level >= item.minLevel);
  const items = [];

  for (let i = 0; i < stock; i++) {
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    items.push({ name: chosen.name, heal: chosen.heal });
  }

  return items;
}

/**
 * Recorta el exceso de nivel sobre LEVEL_MAX quitando puntos de las stats
 * con menor peso de asignación (preserva la especialización). Los buffs de
 * equipo pueden empujar la suma por encima del tope del simulador.
 * @param {object} stats - Stats finales (con buffs)
 * @param {number} currentLevel
 * @param {object} weights
 * @param {number} magicPointsPerStat
 * @returns {{ stats: object, nivel: number }}
 */
function capToMaxLevel(stats, currentLevel, weights, magicPointsPerStat) {
  if (currentLevel <= LEVEL_MAX) return { stats, nivel: currentLevel };
  const allWeights = {};
  for (const key of GENERATED_STATS) allWeights[key] = weights[key] || 0;
  for (const key of MAGIC_STATS) allWeights[key] = magicPointsPerStat || 0;
  const trimmed = clampAll(
    allocateDelta(stats, LEVEL_MAX - currentLevel, allWeights, [...GENERATED_STATS, ...MAGIC_STATS]),
  );
  return { stats: trimmed, nivel: Object.values(trimmed).reduce((a, b) => a + b, 0) };
}

/**
 * Generate a fighter with personality-based stat allocation.
 *
 * 1. Pick random race -> get baseStats (sum = 50 across 9 stats)
 * 2. Pick random personality -> get allocation weights (physical + hp)
 * 3. Allocate the weight budget point-by-point (player-like spending,
 *    soft cap diversifies near the stat clamp)
 * 4. Magic stats: either reallocated share of the budget or race base
 * 5. Clamp all stats to [1, 100]
 * 6. Generate iron equipment scaled by level (probabilistic tier)
 * 7. Apply equipment buffs (set bonus + amulet) to effective stats
 * 8. nivel = sum of all 9 stats (min 100)
 * 9. HP pool = hp_stat * HP_STAT_MULTIPLIER
 * @param {string} [personalityKey] - Force a specific personality
 * @param {string} [raceKey] - Force a specific race
 * @param {object} [eqOpts] - Opciones de generación de equipo (presets)
 * @returns {{ name: string, stats: object, nivel: number, race: string, personality: string, hp: number, equipment: object, loadout: Array }}
 */
function generateFighter(personalityKey, raceKey, eqOpts) {
  const pKey = personalityKey || randomPersonality();
  const rKey = raceKey || randomRace();
  const personality = PERSONALITIES[pKey];
  const race = RACES[rKey];

  const raceStats = { ...race.baseStats };
  const baseWeights = { ...personality.weights };

  const randomizedWeights = {};
  for (const key of GENERATED_STATS) {
    const base = baseWeights[key] || 0;
    const variation = Math.round(base * (Math.random() * 2 * WEIGHT_JITTER - WEIGHT_JITTER));
    randomizedWeights[key] = Math.max(1, base + variation);
  }

  const budget = Object.values(randomizedWeights).reduce((a, b) => a + b, 0);
  let stats = allocateDelta(raceStats, budget, randomizedWeights, GENERATED_STATS);

  let magicPointsPerStat = 0;
  if (Math.random() < MAGIC_ALLOC_CHANCE) {
    const share = MAGIC_SHARE_MIN + Math.random() * (MAGIC_SHARE_MAX - MAGIC_SHARE_MIN);
    const physicalTotal =
      PHYSICAL_STATS.reduce((acc, key) => acc + (stats[key] || 0), 0) / MAGIC_STATS.length;
    magicPointsPerStat = Math.round(physicalTotal * share);
    for (const key of PHYSICAL_STATS) {
      stats[key] = clamp(Math.round((stats[key] || 0) * (1 - share)), STAT_CLAMP.min, STAT_CLAMP.max);
    }
    for (const key of MAGIC_STATS) {
      stats[key] = clamp((stats[key] || 0) + magicPointsPerStat, STAT_CLAMP.min, STAT_CLAMP.max);
    }
  } else {
    for (const key of MAGIC_STATS) {
      stats[key] = clamp(raceStats[key] || 0, STAT_CLAMP.min, STAT_CLAMP.max);
    }
  }
  stats = clampAll(stats);

  const baseLevel = Math.max(100, Object.values(stats).reduce((a, b) => a + b, 0));
  const equipment = generateEquipment(baseLevel, eqOpts);
  const finalStats = applyEquipmentBuffs(stats, equipment);

  const nivel = Math.max(
    100,
    Object.values(finalStats).reduce((a, b) => a + b, 0),
  );

  const capped = capToMaxLevel(finalStats, nivel, randomizedWeights, magicPointsPerStat);
  const finalCapped = capped.stats;
  const cappedNivel = capped.nivel;

  const loadout = generateLoadout(cappedNivel);

  return {
    name: `${personality.label} ${race.name}`,
    stats: finalCapped,
    nivel: cappedNivel,
    race: rKey,
    personality: pKey,
    allocationWeights: randomizedWeights,
    magicPointsPerStat,
    hp: finalCapped.hp * HP_STAT_MULTIPLIER,
    equipment,
    loadout,
  };
}

/**
 * Scale a fighter's stats to match a target level re-spending the level
 * delta point-by-point with the fighter's own allocation weights (soft cap
 * diversifica cerca del clamp). A diferencia del escalado lineal por ratio,
 * la stat principal NO se duplica hasta saturar el clamp 100.
 * @param {object} fighter
 * @param {number} targetLevel
 * @param {object} [eqOpts] - Opciones de generación de equipo (presets)
 * @returns {object} New fighter with adjusted stats
 */
function scaleToLevel(fighter, targetLevel, eqOpts) {
  const currentLevel = fighter.nivel;
  if (currentLevel === targetLevel) return { ...fighter };

  const weights = {};
  const storedWeights = fighter.allocationWeights || PERSONALITIES[fighter.personality].weights;
  for (const key of GENERATED_STATS) {
    weights[key] = storedWeights[key] || 0;
  }
  for (const key of MAGIC_STATS) {
    weights[key] = fighter.magicPointsPerStat || 0;
  }

  const allocated = allocateDelta(fighter.stats, targetLevel - currentLevel, weights, [...GENERATED_STATS, ...MAGIC_STATS]);
  const newStats = clampAll(allocated);

  const baseLevel = Math.max(
    100,
    Object.values(newStats).reduce((a, b) => a + b, 0),
  );

  const equipment = generateEquipment(baseLevel, eqOpts);
  const finalStats = applyEquipmentBuffs(newStats, equipment);

  const newNivel = Math.max(
    100,
    Object.values(finalStats).reduce((a, b) => a + b, 0),
  );

  const capped = capToMaxLevel(finalStats, newNivel, weights, fighter.magicPointsPerStat || 0);

  return {
    ...fighter,
    stats: capped.stats,
    nivel: capped.nivel,
    hp: capped.stats.hp * HP_STAT_MULTIPLIER,
    equipment,
    loadout: generateLoadout(capped.nivel),
  };
}

/**
 * Generate a pair of fighters with level difference <= 20%.
 * @param {object} [eqOpts] - Opciones de generación de equipo (presets)
 * @returns {{ fighterA: object, fighterB: object }}
 */
function generateFighterPair(eqOpts) {
  const fighterA = generateFighter(null, null, eqOpts);
  const targetLevelA = LEVEL_MIN + Math.floor(Math.random() * (LEVEL_MAX - LEVEL_MIN + 1));
  const scaledFighterA = scaleToLevel(fighterA, targetLevelA, eqOpts);

  const minLevel = Math.max(LEVEL_MIN, Math.round(targetLevelA * (1 - LEVEL_DIFF_MAX_PCT)));
  const maxLevel = Math.min(LEVEL_MAX, Math.round(targetLevelA * (1 + LEVEL_DIFF_MAX_PCT)));
  const targetLevelB = minLevel + Math.floor(Math.random() * (maxLevel - minLevel + 1));

  let fighterB = generateFighter(null, null, eqOpts);
  fighterB = scaleToLevel(fighterB, targetLevelB, eqOpts);

  return { fighterA: scaledFighterA, fighterB };
}

module.exports = {
  generateFighter,
  generateFighterPair,
  generateEquipment,
  scaleToLevel,
  pickTierByLevel,
  deriveWeapon,
  deriveArmorPiece,
  deriveShield,
  applyEquipmentBuffs,
  randomRace,
  randomPersonality,
};
