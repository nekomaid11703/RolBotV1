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

*Ninguno activo actualmente.*

### Tickets Completados

- **[Ticket 010]** `@Creativo/@Validador` -> Revisar estetica y coherencia de comandos con entrada de usuario. *Estado: Completado. Resultado: `messageFormatUtils.js` centraliza tarjetas de uso/formulario/error; comandos de economia, permisos, personajes y dado usan formato coherente con ejemplo; `tokenSavingDelegationManager.js` devuelve fallback estructurado ante cuota/tokens agotados. Validacion: `node tests/test_command_usage_format.js`, `node tests/test_token_saving_delegation.js`, `node tests/test_memory_context.js`, `node tests/test_crear_pj.js`; se continuo exitosamente tras pausa por agotamiento de tokens en Codex.*
- **[Ticket 009]** `@Arquitecto` -> Implementar plan automatico de ahorro de tokens multi-agente. *Estado: Completado. Resultado: `tokenSavingDelegationManager.js` decide cuando delegar o mantener local, asigna proveedores por calidad/gratuidad, ejecuta subtareas asincronas, aplica quality gate de maxima calidad y ensambla resultados. Validacion: `node tests/test_token_saving_delegation.js`, `node tests/test_memory_context.js`, `node tests/test_ai_orchestrator.js`, `node tests/test_crear_pj.js`.*
- **[Ticket 008]** `@Arquitecto` -> Endurecer la migracion Supabase segun arquitectura backend con service_role. *Estado: Completado. Resultado: `supabase_migration.sql` ahora incluye `bot_auth_state`, politicas service-role-only y revoca privilegios amplios de `anon/authenticated`; `tests/test_supabase_schema.js` valida tablas requeridas. Validacion: `node test_supa.js` y `node tests/test_supabase_schema.js` con red habilitada.*
- **[Ticket 007]** `@Coder` -> Integrar recuperacion de memoria en el orquestador IA sin agregar proveedores nuevos. *Estado: Completado. Resultado: `memoryContextService.js` recupera JSONL/board; `aiOrchestrator.generateText` soporta `useMemory:true` y el worker pool lo activa para tareas de agentes. Validacion: `node tests/test_memory_context.js`, `node tests/test_crear_pj.js` y dry-run de orquestador con proveedor dummy con/sin memoria.*
- **[Ticket 006]** `@Arquitecto` -> Formalizar memoria persistente compartida entre Codex, Antigravity y futuros agentes. *Estado: Completado. Resultado: reglas locales `.agents`, skills adaptadas, `ai-memory/memory_protocol.md`, `task.md` y memoria durable `mem-1782239972917`. Validacion: NekoMemori MCP lista herramientas y acepta `record_memory` extendido.*
- **[Ticket 005]** `@Arquitecto` -> Mejorar y modularizar el servidor MCP NekoMemori. *Estado: Completado. Resultado: NekoMemori v2.0.0 con 7 herramientas, arquitectura modular y soporte para design board.*
- **[Ticket 004]** `@Coder` -> Auditar y modernizar la suite de comandos de personajes. *Estado: Completado. Resultado: 6 comandos refactorizados con UX premium, regex y personaje activo como contexto.*
- **[Ticket 003]** `@Coder` -> Migrar characterService.js a Supabase y hacer el bot 100% stateless. *Estado: Completado. Resultado: characterService ahora usa Supabase. Bot completamente stateless.*
- **[Ticket 002]** `@Arquitecto` -> Disenar el servicio `aiService.js` para integrarse con Hugging Face. *Estado: Completado. Resultado: reemplazado por el Orquestador Modular de IA en `src/services/ai/` con soporte para Gemini, HF, Ollama y OpenRouter con fallback automatico.*
- **[Ticket 001]** `@Creativo` -> Refactorizar la salida visual de `/help` y `/ver_pj` para usar Markdown premium. *Estado: Completado. Resultado: ambos comandos usan Markdown enriquecido con estilo tarjeta RPG.*

### Pendientes Externos

- GitHub MCP local requiere Docker o Go y un `GITHUB_PERSONAL_ACCESS_TOKEN` real.
- RAG/vector search no existe aun; requiere decision futura e infraestructura explicita.
