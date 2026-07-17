const { discover } = require("./columnRegistry");
const { logSystem } = require("../services/loggerService");
const { setStoredVersion } = require("./schemaVersion");

const CURRENT_VERSION = "1.0.0";

const DESIRED_SCHEMA = {
  players: ["phone", "username", "money", "activity_messages", "activity_commands", "last_active_at"],
  characters: [
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
  groups: ["id", "group_jid", "group_name", "total_messages"],
  group_members: ["group_id", "player_phone", "messages_count"],
};

/** @type {Record<string, string>} */
const COLUMN_TYPES = {
  "players.phone": "text",
  "players.username": "text",
  "players.money": "bigint DEFAULT 0",
  "players.activity_messages": "bigint DEFAULT 0",
  "players.activity_commands": "bigint DEFAULT 0",
  "players.last_active_at": "timestamptz",
  "characters.id": "bigint",
  "characters.player_phone": "text",
  "characters.name": "text",
  "characters.slug": "text",
  "characters.category": "text DEFAULT 'F'",
  "characters.is_active": "boolean DEFAULT false",
  "characters.stats": "jsonb",
  "characters.slots": "jsonb",
  "characters.created_at": "timestamptz DEFAULT now()",
  "characters.updated_at": "timestamptz DEFAULT now()",
  "groups.id": "bigint",
  "groups.group_jid": "text",
  "groups.group_name": "text",
  "groups.total_messages": "bigint DEFAULT 0",
  "group_members.group_id": "bigint",
  "group_members.player_phone": "text",
  "group_members.messages_count": "bigint DEFAULT 0",
};

/**
 *
 */
async function detectMissingColumns() {
  const registry = await discover(true);
  const missing = [];

  for (const [table, desiredCols] of Object.entries(DESIRED_SCHEMA)) {
    const tableCols = registry[table];
    if (!tableCols) {
      missing.push({ table, column: null, reason: "tabla_no_accesible" });
      continue;
    }
    for (const col of desiredCols) {
      if (!tableCols.has(col)) {
        missing.push({ table, column: col, reason: "no_existe" });
      }
    }
  }

  return missing;
}

/**
 *
 */
async function generateMigrationSQL() {
  const missing = await detectMissingColumns();
  if (missing.length === 0) return { sql: [], missing };

  const statements = [];

  for (const item of missing) {
    if (item.reason !== "no_existe") continue;
    const typeDef = COLUMN_TYPES[`${item.table}.${item.column}`];
    if (!typeDef) continue;
    statements.push(`ALTER TABLE "${item.table}" ADD COLUMN IF NOT EXISTS "${item.column}" ${typeDef};`);
  }

  return { sql: statements, missing };
}

/**
 *
 */
async function logMigrationInfo() {
  const { sql, missing } = await generateMigrationSQL();

  if (missing.length === 0) {
    await logSystem("Migration: todas las columnas esperadas existen en Supabase");
    return { ok: true, sql: [] };
  }

  for (const item of missing) {
    if (item.reason === "tabla_no_accesible") {
      await logSystem(`Migration: tabla "${item.table}" no accesible — verificar permisos`);
    }
  }

  if (sql.length > 0) {
    await logSystem(`Migration: ${sql.length} columna(s) faltante(s) — SQL generado:`);
    for (const stmt of sql) {
      await logSystem(`  ${stmt}`);
    }
  }

  return { ok: sql.length === 0, sql };
}

/**
 *
 */
async function runStartupMigration() {
  const result = await logMigrationInfo();
  await setStoredVersion(CURRENT_VERSION);
  return result;
}

module.exports = {
  detectMissingColumns,
  generateMigrationSQL,
  logMigrationInfo,
  runStartupMigration,
  CURRENT_VERSION,
  DESIRED_SCHEMA,
};
