# RolBotV1

Bot RPG modular para WhatsApp, basado en Baileys y Supabase. El flujo es determinista y no depende de un LLM externo.

## Flujo principal

```text
WhatsApp (Baileys)
  -> core/bot
  -> core/eventHandler
  -> core/context
  -> core/commandHandler
  -> commands
  -> services
  -> Supabase (PostgreSQL)
```

- El motor de combate D20 vive en `src/services/rpg`.
- Los 49 módulos de comandos se cargan desde `src/commands`.
- Supabase almacena autenticación de Baileys, perfiles, economía, actividad, inventario y combates.
- La caché local es una optimización; Supabase sigue siendo la fuente de verdad.

## Requisitos

- Node.js 20.19 o posterior.
- Un proyecto Supabase configurado.
- Una sesión de WhatsApp vinculada mediante el flujo de Baileys.

## Configuración

```bash
npm ci
cp .env.example .env.local
# Completar SUPABASE_URL y SUPABASE_KEY en .env.local
npm run dev
```

Para producción:

```bash
npm ci --omit=dev
npm start
```

No se deben versionar `.env.local`, archivos de sesión ni directorios `auth/`.

## Estructura

```text
src/
  commands/       comandos de administración, economía, información y RPG
  config/         límites y configuración funcional
  core/           conexión, eventos, contexto y despacho de comandos
  data/           catálogos del juego
  database/       Supabase, esquema y migraciones
  services/       casos de uso y persistencia
    rpg/          combate e inventario
  utils/          utilidades compartidas y caché
tests/            pruebas Vitest
graphify-out/     grafo de conocimiento generado
```

El listado visible de comandos y su uso se obtiene con `/help` dentro de WhatsApp.

## Calidad

```bash
npm run check:all   # lint + tipos + arquitectura + formato + 304 pruebas
npm run knip        # archivos, exports y dependencias sin uso
npm audit --omit=dev
```

La integración continua ejecuta `npm ci`, `npm run check:all`, `npm run knip` y la auditoría de dependencias.

## Base de datos

Las migraciones están en `src/database/migrations` y deben aplicarse en orden. Para instalaciones existentes es especialmente importante aplicar `003_harden_inventory_access.sql`, que revoca el acceso directo de `anon` y `authenticated` al inventario.

## Graphify

```bash
npm run graphify:status
npm run graphify:update
```

El resultado reproducible queda en `graphify-out/`.

## Auditoría

La auditoría técnica, las optimizaciones realizadas, la evidencia y los pasos operativos pendientes están en [AUDITORIA_COMPLETA.md](AUDITORIA_COMPLETA.md).
