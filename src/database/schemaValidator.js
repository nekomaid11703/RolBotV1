const { supabase } = require("./supabase");
const { logSystem, logError } = require("../services/loggerService");
const { discover } = require("./columnRegistry");
const { checkVersion } = require("./schemaVersion");

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
      "category",
      "is_active",
      "stats",
      "slots",
      "created_at",
      "updated_at",
    ],
  },
};

const CRITICAL_EQUALS_COLUMNS = {
  players: ["phone"],
  characters: ["player_phone", "slug", "is_active"],
  groups: ["group_jid"],
  group_members: ["group_id", "player_phone"],
  bot_auth_state: ["session_id", "id"],
};

/**
 *
 */
async function checkHealth() {
  /** @type {string[]} */ const errors = [];
  /** @type {string[]} */ const warnings = [];

  await discover(true);

  for (const [table, { columns }] of Object.entries(SCHEMA)) {
    try {
      const { data, error } = await supabase.from(table).select("*").limit(1);
      if (error) {
        errors.push(`Tabla "${table}" inaccesible: ${error.message}`);
        continue;
      }

      if (data && data.length > 0) {
        const row = data[0];
        const missing = columns.filter((col) => !(col in row));
        if (missing.length > 0) {
          warnings.push(`Tabla "${table}" sin columnas esperadas: ${missing.join(", ")}`);
        }
      }
    } catch (err) {
      errors.push(`Tabla "${table}" error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  for (const [table, eqCols] of Object.entries(CRITICAL_EQUALS_COLUMNS)) {
    for (const col of eqCols) {
      const { error } = await supabase.from(table).select(col).limit(1);
      if (error && error.code === "PGRST204") {
        warnings.push(`CRÍTICO: columna "${col}" en "${table}" usada en .eq() no existe en DB`);
      }
    }
  }

  return { errors, warnings };
}

/**
 *
 */
async function verifyStartup() {
  /** @type {{ ok: boolean, errors: string[], warnings: string[] }} */
  const results = { ok: true, errors: [], warnings: [] };

  const versionResult = await checkVersion();
  if (!versionResult.ok) {
    results.warnings.push(`SchemaVersion desajustado: DB=${versionResult.stored}, código=${versionResult.current}`);
  }

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

module.exports = { checkHealth, verifyStartup, SCHEMA };
