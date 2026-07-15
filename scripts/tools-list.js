/**
 * tools-list.js — Pre-flight check de herramientas
 * Uso: node scripts/tools-list.js
 * Retorna diagnóstico del toolchain disponible para el agente.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const WORKSPACE = path.resolve(ROOT, "..");

function exists(p) {
  return fs.existsSync(path.resolve(ROOT, p));
}

function check(category, name, ok, detail = "") {
  const status = ok ? "✅" : "❌";
  return `  ${status} ${name}${detail ? ` — ${detail}` : ""}`;
}

function run() {
  const lines = ["🔧 Pre-flight Check — IA_rolbot\n"];

  // ── Toolchain ──
  lines.push("📦 Toolchain:");
  lines.push(check("toolchain", "Node.js", true, process.version));
  lines.push(check("toolchain", "npm", true, execSync("npm --version").toString().trim()));
  lines.push(check("toolchain", "ESLint config", exists("eslint.config.js")));
  lines.push(check("toolchain", "TypeScript config", exists("tsconfig.json")));
  lines.push(check("toolchain", "Prettier config", exists(".prettierrc")));
  lines.push(check("toolchain", "Husky", exists(".husky/pre-commit")));
  lines.push(check("toolchain", "Knip", exists("knip.json")));
  lines.push(check("toolchain", "Vitest config", exists("vitest.config.js")));

  // ── NPM Scripts ──
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"));
  const scripts = Object.keys(pkg.scripts || {}).filter((s) => s.startsWith("test") || s.startsWith("check"));
  lines.push("\n📋 Scripts de validación:");
  for (const s of scripts) {
    lines.push(`  • npm run ${s}`);
  }

  // ── Knowledge Graph ──
  const graphPath = path.join(ROOT, "graphify-out", "graph.json");
  let graphOk = false;
  let graphSize = 0;
  try {
    if (fs.existsSync(graphPath)) {
      const stat = fs.statSync(graphPath);
      graphOk = true;
      graphSize = Math.round(stat.size / 1024);
    }
  } catch {}
  lines.push(check("graph", "Graphify graph.json", graphOk, graphOk ? `${graphSize}KB` : ""));

  // ── MCP Servers ──
  lines.push("\n🔌 MCP Servers:");
  lines.push(check("mcp", "NekoMemori (index.js)", exists("../mcp_nekomemori/index.js")));
  lines.push(check("mcp", "NekoMemori memory file", exists("../mcp_nekomemori/utils/fileUtils.js")));
  lines.push(check("mcp", "OpenCode config", exists("../opencode.json")));

  // ── Skills ──
  const skillsDir = path.join(WORKSPACE, ".opencode", "skills");
  let skills = [];
  try {
    skills = fs.readdirSync(skillsDir).filter((f) => fs.statSync(path.join(skillsDir, f)).isDirectory());
  } catch {}
  lines.push("\n🧠 Skills disponibles:");
  if (skills.length === 0) {
    lines.push("  (ninguno en .opencode/skills/)");
  } else {
    for (const s of skills) {
      const skillFile = path.join(skillsDir, s, "SKILL.md");
      const hasFile = fs.existsSync(skillFile);
      lines.push(check("skills", s, hasFile));
    }
  }

  // ── Tests ──
  const testDir = path.join(ROOT, "tests");
  let testFiles = [];
  try {
    testFiles = fs.readdirSync(testDir).filter((f) => f.startsWith("test_") && f.endsWith(".js"));
  } catch {}
  lines.push("\n🧪 Tests disponibles:", `  ${testFiles.length} archivos en tests/`);

  // ── Memoria NekoMemori ──
  const memoryFile = path.join(ROOT, "ai-memory", "rolbot-memory.jsonl");
  let memoryCount = 0;
  try {
    if (fs.existsSync(memoryFile)) {
      memoryCount = fs.readFileSync(memoryFile, "utf-8").split("\n").filter((l) => l.trim()).length;
    }
  } catch {}
  lines.push(check("memory", "NekoMemori entries", memoryCount > 0, `${memoryCount} entradas`));

  console.log(lines.join("\n"));
}

run();
