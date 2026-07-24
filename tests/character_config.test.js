const {
  LEVELABLE_STATS,
  HP_MAX,
  DEFAULT_CHARACTER_STATS,
  RACES,
  LEVEL_INITIAL,
  LEVEL_MAX,
  FREE_POINTS_AT_CREATION,
  XP_CURVE_BASE,
  XP_CURVE_EXPONENT,
  xpForNextLevel,
  calculateLevel,
  RANGOS,

  MAX_CHARACTER_NAME_LENGTH,
  MAX_CHARACTERS_PER_USER,
} = require("../src/config/characterConfig");
const { CLASES } = require("../src/data/clases");

describe("characterConfig — Stats", () => {
  it("LEVELABLE_STATS contiene 9 stats", () => {
    expect(Object.keys(LEVELABLE_STATS)).toHaveLength(9);
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

  it("DEFAULT_CHARACTER_STATS tiene todas las stats en 1", () => {
    expect(DEFAULT_CHARACTER_STATS.hp).toBe(1);
    expect(DEFAULT_CHARACTER_STATS.atk).toBe(1);
    expect(DEFAULT_CHARACTER_STATS.def).toBe(1);
    expect(DEFAULT_CHARACTER_STATS.aspd).toBe(1);
    expect(DEFAULT_CHARACTER_STATS.ref).toBe(1);
    expect(DEFAULT_CHARACTER_STATS.mspd).toBe(1);
    expect(DEFAULT_CHARACTER_STATS.fulgor).toBe(1);
    expect(DEFAULT_CHARACTER_STATS.d_fulgor).toBe(1);
    expect(DEFAULT_CHARACTER_STATS.r_fulgor).toBe(1);
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

  it("Todas las razas tienen baseStats que suman exactamente 50", () => {
    const statKeys = Object.keys(LEVELABLE_STATS);
    for (const [id, race] of Object.entries(RACES)) {
      const sum = statKeys.reduce((acc, k) => acc + (race.baseStats[k] || 0), 0);
      expect(sum).toBe(50);
    }
  });

  it("Todas las razas tienen exactamente las 9 stats levelables en baseStats", () => {
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

describe("data/clases — Clases", () => {
  it("Existen 4 clases", () => {
    expect(Object.keys(CLASES)).toHaveLength(4);
  });

  it("Todas las clases tienen name, description, baseStats", () => {
    for (const [id, cls] of Object.entries(CLASES)) {
      expect(cls.name).toBeTruthy();
      expect(cls.description).toBeTruthy();
      expect(cls.baseStats).toBeDefined();
    }
  });
});

describe("characterConfig — Niveles", () => {
  it("LEVEL_INITIAL es 100", () => {
    expect(LEVEL_INITIAL).toBe(100);
  });

  it("LEVEL_MAX es 500", () => {
    expect(LEVEL_MAX).toBe(500);
  });

  it("FREE_POINTS_AT_CREATION es 50", () => {
    expect(FREE_POINTS_AT_CREATION).toBe(50);
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
  it("Suma de stats 20 da nivel minimo 100", () => {
    expect(calculateLevel({ atk: 3, def: 3, aspd: 3, ref: 3, mspd: 3, fulgor: 2, d_fulgor: 2, r_fulgor: 1 })).toBe(100);
  });

  it("Suma de stats 100 da nivel 100", () => {
    expect(
      calculateLevel({ atk: 13, def: 13, aspd: 13, ref: 13, mspd: 13, fulgor: 12, d_fulgor: 12, r_fulgor: 11 }),
    ).toBe(100);
  });

  it("Suma de stats 150 da nivel 150", () => {
    expect(
      calculateLevel({ atk: 19, def: 19, aspd: 19, ref: 19, mspd: 19, fulgor: 18, d_fulgor: 18, r_fulgor: 19 }),
    ).toBe(150);
  });

  it("Nunca devuelve menos de LEVEL_INITIAL (100)", () => {
    expect(calculateLevel({ atk: 0, def: 0, aspd: 0, ref: 0, mspd: 0, fulgor: 0, d_fulgor: 0, r_fulgor: 0 })).toBe(100);
    expect(calculateLevel({})).toBe(100);
  });

  it("Stats no definidas se tratan como 0", () => {
    expect(calculateLevel({ atk: 10 })).toBe(100);
  });
});

describe("characterConfig — Rango", () => {
  it("RANGOS tiene 7 categorías", () => {
    expect(RANGOS).toEqual(["F", "E", "D", "C", "B", "A", "S"]);
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
