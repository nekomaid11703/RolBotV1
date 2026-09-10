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
