# Plan: Implementacion de Stats Magicas + Correcciones

## Contexto
Se añadieron 3 stats (FULGOR, D_FULGOR, R_FULGOR), se cambio la suma
de puntos por raza de 10 a 50. FREE_POINTS = 50 (nivel minimo 100).
Posteriormente se amplio a 21 razas canon y se deshabilito el sistema de XP.

## Fase 1 — Stats Magicas + Razas (COMPLETADO)
- [x] LEVELABLE_STATS: +3 keys (fulgor, d_fulgor, r_fulgor)
- [x] DEFAULT_CHARACTER_STATS: +3 keys en 0
- [x] RACES: redistribucion inicial a suma=50 (4 razas)
- [x] CLASES: redistribucion a suma=50
- [x] combatEngine.js: normalizeStats() con alias
- [x] combatState.js: generateDummyCharacter() con 8 keys
- [x] combatMessages.js: buildStatSummary() con 8 keys
- [x] characterService.js: validacion totalRace=50
- [x] crear_pj.js: regex parseStatLine con nuevos labels
- [x] clases.js: baseStats actualizadas
- [x] FREE_POINTS = 50, LEVEL_INITIAL = 100
- [x] Tests actualizados

## Fase 2 — Migracion y Desbloqueos (COMPLETADO)
- [x] Migracion automatica de stats mágicas para personajes antiguos (normalizeCharacterRecord)
- [x] Sistema de desbloqueo de habilidades deshabilitado
- [x] XP de batallas deshabilitada (addXp no-op)
- [x] Template crear_pj limpio (clases en notas, historia simplificada)

## Fase 3 — 21 Razas Canon (COMPLETADO)
- [x] 21 razas implementadas con stats balanceadas (suma=50 c/u)
- [x] Aliases multilingue para cada raza
- [x] Sistema extensible: agregar raza = 1 entrada en RACES

## Detalle tecnico
- Personajes antiguos: reciben fulgor/d_fulgor/r_fulgor base de su raza al cargar
- Sin migracion SQL: stats son JSONB, normalizeStats() rellena defaults
- Skills: todas disponibles sin restriccion de nivel/slots
- XP: deshabilitada temporalmente, addXp() es no-op
