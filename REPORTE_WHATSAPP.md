_ROLBOTV1 — INTEGRACIÓN Y OPTIMIZACIÓN GENERAL_

_Rama de entrega:_ `AI_rolbot`
_Fecha:_ 04/08/2026

Se volvió a descargar el repositorio desde cero y se tomó como base el trabajo v1.6 de `AI_rolbot`. Después se integraron las optimizaciones hechas en `main`, resolviendo los conflictos sin borrar los cambios nuevos de ítems, equipo, distancia, fatiga ni la interfaz por secciones.

_✅ Lo realizado_

• Se conservaron ítems v2, materiales, tiers, durabilidad, sets, equipo del dummy y UI v1.6.
• Se reforzaron permisos: un comando denegado ya no puede continuar aunque WhatsApp no devuelva objeto al responder.
• Se eliminaron respuestas que exponían errores internos; ahora se muestra un ID de seguimiento y el detalle queda en logs.
• `/bugreport` limita imágenes a JPEG/PNG/WebP y 5 MiB, usa nombres seguros y limpia archivos si falla Supabase.
• Se endurecieron las tablas privadas, incluida `bot_auth_state`, con RLS y acceso exclusivo de `service_role`.
• Se corrigió el ciclo de conexión: un solo arranque, socket y temporizador de reconexión; limpieza y watchdog seguros.
• Las claves de autenticación se consultan por lote y usan la caché nativa de Baileys.
• La actividad grupal bajó a 2 escrituras por mensaje: grupo + remitente.
• Economía y actividad actualizan solo sus columnas y usan el ID canónico del usuario.
• Actividad de usuario y grupo se procesa en paralelo.
• Se añadieron locks por usuario/grupo y una cola por chat para evitar pérdidas de contadores y carreras de combate dentro de una réplica.
• WhatsApp conserva el LID para routing y usa el PN canónico cuando Baileys lo entrega, evitando perfiles y saldos duplicados.
• Se corrigieron las invalidaciones de caché de perfil, personajes y personaje activo.
• `/todos` envía en cada fragmento únicamente las menciones que realmente contiene.
• `distance` ahora se guarda y restaura desde Supabase; antes se perdía al reiniciar.
• Turnos, reacciones, distancia, cierre y borrado de combates esperan la confirmación de Supabase antes de responder como exitosos.
• Los fallos de XP, HP y durabilidad ya no se ocultan.
• Se reorganizaron helpers en la capa correcta y se eliminaron exports/configuración sin uso.
• CI, ESLint, TypeScript, Prettier, Vitest, Knip, auditoría NPM y Graphify quedaron alineados.

_🧪 Validación local_

• ESLint: 0 errores / 0 advertencias.
• Typecheck: correcto.
• Arquitectura: 0 violaciones.
• Prettier: correcto.
• Pruebas: 44 archivos y 528/528 casos aprobados.
• Knip: sin código/exportaciones muertas detectadas.
• Dependencias de producción: 0 vulnerabilidades.

_⚠️ Indicaciones obligatorias antes de producción_

1. Aplicar en Supabase, en orden:
   • `003_remediation_item_equipment.sql`
   • `004_harden_inventory_access.sql`
2. Confirmar que `distance` existe en `combat_sessions` y que `anon/authenticated` no acceden a credenciales, perfiles, inventario ni combates.
3. Configurar `SUPABASE_SERVICE_ROLE_KEY`; `SUPABASE_KEY` queda solo como compatibilidad temporal.
4. Rotar y volver a vincular la sesión de WhatsApp.
5. Coordinar el saneamiento del historial: las ramas antiguas `AI_bot` y `copia-seguridad` todavía contienen rutas de sesión.
6. Hacer un smoke test real: privado, grupo, permisos, combate, equipo, bugreport, reinicio y reconexión.

_Importante:_ las pruebas locales están completas, pero no se declara producción verificada hasta ejecutar esas migraciones y el smoke test con WhatsApp/Supabase reales.
