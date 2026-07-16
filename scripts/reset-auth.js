const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan variables SUPABASE_URL y SUPABASE_ANON_KEY en .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  const { error } = await supabase.from("bot_auth_state").delete().neq("key", "");
  if (error) {
    console.error("❌ Error al borrar auth state:", error.message);
    process.exit(1);
  }
  console.log("✅ Auth state eliminado. Reinicia el bot y escanea el QR.");
})();
