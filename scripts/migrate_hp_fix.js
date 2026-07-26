// @ts-nocheck
/**
 * migrate_hp_fix.js
 *
 * Migración puntual para corregir personajes antiguos que tienen:
 * - hp_actual = 100 (del sistema viejo donde "vida" era 100 plano)
 * - stats.hp mal configurado (undefined, 0, o 100)
 * - nivel incorrecto (no incluye HP en el conteo)
 *
 * Uso: node scripts/migrate_hp_fix.js [--dry-run]
 */

const path = require("path");
const { supabase } = require(path.join(__dirname, "../src/database/supabase"));
const { RACES, LEVELABLE_STATS, calculateLevel, DEFAULT_CHARACTER_STATS } = require(path.join(__dirname, "../src/config/characterConfig"));

const isDryRun = process.argv.includes("--dry-run");

function normalizeStats(stats = {}) {
  const base = { ...DEFAULT_CHARACTER_STATS };
  for (const key of Object.keys(base)) {
    if (typeof stats[key] === "number" && !Number.isNaN(stats[key])) {
      base[key] = Math.max(0, Math.floor(stats[key]));
    }
  }
  return base;
}

function needsMigration(character) {
  const stats = character.stats || {};
  const hp = stats.hp;
  const hp_actual = character.hp_actual;
  const nivel = character.nivel;

  // Detectar personaje viejo:
  // 1. stats.hp es undefined, 0, o > 20 (viejo formato usaba 100 plano)
  const hpIsOld = !hp || hp < 1 || hp > 20;

  // 2. hp_actual es 100 (del sistema viejo)
  const hpActualIsOld = hp_actual === 100;

  // 3. nivel no incluye HP (verificar si nivel es sospechosamente bajo)
  const normalizedStats = normalizeStats(stats);
  const expectedLevel = calculateLevel(normalizedStats);
  const nivelIsStale = nivel !== expectedLevel;

  return hpIsOld || (hpActualIsOld && nivelIsStale);
}

function fixCharacter(character) {
  const stats = { ...(character.stats || {}) };
  const raza = character.raza || "humano";
  const raceConfig = RACES[raza];

  let changes = [];

  // 1. Fix stats.hp
  if (!stats.hp || stats.hp < 1 || stats.hp > 20) {
    const oldHp = stats.hp;
    stats.hp = raceConfig?.baseStats?.hp || 1;
    changes.push(`stats.hp: ${oldHp} → ${stats.hp}`);
  }

  // 2. Normalize all stats
  const normalizedStats = normalizeStats(stats);

  // 3. Recalculate nivel
  const newLevel = calculateLevel(normalizedStats);
  const oldLevel = character.nivel;

  // 4. Fix hp_actual = stats.hp * 2
  const newMaxHp = normalizedStats.hp * 2;
  const oldHpActual = character.hp_actual;
  const newHpActual = Math.min(newMaxHp, Math.max(0, oldHpActual));

  return {
    stats: normalizedStats,
    nivel: newLevel,
    hp_actual: newHpActual,
    changes,
    levelChanged: oldLevel !== newLevel,
    hpChanged: oldHpActual !== newHpActual,
  };
}

async function main() {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Migración HP Fix — ${isDryRun ? "DRY RUN" : "MODO REAL"}`);
  console.log(`${"=".repeat(60)}\n`);

  // Fetch all characters
  const { data: characters, error } = await supabase
    .from("characters")
    .select("*");

  if (error) {
    console.error("Error fetching characters:", error.message);
    process.exit(1);
  }

  console.log(`Total de personajes: ${characters.length}\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const char of characters) {
    if (!needsMigration(char)) {
      skipped++;
      continue;
    }

    const fix = fixCharacter(char);

    console.log(`--- ${char.name} (${char.raza}) ---`);
    console.log(`  Nivel: ${char.nivel} → ${fix.nivel}${fix.levelChanged ? " ✓" : ""}`);
    console.log(`  HP actual: ${char.hp_actual} → ${fix.hp_actual}${fix.hpChanged ? " ✓" : ""}`);
    console.log(`  stats.hp: ${char.stats?.hp} → ${fix.stats.hp}`);
    if (fix.changes.length > 0) {
      console.log(`  Cambios: ${fix.changes.join(", ")}`);
    }

    if (!isDryRun) {
      const { error: updateError } = await supabase
        .from("characters")
        .update({
          stats: fix.stats,
          nivel: fix.nivel,
          hp_actual: fix.hp_actual,
          updated_at: new Date().toISOString(),
        })
        .eq("id", char.id);

      if (updateError) {
        console.log(`  ❌ Error actualizando: ${updateError.message}`);
        errors++;
      } else {
        console.log(`  ✅ Actualizado`);
        migrated++;
      }
    } else {
      console.log(`  [DRY RUN] No se aplicaron cambios`);
      migrated++;
    }

    console.log("");
  }

  console.log(`${"=".repeat(60)}`);
  console.log(`  Resumen:`);
  console.log(`  - Total: ${characters.length}`);
  console.log(`  - Migrados: ${migrated}`);
  console.log(`  - Omitidos (ya correctos): ${skipped}`);
  console.log(`  - Errores: ${errors}`);
  console.log(`${"=".repeat(60)}\n`);

  if (isDryRun) {
    console.log("⚠️  Este fue un DRY RUN. Para aplicar los cambios, ejecuta:");
    console.log("   node scripts/migrate_hp_fix.js\n");
  }
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
