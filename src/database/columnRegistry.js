const { supabase } = require("./supabase");
const { logSystem } = require("../services/loggerService");

/**
 * @constant DISCOVERY_TTL
 * @type {number}
 */
const DISCOVERY_TTL = 300000;

/**
 * @constant KNOWN_SCHEMA
 * @type {Record<string, string[]>}
 */
const KNOWN_SCHEMA = {
  bot_auth_state: ["session_id", "id", "data"],
  players: ["phone", "username", "money", "activity_messages", "activity_commands", "last_active_at"],
  groups: ["id", "group_jid", "group_name", "total_messages"],
  group_members: ["group_id", "player_phone", "messages_count"],
  characters: [
    "id",
    "player_phone",
    "name",
    "slug",
    "category",
    "raza",
    "clase",
    "rango",
    "nivel",
    "xp",
    "xp_total",
    "is_active",
    "hp_actual",
    "stats",
    "slots",
    "equipped_slots",
    "created_at",
    "updated_at",
  ],
  inventory: ["id", "character_id", "item_id", "quantity", "metadata", "created_at", "updated_at"],
  combat_sessions: [
    "id",
    "is_pve",
    "challenger",
    "defender",
    "current_turn_char_id",
    "status",
    "pending_attack",
    "created_at",
    "last_turn_at",
    "winner_id",
    "rounds",
    "distance",
  ],
};

/** @type {Record<string, Set<string> | null> | null} */
let cache = null;
let lastDiscovery = 0;

/**
 * Descubre las columnas realmente accesibles en la base de datos.
 * @param {boolean} [force]
 * @returns {Promise<Record<string, Set<string> | null>>}
 */
async function discover(force = false) {
  if (!force && cache && Date.now() - lastDiscovery < DISCOVERY_TTL) {
    return cache;
  }

  /**
   * @constant tables
   */
  const tables = Object.keys(KNOWN_SCHEMA);

  /**
   * @constant results
   */
  const results = await Promise.all(
    tables.map(async (table) => {
      /**
       * @constant knownCols
       */
      const knownCols = KNOWN_SCHEMA[table] || [];
      try {
        const { data, error } = await supabase.from(table).select("*").limit(1);
        if (error) return { table, keys: null };
        /**
         * @constant fetchedKeys
         */
        const fetchedKeys = data && data.length > 0 ? Object.keys(data[0]) : [];
        if (fetchedKeys.length > 0) return { table, keys: new Set(fetchedKeys) };

        const probes = await Promise.all(
          knownCols.map(async (column) => {
            const { error: columnError } = await supabase.from(table).select(column).limit(1);
            return columnError ? null : column;
          }),
        );
        const discoveredColumns = /** @type {string[]} */ (probes.filter((column) => typeof column === "string"));
        return { table, keys: new Set(discoveredColumns) };
      } catch {
        return { table, keys: null };
      }
    }),
  );

  /** @type {Record<string, Set<string> | null>} */
  const result = {};
  for (const r of results) result[r.table] = r.keys;

  cache = result;
  lastDiscovery = Date.now();
  return result;
}

/**
 * Check if a column exists in the cache for a given table.
 * @param {string} table - Table name
 * @param {string} column - Column name
 * @returns {boolean} True if the column exists or cache is unavailable
 */
function hasColumn(table, column) {
  if (!cache || !cache[table]) return true;
  return cache[table].has(column);
}

/**
 * Filter an object to only include keys that exist as columns in the table.
 * @param {string} table - Table name
 * @param {*|undefined|null} data - Data object to filter
 * @returns {*} Filtered object with only existing columns
 */
function filterExisting(table, data) {
  if (!cache || !cache[table] || !data) return data || {};
  /**
   * @constant cols
   */
  const cols = cache[table];
  /** @type {*} */
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
    /**
     * @constant skippedKeys
     */
    const skippedKeys = Object.keys(data).filter((k) => !cols.has(k));
    logSystem(`ColumnRegistry: columnas omitidas en "${table}": ${skippedKeys.join(", ")}`);
  }
  return filtered;
}

module.exports = { discover, hasColumn, filterExisting, KNOWN_SCHEMA };
