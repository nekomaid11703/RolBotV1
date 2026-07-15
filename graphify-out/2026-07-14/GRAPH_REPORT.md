# Graph Report - .  (2026-07-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1207 nodes · 1872 edges · 101 communities (83 shown, 18 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 340 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `00e4a7e3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Combat Engine & Attack Execution
- Combat Buffer & Referee (Obsolete)
- Config & Context System
- Test Helpers & Utilities
- Ability Engine
- Inventory Service
- Character Service
- Package & Dependencies
- Bot Core & WebSocket
- Combat Narrator (Obsolete)
- Combat Parser (Obsolete)
- Bug Report & Midnight Review
- Rol Command (Obsolete)
- Group Activity Service
- User Service
- Economy Service
- Logger & Combat Log
- Combat Turn Manager
- Logger Service Tests
- Scene Cache (Obsolete)
- Environmental Effects
- Combat Engine Resolver
- Data Loader (Races/Classes)
- Logger System
- Permission Service
- World Lore (Obsolete)
- Duel PvP Service
- Item Use Command
- Message Format Utils
- Status Dashboard
- Help Command
- Event Handler
- Narrator Output Validator (Obsolete)
- Audit Sync Script
- Block Command
- Abilities Command
- Sync Service
- Cache Service
- Character Migration Script
- Supabase Migration Script
- Activity Command
- Give Stelas Command
- Command Parse Utils
- ruleEngine.js
- Economy Admin Add
- Economy Admin Remove
- Add Stelas Command
- Daily Economy Command
- Remove Stelas Command
- Set Stelas Command
- Delete Character Command
- Rename Character Command
- Unequip Command
- Dodge Command
- Message Format Tests
- Duel Command
- Global Activity Command
- Top Money Command
- Edit Character Description
- Switch Character Command
- Equip Command
- Inventory Command
- LRUCache
- Ban Command
- Demote Command
- Promote Command
- Unwarn Command
- Warn Command
- Warning List Command
- Transfer Money Command
- Pay Command
- Shop Command
- Admin Stats Command
- Auto-Reply Detection
- Kick Command
- Antilink Command
- Mute Command
- Top Active Users Command
- To-Do List Command
- Economy Betting
- Leaderboard Command
- Status Command
- Scheduler Service
- RPG Panel Command
- Admin Main Menu
- Sticker Command
- Menu Command
- Welcome Handler
- Delete Command
- Force Sync Script
- Add to Group Command
- Close Group Command
- Invite Command
- Bug Status Command
- Dice Roll Command
- Create Character Command

## God Nodes (most connected - your core abstractions)
1. `logError()` - 26 edges
2. `startBot()` - 18 edges
3. `getUserProfile()` - 17 edges
4. `normalizeCharacterRecord()` - 12 edges
5. `logSystem()` - 12 edges
6. `getItem()` - 12 edges
7. `processRoleplay()` - 12 edges
8. `invalidateUserCache()` - 12 edges
9. `saveUserProfile()` - 11 edges
10. `supabase` - 10 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `scheduleNext()` --calls--> `midnightReview()`  [EXTRACTED]
  src/services/schedulerService.js → scripts/midnight_review.js
- `midnightReview()` --calls--> `getOpenReports()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/bugReportService.js
- `midnightReview()` --calls--> `getStats()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/bugReportService.js

## Import Cycles
- None detected.

## Communities (101 total, 18 thin omitted)

### Community 0 - "Combat Engine & Attack Execution"
Cohesion: 0.05
Nodes (50): combatEngine, execute(), executeAttackInCombat(), { formatError }, { getActiveCharacter }, { getAllEnemies }, handleRewards(), { logError } (+42 more)

### Community 1 - "Combat Buffer & Referee (Obsolete)"
Cohesion: 0.06
Nodes (50): CombatBuffer, abilities, abilityEngine, applyEnvironmentalEffect(), ATTACK_VERBS, buildRefereePrompt(), CLASSIFICATION_PROMPT, { CombatBuffer } (+42 more)

### Community 2 - "Config & Context System"
Cohesion: 0.09
Nodes (36): createContext(), {
  extractPhoneNumber,
  normalizeJid,
}, extractText(), getMessageType(), isTextLikeMessageType(), TEXT_MESSAGE_TYPES, unwrapMessageContent(), getGroupMetadata() (+28 more)

### Community 3 - "Test Helpers & Utilities"
Cohesion: 0.08
Nodes (34): abilities, helpers, run(), crypto, getCacheKey(), helpers, path, run() (+26 more)

### Community 4 - "Ability Engine"
Cohesion: 0.06
Nodes (23): ABILITIES_REGISTRY, applyAbilityCosts(), canUseAbility(), getAbility(), { reduceBuffTimers }, abilitiesData, applyEffect(), combatEngine (+15 more)

### Community 5 - "Inventory Service"
Cohesion: 0.11
Nodes (32): addItem(), calculateEquipmentBonuses(), damageEquippedItem(), emptyInventory(), EQUIP_BONUSES_CACHE, equipItem(), EQUIPPABLE_SLOTS, { getActiveCharacter, updateCharacterStats } (+24 more)

### Community 6 - "Character Service"
Cohesion: 0.14
Nodes (29): CHARACTER_CATEGORIES, CHARACTER_ROOT, DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, path, VALID_CHARACTER_FIELDS, {
  CHARACTER_CATEGORIES,
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  MAX_CHARACTER_NAME_LENGTH,
  MAX_SLOT_SIZE,
  MAX_CHARACTERS_PER_USER,
}, createCharacter() (+21 more)

### Community 7 - "Package & Dependencies"
Cohesion: 0.07
Nodes (29): dotenv, nodemon, author, dependencies, dotenv, pino, qrcode-terminal, @supabase/supabase-js (+21 more)

### Community 8 - "Bot Core & WebSocket"
Cohesion: 0.10
Nodes (28): cleanupSock(), {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  initAuthCreds,
}, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, {
  logSystem,
  logError,
  cleanOldLogs,
}, P (+20 more)

### Community 9 - "Combat Narrator (Obsolete)"
Cohesion: 0.12
Nodes (23): buildNarrativePrompt(), determineTone(), envEffects, fs, generateTemplateNarrative(), { getContextualLore, getLoreByKeyword }, getNarrativeContext(), { getSceneWithEffects, getSceneVersion, incrementEffectBurn } (+15 more)

### Community 10 - "Combat Parser (Obsolete)"
Cohesion: 0.11
Nodes (22): ATTACK_SYNONYMS, ATTEMPT_MARKERS, detectMoveNumber(), extractTarget(), extractWeapon(), extractZone(), { getAllEnemies }, isAccion() (+14 more)

### Community 11 - "Bug Report & Midnight Review"
Cohesion: 0.12
Nodes (24): { getOpenReports, getStats, markStale, resolveReport }, { getOwnerJids }, { logSystem, logError }, midnightReview(), createReport(), crypto, determinePriority(), { downloadMediaMessage } (+16 more)

### Community 12 - "Rol Command (Obsolete)"
Cohesion: 0.11
Nodes (22): abilityLib, { addMoney }, buildMessages(), combatEngine, combatLogger, combatNarrator, duelService, enemiesLib (+14 more)

### Community 13 - "Group Activity Service"
Cohesion: 0.16
Nodes (18): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), ensureGroupActivity(), getGroupActivity(), getGroupMemberActivity(), getTopGroupMembers(), { GROUP_TOP_LIMIT } (+10 more)

### Community 14 - "User Service"
Cohesion: 0.19
Nodes (20): getBalance(), buildDefaultProfile(), buildRegistration(), creatorDigits(), ensureUserProfile(), getCreatorFolderName(), getTopActiveUsers(), getUserProfile() (+12 more)

### Community 15 - "Economy Service"
Cohesion: 0.22
Nodes (17): addMoney(), claimDaily(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, getMoneyValue(), getTopBalances(), {
  getUserProfile,
  getOrCreateProfile,
  saveUserProfile,
  listUserProfiles,
}, { logError }, removeMoney() (+9 more)

### Community 16 - "Logger & Combat Log"
Cohesion: 0.15
Nodes (13): { createClient }, { logSystem, logError }, supabase, logError(), getCombatLog(), getCombatsByParticipant(), logAction(), logCombatEnd() (+5 more)

### Community 17 - "Combat Turn Manager"
Cohesion: 0.20
Nodes (17): advanceTurn(), applySkip(), buildTurnResponse(), checkTimeout(), checkVictoryConditions(), combatEngine, formatHPBar(), formatNextTurnMention() (+9 more)

### Community 18 - "Logger Service Tests"
Cohesion: 0.18
Nodes (17): assert, forbiddenImports, fs, fsp, logger, loggerPath, path, run() (+9 more)

### Community 19 - "Scene Cache (Obsolete)"
Cohesion: 0.16
Nodes (14): invalidateSceneNarrative(), buildSceneDescription(), effectBurnCounters, getBurnKey(), getEffectBurnCount(), getScene(), getSceneForNarrative(), getSceneKey() (+6 more)

### Community 20 - "Environmental Effects"
Cohesion: 0.22
Nodes (15): applyDotToParticipants(), applyEffectRules(), COMBINED_EFFECTS, EFFECTS_REGISTRY, getActiveCombinedEffects(), getActiveEffectsDescription(), getCombinedEffect(), getDamagePerTurn() (+7 more)

### Community 21 - "Combat Engine Resolver"
Cohesion: 0.24
Nodes (14): getStatMultiplier(), hasEffect(), removeEffect(), resolveAbility(), resolveAttack(), resolveBlock(), resolveDodge(), resolveEnemyTurn() (+6 more)

### Community 22 - "Data Loader (Races/Classes)"
Cohesion: 0.18
Nodes (13): races, buildIndex(), classes, classIndex, getAllClasses(), getAllRaces(), getClass(), getRace() (+5 more)

### Community 23 - "Logger System"
Cohesion: 0.22
Nodes (14): appendToLog(), ensureLogsDir(), fsp, getLogFileName(), LOG_PREFIX, logCommand(), LOGS_DIR, logSystem() (+6 more)

### Community 24 - "Permission Service"
Cohesion: 0.21
Nodes (14): {
  getProfileDisplayName,
}, {
  getUserProfile,
  getOrCreateProfile,
  listUserProfiles,
  saveUserProfile,
}, hasEconomyPermission(), isEconomyAdmin(), { isOwner }, listEconomyAdmins(), pickDisplayName(), readPermissions() (+6 more)

### Community 25 - "World Lore (Obsolete)"
Cohesion: 0.22
Nodes (12): extractSectionByKeyword(), extractTitle(), fs, fsSync, getAllLore(), getContextualLore(), getLoreByKeyword(), getLoreContext() (+4 more)

### Community 26 - "Duel PvP Service"
Cohesion: 0.21
Nodes (11): acceptChallenge(), { addMoney, removeMoney, getBalance }, createChallenge(), getChallengeForTarget(), getChallengeKey(), handlePvPVictory(), { logError }, pendingChallenges (+3 more)

### Community 27 - "Item Use Command"
Cohesion: 0.18
Nodes (12): combatEngine, execute(), { formatError, box }, { getActiveCharacter, updateCharacterStats }, invService, itemsData, { logError }, { RPG_CONFIG } (+4 more)

### Community 28 - "Message Format Utils"
Cohesion: 0.27
Nodes (11): { box }, formatCharacter(), box(), buildFeedbackBody(), buildFormBody(), buildUsageBody(), compactLines(), formatCommandForm() (+3 more)

### Community 29 - "Status Dashboard"
Cohesion: 0.32
Nodes (9): formatDuration(), getMemory(), getUptime(), stats, bar(), pad(), render(), startDashboard() (+1 more)

### Community 30 - "Help Command"
Cohesion: 0.29
Nodes (10): buildAliasStr(), buildSection(), CAT_META, CAT_ORDER, COMBAT_CMDS, { commands }, execute(), getGroup() (+2 more)

### Community 31 - "Event Handler"
Cohesion: 0.24
Nodes (10): createContext, { handleCommand }, { incrementMessages, addEvent }, { logError }, {
  recordGroupActivity,
}, {
  recordUserActivity,
}, registerEvents(), incrementMessages() (+2 more)

### Community 32 - "Narrator Output Validator (Obsolete)"
Cohesion: 0.29
Nodes (8): attemptPartialRepair(), fuzzyParseJSON(), LLM_OUTPUT_SCHEMA, VALID_ACTION_TYPES, VALID_DAMAGE_TYPES, VALID_INFRACTION_TYPES, VALID_ZONES, validateOutput()

### Community 33 - "Audit Sync Script"
Cohesion: 0.27
Nodes (9): auditDesignBoard(), auditLocalMemory(), auditSupabaseTables(), { createClient }, fs, main(), MEMORY_PATH, path (+1 more)

### Community 34 - "Block Command"
Cohesion: 0.22
Nodes (7): combatEngine, { formatError }, { logError }, { RPG_CONFIG }, stateManager, turnManager, RPG_CONFIG

### Community 35 - "Abilities Command"
Cohesion: 0.22
Nodes (9): abilityLib, combatEngine, execute(), { formatError }, { logError }, { RPG_CONFIG }, showAbilities(), stateManager (+1 more)

### Community 36 - "Sync Service"
Cohesion: 0.29
Nodes (9): clearServiceCaches(), { createClient }, fetchAllFromSupabase(), forceSync(), getSyncStatus(), { logSystem, logError }, supabase, TABLES (+1 more)

### Community 37 - "Cache Service"
Cohesion: 0.24
Nodes (6): cache, TTLS, { cache, TTLS }, cachedRead(), invalidateAllCache(), invalidateTopBalancesCache()

### Community 38 - "Character Migration Script"
Cohesion: 0.25
Nodes (8): CHARACTER_ROOT, { createClient }, fs, fsp, migrateCharacters(), path, readJson(), supabase

### Community 39 - "Supabase Migration Script"
Cohesion: 0.28
Nodes (8): CHARACTER_ROOT, fs, GROUP_ROOT, main(), migrateGroups(), migrateUsers(), path, { supabase }

### Community 40 - "Activity Command"
Cohesion: 0.22
Nodes (7): { box }, { formatCount, formatDate }, {
  formatDisplayMention,
  resolveTargetDisplayName,
  withMentions,
}, {
  getFirstMentionedJid,
}, {
  getGroupMemberActivity,
  getGroupActivity,
}, {
  getGroupMetadata,
}, {
  getUserProfile,
}

### Community 41 - "Give Stelas Command"
Cohesion: 0.22
Nodes (7): {
  formatCommandUsage,
  formatError,
  box,
}, { formatStelas }, {
  getFirstMentionedJid,
  extractAmountFromArgs,
}, { getUserProfile }, {
  resolveTargetDisplayName,
  formatDisplayMention,
}, { transferMoney, getBalance }, usageMessage

### Community 42 - "Command Parse Utils"
Cohesion: 0.33
Nodes (7): cleanMentionLabel(), extractAmountFromArgs(), formatJidTag(), formatMentionTag(), getFirstMentionedJid(), parsePositiveInteger(), resolveTargetUserId()

### Community 44 - "Economy Admin Add"
Cohesion: 0.25
Nodes (6): {
  formatCommandUsage,
  formatError,
  box,
}, {
  getFirstMentionedJid,
}, { isOwner }, {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
}, { setEconomyAdmin }, usageMessage

### Community 45 - "Economy Admin Remove"
Cohesion: 0.25
Nodes (6): {
  formatCommandUsage,
  formatError,
  box,
}, {
  getFirstMentionedJid,
}, { isOwner }, {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
}, {
  setEconomyAdmin,
  isEconomyAdmin,
}, usageMessage

### Community 46 - "Add Stelas Command"
Cohesion: 0.25
Nodes (6): { addMoney }, {
  formatCommandUsage,
  formatError,
  box,
}, { formatStelas }, {
  getFirstMentionedJid,
  extractAmountFromArgs,
}, {
  resolveTargetDisplayName,
  formatDisplayMention,
}, usageMessage

### Community 47 - "Daily Economy Command"
Cohesion: 0.32
Nodes (7): {
  box,
}, {
  claimDaily,
}, {
  DAILY_COOLDOWN_HOURS,
}, execute(), formatProgressBar(), {
  formatStelas,
  formatDuration,
}, formatStreakLabel()

### Community 48 - "Remove Stelas Command"
Cohesion: 0.25
Nodes (6): {
  formatCommandUsage,
  formatError,
  box,
}, { formatStelas }, {
  getFirstMentionedJid,
  extractAmountFromArgs,
}, { removeMoney }, {
  resolveTargetDisplayName,
  formatDisplayMention,
}, usageMessage

### Community 49 - "Set Stelas Command"
Cohesion: 0.25
Nodes (6): {
  formatCommandUsage,
  formatError,
  box,
}, { formatStelas }, {
  getFirstMentionedJid,
  extractAmountFromArgs,
}, {
  resolveTargetDisplayName,
  formatDisplayMention,
}, { setMoney }, usageMessage

### Community 50 - "Delete Character Command"
Cohesion: 0.25
Nodes (6): confirmations, { deleteCharacter }, {
  formatCommandUsage,
  formatError,
  box,
}, { getCharacterNames }, { isAdmin }, usageMessage

### Community 51 - "Rename Character Command"
Cohesion: 0.25
Nodes (6): {
  formatCommandUsage,
  formatError,
  box,
}, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter }, usageMessage

### Community 52 - "Unequip Command"
Cohesion: 0.29
Nodes (7): execute(), { formatError, box }, { getActiveCharacter }, invService, itemsData, { logSystem, logError }, SLOTS

### Community 53 - "Dodge Command"
Cohesion: 0.25
Nodes (6): combatEngine, { formatError }, { logError }, { RPG_CONFIG }, stateManager, turnManager

### Community 54 - "Message Format Tests"
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

### Community 55 - "Duel Command"
Cohesion: 0.29
Nodes (5): duelService, { formatError }, { getActiveCharacter }, { getBalance }, stateManager

### Community 56 - "Global Activity Command"
Cohesion: 0.29
Nodes (5): { box }, { formatCount, formatDate, medal }, {
  formatDisplayMention,
  resolveTargetDisplayName,
  withMentions,
}, {
  getFirstMentionedJid,
}, {
  getTopActiveUsers,
  getUserProfile,
}

### Community 57 - "Top Money Command"
Cohesion: 0.33
Nodes (6): {
  box,
}, execute(), {
  formatStelas,
}, getMedal(), {
  getTopBalances,
}, {
  TOP_DINERO_LIMIT,
}

### Community 58 - "Edit Character Description"
Cohesion: 0.29
Nodes (5): {
  formatCommandUsage,
  formatError,
  box,
}, { getActiveCharacter }, { isAdmin }, { updateCharacterSlots }, usageMessage

### Community 59 - "Switch Character Command"
Cohesion: 0.29
Nodes (5): {
  formatCommandUsage,
  formatError,
  box,
}, { getCharacterNames }, { isAdmin }, { setActiveCharacter }, usageMessage

### Community 60 - "Equip Command"
Cohesion: 0.29
Nodes (5): { formatError, box }, { getActiveCharacter }, invService, itemsData, { logSystem, logError }

### Community 61 - "Inventory Command"
Cohesion: 0.29
Nodes (5): { formatError, box }, { getActiveCharacter }, invService, itemsData, { logSystem, logError }

### Community 63 - "Ban Command"
Cohesion: 0.33
Nodes (4): { formatError, box }, {
  getFirstMentionedJid,
}, { removeParticipant }, {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
}

### Community 64 - "Demote Command"
Cohesion: 0.33
Nodes (4): { demoteFromAdmin }, { formatError, box }, {
  getFirstMentionedJid,
}, {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
}

### Community 65 - "Promote Command"
Cohesion: 0.33
Nodes (4): { formatError, box }, {
  getFirstMentionedJid,
}, { promoteToAdmin }, {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
}

### Community 66 - "Unwarn Command"
Cohesion: 0.33
Nodes (4): { formatCount }, { formatError, box }, { formatRealMentionTag, withMentions }, { getGroupMetadata }

### Community 67 - "Warn Command"
Cohesion: 0.33
Nodes (4): { box }, { formatCount, medal }, { formatDisplayMention, withMentions }, { getGroupTopActiveUsers }

### Community 68 - "Warning List Command"
Cohesion: 0.33
Nodes (4): {
  deleteWarn,
  getWarns,
}, { formatError, box }, {
  getFirstMentionedJid,
}, {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
}

### Community 69 - "Transfer Money Command"
Cohesion: 0.33
Nodes (4): {
  addWarn,
  getWarns,
  MAX_WARNS,
}, { formatError, box }, {
  getFirstMentionedJid,
}, {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
}

### Community 70 - "Pay Command"
Cohesion: 0.40
Nodes (5): {
  box,
}, execute(), {
  formatStelas,
}, {
  getOrCreateProfile,
  getUserProfile,
}, resolveTarget()

### Community 71 - "Shop Command"
Cohesion: 0.33
Nodes (4): { createCharacter, setActiveCharacter }, {
  formatCommandForm,
  formatError,
  box,
}, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }

### Community 72 - "Admin Stats Command"
Cohesion: 0.40
Nodes (4): { logSystem, logError }, { midnightReview }, scheduleNext(), startMidnightReview()

### Community 73 - "Auto-Reply Detection"
Cohesion: 0.40
Nodes (3): duelService, { formatError }, { getActiveCharacter }

### Community 74 - "Kick Command"
Cohesion: 0.40
Nodes (3): aiOrchestrator, fs, path

### Community 75 - "Antilink Command"
Cohesion: 0.50
Nodes (4): args, { getOpenReports, getReport, resolveReport, getStats }, main(), printReport()

### Community 76 - "Mute Command"
Cohesion: 0.40
Nodes (3): { box }, { getOwnerRecords }, { listEconomyAdmins }

### Community 77 - "Top Active Users Command"
Cohesion: 0.40
Nodes (3): { box, formatError }, { createReport }, reportCooldowns

### Community 78 - "To-Do List Command"
Cohesion: 0.50
Nodes (4): combatEngine, createMockParticipant(), helpers, run()

### Community 79 - "Economy Betting"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

## Knowledge Gaps
- **492 isolated node(s):** `name`, `version`, `description`, `main`, `start` (+487 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `logError()` connect `Logger & Combat Log` to `Inventory Service`, `Character Service`, `Bot Core & WebSocket`, `Admin Stats Command`, `Bug Report & Midnight Review`, `Economy Service`, `Data Loader (Races/Classes)`, `Logger System`, `Duel PvP Service`, `Event Handler`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `supabase` connect `Logger & Combat Log` to `Config & Context System`, `Inventory Service`, `Character Service`, `Group Activity Service`, `User Service`, `Economy Service`, `Permission Service`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `getUserProfile()` connect `User Service` to `Permission Service`, `Config & Context System`, `Character Service`, `Economy Service`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _492 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Combat Engine & Attack Execution` be split into smaller, more focused modules?**
  _Cohesion score 0.05136612021857923 - nodes in this community are weakly interconnected._
- **Should `Combat Buffer & Referee (Obsolete)` be split into smaller, more focused modules?**
  _Cohesion score 0.05584415584415584 - nodes in this community are weakly interconnected._
- **Should `Config & Context System` be split into smaller, more focused modules?**
  _Cohesion score 0.08880666049953746 - nodes in this community are weakly interconnected._