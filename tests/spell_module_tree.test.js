// @ts-nocheck
/**
 * Módulo spell (Fase D): acepta la taxonomía del árbol de forja
 * (naturaleza/rol/activación/momento/efectos) además de la retrocompat
 * con hits/elements de Fase B. El payload de onAttack transporta ambos.
 */
const SpellModule = require("../src/data/itemCategories/spell");

describe("Módulo spell — taxonomía (Fase D)", () => {
  test("construye el módulo con naturaleza, rol, activación, momento y efectos", () => {
    const mod = new SpellModule({
      naturaleza: "conceptual",
      subtype: "regeneracion",
      role: "curacion",
      activation: "pasiva",
      moment: "combate",
      effects: [{ tipo: "regeneracion", target: "propio", magnitude: 5, duration: 3 }],
      resourceCost: { tipo: "por_turno", fulgor: 3 },
      fulgorCost: 3,
    });

    expect(mod.naturaleza).toBe("conceptual");
    expect(mod.subtype).toBe("regeneracion");
    expect(mod.role).toBe("curacion");
    expect(mod.activation).toBe("pasiva");
    expect(mod.moment).toBe("combate");
    expect(mod.effects).toHaveLength(1);
    expect(mod.effects[0]).toMatchObject({ tipo: "regeneracion", target: "propio", magnitude: 5 });
    expect(mod.resourceCost).toMatchObject({ tipo: "por_turno", fulgor: 3 });
  });

  test("onAttack emite payload con la taxonomía completa", () => {
    const mod = new SpellModule({
      naturaleza: "elemental",
      subtype: "pyro",
      role: "ataque",
      activation: "activa",
      moment: "combate",
      effects: [{ tipo: "dano", target: "enemigo", element: "pyro", magnitude: 5 }],
    });

    const payload = mod.onAttack();
    expect(payload.naturaleza).toBe("elemental");
    expect(payload.subtype).toBe("pyro");
    expect(payload.role).toBe("ataque");
    expect(payload.activation).toBe("activa");
    expect(payload.moment).toBe("combate");
    expect(payload.effects).toEqual([{ tipo: "dano", target: "enemigo", element: "pyro", magnitude: 5 }]);
  });

  test("retrocompat: hits/elements siguen funcionando sin la taxonomía nueva", () => {
    const mod = new SpellModule({
      elements: ["cryo", "pyro"],
      hits: [
        { element: "cryo", magnitude: 1 },
        { element: "pyro", magnitude: 5 },
      ],
      fulgorCost: 10,
      spellNature: "mágico",
    });

    const payload = mod.onAttack();
    expect(payload.hits).toHaveLength(2);
    expect(payload.elements).toEqual(["cryo", "pyro"]);
    expect(payload.fulgorCost).toBe(10);
    expect(payload.spellNature).toBe("mágico");
  });

  test("si hay effects pero no hits, hits queda vacío y viceversa (sin crash)", () => {
    const soloEffects = new SpellModule({ effects: [{ tipo: "escudo", target: "propio", magnitude: 8 }] });
    expect(soloEffects.hits).toEqual([]);
    expect(soloEffects.effects).toHaveLength(1);

    const soloHits = new SpellModule({ hits: [{ element: "electro", magnitude: 3 }] });
    expect(soloHits.effects).toEqual([]);
    expect(soloHits.hits).toHaveLength(1);
  });
});
