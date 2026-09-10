// @ts-nocheck
/**
 * Combat Balance Configuration
 * Central service for ALL tunable combat magic numbers.
 * Modify constants here to adjust combat balance.
 * The simulation (scripts/simulate_battles.js) imports from here.
 * The engine (combatEngine.js, fatigueEngine.js) currently imports from combatConfig.js;
 * migrate individual values here as needed.
 */

// ══════════════════════════════════════════
// DAMAGE FORMULA
// ══════════════════════════════════════════

/** Damage formula: atk * DAMAGE_DEFENSE_SCALE / (DAMAGE_DEFENSE_SCALE + def) */
const DAMAGE_DEFENSE_SCALE = 100;

// ══════════════════════════════════════════
// MAGIC CHANNEL (stats vivas: fulgor / d_fulgor / r_fulgor)
// ══════════════════════════════════════════

/**
 * Naturaleza "mágico": solo término de stats (la habilidad NO tiene obsolescencia, §11.5.2).
 * bodyDamage = FULGOR_ATK_SCALE × fulgor × 100/(100 + r_fulgor)   [espejo de cortante]
 */
const FULGOR_ATK_SCALE = 0.8;

/** Espejo de DAMAGE_DEFENSE_SCALE sobre r_fulgor del defensor */
const MAGIC_DEFENSE_SCALE = 100;

/** Referencia de dominio puro: reduce coste de lanzamiento, nunca suma daño directo (§11.2) */
const DOMINIO_REF = 100;

// ══════════════════════════════════════════
// STATUS EFFECT — QUEMADURA (Fase 3, primero en implementarse)
// ══════════════════════════════════════════

/** Daño base por turno de quemadura, antes de magnitude/dominio/mitigación */
const QUEMADURA_DOT_BASE = 2;

/** Turnos base del estado de quemadura cuando el efecto no define duración */
const QUEMADURA_DURACION_BASE = 2;

/** Turnos extra por cada DOMINIO_REF completo del lanzador (d_fulgor/100 → +N turnos) */
const QUEMADURA_DURACION_ESCALA = 2;

/** Duración predeterminada de los estados que no la declaran en la receta */
const STATUS_DURATION_BASE = 2;
/** DOT físico base de veneno, antes de la magnitud del efecto */
const VENENO_DOT_BASE = 2;
/** DOT mágico base de decadencia, antes de magnitud y mitigación */
const DECADENCIA_DOT_BASE = 1;
/** Multiplicador de daño mientras el portador está maldito */
const MALDICION_DAMAGE_MULTIPLIER = 0.75;
/** DEF reducida por cada acumulación de rompe_armaduras */
const ROMPE_ARMADURAS_DEF_REDUCTION = 5;
/** Daño instantáneo base de choque_termico */
const CHOQUE_TERMICO_DAMAGE_BASE = 4;

/** Coste de lanzamiento nominal de un hechizo (batería gasta esta cantidad por aire) */
const FULGOR_COST_BASE = 10;

/** Piso de eficiencia del lanzamiento diluido (fulgor_actual/coste clamp ≥ este) */
const FULGOR_DILUTED_MIN = 0.1;

/**
 * Techo de DEF efectiva en la mitigación (0 = sin techo, comportamiento actual).
 * >0 aplaña la curva: apilar DEF por encima del cap deja de reducir daño.
 * Hook de balance tuneable vía run_experiments.js.
 */
const DEF_MITIGATION_CAP = 0;

/** Minimum damage floor */
const DAMAGE_MIN = 1;

/** Block damage reduction (0.25 = 25%) */
const BLOCK_REDUCTION = 0.25;

// ══════════════════════════════════════════
// DISTANCE MECHANIC
// ══════════════════════════════════════════

/** Maximum possible combat distance (meters) */
const MAX_DISTANCE = 500;

/** Starting distance when combat begins (meters) */
const INITIAL_DISTANCE = 5;

/** Base attack reach without MSPD contribution (meters) */
const BASE_ATTACK_RANGE = 1;

/** MSPD → movement meters per turn: floor(mspd * MSPD_TO_METERS) */
const MSPD_TO_METERS = 0.5;

/** ASPD penalty per 5m block: penalty = -floor(distance / 5) * ASPD_PENALTY_PER_5M */
const ASPD_PENALTY_PER_5M = 1;

/** Divisor for distance grouping in ASPD penalty: floor(distance / ASPD_PENALTY_DISTANCE_BLOCK) */
const ASPD_PENALTY_DISTANCE_BLOCK = 5;

/** Perforante melee: multiplicador de ATK para el daño base (0.6 × atk) */
const PIERCE_ATK_SCALE = 0.6;

/** Perforante melee: peso del daño base del arma en el cuerpo (1.0 = completo, escala con tier) */
const PIERCE_WEAPON_SCALE = 1.0;

/** Contundente: peso del daño base del arma en el cuerpo (0.5 = mitad) */
const CONTUNDENTE_BODY_SCALE = 0.5;

/** Contundente: multiplicador del daño material (fijo 1.5x del cuerpo; rompe armadura sin destruir en 1 golpe) */
const CONTUNDENTE_MATERIAL_MULT = 1.5;

/**
 * Peso de la dependencia del ATK del portador sobre el daño base del arma.
 * 0 = comportamiento actual (el arma aporta baseDamage plano, no depende del ATK).
 * 1 = el arma aporta el 100% solo si atk >= WEAPON_ATK_REF (lineal desde 0).
 * Hook de balance tuneable vía run_experiments.js.
 */
const WEAPON_BASE_ATK_WEIGHT = 0;

/** ATK de referencia para normalizar la dependencia del arma: f(atk) = min(1, atk / REF) */
const WEAPON_ATK_REF = 80;

/** Ventaja de reflejos al defensor por bloque de distancia (ataque a distancia / sprint) */
const DISTANCE_REF_BLOCK = 10;
const DISTANCE_REF_BONUS = 1;

/** Decaimiento de daño del proyectil conforme se acerca al borde de su alcance */
const PROJECTILE_FALL_OFF_RATE = 0.5;
const PROJECTILE_MIN_SCALE = 0.5;

// ══════════════════════════════════════════
// ARCHER BALANCE (arco + flechas)
// ══════════════════════════════════════════

/**
 * Multiplicador de daño del arco por tier (único multiplicador del arco).
 * El daño final = nominalDamage(flecha) × BOW_DAMAGE_MULT × falloff.
 * Reemplaza el doble escalado (flecha × tier + arco × CONTUNDENTE_PERFORANTE_MULT).
 */
const BOW_DAMAGE_MULT = {
  E: 1.2,
  D: 1.8,
  C: 2.6,
  B: 3.5,
  A: 4.8,
  S: 6.2,
  N: 7.6,
};

/**
 * Velocidad base del proyectil por tier del arco (metros/turno de base).
 * Velocidad efectiva = atk × ATK_RANGE_SCALE + BOW_SPEED_BASE.
 */
const BOW_SPEED_BASE = {
  E: 6,
  D: 10,
  C: 14,
  B: 19,
  A: 24,
  S: 30,
  N: 36,
};

/**
 * Velocidad de ataque base del arco por tier (usado por resolveAttackerSpeed).
 * El arco NO usa ASPD del usuario: usa ATK + este base.
 */
const BOW_ASPD_BASE = {
  E: 5,
  D: 7,
  C: 9,
  B: 12,
  A: 15,
  S: 18,
  N: 22,
};

/**
 * Aerodinámica por tier de la FLECHA. Multiplica la velocidad → alcance, y
 * agrava la pérdida de daño con la distancia.
 */
const AERO = {
  E: 0.85,
  D: 1.0,
  C: 1.2,
  B: 1.45,
  A: 1.75,
  S: 2.1,
  N: 2.5,
};

/** Contribución de ATK del usuario a la velocidad del proyectil (por punto) */
const ATK_RANGE_SCALE = 0.25;

/**
 * Exponente del falloff: scale = 1 - (distancia/alcance)^FALLOFF_K.
 * K=1 → lineal; K>1 → el daño se mantiene más tiempo y colapsa al borde.
 */
const FALLOFF_K = 2;

/** Piso mínimo del alcance efectivo del arco (metros) */
const BOW_RANGE_MIN = 8;

/**
 * Escala de ATK sobre el daño del proyectil: suma `atk × PROJECTILE_ATK_SCALE`
 * al daño base de la flecha (antes del falloff). Valor 0 = comportamiento
 * original (daño solo por flecha × tier). Sirve para que el arco no se quede
 * atrás del melee a niveles altos (el melee escala ~0.8×ATK, la flecha solo
 * por tier).
 */
const PROJECTILE_ATK_SCALE = 0.5;

// ══════════════════════════════════════════
// MOVEMENT FATIGUE
// ══════════════════════════════════════════

/** Base fatigue cost per meter moved */
const FATIGUE_BASE_PER_METER = 1;

/** Additional fatigue per full 5m block moved */
const FATIGUE_SCALE_PER_5M = 1;

/** Divisor for distance grouping in movement fatigue: floor(meters / FATIGUE_DISTANCE_BLOCK) */
const FATIGUE_DISTANCE_BLOCK = 5;

/** Minimum movement fatigue cost (floor) */
const MOVEMENT_FATIGUE_MIN = 1;

/**
 * Resistencia (DEF) de referencia para escalar la fatiga de movimiento por
 * condición física. El coste de movimiento se multiplica por def/DEF_REF de
 * modo que el ratio fatiga/resistencia tras un desplazamiento sea constante en
 * TODOS los niveles (el movimiento no es proporcionalmente más caro a nivel
 * bajo, que colapsaba el ASPD del melee y volvía inútil el avance-y-ataque).
 * DEF_REF=50 corresponde al DEF del lab a nivel 300 (punto de equilibrio).
 */
const MOVEMENT_FATIGUE_DEF_REF = 50;

/** Kite movement fatigue multiplier (defined but currently unused in engine) */
const KITE_FATIGUE_MULTIPLIER = 1.5;

// ══════════════════════════════════════════
// FATIGUE COSTS (base values before stat scaling)
// ══════════════════════════════════════════

/** Base fatigue cost per action type */
const FATIGUE_COST_ATTACK = 1;
/**
 * @constant FATIGUE_COST_DODGE
 * @type {number}
 */
const FATIGUE_COST_DODGE = 4;
/**
 * @constant FATIGUE_COST_BLOCK
 * @type {number}
 */
const FATIGUE_COST_BLOCK = 0;
/**
 * @constant FATIGUE_COST_FLEE
 * @type {number}
 */
const FATIGUE_COST_FLEE = 3;
/**
 * @constant FATIGUE_COST_USE_ITEM
 * @type {number}
 */
const FATIGUE_COST_USE_ITEM = 1;
/**
 * @constant FATIGUE_COST_RECEIVE_HIT
 * @type {number}
 */
const FATIGUE_COST_RECEIVE_HIT = 1;

// ══════════════════════════════════════════
// FATIGUE STAT SCALING
// ══════════════════════════════════════════

/** ATK → fatigue cost multiplier per point of ATK */
const FATIGUE_ATK_COST_SCALE = 0.05;

/** DEF → fatigue cost reduction per point of DEF */
const FATIGUE_DEF_REDUCTION_SCALE = 0.01;

/** MSPD → dodge fatigue cost reduction per MSPD point */
const FATIGUE_DODGE_MSPD_REDUCTION = 0.03;

/** DEF → recovery bonus multiplier per DEF point */
const FATIGUE_REST_DEF_SCALE = 0.2;

/** Minimum possible fatigue cost */
const FATIGUE_COST_MIN = 1;

/** Maximum fatigue recovery per action */
const FATIGUE_RECOVERY_MAX = 15;

/** Fatigue cap */
const FATIGUE_MAX = 50;

/** Base fatigue recovery per reaction type */
const FATIGUE_RECOVERY_BLOCK = 1;
/**
 * @constant FATIGUE_RECOVERY_REST
 * @type {number}
 */
const FATIGUE_RECOVERY_REST = 5;

/** Stats affected by fatigue penalties */
const FATIGUE_SPEED_STATS = ["aspd", "mspd", "ref"];

// ══════════════════════════════════════════
// FATIGUE THRESHOLDS
// ══════════════════════════════════════════

/**
 * Fatigue state thresholds (ratio of FATIGUE_MAX).
 * Each state defines a stat penalty and recovery multiplier.
 */
const FATIGUE_THRESHOLDS = [
  { maxRatio: 0.33, state: "pleno", name: "Pleno", penalty: 0, recoveryMult: 1.0 },
  { maxRatio: 0.66, state: "agitado", name: "Agitado", penalty: 0.2, recoveryMult: 0.5 },
  { maxRatio: 0.9, state: "cansado", name: "Cansado", penalty: 0.4, recoveryMult: 0.25 },
  { maxRatio: Infinity, state: "fatigado", name: "Fatigado", penalty: 0.6, recoveryMult: 0.125 },
];

// ══════════════════════════════════════════
// FLEE MECHANIC
// ══════════════════════════════════════════

/** Flee success chances (currently hardcoded in combatEngine.js) */
const FLEE_CHANCE_HIGHER_MSPD = 1.0; // fleer MSPD > pursuer MSPD → guaranteed
/**
 * @constant FLEE_CHANCE_EQUAL_MSPD
 * @type {number}
 */
const FLEE_CHANCE_EQUAL_MSPD = 0.5; // fleer MSPD == pursuer MSPD → 50%
/**
 * @constant FLEE_CHANCE_LOWER_MSPD
 * @type {number}
 */
const FLEE_CHANCE_LOWER_MSPD = 0.25; // fleer MSPD < pursuer MSPD → 25%

// ══════════════════════════════════════════
// XP REWARDS
// ══════════════════════════════════════════

/** XP formula: baseXp = XP_BASE + enemyLevel * XP_PER_LEVEL */
const XP_BASE = 50;
/**
 * @constant XP_PER_LEVEL
 * @type {number}
 */
const XP_PER_LEVEL = 2;

/** XP multiplier when losing */
const XP_LOSER_MULTIPLIER = 0.3;

// ══════════════════════════════════════════
// SPELL FORGE (Fase B)
// ══════════════════════════════════════════

/** Máximo de hits (componentes) por hechizo forjado */
const MAX_HITS_PER_SPELL = 10;

/** Máximo de habilidades activas equipables en combate (§11.5.4) */
const MAX_ACTIVE_SKILLS = 4;

// ══════════════════════════════════════════
// SPELL FORGE TREE (árbol de forja — Fase D)
// El forjador elige EN ORDEN: naturaleza → rol → activación/momento → efectos
// → recursos. Cada selección desbloquea/bloquea las siguientes (progressive disclosure).
// La taxonomía permite representar CUALQUIER hechizo/habilidad, sin hardcodear ejemplos.
// ══════════════════════════════════════════

/**
 * Naturalezas raíz del árbol (§7 spec). Cada naturaleza define sus sub-tipos
 * (elementos/primordiales/materias/conceptos) y los roles que puede expresar.
 * La primigenia cubre todas las naturalezas (luz/oscuridad/caos son la raíz de toda
 * la magia), las derivadas acotan a qué roles pueden llegar.
 * @type {Record<string, { subtypes: string[], roles: string[] }>}
 */
const SPELL_NATURES = {
  primordial: {
    subtypes: ["luz", "oscuridad", "caos"],
    roles: ["ataque", "imbuicion", "defensa", "curacion", "utilidad", "movimiento"],
  },
  elemental: {
    subtypes: ["hydro", "pyro", "geo", "anemo", "electro", "cryo"],
    roles: ["ataque", "imbuicion", "control", "utilidad"],
  },
  material: {
    subtypes: ["forma", "filo", "peso"],
    roles: ["ataque", "defensa", "utilidad"],
  },
  conceptual: {
    subtypes: ["regeneracion", "deterioro", "modificacion", "potenciacion", "transmutacion"],
    roles: ["ataque", "defensa", "curacion", "utilidad", "control", "movimiento"],
  },
};

/**
 * Tipos de efecto genéricos (componentes finales del hechizo). Un hechizo puede
 * combinar varios; cada tipo declara los targets a los que puede apuntar.
 */
const EFFECT_TYPES = [
  "dano",
  "sanacion",
  "escudo",
  "aura",
  "movimiento",
  "control",
  "invocacion",
  "imbuicion",
  "regeneracion",
  "transmutacion",
];

/**
 * Destinos posibles de un efecto.
 */
const TARGETS = ["propio", "enemigo", "aliado", "area"];

/**
 * Targets permitidos por tipo de efecto (desbloqueo naturaleza→rol a nivel componente).
 */
const EFFECT_TARGETS = {
  dano: ["enemigo", "area"],
  sanacion: ["aliado", "propio", "area"],
  escudo: ["aliado", "propio"],
  aura: ["propio", "area"],
  movimiento: ["propio"],
  control: ["enemigo", "area"],
  invocacion: ["propio", "area", "enemigo"],
  imbuicion: ["aliado", "propio"],
  regeneracion: ["aliado", "propio", "area"],
  transmutacion: ["propio", "enemigo", "area"],
};

/**
 * Activaciones y momentos de uso (nivel rol del árbol).
 */
const ACTIVATIONS = ["activa", "pasiva"];
const MOMENTS = ["combate", "fuera_combate", "ambos"];

/**
 * Reglas por rol: qué efectos, activaciones y momentos desbloquea.
 * @type {Record<string, { effects: string[], activations: string[], moments: string[] }>}
 */
const SPELL_ROLES = {
  ataque: {
    effects: ["dano", "invocacion"],
    activations: ["activa"],
    moments: ["combate", "ambos"],
  },
  imbuicion: {
    effects: ["imbuicion"],
    activations: ["activa", "pasiva"],
    moments: ["combate", "ambos"],
  },
  defensa: {
    effects: ["escudo", "aura"],
    activations: ["activa", "pasiva"],
    moments: ["combate", "ambos"],
  },
  curacion: {
    effects: ["sanacion", "regeneracion"],
    activations: ["activa", "pasiva"],
    moments: ["combate", "fuera_combate", "ambos"],
  },
  utilidad: {
    effects: ["transmutacion", "control", "invocacion"],
    activations: ["activa", "pasiva"],
    moments: ["fuera_combate", "ambos"],
  },
  movimiento: {
    effects: ["movimiento"],
    activations: ["activa"],
    moments: ["combate", "ambos"],
  },
};

/**
 * Peso base de complejidad por tipo de efecto (eje potencia del costo fino).
 * Un efecto con más "información impresa" en el mundo cuesta más (£§ Fase D).
 */
const EFFECT_WEIGHTS = {
  dano: 1,
  sanacion: 1.2,
  escudo: 1.2,
  aura: 1.4,
  movimiento: 1.3,
  control: 1.4,
  invocacion: 1.6,
  imbuicion: 1.3,
  regeneracion: 1.5,
  transmutacion: 1.8,
};

/**
 * Peso de fineza por target (eje control fino del costo fino).
 * Apuntar a área u aliados exige más control que golpear al propio lanzador.
 */
const TARGET_WEIGHTS = {
  propio: 0,
  enemigo: 1,
  aliado: 2,
  area: 3,
};

/**
 * Canal de daño derivado de la naturaleza (regla de oro §5):
 *   material → físico (DEF)
 *   conceptual → mágico (r_fulgor)
 *   elemental → mágico (o físico si el componente es material)
 *   primordial → según manifestación (default mágico)
 * El motor usa este canal para resolver el daño (§5).
 */
const CHANNEL_BY_NATURE = {
  material: "fisico",
  conceptual: "magico",
  elemental: "magico",
  primordial: "magico",
};

// ══════════════════════════════════════════
// SPELL COST FINE (costo fino — Fase D)
// El poder de un hechizo se mide por complejidad, NO por daño ni naturaleza:
//   costoFino = potencia (poder bruto) + fineza (control fino)
// Derivados automáticos: fulgorCost, tier, dominioReq (el jugador NO los elige).
// ══════════════════════════════════════════

/** Peso inicial del eje "potencia" (poder bruto) en el costo fino — calibrar en el laboratorio */
const SPELL_POTENCIA_WEIGHT = 1.0;

/** Peso inicial del eje "fineza" (control fino) en el costo fino — calibrar en el laboratorio */
const SPELL_FINEZA_WEIGHT = 1.0;

/**
 * Peso por elemento extra sostenido en potencia: un hechizo que mantiene varios
 * elementos a la vez exige más poder bruto (potencia += (elementos únicos − 1) × este).
 */
const SPELL_ELEMENT_POWER_WEIGHT = 1.0;

/** Referencia de alcance para el eje fineza (fineza += range / RANGE_REF) */
const RANGE_REF = 5;

/** Referencia de tiempo de casteo para el descuento de fulgorCost (f_cast = CAST_REF / castTime) */
const CAST_REF = 1;

/** Referencia de cooldown para el descuento de fulgorCost (f_cd = CD_REF / (CD_REF + cooldown)) */
const CD_REF = 10;

/**
 * Peso de estructura del efecto en el eje fineza (complejidad de "información impresa"
 * en el mundo). Enum cerrado, independiente del elemento/naturaleza.
 * creación > ilusión > alteración > utilidad > destrucción (destrucción = 0).
 * @type {Record<string, number>}
 */
const RESULT_TYPE_WEIGHTS = {
  destruccion: 0,
  utilidad: 2,
  alteracion: 4,
  ilusion: 6,
  creacion: 8,
};

/**
 * Batería de fulgor MÁXIMA de un jugador de nivel máximo (fulgor pool).
 * Un hechizo con fulgorCost ≥ este tope existe canónicamente, pero NO puede
 * lanzarse de forma natural (la batería no lo cubre).
 */
const FULGOR_POOL_MAX = 100;

/**
 * Brackets de tier del hechizo derivados del costoFino CRUDO (antes de descuentos).
 * Escala recalibrada para reflejar la progresión básico→avanzado afín al sistema
 * de combate: cada tier abre ~25 puntos de costo fino y el techo natural es 100
 * (batería de jugador de nivel máximo). El tier E fija las reglas canónicas del
 * "golpe básico": un solo elemento, sin efectos, coste ≤ 10.
 * @type {{max: number, tier: string}[]}
 */
const SPELL_TIER_BRACKETS = [
  { max: 10, tier: "E" },
  { max: 25, tier: "D" },
  { max: 50, tier: "C" },
  { max: 75, tier: "B" },
  { max: 99, tier: "A" },
  { max: Infinity, tier: "S" },
];

/**
 * Reglas declarativas del tier (referencia de diseño, se exponen al lab).
 * @type {Record<string, { label: string, costoMax: number, unElemento: boolean, sinEfectos: boolean, desc: string }>}
 */
const SPELL_TIER_RULES = {
  E: {
    label: "Básico",
    costoMax: 10,
    unElemento: true,
    sinEfectos: true,
    desc: "Golpe básico: un solo elemento, sin efectos, coste ≤ 10 de fulgor.",
  },
  D: {
    label: "Intermedio",
    costoMax: 25,
    unElemento: true,
    sinEfectos: false,
    desc: "Admite efectos; aún un solo elemento.",
  },
  C: {
    label: "Avanzado",
    costoMax: 50,
    unElemento: false,
    sinEfectos: false,
    desc: "Admite multi-elemento y efectos duraderos.",
  },
  B: { label: "Experto", costoMax: 75, unElemento: false, sinEfectos: false, desc: "Carga de efectos y alcance." },
  A: {
    label: "Maestro",
    costoMax: 99,
    unElemento: false,
    sinEfectos: false,
    desc: "Techo natural: casi toda la batería de un nivel máximo.",
  },
  S: {
    label: "Mítico",
    costoMax: null,
    unElemento: false,
    sinEfectos: false,
    desc: "Canónico: supera la batería natural (100), no se lanza naturalmente.",
  },
};

/**
 * Dominio (d_fulgor) requerido para lanzar a plenitud un hechizo de ese tier.
 * Si el dominio no alcanza → lanzamiento degradado (min(1, d_fulgor/req)), nunca se prohíbe.
 * @type {Record<string, number>}
 */
const SPELL_DOMINIO_REQ = { E: 0, D: 10, C: 20, B: 40, A: 70, S: 100 };

// ══════════════════════════════════════════
// STAT NORMALIZATION DEFAULTS
// ══════════════════════════════════════════

/** Default stat value when a stat is missing (used in normalizeStats) */
const STAT_DEFAULT = 1;

/** Minimum floor for penalized stats after fatigue application */
const STAT_MIN_AFTER_PENALTY = 0;

// ══════════════════════════════════════════
// SIMULATION-ONLY PARAMETERS
// ══════════════════════════════════════════
// These only affect the simulation script, not the real game engine.

/** AI dodge probability when dodge is feasible */
const SIM_AI_DODGE_CHANCE = 0.3;

/** Simulation level range */
const SIM_MIN_LEVEL = 100;
/**
 * @constant SIM_MAX_LEVEL
 * @type {number}
 */
const SIM_MAX_LEVEL = 500;

/** Max level difference ratio for simulation pairing */
const SIM_MAX_LEVEL_DIFF = 0.1;

/** Simulation battle timeout in rounds */
const SIM_MAX_TURNS = 200;

/** Default number of simulation battles */
const SIM_DEFAULT_BATTLE_COUNT = 10000;

/** HP multiplier: hp_actual = hp_stat * HP_MULTIPLIER */
const SIM_HP_MULTIPLIER = 2;

/** Stat generation: initial base value per stat */
const SIM_STAT_BASE = 1;

// ══════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════

module.exports = {
  // Damage
  DAMAGE_DEFENSE_SCALE,
  DEF_MITIGATION_CAP,
  DAMAGE_MIN,
  BLOCK_REDUCTION,

  // Magic channel
  FULGOR_ATK_SCALE,
  MAGIC_DEFENSE_SCALE,
  DOMINIO_REF,
  FULGOR_COST_BASE,
  FULGOR_DILUTED_MIN,

  // Status effect — quemadura
  QUEMADURA_DOT_BASE,
  QUEMADURA_DURACION_BASE,
  QUEMADURA_DURACION_ESCALA,
  STATUS_DURATION_BASE,
  VENENO_DOT_BASE,
  DECADENCIA_DOT_BASE,
  MALDICION_DAMAGE_MULTIPLIER,
  ROMPE_ARMADURAS_DEF_REDUCTION,
  CHOQUE_TERMICO_DAMAGE_BASE,

  // Spell forge
  MAX_HITS_PER_SPELL,
  MAX_ACTIVE_SKILLS,

  // Spell forge tree (árbol de forja — Fase D)
  SPELL_NATURES,
  SPELL_ROLES,
  EFFECT_TYPES,
  EFFECT_TARGETS,
  ACTIVATIONS,
  MOMENTS,
  TARGETS,
  EFFECT_WEIGHTS,
  TARGET_WEIGHTS,
  CHANNEL_BY_NATURE,

  // Spell cost fine (costo fino — Fase D)
  SPELL_POTENCIA_WEIGHT,
  SPELL_FINEZA_WEIGHT,
  SPELL_ELEMENT_POWER_WEIGHT,
  RANGE_REF,
  CAST_REF,
  CD_REF,
  RESULT_TYPE_WEIGHTS,
  SPELL_TIER_BRACKETS,
  SPELL_TIER_RULES,
  SPELL_DOMINIO_REQ,
  FULGOR_POOL_MAX,

  // Distance
  MAX_DISTANCE,
  INITIAL_DISTANCE,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_PER_5M,
  ASPD_PENALTY_DISTANCE_BLOCK,

  // Perforante melee y distancia
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

  // Archer balance
  BOW_DAMAGE_MULT,
  BOW_SPEED_BASE,
  BOW_ASPD_BASE,
  AERO,
  ATK_RANGE_SCALE,
  FALLOFF_K,
  BOW_RANGE_MIN,
  PROJECTILE_ATK_SCALE,

  // Movement fatigue
  FATIGUE_BASE_PER_METER,
  FATIGUE_SCALE_PER_5M,
  FATIGUE_DISTANCE_BLOCK,
  MOVEMENT_FATIGUE_MIN,
  MOVEMENT_FATIGUE_DEF_REF,
  KITE_FATIGUE_MULTIPLIER,

  // Fatigue costs
  FATIGUE_COST_ATTACK,
  FATIGUE_COST_DODGE,
  FATIGUE_COST_BLOCK,
  FATIGUE_COST_FLEE,
  FATIGUE_COST_USE_ITEM,
  FATIGUE_COST_RECEIVE_HIT,

  // Fatigue scaling
  FATIGUE_ATK_COST_SCALE,
  FATIGUE_DEF_REDUCTION_SCALE,
  FATIGUE_DODGE_MSPD_REDUCTION,
  FATIGUE_REST_DEF_SCALE,
  FATIGUE_COST_MIN,
  FATIGUE_RECOVERY_MAX,
  FATIGUE_MAX,
  FATIGUE_RECOVERY_BLOCK,
  FATIGUE_RECOVERY_REST,
  FATIGUE_SPEED_STATS,
  FATIGUE_THRESHOLDS,

  // Flee
  FLEE_CHANCE_HIGHER_MSPD,
  FLEE_CHANCE_EQUAL_MSPD,
  FLEE_CHANCE_LOWER_MSPD,

  // XP
  XP_BASE,
  XP_PER_LEVEL,
  XP_LOSER_MULTIPLIER,

  // Stat defaults
  STAT_DEFAULT,
  STAT_MIN_AFTER_PENALTY,

  // Simulation
  SIM_AI_DODGE_CHANCE,
  SIM_MIN_LEVEL,
  SIM_MAX_LEVEL,
  SIM_MAX_LEVEL_DIFF,
  SIM_MAX_TURNS,
  SIM_DEFAULT_BATTLE_COUNT,
  SIM_HP_MULTIPLIER,
  SIM_STAT_BASE,
};
