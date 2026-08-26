// @ts-nocheck
require("dotenv").config({ path: require("path").join(__dirname, "../../.env.local"), quiet: true });
const { createClient } = require("@supabase/supabase-js");
const { logSystem } = require("../services/loggerService");

/**
 * Reject legacy JWT keys that explicitly identify a non-service role.
 * Opaque backend keys such as sb_secret_* do not expose JWT claims and are accepted.
 * @param {string} key - Supabase backend key.
 * @returns {void}
 */
function assertServiceRoleKey(key) {
  const parts = String(key || "").split(".");
  if (parts.length !== 3) return;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    if (payload.role && payload.role !== "service_role") {
      throw new Error(`La clave de Supabase usa el rol no permitido "${payload.role}"; se requiere service_role.`);
    }
  } catch (error) {
    if (error instanceof SyntaxError) return;
    throw error;
  }
}

/**
 * @constant supabaseUrl
 */
const supabaseUrl = process.env.SUPABASE_URL;
/**
 * @constant supabaseServiceRoleKey
 */
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  logSystem("FATAL: SUPABASE_URL o una clave service_role no están definidos en .env.local");
  throw new Error("Supabase no configurado. Revisa .env.local");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_KEY) {
  logSystem("WARN: SUPABASE_KEY está deprecada; migra a SUPABASE_SERVICE_ROLE_KEY.");
}

assertServiceRoleKey(supabaseServiceRoleKey);

/**
 * @constant supabase
 */
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

module.exports = { supabase, assertServiceRoleKey };
