// @ts-nocheck
const { BufferJSON, initAuthCreds, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
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

  const assertCircuitAvailable = () => {
    if (!checkCircuit()) {
      throw new Error("Supabase temporalmente no disponible (circuito abierto).");
    }
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
    assertCircuitAvailable();
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
      throw err;
    }
  };

  /**
   * @param {string} id - Record identifier
   * @returns {Promise<object|null>} - Promise resolving to the data or null
   */
  const readData = async (id) => {
    assertCircuitAvailable();
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
      throw err;
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

  const persistentKeys = {
    /**
     * @param {string} type - Key category
     * @param {string[]} ids - Key identifiers
     * @returns {Promise<object>} Stored keys by identifier
     */
    get: async (type, ids) => {
      assertCircuitAvailable();
      const uniqueIds = [...new Set(ids)];
      if (uniqueIds.length === 0) return {};

      const storedIds = uniqueIds.map((id) => `${type}-${id}`);
      try {
        const { data: rows, error } = await supabase
          .from(TABLE_NAME)
          .select("id, data")
          .eq("session_id", sessionId)
          .in("id", storedIds);
        if (error) throw error;

        const stored = new Map((rows || []).map((row) => [row.id, row.data]));
        const data = {};
        for (const id of uniqueIds) {
          const raw = stored.get(`${type}-${id}`);
          if (raw === undefined) continue;

          let value = JSON.parse(JSON.stringify(raw), BufferJSON.reviver);
          if (type === "app-state-sync-key" && value) {
            const { proto } = require("@whiskeysockets/baileys");
            value = proto.Message.AppStateSyncKeyData.fromObject(value);
          }
          data[id] = value;
        }

        recordSuccess();
        return data;
      } catch (err) {
        recordFailure(err);
        await logError({ source: "supabaseAuthState.keys.get", error: err });
        throw err;
      }
    },

    /** @param {object} data - Key mutations by category */
    set: async (data) => {
      assertCircuitAvailable();
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
        await logError({ source: "supabaseAuthState.keys.set", error: err });
        throw err;
      }
    },
  };

  return {
    state: {
      creds,
      keys: makeCacheableSignalKeyStore(persistentKeys),
    },
    saveCreds: () => {
      return writeData(creds, "creds");
    },
  };
}

module.exports = { useSupabaseAuthState };
