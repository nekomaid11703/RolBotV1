// @ts-nocheck
require("dotenv").config({ path: require("path").join(__dirname, "../../.env.local") });
const { createClient } = require("@supabase/supabase-js");
const { logSystem } = require("../services/loggerService");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  logSystem("WARN: ⚠️ Advertencia: SUPABASE_URL o SUPABASE_KEY no están definidos en el archivo .env");
}

const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey || "placeholder");

module.exports = { supabase };
