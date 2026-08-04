/**
 * cleanup-temp-items.js — Elimina ítems temporales huérfanos del inventario.
 * Uso: node scripts/cleanup-temp-items.js [--dry] [--character <id>]
 *   --dry           solo muestra qué se eliminaría (por defecto)
 *   --apply         ejecuta la limpieza real
 *   --character id  limita a un personaje (opcional)
 */
const { supabase } = require("../src/database/supabase");

/**
 * @constant TEMP_PREFIXES
 * @type {string[]}
 */
const TEMP_PREFIXES = ["venda_temp", "pocion_temp", "tonico_temp"];

/**
 * Reporta en consola (CLI legible, independiente del logger de pino).
 * @param {string} msg
 */
function say(msg) {
  process.stdout.write(`${msg}\n`);
}

async function main() {
  const args = process.argv.slice(2);
  const dry = !args.includes("--apply");
  const charIdx = args.indexOf("--character");
  const characterId = charIdx >= 0 ? args[charIdx + 1] : null;

  let query = supabase.from("inventory").select("id, character_id, item_id, quantity").in("item_id", TEMP_PREFIXES);
  if (characterId) query = query.eq("character_id", characterId);

  const { data: rows, error } = await query;
  if (error) {
    say(`cleanup-temp-items: error consultando inventario: ${error.message}`);
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    say("cleanup-temp-items: sin ítems temporales para limpiar");
    return;
  }

  say(`cleanup-temp-items: ${rows.length} ítem(s) temporal(es) ${dry ? "(DRY RUN)" : ""}`);
  for (const r of rows) {
    say(`  - [${r.character_id}] ${r.item_id} x${r.quantity} (id=${r.id})`);
  }

  if (dry) {
    say("cleanup-temp-items: ejecuta con --apply para borrar");
    return;
  }

  const ids = rows.map((r) => r.id);
  const { error: delError } = await supabase.from("inventory").delete().in("id", ids);
  if (delError) {
    say(`cleanup-temp-items: error eliminando: ${delError.message}`);
    process.exit(1);
  }
  say(`cleanup-temp-items: ${ids.length} ítem(s) eliminado(s)`);
}

main();
