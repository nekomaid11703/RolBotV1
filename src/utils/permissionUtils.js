const { OWNERS } = require("../config/permissionsConfig");

function normalizeJid(jid) {
  return String(jid || "").trim().toLowerCase();
}

function isOwner(jid) {
  return OWNERS.includes(
    normalizeJid(jid),
  );
}

module.exports = {
  isOwner,
};