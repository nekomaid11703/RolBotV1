# Onboarding — Contexto Completo del Proyecto

## Carga automática
Activar al iniciar una sesión sin contexto previo, o cuando se requiera entender el proyecto desde cero.

## 1. Proyecto: RolBotV1

Bot RPG modular para WhatsApp. Stack:
- **Runtime**: Node.js v24.x, npm 11.x
- **Librería WhatsApp**: `@whiskeysockets/baileys` v6.7 (WebSocket, no puppeteer)
- **Base de datos**: Supabase (PostgreSQL + Auth)
- **Logger**: Pino (estructurado, con loggerService wrapper)
- **Autenticación**: Supabase AuthState (sesión persistente vía REST)

## 2. Herramientas disponibles

Ejecutar `npm run context` para lista completa y actualizada. Las principales:

| Herramienta | Script npm | Archivo config | Propósito |
|------------|-----------|----------------|-----------|
| ESLint | `npm run lint` | `eslint.config.js` | Calidad de código |
| TypeScript | `npm run typecheck` | `tsconfig.json` | Type checking (JSDoc) |
| Prettier | `npm run format` | `.prettierrc` | Formateo consistente |
| Vitest | `npm run test:vite` | `vitest.config.js` | Tests unitarios |
| DepCruise | `npm run depcruise` | `.dependency-cruiser.cjs` | Detectar dependencias circulares |
| Knip | `npm run knip` | `knip.json` | Código muerto / exports no usados |
| Graphify | (Python global) | `graphify-out/` | Knowledge graph AST |
| NekoMemori | MCP server | `../mcp_nekomemori/` | Memoria compartida multi-agente |
| Verificación docs | `npm run context:check` | — | Detecta brechas entre lo real y lo documentado |
| Reset auth | `npm run reset:auth` | — | Reinicia sesión Supabase del bot |

## 3. Skills OpenCode

| Skill | Archivo | Cuándo usarlo |
|-------|---------|--------------|
| `auditoria_y_calidad` | `skills/auditoria_y_calidad/SKILL.md` | Refactorización, post-cambio, limpieza |
| `investigacion_y_analisis` | `skills/investigacion_y_analisis/SKILL.md` | Explorar bugs, rastrear flujos |
| `planificacion_proyectos` | `skills/planificacion_proyectos/SKILL.md` | Diseñar nueva funcionalidad, planificar |
| `bug-fixer` | `skills/bug-fixer/SKILL.md` | Corrección de bugs específicos |
| `onboarding` | (este skill) | Primera sesión, contexto desde cero |

## 4. Arquitectura del Bot

```
index.js                    ← Entry point
src/
├── core/
│   ├── bot.js              ← Inicializa Baileys + reconexión
│   ├── commandHandler.js   ← Enruta comandos a sus módulos
│   ├── eventHandler.js     ← Procesa eventos del chat
│   ├── supabaseAuthState.js ← Persistencia de sesión WhatsApp
│   └── context.js          ← Contexto de ejecución de comandos
├── commands/
│   ├── admin/              ← Comandos de administración
│   ├── economy/            ← Sistema económico
│   ├── info/               ← Comandos informativos
│   └── rpg/                ← Sistema RPG (combate, stats)
├── config/                 ← Configuración del bot
├── data/                   ← Datos estáticos / seeds
├── database/               ← Capa de datos (Supabase)
├── services/               ← Servicios (logger, stats, dashboard)
└── utils/                  ← Utilidades varias
```

Flujo de startup:
1. `index.js` → `bot.js` (crea conexión Baileys)
2. `supabaseAuthState.js` restaura sesión previa
3. `eventHandler.js` escucha mensajes
4. `commandHandler.js` parsea y enruta comandos
5. Cada comando ejecuta lógica y responde

## 5. Protocolo del Agente

1. **Antes de cualquier acción**: Ejecutar `/revisar` o `npm run context`
2. **Para preguntas sobre código**: Usar `graphify query`, `graphify explain`, `graphify path`
3. **Después de modificar código**: Ejecutar `graphify --update .`
4. **Antes de finalizar**: `npm run lint` + `npm run typecheck` + tests verdes
5. **Decisiones importantes**: Registrar en NekoMemori (`record_memory`)
6. **Regla de oro**: No asumir nada — leer config, scripts y AGENTS.md
