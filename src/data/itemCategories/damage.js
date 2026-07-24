class DamageCategory {
  static type = "damage";
  static triggers = ["onAttack"];

  onUse() {
    return { type: "damage" };
  }
}

module.exports = DamageCategory;
