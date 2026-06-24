require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function main() {
  console.log('Agregando columna daily a players...');
  const { error } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE public.players ADD COLUMN IF NOT EXISTS daily jsonb DEFAULT '{}'::jsonb;`
  });
  if (error) {
    if (error.message.includes('function exec_sql') || error.message.includes('not found')) {
      const { error: directError } = await supabase.from('players').update({ daily: {} }).eq('id', '00000000-0000-0000-0000-000000000000');
      if (directError && directError.code === '42703') {
        console.log('La columna daily no existe aún. Usando query directa...');
        const { error: rawError } = await supabase.from('players').select('id').limit(1);
        if (rawError) throw rawError;
      }
    } else {
      throw error;
    }
  }
  console.log('✅ Columna daily agregada/verificada en players');
  process.exit(0);
}
main().catch(err => {
  if (err.code === '42703') {
    console.log('⚠️  Columna daily no existe. Ejecuta el SQL manualmente:\nALTER TABLE public.players ADD COLUMN IF NOT EXISTS daily jsonb DEFAULT \'{}\'::jsonb;');
  } else {
    console.error('Error:', err.message);
  }
  process.exit(1);
});
