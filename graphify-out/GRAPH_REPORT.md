# Graph Report - RolBotV1  (2026-07-28)

## Corpus Check
- 189 files · ~2,342,239 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1445 nodes · 3335 edges · 93 communities (68 shown, 25 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 247 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9566ad2b`
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
- inventario.js
- LRUCache
- graphify — Knowledge Graph (Code-Only)
- formatError
- grupo_cerrar.js
- invite.js
- actividad.js
- add.js
- message_format.test.js
- item_rem.js
- logSystem
- h
- Plan: Implementacion de Stats Magicas + Correcciones
- characterConfig.js
- midnight_review.js
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
- item_add.js
- vitest.config.js
- eslint.config.js
- renombrar_pj.js
- schemaMigration.js
- admin_perm_rem.js
- inventoryService.js
- supabase.js
- inventory_service.test.js
- formatDisplayMention
- schemaMigration.js
- statusService.js
- dar_stelas.js
- dado.js
- editar_pj.js
- atacar.js
- characterConfig.js
- items.js
- clases.js
- equipable.js
- schedulerService.js
- heal.js
- LRUCache
- ConditionalMod
- listCharacters
- combatBalance.js
- knip-wrapper.mjs

## God Nodes (most connected - your core abstractions)
1. `box()` - 99 edges
2. `formatError()` - 73 edges
3. `logError()` - 43 edges
4. `logSystem()` - 36 edges
5. `getActiveCharacter()` - 35 edges
6. `formatDisplayMention()` - 30 edges
7. `resolveTargetDisplayName()` - 29 edges
8. `findSessionByCharacter()` - 26 edges
9. `filterExisting()` - 23 edges
10. `getFirstMentionedJid()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `simulateBattle()` --calls--> `executeAttack()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js
- `simulateBattle()` --calls--> `executeReaction()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js
- `simulateBattle()` --calls--> `applyFatiguePenalties()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/fatigueEngine.js

## Import Cycles
- None detected.

## Communities (93 total, 25 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.15
Nodes (34): attemptReconnect(), cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, handleConnectionClose(), handleConnectionOpen() (+26 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.10
Nodes (24): { box }, { createReport }, { formatError }, reportCooldowns, { box }, execute(), { formatError }, { getReport, getUserReports } (+16 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (23): 1. Diagnostico del Sistema Actual, 2.1 Core: `Module` (la unidad minima de comportamiento), 2.2 `ModuleBase` — clase base, 2.3 `ModuleRegistry` — registro central, 2.4 `Entity` — composicion de modulos (reemplaza a createItem), 2.5 Trigger Executor Pipeline, 2.6 Capa de Definiciones, 2.7 Capa de Servicios — orquestadores genericos (+15 more)

### Community 3 - "loggerService.js"
Cohesion: 0.11
Nodes (29): checkAdminOnly(), checkAdminPerm(), checkBotAdminOnly(), checkCreatorOnly(), checkEconomyAdmin(), checkGroupOnly(), checkPermission(), { commands, aliases, registerCommand, getJsFilesRecursively } (+21 more)

### Community 4 - "characterService.js"
Cohesion: 0.10
Nodes (28): buildAliasStr(), buildOutputHeader(), buildSectionContent(), buildSubcatBlock(), collectUniqueCommands(), { commands }, execute(), getFilteredSectionCmds() (+20 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.21
Nodes (23): execute(), DEFAULT_CHARACTER_SLOTS, filterExisting(), createCharacter(), {
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  RACES,
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  FREE_POINTS_AT_CREATION,
  calculateLevel,
  xpForNextLevel,
  RANGOS,
}, deleteCharacter(), distribuirPunto(), { filterExisting } (+15 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.11
Nodes (23): { addParticipant }, { box }, execute(), { formatError }, { box }, execute(), { formatError }, { getInviteCode } (+15 more)

### Community 7 - "box"
Cohesion: 0.09
Nodes (35): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+27 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.29
Nodes (9): check(), { execSync }, exists(), firstExisting(), fs, path, ROOT, run() (+1 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.06
Nodes (56): { aggregate }, aggregate(), initPersonalityMap(), mean(), percentile(), { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS }, PERSONALITY_KEYS, { collectMetrics } (+48 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.10
Nodes (22): { box }, execute(), { formatCount, medal }, { formatDisplayMention, withMentions }, { getTopGroupMembers }, { box }, { formatCommandUsage }, { formatDisplayMention, withMentions } (+14 more)

### Community 11 - "userService.js"
Cohesion: 0.21
Nodes (13): discover(), COLUMN_TYPES, createMissingTables(), DESIRED_SCHEMA, detectMissingColumns(), { discover }, generateMigrationSQL(), logMigrationInfo() (+5 more)

### Community 12 - "knip.json"
Cohesion: 0.11
Nodes (17): entry, ignoreBinaries, project, rules, dependencies, devDependencies, exports, files (+9 more)

### Community 13 - "getUserProfile"
Cohesion: 0.12
Nodes (21): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getOrCreateProfile(), getTopActiveUsers(), METADATA_UPDATERS, normalizeActivity() (+13 more)

### Community 14 - "unwarn.js"
Cohesion: 0.21
Nodes (17): { applyFatiguePenalties }, applyPenalties(), attemptBlock(), attemptDodge(), calculateDamage(), canReact(), chooseAiReaction(), {
  DAMAGE_MIN,
  BLOCK_REDUCTION,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_DISTANCE_BLOCK,
  ASPD_PENALTY_PER_5M,
} (+9 more)

### Community 15 - "economyService.js"
Cohesion: 0.17
Nodes (21): { addMoney }, execute(), { executeEconomyAction }, addMoney(), claimDaily(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, { filterExisting }, getBalance() (+13 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.18
Nodes (20): { box }, { calcFatigueCost, capFatigue }, execute(), {
  findSessionByCharacter,
  findSessionByUser,
  endSession,
  advanceTurn,
  setPendingReaction,
}, { formatError }, {
  formatFlee,
  formatActionMenu,
  formatReactionPrompt,
  buildFatigueBar,
}, { getActiveCharacter, setHp }, { rollFlee, executeAttack, executeReaction } (+12 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.10
Nodes (22): { box }, { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName } (+14 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.14
Nodes (17): addCritLines(), addDropLine(), addModifierLine(), { box }, DADOS_PERMITIDOS, execute(), { formatCommandUsage }, formatDisplayRoll() (+9 more)

### Community 20 - "box"
Cohesion: 0.18
Nodes (8): { box }, { formatStelas }, { getTopBalances }, { medal }, { TOP_DINERO_LIMIT }, getTopBalances(), topBalancesCacheKey(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.10
Nodes (33): simulateBattle(), { box }, { calculateMovementFatigue, capFatigue, getMovementRange }, { checkAttackRange }, execute(), { findSessionByCharacter, updateDistance }, { formatCommandUsage }, { formatError } (+25 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.20
Nodes (8): BuffModule, DamageModule, EquipableModule, HealModule, moduleRegistry, TemporalModule, ModuleBase, TemporalModule

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.09
Nodes (18): createEntity(), moduleRegistry, A, B, BadMod, BuffModule, { Entity, createEntity }, HealModule (+10 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.22
Nodes (8): Average Damage Per Attack, Block Effectiveness, Combat Simulation Report, Dodge Effectiveness, Fatigue Progression (Avg), Overview, Personality Matchup Matrix, Win Rates by Personality

### Community 26 - "permissionService.js"
Cohesion: 0.07
Nodes (44): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, { box } (+36 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.20
Nodes (14): { box }, execute(), { findSessionByCharacter }, { formatError }, { getActiveCharacter }, { getItem, ITEMS }, showInventoryList(), updateSessionHp() (+6 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.24
Nodes (14): formatDuration(), getMemory(), getUptime(), stats, bar(), buildErrorLines(), cachedErrors, formatEventLine() (+6 more)

### Community 31 - "dado.js"
Cohesion: 0.16
Nodes (16): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { logError }, { box }, buildHpBar(), buildInventoryLines() (+8 more)

### Community 32 - "formatError"
Cohesion: 0.11
Nodes (18): Archetype Analysis, ASPD, ATK, Bottom 15 Binary Signatures, D_FULGOR, DEF, FULGOR, HP (+10 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "inventario.js"
Cohesion: 0.09
Nodes (26): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+18 more)

### Community 35 - "LRUCache"
Cohesion: 0.06
Nodes (34): GROUP_ACTIVITY_ROOT, path, hasColumn(), KNOWN_SCHEMA, { logSystem }, { supabase }, buildDefaultGroupRecord(), { cache, TTLS } (+26 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.11
Nodes (38): applyAttackFatigue(), { box }, { calcFatigueCost, calcFatigueRecovery, capFatigue }, execute(), {
  executeAttack,
  executeReaction,
  chooseAiReaction,
  calculateXpReward,
  checkAttackRange,
}, {
  findSessionByCharacter,
  findSessionByUser,
  advanceTurn,
  setPendingReaction,
  endSession,
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError } (+30 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.08
Nodes (46): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, getRestContext(), execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { formatError } (+38 more)

### Community 39 - "invite.js"
Cohesion: 0.13
Nodes (18): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+10 more)

### Community 40 - "actividad.js"
Cohesion: 0.20
Nodes (15): appendToLog(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), getRecentErrors(), LOG_PREFIX, logCommand() (+7 more)

### Community 41 - "add.js"
Cohesion: 0.21
Nodes (8): extractTag(), files, fixFile(), fs, isCloseComment(), isOpenComment(), path, srcDir

### Community 42 - "message_format.test.js"
Cohesion: 0.29
Nodes (8): calculateLevel(), DEFAULT_CHARACTER_STATS, LEVELABLE_STATS, RACES, RANGOS, xpForNextLevel(), { CLASES }, {
  LEVELABLE_STATS,
  HP_MAX,
  DEFAULT_CHARACTER_STATS,
  RACES,
  LEVEL_INITIAL,
  LEVEL_MAX,
  FREE_POINTS_AT_CREATION,
  XP_CURVE_BASE,
  XP_CURVE_EXPONENT,
  xpForNextLevel,
  calculateLevel,
  RANGOS,

  MAX_CHARACTER_NAME_LENGTH,
  MAX_CHARACTERS_PER_USER,
}

### Community 43 - "item_rem.js"
Cohesion: 0.12
Nodes (18): { addItem }, { box }, execute(), { formatError }, { getActiveCharacter }, { getItem, ITEMS }, { parseQuantity }, { box } (+10 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 47 - "characterConfig.js"
Cohesion: 0.08
Nodes (30): { box }, execute(), { formatError }, { openGroup }, { box }, { closeGroup }, execute(), { formatError } (+22 more)

### Community 48 - "midnight_review.js"
Cohesion: 0.19
Nodes (15): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), getOpenReports(), getStats(), { logSystem }, markStale() (+7 more)

### Community 64 - "item_add.js"
Cohesion: 0.19
Nodes (15): { box }, buildDivider(), buildDummyAttackLines(), buildKoLines(), buildRestLines(), { calcFatigueRecovery, capFatigue }, execute(), { executeAttack, executeReaction, evaluateDodgeFeasibility } (+7 more)

### Community 68 - "renombrar_pj.js"
Cohesion: 0.24
Nodes (11): createContext, { handleCommand }, { incrementMessages }, { logError }, processSingleMessage(), { recordGroupActivity }, { recordUserActivity }, recordUserAndGroupActivity() (+3 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.18
Nodes (14): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS } (+6 more)

### Community 70 - "admin_perm_rem.js"
Cohesion: 0.50
Nodes (3): execute(), { executeEconomyAction }, { removeMoney }

### Community 71 - "inventoryService.js"
Cohesion: 0.13
Nodes (15): characterLocks, cleanupTemporalItems(), { createItem }, { filterExisting }, { getActiveCharacter, setHp }, { getItem }, { invalidateUserCache }, { logError } (+7 more)

### Community 72 - "supabase.js"
Cohesion: 0.09
Nodes (23): { BufferJSON, initAuthCreds }, { logError }, { supabase }, useSupabaseAuthState(), checkHealth(), { checkVersion }, CRITICAL_EQUALS_COLUMNS, { discover } (+15 more)

### Community 73 - "inventory_service.test.js"
Cohesion: 0.25
Nodes (3): { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }, MOCK_INVENTORY_DATA, mockOrderImpl

### Community 75 - "schemaMigration.js"
Cohesion: 0.33
Nodes (8): addEffect(), { filterExisting }, getActiveEffects(), getCooldowns(), { logError }, saveSlots(), setCooldown(), { supabase }

### Community 76 - "statusService.js"
Cohesion: 0.50
Nodes (3): execute(), { executeEconomyAction }, { setMoney }

### Community 79 - "dado.js"
Cohesion: 0.15
Nodes (24): appendHistoriaLine(), { box }, buildCharacterCreatedBox(), buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute() (+16 more)

### Community 80 - "editar_pj.js"
Cohesion: 0.11
Nodes (32): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, execute() (+24 more)

### Community 81 - "atacar.js"
Cohesion: 0.22
Nodes (5): BuffModule, ModuleBase, ModuleBase, moduleRegistry, registry

### Community 82 - "characterConfig.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 83 - "items.js"
Cohesion: 0.22
Nodes (10): { box }, execute(), { getActiveCharacter }, { getInventory }, { getItem }, getItem(), getItemsByCategory(), ITEMS (+2 more)

### Community 84 - "clases.js"
Cohesion: 0.53
Nodes (4): CLASES, getClase(), validarClase(), { CLASES, getClase, listarClases, validarClase }

### Community 86 - "schedulerService.js"
Cohesion: 0.33
Nodes (8): fixCharacter(), isDryRun, main(), needsMigration(), normalizeStats(), path, { RACES, LEVELABLE_STATS, calculateLevel, DEFAULT_CHARACTER_STATS }, { supabase }

### Community 88 - "LRUCache"
Cohesion: 0.67
Nodes (3): inventory, trg_inventory_updated_at, update_inventory_updated_at()

### Community 90 - "listCharacters"
Cohesion: 0.16
Nodes (13): { box }, execute(), executeDeletion(), { formatCommandUsage }, { formatError }, { listCharacters, deleteCharacter }, pendingConfirmations, usageMessage (+5 more)

### Community 96 - "combatBalance.js"
Cohesion: 0.13
Nodes (21): { applyFatiguePenalties }, {
  calcFatigueCost,
  calcFatigueRecovery,
  capFatigue,
  calculateMovementFatigue,
  getMovementRange,
}, {
  executeAttack,
  executeReaction,
  checkAttackRange,
  getAspdPenalty,
}, generateBattlePair(), generateRandomCharacter(), {
  INITIAL_DISTANCE,
  SIM_AI_DODGE_CHANCE,
  SIM_MIN_LEVEL,
  SIM_MAX_LEVEL,
  SIM_MAX_LEVEL_DIFF,
  SIM_MAX_TURNS,
  SIM_DEFAULT_BATTLE_COUNT,
  SIM_HP_MULTIPLIER,
  SIM_STAT_BASE,
}, runSimulation(), STAT_KEYS (+13 more)

## Knowledge Gaps
- **647 isolated node(s):** `husky.sh script`, `require`, `sonarjs`, `$schema`, `src/core/bot.js` (+642 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `characterConfig.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `test_helpers.js`, `groupUtils.js`, `formatErrorUtils.js`, `dar_stelas.js`, `box`, `resolveTargetDisplayName`, `permissionService.js`, `set_stelas.js`, `dado.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `item_add.js`, `schemaMigration.js`, `dado.js`, `editar_pj.js`, `characterConfig.js`, `items.js`, `listCharacters`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `formatError()` connect `editar_pj.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `test_helpers.js`, `groupUtils.js`, `formatErrorUtils.js`, `dar_stelas.js`, `resolveTargetDisplayName`, `set_stelas.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `characterConfig.js`, `item_add.js`, `dado.js`, `characterConfig.js`, `listCharacters`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `logSystem()` connect `bot.js` to `bugReportService.js`, `LRUCache`, `loggerService.js`, `economyAdminHelper.js`, `grupo_cerrar.js`, `supabase.js`, `actividad.js`, `userService.js`, `midnight_review.js`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `require`, `sonarjs` to the rest of the system?**
  _647 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.146218487394958 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09686609686609686 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._