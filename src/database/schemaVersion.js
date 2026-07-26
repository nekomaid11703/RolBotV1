const { supabase } = require("./supabase");
const { logSystem } = require("../services/loggerService");

const VERSION_KEY = "_schema_version";
const SESSION_ID = "_meta";
const CURRENT_VERSION = "2.0.0";

/**
 * Get the stored schema version from the database.
 * @returns {Promise<string|null>} Stored version string or null
 */
async function getStoredVersion() {
  try {
    const { data, error } = await supabase
      .from("bot_auth_state")
      .select("data")
      .eq("session_id", SESSION_ID)
      .eq("id", VERSION_KEY)
      .maybeSingle();

    if (error) return null;
    return data?.data?.version || null;
  } catch {
    return null;
  }
}

/**
 * Set the stored schema version in the database.
 * @param {string} version - Version string to store
 * @returns {Promise<void>}
 */
async function setStoredVersion(version) {
  try {
    await supabase.from("bot_auth_state").upsert(
      {
        session_id: SESSION_ID,
        id: VERSION_KEY,
        data: { version, updatedAt: new Date().toISOString() },
      },
      { onConflict: "session_id,id" },
    );
  } catch {
    /* metadata write ok if fails */
  }
}

/**
 * Check if the stored schema version matches the current code version.
 * @returns {Promise<{ok: boolean, stored: string|null, current: string}>} Version check result
 */
async function checkVersion() {
  const stored = await getStoredVersion();

  if (!stored) {
    await setStoredVersion(CURRENT_VERSION);
    await logSystem(`SchemaVersion: primera ejecución — version ${CURRENT_VERSION} registrada`);
    return { ok: true, stored: null, current: CURRENT_VERSION };
  }

  if (stored !== CURRENT_VERSION) {
    await logSystem(`SchemaVersion: ¡DESAJUSTE! DB=${stored}, código=${CURRENT_VERSION}`);
    return { ok: false, stored, current: CURRENT_VERSION };
  }

  await logSystem(`SchemaVersion: OK (${CURRENT_VERSION})`);
  return { ok: true, stored, current: CURRENT_VERSION };
}

module.exports = { checkVersion, getStoredVersion, setStoredVersion, CURRENT_VERSION };
