const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    include: ["tests/**/*.test.js"],
    testTimeout: 10000,
    globals: true,
    env: {
      DOTENV_CONFIG_QUIET: "true",
      SUPABASE_URL: "http://127.0.0.1:54321",
      SUPABASE_SERVICE_ROLE_KEY: "test-only-key",
    },
  },
});
