const { BufferJSON, initAuthCreds } = require("@whiskeysockets/baileys");
const { supabase } = require("../database/supabase");
const { logError } = require("../services/loggerService");

/**
 * @constant TABLE_NAME
 * @type {string}
 */
const TABLE_NAME = "bot_auth_state";

/**
 * Create a Supabase-backed authentication state for Baileys.
 * Implements a circuit breaker pattern for fault tolerance.
 * @param {string} [sessionId] - Session identifier
 * @returns {Promise<*>} Auth state object with state and saveCreds
 */
async function useSupabaseAuthState(sessionId = "default") {
  /**
   * @variable consecutiveFailures
   * @type {number}
   */
  let consecutiveFailures = 0;
  /**
   * @variable circuitOpen
   * @type {boolean}
   */
  let circuitOpen = false;
  /**
   * @variable nextAttemptTime
   * @type {number}
   */
  let nextAttemptTime = 0;
  /**
   * @constant COOLDOWN_MS
   * @type {number}
   */
  const COOLDOWN_MS = 30000;
  /**
   * @constant MAX_FAILURES
   * @type {number}
   */
  const MAX_FAILURES = 3;

  /**
   * @returns {boolean} Whether the circuit allows requests.
   * @returns
   */
  const checkCircuit = () => !circuitOpen || Date.now() > nextAttemptTime;

  /** @returns {void} */
  const recordSuccess = () => {
    consecutiveFailures = 0;
    circuitOpen = false;
  };

  /**
   * Record a failure and potentially open the circuit.
   * @param {unknown} err - - Error that caused the failure.
   */
  const recordFailure = (err) => {
    consecutiveFailures++;
    if (consecutiveFailures >= MAX_FAILURES) {
      if (!circuitOpen) {
        circuitOpen = true;
        nextAttemptTime = Date.now() + COOLDOWN_MS;
        logError({
          source: "supabaseAuthState.circuitBreaker",
          error: new Error(
            `Circuito abierto para Supabase. Conexión suspendida temporalmente por ${COOLDOWN_MS / 1000}s. Detalle: ${err instanceof Error ? err.message : String(err)}`,
          ),
        }).catch(() => {});
      }
    }
  };

  /**
   * Write data to the auth state table.
   * @param {*} data - - Data to persist.
   * @param {string} id - - Record identifier.
   */
  const writeData = async (data, id) => {
    if (!checkCircuit()) return;
    try {
      /**
       * @constant json
       */
      const json = JSON.parse(JSON.stringify(data, BufferJSON.replacer));
      const { error } = await supabase.from(TABLE_NAME).upsert({ session_id: sessionId, id, data: json });

      if (error) throw error;
      recordSuccess();
    } catch (err) {
      recordFailure(err);
      await logError({
        source: `supabaseAuthState.writeData:${id}`,
        error: err,
      });
    }
  };

  /**
   * Read data from the auth state table.
   * @param {string} id - Record identifier
   * @returns {Promise<*|null>} Resolves to the stored data or null
   */
  const readData = async (id) => {
    if (!checkCircuit()) return null;
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("data")
        .eq("session_id", sessionId)
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          recordSuccess();
          return null;
        }
        throw error;
      }
      if (!data) return null;

      recordSuccess();
      return JSON.parse(JSON.stringify(data.data), BufferJSON.reviver);
    } catch (err) {
      recordFailure(err);
      await logError({
        source: `supabaseAuthState.readData:${id}`,
        error: err,
      });
      return null;
    }
  };

  /**
   * @variable creds
   * @type {any}
   */
  let creds = await readData("creds");
  if (!creds) {
    creds = initAuthCreds();
    await writeData(creds, "creds");
  }

  return {
    state: {
      creds,
      keys: {
        /**
         * Get key data by type and ids.
         * @param {string} type - Key or event type
         * @param {string[]} ids - Array of identifiers
         * @returns {Promise<*>} Object mapping ids to values
         */
        get: async (type, ids) => {
          /** @type {*} */
          const data = {};
          await Promise.all(
            ids.map(async (/** @type {string} */ id) => {
              /**
               * @variable value
               * @type {any}
               */
              let value = await readData(`${type}-${id}`);
              if (type === "app-state-sync-key" && value) {
                const { proto } = require("@whiskeysockets/baileys");
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            }),
          );
          return data;
        },
        /**
         * Set key data in batch.
         * @param {*} data - Data payload with category/id/value nesting
         * @returns {Promise<void>}
         */
        set: async (data) => {
          if (!checkCircuit()) return;
          /**
           * @constant upsertData
           * @type {Array}
           */
          const upsertData = [];
          /**
           * @constant deleteData
           * @type {Array}
           */
          const deleteData = [];
          for (const category in data) {
            for (const id in data[category]) {
              /**
               * @constant value
               */
              const value = data[category][id];
              /**
               * @constant key
               */
              const key = `${category}-${id}`;
              if (value) {
                /**
                 * @constant json
                 */
                const json = JSON.parse(JSON.stringify(value, BufferJSON.replacer));
                upsertData.push({ session_id: sessionId, id: key, data: json });
              } else {
                deleteData.push(key);
              }
            }
          }

          try {
            if (upsertData.length > 0) {
              const { error: upsertError } = await supabase.from(TABLE_NAME).upsert(upsertData);
              if (upsertError) throw upsertError;
            }
            if (deleteData.length > 0) {
              const { error: deleteError } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq("session_id", sessionId)
                .in("id", deleteData);
              if (deleteError) throw deleteError;
            }
            recordSuccess();
          } catch (err) {
            recordFailure(err);
            await logError({
              source: "supabaseAuthState.keys.set",
              error: err,
            });
          }
        },
      },
    },
    /**
     * Saves the creds.
     * @returns {any}
     */
    saveCreds: () => {
      return writeData(creds, "creds");
    },
  };
}

module.exports = { useSupabaseAuthState };
