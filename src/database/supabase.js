// @ts-nocheck
require("dotenv").config({ path: require("path").join(__dirname, "../../.env.local") });
const { createClient } = require("@supabase/supabase-js");
const { logSystem } = require("../services/loggerService");

/**
 * @constant supabaseUrl
 */
const supabaseUrl = process.env.SUPABASE_URL;
/**
 * @constant supabaseKey
 */
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  logSystem("FATAL: SUPABASE_URL o SUPABASE_KEY no están definidos en .env.local");
  throw new Error("Supabase no configurado. Revisa .env.local");
}

/**
 * @constant supabase
 */
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
