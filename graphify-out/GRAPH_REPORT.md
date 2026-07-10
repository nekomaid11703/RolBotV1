# Graph Report - .  (2026-07-10)

## Corpus Check
- 169 files · ~86,063 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1352 nodes · 2842 edges · 78 communities (72 shown, 6 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 366 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Comandos de Grupo y Personajes
- Motor de Combate PvE
- Infraestructura de Orquestación de IA
- Núcleo de Ejecución del Bot
- Árbitro de Combate y RP por LLM
- Sistema de Reportes y Mantenimiento de Bugs
- Comunidad RPG 6
- Comunidad RPG 7
- Comunidad RPG 8
- Comunidad RPG 9
- Comunidad RPG 10
- Comunidad RPG 11
- Comunidad RPG 12
- Comunidad RPG 13
- Comunidad RPG 14
- Comunidad RPG 15
- Comunidad RPG 16
- Comunidad RPG 17
- Comunidad RPG 18
- Comunidad RPG 19
- Comunidad RPG 20
- Comunidad RPG 21
- Comunidad RPG 22
- Comunidad RPG 23
- Comunidad RPG 24
- Comunidad RPG 25
- Comunidad RPG 26
- Comunidad RPG 27
- Comunidad RPG 28
- Comunidad RPG 29
- Comunidad RPG 30
- Comunidad RPG 31
- Comunidad RPG 32
- Comunidad RPG 33
- Comunidad RPG 34
- Comunidad RPG 35
- Comunidad RPG 36
- Comunidad RPG 37
- Comunidad RPG 38
- Comunidad RPG 39
- Comunidad RPG 40
- Comunidad RPG 41
- Comunidad RPG 42
- Comunidad RPG 43
- Comunidad RPG 44
- Comunidad RPG 45
- Comunidad RPG 46
- Comunidad RPG 47
- Comunidad RPG 48
- Comunidad RPG 49
- Comunidad RPG 50
- Comunidad RPG 51
- Comunidad RPG 52
- Comunidad RPG 53
- Comunidad RPG 54
- Comunidad RPG 55
- Comunidad RPG 56
- Comunidad RPG 57
- Comunidad RPG 58
- Comunidad RPG 59
- Comunidad RPG 60
- Comunidad RPG 61
- Comunidad RPG 62
- Comunidad RPG 63
- Comunidad RPG 64
- Comunidad RPG 65
- Comunidad RPG 66
- Comunidad RPG 67
- Comunidad RPG 68
- Comunidad RPG 69
- Comunidad RPG 70
- Comunidad RPG 71
- Comunidad RPG 72
- Comunidad RPG 73
- Comunidad RPG 74
- Comunidad RPG 75

## God Nodes (most connected - your core abstractions)
1. `box()` - 75 edges
2. `formatError()` - 71 edges
3. `logError()` - 57 edges
4. `logSystem()` - 52 edges
5. `formatDisplayMention()` - 34 edges
6. `resolveTargetDisplayName()` - 33 edges
7. `getFirstMentionedJid()` - 28 edges
8. `getUserProfile()` - 25 edges
9. `getActiveCharacter()` - 24 edges
10. `withMentions()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `getOpenReports()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/bugReportService.js
- `midnightReview()` --calls--> `getStats()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/bugReportService.js
- `midnightReview()` --calls--> `markStale()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/bugReportService.js

## Import Cycles
- None detected.

## Communities (78 total, 6 thin omitted)

### Community 0 - "Comandos de Grupo y Personajes"
Cohesion: 0.06
Nodes (52): { addParticipant }, execute(), { formatError, box }, execute(), { formatError, box }, { openGroup }, { closeGroup }, execute() (+44 more)

### Community 1 - "Motor de Combate PvE"
Cohesion: 0.06
Nodes (51): execute(), { formatError }, { getActiveCharacter }, { getAllEnemies }, invService, { logSystem, logError }, stateManager, turnManager (+43 more)

### Community 2 - "Infraestructura de Orquestación de IA"
Cohesion: 0.06
Nodes (22): CONCURRENCY_LIMITS, AiDispatcher, AiOrchestrator, AiWorkerPool, { CONCURRENCY_LIMITS }, { logSystem, logError }, Semaphore, workerPool (+14 more)

### Community 3 - "Núcleo de Ejecución del Bot"
Cohesion: 0.07
Nodes (45): cleanupSock(), {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  initAuthCreds,
}, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, {
  logSystem,
  logError,
  cleanOldLogs,
}, P (+37 more)

### Community 4 - "Árbitro de Combate y RP por LLM"
Cohesion: 0.06
Nodes (48): abilities, abilityEngine, applyEnvironmentalEffect(), ATTACK_VERBS, CLASSIFICATION_PROMPT, { CombatBuffer }, combatEngine, combatNarrator (+40 more)

### Community 5 - "Sistema de Reportes y Mantenimiento de Bugs"
Cohesion: 0.07
Nodes (41): { getOpenReports, getStats, markStale, resolveReport }, { getOwnerJids }, { logSystem, logError }, midnightReview(), args, { getOpenReports, getReport, resolveReport, getStats }, main(), printReport() (+33 more)

### Community 6 - "Comunidad RPG 6"
Cohesion: 0.07
Nodes (37): { addMoney }, {
  formatCommandUsage,
  formatError,
  box,
}, { formatStelas }, {
  getFirstMentionedJid,
  extractAmountFromArgs,
}, {
  resolveTargetDisplayName,
  formatDisplayMention,
}, usageMessage, execute(), {
  formatCommandUsage,
  formatError,
  box,
} (+29 more)

### Community 7 - "Comunidad RPG 7"
Cohesion: 0.10
Nodes (36): { box }, execute(), { getOwnerRecords }, { listEconomyAdmins }, createContext(), {
  extractPhoneNumber,
  normalizeJid,
}, extractText(), getMessageType() (+28 more)

### Community 8 - "Comunidad RPG 8"
Cohesion: 0.11
Nodes (35): execute(), execute(), execute(), execute(), execute(), { formatError, box }, {
  getFirstMentionedJid,
}, { removeParticipant } (+27 more)

### Community 9 - "Comunidad RPG 9"
Cohesion: 0.07
Nodes (29): dotenv, nodemon, author, dependencies, dotenv, pino, qrcode-terminal, @supabase/supabase-js (+21 more)

### Community 10 - "Comunidad RPG 10"
Cohesion: 0.12
Nodes (26): applyBodyPartDamage(), applyFatigue(), applyFatigueEffect(), autoResolveEnemyTurn(), calculateDamageFormula(), calculateHitChance(), canFlee(), canIntercept() (+18 more)

### Community 11 - "Comunidad RPG 11"
Cohesion: 0.17
Nodes (25): addItem(), applyEquipmentBonuses(), calculateEquipmentBonuses(), damageEquippedItem(), emptyInventory(), EQUIP_BONUSES_CACHE, equipItem(), EQUIPPABLE_SLOTS (+17 more)

### Community 12 - "Comunidad RPG 12"
Cohesion: 0.09
Nodes (16): cache, classificationCacheKey(), crypto, generateCacheKey(), LRUCache, { cache, LRUCache, generateCacheKey, classificationCacheKey, memoryCacheKey, TTLS }, ck1, ck2 (+8 more)

### Community 13 - "Comunidad RPG 13"
Cohesion: 0.12
Nodes (21): { box }, { formatCount, formatDate }, {
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
}, { box } (+13 more)

### Community 14 - "Comunidad RPG 14"
Cohesion: 0.12
Nodes (21): buildNarrativePrompt(), determineTone(), envEffects, fs, generateTemplateNarrative(), { getContextualLore, getLoreByKeyword }, getNarrativeContext(), { getSceneWithEffects, getSceneVersion, incrementEffectBurn } (+13 more)

### Community 15 - "Comunidad RPG 15"
Cohesion: 0.13
Nodes (16): races, buildIndex(), classes, classIndex, getAllClasses(), getAllRaces(), getClass(), getRace() (+8 more)

### Community 16 - "Comunidad RPG 16"
Cohesion: 0.09
Nodes (18): AiDispatcher, { cache, generateCacheKey, classificationCacheKey, TTLS }, { compactPrompt, minifyClassificationPrompt }, DeepSeekProvider, GeminiProvider, HuggingFaceProvider, { logSystem, logError }, memoryContextService (+10 more)

### Community 17 - "Comunidad RPG 17"
Cohesion: 0.13
Nodes (19): { cache, memoryCacheKey, TTLS }, { compactMemoryEntries }, DEFAULT_BOARD_FILE, DEFAULT_MEMORY_FILE, extractActiveBoard(), formatMemoryContext(), fs, normalizeText() (+11 more)

### Community 18 - "Comunidad RPG 18"
Cohesion: 0.12
Nodes (21): abilityLib, { addMoney }, buildMessages(), combatEngine, combatLogger, combatNarrator, duelService, enemiesLib (+13 more)

### Community 19 - "Comunidad RPG 19"
Cohesion: 0.12
Nodes (15): CHARACTER_ROOT, fs, GROUP_ROOT, main(), migrateGroups(), migrateUsers(), path, { supabase } (+7 more)

### Community 20 - "Comunidad RPG 20"
Cohesion: 0.14
Nodes (17): invalidateSceneNarrative(), buildRefereeContext(), buildRefereePrompt(), buildSceneDescription(), effectBurnCounters, getBurnKey(), getEffectBurnCount(), getScene() (+9 more)

### Community 21 - "Comunidad RPG 21"
Cohesion: 0.19
Nodes (20): buildDefaultProfile(), buildRegistration(), creatorDigits(), ensureUserProfile(), getCreatorFolderName(), getTopActiveUsers(), listUserProfiles(), normalizeActivity() (+12 more)

### Community 22 - "Comunidad RPG 22"
Cohesion: 0.24
Nodes (19): execute(), CHARACTER_CATEGORIES, {
  CHARACTER_CATEGORIES,
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  MAX_CHARACTER_NAME_LENGTH,
  MAX_SLOT_SIZE,
  MAX_CHARACTERS_PER_USER,
}, createCharacter(), deleteCharacter(), editCharacter(), getCharacter(), getCharacterBySlug() (+11 more)

### Community 23 - "Comunidad RPG 23"
Cohesion: 0.17
Nodes (17): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), ensureGroupActivity(), getGroupActivity(), getGroupMemberActivity(), getTopGroupMembers(), { GROUP_TOP_LIMIT } (+9 more)

### Community 24 - "Comunidad RPG 24"
Cohesion: 0.12
Nodes (13): {
  deleteWarn,
  getWarns,
}, { formatError, box }, {
  getFirstMentionedJid,
}, {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
}, {
  addWarn,
  getWarns,
  MAX_WARNS,
}, { formatError, box }, {
  getFirstMentionedJid,
}, {
  resolveTargetDisplayName,
  formatDisplayMention,
  withMentions,
} (+5 more)

### Community 25 - "Comunidad RPG 25"
Cohesion: 0.16
Nodes (15): COMPACTION_POLICY, { COMPACTION_POLICY }, compactMemoryEntries(), compactPrompt(), estimateTokens(), minifyClassificationPrompt(), stripExcessWhitespace(), truncatePreservingHeadTail() (+7 more)

### Community 26 - "Comunidad RPG 26"
Cohesion: 0.16
Nodes (15): execute(), { formatCount }, { formatError, box }, { formatRealMentionTag, withMentions }, { getGroupMetadata }, execute(), { formatDisplayMention }, getGroupMetadata() (+7 more)

### Community 27 - "Comunidad RPG 27"
Cohesion: 0.13
Nodes (8): DEFAULT_MODELS, DeepSeekProvider, { DEFAULT_MODELS }, { DEFAULT_MODELS }, GEMINI_FALLBACK_MODELS, { logSystem, logError }, { DEFAULT_MODELS }, OllamaProvider

### Community 28 - "Comunidad RPG 28"
Cohesion: 0.21
Nodes (16): advanceTurn(), applySkip(), checkTimeout(), checkVictoryConditions(), formatHPBar(), formatStatus(), formatTimeRemaining(), formatTurnTag() (+8 more)

### Community 29 - "Comunidad RPG 29"
Cohesion: 0.22
Nodes (15): applyDotToParticipants(), applyEffectRules(), COMBINED_EFFECTS, EFFECTS_REGISTRY, getActiveCombinedEffects(), getActiveEffectsDescription(), getCombinedEffect(), getDamagePerTurn() (+7 more)

### Community 30 - "Comunidad RPG 30"
Cohesion: 0.15
Nodes (14): {
  box,
}, execute(), {
  formatStelas,
}, getMedal(), {
  getTopBalances,
}, {
  TOP_DINERO_LIMIT,
}, {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, getTopBalances() (+6 more)

### Community 31 - "Comunidad RPG 31"
Cohesion: 0.18
Nodes (13): execute(), { formatCharacter }, { getActiveCharacter }, execute(), { formatCharacter }, { getActiveCharacter }, duelService, execute() (+5 more)

### Community 32 - "Comunidad RPG 32"
Cohesion: 0.15
Nodes (13): execute(), { formatError }, { logSystem, logError }, stateManager, turnManager, logError(), getCombatLog(), getCombatsByParticipant() (+5 more)

### Community 33 - "Comunidad RPG 33"
Cohesion: 0.19
Nodes (13): handleVictory(), addMoney(), acceptChallenge(), { addMoney, removeMoney, getBalance }, createChallenge(), getChallengeForTarget(), getChallengeKey(), handlePvPVictory() (+5 more)

### Community 34 - "Comunidad RPG 34"
Cohesion: 0.20
Nodes (12): AUTO_CLASSIFY_LABELS, CACHE_POLICY, PROVIDER_CAPABILITIES, PROVIDER_PRIORITIES, TASK_PROFILES, TASK_TIERS, TOKEN_SAVING_POLICY, { cache, TTLS } (+4 more)

### Community 35 - "Comunidad RPG 35"
Cohesion: 0.24
Nodes (6): compactResult(), estimateChars(), getProviderScore(), getTaskTier(), normalizeTask(), TokenSavingDelegationManager

### Community 36 - "Comunidad RPG 36"
Cohesion: 0.23
Nodes (12): run(), run(), helpers, run(), turnManager, assertDeepEqual(), createMockEnemy(), createMockParticipant() (+4 more)

### Community 37 - "Comunidad RPG 37"
Cohesion: 0.22
Nodes (13): appendToLog(), ensureLogsDir(), fsp, getLogFileName(), LOG_PREFIX, logCommand(), LOGS_DIR, path (+5 more)

### Community 38 - "Comunidad RPG 38"
Cohesion: 0.22
Nodes (12): extractSectionByKeyword(), extractTitle(), fs, fsSync, getAllLore(), getContextualLore(), getLoreByKeyword(), getLoreContext() (+4 more)

### Community 39 - "Comunidad RPG 39"
Cohesion: 0.21
Nodes (6): RPG_CONFIG, calculateLevelScaling(), calculateStats(), getClassBonuses(), getRaceBonuses(), { RPG_CONFIG }

### Community 40 - "Comunidad RPG 40"
Cohesion: 0.18
Nodes (9): ARMOR_TYPE_LABELS, COBERTURA_MAP, DAMAGE_EFFECTIVENESS, DAMAGE_ICONS, findItemByName(), getArmorByCoverage(), getCoverageZones(), getMaxWeight() (+1 more)

### Community 41 - "Comunidad RPG 41"
Cohesion: 0.18
Nodes (8): checkPatterns(), combatParser, MANO_BLANCA_PATTERNS, MANO_NEGRA_PATTERNS, validate(), combatValidator, helpers, run()

### Community 42 - "Comunidad RPG 42"
Cohesion: 0.29
Nodes (10): buildAliasStr(), buildSection(), CAT_META, CAT_ORDER, COMBAT_CMDS, { commands }, execute(), getGroup() (+2 more)

### Community 43 - "Comunidad RPG 43"
Cohesion: 0.18
Nodes (9): { createCharacter, setActiveCharacter }, {
  formatCommandForm,
  formatError,
  box,
}, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, CHARACTER_ROOT, DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, path (+1 more)

### Community 44 - "Comunidad RPG 44"
Cohesion: 0.27
Nodes (9): auditDesignBoard(), auditLocalMemory(), auditSupabaseTables(), { createClient }, fs, main(), MEMORY_PATH, path (+1 more)

### Community 45 - "Comunidad RPG 45"
Cohesion: 0.31
Nodes (9): {
  box,
}, execute(), {
  formatStelas,
}, {
  getOrCreateProfile,
  getUserProfile,
}, resolveTarget(), resolveEconomyProfile(), getOrCreateProfile(), getUserProfile() (+1 more)

### Community 46 - "Comunidad RPG 46"
Cohesion: 0.29
Nodes (9): {
  box,
}, {
  claimDaily,
}, {
  DAILY_COOLDOWN_HOURS,
}, execute(), formatProgressBar(), {
  formatStelas,
  formatDuration,
}, formatStreakLabel(), claimDaily() (+1 more)

### Community 47 - "Comunidad RPG 47"
Cohesion: 0.27
Nodes (5): ABILITIES_REGISTRY, applyAbilityCosts(), canUseAbility(), getAbility(), { reduceBuffTimers }

### Community 48 - "Comunidad RPG 48"
Cohesion: 0.22
Nodes (7): abilitiesData, applyEffect(), combatEngine, executeAbility(), statCalc, stateManager, turnManager

### Community 49 - "Comunidad RPG 49"
Cohesion: 0.29
Nodes (8): attemptPartialRepair(), fuzzyParseJSON(), LLM_OUTPUT_SCHEMA, VALID_ACTION_TYPES, VALID_DAMAGE_TYPES, VALID_INFRACTION_TYPES, VALID_ZONES, validateOutput()

### Community 50 - "Comunidad RPG 50"
Cohesion: 0.25
Nodes (8): duelService, execute(), { formatError }, { getActiveCharacter }, { getBalance }, stateManager, getBalance(), getMoneyValue()

### Community 51 - "Comunidad RPG 51"
Cohesion: 0.22
Nodes (8): execute(), { formatError, box }, { getActiveCharacter, updateCharacterStats }, invService, itemsData, { logSystem, logError }, stateManager, turnManager

### Community 52 - "Comunidad RPG 52"
Cohesion: 0.25
Nodes (8): CHARACTER_ROOT, { createClient }, fs, fsp, migrateCharacters(), path, readJson(), supabase

### Community 53 - "Comunidad RPG 53"
Cohesion: 0.22
Nodes (6): { cache, memoryCacheKey, TTLS, generateCacheKey }, cachedRead(), invalidateAllCache(), invalidateTopActiveUsersCache(), invalidateTopBalancesCache(), userCacheKey()

### Community 54 - "Comunidad RPG 54"
Cohesion: 0.22
Nodes (7): abilities, helpers, run(), helpers, path, run(), assert()

### Community 55 - "Comunidad RPG 55"
Cohesion: 0.29
Nodes (7): execute(), { formatError, box }, { getActiveCharacter }, invService, itemsData, { logSystem, logError }, SLOTS

### Community 56 - "Comunidad RPG 56"
Cohesion: 0.29
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

### Community 57 - "Comunidad RPG 57"
Cohesion: 0.29
Nodes (6): execute(), { formatError, box }, { getActiveCharacter }, invService, itemsData, { logSystem, logError }

### Community 58 - "Comunidad RPG 58"
Cohesion: 0.29
Nodes (6): execute(), { formatError, box }, { getActiveCharacter }, invService, itemsData, { logSystem, logError }

### Community 59 - "Comunidad RPG 59"
Cohesion: 0.29
Nodes (6): combatLogger, duelService, execute(), { formatError }, stateManager, turnManager

### Community 60 - "Comunidad RPG 60"
Cohesion: 0.33
Nodes (3): buildChatTemplate(), { DEFAULT_MODELS }, HuggingFaceProvider

### Community 61 - "Comunidad RPG 61"
Cohesion: 0.29
Nodes (3): aiOrchestrator, generateNPCResponse(), { logSystem, logError }

### Community 62 - "Comunidad RPG 62"
Cohesion: 0.33
Nodes (4): CombatBuffer, { CombatBuffer }, helpers, run()

### Community 63 - "Comunidad RPG 63"
Cohesion: 0.33
Nodes (6): crypto, getCacheKey(), helpers, path, run(), turnManager

### Community 64 - "Comunidad RPG 64"
Cohesion: 0.29
Nodes (6): abilities, abilityEngine, combatEngine, envEffects, helpers, path

### Community 65 - "Comunidad RPG 65"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 67 - "Comunidad RPG 67"
Cohesion: 0.33
Nodes (5): combatRefereeService, combatValidator, helpers, invService, path

### Community 68 - "Comunidad RPG 68"
Cohesion: 0.40
Nodes (3): aiOrchestrator, fs, path

### Community 70 - "Comunidad RPG 70"
Cohesion: 0.40
Nodes (4): combatEngine, helpers, run(), assertEqual()

### Community 71 - "Comunidad RPG 71"
Cohesion: 0.50
Nodes (4): assert, commands, createCtx(), run()

## Knowledge Gaps
- **525 isolated node(s):** `name`, `version`, `description`, `main`, `start` (+520 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `logError()` connect `Comunidad RPG 32` to `Motor de Combate PvE`, `Infraestructura de Orquestación de IA`, `Núcleo de Ejecución del Bot`, `Árbitro de Combate y RP por LLM`, `Sistema de Reportes y Mantenimiento de Bugs`, `Comunidad RPG 6`, `Comunidad RPG 11`, `Comunidad RPG 15`, `Comunidad RPG 16`, `Comunidad RPG 18`, `Comunidad RPG 19`, `Comunidad RPG 27`, `Comunidad RPG 30`, `Comunidad RPG 33`, `Comunidad RPG 34`, `Comunidad RPG 37`, `Comunidad RPG 51`, `Comunidad RPG 55`, `Comunidad RPG 57`, `Comunidad RPG 58`, `Comunidad RPG 61`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `logSystem()` connect `Infraestructura de Orquestación de IA` to `Comunidad RPG 32`, `Motor de Combate PvE`, `Comunidad RPG 34`, `Núcleo de Ejecución del Bot`, `Árbitro de Combate y RP por LLM`, `Sistema de Reportes y Mantenimiento de Bugs`, `Comunidad RPG 37`, `Comunidad RPG 11`, `Comunidad RPG 16`, `Comunidad RPG 18`, `Comunidad RPG 51`, `Comunidad RPG 19`, `Comunidad RPG 55`, `Comunidad RPG 57`, `Comunidad RPG 58`, `Comunidad RPG 27`, `Comunidad RPG 61`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `formatError()` connect `Comandos de Grupo y Personajes` to `Motor de Combate PvE`, `Sistema de Reportes y Mantenimiento de Bugs`, `Comunidad RPG 6`, `Comunidad RPG 8`, `Comunidad RPG 18`, `Comunidad RPG 22`, `Comunidad RPG 24`, `Comunidad RPG 26`, `Comunidad RPG 31`, `Comunidad RPG 32`, `Comunidad RPG 43`, `Comunidad RPG 50`, `Comunidad RPG 51`, `Comunidad RPG 55`, `Comunidad RPG 56`, `Comunidad RPG 57`, `Comunidad RPG 58`, `Comunidad RPG 59`, `Comunidad RPG 73`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _525 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Comandos de Grupo y Personajes` be split into smaller, more focused modules?**
  _Cohesion score 0.06187202538339503 - nodes in this community are weakly interconnected._
- **Should `Motor de Combate PvE` be split into smaller, more focused modules?**
  _Cohesion score 0.05649717514124294 - nodes in this community are weakly interconnected._
- **Should `Infraestructura de Orquestación de IA` be split into smaller, more focused modules?**
  _Cohesion score 0.06038961038961039 - nodes in this community are weakly interconnected._