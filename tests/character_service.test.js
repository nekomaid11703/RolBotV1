const { addXp } = require("../src/services/characterService");

describe("characterService — addXp (stub)", () => {
  it("siempre retorna xp: 0, xp_total: 0", async () => {
    const result = await addXp();
    expect(result).toEqual({ xp: 0, xp_total: 0 });
  });

  it("retorna objeto con las propiedades correctas", async () => {
    const result = await addXp();
    expect(result).toHaveProperty("xp");
    expect(result).toHaveProperty("xp_total");
  });
});
