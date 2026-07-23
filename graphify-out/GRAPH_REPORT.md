# Graph Report - RolBotV1  (2026-07-22)

## Corpus Check
- 153 files · ~43,749 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1050 nodes · 2483 edges · 69 communities (52 shown, 17 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 219 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d1b561d4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- bot.js
- bugReportService.js
- groupActivityService.js
- loggerService.js
- characterService.js
- economyAdminHelper.js
- crear_pj.js
- box
- test_logger_service.js
- characterConfig.js
- characterProgressionService.js
- userService.js
- knip.json
- getUserProfile
- unwarn.js
- economyService.js
- test_helpers.js
- groupUtils.js
- formatErrorUtils.js
- dar_stelas.js
- box
- stryker.config.json
- resolveTargetDisplayName
- eliminar_pj.js
- characterSkillUtils.js
- eco_admin_rem.js
- permissionService.js
- IA_rolbot — RolBotV1
- set_stelas.js
- combatEngine.js
- renombrar_pj.js
- dado.js
- formatError
- logger.test.js
- LRUCache
- graphify — Knowledge Graph (Code-Only)
- formatError
- grupo_cerrar.js
- invite.js
- actividad.js
- add.js
- message_format.test.js
- h
- Plan: Implementacion de Stats Magicas + Correcciones
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
- renombrar_pj.js
- schemaMigration.js
- resolveTargetDisplayName
- commandRegistry.js
- admin_perm_add.js
- admin_perm_rem.js
- eco_admin_rem.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 90 edges
2. `formatError()` - 66 edges
3. `formatDisplayMention()` - 30 edges
4. `resolveTargetDisplayName()` - 29 edges
5. `logSystem()` - 29 edges
6. `logError()` - 29 edges
7. `getActiveCharacter()` - 27 edges
8. `getFirstMentionedJid()` - 23 edges
9. `withMentions()` - 23 edges
10. `getUserProfile()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `getOwnerJids()`  [EXTRACTED]
  scripts/midnight_review.js → src/utils/permissionUtils.js
- `midnightReview()` --calls--> `getOpenReports()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/reportMaintenanceService.js
- `midnightReview()` --calls--> `getStats()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/reportMaintenanceService.js

## Import Cycles
- None detected.

## Communities (69 total, 17 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.14
Nodes (20): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+12 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.08
Nodes (35): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, execute() (+27 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (33): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+25 more)

### Community 3 - "loggerService.js"
Cohesion: 0.19
Nodes (19): filterExisting(), deleteCharacter(), setHp(), addItem(), characterLocks, ensureTestKit(), { filterExisting }, { getActiveCharacter, setHp } (+11 more)

### Community 4 - "characterService.js"
Cohesion: 0.27
Nodes (10): buildAliasStr(), buildSubcatBlock(), { commands }, execute(), getSubcat(), normCat(), renderCmd(), SECTIONS (+2 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.09
Nodes (26): { box }, { createReport }, { formatError }, reportCooldowns, { box }, execute(), { formatError }, { getReport, getUserReports } (+18 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.20
Nodes (9): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin } (+1 more)

### Community 7 - "box"
Cohesion: 0.13
Nodes (23): execute(), { box }, execute(), { formatCount, formatDate, medal }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getTopActiveUsers, getUserProfile }, { resolveTargetDisplayName } (+15 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.28
Nodes (8): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE

### Community 9 - "characterConfig.js"
Cohesion: 0.18
Nodes (14): { addWarn, getWarns, MAX_WARNS }, { box }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, execute() (+6 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.18
Nodes (10): { box }, { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName } (+2 more)

### Community 11 - "userService.js"
Cohesion: 0.06
Nodes (35): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { box }, { getActiveCharacter }, { getInventory }, { getItem, ITEMS } (+27 more)

### Community 12 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 13 - "getUserProfile"
Cohesion: 0.17
Nodes (21): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getOrCreateProfile(), getTopActiveUsers(), getUserProfile(), listUserProfiles() (+13 more)

### Community 14 - "unwarn.js"
Cohesion: 0.22
Nodes (8): { box }, { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile }, { resolveTargetDisplayName }

### Community 15 - "economyService.js"
Cohesion: 0.22
Nodes (18): addMoney(), claimDaily(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, { filterExisting }, getBalance(), getMoneyValue(), { getUserProfile, getOrCreateProfile, saveUserProfile }, { logError } (+10 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.22
Nodes (6): { box }, { getOwnerRecords }, { listEconomyAdmins }, { box }, { formatError }, { useItem }

### Community 17 - "groupUtils.js"
Cohesion: 0.19
Nodes (13): { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand(), { hasEconomyPermission, hasPermissionForCategory, getCategoryLabel }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner }, { logSystem, logCommand, logError }, path (+5 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.28
Nodes (10): buildFormBody(), buildUsageBody(), formatCommandForm(), formatCommandUsage(), buildFeedbackBody(), compactLines(), formatFeedback(), { box } (+2 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.28
Nodes (8): createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents(), incrementMessages()

### Community 20 - "box"
Cohesion: 0.25
Nodes (6): { createClient }, { logSystem }, supabase, assert, REQUIRED_TABLES, { supabase }

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 23 - "eliminar_pj.js"
Cohesion: 0.07
Nodes (28): GROUP_ACTIVITY_ROOT, path, hasColumn(), buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity() (+20 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.06
Nodes (42): { addMoney }, execute(), { executeEconomyAction }, { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget() (+34 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.06
Nodes (41): { addParticipant }, { box }, execute(), { formatError }, execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin } (+33 more)

### Community 26 - "permissionService.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { setActiveCharacter }, usageMessage

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.29
Nodes (6): { box }, { formatCommandUsage }, { formatError }, { listCharacters, deleteCharacter }, pendingConfirmations, usageMessage

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.36
Nodes (9): formatDuration(), getMemory(), getUptime(), stats, bar(), pad(), render(), startDashboard() (+1 more)

### Community 31 - "dado.js"
Cohesion: 0.40
Nodes (4): { box }, { formatCommandUsage }, { formatError }, usageMessage

### Community 32 - "formatError"
Cohesion: 0.14
Nodes (28): calculateLevel(), CLASSES, DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, HP_THRESHOLDS, LEVELABLE_STATS, RACES, RANGOS (+20 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 35 - "LRUCache"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.05
Nodes (90): execute(), execute(), execute(), execute(), executeDeletion(), execute(), execute(), { box } (+82 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.10
Nodes (33): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, SESSION_STATES, formatCombatDisolved(), cleanup(), clearPendingReaction(), createDummySession() (+25 more)

### Community 39 - "invite.js"
Cohesion: 0.18
Nodes (15): getRole(), cleanText(), extractMentionLabelFromContext(), findParticipantDisplayName(), { getGroupMetadata }, { getUserProfile }, isMeaningfulDisplayName(), resolveTargetDisplayName() (+7 more)

### Community 40 - "actividad.js"
Cohesion: 0.16
Nodes (18): { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState(), appendToLog(), ensureLogsDir(), fsp, getLogFileName() (+10 more)

### Community 41 - "add.js"
Cohesion: 0.21
Nodes (13): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), getOpenReports(), getStats(), { logSystem }, markStale() (+5 more)

### Community 42 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 68 - "renombrar_pj.js"
Cohesion: 0.22
Nodes (8): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter }, usageMessage

### Community 69 - "schemaMigration.js"
Cohesion: 0.10
Nodes (30): discover(), KNOWN_SCHEMA, { logSystem }, { supabase }, COLUMN_TYPES, createMissingTables(), DESIRED_SCHEMA, detectMissingColumns() (+22 more)

### Community 71 - "resolveTargetDisplayName"
Cohesion: 0.21
Nodes (11): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, execute() (+3 more)

### Community 72 - "commandRegistry.js"
Cohesion: 0.22
Nodes (10): loadCommands(), aliases, commands, fs, getJsFilesRecursively(), normalizeName(), path, registerCommand() (+2 more)

### Community 73 - "admin_perm_add.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 74 - "admin_perm_rem.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 76 - "eco_admin_rem.js"
Cohesion: 0.12
Nodes (28): execute(), execute(), execute(), { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError } (+20 more)

## Knowledge Gaps
- **485 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+480 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `formatError` to `bugReportService.js`, `groupActivityService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterConfig.js`, `characterProgressionService.js`, `userService.js`, `unwarn.js`, `test_helpers.js`, `formatErrorUtils.js`, `resolveTargetDisplayName`, `characterSkillUtils.js`, `eco_admin_rem.js`, `permissionService.js`, `set_stelas.js`, `dado.js`, `LRUCache`, `grupo_cerrar.js`, `invite.js`, `renombrar_pj.js`, `resolveTargetDisplayName`, `admin_perm_add.js`, `admin_perm_rem.js`, `eco_admin_rem.js`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `formatError()` connect `formatError` to `groupActivityService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterConfig.js`, `characterProgressionService.js`, `userService.js`, `test_helpers.js`, `formatErrorUtils.js`, `characterSkillUtils.js`, `eco_admin_rem.js`, `permissionService.js`, `set_stelas.js`, `dado.js`, `LRUCache`, `invite.js`, `renombrar_pj.js`, `resolveTargetDisplayName`, `admin_perm_add.js`, `admin_perm_rem.js`, `eco_admin_rem.js`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `logError()` connect `actividad.js` to `bot.js`, `loggerService.js`, `schemaMigration.js`, `economyAdminHelper.js`, `grupo_cerrar.js`, `add.js`, `economyService.js`, `groupUtils.js`, `dar_stelas.js`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _485 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08478513356562137 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07716701902748414 - nodes in this community are weakly interconnected._