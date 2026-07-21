# Graph Report - RolBotV1  (2026-07-20)

## Corpus Check
- 125 files · ~35,947 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 865 nodes · 1886 edges · 65 communities (45 shown, 20 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 177 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c9d366f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- characterService.js
- bugReportService.js
- groupUtils.js
- eventHandler.js
- box
- test_logger_service.js
- commandHandler.js
- schemaMigration.js
- formatError
- economyAdminHelper.js
- userService.js
- knip.json
- economyService.js
- safeQuery.js
- test_helpers.js
- formatErrorUtils.js
- bot.js
- crear_pj.js
- characterFormatUtils.js
- stryker.config.json
- permissionService.js
- dar_stelas.js
- eco_admin_add.js
- eco_admin_rem.js
- IA_rolbot — RolBotV1
- actividad.js
- userMentionUtils.js
- renombrar_pj.js
- editar_pj.js
- switch_pj.js
- supabase.js
- unwarn.js
- warn.js
- daily.js
- logger.test.js
- test_message_format_utils.js
- graphify — Knowledge Graph (Code-Only)
- bugreport.js
- grupo_cerrar.js
- invite.js
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

## God Nodes (most connected - your core abstractions)
1. `box()` - 61 edges
2. `formatError()` - 43 edges
3. `formatDisplayMention()` - 26 edges
4. `resolveTargetDisplayName()` - 25 edges
5. `logSystem()` - 23 edges
6. `logError()` - 22 edges
7. `filterExisting()` - 21 edges
8. `getUserProfile()` - 21 edges
9. `startBot()` - 19 edges
10. `getFirstMentionedJid()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `getOwnerJids()`  [EXTRACTED]
  scripts/midnight_review.js → src/utils/permissionUtils.js
- `runCleanOldLogsTests()` --indirect_call--> `exists()`  [INFERRED]
  tests/test_logger_service.js → scripts/tools-list.js
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `scheduleNext()` --calls--> `midnightReview()`  [EXTRACTED]
  src/services/schedulerService.js → scripts/midnight_review.js

## Import Cycles
- None detected.

## Communities (65 total, 20 thin omitted)

### Community 0 - "characterService.js"
Cohesion: 0.05
Nodes (88): { box }, execute(), { listCharacters }, execute(), { formatCharacter }, { getActiveCharacter }, calculateLevel(), CLASSES (+80 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.10
Nodes (36): { box }, execute(), { getOwnerRecords }, { listEconomyAdmins }, OWNER_ALIASES, createContext(), { extractPhoneNumber, normalizeJid }, extractText() (+28 more)

### Community 2 - "groupUtils.js"
Cohesion: 0.13
Nodes (18): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+10 more)

### Community 3 - "eventHandler.js"
Cohesion: 0.06
Nodes (29): GROUP_ACTIVITY_ROOT, path, hasColumn(), buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity() (+21 more)

### Community 4 - "box"
Cohesion: 0.13
Nodes (24): execute(), { box }, execute(), { formatCount, formatDate, medal }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getTopActiveUsers, getUserProfile }, { resolveTargetDisplayName } (+16 more)

### Community 5 - "test_logger_service.js"
Cohesion: 0.10
Nodes (26): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE (+18 more)

### Community 6 - "commandHandler.js"
Cohesion: 0.16
Nodes (16): buildAliasStr(), buildSection(), CAT_META, CAT_ORDER, COMBAT_CMDS, { commands }, execute(), getGroup() (+8 more)

### Community 7 - "schemaMigration.js"
Cohesion: 0.09
Nodes (32): discover(), { logSystem }, { supabase }, COLUMN_TYPES, DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL() (+24 more)

### Community 8 - "formatError"
Cohesion: 0.21
Nodes (14): execute(), { box }, { deleteCharacter }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin } (+6 more)

### Community 9 - "economyAdminHelper.js"
Cohesion: 0.05
Nodes (57): { addMoney }, execute(), { executeEconomyAction }, { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget() (+49 more)

### Community 10 - "userService.js"
Cohesion: 0.11
Nodes (22): { box }, execute(), { formatError }, { getReport, getUserReports }, CATEGORY_KEYWORDS, createReport(), crypto, determineCategory() (+14 more)

### Community 11 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 12 - "economyService.js"
Cohesion: 0.18
Nodes (13): { getOpenReports, getStats, markStale, resolveReport }, { getOwnerJids }, { logSystem, logError }, midnightReview(), { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState() (+5 more)

### Community 13 - "safeQuery.js"
Cohesion: 0.17
Nodes (14): { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand(), { hasEconomyPermission }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner }, loadCommands(), { logSystem, logCommand, logError } (+6 more)

### Community 14 - "test_helpers.js"
Cohesion: 0.15
Nodes (14): crypto, getCacheKey(), helpers, run(), helpers, path, run(), assert() (+6 more)

### Community 15 - "formatErrorUtils.js"
Cohesion: 0.32
Nodes (10): buildFormBody(), buildUsageBody(), formatCommandForm(), formatCommandUsage(), buildFeedbackBody(), compactLines(), formatFeedback(), { box } (+2 more)

### Community 16 - "bot.js"
Cohesion: 0.14
Nodes (20): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+12 more)

### Community 17 - "crear_pj.js"
Cohesion: 0.09
Nodes (28): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+20 more)

### Community 18 - "characterFormatUtils.js"
Cohesion: 0.20
Nodes (14): appendToLog(), cleanOldLogs(), ensureLogsDir(), fsp, getLogFileName(), LOG_PREFIX, logCommand(), LOGS_DIR (+6 more)

### Community 19 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 20 - "permissionService.js"
Cohesion: 0.36
Nodes (9): formatDuration(), getMemory(), getUptime(), stats, bar(), pad(), render(), startDashboard() (+1 more)

### Community 21 - "dar_stelas.js"
Cohesion: 0.16
Nodes (15): { box }, execute(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile } (+7 more)

### Community 22 - "eco_admin_add.js"
Cohesion: 0.10
Nodes (22): { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+14 more)

### Community 23 - "eco_admin_rem.js"
Cohesion: 0.33
Nodes (9): addWarn(), deleteWarn(), deleteWarns(), getWarns(), isBotAdmin(), { isSameIdentity }, participantMatches(), saveWarns() (+1 more)

### Community 24 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 25 - "actividad.js"
Cohesion: 0.22
Nodes (8): { box }, { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile }, { resolveTargetDisplayName }

### Community 26 - "userMentionUtils.js"
Cohesion: 0.18
Nodes (14): { addWarn, getWarns, MAX_WARNS }, { box }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, execute() (+6 more)

### Community 27 - "renombrar_pj.js"
Cohesion: 0.22
Nodes (8): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter }, usageMessage

### Community 28 - "editar_pj.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 29 - "switch_pj.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { setActiveCharacter }, usageMessage

### Community 30 - "supabase.js"
Cohesion: 0.28
Nodes (8): createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents(), incrementMessages()

### Community 31 - "unwarn.js"
Cohesion: 0.19
Nodes (14): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, cleanText() (+6 more)

### Community 32 - "warn.js"
Cohesion: 0.33
Nodes (5): { addParticipant }, { box }, execute(), { formatError }, addParticipant()

### Community 33 - "daily.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { openGroup }, openGroup()

### Community 34 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 35 - "test_message_format_utils.js"
Cohesion: 0.25
Nodes (6): assert, { box, formatCommandUsage, formatCommandForm, formatError }, forbiddenImports, fs, path, srcContent

### Community 38 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 40 - "bugreport.js"
Cohesion: 0.18
Nodes (11): { box }, { createReport }, execute(), { formatError }, reportCooldowns, { box }, execute(), { formatCommandUsage } (+3 more)

### Community 41 - "grupo_cerrar.js"
Cohesion: 0.40
Nodes (5): { box }, { closeGroup }, execute(), { formatError }, closeGroup()

### Community 42 - "invite.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { getInviteCode }, getInviteCode()

### Community 43 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 44 - "test_command_usage_format.js"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

## Knowledge Gaps
- **381 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+376 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `formatError` to `characterService.js`, `bugReportService.js`, `groupUtils.js`, `box`, `economyAdminHelper.js`, `userService.js`, `formatErrorUtils.js`, `crear_pj.js`, `dar_stelas.js`, `eco_admin_add.js`, `actividad.js`, `userMentionUtils.js`, `renombrar_pj.js`, `editar_pj.js`, `switch_pj.js`, `unwarn.js`, `warn.js`, `daily.js`, `bugreport.js`, `grupo_cerrar.js`, `invite.js`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `supabase` connect `schemaMigration.js` to `characterService.js`, `bugReportService.js`, `eventHandler.js`, `economyAdminHelper.js`, `userService.js`, `economyService.js`, `eco_admin_rem.js`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `formatError()` connect `bugreport.js` to `warn.js`, `daily.js`, `groupUtils.js`, `box`, `formatError`, `grupo_cerrar.js`, `invite.js`, `userService.js`, `economyAdminHelper.js`, `formatErrorUtils.js`, `crear_pj.js`, `dar_stelas.js`, `eco_admin_add.js`, `userMentionUtils.js`, `renombrar_pj.js`, `editar_pj.js`, `switch_pj.js`, `unwarn.js`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _381 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `characterService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05071119356833643 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `groupUtils.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12987012987012986 - nodes in this community are weakly interconnected._