// @ts-nocheck
"use strict";

const PERSONALITIES = {
  tanque: {
    label: "Tanque",
    description: "Alta DEF + ASPD — tanquea hits, bloquea frecuentemente",
    weights: { atk: 8, def: 18, aspd: 12, ref: 5, mspd: 7 },
  },
  asesino: {
    label: "Asesino",
    description: "Alta ATK + ASPD — rapido y golpes fuertes",
    weights: { atk: 20, def: 3, aspd: 15, ref: 4, mspd: 8 },
  },
  esquivo: {
    label: "Esquivo",
    description: "Alta REF + DEF — esquiva y contraataca",
    weights: { atk: 8, def: 12, aspd: 8, ref: 14, mspd: 8 },
  },
  equilibrado: {
    label: "Equilibrado",
    description: "Distribucion pareja en stats fisicas",
    weights: { atk: 10, def: 10, aspd: 10, ref: 10, mspd: 10 },
  },
  extremista_ataque: {
    label: "Extremista ATK",
    description: "Maximo ATK + ASPD — golpes rapidos y devastadores",
    weights: { atk: 35, def: 3, aspd: 15, ref: 2, mspd: 5 },
  },
  extremista_defensa: {
    label: "Extremista DEF",
    description: "Maxima DEF + REF — pared que esquiva y contraataca",
    weights: { atk: 3, def: 35, aspd: 5, ref: 12, mspd: 5 },
  },
  extremista_velocidad: {
    label: "Extremista ASPD",
    description: "Maxima ASPD + ATK — mil golpes devastadores",
    weights: { atk: 15, def: 3, aspd: 35, ref: 5, mspd: 2 },
  },
  extremista_reflejos: {
    label: "Extremista REF",
    description: "Maximos REF + ASPD — esquiva perfecta y contraataque rapido",
    weights: { atk: 5, def: 3, aspd: 15, ref: 35, mspd: 2 },
  },
  velocista: {
    label: "Velocista",
    description: "Maxima MSPD + ASPD — huidor garantizado, esquiva por velocidad",
    weights: { atk: 8, def: 5, aspd: 12, ref: 5, mspd: 20 },
  },
  berserker: {
    label: "Berserker",
    description: "ATK maximo, DEF minimo — glass cannon, alto riesgo",
    weights: { atk: 30, def: 1, aspd: 12, ref: 3, mspd: 4 },
  },
  guardian: {
    label: "Guardian",
    description: "DEF + MSPD — tanque lento pero indestructible",
    weights: { atk: 5, def: 22, aspd: 8, ref: 5, mspd: 10 },
  },
  estratega: {
    label: "Estratega",
    description: "REF + ASPD moderado — contraataques frequentes",
    weights: { atk: 10, def: 8, aspd: 12, ref: 15, mspd: 5 },
  },
  gladiador: {
    label: "Gladiador",
    description: "ATK + ASPD + REF — ofensivo pero reactivo",
    weights: { atk: 15, def: 6, aspd: 14, ref: 10, mspd: 5 },
  },
  magus: {
    label: "Magus",
    description: "ASPD + fulgor — hibrido fisico-magico rapido",
    weights: { atk: 12, def: 5, aspd: 18, ref: 8, mspd: 7 },
  },
};

const DEFAULT_NUM_SIMS = 100;
const MAX_ROUNDS = 50;
const HP_MAX = 200; // max HP = 2 × hp_stat (clamped 100) → 200
const LEVEL_MIN = 100;
const LEVEL_MAX = 500;
const LEVEL_DIFF_MAX_PCT = 0.5;
const FREE_POINTS = 50;
const PHYSICAL_STATS = ["atk", "def", "aspd", "ref", "mspd"];
const MAGIC_STATS = ["fulgor", "d_fulgor", "r_fulgor"];
const FATIGUE_SNAPSHOT_TURNS = [1, 5, 10, 15, 20, 25, 30, 40, 50];

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
  -n, --num-sims <N>   Number of simulations (default: 100)
  -v, --verbose         Print progress to stdout
  -h, --help            Show this help message

OUTPUT
  scripts/simulation_output/raw_data.json    Raw data + aggregated report
  scripts/simulation_output/report.md        Human-readable markdown report
`);
}

module.exports = {
  PERSONALITIES,
  DEFAULT_NUM_SIMS,
  MAX_ROUNDS,
  HP_MAX,
  LEVEL_MIN,
  LEVEL_MAX,
  LEVEL_DIFF_MAX_PCT,
  FREE_POINTS,
  PHYSICAL_STATS,
  MAGIC_STATS,
  FATIGUE_SNAPSHOT_TURNS,
  parseArgs,
  printUsage,
};
