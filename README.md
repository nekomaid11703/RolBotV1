# IA_rolbot — RolBotV1

Bot RPG modular para WhatsApp. Arquitectura determinista 100% code-only (sin capa de IA externa).

## Arquitectura

```
┌─────────────────────────────────────────────────┐
│  WhatsApp (Baileys)                              │
│  └─ Bot → EventHandler → Context → Commands      │
│       └─ Services → Supabase (PostgreSQL)         │
│       └─ Services/rpg → Combat Engine D20         │
├─────────────────────────────────────────────────┤
│  MCP Servers                                     │
│  ├─ NekoMemori    → Memoria compartida (JSONL)   │
│  ├─ Graphify      → Knowledge graph (AST)        │
│  └─ GitHub        → Issues, PRs, search          │
├─────────────────────────────────────────────────┤
│  Toolchain                                       │
│  ESLint · Prettier · TypeScript · Vitest         │
│  Husky · lint-staged · Knip · Stryker            │
│  dependency-cruiser · Nodemon                    │
└─────────────────────────────────────────────────┘
```

- **100% code-only:** Sin dependencia de LLMs externos. No hay orquestador IA, ni providers, ni prompts.
- **Motor D20:** Sistema de combate táctico determinista basado en dado de 20 caras. Sin narrativa generada.
- **Supabase:** Única fuente de verdad. Sesiones, perfiles, economía, inventarios, combates.

## Tecnologías

- **Baileys** (`@whiskeysockets/baileys`) — Conexión WhatsApp
- **Supabase** — PostgreSQL como backend único
- **Node.js >= 18** — Entorno de ejecución
- **MCP** — 3 servidores (NekoMemori, Graphify, GitHub)

## Estructura

```
C:\IA_rolbot/
├── RolBotV1/                  ← Proyecto principal
│   ├── src/
│   │   ├── core/              ← bot.js, eventHandler, commandHandler
│   │   ├── commands/          ← 46 comandos (6 categorías)
│   │   ├── services/          ← Economía, usuarios, grupos, personajes
│   │   │   └── rpg/           ← Motor de combate D20, habilidades, items
│   │   ├── config/            ← Config centralizada
│   │   ├── database/          ← Cliente Supabase
│   │   ├── utils/             ← Cache, formateo, roll, permisos
│   │   └── data/              ← Catálogos (clases, razas)
│   ├── tests/                 ← 18+ suites de prueba
│   ├── graphify-out/          ← Knowledge graph (1207 nodos)
│   └── ai-memory/             ← Memoria compartida NekoMemori
├── mcp_nekomemori/            ← Servidor MCP propio (Node.js)
├── github-mcp-server/         ← Servidor MCP GitHub (vendorizado)
├── opencode.json              ← Config MCP principal
├── AUDITORIA_COMPLETA.md      ← Auditoría + roadmap vivo
└── .agents/AGENTS.md          ← Instrucciones del agente
```

## Comandos

| Categoría | Comandos |
|-----------|----------|
| Economía | `/balance`, `/daily`, `/dar_stelas`, `/top_dinero`, `/add_stelas`, `/rem_stelas`, `/set_stelas` |
| Personajes | `/crear_pj`, `/ver_pj`, `/mis_pj`, `/switch_pj`, `/eliminar_pj`, `/renombrar_pj`, `/editar_pj_desc` |
| Grupo | `/actividad`, `/actividad_global`, `/add`, `/ban`, `/promote`, `/demote`, `/invite`, `/todos`, `/warn`, `/unwarn`, `/grupo_abrir`, `/grupo_cerrar`, `/top_activos` |
| Permisos | `/eco_admin_add`, `/eco_admin_rem`, `/eco_admin_list` |
| Información | `/help`, `/hola` |
| Utilidades | `/dado`, `/bugreport`, `/bugstatus` |

## Configuración

```bash
cp .env.local.example .env.local
# Editar .env.local con SUPABASE_URL, SUPABASE_KEY
npm install
npm run dev       # Desarrollo con recarga automática
npm start         # Producción
```

## Toolchain

```bash
npm run check       # lint + typecheck + depcruise
npm run check:all   # check + format:check + test:all
npm run lint        # ESLint (0 errores)
npm run typecheck   # TypeScript strict
npm run test:vite   # Vitest (test runner)
npm run format      # Prettier
npm run depcruise   # dependency-cruiser
npm run knip        # Dead code detection
```

## Estado del proyecto

| Fase | Estado | Fecha |
|------|--------|-------|
| 🔴 FASE 0 — Rescate | ✅ Completado | 2026-07-14 |
| 🟠 FASE 1 — Portabilidad | ✅ Completado | 2026-07-14 |
| 🟡 FASE 2 — CI/CD | ⚡ Parcial | 2026-07-14 |
| 🟢 FASE 3 — Refactor | ✅ Completado | 2026-07-14 |
| 🔵 FASE 4 — Rendimiento | ✅ Completado | 2026-07-14 |
| 📘 FASE 5 — Documentación | ⏳ En curso | 2026-07-14 |

Ver `AUDITORIA_COMPLETA.md` para el detalle completo del roadmap y checklist.

## Knowledge Graph

El proyecto mantiene un grafo de conocimiento de 1207 nodos (funciones, clases, imports) generado por AST (tree-sitter). Sin LLM, 0 costo, 100% reproducible.

- `graphify query "<pregunta>"` — Buscar en el grafo
- `graphify path "<A>" "<B>"` — Relaciones entre nodos
- `graphify explain "<concepto>"` — Explicación de un nodo
