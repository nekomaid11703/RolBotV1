# Graph Report - RolBotV1  (2026-07-17)

## Corpus Check
- 127 files · ~38,228 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1062 nodes · 1907 edges · 80 communities (57 shown, 23 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aba5fe74`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- economyService.js
- bugReportService.js
- scripts
- groupUtils.js
- userService.js
- devDependencies
- test_logger_service.js
- compilerOptions
- bot.js
- knip.json
- formatError
- actividad.js
- test_helpers.js
- characterService.js
- groupActivityService.js
- commandHandler.js
- unwarn.js
- resolveTargetDisplayName
- logError
- dar_stelas.js
- messageFormatUtils.js
- schemaValidator.js
- safeQuery.js
- loggerService.js
- stryker.config.json
- help.js
- getActiveCharacter
- supabase.js
- groupAdminHelper.js
- crear_pj.js
- schemaMigration.js
- stats.js
- box
- eco_admin_rem.js
- formatDisplayMention
- eventHandler.js
- logger.test.js
- test_message_format_utils.js
- actividad_global.js
- LRUCache
- economyAdminHelper.js
- editar_pj_descripcion.js
- eliminar_pj.js
- mis_pj.js
- resultUtils.js
- message_format.test.js
- test_command_usage_format.js
- carta_blanca.test.js
- h
- cache_state.test.js
- test_crear_pj.js
- applypatch-msg
- commit-msg
- husky.sh
- post-applypatch
- post-checkout
- post-commit
- post-merge
- post-rewrite
- pre-applypatch
- pre-auto-gc
- pre-commit
- pre-merge-commit
- pre-push
- pre-rebase
- prepare-commit-msg
- vitest.config.js
- IA_rolbot — RolBotV1
- Roadmap de Optimización y Salud — RolBot
- 2026-07-14 — Tooling & cleanup sprint
- renombrar_pj.js
- graphify — Knowledge Graph (Code-Only)
- keywords
- set_stelas.js
- ADR-001-eliminacion-capa-ia.md
- ADR-002-infraestructura-herramientas.md

## God Nodes (most connected - your core abstractions)
1. `box()` - 59 edges
2. `formatError()` - 42 edges
3. `scripts` - 32 edges
4. `formatDisplayMention()` - 26 edges
5. `resolveTargetDisplayName()` - 25 edges
6. `logSystem()` - 23 edges
7. `logError()` - 22 edges
8. `getUserProfile()` - 21 edges
9. `startBot()` - 19 edges
10. `getFirstMentionedJid()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `getOwnerJids()`  [EXTRACTED]
  scripts/midnight_review.js → src/utils/permissionUtils.js
- `runCleanOldLogsTests()` --indirect_call--> `exists()`  [INFERRED]
  tests/test_logger_service.js → scripts/tools-list.js
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `scheduleNext()` --calls--> `midnightReview()`  [EXTRACTED]
  src/services/schedulerService.js → scripts/midnight_review.js

## Import Cycles
- None detected.

## Communities (80 total, 23 thin omitted)

### Community 0 - "economyService.js"
Cohesion: 0.12
Nodes (22): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, addMoney(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
} (+14 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.10
Nodes (24): { box, formatError }, { createReport }, reportCooldowns, { box, formatError }, execute(), { getReport, getUserReports }, CATEGORY_KEYWORDS, createReport() (+16 more)

### Community 2 - "scripts"
Cohesion: 0.06
Nodes (32): scripts, audit, check, check:all, depcruise, depcruise:graph, dev, dev2 (+24 more)

### Community 3 - "groupUtils.js"
Cohesion: 0.11
Nodes (31): { addParticipant }, execute(), { formatError, box }, execute(), { formatError, box }, { openGroup }, { closeGroup }, execute() (+23 more)

### Community 4 - "userService.js"
Cohesion: 0.10
Nodes (36): { box }, execute(), { getOwnerRecords }, { listEconomyAdmins }, OWNER_ALIASES, createContext(), { extractPhoneNumber, normalizeJid }, extractText() (+28 more)

### Community 5 - "devDependencies"
Cohesion: 0.07
Nodes (29): dependency-cruiser, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-jsdoc, globals, husky, lint-staged (+21 more)

### Community 6 - "test_logger_service.js"
Cohesion: 0.10
Nodes (26): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE (+18 more)

### Community 7 - "compilerOptions"
Cohesion: 0.09
Nodes (22): _archive, bugs, graphify-out, logs, node_modules, tests, compilerOptions, allowJs (+14 more)

### Community 8 - "bot.js"
Cohesion: 0.14
Nodes (21): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+13 more)

### Community 9 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, src/**/*.js, project, rules, exports (+12 more)

### Community 10 - "formatError"
Cohesion: 0.17
Nodes (14): { deleteCharacter }, execute(), { formatCommandUsage, formatError, box }, { getCharacterNames }, { isAdmin }, usageMessage, execute(), { formatCommandUsage, formatError, box } (+6 more)

### Community 11 - "actividad.js"
Cohesion: 0.09
Nodes (34): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+26 more)

### Community 12 - "test_helpers.js"
Cohesion: 0.15
Nodes (14): crypto, getCacheKey(), helpers, run(), helpers, path, run(), assert() (+6 more)

### Community 13 - "characterService.js"
Cohesion: 0.23
Nodes (20): execute(), filterExisting(), {
  CHARACTER_CATEGORIES,
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  MAX_CHARACTERS_PER_USER,
}, createCharacter(), deleteCharacter(), { filterExisting }, getCharacterSlug(), { invalidateUserCache, charactersCacheKey, safeSingleOrNull, cache, TTLS } (+12 more)

### Community 14 - "groupActivityService.js"
Cohesion: 0.07
Nodes (22): GROUP_ACTIVITY_ROOT, path, hasColumn(), buildDefaultGroupRecord(), ensureGroupActivity(), { filterExisting }, { GROUP_TOP_LIMIT }, recordGroupActivity() (+14 more)

### Community 15 - "commandHandler.js"
Cohesion: 0.13
Nodes (20): aliases, commands, fs, getJsFilesRecursively(), handleCommand(), { hasEconomyPermission }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup } (+12 more)

### Community 16 - "unwarn.js"
Cohesion: 0.15
Nodes (19): { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError, box }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS }, execute() (+11 more)

### Community 17 - "resolveTargetDisplayName"
Cohesion: 0.18
Nodes (15): execute(), { formatCommandUsage, formatError, box }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin }, usageMessage (+7 more)

### Community 18 - "logError"
Cohesion: 0.05
Nodes (58): { getOpenReports, getStats, markStale, resolveReport }, { getOwnerJids }, { logSystem, logError }, midnightReview(), { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState() (+50 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.22
Nodes (8): { formatCommandUsage, formatError, box }, { formatDisplayMention }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName }, { transferMoney, getBalance }, usageMessage

### Community 21 - "schemaValidator.js"
Cohesion: 0.05
Nodes (40): 0.1 — Backup del grafo, 0.2 — Snapshot de tests, 0.3 — Tag pre-limpieza, 1.1 — Revisar qué hacen realmente los comandos rotos, 1.2 — Implementar `getCharacterNames` en `characterService.js`, 1.3 — Implementar `renameCharacter` en `characterService.js`, 1.4 — Implementar `updateCharacterSlots` en `characterService.js`, 1.5 — Exportar las 3 nuevas funciones (+32 more)

### Community 22 - "safeQuery.js"
Cohesion: 0.31
Nodes (9): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), resolveEconomyProfile(), getOrCreateProfile(), getUserProfile() (+1 more)

### Community 23 - "loggerService.js"
Cohesion: 0.05
Nodes (39): 0.1 TypeScript strict mode, 0.2 Knip (dead code analysis), 1.1 Script `check:all` unificado, 1.2 Husky + lint-staged, 1.3 GitHub Actions CI, 2.1 eslint-plugin-jsdoc, 2.2 Vitest (migración de tests), 2.3 Stryker (mutation testing) (+31 more)

### Community 24 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 25 - "help.js"
Cohesion: 0.29
Nodes (10): buildAliasStr(), buildSection(), CAT_META, CAT_ORDER, COMBAT_CMDS, { commands }, execute(), getGroup() (+2 more)

### Community 26 - "getActiveCharacter"
Cohesion: 0.27
Nodes (9): execute(), { formatCharacter }, { getActiveCharacter }, execute(), { formatCharacter }, { getActiveCharacter }, getActiveCharacter(), { box } (+1 more)

### Community 27 - "supabase.js"
Cohesion: 0.06
Nodes (32): Checklist de Implementación — Limpieza de Código, Fase 0: Preparación, Fase 1: Importaciones Rotas (CRÍTICO), Fase 2: Archivos Completamente Muertos, Fase 3: Exports Sin Uso Externo, Fase 4: Código Duplicado, Fase 5: Verificación Final, Paso 1.1 — Implementar `getCharacterNames` en `characterService.js` (+24 more)

### Community 28 - "groupAdminHelper.js"
Cohesion: 0.14
Nodes (17): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+9 more)

### Community 29 - "crear_pj.js"
Cohesion: 0.17
Nodes (10): { createCharacter, setActiveCharacter }, { formatCommandForm, formatError, box }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, CHARACTER_CATEGORIES, CHARACTER_ROOT, DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS (+2 more)

### Community 30 - "schemaMigration.js"
Cohesion: 0.09
Nodes (21): [2.0.0] - 2026-07-11, [2.0.1] - 2026-07-11, [3.0.0] - 2026-07-14, AI_CHANGELOG.md — Registro de Cambios de la IA, Archivos Creados/Reescritos, Archivos modificados:, Archivos modificados (principales), Decisiones técnicas: (+13 more)

### Community 31 - "stats.js"
Cohesion: 0.36
Nodes (9): formatDuration(), getMemory(), getUptime(), stats, bar(), pad(), render(), startDashboard() (+1 more)

### Community 32 - "box"
Cohesion: 0.11
Nodes (18): 0.1 Fix ESLint errors × 11, 0.2 Fix tests que crashean, 0.3 Fix tests con fallos, 0.4 Fix exports faltantes, 1.1 Eliminar variables muertas, 1.2 Agregar JSDoc (core/ + services/), 1.3 Formatear todo el código, 1.4 Orphan analysis (+10 more)

### Community 33 - "eco_admin_rem.js"
Cohesion: 0.16
Nodes (15): execute(), { formatCommandUsage, formatError, box }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin, isEconomyAdmin }, usageMessage (+7 more)

### Community 34 - "formatDisplayMention"
Cohesion: 0.16
Nodes (15): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel(), { box } (+7 more)

### Community 35 - "eventHandler.js"
Cohesion: 0.28
Nodes (8): createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents(), incrementMessages()

### Community 36 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 37 - "test_message_format_utils.js"
Cohesion: 0.25
Nodes (6): assert, { box, formatCommandUsage, formatCommandForm, formatError }, forbiddenImports, fs, path, srcContent

### Community 38 - "actividad_global.js"
Cohesion: 0.24
Nodes (16): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), normalizeActivity(), normalizeProfile() (+8 more)

### Community 39 - "LRUCache"
Cohesion: 0.14
Nodes (13): Criterios de ponderación, Dependencias entre FASE 0, Dependencias entre FASE 1, Dependencias entre FASE 2, Dependencias entre FASE 3, FASE 0 — Fundación (pre-guardarraíles), FASE 1 — Guardarraíles (prevenir regresión), FASE 2 — Calidad (métricas y testing) (+5 more)

### Community 40 - "economyAdminHelper.js"
Cohesion: 0.22
Nodes (12): execute(), extractAmountFromArgs(), getFirstMentionedJid(), parsePositiveInteger(), executeEconomyAction(), { formatCommandUsage, formatError, box }, { formatDisplayMention }, { formatStelas } (+4 more)

### Community 41 - "editar_pj_descripcion.js"
Cohesion: 0.29
Nodes (6): execute(), { formatCommandUsage, formatError, box }, { getActiveCharacter }, { isAdmin }, { updateCharacterSlots }, usageMessage

### Community 42 - "eliminar_pj.js"
Cohesion: 0.18
Nodes (11): dotenv, dependencies, dotenv, pino, qrcode-terminal, @supabase/supabase-js, @whiskeysockets/baileys, pino (+3 more)

### Community 43 - "mis_pj.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 44 - "resultUtils.js"
Cohesion: 0.18
Nodes (10): author, description, license, lint-staged, *.js, main, name, version (+2 more)

### Community 45 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 46 - "test_command_usage_format.js"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

### Community 70 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 71 - "Roadmap de Optimización y Salud — RolBot"
Cohesion: 0.22
Nodes (8): Criterios de ponderación, FASE 0 — Correcciones críticas (ahora), FASE 1 — Deuda técnica de alto impacto (1-2 semanas), FASE 2 — Arquitectura y testing (2-4 semanas), FASE 3 — Resiliencia y monitoreo (1-2 meses), Recomendaciones inmediatas (próximos 3 días), Roadmap de Optimización y Salud — RolBot, Scoreboard resumen

### Community 72 - "2026-07-14 — Tooling & cleanup sprint"
Cohesion: 0.29
Nodes (6): 2026-07-14 — Tooling & cleanup sprint, Added, Changelog, Fixed, Remaining debt, Removed

### Community 73 - "renombrar_pj.js"
Cohesion: 0.29
Nodes (6): { formatCommandUsage, formatError, box }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter }, usageMessage

### Community 74 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 75 - "keywords"
Cohesion: 0.40
Nodes (5): keywords, baileys, bot, rpg, whatsapp

### Community 76 - "set_stelas.js"
Cohesion: 0.50
Nodes (4): execute(), { executeEconomyAction }, { setMoney }, setMoney()

## Knowledge Gaps
- **547 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+542 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `groupUtils.js` to `eco_admin_rem.js`, `formatDisplayMention`, `bugReportService.js`, `userService.js`, `economyAdminHelper.js`, `editar_pj_descripcion.js`, `formatError`, `actividad.js`, `mis_pj.js`, `characterService.js`, `renombrar_pj.js`, `unwarn.js`, `resolveTargetDisplayName`, `dar_stelas.js`, `safeQuery.js`, `getActiveCharacter`, `groupAdminHelper.js`, `crear_pj.js`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `logSystem()` connect `logError` to `bugReportService.js`, `bot.js`, `characterService.js`, `groupActivityService.js`, `commandHandler.js`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `supabase` connect `logError` to `economyService.js`, `bugReportService.js`, `userService.js`, `actividad_global.js`, `characterService.js`, `groupActivityService.js`, `unwarn.js`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _547 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `economyService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09971509971509972 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._