const { cachedRead, cache } = require("../src/utils/safeQuery");

describe("cachedRead", () => {
  beforeEach(() => {
    cache.clear();
  });

  it.each([null, false, 0, ""])('reutiliza el valor cacheado "%s"', async (value) => {
    let calls = 0;
    const fetch = async () => {
      calls++;
      return value;
    };

    await expect(cachedRead({ key: `falsey:${String(value)}`, fetch, ttl: 1000 })).resolves.toBe(value);
    await expect(cachedRead({ key: `falsey:${String(value)}`, fetch, ttl: 1000 })).resolves.toBe(value);
    expect(calls).toBe(1);
  });
});
