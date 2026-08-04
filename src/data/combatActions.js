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
  { command: "atacar", label: "Ataque", kinds: ["action"] },
  { command: "usar", label: "Consumible", hint: "item", kinds: ["action"] },
  { command: "descansar", label: "Fatiga -5", kinds: ["action"] },
  { command: "huir", label: "Escapar", kinds: ["action"] },
  { command: "avanzar", label: "Avanzar", hint: "metros", kinds: ["action", "movement"] },
  { command: "retroceder", label: "Retroceder", hint: "metros", kinds: ["action", "movement"] },
];

const REACTION_ACTIONS = [
  {
    command: "esquivar",
    label: "Esquivar",
    render: ({ baseDamage, canDodge }) => (canDodge ? "✅ Daño: 0" : `❌ Daño: ${baseDamage}`),
  },
  {
    command: "bloquear",
    label: "Bloquear",
    render: ({ baseDamage }) => `🛡️ Daño: ${Math.max(1, Math.round(baseDamage * 0.75))}`,
  },
];

module.exports = { COMBAT_ACTIONS, REACTION_ACTIONS };
