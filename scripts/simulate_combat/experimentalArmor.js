// @ts-nocheck
"use strict";

/**
 * Capa de ARMADURA EXPERIMENTAL (Iteración 1 de Fase C).
 *
 * El motor real (`combatEngine.js`) hoy tiene estas carencias diagnosticadas:
 *   - `bonusDef` SOLO sesga la IA a bloquear; NO mitiga DEF (combatEngine.js:692).
 *   - El material absorbido es un pool PARALELO; el overflow NUNCA se convierte
 *     en daño a HP (spec §3 lo exige: overflow → daño a salud corporal).
 *   - `maxResist` es un pool FIJO contra daño que crece con el nivel (la
 *     protección debería ser RELATIVA al daño entrante).
 *
 * Este módulo ofrece MODOS de armadura parametrizables para medir CUÁL mecánica
 * cumple R3 ("armadura protege HP real") en ambos extremos de la curva (nivel
 * 100 y 500), SIN tocar el motor real. La Iteración 1 elegirá el modo ganador y
 * sus constantes se volcarán a `src/config/combatConfig.js`.
 *
 * Modos:
 *   actual   — comportamiento del motor hoy (baseline, sin arreglo).
 *   def      — `bonusDef` pasa a mitigar DEF (se suma a la DEF del defensor).
 *   soak     — la armadura absorbe un % del daño corporal entrante (RELATIVO).
 *   overflow — el overflow de material se convierte en daño a HP (spec §3).
 *   full     — def + soak + overflow combinados (hipótesis Iteración 1).
 */

const { DAMAGE_DEFENSE_SCALE, DEF_MITIGATION_CAP } = require("../../src/config/combatConfig");

/**
 * @constant ARMOR_MODES
 * @type {object}
 */
const ARMOR_MODES = {
  actual: { id: "actual", label: "Motor actual", bonusDefToDef: false, soakRatio: 0, overflowToHp: false },
  def: { id: "def", label: "bonusDef -> DEF", bonusDefToDef: true, soakRatio: 0, overflowToHp: false },
  soak: { id: "soak", label: "Soak relativo", bonusDefToDef: false, soakRatio: 0.25, overflowToHp: false },
  overflow: { id: "overflow", label: "Overflow -> HP", bonusDefToDef: false, soakRatio: 0, overflowToHp: true },
  full: { id: "full", label: "Def + Soak + Overflow", bonusDefToDef: true, soakRatio: 0.25, overflowToHp: true },
};

/**
 * @param {string} id
 * @returns {object}
 */
function getArmorMode(id) {
  return ARMOR_MODES[id] || ARMOR_MODES.actual;
}

/**
 * Mitigación por DEF con la fórmula REAL del motor
 * (factor = SCALE / (SCALE + min(def, CAP))).
 * @param {number} def
 * @returns {number}
 */
function mitigationFactor(def = 0) {
  const capped = DEF_MITIGATION_CAP > 0 ? Math.min(DEF_MITIGATION_CAP, Math.max(0, def)) : Math.max(0, def);
  return DAMAGE_DEFENSE_SCALE / (DAMAGE_DEFENSE_SCALE + capped);
}

/**
 * Aplica el modo de armadura experimental a un ataque.
 * @param {object} mode - Config del modo (de getArmorMode)
 * @param {object} ctx - Contexto del ataque:
 *   { baseDamage, materialDamage, finalDamage, dodged, defenderStats,
 *     armorBonusDef, armorAbsorption }
 * @returns {object} Resultado con el daño final ajustado:
 *   { finalDamage, soakApplied, defReduction, overflowToHp }
 */
function applyArmorMode(mode, ctx) {
  const { baseDamage, materialDamage, finalDamage, dodged, defenderStats = {}, armorBonusDef = 0, armorAbsorption = null } = ctx;

  let outDamage = dodged ? 0 : finalDamage;
  let soakApplied = 0;
  let defReduction = 0;
  let overflowToHp = 0;

  if (mode.bonusDefToDef && armorBonusDef > 0) {
    const baseDef = defenderStats.def || 0;
    const factorBase = mitigationFactor(baseDef);
    const factorBoosted = mitigationFactor(baseDef + armorBonusDef);
    if (factorBase > 0) {
      const reductionRatio = 1 - factorBoosted / factorBase;
      defReduction = Math.floor(outDamage * reductionRatio);
      outDamage = Math.max(0, outDamage - defReduction);
    }
  }

  if (mode.soakRatio > 0) {
    soakApplied = Math.floor(outDamage * mode.soakRatio);
    outDamage = Math.max(0, outDamage - soakApplied);
  }

  if (mode.overflowToHp && materialDamage > 0 && !dodged && armorAbsorption) {
    overflowToHp = armorAbsorption.overflow || 0;
    outDamage += overflowToHp;
  }

  return { finalDamage: outDamage, soakApplied, defReduction, overflowToHp };
}

module.exports = { ARMOR_MODES, getArmorMode, applyArmorMode, mitigationFactor };
