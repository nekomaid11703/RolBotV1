/**
 * @constant moduleRegistry
 */
const moduleRegistry = require("./moduleRegistry");

/**
 * Represents a entity.
 */
class Entity {
  /**
   * @param def - - def.
   * @constructor
   */
  constructor(def) {
    if (!def || !def.id || !def.type) {
      throw new Error("Entity definition must have 'id' and 'type'");
    }

    this.id = def.id;
    this.type = def.type;
    this.name = def.name || def.id;
    this.icon = def.icon || "";
    this.description = def.description || "";
    this.rarity = def.rarity || "common";
    this.price = def.price || 0;
    this.tags = [...(def.tags || [])];
    this.maxStack = def.maxStack || 1;
    this.categories = [...(def.categories || [])];

    this.modules = [];
    if (def.modules) {
      for (const [type, config] of Object.entries(def.modules)) {
        /**
         * @constant instance
         */
        const instance = moduleRegistry.createInstance(type, config);
        if (instance) {
          this.modules.push(instance);
        }
      }
    }
  }

  /**
   * Trigger.
   * @param event - - event object.
   * @param context - - execution context.
   * @returns
   */
  trigger(event, context) {
    /**
     * @constant sorted
     */
    const sorted = this.modules
      .filter((m) => m.constructor.triggers.includes(event))
      .sort((a, b) => (b.constructor.priority || 0) - (a.constructor.priority || 0));

    /**
     * @constant results
     * @type {Array}
     */
    const results = [];
    for (const mod of sorted) {
      if (mod.condition(context)) {
        /**
         * @constant method
         */
        const method = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
        if (typeof mod[method] === "function") {
          results.push({ type: mod.constructor.type, result: mod[method](context) });
        }
      }
    }
    return results;
  }
}

/**
 * @param def
 * @returns
 */
function createEntity(def) {
  return new Entity(def);
}

module.exports = { Entity, createEntity };
