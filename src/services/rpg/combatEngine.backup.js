// Backup original damage formula (v1.3 - pre-simulation)
// Original: const rawDamage = atkPenalized.atk - defPenalized.def;

const { DAMAGE_MIN } = require("../../config/combatConfig");
const { applyPenalties } = require("../rpg/combatEngine");

/**
 *
 * @param attackerStats
 * @param defenderStats
 * @param attackerHp
 * @param defenderHp
 * @param attackerFatigue
 * @param defenderFatigue
 * @param attackerRes
 * @param defenderRes
 */
function calculateDamageBackup(
  attackerStats,
  defenderStats,
  attackerHp,
  defenderHp,
  attackerFatigue = 0,
  defenderFatigue = 0,
  attackerRes = 0,
  defenderRes = 0,
) {
  const atkPenalized = applyPenalties(attackerStats, attackerHp, attackerFatigue, attackerRes);
  const defPenalized = applyPenalties(defenderStats, defenderHp, defenderFatigue, defenderRes);

  const rawDamage = atkPenalized.atk - defPenalized.def;
  return Math.max(DAMAGE_MIN, rawDamage);
}

module.exports = { calculateDamageBackup };
