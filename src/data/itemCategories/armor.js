// @ts-nocheck
const ModuleBase = require("../../modules/ModuleBase");

/**
 * Módulo de Armadura y Equipamiento Corporal
 */
class ArmorModule extends ModuleBase {
  static type = "armor";
  static triggers = ["Equip", "Unequip"];

  constructor(config = {}) {
    super(config);
    this.slot = config.slot || "pecho"; // cabeza | pecho | pantalones | botas
    this.coverage = config.coverage || "media"; // total | alta | media | ligera
    this.setId = config.setId || null;
    this.bonusDef = config.bonusDef || 5;
  }

  onEquip(_context) {
    return {
      type: "armor",
      slot: this.slot,
      coverage: this.coverage,
      setId: this.setId,
      bonusDef: this.bonusDef,
    };
  }

  onUnequip(_context) {
    return {
      type: "armor_unequip",
      slot: this.slot,
    };
  }
}

module.exports = ArmorModule;
