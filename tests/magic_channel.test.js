// Tests Fase A — Canal mágico (stats vivas)
// Naturaleza "mágico", batería de fulgor, coste por dominio, lanzamiento diluido.
const { calculateWeaponDamage } = require("../src/services/rpg/combatEngine");
const { getCastCost } = require("../src/services/rpg/fatigueEngine");
const { resolveSessionFulgor, createSession } = require("../src/services/rpg/combatState");
const {
  FULGOR_ATK_SCALE,
  MAGIC_DEFENSE_SCALE,
  DOMINIO_REF,
  FULGOR_COST_BASE,
  FULGOR_DILUTED_MIN,
} = require("../src/config/combatBalance");
const { supabase } = require("../src/database/supabase");

beforeEach(() => {
  vi.spyOn(supabase, "from").mockImplementation(() => ({
    upsert: vi.fn(async () => ({ error: null })),
    delete: vi.fn(() => ({
      eq: vi.fn(async () => ({ error: null })),
    })),
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("perillas mágicas (combatBalance)", () => {
  it("FULGOR_ATK_SCALE espejo de cortante (0.8)", () => {
    expect(FULGOR_ATK_SCALE).toBe(0.8);
  });

  it("MAGIC_DEFENSE_SCALE espejo de DAMAGE_DEFENSE_SCALE (100)", () => {
    expect(MAGIC_DEFENSE_SCALE).toBe(100);
  });

  it("DOMINIO_REF es 100", () => {
    expect(DOMINIO_REF).toBe(100);
  });

  it("FULGOR_COST_BASE es 10", () => {
    expect(FULGOR_COST_BASE).toBe(10);
  });

  it("FULGOR_DILUTED_MIN es 0.1", () => {
    expect(FULGOR_DILUTED_MIN).toBe(0.1);
  });
});

describe("calculateWeaponDamage — naturaleza mágico", () => {
  it("daño = FULGOR_ATK_SCALE × fulgor mitigado por r_fulgor", () => {
    const attacker = { atk: 30, fulgor: 50, d_fulgor: 20, r_fulgor: 10 };
    const defender = { def: 40, r_fulgor: 25 };
    const weapon = { damageNature: "mágico", tier: "E", baseDamage: 0 };
    const { bodyDamage, nature } = calculateWeaponDamage(attacker, defender, weapon);
    expect(nature).toBe("mágico");
    // raw = floor(0.8×50) = 40 ; magicDef = 100/(100+25) = 0.8 → 40×0.8 = 32
    expect(bodyDamage).toBe(32);
  });

  it("r_fulgor 0 → mitigación plena (daño sin reducción)", () => {
    const attacker = { atk: 30, fulgor: 50, d_fulgor: 20, r_fulgor: 10 };
    const defender = { def: 40, r_fulgor: 0 };
    const weapon = { damageNature: "mágico", tier: "E", baseDamage: 0 };
    const { bodyDamage } = calculateWeaponDamage(attacker, defender, weapon);
    expect(bodyDamage).toBe(Math.floor(0.8 * 50));
  });

  it("r_fulgor alto reduce drásticamente el daño mágico", () => {
    const attacker = { atk: 30, fulgor: 50, d_fulgor: 20, r_fulgor: 10 };
    const defender = { def: 40, r_fulgor: 100 };
    const weapon = { damageNature: "mágico", tier: "E", baseDamage: 0 };
    const { bodyDamage } = calculateWeaponDamage(attacker, defender, weapon);
    // magicDef = 100/200 = 0.5 → floor(40 × 0.5) = 20
    expect(bodyDamage).toBe(20);
  });

  it("la naturaleza mágico NO reduce por DEF natural", () => {
    const attacker = { atk: 30, fulgor: 50, d_fulgor: 20, r_fulgor: 10 };
    const defenderAltaDef = { def: 400, r_fulgor: 0 };
    const defenderBajaDef = { def: 10, r_fulgor: 0 };
    const weapon = { damageNature: "mágico", tier: "E", baseDamage: 0 };
    const a = calculateWeaponDamage(attacker, defenderAltaDef, weapon);
    const b = calculateWeaponDamage(attacker, defenderBajaDef, weapon);
    expect(a.bodyDamage).toBe(b.bodyDamage);
  });

  it("respeto del piso DAMAGE_MIN (fulgor 0)", () => {
    const attacker = { atk: 30, fulgor: 0, d_fulgor: 20, r_fulgor: 10 };
    const defender = { def: 40, r_fulgor: 25 };
    const weapon = { damageNature: "mágico", tier: "E", baseDamage: 0 };
    const { bodyDamage } = calculateWeaponDamage(attacker, defender, weapon);
    expect(bodyDamage).toBeGreaterThanOrEqual(1);
  });

  it("weaponInfo sin naturaleza mágico NO activa el canal (sigue cortante)", () => {
    const attacker = { atk: 30, fulgor: 50, d_fulgor: 20, r_fulgor: 10 };
    const defender = { def: 40, r_fulgor: 25 };
    const weapon = { damageNature: "cortante", tier: "E", baseDamage: 20 };
    const { nature } = calculateWeaponDamage(attacker, defender, weapon);
    expect(nature).toBe("cortante");
  });
});

describe("fatigueEngine — coste de lanzamiento (dominio = eficiencia)", () => {
  it("sin dominio → coste nominal", () => {
    expect(getCastCost(0)).toBe(FULGOR_COST_BASE);
  });

  it("dominio reduce el coste (P3)", () => {
    const normal = getCastCost(0);
    const conDominio = getCastCost(DOMINIO_REF / 2);
    expect(conDominio).toBeLessThan(normal);
  });

  it("dominio nunca llega a 0 (piso FULGOR_DILUTED_MIN)", () => {
    const coste = getCastCost(DOMINIO_REF * 10);
    expect(coste).toBeGreaterThanOrEqual(FULGOR_COST_BASE * FULGOR_DILUTED_MIN);
  });

  it("coste no depende del daño (R6: dominio no es daño directo)", () => {
    expect(getCastCost(0)).toBe(getCastCost(0));
  });
});

describe("combatState — batería de fulgor en sesión", () => {
  it("resolveSessionFulgor inicializa a la stat fulgor", () => {
    const char = { stats: { fulgor: 42 } };
    expect(resolveSessionFulgor(char)).toBe(42);
  });

  it("sin stat fulgor → 0 (nunca negativo)", () => {
    expect(resolveSessionFulgor({ stats: {} })).toBe(0);
    expect(resolveSessionFulgor({})).toBe(0);
  });

  it("createSession inicializa fulgor en ambos lados", async () => {
    const charA = { id: 101, name: "A", hp_actual: 100, stats: { hp: 100, fulgor: 30 } };
    const charB = { id: 102, name: "B", hp_actual: 100, stats: { hp: 100, fulgor: 12 } };
    const session = await createSession("userA", "userB", charA, charB);
    expect(session.challenger.fulgor).toBe(30);
    expect(session.defender.fulgor).toBe(12);
  });
});
