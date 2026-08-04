# Auditoría profunda e integración de RolBotV1

- Fecha: 2026-08-04
- Repositorio: `https://github.com/nekomaid11703/RolBotV1`
- Rama de destino: `AI_rolbot`
- Base de la colaboradora: `fdabbe6` (v1.6, ítems/equipo/UI por secciones)
- Optimización previa integrada desde `main`: `257584e`

## Resultado ejecutivo

Se descargó nuevamente el repositorio y se trabajó sobre una raíz limpia para no sobrescribir el avance paralelo de la colaboradora. Las dos historias se reconciliaron conservando como base funcional todas las capacidades v1.6 y adaptando sobre ellas las mejoras de seguridad, rendimiento, ciclo de vida, caché, respuestas y calidad.

No se sustituyeron módulos completos de v1.6 por versiones antiguas. Cada conflicto se revisó por comportamiento: ítems v2, equipo del dummy, durabilidad, materiales, tiers, distancia, fatiga y UI por secciones permanecen activos.

El código local queda verificable, pero una batería local no demuestra que WhatsApp o Supabase de producción estén sanos. Las acciones operativas de la sección final siguen siendo obligatorias.

## Antes y después en la rama v1.6

| Control             | Descarga inicial de `AI_rolbot`                                                | Integración optimizada                             |
| ------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------- |
| ESLint              | 4 errores y 1.651 advertencias                                                 | 0 errores y 0 advertencias                         |
| TypeScript/JSDoc    | correcto                                                                       | correcto                                           |
| Vitest              | 12 de 33 archivos no cargaban sin `.env.local`; 318 pruebas alcanzaban a pasar | 44 de 44 archivos; 528 de 528 pruebas              |
| Prettier            | diferencias en 39 archivos relevantes                                          | correcto                                           |
| Dependency Cruiser  | límites sin cierre completo                                                    | 0 violaciones en 143 módulos y 438 dependencias    |
| Knip                | binario y exports sin consumidores                                             | sin hallazgos                                      |
| `npm audit`         | 1 vulnerabilidad alta y 1 moderada                                             | 0 vulnerabilidades                                 |
| CI                  | no reproducía todos los controles                                              | `check:all` + Knip + auditoría de producción       |
| Actividad grupal    | podía escribir el grupo y múltiples miembros                                   | 2 escrituras: grupo y remitente                    |
| Claves de señal     | una lectura por ID                                                             | una consulta por lote y caché de Baileys           |
| Combate a distancia | `distance` solo vivía en memoria                                               | columna, migración, carga y escritura persistentes |

## Cambios implementados

### Integración sin pérdida de v1.6

- Se partió de un clon nuevo de `AI_rolbot` y se integró la historia de `main` con un merge real, sin force-push.
- Se conservaron los sistemas nuevos de ítems, equipamiento, materiales, tiers, durabilidad, distancia, fatiga, dummy equipado y UI por secciones.
- Se corrigieron pruebas heredadas que dependían de un Supabase local real y se mantuvo el agregador compatible `messageFormatUtils`.
- La versión de esquema quedó centralizada en `2.3.0`.

### Seguridad

- El propietario ya no tiene un LID privilegiado codificado. Los aliases solo provienen de configuración explícita, se normalizan y se deduplican.
- Un comando denegado se detiene aunque `ctx.reply()` resuelva `undefined`; antes podía continuar y ejecutar la acción protegida.
- Los errores inesperados llegan al manejador central. La respuesta de WhatsApp solo expone un ID corto de correlación y los detalles quedan en logs.
- Se retiraron `catch` externos de comandos y helpers que convertían fallos en mensajes inseguros o falsos éxitos.
- `/bugreport` acepta únicamente JPEG, PNG y WebP, limita el stream y el tamaño declarado a 5 MiB, usa UUID y creación exclusiva, y limpia archivos parciales o huérfanos.
- El cooldown de reportes se reserva antes de descargar y se libera si falla la operación.
- Las tablas privadas del backend —incluidas credenciales en `bot_auth_state`, perfiles, grupos, personajes, inventario y combates— habilitan y fuerzan RLS, revocan acceso de `PUBLIC`, `anon` y `authenticated`, y conservan `service_role`.
- Las rutas de sesión, `.env.local`, logs, bugs y temporales quedan ignoradas por Git.

### Conexión y ciclo de vida

- `index.js` es el único punto de autoarranque; `bot.js` se puede importar y probar sin conectar.
- Un mutex, una generación de socket y guardas de callbacks obsoletos impiden conexiones paralelas.
- Solo puede existir un temporizador de reconexión y se cancela durante la limpieza.
- La consulta de versión de Baileys tiene timeout y fallback.
- La limpieza actúa sobre `sock.ev`, elimina listeners, cancela pairing/scheduler/reconexión y cierra el socket.
- El watchdog mantiene el instante real de desconexión y el dashboard evita ejecutarse sin TTY.
- El estado de autenticación Supabase ya no transforma fallos en “credenciales ausentes”; lectura y escritura fallan de forma visible.
- `makeCacheableSignalKeyStore` reduce accesos repetidos y la carga de claves se agrupa en una sola consulta.

### Rendimiento y consistencia

- La actividad de un mensaje actualiza únicamente el grupo y el remitente, manteniendo caliente la caché del grupo.
- Actividad y economía escriben solo sus columnas, evitando sobrescribir datos de otro dominio por carreras.
- Las operaciones económicas usan el ID canónico del perfil y bloquean auto-transferencias también mediante aliases.
- Actividad de usuario y grupo se procesa en paralelo con logging aislado.
- Las invalidaciones separan perfil, personajes y personaje activo para evitar tanto datos obsoletos como expulsiones innecesarias.
- `/todos` divide el mensaje y adjunta a cada fragmento únicamente sus propios JIDs, reduciendo payload y trabajo de WhatsApp.
- Los helpers administrativos que orquestan servicios se movieron de `utils` a `services`; Dependency Cruiser quedó sin inversiones.
- Se eliminaron exports sin consumidores y configuración muerta; Knip queda limpio.

### Combate y persistencia

- `distance` ahora existe en las migraciones, el esquema esperado, el registro de columnas, la carga y el payload de `combat_sessions`.
- Crear una sesión primero confirma Supabase y luego la publica en memoria.
- Cambios de turno, reacción, distancia, cierre y expiración persisten una copia y solo después actualizan la sesión visible.
- Eliminar una sesión confirma el borrado remoto antes de quitarla de memoria.
- Los comandos esperan `advanceTurn`, `endSession`, `updateDistance` y `removeSession`; no responden como exitosos mientras la escritura sigue en segundo plano.
- Una reacción pendiente renueva `lastTurnAt`.
- Los fallos del cleanup periódico se capturan y registran, evitando rechazos de promesa sin manejar.
- La progresión XP real de v1.6 se preservó; los fallos de XP, HP y durabilidad ya no se silencian.

### Respuestas y experiencia de usuario

- El contexto desenvuelve mensajes efímeros y view-once antes de extraer texto, captions y menciones.
- Los comandos comparten un manejo seguro y coherente de errores con ID rastreable.
- Las respuestas v1.6 por secciones y los resúmenes de arma, armadura, artefactos y sets se conservaron.
- Los nombres de usuario se resuelven desde perfil, metadatos del grupo o etiqueta mencionada, con fallback defensivo.

### Toolchain y dependencias

- Se simplificó ESLint y se retiraron reglas/plugins de alto ruido sin perder controles reales.
- Node mínimo: `20.19.0`.
- Vitest usa URL y clave ficticias solo en pruebas; las suites unitarias no necesitan `.env.local` ni red.
- CI ejecuta instalación reproducible, todos los controles, Knip y auditoría de dependencias de producción.
- Se mantuvieron Baileys 6 estable, Pino 9 y TypeScript 5.9. Las mayores pendientes requieren una migración separada.
- Graphify usa el ejecutable validado y el grafo se regenera al cerrar la entrega.

## Operación obligatoria antes de producción

### P0 — Rotar sesión y sanear historial

`origin/AI_rolbot` y `origin/main` no contienen rutas de autenticación en su punta actual. Sin embargo, las ramas antiguas `origin/AI_bot` y `origin/copia-seguridad` todavía exponen 65 rutas de sesión cada una y esos objetos siguen alcanzables en el historial.

Acciones:

1. Desvincular y volver a vincular la sesión de WhatsApp.
2. Coordinar una reescritura del historial para retirar las rutas de autenticación.
3. Eliminar o sanear las ramas remotas antiguas.
4. Hacerlo con todos los colaboradores coordinados; no forzar esta reescritura de forma unilateral.

### P0 — Aplicar migraciones 003 y 004

Ejecutar en el Supabase real:

1. `src/database/migrations/003_remediation_item_equipment.sql`
2. `src/database/migrations/004_harden_inventory_access.sql`

Después comprobar:

- `combat_sessions.distance` existe, es entero, no negativo y tiene default `5`.
- `anon` y `authenticated` no leen ni mutan `bot_auth_state`, perfiles, personajes, grupos, inventario o combates.
- El backend con `service_role` conserva las operaciones previstas.

### P0 — Smoke test autenticado

Verificar con servicios reales:

- QR o código de vinculación;
- recepción y respuesta en privado y grupo;
- permisos owner/admin y un caso denegado;
- creación, movimiento, cierre y restauración de combate;
- inventario/equipo/durabilidad;
- imagen válida y rechazada en `/bugreport`;
- reinicio, restauración desde Supabase y reconexión tras corte de red.

## Deuda restante priorizada

### P1 — Atomicidad distribuida y multitabla

Una réplica ya serializa la actividad por usuario/grupo y los comandos por chat; además, economía usa el RPC disponible con fallback compatible. Si se ejecutan dos réplicas, los locks locales no coordinan entre procesos. Los cierres de combate que actualizan sesión, personajes e inventario tampoco forman una única transacción PostgreSQL. El siguiente paso correcto es completar RPC transaccionales y probar concurrencia y rollback contra Supabase real.

### P2 — Métricas detalladas

Las métricas agregadas principales se persisten, pero algunos detalles por tipo de mensaje viven en memoria. Solo deben añadirse columnas/tablas después de definir consumidor, retención y costo.

### P2 — Tipado gradual

El chequeo está limpio, aunque gran parte del proyecto sigue usando `// @ts-nocheck`. Conviene migrar primero las fronteras de confianza: contexto WhatsApp, payloads Supabase y comandos administrativos.

### P2 — Mayores retenidas

`npm outdated` ofrece Baileys 7 RC, Pino 10 y TypeScript 7. No se incorporaron porque requieren revisar breaking changes y repetir E2E de WhatsApp; no son una actualización de parche segura.

## Evidencia reproducible

```bash
npm ci
npm run check:all
npm run knip
npm audit --omit=dev
npm run graphify:update
git diff --check -- ':!graphify-out/**'
```

Resultado verificado:

- ESLint: 0 errores y 0 advertencias.
- Typecheck: correcto.
- Dependency Cruiser: 0 violaciones.
- Prettier: correcto.
- Vitest: 44 archivos y 528 pruebas.
- Knip: sin hallazgos.
- Auditoría de producción: 0 vulnerabilidades.

## Límites

- No se modificó el Supabase real.
- No se rotó ni vinculó una sesión real de WhatsApp.
- No se reescribió historia compartida ni se hizo force-push.
- La comprobación local valida el código; el estado productivo solo se confirma con el smoke test autenticado.
