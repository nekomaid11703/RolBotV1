const ModuleBase = require("../src/modules/ModuleBase");
const moduleRegistry = require("../src/modules/moduleRegistry");
const { Entity, createEntity } = require("../src/modules/entityFactory");

describe("ModuleBase", () => {
  it("should have default static properties", () => {
    expect(ModuleBase.type).toBe("__base__");
    expect(ModuleBase.triggers).toEqual([]);
    expect(ModuleBase.priority).toBe(0);
  });

  it("should return null for all lifecycle methods by default", () => {
    const mod = new ModuleBase({ foo: "bar" });
    expect(mod.config).toEqual({ foo: "bar" });
    expect(mod.onUse({})).toBeNull();
    expect(mod.onEquip({})).toBeNull();
    expect(mod.onUnequip({})).toBeNull();
    expect(mod.onAttack({})).toBeNull();
    expect(mod.onHit({})).toBeNull();
    expect(mod.onTurnStart({})).toBeNull();
    expect(mod.onTurnEnd({})).toBeNull();
    expect(mod.onAcquire({})).toBeNull();
    expect(mod.onLose({})).toBeNull();
  });

  it("should default condition to true", () => {
    const mod = new ModuleBase();
    expect(mod.condition({})).toBe(true);
  });
});

describe("moduleRegistry", () => {
  beforeEach(() => {
    moduleRegistry.clear();
  });

  it("should register and retrieve a module class", () => {
    class TestMod extends ModuleBase {
      static type = "test_mod";
    }
    moduleRegistry.register(TestMod);
    expect(moduleRegistry.get("test_mod")).toBe(TestMod);
  });

  it("should reject registration without type", () => {
    class BadMod extends ModuleBase {}
    expect(() => moduleRegistry.register(BadMod)).toThrow("static 'type'");
  });

  it("should reject registration of non-ModuleBase classes", () => {
    class NotAModule {
      static type = "fake";
    }
    expect(() => moduleRegistry.register(NotAModule)).toThrow("must extend ModuleBase");
  });

  it("should reject duplicate type registration", () => {
    class ModA extends ModuleBase {
      static type = "dupe";
    }
    class ModB extends ModuleBase {
      static type = "dupe";
    }
    moduleRegistry.register(ModA);
    expect(() => moduleRegistry.register(ModB)).toThrow("already registered");
  });

  it("should list all registered types", () => {
    class A extends ModuleBase {
      static type = "a";
    }
    class B extends ModuleBase {
      static type = "b";
    }
    moduleRegistry.register(A);
    moduleRegistry.register(B);
    expect(moduleRegistry.getAll()).toEqual(["a", "b"]);
  });

  it("should create instances from type and config", () => {
    class TestMod extends ModuleBase {
      static type = "builder";
    }
    moduleRegistry.register(TestMod);
    const instance = moduleRegistry.createInstance("builder", { x: 1 });
    expect(instance).toBeInstanceOf(TestMod);
    expect(instance.config).toEqual({ x: 1 });
  });

  it("should return null for unknown types", () => {
    expect(moduleRegistry.createInstance("nonexistent", {})).toBeNull();
  });
});

describe("Entity", () => {
  beforeEach(() => {
    moduleRegistry.clear();
  });

  class HealModule extends ModuleBase {
    static type = "heal";
    static triggers = ["Use"];
    onUse({ config }) {
      return { action: "heal", amount: config.amount };
    }
  }

  class BuffModule extends ModuleBase {
    static type = "buff";
    static triggers = ["Use", "TurnStart"];
    static priority = 10;
    onUse({ config }) {
      return { action: "add_effect", effect: { stat: config.stat, amount: config.amount } };
    }
    onTurnStart() {
      return { action: "tick_effect" };
    }
  }

  class MarkerModule extends ModuleBase {
    static type = "marker";
    static triggers = [];
  }

  /**
   *
   */
  function registerTestModules() {
    moduleRegistry.register(HealModule);
    moduleRegistry.register(BuffModule);
    moduleRegistry.register(MarkerModule);
  }

  it("should reject invalid definition", () => {
    expect(() => createEntity({})).toThrow("must have 'id' and 'type'");
    expect(() => createEntity({ id: "x" })).toThrow("must have 'id' and 'type'");
  });

  it("should create entity with default properties", () => {
    const entity = createEntity({ id: "test", type: "item" });
    expect(entity.id).toBe("test");
    expect(entity.type).toBe("item");
    expect(entity.name).toBe("test");
    expect(entity.icon).toBe("");
    expect(entity.modules).toEqual([]);
  });

  it("should instantiate modules from def.modules", () => {
    registerTestModules();
    const entity = createEntity({
      id: "pocion",
      type: "item",
      name: "Poción",
      icon: "🧪",
      modules: { heal: { amount: 40 } },
    });
    expect(entity.modules).toHaveLength(1);
    expect(entity.modules[0]).toBeInstanceOf(HealModule);
    expect(entity.modules[0].config.amount).toBe(40);
  });

  it("should instantiate multiple modules", () => {
    registerTestModules();
    const entity = createEntity({
      id: "multi",
      type: "item",
      modules: { heal: { amount: 20 }, buff: { stat: "atk", amount: 5 }, marker: {} },
    });
    expect(entity.modules).toHaveLength(3);
  });

  it("should filter unknown module types silently", () => {
    const entity = createEntity({
      id: "unknown_mod",
      type: "item",
      modules: { nonexistent: { foo: 1 } },
    });
    expect(entity.modules).toHaveLength(0);
  });

  it("should trigger all matching module methods sorted by priority", () => {
    registerTestModules();
    const entity = createEntity({
      id: "trigger_test",
      type: "item",
      modules: { heal: { amount: 30 }, buff: { stat: "def", amount: 10 } },
    });

    const results = entity.trigger("Use", { config: {} });
    expect(results).toHaveLength(2);

    const types = results.map((r) => r.type);
    expect(types).toContain("heal");
    expect(types).toContain("buff");
  });

  it("should trigger buff onTurnStart but not heal", () => {
    registerTestModules();
    const entity = createEntity({
      id: "turn_test",
      type: "skill",
      modules: { heal: { amount: 10 }, buff: { stat: "atk", amount: 5 } },
    });

    const results = entity.trigger("TurnStart", {});
    expect(results).toHaveLength(1);
    expect(results[0].type).toBe("buff");
  });

  it("should respect module conditions", () => {
    class ConditionalMod extends ModuleBase {
      static type = "conditional";
      static triggers = ["Use"];
      condition({ allowed }) {
        return allowed === true;
      }
      onUse() {
        return { action: "conditional_effect" };
      }
    }
    moduleRegistry.register(ConditionalMod);

    const entity = createEntity({
      id: "cond_test",
      type: "item",
      modules: { conditional: {} },
    });

    const denied = entity.trigger("Use", { allowed: false });
    expect(denied).toHaveLength(0);

    const allowed = entity.trigger("Use", { allowed: true });
    expect(allowed).toHaveLength(1);
    expect(allowed[0].type).toBe("conditional");
  });

  it("should sort by priority (higher first)", () => {
    const results = [];

    class LowMod extends ModuleBase {
      static type = "low";
      static triggers = ["Use"];
      static priority = 0;
      onUse() {
        results.push("low");
        return null;
      }
    }

    class HighMod extends ModuleBase {
      static type = "high";
      static triggers = ["Use"];
      static priority = 100;
      onUse() {
        results.push("high");
        return null;
      }
    }

    moduleRegistry.register(LowMod);
    moduleRegistry.register(HighMod);

    const entity = createEntity({
      id: "priority_test",
      type: "item",
      modules: { low: {}, high: {} },
    });

    entity.trigger("Use", {});
    expect(results).toEqual(["high", "low"]);
  });
});
