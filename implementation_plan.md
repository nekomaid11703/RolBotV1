# Plan maestro: siguiente paso para la IA de RolBotV1

## 1. Resumen del objetivo

- Definir la estrategia inmediata de la IA (Codex + Antigravity) para avanzar la evolución del bot RPG, aprovechando el ecosistema actual (supabase, memoria en NekoMemori, arquitectura modular). Queremos asegurar que la próxima iteración de trabajo responda a una visión clara antes de que Antigravity escriba código.

## 2. Alertas y puntos que requieren revisión del usuario

1. **Enfoque de la siguiente iteración:** ¿Queremos priorizar nuevas capacidades narrativas (e.g., gestión de personajes y grupos) o fortalecer la integración con memoria persistente (e.g., trazabilidad de contexto en la conversación)?
2. **Requerimientos de pruebas:** ¿Qué criterios específicos de verificación debe incluirse para validar que la IA toma decisiones coherentes (logs, simulaciones, QA manual)?

## 3. Lista detallada de cambios propuestos

1. **Documentar la visión arquitectónica de la IA**
   - Describir el flujo entre Codex (planificación) y Antigravity (implementación) utilizando [src/core/bot](file:///c:/IA_rolbot/RolBotV1/src/core/bot.js) y los adaptadores actuales.
   - Identificar qué partes del bot necesitan potenciar la cultura de memoria (e.g., `ai-memory/rolbot-memory.jsonl`, `supabaseAuthState`).

2. **Especificar nuevas tareas para Antigravity**
   - Detallar los nuevos archivos o módulos propuestos (por ejemplo, `src/services/ai-agent-controller`, `src/utils/memory-sync`) con un resumen de responsabilidades sin escribir código todavía.
   - Incluir instrucciones para crear el `task.md` y actualizar `AI_CHANGELOG.md` al comenzar la ejecución.

3. **Planificar el proceso de verificación y seguimiento**
   - Definir pasos de revisión manual (revisión de logs, pruebas con escenarios de conversación) antes de considerar la iteración como completa.
   - Preparar una nota para el changelog con fecha y alcance una vez que la implementación esté aprobada.

## 4. Plan de verificación y pruebas

- Obtener confirmación explícita del usuario sobre la prioridad propuesta en la sección 2 antes de pasar a ejecución.
- Validar que el plan en `implementation_plan.md` contiene enlaces a los artefactos relevantes y que el siguiente cambio sea rastreable en `task.md`.
- Solicitar a Antigravity que registre en NekoMemori la aprobación del plan y cualquier decisión adicional relacionada con la memoria.

## 5. Siguientes pasos tras la aprobación

1. Registrar la decisión en NekoMemori (este paso se realiza automáticamente con `record_decision`).
2. Crear `task.md` y comenzar la fase de ejecución guiada por el plan.
3. Asegurar que todo cambio nuevo se documente en `AI_CHANGELOG.md` y que los resultados de verificación estén disponibles para revisión.

## 6. Plan para el escaneo profundo y migración de usuarios

1. **Mapeo del estado actual**
   - Revisar los módulos que más participan en la gestión de usuarios (`src/database/auth`, `src/core/bot`, `src/core/supabaseAuthState`, servicios relacionados) y documentar la ruta completa de creación/actualización de datos.
   - Identificar dependencias locales (archivos JSON, variables de entorno sin respaldo) que impiden que el bot sea portable.

2. **Escaneo de errores y áreas de mejora**
   - Ejecutar análisis manual (balance entre logs y lectura de archivos clave) para detectar duplicación de lógica, validaciones omitidas o puntos sin manejo de errores.
   - Priorizar hallazgos según impacto en la estabilidad del bot (sesiones, pérdida de memoria, fallos en eventos) y proponer acciones de refactorización o documentación.

3. **Diseño de la migración hacia Supabase**
   - Establecer el esquema destino en Supabase (tablas, columnas, restricciones) para la información de usuarios, partiendo de `auth/`, `grupos/` y `personajes/`.
   - Definir el mecanismo de exportación de los datos locales y la transformación necesaria (estructuras JSON -> filas/columnas). Esta fase incluye validar que las credenciales sensibles se mantengan seguras y que la migración sea reversable.
   - Crear un script o conjunto de utilidades (documentados sin codificación directa) que Antigravity implementará posteriormente para automatizar la transferencia y las comprobaciones integradas.

4. **Verificación posterior a la migración**
   - Validar que los datos migrados son consistentes (conteo, unicidad, referencias entre tablas) y que el bot consume los registros desde Supabase sin depender de archivos locales.
   - Asegurar que se implementan tests o simulaciones básicas (por ejemplo, iniciar `src/core/bot` con un entorno controlado) para confirmar que la sesión y los comandos funcionan con la nueva persistencia.

## 7. Resolución del permiso denegado en las tablas `players` y `groups`

1. **Diagnóstico rápido**
   - Confirma que el bot usa la clave **service_role** de Supabase (`SUPABASE_KEY`) y no la clave pública (anon). Las operaciones de servidor requieren privilegios completos para evitar RLS denegando los accesos.
   - Verifica que el rol que ejecuta las migraciones tiene habilitado `Row Level Security` y políticas que permitan `SELECT/INSERT/UPDATE/DELETE`. Al habilitar RLS, también hay que agregar `WITH CHECK (true)` para garantizar inserciones.

2. **Actualización de las políticas en el script de migración**
   - Agregar políticas explícitas para cada acción (SELECT, INSERT, UPDATE, DELETE) que permitan acceso cuando `auth.role() = 'service_role'` o cuando se utilice el helper del bot.
   - Ejemplo:
     ```sql
     CREATE POLICY "bot_access_players" ON public.players
       FOR ALL
       USING (auth.role() = 'service_role')
       WITH CHECK (auth.role() = 'service_role');
     ```
   - Repetir para `groups` y `group_members`.

3. **Verificación y seguimiento**
   - Tras aplicar las políticas, ejecutar un script de prueba (o usar la CLI) para insertar y consultar datos en `players`/`groups` usando la clave configurada. Registrar el resultado en NekoMemori.
   - Documentar en `AI_CHANGELOG.md` la corrección y, si procede, agregar una nota al `task.md` con la verificación lograda.

## 8. Plan de ejecución general para la limpieza y mejora

1. **Preparación del entorno**
   - Crear `task.md` con las tareas derivadas del plan y asignar los estados iniciales (pendiente/en progreso).
   - Revisar y asegurar que las variables de entorno críticas (`.env`, `.env.example`) contienen los valores mínimos necesarios y eliminar valores vencidos o duplicados.

2. **Identificación y eliminación de código muerto**
   - Auditar `src/commands`, `src/services`, `src/utils` y cualquier módulo no referenciado desde el loader principal. Marcar archivos o funciones sin uso y documentar si deben eliminarse o reescribirse.
   - Verificar que los comandos registrados en `commandHandler` (o similar) coinciden con los archivos disponibles; eliminar comandos huérfanos y consolidar lógica duplicada cuando corresponda.

3. **Limpieza de configuraciones y documentación**
   - Normalizar `package.json`, `README.md`, `nodemon.json`, `AI_CHANGELOG.md` y otros archivos de configuración para reflejar la arquitectura actual (e.g., reemplazar referencias obsoletas a herramientas o rutas).
   - Asegurar que `.gitignore` sigue protegiendo artefactos sensibles (variables, logs) y que el `supabase_migration.sql` está documentado adecuadamente con los pasos de configuración de RLS.

4. **Mejoras estructurales y verificación**
   - Priorizar las mejoras detectadas durante la auditoría (falta de validación, logging redundante, políticas de seguridad) y describir el impacto estimado.
   - Crear scripts o pasos concretos para verificar (simular ejecución mínima de `startBot`, probar migración de usuarios, validar logs) antes de cerrar la limpieza.

5. **Seguimiento y documentación del resultado**
   - Registrar en `AI_CHANGELOG.md` cada bloque de trabajo completado (limpieza, migración, políticas RLS).
   - Notificar en NekoMemori la finalización del plan de limpieza y documentar los aprendizajes/pendientes.

## 9. Plan de optimización para el uso de tokens

1. **Resumen reducido del consumo actual**
   - Identificar las interacciones de Codex que generan mayor volumen de tokens (auditoría, documentar planes, análisis de archivos) y registrar solo los resultados clave en NekoMemori para evitar repetir contenidos completos en cada ciclo.
   - Evitar reenviar información ya cubierta en `implementation_plan.md`, `task.md` o `AI_CHANGELOG.md` y referenciar esos documentos cuando se necesite contexto.

2. **Roles y prompts ligeros**
   - Codex se concentra en la planificación estratégica y envía a Antigravity resúmenes concisos con objetivos y archivos específicos. Cualquier análisis profundo debe guardarse en puntos de control (memoria) y reutilizarse.
   - Antigravity recibe solo el contexto esencial (qué debe cambiar, qué archivos afectan) y responde con actualizaciones puntuales de progreso, manteniendo sus prompts centrados en resultados verificados.

3. **Reutilización inteligente y checkpoints**
   - Usar plantillas de prompts que reutilicen datos previos en vez de generar texto completo cada vez. Guardar checkpoints de decisiones y estados en NekoMemori para que ambos agentes consulten en lugar de re-analizar.
   - Aprovechar `task.md` y los cambios registrados en `AI_CHANGELOG.md` como referencia para nuevos pasos; cuando se detecta que no hay cambios, saltar el análisis repetitivo.

4. **Métricas y límites operativos**
   - Definir un umbral sensible (ej. 1200 tokens para Codex, 800 para Antigravity) por ciclo de interacción y activar prompts de diagnóstico corto cuando se acerquen a ese límite.
   - Registrar en NekoMemori cada vez que se alcance un pico de tokens para aprender de los patrones y ajustar las respuestas futuras.
