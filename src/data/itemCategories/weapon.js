// @ts-nocheck
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Módulo de Armas con Naturalezas de Daño (Cortante, Contundente, Perforante)
 */
class WeaponModule extends ModuleBase {
  static type = "weapon";
  static triggers = ["Attack"];

  constructor(config = {}) {
    super(config);
    this.damageNature = config.damageNature || "cortante"; // cortante | contundente | perforante
    this.hands = config.hands || 1; // 1 | 2
    this.baseDamage = config.baseDamage || 10;
    this.weaponRange = config.weaponRange || 1;
    this.tier = config.tier || "E";
  }

  onAttack(_context) {
    return {
      type: "weapon",
      damageNature: this.damageNature,
      hands: this.hands,
      baseDamage: this.baseDamage,
      weaponRange: this.weaponRange,
      tier: this.tier,
    };
  }
}

module.exports = WeaponModule;
