// @ts-nocheck
"use strict";

/**
 * Generador de familias de ítems tester para el simulador.
 *
 * Construye el equipo de los maniquíes desde el MATERIAL: se sortea el material
 * (peso por rareza, desplazado por nivel), se deriva el ítem con las fórmulas
 * reales del motor (itemStatService: base × tier × material) y se le asigna un
 * tier aleatorio E–S según el nivel del maniquí y la rareza del material
 * (simula crafteo: material raro → ítem de tier alto).
 *
 * Los ítems son PREVIEW/TESTER: se generan en memoria, NUNCA se registran en el
 * catálogo real (`src/data/itemCatalog`). Las familias se pueden crear/borrar/
 * editar en caliente vía la API del registro o el CLI manage_families.js.
 */

const { MATERIALS } = require("../../src/data/materialData");
const { getWeaponStats, getProjectileStats, getArmorStats } = require("../../src/services/rpg/itemStatService");
const {
  BOW_DAMAGE_MULT,
  BOW_SPEED_BASE,
  BOW_ASPD_BASE,
  AERO,
} = require("../../src/config/combatBalance");
const path = require("path");
const fs = require("fs");
const {
  ARMOR_SLOTS,
  COVERAGES,
  NO_WEAPON_CHANCE,
  NO_PIECE_CHANCE,
  SHIELD_CHANCE,
  AMULET_CHANCE,
  SET_BONUS_THRESHOLD,
  LEVEL_MIN,
  LEVEL_MAX,
} = require("./config");
const {
  MATERIAL_RARITY_WEIGHTS,
  MATERIAL_RARITY_ORDER,
  MATERIAL_LEVEL_SCALE,
  TIER_CAPS,
  TIER_ORDER,
  AMMO_STOCK_MIN,
  AMMO_STOCK_MAX,
  FAMILIES,
} = require("./families.config");

// Rango mínimo de tier por rareza (el material marca el piso y el techo del
// crafteo: un material mítico parte en S, un común nunca sale de E–C).
const RARITY_MIN_TIER = {
  comun: "E",
  poco_comun: "D",
  raro: "C",
  epico: "B",
  legendario: "A",
  mitico: "S",
};

const TIER_INDEX = TIER_ORDER.reduce((acc, tier, i) => {
  acc[tier] = i;
  return acc;
}, {});

// ── Registro de familias (en memoria, no catálogo real) ─────────────────────

// Las mutaciones del registro (create/edit/remove) se persisten en un archivo
// de estado para que el CLI (manage_families.js) sea útil entre ejecuciones.
// Los ítems SEGUEN siendo preview/tester: nunca se registran en el catálogo real.
const STATE_FILE = path.join(__dirname, "families.state.json");

const registry = new Map();

/**
 * Deep-equality ligera para detectar familias modificadas por el CLI.
 * @param {object} a
 * @param {object} b
 * @returns {boolean}
 */
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      if (state && typeof state === "object" && Array.isArray(state.families)) {
        for (const family of state.families) {
          try {
            registry.set(family.id, validateFamily(family));
          } catch {
            // Ignorar familias corruptas del estado persistido
          }
        }
      }
    }
  } catch {
    // Estado corrupto → se parte de las familias por defecto
  }
}

function saveState() {
  try {
    // Solo se persisten las familias creadas o modificadas por el CLI; las
    // familias por defecto intactas se siguen leyendo de families.config.js
    // (editar el config sigue funcionando mientras no se sobrescriba la familia).
    const modified = Array.from(registry.values()).filter((family) => {
      const base = FAMILIES[family.id];
      if (!base) return true; // familia creada por el CLI
      return !deepEqual(family, base);
    });
    fs.writeFileSync(STATE_FILE, JSON.stringify({ families: modified }, null, 2));
  } catch {
    // No bloquear la simulación si no se puede persistir
  }
}

// Base: familias por defecto (families.config.js). Overrides: estado del CLI.
for (const [id, cfg] of Object.entries(FAMILIES)) {
  registry.set(id, validateFamily(cfg));
}
loadState();

/**
 * Valida y normaliza una definición de familia.
 * @param {object} cfg
 * @returns {object} Familia normalizada
 */
function validateFamily(cfg) {
  if (!cfg || typeof cfg !== "object") throw new Error("Familia inválida: se espera un objeto");
  if (!cfg.id || typeof cfg.id !== "string") throw new Error("Familia inválida: falta id");
  if (!Array.isArray(cfg.materials) || cfg.materials.length === 0) {
    throw new Error(`Familia "${cfg.id}": falta lista de materiales`);
  }
  if (!Array.isArray(cfg.weaponPool) || cfg.weaponPool.length === 0) {
    throw new Error(`Familia "${cfg.id}": falta weaponPool`);
  }
  const valid = cfg.materials.filter((m) => MATERIALS[m]);
  if (valid.length === 0) {
    throw new Error(`Familia "${cfg.id}": ningún material del catálogo (${cfg.materials.join(", ")})`);
  }
  return { ...cfg, materials: valid };
}

/**
 * Registra una familia nueva (índice del registro).
 * @param {object} cfg - { id, name, materials, weaponPool, armorSlotBase, ... }
 * @returns {object} Familia registrada
 */
function createFamily(cfg) {
  const family = validateFamily(cfg);
  if (registry.has(family.id)) {
    throw new Error(`La familia "${family.id}" ya existe (usa editFamily para modificarla)`);
  }
  registry.set(family.id, family);
  saveState();
  return family;
}

/**
 * Elimina una familia del registro.
 * @param {string} id
 * @returns {boolean} true si se eliminó
 */
function removeFamily(id) {
  if (id === "hierro") throw new Error("La familia base 'hierro' no se puede borrar");
  const removed = registry.delete(id);
  if (removed) saveState();
  return removed;
}

/**
 * Edita las características de una familia registrada (merge superficial).
 * @param {string} id
 * @param {object} changes - Campos a modificar (p. ej. { material: "titanio", weaponPool: [...] })
 * @returns {object} Familia actualizada
 */
function editFamily(id, changes) {
  if (!registry.has(id)) throw new Error(`La familia "${id}" no existe`);
  const updated = validateFamily({ ...registry.get(id), ...changes, id });
  registry.set(id, updated);
  saveState();
  return updated;
}

/**
 * Lista los ids de familias registradas.
 * @returns {string[]}
 */
function listFamilies() {
  return Array.from(registry.keys());
}

/**
 * Obtiene una familia por id (default: "hierro").
 * @param {string} [id]
 * @returns {object|null}
 */
function getFamily(id) {
  return registry.get(id) || null;
}

// ── Sorteo de material y tier ───────────────────────────────────────────────

/**
 * Sortea un material de la familia con peso por rareza. El nivel desplaza el
 * peso hacia rarezas mayores (el jugador accede a mejores materiales al subir).
 * @param {number} level
 * @param {object} family
 * @returns {string} Id de material
 */
function rollMaterial(level, family) {
  const eligible = family.materials.filter((m) => MATERIALS[m]);
  if (eligible.length === 0) return "hierro";
  const levelFactor = Math.max(0, Math.min(1, (level - LEVEL_MIN) / Math.max(1, LEVEL_MAX - LEVEL_MIN)));
  const weights = eligible.map((m) => {
    const rarity = MATERIALS[m].rarity;
    const base = MATERIAL_RARITY_WEIGHTS[rarity] || 1;
    const rarityIndex = MATERIAL_RARITY_ORDER.indexOf(rarity);
    return base * (1 + levelFactor * MATERIAL_LEVEL_SCALE * Math.max(0, rarityIndex - 1));
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < eligible.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return eligible[i];
  }
  return eligible[eligible.length - 1];
}

/**
 * Sortea un tier E–S para el ítem según el nivel del maniquí y la rareza del
 * material (piso/techo por rareza + bracket de nivel con varianza).
 * @param {number} level
 * @param {string} materialRarity
 * @returns {string} Tier (E, D, C, B, A, S)
 */
function rollTier(level, materialRarity) {
  const maxTier = TIER_CAPS[materialRarity] || "B";
  const minTier = RARITY_MIN_TIER[materialRarity] || "E";
  const maxIdx = TIER_INDEX[maxTier];
  const minIdx = TIER_INDEX[minTier];

  const bracket = [
    { minLevel: LEVEL_MIN, maxLevel: 199, idx: TIER_INDEX.E },
    { minLevel: 200, maxLevel: 299, idx: TIER_INDEX.C },
    { minLevel: 300, maxLevel: 399, idx: TIER_INDEX.B },
    { minLevel: 400, maxLevel: LEVEL_MAX, idx: TIER_INDEX.A },
  ];
  const base = bracket.find((b) => level >= b.minLevel && level <= b.maxLevel) || bracket[bracket.length - 1];

  let idx = base.idx;
  const roll = Math.random();
  if (roll >= 0.6) idx = Math.max(TIER_INDEX.E, base.idx - 1);
  if (roll >= 0.9) idx = Math.max(TIER_INDEX.E, base.idx - 2);

  idx = Math.max(minIdx, Math.min(maxIdx, idx));
  return TIER_ORDER[idx];
}

/**
 * Nombre legible de un material.
 * @param {string} materialId
 * @returns {string}
 */
function materialName(materialId) {
  return MATERIALS[materialId]?.name || materialId;
}

// ── Builders de ítems (stats reales del motor) ──────────────────────────────

/**
 * Construye un arma de la familia con material y tier dados. Si el arma es
 * ranged (arco), la flecha es un ítem separado con material/tier propios y
 * aporta el daño base (el arco solo multiplica por tier).
 * @param {object} family
 * @param {object} poolEntry - Entrada del weaponPool
 * @param {string} material
 * @param {string} tier
 * @param {number} level
 * @returns {object} Arma con stats derivadas
 */
function buildWeapon(family, poolEntry, material, tier, level) {
  const def = {
    tier,
    material,
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
    const arrowMaterial = family.ammo && family.materials.includes(family.ammo.material)
      ? family.ammo.material
      : material;
    const arrowTier = rollTier(level, MATERIALS[arrowMaterial]?.rarity || "comun");
    // Flecha: daño base fijo por MATERIAL (afilabilidad), SIN escalado por tier
    // (el tier de la flecha solo aporta aerodinámica AERO al alcance/falloff).
    // Fórmula centralizada en itemStatService.getProjectileStats.
    const arrowStats = getProjectileStats({
      tier: arrowTier,
      material: arrowMaterial,
      modules: { weapon: { damageNature: "proyectil", baseDamage: family.ammo?.nominalDamage || 10, hands: 1, weaponRange: 0 } },
    });
    const arrowNominal = arrowStats.baseDamage;
    const name = `${poolEntry.name} de ${materialName(material)}`;
    return {
      ...poolEntry,
      ...stats,
      name,
      tier,
      material,
      baseDamage: arrowNominal,
      bowDamageMult: BOW_DAMAGE_MULT[tier] || 1.2,
      bowSpeedBase: BOW_SPEED_BASE[tier] || 6,
      bowAspdBase: BOW_ASPD_BASE[tier] || 5,
      ammoCount: AMMO_STOCK_MIN + Math.floor(Math.random() * (AMMO_STOCK_MAX - AMMO_STOCK_MIN + 1)),
      arrow: {
        id: family.ammo?.id || "flecha",
        name: `${family.ammo?.name || "Flecha"} de ${materialName(arrowMaterial)}`,
        tier: arrowTier,
        baseDamage: arrowNominal,
        material: arrowMaterial,
        aero: AERO[arrowTier] || 1,
      },
    };
  }

  return {
    ...poolEntry,
    ...stats,
    name: `${poolEntry.name} de ${materialName(material)}`,
    tier,
    material,
  };
}

/**
 * Construye una pieza de armadura con material y tier dados.
 * @param {object} family
 * @param {string} slot
 * @param {string} coverage
 * @param {string} material
 * @param {string} tier
 * @returns {object} Pieza con stats derivadas
 */
function buildArmorPiece(family, slot, coverage, material, tier) {
  const base = family.armorSlotBase[slot] || slot;
  const suffix = family.coverageSuffix?.[coverage] || "";
  const name = `${base}${suffix ? ` ${suffix}` : ""} de ${materialName(material)}`;
  const def = {
    tier,
    material,
    setId: family.setId || null,
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
 * Construye el escudo de la familia (pieza armor en mano_izq).
 * @param {object} family
 * @param {string} material
 * @param {string} tier
 * @returns {object} Pieza escudo
 */
function buildShield(family, material, tier) {
  const shield = family.shield || { slot: "mano_izq", coverage: "alta" };
  const name = `${shield.name || "Escudo"} de ${materialName(material)}`;
  const def = {
    tier,
    material,
    setId: family.setId || null,
    modules: { armor: { slot: shield.slot, coverage: shield.coverage } },
  };
  const stats = getArmorStats(def);
  return {
    id: `${shield.id || "escudo"}_${material}`,
    name,
    material,
    tier,
    ...stats,
    currentResist: stats.maxResist,
  };
}

/**
 * Construye el amuleto de la familia.
 * @param {object} family
 * @param {string} material
 * @param {string} tier
 * @returns {object} Amuleto
 */
function buildAmulet(family, material, tier) {
  const amulet = family.amulet || { slot: "artefacto_1", buff: {} };
  return {
    id: `${amulet.id || "amuleto"}_${material}`,
    name: `${amulet.name || "Amuleto"} de ${materialName(material)}`,
    material,
    tier,
    slot: amulet.slot,
    buff: amulet.buff || {},
  };
}

// ── Generación de equipo completo ───────────────────────────────────────────

/**
 * Genera el equipamiento completo de un maniquí con el generador de familias:
 *  - única arma aleatoria (del weaponPool de la familia)
 *  - munición fija de 20 flechas para el arco (consumible)
 *  - set de armadura aleatorio con cobertura por pieza aleatoria
 *  - amuleto y escudo aleatorios
 *  - material y tier por pieza (rareza mayor = menos frecuente; tier según
 *    nivel + rareza del material)
 *
 * `opts` permite forzar condiciones (presets de experimento):
 *   tier, weapon (id del pool), coverage (todas las piezas), shield, amulet,
 *   material, family.
 * @param {number} level
 * @param {object} [opts]
 * @returns {object} Equipamiento (misma forma que generateEquipment)
 */
function generateLoadout(level, opts = {}) {
  opts = opts || {};
  const family = getFamily(opts.family) || getFamily("hierro");

  const pool = family.weaponPool;
  const forcedWeapon = opts.weapon ? pool.find((w) => w.id === opts.weapon) : null;
  const hasWeapon = forcedWeapon ? true : Math.random() >= NO_WEAPON_CHANCE;
  const chosenWeapon = forcedWeapon || pool[Math.floor(Math.random() * pool.length)];

  let weapon = null;
  if (hasWeapon) {
    const mat = opts.material || rollMaterial(level, family);
    const tier = opts.tier || rollTier(level, MATERIALS[mat]?.rarity || "comun");
    weapon = buildWeapon(family, chosenWeapon, mat, tier, level);
  }

  const armorList = [];
  let forcedCount = null;
  if (opts.setPieces === "full") forcedCount = ARMOR_SLOTS.length;
  else if (opts.setPieces === "max2") forcedCount = 2;
  let added = 0;
  for (const slot of ARMOR_SLOTS) {
    const present = forcedCount != null ? added < forcedCount : Math.random() >= NO_PIECE_CHANCE;
    if (!present) continue;
    const mat = opts.material || rollMaterial(level, family);
    const tier = opts.tier || rollTier(level, MATERIALS[mat]?.rarity || "comun");
    const coverage = opts.coverage || COVERAGES[Math.floor(Math.random() * COVERAGES.length)];
    armorList.push(buildArmorPiece(family, slot, coverage, mat, tier));
    added++;
  }

  let shield = null;
  const wantShield = opts.shield != null ? opts.shield : Math.random() < SHIELD_CHANCE;
  if (wantShield) {
    const mat = opts.material || rollMaterial(level, family);
    const tier = opts.tier || rollTier(level, MATERIALS[mat]?.rarity || "comun");
    shield = buildShield(family, mat, tier);
    armorList.push(shield);
  }

  let amulet = null;
  const wantAmulet = opts.amulet != null ? opts.amulet : Math.random() < AMULET_CHANCE;
  if (wantAmulet) {
    const mat = opts.material || rollMaterial(level, family);
    const tier = opts.tier || rollTier(level, MATERIALS[mat]?.rarity || "comun");
    amulet = buildAmulet(family, mat, tier);
  }

  const setPieces = armorList.filter((p) => p.setId === family.setId).length;
  const setBonusActive = setPieces >= SET_BONUS_THRESHOLD;

  const armorBonusDef = armorList.reduce((acc, p) => acc + (p.bonusDef || 0), 0);
  const armorMaxResist = armorList.reduce((acc, p) => acc + (p.maxResist || 0), 0);

  return {
    tierKey: weapon?.tier || armorList[0]?.tier || "E",
    family: family.id,
    weapon,
    armorList,
    armor: armorList.length ? { bonusDef: armorBonusDef, maxResist: armorMaxResist, pieces: armorList.length } : null,
    shield,
    amulet,
    ammo: weapon?.arrow
      ? { id: weapon.arrow.id, name: weapon.arrow.name, count: weapon.ammoCount, baseDamage: weapon.arrow.baseDamage, tier: weapon.arrow.tier, material: weapon.arrow.material, aero: weapon.arrow.aero }
      : null,
    setPieces,
    setBonusActive,
  };
}

module.exports = {
  createFamily,
  removeFamily,
  editFamily,
  listFamilies,
  getFamily,
  rollMaterial,
  rollTier,
  buildWeapon,
  buildArmorPiece,
  buildShield,
  buildAmulet,
  generateLoadout,
  materialName,
};
