# Registro de Cambios (AI Changelog)

## [2026-06-24] - Infraestructura Narrador + Lore Mundial + DeepSeek Provider
**Rama:** `AI_rolbot`

- **Lore mundial:** `worldLore.js` carga automáticamente archivos `.md` desde `ai-memory/world-lore/`. Sistema jerárquico: global → regiones → zonas. Cacheable con TTL 1h. Filtrable por keyword.
- **Scene Cache:** `sceneCache.js` cachea descripciones de escenario por ubicación (TTL 30min). Permite reutilizar contexto narrativo en múltiples encuentros del mismo lugar.
- **DeepSeek Provider:** `deepseekProvider.js` adaptador nativo para DeepSeek v4 Flash Free API. Registrado como proveedor primario de narración en el orquestador. Fallback: orquestador → templates.
- **Narrador de combate:** `combatNarrator.js` recibe resultados estructurados del motor y genera narrativa vía IA o templates. Incluye: builder de prompt con contexto de mundo + escenario, detección de tono (ágil/épico según contexto), fallback a 15 plantillas literales.
- **Prompts editables:** `narrativePrompts/combat.system.md` como archivo markdown independiente. Editable sin tocar código.
- **Config:** `aiConfig.js` actualizado con `deepseek` en prioridades, capacidades y concurrencia. `DEEPSEEK_API_KEY` en `.env.example`.
- **Validación:** 8 módulos nuevos cargan sin errores. Narrator tests: prompt builder, tone detection, templates, world lore OK.

## [2026-06-24] - Phase 11: Sistema de Combate RPG (PvE)
**Rama:** `AI_rolbot`

- **Nuevos archivos:**
  - `src/services/rpg/enemies.js` — 8 enemigos (Slime, Goblin, Lobo, Bandido, Esqueleto, Sombra, Orco, Troll) con stats, nivel, recompensas.
  - `src/services/rpg/combatEngine.js` — Motor de combate por turnos: `startCombat`, `processAttack`, `processDefend`, `processFlee`. Turnos: jugador ataca → enemigo contraataca. Cálculo de daño con statCalculator, chance de golpe con agilidad/percepción, chance de crítico (10%), defensa reduce daño 60%, huida con probabilidad basada en agilidad y nivel enemigo. Estado de combate en memoria (Map).
  - `src/commands/rpg/atacar.js` — Inicia combate PvE (`/atacar slime`) o ataca en combate activo. Muestra lista de enemigos si no se especifica target.
  - `src/commands/rpg/defender.js` — Postura defensiva, reduce daño recibido.
  - `src/commands/rpg/huir.js` — Intenta escapar del combate.
  - `src/commands/rpg/habilidad.js` — Muestra habilidades del personaje activo.
- **Integración:**
  - Victoria: `addMoney()` otorga stelas aleatorias, `updateCharacterStats` actualiza `exp` en Supabase.
  - Derrota: combate termina, personaje no pierde recursos.
  - Sistema de niveles calculado desde `exp` usando fórmula RPG_CONFIG.
- **Validación:** 40 comandos cargan sin errores (84 aliases). Test de integración verifica ataque, defensa y huida.

## [2026-06-24] - Purga General y Preparación para Phase 11-13 RPG
**Rama:** `AI_rolbot`

- **Auditoría completa:** AI_CHANGELOG, NekoMemori (29 entries OK), /bugreport (todo en Supabase, OK), skills (todas dentro del proyecto), archivos de plan (implementation_plan.md, task.md, design_board.md).
- **Eliminado:** `src/database/auth/` (~80 archivos legacy de sesión Baileys), `src/database/grupos/` (5 grupos legacy), `src/database/personajes/` (21 jugadores legacy) — todos migrados a Supabase previamente.
- **Actualizado:** `.gitignore` (bugs/, comentarios), `README.md` (servicios actuales + tabla de comandos), `implementation_plan.md` (marcado como histórico con banner ⚠️), `task.md` (Phase 11-13 añadidos).
- **Phase 11:** Sistema de Combate RPG planificado (PvP/PvE, turnos, stats, recompensas).
- **Phase 12:** Mazmorras y Eventos (exploración procedural, loot, progresión).
- **Phase 13:** Integración de IA Narrativa (escenas, diálogos, narrativa contextual).
- **Validación:** 36 comandos cargan, sistema RPG intacto, dependencias npm ok, require() paths resuelven.

## [2026-06-24] - Separación Personalidad NekoMaid: Sistema vs Social
**Rama:** `AI_rolbot`

- **Problema:** `nekomaidVoice.injectPersonality()` se aplicaba automáticamente a TODO texto enviado por el bot mediante un heurístico frágil (detección de caracteres de recuadro/longitud/emojis), alterando mensajes de combate, estadísticas, inventario y sistema RPG que no usaran esos marcadores.
- **Cambio en API core:**
  - `ctx.reply(text, options)` — modo **limpio por defecto**. Solo aplica personalidad si `options.vibe` está presente.
  - `ctx.social(text, options)` — nuevo método que **siempre aplica personalidad** NekoMaid (vibe por defecto: `'neutral'`).
  - Eliminado el heurístico automático de `context.js` que inyectaba personalidad basado en patrones de contenido.
- **Migración:** ~60 llamadas `ctx.reply()` en mensajes sociales (usage, errores, feedback, help, saludos) migradas a `ctx.social()` en 28 archivos de comandos. Las ~34 llamadas de sistema (economía, stats, personajes, actividad) no requirieron cambios.
- **Archivos modificados:**
  - `src/core/context.js` — `reply()` limpio, añadido `social()`
  - `src/services/rpg/nekomaidVoice.js` — ajustado `say()` para nuevo API
  - 28 archivos de comandos en `src/commands/` — `ctx.reply()` social → `ctx.social()`
- **Memoria:** `mem-1782342561757`

## [2026-06-24] - Phase G: Bug Report Multi-Agent System
**Rama:** `AI_rolbot`

- **Añadido:**
  - `src/services/bugReportService.js`: CRUD completo con AI classification via `classifyIntent`, spam detection, auto-priority por keywords, límite diario por rol (owner=∞, admin=5, user=3), guardado de imágenes locales en `bugs/media/`, notificación DM al owner para bugs ≥ high.
  - `src/services/schedulerService.js`: Timer interno con `setTimeout` que calcula ms hasta próxima medianoche y ejecuta `midnightReview`.
  - `src/commands/utilidades/bugreport.js`: `/bugreport <descripción> [+imagen]` — comando que valida con IA, aplica límite diario, guarda media, reporta al owner por DM si critical/high.
  - `src/commands/utilidades/bugstatus.js`: `/bugstatus [id]` — lista tus reportes o muestra detalle.
  - `scripts/process_bugs.js`: CLI para opencode: `--list`, `--view <id>`, `--resolve <id> --summary <fix> --commit <hash>`, `--stats`.
  - `scripts/midnight_review.js`: Revisión automática de bugs abiertos, marca stale >7 días, notifica owner DM con resumen.
  - `.opencode/skills/bug-fixer/SKILL.md`: Skill que enseña a opencode a procesar, examinar y resolver bugs.

- **Modificado:**
  - `bot.js`: Al conectar, notifica al owner bugs resueltos en los últimos 7 días. Inicia `startMidnightReview(sock)` para scheduler interno.
  - `bugReportService.js`: `getResolvedSince(timestamp)` añadido para startup notification.

- **Almacenamiento:**
  - Bugs en `bot_auth_state` (session_id='bug_report'), imágenes en `bugs/media/{id}.{ext}`.

- **Validado:**
  - Todos los imports resuelven correctamente.
  - `downloadMediaMessage` accesible desde Baileys.
  - `crypto.randomUUID()` disponible (Node v24).

## [2026-06-24] - Phase F: Supabase Source of Truth & Sync Infrastructure
**Rama:** `AI_rolbot`

- **Añadido:**
  - `src/services/syncService.js`: `verifySync()`, `forceSync()`, `clearServiceCaches()`, `fetchAllFromSupabase()` — núcleo de sincronización que asegura Supabase como fuente de verdad.
  - `scripts/force_sync.js`: CLI tool con `--verify-only` para verificar sin limpiar cache. Uso: `node scripts/force_sync.js [--verify-only]`.
  - `cachedRead({ key, fetch, ttl, bypassCache })` helper genérico en `safeQuery.js` con soporte `bypassCache`.
  - `invalidateAllCache()` en `safeQuery.js` — limpia todo el cache LRU en memoria.

- **Modificado:**
  - `bot.js`: Al iniciar, limpia cache con `invalidateAllCache()` para garantizar datos frescos desde Supabase en cada reinicio.
  - `userService.js`: `getUserProfile`, `listUserProfiles`, `getTopActiveUsers` aceptan `{ bypassCache }` para forzar lectura desde Supabase.
  - `economyService.js`: `getTopBalances` acepta `bypassCache`.
  - `characterService.js`: `getCharacter`, `listCharacters`, `getActiveCharacter`, `getCharacterBySlug` aceptan `{ bypassCache }`.
  - `groupActivityService.js`: `getGroupActivity`, `getTopGroupMembers` aceptan `bypassCache`.

- **Auditado:**
  - Supabase: 30 players, 1 character, 6 groups, 43 group_members, 284 bot_auth_state registros.
  - Local: 0 archivos persistentes con datos transaccionales. Solo `rolbot-memory.jsonl` (24 entradas de metadata IA) y `design_board.md`.
  - Todas las escrituras van directamente a Supabase: `saveUserProfile`, `saveGroupActivity`, `addMoney`, `removeMoney`, `setMoney`, `transferMoney`, `createCharacter`, `updateCharacterStats`, `editCharacter`, `deleteCharacter`, `setActiveCharacter`, `recordUserActivity`, `ensureUserProfile` — ninguna escribe a local primero.

- **Validado:**
  - `node scripts/force_sync.js --verify-only` (30/1/6/43/284 registros OK)
  - `node scripts/force_sync.js` (cache limpiado, sync completado)
  - Tests: 22/22 prompt_cache, 21/21 context_compactor, 3/3 crear_pj, command_usage_format, memory_context, token_saving_delegation — todos verdes

## [2026-06-24] - Fase E: Bug Fixes Críticos Supabase, Race Conditions & Cache Integration
**Rama:** `AI_rolbot`

- **Corregido (Race Conditions & Transacciones):**
  - `economyService.transferMoney()`: Ahora atómico con rollback compensatorio si falla el segundo update. Invalidación de cache `invalidateUserCache` + `invalidateTopBalancesCache`.
  - `characterService.createCharacter()`: Elimina count check + existence check previos; confía en UNIQUE constraint `(player_phone, slug)` y atrapa código 23505. Cache invalidado.
  - `characterService.setActiveCharacter()`: Dos updates atómicos (desactivar otros + activar uno) con validación de errores. Invalida cache de usuario.
  - `groupActivityService.saveGroupActivity()`: Lanza error si upsert de grupo falla, valida cada upsert de miembro. Invalida cache de grupo.

- **Seguridad en Queries (Null Checks):**
  - Nuevo `src/utils/safeQuery.js`: `safeSingle`, `safeSingleOrNull`, `safeMaybeSingle` — wrappers tipados para `.single()`/`.maybeSingle()` que lanzan en error real o retornan `null` en PGRST116.
  - Aplicado en: `userService.getUserProfile` (con cache LRU 30s), `characterService` (getCharacter, getActiveCharacter, getCharacterBySlug, updateCharacterStats, editCharacter, deleteCharacter), `groupActivityService` (getGroupActivity), `economyService` (getTopBalances).

- **Cache LRU + TTL Integrado (Phase D follow-up):**
  - Cache en 10+ funciones: `getUserProfile`, `listUserProfiles`, `getTopBalances`, `getTopActiveUsers`, `getGroupActivity`, `getTopGroupMembers`, `listCharacters`, `getCharacter`, `getActiveCharacter`, `getCharacterBySlug`.
  - TTLs: user/profile 30s, tops 30-60s, memory context 30s, classification 1h.
  - Invalidación automática en TODOS los writes: `saveUserProfile`, `saveGroupActivity`, `createCharacter`, `updateCharacterStats`, `editCharacter`, `deleteCharacter`, `setActiveCharacter`, `claimDaily`, `transferMoney`, `addMoney`, `removeMoney`, `setMoney`.

- **Validación Adicional:**
  - `dar_stelas`: Verifica `getUserProfile(targetId)` antes de transferir → error claro si usuario no existe.

- **Tests (Sin Regresión):**
  - `test_prompt_cache.js`: 22/22 ✅
  - `test_context_compactor.js`: 21/21 ✅
  - `test_crear_pj.js`: 3/3 ✅
  - `test_command_usage_format.js` ✅
  - `test_memory_context.js` ✅
  - `test_token_saving_delegation.js` ✅

- **Archivos Creados/Modificados:**
  - Creados: `src/utils/safeQuery.js`, `src/services/ai/promptCacheService.js`, `src/services/ai/contextCompactor.js`, `tests/test_prompt_cache.js`, `tests/test_context_compactor.js`
  - Modificados: `economyService.js`, `characterService.js`, `groupActivityService.js`, `userService.js`, `aiOrchestrator.js`, `aiDispatcher.js`, `memoryContextService.js`, `aiConfig.js`, `dar_stelas.js`, `task.md`, `design_board.md`

## [2026-06-24] - Fase D: Prompt Cache y Context Compaction
**Rama:** `AI_rolbot`

- **Añadido:**
  - `src/services/ai/promptCacheService.js`: LRU cache con TTL por tipo, `generateCacheKey()`, `classificationCacheKey()`, `memoryCacheKey()`, `invalidate(predicate)` y `stats()`.
  - `src/services/ai/contextCompactor.js`: `estimateTokens()`, `stripExcessWhitespace()`, `truncatePreservingHeadTail()`, `compactMemoryEntries()`, `minifyClassificationPrompt()`, `compactPrompt()` con token budget.
  - `tests/test_prompt_cache.js`: 22 pruebas de cache (set/get, LRU eviction, TTL, stats, key consistency, invalidate).
  - `tests/test_context_compactor.js`: 21 pruebas de compactación (token estimation, whitespace, head/tail truncation, memory compaction, classification minification, prompt budget).
- **Modificado:**
  - `aiOrchestrator.js`: `generateText()` verifica cache antes de llamar al provider, bypass si temperatura > 0.7. `classifyText()` cachea resultados con TTL de 1h, prompt de clasificación minificado.
  - `memoryContextService.js`: `retrieveMemoryContext()` usa `compactMemoryEntries()` para priorizar entradas por score dentro de un token budget, cachea resultado por 30s.
  - `aiDispatcher.js`: `_inferTaskType()` cachea resultados de clasificación con TTL de clasificación.
  - `aiConfig.js`: Nuevas políticas `CACHE_POLICY` y `COMPACTION_POLICY`.
  - `task.md`: Phase 7 añadida con todos los items marcados como completados.
- **Validado:**
  - `node tests/test_prompt_cache.js` (22/22)
  - `node tests/test_context_compactor.js` (21/21)
  - `node tests/test_command_usage_format.js` (sin regresión)
  - `node tests/test_memory_context.js` (sin regresión)
  - `node tests/test_crear_pj.js` (sin regresión)

## [2026-06-24] - Push de Rama AI_rolbot y Registro de Estado
**Rama:** `AI_rolbot`

- **Añadido:**
  - Rama `AI_rolbot` creada desde `AI_bot` y pusheada a `origin`.
  - Memoria persistente registrada con handoff para fases siguientes.
- **Validado:**
  - `git push origin AI_rolbot` exitoso.

## [2026-06-24] - Fase B/C: GitHub MCP Conectado (Opción C)
**Rama:** `AI_rolbot`

- **Añadido:**
  - `opencode.json`: Configuración de MCPs nekomemori (local) y github (remote streamable-http) para el workspace.
  - Variable `GITHUB_PERSONAL_ACCESS_TOKEN` en `.env` (gitignored) con PAT de nekomaid11703.
  - Memoria `mem-1750000000001` registrando la conexión.
- **Validado:**
  - `initialize` handshake HTTP 200 OK, `serverInfo: github-mcp-server/remote-...`.
  - Token válido para usuario `nekomaid11703` via GitHub API (`GET /user`).

## [2026-06-24] - Fase A: Preparación del Entorno
**Rama:** `AI_rolbot`

- **Corregido:**
  - Directorio `.git` corrupto en raíz del proyecto eliminado (el repositorio real está en `RolBotV1/`).
  - `Set-ExecutionPolicy RemoteSigned` habilitado para permitir npm.
- **Validado:**
  - NekoMemori MCP v2.0.0: handshake MCP + `tools/list` devuelve 7 herramientas operativas.
  - Supabase: `node test_supa.js` — conexión exitosa, tabla `bot_auth_state` accesible.

## [2026-06-23] - Revision Estetica Profunda de Comandos y Fallback de Pausa
**Rama:** `AI_bot`

- **Añadido:**
  - `src/utils/messageFormatUtils.js`: helper compartido para tarjetas de uso, formularios, feedback y errores.
  - `tests/test_command_usage_format.js`: prueba que ejecuta comandos sin argumentos y valida que devuelvan uso/plantilla con ejemplo.
- **Modificado:**
  - Comandos con entrada obligatoria en economia, permisos, personajes y utilidades ahora usan un formato coherente de `Uso`, `Ejemplo`, notas y errores.
  - `/crear_pj` y `/edit_pj_desc` usan plantillas modernas con ejemplo completo.
  - `/switch_pj` corrige el ejemplo visible de `/swich_pj` a `/switch_pj`.
  - `tokenSavingDelegationManager.js` ahora devuelve fallback estructurado si fallan dispatch, quality gate o ensamblaje por cuota/tokens, evitando romper el flujo.
- **Validado:**
  - `node tests/test_command_usage_format.js`
  - `node tests/test_token_saving_delegation.js`
  - `node tests/test_memory_context.js`
  - `node tests/test_crear_pj.js`
  - La tarea continuo correctamente despues de una pausa por agotamiento de tokens en Codex.

## [2026-06-23] - Plan Automatico de Ahorro de Tokens Multi-Agente
**Rama:** `AI_bot`

- **Añadido:**
  - `src/services/ai/tokenSavingDelegationManager.js`: gestor automatico que decide si conviene delegar una tarea a agentes externos o mantenerla en Codex/Antigravity cuando el ahorro/calidad no compensa.
  - Politica `TOKEN_SAVING_POLICY` y matriz `PROVIDER_CAPABILITIES` en `aiConfig.js` para priorizar calidad y gratuidad por proveedor.
  - Perfiles `qualityGate` y `assembleResults` para revision final de maxima calidad y ensamblaje coherente.
  - Metodos `planTokenSavingDelegation()` y `runTokenSavingWorkflow()` en `aiOrchestrator.js` y `aiService.js`.
  - `tests/test_token_saving_delegation.js`: valida delegacion automatica, ruta local para tareas pequenas, priorizacion de proveedores gratuitos y quality gate con proveedor de mayor calidad.
- **Modificado:**
  - `aiDispatcher.js`: preserva `useMemory` y `memoryTags` al preparar tareas para el WorkerPool.
- **Validado:**
  - `node tests/test_token_saving_delegation.js`
  - `node tests/test_memory_context.js`
  - `node tests/test_ai_orchestrator.js`
  - `node tests/test_crear_pj.js`

## [2026-06-23] - Supabase Schema Hardening
**Rama:** `AI_bot`

- **Modificado:**
  - `supabase_migration.sql`: reescrito como fuente de esquema backend-only. Ahora incluye la tabla `bot_auth_state`, habilita RLS para todas las tablas del bot, elimina politicas legacy permisivas y limita privilegios esperados a `service_role`.
- **Anadido:**
  - `tests/test_supabase_schema.js`: prueba de lectura no destructiva que valida acceso a `bot_auth_state`, `players`, `groups`, `group_members` y `characters`.
- **Validado:**
  - `node test_supa.js`
  - `node tests/test_supabase_schema.js` con acceso de red habilitado.
- **Nota:**
  - No se aplico SQL destructivo contra la base remota durante esta ejecucion. El archivo de migracion queda como fuente corregida para aplicar manualmente o mediante proceso controlado.

## [2026-06-23] - Memoria Compartida Codex/Antigravity y Contexto IA
**Rama:** `AI_bot`

- **Anadido:**
  - `.agents/AGENTS.md`: reglas locales para agentes del workspace RolBotV1.
  - `.agents/skills/*`: skills locales adaptadas desde `antigravity_config_asistente` para memoria compartida, planificacion, investigacion y auditoria/calidad.
  - `ai-memory/memory_protocol.md`: protocolo canonico para memoria persistente compartida, board, handoffs y control de fragmentacion.
  - `task.md`: checklist vivo de ejecucion del roadmap.
  - `src/services/ai/memoryContextService.js`: recuperacion ligera de contexto desde `rolbot-memory.jsonl` y `design_board.md`, sin RAG ni dependencias nuevas.
  - `tests/test_memory_context.js`: prueba local del servicio de contexto.
- **Modificado:**
  - `mcp_nekomemori/tools/memory.js`: `record_memory` acepta tipos canonicos extendidos (`bug`, `fix`, `risk`, `validation`, `handoff`, `pending`) y metadatos (`sourceAgent`, `relatedFiles`, `status`, `supersedes`), manteniendo tipos legacy.
  - `src/services/ai/aiOrchestrator.js`: `generateText` soporta contexto compartido compacto con `useMemory: true`; por defecto permanece limpio para evitar filtrar memoria interna en respuestas de juego.
  - `src/services/ai/aiWorkerPool.js`: las tareas de agentes activan memoria compartida salvo que indiquen `useMemory: false`.
  - `ai-memory/design_board.md`: tickets 006 y 007 cerrados con evidencias.
- **Validado:**
  - `node tests/test_memory_context.js`
  - `node tests/test_crear_pj.js`
  - Dry-run del orquestador con proveedor dummy confirmando prompts con memoria (`useMemory: true`) y prompts limpios por defecto.
  - NekoMemori MCP lista herramientas y registra memoria extendida.

## [2026-06-23] - Sistema Multi-Agente Jerárquico (Plan de Ahorro Antigravity)
**Rama:** `AI_bot`

- **Añadido:**
  - `src/services/ai/aiDispatcher.js`: Clasificador automático de tareas. Infiere el tipo y tier de complejidad de cada subtarea (HARD/MEDIUM/EASY/TRIVIAL) usando la IA, y asigna el modelo y proveedor óptimos según jerarquía.
  - `src/services/ai/aiWorkerPool.js`: Pool de trabajadores asincrónicos. Implementa un semáforo de concurrencia por proveedor (máx 3 para Gemini, máx 5 para OpenRouter), ejecución paralela con `Promise.all`, ejecución secuencial con encadenamiento opcional, reintentos con backoff exponencial y generador de reportes.
  - `tests/test_multiagent.js`: Prueba de integración del sistema completo: 3 subtareas en paralelo, auto-clasificación y ensamblaje por Antigravity.
- **Modificado:**
  - `src/services/ai/aiConfig.js`: Añadidos `MODEL_TIERS`, `TASK_PROFILES` (11 perfiles con instrucciones de sistema especializadas), `CONCURRENCY_LIMITS` por proveedor y `AUTO_CLASSIFY_LABELS`.
  - `src/services/ai/aiOrchestrator.js`: Integrado con Dispatcher y WorkerPool. Nuevo método `dispatchTasks([...])` para despachar N subtareas en paralelo y `autoDispatchSingle()` para tareas de descripción libre.
- **Decisión técnica:** Antigravity actúa como "Director Técnico": fragmenta tareas, despacha a modelos externos, ensambla y aplica los resultados. El modo automático usa OpenRouter (gratuito) para clasificar tareas, ahorrando cuota de Gemini para las generaciones de contenido.

## [2026-06-23] - Pruebas de Integración del Orquestador de IA + Fixes de Config
**Rama:** `AI_bot`

- **Verificado:**
  - ✅ `gemini-2.5-flash` responde correctamente. Se confirmó que la API key de Gemini (AI Studio) es válida con acceso a 37 modelos incluyendo Gemini 2.5, 3.x y Gemma.
  - ✅ `openrouter/auto` responde correctamente. El router automático de modelos gratuitos de OpenRouter funciona sin necesidad de especificar un modelo fijo.
  - ✅ Mecanismo de fallback interno del orquestador probado: conmuta automáticamente entre proveedores cuando uno falla.
- **Corregido:**
  - `geminiProvider.js`: Añadido fallback interno entre modelos Gemini (`gemini-2.5-flash` → `gemini-2.0-flash` → etc.) para manejar errores 503 (sobrecarga temporal) y 404 (modelo no disponible).
  - `aiConfig.js`: Modelos Gemini actualizados de la serie 1.5 (deprecada) a `gemini-2.5-flash` / `gemini-2.0-flash`. Modelo OpenRouter cambiado a `openrouter/auto` (router automático de modelos gratuitos). OpenRouter añadido a la lista de fallbacks de clasificación.

## [2026-06-23] - MCP NekoMemori v2.0.0 — Modularización y Nuevas Herramientas
**Rama:** `AI_bot`

- **Añadido:**
  - Estructura modular para el servidor MCP: `tools/memory.js`, `tools/board.js`, `utils/fileUtils.js`.
  - 5 herramientas de memoria: `record_memory` (reemplaza `record_decision`), `read_memory` (mejorado con filtro por tipo y orden), `search_memory` (búsqueda por keyword), `delete_memory` (eliminar entradas por ID), `get_memory_stats` (estadísticas del proyecto).
  - 2 herramientas de Design Board: `read_board` (leer tablón completo), `update_ticket` (añadir o completar tickets de rol via MCP).
- **Modificado:**
  - `index.js`: Reescrito como punto de entrada limpio que importa los módulos. De 101 líneas monolíticas a ~50 líneas legibles.
  - `package.json`: Versión bumped a `2.0.0`, dependencias con versiones fijas (`^1.13.0` para el SDK, `^3.24.0` para zod).
  - `ai-memory/design_board.md`: Sincronizado con el estado real del proyecto. Tickets 001–005 marcados como completados.
- **Decisión técnica:** Usar `fileUtils.js` como capa de abstracción de I/O evita código duplicado y hace que añadir nuevos módulos de herramientas sea trivial.

## [2026-06-22] - Implementación de Orquestador Modular de IA (Agentes Externos)
**Rama:** `AI_bot`

- **Añadido:**
  - Nueva arquitectura de IA modular en `src/services/ai/`.
  - `src/services/ai/aiConfig.js`: Configuración centralizada de modelos y prioridades por tipo de tarea (generación de texto y clasificación).
  - `src/services/ai/providers/geminiProvider.js`: Adaptador nativo usando `fetch` para la API de Google Gemini (AI Studio).
  - `src/services/ai/providers/huggingfaceProvider.js`: Adaptador nativo para Hugging Face Serverless API.
  - `src/services/ai/providers/ollamaProvider.js`: Adaptador nativo para Ollama local (`http://localhost:11434`).
  - `src/services/ai/providers/openrouterProvider.js`: Adaptador nativo para OpenRouter API.
  - `src/services/ai/aiOrchestrator.js`: Core orquestador que inicializa dinámicamente los proveedores configurados en el `.env` y gestiona el fallback automático a otros proveedores si el principal falla (ej: límites de cuota, error de red).
  - Script de pruebas unitarias `tests/test_ai_orchestrator.js` para verificar el correcto funcionamiento del fallback y la inicialización.
- **Modificado:**
  - `src/services/aiService.js`: Refactorizado para actuar como un wrapper compatible hacia atrás que delega todo el trabajo al nuevo orquestador modular de IA, asegurando continuidad en el resto del bot.
  - `.env.example`: Añadidas las variables de configuración correspondientes para Gemini, Hugging Face, OpenRouter y Ollama.

## [2026-06-22] - Hotfix: Solución a Error de Guardado de Personajes (Supabase Permission Denied)
**Rama:** `AI_bot`

- **Solucionado:**
  - Error `permission denied for table characters` al crear personajes. La causa era la falta de privilegios explícitos (`GRANT`) en la tabla `characters` para el rol `service_role` (utilizado por el bot para saltarse el RLS) y los roles públicos de la API (`anon` y `authenticated`).
  - Se agregaron instrucciones explícitas de `GRANT ALL PRIVILEGES` para la tabla `characters` y el resto de tablas y secuencias del esquema `public` en `supabase_migration.sql`.

## [2026-06-22] - Auditoría y Mejora de Suite de Personajes (Higiene y UI)
**Rama:** `AI_bot`

- **Solucionado:**
  - `eliminar_pj.js`: Simplificación en la lectura de argumentos, ya no requiere saltos de línea engorrosos.
  - `edit_pj_name.js`: Renombrado lógico. Ahora `/renombrar_pj` edita el **personaje activo** directamente.
  - `editar_pj_descripcion.js`: Al igual que `/crear_pj`, ahora utiliza Regex y una plantilla limpia de formulario. Afecta directamente al **personaje activo**.
  - `swich_pj.js`: Corregido un typo en el nombre del archivo (ahora es `switch_pj.js`).
- **Mejora Visual:**
  - `mis_pj.js` y `pj.js` ahora cuentan con una interfaz inmersiva premium en vez de strings planos, heredando los estándares gráficos de `ver_pj.js`.
- **Testing:**
  - Se creó el directorio `tests/` y el archivo `test_crear_pj.js` con pruebas unitarias para validar que las expresiones regulares extraen perfectamente nombres, clases e historias incluso si el jugador usa mayúsculas, espacios aleatorios u omite información.
## [2026-06-22] - Refactorización de UI/UX para Creación de Personajes
**Rama:** `AI_bot`

- **Modificado:**
  - `src/commands/personajes/crear_pj.js`: Se reemplazó el antiguo parser estricto por un sistema de plantillas guiadas y extracción de datos vía expresiones regulares. Ahora el comando provee un formulario fácil de copiar/pegar para el usuario.
  - `src/services/characterService.js`: Se simplificó `createCharacter` para omitir la inyección manual de atributos y estadísticas por defecto, delegando esta responsabilidad a los modificadores `DEFAULT` de la base de datos PostgreSQL/Supabase.
## [2026-06-22] - Hotfix: Corrección de esquema SQL (Duplicidad de Cline)
**Rama:** `AI_bot`

- **Solucionado:**
  - Se detectó y eliminó una tabla `characters` duplicada y desactualizada en `supabase_migration.sql` (líneas 15-25) que había sido añadida en iteraciones previas por Cline. Esta duplicidad iba a causar que la tabla real con las columnas `slug`, `slots` e `is_active` fuera ignorada durante la migración, rompiendo la lógica del bot.
## [2026-06-22] - Sección 11 y 12: Roles Agnósticos y Micro-Agentes
**Rama:** `AI_bot`

- **Añadido:**
  - `ai-memory/design_board.md` como tablón MCP asíncrono para coordinar tareas entre los roles "Arquitecto", "Creativo" y "Coder", independientemente del LLM (Claude o Gemini) que esté activo en el momento.
  - Nuevo servicio `src/services/aiService.js` preparado para usar la API gratuita de Hugging Face (`HuggingFaceH4/zephyr-7b-beta` y `DeBERTa-v3`) para tareas de reconocimiento de intenciones y generación de texto en tiempo de ejecución.
- **Modificado:**
  - `.roomodes` reescrito para independizar los roles de los LLMs. Ahora Antigravity asume "sombreros funcionales" según el ticket del `design_board.md`.
  - `help.js` y `ver_pj.js` refactorizados aplicando la estética premium del rol "Creativo" (Markdown de WhatsApp avanzado, separadores visuales, estructura tipo tarjeta RPG).
- **Decisión técnica:** Al desvincular los roles de un modelo de IA específico, el ecosistema se vuelve inmune a los cortes o agotamiento de tokens en Claude o Gemini. Cualquier IA activa puede leer el `design_board.md` y asumir el rol requerido.

## [2026-06-22] - Pre-Sección 11: Deuda Técnica y Migración de Personajes
**Rama:** `AI_bot`

- **Añadido:**
  - Esquema SQL en `supabase_migration.sql` para la tabla `characters` (soporte RLS y restricciones).
  - Script `migrateCharacters.js` para transferir personajes desde JSON local a la tabla Supabase (`is_active` auto-gestionado).
- **Modificado:**
  - `src/services/characterService.js` refactorizado al 100%. Eliminado el uso de `fs` y el sistema de archivos local, conectándolo directamente con Supabase (`insert`, `update`, `delete`, `select`).
  - `src/services/userService.js` y `src/services/groupActivityService.js` limpiados de código muerto. Eliminadas importaciones inútiles de `fs`/`path` y funciones helpers huérfanas (`readJson`, `ensureDir`).
  - `.gitignore` actualizado para excluir `git_status.txt` y archivo eliminado del repositorio local.
- **Decisión técnica:** Al mover los personajes a Supabase, el bot ya es **completamente stateless**. No hay riesgo de pérdida de datos en hostings volátiles. Se completaron todas las pre-condiciones para la Sección 11 (Gemini como admin creativo).
## [2026-06-22] - Blindaje del Protocolo de Memoria Multi-Agente
**Rama:** `AI_bot`

- **Modificado:**
  - `.clinerules` reescrito con protocolo estricto de memoria compartida, checklist obligatorio pre-respuesta, y protocolos de inicio/cierre de sesión para Codex.
  - `.roomodes` actualizado con `roleDefinition` completo incluyendo reglas de memoria, `customInstructions` como recordatorio permanente, y grupo `edit` habilitado para que Codex pueda escribir archivos críticos.
- **Decisión técnica:** La memoria compartida (`NekoMemori`, `implementation_plan.md`, `AI_CHANGELOG.md`, `task.md`) tiene PRIORIDAD ABSOLUTA sobre el ahorro de tokens. Codex ya no puede sacrificar actualizaciones de memoria por optimización.
- **Problema resuelto:** Codex añadió secciones 10-11 al plan pero olvidó registrarlas en NekoMemori, rompiendo la sincronización entre agentes.

## [2026-06-22] - Codex: Secciones 10 y 11 del Plan Maestro
**Rama:** `AI_bot`

- **Añadido (por Codex en Cline):**
  - Sección 10: Simulación de uso de tokens con tabla comparativa (reducción proyectada de ~4200 a ~2320 tokens/ciclo).
  - Sección 11: Plan para integrar a Gemini como administrador creativo del ecosistema multi-agente.
- **NOTA:** Estas secciones NO fueron registradas en NekoMemori por Codex. Corregido por Antigravity.
## [2026-06-22] - Ejecución del Plan de Codex (Migración a Supabase)
**Rama:** `AI_bot`

- **Añadido:**
  - Archivo `supabase_migration.sql` con el diseño relacional para `players`, `groups` y `group_members`.
  - Script `src/database/migrateToSupabase.js` para leer los JSON locales de personajes y grupos y poblar automáticamente la base de datos en Supabase.
  - Creación del nuevo `task.md` para hacer el seguimiento de la refactorización de servicios de economía y usuarios.
- **Modificado:**
  - Refactorización de `src/services/userService.js`. Ahora lee y guarda directamente en la tabla `players` de Supabase, reemplazando la dependencia del sistema de archivos local (`profile.json`).
  - Refactorización de `src/services/groupActivityService.js`. Integrado con las tablas `groups` y `group_members`, asegurando que la actividad grupal se mantenga sin almacenar archivos locales.


## [2026-06-22] - Fase 2: Arquitectura Multi-Agente
**Rama:** `AI_bot`

- **Añadido:**
  - Servidor `mcp_nekomemori` (Node.js SDK) creado para compartir la memoria (`rolbot-memory.jsonl`) entre Codex y Antigravity.
  - Archivo de configuración `.roomodes` en la raíz de RolBotV1, creando el rol "Codex Arquitecto" con las instrucciones base inyectadas.


## [2026-06-22] - Fase 1: Infraestructura en la Nube
**Rama:** `AI_bot`

- **Añadido:**
  - Integración del cliente `@supabase/supabase-js` para reemplazar la dependencia local de archivos.
  - Implementación del adaptador `supabaseAuthState.js` para persistir la sesión de `@whiskeysockets/baileys` directamente en Supabase, previniendo pérdida de sesión en despliegues efímeros (como Hugging Face o Vercel).
  - Integración de `dotenv` para la gestión de variables de entorno seguras (`SUPABASE_URL`, `SUPABASE_KEY`).

- **Modificado:**
  - `src/core/bot.js` refactorizado para utilizar el nuevo adaptador de Supabase en lugar de `useMultiFileAuthState`.
  - `.gitignore` actualizado con reglas más estrictas para ignorar las carpetas `src/database/auth`, `grupos` y `personajes`.
