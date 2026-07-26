// @ts-nocheck
const { supabase } = require("../database/supabase");
const { logSystem } = require("./loggerService");

/**
 * @constant SESSION_ID
 * @type {string}
 */
const SESSION_ID = "bug_report";

/**
 * Returns the open reports.
 * @throws {Error}
 * @returns
 * @async
 */
async function getOpenReports() {
  const { data, error } = await supabase
    .from("bot_auth_state")
    .select("data")
    .eq("session_id", SESSION_ID)
    .filter("data->>status", "eq", "open")
    .order("data->>timestamp", { ascending: false });

  if (error) throw new Error(`Error obteniendo reportes abiertos: ${error.message}`);
  return (data || []).map((r) => r.data);
}

/**
 * Returns the stats.
 * @returns
 * @async
 */
async function getStats() {
  /**
   * @constant all
   */
  const all = await getOpenReports();
  /**
   * @constant total
   */
  const total = all.length;
  /**
   * @constant byPriority
   * @type {Object}
   */
  const byPriority = { critical: 0, high: 0, medium: 0, low: 0 };

  for (const r of all) {
    /**
     * @constant p
     */
    const p = r.priority || "medium";
    if (byPriority[p] !== undefined) byPriority[p]++;
  }

  return { total, byPriority };
}

/**
 * Mark stale.
 * @param days - - days.
 * @throws {Error}
 * @returns
 * @async
 */
async function markStale(days) {
  /**
   * @constant cutoff
   */
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  const { data: rows, error: selectError } = await supabase
    .from("bot_auth_state")
    .select("id, data")
    .eq("session_id", SESSION_ID)
    .filter("data->>status", "eq", "open")
    .lt("data->>timestamp", cutoff);

  if (selectError) throw new Error(`Error buscando reportes stale: ${selectError.message}`);
  if (!rows || rows.length === 0) return 0;

  /**
   * @variable count
   * @type {number}
   */
  let count = 0;
  for (const row of rows) {
    /**
     * @constant updatedData
     * @type {Object}
     */
    const updatedData = { ...row.data, status: "stale" };
    const { error: updateError } = await supabase
      .from("bot_auth_state")
      .update({ data: updatedData })
      .eq("id", row.id)
      .eq("session_id", SESSION_ID);

    if (!updateError) count++;
  }

  if (count > 0) {
    await logSystem("Reportes marcados como stale", { count, days });
  }

  return count;
}

module.exports = { getOpenReports, getStats, markStale };
