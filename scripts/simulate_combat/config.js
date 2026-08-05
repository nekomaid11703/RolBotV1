// @ts-nocheck
"use strict";

const PERSONALITIES = {
  tanque: {
    label: "Tanque",
    description: "Alta DEF + ASPD — tanquea hits, bloquea frecuentemente",
    weights: { atk: 8, def: 18, aspd: 12, ref: 5, mspd: 7, hp: 12 },
  },
  asesino: {
    label: "Asesino",
    description: "Alta ATK + ASPD — rapido y golpes fuertes",
    weights: { atk: 20, def: 3, aspd: 15, ref: 4, mspd: 8, hp: 5 },
  },
  esquivo: {
    label: "Esquivo",
    description: "Alta REF + DEF — esquiva y contraataca",
    weights: { atk: 8, def: 12, aspd: 8, ref: 14, mspd: 8, hp: 8 },
  },
  equilibrado: {
    label: "Equilibrado",
    description: "Distribucion pareja en stats fisicas",
    weights: { atk: 10, def: 10, aspd: 10, ref: 10, mspd: 10, hp: 10 },
  },
  extremista_ataque: {
    label: "Extremista ATK",
    description: "Maximo ATK + ASPD — golpes rapidos y devastadores",
    weights: { atk: 35, def: 3, aspd: 15, ref: 2, mspd: 5, hp: 4 },
  },
  extremista_defensa: {
    label: "Extremista DEF",
    description: "Maxima DEF + REF — pared que esquiva y contraataca",
    weights: { atk: 3, def: 35, aspd: 5, ref: 12, mspd: 5, hp: 14 },
  },
  extremista_velocidad: {
    label: "Extremista ASPD",
    description: "Maxima ASPD + ATK — mil golpes devastadores",
    weights: { atk: 15, def: 3, aspd: 35, ref: 5, mspd: 2, hp: 4 },
  },
  extremista_reflejos: {
    label: "Extremista REF",
    description: "Maximos REF + ASPD — esquiva perfecta y contraataque rapido",
    weights: { atk: 5, def: 3, aspd: 15, ref: 35, mspd: 2, hp: 5 },
  },
  velocista: {
    label: "Velocista",
    description: "Maxima MSPD + ASPD — huidor garantizado, esquiva por velocidad",
    weights: { atk: 8, def: 5, aspd: 12, ref: 5, mspd: 20, hp: 6 },
  },
  berserker: {
    label: "Berserker",
    description: "ATK maximo, DEF minimo — glass cannon, alto riesgo",
    weights: { atk: 30, def: 1, aspd: 12, ref: 3, mspd: 4, hp: 3 },
  },
  guardian: {
    label: "Guardian",
    description: "DEF + MSPD — tanque lento pero indestructible",
    weights: { atk: 5, def: 22, aspd: 8, ref: 5, mspd: 10, hp: 16 },
  },
  estratega: {
    label: "Estratega",
    description: "REF + ASPD moderado — contraataques frequentes",
    weights: { atk: 10, def: 8, aspd: 12, ref: 15, mspd: 5, hp: 7 },
  },
  gladiador: {
    label: "Gladiador",
    description: "ATK + ASPD + REF — ofensivo pero reactivo",
    weights: { atk: 15, def: 6, aspd: 14, ref: 10, mspd: 5, hp: 8 },
  },
  magus: {
    label: "Magus",
    description: "ASPD + fulgor — hibrido fisico-magico rapido",
    weights: { atk: 12, def: 5, aspd: 18, ref: 8, mspd: 7, hp: 6 },
  },
};

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

// ── Equipamiento (compatible con la familia de hierro del juego) ──
const NO_WEAPON_CHANCE = 0.1;
const NO_ARMOR_CHANCE = 0.1;
const WEAPONS_BY_TIER = [
  { tierKey: "T1", minLevel: 0, weapon: { name: "Daga de hierro", damageNature: "perforante", tier: "B", baseDamage: 9, weaponRange: 1 } },
  { tierKey: "T2", minLevel: 200, weapon: { name: "Espada de hierro", damageNature: "cortante", tier: "C", baseDamage: 16, weaponRange: 1 } },
  { tierKey: "T3", minLevel: 350, weapon: { name: "Lanza de hierro", damageNature: "perforante", tier: "C", baseDamage: 20, weaponRange: 2 } },
  { tierKey: "T4", minLevel: 500, weapon: { name: "Hacha de hierro", damageNature: "contundente", tier: "D", baseDamage: 26, weaponRange: 1 } },
];
const ARMOR_BY_TIER = [
  { tierKey: "T1", minLevel: 0, armor: { name: "Armadura de cuero", bonusDef: 4, durability: 15 } },
  { tierKey: "T2", minLevel: 200, armor: { name: "Cota de malla", bonusDef: 8, durability: 30 } },
  { tierKey: "T3", minLevel: 350, armor: { name: "Placas de hierro", bonusDef: 14, durability: 50 } },
  { tierKey: "T4", minLevel: 500, armor: { name: "Armadura pesada", bonusDef: 22, durability: 80 } },
];

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
  NO_WEAPON_CHANCE,
  NO_ARMOR_CHANCE,
  WEAPONS_BY_TIER,
  ARMOR_BY_TIER,
  MATCHED_LEVEL_DIFF_PCT,
  MAGIC_HIGH_THRESHOLD,
  BALANCE_TARGETS,
};

module.exports = {
  PERSONALITIES,
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
  NO_WEAPON_CHANCE,
  NO_ARMOR_CHANCE,
  WEAPONS_BY_TIER,
  ARMOR_BY_TIER,
  MATCHED_LEVEL_DIFF_PCT,
  MAGIC_HIGH_THRESHOLD,
  BALANCE_TARGETS,
  SIM_CONFIG,
  parseArgs,
  printUsage,
};
