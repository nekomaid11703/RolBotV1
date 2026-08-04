// Healthcheck manual contra una instancia real de Supabase.
// NO es parte de la suite Vitest (no coincide con tests/**/*.test.js).
// Forma de uso: node tests/test_supabase_schema.js
require("dotenv").config();

const assert = require("assert");
const { supabase } = require("../src/database/supabase");

const REQUIRED_TABLES = [
  "bot_auth_state",
  "players",
  "groups",
  "group_members",
  "characters",
  "inventory",
  "combat_sessions",
];

const isLocalDummy =
  process.env.SUPABASE_URL === "http://127.0.0.1:54321" || process.env.SUPABASE_URL === "http://localhost:54321";

if (!process.env.SUPABASE_URL || isLocalDummy) {
  console.log("SKIP: sin SUPABASE_URL real configurada (no se ejecuta contra una DB local de pruebas).");
  process.exit(0);
}

async function run() {
  console.log("Validando esquema Supabase requerido por RolBotV1...");

  for (const table of REQUIRED_TABLES) {
    const { error } = await supabase.from(table).select("*").limit(1);

    assert.ifError(error, `No se pudo consultar la tabla requerida "${table}": ${error?.message}`);

    console.log(`OK tabla: ${table}`);
  }

  console.log("Esquema Supabase accesible para el bot.");
}

run().catch((error) => {
  console.error("Fallo test_supabase_schema:", error.message);
  process.exit(1);
});
