// @ts-nocheck
/**
 * @constant crypto
 */
const crypto = require("crypto");
/**
 * @constant path
 */
const path = require("path");
/**
 * @constant fs
 */
const fs = require("fs/promises");
const { supabase } = require("../database/supabase");
const { isOwner, getOwnerJids } = require("../utils/permissionUtils");
const { getGroupMetadata } = require("../utils/groupUtils");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { logSystem, logError } = require("./loggerService");

/**
 * @constant SESSION_ID
 * @type {string}
 */
const SESSION_ID = "bug_report";

/**
 * @constant PRIORITY_KEYWORDS
 * @type {object}
 */
const PRIORITY_KEYWORDS = {
  critical: [
    "crítico",
    "urgente",
    "emergencia",
    "crash",
    "cuelga",
    "bloquea",
    "seguridad",
    "pérdida de datos",
    "data loss",
    "no funciona",
    "no arranca",
  ],
  high: ["grave", "importante", "error grave", "falla", "no anda", "roto"],
  medium: ["molesto", "lento", "raro", "extraño", "problema", "fallo"],
  low: ["menor", "cosmético", "estético", "sugerencia", "mejora", "tipografía", "color", "detalle"],
};

/**
 * Determine priority.
 * @param {*} description - - description.
 * @returns
 */
function determinePriority(description) {
  /**
   * @constant lower
   */
  const lower = description.toLowerCase();
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return priority;
  }
  return "medium";
}

/**
 * @constant CATEGORY_KEYWORDS
 * @type {object}
 */
const CATEGORY_KEYWORDS = {
  bug: ["bug", "error", "fallo", "falla", "crash", "no funciona", "roto", "mal", "incorrecto"],
  suggestion: ["sugerencia", "mejora", "feature", "idea", "propuesta", "quisiera", "podría"],
  question: ["duda", "pregunta", "cómo", "qué es", "consulta", "?"],
};

/**
 * Determine category.
 * @param {*} description - - description.
 * @returns
 */
function determineCategory(description) {
  /**
   * @constant lower
   */
  const lower = description.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return category;
  }
  return "general";
}

/**
 * Returns the role.
 * @param {*} sock - - sock.
 * @param {*} groupId - - group unique identifier.
 * @param {*} userId - - user unique identifier.
 * @returns
 * @async
 */
async function getRole(sock, groupId, userId) {
  if (isOwner(userId)) return "owner";
  if (!groupId) return "user";
  /**
   * @constant metadata
   */
  const metadata = await getGroupMetadata(sock, groupId);
  if (!metadata || !Array.isArray(metadata.participants)) return "user";
  /**
   * @constant normUserId
   */
  const normUserId = userId.split(":")[0].split("/")[0].toLowerCase();
  /**
   * @constant participant
   */
  const participant = metadata.participants.find((p) => {
    /**
     * @constant pid
     */
    const pid = (p.id || p.jid || "").split(":")[0].split("/")[0].toLowerCase();
    return pid === normUserId;
  });
  if (participant?.admin === "admin" || participant?.admin === "superadmin") return "admin";
  return "user";
}

/**
 * Returns the daily count.
 * @param {*} userId - - user unique identifier.
 * @throws {Error}
 * @returns
 * @async
 */
async function getDailyCount(userId) {
  /**
   * @constant today
   */
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("bot_auth_state")
    .select("id")
    .eq("session_id", SESSION_ID)
    .filter("data->>userId", "eq", userId)
    .filter("data->>date", "eq", today);
  if (error) throw new Error(`Error al contar reportes: ${error.message}`);
  return (data || []).length;
}

/**
 * Creates a new report.
 * @param {*} root0
 * @throws {Error}
 * @returns
 * @async
 */
async function createReport({ sock, groupId, userId, userName, description, msg }) {
  /**
   * @constant role
   */
  const role = await getRole(sock, groupId, userId);
  /**
   * @constant limits
   * @type {object}
   */
  const limits = { owner: Infinity, admin: 5, user: 3 };
  /**
   * @constant limit
   */
  const limit = limits[role] || 3;
  /**
   * @constant dailyCount
   */
  const dailyCount = await getDailyCount(userId);
  if (dailyCount >= limit) {
    throw new Error(`Límite diario alcanzado (${limit}/día para ${role}s)`);
  }

  /**
   * @constant priority
   */
  const priority = determinePriority(description);
  /**
   * @constant category
   */
  const category = determineCategory(description);
  /**
   * @constant id
   */
  const id = crypto.randomUUID();

  let mediaUrl = null;
  if (msg && msg.message && msg.message.imageMessage) {
    try {
      /**
       * @constant buffer
       */
      const buffer = await downloadMediaMessage(msg, "buffer", {}, {});
      /**
       * @constant mediaDir
       */
      const mediaDir = path.join(process.cwd(), "bugs", "media");
      await fs.mkdir(mediaDir, { recursive: true });
      /**
       * @constant ext
       */
      const ext = (msg.message.imageMessage.mimetype || "image/png").split("/")[1] || "png";
      await fs.writeFile(path.join(mediaDir, `${id}.${ext}`), buffer);
      mediaUrl = `bugs/media/${id}.${ext}`;
    } catch (err) {
      await logError({ source: "bugReportService.createReport.media", error: err });
    }
  }

  /**
   * @constant report
   * @type {object}
   */
  const report = {
    id,
    userId,
    userName,
    groupId,
    description,
    category,
    priority,
    date: new Date().toISOString().slice(0, 10),
    timestamp: new Date().toISOString(),
    status: "open",
    mediaUrl,
    resolution: null,
    resolvedAt: null,
    resolvedBy: null,
  };
  const { error } = await supabase.from("bot_auth_state").insert({ session_id: SESSION_ID, id, data: report });
  if (error) throw new Error(`Error guardando reporte: ${error.message}`);

  await logSystem("Bug report creado", { id, userId, priority, category });

  if ((priority === "critical" || priority === "high") && sock) {
    try {
      /**
       * @constant ownerJids
       */
      const ownerJids = getOwnerJids();
      for (const ownerJid of ownerJids) {
        await sock.sendMessage(ownerJid, {
          text: `🐛 Bug ${priority === "critical" ? "CRÍTICO" : "de alta prioridad"} #${id.slice(0, 8)}\n👤 ${userName}\n📝 ${description.slice(0, 200)}`,
        });
      }
    } catch (err) {
      await logError({ source: "bugReportService.createReport.notify", error: err });
    }
  }

  return report;
}

/**
 * Returns the report.
 * @param {*} id - - unique identifier.
 * @returns
 * @async
 */
async function getReport(id) {
  const { data, error } = await supabase
    .from("bot_auth_state")
    .select("data")
    .eq("session_id", SESSION_ID)
    .eq("id", id)
    .single();
  if (error) return null;
  return data?.data || null;
}

/**
 * Returns the user reports.
 * @param {*} userId - - user unique identifier.
 * @param {number} [days] - - days.
 * @throws {Error}
 * @returns
 * @async
 */
async function getUserReports(userId, days = 30) {
  /**
   * @constant since
   */
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await supabase
    .from("bot_auth_state")
    .select("data")
    .eq("session_id", SESSION_ID)
    .filter("data->>userId", "eq", userId)
    .gte("data->>timestamp", since)
    .order("data->>timestamp", { ascending: false });
  if (error) throw new Error(`Error obteniendo reportes: ${error.message}`);
  return (data || []).map((r) => r.data);
}

/**
 * Get bug reports resolved since a date.
 * @param {unknown} timestamp - ISO date string
 * @returns {Promise<Array>} Array of resolved reports
 */
async function getResolvedSince(timestamp) {
  const { data, error } = await supabase
    .from("bot_auth_state")
    .select("data")
    .eq("session_id", SESSION_ID)
    .filter("data->>status", "eq", "resolved")
    .gte("data->>resolvedAt", timestamp);
  if (error) throw new Error(`Error obteniendo reportes resueltos: ${error.message}`);
  return (data || []).map((r) => r.data);
}

module.exports = {
  createReport,
  getReport,
  getUserReports,
  getResolvedSince,
};
