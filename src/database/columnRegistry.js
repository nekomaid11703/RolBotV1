const { supabase } = require("./supabase");
const { logSystem } = require("../services/loggerService");

const DISCOVERY_TTL = 300000;

/** @type {Record<string, Set<string> | null> | null} */
let cache = null;
let lastDiscovery = 0;

/**
 * @param {boolean} [force]
 * @returns {Promise<Record<string, Set<string> | null>>}
 */
async function discover(force = false) {
  if (!force && cache && Date.now() - lastDiscovery < DISCOVERY_TTL) {
    return cache;
  }

  const tables = ["bot_auth_state", "players", "groups", "group_members", "characters"];
  /** @type {Record<string, Set<string> | null>} */
  const result = {};

  for (const table of tables) {
    try {
      const { data } = await supabase.from(table).select("*").limit(1);
      result[table] = data && data.length > 0 ? new Set(Object.keys(data[0])) : null;
    } catch {
      result[table] = null;
    }
  }

  cache = result;
  lastDiscovery = Date.now();
  return result;
}

/**
 * @param {string} table
 * @param {string} column
 * @returns {boolean}
 */
function hasColumn(table, column) {
  if (!cache || !cache[table]) return true;
  return cache[table].has(column);
}

/**
 * @param {string} table
 * @param {{ [key: string]: unknown } | undefined | null} data
 * @returns {{ [key: string]: unknown }}
 */
function filterExisting(table, data) {
  if (!cache || !cache[table] || !data) return data || {};
  const cols = cache[table];
  /** @type {{ [key: string]: unknown }} */
  const filtered = {};
  let skipped = false;
  for (const [key, value] of Object.entries(data)) {
    if (key === undefined || key === null) continue;
    if (cols.has(key)) {
      filtered[key] = value;
    } else {
      skipped = true;
    }
  }
  if (skipped) {
    const skippedKeys = Object.keys(data).filter((k) => !cols.has(k));
    logSystem(`ColumnRegistry: columnas omitidas en "${table}": ${skippedKeys.join(", ")}`);
  }
  return filtered;
}

module.exports = { discover, hasColumn, filterExisting };
