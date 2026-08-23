// @ts-nocheck
"use strict";

const { RACES } = require("../../src/config/characterConfig");
const { FULGOR_POOL_MAX } = require("../../src/config/combatBalance");
const {
  getWeaponStats,
  getProjectileStats,
  getArmorStats,
  getSpellStats,
} = require("../../src/services/rpg/itemStatService");
const { ARCANE_GEAR, ARCANE_SPELLS } = require("../../src/data/arcaneFamily");
const { generateLoadout: generateFamilyLoadout } = require("./familyGenerator");
const {
  PERSONALITIES,
  ARCHETYPE_MAP,
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
  ARROW,
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
  BATTERY_POOL_REF,
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
 * Si el arma es ranged (arco), la flecha es un ítem separado con tier propio:
 * el arco aporta el multiplicador de tier (baseDamage 0) y la flecha el daño base.
 * @param {object} poolEntry - Entrada de IRON_FAMILY.weaponPool
 * @param {string} tier
 * @param {string} [arrowTier] - Tier de la flecha (independiente del arco)
 * @returns {object} Arma con stats derivadas
 */
function deriveWeapon(poolEntry, tier, arrowTier) {
  const def = {
    tier,
    material: IRON_FAMILY.material,
    modules: {
      weapon: {
        damageNature: poolEntry.damageNature,
        baseDamage: poolEntry.nominalDamage,
        hands: poolEntry.hands,
        weaponRange: poolEntry.weaponRange,
        ranged: poolEntry.ranged === true,
      },
    },
  };
  const stats = getWeaponStats(def);

  if (poolEntry.ranged === true) {
    // Flecha separada: baseDamage fijo por material (sin escalado de tier,
    // solo AERO al alcance/falloff) — misma fórmula que el pool y el bot real.
    const arrowDef = {
      tier: arrowTier || tier,
      material: ARROW.material,
      modules: {
        weapon: {
          damageNature: ARROW.damageNature,
          baseDamage: ARROW.nominalDamage,
          hands: 1,
          weaponRange: 0,
        },
      },
    };
    const arrowStats = getProjectileStats(arrowDef);
    return {
      ...poolEntry,
      ...stats,
      name: poolEntry.name,
      tier,
      material: IRON_FAMILY.material,
      baseDamage: arrowStats.baseDamage,
      arrow: { id: ARROW.id, name: ARROW.name, tier: arrowTier || tier, baseDamage: arrowStats.baseDamage },
    };
  }

  return { ...poolEntry, ...stats, name: poolEntry.name, tier, material: IRON_FAMILY.material };
}

/**
 * Deriva las stats de una pieza de armadura con la fórmula real
 * (maxResist = round(resistencia × tierMult); bonusDef = round(maxResist / 2)).
 * @param {string} slot
 * @param {string} coverage
 * @param {string} tier
 * @param {string} [material] - Material (default: IRON_FAMILY.material)
 * @returns {object} Pieza con stats derivadas
 */
function deriveArmorPiece(slot, coverage, tier, material = IRON_FAMILY.material) {
  const base = IRON_FAMILY.armorSlotBase[slot];
  const suffix = IRON_FAMILY.coverageSuffix[coverage];
  const name = `${base}${suffix ? ` ${suffix}` : ""}`;
  const def = {
    tier,
    material,
    setId: IRON_FAMILY.setId,
    modules: { armor: { slot, coverage } },
  };
  const stats = getArmorStats(def);
  return {
    id: `${slot}_${coverage}_${material}`,
    name,
    material,
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
 * Construye el mismo payload de combate que resuelve un foco equipado: la
 * varita canaliza `def` (un hechizo del repertorio experimental o, por defecto,
 * Doom) y el motor conserva la física de un ataque normal.
 * @param {object} [def] - ItemDefinition de hechizo con módulo spell
 * @returns {object}
 */
function deriveMagicWeapon(def) {
  const source = def && def.modules && def.modules.spell ? def : ARCANE_SPELLS.hechizo_doom;
  const focus = ARCANE_GEAR.varita_de_caoba;
  const spell = source.modules.spell;
  const focusStats = getSpellStats(focus);
  return {
    id: `${focus.id}:${source.id}`,
    name: `${source.name}`,
    material: focus.material,
    damageNature: spell.damageNature || "mágico",
    tier: focus.tier,
    baseDamage: spell.baseDamage || 0,
    hands: 1,
    weaponRange: spell.range || 1,
    ranged: false,
    fulgorCost: spell.fulgorCost || spell.resourceCost || 10,
    spellNature: spell.spellNature || "mágico",
    canalizeBase: focusStats.canalizeBase,
    canalizeScale: focusStats.canalizeScale,
    focus: { id: focus.id, name: focus.name },
    spellId: source.id,
    spell: {
      hits: (spell.hits || []).map((hit) => ({ ...hit })),
      effects: (spell.effects || []).map((effect) => ({ ...effect })),
      nature: spell.nature || null,
      kind: spell.kind || null,
      application: spell.application || "externa",
      resolution: spell.resolution
        ? {
            ...spell.resolution,
            statMods: (spell.resolution.statMods || []).map((mod) => ({ ...mod })),
          }
        : null,
    },
  };
}

/**
 * Calcula la batería inicial (pool de fulgor) de un luchador, SEPARADA del
 * stat de daño `fulgor`: depende de la calidad del foco equipado
 * (canalizeBase, derivado del material) más el stat de fulgor, y nunca supera
 * FULGOR_POOL_MAX. `fighter.initialBattery` permite forzar el pool en tests.
 * @param {object} fighter
 * @returns {number}
 */
function initialBattery(fighter) {
  if (typeof fighter.initialBattery === "number") {
    return clamp(fighter.initialBattery, 0, FULGOR_POOL_MAX);
  }
  const weapon = fighter.equipment?.weapon;
  const canalize = Number(weapon?.canalizeBase) || 0;
  const baseFulgor = Number(fighter.stats?.fulgor) || 0;
  const raw = Math.round((baseFulgor + canalize) * BATTERY_POOL_REF);
  return clamp(raw, 0, FULGOR_POOL_MAX);
}

/**
 * Genera el equipamiento completo de un luchador a través del generador de
 * familias (scripts/simulate_combat/familyGenerator.js): el equipo se deriva
 * desde los MATERIALES (peso por rareza desplazado por nivel), el tier se
 * asigna según nivel + rareza del material, y cada pieza sortea su cobertura.
 * Es una capa fina de compatibilidad sobre generateLoadout para mantener los
 * presets de experimento (tier, weapon, coverage, shield, amulet, setPieces).
 *
 * `opts` permite forzar condiciones (presets de experimento):
 *   tier, weapon (id del pool), coverage (todas las piezas), shield,
 *   amulet, setPieces ("full" | "max2"), material, family.
 * @param {number} level
 * @param {object} [opts]
 * @returns {{ tierKey: string, weapon: object|null, armorList: Array<object>, armor: object|null, shield: object|null, amulet: object|null, setPieces: number, setBonusActive: boolean }}
 */
function generateEquipment(level, opts = {}) {
  return generateFamilyLoadout(level, opts);
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
 * Generate healing and magic utility loadouts scaled by fighter level and archetype.
 * @param {number} level
 * @param {string} archetype
 * @returns {Array<{ name: string, heal?: number, fulgorHeal?: number }>}
 */
function generateLoadout(level, archetype = "fisico") {
  const stock = ITEM_STOCK_MIN + Math.floor(Math.random() * (ITEM_STOCK_MAX - ITEM_STOCK_MIN + 1));
  const items = [];

  const hpHeal = level >= 350 ? 150 : level >= 200 ? 80 : 40;
  const hpName = level >= 350 ? "Poción Mayor de HP" : level >= 200 ? "Poción Media de HP" : "Poción Menor de HP";
  items.push({ name: hpName, heal: hpHeal });

  if (archetype === "magico" || archetype === "hibrido") {
    const fulgorHeal = level >= 350 ? 50 : level >= 200 ? 30 : 15;
    const fulgorName = level >= 350 ? "Elixir Supremo de Fulgor" : level >= 200 ? "Poción Media de Fulgor" : "Poción Menor de Fulgor";
    items.push({ name: fulgorName, fulgorHeal });
  }

  while (items.length < stock) {
    items.push({ name: hpName, heal: hpHeal });
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
    const physicalTotal = PHYSICAL_STATS.reduce((acc, key) => acc + (stats[key] || 0), 0) / MAGIC_STATS.length;
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

  const baseLevel = Math.max(
    100,
    Object.values(stats).reduce((a, b) => a + b, 0),
  );
  const archetype = ARCHETYPE_MAP[pKey] || "fisico";
  const equipment = generateEquipment(baseLevel, eqOpts);
  if (archetype === "magico" || archetype === "hibrido" || pKey === "magus") {
    equipment.weapon = deriveMagicWeapon(eqOpts && eqOpts.spell);
  }
  const finalStats = applyEquipmentBuffs(stats, equipment);

  const nivel = Math.max(
    100,
    Object.values(finalStats).reduce((a, b) => a + b, 0),
  );

  const capped = capToMaxLevel(finalStats, nivel, randomizedWeights, magicPointsPerStat);
  const finalCapped = capped.stats;
  const cappedNivel = capped.nivel;

  const { calculateBuildSynergy } = require("../../src/services/rpg/itemStatService");
  const synergyMult = calculateBuildSynergy(finalCapped, equipment, cappedNivel);
  if (synergyMult !== 1.0) {
    for (const k of Object.keys(finalCapped)) {
      finalCapped[k] = Math.max(1, Math.round(finalCapped[k] * synergyMult));
    }
  }

  const loadout = generateLoadout(cappedNivel, archetype);

  return {
    name: `${personality.label} ${race.name}`,
    stats: finalCapped,
    nivel: cappedNivel,
    race: rKey,
    personality: pKey,
    archetype,
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

  const allocated = allocateDelta(fighter.stats, targetLevel - currentLevel, weights, [
    ...GENERATED_STATS,
    ...MAGIC_STATS,
  ]);
  const newStats = clampAll(allocated);

  const baseLevel = Math.max(
    100,
    Object.values(newStats).reduce((a, b) => a + b, 0),
  );

  const equipment = generateEquipment(baseLevel, eqOpts);
  if (fighter.personality === "magus") equipment.weapon = deriveMagicWeapon(eqOpts && eqOpts.spell);
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
  deriveMagicWeapon,
  initialBattery,
  applyEquipmentBuffs,
  randomRace,
  randomPersonality,
};
