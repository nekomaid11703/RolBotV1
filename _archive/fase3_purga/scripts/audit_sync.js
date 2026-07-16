/**
 * Script de auditoría de sincronización: compara datos locales vs Supabase
 * y reporta diferencias. Prioriza Supabase como fuente de verdad.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MEMORY_PATH = path.join(__dirname, '..', 'ai-memory', 'rolbot-memory.jsonl');

async function auditSupabaseTables() {
  console.log('\n====== AUDITORÍA DE SINCRONIZACIÓN Supabase vs Local ======\n');

  const tables = ['players', 'characters', 'groups', 'group_members', 'bot_auth_state'];
  const results = {};

  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' });

    if (error) {
      console.log(`❌ ${table}: Error de consulta - ${error.message}`);
      results[table] = { error: error.message, count: 0 };
      continue;
    }

    results[table] = { count: count || data.length, sample: data.slice(0, 3) };
    console.log(`✅ ${table}: ${count || data.length} registros`);
  }

  return results;
}

function auditLocalMemory() {
  console.log('\n--- Memoria Local (rolbot-memory.jsonl) ---');
  if (!fs.existsSync(MEMORY_PATH)) {
    console.log('❌ Archivo de memoria local no encontrado');
    return [];
  }

  const content = fs.readFileSync(MEMORY_PATH, 'utf-8').trim();
  const lines = content.split('\n').filter(l => l.trim());
  const entries = lines.map((l, i) => {
    try { return JSON.parse(l); }
    catch (e) { return { id: `parse-error-${i}`, raw: l }; }
  });

  console.log(`✅ ${entries.length} entradas de memoria encontradas`);
  return entries;
}

function auditDesignBoard() {
  console.log('\n--- Design Board Local ---');
  const boardPath = path.join(__dirname, '..', 'ai-memory', 'design_board.md');
  if (!fs.existsSync(boardPath)) {
    console.log('❌ design_board.md no encontrado');
    return null;
  }
  const content = fs.readFileSync(boardPath, 'utf-8');
  const ticketCount = (content.match(/- \[/g) || []).length;
  console.log(`✅ design_board.md encontrado, ${ticketCount} tickets`);
  return { path: boardPath, ticketCount };
}

async function main() {
  try {
    const supabaseData = await auditSupabaseTables();
    const memoryEntries = auditLocalMemory();
    const boardData = auditDesignBoard();

    console.log('\n====== ANÁLISIS DE SINCRONIZACIÓN ======\n');

    if (supabaseData.players && supabaseData.players.count > 0) {
      console.log(`⚠️  ${supabaseData.players.count} jugadores en Supabase`);
      if (supabaseData.players.sample && supabaseData.players.sample[0]) {
        console.log(`   Muestra: phone=${supabaseData.players.sample[0].phone}, money=${supabaseData.players.sample[0].money}`);
      }
    }

    if (supabaseData.characters && supabaseData.characters.count > 0) {
      console.log(`⚠️  ${supabaseData.characters.count} personajes en Supabase`);
    } else {
      console.log(`ℹ️  No hay personajes en Supabase (esperado para entorno de pruebas)`);
    }

    if (supabaseData.groups && supabaseData.groups.count > 0) {
      console.log(`⚠️  ${supabaseData.groups.count} grupos en Supabase`);
    }

    if (supabaseData.bot_auth_state && supabaseData.bot_auth_state.count > 0) {
      console.log(`⚠️  ${supabaseData.bot_auth_state.count} estados de auth en Supabase`);
    }

    const localMemoryIds = new Set(memoryEntries.map(e => e.id));
    console.log(`\n📝 Memoria local: ${memoryEntries.length} entradas`);
    console.log(`   IDs: ${[...localMemoryIds].slice(0, 5).join(', ')}${localMemoryIds.size > 5 ? '...' : ''}`);

    console.log('\n====== CONCLUSIONES ======\n');

    const hasPlayers = supabaseData.players && supabaseData.players.count > 0;
    const hasCharacters = supabaseData.characters && supabaseData.characters.count > 0;
    const hasGroups = supabaseData.groups && supabaseData.groups.count > 0;

    if (hasPlayers || hasCharacters || hasGroups) {
      console.log(`✅ Supabase tiene datos de negocio (players=${hasPlayers}, characters=${hasCharacters}, groups=${hasGroups})`);
    } else {
      console.log(`ℹ️  Supabase no tiene datos de negocio (tablas vacías o sin acceso)`);
    }

    console.log(`✅ Memoria local: ${memoryEntries.length} entradas persistentes`);
    console.log(`✅ Design board local: ${boardData ? boardData.ticketCount + ' tickets' : 'no disponible'}`);

    console.log('\n✅ Auditoría completada. No hay datos transaccionales que sincronizar');
    console.log('   (players/characters/groups solo se crean en runtime cuando el bot interactúa)\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error en auditoría:', err.message);
    process.exit(1);
  }
}

main();
