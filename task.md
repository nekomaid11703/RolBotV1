# RolBotV1 Roadmap Execution Tasks

Status: In Progress

## Phase 1 - Shared Memory Foundation

- [x] Inventory `antigravity_config_asistente`.
- [x] Identify reusable configs, skills, and templates.
- [x] Create project-local agent rules in `.agents/AGENTS.md`.
- [x] Adapt compatible skills under `.agents/skills/`.
- [x] Create canonical memory protocol in `ai-memory/memory_protocol.md`.
- [x] Update design board with roadmap execution tickets.
- [x] Record durable memory entry for this integration.
- [x] Validate NekoMemori MCP after changes.

## Phase 2 - Cross-Agent Coordination

- [x] Ensure active tickets include owner, status, target files, and acceptance criteria.
- [x] Define handoff format for Codex to Antigravity.
- [x] Keep `AI_CHANGELOG.md` aligned with completed work.

## Phase 3 - AI Orchestrator Memory Integration

- [x] Design a small memory context service using existing JSONL/MCP data.
- [x] Integrate memory lookup before AI dispatch without adding new providers.
- [x] Add tests or dry-run validation for memory lookup.

## Phase 4 - Supabase Schema And Security

- [x] Audit runtime Supabase table usage.
- [x] Add missing `bot_auth_state` table to the migration source.
- [x] Replace permissive anon/authenticated grants in migration source with service-role-only policies.
- [x] Add read-only schema validation test for required tables.
- [x] Validate current remote schema access for bot tables.

## Phase 5 - Automatic Token-Saving Delegation

- [x] Define delegation policy for when external agents are worth using.
- [x] Prioritize providers by quality and free-tier value.
- [x] Keep small or low-value tasks local to Codex/Antigravity.
- [x] Add automatic workflow API for planning, delegation, assembly, and optional persistence.
- [x] Add a highest-quality quality gate before final assembly.
- [x] Validate delegation and local fallback with no-network dummy providers.

## Phase 6 - Command UX Consistency And Pause Resilience

- [x] Add shared message formatting helpers for usage, examples, forms, feedback, and errors.
- [x] Normalize commands that require user input across economy, permissions, characters, and utilities.
- [x] Test empty-command responses that show examples to users.
- [x] Harden delegated workflows so quota/token exhaustion returns structured fallback instead of throwing.
- [x] Validate continuation after a Codex pause without losing partial work.

## Phase 7 - Prompt Cache And Context Compaction

- [x] Create `promptCacheService.js` with LRU cache, TTL, key generation, and stats.
- [x] Create `contextCompactor.js` with token estimation, smart trimming, and classification minification.
- [x] Integrate cache into `aiOrchestrator.generateText()` — check cache before provider call, bypass if temperature > 0.7.
- [x] Integrate cache into `aiOrchestrator.classifyText()` — cache classification results with 1h TTL.
- [x] Add memory context compaction via `compactMemoryEntries()` in `memoryContextService.js`.
- [x] Add 30s cache for memory retrieval to avoid redundant JSONL reads.
- [x] Cache `_inferTaskType` results in `aiDispatcher.js`.
- [x] Add `CACHE_POLICY` and `COMPACTION_POLICY` to `aiConfig.js`.
- [x] Write `tests/test_prompt_cache.js` (22 tests, all pass).
- [x] Write `tests/test_context_compactor.js` (21 tests, all pass).
- [x] Verify no regressions in existing tests (command_usage_format, memory_context, crear_pj).

## Phase 8 - Supabase Bug Fixes, Race Conditions & Cache Integration

- [x] Fix race condition en `transferMoney` — transacción atómica con rollback compensatorio en `economyService.js`.
- [x] Fix race condition en `createCharacter` — elimina count check, usa UNIQUE constraint (código 23505) en `characterService.js`.
- [x] Fix transacción incompleta en `setActiveCharacter` — dos updates atómicos con validación en `characterService.js`.
- [x] Fix `saveGroupActivity` null check — lanza error si upsert falla en `groupActivityService.js`.
- [x] Crear `safeQuery.js` con `safeSingle`, `safeSingleOrNull`, `safeMaybeSingle` — aplicado a userService, characterService, groupActivityService, economyService.
- [x] Integrar cache LRU+TTL en 10+ funciones: `getUserProfile`, `listUserProfiles`, `getTopBalances`, `getTopActiveUsers`, `getGroupActivity`, `getTopGroupMembers`, `listCharacters`, `getCharacter`, `getActiveCharacter`, `getCharacterBySlug`.
- [x] Invalidación automática de cache en writes: `saveUserProfile`, `saveGroupActivity`, `createCharacter`, `updateCharacterStats`, `editCharacter`, `deleteCharacter`, `setActiveCharacter`, `claimDaily`, `transferMoney`, `addMoney`, `removeMoney`, `setMoney`.
- [x] Validación `targetId` existe en `dar_stelas` antes de transferir.
- [x] Tests: `test_prompt_cache.js` (22/22), `test_context_compactor.js` (21/21), `test_crear_pj.js` (3/3), `command_usage_format`, `memory_context`, `token_saving_delegation` — todos verdes sin regresión.

## Phase 10 - Bug Report Multi-Agent System

- [x] Crear `src/services/bugReportService.js` con CRUD + AI classification + spam detection + límites por rol.
- [x] Crear `src/commands/utilidades/bugreport.js` con soporte de imágenes y notificación DM.
- [x] Crear `src/commands/utilidades/bugstatus.js` para consultar estado de reportes.
- [x] Crear `src/services/schedulerService.js` con timer interno para midnight review.
- [x] Crear `scripts/process_bugs.js` CLI para opencode.
- [x] Crear `scripts/midnight_review.js` con auto-review y marcado stale.
- [x] Crear `.opencode/skills/bug-fixer/SKILL.md` para workflow opencode.
- [x] Modificar `bot.js`: startup notification de bugs resueltos + midnight scheduler.
- [x] Actualizar memoria, design_board, AI_CHANGELOG, task.md.

## Phase 9 - Supabase Source of Truth & Sync Infrastructure

- [x] Auditar datos locales vs Supabase — 30 players, 1 char, 6 groups, 43 members, 284 auth en Supabase. Cero datos transaccionales en local (solo JSONL de memoria IA).
- [x] Crear `src/services/syncService.js` con `verifySync()`, `forceSync()`, `clearServiceCaches()`, `fetchAllFromSupabase()`.
- [x] Crear `scripts/force_sync.js` — CLI tool con `--verify-only` para verificar sin limpiar cache.
- [x] Añadir `bypassCache` option a TODAS las funciones de lectura: `getUserProfile`, `listUserProfiles`, `getTopBalances`, `getTopActiveUsers`, `getGroupActivity`, `getTopGroupMembers`, `listCharacters`, `getCharacter`, `getActiveCharacter`, `getCharacterBySlug`.
- [x] Añadir `cachedRead()` helper genérico en `safeQuery.js` con soporte `bypassCache`.
- [x] Añadir `invalidateAllCache()` en `safeQuery.js`.
- [x] Limpiar cache al inicio del bot (`bot.js` startup) — garantiza datos frescos desde Supabase en cada reinicio.
- [x] Verificar que TODAS las escrituras van a Supabase primero (ninguna a local): auditados `saveUserProfile`, `saveGroupActivity`, `addMoney`, `removeMoney`, `setMoney`, `transferMoney`, `createCharacter`, `updateCharacterStats`, `editCharacter`, `deleteCharacter`, `setActiveCharacter`, `recordUserActivity`, `ensureUserProfile` — todas escriben a Supabase directo.
- [x] Tests: `test_prompt_cache.js` (22/22), `test_context_compactor.js` (21/21), `test_crear_pj.js` (3/3), `command_usage_format`, `memory_context`, `token_saving_delegation` — todos verdes sin regresión.
- [x] Memoria persistente, design_board, task.md, AI_CHANGELOG actualizados.

## Phase 11 — Sistema de Combate RPG

*Status: En progreso (motor base + narrador + lore listos)*

### Completado:
- [x] `src/services/rpg/enemies.js` — 8 enemigos (Slime a Troll) con stats, nivel y recompensas
- [x] `src/services/rpg/combatEngine.js` — Motor de combate por turnos: inicio, ataque, defensa, huida
- [x] Cálculo de daño basado en stats (fuerza, defensa, agilidad, inteligencia→magia, suerte→percepción)
- [x] Sistema de turnos: jugador ataca → enemigo contraataca
- [x] Enemigos/NPCs básicos con drops de estelas y XP
- [x] Sistema de defensa (-60% daño recibido)
- [x] Sistema de huida con probabilidad (agilidad vs nivel enemigo)
- [x] Notificaciones formateadas con barras de HP visuales
- [x] Comandos: `/atacar` (inicia combate o ataca), `/defender`, `/huir`
- [x] Comando `/habilidad` — muestra habilidades del personaje
- [x] Persistencia de XP: `updateCharacterStats` actualiza `exp` en Supabase tras victoria
- [x] Integración con economía: `addMoney` otorga stelas al derrotar enemigos
- [x] 40 comandos totales·84 aliases cargados sin errores
- [x] Test de integración: combate, ataque, defensa, huida verificados

### Pendiente:
- [ ] Habilidades especiales con efecto en combate
- [ ] Combate PvP entre jugadores
- [ ] Más enemigos por zona/región
- [ ] Sistema de loot con objetos equipables
- [ ] Integrar combatNarrator en los comandos de combate (cuando combatEngine entregue el formato que espera el narrador)

### Dependencias:
- src/services/rpg/ (dataLoader, statCalculator, ruleEngine) — ✅ Listo
- src/services/characterService.js — ✅ Listo
- src/services/economyService.js — ✅ Listo
- src/utils/messageFormatUtils.js — ✅ Listo

---

## Phase 12 - Mazmorras y Eventos

*Status: Pendiente*

**Objetivo:** Añadir contenido PvE estructurado con mazmorras generadas, oleadas de enemigos, loot y progresión.

### Features planificadas:

- [ ] Comandos: `/mazmorra`, `/explorar`, `/descansar`
- [ ] Generación procedural de encuentros
- [ ] Sistema de loot con rarezas
- [ ] Inventario de objetos equipables
- [ ] Progresión: XP → niveles → nuevas habilidades
- [ ] Eventos aleatorios durante exploración (cofres, trampas, NPCs amigables)
- [ ] Persistencia de estado de mazmorra en Supabase

---

## Phase 13 - Integración de IA Narrativa

*Status: Pendiente*

**Objetivo:** Usar el orquestador de IA para generar descripciones de escenas, diálogos de NPCs y narrativa contextual en combates y mazmorras.

### Features planificadas:

- [ ] Comando `/escena` — IA genera descripción inmersiva
- [ ] Diálogos dinámicos de NPCs vía orquestador
- [ ] Narrativa contextual en combate (descripción de ataques)
- [ ] Cache de clasificación de intenciones RPG
- [ ] Moderación de contenido generado por IA

---

## Phase 1a — Infraestructura de Narración y Lore Mundial

*Status: Completado*

- [x] `src/services/rpg/worldLore.js` — Carga de lore desde `ai-memory/world-lore/*.md`, cache por TTL, filtrado por keyword
- [x] `ai-memory/world-lore/00_global.md` — Lore global editable (historia, geografía, cosmología)
- [x] `ai-memory/world-lore/01_regions.md` — Lore por regiones editables
- [x] `ai-memory/world-lore/02_zones.md` — Lore por zonas específicas (mazmorras, ciudades)
- [x] `src/services/rpg/sceneCache.js` — Cache de escenario por ubicación con TTL
- [x] `src/services/ai/providers/deepseekProvider.js` — Adaptador DeepSeek v4 Flash Free para el orquestador
- [x] `src/services/rpg/narrativePrompts/combat.system.md` — System prompt del narrador (editable sin tocar código)
- [x] `src/services/rpg/narrativePrompts/combat.templates.js` — ~15 plantillas literales de respaldo (ataque, fallo, crítico, defensa, huida, KO, fatiga, entorno)
- [x] `src/services/rpg/combatNarrator.js` — Generador narrativo: prompt builder, detección de tono, fallback template, cache de escenario
- [x] Prioridad de proveedores: `deepseek → gemini → openrouter → ollama`
- [x] `DEEPSEEK_API_KEY` añadido a `.env.example`
- [x] `aiConfig.js` actualizado: providers `deepseek`, prioridad `narration`, concurrencia, models

---

## Pending External Requirements

- [ ] GitHub MCP requires Docker or Go plus a real GitHub token.
- [ ] RAG/vector search requires an explicit future decision and supporting infrastructure.

## Notes

- Root `.agents` is read-only in the current sandbox, so integration is local to
  `RolBotV1/.agents`.
- No credentials, providers, endpoints, or external services were invented.
- `supabase_migration.sql` was updated as source-of-truth only; no destructive
  SQL was applied to the remote database from this run.
