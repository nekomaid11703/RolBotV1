# Graph Report - .  (2026-07-20)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 865 nodes · 1447 edges · 72 communities (49 shown, 23 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 177 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9785c0a9`
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
- todos.js
- LRUCache
- graphify — Knowledge Graph (Code-Only)
- balance.js
- bugreport.js
- grupo_cerrar.js
- invite.js
- message_format.test.js
- test_command_usage_format.js
- commandParseUtils.js
- carta_blanca.test.js
- h
- groupConfig.js
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
3. `filterExisting()` - 18 edges
4. `logError()` - 15 edges
5. `formatCommandUsage()` - 14 edges
6. `getUserProfile()` - 13 edges
7. `normalizeCharacterRecord()` - 13 edges
8. `getCharacterSlug()` - 11 edges
9. `logSystem()` - 10 edges
10. `saveUserProfile()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `runCleanOldLogsTests()` --indirect_call--> `exists()`  [INFERRED]
  tests/test_logger_service.js → scripts/tools-list.js
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `getOwnerJids()`  [EXTRACTED]
  scripts/midnight_review.js → src/utils/permissionUtils.js
- `scheduleNext()` --calls--> `midnightReview()`  [EXTRACTED]
  src/services/schedulerService.js → scripts/midnight_review.js

## Import Cycles
- None detected.

## Communities (72 total, 23 thin omitted)

### Community 0 - "characterService.js"
Cohesion: 0.06
Nodes (66): calculateLevel(), CLASSES, DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, getHpState(), HP_THRESHOLDS, LEVELABLE_STATS, maxSkillSlots() (+58 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.05
Nodes (62): { getOpenReports, getStats, markStale, resolveReport }, { getOwnerJids }, { logSystem, logError }, midnightReview(), OWNER_ALIASES, createContext(), { extractPhoneNumber, normalizeJid }, extractText() (+54 more)

### Community 2 - "groupUtils.js"
Cohesion: 0.07
Nodes (36): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+28 more)

### Community 3 - "eventHandler.js"
Cohesion: 0.08
Nodes (34): handleCommand(), createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents() (+26 more)

### Community 4 - "box"
Cohesion: 0.08
Nodes (26): { box }, execute(), { formatCount, formatDate, medal }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getTopActiveUsers, getUserProfile }, { resolveTargetDisplayName }, { box } (+18 more)

### Community 5 - "test_logger_service.js"
Cohesion: 0.10
Nodes (26): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE (+18 more)

### Community 6 - "commandHandler.js"
Cohesion: 0.10
Nodes (26): buildAliasStr(), buildSection(), CAT_META, CAT_ORDER, COMBAT_CMDS, { commands }, execute(), getGroup() (+18 more)

### Community 7 - "schemaMigration.js"
Cohesion: 0.11
Nodes (25): discover(), { logSystem }, { supabase }, COLUMN_TYPES, DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL() (+17 more)

### Community 8 - "formatError"
Cohesion: 0.09
Nodes (21): { addParticipant }, { box }, execute(), { formatError }, { box }, execute(), { formatError }, { openGroup } (+13 more)

### Community 9 - "economyAdminHelper.js"
Cohesion: 0.11
Nodes (19): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, execute(), { executeEconomyAction } (+11 more)

### Community 10 - "userService.js"
Cohesion: 0.17
Nodes (21): getBalance(), buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), getUserProfile(), listUserProfiles() (+13 more)

### Community 11 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, src/**/*.js, project, rules, exports (+12 more)

### Community 12 - "economyService.js"
Cohesion: 0.21
Nodes (18): addMoney(), claimDaily(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, { filterExisting }, getMoneyValue(), { getUserProfile, getOrCreateProfile, saveUserProfile }, { logError }, removeMoney() (+10 more)

### Community 13 - "safeQuery.js"
Cohesion: 0.13
Nodes (11): hasColumn(), getTopBalances(), cache, TTLS, { cache, TTLS }, groupCacheKey(), { hasColumn }, invalidateGroupCache() (+3 more)

### Community 14 - "test_helpers.js"
Cohesion: 0.15
Nodes (14): crypto, getCacheKey(), helpers, run(), helpers, path, run(), assert() (+6 more)

### Community 15 - "formatErrorUtils.js"
Cohesion: 0.19
Nodes (15): { box }, execute(), { formatCommandUsage }, { formatError }, usageMessage, buildFormBody(), buildUsageBody(), formatCommandForm() (+7 more)

### Community 16 - "bot.js"
Cohesion: 0.15
Nodes (18): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+10 more)

### Community 17 - "crear_pj.js"
Cohesion: 0.16
Nodes (15): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+7 more)

### Community 18 - "characterFormatUtils.js"
Cohesion: 0.20
Nodes (12): execute(), { formatCharacter }, { getActiveCharacter }, getActiveCharacter(), getCombatStats(), { box }, buildHpBar(), formatCharacter() (+4 more)

### Community 19 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 20 - "permissionService.js"
Cohesion: 0.22
Nodes (13): { getProfileDisplayName }, { getUserProfile, getOrCreateProfile, listUserProfiles }, hasEconomyPermission(), isEconomyAdmin(), { isOwner }, listEconomyAdmins(), pickDisplayName(), readPermissions() (+5 more)

### Community 21 - "dar_stelas.js"
Cohesion: 0.17
Nodes (11): { box }, execute(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile } (+3 more)

### Community 22 - "eco_admin_add.js"
Cohesion: 0.18
Nodes (10): { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+2 more)

### Community 23 - "eco_admin_rem.js"
Cohesion: 0.18
Nodes (10): { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+2 more)

### Community 24 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 25 - "actividad.js"
Cohesion: 0.20
Nodes (9): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+1 more)

### Community 26 - "userMentionUtils.js"
Cohesion: 0.33
Nodes (7): execute(), { formatDisplayMention }, cleanText(), formatDisplayMention(), formatRealMentionTag(), getProfileDisplayName(), isMeaningfulDisplayName()

### Community 27 - "renombrar_pj.js"
Cohesion: 0.20
Nodes (9): { box }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter } (+1 more)

### Community 28 - "editar_pj.js"
Cohesion: 0.22
Nodes (8): { box }, execute(), { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 29 - "switch_pj.js"
Cohesion: 0.22
Nodes (8): { box }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { setActiveCharacter }, usageMessage

### Community 30 - "supabase.js"
Cohesion: 0.25
Nodes (6): { createClient }, { logSystem }, supabase, assert, REQUIRED_TABLES, { supabase }

### Community 31 - "unwarn.js"
Cohesion: 0.25
Nodes (7): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }

### Community 32 - "warn.js"
Cohesion: 0.25
Nodes (7): { addWarn, getWarns, MAX_WARNS }, { box }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }

### Community 33 - "daily.js"
Cohesion: 0.32
Nodes (7): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel()

### Community 34 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 35 - "test_message_format_utils.js"
Cohesion: 0.25
Nodes (6): assert, { box, formatCommandUsage, formatCommandForm, formatError }, forbiddenImports, fs, path, srcContent

### Community 36 - "todos.js"
Cohesion: 0.29
Nodes (6): { box }, execute(), { formatCount }, { formatError }, { formatRealMentionTag, withMentions }, { getGroupMetadata }

### Community 38 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 39 - "balance.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget()

### Community 40 - "bugreport.js"
Cohesion: 0.33
Nodes (5): { box }, { createReport }, execute(), { formatError }, reportCooldowns

### Community 41 - "grupo_cerrar.js"
Cohesion: 0.40
Nodes (4): { box }, { closeGroup }, execute(), { formatError }

### Community 42 - "invite.js"
Cohesion: 0.40
Nodes (4): { box }, execute(), { formatError }, { getInviteCode }

### Community 43 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 44 - "test_command_usage_format.js"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

## Knowledge Gaps
- **381 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+376 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `box` to `groupUtils.js`, `formatError`, `economyAdminHelper.js`, `formatErrorUtils.js`, `crear_pj.js`, `characterFormatUtils.js`, `dar_stelas.js`, `eco_admin_add.js`, `eco_admin_rem.js`, `actividad.js`, `renombrar_pj.js`, `editar_pj.js`, `switch_pj.js`, `unwarn.js`, `warn.js`, `daily.js`, `todos.js`, `balance.js`, `bugreport.js`, `grupo_cerrar.js`, `invite.js`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `formatError()` connect `formatError` to `warn.js`, `groupUtils.js`, `todos.js`, `bugreport.js`, `grupo_cerrar.js`, `invite.js`, `economyAdminHelper.js`, `formatErrorUtils.js`, `crear_pj.js`, `dar_stelas.js`, `eco_admin_add.js`, `eco_admin_rem.js`, `renombrar_pj.js`, `editar_pj.js`, `switch_pj.js`, `unwarn.js`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `executeEconomyAction()` connect `economyAdminHelper.js` to `formatError`, `box`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _381 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `characterService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.062456140350877196 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05117117117117117 - nodes in this community are weakly interconnected._
- **Should `groupUtils.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07123034227567067 - nodes in this community are weakly interconnected._