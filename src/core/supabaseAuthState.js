const { BufferJSON, initAuthCreds } = require("@whiskeysockets/baileys");
const { supabase } = require("../database/supabase");
const { logError } = require("../services/loggerService");

const TABLE_NAME = "bot_auth_state";

async function useSupabaseAuthState(sessionId = "default") {
  let consecutiveFailures = 0;
  let circuitOpen = false;
  let nextAttemptTime = 0;
  const COOLDOWN_MS = 30000; // 30 segundos de cooldown
  const MAX_FAILURES = 3;

  const checkCircuit = () => {
    if (circuitOpen) {
      if (Date.now() > nextAttemptTime) {
        // Semi-abierto: permitir un intento de prueba
        return true;
      }
      return false;
    }
    return true;
  };

  const recordSuccess = () => {
    consecutiveFailures = 0;
    circuitOpen = false;
  };

  /** @param {unknown} err - Error that caused the failure */
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
   * @param {object} data - Data to persist
   * @param {string} id - Record identifier
   */
  const writeData = async (data, id) => {
    if (!checkCircuit()) return;
    try {
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
   * @param {string} id - Record identifier
   * @returns {Promise<object|null>} - Promise resolving to the data or null
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
          // Fila no encontrada, es normal al iniciar credenciales limpias
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

  /** @param {string} id - Record identifier */
  const _removeData = async (id) => {
    if (!checkCircuit()) return;
    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq("session_id", sessionId).eq("id", id);

      if (error) throw error;
      recordSuccess();
    } catch (err) {
      recordFailure(err);
      await logError({
        source: `supabaseAuthState.removeData:${id}`,
        error: err,
      });
    }
  };

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
         * @param {string} type - Key or event type
         * @param {string[]} ids - Array of identifiers
         * @returns {Promise<object>} - Promise resolving to the sent message
         */
        get: async (type, ids) => {
          /** @type {object} */
          const data = {};
          await Promise.all(
            ids.map(async (/** @type {string} */ id) => {
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
        /** @param {object} data - Data payload */
        set: async (data) => {
          if (!checkCircuit()) return;
          const upsertData = [];
          const deleteData = [];
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const key = `${category}-${id}`;
              if (value) {
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
    saveCreds: () => {
      return writeData(creds, "creds");
    },
  };
}

module.exports = { useSupabaseAuthState };
