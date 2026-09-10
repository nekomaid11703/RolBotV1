/**
 * @constant ModuleBase
 */
const ModuleBase = require("./ModuleBase");

/**
 * @constant registry
 * @type {Map<*, *>}
 */
const registry = new Map();

/**
 * @constant moduleRegistry
 * @type {{ register: Function, get: Function, getAll: Function, createInstance: Function, clear: Function }}
 */
const moduleRegistry = {
  /**
   * Registers the .
   * @param {*} ModuleClass - module class.
   * @throws {Error}
   */
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

  /**
   * Returns the .
   * @param {*} type - type identifier.
   * @returns {any}
   */
  get(type) {
    return registry.get(type) || null;
  },

  /**
   * Returns the all.
   * @returns {any}
   */
  getAll() {
    return Array.from(registry.keys());
  },

  /**
   * Creates a new instance.
   * @param {*} type - type identifier.
   * @param {*} config - configuration object.
   * @returns {any}
   */
  createInstance(type, config) {
    /**
     * @constant Klass
     */
    const Klass = registry.get(type);
    if (!Klass) return null;
    return new Klass(config);
  },

  /**
   * Clears the .
   */
  clear() {
    registry.clear();
  },
};

module.exports = moduleRegistry;
