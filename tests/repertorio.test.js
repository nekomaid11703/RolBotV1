// @ts-nocheck
/**
 * Repertorio experimental + laboratorio: regresión del catálogo estratificado
 * (fila "mago" de competitive_balance.md) y del test del lab.
 *
 * El repertorio se construye EN MEMORIA con el constructor real; nada de esto
 * persiste en el catálogo jugable. El smoke de combate verifica que cada hechizo
 * portado por un mago (batería de control) se lanza y aterriza daño en las
 * resoluciones con daño directo.
 */
const { buildRepertorio, selfCheck, checkNegatives } = require("../scripts/spell_lab/repertorio");
const { labFunctional } = require("../scripts/spell_lab/test_repertorio");
const { generateFighter } = require("../scripts/simulate_combat/fighterGenerator");
const { simulateCombat } = require("../scripts/simulate_combat/combatLoop");
const { SPELL_RESOLUTION_RULES } = require("../src/config/spellTree");
const { HP_STAT_MULTIPLIER } = require("../scripts/simulate_combat/config");

function magus(spellDef) {
  const fighter = generateFighter("magus", null, { spell: spellDef });
  fighter.stats.fulgor = 60;
  fighter.stats.d_fulgor = 30;
  fighter.stats.r_fulgor = 20;
  fighter.hp = fighter.stats.hp * HP_STAT_MULTIPLIER;
  return fighter;
}

function smoke(entry, sims) {
  let casts = 0;
  let spent = 0;
  let damage = 0;
  for (let i = 0; i < sims; i++) {
    let a = magus(entry.def);
    let b = magus(entry.def);
    if (i % 2 === 1) {
      const t = a;
      a = b;
      b = t;
    }
    const res = simulateCombat(a, b);
    casts += res.stateA.spellCasts + res.stateB.spellCasts;
    spent += res.stateA.fulgorSpent + res.stateB.fulgorSpent;
    damage += res.stateA.damageDealt + res.stateB.damageDealt;
  }
  return { casts, spent, damage };
}

describe("Repertorio experimental (fila mago)", () => {
  const repertorio = buildRepertorio();

  test("construye el catálogo estratificado en memoria", () => {
    expect(repertorio.length).toBeGreaterThanOrEqual(7);
    const patrones = new Set(repertorio.map((e) => e.patron));
    for (const p of ["directo", "area", "control-debuff", "control-buff", "multi-hit"]) {
      expect(patrones.has(p)).toBe(true);
    }
    expect(new Set(repertorio.map((e) => e.fingerprint)).size).toBe(repertorio.length);
  });

  test("paso el self-check del contrato §11", () => {
    const check = selfCheck(repertorio);
    expect(check.ok).toBe(true);
    expect(check.failures).toEqual([]);
  });

  test("coste en bandas: hay varias baterías y ninguna queda sin lanzar", () => {
    const lanz = repertorio.map((e) => e.lanzamientosEstimados);
    expect(Math.max(...lanz)).toBeGreaterThan(1);
    expect(lanz.every((n) => n >= 1)).toBe(true);
    const fulgorCosts = repertorio.map((e) => e.cost.fulgorCost);
    expect(new Set(fulgorCosts).size).toBeGreaterThan(3);
  });

  test("los casos negativos del §11 se rechazan", () => {
    expect(checkNegatives().ok).toBe(true);
  });
});

describe("Spell Lab — preview funcional (misma ruta que /api/cost)", () => {
  const repertorio = buildRepertorio();

  test("cada hechizo del repertorio pasa el preview del lab", () => {
    const assertions = labFunctional(repertorio);
    expect(assertions.every((a) => a.ok)).toBe(true);
  });
});

describe("Smoke de combate del repertorio", () => {
  const repertorio = buildRepertorio();
  const sims = 6;

  for (const entry of repertorio) {
    test(`${entry.key} se lanza y conserva el contrato de su resolución`, () => {
      const spell = entry.def.modules.spell;
      const { casts, spent, damage } = smoke(entry, sims);
      expect(casts).toBeGreaterThan(0);
      expect(spent).toBeGreaterThan(0);
      if (spell.kind) {
        const dañoDirecto = SPELL_RESOLUTION_RULES[spell.kind][spell.application].dañoDirecto !== false;
        if (dañoDirecto) expect(damage).toBeGreaterThan(0);
      }
    });
  }
});
