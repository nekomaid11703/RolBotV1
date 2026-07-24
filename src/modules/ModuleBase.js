class ModuleBase {
  static type = "__base__";
  static triggers = [];
  static priority = 0;

  constructor(config = {}) {
    this.config = config;
  }

  condition(context) {
    return true;
  }

  onUse(context) {
    return null;
  }
  onEquip(context) {
    return null;
  }
  onUnequip(context) {
    return null;
  }
  onAttack(context) {
    return null;
  }
  onHit(context) {
    return null;
  }
  onTurnStart(context) {
    return null;
  }
  onTurnEnd(context) {
    return null;
  }
  onAcquire(context) {
    return null;
  }
  onLose(context) {
    return null;
  }
}

module.exports = ModuleBase;
