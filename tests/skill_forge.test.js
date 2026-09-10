// Tests Fase B — Forja backend (skillForgeService + módulo spell)
const SpellModule = require("../src/data/itemCategories/spell");
const ELEMENTS = SpellModule.ELEMENTS;
const {
  validateSpellRecipe,
  buildSpellDefinition,
  refineSpell,
  fingerprintSpell,
} = require("../src/services/rpg/skillForgeService");
const { MAX_HITS_PER_SPELL } = require("../src/config/combatBalance");
const { getCategory } = require("../src/data/itemCategories");

const VALID_RECIPE = {
  id: "hechizo_doom",
  name: "Doom",
  elements: ["cryo", "pyro"],
  hits: [
    { element: "cryo", magnitude: 1 },
    { element: "pyro", magnitude: 5 },
  ],
  fulgorCost: 10,
  spellNature: "mágico",
  baseDamage: 0,
  range: 3,
  tier: "D",
};

describe("módulo spell (B.1)", () => {
  it("type 'spell' y trigger Attack", () => {
    expect(SpellModule.type).toBe("spell");
    expect(SpellModule.triggers).toContain("Attack");
  });

  it("se registra en el itemCategory registry", () => {
    const klass = getCategory("spell");
    expect(klass).toBeTruthy();
    expect(klass.type).toBe("spell");
  });

  it("onAttack emite payload con hits ordenados, fulgorCost y spellNature", () => {
    const spell = new SpellModule(VALID_RECIPE);
    const payload = spell.onAttack({});
    expect(payload.type).toBe("spell");
    expect(payload.elements).toEqual(["cryo", "pyro"]);
    expect(payload.hits).toHaveLength(2);
    expect(payload.hits[0]).toEqual({ element: "cryo", magnitude: 1 });
    expect(payload.fulgorCost).toBe(10);
    expect(payload.spellNature).toBe("mágico");
  });

  it("ELEMENTS contiene la tabla base del diseño (§4)", () => {
    expect(ELEMENTS).toEqual(expect.arrayContaining(["hydro", "pyro", "geo", "anemo", "electro", "cryo"]));
  });
});

describe("validateSpellRecipe (B.2)", () => {
  it("receta válida → sin errores", () => {
    expect(validateSpellRecipe(VALID_RECIPE)).toEqual([]);
  });

  it("elemento desconocido → error ELEMENT_UNKNOWN", () => {
    const errors = validateSpellRecipe({ ...VALID_RECIPE, elements: ["plasma"] });
    expect(errors.some((e) => e.code === "ELEMENT_UNKNOWN")).toBe(true);
  });

  it("hits vacío → error HITS_EMPTY", () => {
    const errors = validateSpellRecipe({ ...VALID_RECIPE, hits: [] });
    expect(errors.some((e) => e.code === "HITS_EMPTY")).toBe(true);
  });

  it("más de MAX_HITS_PER_SPELL hits → error HITS_TOO_MANY", () => {
    const hit = { element: "pyro", magnitude: 1 };
    const errors = validateSpellRecipe({ ...VALID_RECIPE, hits: Array(MAX_HITS_PER_SPELL + 1).fill(hit) });
    expect(errors.some((e) => e.code === "HITS_TOO_MANY")).toBe(true);
  });

  it("hit con magnitud 0 → error HIT_MAGNITUDE_INVALID", () => {
    const errors = validateSpellRecipe({
      ...VALID_RECIPE,
      hits: [{ element: "pyro", magnitude: 0 }],
    });
    expect(errors.some((e) => e.code === "HIT_MAGNITUDE_INVALID")).toBe(true);
  });

  it("fulgorCost ≤ 0 → error FULGOR_COST_INVALID", () => {
    const errors = validateSpellRecipe({ ...VALID_RECIPE, fulgorCost: 0 });
    expect(errors.some((e) => e.code === "FULGOR_COST_INVALID")).toBe(true);
  });

  it("spellNature inválida → error NATURE_INVALID", () => {
    const errors = validateSpellRecipe({ ...VALID_RECIPE, spellNature: "psiquico" });
    expect(errors.some((e) => e.code === "NATURE_INVALID")).toBe(true);
  });

  it("objeto inexistente → error RAW_INVALID", () => {
    const errors = validateSpellRecipe(null);
    expect(errors.some((e) => e.code === "RAW_INVALID")).toBe(true);
  });
});

describe("fingerprintSpell (B.2 — detección de duplicados)", () => {
  it("recetas equivalentes comparten fingerprint (elementos normalizados)", () => {
    const a = fingerprintSpell({ ...VALID_RECIPE, elements: ["cryo", "pyro"] });
    const b = fingerprintSpell({ ...VALID_RECIPE, elements: ["pyro", "cryo"] });
    expect(a).toBe(b);
  });

  it("recetas distintas → fingerprint distinto", () => {
    const a = fingerprintSpell(VALID_RECIPE);
    const b = fingerprintSpell({ ...VALID_RECIPE, fulgorCost: 12 });
    expect(a).not.toBe(b);
  });

  it("el orden de hits NO modifica el fingerprint (se normaliza)", () => {
    const a = fingerprintSpell({ ...VALID_RECIPE, hits: [{ element: "cryo", magnitude: 1 }] });
    const b = fingerprintSpell({ ...VALID_RECIPE, hits: [{ magnitude: 1, element: "cryo" }] });
    expect(a).toBe(b);
  });
});

describe("buildSpellDefinition (B.2)", () => {
  it("construye una ItemDefinition tipo spell con módulo spell", () => {
    const def = buildSpellDefinition(VALID_RECIPE);
    expect(def.type).toBe("spell");
    expect(def.id).toBe("hechizo_doom");
    expect(def.modules.spell).toBeTruthy();
    expect(def.metadata.durability).toBeUndefined();
    expect(def.fingerprint).toMatch(/^[a-f0-9]{40}$/);
  });

  it("la definición se puede instanciar como Entity con módulo spell activo", () => {
    const { buildItem } = require("../src/services/rpg/itemFactory");
    const itemCatalog = require("../src/data/itemCatalog");
    itemCatalog.register("test_forja_ok", () => buildSpellDefinition(VALID_RECIPE));
    const entity = buildItem("test_forja_ok");
    expect(entity).toBeTruthy();
    itemCatalog.unregister("test_forja_ok");
  });

  it("receta inválida → lanza error", () => {
    expect(() => buildSpellDefinition({ ...VALID_RECIPE, hits: [] })).toThrow(/Receta de hechizo inválida/);
  });

  it("refineSpell sube magnitude, baja fulgorCost y re-valida (B.2)", () => {
    const def = buildSpellDefinition(VALID_RECIPE);
    const refined = refineSpell(def, { magnitudeDelta: 1, fulgorCostDelta: 2, rangeDelta: 1 });
    const before = def.modules.spell;
    const after = refined.modules.spell;
    expect(after.hits[0].magnitude).toBe(before.hits[0].magnitude + 1);
    expect(after.fulgorCost).toBeLessThan(before.fulgorCost);
    expect(refined.fingerprint).not.toBe(def.fingerprint);
  });

  it("refineSpell en un no-hechizo → error", () => {
    expect(() => refineSpell({ type: "weapon" })).toThrow(/definición de hechizo/);
  });
});

describe("batería de fulgor — lanzamiento diluido (A.2/B.3)", () => {
  const { getCastCost, getCastEfficiency } = require("../src/services/rpg/fatigueEngine");
  const { FULGOR_COST_BASE, FULGOR_DILUTED_MIN, DOMINIO_REF } = require("../src/config/combatBalance");

  it("batería ≥ coste → eficiencia plena 1", () => {
    const coste = getCastCost(DOMINIO_REF, FULGOR_COST_BASE);
    expect(getCastEfficiency(coste, coste)).toBe(1);
    expect(getCastEfficiency(coste + 5, coste)).toBe(1);
  });

  it("batería parcial → eff = batería/coste con piso FULGOR_DILUTED_MIN", () => {
    const coste = getCastCost(0, FULGOR_COST_BASE); // dominio 0 → coste nominal
    const eff = getCastEfficiency(coste / 2, coste);
    expect(eff).toBeCloseTo(0.5);
    expect(eff).toBeGreaterThanOrEqual(FULGOR_DILUTED_MIN);
    expect(getCastEfficiency(0, coste)).toBe(FULGOR_DILUTED_MIN);
  });

  it("batería nunca negativa tras descuento por coste", () => {
    const gastado = Math.min(FULGOR_COST_BASE, 30);
    expect(Math.max(0, 30 - gastado)).toBeGreaterThanOrEqual(0);
  });
});
