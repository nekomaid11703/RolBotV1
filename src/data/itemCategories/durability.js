// @ts-nocheck
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Módulo de Resistencia Material y Durabilidad (Rotura / Reparación)
 */
class DurabilityModule extends ModuleBase {
  static type = "durability";
  static triggers = ["Hit"];

  constructor(config = {}) {
    super(config);
    this.maxResist = config.maxResist || 100;
    this.currentResist = config.currentResist ?? this.maxResist;
    this.isRepairable = Boolean(config.isRepairable); // Solo si es true adquiere "broken", sino se destruye
    this.isBroken = Boolean(config.isBroken);
    this.bonusDef = config.bonusDef || Math.round(this.maxResist / 2);
  }

  /**
   * Recibe daño entrante a la resistencia material.
   * @param {number} damage
   * @returns {{ absorbed: number, overflow: number, isBroken: boolean, isDestroyed: boolean }}
   */
  absorbDamage(damage) {
    if (this.isBroken || this.currentResist <= 0) {
      return { absorbed: 0, overflow: damage, isBroken: this.isBroken, isDestroyed: !this.isRepairable };
    }

    const absorbed = Math.min(this.currentResist, damage);
    const overflow = Math.max(0, damage - absorbed);
    this.currentResist -= absorbed;

    let destroyed = false;
    if (this.currentResist <= 0) {
      this.currentResist = 0;
      if (this.isRepairable) {
        this.isBroken = true;
      } else {
        destroyed = true;
      }
    }

    return {
      absorbed,
      overflow,
      isBroken: this.isBroken,
      isDestroyed: destroyed,
    };
  }

  onHit({ damage = 0 }) {
    return this.absorbDamage(damage);
  }
}

module.exports = DurabilityModule;
