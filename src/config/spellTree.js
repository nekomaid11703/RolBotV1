// @ts-nocheck
const {
  DOMINIO_REF,
  MAGIC_DEFENSE_SCALE,
  QUEMADURA_DOT_BASE,
  QUEMADURA_DURACION_BASE,
  QUEMADURA_DURACION_ESCALA,
  STATUS_DURATION_BASE,
  VENENO_DOT_BASE,
  DECADENCIA_DOT_BASE,
  MALDICION_DAMAGE_MULTIPLIER,
  ROMPE_ARMADURAS_DEF_REDUCTION,
  CHOQUE_TERMICO_DAMAGE_BASE,
} = require("./combatBalance");

/**
 * Spell Tree — Sistema Simplificado de Hechizos/Habilidades.
 *
 * Reemplaza la taxonomía de forja Fase D (naturaleza → rol → activación → momento
 * → efectos) por 4 ejes fijos y pequeños más un registro extensible de efectos:
 *
 *   tipo de hechizo → tipo de aplicación → naturaleza de fulgor → efectos[]
 *
 * El objetivo es que cualquier habilidad se construya combinando DATOS (no código):
 * añadir un hechizo nuevo = añadir una entrada de datos; añadir un efecto nuevo =
 * añadir una entrada al registro EFFECT_DEFS (+ su handler en fases futuras).
 * Este módulo es la fuente única de la taxonomía; `combatBalance.js` lo re-exporta
 * para retrocompat con los consumidores actuales.
 */

// ══════════════════════════════════════════
// 1. TIPO DE HECHIZO (forma de resolución)
// ══════════════════════════════════════════

/**
 * Tipos de hechizo y los targets que cada uno puede alcanzar.
 * @type {Record<string, {label: string, target: string[]}>}
 */
const SPELL_KINDS = {
  proyectil: { label: "Proyectil/Arma", target: ["enemigo", "area"] },
  explosion: { label: "Explosión", target: ["area"] },
  barrera: { label: "Barrera", target: ["propio", "area"] },
  buffo: { label: "Buffo", target: ["propio", "enemigo", "aliado"] },
  aura: { label: "Aura", target: ["propio", "aliado"] },
};

// ══════════════════════════════════════════
// 2. TIPO DE APLICACIÓN
// ══════════════════════════════════════════

/**
 * Aplicación del hechizo: propia (quien casteó) o externa (objetivo externo).
 * @type {string[]}
 */
const SPELL_APPLICATIONS = ["propia", "externa"];

// ══════════════════════════════════════════
// 3. NATURALEZA DE FULGOR
// ══════════════════════════════════════════

/**
 * Naturalezas de fulgor con sus sub-tipos.
 * TODO hechizo tiene SIEMPRE una naturaleza de fulgor (nunca nula):
 * elemental (incluye electro) o primordial.
 * @type {Record<string, {label: string, subtypes: string[]}>}
 */
const SPELL_NATURES = {
  elemental: { label: "Elemental", subtypes: ["agua", "fuego", "tierra", "aire", "hielo", "electro"] },
  primordial: { label: "Primordial", subtypes: ["luz", "oscuridad", "caos"] },
};

/**
 * Todas las naturalezas de fulgor aplanadas (9: 6 elementales + 3 primordiales).
 * Un hechizo siempre referencia UNA de estas como su elemento/aplicación de fulgor.
 * @type {string[]}
 */
const FULGOR_NATURES = [...SPELL_NATURES.elemental.subtypes, ...SPELL_NATURES.primordial.subtypes];

// ══════════════════════════════════════════
// 3b. PESOS DE FORMA (costo fino — eje potencia)
// ══════════════════════════════════════════

/**
 * Aporte de potencia bruta por tipo de hechizo (forma de resolución).
 * Un explosion/barrera "imprime más información" en el mundo que un proyectil
 * directo; un buffo/aura aplica sobre objetivos múltiples o sostenidos.
 * @type {Record<string, number>}
 */
const SPELL_KIND_WEIGHTS = {
  proyectil: 1.0,
  explosion: 1.5,
  barrera: 1.5,
  buffo: 1.0,
  aura: 1.2,
};

/**
 * Aporte de potencia por tipo de aplicación: apuntar a un objetivo externo
 * exige más control que afectar al propio lanzador.
 * @type {Record<string, number>}
 */
const SPELL_APPLICATION_WEIGHTS = {
  propia: 0,
  externa: 1,
};

/**
 * Bonificador de potencia por duración: un efecto que persiste turnos imprime
 * más mundo que un efecto instantáneo. Se suma a `weight × magnitude`.
 * @type {number}
 */
const SPELL_DURATION_WEIGHT = 0.15;

// ══════════════════════════════════════════
// 3c. REGLAS DE RESOLUCIÓN (Contrato §11)
// ══════════════════════════════════════════

/**
 * Reglas de resolución canónica por `kind × application` (Contrato §11).
 *
 * `kind` define la forma de resolución; `application` decide quién es el objetivo
 * (el propio lanzador o un objetivo externo). Cada entrada declara:
 *  - `targetModes`: targetMode explícitos permitidos (el motor NO infiere del nombre);
 *  - `payload`: campos de resolución requeridos (radius, barrierHp, imbuement,
 *    duration, statMods) que debe persistir el constructor;
 *  - `dañoDirecto`: si la resolución admite un golpe directo (hit) elemental;
 *  - `descripcion`: semántica canónica de la combinación.
 * @type {Record<string, Record<string, {targetModes: string[], payload: object, dañoDirecto: boolean, descripcion: string}>>}
 */
const SPELL_RESOLUTION_RULES = {
  proyectil: {
    propia: {
      targetModes: ["arma"],
      payload: { imbuement: true },
      dañoDirecto: false,
      descripcion: "Imbuye el arma equipada del lanzador (imbuición temporal, no proyectil contra sí mismo).",
    },
    externa: {
      targetModes: ["enemigo", "area"],
      payload: {},
      dañoDirecto: true,
      descripcion: "Impacto elemental sobre el objetivo; imprime o reacciona.",
    },
  },
  explosion: {
    propia: {
      targetModes: ["area"],
      payload: { radius: true },
      dañoDirecto: true,
      descripcion: "Explosión con centro en el lanzador; daño o efectos en el área.",
    },
    externa: {
      targetModes: ["area"],
      payload: { radius: true },
      dañoDirecto: true,
      descripcion: "Explosión con centro en el objetivo; daño o efectos en el área.",
    },
  },
  barrera: {
    propia: {
      targetModes: ["propio", "area"],
      payload: { barrierHp: true },
      dañoDirecto: false,
      descripcion: "Barrera defensiva: protege al lanzador o área aliada (valor de protección).",
    },
    externa: {
      targetModes: ["enemigo", "area"],
      payload: { barrierHp: true },
      dañoDirecto: false,
      descripcion:
        "Prisión rompible: confina al objetivo; bloquea avanzar/retroceder y atacar la barrera consume la acción.",
    },
  },
  aura: {
    propia: {
      targetModes: ["propio", "objeto"],
      payload: { imbuement: true, duration: true },
      dañoDirecto: false,
      descripcion: "Imbuye jugador u objeto propio de forma sostenida, sin daño instantáneo.",
    },
    externa: {
      targetModes: ["aliado", "objeto"],
      payload: { imbuement: true, duration: true },
      dañoDirecto: false,
      descripcion: "Imbuye jugador u objeto externo de forma sostenida, sin daño instantáneo.",
    },
  },
  buffo: {
    propia: {
      targetModes: ["propio"],
      payload: { statMods: true, duration: true },
      dañoDirecto: false,
      descripcion: "Cambio temporal de estadísticas del lanzador.",
    },
    externa: {
      targetModes: ["aliado", "enemigo"],
      payload: { statMods: true, duration: true },
      dañoDirecto: false,
      descripcion: "Cambio temporal de estadísticas del objetivo permitido.",
    },
  },
};

/**
 * targetMode por defecto de cada `kind × application` cuando la receta no lo
 * declara explícitamente (el constructor lo persiste de todos modos).
 * @type {Record<string, Record<string, string>>}
 */
const RESOLUTION_DEFAULT_TARGET_MODE = {
  proyectil: { propia: "arma", externa: "enemigo" },
  explosion: { propia: "area", externa: "area" },
  barrera: { propia: "propio", externa: "enemigo" },
  aura: { propia: "propio", externa: "aliado" },
  buffo: { propia: "propio", externa: "enemigo" },
};

// ══════════════════════════════════════════
// 4. REGISTRO DE EFECTOS (extensible)
// ══════════════════════════════════════════

/**
 * Esquema mínimo que debe cumplir cada entrada del registro de efectos.
 * `handler` resuelve la mecánica de los efectos implementados; puede ser null
 * mientras un efecto permanezca declarativo.
 * @constant EFFECT_DEF_SCHEMA
 */
const EFFECT_DEF_SCHEMA = {
  id: "string",
  label: "string",
  description: "string",
  compatibleKinds: "array", // SPELL_KINDS que pueden portar este efecto
  compatibleApplications: "array", // SPELL_APPLICATIONS en las que aplica
  duration: "boolean", // true si persiste turnos (veneno, enredado...)
  stackable: "boolean", // true si puede acumularse
  weight: "number", // aporte de potencia por unidad de magnitud (costo fino)
  handler: "function|nil", // implementación de la mecánica, si existe
};

/**
 * Registro de efectos (semilla — la lista es extensible).
 * Cada entrada es DATOS; la mecánica, cuando existe, vive en `handler`.
 * @type {Record<string, object>}
 */
function effectMagnitude(effect) {
  return Math.max(1, Number(effect?.magnitude) || 1);
}

function effectDuration(effect) {
  return Math.max(1, Number(effect?.duration) || STATUS_DURATION_BASE);
}

const CEGADURA_REF_REDUCTION = 3;

function timedEffect(tipo, effect, fields = {}) {
  return { tipo, turnos: effectDuration(effect), trigger: "turnStart", category: "negative", ...fields };
}

const EFFECT_DEFS = {
  veneno: {
    id: "veneno",
    label: "Veneno",
    description: "Daño por turno durante un tiempo.",
    compatibleKinds: ["proyectil", "explosion", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    weight: 1.0,
    handler: (effect) => timedEffect("veneno", effect, { danoPorTick: VENENO_DOT_BASE * effectMagnitude(effect) }),
  },
  quemadura: {
    id: "quemadura",
    label: "Quemadura",
    description: "Daño continuo de fuego que desgasta el objetivo.",
    compatibleKinds: ["proyectil", "explosion", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    weight: 1.1,
    handler: (effect, ctx = {}) => {
      const dFulgor = Number(ctx.atacante?.stats?.d_fulgor) || 0;
      const rFulgor = Number(ctx.objetivo?.stats?.r_fulgor) || 0;
      const magnitude = Number(effect?.magnitude) || 1;
      const durBase = Number(effect?.duration) || QUEMADURA_DURACION_BASE;
      const eficiencia = 1 + dFulgor / DOMINIO_REF;
      const turnos = Math.max(1, Math.floor(durBase + (dFulgor / DOMINIO_REF) * QUEMADURA_DURACION_ESCALA));
      const dotPorTurno = Math.max(1, Math.floor(QUEMADURA_DOT_BASE * magnitude * eficiencia));
      const mitigacion = MAGIC_DEFENSE_SCALE / (MAGIC_DEFENSE_SCALE + rFulgor);
      return {
        tipo: "quemadura",
        turnos,
        dotPorTurno,
        danoPorTick: Math.max(1, Math.floor(dotPorTurno * mitigacion)),
        lanzadorId: ctx.atacante?.id ?? ctx.atacante?.characterId ?? null,
      };
    },
  },
  enredado: {
    id: "enredado",
    label: "Enredado",
    description: "Impide avanzar o retroceder durante el turno.",
    compatibleKinds: ["proyectil", "explosion", "barrera", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    weight: 1.2,
    handler: (effect) => timedEffect("enredado", effect, { blockedActions: ["move"] }),
  },
  congelado: {
    id: "congelado",
    label: "Congelado",
    description: "Inmoviliza el movimiento; bloquea ataques solo si el daño supera la R_FULGOR del objetivo.",
    compatibleKinds: ["proyectil", "explosion", "barrera", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    weight: 1.4,
    handler: (effect, ctx = {}) => {
      const rFulgor = Number(ctx.objetivo?.stats?.r_fulgor) || 0;
      const danoImpacto = Number(effect?.danoBase ?? ctx.danoBase ?? 0);
      const blocksAttack = danoImpacto > rFulgor;
      const blockedActions = blocksAttack ? ["move", "attack"] : ["move"];
      return timedEffect("congelado", effect, { blockedActions, severe: blocksAttack });
    },
  },
  cegadura: {
    id: "cegadura",
    label: "Cegadura",
    description: "Deslumbra o priva de visión, reduciendo los Reflejos (REF) durante un tiempo.",
    compatibleKinds: ["proyectil", "explosion", "buffo", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    weight: 1.2,
    handler: (effect) =>
      timedEffect("cegadura", effect, {
        refReduction: CEGADURA_REF_REDUCTION * effectMagnitude(effect),
      }),
  },
  purificado: {
    id: "purificado",
    label: "Purificado",
    description: "Limpia estados negativos del objetivo.",
    compatibleKinds: ["proyectil", "explosion", "buffo", "aura"],
    compatibleApplications: ["propia", "externa"],
    duration: false,
    stackable: false,
    weight: 0.9,
    handler: () => ({ tipo: "purificado", instant: "purify", category: "positive" }),
  },
  maldito: {
    id: "maldito",
    label: "Maldito",
    description: "Debilita estadísticas o penaliza acciones del objetivo.",
    compatibleKinds: ["proyectil", "explosion", "buffo", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    weight: 1.3,
    handler: (effect) => timedEffect("maldito", effect, { damageMultiplier: MALDICION_DAMAGE_MULTIPLIER }),
  },
  rompe_armaduras: {
    id: "rompe_armaduras",
    label: "Rompe Armaduras",
    description: "Reduce la resistencia material o DEF del objetivo.",
    compatibleKinds: ["proyectil", "explosion"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: true,
    weight: 1.2,
    handler: (effect) =>
      timedEffect("rompe_armaduras", effect, {
        defenseReduction: ROMPE_ARMADURAS_DEF_REDUCTION * effectMagnitude(effect),
      }),
  },
  choque_termico: {
    id: "choque_termico",
    label: "Choque Térmico",
    description: "Reacción violenta al alternar temperaturas extremas.",
    compatibleKinds: ["proyectil", "explosion"],
    compatibleApplications: ["externa"],
    duration: false,
    stackable: false,
    weight: 1.5,
    handler: (effect) => ({
      tipo: "choque_termico",
      instant: "damage",
      dano: CHOQUE_TERMICO_DAMAGE_BASE * effectMagnitude(effect),
    }),
  },
  decadencia: {
    id: "decadencia",
    label: "Decadencia",
    description: "Degrada el poder del objetivo con el tiempo.",
    compatibleKinds: ["proyectil", "explosion", "buffo", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: true,
    weight: 1.4,
    handler: (effect, ctx = {}) => {
      const rFulgor = Number(ctx.objetivo?.stats?.r_fulgor) || 0;
      const mitigacion = MAGIC_DEFENSE_SCALE / (MAGIC_DEFENSE_SCALE + rFulgor);
      return timedEffect("decadencia", effect, {
        danoPorTick: Math.max(1, Math.floor(DECADENCIA_DOT_BASE * effectMagnitude(effect) * mitigacion)),
      });
    },
  },
};

// ══════════════════════════════════════════
// REACCIONES ELEMENTALES + PERSISTENCIA ELEMENTAL
// ══════════════════════════════════════════

/**
 * Persistencia elemental (estado de imbuición sobre un objetivo/objeto).
 *
 * Mecánica propuesta (se implementa en fases junto al motor):
 *  - Al recibir un hechizo con naturaleza de fulgor, el objetivo queda con una
 *    AURA elemental pasiva persistente durante `baseTurnos` (estado de imbuición).
 *  - Cuando el objetivo recibe OTRO elemento mientras está imbuido, la reacción
 *    se dispara por el ORDEN DE APLICACIÓN: el elemento ya presente es el PASIVO
 *    (la reacción se lee como `pasivo @ dominante`).
 *  - Par (pasivo, dominante) → reacción definida en `ELEMENT_REACTIONS`.
 *
 * Puntos que el sistema DEBE resolver (definidos aquí, implementados en el motor):
 *  - dónde vive el estado imbuido (sesión → objetivo), su ventana de turnos;
 *  - qué ocurre si el mismo elemento golpea a un objetivo ya imbuido con él
 *    (se refuerza/refresca la duración, NO reacciona);
 *  - qué ocurre si un elemento sin reacción definida golpea un objetivo imbuido
 *    (se reemplaza la aura pasiva);
 *  - las reacciones de los PRIMORDIALES (luz/oscuridad/caos) contra elementales,
 *    a definir en la tabla.
 * @type {{baseTurnos: number, mismoElemento: string, sinReaccion: string}}
 */
const ELEMENT_PERSISTENCE = {
  /** Turnos que dura el estado de imbuición antes de disiparse */
  baseTurnos: 2,
  /** Golpe con el mismo elemento ya imbuido: refresca la ventana (no reacciona) */
  mismoElemento: "refresca",
  /** Golpe con elemento sin reacción definida: reemplaza la aura pasiva */
  sinReaccion: "reemplaza",
};

/**
 * Tabla de reacciones elementales. Clave canónica:
 *   `${pasivo}@${dominante}`  (pasivo = elemento ya imbuido; dominante = entrante)
 * Cada entrada define el efecto de la reacción. La semántica numérica de cada
 * reacción (daño extra, amplificador `canal`, estado) se implementa en fases
 * futuras junto a los handlers; el resolver la consulta por (auraPasiva,
 * elementoEntrante).
 *
 * Reglas de diseño de la tabla (40 pares teóricos → 39 reacciones):
 *  - Un elemento NO reacciona consigo mismo (no hay claves `X@X`).
 *  - geo (tierra): SIEMPRE cristalizado con cualquier elemento, en ambos órdenes.
 *    El orden no cambia la reacción pero SÍ el daño (geo aplicado de último
 *    hace más daño que geo imbuido). EXCEPCIÓN: `tierra@aire` NO existe, geo y
 *    anemo no reaccionan entre sí.
 *  - anemo (aire): no persistente, solo reacciona como DOMINANTE (imprime torbellino).
 *  - primordiales (luz/oscuridad/caos): solo reaccionan como DOMINANTE contra
 *    elementales; nunca entre sí, nunca como pasivo.
 *  - Núcleo fuego/hielo/agua/electro: ciclo de dominancia
 *    fuego > hielo > agua > electro > fuego. Las dominancias cambian la reacción
 *    según el orden; las parejas neutras (fuego-agua, hielo-electro) dan la
 *    MISMA reacción en ambas direcciones.
 *
 * SEMÁNTICA (Fase 4): la reacción es un EVENTO INSTANTÁNEO, no un estado.
 *  - `canal`: multiplicador del daño del golpe en el instante en que reacciona
 *    (1 = sin amplificación). El aura pasiva se consume al reaccionar.
 *  - `efectos`: ids de `EFFECT_DEFS` que la reacción APLICA como estado al
 *    objetivo (consecuencia del evento, resuelta por statusService). Vacío =
 *    la reacción solo amplifica daño.
 *  - Geo: `tierra@X` (geo pasivo/imbuido) amplifica menos que `X@tierra`
 *    (geo dominante aplicado de último) — el orden NO cambia la reacción
 *    (label cristalizado) pero SÍ el daño.
 * @type {Record<string, {label: string, canal: number, efectos: string[]}>}
 */
const ELEMENT_REACTIONS = {
  // ── Geo (tierra): cristalizado con cualquier elemento, en cualquier orden ──
  // Misma reacción siempre; el daño depende del rol de geo:
  //   geo DOMINANTE (aplicado de último, X@tierra) canal 1.5
  //   geo PASIVO (imbuido, tierra@X)               canal 1.25
  // `tierra@aire` excluido: geo y anemo no reaccionan entre sí.
  "tierra@fuego": { label: "cristalizado", canal: 1.25, efectos: [] },
  "tierra@hielo": { label: "cristalizado", canal: 1.25, efectos: [] },
  "tierra@agua": { label: "cristalizado", canal: 1.25, efectos: [] },
  "tierra@electro": { label: "cristalizado", canal: 1.25, efectos: [] },
  "tierra@luz": { label: "cristalizado", canal: 1.25, efectos: [] },
  "tierra@oscuridad": { label: "cristalizado", canal: 1.25, efectos: [] },
  "tierra@caos": { label: "cristalizado", canal: 1.25, efectos: [] },
  "fuego@tierra": { label: "cristalizado", canal: 1.5, efectos: [] },
  "hielo@tierra": { label: "cristalizado", canal: 1.5, efectos: [] },
  "agua@tierra": { label: "cristalizado", canal: 1.5, efectos: [] },
  "electro@tierra": { label: "cristalizado", canal: 1.5, efectos: [] },

  // ── Núcleo elemental (fuego/hielo/agua/electro) — ciclo de dominancia ──
  //   fuego > hielo > agua > electro > fuego
  // En las dominancias, cambiar el orden cambia la reacción.
  "fuego@hielo": { label: "enfriado", canal: 1.5, efectos: [] },
  "hielo@fuego": { label: "derretido", canal: 1.5, efectos: ["quemadura"] },
  "hielo@agua": { label: "helado", canal: 1.5, efectos: ["congelado"] },
  "agua@hielo": { label: "congelado", canal: 1.5, efectos: ["congelado"] },
  "agua@electro": { label: "electro cargado", canal: 1.5, efectos: [] },
  "electro@agua": { label: "corto circuito", canal: 1.5, efectos: ["enredado"] },
  "electro@fuego": { label: "sobre carga", canal: 1.5, efectos: [] },
  "fuego@electro": { label: "descarga", canal: 1.5, efectos: [] },
  // Neutras: intercambiar el orden NO cambia la reacción (misma reacción).
  "fuego@agua": { label: "vaporizado", canal: 1.25, efectos: [] },
  "agua@fuego": { label: "vaporizado", canal: 1.25, efectos: [] },
  "hielo@electro": { label: "super conductor", canal: 1.25, efectos: [] },
  "electro@hielo": { label: "super conductor", canal: 1.25, efectos: [] },

  // ── Anemo (aire): solo DOMINANTE → torbellino (no es persistente) ──
  // No reacciona con geo (excluido arriba) ni con primordiales (incompatibles).
  "fuego@aire": { label: "torbellino", canal: 1.5, efectos: [] },
  "hielo@aire": { label: "torbellino", canal: 1.5, efectos: [] },
  "agua@aire": { label: "torbellino", canal: 1.5, efectos: [] },
  "electro@aire": { label: "torbellino", canal: 1.5, efectos: [] },

  // ── Primordiales: solo DOMINANTE contra elementales; nunca entre sí ──
  "fuego@luz": { label: "llama sagrada", canal: 1.75, efectos: ["purificado"] },
  "hielo@luz": { label: "lumo escarcha", canal: 1.75, efectos: [] },
  "agua@luz": { label: "agua bendita", canal: 1.75, efectos: ["purificado"] },
  "electro@luz": { label: "rayo purificador", canal: 1.75, efectos: ["purificado"] },
  "fuego@oscuridad": { label: "llama maldita", canal: 1.75, efectos: ["maldito"] },
  "hielo@oscuridad": { label: "hielo maldito", canal: 1.75, efectos: ["maldito"] },
  "agua@oscuridad": { label: "aguas malditas", canal: 1.75, efectos: ["maldito"] },
  "electro@oscuridad": { label: "rayo impuro", canal: 1.75, efectos: ["maldito"] },
  "fuego@caos": { label: "llamas carmesi", canal: 1.75, efectos: ["decadencia"] },
  "hielo@caos": { label: "fractal gelido", canal: 1.75, efectos: ["decadencia"] },
  "agua@caos": { label: "aguas abismales", canal: 1.75, efectos: ["decadencia"] },
  "electro@caos": { label: "sobre descarga", canal: 1.75, efectos: ["decadencia"] },
};

module.exports = {
  SPELL_KINDS,
  SPELL_APPLICATIONS,
  SPELL_NATURES,
  FULGOR_NATURES,
  SPELL_KIND_WEIGHTS,
  SPELL_APPLICATION_WEIGHTS,
  SPELL_DURATION_WEIGHT,
  SPELL_RESOLUTION_RULES,
  RESOLUTION_DEFAULT_TARGET_MODE,
  EFFECT_DEFS,
  EFFECT_DEF_SCHEMA,
  ELEMENT_REACTIONS,
  ELEMENT_PERSISTENCE,
};
