/**
 * migrateCharacters.js
 * Migra los personajes desde archivos JSON locales a la tabla `characters` en Supabase.
 * 
 * Uso: node src/database/migrateCharacters.js
 * Prerequisito: La tabla `characters` debe existir en Supabase (ver supabase_migration.sql).
 */

require("dotenv").config();

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Faltan SUPABASE_URL o SUPABASE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CHARACTER_ROOT = path.join(__dirname, "personajes");

async function readJson(file) {
  try {
    const raw = await fsp.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function migrateCharacters() {
  console.log("🔄 Iniciando migración de personajes a Supabase...\n");

  if (!fs.existsSync(CHARACTER_ROOT)) {
    console.log("⚠️ No existe la carpeta de personajes:", CHARACTER_ROOT);
    return;
  }

  const userFolders = await fsp.readdir(CHARACTER_ROOT, { withFileTypes: true });
  let totalMigrated = 0;
  let totalErrors = 0;

  for (const folder of userFolders) {
    if (!folder.isDirectory()) continue;

    const folderPath = path.join(CHARACTER_ROOT, folder.name);
    const profilePath = path.join(folderPath, "profile.json");
    const charsDir = path.join(folderPath, "characters");

    // Leer el perfil para obtener el phone y activeCharacter
    const profile = await readJson(profilePath);
    if (!profile) {
      console.log(`⚠️ Sin profile.json en ${folder.name}, saltando...`);
      continue;
    }

    const phone = profile.creatorId || folder.name.split("__").pop();
    const activeSlug = profile.activeCharacter || null;

    // Verificar que el jugador existe en Supabase
    const { data: player } = await supabase
      .from("players")
      .select("phone")
      .eq("phone", phone)
      .single();

    if (!player) {
      console.log(`⚠️ Jugador ${phone} no encontrado en Supabase, saltando personajes...`);
      continue;
    }

    // Leer personajes del directorio
    if (!fs.existsSync(charsDir)) {
      console.log(`  📂 ${folder.name}: Sin carpeta characters/`);
      continue;
    }

    const charFiles = (await fsp.readdir(charsDir)).filter(f => f.endsWith(".json"));

    for (const charFile of charFiles) {
      const charData = await readJson(path.join(charsDir, charFile));
      if (!charData) continue;

      const slug = charData.slug || charFile.replace(".json", "");
      const isActive = slug === activeSlug;

      const row = {
        player_phone: phone,
        name: charData.name || slug,
        slug: slug,
        category: charData.category || "F",
        stats: charData.stats || {},
        slots: charData.slots || {},
        is_active: isActive,
        created_at: charData.createdAt || new Date().toISOString(),
        updated_at: charData.updatedAt || new Date().toISOString(),
      };

      const { error } = await supabase
        .from("characters")
        .upsert(row, { onConflict: "player_phone,slug" });

      if (error) {
        console.error(`  ❌ Error migrando ${slug} de ${phone}:`, error.message);
        totalErrors++;
      } else {
        console.log(`  ✅ ${phone} → ${charData.name} (${slug}) ${isActive ? "[ACTIVO]" : ""}`);
        totalMigrated++;
      }
    }
  }

  console.log(`\n📊 Migración completada: ${totalMigrated} personajes migrados, ${totalErrors} errores.`);
}

migrateCharacters().catch(console.error);
