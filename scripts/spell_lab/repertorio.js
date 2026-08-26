// @ts-nocheck
"use strict";

/**
 * Repertorio experimental — catálogo estratificado de hechizos para el baseline
 * del simulador competitivo (fila "mago" de competitive_balance.md).
 *
 * Se construye EN MEMORIA con el constructor real (`buildSpellDefinition`): no
 * persiste nada en el catálogo jugable. Cada entrada etiqueta arquetipo, patrón
 * de hits, naturaleza, resolución (Contrato §11), coste y batería para poder
 * segmentar datos en los reportes del simulador.
 *
 * Uso:
 *   node scripts/spell_lab/repertorio.js [--out <dir>] [-v]
 */

const path = require("path");
const fs = require("fs");
const {
  validateSpellRecipe,
  buildSpellDefinition,
  computeSpellCost,
  fingerprintSpell,
  rarityPorTier,
} = require("../../src/services/rpg/skillForgeService");
const { SPELL_RESOLUTION_RULES, FULGOR_NATURES } = require("../../src/config/spellTree");
const { FULGOR_POOL_MAX, SPELL_TIER_RULES } = require("../../src/config/combatBalance");
const { ARCANE_GEAR } = require("../../src/data/arcaneFamily");
const { getSpellStats } = require("../../src/services/rpg/itemStatService");

const FOCUS = ARCANE_GEAR.varita_de_caoba;
const FOCUS_STATS = getSpellStats(FOCUS);
const FOCUS_INFO = {
  id: FOCUS.id,
  nombre: FOCUS.name,
  tier: FOCUS.tier,
  canalizeBase: FOCUS_STATS.canalizeBase,
  canalizeScale: FOCUS_STATS.canalizeScale,
};

const VALID_TIERS = ["E", "D", "C", "B", "A", "S"];

function recipeBase(id, name, kind, application, nature, opts = {}) {
  return {
    id,
    name,
    kind,
    application,
    nature,
    effects: [],
    castTime: 1,
    cooldown: 0,
    range: 3,
    basePrice: 100,
    ...opts,
  };
}

/**
 * Definición declarativa del repertorio. Cada entrada describe la receta, el
 * patrón esperado y (en modo legacy) el segmento de hits real de Fase B.
 * @type {Array<{ key: string, patrón: string, recipe: object, legacy?: boolean }>}
 */
const REPERTOIRE = [
  // ── Directo: proyectil × externa (bandas E / D / C) ──
  {
    key: "directo_fuego_E",
    patron: "directo",
    recipe: recipeBase("rep_directo_fuego_E", "Fulgor Directo", "proyectil", "externa", "fuego", {
      range: 1,
      basePrice: 40,
    }),
  },
  {
    key: "directo_hielo_D",
    patron: "directo",
    recipe: recipeBase("rep_directo_hielo_D", "Flecha de Hielo", "proyectil", "externa", "hielo", {
      effects: [{ tipo: "congelado", magnitude: 1, duration: 2 }],
      range: 3,
      basePrice: 120,
    }),
  },
  {
    key: "directo_electro_C",
    patron: "directo",
    recipe: recipeBase("rep_directo_electro_C", "Rayo Corrosivo", "proyectil", "externa", "electro", {
      effects: [
        { tipo: "veneno", magnitude: 5, duration: 3 },
        { tipo: "rompe_armaduras", magnitude: 4, duration: 3 },
        { tipo: "maldito", magnitude: 3, duration: 3 },
      ],
      range: 20,
      basePrice: 300,
    }),
  },

  // ── Multi-golpe / área: explosion × externa (centro en el objetivo) ──
  {
    key: "area_fuego_D",
    patron: "area",
    recipe: recipeBase("rep_area_fuego_D", "Nova Ignea", "explosion", "externa", "fuego", {
      resolution: { targetMode: "area", radius: 4 },
      effects: [
        { tipo: "quemadura", magnitude: 5, duration: 3 },
        { tipo: "veneno", magnitude: 4, duration: 3 },
      ],
      range: 20,
      castTime: 2,
      cooldown: 4,
      basePrice: 340,
    }),
  },
  {
    key: "area_hielo_C",
    patron: "area",
    recipe: recipeBase("rep_area_hielo_C", "Tormenta Gélida", "explosion", "externa", "hielo", {
      resolution: { targetMode: "area", radius: 5 },
      effects: [
        { tipo: "congelado", magnitude: 6, duration: 5 },
        { tipo: "enredado", magnitude: 5, duration: 4 },
        { tipo: "decadencia", magnitude: 4, duration: 4 },
      ],
      range: 20,
      castTime: 3,
      cooldown: 6,
      basePrice: 600,
    }),
  },

  // ── Control: buffo × externa (debuff) y buffo × propia (buff) ──
  {
    key: "control_debuffo_oscuridad_D",
    patron: "control-debuff",
    recipe: recipeBase("rep_debuffo_oscuro_D", "Maldición Debilitante", "buffo", "externa", "oscuridad", {
      resolution: {
        targetMode: "enemigo",
        statMods: [
          { stat: "atk", delta: -6 },
          { stat: "aspd", delta: -4 },
        ],
        duration: 3,
      },
      effects: [{ tipo: "maldito", magnitude: 3, duration: 3 }],
      range: 20,
      basePrice: 200,
    }),
  },
  {
    key: "control_buffo_electro_D",
    patron: "control-buff",
    recipe: recipeBase("rep_buffo_electro_D", "Voluntad Galvánica", "buffo", "propia", "electro", {
      resolution: {
        targetMode: "propio",
        statMods: [
          { stat: "atk", delta: 5 },
          { stat: "aspd", delta: 4 },
        ],
        duration: 3,
      },
      effects: [{ tipo: "purificado", magnitude: 1 }],
      range: 6,
      basePrice: 120,
    }),
  },

  // ── Multi-hit real: modo hits (legacy Fase B) con reacción hielo+fuego ──
  {
    key: "multihit_doom_legacy",
    patron: "multi-hit",
    legacy: true,
    recipe: {
      id: "rep_multihit_doom",
      name: "Doom Repertorio",
      description: "Trae a la tierra un infierno carmesí a través de una explosión de llamas.",
      rarity: "raro",
      basePrice: 1200,
      elements: ["cryo", "pyro"],
      hits: [
        { element: "cryo", magnitude: 1 },
        { element: "pyro", magnitude: 5 },
      ],
      fulgorCost: 10,
      spellNature: "mágico",
      baseDamage: 0,
      range: 3,
      cooldown: 12,
      castTime: 4,
    },
  },
];

/**
 * Casos negativos del contrato §11 (recetas que el constructor DEBE rechazar).
 * @type {Array<{ key: string, recipe: object, expected: string }>}
 */
const NEGATIVE_CASES = [
  {
    key: "proyectil_propia_con_hit",
    recipe: recipeBase("neg_proyectil_propia_hit", "Inválido", "proyectil", "propia", "fuego", {
      resolution: { targetMode: "arma", imbuement: "fuego" },
      hits: [{ element: "fuego", magnitude: 3 }],
    }),
    expected: "DIRECT_DAMAGE_FORBIDDEN",
  },
  {
    key: "explosion_sin_radius",
    recipe: recipeBase("neg_explosion_sin_radius", "Inválido", "explosion", "externa", "fuego", {
      resolution: { targetMode: "area" },
      effects: [{ tipo: "quemadura", magnitude: 2, duration: 2 }],
    }),
    expected: "EXPLOSION_RADIUS_REQUIRED",
  },
  {
    key: "buffo_sin_stat_mods",
    recipe: recipeBase("neg_buffo_sin_statmods", "Inválido", "buffo", "externa", "oscuridad", {
      resolution: { targetMode: "enemigo", duration: 3 },
      effects: [{ tipo: "maldito", magnitude: 2, duration: 2 }],
    }),
    expected: "BUFFO_STAT_MODS_REQUIRED",
  },
  {
    key: "target_mode_fuera_de_rango",
    recipe: recipeBase("neg_target_mode", "Inválido", "proyectil", "externa", "fuego", {
      resolution: { targetMode: "arma" },
    }),
    expected: "TARGET_MODE_FORBIDDEN",
  },
  {
    key: "buffo_stat_invalida",
    recipe: recipeBase("neg_buffo_stat", "Inválido", "buffo", "externa", "oscuridad", {
      resolution: { targetMode: "enemigo", duration: 3, statMods: [{ stat: "suerte", delta: 5 }] },
    }),
    expected: "STAT_MOD_INVALID",
  },
];

/**
 * Construye el repertorio completo en memoria.
 * @returns {Array<object>} Entradas { key, patron, seg, recipe, errors, def, cost, lanzamientosEstimados }
 * @throws {Error} Si alguna receta no valida (el repertorio debe ser 100% constructor-válido)
 */
function buildRepertorio() {
  return REPERTOIRE.map((entry) => {
    const errors = validateSpellRecipe(entry.recipe);
    const def = errors.length === 0 ? buildSpellDefinition(entry.recipe) : null;
    const cost = def ? computeSpellCost(def) : null;
    const lanzamientosEstimados = cost ? Math.floor(FULGOR_POOL_MAX / cost.fulgorCost) : 0;
    const seg = {
      arquetipo: "mago",
      patron: entry.patron,
      naturaleza: entry.recipe.nature || (entry.recipe.elements || []).join("+"),
      resolucion: entry.recipe.kind ? `${entry.recipe.kind} × ${entry.recipe.application}` : "hits (legacy)",
      foco: FOCUS_INFO,
      coste: cost
        ? { costoFino: cost.costoFino, tier: cost.tier, rarity: cost.rarity, fulgorCost: cost.fulgorCost }
        : null,
      bateria: {
        fulgorPoolMax: FULGOR_POOL_MAX,
        lanzamientosEstimados,
        dominioReq: cost ? cost.dominioReq : 0,
        usableNaturalmente: cost ? cost.usableNaturalmente : false,
      },
    };
    if (errors.length > 0) {
      throw new Error(`Repertorio inválido en "${entry.key}": ${errors.map((e) => e.message).join(" ")}`);
    }
    return {
      key: entry.key,
      patron: entry.patron,
      legacy: Boolean(entry.legacy),
      seg,
      recipe: entry.recipe,
      errors,
      def,
      cost,
      lanzamientosEstimados,
      fingerprint: fingerprintSpell(entry.recipe),
    };
  });
}

/**
 * Auto-chequeo del repertorio contra el contrato §11 y el costo fino.
 * @param {Array<object>} repertorio - Salida de buildRepertorio
 * @returns {{ ok: boolean, failures: Array<object>, checks: number }}
 */
function selfCheck(repertorio) {
  const failures = [];
  const add = (key, check, detail) => failures.push({ key, check, detail });

  for (const entry of repertorio) {
    const { def } = entry;
    if (!def) {
      add(entry.key, "def", "definición ausente");
      continue;
    }
    const spell = def.modules.spell;
    const cost = entry.cost;

    if (entry.legacy) {
      if ((spell.hits || []).length !== 2) add(entry.key, "hits-legacy", "se esperaban 2 hits");
      if ((spell.elements || []).length !== 2) add(entry.key, "elements-legacy", "se esperaban 2 elementos");
      if (!(cost && cost.fulgorCost > 0)) add(entry.key, "fulgorCost", "coste de lanzamiento ausente");
      continue;
    }

    const rules = SPELL_RESOLUTION_RULES[entry.recipe.kind][entry.recipe.application];
    const resolution = spell.resolution;

    if (!resolution) add(entry.key, "resolution", "payload de resolución no persistido (§11)");
    else {
      if (!rules.targetModes.includes(resolution.targetMode)) {
        add(entry.key, "resolution.targetMode", `"${resolution.targetMode}" fuera de ${rules.targetModes.join("/")}`);
      }
      const inyect = (k, cond, label) => {
        if (cond) add(entry.key, `resolution.${k}`, label);
      };
      inyect("radius", Boolean(rules.payload.radius) !== resolution.radius > 0, "radius requerido == persistido");
      inyect(
        "statMods",
        Boolean(rules.payload.statMods) !== resolution.statMods.length > 0,
        "statMods requerido == presente",
      );
      inyect("duration", Boolean(rules.payload.duration) !== resolution.duration > 0, "duration requerida == presente");
    }

    const hits = spell.hits || [];
    if (Boolean(hits.length) !== (rules.dañoDirecto !== false)) {
      add(entry.key, "hits", `dañoDirecto=${rules.dañoDirecto} pero hits.length=${hits.length}`);
    }

    if (!cost) add(entry.key, "cost", "costo fino no calculado");
    else {
      if (!VALID_TIERS.includes(cost.tier)) add(entry.key, "cost.tier", `tier inválido "${cost.tier}"`);
      if (cost.rarity !== rarityPorTier(cost.tier)) {
        add(entry.key, "cost.rarity", `${cost.rarity} ≠ ${rarityPorTier(cost.tier)}`);
      }
      if (!(cost.costoFino >= 1)) add(entry.key, "cost.costoFino", `costoFino ${cost.costoFino}`);
      if (!(cost.fulgorCost >= 1)) add(entry.key, "cost.fulgorCost", `fulgorCost ${cost.fulgorCost}`);
      if (entry.lanzamientosEstimados < 1) {
        add(entry.key, "bateria", "lanzamientos estimados < 1 (queda sin batería al inicio)");
      }
      const reglas = SPELL_TIER_RULES[cost.tier];
      if (!reglas) add(entry.key, "cost.reglasTier", `reglasTier ausentes para ${cost.tier}`);
    }
  }

  const fps = new Set(repertorio.map((e) => e.fingerprint));
  if (fps.size !== repertorio.length) {
    add("repertorio", "fingerprint", `duplicados: ${repertorio.length} entradas, ${fps.size} fingerprints`);
  }

  return { ok: failures.length === 0, failures, checks: repertorio.length };
}

/**
 * Verifica los casos negativos esperados del contrato §11.
 * @returns {{ ok: boolean, results: Array<object> }}
 */
function checkNegatives() {
  const results = NEGATIVE_CASES.map((c) => {
    const codes = validateSpellRecipe(c.recipe).map((e) => e.code);
    return { key: c.key, expected: c.expected, received: codes, ok: codes.includes(c.expected) };
  });
  return { ok: results.every((r) => r.ok), results };
}

/**
 * Escribe raw JSON + reporte markdown del repertorio.
 * @param {Array<object>} repertorio
 * @param {string} outDir
 * @returns {{ rawPath: string, mdPath: string }}
 */
function writeReport(repertorio, outDir) {
  const base = path.resolve(outDir);
  fs.mkdirSync(base, { recursive: true });

  const raw = {
    timestamp: new Date().toISOString(),
    fecha: new Date().toISOString().slice(0, 10),
    foco: FOCUS_INFO,
    FULGOR_POOL_MAX,
    repertorio: repertorio.map((e) => ({ key: e.key, patron: e.patron, seg: e.seg, fingerprint: e.fingerprint })),
  };
  const rawPath = path.join(base, "repertorio_raw.json");
  fs.writeFileSync(rawPath, JSON.stringify(raw, null, 2));

  const lines = [];
  lines.push("# Repertorio Experimental (fila mago)");
  lines.push("");
  lines.push(`- Foco: ${FOCUS_INFO.nombre} (tier ${FOCUS_INFO.tier}, canalizeBase ${FOCUS_INFO.canalizeBase})`);
  lines.push(`- Batería máxima: ${FULGOR_POOL_MAX} fulgor`);
  lines.push("");
  lines.push(
    "| clave | patrón | naturaleza | resolución | tier | costoFino | fulgorCost | dominioReq | lanzamientos | usable |",
  );
  lines.push(
    "|-------|--------|------------|------------|------|-----------|------------|------------|--------------|--------|",
  );
  for (const e of repertorio) {
    const c = e.cost;
    lines.push(
      [
        `\`${e.key}\``,
        e.patron,
        e.seg.naturaleza,
        e.seg.resolucion,
        c.tier,
        c.costoFino,
        c.fulgorCost,
        c.dominioReq,
        e.lanzamientosEstimados,
        c.usableNaturalmente ? "sí" : "no (ritual)",
      ].join(" | "),
    );
  }
  lines.push("");

  const mdPath = path.join(base, "repertorio_report.md");
  fs.writeFileSync(mdPath, lines.join("\n"));
  return { rawPath, mdPath };
}

function main() {
  const args = process.argv.slice(2);
  const outFlag = args.indexOf("--out");
  const outDir = outFlag >= 0 ? args[outFlag + 1] : path.join(__dirname, "..", "simulation_output", "experiments");
  const verbose = args.includes("-v");

  try {
    const repertorio = buildRepertorio();
    const check = selfCheck(repertorio);
    const negatives = checkNegatives();
    const { rawPath, mdPath } = writeReport(repertorio, outDir);

    if (verbose) {
      for (const e of repertorio) {
        const c = e.cost;
        console.log(
          `- ${e.key.padEnd(30)} ${e.patron.padEnd(14)} tier ${c.tier} costo ${c.costoFino} fulgor ${c.fulgorCost} lanz ${e.lanzamientosEstimados}`,
        );
      }
    }

    console.log(`Repertorio: ${repertorio.length} hechizos | cohorts: ${check.checks}`);
    console.log(`  Self-check §11: ${check.ok ? "OK" : "FALLO"}`);
    if (check.failures.length > 0) {
      for (const f of check.failures) console.log(`    - ${f.key}: ${f.check} → ${f.detail}`);
    }
    console.log(`  Negativos: ${negatives.ok ? "OK" : "FALLO"}`);
    if (!negatives.ok) {
      for (const r of negatives.results)
        if (!r.ok) console.log(`    - ${r.key}: esperado ${r.expected}, recibido ${r.received.join(",")}`);
    }
    console.log(`  Raw:   ${rawPath}`);
    console.log(`  Report: ${mdPath}`);
    process.exit(check.ok && negatives.ok ? 0 : 1);
  } catch (err) {
    console.error(`Repertorio inválido: ${err && err.message}`);
    process.exit(1);
  }
}

module.exports = {
  buildRepertorio,
  selfCheck,
  checkNegatives,
  writeReport,
  REPERTOIRE,
  NEGATIVE_CASES,
  FOCUS_INFO,
};

if (require.main === module) {
  main();
}
