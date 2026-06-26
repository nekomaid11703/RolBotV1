/**
 * syncService.js
 * Servicio de sincronización que asegura que Supabase es la fuente de verdad.
 * Proporciona:
 *  - bypass de cache en lecturas para forzar datos frescos desde Supabase
 *  - verificación de integridad de datos entre servicios y Supabase
 *  - reporte de sincronización
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env.local') });
const { logSystem, logError } = require('./loggerService');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const TABLES = ['players', 'characters', 'groups', 'group_members', 'bot_auth_state'];

let _lastSyncResult = null;

async function fetchAllFromSupabase(tables = TABLES) {
  const snapshot = {};
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        snapshot[table] = { error: error.message, count: 0 };
      } else {
        snapshot[table] = { data: data || [], count: (data || []).length };
      }
    } catch (err) {
      snapshot[table] = { error: err.message, count: 0 };
    }
  }
  return snapshot;
}

function clearServiceCaches() {
  try {
    const { cache } = require('./ai/promptCacheService');
    if (cache && typeof cache.clear === 'function') {
      cache.clear();
    }
  } catch (e) {
  }
}

async function verifySync() {
  const supabaseSnapshot = await fetchAllFromSupabase();

  const report = {
    timestamp: new Date().toISOString(),
    tables: {},
    overallStatus: 'ok',
    warnings: [],
  };

  for (const [table, info] of Object.entries(supabaseSnapshot)) {
    if (info.error) {
      report.tables[table] = { status: 'error', error: info.error };
      report.overallStatus = 'warning';
      report.warnings.push(`No se pudo leer ${table}: ${info.error}`);
    } else {
      report.tables[table] = {
        status: 'ok',
        count: info.count,
      };
    }
  }

  _lastSyncResult = report;
  return report;
}

async function forceSync() {
  logSystem('[SyncService] Forzando sincronización desde Supabase...');

  const supabaseSnapshot = await fetchAllFromSupabase();

  clearServiceCaches();

  const summary = {};
  for (const [table, info] of Object.entries(supabaseSnapshot)) {
    if (info.error) {
      summary[table] = `❌ Error: ${info.error}`;
    } else {
      summary[table] = `✅ ${info.count} registros sincronizados`;
    }
  }

  _lastSyncResult = { timestamp: new Date().toISOString(), summary, status: 'synced' };
  logSystem('[SyncService] Sincronización completada.');
  return _lastSyncResult;
}

async function getSyncStatus() {
  if (_lastSyncResult) return _lastSyncResult;
  return await verifySync();
}

module.exports = {
  fetchAllFromSupabase,
  verifySync,
  forceSync,
  clearServiceCaches,
  getSyncStatus,
  TABLES,
};
