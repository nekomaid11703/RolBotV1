// @ts-nocheck
const { midnightReview } = require("../src/services/schedulerService");

async function main() {
  await midnightReview(null);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { midnightReview };
