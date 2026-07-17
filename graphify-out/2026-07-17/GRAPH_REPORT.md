# Graph Report - .  (2026-07-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 851 nodes · 1709 edges · 70 communities (48 shown, 22 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 149 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee454d41`
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

## God Nodes (most connected - your core abstractions)
1. `box()` - 59 edges
2. `formatError()` - 42 edges
3. `formatDisplayMention()` - 26 edges
4. `resolveTargetDisplayName()` - 25 edges
5. `logSystem()` - 23 edges
6. `scripts` - 22 edges
7. `logError()` - 22 edges
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

## Communities (70 total, 22 thin omitted)

### Community 0 - "economyService.js"
Cohesion: 0.06
Nodes (50): { addMoney }, execute(), { executeEconomyAction }, { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget() (+42 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.07
Nodes (45): { box, formatError }, { createReport }, execute(), reportCooldowns, { box, formatError }, execute(), { getReport, getUserReports }, OWNER_ALIASES (+37 more)

### Community 2 - "scripts"
Cohesion: 0.04
Nodes (48): dotenv, author, dependencies, dotenv, pino, qrcode-terminal, @supabase/supabase-js, @whiskeysockets/baileys (+40 more)

### Community 3 - "groupUtils.js"
Cohesion: 0.07
Nodes (31): { addParticipant }, execute(), { formatError, box }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { formatError, box } (+23 more)

### Community 4 - "userService.js"
Cohesion: 0.10
Nodes (34): { box }, execute(), { getOwnerRecords }, { listEconomyAdmins }, { getProfileDisplayName }, { getUserProfile, getOrCreateProfile, listUserProfiles }, hasEconomyPermission(), isEconomyAdmin() (+26 more)

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
Cohesion: 0.15
Nodes (19): execute(), execute(), execute(), execute(), { formatCommandUsage, formatError, box }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH } (+11 more)

### Community 11 - "actividad.js"
Cohesion: 0.15
Nodes (17): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+9 more)

### Community 12 - "test_helpers.js"
Cohesion: 0.15
Nodes (14): crypto, getCacheKey(), helpers, run(), helpers, path, run(), assert() (+6 more)

### Community 13 - "characterService.js"
Cohesion: 0.27
Nodes (18): CHARACTER_CATEGORIES, filterExisting(), {
  CHARACTER_CATEGORIES,
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  MAX_CHARACTERS_PER_USER,
}, createCharacter(), deleteCharacter(), { filterExisting }, getCharacterSlug(), { invalidateUserCache, charactersCacheKey, safeSingleOrNull, cache, TTLS } (+10 more)

### Community 14 - "groupActivityService.js"
Cohesion: 0.18
Nodes (17): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), ensureGroupActivity(), { filterExisting }, getGroupActivity(), getGroupMemberActivity(), getTopGroupMembers() (+9 more)

### Community 15 - "commandHandler.js"
Cohesion: 0.15
Nodes (17): aliases, fs, getJsFilesRecursively(), handleCommand(), { hasEconomyPermission }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner } (+9 more)

### Community 16 - "unwarn.js"
Cohesion: 0.17
Nodes (15): { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError, box }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS }, execute() (+7 more)

### Community 17 - "resolveTargetDisplayName"
Cohesion: 0.18
Nodes (15): execute(), { formatCommandUsage, formatError, box }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin }, usageMessage (+7 more)

### Community 18 - "logError"
Cohesion: 0.18
Nodes (13): { getOpenReports, getStats, markStale, resolveReport }, { getOwnerJids }, { logSystem, logError }, midnightReview(), { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState() (+5 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.18
Nodes (14): execute(), execute(), { formatCommandUsage, formatError, box }, { formatDisplayMention }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName } (+6 more)

### Community 20 - "messageFormatUtils.js"
Cohesion: 0.20
Nodes (11): execute(), { formatCommandUsage, formatError, box }, usageMessage, buildFeedbackBody(), buildFormBody(), buildUsageBody(), compactLines(), formatCommandForm() (+3 more)

### Community 21 - "schemaValidator.js"
Cohesion: 0.18
Nodes (13): discover(), checkHealth(), { checkVersion }, CRITICAL_EQUALS_COLUMNS, { discover }, { logSystem, logError }, SCHEMA, { supabase } (+5 more)

### Community 22 - "safeQuery.js"
Cohesion: 0.16
Nodes (8): hasColumn(), cache, TTLS, { cache, TTLS }, { hasColumn }, { logSystem }, safeSelect(), userCacheKey()

### Community 23 - "loggerService.js"
Cohesion: 0.20
Nodes (14): appendToLog(), cleanOldLogs(), ensureLogsDir(), fsp, getLogFileName(), LOG_PREFIX, logCommand(), LOGS_DIR (+6 more)

### Community 24 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 25 - "help.js"
Cohesion: 0.26
Nodes (11): buildAliasStr(), buildSection(), CAT_META, CAT_ORDER, COMBAT_CMDS, { commands }, execute(), getGroup() (+3 more)

### Community 26 - "getActiveCharacter"
Cohesion: 0.27
Nodes (9): execute(), { formatCharacter }, { getActiveCharacter }, execute(), { formatCharacter }, { getActiveCharacter }, getActiveCharacter(), { box } (+1 more)

### Community 27 - "supabase.js"
Cohesion: 0.20
Nodes (8): { logSystem }, { supabase }, { createClient }, { logSystem }, supabase, assert, REQUIRED_TABLES, { supabase }

### Community 28 - "groupAdminHelper.js"
Cohesion: 0.24
Nodes (9): execute(), { executeGroupAction }, { removeParticipant }, executeGroupAction(), { formatDisplayMention, withMentions }, { formatError, box }, { getFirstMentionedJid }, { resolveTargetDisplayName } (+1 more)

### Community 29 - "crear_pj.js"
Cohesion: 0.18
Nodes (9): { createCharacter, setActiveCharacter }, { formatCommandForm, formatError, box }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, CHARACTER_ROOT, DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, path (+1 more)

### Community 30 - "schemaMigration.js"
Cohesion: 0.25
Nodes (10): COLUMN_TYPES, DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL(), logMigrationInfo(), { logSystem }, runStartupMigration() (+2 more)

### Community 31 - "stats.js"
Cohesion: 0.36
Nodes (9): formatDuration(), getMemory(), getUptime(), stats, bar(), pad(), render(), startDashboard() (+1 more)

### Community 32 - "box"
Cohesion: 0.31
Nodes (8): { box }, execute(), { formatCount, medal }, { formatDisplayMention, withMentions }, { getTopGroupMembers }, execute(), medal(), box()

### Community 33 - "eco_admin_rem.js"
Cohesion: 0.22
Nodes (8): execute(), { formatCommandUsage, formatError, box }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin, isEconomyAdmin }, usageMessage

### Community 34 - "formatDisplayMention"
Cohesion: 0.39
Nodes (7): execute(), { formatDisplayMention }, cleanText(), formatDisplayMention(), formatRealMentionTag(), getProfileDisplayName(), isMeaningfulDisplayName()

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
Cohesion: 0.29
Nodes (6): { box }, { formatCount, formatDate, medal }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getTopActiveUsers, getUserProfile }, { resolveTargetDisplayName }

### Community 40 - "economyAdminHelper.js"
Cohesion: 0.29
Nodes (6): { formatCommandUsage, formatError, box }, { formatDisplayMention }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { resolveTargetDisplayName }, usageCache

### Community 41 - "editar_pj_descripcion.js"
Cohesion: 0.33
Nodes (5): { formatCommandUsage, formatError, box }, { getActiveCharacter }, { isAdmin }, { updateCharacterSlots }, usageMessage

### Community 42 - "eliminar_pj.js"
Cohesion: 0.33
Nodes (5): { deleteCharacter }, { formatCommandUsage, formatError, box }, { getCharacterNames }, { isAdmin }, usageMessage

### Community 43 - "mis_pj.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 45 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 46 - "test_command_usage_format.js"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

## Knowledge Gaps
- **392 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+387 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `box` to `economyService.js`, `bugReportService.js`, `groupUtils.js`, `userService.js`, `formatError`, `actividad.js`, `unwarn.js`, `resolveTargetDisplayName`, `dar_stelas.js`, `messageFormatUtils.js`, `getActiveCharacter`, `groupAdminHelper.js`, `crear_pj.js`, `eco_admin_rem.js`, `actividad_global.js`, `economyAdminHelper.js`, `editar_pj_descripcion.js`, `eliminar_pj.js`, `mis_pj.js`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `supabase` connect `supabase.js` to `economyService.js`, `bugReportService.js`, `groupUtils.js`, `userService.js`, `characterService.js`, `groupActivityService.js`, `logError`, `schemaValidator.js`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `logSystem()` connect `bot.js` to `bugReportService.js`, `characterService.js`, `commandHandler.js`, `logError`, `schemaValidator.js`, `safeQuery.js`, `loggerService.js`, `supabase.js`, `schemaMigration.js`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _392 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `economyService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06253652834599649 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07088989441930618 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._