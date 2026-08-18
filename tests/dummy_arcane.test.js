// @ts-nocheck
/**
 * Tests Fase B — Dummy mágico (ARCANE_DUMMY_LOADOUT + batería de fulgor).
 * El dummy equipa el hechizo "Doom" en mano_der; el resolver lo reconoce como
 * ataque mágico y el motor aplica la batería de fulgor (A.2/B.3).
 */

const { buildDummyEquipment, ARCANE_DUMMY_LOADOUT } = require("../src/services/rpg/dummyEquipment");
const { generateDummyCharacter } = require("../src/services/rpg/combatState");
const { resolveAttackerWeapon } = require("../src/services/rpg/equipmentResolverService");
const { executeAttack } = require("../src/services/rpg/combatEngine");
const { FULGOR_COST_BASE } = require("../src/config/combatBalance");

const CHALLENGER_STATS = { atk: 25, def: 15, aspd: 10, ref: 8, mspd: 8, fulgor: 5, d_fulgor: 5, r_fulgor: 5 };

function makeChallenger() {
  return {
    id: 1,
    name: "Retador",
    nivel: 12,
    hp_actual: 40,
    stats: { hp: 20, ...CHALLENGER_STATS },
  };
}

function makeDummy(minFulgor = FULGOR_COST_BASE) {
  return generateDummyCharacter(makeChallenger(), {
    loadout: ARCANE_DUMMY_LOADOUT,
    minFulgor,
  });
}

describe("ARCANE_DUMMY_LOADOUT — dummy mágico (B.3)", () => {
  it("buildDummyEquipment carga el hechizo Doom en mano_der", () => {
    const eq = buildDummyEquipment(ARCANE_DUMMY_LOADOUT);
    expect(eq.slots.mano_der).toBe("hechizo_doom");
    expect(Object.keys(eq.slots)).toHaveLength(1);
  });

  it("el hechizo existe en el catálogo (via getItem)", () => {
    const { getItem } = require("../src/data/items");
    const def = getItem("hechizo_doom");
    expect(def).toBeDefined();
    expect(def.type).toBe("spell");
    expect(def.modules.spell.fulgorCost).toBe(FULGOR_COST_BASE);
  });
});

describe("generateDummyCharacter — garantía de batería (B.3)", () => {
  it("minFulgor garantiza stats.fulgor ≥ mínimo", () => {
    const dummy = makeDummy(25);
    expect(dummy.stats.fulgor).toBeGreaterThanOrEqual(25);
  });

  it("sin minFulgor mantiene el comportamiento estándar", () => {
    const dummy = generateDummyCharacter(makeChallenger(), { loadout: ARCANE_DUMMY_LOADOUT });
    expect(dummy.stats.fulgor).toBeGreaterThanOrEqual(1);
  });

  it("el dummy arcano adjunta el loadout de hechizo", () => {
    const dummy = makeDummy();
    expect(dummy.dummyEquipment.slots.mano_der).toBe("hechizo_doom");
  });
});

describe("resolveAttackerWeapon — reconoce el módulo spell (B.3)", () => {
  it("devuelve weaponInfo de naturaleza mágica con fulgorCost", async () => {
    const dummy = makeDummy();
    const weapon = await resolveAttackerWeapon(dummy);
    expect(weapon).not.toBeNull();
    expect(weapon.damageNature).toBe("mágico");
    expect(weapon.fulgorCost).toBe(FULGOR_COST_BASE);
    expect(weapon.spellNature).toBe("mágico");
  });
});

describe("executeAttack — ataque mágico del dummy (B.3)", () => {
  it("un hechizo sin batería hace daño mínimo (diluido), nunca colapsa", async () => {
    const dummy = makeDummy();
    const weapon = await resolveAttackerWeapon(dummy);
    const defender = { name: "Retador", hp_actual: 40, stats: { hp: 20, ...CHALLENGER_STATS } };
    const result = executeAttack(dummy, defender, defender.hp_actual, dummy.hp_actual, 0, 0, weapon, 5);
    expect(result.damageNature).toBe("mágico");
    expect(result.baseDamage).toBeGreaterThanOrEqual(1);
  });
});
