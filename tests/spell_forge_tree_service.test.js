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
  FULGOR_POOL_MAX,
  SPELL_TIER_RULES,
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
    cost: { tipo: "por_uso", fulgor: 1 },
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

describe("Sistema Simplificado — receta sin efectos y costo por ejes", () => {
  const recetaSimplificadaSinEfectos = () => ({
    id: "teste_golpe_fulgor",
    name: "Golpe de fulgor",
    kind: "proyectil",
    application: "externa",
    nature: "fuego",
    effects: [],
    castTime: 1,
    cooldown: 0,
    range: 5,
    basePrice: 200,
  });
  const recetaSimplificadaConEfectos = () => ({
    id: "teste_bola_fuego",
    name: "Bola de fuego",
    kind: "proyectil",
    application: "externa",
    nature: "fuego",
    effects: [{ tipo: "quemadura", magnitude: 2, duration: 3 }],
    castTime: 1,
    cooldown: 0,
    range: 5,
    basePrice: 500,
  });

  test("una receta simplificada SIN efectos valida y construye", () => {
    expect(validateSpellRecipe(recetaSimplificadaSinEfectos())).toEqual([]);
    const def = buildSpellDefinition(recetaSimplificadaSinEfectos());
    expect(def.modules.spell.effects).toEqual([]);
  });

  test("el golpe de fulgor sin efectos conserva su hit de naturaleza (daño base)", () => {
    const def = buildSpellDefinition(recetaSimplificadaSinEfectos());
    expect(def.modules.spell.hits).toEqual([{ element: "fuego", magnitude: 1 }]);
  });

  test("efectos pesan: con efectos el costo fino es mayor que sin efectos", () => {
    const sinFx = buildSpellDefinition(recetaSimplificadaSinEfectos());
    const conFx = buildSpellDefinition(recetaSimplificadaConEfectos());
    expect(computeSpellCost(conFx).costoFino).toBeGreaterThan(computeSpellCost(sinFx).costoFino);
  });

  test("la potencia respeta el peso del efecto y del kind/aplicación", () => {
    const costo = computeSpellCost(buildSpellDefinition(recetaSimplificadaConEfectos()));
    // kind proyectil 1.0 + aplicación externa 1.0 + quemadura(1.1 × mag2 × dur3)
    // ⇒ potencia > 2 (más que el golpe puro con kind+aplicación).
    expect(costo.potencia).toBeGreaterThan(2);
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

describe("Balanceo de tier y fulgor (Fase 2026-08-18)", () => {
  test("el costo final usable es estrictamente menor que la batería (100)", () => {
    const def = buildSpellDefinition(recetaDoom());
    const costo = computeSpellCost(def);
    expect(costo.fulgorPoolMax).toBe(FULGOR_POOL_MAX);
    expect(costo.fulgorCost).toBeLessThan(FULGOR_POOL_MAX);
    expect(costo.usableNaturalmente).toBe(true);
  });

  test("un hechizo de costo ≥ batería existe canónicamente pero no es usable", () => {
    const def = buildSpellDefinition({
      ...recetaDoom(),
      id: "teste_mitico",
      // Efectos extremos para empujar el costo fino ≥ 100
      effects: [
        { tipo: "dano", target: "enemigo", magnitude: 30 },
        { tipo: "dano", target: "enemigo", magnitude: 30 },
        { tipo: "dano", target: "enemigo", magnitude: 30 },
        { tipo: "dano", target: "enemigo", magnitude: 30 },
      ],
      castTime: 0, // sin descuento por castTime
    });
    const costo = computeSpellCost(def);
    expect(costo.costoFino).toBeGreaterThanOrEqual(FULGOR_POOL_MAX);
    expect(costo.fulgorCost).toBeGreaterThanOrEqual(FULGOR_POOL_MAX);
    expect(costo.usableNaturalmente).toBe(false);
    expect(costo.tier).toBe("S");
  });

  test("un golpe básico sin efectos queda en tier E sin degradar", () => {
    const def = buildSpellDefinition({
      id: "teste_golpe_basico",
      name: "Golpe básico",
      kind: "proyectil",
      application: "externa",
      nature: "fuego",
      effects: [],
      castTime: 1,
      cooldown: 0,
      range: 3,
      basePrice: 10,
    });
    const costo = computeSpellCost(def);
    expect(costo.costoFino).toBeLessThanOrEqual(10);
    expect(costo.tier).toBe("E");
    expect(costo.tierAjustadoPorReglaE).toBe(false);
    expect(costo.reglasTier).toBe(SPELL_TIER_RULES.E);
    expect(costo.reglasTier.unElemento).toBe(true);
    expect(costo.reglasTier.sinEfectos).toBe(true);
  });

  test("un diseño que caería en E pero con efectos se degrada a D", () => {
    const def = buildSpellDefinition({
      id: "teste_efecto_barato",
      name: "Golpe con quemadura mínima",
      kind: "proyectil",
      application: "externa",
      nature: "fuego",
      effects: [{ tipo: "quemadura", magnitude: 1, duration: 1 }],
      castTime: 1,
      cooldown: 0,
      range: 3,
      basePrice: 30,
    });
    const costo = computeSpellCost(def);
    expect(costo.tier).not.toBe("E");
    expect(costo.tierAjustadoPorReglaE).toBe(true);
    expect(costo.reglasTier).not.toBe(SPELL_TIER_RULES.E);
  });
});

describe("Contrato §11 — semántica de resolución por kind × application", () => {
  // Base de receta simplificada; se sobreescriben kind/application/resolution por caso.
  function receta(kind, application, extra = {}) {
    return {
      id: `teste_contrato_${kind}_${application}`,
      name: `Contracto ${kind} ${application}`,
      kind,
      application,
      nature: "fuego",
      effects: [],
      castTime: 1,
      cooldown: 0,
      range: 3,
      basePrice: 100,
      ...extra,
    };
  }

  // ── proyectil × propia ──
  test("proyectil propia: válida con imbuición de arma y sin golpe directo", () => {
    const def = buildSpellDefinition(
      receta("proyectil", "propia", { resolution: { targetMode: "arma", imbuement: "fuego" } }),
    );
    expect(def.modules.spell.resolution.targetMode).toBe("arma");
    expect(def.modules.spell.resolution.imbuement).toBe("fuego");
    expect(def.modules.spell.hits).toEqual([]); // imbuición, no proyectil
  });

  test("proyectil propia: rechaza golpe directo (hits)", () => {
    const errors = validateSpellRecipe(
      receta("proyectil", "propia", {
        resolution: { targetMode: "arma", imbuement: "fuego" },
        hits: [{ element: "fuego", magnitude: 3 }],
      }),
    );
    expect(errors.map((e) => e.code)).toContain("DIRECT_DAMAGE_FORBIDDEN");
  });

  // ── proyectil × externa ──
  test("proyectil externa: válida y conserva el golpe de fulgor", () => {
    const def = buildSpellDefinition(receta("proyectil", "externa", { resolution: { targetMode: "enemigo" } }));
    expect(def.modules.spell.hits).toEqual([{ element: "fuego", magnitude: 1 }]);
    expect(def.modules.spell.resolution.targetMode).toBe("enemigo");
  });

  test("proyectil externa: rechaza targetMode de arma", () => {
    const errors = validateSpellRecipe(receta("proyectil", "externa", { resolution: { targetMode: "arma" } }));
    expect(errors.map((e) => e.code)).toContain("TARGET_MODE_FORBIDDEN");
  });

  // ── explosion × propia ──
  test("explosion propia: válida con radio", () => {
    const def = buildSpellDefinition(receta("explosion", "propia", { resolution: { targetMode: "area", radius: 4 } }));
    expect(def.modules.spell.resolution.radius).toBe(4);
    expect(def.modules.spell.resolution.targetMode).toBe("area");
  });

  test("explosion propia: rechaza sin radio", () => {
    const errors = validateSpellRecipe(receta("explosion", "propia", { resolution: { targetMode: "area" } }));
    expect(errors.map((e) => e.code)).toContain("EXPLOSION_RADIUS_REQUIRED");
  });

  // ── explosion × externa ──
  test("explosion externa: válida con radio y centro en área", () => {
    const def = buildSpellDefinition(
      receta("explosion", "externa", {
        resolution: { targetMode: "area", radius: 5 },
        effects: [{ tipo: "quemadura", magnitude: 2, duration: 3 }],
      }),
    );
    expect(def.modules.spell.resolution.radius).toBe(5);
    expect(def.modules.spell.hits).toEqual([{ element: "fuego", magnitude: 1 }]);
  });

  test("explosion externa: rechaza targetMode no de área", () => {
    const errors = validateSpellRecipe(
      receta("explosion", "externa", { resolution: { targetMode: "enemigo", radius: 3 } }),
    );
    expect(errors.map((e) => e.code)).toContain("TARGET_MODE_FORBIDDEN");
  });

  // ── barrera × propia ──
  test("barrera propia: válida con HP de protección", () => {
    const def = buildSpellDefinition(
      receta("barrera", "propia", { resolution: { targetMode: "propio", barrierHp: 30 } }),
    );
    expect(def.modules.spell.resolution.barrierHp).toBe(30);
    expect(def.modules.spell.hits).toEqual([]); // no daño directo
  });

  test("barrera propia: rechaza sin barrierHp", () => {
    const errors = validateSpellRecipe(receta("barrera", "propia", { resolution: { targetMode: "propio" } }));
    expect(errors.map((e) => e.code)).toContain("BARRER_HP_REQUIRED");
  });

  // ── barrera × externa ──
  test("barrera externa: válida con durabilidad de prisión", () => {
    const def = buildSpellDefinition(
      receta("barrera", "externa", { resolution: { targetMode: "enemigo", barrierHp: 40 } }),
    );
    expect(def.modules.spell.resolution.barrierHp).toBe(40);
    expect(def.modules.spell.hits).toEqual([]);
  });

  test("barrera externa: rechaza golpe directo (hits)", () => {
    const errors = validateSpellRecipe(
      receta("barrera", "externa", {
        resolution: { targetMode: "enemigo", barrierHp: 40 },
        hits: [{ element: "tierra", magnitude: 2 }],
      }),
    );
    expect(errors.map((e) => e.code)).toContain("DIRECT_DAMAGE_FORBIDDEN");
  });

  // ── aura × propia ──
  test("aura propia: válida con elemento y duración", () => {
    const def = buildSpellDefinition(
      receta("aura", "propia", {
        resolution: { targetMode: "propio", imbuement: "fuego", duration: 3 },
      }),
    );
    expect(def.modules.spell.resolution.imbuement).toBe("fuego");
    expect(def.modules.spell.resolution.duration).toBe(3);
    expect(def.modules.spell.hits).toEqual([]);
  });

  test("aura propia: rechaza sin duración", () => {
    const errors = validateSpellRecipe(
      receta("aura", "propia", { resolution: { targetMode: "propio", imbuement: "fuego" } }),
    );
    expect(errors.map((e) => e.code)).toContain("RESOLUTION_DURATION_REQUIRED");
  });

  // ── aura × externa ──
  test("aura externa: válida imbuyendo objeto externo", () => {
    const def = buildSpellDefinition(
      receta("aura", "externa", {
        resolution: { targetMode: "aliado", imbuement: "hielo", duration: 4 },
      }),
    );
    expect(def.modules.spell.resolution.targetMode).toBe("aliado");
  });

  test("aura externa: rechaza golpe directo (hits)", () => {
    const errors = validateSpellRecipe(
      receta("aura", "externa", {
        resolution: { targetMode: "aliado", imbuement: "hielo", duration: 4 },
        hits: [{ element: "hielo", magnitude: 2 }],
      }),
    );
    expect(errors.map((e) => e.code)).toContain("DIRECT_DAMAGE_FORBIDDEN");
  });

  // ── buffo × propia ──
  test("buffo propia: válida con al menos una statMod", () => {
    const def = buildSpellDefinition(
      receta("buffo", "propia", {
        resolution: { targetMode: "propio", statMods: [{ stat: "atk", delta: 5 }], duration: 2 },
      }),
    );
    expect(def.modules.spell.resolution.statMods).toEqual([{ stat: "atk", delta: 5 }]);
    expect(def.modules.spell.hits).toEqual([]);
  });

  test("buffo propia: rechaza sin statMods", () => {
    const errors = validateSpellRecipe(
      receta("buffo", "propia", { resolution: { targetMode: "propio", duration: 2 } }),
    );
    expect(errors.map((e) => e.code)).toContain("BUFFO_STAT_MODS_REQUIRED");
  });

  test("buffo propia: rechaza stat inválida", () => {
    const errors = validateSpellRecipe(
      receta("buffo", "propia", {
        resolution: { targetMode: "propio", statMods: [{ stat: "suerte", delta: 5 }], duration: 2 },
      }),
    );
    expect(errors.map((e) => e.code)).toContain("STAT_MOD_INVALID");
  });

  // ── buffo × externa ──
  test("buffo externa: válida modificando stats del objetivo", () => {
    const def = buildSpellDefinition(
      receta("buffo", "externa", {
        resolution: { targetMode: "enemigo", statMods: [{ stat: "def", delta: -3 }], duration: 2 },
      }),
    );
    expect(def.modules.spell.resolution.targetMode).toBe("enemigo");
    expect(def.modules.spell.resolution.statMods[0]).toEqual({ stat: "def", delta: -3 });
  });

  test("buffo externa: rechaza delta 0", () => {
    const errors = validateSpellRecipe(
      receta("buffo", "externa", {
        resolution: { targetMode: "enemigo", statMods: [{ stat: "def", delta: 0 }], duration: 2 },
      }),
    );
    expect(errors.map((e) => e.code)).toContain("STAT_MOD_DELTA_INVALID");
  });

  // ── Payload de resolución para las cinco resoluciones ──
  test("payload completo persistido: proyectil, explosion, barrera, aura, buffo", () => {
    const casos = [
      receta("proyectil", "externa", { resolution: { targetMode: "enemigo" } }),
      receta("explosion", "externa", { resolution: { targetMode: "area", radius: 4 } }),
      receta("barrera", "externa", { resolution: { targetMode: "enemigo", barrierHp: 25 } }),
      receta("aura", "externa", { resolution: { targetMode: "aliado", imbuement: "luz", duration: 5 } }),
      receta("buffo", "propia", {
        resolution: { targetMode: "propio", statMods: [{ stat: "d_fulgor", delta: 4 }], duration: 3 },
      }),
    ];
    for (const recipe of casos) {
      const def = buildSpellDefinition(recipe);
      expect(def.modules.spell.resolution).toBeTruthy();
      expect(typeof def.modules.spell.resolution.targetMode).toBe("string");
    }
  });

  test("el fingerprint incluye la resolución (difiere solo por radius)", () => {
    const a = fingerprintSpell({ ...receta("explosion", "externa"), resolution: { targetMode: "area", radius: 4 } });
    const b = fingerprintSpell({ ...receta("explosion", "externa"), resolution: { targetMode: "area", radius: 6 } });
    expect(a).not.toBe(b);
  });

  test("targetMode por defecto se deriva si la receta no lo declara", () => {
    const def = buildSpellDefinition(receta("aura", "propia", { resolution: { imbuement: "fuego", duration: 3 } }));
    expect(def.modules.spell.resolution.targetMode).toBe("propio");
  });
});
