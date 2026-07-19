const {
  LEVELABLE_STATS,
  HP_MAX,
  DEFAULT_CHARACTER_STATS,
  RACES,
  CLASSES,
  LEVEL_INITIAL,
  LEVEL_MAX,
  FREE_POINTS_AT_CREATION,
  XP_CURVE_BASE,
  XP_CURVE_EXPONENT,
  xpForNextLevel,
  calculateLevel,
  RANGOS,
  HP_THRESHOLDS,
  getHpState,
  maxSkillSlots,
  SKILL_SLOTS_BY_LEVEL,
  MAX_CHARACTER_NAME_LENGTH,
  MAX_CHARACTERS_PER_USER,
} = require("../src/config/characterConfig");

describe("characterConfig — Stats", () => {
  it("LEVELABLE_STATS contiene 5 stats", () => {
    expect(Object.keys(LEVELABLE_STATS)).toHaveLength(5);
  });

  it("Cada stat tiene label, name, min, max, icon", () => {
    for (const [key, cfg] of Object.entries(LEVELABLE_STATS)) {
      expect(cfg).toHaveProperty("label");
      expect(cfg).toHaveProperty("name");
      expect(cfg).toHaveProperty("min");
      expect(cfg).toHaveProperty("max");
      expect(cfg).toHaveProperty("icon");
      expect(cfg.min).toBeGreaterThanOrEqual(0);
      expect(cfg.max).toBeGreaterThan(cfg.min);
    }
  });

  it("HP_MAX es 100", () => {
    expect(HP_MAX).toBe(100);
  });

  it("DEFAULT_CHARACTER_STATS tiene hp y las 5 stats en 0", () => {
    expect(DEFAULT_CHARACTER_STATS.hp).toBe(HP_MAX);
    expect(DEFAULT_CHARACTER_STATS.str).toBe(0);
    expect(DEFAULT_CHARACTER_STATS.def).toBe(0);
    expect(DEFAULT_CHARACTER_STATS.spd_atk).toBe(0);
    expect(DEFAULT_CHARACTER_STATS.ref).toBe(0);
    expect(DEFAULT_CHARACTER_STATS.spd_mov).toBe(0);
  });
});

describe("characterConfig — Razas", () => {
  it("Existe al menos la raza humano", () => {
    expect(RACES.humano).toBeDefined();
    expect(RACES.humano.name).toBe("Humano");
  });

  it("Todas las razas tienen name, description, baseStats", () => {
    for (const [id, race] of Object.entries(RACES)) {
      expect(race.name).toBeTruthy();
      expect(race.description).toBeTruthy();
      expect(race.baseStats).toBeDefined();
    }
  });

  it("Todas las razas tienen baseStats que suman exactamente 10", () => {
    const statKeys = Object.keys(LEVELABLE_STATS);
    for (const [id, race] of Object.entries(RACES)) {
      const sum = statKeys.reduce((acc, k) => acc + (race.baseStats[k] || 0), 0);
      expect(sum).toBe(10);
    }
  });

  it("Todas las razas tienen exactamente las 5 stats levelables en baseStats", () => {
    const statKeys = Object.keys(LEVELABLE_STATS);
    for (const [id, race] of Object.entries(RACES)) {
      const existing = Object.keys(race.baseStats);
      for (const key of statKeys) {
        expect(existing).toContain(key);
      }
      for (const key of existing) {
        expect(statKeys).toContain(key);
      }
    }
  });
});

describe("characterConfig — Clases", () => {
  it("Existen 4 clases", () => {
    expect(Object.keys(CLASSES)).toHaveLength(4);
  });

  it("Todas las clases tienen skillsByLevel con nivel 20", () => {
    for (const [id, cls] of Object.entries(CLASSES)) {
      expect(cls.skillsByLevel[20]).toBeDefined();
    }
  });
});

describe("characterConfig — Niveles", () => {
  it("LEVEL_INITIAL es 20", () => {
    expect(LEVEL_INITIAL).toBe(20);
  });

  it("LEVEL_MAX es 500", () => {
    expect(LEVEL_MAX).toBe(500);
  });

  it("FREE_POINTS_AT_CREATION es 10", () => {
    expect(FREE_POINTS_AT_CREATION).toBe(10);
  });

  it("XP_CURVE_BASE es 10 y XP_CURVE_EXPONENT es 1.2", () => {
    expect(XP_CURVE_BASE).toBe(10);
    expect(XP_CURVE_EXPONENT).toBe(1.2);
  });
});

describe("characterConfig — xpForNextLevel", () => {
  it("Nivel 20 requiere 364 XP", () => {
    expect(xpForNextLevel(20)).toBe(364);
  });

  it("Nivel 30 requiere 592 XP", () => {
    expect(xpForNextLevel(30)).toBe(592);
  });

  it("Nivel 50 requiere 1093 XP", () => {
    expect(xpForNextLevel(50)).toBe(1093);
  });

  it("Nivel 100 requiere 2511 XP", () => {
    expect(xpForNextLevel(100)).toBe(2511);
  });
});

describe("characterConfig — calculateLevel", () => {
  it("Suma de stats 20 da nivel 20", () => {
    expect(calculateLevel({ str: 4, def: 4, spd_atk: 4, ref: 4, spd_mov: 4 })).toBe(20);
  });

  it("Suma de stats 25 da nivel 25", () => {
    expect(calculateLevel({ str: 5, def: 5, spd_atk: 5, ref: 5, spd_mov: 5 })).toBe(25);
  });

  it("Nunca devuelve menos de LEVEL_INITIAL (20)", () => {
    expect(calculateLevel({ str: 0, def: 0, spd_atk: 0, ref: 0, spd_mov: 0 })).toBe(20);
    expect(calculateLevel({})).toBe(20);
  });

  it("Stats no definidas se tratan como 0", () => {
    expect(calculateLevel({ str: 10 })).toBe(20);
  });
});

describe("characterConfig — Rango", () => {
  it("RANGOS tiene 7 categorías", () => {
    expect(RANGOS).toEqual(["F", "E", "D", "C", "B", "A", "S"]);
  });
});

describe("characterConfig — HP Thresholds", () => {
  it("HP 100 es Óptimas con penalización 0", () => {
    const state = getHpState(100);
    expect(state.name).toBe("Óptimas");
    expect(state.penalty).toBe(0);
  });

  it("HP 50 es Lastimado con penalización 0.2", () => {
    const state = getHpState(50);
    expect(state.name).toBe("Lastimado");
    expect(state.penalty).toBe(0.2);
  });

  it("HP 30 es Incapacitado con penalización 0.5", () => {
    const state = getHpState(30);
    expect(state.name).toBe("Incapacitado");
    expect(state.penalty).toBe(0.5);
  });

  it("HP 10 es K.O. con penalización 1.0", () => {
    const state = getHpState(10);
    expect(state.name).toBe("K.O.");
    expect(state.penalty).toBe(1.0);
  });

  it("HP 0 es Muerto", () => {
    const state = getHpState(0);
    expect(state.name).toBe("Muerto");
  });

  it("Cubre todos los rangos de 0 a 100 sin huecos", () => {
    for (let hp = 0; hp <= 100; hp++) {
      const state = getHpState(hp);
      expect(state).toBeDefined();
      expect(state.name).toBeTruthy();
      expect(typeof state.penalty).toBe("number");
    }
  });

  it("HP negativo cae en Muerto (último threshold)", () => {
    expect(getHpState(-5).name).toBe("Muerto");
  });
});

describe("characterConfig — Skill Slots", () => {
  it("SKILL_SLOTS_BY_LEVEL tiene 9 entradas", () => {
    expect(SKILL_SLOTS_BY_LEVEL).toHaveLength(9);
  });

  it("Nivel 20 da 2 slots", () => {
    expect(maxSkillSlots(20)).toBe(2);
  });

  it("Nivel 48 da 3 slots", () => {
    expect(maxSkillSlots(48)).toBe(3);
  });

  it("Nivel 76 da 4 slots", () => {
    expect(maxSkillSlots(76)).toBe(4);
  });

  it("Nivel 105 da 5 slots", () => {
    expect(maxSkillSlots(105)).toBe(5);
  });

  it("Nivel 250 da 10 slots (máximo)", () => {
    expect(maxSkillSlots(250)).toBe(10);
  });

  it("Nivel menor a 20 da 1 slot", () => {
    expect(maxSkillSlots(10)).toBe(1);
  });

  it("Nivel sobre 250 mantiene 10 slots", () => {
    expect(maxSkillSlots(500)).toBe(10);
  });
});

describe("characterConfig — Límites", () => {
  it("MAX_CHARACTER_NAME_LENGTH es 40", () => {
    expect(MAX_CHARACTER_NAME_LENGTH).toBe(40);
  });

  it("MAX_CHARACTERS_PER_USER es 5", () => {
    expect(MAX_CHARACTERS_PER_USER).toBe(5);
  });
});
