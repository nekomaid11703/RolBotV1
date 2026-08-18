// @ts-nocheck
/**
 * Forja por árbol (Fase D): validación de recetas con taxonomía
 * (naturaleza/rol/activación/momento/efectos), costo fino por efecto,
 * fingerprint normalizado y build. NO hardcodea hechizos: valida contra la
 * taxonomía y solo usa los 6 ejemplos de la spec como casos de aceptación.
 */
const {
  validateSpellRecipe,
  buildSpellDefinition,
  fingerprintSpell,
  computeSpellCost,
  deriveDamageNature,
} = require("../src/services/rpg/skillForgeService");

// ————— Recetas de los 6 ejemplos (casos de aceptación, no casos de código) —————

function recetaDoom() {
  return {
    id: "teste_doom",
    name: "Doom",
    naturaleza: "elemental",
    subtype: "pyro",
    role: "ataque",
    activation: "activa",
    moment: "combate",
    effects: [
      { tipo: "dano", target: "enemigo", element: "cryo", magnitude: 1 },
      { tipo: "dano", target: "enemigo", element: "pyro", magnitude: 5 },
    ],
    cost: { castTime: 1, cooldown: 2 },
  };
}

function recetaRespiraciónRayo() {
  return {
    id: "teste_respiracion_rayo",
    name: "Respiración del rayo",
    naturaleza: "elemental",
    subtype: "electro",
    role: "imbuicion",
    activation: "activa",
    moment: "combate",
    effects: [{ tipo: "imbuicion", target: "propio", element: "electro", magnitude: 3, duration: 4 }],
    cost: { castTime: 1, cooldown: 3 },
  };
}

function recetaEscudo() {
  return {
    id: "teste_escudo",
    name: "Escudo mágico",
    naturaleza: "conceptual",
    subtype: "modificacion",
    role: "defensa",
    activation: "activa",
    moment: "combate",
    effects: [{ tipo: "escudo", target: "propio", magnitude: 4 }],
    cost: { castTime: 1, cooldown: 3 },
  };
}

function recetaRegeneracion() {
  return {
    id: "teste_regeneracion",
    name: "Regeneración",
    naturaleza: "conceptual",
    subtype: "regeneracion",
    role: "curacion",
    activation: "pasiva",
    moment: "combate",
    effects: [{ tipo: "regeneracion", target: "propio", magnitude: 5, duration: 3 }],
    cost: { tipo: "por_turno", fulgor: 3 },
  };
}

function recetaTransmutacion() {
  return {
    id: "teste_transmutacion",
    name: "Transmutación",
    naturaleza: "conceptual",
    subtype: "transmutacion",
    role: "utilidad",
    activation: "activa",
    moment: "fuera_combate",
    effects: [{ tipo: "transmutacion", target: "area", magnitude: 4 }],
    cost: { castTime: 2, cooldown: 5 },
  };
}

function recetaTeletransporte() {
  return {
    id: "teste_teletransporte",
    name: "Teletransporte",
    naturaleza: "conceptual",
    subtype: "potenciacion",
    role: "movimiento",
    activation: "activa",
    moment: "combate",
    effects: [{ tipo: "movimiento", target: "propio", magnitude: 6 }],
    cost: { tipo: "por_metro", fulgor: 1 },
  };
}

describe("validateSpellRecipe — árbol (Fase D)", () => {
  test("las 6 recetas de aceptación validan", () => {
    for (const receta of [
      recetaDoom(),
      recetaRespiraciónRayo(),
      recetaEscudo(),
      recetaRegeneracion(),
      recetaTransmutacion(),
      recetaTeletransporte(),
    ]) {
      const errors = validateSpellRecipe(receta);
      expect(errors, JSON.stringify(errors)).toEqual([]);
    }
  });

  test("rechaza naturaleza desconocida", () => {
    const errors = validateSpellRecipe({ ...recetaDoom(), naturaleza: "sangre" });
    expect(errors.map((e) => e.code)).toContain("NATURALEZA_UNKNOWN");
  });

  test("rechaza rol no permitido por la naturaleza", () => {
    const errors = validateSpellRecipe({ ...recetaDoom(), role: "defensa" });
    expect(errors.map((e) => e.code)).toContain("ROLE_FORBIDDEN_BY_NATURE");
  });

  test("rechaza efecto no permitido por el rol", () => {
    const errors = validateSpellRecipe({
      ...recetaDoom(),
      effects: [{ tipo: "escudo", target: "propio", magnitude: 5 }],
    });
    expect(errors.map((e) => e.code)).toContain("EFFECT_FORBIDDEN_BY_ROLE");
  });

  test("rechaza target no permitido por el tipo de efecto", () => {
    const errors = validateSpellRecipe({
      ...recetaDoom(),
      effects: [{ tipo: "dano", target: "propio", magnitude: 5 }],
    });
    expect(errors.map((e) => e.code)).toContain("EFFECT_TARGET_INVALID");
  });

  test("rechaza activación no permitida por el rol", () => {
    const errors = validateSpellRecipe({ ...recetaDoom(), activation: "pasiva" });
    expect(errors.map((e) => e.code)).toContain("ACTIVATION_FORBIDDEN_BY_ROLE");
  });

  test("rechaza momento fuera de combate en rol ataque", () => {
    const errors = validateSpellRecipe({ ...recetaDoom(), moment: "fuera_combate" });
    expect(errors.map((e) => e.code)).toContain("MOMENT_FORBIDDEN_BY_ROLE");
  });

  test("rechaza subtype no perteneciente a la naturaleza", () => {
    const errors = validateSpellRecipe({ ...recetaDoom(), subtype: "luz" });
    expect(errors.map((e) => e.code)).toContain("SUBTYPE_UNKNOWN");
  });

  test("rechaza efecto sin magnitude", () => {
    const errors = validateSpellRecipe({
      ...recetaDoom(),
      effects: [{ tipo: "dano", target: "enemigo", element: "pyro" }],
    });
    expect(errors.map((e) => e.code)).toContain("EFFECT_MAGNITUDE_INVALID");
  });

  test("rechaza elemento desconocido en un efecto", () => {
    const errors = validateSpellRecipe({
      ...recetaDoom(),
      effects: [{ tipo: "dano", target: "enemigo", element: "sangre", magnitude: 3 }],
    });
    expect(errors.map((e) => e.code)).toContain("EFFECT_ELEMENT_UNKNOWN");
  });
});

describe("buildSpellDefinition — árbol (Fase D)", () => {
  test("construye una definición con la taxonomía en el módulo", () => {
    const def = buildSpellDefinition(recetaDoom());
    const spell = def.modules.spell;
    expect(spell.naturaleza).toBe("elemental");
    expect(spell.subtype).toBe("pyro");
    expect(spell.role).toBe("ataque");
    expect(spell.activation).toBe("activa");
    expect(spell.moment).toBe("combate");
    expect(spell.effects).toHaveLength(2);
    expect(spell.channel).toBe("magico");
    expect(spell.damageNature).toBe("mágico");
  });

  test("los efectos se traducen a hits por retrocompat con el motor", () => {
    const def = buildSpellDefinition(recetaDoom());
    const spell = def.modules.spell;
    expect(spell.hits).toHaveLength(2);
    expect(spell.hits[1]).toMatchObject({ element: "pyro", magnitude: 5 });
  });

  test("tier/rarity se derivan, no entran manualmente", () => {
    const def = buildSpellDefinition(recetaDoom());
    expect(def.tier).toBeDefined();
    expect(def.metadata.tier).toBe(def.tier);
    expect(def.rarity).toBe(rarityDe(def.tier));
    expect(def.material).toBe("etereo");
  });

  test("fulgorCost se deriva del costo fino cuando la receta no lo fija", () => {
    const def = buildSpellDefinition(recetaEscudo());
    expect(def.modules.spell.fulgorCost).toBeGreaterThan(0);
  });
});

function rarityDe(tier) {
  return { E: "comun", D: "poco_comun", C: "raro", B: "epico", A: "legendario", S: "mitico" }[tier];
}

describe("computeSpellCost — por efecto (Fase D)", () => {
  test("costo fino crece con la complejidad de los efectos", () => {
    const defSimple = buildSpellDefinition(recetaEscudo());
    const defComplejo = buildSpellDefinition(recetaDoom());
    expect(computeSpellCost(defComplejo).costoFino).toBeGreaterThan(computeSpellCost(defSimple).costoFino);
  });

  test("devuelve tier, rarity, dominioReq y fulgorCost derivados", () => {
    const costo = computeSpellCost(buildSpellDefinition(recetaTeletransporte()));
    expect(["E", "D", "C", "B", "A", "S"]).toContain(costo.tier);
    expect(costo.rarity).toBeDefined();
    expect(costo.dominioReq).toBeGreaterThanOrEqual(0);
    expect(costo.fulgorCost).toBeGreaterThan(0);
    expect(costo.costoFino).toBeGreaterThan(0);
  });
});

describe("deriveDamageNature — canal de daño (§5)", () => {
  test("naturaleza material → canal físico", () => {
    const r = { ...recetaDoom(), naturaleza: "material", subtype: "forma" };
    expect(deriveDamageNature(r).channel).toBe("fisico");
  });

  test("naturaleza elemental → canal mágico", () => {
    expect(deriveDamageNature(recetaDoom()).channel).toBe("magico");
  });

  test("naturaleza conceptual → canal mágico", () => {
    const r = { ...recetaDoom(), naturaleza: "conceptual", subtype: "transmutacion" };
    expect(deriveDamageNature(r).channel).toBe("magico");
  });
});

describe("fingerprintSpell — normalizado (Fase D)", () => {
  test("dos recetas iguales con el mismo fingerprint colisionan", () => {
    expect(fingerprintSpell(recetaDoom())).toBe(fingerprintSpell(recetaDoom()));
  });

  test("cambiar un efecto cambia el fingerprint", () => {
    const otra = recetaDoom();
    otra.effects[1].magnitude = 6;
    expect(fingerprintSpell(recetaDoom())).not.toBe(fingerprintSpell(otra));
  });

  test("incluye la taxonomía en la normalización", () => {
    const a = fingerprintSpell(recetaEscudo());
    const b = fingerprintSpell({ ...recetaEscudo(), role: "ataque" });
    expect(a).not.toBe(b);
  });
});

describe("equipmentResolverService — deriva weaponInfo del módulo spell (Fase D)", () => {
  const { buildDummyEquipment } = require("../src/services/rpg/dummyEquipment");
  const { resolveAttackerWeapon } = require("../src/services/rpg/equipmentResolverService");

  async function weaponDeReceta(receta) {
    const itemCatalog = require("../src/data/itemCatalog");
    const id = receta.id;
    itemCatalog.register(id, () => buildSpellDefinition(receta));
    try {
      const char = { dummyEquipment: buildDummyEquipment([{ slot: "mano_der", itemId: id }]) };
      return await resolveAttackerWeapon(char);
    } finally {
      itemCatalog.unregister(id);
    }
  }

  test("un hechizo de ataque elemental resuelve como weaponInfo mágico", async () => {
    const weapon = await weaponDeReceta({ ...recetaDoom(), id: "teste_weapon" });
    expect(weapon).not.toBeNull();
    expect(weapon.damageNature).toBe("mágico");
    expect(weapon.spellNature).toBe("mágico");
  });

  test("un hechizo material resuelve como weaponInfo físico", async () => {
    const weapon = await weaponDeReceta({
      ...recetaDoom(),
      id: "teste_weapon_material",
      naturaleza: "material",
      subtype: "forma",
      effects: [{ tipo: "dano", target: "enemigo", magnitude: 5 }],
    });
    expect(weapon).not.toBeNull();
    expect(weapon.damageNature).toBe("perforante");
    expect(weapon.spellNature).toBe("mágico");
  });
});
