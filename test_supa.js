require('dotenv').config();
const { supabase } = require('./src/database/supabase');

async function test() {
    console.log("Testing Supabase connection and auth state table...");
    const { data, error } = await supabase.from('bot_auth_state').select('id').limit(1);
    
    if (error) {
        console.error("❌ Error conectando a Supabase:", error);
    } else {
        console.log("✅ Conexión exitosa. Filas encontradas:", data ? data.length : 0);
    }
}
test();
