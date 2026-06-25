# RolBotV1

Bot RPG modular para WhatsApp. Arquitectura 100% stateless con Supabase como fuente de verdad.

## Tecnologías Principales
- **Baileys** (`@whiskeysockets/baileys`): Conexión con la API de WhatsApp.
- **Supabase**: Base de datos en la nube (Arquitectura Stateless). Almacena sesiones, perfiles, personajes, economía y reportes.
- **Node.js**: Entorno de ejecución.
- **Orquestador de IA multi-agente**: Gemini, OpenRouter, Hugging Face y Ollama con failover automático.

## Estructura del Proyecto
- `/src/core`: Lógica principal del bot, manejo de sesión y contexto.
- `/src/services`: Servicios de lectura/escritura (Economía, Usuarios, Grupos, Personajes, IA, Bug Reports, Sincronización) conectados directamente a Supabase.
- `/src/services/rpg`: Sistema RPG base (dataLoader, statCalculator, ruleEngine).
- `/src/commands`: 36 comandos ejecutables en 6 categorías (economía, personajes, grupo, permisos, información, utilidades).
- `/src/database`: Cliente Supabase y scripts de migración.
- `/src/utils`: Utilidades (safeQuery, formateo, parsing, menciones, permisos).
- `/mcp_nekomemori`: Servidor local MCP para memoria persistente de la IA.
- `/tests`: 9 suites de prueba (cache, context, multiagente, comandos, personajes, esquema).

## Comandos disponibles

| Categoría | Comandos |
|-----------|----------|
| Economía | `/balance`, `/daily`, `/dar_stelas`, `/top_dinero`, `/add_stelas`, `/rem_stelas`, `/set_stelas` |
| Personajes | `/crear_pj`, `/ver_pj`, `/mis_pj`, `/switch_pj`, `/eliminar_pj`, `/renombrar_pj`, `/edit_pj_desc` |
| Grupo | `/actividad`, `/actividad_global`, `/add`, `/ban`, `/promote`, `/demote`, `/invite`, `/todos`, `/warn`, `/unwarn`, `/grupo_abrir`, `/grupo_cerrar`, `/top_activos` |
| Permisos | `/eco_admin_add`, `/eco_admin_rem`, `/eco_admin_list` |
| Información | `/help`, `/hola` |
| Utilidades | `/dado`, `/bugreport`, `/bugstatus` |

## Configuración y Ejecución
1. Copia `.env.example` y renómbralo a `.env`.
2. Llena las credenciales (`SUPABASE_URL`, `SUPABASE_KEY`, `GEMINI_API_KEY`, etc.).
3. Instala dependencias con `npm install`.
4. Ejecuta el bot con `npm start` o `npm run dev` para recarga automática.
