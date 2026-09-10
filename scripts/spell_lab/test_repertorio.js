// @ts-nocheck
"use strict";

/**
 * Test de repertorio en el laboratorio de hechizos.
 *
 * Verifica que las habilidades del repertorio experimental "actúan de la manera
 * esperada" en tres capas:
 *   1. FUNCIONAL — preview del lab (`previewCost`, misma ruta que GET /api/cost)
 *      construye, valida y calcula el coste de cada hechizo del repertorio.
 *   2. HTTP VIVO — el servidor del lab arrancado en un puerto efímero responde
 *      /api/taxonomy (reglas de resolución §11), /api/cost, y el ciclo
 *      POST→list→DELETE sin ensuciar el catálogo persistido.
 *   3. COMBATE — cada hechizo portado por un mago (generador del simulador con
 *      batería controlada) se lanza en espejos 40×: casteos > 0, fulgor gastado
 *      > 0 y daño aterrizado en las resoluciones con daño directo.
 *
 * Uso:
 *   node scripts/spell_lab/test_repertorio.js [-v] [--sims <n>]
 */

const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const net = require("net");

const { buildRepertorio, selfCheck, checkNegatives, NEGATIVE_CASES, FOCUS_INFO } = require("./repertorio");
const { previewCost } = require("./server");
const { SPELL_RESOLUTION_RULES } = require("../../src/config/spellTree");
const { generateFighter } = require("../simulate_combat/fighterGenerator");
const { simulateCombat } = require("../simulate_combat/combatLoop");
const { HP_STAT_MULTIPLIER } = require("../simulate_combat/config");

const OUT_DIR = path.join(__dirname, "..", "simulation_output", "experiments");
const DEFAULT_SIMS = 40;
const LAB_START_TIMEOUT = 8000;

function freePort() {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
  });
}

function startLab(port) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(__dirname, "server.js"), "--port", String(port)], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`El lab no arrancó:\n${out}`));
    }, LAB_START_TIMEOUT);
    child.stdout.on("data", (d) => {
      out += d;
      if (out.includes(`Spell Lab en http://localhost:${port}`)) {
        clearTimeout(timer);
        resolve(child);
      }
    });
    child.stderr.on("data", (d) => {
      out += d;
    });
    child.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`El lab salió con código ${code}:\n${out}`));
    });
  });
}

async function httpJson(url, options) {
  const res = await fetch(url, options);
  return { status: res.status, body: await res.json() };
}

function previewQuery(recipe) {
  return previewCost(new URLSearchParams({ json: JSON.stringify(recipe) }));
}

function labMagus(spellDef) {
  const fighter = generateFighter("magus", null, { spell: spellDef });
  fighter.stats.fulgor = 60;
  fighter.stats.d_fulgor = 30;
  fighter.stats.r_fulgor = 20;
  fighter.initialBattery = 60;
  fighter.hp = fighter.stats.hp * HP_STAT_MULTIPLIER;
  return fighter;
}

function smokeSpell(entry, sims) {
  let casts = 0;
  let diluted = 0;
  let spent = 0;
  let damage = 0;
  let wins = 0;
  let timeouts = 0;
  let meds = 0;
  for (let i = 0; i < sims; i++) {
    let a = labMagus(entry.def);
    let b = labMagus(entry.def);
    if (i % 2 === 1) {
      const t = a;
      a = b;
      b = t;
    }
    const res = simulateCombat(a, b);
    if (res.winner === "A") wins++;
    else if (res.winner !== "B") timeouts++;
    casts += res.stateA.spellCasts + res.stateB.spellCasts;
    diluted += res.stateA.dilutedCasts + res.stateB.dilutedCasts;
    spent += res.stateA.fulgorSpent + res.stateB.fulgorSpent;
    damage += res.stateA.damageDealt + res.stateB.damageDealt;
    meds += res.stateA.meditations + res.stateB.meditations;
  }
  const totalActors = 2 * sims;
  return {
    key: entry.key,
    patrón: entry.patron,
    casteos: casts,
    casteosPromedio: Math.round((casts / totalActors) * 100) / 100,
    fulgorGastado: spent,
    daño: damage,
    dilucion: casts ? Math.round((diluted / casts) * 100) / 100 : null,
    meditaciones: meds,
    winrate: Math.round((wins / sims) * 100) / 100,
    timeouts,
  };
}

function asert(ok, label, detail) {
  return { ok, label, detail };
}

function labFunctional(repertorio, verbose) {
  const assertions = [];
  for (const entry of repertorio) {
    const p = previewQuery(entry.recipe);
    assertions.push(
      asert(
        p.ok === true,
        `preview ${entry.key}`,
        p.ok ? `def name=${p.def.name} cost=${p.cost.costoFino}` : `errors=${p.errors.join(" | ")}`,
      ),
    );
    if (p.ok && verbose) {
      process.stdout.write(`  preview ${entry.key}: ok → ${p.cost.tier} @ ${p.cost.costoFino}\n`);
    }
  }
  for (const negative of NEGATIVE_CASES) {
    const p = previewQuery(negative.recipe);
    const codes = (p.errors || []).map((e) => e.code || e);
    assertions.push(
      asert(
        p.ok === false && codes.includes(negative.expected),
        `preview negativo ${negative.key}`,
        p.ok ? "aceptó una receta inválida" : `codes=${codes.join(" | ")}`,
      ),
    );
  }
  return assertions;
}

async function labHttp(repertorio, verbose) {
  const assertions = [];
  const port = await freePort();
  const child = await startLab(port);
  try {
    const base = `http://localhost:${port}`;

    const taxonomy = await httpJson(`${base}/api/taxonomy`);
    const kinds =
      taxonomy.body && taxonomy.body.SPELL_RESOLUTION_RULES ? Object.keys(taxonomy.body.SPELL_RESOLUTION_RULES) : [];
    assertions.push(
      asert(
        taxonomy.status === 200 &&
          kinds.includes("proyectil") &&
          kinds.includes("explosion") &&
          kinds.includes("barrera") &&
          kinds.includes("aura") &&
          kinds.includes("buffo"),
        "GET /api/taxonomy",
        `status=${taxonomy.status} kinds=[${kinds.join(",")}] defaultModes=${taxonomy.body.RESOLUTION_DEFAULT_TARGET_MODE ? "sí" : "no"}`,
      ),
    );

    for (const entry of repertorio) {
      const r = await httpJson(`${base}/api/cost?json=${encodeURIComponent(JSON.stringify(entry.recipe))}`);
      assertions.push(
        asert(
          r.status === 200 && r.body.ok === true && r.body.def && r.body.def.modules && r.body.def.modules.spell,
          `GET /api/cost ${entry.key}`,
          `status=${r.status} tier=${r.body.cost && r.body.cost.tier}`,
        ),
      );
    }

    for (const negative of NEGATIVE_CASES) {
      const r = await httpJson(`${base}/api/cost?json=${encodeURIComponent(JSON.stringify(negative.recipe))}`);
      const codes = (r.body.errors || []).map((e) => e.code || e);
      assertions.push(
        asert(
          r.status === 200 && r.body.ok === false && codes.includes(negative.expected),
          `GET /api/cost negativo ${negative.key}`,
          `codes=${codes.join(" | ")}`,
        ),
      );
    }

    const before = await httpJson(`${base}/api/spells`);
    const baseCount = before.body.items ? before.body.items.length : 0;

    const throwaway = {
      ...repertorio[1].recipe,
      id: `lab_smoke_${Date.now()}`,
      name: "Laboratorio smoke",
    };
    const post = await httpJson(`${base}/api/spells`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(throwaway),
    });
    assertions.push(asert(post.status === 201 && post.body.ok === true, "POST /api/spells", `status=${post.status}`));

    const invalidPost = await httpJson(`${base}/api/spells`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(NEGATIVE_CASES[2].recipe),
    });
    assertions.push(
      asert(
        invalidPost.status === 400,
        "POST inválido rechazado",
        `status=${invalidPost.status} errors=${invalidPost.body.errors}`,
      ),
    );

    const after = await httpJson(`${base}/api/spells`);
    assertions.push(
      asert(
        after.body.items.length === baseCount + 1,
        "GET /api/spells lista persistida",
        `${after.body.items.length} vs ${baseCount}`,
      ),
    );

    const del = await httpJson(`${base}/api/spells/${encodeURIComponent(throwaway.id)}`, { method: "DELETE" });
    assertions.push(asert(del.status === 200, "DELETE /api/spells", `status=${del.status}`));

    const final = await httpJson(`${base}/api/spells`);
    assertions.push(
      asert(
        final.body.items.length === baseCount,
        "catálogo persistido intacto",
        `${final.body.items.length} vs ${baseCount}`,
      ),
    );
  } finally {
    child.kill();
  }
  return assertions;
}

function labCombat(repertorio, sims, verbose) {
  const assertions = [];
  const rows = [];
  for (const entry of repertorio) {
    const spell = entry.def.modules.spell;
    let dañoDirecto = true;
    if (spell.kind) {
      dañoDirecto = SPELL_RESOLUTION_RULES[spell.kind][spell.application].dañoDirecto !== false;
    }
    const smoke = smokeSpell(entry, sims);
    rows.push(smoke);
    assertions.push(asert(smoke.casteos > 0, `casteos ${entry.key}`, `casteos=${smoke.casteos}`));
    assertions.push(asert(smoke.fulgorGastado > 0, `fulgor gastado ${entry.key}`, `gasto=${smoke.fulgorGastado}`));
    assertions.push(asert(smoke.dilucion <= 0.2, `sin dilucion ${entry.key}`, `dilucion=${smoke.dilucion}`));
    if (dañoDirecto) {
      assertions.push(asert(smoke.daño > 0, `daño ${entry.key}`, `daño=${smoke.daño}`));
    }
    if (verbose) {
      process.stdout.write(
        `  combate ${entry.patron.padEnd(14)} ${smoke.key.padEnd(28)} casts=${smoke.casteosPromedio} dil=${smoke.dilucion} meds=${smoke.meditaciones} dmg=${smoke.daño} wr=${Math.round(smoke.winrate * 100)}% to=${smoke.timeouts}\n`,
      );
    }
  }
  return { assertions, rows };
}

function writeLabReport(repertorio, checks, neg, funcAssertions, httpAssertions, combat) {
  const base = path.resolve(OUT_DIR);
  fs.mkdirSync(base, { recursive: true });

  const all = [...funcAssertions, ...httpAssertions, ...combat.assertions];
  const okCount = all.filter((a) => a.ok).length;

  const raw = {
    timestamp: new Date().toISOString(),
    foco: FOCUS_INFO,
    resumen: { total: all.length, ok: okCount },
    selfCheck: checks,
    negativos: neg,
    smoke: combat.rows,
  };
  fs.writeFileSync(path.join(base, "repertorio_lab_raw.json"), JSON.stringify(raw, null, 2));

  const lines = [];
  lines.push("# Test de Repertorio en el Spell Lab");
  lines.push("");
  lines.push(`- Foco: ${FOCUS_INFO.nombre} (tier ${FOCUS_INFO.tier})`);
  lines.push(`- Resultado: ${okCount}/${all.length} checks OK`);
  lines.push("");
  lines.push("## Smoke de combate (espejos mago, bateria de control = 60)");
  lines.push("");
  lines.push("| patron | hechizo | casteos/combate | dilucion | meditaciones | dano total | winrate | timeouts |");
  lines.push("|--------|---------|-----------------|----------|--------------|------------|---------|----------|");
  for (const r of combat.rows) {
    lines.push(
      `| ${r.patrón} | \`${r.key}\` | ${r.casteosPromedio} | ${r.dilucion ?? "—"} | ${r.meditaciones} | ${r.daño} | ${Math.round(r.winrate * 100)}% | ${r.timeouts} |`,
    );
  }
  lines.push("");
  lines.push("## FALLOS (si los hay)");
  lines.push("");
  const fails = all.filter((a) => !a.ok);
  if (fails.length === 0) {
    lines.push("Ninguno.");
  } else {
    for (const f of fails) lines.push(`- ${f.label}: ${f.detail}`);
  }
  lines.push("");
  fs.writeFileSync(path.join(base, "repertorio_lab_report.md"), lines.join("\n"));
  return { total: all.length, ok: okCount };
}

async function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes("-v");
  const simsFlag = args.indexOf("--sims");
  const sims = simsFlag >= 0 ? Math.max(4, Number(args[simsFlag + 1]) || DEFAULT_SIMS) : DEFAULT_SIMS;

  try {
    const repertorio = buildRepertorio();
    const check = selfCheck(repertorio);
    const neg = checkNegatives();
    if (!check.ok || !neg.ok) {
      console.error("El repertorio no pasa su self-check; aborta el test.");
      process.exit(1);
    }

    const funcAssertions = labFunctional(repertorio, verbose);
    const httpAssertions = await labHttp(repertorio, verbose);
    const combat = labCombat(repertorio, sims, verbose);

    const all = [...funcAssertions, ...httpAssertions, ...combat.assertions];
    const ok = all.filter((a) => a.ok).length;
    const { total } = writeLabReport(repertorio, check, neg, funcAssertions, httpAssertions, combat);

    for (const a of all) {
      if (!a.ok) console.log(`  [FAIL] ${a.label}: ${a.detail}`);
    }
    console.log(`Lab test: ${ok}/${total} checks OK (${sims} sims/hechizo)`);
    console.log(`  Report: ${path.join(OUT_DIR, "repertorio_lab_report.md")}`);
    process.exit(ok === total ? 0 : 1);
  } catch (err) {
    console.error(`Test del laboratorio falló: ${err && err.stack ? err.stack : err}`);
    process.exit(1);
  }
}

module.exports = { labFunctional, labHttp, labCombat, smokeSpell, labMagus };

if (require.main === module) {
  main();
}
