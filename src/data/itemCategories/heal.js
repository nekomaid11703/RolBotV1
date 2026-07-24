class HealCategory {
  static type = "heal";
  static triggers = ["onUse"];

  onUse({ character, config }) {
    const maxHp = (character.stats?.hp || 1) * 2;
    const newHp = Math.min(maxHp, character.hp_actual + config.amount);
    return {
      type: "heal",
      amount: config.amount,
      hpBefore: character.hp_actual,
      hpAfter: newHp,
      delta: newHp - character.hp_actual,
      maxHp,
    };
  }
}

module.exports = HealCategory;
