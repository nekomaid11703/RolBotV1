# RolBotV1

Bot RPG modular para WhatsApp, construido con Baileys, Node.js y Supabase. La rama activa es `AI_rolbot` y conserva el sistema v1.6 de ítems, equipamiento, distancia, fatiga y UI por secciones.

## Arquitectura

```text
WhatsApp (Baileys)
  → eventHandler → context → commandHandler
  → commands → services → Supabase
                       └→ services/rpg → motor D20
```

- **Código determinista:** no necesita un LLM ni una API de IA para funcionar.
- **Supabase como fuente de verdad:** perfiles, economía, inventario, permisos, autenticación y combates.
- **Persistencia segura:** los cambios críticos se confirman en Supabase antes de publicarse en memoria o responder como exitosos.
- **Límites claros:** `dependency-cruiser` valida las capas y el grafo de Graphify refleja el código actual.

## Requisitos

- Node.js `>=20.19.0`
- Proyecto Supabase con las migraciones de `src/database/migrations/`
- Número de WhatsApp disponible para vinculación
- Graphify global `0.9.9` solo si se va a mantener el knowledge graph

## Instalación

```bash
cp .env.example .env.local
npm ci
npm run check:all
npm start
```

Completa en `.env.local`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` con la clave backend `service_role`; `SUPABASE_KEY` se acepta solo por compatibilidad deprecada
- `OWNER_PHONE` y, solo si hacen falta, `OWNER_ALIASES`
- `PAIRING_PHONE_NUMBER` cuando se use `npm start code`

No confirmes un despliegue como sano hasta probar vinculación, recepción, respuesta, multimedia, restauración de sesión y reconexión contra los servicios reales.

## Migraciones

En una instalación v1.6 existente, aplica y verifica como mínimo:

1. `003_remediation_item_equipment.sql`: completa metadatos, equipo y `combat_sessions`.
2. `004_harden_inventory_access.sql`: endurece RLS/permisos y añade `distance` de forma idempotente.

Las tablas privadas del bot —incluidas `bot_auth_state`, perfiles, personajes, inventario y combates— quedan reservadas a `service_role`; `anon` y `authenticated` no deben tener acceso directo.

## Funciones principales

- Economía: balance, daily, transferencias y administración de stelas.
- Personajes: creación, edición, selección, progresión y ficha por secciones.
- Inventario v2: materiales, tiers, durabilidad, equipo, sets y familia de hierro.
- Combate PvP/PvE: D20, distancia, fatiga, reacciones, dummy equipado y persistencia.
- Administración: actividad, moderación, permisos por categoría y control de grupos.
- Operación: reportes de bugs con multimedia limitada, dashboard, scheduler y reconexión protegida.

## Estructura

```text
src/
├── commands/          comandos de WhatsApp
├── config/            configuración central
├── core/              conexión, contexto y despacho
├── data/              catálogos RPG
├── database/          Supabase, esquema y migraciones
├── modules/           módulos componibles de ítems
├── services/          casos de uso y persistencia
│   └── rpg/           combate, inventario y equipo
├── ui/                composición de respuestas
└── utils/             utilidades puras
tests/                 pruebas Vitest
graphify-out/          knowledge graph generado
```

## Calidad

```bash
npm run check:all       # lint + tipos + arquitectura + formato + pruebas
npm run knip            # archivos/exports sin consumidores
npm audit --omit=dev    # vulnerabilidades de producción
npm run graphify:update # refresca el grafo después de cambios
```

Estado verificado el 2026-08-04:

- ESLint: 0 errores y 0 advertencias.
- TypeScript/JSDoc: correcto.
- Dependency Cruiser: 0 violaciones.
- Prettier: correcto.
- Vitest: 44 archivos y 528 pruebas correctas.
- Knip: sin hallazgos.
- `npm audit --omit=dev`: 0 vulnerabilidades.

Consulta [AUDITORIA_COMPLETA.md](AUDITORIA_COMPLETA.md) para la auditoría técnica y [REPORTE_WHATSAPP.md](REPORTE_WHATSAPP.md) para el resumen listo para compartir.

## Knowledge graph

```bash
graphify query "cómo se procesa un comando"
graphify path "startBot" "supabase"
npm run graphify:status
npm run graphify:update
```

Graphify es una herramienta de desarrollo; el bot no depende de ella en producción.
