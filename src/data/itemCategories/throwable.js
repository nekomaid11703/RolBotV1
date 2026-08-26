// @ts-nocheck
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Módulo de arma arrojadiza (no equipable).
 *
 * Ítems de una sola pieza que se lanzan desde el inventario consumiendo el turno
 * de ataque del personaje (ej: kunai, daga arrojadiza). No se equipan en ningún
 * slot; su categoría `throwable` no es aceptada por `EQUIPMENT_SLOTS`.
 */
class ThrowableModule extends ModuleBase {
  static type = "throwable";
  static triggers = ["Use", "Throw"];

  /**
   * @param {object} config - { damageNature, baseDamage, range, tier }
   */
  constructor(config = {}) {
    super(config);
    this.damageNature = config.damageNature || "perforante"; // cortante | contundente | perforante
    this.baseDamage = config.baseDamage || 10;
    this.range = config.range || 3;
    this.tier = config.tier || "E";
  }

  /**
   * Lanza el arma arrojadiza (consume el turno de ataque).
   * @returns {object} Payload con naturaleza y daño del lanzamiento
   */
  onThrow() {
    return {
      type: "throwable",
      damageNature: this.damageNature,
      baseDamage: this.baseDamage,
      range: this.range,
      tier: this.tier,
      consumedOnUse: true,
    };
  }

  /**
   * Alias para poder usarse también desde el inventario.
   * @returns {object} Mismo payload que onThrow
   */
  onUse() {
    return this.onThrow();
  }
}

module.exports = ThrowableModule;
