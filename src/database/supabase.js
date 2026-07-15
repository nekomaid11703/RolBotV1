// @ts-nocheck
require("dotenv").config({ path: require("path").join(__dirname, "../../.env.local") });
const { createClient } = require("@supabase/supabase-js");
const { logSystem } = require("../services/loggerService");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  logSystem("FATAL: SUPABASE_URL o SUPABASE_KEY no están definidos en .env.local");
  throw new Error("Supabase no configurado. Revisa .env.local");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
