require("dotenv").config();

const assert = require("assert");
const { supabase } = require("../src/database/supabase");

const REQUIRED_TABLES = ["bot_auth_state", "players", "groups", "group_members", "characters"];

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
