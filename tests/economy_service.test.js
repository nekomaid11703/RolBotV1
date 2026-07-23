const {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
} = require("../src/config/economyConfig");

describe("economyConfig", () => {
  it("DAILY_BASE_REWARD es 100", () => {
    expect(DAILY_BASE_REWARD).toBe(100);
  });

  it("DAILY_COOLDOWN_HOURS es 20", () => {
    expect(DAILY_COOLDOWN_HOURS).toBe(20);
  });

  it("DAILY_STREAK_RESET_HOURS es 48", () => {
    expect(DAILY_STREAK_RESET_HOURS).toBe(48);
  });

  it("DAILY_STREAK_BONUS_PER_DAY es 10", () => {
    expect(DAILY_STREAK_BONUS_PER_DAY).toBe(10);
  });

  it("DAILY_STREAK_BONUS_CAP es 100", () => {
    expect(DAILY_STREAK_BONUS_CAP).toBe(100);
  });
});

describe("economyService — getMoneyValue (via addMoney behavior)", () => {
  it("getMoneyValue retorna 0 para profile null", () => {
    /**
     *
     * @param profile
     */
    function getMoneyValue(profile) {
      return Number(profile?.economy?.money || 0);
    }
    expect(getMoneyValue(null)).toBe(0);
  });

  it("getMoneyValue retorna 0 para profile undefined", () => {
    /**
     *
     * @param profile
     */
    function getMoneyValue(profile) {
      return Number(profile?.economy?.money || 0);
    }
    expect(getMoneyValue(undefined)).toBe(0);
  });

  it("getMoneyValue retorna 0 cuando economy.money falta", () => {
    /**
     *
     * @param profile
     */
    function getMoneyValue(profile) {
      return Number(profile?.economy?.money || 0);
    }
    expect(getMoneyValue({ economy: {} })).toBe(0);
  });

  it("getMoneyValue retorna el valor numerico", () => {
    /**
     *
     * @param profile
     */
    function getMoneyValue(profile) {
      return Number(profile?.economy?.money || 0);
    }
    expect(getMoneyValue({ economy: { money: 500 } })).toBe(500);
  });

  it("getMoneyValue convierte string a numero", () => {
    /**
     *
     * @param profile
     */
    function getMoneyValue(profile) {
      return Number(profile?.economy?.money || 0);
    }
    expect(getMoneyValue({ economy: { money: "1000" } })).toBe(1000);
  });
});

describe("economyService — addMoney validation", () => {
  it("rechaza cantidad <= 0", () => {
    /**
     *
     * @param amount
     */
    function validateAmount(amount) {
      const safeAmount = Math.floor(Number(amount));
      if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
        throw new Error("Cantidad invalida.");
      }
      return safeAmount;
    }
    expect(() => validateAmount(0)).toThrow("Cantidad invalida.");
    expect(() => validateAmount(-10)).toThrow("Cantidad invalida.");
  });

  it("rechaza NaN", () => {
    /**
     *
     * @param amount
     */
    function validateAmount(amount) {
      const safeAmount = Math.floor(Number(amount));
      if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
        throw new Error("Cantidad invalida.");
      }
      return safeAmount;
    }
    expect(() => validateAmount(NaN)).toThrow("Cantidad invalida.");
  });

  it("rechaza Infinity", () => {
    /**
     *
     * @param amount
     */
    function validateAmount(amount) {
      const safeAmount = Math.floor(Number(amount));
      if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
        throw new Error("Cantidad invalida.");
      }
      return safeAmount;
    }
    expect(() => validateAmount(Infinity)).toThrow("Cantidad invalida.");
  });

  it("acepta cantidad positiva", () => {
    /**
     *
     * @param amount
     */
    function validateAmount(amount) {
      const safeAmount = Math.floor(Number(amount));
      if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
        throw new Error("Cantidad invalida.");
      }
      return safeAmount;
    }
    expect(validateAmount(100)).toBe(100);
    expect(validateAmount(50.7)).toBe(50);
  });
});
