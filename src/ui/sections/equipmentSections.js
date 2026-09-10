// @ts-nocheck
/**
 * Secciones de UI relacionadas con el equipamiento.
 *
 * Se alimentan del payload de `resolveCharacterEquipment` (arma, armadura con
 * durabilidad, artefactos, bonos de set, cobertura). Sin emojis de ítem: los
 * nombres se muestran planos para que las pantallas sigan el mismo criterio
 * que el inventario (v2.8.0).
 */

/**
 * Genera las líneas de equipo de un combatiente para la UI.
 * @param {object|null} eq - Resumen de equipo (resolveCharacterEquipment)
 * @returns {string[]} Líneas de equipo formateadas (vacío si no hay equipo)
 */
function equipmentSummaryLines(eq) {
  if (!eq) return [];
  const lines = [];

  if (eq.weapon) {
    lines.push(`*${eq.weapon.name}* — ${eq.weapon.damageNature} (${eq.weapon.baseDamage})`);
  }

  for (const a of eq.armor || []) {
    lines.push(`${a.name} · ${a.coverage} ${a.currentResist}/${a.maxResist}${a.broken ? " | ROTA" : ""}`);
  }
  if ((eq.armor || []).length > 0) {
    lines.push(`Material: ${eq.totalCurrentResist}/${eq.totalMaxResist}`);
  }

  for (const b of eq.setBonuses || []) {
    const bonus = b.bonus || {};
    const bonusText = Object.entries(bonus)
      .map(([k, v]) => `${k.toUpperCase()} +${v}`)
      .join(" · ");
    lines.push(b.active ? `Set *${b.name}* (${b.count} piezas) ${bonusText}` : `${b.name} ${b.count}/4`);
  }

  if ((eq.artifacts || []).length > 0) {
    lines.push(`${eq.artifacts.map((a) => a.name).join(", ")}`);
  }

  return lines;
}

module.exports = { equipmentSummaryLines };
