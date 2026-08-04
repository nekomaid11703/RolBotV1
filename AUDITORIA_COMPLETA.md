# Auditoría profunda y optimización de RolBotV1

- Fecha: 2026-08-04
- Repositorio: `https://github.com/nekomaid11703/RolBotV1`
- Base auditada: `7f44385bf328884e5d12108c0db30b195142c73b` (`main`)

## Resultado ejecutivo

La revisión cubrió el flujo completo desde Baileys hasta comandos, servicios y Supabase; además de seguridad, concurrencia, cachés, rendimiento, experiencia de usuario, dependencias, CI y mantenibilidad. La implementación conserva la arquitectura existente y reduce código: fuera de los artefactos generados por Graphify, el balance es aproximadamente 2.300 líneas añadidas y 3.278 eliminadas, incluyendo pruebas.

No existe un estado universalmente "inmejorable": la conexión real de WhatsApp, el esquema desplegado y la carga de producción son parte del sistema. El código local queda endurecido y verificable, pero los tres pasos operativos de prioridad crítica descritos más abajo siguen siendo obligatorios antes de declararlo listo para producción.

## Antes y después

| Control | Estado inicial | Estado optimizado |
| --- | --- | --- |
| ESLint | 897 advertencias | 0 errores y 0 advertencias |
| TypeScript/JSDoc | 2 errores | correcto |
| Vitest | 10 de 22 suites no cargaban; 187 pruebas alcanzaban a pasar | 27 de 27 suites; 304 de 304 pruebas |
| Prettier | 133 archivos con diferencias | correcto |
| `npm audit --omit=dev` | 2 vulnerabilidades altas en producción | 0 vulnerabilidades |
| Knip | archivo, exports y superficies muertas | sin hallazgos |
| CI | invocaba `test:vite`, script inexistente | reproduce la verificación local sin secretos reales |
| Actividad de grupo por mensaje | hasta M + 1 escrituras para M miembros | 2 escrituras: grupo y remitente |
| Lectura de claves de señal | una consulta por ID | una consulta por lote, seguida de caché |
| Reconexión | temporizadores y sockets podían solaparse | un arranque y un temporizador de reconexión activos |

## Cambios implementados

### Seguridad

- Se eliminó el LID de propietario codificado como fallback. Los alias privilegiados ahora solo provienen de configuración explícita y se normalizan sin duplicados.
- `auth/` y cualquier subdirectorio equivalente quedan ignorados por Git.
- `/bugreport` acepta únicamente JPEG, PNG y WebP, limita cada archivo a 5 MiB tanto por metadatos como durante el stream, usa nombres UUID y creación exclusiva, limpia parciales y elimina el archivo si falla la escritura en Supabase.
- El cooldown de `/bugreport` se reserva antes de descargar para impedir solicitudes concurrentes dentro del proceso y se libera si la operación falla.
- La migración inicial de inventario habilita y fuerza RLS. La nueva migración idempotente `003_harden_inventory_access.sql` endurece instalaciones existentes: revoca `PUBLIC`, `anon` y `authenticated`, y conserva acceso para `service_role`.
- Los errores de comandos ya no exponen mensajes internos. El manejador central responde con texto seguro y un identificador corto de correlación para localizar el error en logs.

### Conexión y ciclo de vida de Baileys

- El autoarranque se concentra en `index.js`; `bot.js` exporta el ciclo de vida y puede probarse sin conectar.
- Un mutex de arranque, una generación de socket y guardas contra callbacks obsoletos evitan conexiones paralelas.
- Existe un único temporizador de reconexión; los intentos solo se reinician al abrir la conexión.
- La obtención de versión tiene timeout de 10 segundos y fallback de la librería.
- La limpieza usa el emisor real `sock.ev`, cancela pairing, scheduler y reconexión, y finaliza el socket.
- El watchdog conserva la marca de tiempo de desconexión, el scheduler es idempotente y cancelable, y el dashboard no se ejecuta en procesos sin TTY.
- El estado de autenticación en Supabase deja de convertir errores transitorios en "credenciales ausentes". Las lecturas y escrituras fallan de forma visible y el almacén de claves usa `makeCacheableSignalKeyStore`.

### Rendimiento y consistencia de datos

- La actividad del grupo dejó de actualizar a todos sus miembros en cada mensaje. Solo persiste el grupo y el remitente, mantiene caliente la caché del grupo e invalida únicamente rankings afectados.
- Actividad y economía actualizan solo sus columnas; ya no reescriben una fila completa y por tanto reducen pérdidas por concurrencia entre dominios.
- El ID canónico del perfil se conserva en las escrituras de economía.
- Actividad de usuario y grupo se registra en paralelo con fallos aislados.
- Los cambios de perfil invalidan solo la caché de perfil; los cambios de personaje invalidan además la lista y el personaje activo. Esto evita lecturas obsoletas sin sacrificar el hit rate por cada mensaje.
- El estado de combate se persiste antes de mutar la sesión en memoria. Una inserción o actualización fallida no deja una sesión fantasma local.
- Las operaciones de combate esperan la persistencia de HP y reacciones. Las eliminaciones de sesión fallidas tampoco borran primero el estado en memoria.
- Se corrigió el turno de IA que aplicaba HP al slot equivocado y `/retar`, que formateaba una promesa sin esperar la creación de sesión.

### Respuestas y experiencia de usuario

- Las menciones se extraen después de desenvolver mensajes efímeros, view-once y captions de imagen o video.
- `/todos` asigna a cada fragmento únicamente las menciones que contiene.
- Los fallos inesperados llegan a un único manejador coherente, se registran como error y generan una respuesta segura. Se retiraron decenas de `catch` locales que reportaban falsos éxitos.
- Se eliminó la recompensa de XP ficticia: el servicio era un stub y el bot afirmaba guardar una progresión que no persistía.
- La lectura de inventario de `/ver_pj` ya no oculta silenciosamente un fallo de base de datos.

### Organización y toolchain

- Dependencias compatibles actualizadas sin introducir paquetes nuevos; se mantuvo Baileys 6 estable y Pino 9, evitando migraciones mayores no solicitadas.
- Se eliminó configuración de Stryker sin dependencia, una regla JSDoc de alto ruido, utilidades duplicadas, archivos de prueba manuales y exports sin consumidores.
- La versión de esquema tiene una sola fuente de verdad (`2.1.0`).
- Vitest usa credenciales Supabase ficticias y locales solo en pruebas; CI ya no necesita secretos de producción.
- Prettier tolera los finales de línea nativos del sistema, Dependency Cruiser dejó de cargar TypeScript para un árbol JavaScript y Knip conoce todas las entradas reales.
- Los scripts de Graphify llaman al ejecutable instalado y su grafo se regeneró después de los cambios.

## Hallazgos críticos que requieren operación manual

### P0 — Rotar la sesión y limpiar el historial Git

El `HEAD` actual no contiene rutas de autenticación, pero la inspección segura, sin imprimir secretos, encontró:

- 1.341 coincidencias de rutas de autenticación entre los objetos alcanzables del historial.
- 65 rutas en la punta de `origin/AI_bot`.
- 65 rutas en la punta de `origin/copia-seguridad`.

Acción obligatoria:

1. Desvincular y rotar la sesión de WhatsApp; no asumir que borrar archivos de Git revoca credenciales.
2. Reescribir coordinadamente el historial para retirar esas rutas.
3. Eliminar o sanear ramas remotas obsoletas.
4. Volver a vincular el bot y verificar envío, recepción, multimedia y reconexión.

No se hizo automáticamente porque rota acceso externo y reescribe historia compartida.

### P0 — Aplicar y validar la migración 003

Ejecutar `src/database/migrations/003_harden_inventory_access.sql` en el Supabase real. Después verificar que:

- `anon` y `authenticated` no pueden leer ni mutar `inventory` directamente.
- El backend con `service_role` mantiene las operaciones previstas.

No se aplicó porque no se proporcionó acceso autenticado al proyecto de Supabase.

### P0 — Smoke test autenticado

No había `.env.local` ni una sesión WhatsApp autorizada. Por ello no se comprobó contra servicios reales:

- vinculación por QR/código;
- recepción y respuesta en chat privado y grupo;
- imágenes de `/bugreport`;
- restauración de auth desde Supabase;
- reconexión después de caída de red;
- migraciones sobre el esquema de producción.

Las pruebas locales no sustituyen esta validación.

## Deuda restante priorizada

### P1 — Atomicidad multiinstancia

Los locks de economía e inventario son locales al proceso. Algunas sumas de actividad y el fallback de transferencias siguen siendo ciclos lectura-modificación-escritura. Con dos réplicas pueden perder actualizaciones. El siguiente paso correcto es mover los incrementos, `daily`, cuotas y transferencias a funciones SQL/RPC atómicas y probar concurrencia contra PostgreSQL.

### P1 — Persistencia de métricas

El contador básico de actividad se persiste, pero parte de las métricas detalladas por tipo de mensaje vive en memoria. Si esos datos son requisito operativo, necesitan tabla o columnas, migración y escritura agregada; no conviene añadirlas sin definir primero su consumidor y retención.

### P2 — Tipado gradual

88 de 102 archivos JavaScript de `src` aún empiezan con `// @ts-nocheck`. El chequeo actual está limpio, pero migrar por fronteras de confianza —contexto, Supabase y payloads de comandos— dará más valor que retirar directivas mecánicamente.

### P2 — Tres advertencias arquitectónicas

Dependency Cruiser informa tres inversiones conocidas: `safeQuery` depende del logger, y los helpers administrativos de grupo/economía dependen de `displayNameService`. No forman ciclos ni bloquean el build. Conviene corregirlas cuando se toque ese límite, sin crear una capa abstracta solo para silenciar la herramienta.

### P2 — Mayores retenidas

`npm outdated` deja deliberadamente Baileys 7 RC y Pino 10. Adoptarlas requiere una migración separada, lectura de breaking changes y pruebas E2E de WhatsApp; una auditoría de rendimiento no justifica incorporar una versión candidata a producción.

## Evidencia reproducible

Desde la raíz del repositorio:

```bash
npm ci
npm run check:all
npm run knip
npm audit --omit=dev
npm run graphify:update
git diff --check -- ':!graphify-out/**'
```

Resultado local final esperado:

- ESLint: 0 errores, 0 advertencias.
- Typecheck: correcto.
- Dependency Cruiser: 0 errores, 3 advertencias documentadas.
- Prettier: correcto.
- Vitest: 27 suites y 304 pruebas correctas.
- Knip: sin hallazgos.
- Auditoría de dependencias de producción: 0 vulnerabilidades.

## Límites de esta entrega

- Todos los cambios están solo en `C:\Users\e_grado\Documents\NekoBot`.
- No se creó commit, no se hizo push y no se modificó el repositorio remoto.
- No se rotaron sesiones, no se reescribió historial y no se modificó Supabase.
- Graphify es contenido generado y puede contener diferencias amplias de serialización; el código fuente se valida por separado con `git diff --check -- ':!graphify-out/**'`.
