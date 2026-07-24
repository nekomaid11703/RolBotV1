const ModuleBase = require("../../modules/ModuleBase");

class BuffModule extends ModuleBase {
  static type = "buff";
  static triggers = ["Use"];

  onUse() {
    return {
      type: "buff",
      effect: {
        id: `eff_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        module: "buff",
        stat: this.config.stat,
        amount: this.config.amount,
        remainingTurns: this.config.durationTurns,
      },
    };
  }
}

module.exports = BuffModule;
