const ModuleBase = require("../../modules/ModuleBase");

class EquipableModule extends ModuleBase {
  static type = "equipable";
  static triggers = ["Equip", "Unequip"];

  onUse() {
    return { type: "equipable" };
  }

  onEquip() {
    return { type: "equipable", action: "equipped" };
  }

  onUnequip() {
    return { type: "equipable", action: "unequipped" };
  }
}

module.exports = EquipableModule;
