# RolBotV1

Bot RPG modular para WhatsApp. Arquitectura 100% stateless con Supabase como fuente de verdad.

## Tecnologías Principales
- **Baileys** (`@whiskeysockets/baileys`): Conexión con la API de WhatsApp.
- **Supabase**: Base de datos en la nube. Almacena sesiones, perfiles, personajes, economía y reportes.
- **Node.js**: Entorno de ejecución.

## Estructura del Proyecto
- `/src/core`: Lógica principal del bot, manejo de sesión, eventos y contexto.
- `/src/services`: Servicios de negocio (Economía, Usuarios, Grupos, Personajes, Bug Reports, Logger).
- `/src/services/rpg`: Sistema RPG (combatEngine, abilities, items, inventory, enemies, effects).
- `/src/commands`: 46 comandos ejecutables en 6 categorías (economía, personajes, grupo, permisos, información, utilidades).
- `/src/config`: Configuración centralizada (economía, grupos, personajes, permisos, RPG).
- `/src/data`: Catálogos de clases y razas.
- `/src/database`: Cliente Supabase.
- `/src/utils`: Utilidades (cache, formateo, parsing, menciones, permisos, roll).
- `/tests`: 15 suites de prueba.
- `/adr`: Architecture Decision Records.
- `/graphify-out`: Knowledge graph generado por AST (sin LLM).

## Comandos disponibles

| Categoría | Comandos |
|-----------|----------|
| Economía | `/balance`, `/daily`, `/dar_stelas`, `/top_dinero`, `/add_stelas`, `/rem_stelas`, `/set_stelas` |
| Personajes | `/crear_pj`, `/ver_pj`, `/mis_pj`, `/switch_pj`, `/eliminar_pj`, `/renombrar_pj`, `/editar_pj_desc` |
| Grupo | `/actividad`, `/actividad_global`, `/add`, `/ban`, `/promote`, `/demote`, `/invite`, `/todos`, `/warn`, `/unwarn`, `/grupo_abrir`, `/grupo_cerrar`, `/top_activos` |
| Permisos | `/eco_admin_add`, `/eco_admin_rem`, `/eco_admin_list` |
| Información | `/help`, `/hola` |
| Utilidades | `/dado`, `/bugreport`, `/bugstatus` |

## Configuración y Ejecución
1. Copia `.env.local.example` a `.env.local`.
2. Llena las credenciales (`SUPABASE_URL`, `SUPABASE_KEY`).
3. Instala dependencias con `npm install`.
4. Ejecuta el bot con `npm start` o `npm run dev` para recarga automática.

## Herramientas de desarrollo
```bash
npm run check      # lint + typecheck + depcruise
npm run check:all  # check + format:check + test:all
npm run lint       # ESLint
npm run format     # Prettier
npm run typecheck  # TypeScript (strict)
npm run depcruise  # dependency-cruiser
```
