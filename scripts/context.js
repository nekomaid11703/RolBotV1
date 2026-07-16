/**
 * context.js — Auto-descubrimiento y verificación del proyecto RolBotV1
 * Uso:
 *   node scripts/context.js        → muestra contexto completo
 *   node scripts/context.js --check → verifica brechas entre lo real y lo documentado
 *
 * Escanea dinámicamente package.json scripts, config files,
 * skills, estructura src/, y más. No requiere mantenimiento manual.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CHECK_MODE = process.argv.includes("--check");

function exists(...parts) {
  return fs.existsSync(path.join(ROOT, ...parts));
}

function readFile(p) {
  try {
    return fs.readFileSync(path.resolve(ROOT, p), "utf-8");
  } catch {
    return "";
  }
}

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return null;
  }
}

function section(title) {
  console.log(`\n## ${title}`);
}

function bullet(label, value = "") {
  console.log(`  \u2022 ${label}${value ? `: ${value}` : ""}`);
}

function warn(label, detail = "") {
  console.log(`  \u26A0 ${label}${detail ? ` — ${detail}` : ""}`);
}

function ok(label) {
  if (CHECK_MODE) console.log(`  \u2705 ${label}`);
}

// ── Gather dynamic data ──

function getScripts() {
  const pkg = readJSON(path.join(ROOT, "package.json"));
  return pkg?.scripts ? Object.entries(pkg.scripts) : [];
}

function getConfigFiles() {
  const patterns = [
    "eslint.config.js",
    "tsconfig.json",
    ".prettierrc",
    "vitest.config.js",
    "knip.json",
    ".dependency-cruiser.cjs",
    "stryker.config.json",
    ".graphifyignore",
    ".gitignore",
    ".husky/pre-commit",
  ];
  return patterns.filter((p) => exists(p));
}

function getSkills() {
  const dir = path.join(ROOT, ".opencode", "skills");
  const result = [];
  if (fs.existsSync(dir)) {
    for (const e of fs.readdirSync(dir)) {
      const full = path.join(dir, e);
      result.push({
        name: e,
        isDir: fs.statSync(full).isDirectory(),
        hasSkillMd: fs.existsSync(path.join(full, "SKILL.md")),
      });
    }
  }
  return result;
}

function getPlugins() {
  const cfg = readJSON(path.join(ROOT, ".opencode", "opencode.json"));
  return cfg?.plugin || [];
}

function getAgentCommands() {
  const cfg = readJSON(path.join(ROOT, ".opencode", "opencode.json"));
  return cfg?.agentCommands || [];
}

function getSrcDirs() {
  if (!exists("src")) return [];
  const entries = fs.readdirSync(path.join(ROOT, "src"));
  return entries.filter((f) =>
    fs.statSync(path.join(ROOT, "src", f)).isDirectory()
  );
}

// ── Check mode ──

function checkGaps() {
  const agentsMd = readFile("AGENTS.md");
  const onboardingSkill = readFile(".opencode/skills/onboarding/SKILL.md");
  const combinedDocs = agentsMd + "\n" + onboardingSkill;
  let exitCode = 0;

  console.log("# Verificación de brechas de documentaci\u00F3n\n");

  // 1. Scripts npm documentados?
  const scripts = getScripts();
  const undocScripts = scripts.filter(
    ([name]) => !combinedDocs.includes(name) && name !== "prepare"
  );
  if (undocScripts.length === 0) {
    ok("Todos los scripts npm est\u00E1n referenciados en la documentaci\u00F3n");
  } else {
    exitCode = 1;
    section("Scripts npm no documentados");
    for (const [name, cmd] of undocScripts) {
      warn(name, cmd);
    }
  }

  // 2. Config files documentados?
  const configs = getConfigFiles();
  const undocConfigs = configs.filter((c) => !combinedDocs.includes(c));
  if (undocConfigs.length === 0) {
    ok("Todos los config files est\u00E1n referenciados en la documentaci\u00F3n");
  } else {
    exitCode = 1;
    section("Config files no documentados");
    for (const c of undocConfigs) warn(c);
  }

  // 3. Skills con SKILL.md?
  const skills = getSkills();
  const missingSkillMd = skills.filter(
    (s) => s.isDir && !s.hasSkillMd
  );
  if (missingSkillMd.length === 0) {
    ok("Todos los skills tienen SKILL.md");
  } else {
    exitCode = 1;
    section("Skills sin SKILL.md");
    for (const s of missingSkillMd) warn(s.name);
  }

  // 4. Skills documentados en AGENTS.md / onboarding?
  const undocSkills = skills.filter(
    (s) => s.isDir && !combinedDocs.includes(s.name)
  );
  if (undocSkills.length === 0) {
    ok("Todos los skills est\u00E1n documentados en AGENTS.md / onboarding");
  } else {
    exitCode = 1;
    section("Skills no documentados");
    for (const s of undocSkills) warn(s.name);
  }

  // 5. Directorios src/ documentados?
  const srcDirs = getSrcDirs();
  const undocDirs = srcDirs.filter((d) => !combinedDocs.includes(d + "/"));
  if (undocDirs.length === 0) {
    ok("Todos los directorios src/ est\u00E1n documentados");
  } else {
    exitCode = 1;
    section("Directorios src/ no documentados en AGENTS.md");
    for (const d of undocDirs) warn(d);
  }

  // 6. Plugins documentados?
  const plugins = getPlugins();
  const undocPlugins = plugins.filter((p) => !combinedDocs.includes(p));
  if (undocPlugins.length === 0) {
    ok("Todos los plugins est\u00E1n documentados");
  } else {
    exitCode = 1;
    section("Plugins no documentados");
    for (const p of undocPlugins) warn(p);
  }

  // 7. Agent commands documentados?
  const commands = getAgentCommands();
  const undocCmds = commands.filter(
    (c) => !combinedDocs.includes(c.name)
  );
  if (undocCmds.length === 0) {
    ok("Todos los agent commands est\u00E1n documentados");
  } else {
    exitCode = 1;
    section("Agent commands no documentados");
    for (const c of undocCmds) warn(`/${c.name}`, c.description);
  }

  // 8. AGENTS.md existe?
  if (fs.existsSync(path.join(ROOT, "AGENTS.md"))) {
    ok("AGENTS.md existe");
  } else {
    exitCode = 1;
    warn("AGENTS.md no encontrado");
  }

  // 9. Onboarding skill existe?
  if (exists(".opencode", "skills", "onboarding", "SKILL.md")) {
    ok("Skill onboarding existe");
  } else {
    exitCode = 1;
    warn("Skill onboarding/SKILL.md no encontrado");
  }

  console.log("");
  if (exitCode === 0) {
    console.log("✅ Todo en orden — documentaci\u00F3n sincronizada con el proyecto.");
  } else {
    console.log(
      "⚠️  Se encontraron brechas. Revisa los warnings arriba y actualiza AGENTS.md o el skill de onboarding."
    );
  }

  process.exit(exitCode);
}

// ── Display mode ──

function display() {
  console.log("# RolBotV1 \u2014 Contexto del Proyecto\n");

  // 1. Scripts npm
  const scripts = getScripts();
  section("Scripts npm");
  for (const [name, cmd] of scripts) {
    bullet(name, cmd);
  }

  // 2. Config files detectados
  const configs = getConfigFiles();
  section("Config files detectados");
  for (const cf of configs) bullet(cf);

  // 3. Skills OpenCode
  const skills = getSkills();
  section("Skills OpenCode");
  for (const s of skills) {
    if (s.isDir) {
      bullet(s.name, s.hasSkillMd ? "SKILL.md ok" : "sin SKILL.md");
    } else {
      bullet(s.name, "archivo suelto");
    }
  }

  // 4. Plugins y agentCommands
  const plugins = getPlugins();
  if (plugins.length) {
    section("Plugins OpenCode");
    for (const p of plugins) bullet(p);
  }
  const commands = getAgentCommands();
  if (commands.length) {
    section("Agent Commands");
    for (const cmd of commands) {
      bullet(`/${cmd.name}`, cmd.description || "");
    }
  }

  // 5. Estructura src/
  function countJsRecursive(dir) {
    let count = 0;
    try {
      for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          count += countJsRecursive(full);
        } else if (entry.endsWith(".js") && !entry.startsWith("_")) {
          count++;
        }
      }
    } catch { /* ignore */ }
    return count;
  }
  section("Estructura src/");
  if (exists("src")) {
    const entries = fs.readdirSync(path.join(ROOT, "src"));
    const dirs = entries.filter((f) =>
      fs.statSync(path.join(ROOT, "src", f)).isDirectory()
    );
    for (const d of dirs) {
      const count = countJsRecursive(path.join(ROOT, "src", d));
      bullet(`${d}/`, `${count} archivos`);
    }
    const rootFiles = entries.filter(
      (f) =>
        !fs.statSync(path.join(ROOT, "src", f)).isDirectory() &&
        f.endsWith(".js")
    );
    if (rootFiles.length) {
      for (const f of rootFiles) bullet(`src/${f}`);
    }
  }

  // 6. Graphify
  section("Knowledge Graph");
  const graphPath = path.join(ROOT, "graphify-out", "graph.json");
  if (exists("graphify-out", "graph.json")) {
    const stat = fs.statSync(graphPath);
    bullet("Estado", `Activo (${Math.round(stat.size / 1024)}KB)`);
  } else {
    bullet("Estado", "No encontrado");
  }

  // 7. Tests
  section("Tests");
  if (exists("tests")) {
    const testFiles = fs
      .readdirSync(path.join(ROOT, "tests"))
      .filter((f) => f.startsWith("test_") && f.endsWith(".js"));
    bullet("Archivos", `${testFiles.length} encontrados`);
    if (testFiles.length <= 8) {
      for (const t of testFiles) bullet(t);
    }
  }
}

// ── Main ──

if (CHECK_MODE) {
  checkGaps();
} else {
  display();
}
