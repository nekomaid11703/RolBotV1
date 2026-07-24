const ModuleBase = require("../../modules/ModuleBase");

class DamageModule extends ModuleBase {
  static type = "damage";
  static triggers = ["Attack"];

  onAttack() {
    return { type: "damage" };
  }
}

module.exports = DamageModule;
