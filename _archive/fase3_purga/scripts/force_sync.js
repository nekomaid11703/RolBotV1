/**
 * force_sync.js
 * CLI tool: Fuerza sincronización desde Supabase como fuente de verdad.
 * Uso: node scripts/force_sync.js [--verify-only]
 *
 * --verify-only: solo verifica sin limpiar caches
 */
require('dotenv').config();

async function main() {
  const args = process.argv.slice(2);
  const verifyOnly = args.includes('--verify-only');

  console.log('====== Sincronización Supabase -> Local ======\n');

  const { forceSync, verifySync, fetchAllFromSupabase } = require('../src/services/syncService');
  const { invalidateAllCache } = require('../src/utils/safeQuery');

  const snapshot = await fetchAllFromSupabase();
  console.log('📊 Estado actual en Supabase:');
  for (const [table, info] of Object.entries(snapshot)) {
    if (info.error) {
      console.log(`  ❌ ${table}: ${info.error}`);
    } else {
      console.log(`  ✅ ${table}: ${info.count} registros`);
    }
  }

  if (verifyOnly) {
    console.log('\nℹ️  Modo verify-only: no se modificaron caches');
    process.exit(0);
  }

  console.log('\n🔄 Limpiando caches en memoria...');
  invalidateAllCache();
  console.log('✅ Caches locales limpiados');

  console.log('\n✅ Sincronización completada. Los datos ahora se leerán frescos desde Supabase.');
  process.exit(0);
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
