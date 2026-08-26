// @ts-nocheck
const {
  EFFECT_DEFS,
  ELEMENT_REACTIONS,
  ELEMENT_PERSISTENCE,
} = require("../../config/spellTree");

/**
 * Resolver declarativo de efectos de hechizo (Sistema Simplificado).
 *
 * Genérico por diseño: NO sabe qué hace cada efecto. Recibe un hechizo con su
 * lista `effects[]` y, para cada efecto, busca el handler en el registro
 * `EFFECT_DEFS` y lo despacha. Si el efecto no está registrado o no tiene
 * handler implementado, devuelve `{ pending: true }` para que la UI/motor lo
 * traten explícitamente.
 *
 * Esto es lo que permite añadir habilidades nuevas SIN tocar el motor: un
 * efecto nuevo = entrada en EFFECT_DEFS + su handler; el resolver no cambia.
 *
 * Además resuelve las REACCIONES ELEMENTALES por orden de aplicación
 * (pasivo @ dominante), consultando la tabla `ELEMENT_REACTIONS`.
 */

/**
 * Despacha un efecto individual a su handler registrado.
 * @param {object} effect - { tipo, target, magnitude, duration, element? }
 * @param {object} ctx - Contexto de resolución (atacante, objetivo, sesión, turno)
 * @returns {{tipo: string, applied: boolean, pending?: boolean, reason?: string, result?: *}}
 */
function resolveEffect(effect, ctx) {
  const tipo = effect?.tipo;
  const def = EFFECT_DEFS[tipo];

  if (!def) {
    return { tipo, applied: false, pending: true, reason: "EFECTO_DESCONOCIDO" };
  }

  if (typeof def.handler !== "function") {
    return { tipo, applied: false, pending: true, reason: "HANDLER_PENDIENTE" };
  }

  const result = def.handler(effect, ctx);
  return { tipo, applied: true, result };
}

/**
 * Resuelve todos los efectos de un hechizo (o lista de efectos).
 * @param {Array<object>} effects - Lista de efectos del hechizo
 * @param {object} ctx - Contexto de resolución
 * @returns {Array<object>} Resultado por efecto (aplicado o pendiente)
 */
function resolveSpellEffects(effects, ctx) {
  if (!Array.isArray(effects) || effects.length === 0) return [];
  return effects.map((effect) => resolveEffect(effect, ctx));
}

/**
 * Indica si todos los efectos de un hechizo están implementados.
 * @param {Array<object>} effects
 * @returns {boolean} true si todos tienen handler registrado
 */
function hasImplementedEffects(effects) {
  if (!Array.isArray(effects) || effects.length === 0) return false;
  return effects.every((effect) => typeof EFFECT_DEFS[effect?.tipo]?.handler === "function");
}

/**
 * Resuelve la REACCIÓN ELEMENTAL por orden de aplicación.
 *
 * Regla de persistencia elemental:
 *   1. Un objetivo imbuido (aura pasiva de un elemento) recibe un golpe con
 *      otro elemento (dominante). Reacción = tabla[pasivo @ dominante].
 *   2. Si el golpe trae el MISMO elemento que la aura: no reacciona, refresca
 *      la ventana de persistencia (ELEMENT_PERSISTENCE.mismoElemento).
 *   3. Si no hay aura previa: el golpe crea/imprime la aura del dominante
 *      (queda disponible para la próxima aplicación).
 *   4. Si el par no tiene reacción definida: la aura pasiva se REEMPLAZA por
 *      el dominante (ELEMENT_PERSISTENCE.sinReaccion).
 *
 * SEMÁNTICA (Fase 4): la reacción es un EVENTO instantáneo, no un estado.
 * Cuando reacciona devuelve:
 *  - `reaction.canal`: multiplicador del daño del golpe en el instante;
 *  - `reaction.efectos`: ids de EFFECT_DEFS que la reacción aplica como estado.
 * En los casos que NO reaccionan, `multiplicador = 1` y `efectos = []`.
 *
 * @param {object} ctx - Contexto con el estado elemental del objetivo
 *   esperado: { objetivo: { auraPasiva: string|null, turnosAura: number } }
 * @param {string} dominante - Elemento entrante del golpe/hechizo
 * @returns {object} Decisión de reacción + multiplicador + aura resultante
 */
function resolveElementReaction(ctx, dominante) {
  const aura = ctx?.objetivo?.auraPasiva ?? null;

  if (!aura) {
    // Sin aura previa: el golpe imprime el elemento dominante.
    return {
      reacciono: false,
      motivo: "imprime_aura",
      decision: "imprimir",
      multiplicador: 1,
      efectos: [],
      auraResultante: { pasiva: dominante, turnos: ELEMENT_PERSISTENCE.baseTurnos },
    };
  }

  if (aura === dominante) {
    // Mismo elemento: refresca la ventana, no reacciona.
    return {
      reacciono: false,
      motivo: "mismo_elemento",
      decision: ELEMENT_PERSISTENCE.mismoElemento,
      multiplicador: 1,
      efectos: [],
      auraResultante: { pasiva: aura, turnos: ELEMENT_PERSISTENCE.baseTurnos },
    };
  }

  const reaction = ELEMENT_REACTIONS[`${aura}@${dominante}`];
  if (reaction) {
    return {
      reacciono: true,
      motivo: "reaccion",
      reaction,
      decision: "consumir_aura",
      multiplicador: Number(reaction.canal) || 1,
      efectos: Array.isArray(reaction.efectos) ? reaction.efectos : [],
      auraResultante: null, // el evento consume el aura pasiva
    };
  }

  // Sin reacción definida: el dominante reemplaza la aura pasiva.
  return {
    reacciono: false,
    motivo: "sin_reaccion_definida",
    decision: ELEMENT_PERSISTENCE.sinReaccion,
    multiplicador: 1,
    efectos: [],
    auraResultante: { pasiva: dominante, turnos: ELEMENT_PERSISTENCE.baseTurnos },
  };
}

module.exports = {
  resolveEffect,
  resolveSpellEffects,
  hasImplementedEffects,
  resolveElementReaction,
};
