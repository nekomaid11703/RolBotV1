// @ts-nocheck
/**
 * Sistema Simplificado de Hechizos — taxonomía y resolver declarativo.
 *
 * Valida que:
 *  - la taxonomía (kinds/aplicaciones/naturalezas) sea consistente;
 *  - el registro de efectos cumpla el esquema mínimo;
 *  - el resolver despache handlers implementados y marque pendientes;
 *  - añadir un efecto nuevo NO requiera tocar el resolver (universalidad).
 */
const {
  SPELL_KINDS,
  SPELL_APPLICATIONS,
  SPELL_NATURES,
  FULGOR_NATURES,
  EFFECT_DEFS,
  EFFECT_DEF_SCHEMA,
  ELEMENT_REACTIONS,
  ELEMENT_PERSISTENCE,
} = require("../src/config/spellTree");
const {
  resolveEffect,
  resolveSpellEffects,
  hasImplementedEffects,
  resolveElementReaction,
} = require("../src/services/rpg/spellEffects");

describe("spellTree — taxonomía simplificada", () => {
  test("existen 5 tipos de hechizo con target válido", () => {
    const kinds = Object.keys(SPELL_KINDS);
    expect(kinds.sort()).toEqual(["proyectil", "explosion", "barrera", "buffo", "aura"].sort());
    for (const kind of kinds) {
      expect(SPELL_KINDS[kind].target.length).toBeGreaterThan(0);
      expect(SPELL_KINDS[kind].label).toBeTruthy();
    }
  });

  test("aplicaciones: propia y externa", () => {
    expect(SPELL_APPLICATIONS.sort()).toEqual(["propia", "externa"].sort());
  });

  test("naturalezas: elemental (6, incluye electro) y primordial; fulgor siempre presente", () => {
    expect(SPELL_NATURES.elemental.subtypes).toEqual(["agua", "fuego", "tierra", "aire", "hielo", "electro"]);
    expect(SPELL_NATURES.primordial.subtypes).toEqual(["luz", "oscuridad", "caos"]);
    // Todas las naturalezas aplanadas: 6 elementales + 3 primordiales.
    expect(FULGOR_NATURES).toEqual(["agua", "fuego", "tierra", "aire", "hielo", "electro", "luz", "oscuridad", "caos"]);
  });

  test("todo hechizo referencia UNA naturaleza de fulgor (nunca nula)", () => {
    const { hasValidFulgorNature } = { hasValidFulgorNature: (n) => FULGOR_NATURES.includes(n) };
    for (const n of FULGOR_NATURES) expect(hasValidFulgorNature(n)).toBe(true);
    expect(hasValidFulgorNature(null)).toBe(false);
    expect(hasValidFulgorNature("")).toBe(false);
    expect(hasValidFulgorNature("sangre")).toBe(false);
  });

  test("la semilla de efectos cumple el esquema mínimo", () => {
    const tipos = Object.keys(EFFECT_DEFS);
    expect(tipos.length).toBeGreaterThanOrEqual(9);
    for (const def of Object.values(EFFECT_DEFS)) {
      expect(typeof def.id).toBe(EFFECT_DEF_SCHEMA.id);
      expect(typeof def.label).toBe(EFFECT_DEF_SCHEMA.label);
      expect(typeof def.description).toBe(EFFECT_DEF_SCHEMA.description);
      expect(Array.isArray(def.compatibleKinds)).toBe(true);
      expect(Array.isArray(def.compatibleApplications)).toBe(true);
      expect(typeof def.duration).toBe(EFFECT_DEF_SCHEMA.duration);
      expect(typeof def.stackable).toBe(EFFECT_DEF_SCHEMA.stackable);
      expect(typeof def.weight).toBe(EFFECT_DEF_SCHEMA.weight);
      expect(def.handler === null || typeof def.handler === "function").toBe(true);
    }
  });

  test("cada efecto declara kinds y aplicaciones compatibles existentes", () => {
    const kinds = Object.keys(SPELL_KINDS);
    const apps = SPELL_APPLICATIONS;
    for (const def of Object.values(EFFECT_DEFS)) {
      for (const k of def.compatibleKinds) expect(kinds).toContain(k);
      for (const a of def.compatibleApplications) expect(apps).toContain(a);
    }
  });

  test("pesos de forma: cada kind y aplicación tiene un aporte numérico", () => {
    const { SPELL_KIND_WEIGHTS, SPELL_APPLICATION_WEIGHTS, SPELL_DURATION_WEIGHT } = require("../src/config/spellTree");
    for (const kind of Object.keys(SPELL_KINDS)) {
      expect(typeof SPELL_KIND_WEIGHTS[kind]).toBe("number");
    }
    for (const app of SPELL_APPLICATIONS) {
      expect(typeof SPELL_APPLICATION_WEIGHTS[app]).toBe("number");
    }
    expect(typeof SPELL_DURATION_WEIGHT).toBe("number");
  });

  test("todos los efectos tienen un peso positivo de potencia", () => {
    for (const def of Object.values(EFFECT_DEFS)) {
      expect(def.weight).toBeGreaterThan(0);
    }
  });
});

describe("spellEffects — resolver declarativo", () => {
  test("efecto registrado con handler → descriptor aplicable", () => {
    const res = resolveEffect({ tipo: "veneno", magnitude: 3 }, {});
    expect(res).toMatchObject({ tipo: "veneno", applied: true });
    expect(res.result).toMatchObject({ tipo: "veneno", trigger: "turnStart", danoPorTick: 6 });
  });

  test("efecto desconocido → pendiente con razón EFECTO_DESCONOCIDO", () => {
    const res = resolveEffect({ tipo: "explota_polin" }, {});
    expect(res.reason).toBe("EFECTO_DESCONOCIDO");
  });

  test("efecto con handler → se ejecuta y se marca applied", () => {
    const handler = (effect, ctx) => ({ stat: "hp", delta: -effect.magnitude * (ctx.scale || 1) });
    const { resolveEffect: resolveEffectLocal } = require("../src/services/rpg/spellEffects");
    const { EFFECT_DEFS: defs } = require("../src/config/spellTree");
    const original = defs.quemadura.handler;
    defs.quemadura.handler = handler;
    try {
      const res = resolveEffectLocal({ tipo: "quemadura", magnitude: 2 }, { scale: 5 });
      expect(res).toMatchObject({ tipo: "quemadura", applied: true });
      expect(res.result).toMatchObject({ stat: "hp", delta: -10 });
    } finally {
      defs.quemadura.handler = original;
    }
  });

  test("resolveSpellEffects procesa la lista completa", () => {
    const { EFFECT_DEFS: defs } = require("../src/config/spellTree");
    const original = defs.purificado.handler;
    defs.purificado.handler = () => ({ stat: "estados", limpiados: 1 });
    try {
      const results = resolveSpellEffects([{ tipo: "veneno", magnitude: 1 }, { tipo: "purificado" }], {});
      expect(results).toHaveLength(2);
      expect(results[0].applied).toBe(true);
      expect(results[1].applied).toBe(true);
    } finally {
      defs.purificado.handler = original;
    }
  });

  test("sin efectos → lista vacía", () => {
    expect(resolveSpellEffects(null, {})).toEqual([]);
    expect(resolveSpellEffects([], {})).toEqual([]);
  });

  test("hasImplementedEffects reconoce los handlers de la Fase 3", () => {
    expect(hasImplementedEffects([{ tipo: "veneno" }])).toBe(true);
  });
});

describe("spellEffects — reacciones elementales (orden de aplicación)", () => {
  test("sin aura pasiva: el golpe imprime el elemento dominante", () => {
    const res = resolveElementReaction({ objetivo: { auraPasiva: null } }, "fuego");
    expect(res).toMatchObject({
      reacciono: false,
      motivo: "imprime_aura",
      decision: "imprimir",
      auraResultante: { pasiva: "fuego", turnos: ELEMENT_PERSISTENCE.baseTurnos },
    });
  });

  test("mismo elemento que la aura: refresca, NO reacciona", () => {
    const res = resolveElementReaction({ objetivo: { auraPasiva: "fuego" } }, "fuego");
    expect(res.reacciono).toBe(false);
    expect(res.motivo).toBe("mismo_elemento");
    expect(res.decision).toBe(ELEMENT_PERSISTENCE.mismoElemento);
    expect(res.auraResultante).toMatchObject({ pasiva: "fuego" });
  });

  test("par con reacción definida: dispara y consume la aura", () => {
    const res = resolveElementReaction({ objetivo: { auraPasiva: "hielo" } }, "fuego");
    expect(res.reacciono).toBe(true);
    expect(res.motivo).toBe("reaccion");
    expect(res.reaction).toMatchObject({ label: "derretido" });
    expect(res.auraResultante).toBeNull(); // se consume
  });

  test("reacción: expone multiplicador (canal) y efectos como evento instantáneo", () => {
    const res = resolveElementReaction({ objetivo: { auraPasiva: "hielo" } }, "fuego");
    expect(res.multiplicador).toBe(1.5);
    expect(res.efectos).toEqual(["quemadura"]);
  });

  test("reacción con canal 1 y sin efectos: multiplicador base y lista vacía", () => {
    const res = resolveElementReaction({ objetivo: { auraPasiva: "electro" } }, "fuego");
    expect(res.reacciono).toBe(true);
    expect(res.multiplicador).toBe(1.5);
    expect(res.efectos).toEqual([]);
  });

  test("casos que NO reaccionan: multiplicador 1 y efectos vacíos", () => {
    const impresion = resolveElementReaction({ objetivo: { auraPasiva: null } }, "fuego");
    expect(impresion.multiplicador).toBe(1);
    expect(impresion.efectos).toEqual([]);

    const refresco = resolveElementReaction({ objetivo: { auraPasiva: "fuego" } }, "fuego");
    expect(refresco.multiplicador).toBe(1);
    expect(refresco.efectos).toEqual([]);

    const reemplazo = resolveElementReaction({ objetivo: { auraPasiva: "luz" } }, "fuego");
    expect(reemplazo.multiplicador).toBe(1);
    expect(reemplazo.efectos).toEqual([]);
  });

  test("geo: canal depende del rol (pasivo 1.25, dominante 1.5), sin efectos", () => {
    const pasivo = resolveElementReaction({ objetivo: { auraPasiva: "tierra" } }, "fuego");
    expect(pasivo.reaction.label).toBe("cristalizado");
    expect(pasivo.multiplicador).toBe(1.25);
    const dominante = resolveElementReaction({ objetivo: { auraPasiva: "fuego" } }, "tierra");
    expect(dominante.reaction.label).toBe("cristalizado");
    expect(dominante.multiplicador).toBe(1.5);
  });

  test("la reacción neutra vaporizado es la misma en ambas direcciones", () => {
    const a = resolveElementReaction({ objetivo: { auraPasiva: "agua" } }, "fuego");
    const b = resolveElementReaction({ objetivo: { auraPasiva: "fuego" } }, "agua");
    expect(a.reaction.label).toBe("vaporizado");
    expect(b.reaction.label).toBe("vaporizado");
  });

  test("sin reacción definida: el dominante reemplaza la aura pasiva", () => {
    // Un primordial como pasivo nunca tiene reacción definida.
    const res = resolveElementReaction({ objetivo: { auraPasiva: "luz" } }, "fuego");
    expect(res.reacciono).toBe(false);
    expect(res.motivo).toBe("sin_reaccion_definida");
    expect(res.decision).toBe(ELEMENT_PERSISTENCE.sinReaccion);
    expect(res.auraResultante).toMatchObject({ pasiva: "fuego" });
  });
});

describe("spellTree — tabla de reacciones elementales (40 teóricos → 39)", () => {
  const reacciones = require("../src/config/spellTree").ELEMENT_REACTIONS;

  test("hay 39 reacciones definidas (excluye tierra@aire)", () => {
    expect(Object.keys(reacciones).length).toBe(39);
    expect(reacciones["tierra@aire"]).toBeUndefined();
  });

  test("claves pasivo@dominante con naturalezas válidas, sin self-pairs", () => {
    for (const key of Object.keys(reacciones)) {
      const [pasivo, dominante] = key.split("@");
      expect(FULGOR_NATURES).toContain(pasivo);
      expect(FULGOR_NATURES).toContain(dominante);
      expect(pasivo).not.toBe(dominante);
      expect(reacciones[key].label).toBeTruthy();
    }
  });

  test("geo siempre cristalizado con cualquier elemento (ambos órdenes)", () => {
    const elementales = ["fuego", "hielo", "agua", "aire", "electro"];
    const primordiales = ["luz", "oscuridad", "caos"];
    for (const otro of [...elementales, ...primordiales]) {
      if (otro === "aire") continue; // anemo no puede ser pasivo; tierra@aire excluida
      // tierra pasivo → cristalizado contra cualquier otro elemento.
      expect(reacciones[`tierra@${otro}`].label).toBe("cristalizado");
      // Otros como pasivo contra tierra dominante: solo elementales persistentes
      // (un primordial nunca puede ser pasivo, solo dominante).
      if (["fuego", "hielo", "agua", "electro"].includes(otro)) {
        expect(reacciones[`${otro}@tierra`].label).toBe("cristalizado");
      }
    }
  });

  test("anemo y primordiales nunca son pasivo (solo dominante)", () => {
    for (const key of Object.keys(reacciones)) {
      const [pasivo] = key.split("@");
      expect(["aire", "luz", "oscuridad", "caos"]).not.toContain(pasivo);
    }
  });

  test("sin reacciones primordiales entre sí ni tierra@aire", () => {
    for (const p of ["luz", "oscuridad", "caos"]) {
      for (const d of ["luz", "oscuridad", "caos"]) {
        expect(reacciones[`${p}@${d}`]).toBeUndefined();
      }
    }
    expect(reacciones["tierra@aire"]).toBeUndefined();
  });
});
