# RolBotV1

Bot RPG modular para WhatsApp.

## Tecnologías Principales
- **Baileys** (`@whiskeysockets/baileys`): Conexión con la API de WhatsApp.
- **Supabase**: Base de datos en la nube (Arquitectura Stateless). Almacena sesiones de conexión, perfiles de usuarios y actividad de grupos.
- **Node.js**: Entorno de ejecución.

## Estructura del Proyecto
- `/src/core`: Lógica principal del bot y manejo de sesión (`supabaseAuthState.js`).
- `/src/services`: Servicios de lectura/escritura (Economía, Usuarios, Grupos) conectados directamente a Supabase.
- `/src/commands`: Comandos ejecutables por los jugadores en WhatsApp.
- `/mcp_nekomemori`: Servidor local MCP para gestionar la memoria persistente de la IA (`rolbot-memory.jsonl`).

## Configuración y Ejecución
1. Copia `.env.example` y renómbralo a `.env`.
2. Llena las credenciales `SUPABASE_URL` y `SUPABASE_KEY` (service_role).
3. Instala dependencias con `npm install`.
4. Ejecuta el bot con `npm start` o `npm run dev` para recarga automática.
