class EquipableCategory {
  static type = "equipable";
  static triggers = ["onEquip", "onUnequip"];

  onUse() {
    return { type: "equipable" };
  }
}

module.exports = EquipableCategory;
