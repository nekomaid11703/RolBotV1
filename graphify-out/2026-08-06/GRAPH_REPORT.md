# Graph Report - RolBotV1  (2026-08-06)

## Corpus Check
- 343 files · ~17,867,867 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3358 nodes · 5691 edges · 171 communities (143 shown, 28 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 326 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88a0e721`
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
- supabase.js
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
- renombrar_pj.js
- schemaMigration.js
- admin_perm_rem.js
- inventoryService.js
- supabase.js
- inventory_service.test.js
- admin_perm_list.js
- atacar.js
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
- editar_pj.js
- huir.js
- inventario.js
- itemService.js
- items.js
- buff.js
- listCharacters
- combatBalance.js
- durabilityPersistenceService.js
- knip-wrapper.mjs
- durability.js
- weapon.js
- 001_create_inventory.sql
- eco_admin_list.js
- Decisiones Técnicas
- getActiveCharacter
- listCharacters
- audit_family_generator.js
- 003_remediation_item_equipment.sql
- ModuleBase.js
- invite.js
- Auditoría profunda — baseline 10k
- deep_audit.js
- itemStatService.js
- demote.js
- dummy_equipment.test.js
- bugreport.js
- 002_rename_stats_keys.sql
- supabase_auth_state.test.js
- command_format.test.js
- test_supabase_schema.js
- admin_perm_rem.js
- aggregator.js
- descansar.js
- throwable.js
- items.js
- run_experiments.js
- handleCommand
- command_handler_error.test.js
- formatters.js
- Combat Simulation Report
- Combat Simulation Report
- Combat Simulation Report
- logError
- iron_family.test.js
- schemaValidator.js
- Guía de Creación de Ítems
- columnRegistry.js
- composeMessage
- schedulerService.js
- huir.js
- LRUCache
- Combat Simulation Report
- Combat Simulation Report
- characterSections.js
- Auditoría de datos crudos de la simulación
- Auditoría de datos crudos de la simulación
- Auditoría de datos crudos de la simulación
- Auditoría de datos crudos de la simulación
- Auditoría de datos crudos de la simulación
- Auditoría de datos crudos de la simulación
- Auditoría de datos crudos de la simulación
- Auditoría de datos crudos de la simulación
- Auditoría de datos crudos de la simulación
- Auditoría de datos crudos de la simulación
- statusService.js
- editar_pj.js
- config.js
- durabilityPersistenceService.js
- damage.js
- runSimulation
- clases.js
- moduleRegistry.js
- Maniquí 13: Extremista ATK Yordle (nivel 122)
- Maniquí 15: Gladiador Elfo (nivel 125)
- Maniquí 20: Extremista DEF No Muerto (nivel 129)
- Auditoría de datos crudos de la simulación
- groupAdminHelper.js
- help.js
- createReport
- bugstatus.js

## God Nodes (most connected - your core abstractions)
1. `box()` - 101 edges
2. `logError()` - 44 edges
3. `getActiveCharacter()` - 40 edges
4. `logSystem()` - 30 edges
5. `formatError()` - 30 edges
6. `formatDisplayMention()` - 30 edges
7. `filterExisting()` - 29 edges
8. `resolveTargetDisplayName()` - 29 edges
9. `findSessionByCharacter()` - 28 edges
10. `supabase` - 27 edges

## Surprising Connections (you probably didn't know these)
- `deriveShield()` --calls--> `getArmorStats()`  [EXTRACTED]
  scripts/simulate_combat/fighterGenerator.js → src/services/rpg/itemStatService.js
- `midnightReview()` --calls--> `logError()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `midnightReview()` --calls--> `logSystem()`  [EXTRACTED]
  scripts/midnight_review.js → src/services/loggerService.js
- `simulateBattle()` --calls--> `executeAttack()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js
- `simulateBattle()` --calls--> `executeReaction()`  [EXTRACTED]
  scripts/simulate_battles.js → src/services/rpg/combatEngine.js

## Import Cycles
- None detected.

## Communities (171 total, 28 thin omitted)

### Community 0 - "bot.js"
Cohesion: 0.12
Nodes (28): cleanupSock(), { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion }, forceNewSession(), { getOwnerJids }, { getResolvedSince }, { loadCommands }, { logSystem, logError, cleanOldLogs }, P (+20 more)

### Community 1 - "bugReportService.js"
Cohesion: 0.12
Nodes (18): assertDeclaredImageSize(), CATEGORY_KEYWORDS, crypto, { downloadMediaMessage }, fs, fsp, { getGroupMetadata }, getImageExtension() (+10 more)

### Community 2 - "groupActivityService.js"
Cohesion: 0.08
Nodes (23): 1. Diagnostico del Sistema Actual, 2.1 Core: `Module` (la unidad minima de comportamiento), 2.2 `ModuleBase` — clase base, 2.3 `ModuleRegistry` — registro central, 2.4 `Entity` — composicion de modulos (reemplaza a createItem), 2.5 Trigger Executor Pipeline, 2.6 Capa de Definiciones, 2.7 Capa de Servicios — orquestadores genericos (+15 more)

### Community 3 - "loggerService.js"
Cohesion: 0.11
Nodes (33): chatCommandTails, checkAdminOnly(), checkAdminPerm(), checkBotAdminOnly(), checkCreatorOnly(), checkEconomyAdmin(), checkGroupOnly(), checkPermission() (+25 more)

### Community 4 - "characterService.js"
Cohesion: 0.12
Nodes (28): appendHistoriaLine(), { box }, buildCharacterCreatedBox(), buildRaceList(), buildRaceSummary(), buildTemplate(), { createCharacter, setActiveCharacter }, execute() (+20 more)

### Community 5 - "economyAdminHelper.js"
Cohesion: 0.07
Nodes (64): applyDurabilityHit(), { box }, buildAttackGearLines(), { calcFatigueCost, capFatigue }, execute(), {
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
}, { formatActionMenu, formatReactionPrompt, buildFatigueBar } (+56 more)

### Community 6 - "crear_pj.js"
Cohesion: 0.19
Nodes (19): { addMoney }, execute(), { executeEconomyAction }, addMoney(), claimDaily(), {
  DAILY_BASE_REWARD,
  DAILY_COOLDOWN_HOURS,
  DAILY_STREAK_RESET_HOURS,
  DAILY_STREAK_BONUS_PER_DAY,
  DAILY_STREAK_BONUS_CAP,
}, { filterExisting }, getMoneyValue() (+11 more)

### Community 7 - "box"
Cohesion: 0.09
Nodes (37): { box }, execute(), { formatCount, formatDate }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { getGroupMemberActivity, getGroupActivity }, { getGroupMetadata }, { getUserProfile } (+29 more)

### Community 8 - "test_logger_service.js"
Cohesion: 0.29
Nodes (9): check(), { execSync }, exists(), firstExisting(), fs, path, ROOT, run() (+1 more)

### Community 9 - "characterConfig.js"
Cohesion: 0.14
Nodes (19): { aggregate }, { collectMetrics }, simulateCombat(), parseArgs(), printUsage(), generateFighterPair(), { formatMarkdownReport }, fs (+11 more)

### Community 10 - "characterProgressionService.js"
Cohesion: 0.09
Nodes (41): { BLOCK_PREFER_DEF_THRESHOLD }, FAMILIES, MATERIAL_RARITY_ORDER, MATERIAL_RARITY_WEIGHTS, TIER_CAPS, TIER_ORDER, {
  ARMOR_SLOTS,
  COVERAGES,
  NO_WEAPON_CHANCE,
  NO_PIECE_CHANCE,
  SHIELD_CHANCE,
  AMULET_CHANCE,
  SET_BONUS_THRESHOLD,
  LEVEL_MIN,
  LEVEL_MAX,
}, {
  BOW_DAMAGE_MULT,
  BOW_SPEED_BASE,
  BOW_ASPD_BASE,
  AERO,
} (+33 more)

### Community 11 - "userService.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 12 - "knip.json"
Cohesion: 0.11
Nodes (18): entry, ignoreBinaries, project, rules, dependencies, devDependencies, exports, files (+10 more)

### Community 13 - "getUserProfile"
Cohesion: 0.10
Nodes (27): buildDefaultProfile(), buildRegistration(), ensureUserProfile(), { filterExisting }, getTopActiveUsers(), listUserProfiles(), METADATA_UPDATERS, normalizeActivity() (+19 more)

### Community 14 - "unwarn.js"
Cohesion: 0.13
Nodes (20): resolveCombatEquipment(), { ARMOR_SETS }, { getCategory }, getEquippedItems(), { getEquippedSlots }, getInventoryWithMetadata(), { getItem }, { getWeaponStats, getArmorStats, getArtifactStats } (+12 more)

### Community 15 - "economyService.js"
Cohesion: 0.13
Nodes (18): loadCommands(), aliases, commands, fs, getJsFilesRecursively(), normalizeName(), path, registerAlias() (+10 more)

### Community 16 - "test_helpers.js"
Cohesion: 0.07
Nodes (27): ALL_STAT_KEYS, args, dmgRatio, draws, faCI, flag(), fmtCI(), fmtPct() (+19 more)

### Community 17 - "groupUtils.js"
Cohesion: 0.10
Nodes (17): bugReportServicePath, cachedModules, { createReport }, crypto, discover, downloadMediaMessage, fs, fsp (+9 more)

### Community 18 - "formatErrorUtils.js"
Cohesion: 0.06
Nodes (34): Amulet, Armor material, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report (+26 more)

### Community 19 - "dar_stelas.js"
Cohesion: 0.11
Nodes (16): main(), say(), { supabase }, TEMP_PREFIXES, { BufferJSON, initAuthCreds, makeCacheableSignalKeyStore }, { logError }, { supabase }, useSupabaseAuthState() (+8 more)

### Community 20 - "box"
Cohesion: 0.09
Nodes (36): { box }, execute(), { formatCommandUsage }, { getActiveCharacter }, SLOTS_LIST, { unequipItem, normalizeSlot, EQUIPMENT_SLOTS }, usageMessage, { box } (+28 more)

### Community 21 - "stryker.config.json"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 22 - "resolveTargetDisplayName"
Cohesion: 0.06
Nodes (66): { applyFatiguePenalties }, {
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
}, runSimulation(), simulateBattle() (+58 more)

### Community 23 - "eliminar_pj.js"
Cohesion: 0.13
Nodes (12): BuffModule, ModuleBase, ArmorModule, BuffModule, DamageModule, DurabilityModule, EquipableModule, HealModule (+4 more)

### Community 24 - "characterSkillUtils.js"
Cohesion: 0.09
Nodes (17): A, B, BadMod, BuffModule, ConditionalMod, { Entity, createEntity }, HealModule, HighMod (+9 more)

### Community 25 - "eco_admin_rem.js"
Cohesion: 0.06
Nodes (34): Amulet, Armor material, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report (+26 more)

### Community 26 - "permissionService.js"
Cohesion: 0.08
Nodes (24): aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, d_fulgor, Data Variance (+16 more)

### Community 27 - "IA_rolbot — RolBotV1"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 28 - "set_stelas.js"
Cohesion: 0.28
Nodes (12): execute(), { box }, execute(), { findSessionByCharacter }, { getActiveCharacter }, resolveUseTarget(), showInventoryList(), updateSessionHp() (+4 more)

### Community 29 - "combatEngine.js"
Cohesion: 0.23
Nodes (10): ALL_MILESTONES, candidates, cols, pad(), printTable(), simulateCurve(), SKILL_MILESTONES, SLOT_MILESTONES (+2 more)

### Community 30 - "renombrar_pj.js"
Cohesion: 0.23
Nodes (15): getRecentErrors(), formatDuration(), getMemory(), getUptime(), stats, bar(), buildErrorLines(), cachedErrors (+7 more)

### Community 31 - "dado.js"
Cohesion: 0.10
Nodes (32): { createSession, createDummySession, findSessionByCharacter }, { ensureTempTestKit, ensureIronFamilyKit }, execute(), { formatCombatOpen }, { getActiveCharacter }, { resolveCharacterEquipment }, resolveOpenEquipment(), COMBAT_ACTIONS (+24 more)

### Community 32 - "formatError"
Cohesion: 0.11
Nodes (18): Archetype Analysis, ASPD, ATK, Bottom 15 Binary Signatures, D_FULGOR, DEF, FULGOR, HP (+10 more)

### Community 33 - "logger.test.js"
Cohesion: 0.25
Nodes (7): forbiddenImports, fs, logger, loggerPath, LOGS_DIR, path, srcContent

### Community 34 - "inventario.js"
Cohesion: 0.15
Nodes (19): aggregate(), getBucket(), initPersonalityMap(), mean(), percentile(), {
  PERSONALITIES,
  FATIGUE_SNAPSHOT_TURNS,
  PHYSICAL_STATS,
  MAGIC_STATS,
  MATCHED_LEVEL_DIFF_PCT,
  BALANCE_TARGETS,
  MAGIC_HIGH_THRESHOLD,
}, PERSONALITY_KEYS, STAT_BUCKETS (+11 more)

### Community 35 - "LRUCache"
Cohesion: 0.14
Nodes (10): hasColumn(), { cache, TTLS }, cachedRead(), groupCacheKey(), { hasColumn }, invalidateGroupCache(), invalidateTopBalancesCache(), safeSelect() (+2 more)

### Community 36 - "graphify — Knowledge Graph (Code-Only)"
Cohesion: 0.33
Nodes (5): graphify — Knowledge Graph (Code-Only), Hook post-commit:, Instalación y dependencias, Reglas operativas del repositorio:, Uso para auditoría e investigación

### Community 37 - "formatError"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 38 - "grupo_cerrar.js"
Cohesion: 0.07
Nodes (47): execute(), { findSessionByUser, removeSession }, { formatCombatDisolved }, execute(), { findSessionByCharacter, findSessionByUser }, { formatCombatStatus }, { getActiveCharacter }, { resolveCharacterEquipment } (+39 more)

### Community 39 - "invite.js"
Cohesion: 0.09
Nodes (37): { addParticipant }, { box }, execute(), { box }, execute(), { openGroup }, { box }, { closeGroup } (+29 more)

### Community 40 - "actividad.js"
Cohesion: 0.20
Nodes (13): appendToLog(), ensureLogsDir(), fsp, getErrorsByDate(), getLogFileName(), LOG_PREFIX, LOGS_DIR, parseErrorEntries() (+5 more)

### Community 41 - "add.js"
Cohesion: 0.21
Nodes (8): extractTag(), files, fixFile(), fs, isCloseComment(), isOpenComment(), path, srcDir

### Community 42 - "message_format.test.js"
Cohesion: 0.22
Nodes (15): deriveArmorPiece(), deriveWeapon(), getTierMultiplier(), normalizeTier(), getMaterialStats(), { getTierMultiplier }, deriveMetadata(), defaultBaseCost() (+7 more)

### Community 43 - "supabase.js"
Cohesion: 0.06
Nodes (31): Antes y después en la rama v1.6, Auditoría profunda e integración de RolBotV1, Cambios implementados, Combate y persistencia, Conexión y ciclo de vida, Deuda restante priorizada, Evidencia reproducible, Integración sin pérdida de v1.6 (+23 more)

### Community 46 - "Plan: Implementacion de Stats Magicas + Correcciones"
Cohesion: 0.14
Nodes (21): GROUP_ACTIVITY_ROOT, path, buildDefaultGroupRecord(), { cache, TTLS }, ensureGroupActivity(), { filterExisting }, getGroupActivity(), getGroupMemberActivity() (+13 more)

### Community 47 - "characterConfig.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 48 - "midnight_review.js"
Cohesion: 0.21
Nodes (13): { getOpenReports, getStats, markStale }, { getOwnerJids }, { logSystem, logError }, midnightReview(), getOpenReports(), getStats(), { logSystem }, markStale() (+5 more)

### Community 64 - "item_add.js"
Cohesion: 0.14
Nodes (17): addCritLines(), addDropLine(), addModifierLine(), { box }, DADOS_PERMITIDOS, execute(), { formatCommandUsage }, formatDisplayRoll() (+9 more)

### Community 68 - "renombrar_pj.js"
Cohesion: 0.23
Nodes (12): createContext, { handleCommand }, { incrementMessages }, { logSystem, logError }, processSingleMessage(), { recordGroupActivity }, { recordUserActivity }, recordUserAndGroupActivity() (+4 more)

### Community 69 - "schemaMigration.js"
Cohesion: 0.31
Nodes (8): PHYSICAL_STATS, collectMetrics(), equipmentMetrics(), { getCoverage }, materialRarityOf(), { MATERIALS }, { PHYSICAL_STATS }, trackReaction()

### Community 70 - "admin_perm_rem.js"
Cohesion: 0.14
Nodes (13): 1. Sistema de Tiers (E, D, C, B, A, S, N), 2. Naturalezas de Daño Físico y Fórmulas de Combate, 3. Sistema de Materiales y Crafteo, 4. Equipamiento, Slots y Cobertura de Armadura, 5. Clasificación de Categorías Generales de Ítems, 🗡️ A. Cortante (Ej: Espadas, Katanas, Hachas), 🔨 B. Contundente (Ej: Mazos, Martillos, Garrotes), Bonos de Set (+5 more)

### Community 71 - "inventoryService.js"
Cohesion: 0.11
Nodes (28): execute(), { formatCharacter }, { getActiveCharacter }, { getInventory }, { logError }, { resolveCharacterEquipment }, logError(), addItem() (+20 more)

### Community 72 - "supabase.js"
Cohesion: 0.14
Nodes (11): cachedModules, createContext, handleCommand, handlerPath, incrementMessages, logError, logSystem, rawMessage (+3 more)

### Community 73 - "inventory_service.test.js"
Cohesion: 0.15
Nodes (8): getItemsByCategory(), itemCatalog, ITEMS, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }, MOCK_INVENTORY_DATA, mockOrderImpl, { ITEMS, getItem, getItemsByCategory }, { MAX_INVENTORY_SIZE, MAX_STACK_SIZE }

### Community 74 - "admin_perm_list.js"
Cohesion: 0.22
Nodes (18): { normalizeJid, uniqueStrings }, OWNER_ALIASES, createContext(), { extractPhoneNumber, normalizeJid }, extractText(), getMessageType(), isTextLikeMessageType(), TEXT_MESSAGE_TYPES (+10 more)

### Community 75 - "atacar.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 76 - "statusService.js"
Cohesion: 0.10
Nodes (22): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName } (+14 more)

### Community 77 - "dar_stelas.js"
Cohesion: 0.06
Nodes (34): Amulet, Armor material, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report (+26 more)

### Community 78 - "messageFormatUtils.js"
Cohesion: 0.13
Nodes (14): Archivos modificados, Archivos nuevos, Arquitectura resultante, Contexto (estado actual del código), Exclusions / no hacer ahora, Fase 1 — Factoría & Registro genérico de definiciones, Fase 2 — Resolución de Estadísticas del Ítem, Fase 3 — Resolución de Equipo → Payload de Combate (+6 more)

### Community 79 - "dado.js"
Cohesion: 0.12
Nodes (14): { box }, CATEGORIES, CATEGORY_DISPLAY, { formatCommandUsage }, { formatDisplayMention, withMentions }, { formatError }, { getFirstMentionedJid }, { isOwner } (+6 more)

### Community 80 - "editar_pj.js"
Cohesion: 0.27
Nodes (10): fs, generatePair(), generateRandomFighter(), generateRandomStats(), main(), path, quintileBuckets(), randomLevel() (+2 more)

### Community 81 - "atacar.js"
Cohesion: 0.15
Nodes (12): Archivos afectados, Contexto (decisiones cerradas), Fase 0 — Aplicar DDL en Supabase (manual · 1 vez · prerrequisito), FASE 1 — Unificar versión de schema (destino), Fase 2 — Alinear esquema conocido (3 archivos), FASE 3 — Blindaje de equipamiento (`equipmentService.js`), FASE 4 — Limpieza de datos huérfanos, FASE 5 — Conectar metadata/durabilidad (OPCIONAL · post-remediación) (+4 more)

### Community 82 - "characterConfig.js"
Cohesion: 0.12
Nodes (18): { addItem }, { box }, execute(), { getActiveCharacter }, { getItem, ITEMS }, { IRON_ITEMS }, { parseQuantity }, { box } (+10 more)

### Community 83 - "items.js"
Cohesion: 0.14
Nodes (31): execute(), calculateLevel(), DEFAULT_CHARACTER_SLOTS, DEFAULT_CHARACTER_STATS, LEVELABLE_STATS, RACES, RANGOS, xpForNextLevel() (+23 more)

### Community 84 - "clases.js"
Cohesion: 0.13
Nodes (22): { box }, buildDivider(), buildDummyAttackLines(), buildKoLines(), buildRestLines(), { calcFatigueRecovery, capFatigue }, execute(), { executeAttack, executeReaction, evaluateDodgeFeasibility } (+14 more)

### Community 86 - "schedulerService.js"
Cohesion: 0.33
Nodes (8): fixCharacter(), isDryRun, main(), needsMigration(), normalizeStats(), path, { RACES, LEVELABLE_STATS, calculateLevel, DEFAULT_CHARACTER_STATS }, { supabase }

### Community 87 - "heal.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 88 - "LRUCache"
Cohesion: 0.06
Nodes (34): Amulet, Armor material, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report (+26 more)

### Community 89 - "editar_pj.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 90 - "huir.js"
Cohesion: 0.12
Nodes (30): ARMOR_SLOTS, ARROW, COVERAGES, GENERATED_STATS, IRON_FAMILY, ITEM_POOL, SIM_CONFIG, STAT_CLAMP (+22 more)

### Community 91 - "inventario.js"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 92 - "itemService.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 93 - "items.js"
Cohesion: 0.25
Nodes (7): bot_auth_state, characters, combat_sessions, group_members, groups, inventory, players

### Community 94 - "buff.js"
Cohesion: 0.13
Nodes (18): { createItemDefinition }, define(), IRON_ITEMS, IRON_STATS, itemCatalog, itemCatalog, registry, buildItem() (+10 more)

### Community 95 - "listCharacters"
Cohesion: 0.15
Nodes (23): applyReactionFatigue(), { BASE_ATTACK_RANGE, KITE_FATIGUE_MULTIPLIER }, {
  calcFatigueRecovery,
  calcFatigueCost,
  getFatigueLevel,
  getMovementRange,
}, characterShape(), createDurability(), { executeAttack, executeReaction, chooseAiReaction, getEffectiveWeaponRange }, executeHalfTurn(), fatigueRatio() (+15 more)

### Community 96 - "combatBalance.js"
Cohesion: 0.13
Nodes (14): Deuda Técnica Registrada, TD-001 | Versionado de schema duplicado | resuelto (2026-08-03), TD-002 | Migraciones no aplicables por RPC `exec_sql` inexistente | resuelto (2026-08-03), TD-003 | Esquema conocido desincronizado | resuelto (2026-08-03), TD-004 | `exec_sql` con `security definer` no deseado | abierto, TD-005 | Equipo en contraataques y reacciones no resuelto | abierto, TD-006 | `itemCatalog` inyectable | resuelto parcialmente (2026-08-03), TD-007 | Arma arrojadiza no lanzable en combate real | abierto (+6 more)

### Community 97 - "durabilityPersistenceService.js"
Cohesion: 0.08
Nodes (23): 1. Winrate por personalidad (global, sin control de nivel), 2. Matchup winrate A vs B (parejas con nivel similar), 3.1 Naturaleza de arma, 3.2 Tier del arma, 3.3 Material del arma, 3.4 Rareza del material del arma, 3.5 Cobertura dominante, 3.6 Con munición (arquero) (+15 more)

### Community 101 - "001_create_inventory.sql"
Cohesion: 0.67
Nodes (3): inventory, trg_inventory_updated_at, update_inventory_updated_at()

### Community 102 - "eco_admin_list.js"
Cohesion: 0.16
Nodes (16): buildHpBar(), characterSheet(), { composeMessage }, { equipmentSummaryLines }, formatHpState(), { getItem }, headerLines(), inventorySectionLines() (+8 more)

### Community 103 - "Decisiones Técnicas"
Cohesion: 0.18
Nodes (10): 2026-08-03 — Aplicación de DDL: script SQL manual (no RPC `exec_sql`), 2026-08-03 — Capa de sistema gestor de ítems (infraestructura, sin catálogo), 2026-08-03 � Dummy equipado y equipo en memoria (PvE), 2026-08-03 — Familia del Hierro: puente de catálogo, 2026-08-03 — Fuente única de versión de schema, 2026-08-03 — Integración combate: solo ataque principal (backward-compat), 2026-08-03 — Persistencia de equipamiento: columna `equipped_slots`, 2026-08-03 — UI por secciones reutilizables + registro declarativo de acciones de combate (+2 more)

### Community 104 - "getActiveCharacter"
Cohesion: 0.07
Nodes (46): execute(), { box }, CATEGORY_DISPLAY, execute(), { getOwnerRecords }, { listAdminsForCategory, listAllCategories, getCategoryLabel }, execute(), execute() (+38 more)

### Community 105 - "listCharacters"
Cohesion: 0.09
Nodes (27): { box }, execute(), { formatStelas }, { getOrCreateProfile, getUserProfile }, resolveTarget(), { box }, execute(), { formatCommandUsage } (+19 more)

### Community 106 - "audit_family_generator.js"
Cohesion: 0.16
Nodes (13): { box }, execute(), executeDeletion(), { formatCommandUsage }, { formatError }, { listCharacters, deleteCharacter }, pendingConfirmations, usageMessage (+5 more)

### Community 107 - "003_remediation_item_equipment.sql"
Cohesion: 0.50
Nodes (3): characters, combat_sessions, inventory

### Community 108 - "ModuleBase.js"
Cohesion: 0.14
Nodes (6): ArmorModule, ModuleBase, DamageModule, ModuleBase, ModuleBase, TemporalModule

### Community 109 - "invite.js"
Cohesion: 0.40
Nodes (4): bugreport, commandPath, createReport, servicePath

### Community 110 - "Auditoría profunda — baseline 10k"
Cohesion: 0.08
Nodes (23): 1. Winrate por personalidad (global, sin control de nivel), 2. Matchup winrate A vs B (parejas con nivel similar), 3.1 Naturaleza de arma, 3.2 Tier del arma, 3.3 Material del arma, 3.4 Rareza del material del arma, 3.5 Cobertura dominante, 3.6 Con munición (arquero) (+15 more)

### Community 111 - "deep_audit.js"
Cohesion: 0.14
Nodes (15): args, byPersonality, fmtPct(), fs, log(), mean(), { metrics, config }, optDiff (+7 more)

### Community 112 - "itemStatService.js"
Cohesion: 0.15
Nodes (15): CONTUNDENTE_PERFORANTE_MULT, getSpecialTierMult(), getTierPenaltyBonus(), TIERS, calculateWeaponDamage(), getEffectiveWeaponRange(), getProjectileScale(), ArmorModule (+7 more)

### Community 114 - "dummy_equipment.test.js"
Cohesion: 0.20
Nodes (12): generateDummyCharacter(), buildDummyEquipment(), { getItem }, IRON_DUMMY_LOADOUT, { buildDummyEquipment, IRON_DUMMY_LOADOUT }, CHALLENGER_STATS, { formatCombatStatus, formatCombatOpen }, { generateDummyCharacter } (+4 more)

### Community 115 - "bugreport.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 116 - "002_rename_stats_keys.sql"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 117 - "supabase_auth_state.test.js"
Cohesion: 0.67
Nodes (3): cachedModules, loadAuthState(), mockCommonJsModule()

### Community 118 - "command_format.test.js"
Cohesion: 0.11
Nodes (22): { box }, execute(), { formatCommandUsage }, { formatError }, { getCharacterNames }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter } (+14 more)

### Community 119 - "test_supabase_schema.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 121 - "admin_perm_rem.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 122 - "aggregator.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 123 - "descansar.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 125 - "items.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 126 - "run_experiments.js"
Cohesion: 0.31
Nodes (8): applyOverrides(), fs, main(), MODULES, parseArgs(), path, printUsage(), REPO_ROOT

### Community 127 - "handleCommand"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 128 - "command_handler_error.test.js"
Cohesion: 0.10
Nodes (26): { box }, { formatCommandUsage }, { formatDisplayMention, withMentions }, { getFirstMentionedJid }, { isOwner }, { resolveTargetDisplayName }, { setEconomyAdmin }, usageMessage (+18 more)

### Community 129 - "formatters.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 130 - "Combat Simulation Report"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 131 - "Combat Simulation Report"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 132 - "Combat Simulation Report"
Cohesion: 0.06
Nodes (34): Amulet, Armor material, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report (+26 more)

### Community 133 - "logError"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 134 - "iron_family.test.js"
Cohesion: 0.20
Nodes (9): ARMOR_SETS, getSet(), { ARMOR_SETS, getSet }, { buildItem }, { EQUIPMENT_SLOTS }, { getItem, getItemsByCategory }, { getWeaponStats, getArmorStats }, { IRON_ITEMS, IRON_STATS } (+1 more)

### Community 135 - "schemaValidator.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 136 - "Guía de Creación de Ítems"
Cohesion: 0.15
Nodes (12): 1. Anatomía de un ítem, 2. Fórmulas derivadas (NO inventar números), 3. Naturalezas de daño (`combatEngine.js:288-330`), 4. Cobertura de armadura (`armorSetService.js`), 5. Slots de equipo (spec §4), 6. Set bonus (`armorSets.js`, `armorSetService.js`), 7.1. Resultados del re-baseline con catálogo de hierro (baseline 2000 sims), 7.1a. Re-baseline v2: techo de 20 rounds + HP×3 + cobertura coherente (baseline 2000 sims) (+4 more)

### Community 137 - "columnRegistry.js"
Cohesion: 0.08
Nodes (37): discover(), KNOWN_SCHEMA, { logSystem }, { supabase }, COLUMN_TYPES, createMissingTables(), { CURRENT_VERSION }, DESIRED_SCHEMA (+29 more)

### Community 138 - "composeMessage"
Cohesion: 0.24
Nodes (8): { composeMessage }, { getActiveCharacter }, { getInventoryList }, { box }, composeMessage(), toLines(), { box }, { composeMessage }

### Community 139 - "schedulerService.js"
Cohesion: 0.21
Nodes (9): { box }, { claimDaily }, { DAILY_COOLDOWN_HOURS }, execute(), formatProgressBar(), { formatStelas, formatDuration }, formatStreakLabel(), formatDuration() (+1 more)

### Community 140 - "huir.js"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 141 - "LRUCache"
Cohesion: 0.15
Nodes (11): getBalance(), cache, TTLS, { addMoney, getBalance, transferMoney }, { cache, TTLS }, createContext, { recordGroupActivity }, { recordUserActivity } (+3 more)

### Community 142 - "Combat Simulation Report"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 143 - "Combat Simulation Report"
Cohesion: 0.06
Nodes (31): Amulet, aspd, atk, Average Damage Per Attack, Balance Targets, Block Effectiveness, Combat Simulation Report, Coverage (dominante) (+23 more)

### Community 144 - "characterSections.js"
Cohesion: 0.29
Nodes (8): AERO, BOW_ASPD_BASE, BOW_DAMAGE_MULT, BOW_SPEED_BASE, FATIGUE_SPEED_STATS, FATIGUE_THRESHOLDS, FATIGUE_SPEED_STATS, {
  INITIAL_DISTANCE,
  BASE_ATTACK_RANGE,
  MSPD_TO_METERS,
  ASPD_PENALTY_PER_5M,
  ASPD_PENALTY_DISTANCE_BLOCK,
  PIERCE_ATK_SCALE,
  DISTANCE_REF_BLOCK,
  DISTANCE_REF_BONUS,
  PROJECTILE_FALL_OFF_RATE,
  PROJECTILE_MIN_SCALE,
  BOW_DAMAGE_MULT,
  BOW_SPEED_BASE,
  BOW_ASPD_BASE,
  AERO,
  ATK_RANGE_SCALE,
  FALLOFF_K,
  BOW_RANGE_MIN,
  FATIGUE_BASE_PER_METER,
  FATIGUE_SCALE_PER_5M,
  FATIGUE_DISTANCE_BLOCK,
  MOVEMENT_FATIGUE_MIN,
  KITE_FATIGUE_MULTIPLIER,
}

### Community 145 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 146 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 147 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 148 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 149 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 150 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 151 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 152 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 153 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 154 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 155 - "statusService.js"
Cohesion: 0.33
Nodes (8): addEffect(), { filterExisting }, getActiveEffects(), getCooldowns(), { logError }, saveSlots(), setCooldown(), { supabase }

### Community 156 - "editar_pj.js"
Cohesion: 0.25
Nodes (7): { box }, { formatCommandUsage }, { formatError }, { isAdmin }, { MAX_CHARACTER_NAME_LENGTH }, { renameCharacter, updateCharacterSlots, getActiveCharacter }, usageMessage

### Community 157 - "config.js"
Cohesion: 0.17
Nodes (14): SET_BONUS, fighterSection(), { generateFighter }, { getSpecialTierMult }, main(), materialLine(), { materialName }, { MATERIALS, getMaterialStats } (+6 more)

### Community 158 - "durabilityPersistenceService.js"
Cohesion: 0.36
Nodes (5): { filterExisting }, { invalidateUserCache }, persistDurability(), readMetadata(), { supabase }

### Community 162 - "moduleRegistry.js"
Cohesion: 0.22
Nodes (8): createEntity(), moduleRegistry, ModuleBase, moduleRegistry, registry, { createEntity }, createItem(), { getItem: getRawItem }

### Community 163 - "Maniquí 13: Extremista ATK Yordle (nivel 122)"
Cohesion: 0.50
Nodes (4): execute(), { executeEconomyAction }, { setMoney }, setMoney()

### Community 164 - "Maniquí 15: Gladiador Elfo (nivel 125)"
Cohesion: 0.50
Nodes (3): execute(), { executeEconomyAction }, { removeMoney }

### Community 186 - "Auditoría de datos crudos de la simulación"
Cohesion: 0.10
Nodes (20): 10. Distribución de duración, 11. Coherencia report ↔ raw, 1. Integridad de datos, 2. Sesgo de métricas (daño), 3. Timeouts (draws), 4. Targets con intervalo de confianza 95%, 5. Nivel vs resultado (controles), 6. Contribución de stats mágicas (controlando nivel) (+12 more)

### Community 187 - "groupAdminHelper.js"
Cohesion: 0.14
Nodes (17): execute(), { executeGroupAction }, { removeParticipant }, { demoteFromAdmin }, execute(), { executeGroupAction }, execute(), { executeGroupAction } (+9 more)

### Community 189 - "help.js"
Cohesion: 0.18
Nodes (17): buildAliasStr(), buildOutputHeader(), buildSectionContent(), buildSubcatBlock(), collectUniqueCommands(), { commands }, execute(), getFilteredSectionCmds() (+9 more)

### Community 193 - "createReport"
Cohesion: 0.22
Nodes (9): { box }, { createReport }, execute(), reportCooldowns, createReport(), determineCategory(), determinePriority(), getDailyCount() (+1 more)

### Community 197 - "bugstatus.js"
Cohesion: 0.38
Nodes (6): { box }, execute(), { formatError }, { getReport, getUserReports }, getReport(), getUserReports()

## Knowledge Gaps
- **2062 isolated node(s):** `husky.sh script`, `$schema`, `src/core/bot.js`, `src/commands/**/*.js`, `src/data/**/*.js` (+2057 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `box()` connect `invite.js` to `command_handler_error.test.js`, `characterService.js`, `economyAdminHelper.js`, `box`, `composeMessage`, `schedulerService.js`, `box`, `resolveTargetDisplayName`, `editar_pj.js`, `set_stelas.js`, `dado.js`, `grupo_cerrar.js`, `groupAdminHelper.js`, `item_add.js`, `createReport`, `bugstatus.js`, `statusService.js`, `dado.js`, `characterConfig.js`, `items.js`, `clases.js`, `getActiveCharacter`, `listCharacters`, `audit_family_generator.js`, `command_format.test.js`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `supabase` connect `dar_stelas.js` to `bugReportService.js`, `economyAdminHelper.js`, `crear_pj.js`, `grupo_cerrar.js`, `getActiveCharacter`, `columnRegistry.js`, `inventoryService.js`, `invite.js`, `getUserProfile`, `Plan: Implementacion de Stats Magicas + Correcciones`, `unwarn.js`, `midnight_review.js`, `LRUCache`, `items.js`, `box`, `statusService.js`, `durabilityPersistenceService.js`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `logError()` connect `inventoryService.js` to `bot.js`, `bugReportService.js`, `createReport`, `loggerService.js`, `renombrar_pj.js`, `economyAdminHelper.js`, `crear_pj.js`, `grupo_cerrar.js`, `actividad.js`, `columnRegistry.js`, `midnight_review.js`, `dar_stelas.js`, `box`, `statusService.js`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `src/core/bot.js` to the rest of the system?**
  _2062 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._
- **Should `bugReportService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Should `groupActivityService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._