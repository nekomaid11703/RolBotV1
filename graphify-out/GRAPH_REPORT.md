# Graph Report - C:\IA_rolbot\RolBotV1  (2026-07-14)

## Corpus Check
- 118 files · ~40,453 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 811 nodes · 1660 edges · 69 communities (49 shown, 20 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 147 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 65

## God Nodes (most connected - your core abstractions)
1. `box()` - 67 edges
2. `formatError()` - 50 edges
3. `formatDisplayMention()` - 34 edges
4. `resolveTargetDisplayName()` - 33 edges
5. `getFirstMentionedJid()` - 28 edges
6. `getUserProfile()` - 23 edges
7. `withMentions()` - 23 edges
8. `scripts` - 22 edges
9. `logError()` - 20 edges
10. `startBot()` - 19 edges

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

## Communities (69 total, 20 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (51): { box }, execute(), { getOwnerRecords }, { listEconomyAdmins }, { box, formatError }, { createReport }, execute(), reportCooldowns (+43 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (48): dotenv, author, dependencies, dotenv, pino, qrcode-terminal, @supabase/supabase-js, @whiskeysockets/baileys (+40 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (32): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (20): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), ensureGroupActivity(), getGroupActivity(), getGroupMemberActivity(), getTopGroupMembers(), { GROUP_TOP_LIMIT } (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (25): { addParticipant }, execute(), { formatError, box }, execute(), { formatError, box }, { openGroup }, { closeGroup }, execute() (+17 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (29): dependency-cruiser, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-jsdoc, globals, husky, lint-staged (+21 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (25): { addMoney }, execute(), { formatCommandUsage, formatError, box }, { formatDisplayMention }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { resolveTargetDisplayName }, usageMessage (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (25): check(), { execSync }, exists(), fs, path, ROOT, run(), WORKSPACE (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (22): _archive, bugs, graphify-out, logs, node_modules, tests, compilerOptions, allowJs (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (22): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (21): getBalance(), buildDefaultProfile(), buildRegistration(), creatorDigits(), ensureUserProfile(), getCreatorFolderName(), getTopActiveUsers(), getUserProfile() (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (20): entry, ignore, ignoreBinaries, ignoreDependencies, src/**/*.js, project, rules, exports (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (15): crypto, getCacheKey(), helpers, run(), helpers, invService, path, run() (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (15): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS } (+7 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (17): aliases, fs, getJsFilesRecursively(), handleCommand(), { hasEconomyPermission }, { incrementCommands, incrementErrors, addEvent }, { isAdmin, isBotAdmin, isOnGroup }, { isOwner } (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (13): { getOpenReports, getStats, markStale, resolveReport }, { getOwnerJids }, { logSystem, logError }, midnightReview(), { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState() (+5 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (14): { formatCommandUsage, formatError, box }, usageMessage, { createCharacter, setActiveCharacter }, execute(), { formatCommandForm, formatError, box }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, buildFeedbackBody() (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.26
Nodes (16): {
  CHARACTER_CATEGORIES,
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  MAX_CHARACTERS_PER_USER,
}, createCharacter(), deleteCharacter(), getCharacterSlug(), { invalidateUserCache, charactersCacheKey, safeSingleOrNull, cache, TTLS }, normalizeCategory(), normalizeCharacterRecord(), normalizeStats() (+8 more)

### Community 18 - "Community 18"
Cohesion: 0.26
Nodes (16): addMoney(), claimDaily(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, getMoneyValue(), { getUserProfile, getOrCreateProfile, saveUserProfile }, { logError }, removeMoney(), resolveEconomyProfile() (+8 more)

### Community 19 - "Community 19"
Cohesion: 0.20
Nodes (14): execute(), { formatDisplayMention, withMentions }, { formatError, box }, { getFirstMentionedJid }, { removeParticipant }, { resolveTargetDisplayName }, cleanText(), extractMentionLabelFromContext() (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.19
Nodes (13): execute(), { formatDisplayMention, withMentions }, { formatError, box }, { getFirstMentionedJid }, { promoteToAdmin }, { resolveTargetDisplayName }, execute(), { formatDisplayMention } (+5 more)

### Community 21 - "Community 21"
Cohesion: 0.20
Nodes (15): execute(), { addWarn, getWarns, MAX_WARNS }, execute(), { formatDisplayMention, withMentions }, { formatError, box }, { getFirstMentionedJid }, { resolveTargetDisplayName }, execute() (+7 more)

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (14): appendToLog(), ensureLogsDir(), fsp, getLogFileName(), LOG_PREFIX, logCommand(), LOGS_DIR, logSystem() (+6 more)

### Community 23 - "Community 23"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 24 - "Community 24"
Cohesion: 0.26
Nodes (11): buildAliasStr(), buildSection(), CAT_META, CAT_ORDER, COMBAT_CMDS, { commands }, execute(), getGroup() (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.27
Nodes (9): execute(), { formatCharacter }, { getActiveCharacter }, execute(), { formatCharacter }, { getActiveCharacter }, getActiveCharacter(), { box } (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.27
Nodes (10): { getProfileDisplayName }, { getUserProfile, getOrCreateProfile, listUserProfiles }, hasEconomyPermission(), isEconomyAdmin(), { isOwner }, readPermissions(), resolveCandidateId(), setEconomyAdmin() (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.36
Nodes (9): formatDuration(), getMemory(), getUptime(), stats, bar(), pad(), render(), startDashboard() (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.24
Nodes (8): { box }, execute(), { formatStelas }, getMedal(), { getTopBalances }, { TOP_DINERO_LIMIT }, getTopBalances(), topBalancesCacheKey()

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (8): { formatCommandUsage, formatError, box }, { formatDisplayMention }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName }, { transferMoney, getBalance }, usageMessage

### Community 30 - "Community 30"
Cohesion: 0.28
Nodes (8): createContext, { handleCommand }, { incrementMessages }, { logError }, { recordGroupActivity }, { recordUserActivity }, registerEvents(), incrementMessages()

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (6): { createClient }, { logSystem }, supabase, assert, REQUIRED_TABLES, { supabase }

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (7): { demoteFromAdmin }, execute(), { formatDisplayMention, withMentions }, { formatError, box }, { getFirstMentionedJid }, { resolveTargetDisplayName }, demoteFromAdmin()

### Community 33 - "Community 33"
Cohesion: 0.25
Nodes (7): { formatCommandUsage, formatError, box }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin }, usageMessage

### Community 34 - "Community 34"
Cohesion: 0.25
Nodes (7): { formatCommandUsage, formatError, box }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin, isEconomyAdmin }, usageMessage

### Community 35 - "Community 35"
Cohesion: 0.25
Nodes (7): { formatCommandUsage, formatError, box }, { formatDisplayMention }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { resolveTargetDisplayName }, { setMoney }, usageMessage

### Community 36 - "Community 36"
Cohesion: 0.29
Nodes (7): execute(), { formatCommandUsage, formatError, box }, { getActiveCharacter }, { isAdmin }, { updateCharacterSlots }, usageMessage, isAdmin()

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (6): assert, forbiddenImports, fs, {
  LINE,
  BOX_TOP,
  BOX_BTM,
  BAR,
  box,
  buildUsageBody,
  buildFormBody,
  buildFeedbackBody,
  formatCommandUsage,
  formatCommandForm,
  formatFeedback,
  formatError,
}, path, srcContent

### Community 38 - "Community 38"
Cohesion: 0.29
Nodes (6): { formatCommandUsage, formatError, box }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter }, usageMessage

### Community 39 - "Community 39"
Cohesion: 0.29
Nodes (6): CHARACTER_CATEGORIES, CHARACTER_ROOT, DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, path, VALID_CHARACTER_FIELDS

### Community 40 - "Community 40"
Cohesion: 0.33
Nodes (5): { deleteWarn, getWarns }, { formatDisplayMention, withMentions }, { formatError, box }, { getFirstMentionedJid }, { resolveTargetDisplayName }

### Community 41 - "Community 41"
Cohesion: 0.33
Nodes (5): { deleteCharacter }, { formatCommandUsage, formatError, box }, { getCharacterNames }, { isAdmin }, usageMessage

### Community 42 - "Community 42"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 43 - "Community 43"
Cohesion: 0.33
Nodes (5): { formatCommandUsage, formatError, box }, { getCharacterNames }, { isAdmin }, { setActiveCharacter }, usageMessage

### Community 45 - "Community 45"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

## Knowledge Gaps
- **371 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `index.js`, `src/commands/**/*.js` (+366 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `Community 21` to `Community 0`, `Community 2`, `Community 4`, `Community 6`, `Community 13`, `Community 16`, `Community 19`, `Community 20`, `Community 25`, `Community 28`, `Community 29`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 38`, `Community 40`, `Community 41`, `Community 42`, `Community 43`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `formatError()` connect `Community 21` to `Community 32`, `Community 33`, `Community 2`, `Community 34`, `Community 4`, `Community 35`, `Community 6`, `Community 0`, `Community 40`, `Community 36`, `Community 41`, `Community 38`, `Community 43`, `Community 16`, `Community 19`, `Community 20`, `Community 29`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `logError()` connect `Community 15` to `Community 0`, `Community 9`, `Community 14`, `Community 18`, `Community 22`, `Community 30`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _371 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.061952074810052604 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0945945945945946 - nodes in this community are weakly interconnected._