# Graph Report - .  (2026-07-20)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 875 nodes · 1755 edges · 68 communities (46 shown, 22 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 180 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `be2d7cae`
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
- safeQuery.js
- unwarn.js
- economyService.js
- test_helpers.js
- groupUtils.js
- formatErrorUtils.js
- dar_stelas.js
- resolveTargetDisplayName
- stryker.config.json
- formatError
- eliminar_pj.js
- supabase.js
- eco_admin_rem.js
- permissionService.js
- IA_rolbot — RolBotV1
- actividad.js
- formatDisplayMention
- renombrar_pj.js
- daily.js
- switch_pj.js
- logger.test.js
- test_message_format_utils.js
- LRUCache
- graphify — Knowledge Graph (Code-Only)
- add.js
- grupo_cerrar.js
- invite.js
- ban.js
- demote.js
- message_format.test.js
- test_command_usage_format.js
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
3. `formatDisplayMention()` - 26 edges
4. `resolveTargetDisplayName()` - 25 edges
5. `getUserProfile()` - 21 edges
6. `startBot()` - 19 edges
7. `logSystem()` - 19 edges
8. `getFirstMentionedJid()` - 19 edges
9. `withMentions()` - 19 edges
10. `logError()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `runCleanOldLogsTests()` --indirect_call--> `exists()`  [INFERRED]
  tests/test_logger_service.js → scripts/tools-list.js
- `execute()` --indirect_call--> `addMoney()`  [INFERRED]
  src/commands/economy/add_stelas.js → src/services/economyService.js
- `execute()` --indirect_call--> `removeMoney()`  [INFERRED]
  src/commands/economy/rem_stelas.js → src/services/economyService.js
- `execute()` --indirect_call--> `setMoney()`  [INFERRED]
  src/commands/economy/set_stelas.js → src/services/economyService.js
- `scheduleNext()` --calls--> `midnightReview()`  [EXTRACTED]
  src/services/schedulerService.js → scripts/midnight_review.js

## Import Cycles
- None detected.

## Communities (68 total, 22 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.06
Nodes (58): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids } (+50 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.06
Nodes (51): { box }, execute(), { getOwnerRecords }, { listEconomyAdmins }, { box }, { createReport }, { formatError }, reportCooldowns (+43 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.07
Nodes (41): buildAliasStr(), buildSection(), CAT_META, CAT_ORDER, COMBAT_CMDS, { commands }, execute(), getGroup() (+33 more)

### Community 3 - "loggerService.js"
Cohesion: 0.08
Nodes (38): discover(), COLUMN_TYPES, DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL(), logMigrationInfo(), { logSystem } (+30 more)

### Community 4 - "characterService.js"
Cohesion: 0.09
Nodes (37): { box }, execute(), { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage (+29 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.07
Nodes (30): { addMoney }, execute(), { executeEconomyAction }, { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget() (+22 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.09
Nodes (29): { box }, buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute(), { formatCommandForm }, { formatError } (+21 more)

### Community 7 - "box"
Cohesion: 0.13
Nodes (25): execute(), { box }, execute(), { formatCount, formatDate, medal }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getTopActiveUsers, getUserProfile }, { resolveTargetDisplayName } (+17 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.10
Nodes (26): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE (+18 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.14
Nodes (20): calculateLevel(), CLASSES, DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, getHpState(), HP_THRESHOLDS, LEVELABLE_STATS, maxSkillSlots() (+12 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.15
Nodes (19): desequiparHabilidad(), equiparHabilidad(), { filterExisting }, ganarXP(), getCharacterSlug(), { getHabilidad }, { invalidateUserCache, safeSingleOrNull }, {
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  LEVEL_MAX,
  XP_CURVE_BASE,
  XP_CURVE_EXPONENT,
  HP_MAX,
  xpForNextLevel,
  calculateLevel,
  maxSkillSlots,
  SKILL_SLOTS_BY_LEVEL,
} (+11 more)

### Community 11 - "userService.js"
Cohesion: 0.19
Nodes (21): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getOrCreateProfile(), getTopActiveUsers(), getUserProfile(), listUserProfiles() (+13 more)

### Community 12 - "knip.json"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, project, rules, exports, files (+12 more)

### Community 13 - "safeQuery.js"
Cohesion: 0.12
Nodes (12): hasColumn(), getTopBalances(), cache, TTLS, { cache, TTLS }, groupCacheKey(), { hasColumn }, invalidateGroupCache() (+4 more)

### Community 14 - "unwarn.js"
Cohesion: 0.14
Nodes (18): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS } (+10 more)

### Community 15 - "economyService.js"
Cohesion: 0.22
Nodes (19): filterExisting(), addMoney(), claimDaily(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, { filterExisting }, getBalance(), getMoneyValue(), { getUserProfile, getOrCreateProfile, saveUserProfile } (+11 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.15
Nodes (14): crypto, getCacheKey(), helpers, run(), helpers, path, run(), assert() (+6 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.14
Nodes (14): { box }, execute(), { formatError }, { openGroup }, execute(), { executeGroupAction }, { promoteToAdmin }, deleteWarns() (+6 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.21
Nodes (14): { box }, { formatCommandUsage }, { formatError }, usageMessage, buildFormBody(), buildUsageBody(), formatCommandForm(), formatCommandUsage() (+6 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.17
Nodes (14): { box }, execute(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile } (+6 more)

### Community 20 - "resolveTargetDisplayName"
Cohesion: 0.20
Nodes (14): cleanText(), extractMentionLabelFromContext(), findParticipantDisplayName(), { getGroupMetadata }, { getUserProfile }, isMeaningfulDisplayName(), resolveTargetDisplayName(), { box } (+6 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "formatError"
Cohesion: 0.15
Nodes (13): { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+5 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.21
Nodes (12): { box }, { deleteCharacter }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, usageMessage (+4 more)

### Community 24 - "supabase.js"
Cohesion: 0.20
Nodes (8): { logSystem }, { supabase }, { createClient }, { logSystem }, supabase, assert, REQUIRED_TABLES, { supabase }

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.18
Nodes (10): { box }, execute(), { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+2 more)

### Community 26 - "permissionService.js"
Cohesion: 0.27
Nodes (10): { getProfileDisplayName }, { getUserProfile, getOrCreateProfile, listUserProfiles }, hasEconomyPermission(), isEconomyAdmin(), { isOwner }, readPermissions(), resolveCandidateId(), setEconomyAdmin() (+2 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "actividad.js"
Cohesion: 0.20
Nodes (9): { box }, { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile }, { resolveTargetDisplayName } (+1 more)

### Community 29 - "formatDisplayMention"
Cohesion: 0.39
Nodes (7): execute(), { formatDisplayMention }, cleanText(), formatDisplayMention(), formatRealMentionTag(), getProfileDisplayName(), isMeaningfulDisplayName()

### Community 30 - "renombrar_pj.js"
Cohesion: 0.22
Nodes (8): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter }, usageMessage

### Community 31 - "daily.js"
Cohesion: 0.32
Nodes (7): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel()

### Community 32 - "switch_pj.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { setActiveCharacter }, usageMessage

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "test_message_format_utils.js"
Cohesion: 0.25
Nodes (6): assert, { box, formatCommandUsage, formatCommandForm, formatError }, forbiddenImports, fs, path, srcContent

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "add.js"
Cohesion: 0.40
Nodes (5): { addParticipant }, { box }, execute(), { formatError }, addParticipant()

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.40
Nodes (5): { box }, { closeGroup }, execute(), { formatError }, closeGroup()

### Community 39 - "invite.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { getInviteCode }, getInviteCode()

### Community 40 - "ban.js"
Cohesion: 0.50
Nodes (4): execute(), { executeGroupAction }, { removeParticipant }, removeParticipant()

### Community 41 - "demote.js"
Cohesion: 0.50
Nodes (4): { demoteFromAdmin }, execute(), { executeGroupAction }, demoteFromAdmin()

### Community 42 - "message_format.test.js"
Cohesion: 0.40
Nodes (4): { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 43 - "test_command_usage_format.js"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

## Knowledge Gaps
- **387 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+382 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `box` to `bugReportService.js`, `characterService.js`, `economyAdminHelper.js`, `crear_pj.js`, `characterConfig.js`, `unwarn.js`, `groupUtils.js`, `formatErrorUtils.js`, `dar_stelas.js`, `resolveTargetDisplayName`, `formatError`, `eliminar_pj.js`, `eco_admin_rem.js`, `actividad.js`, `renombrar_pj.js`, `daily.js`, `switch_pj.js`, `add.js`, `grupo_cerrar.js`, `invite.js`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `formatError()` connect `formatError` to `switch_pj.js`, `bugReportService.js`, `characterService.js`, `add.js`, `grupo_cerrar.js`, `box`, `invite.js`, `crear_pj.js`, `economyAdminHelper.js`, `unwarn.js`, `groupUtils.js`, `formatErrorUtils.js`, `dar_stelas.js`, `resolveTargetDisplayName`, `eliminar_pj.js`, `eco_admin_rem.js`, `renombrar_pj.js`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `logError()` connect `bot.js` to `bugReportService.js`, `loggerService.js`, `economyService.js`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _387 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05608322026232474 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06019871420222092 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0696969696969697 - nodes in this community are weakly interconnected._