const {
  HABILIDADES,
  TIERS,
  TIER_MULTIPLIERS,
  getHabilidad,
  listarHabilidades,
  habilidadesPorClase,
  habilidadesUniversales,
} = require("../src/data/habilidades");

describe("habilidades — Catálogo", () => {
  it("Tiene al menos 10 habilidades", () => {
    const count = Object.keys(HABILIDADES).length;
    expect(count).toBeGreaterThanOrEqual(12);
  });

  it("Todas las habilidades tienen campos requeridos", () => {
    for (const [id, h] of Object.entries(HABILIDADES)) {
      expect(h.id).toBe(id);
      expect(h.name).toBeTruthy();
      expect(h.description).toBeTruthy();
      expect(["E", "D", "C", "B", "A", "S", "N"]).toContain(h.tier);
      expect(typeof h.duration).toBe("number");
      expect(Array.isArray(h.effects)).toBe(true);
      expect(typeof h.multipliers).toBe("object");
      expect(typeof h.cooldown).toBe("number");
    }
  });
});

describe("habilidades — Tiers", () => {
  it("TIERS tiene E, D, C, B, A, S, N", () => {
    expect(Object.keys(TIERS)).toEqual(["E", "D", "C", "B", "A", "S", "N"]);
  });

  it("Tier E: duración 0, cooldown 0", () => {
    expect(TIERS.E.maxDuration).toBe(0);
    expect(TIERS.E.minCooldown).toBe(0);
    expect(TIERS.E.maxCooldown).toBe(0);
  });

  it("Tier D: duración 1, cooldown 0-1", () => {
    expect(TIERS.D.maxDuration).toBe(1);
    expect(TIERS.D.minCooldown).toBe(0);
    expect(TIERS.D.maxCooldown).toBe(1);
  });

  it("Tier S: duración 5, cooldown 4-5, curación 1.0", () => {
    expect(TIERS.S.maxDuration).toBe(5);
    expect(TIERS.S.maxCura).toBe(1.0);
    expect(TIERS.S.minCooldown).toBe(4);
    expect(TIERS.S.maxCooldown).toBe(5);
  });

  it("TIER_MULTIPLIERS tiene multiplicadores por tier", () => {
    for (const tier of Object.keys(TIERS)) {
      if (tier === "N") continue;
      expect(TIER_MULTIPLIERS[tier]).toBeDefined();
    }
  });

  it("Tier E solo permite ×1.2 para 1 stat", () => {
    expect(TIER_MULTIPLIERS.E[1]).toBe(1.2);
  });

  it("Toda habilidad respeta los límites de duración de su tier", () => {
    for (const [id, h] of Object.entries(HABILIDADES)) {
      const tierDef = TIERS[h.tier];
      if (tierDef.maxDuration === null) continue;
      expect(h.duration).toBeLessThanOrEqual(tierDef.maxDuration);
    }
  });

  it("Toda habilidad respeta los límites de cooldown de su tier", () => {
    for (const [id, h] of Object.entries(HABILIDADES)) {
      const tierDef = TIERS[h.tier];
      if (tierDef.minCooldown === null || tierDef.maxCooldown === null) continue;
      expect(h.cooldown).toBeGreaterThanOrEqual(tierDef.minCooldown);
      expect(h.cooldown).toBeLessThanOrEqual(tierDef.maxCooldown);
    }
  });

  it("Toda habilidad con cura respeta el límite de curación de su tier", () => {
    for (const [id, h] of Object.entries(HABILIDADES)) {
      if (h.cura === undefined) continue;
      const tierDef = TIERS[h.tier];
      if (tierDef.maxCura === null) continue;
      expect(h.cura).toBeLessThanOrEqual(tierDef.maxCura);
    }
  });

  it("Toda habilidad con efectos states respeta maxStates de su tier", () => {
    for (const [id, h] of Object.entries(HABILIDADES)) {
      const tierDef = TIERS[h.tier];
      if (tierDef.maxStates === null) continue;
      expect(h.effects.length).toBeLessThanOrEqual(tierDef.maxStates);
    }
  });

  it("Toda habilidad no-N tiene un multiplier válido en TIER_MULTIPLIERS según su tier y cantidad de stats", () => {
    for (const [id, h] of Object.entries(HABILIDADES)) {
      if (h.tier === "N") continue;
      const statCount = Object.keys(h.multipliers).length;
      if (statCount === 0) continue;
      const expectedMult = TIER_MULTIPLIERS[h.tier]?.[statCount];
      expect(expectedMult).toBeDefined(`${id}: tier ${h.tier} con ${statCount} stat(s) no está en TIER_MULTIPLIERS`);
    }
  });
});

describe("habilidades — getHabilidad", () => {
  it("Devuelve habilidad existente", () => {
    const h = getHabilidad("golpe_fuerte");
    expect(h).toBeDefined();
    expect(h.name).toBe("Golpe Fuerte");
  });

  it("Devuelve null para ID inexistente", () => {
    expect(getHabilidad("inexistente")).toBeNull();
  });
});

describe("habilidades — listarHabilidades", () => {
  it("Devuelve todas las habilidades", () => {
    const list = listarHabilidades();
    expect(list.length).toBe(Object.keys(HABILIDADES).length);
  });
});

describe("habilidades — habilidadesPorClase", () => {
  it("Civil tiene vendas y golpe_firme además de universales", () => {
    const civiles = habilidadesPorClase("civil");
    const ids = civiles.map((h) => h.id);
    expect(ids).toContain("vendas");
    expect(ids).toContain("golpe_firme");
    expect(ids).toContain("golpe_fuerte");
  });

  it("Aventurero tiene ataque_veloz y doble_golpe", () => {
    const av = habilidadesPorClase("aventurero");
    const ids = av.map((h) => h.id);
    expect(ids).toContain("ataque_veloz");
    expect(ids).toContain("doble_golpe");
  });

  it("Ladrón tiene golpe_sombra y evasion", () => {
    const la = habilidadesPorClase("ladron");
    const ids = la.map((h) => h.id);
    expect(ids).toContain("golpe_sombra");
    expect(ids).toContain("evasion");
  });

  it("Comerciante tiene venda_rapida y golpe_astuto", () => {
    const co = habilidadesPorClase("comerciante");
    const ids = co.map((h) => h.id);
    expect(ids).toContain("venda_rapida");
    expect(ids).toContain("golpe_astuto");
  });

  it("Clase inexistente solo devuelve universales", () => {
    const univ = habilidadesPorClase("inexistente");
    for (const h of univ) {
      expect(h.clase).toBe("Universal");
    }
  });
});

describe("habilidades — habilidadesUniversales", () => {
  it("Hay exactamente 4 habilidades universales", () => {
    const univ = habilidadesUniversales();
    const ids = univ.map((h) => h.id).sort();
    expect(ids).toEqual(["acelerar", "golpe_fuerte", "postura", "reflejo"]);
  });

  it("Todas las universales tienen clase 'Universal'", () => {
    for (const h of habilidadesUniversales()) {
      expect(h.clase).toBe("Universal");
    }
  });
});
