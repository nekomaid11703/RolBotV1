class BuffCategory {
  static type = "buff";
  static triggers = ["onUse"];

  onUse({ character, config }) {
    return {
      type: "buff",
      effect: {
        id: `eff_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        module: "buff",
        stat: config.stat,
        amount: config.amount,
        remainingTurns: config.durationTurns,
      },
    };
  }
}

module.exports = BuffCategory;
