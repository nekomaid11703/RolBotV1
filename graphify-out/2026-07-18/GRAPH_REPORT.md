# Graph Report - .  (2026-07-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 929 nodes · 1783 edges · 70 communities (50 shown, 20 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 171 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9785c0a9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- commandHandler.js
- actividad.js
- box
- safeQuery.js
- permissionService.js
- devDependencies
- test_logger_service.js
- columnRegistry.js
- scripts
- characterProgressionService.js
- groupUtils.js
- characterService.js
- economyService.js
- crear_pj.js
- compilerOptions
- economyAdminHelper.js
- knip.json
- groupAdminHelper.js
- bugReportService.js
- renombrar_pj.js
- test_helpers.js
- bot.js
- userService.js
- logError
- resolveTargetDisplayName
- characterFormatUtils.js
- loggerService.js
- stryker.config.json
- characterConfig.js
- dependencies
- getUserProfile
- IA_rolbot — RolBotV1
- daily.js
- dar_stelas.js
- top_dinero.js
- supabase.js
- logger.test.js
- test_message_format_utils.js
- package.json
- graphify — Knowledge Graph (Code-Only)
- bugstatus.js
- keywords
- message_format.test.js
- test_command_usage_format.js
- *.js
- add_stelas.js
- rem_stelas.js
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
1. `box()` - 51 edges
2. `formatError()` - 38 edges
3. `scripts` - 28 edges
4. `formatDisplayMention()` - 26 edges
5. `resolveTargetDisplayName()` - 25 edges
6. `getUserProfile()` - 21 edges
7. `filterExisting()` - 20 edges
8. `getFirstMentionedJid()` - 19 edges
9. `withMentions()` - 19 edges
10. `logError()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `runCleanOldLogsTests()` --indirect_call--> `exists()`  [INFERRED]
  tests/test_logger_service.js → scripts/tools-list.js
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `getOwnerJids()`  [EXTRACTED]
  scripts/midnight_review.js → src/utils/permissionUtils.js
- `scheduleNext()` --calls--> `midnightReview()`  [EXTRACTED]
  src/services/schedulerService.js → scripts/midnight_review.js

## Import Cycles
- None detected.

## Communities (70 total, 20 thin omitted)

### Community 0 - "commandHandler.js"
Cohesion: 0.06
Nodes (46): buildAliasStr(), buildSection(), CAT_META, CAT_ORDER, COMBAT_CMDS, { commands }, execute(), getGroup() (+38 more)

### Community 1 - "actividad.js"
Cohesion: 0.09
Nodes (37): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+29 more)

### Community 2 - "box"
Cohesion: 0.09
Nodes (37): { addParticipant }, execute(), { formatError, box }, execute(), { formatError, box }, { openGroup }, { closeGroup }, execute() (+29 more)

### Community 3 - "safeQuery.js"
Cohesion: 0.07
Nodes (26): GROUP_ACTIVITY_ROOT, path, hasColumn(), buildDefaultGroupRecord(), ensureGroupActivity(), { filterExisting }, getGroupActivity(), getGroupMemberActivity() (+18 more)

### Community 4 - "permissionService.js"
Cohesion: 0.10
Nodes (35): { box }, execute(), { getOwnerRecords }, { listEconomyAdmins }, OWNER_ALIASES, createContext(), { extractPhoneNumber, normalizeJid }, extractText() (+27 more)

### Community 5 - "devDependencies"
Cohesion: 0.07
Nodes (29): dependency-cruiser, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-jsdoc, globals, husky, knip (+21 more)

### Community 6 - "test_logger_service.js"
Cohesion: 0.10
Nodes (26): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE (+18 more)

### Community 7 - "columnRegistry.js"
Cohesion: 0.11
Nodes (25): discover(), { logSystem }, { supabase }, COLUMN_TYPES, DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL() (+17 more)

### Community 8 - "scripts"
Cohesion: 0.07
Nodes (28): scripts, audit, check, check:all, depcruise, depcruise:graph, dev, format (+20 more)

### Community 9 - "characterProgressionService.js"
Cohesion: 0.13
Nodes (24): getHabilidad(), HABILIDADES, habilidadesPorClase(), habilidadesUniversales(), listarHabilidades(), TIER_MULTIPLIERS, TIERS, desequiparHabilidad() (+16 more)

### Community 10 - "groupUtils.js"
Cohesion: 0.13
Nodes (23): { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError, box }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS }, execute() (+15 more)

### Community 11 - "characterService.js"
Cohesion: 0.13
Nodes (29): execute(), { formatCommandUsage, formatError, box }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage, DEFAULT_CHARACTER_SLOTS, xpForNextLevel() (+21 more)

### Community 12 - "economyService.js"
Cohesion: 0.17
Nodes (22): execute(), { executeEconomyAction }, { setMoney }, addMoney(), claimDaily(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, { filterExisting }, getBalance() (+14 more)

### Community 13 - "crear_pj.js"
Cohesion: 0.14
Nodes (19): buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm, formatError, box }, LABEL_TO_KEY, { listarClases } (+11 more)

### Community 14 - "compilerOptions"
Cohesion: 0.09
Nodes (22): _archive, bugs, graphify-out, logs, node_modules, tests, compilerOptions, allowJs (+14 more)

### Community 15 - "economyAdminHelper.js"
Cohesion: 0.12
Nodes (20): execute(), { formatCommandUsage, formatError, box }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin }, usageMessage (+12 more)

### Community 16 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, src/**/*.js, project, rules, exports (+12 more)

### Community 17 - "groupAdminHelper.js"
Cohesion: 0.14
Nodes (17): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+9 more)

### Community 18 - "bugReportService.js"
Cohesion: 0.12
Nodes (18): { box, formatError }, { createReport }, reportCooldowns, CATEGORY_KEYWORDS, createReport(), crypto, determineCategory(), determinePriority() (+10 more)

### Community 19 - "renombrar_pj.js"
Cohesion: 0.11
Nodes (17): { deleteCharacter }, execute(), { formatCommandUsage, formatError, box }, { getCharacterNames }, { isAdmin }, usageMessage, { box }, execute() (+9 more)

### Community 20 - "test_helpers.js"
Cohesion: 0.15
Nodes (14): crypto, getCacheKey(), helpers, run(), helpers, path, run(), assert() (+6 more)

### Community 21 - "bot.js"
Cohesion: 0.15
Nodes (18): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+10 more)

### Community 22 - "userService.js"
Cohesion: 0.21
Nodes (17): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), normalizeActivity(), normalizeProfile() (+9 more)

### Community 23 - "logError"
Cohesion: 0.27
Nodes (10): { getOpenReports, getStats, markStale, resolveReport }, { getOwnerJids }, { logSystem, logError }, midnightReview(), logError(), { logError }, { midnightReview }, scheduleNext() (+2 more)

### Community 24 - "resolveTargetDisplayName"
Cohesion: 0.18
Nodes (15): execute(), { formatCommandUsage, formatError, box }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin, isEconomyAdmin }, usageMessage (+7 more)

### Community 25 - "characterFormatUtils.js"
Cohesion: 0.21
Nodes (13): execute(), { formatCharacter }, { getActiveCharacter }, getHpState(), getActiveCharacter(), getCombatStats(), { box }, buildHpBar() (+5 more)

### Community 26 - "loggerService.js"
Cohesion: 0.20
Nodes (14): appendToLog(), ensureLogsDir(), fsp, getLogFileName(), LOG_PREFIX, logCommand(), LOGS_DIR, logSystem() (+6 more)

### Community 27 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 28 - "characterConfig.js"
Cohesion: 0.27
Nodes (10): calculateLevel(), CLASSES, DEFAULT_CHARACTER_STATS, HP_THRESHOLDS, LEVELABLE_STATS, maxSkillSlots(), RACES, RANGOS (+2 more)

### Community 29 - "dependencies"
Cohesion: 0.18
Nodes (11): dotenv, dependencies, dotenv, pino, qrcode-terminal, @supabase/supabase-js, @whiskeysockets/baileys, pino (+3 more)

### Community 30 - "getUserProfile"
Cohesion: 0.29
Nodes (9): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), getOrCreateProfile(), getUserProfile(), formatStelas() (+1 more)

### Community 31 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 32 - "daily.js"
Cohesion: 0.31
Nodes (8): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel(), formatDuration()

### Community 33 - "dar_stelas.js"
Cohesion: 0.22
Nodes (8): { formatCommandUsage, formatError, box }, { formatDisplayMention }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName }, { transferMoney, getBalance }, usageMessage

### Community 34 - "top_dinero.js"
Cohesion: 0.22
Nodes (7): { box }, { formatStelas }, { getTopBalances }, { medal }, { TOP_DINERO_LIMIT }, getTopBalances(), topBalancesCacheKey()

### Community 35 - "supabase.js"
Cohesion: 0.16
Nodes (10): { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState(), { createClient }, { logSystem }, supabase, assert (+2 more)

### Community 36 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 37 - "test_message_format_utils.js"
Cohesion: 0.25
Nodes (6): assert, { box, formatCommandUsage, formatCommandForm, formatError }, forbiddenImports, fs, path, srcContent

### Community 38 - "package.json"
Cohesion: 0.29
Nodes (6): author, description, license, main, name, version

### Community 39 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 40 - "bugstatus.js"
Cohesion: 0.47
Nodes (5): { box, formatError }, execute(), { getReport, getUserReports }, getReport(), getUserReports()

### Community 42 - "keywords"
Cohesion: 0.40
Nodes (5): keywords, baileys, bot, rpg, whatsapp

### Community 43 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 44 - "test_command_usage_format.js"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

### Community 45 - "*.js"
Cohesion: 0.50
Nodes (4): lint-staged, *.js, eslint --fix, prettier --write

### Community 46 - "add_stelas.js"
Cohesion: 0.50
Nodes (3): { addMoney }, execute(), { executeEconomyAction }

### Community 47 - "rem_stelas.js"
Cohesion: 0.50
Nodes (3): execute(), { executeEconomyAction }, { removeMoney }

## Knowledge Gaps
- **423 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+418 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `box` to `daily.js`, `actividad.js`, `dar_stelas.js`, `top_dinero.js`, `permissionService.js`, `bugstatus.js`, `groupUtils.js`, `economyAdminHelper.js`, `groupAdminHelper.js`, `bugReportService.js`, `renombrar_pj.js`, `resolveTargetDisplayName`, `getUserProfile`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `filterExisting()` connect `characterService.js` to `safeQuery.js`, `columnRegistry.js`, `characterProgressionService.js`, `economyService.js`, `userService.js`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `formatError()` connect `box` to `actividad.js`, `dar_stelas.js`, `bugstatus.js`, `groupUtils.js`, `economyAdminHelper.js`, `groupAdminHelper.js`, `bugReportService.js`, `renombrar_pj.js`, `resolveTargetDisplayName`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _423 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `commandHandler.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06334841628959276 - nodes in this community are weakly interconnected._
- **Should `actividad.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08879492600422834 - nodes in this community are weakly interconnected._
- **Should `box` be split into smaller, more focused modules?**
  _Cohesion score 0.08668076109936575 - nodes in this community are weakly interconnected._