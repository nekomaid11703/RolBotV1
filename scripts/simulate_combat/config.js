// @ts-nocheck
"use strict";

// ── Personalidades: especialización tipo jugador humano ─────────────────────
// Un jugador prioriza los puntos a favor de su estilo de pelea: 60-80% del
// presupuesto se concentra en 2-3 stats clave; el resto es mínimo (>0).
const PERSONALITIES = {
  tanque: {
    label: "Tanque",
    description: "DEF + HP — aguanta el daño y bloquea",
    weights: { atk: 2, def: 30, aspd: 7, ref: 3, mspd: 3, hp: 15 },
  },
  asesino: {
    label: "Asesino",
    description: "ATK + ASPD — golpes rápidos y fuertes",
    weights: { atk: 24, def: 2, aspd: 20, ref: 4, mspd: 6, hp: 4 },
  },
  esquivo: {
    label: "Esquivo",
    description: "REF + MSPD — esquiva y contraataca",
    weights: { atk: 3, def: 10, aspd: 6, ref: 26, mspd: 10, hp: 5 },
  },
  equilibrado: {
    label: "Equilibrado",
    description: "Distribucion pareja en stats fisicas",
    weights: { atk: 10, def: 10, aspd: 10, ref: 10, mspd: 10, hp: 10 },
  },
  extremista_ataque: {
    label: "Extremista ATK",
    description: "Maximo ATK — golpes devastadores",
    weights: { atk: 42, def: 1, aspd: 10, ref: 2, mspd: 1, hp: 4 },
  },
  extremista_defensa: {
    label: "Extremista DEF",
    description: "Maxima DEF + HP — pared imparable",
    weights: { atk: 1, def: 42, aspd: 1, ref: 3, mspd: 1, hp: 12 },
  },
  extremista_velocidad: {
    label: "Extremista ASPD",
    description: "Maxima ASPD + ATK — mil golpes",
    weights: { atk: 10, def: 1, aspd: 42, ref: 2, mspd: 1, hp: 4 },
  },
  extremista_reflejos: {
    label: "Extremista REF",
    description: "Maximos REF + ASPD — esquiva perfecta",
    weights: { atk: 2, def: 1, aspd: 10, ref: 42, mspd: 1, hp: 4 },
  },
  velocista: {
    label: "Velocista",
    description: "Maxima MSPD + ASPD — huidor garantizado",
    weights: { atk: 2, def: 2, aspd: 15, ref: 6, mspd: 30, hp: 5 },
  },
  berserker: {
    label: "Berserker",
    description: "ATK maximo, DEF minimo — glass cannon",
    weights: { atk: 40, def: 1, aspd: 12, ref: 2, mspd: 1, hp: 4 },
  },
  guardian: {
    label: "Guardian",
    description: "DEF + HP + MSPD — tanque lento e indestructible",
    weights: { atk: 2, def: 26, aspd: 4, ref: 4, mspd: 6, hp: 18 },
  },
  estratega: {
    label: "Estratega",
    description: "REF + ASPD — contraataques frecuentes",
    weights: { atk: 6, def: 5, aspd: 14, ref: 24, hp: 8, mspd: 3 },
  },
  gladiador: {
    label: "Gladiador",
    description: "ATK + ASPD + REF — ofensivo pero reactivo",
    weights: { atk: 22, def: 4, aspd: 16, ref: 10, hp: 6, mspd: 2 },
  },
  magus: {
    label: "Magus",
    description: "ASPD + ATK — hibrido fisico-magico rapido",
    weights: { atk: 14, def: 4, aspd: 24, ref: 8, hp: 6, mspd: 4 },
  },
};

// Jitter de especialización (±15%) para que no sean clones exactos.
const WEIGHT_JITTER = 0.15;

// Soft cap de asignación de puntos: a partir de esta stat, el peso marginal
// de esa stat decae linealmente hasta 0 en el clamp (jugador que diversifica
// al acercarse al cap → evita la saturación que aplana los datos).
const STAT_SOFT_CAP = 75;

const DEFAULT_NUM_SIMS = 500;
const MAX_ROUNDS = 50;
const LEVEL_MIN = 100;
const LEVEL_MAX = 500;
const LEVEL_DIFF_MAX_PCT = 0.5;
const STAT_CLAMP = { min: 1, max: 100 };
const HP_STAT_MULTIPLIER = 5;
const PHYSICAL_STATS = ["atk", "def", "aspd", "ref", "mspd"];
const MAGIC_STATS = ["fulgor", "d_fulgor", "r_fulgor"];
const GENERATED_STATS = [...PHYSICAL_STATS, "hp"];
const FATIGUE_SNAPSHOT_TURNS = [1, 5, 10, 15, 20, 25, 30, 40, 50];

// ── Variación de stats mágicas (reasignación de presupuesto: nivel total constante) ──
const MAGIC_ALLOC_CHANCE = 0.3;
const MAGIC_SHARE_MIN = 0.05;
const MAGIC_SHARE_MAX = 0.3;

// ── IA: descanso ──
const REST_FATIGUE_RATIO = 0.5;
const REST_LOW_HP_RATIO = 0.3;
const REST_LOW_FATIGUE_RATIO = 0.3;

// ── IA: ítems de curación ──
const ITEM_STOCK_MIN = 1;
const ITEM_STOCK_MAX = 5;
const ITEM_USE_HP_RATIO = 0.5;
const ITEM_USE_MAX_FATIGUE_RATIO = 0.6;
const ITEM_USE_FATIGUE_COST = 1;
const ITEM_POOL = [
  { name: "venda", heal: 30, minLevel: 0 },
  { name: "pocion", heal: 80, minLevel: 150 },
  { name: "tonico", heal: 150, minLevel: 300 },
];

// ── Posicionamiento ──
const INITIAL_DISTANCE = 25;
const MAX_DISTANCE = 100;
const RETREAT_HP_RATIO = 0.25;
const RETREAT_MAX_DISTANCE = 12;
const RETREAT_MAX_FATIGUE_RATIO = 0.4;

// ── Catálogo base: Familia del Hierro (material: hierro, setId: set_hierro) ──
// Las stats finales se DERIVAN con las fórmulas reales del motor
// (itemStatService: base × tier × material), nunca con números planos.
const IRON_FAMILY = {
  material: "hierro",
  setId: "set_hierro",
  weaponPool: [
    { id: "espada_de_hierro", name: "Espada de Hierro", damageNature: "cortante", nominalDamage: 20, hands: 1, weaponRange: 1 },
    { id: "estoque_de_hierro", name: "Estoque de Hierro", damageNature: "perforante", nominalDamage: 14, hands: 1, weaponRange: 1 },
    { id: "maza_de_hierro", name: "Maza de Hierro", damageNature: "contundente", nominalDamage: 22, hands: 1, weaponRange: 1 },
  ],
  armorSlotBase: {
    cabeza: "Casco de Hierro",
    pecho: "Pechera de Hierro",
    pantalones: "Grebas de Hierro",
    botas: "Botas de Hierro",
  },
  coverageSuffix: { ligera: "Ligero", media: "", alta: "Alto", total: "Total" },
  shield: { id: "escudo_de_hierro", name: "Escudo de Hierro", slot: "mano_izq", coverage: "alta" },
  amulet: { id: "amuleto_de_hierro", name: "Amuleto de Hierro", slot: "artefacto_1", buff: { atk: 5 } },
};

// Slots corporales y grados de cobertura (spec §4).
const ARMOR_SLOTS = ["cabeza", "pecho", "pantalones", "botas"];
const COVERAGES = ["ligera", "media", "alta", "total"];

// Tier de calidad asignado al equipo por bracket de nivel (probabilístico).
const TIER_BRACKETS = [
  { minLevel: 100, maxLevel: 199, tier: "E" },
  { minLevel: 200, maxLevel: 299, tier: "C" },
  { minLevel: 300, maxLevel: 399, tier: "B" },
  { minLevel: 400, maxLevel: 500, tier: "A" },
];
// 60% tier del bracket, 30% uno inferior, 10% dos inferiores.
const TIER_DOWN_CHANCES = [0.6, 0.3, 0.1];

// Probabilidades de equipamiento por generación.
const NO_WEAPON_CHANCE = 0.1;
const NO_PIECE_CHANCE = 0.1; // por slot corporal
const SHIELD_CHANCE = 0.6; // escudo en mano_izq (arma de 1 mano)
const AMULET_CHANCE = 0.4; // amuleto en artefacto_1

// Bono de set: ≥3 piezas del mismo setId activan el bono (código: SET_BONUS_THRESHOLD = 3).
const SET_BONUS_THRESHOLD = 3;
const SET_BONUS = { def: 10 };

// ── Subconjunto "nivel y equipo similares" ──
const MATCHED_LEVEL_DIFF_PCT = 0.1;

// ── Umbral de stats mágicas "altas" para medir su contribución ──
const MAGIC_HIGH_THRESHOLD = 12;

// ── Targets de balance ──
const BALANCE_TARGETS = {
  avgTurnsMatched: { target: 7, tolerance: 0.5, label: "Turnos promedio (nivel/equipo similares)" },
  firstAttackerWinrate: { target: 0.05, tolerance: 0.01, label: "Ventaja del primer atacante (sobre 50%)" },
  metaWinrate: { target: 0.55, tolerance: 0.01, label: "Winrate de la build meta (max por personalidad)" },
};

/**
 *
 * @param argv
 */
function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { numSims: DEFAULT_NUM_SIMS, verbose: false, help: false };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-n":
      case "--num-sims":
        opts.numSims = parseInt(args[++i], 10);
        if (isNaN(opts.numSims) || opts.numSims < 1) {
          console.error("Error: --num-sims must be a positive integer");
          process.exit(1);
        }
        break;
      case "-v":
      case "--verbose":
        opts.verbose = true;
        break;
      case "-h":
      case "--help":
        opts.help = true;
        break;
      default:
        console.error(`Unknown option: ${args[i]}`);
        process.exit(1);
    }
  }
  return opts;
}

/**
 *
 */
function printUsage() {
  console.log(`
USAGE
  node scripts/simulate_combat.js [OPTIONS]

OPTIONS
  -n, --num-sims <N>   Number of simulations (default: 500)
  -v, --verbose         Print progress to stdout
  -h, --help            Show this help message

OUTPUT
  scripts/simulation_output/raw_data.json    Raw data + aggregated report
  scripts/simulation_output/report.md        Human-readable markdown report
`);
}

const SIM_CONFIG = {
  DEFAULT_NUM_SIMS,
  MAX_ROUNDS,
  LEVEL_MIN,
  LEVEL_MAX,
  LEVEL_DIFF_MAX_PCT,
  STAT_CLAMP,
  HP_STAT_MULTIPLIER,
  FATIGUE_SNAPSHOT_TURNS,
  MAGIC_ALLOC_CHANCE,
  MAGIC_SHARE_MIN,
  MAGIC_SHARE_MAX,
  REST_FATIGUE_RATIO,
  REST_LOW_HP_RATIO,
  REST_LOW_FATIGUE_RATIO,
  ITEM_STOCK_MIN,
  ITEM_STOCK_MAX,
  ITEM_USE_HP_RATIO,
  ITEM_USE_MAX_FATIGUE_RATIO,
  ITEM_USE_FATIGUE_COST,
  INITIAL_DISTANCE,
  MAX_DISTANCE,
  RETREAT_HP_RATIO,
  RETREAT_MAX_DISTANCE,
  RETREAT_MAX_FATIGUE_RATIO,
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
  MATCHED_LEVEL_DIFF_PCT,
  MAGIC_HIGH_THRESHOLD,
  BALANCE_TARGETS,
};

module.exports = {
  PERSONALITIES,
  WEIGHT_JITTER,
  STAT_SOFT_CAP,
  DEFAULT_NUM_SIMS,
  MAX_ROUNDS,
  LEVEL_MIN,
  LEVEL_MAX,
  LEVEL_DIFF_MAX_PCT,
  STAT_CLAMP,
  HP_STAT_MULTIPLIER,
  PHYSICAL_STATS,
  MAGIC_STATS,
  GENERATED_STATS,
  FATIGUE_SNAPSHOT_TURNS,
  MAGIC_ALLOC_CHANCE,
  MAGIC_SHARE_MIN,
  MAGIC_SHARE_MAX,
  REST_FATIGUE_RATIO,
  REST_LOW_HP_RATIO,
  REST_LOW_FATIGUE_RATIO,
  ITEM_STOCK_MIN,
  ITEM_STOCK_MAX,
  ITEM_USE_HP_RATIO,
  ITEM_USE_MAX_FATIGUE_RATIO,
  ITEM_USE_FATIGUE_COST,
  ITEM_POOL,
  INITIAL_DISTANCE,
  MAX_DISTANCE,
  RETREAT_HP_RATIO,
  RETREAT_MAX_DISTANCE,
  RETREAT_MAX_FATIGUE_RATIO,
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
  MATCHED_LEVEL_DIFF_PCT,
  MAGIC_HIGH_THRESHOLD,
  BALANCE_TARGETS,
  SIM_CONFIG,
  parseArgs,
  printUsage,
};
