const ModuleBase = require("../../modules/ModuleBase");

class HealModule extends ModuleBase {
  static type = "heal";
  static triggers = ["Use"];

  onUse({ character }) {
    const maxHp = (character.stats?.hp || 1) * 2;
    const amount = this.config.amount || 0;
    const newHp = Math.min(maxHp, character.hp_actual + amount);
    return {
      type: "heal",
      amount,
      hpBefore: character.hp_actual,
      hpAfter: newHp,
      delta: newHp - character.hp_actual,
      maxHp,
    };
  }
}

module.exports = HealModule;
