# Graph Report - RolBotV1  (2026-07-29)

## Corpus Check
- 201 files · ~2,346,948 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1532 nodes · 3485 edges · 99 communities (72 shown, 27 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 255 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29b934d3`
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
- grupo_abrir.js
- grupo_cerrar.js
- listCharacters
- combatBalance.js
- armor.js
- knip-wrapper.mjs
- durability.js
- weapon.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 103 edges
2. `formatError()` - 77 edges
3. `logError()` - 45 edges
4. `getActiveCharacter()` - 39 edges
5. `logSystem()` - 36 edges
6. `formatDisplayMention()` - 30 edges
7. `resolveTargetDisplayName()` - 29 edges
8. `findSessionByCharacter()` - 26 edges
9. `filterExisting()` - 25 edges
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

## Communities (99 total, 27 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.14
Nodes (35): attemptReconnect(), cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, handleConnectionClose(), handleConnectionOpen() (+27 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.16
Nodes (15): CATEGORY_KEYWORDS, createReport(), crypto, determineCategory(), determinePriority(), { downloadMediaMessage }, fs, getDailyCount() (+7 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (23): 1. Diagnostico del Sistema Actual, 2.1 Core: `Module` (la unidad minima de comportamiento), 2.2 `ModuleBase` — clase base, 2.3 `ModuleRegistry` — registro central, 2.4 `Entity` — composicion de modulos (reemplaza a createItem), 2.5 Trigger Executor Pipeline, 2.6 Capa de Definiciones, 2.7 Capa de Servicios — orquestadores genericos (+15 more)

### Community 3 - "loggerService.js"
Cohesion: 0.13
Nodes (26): checkAdminOnly(), checkAdminPerm(), checkBotAdminOnly(), checkCreatorOnly(), checkEconomyAdmin(), checkGroupOnly(), checkPermission(), { commands, aliases, registerCommand, getJsFilesRecursively } (+18 more)

### Community 4 - "characterService.js"
Cohesion: 0.11
Nodes (27): buildAliasStr(), buildOutputHeader(), buildSectionContent(), buildSubcatBlock(), collectUniqueCommands(), { commands }, execute(), getFilteredSectionCmds() (+19 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.14
Nodes (31): calculateLevel(), DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, LEVELABLE_STATS, RACES, RANGOS, xpForNextLevel(), filterExisting() (+23 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.15
Nodes (11): { addParticipant }, { box }, execute(), { formatError }, { box }, { deleteWarn, getWarns }, { formatDisplayMention, withMentions }, { formatError } (+3 more)

### Community 7 - "box"
Cohesion: 0.11
Nodes (40): execute(), { box }, execute(), { formatCount, formatDate, medal }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getTopActiveUsers, getUserProfile }, { resolveTargetDisplayName } (+32 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.29
Nodes (9): check(), { execSync }, exists(), firstExisting(), fs, path, ROOT, run() (+1 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.08
Nodes (37): { aggregate }, aggregate(), initPersonalityMap(), mean(), percentile(), { PERSONALITIES, FATIGUE_SNAPSHOT_TURNS, PHYSICAL_STATS }, PERSONALITY_KEYS, { collectMetrics } (+29 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.08
Nodes (32): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin } (+24 more)

### Community 11 - "userService.js"
Cohesion: 0.11
Nodes (15): hasColumn(), KNOWN_SCHEMA, { logSystem }, { supabase }, getTopBalances(), { cache, TTLS }, cachedRead(), groupCacheKey() (+7 more)

### Community 12 - "knip.json"
Cohesion: 0.11
Nodes (17): entry, ignoreBinaries, project, rules, dependencies, devDependencies, exports, files (+9 more)

### Community 13 - "getUserProfile"
Cohesion: 0.12
Nodes (21): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), METADATA_UPDATERS, normalizeActivity(), normalizeProfile() (+13 more)

### Community 14 - "unwarn.js"
Cohesion: 0.19
Nodes (18): { applyFatiguePenalties }, applyPenalties(), attemptBlock(), attemptDodge(), calculateDamage(), canReact(), chooseAiReaction(), {
  DAMAGE_MIN,
  BLOCK_REDUCTION,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_DISTANCE_BLOCK,
  ASPD_PENALTY_PER_5M,
} (+10 more)

### Community 15 - "economyService.js"
Cohesion: 0.11
Nodes (24): { addMoney }, execute(), { executeEconomyAction }, execute(), { executeEconomyAction }, { removeMoney }, execute(), { executeEconomyAction } (+16 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.17
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
Cohesion: 0.10
Nodes (22): { box }, { formatCommandUsage }, { formatDisplayMention }, { formatError }, { formatStelas }, { getFirstMentionedJid, extractAmountFromArgs }, { getUserProfile }, { resolveTargetDisplayName } (+14 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.15
Nodes (15): addCritLines(), addDropLine(), addModifierLine(), { box }, DADOS_PERMITIDOS, { formatCommandUsage }, formatDisplayRoll(), { formatError } (+7 more)

### Community 20 - "box"
Cohesion: 0.13
Nodes (18): { box }, { equipItem, EQUIPMENT_SLOTS }, { formatCommandUsage }, { formatError }, { getActiveCharacter }, SLOTS_LIST, usageMessage, equipItem() (+10 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.14
Nodes (13): html, progress, src/core/**/*.js, coverageAnalysis, mutate, packageManager, reporters, $schema (+5 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.10
Nodes (33): simulateBattle(), { box }, { calculateMovementFatigue, capFatigue, getMovementRange }, { checkAttackRange }, execute(), { findSessionByCharacter, updateDistance }, { formatCommandUsage }, { formatError } (+25 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.20
Nodes (9): ArmorModule, BuffModule, DamageModule, DurabilityModule, EquipableModule, HealModule, moduleRegistry, TemporalModule (+1 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.08
Nodes (18): Entity, A, B, BadMod, BuffModule, ConditionalMod, { Entity, createEntity }, HealModule (+10 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.22
Nodes (8): Average Damage Per Attack, Block Effectiveness, Combat Simulation Report, Dodge Effectiveness, Fatigue Progression (Avg), Overview, Personality Matchup Matrix, Win Rates by Personality

### Community 26 - "permissionService.js"
Cohesion: 0.07
Nodes (49): { box }, CATEGORY_DISPLAY, execute(), { formatCommandUsage }, { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, usageMessage, { box } (+41 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.20
Nodes (9): Arquitectura, Comandos, Configuración, Estado del proyecto, Estructura, IA_rolbot — RolBotV1, Knowledge Graph, Tecnologías (+1 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.18
Nodes (15): { box }, execute(), { findSessionByCharacter }, { formatError }, { getActiveCharacter }, { getItem, ITEMS }, showInventoryList(), updateSessionHp() (+7 more)

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
Nodes (43): applyAttackFatigue(), { box }, { calcFatigueCost, calcFatigueRecovery, capFatigue }, execute(), {
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
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar }, { formatError } (+35 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.08
Nodes (43): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, getRestContext(), execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { formatError } (+35 more)

### Community 39 - "invite.js"
Cohesion: 0.08
Nodes (33): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+25 more)

### Community 40 - "actividad.js"
Cohesion: 0.19
Nodes (14): appendToLog(), cleanOldLogs(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), LOG_PREFIX, LOGS_DIR (+6 more)

### Community 41 - "add.js"
Cohesion: 0.21
Nodes (8): extractTag(), files, fixFile(), fs, isCloseComment(), isOpenComment(), path, srcDir

### Community 42 - "message_format.test.js"
Cohesion: 0.14
Nodes (16): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel(), { box } (+8 more)

### Community 43 - "item_rem.js"
Cohesion: 0.12
Nodes (16): { addItem }, { box }, execute(), { formatError }, { getActiveCharacter }, { getItem, ITEMS }, { parseQuantity }, { box } (+8 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.29
Nodes (6): Contexto, Detalle tecnico, Fase 1 — Stats Magicas + Razas (COMPLETADO), Fase 2 — Migracion y Desbloqueos (COMPLETADO), Fase 3 — 21 Razas Canon (COMPLETADO), Plan: Implementacion de Stats Magicas + Correcciones

### Community 47 - "characterConfig.js"
Cohesion: 0.08
Nodes (27): { box }, execute(), { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage (+19 more)

### Community 48 - "midnight_review.js"
Cohesion: 0.19
Nodes (15): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), getOpenReports(), getStats(), { logSystem }, markStale() (+7 more)

### Community 64 - "item_add.js"
Cohesion: 0.18
Nodes (13): { box }, buildDivider(), buildDummyAttackLines(), buildKoLines(), buildRestLines(), { calcFatigueRecovery, capFatigue }, execute(), { executeAttack, executeReaction, evaluateDodgeFeasibility } (+5 more)

### Community 68 - "renombrar_pj.js"
Cohesion: 0.24
Nodes (11): createContext, { handleCommand }, { incrementMessages }, { logError }, processSingleMessage(), { recordGroupActivity }, { recordUserActivity }, recordUserAndGroupActivity() (+3 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.19
Nodes (14): CONTUNDENTE_PERFORANTE_MULT, getSpecialTierMult(), getTierMultiplier(), getTierPenaltyBonus(), normalizeTier(), TIERS, getMaterialStats(), { getTierMultiplier } (+6 more)

### Community 70 - "admin_perm_rem.js"
Cohesion: 0.14
Nodes (13): 1. Sistema de Tiers (E, D, C, B, A, S, N), 2. Naturalezas de Daño Físico y Fórmulas de Combate, 3. Sistema de Materiales y Crafteo, 4. Equipamiento, Slots y Cobertura de Armadura, 5. Clasificación de Categorías Generales de Ítems, 🗡️ A. Cortante (Ej: Espadas, Katanas, Hachas), 🔨 B. Contundente (Ej: Mazos, Martillos, Garrotes), Bonos de Set (+5 more)

### Community 71 - "inventoryService.js"
Cohesion: 0.16
Nodes (17): addItem(), characterLocks, { createItem }, ensureTempTestKit(), ensureTestKit(), { filterExisting }, { getActiveCharacter, setHp }, getInventory() (+9 more)

### Community 72 - "supabase.js"
Cohesion: 0.07
Nodes (35): { BufferJSON, initAuthCreds }, { logError }, { supabase }, discover(), COLUMN_TYPES, createMissingTables(), DESIRED_SCHEMA, detectMissingColumns() (+27 more)

### Community 73 - "inventory_service.test.js"
Cohesion: 0.25
Nodes (3): { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }, MOCK_INVENTORY_DATA, mockOrderImpl

### Community 74 - "formatDisplayMention"
Cohesion: 0.32
Nodes (6): createEntity(), moduleRegistry, cleanupTemporalItems(), { createEntity }, createItem(), { getItem: getRawItem }

### Community 75 - "schemaMigration.js"
Cohesion: 0.33
Nodes (8): addEffect(), { filterExisting }, getActiveEffects(), getCooldowns(), { logError }, saveSlots(), setCooldown(), { supabase }

### Community 76 - "statusService.js"
Cohesion: 0.17
Nodes (16): { box }, { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile }, { resolveTargetDisplayName } (+8 more)

### Community 77 - "dar_stelas.js"
Cohesion: 0.20
Nodes (9): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin, isEconomyAdmin } (+1 more)

### Community 78 - "messageFormatUtils.js"
Cohesion: 0.27
Nodes (10): fs, generatePair(), generateRandomFighter(), generateRandomStats(), main(), path, quintileBuckets(), randomLevel() (+2 more)

### Community 79 - "dado.js"
Cohesion: 0.12
Nodes (28): appendHistoriaLine(), { box }, buildCharacterCreatedBox(), buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute() (+20 more)

### Community 80 - "editar_pj.js"
Cohesion: 0.29
Nodes (11): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), resolveEconomyProfile(), setAdminForCategory(), setEconomyAdmin() (+3 more)

### Community 81 - "atacar.js"
Cohesion: 0.17
Nodes (7): BuffModule, ModuleBase, ModuleBase, TemporalModule, ModuleBase, moduleRegistry, registry

### Community 83 - "items.js"
Cohesion: 0.33
Nodes (5): { box }, execute(), { getActiveCharacter }, { getInventory }, { getItem }

### Community 86 - "schedulerService.js"
Cohesion: 0.33
Nodes (8): fixCharacter(), isDryRun, main(), needsMigration(), normalizeStats(), path, { RACES, LEVELABLE_STATS, calculateLevel, DEFAULT_CHARACTER_STATS }, { supabase }

### Community 88 - "LRUCache"
Cohesion: 0.67
Nodes (3): inventory, trg_inventory_updated_at, update_inventory_updated_at()

### Community 89 - "ConditionalMod"
Cohesion: 0.08
Nodes (28): { box }, execute(), { formatError }, { getInviteCode }, { box }, { createReport }, execute(), { formatError } (+20 more)

### Community 92 - "grupo_abrir.js"
Cohesion: 0.40
Nodes (5): { box }, execute(), { formatError }, { openGroup }, openGroup()

### Community 93 - "grupo_cerrar.js"
Cohesion: 0.40
Nodes (5): { box }, { closeGroup }, execute(), { formatError }, closeGroup()

### Community 95 - "listCharacters"
Cohesion: 0.40
Nodes (5): { box }, execute(), { listCharacters }, listCharacters(), charactersCacheKey()

### Community 96 - "combatBalance.js"
Cohesion: 0.11
Nodes (31): { applyFatiguePenalties }, {
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
}, runSimulation(), STAT_KEYS (+23 more)

## Knowledge Gaps
- **693 isolated node(s):** `husky.sh script`, `require`, `sonarjs`, `$schema`, `src/core/bot.js` (+688 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `box` to `crear_pj.js`, `characterProgressionService.js`, `test_helpers.js`, `groupUtils.js`, `formatErrorUtils.js`, `dar_stelas.js`, `box`, `resolveTargetDisplayName`, `permissionService.js`, `set_stelas.js`, `dado.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `message_format.test.js`, `item_rem.js`, `characterConfig.js`, `item_add.js`, `statusService.js`, `dar_stelas.js`, `dado.js`, `editar_pj.js`, `items.js`, `ConditionalMod`, `grupo_abrir.js`, `grupo_cerrar.js`, `listCharacters`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `formatError()` connect `ConditionalMod` to `crear_pj.js`, `box`, `characterProgressionService.js`, `test_helpers.js`, `groupUtils.js`, `formatErrorUtils.js`, `dar_stelas.js`, `box`, `resolveTargetDisplayName`, `set_stelas.js`, `inventario.js`, `formatError`, `grupo_cerrar.js`, `invite.js`, `item_rem.js`, `characterConfig.js`, `item_add.js`, `dar_stelas.js`, `dado.js`, `grupo_abrir.js`, `grupo_cerrar.js`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `logError()` connect `bot.js` to `bugReportService.js`, `loggerService.js`, `renombrar_pj.js`, `formatError`, `grupo_cerrar.js`, `inventoryService.js`, `supabase.js`, `actividad.js`, `formatDisplayMention`, `schemaMigration.js`, `economyService.js`, `midnight_review.js`, `box`, `dado.js`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `require`, `sonarjs` to the rest of the system?**
  _693 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `loggerService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13105413105413105 - nodes in this community are weakly interconnected._