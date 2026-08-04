// @ts-nocheck
require("dotenv").config({ path: require("path").join(__dirname, "../../.env.local") });
const { normalizeJid, uniqueStrings } = require("../utils/identityUtils");

const OWNER_PHONE = process.env.OWNER_PHONE || "";
const OWNER_ALIASES = uniqueStrings((process.env.OWNER_ALIASES || "").split(",").map(normalizeJid).filter(Boolean));

module.exports = {
  OWNERS: OWNER_PHONE
    ? [
        {
          phone: OWNER_PHONE,
          displayName: "NEKOMAID",
          aliases: OWNER_ALIASES,
        },
      ]
    : [],
};
