// @ts-nocheck
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
const FULGOR_NATURES = [
  ...SPELL_NATURES.elemental.subtypes,
  ...SPELL_NATURES.primordial.subtypes,
];

// ══════════════════════════════════════════
// 4. REGISTRO DE EFECTOS (extensible, sin lógica aún)
// ══════════════════════════════════════════

/**
 * Esquema mínimo que debe cumplir cada entrada del registro de efectos.
 * El campo `handler` se llena en fases futuras; hasta entonces el resolver
 * devuelve `{ applied: false, pending: true }` y la UI lo muestra como pendiente.
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
  handler: "function|nil", // implementación de la mecánica (PENDIENTE)
};

/**
 * Registro de efectos (semilla — la lista es extensible).
 * Cada entrada es DATOS; la mecánica vive en `handler` (null en esta fase).
 * @type {Record<string, object>}
 */
const EFFECT_DEFS = {
  veneno: {
    id: "veneno",
    label: "Veneno",
    description: "Daño por turno durante un tiempo.",
    compatibleKinds: ["proyectil", "explosion", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    handler: null,
  },
  quemadura: {
    id: "quemadura",
    label: "Quemadura",
    description: "Daño continuo de fuego que desgasta el objetivo.",
    compatibleKinds: ["proyectil", "explosion", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    handler: null,
  },
  enredado: {
    id: "enredado",
    label: "Enredado",
    description: "Impide avanzar o retroceder durante el turno.",
    compatibleKinds: ["proyectil", "explosion", "barrera", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    handler: null,
  },
  congelado: {
    id: "congelado",
    label: "Congelado",
    description: "Inmoviliza y puede amplificar el daño entrante.",
    compatibleKinds: ["proyectil", "explosion", "barrera", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    handler: null,
  },
  purificado: {
    id: "purificado",
    label: "Purificado",
    description: "Limpia estados negativos del objetivo.",
    compatibleKinds: ["proyectil", "explosion", "buffo", "aura"],
    compatibleApplications: ["propia", "externa"],
    duration: false,
    stackable: false,
    handler: null,
  },
  maldito: {
    id: "maldito",
    label: "Maldito",
    description: "Debilita estadísticas o penaliza acciones del objetivo.",
    compatibleKinds: ["proyectil", "explosion", "buffo", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: false,
    handler: null,
  },
  rompe_armaduras: {
    id: "rompe_armaduras",
    label: "Rompe Armaduras",
    description: "Reduce la resistencia material o DEF del objetivo.",
    compatibleKinds: ["proyectil", "explosion"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: true,
    handler: null,
  },
  choque_termico: {
    id: "choque_termico",
    label: "Choque Térmico",
    description: "Reacción violenta al alternar temperaturas extremas.",
    compatibleKinds: ["proyectil", "explosion"],
    compatibleApplications: ["externa"],
    duration: false,
    stackable: false,
    handler: null,
  },
  decadencia: {
    id: "decadencia",
    label: "Decadencia",
    description: "Degrada el poder del objetivo con el tiempo.",
    compatibleKinds: ["proyectil", "explosion", "buffo", "aura"],
    compatibleApplications: ["externa"],
    duration: true,
    stackable: true,
    handler: null,
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
  EFFECT_DEFS,
  EFFECT_DEF_SCHEMA,
  ELEMENT_REACTIONS,
  ELEMENT_PERSISTENCE,
};
