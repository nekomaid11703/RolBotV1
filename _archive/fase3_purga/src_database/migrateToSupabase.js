require("dotenv").config();
const { supabase } = require("./supabase");
const fs = require("fs/promises");
const path = require("path");

const CHARACTER_ROOT = path.join(__dirname, "personajes");
const GROUP_ROOT = path.join(__dirname, "grupos");

async function migrateUsers() {
  console.log("🚀 Iniciando migración de Usuarios...");
  try {
    const folders = await fs.readdir(CHARACTER_ROOT, { withFileTypes: true });
    
    for (const folder of folders) {
      if (!folder.isDirectory()) continue;
      
      const profilePath = path.join(CHARACTER_ROOT, folder.name, "profile.json");
      try {
        const raw = await fs.readFile(profilePath, "utf8");
        const profile = JSON.parse(raw);
        
        // Transformar JSON a columnas de Supabase
        const phone = profile.creatorId || folder.name.split("__").pop();
        const username = profile.creatorName || "usuario";
        const money = profile.economy?.money || 0;
        const messages = profile.activity?.messages || 0;
        const commands = profile.activity?.commands || 0;
        
        const { error } = await supabase.from("players").upsert({
          phone,
          username,
          money,
          activity_messages: messages,
          activity_commands: commands
        }, { onConflict: 'phone' });

        if (error) console.error(`❌ Error migrando ${username}:`, error.message);
        else console.log(`✅ Migrado: ${username} (${phone})`);
        
      } catch (err) {
        console.warn(`⚠️ Omitiendo ${folder.name}: No tiene profile.json válido.`);
      }
    }
  } catch (err) {
    console.error("Error leyendo directorio de personajes:", err.message);
  }
}

async function migrateGroups() {
  console.log("\n🚀 Iniciando migración de Grupos...");
  try {
    const folders = await fs.readdir(GROUP_ROOT, { withFileTypes: true });
    
    for (const folder of folders) {
      if (!folder.isDirectory()) continue;
      
      const activityPath = path.join(GROUP_ROOT, folder.name, "activity.json");
      try {
        const raw = await fs.readFile(activityPath, "utf8");
        const activity = JSON.parse(raw);
        
        const group_jid = activity.groupId;
        const group_name = activity.groupName;
        const total_messages = activity.totals?.messages || 0;
        
        const { data: groupData, error: groupErr } = await supabase.from("groups").upsert({
          group_jid,
          group_name,
          total_messages
        }, { onConflict: 'group_jid' }).select('id').single();

        if (groupErr) {
          console.error(`❌ Error migrando grupo ${group_name}:`, groupErr.message);
          continue;
        }

        console.log(`✅ Grupo migrado: ${group_name}`);

        // Migrar miembros
        if (activity.members) {
          for (const [phone, memberData] of Object.entries(activity.members)) {
            const { error: memberErr } = await supabase.from("group_members").upsert({
              group_id: groupData.id,
              player_phone: phone,
              messages_count: memberData.messages || 0
            });
            if (memberErr) console.error(`❌ Error migrando miembro ${phone}:`, memberErr.message);
          }
        }
      } catch (err) {
        console.warn(`⚠️ Omitiendo ${folder.name}: No tiene activity.json válido.`);
      }
    }
  } catch (err) {
    console.error("Error leyendo directorio de grupos:", err.message);
  }
}

async function main() {
  await migrateUsers();
  await migrateGroups();
  console.log("\n🎉 Migración completada. Puedes ejecutar este script varias veces de forma segura.");
}

main();
