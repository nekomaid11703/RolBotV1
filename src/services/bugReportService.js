// @ts-nocheck
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const { once } = require("events");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const { supabase } = require("../database/supabase");
const { isOwner, getOwnerJids } = require("../utils/permissionUtils");
const { getGroupMetadata } = require("../utils/groupUtils");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { logSystem, logError } = require("./loggerService");

const SESSION_ID = "bug_report";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function getImageExtension(mimetype) {
  const normalized = String(mimetype || "")
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  const extension = IMAGE_EXTENSIONS.get(normalized);
  if (!extension) {
    throw new Error("Formato de imagen no permitido. Usa JPEG, PNG o WebP.");
  }
  return extension;
}

function assertDeclaredImageSize(fileLength) {
  if (fileLength === null || fileLength === undefined) return;

  let bytes;
  try {
    bytes = BigInt(String(fileLength));
  } catch {
    throw new Error("El tamaño declarado de la imagen no es válido.");
  }

  if (bytes < 0n || bytes > BigInt(MAX_IMAGE_BYTES)) {
    throw new Error("La imagen supera el límite de 5 MiB.");
  }
}

async function saveImage(msg, id) {
  const image = msg.message.imageMessage;
  const extension = getImageExtension(image.mimetype);
  assertDeclaredImageSize(image.fileLength);

  const mediaDir = path.resolve(process.cwd(), "bugs", "media");
  const fileName = `${id}.${extension}`;
  const filePath = path.resolve(mediaDir, fileName);
  if (path.dirname(filePath) !== mediaDir) {
    throw new Error("Nombre de archivo de imagen no válido.");
  }

  const mediaStream = await downloadMediaMessage(msg, "stream", {}, {});
  await fsp.mkdir(mediaDir, { recursive: true });

  let receivedBytes = 0;
  let fileCreated = false;
  const sizeLimiter = new Transform({
    transform(chunk, _encoding, callback) {
      receivedBytes += chunk.length;
      callback(receivedBytes > MAX_IMAGE_BYTES ? new Error("La imagen supera el límite de 5 MiB.") : null, chunk);
    },
  });
  const output = fs.createWriteStream(filePath, { flags: "wx" });

  try {
    await once(output, "open");
    fileCreated = true;
    await pipeline(mediaStream, sizeLimiter, output);
    const stat = await fsp.stat(filePath);
    if (!stat.isFile() || stat.size !== receivedBytes || stat.size > MAX_IMAGE_BYTES) {
      throw new Error("La imagen descargada no es válida.");
    }
  } catch (error) {
    output.destroy();
    mediaStream.destroy?.();
    if (fileCreated) await fsp.rm(filePath, { force: true });
    throw error;
  }

  return path.posix.join("bugs", "media", fileName);
}

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

function determinePriority(description) {
  const lower = description.toLowerCase();
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return priority;
  }
  return "medium";
}

const CATEGORY_KEYWORDS = {
  bug: ["bug", "error", "fallo", "falla", "crash", "no funciona", "roto", "mal", "incorrecto"],
  suggestion: ["sugerencia", "mejora", "feature", "idea", "propuesta", "quisiera", "podría"],
  question: ["duda", "pregunta", "cómo", "qué es", "consulta", "?"],
};

function determineCategory(description) {
  const lower = description.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return category;
  }
  return "general";
}

async function getRole(sock, groupId, userId) {
  if (isOwner(userId)) return "owner";
  if (!groupId) return "user";
  const metadata = await getGroupMetadata(sock, groupId);
  if (!metadata || !Array.isArray(metadata.participants)) return "user";
  const normUserId = userId.split(":")[0].split("/")[0].toLowerCase();
  const participant = metadata.participants.find((p) => {
    const pid = (p.id || p.jid || "").split(":")[0].split("/")[0].toLowerCase();
    return pid === normUserId;
  });
  if (participant?.admin === "admin" || participant?.admin === "superadmin") return "admin";
  return "user";
}

async function getDailyCount(userId) {
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

async function createReport({ sock, groupId, userId, userName, description, msg }) {
  const role = await getRole(sock, groupId, userId);
  const limits = { owner: Infinity, admin: 5, user: 3 };
  const limit = limits[role] || 3;
  const dailyCount = await getDailyCount(userId);
  if (dailyCount >= limit) {
    throw new Error(`Límite diario alcanzado (${limit}/día para ${role}s)`);
  }

  const priority = determinePriority(description);
  const category = determineCategory(description);
  const id = crypto.randomUUID();

  let mediaUrl = null;
  if (msg && msg.message && msg.message.imageMessage) {
    try {
      mediaUrl = await saveImage(msg, id);
    } catch (err) {
      await logError({ source: "bugReportService.createReport.media", error: err });
      throw err;
    }
  }

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
  if (error) {
    if (mediaUrl) {
      await fsp
        .rm(path.resolve(process.cwd(), mediaUrl), { force: true })
        .catch((cleanupError) => logError({ source: "bugReportService.createReport.cleanup", error: cleanupError }));
    }
    throw new Error(`Error guardando reporte: ${error.message}`);
  }

  await logSystem("Bug report creado", { id, userId, priority, category });

  if ((priority === "critical" || priority === "high") && sock) {
    try {
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

async function getUserReports(userId, days = 30) {
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
