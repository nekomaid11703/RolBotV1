const { BufferJSON, initAuthCreds } = require('@whiskeysockets/baileys');
const { supabase } = require('../database/supabase');
const { logSystem, logError } = require('../services/loggerService');

const TABLE_NAME = 'bot_auth_state';

async function useSupabaseAuthState(sessionId = 'default') {
    let supabaseAvailable = true;

    const writeData = async (data, id) => {
        if (!supabaseAvailable) return;
        try {
            const json = JSON.parse(JSON.stringify(data, BufferJSON.replacer));
            await supabase
                .from(TABLE_NAME)
                .upsert({ session_id: sessionId, id, data: json });
        } catch (err) {
            supabaseAvailable = false;
        }
    };

    const readData = async (id) => {
        if (!supabaseAvailable) return null;
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('data')
                .eq('session_id', sessionId)
                .eq('id', id)
                .single();

            if (error || !data) return null;
            return JSON.parse(JSON.stringify(data.data), BufferJSON.reviver);
        } catch (err) {
            supabaseAvailable = false;
            return null;
        }
    };

    const removeData = async (id) => {
        if (!supabaseAvailable) return;
        try {
            await supabase
                .from(TABLE_NAME)
                .delete()
                .eq('session_id', sessionId)
                .eq('id', id);
        } catch (err) {
            supabaseAvailable = false;
        }
    };

    let creds = await readData('creds');
    if (!creds) {
        creds = initAuthCreds();
        await writeData(creds, 'creds');
    }

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(
                        ids.map(async (id) => {
                            let value = await readData(`${type}-${id}`);
                            if (type === 'app-state-sync-key' && value) {
                                const { proto } = require('@whiskeysockets/baileys');
                                value = proto.Message.AppStateSyncKeyData.fromObject(value);
                            }
                            data[id] = value;
                        })
                    );
                    return data;
                },
                set: async (data) => {
                    if (!supabaseAvailable) return;
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
                            await supabase.from(TABLE_NAME).upsert(upsertData);
                        }
                        if (deleteData.length > 0) {
                            await supabase.from(TABLE_NAME).delete().eq('session_id', sessionId).in('id', deleteData);
                        }
                    } catch (err) {
                        supabaseAvailable = false;
                    }
                }
            }
        },
        saveCreds: () => {
            return writeData(creds, 'creds');
        }
    };
}

module.exports = { useSupabaseAuthState };
