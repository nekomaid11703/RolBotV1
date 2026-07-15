# Design Board & Role Orchestration

Este archivo es el tablon operativo centralizado para el ecosistema RolBotV1.
Funciona como puente asincronico para coordinar tareas entre Codex,
Antigravity y futuros agentes.

Los roles no pertenecen a un LLM especifico. Son sombreros funcionales que la
IA activa debe asumir segun la tarea.

---

## Roles Funcionales

1. **El Arquitecto**
   - Enfoque: logica, bases de datos, seguridad, optimizacion y escalabilidad.
   - Usarlo al disenar sistemas, auditar dependencias o planificar migraciones.

2. **El Creativo**
   - Enfoque: UX/UI textual, inmersion narrativa, coherencia estetica y Markdown enriquecido.
   - Usarlo al refactorizar salidas de comandos (`ctx.reply`) o dar personalidad al bot.

3. **El Coder**
   - Enfoque: ejecucion rapida, manipulacion de archivos, pruebas y consola.
   - Usarlo al implementar, probar o actualizar configuraciones.

4. **El Validador**
   - Enfoque: QA, regresiones, evidencias, riesgos y cierre documental.
   - Usarlo antes de cerrar tickets o registrar memorias como resueltas.

---

## Tablero De Tareas Cruzadas

Instrucciones para agentes:

- Tickets activos viven aqui.
- Conocimiento reutilizable vive en `rolbot-memory.jsonl`.
- Cada ticket completado debe indicar resultado y validacion.
- Si hay bloqueo externo, moverlo a pendientes o memoria `pending`.

### Tickets Activos

- **[Ticket 018]** `@Coder` -> Phase 12: Mazmorras y Eventos. Generación procedural de encuentros, loot con rarezas, comandos `/mazmorra`, `/explorar`, `/descansar`, persistencia de estado en Supabase. *Estado: Pendiente.*
- **[Ticket 019]** `@Creativo` -> Phase 13: Integración de IA Narrativa. Comando `/escena`, diálogos dinámicos de NPCs, narrativa contextual en combate, cache de clasificación de intenciones RPG, moderación de contenido generado. *Estado: Pendiente.*
- **[Ticket 020]** `@Arquitecto` -> GitHub MCP local via Docker/Go + GITHUB_PERSONAL_ACCESS_TOKEN real. *Estado: Pendiente externo.*
- **[Ticket 021]** `@Arquitecto` -> RAG/vector search (decisión futura). *Estado: Pendiente externo.*


### Tickets Completados
- **[Ticket 023]** `@Coder` → Mantenimiento: ESLint 0 errores (4 fases), FATAL exit removido, graph actualizado, tests logger/carta_blanca reparados. Owner configurado. *Estado: ✅ Completado. *Resultado: ESLint 0 errores/154 warnings solo jsdoc. permissionsConfig.js sin FATAL exit. OWNER_PHONE=573156602784. Graph 811 nodos/1660 aristas. Tests 6/6+skip+28/28+3/3+28/28+28/28 todos verdes.**

- **[Ticket 022]** `@Arquitecto` -> Fase 1 del Roadmap de Optimización: Segmentación de Dominios de Comandos (admin/group, admin/permissions, rpg/combat, rpg/characters, economy, info) y soporte de carga recursiva en `commandHandler.js`. *Estado: Completado. Resultado: Carpetas reorganizadas de 7 estructuras planas a 4 dominios funcionales orientados, cargador recursivo en commandHandler implementado, requires relativos ajustados. Validación: tests de formato de comando, regex, pipeline de combate y de carga recursiva en verde.*
- **[Ticket 015]** `@Arquitecto` -> Sincronización Supabase como fuente de verdad + bypassCache + startup sync. *Estado: Completado. Resultado: syncService.js con verifySync/forceSync/fetchAllFromSupabase/clearServiceCaches. scripts/force_sync.js con modo --verify-only. Todas las funciones de lectura aceptan bypassCache=true. bot.js limpia cache en startup. Supabase siempre se escribe primero (ninguna escritura va a local). Validación: node scripts/force_sync.js (30 players, 1 char, 6 groups, 43 members, 284 auth), tests 22/22 + 21/21 + 3/3 + command_usage + memory_context + token_saving.*
- **[Ticket 014]** `@Arquitecto` -> Bug fixes críticos Supabase: race conditions, transacciones, null checks, cache integrado. *Estado: Completado. Resultado: (1) transferMoney atómico con rollback compensatorio; (2) createCharacter usa UNIQUE constraint (código 23505) sin count check; (3) setActiveCharacter dos updates atómicos; (4) saveGroupActivity valida upsert. safeQuery.js con safeSingle/safeSingleOrNull/safeMaybeSingle en 4 servicios. Cache LRU+TTL en 10+ funciones con invalidación automática. Validación targetId en dar_stelas. Tests: 22/22 prompt_cache, 21/21 context_compactor, 3/3 crear_pj, command_usage_format, memory_context, token_saving_delegation - todos verdes.*
- **[Ticket 013]** `@Arquitecto` -> Implementar Prompt Cache y Context Compaction (Fase D del roadmap). *Estado: Completado. Resultado: `promptCacheService.js` (LRU + TTL + stats), `contextCompactor.js` (token budget + smart trimming + classification minifier), integrados en orquestador (cache en generateText/classifyText, bypass si temp>0.7), dispatcher (cache clasificación) y memoryContextService (compactación + cache de 30s). Validacion: `node tests/test_prompt_cache.js` (22/22), `node tests/test_context_compactor.js` (21/21), tests existentes sin regresion.*
- **[Ticket 012]** `@Arquitecto` -> Conectar GitHub MCP via streamable-http (Opción C). *Estado: Completado. Resultado: endpoint https://api.githubcopilot.com/mcp/ configurado con PAT de nekomaid11703 en .env + opencode.json. Validacion: initialize handshake HTTP 200 OK, serverInfo github-mcp-server/remote-... recibido.*
- **[Ticket 011]** `@Coder/@Validador` -> Preparacion del entorno: corregir .git corrupto, habilitar npm, verificar NekoMemori y Supabase. *Estado: Completado. Resultado: .git corrupto eliminado de raiz, ExecutionPolicy configurado, NekoMemori MCP v2.0.0 con 7 herramientas operativas, test_supa.js OK. Validacion: MCP handshake + tools/list + test_supa.js.*
- **[Ticket 010]** `@Creativo/@Validador` -> Revisar estetica y coherencia de comandos con entrada de usuario. *Estado: Completado. Resultado: `messageFormatUtils.js` centraliza tarjetas de uso/formulario/error; comandos de economia, permisos, personajes y dado usan formato coherente con ejemplo; `tokenSavingDelegationManager.js` devuelve fallback estructurado ante cuota/tokens agotados. Validacion: `node tests/test_command_usage_format.js`, `node tests/test_token_saving_delegation.js`, `node tests/test_memory_context.js`, `node tests/test_crear_pj.js`; se continuo exitosamente tras pausa por agotamiento de tokens en Codex.*
- **[Ticket 009]** `@Arquitecto` -> Implementar plan automatico de ahorro de tokens multi-agente. *Estado: Completado. Resultado: `tokenSavingDelegationManager.js` decide cuando delegar o mantener local, asigna proveedores por calidad/gratuidad, ejecuta subtareas asincronas, aplica quality gate de maxima calidad y ensambla resultados. Validacion: `node tests/test_token_saving_delegation.js`, `node tests/test_memory_context.js`, `node tests/test_ai_orchestrator.js`, `node tests/test_crear_pj.js`.*
- **[Ticket 008]** `@Arquitecto` -> Endurecer la migracion Supabase segun arquitectura backend con service_role. *Estado: Completado. Resultado: `supabase_migration.sql` ahora incluye `bot_auth_state`, politicas service-role-only y revoca privilegios amplios de `anon/authenticated`; `tests/test_supabase_schema.js` valida tablas requeridas. Validacion: `node test_supa.js` y `node tests/test_supabase_schema.js` con red habilitada.*
- **[Ticket 007]** `@Coder` -> Integrar recuperacion de memoria en el orquestador IA sin agregar proveedores nuevos. *Estado: Completado. Resultado: `memoryContextService.js` recupera JSONL/board; `aiOrchestrator.generateText` soporta `useMemory:true` y el worker pool lo activa para tareas de agentes. Validacion: `node tests/test_memory_context.js`, `node tests/test_crear_pj.js` y dry-run de orquestador con proveedor dummy con/sin memoria.*
- **[Ticket 006]** `@Arquitecto` -> Formalizar memoria persistente compartida entre Codex, Antigravity y futuros agentes. *Estado: Completado. Resultado: reglas locales `.agents`, skills adaptadas, `ai-memory/memory_protocol.md`, `task.md` y memoria durable `mem-1782239972917`. Validacion: NekoMemori MCP lista herramientas y acepta `record_memory` extendido.*
- **[Ticket 005]** `@Arquitecto` -> Mejorar y modularizar el servidor MCP NekoMemori. *Estado: Completado. Resultado: NekoMemori v2.0.0 con 7 herramientas, arquitectura modular y soporte para design board.*
- **[Ticket 004]** `@Coder` -> Auditar y modernizar la suite de comandos de personajes. *Estado: Completado. Resultado: 6 comandos refactorizados con UX premium, regex y personaje activo como contexto.*
- **[Ticket 017]** `@Coder` -> Phase 11: Implementación de combate PvE con enemigos por zona, buffs/debuffs, fatiga y dataLoader. *Estado: Completado. Ver memory.jsonl para detalles.*
- **[Ticket 016]** `@Creativo` -> Implementar sistema de Bug Report multi-agente: comando /bugreport con validación IA, límites por rol (owner/admin/user), imágenes locales, notificación DM owner, scheduler midnight review, CLI para opencode y skill bug-fixer. *Estado: Completado. Resultado: 7 archivos creados (bugReportService.js, schedulerService.js, bugreport.js, bugstatus.js, process_bugs.js, midnight_review.js, SKILL.md). bot.js modificado con startup notify + midnight scheduler.*
- **[Ticket 003]** `@Coder` -> Migrar characterService.js a Supabase y hacer el bot 100% stateless. *Estado: Completado. Resultado: characterService ahora usa Supabase. Bot completamente stateless.*
- **[Ticket 002]** `@Arquitecto` -> Disenar el servicio `aiService.js` para integrarse con Hugging Face. *Estado: Completado. Resultado: reemplazado por el Orquestador Modular de IA en `src/services/ai/` con soporte para Gemini, HF, Ollama y OpenRouter con fallback automatico.*
- **[Ticket 001]** `@Creativo` -> Refactorizar la salida visual de `/help` y `/ver_pj` para usar Markdown premium. *Estado: Completado. Resultado: ambos comandos usan Markdown enriquecido con estilo tarjeta RPG.*
