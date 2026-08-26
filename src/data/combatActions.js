// @ts-nocheck
/**
 * Registro declarativo de acciones de combate.
 *
 * Las UI de combate (menú de acciones de turno y prompt de reacción) se
 * generan desde esta lista, no hardcodeadas en el formateador. Para añadir o
 * quitar una acción basta editar esta lista.
 *
 * - COMBAT_ACTIONS: acciones disponibles en el turno (menú de formatoCombatOpen/Status).
 * - REACTION_ACTIONS: reacciones del defensor ante un ataque entrante.
 *
 * Cada acción puede declarar un `hint` (placeholder del argumento) y un
 * predicado `when(session)` opcional para filtrarla según el estado de combate.
 */

const COMBAT_ACTIONS = [
  { command: "atacar",    label: "Ataque físico",          kinds: ["action"] },
  { command: "spell",     label: "Hechizo/Habilidad",      hint: "slot|id",  kinds: ["action"] },
  { command: "usar",      label: "Usar consumible",         hint: "item",    kinds: ["action"] },
  { command: "descansar", label: "Descansar y meditar (recupera Fat. y Fulgor)", kinds: ["action"] },
  { command: "huir",      label: "Intentar escapar",       kinds: ["action"] },
  { command: "avanzar",   label: "Avanzar",                hint: "metros",  kinds: ["action", "movement"] },
  { command: "retroceder",label: "Retroceder",             hint: "metros",  kinds: ["action", "movement"] },
];

const REACTION_ACTIONS = [
  {
    command: "esquivar",
    label: "Esquivar",
    /**
     * @param {{baseDamage: number, canDodge: boolean, dodgeChancePct?: number}} opts
     */
    render: ({ baseDamage, canDodge, dodgeChancePct }) => {
      if (canDodge) {
        const pct = dodgeChancePct !== undefined ? `${dodgeChancePct}%` : "alta";
        return `✅ Éxito: ${pct}  →  Daño: 0`;
      }
      const pct = dodgeChancePct !== undefined ? `${dodgeChancePct}%` : "baja";
      return `⚠️ Éxito: ${pct}  →  Daño: ${baseDamage} (si falla)`;
    },
  },
  {
    command: "bloquear",
    label: "Bloquear",
    render: ({ baseDamage }) => `🛡️ Garantizado  →  Daño: ${Math.max(1, Math.round(baseDamage * 0.75))}`,
  },
];

module.exports = { COMBAT_ACTIONS, REACTION_ACTIONS };
