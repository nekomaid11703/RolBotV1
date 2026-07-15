// @ts-nocheck
require("dotenv").config({ path: require("path").join(__dirname, "../../.env.local") });

const OWNER_PHONE = process.env.OWNER_PHONE || "";
const OWNER_ALIASES = (process.env.OWNER_ALIASES || "").split(",").filter(Boolean);

module.exports = {
  OWNERS: OWNER_PHONE
    ? [
        {
          phone: OWNER_PHONE,
          displayName: "NEKOMAID",
          aliases: OWNER_ALIASES.length > 0 ? OWNER_ALIASES : ["129626508685330@lid"],
        },
      ]
    : [],
};
