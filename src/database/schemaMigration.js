const { discover } = require("./columnRegistry");
const { supabase } = require("./supabase");
const { logSystem } = require("../services/loggerService");
const { setStoredVersion, CURRENT_VERSION } = require("./schemaVersion");

const DESIRED_SCHEMA = {
  players: ["phone", "username", "money", "activity_messages", "activity_commands", "last_active_at"],
  characters: [
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
  groups: ["id", "group_jid", "group_name", "total_messages"],
  group_members: ["group_id", "player_phone", "messages_count"],
  inventory: ["id", "character_id", "item_id", "quantity", "created_at", "updated_at"],
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
  ],
};

const TABLE_CREATE_SQL = {
  combat_sessions: `
    CREATE TABLE IF NOT EXISTS "combat_sessions" (
      "id" TEXT PRIMARY KEY,
      "is_pve" BOOLEAN DEFAULT false,
      "challenger" JSONB NOT NULL,
      "defender" JSONB NOT NULL,
      "current_turn_char_id" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'waiting_action',
      "pending_attack" JSONB,
      "created_at" BIGINT NOT NULL,
      "last_turn_at" BIGINT NOT NULL,
      "winner_id" TEXT,
      "rounds" INTEGER DEFAULT 0
    );
  `,
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
  "characters.raza": "text DEFAULT 'humano'",
  "characters.clase": "text DEFAULT 'civil'",
  "characters.rango": "text DEFAULT 'F'",
  "characters.nivel": "integer DEFAULT 20",
  "characters.xp": "integer DEFAULT 0",
  "characters.xp_total": "integer DEFAULT 0",
  "characters.is_active": "boolean DEFAULT false",
  "characters.hp_actual": "integer DEFAULT 100",
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
  "inventory.id": "bigint",
  "inventory.character_id": "bigint",
  "inventory.item_id": "text",
  "inventory.quantity": "integer DEFAULT 0",
  "inventory.created_at": "timestamptz DEFAULT now()",
  "inventory.updated_at": "timestamptz DEFAULT now()",
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
async function createMissingTables() {
  const registry = await discover(true);
  const created = [];

  for (const [table, sql] of Object.entries(TABLE_CREATE_SQL)) {
    if (registry[table] && registry[table].size > 0) continue;

    try {
      const { error } = await supabase.rpc("exec_sql", { query: sql });
      if (error) {
        await logSystem(`Migration: error creando tabla "${table}": ${error.message}`);
      } else {
        await logSystem(`Migration: tabla "${table}" creada`);
        created.push(table);
      }
    } catch (err) {
      await logSystem(`Migration: error creando tabla "${table}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return created;
}

/**
 *
 */
async function runStartupMigration() {
  await createMissingTables();
  const result = await logMigrationInfo();
  await setStoredVersion(CURRENT_VERSION);
  return result;
}

module.exports = {
  runStartupMigration,
};
