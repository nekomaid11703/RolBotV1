# Graph Report - RolBotV1  (2026-07-29)

## Corpus Check
- 196 files · ~2,344,716 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1497 nodes · 3402 edges · 101 communities (77 shown, 24 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 252 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7f815975`
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
- messageFormatUtils.js
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
- grupo_abrir.js
- grupo_cerrar.js
- invite.js
- listCharacters
- combatBalance.js
- armor.js
- knip-wrapper.mjs
- durability.js
- weapon.js

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
- `midnightReview()` --calls--> `getOwnerJids()`  [EXTRACTED]
  scripts/midnight_review.js → src/utils/permissionUtils.js
- `simulateBattle()` --calls--> `executeAttack()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js
- `simulateBattle()` --calls--> `executeReaction()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js

## Import Cycles
- None detected.

## Communities (101 total, 24 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.14
Nodes (36): attemptReconnect(), cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, handleConnectionClose(), handleConnectionOpen() (+28 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.12
Nodes (19): { box }, { createReport }, { formatError }, reportCooldowns, CATEGORY_KEYWORDS, createReport(), crypto, determineCategory() (+11 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (23): 1. Diagnostico del Sistema Actual, 2.1 Core: `Module` (la unidad minima de comportamiento), 2.2 `ModuleBase` — clase base, 2.3 `ModuleRegistry` — registro central, 2.4 `Entity` — composicion de modulos (reemplaza a createItem), 2.5 Trigger Executor Pipeline, 2.6 Capa de Definiciones, 2.7 Capa de Servicios — orquestadores genericos (+15 more)

### Community 3 - "loggerService.js"
Cohesion: 0.14
Nodes (23): checkAdminOnly(), checkBotAdminOnly(), checkCreatorOnly(), checkEconomyAdmin(), checkGroupOnly(), checkPermission(), { commands, aliases, registerCommand, getJsFilesRecursively }, handleCommand() (+15 more)

### Community 4 - "characterService.js"
Cohesion: 0.11
Nodes (27): buildAliasStr(), buildOutputHeader(), buildSectionContent(), buildSubcatBlock(), collectUniqueCommands(), { commands }, execute(), getFilteredSectionCmds() (+19 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.20
Nodes (25): calculateLevel(), xpForNextLevel(), filterExisting(), createCharacter(), {
  DEFAULT_CHARACTER_STATS,
  DEFAULT_CHARACTER_SLOTS,
  RACES,
  LEVELABLE_STATS,
  LEVEL_INITIAL,
  FREE_POINTS_AT_CREATION,
  calculateLevel,
  xpForNextLevel,
  RANGOS,
}, deleteCharacter(), distribuirPunto(), { filterExisting } (+17 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.13
Nodes (19): { box }, { deleteWarn, getWarns }, execute(), { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { resolveTargetDisplayName }, { addWarn, getWarns, MAX_WARNS } (+11 more)

### Community 7 - "box"
Cohesion: 0.09
Nodes (33): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+25 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.29
Nodes (9): check(), { execSync }, exists(), firstExisting(), fs, path, ROOT, run() (+1 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.06
Nodes (57): { aggregate }, aggregate(), initPersonalityMap(), mean(), percentile(), { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS }, PERSONALITY_KEYS, { collectMetrics } (+49 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.17
Nodes (11): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin } (+3 more)

### Community 11 - "userService.js"
Cohesion: 0.12
Nodes (12): hasColumn(), KNOWN_SCHEMA, { logSystem }, { supabase }, { cache, TTLS }, cachedRead(), groupCacheKey(), { hasColumn } (+4 more)

### Community 12 - "knip.json"
Cohesion: 0.11
Nodes (17): entry, ignoreBinaries, project, rules, dependencies, devDependencies, exports, files (+9 more)

### Community 13 - "getUserProfile"
Cohesion: 0.12
Nodes (20): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), METADATA_UPDATERS, normalizeActivity(), normalizeProfile() (+12 more)

### Community 14 - "unwarn.js"
Cohesion: 0.19
Nodes (16): { applyFatiguePenalties }, applyPenalties(), attemptBlock(), attemptDodge(), calculateDamage(), canReact(), chooseAiReaction(), {
  DAMAGE_MIN,
  BLOCK_REDUCTION,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_DISTANCE_BLOCK,
  ASPD_PENALTY_PER_5M,
} (+8 more)

### Community 15 - "economyService.js"
Cohesion: 0.05
Nodes (57): { addMoney }, execute(), { executeEconomyAction }, { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget() (+49 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.18
Nodes (18): { box }, { calcFatigueCost, capFatigue }, {
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
}, { getActiveCharacter, setHp }, { rollFlee, executeAttack, executeReaction }, { box } (+10 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.14
Nodes (21): { box }, execute(), { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile } (+13 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.15
Nodes (15): addCritLines(), addDropLine(), addModifierLine(), { box }, DADOS_PERMITIDOS, { formatCommandUsage }, formatDisplayRoll(), { formatError } (+7 more)

### Community 20 - "box"
Cohesion: 0.16
Nodes (16): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { setActiveCharacter }, usageMessage, getUsage() (+8 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.09
Nodes (42): execute(), execute(), execute(), execute(), executeDeletion(), execute(), execute(), { box } (+34 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.14
Nodes (11): DamageModule, ModuleBase, ArmorModule, BuffModule, DamageModule, DurabilityModule, EquipableModule, HealModule (+3 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.09
Nodes (17): A, B, BadMod, BuffModule, ConditionalMod, { Entity, createEntity }, HealModule, HighMod (+9 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.22
Nodes (8): Average Damage Per Attack, Block Effectiveness, Combat Simulation Report, Dodge Effectiveness, Fatigue Progression (Avg), Overview, Personality Matchup Matrix, Win Rates by Personality

### Community 26 - "permissionService.js"
Cohesion: 0.08
Nodes (37): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, { box } (+29 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.15
Nodes (14): { box }, { findSessionByCharacter }, { formatError }, { getActiveCharacter }, { getItem, ITEMS }, updateSessionHp(), { useItem, getInventory }, getItem() (+6 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.23
Nodes (15): getRecentErrors(), formatDuration(), getMemory(), getUptime(), stats, bar(), buildErrorLines(), cachedErrors (+7 more)

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
Cohesion: 0.17
Nodes (11): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+3 more)

### Community 35 - "LRUCache"
Cohesion: 0.10
Nodes (21): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity(), getGroupMemberActivity() (+13 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.11
Nodes (46): applyAttackFatigue(), { box }, { calcFatigueCost, calcFatigueRecovery, capFatigue }, execute(), {
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
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError } (+38 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.08
Nodes (40): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { formatError }, { getActiveCharacter } (+32 more)

### Community 39 - "invite.js"
Cohesion: 0.16
Nodes (14): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, { box }, executeGroupAction() (+6 more)

### Community 40 - "actividad.js"
Cohesion: 0.19
Nodes (14): appendToLog(), cleanOldLogs(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), LOG_PREFIX, LOGS_DIR (+6 more)

### Community 41 - "add.js"
Cohesion: 0.21
Nodes (8): extractTag(), files, fixFile(), fs, isCloseComment(), isOpenComment(), path, srcDir

### Community 42 - "message_format.test.js"
Cohesion: 0.29
Nodes (7): DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, LEVELABLE_STATS, RACES, RANGOS, { CLASES }, {
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
Nodes (15): { addItem }, { box }, { formatError }, { getActiveCharacter }, { getItem, ITEMS }, { parseQuantity }, { box }, { formatError } (+7 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 47 - "characterConfig.js"
Cohesion: 0.22
Nodes (8): { box }, { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter }, usageMessage

### Community 48 - "midnight_review.js"
Cohesion: 0.20
Nodes (14): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), getOpenReports(), getStats(), { logSystem }, markStale() (+6 more)

### Community 64 - "item_add.js"
Cohesion: 0.17
Nodes (14): { box }, buildDivider(), buildDummyAttackLines(), buildKoLines(), buildRestLines(), { calcFatigueRecovery, capFatigue }, execute(), { executeAttack, executeReaction, evaluateDodgeFeasibility } (+6 more)

### Community 68 - "renombrar_pj.js"
Cohesion: 0.24
Nodes (11): createContext, { handleCommand }, { incrementMessages }, { logError }, processSingleMessage(), { recordGroupActivity }, { recordUserActivity }, recordUserAndGroupActivity() (+3 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.18
Nodes (15): CONTUNDENTE_PERFORANTE_MULT, getSpecialTierMult(), getTierMultiplier(), getTierPenaltyBonus(), normalizeTier(), TIERS, getMaterialStats(), { getTierMultiplier } (+7 more)

### Community 70 - "admin_perm_rem.js"
Cohesion: 0.14
Nodes (13): 1. Sistema de Tiers (E, D, C, B, A, S, N), 2. Naturalezas de Daño Físico y Fórmulas de Combate, 3. Sistema de Materiales y Crafteo, 4. Equipamiento, Slots y Cobertura de Armadura, 5. Clasificación de Categorías Generales de Ítems, 🗡️ A. Cortante (Ej: Espadas, Katanas, Hachas), 🔨 B. Contundente (Ej: Mazos, Martillos, Garrotes), Bonos de Set (+5 more)

### Community 71 - "inventoryService.js"
Cohesion: 0.16
Nodes (17): addItem(), characterLocks, cleanupTemporalItems(), { createItem }, ensureTempTestKit(), ensureTestKit(), { filterExisting }, { getActiveCharacter, setHp } (+9 more)

### Community 72 - "supabase.js"
Cohesion: 0.07
Nodes (35): { BufferJSON, initAuthCreds }, { logError }, { supabase }, discover(), COLUMN_TYPES, createMissingTables(), DESIRED_SCHEMA, detectMissingColumns() (+27 more)

### Community 73 - "inventory_service.test.js"
Cohesion: 0.25
Nodes (3): { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }, MOCK_INVENTORY_DATA, mockOrderImpl

### Community 74 - "formatDisplayMention"
Cohesion: 0.20
Nodes (6): createEntity(), Entity, moduleRegistry, ModuleBase, moduleRegistry, registry

### Community 75 - "schemaMigration.js"
Cohesion: 0.27
Nodes (10): useItem(), withCharacterLock(), addEffect(), { filterExisting }, getActiveEffects(), getCooldowns(), { logError }, saveSlots() (+2 more)

### Community 76 - "statusService.js"
Cohesion: 0.26
Nodes (10): execute(), { executeGroupAction }, { promoteToAdmin }, getGroupMetadata(), isAdmin(), isBotAdmin(), { isSameIdentity }, participantMatches() (+2 more)

### Community 77 - "dar_stelas.js"
Cohesion: 0.20
Nodes (9): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin, isEconomyAdmin } (+1 more)

### Community 78 - "messageFormatUtils.js"
Cohesion: 0.28
Nodes (7): { box }, { formatCommandUsage, formatCommandForm }, { formatError }, { box, formatCommandUsage, formatCommandForm, formatError }, fs, path, srcContent

### Community 79 - "dado.js"
Cohesion: 0.12
Nodes (28): appendHistoriaLine(), { box }, buildCharacterCreatedBox(), buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute() (+20 more)

### Community 80 - "editar_pj.js"
Cohesion: 0.16
Nodes (23): execute(), execute(), execute(), execute(), CATEGORY_LABELS, { getProfileDisplayName }, { getUserProfile, getOrCreateProfile, listUserProfiles }, hasEconomyPermission() (+15 more)

### Community 81 - "atacar.js"
Cohesion: 0.17
Nodes (6): BuffModule, ModuleBase, HealModule, ModuleBase, ModuleBase, TemporalModule

### Community 82 - "characterConfig.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 83 - "items.js"
Cohesion: 0.40
Nodes (4): { box }, { getActiveCharacter }, { getInventory }, { getItem }

### Community 84 - "clases.js"
Cohesion: 0.43
Nodes (6): execute(), { formatDisplayMention }, cleanText(), formatDisplayMention(), getProfileDisplayName(), isMeaningfulDisplayName()

### Community 86 - "schedulerService.js"
Cohesion: 0.33
Nodes (8): fixCharacter(), isDryRun, main(), needsMigration(), normalizeStats(), path, { RACES, LEVELABLE_STATS, calculateLevel, DEFAULT_CHARACTER_STATS }, { supabase }

### Community 87 - "heal.js"
Cohesion: 0.33
Nodes (5): { addParticipant }, { box }, execute(), { formatError }, addParticipant()

### Community 88 - "LRUCache"
Cohesion: 0.67
Nodes (3): inventory, trg_inventory_updated_at, update_inventory_updated_at()

### Community 89 - "ConditionalMod"
Cohesion: 0.38
Nodes (6): { box }, execute(), { formatError }, { getReport, getUserReports }, getReport(), getUserReports()

### Community 90 - "listCharacters"
Cohesion: 0.29
Nodes (6): { box }, { formatCommandUsage }, { formatError }, { listCharacters, deleteCharacter }, pendingConfirmations, usageMessage

### Community 92 - "grupo_abrir.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { openGroup }, openGroup()

### Community 93 - "grupo_cerrar.js"
Cohesion: 0.40
Nodes (5): { box }, { closeGroup }, execute(), { formatError }, closeGroup()

### Community 94 - "invite.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { getInviteCode }, getInviteCode()

### Community 95 - "listCharacters"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 96 - "combatBalance.js"
Cohesion: 0.11
Nodes (28): { applyFatiguePenalties }, {
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
}, runSimulation(), simulateBattle() (+20 more)

## Knowledge Gaps
- **672 isolated node(s):** `husky.sh script`, `require`, `sonarjs`, `$schema`, `src/core/bot.js` (+667 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `resolveTargetDisplayName` to `bugReportService.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `economyService.js`, `test_helpers.js`, `groupUtils.js`, `formatErrorUtils.js`, `dar_stelas.js`, `box`, `permissionService.js`, `set_stelas.js`, `dado.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `characterConfig.js`, `item_add.js`, `dar_stelas.js`, `messageFormatUtils.js`, `dado.js`, `editar_pj.js`, `characterConfig.js`, `items.js`, `heal.js`, `ConditionalMod`, `listCharacters`, `grupo_abrir.js`, `grupo_cerrar.js`, `invite.js`, `listCharacters`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `formatError()` connect `resolveTargetDisplayName` to `bugReportService.js`, `crear_pj.js`, `box`, `characterProgressionService.js`, `economyService.js`, `test_helpers.js`, `groupUtils.js`, `formatErrorUtils.js`, `dar_stelas.js`, `box`, `set_stelas.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `characterConfig.js`, `item_add.js`, `dar_stelas.js`, `messageFormatUtils.js`, `dado.js`, `editar_pj.js`, `characterConfig.js`, `heal.js`, `ConditionalMod`, `listCharacters`, `grupo_abrir.js`, `grupo_cerrar.js`, `invite.js`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `logError()` connect `bot.js` to `bugReportService.js`, `loggerService.js`, `renombrar_pj.js`, `formatError`, `grupo_cerrar.js`, `inventoryService.js`, `supabase.js`, `actividad.js`, `schemaMigration.js`, `economyService.js`, `midnight_review.js`, `dado.js`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `require`, `sonarjs` to the rest of the system?**
  _672 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13963963963963963 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._