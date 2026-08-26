// @ts-nocheck
/**
 * Contrato del árbol de forja (Fase D — rediseño sin hardcodear ejemplos).
 * Verifica que la taxonomía definida en combatBalance.js permita representar
 * cualquier hechizo/habilidad: naturaleza → rol → activación/momento → efectos.
 */
const {
  SPELL_NATURES,
  SPELL_ROLES,
  EFFECT_TYPES,
  ACTIVATIONS,
  MOMENTS,
  TARGETS,
  EFFECT_TARGETS,
  EFFECT_WEIGHTS,
  TARGET_WEIGHTS,
  CHANNEL_BY_NATURE,
  MAX_HITS_PER_SPELL,
} = require("../src/config/combatBalance");

describe("Taxonomía del árbol de forja", () => {
  test("las 4 naturalezas raíz existen y la elemental lista los 6 elementos", () => {
    expect(Object.keys(SPELL_NATURES)).toEqual(
      expect.arrayContaining(["primordial", "elemental", "material", "conceptual"]),
    );
    expect(SPELL_NATURES.elemental.subtypes).toEqual(["hydro", "pyro", "geo", "anemo", "electro", "cryo"]);
  });

  test("primordial contiene luz, oscuridad y caos", () => {
    expect(SPELL_NATURES.primordial.subtypes).toEqual(expect.arrayContaining(["luz", "oscuridad", "caos"]));
  });

  test("material lista forma, filo y peso", () => {
    expect(SPELL_NATURES.material.subtypes).toEqual(expect.arrayContaining(["forma", "filo", "peso"]));
  });

  test("conceptual lista los 5 sub-tipos", () => {
    expect(SPELL_NATURES.conceptual.subtypes).toEqual(
      expect.arrayContaining(["regeneracion", "deterioro", "modificacion", "potenciacion", "transmutacion"]),
    );
  });

  test("roles cubren los 6 ejemplos de la spec §7", () => {
    expect(Object.keys(SPELL_ROLES)).toEqual(
      expect.arrayContaining(["ataque", "imbuicion", "defensa", "curacion", "utilidad", "movimiento"]),
    );
  });

  test("todo rol define efectos, activaciones y momentos permitidos", () => {
    for (const [rol, reglas] of Object.entries(SPELL_ROLES)) {
      expect(Array.isArray(reglas.effects), `${rol}: effects es array`).toBe(true);
      expect(Array.isArray(reglas.activations), `${rol}: activations es array`).toBe(true);
      expect(Array.isArray(reglas.moments), `${rol}: moments es array`).toBe(true);
      for (const e of reglas.effects) expect(EFFECT_TYPES).toContain(e);
      for (const a of reglas.activations) expect(ACTIVATIONS).toContain(a);
      for (const m of reglas.moments) expect(MOMENTS).toContain(m);
    }
  });

  test("todo tipo de efecto define targets válidos y peso de costo", () => {
    expect(EFFECT_TYPES.length).toBeGreaterThan(0);
    for (const tipo of EFFECT_TYPES) {
      expect(EFFECT_TARGETS[tipo], `EFFECT_TARGETS.${tipo}`).toBeDefined();
      expect(EFFECT_TARGETS[tipo].length).toBeGreaterThan(0);
      for (const t of EFFECT_TARGETS[tipo]) expect(TARGETS).toContain(t);
      expect(EFFECT_WEIGHTS[tipo], `EFFECT_WEIGHTS.${tipo}`).toBeGreaterThan(0);
    }
  });

  test("pesos de destino definidos para cada target", () => {
    for (const t of TARGETS) {
      expect(TARGET_WEIGHTS[t], `TARGET_WEIGHTS.${t}`).toBeDefined();
    }
  });

  test("canal de daño por naturaleza respeta la regla de oro §5", () => {
    expect(CHANNEL_BY_NATURE.material).toBe("fisico");
    expect(CHANNEL_BY_NATURE.conceptual).toBe("magico");
    expect(CHANNEL_BY_NATURE.elemental).toBe("magico");
    expect(CHANNEL_BY_NATURE.primordial).toBe("magico");
  });

  test("los 6 ejemplos de validación son representables", () => {
    const ejemplos = [
      // Doom — ataque elemental multi-hit (activa, combate)
      {
        nature: "elemental",
        subtype: "pyro",
        role: "ataque",
        effects: ["dano"],
        activation: "activa",
        moment: "combate",
      },
      // Respiración del rayo — imbuición electro (activa, combate)
      {
        nature: "elemental",
        subtype: "electro",
        role: "imbuicion",
        effects: ["imbuicion"],
        activation: "activa",
        moment: "combate",
      },
      // Escudo mágico — defensa mana puro (activa, combate)
      {
        nature: "conceptual",
        subtype: "modificacion",
        role: "defensa",
        effects: ["escudo"],
        activation: "activa",
        moment: "combate",
      },
      // Regeneración — curación pasiva activable (toggle, turno)
      {
        nature: "conceptual",
        subtype: "regeneracion",
        role: "curacion",
        effects: ["regeneracion"],
        activation: "pasiva",
        moment: "combate",
      },
      // Transmutación — utilidad (activa, fuera de combate)
      {
        nature: "conceptual",
        subtype: "transmutacion",
        role: "utilidad",
        effects: ["transmutacion"],
        activation: "activa",
        moment: "fuera_combate",
      },
      // Teletransporte — movimiento (activa, combate)
      {
        nature: "conceptual",
        subtype: "potenciacion",
        role: "movimiento",
        effects: ["movimiento"],
        activation: "activa",
        moment: "combate",
      },
    ];

    for (const e of ejemplos) {
      const natura = SPELL_NATURES[e.nature];
      expect(natura, `naturaleza ${e.nature}`).toBeDefined();
      expect(natura.subtypes, `subtipos de ${e.nature}`).toContain(e.subtype);
      expect(natura.roles, `roles de ${e.nature}`).toContain(e.role);

      const reglas = SPELL_ROLES[e.role];
      expect(reglas, `rol ${e.role}`).toBeDefined();
      expect(reglas.moments).toContain(e.moment);
      expect(reglas.activations).toContain(e.activation);
      for (const ef of e.effects) expect(reglas.effects).toContain(ef);
    }
  });

  test("MAX_HITS_PER_SPELL sigue limitando componentes", () => {
    expect(MAX_HITS_PER_SPELL).toBeGreaterThan(0);
    expect(MAX_HITS_PER_SPELL).toBeLessThanOrEqual(10);
  });
});
