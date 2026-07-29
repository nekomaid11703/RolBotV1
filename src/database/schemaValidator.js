const { supabase } = require("./supabase");
const { logSystem, logError } = require("../services/loggerService");
const { discover } = require("./columnRegistry");
const { checkVersion } = require("./schemaVersion");

/**
 * @constant SCHEMA
 * @type {Record<string, {columns: string[]}>}
 */
const SCHEMA = {
  bot_auth_state: { columns: ["session_id", "id", "data"] },
  players: { columns: ["phone", "username", "money", "activity_messages", "activity_commands", "last_active_at"] },
  groups: { columns: ["id", "group_jid", "group_name", "total_messages"] },
  group_members: { columns: ["group_id", "player_phone", "messages_count"] },
  characters: {
    columns: [
      "id",
      "player_phone",
      "name",
      "slug",
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
      "created_at",
      "updated_at",
    ],
  },
  inventory: {
    columns: ["id", "character_id", "item_id", "quantity", "created_at", "updated_at"],
  },
};

/**
 * @constant CRITICAL_EQUALS_COLUMNS
 * @type {Record<string, string[]>}
 */
const CRITICAL_EQUALS_COLUMNS = {
  players: ["phone"],
  characters: ["player_phone", "slug", "is_active"],
  inventory: ["character_id", "item_id"],
  groups: ["group_jid"],
  group_members: ["group_id", "player_phone"],
  bot_auth_state: ["session_id", "id"],
};

/**
 * Check database schema health by validating tables and critical columns.
 * @returns {Promise<{errors: string[], warnings: string[]}>} Health check results
 */
async function checkHealth() {
  const [tableResults, colResults] = await Promise.all([
    Promise.all(
      Object.entries(SCHEMA).map(async ([table, { columns }]) => {
        try {
          const { data, error } = await supabase.from(table).select("*").limit(1);
          if (error) return `Tabla "${table}" inaccesible: ${error.message}`;
          if (data && data.length > 0) {
            /**
             * @constant missing
             */
            const missing = columns.filter((col) => !(col in data[0]));
            if (missing.length > 0)
              return { warn: true, msg: `Tabla "${table}" sin columnas esperadas: ${missing.join(", ")}` };
          }
          return null;
        } catch (err) {
          return `Tabla "${table}" error: ${err instanceof Error ? err.message : String(err)}`;
        }
      }),
    ),
    Promise.all(
      Object.entries(CRITICAL_EQUALS_COLUMNS).flatMap(([table, eqCols]) =>
        eqCols.map(async (col) => {
          const { error } = await supabase.from(table).select(col).limit(1);
          if (error && error.code === "PGRST204")
            return `CRÍTICO: columna "${col}" en "${table}" usada en .eq() no existe en DB`;
          return null;
        }),
      ),
    ),
  ]);

  const errors = [];
  const warnings = [];

  for (const r of tableResults) {
    if (!r) continue;
    if (typeof r === "string") errors.push(r);
    else warnings.push(r.msg);
  }
  for (const r of colResults) {
    if (r) warnings.push(r);
  }

  return { errors, warnings };
}

/**
 * Verify schema on startup, checking version and health.
 * @returns {Promise<{ok: boolean, errors: string[], warnings: string[]}>} Verification results
 */
async function verifyStartup() {
  /** @type {{ ok: boolean, errors: string[], warnings: string[] }} */
  const results = { ok: true, errors: [], warnings: [] };

  /**
   * @constant versionResult
   */
  const versionResult = await checkVersion();
  if (!versionResult.ok) {
    results.warnings.push(`SchemaVersion desajustado: DB=${versionResult.stored}, código=${versionResult.current}`);
  }

  /**
   * @constant health
   */
  const health = await checkHealth();
  results.errors.push(...health.errors);
  results.warnings.push(...health.warnings);

  for (const w of results.warnings) {
    await logSystem(`SchemaWarning: ${w}`);
  }

  if (results.errors.length > 0) {
    results.ok = false;
    for (const e of results.errors) {
      await logError({ source: "schemaValidator", error: new Error(e) });
    }
    await logSystem(`SchemaValidator: ${results.errors.length} error(es) — el bot continuará`);
  } else {
    await logSystem(`SchemaValidator: ${Object.keys(SCHEMA).length} tablas OK, version ${versionResult.current}`);
  }

  return results;
}

module.exports = { verifyStartup };
