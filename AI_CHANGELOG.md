# Registro de Cambios (AI Changelog)

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
