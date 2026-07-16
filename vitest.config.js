const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    include: ["tests/**/*.test.js"],
    testTimeout: 10000,
    globals: true,
    sequence: { concurrent: false },
    env: {
      NODE_ENV: "test",
    },
  },
});
