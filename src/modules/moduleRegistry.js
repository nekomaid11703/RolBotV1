const ModuleBase = require("./ModuleBase");

const registry = new Map();

const moduleRegistry = {
  register(ModuleClass) {
    if (!ModuleClass || !ModuleClass.type || ModuleClass.type === "__base__") {
      throw new Error(`Module must have a unique static 'type' property`);
    }
    if (!(ModuleClass.prototype instanceof ModuleBase)) {
      throw new Error(`Module "${ModuleClass.type}" must extend ModuleBase`);
    }
    if (registry.has(ModuleClass.type)) {
      throw new Error(`Module type "${ModuleClass.type}" is already registered`);
    }
    registry.set(ModuleClass.type, ModuleClass);
  },

  get(type) {
    return registry.get(type) || null;
  },

  getAll() {
    return Array.from(registry.keys());
  },

  createInstance(type, config) {
    const Klass = registry.get(type);
    if (!Klass) return null;
    return new Klass(config);
  },

  clear() {
    registry.clear();
  },
};

module.exports = moduleRegistry;
