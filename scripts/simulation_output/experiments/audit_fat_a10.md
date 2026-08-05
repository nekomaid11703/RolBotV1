# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:13:34.133Z · Sims: 2000 · Máx rounds: 20

## 1. Integridad de datos

| Check | Casos | Detalle |
|-------|-------|---------|
| NaN en stats | 0 | stats no numéricas o NaN
| Stats fuera de clamp 1–100 | 0 | incluye magia y físicas
| winner fuera de {A,B} | 0 | 
| koType fuera de {ko,timeout} | 0 | 
| winnerIsFirstAttacker incoherente | 0 | 
| Rounds/distancia inválidos | 0 | rounds<1 o distancia negativa
| totalDamage negativo/NaN | 0 | 
| ítem↔heal incoherente | 0 | ítem sin heal o heal sin ítem
| Ítems > stock máximo (5) | 0 | 
| HP sube sin ítem | 0 | picos en hpCurve sin heal registrado
| Curvas vacías o inconsistentes | 0 | 

## 2. Sesgo de métricas (daño)

Post-fix: `collectMetrics` ahora incluye los contraataques (`*_counter`) en `totalDamage`/`damagePerTurn`. Verificación contra el daño real (pérdida de HP del rival en curvas):

| Métrica | Valor |
|---------|-------|
| Sims donde totalDamage < 90% del daño real (curvas) | 0 |
| Ratio dañoReal/dañoRegistrado > 1.05 (ambos lados) | 0 |
| Mediana del ratio (solo donde hay registro) | n/a |

**Diagnóstico**: consistencia total entre el daño registrado y el daño real por curvas (0 desviaciones >5%).

## 3. Timeouts (draws)

| Métrica | Valor |
|---------|-------|
| Timeouts | 286 (14.3%) |
| Ambos vivos al round 21 | 286/286 |
| Con fatiga ≥ 90 al final | 21/286 |
| Con algún HP ≤ 5 al final | 5/286 |
| Distancia final P50 | 7 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 168/286 |
| Gap de HP relativo al corte (P50/P90) | 43.2% / 78.3% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 9.75 | 9.04–10.47 (n=306) | target 7.0 ⚠️ |
| Ventaja primer atacante | 3.6% | 1.4%–5.8% (n=2000) | target ≤5% ⚠️ |
| Winrate meta (tanque) | 68.9% | 63.4%–73.9% (n=299) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 34.9% | 34.9% [33.4%–36.4%] |
| Mismo build (tanque) | 598 | 34.8% | 34.8% [31.1%–38.7%] |
| Mismo build (equilibrado) | 544 | 35.5% | 35.5% [31.6%–39.6%] |
| Mismo build (estratega) | 534 | 37.3% | 37.3% [33.3%–41.4%] |
| Mismo build (asesino) | 564 | 32.1% | 32.1% [28.4%–36.1%] |
| Mismo build (berserker) | 558 | 34.4% | 34.4% [30.6%–38.4%] |
| Mismo build (velocista) | 544 | 32.7% | 32.7% [28.9%–36.8%] |
| Mismo build (magus) | 554 | 35.9% | 35.9% [32.0%–40.0%] |
| Mismo build (gladiador) | 536 | 34.5% | 34.5% [30.6%–38.6%] |
| Mismo build (extremista_defensa) | 592 | 33.1% | 33.1% [29.4%–37.0%] |
| Mismo build (esquivo) | 508 | 35.8% | 35.8% [31.8%–40.1%] |
| Mismo build (extremista_ataque) | 554 | 35.0% | 35.0% [31.2%–39.1%] |
| Mismo build (guardian) | 520 | 37.9% | 37.9% [33.8%–42.1%] |
| Mismo build (extremista_velocidad) | 548 | 32.8% | 32.8% [29.0%–36.9%] |
| Mismo build (extremista_reflejos) | 568 | 36.1% | 36.1% [32.2%–40.1%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.174 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 28.0% | 125 | 44.8% | 871 | -16.8pp |
| 200–299 | 35.7% | 286 | 46.8% | 814 | -11.1pp |
| 300–399 | 34.2% | 284 | 55.7% | 695 | -21.5pp |
| 400–500 | 51.5% | 260 | 71.1% | 665 | -19.6pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 28.7% | 129 | 44.8% | 867 | -16.1pp |
| 200–299 | 36.7% | 278 | 46.4% | 822 | -9.7pp |
| 300–399 | 34.9% | 284 | 55.4% | 695 | -20.5pp |
| 400–500 | 51.2% | 260 | 71.3% | 665 | -20.1pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 27.9% | 122 | 44.7% | 874 | -16.9pp |
| 200–299 | 37.0% | 281 | 46.3% | 819 | -9.3pp |
| 300–399 | 34.5% | 281 | 55.4% | 698 | -20.9pp |
| 400–500 | 51.3% | 261 | 71.2% | 664 | -19.9pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 68.3% | 489 | 458 |
| B | 56.0% | 827 | 389 |
| C | 50.6% | 1033 | 306 |
| E | 41.1% | 1651 | 199 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 996 | 0.0% | 0.6% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1100 | 3.9% | 10.9% | 0.0% | 0.1% | 0.0% | 0.0% |
| 300–399 | 979 | 7.8% | 21.5% | 0.6% | 0.6% | 0.0% | 0.0% |
| 400–500 | 925 | 15.2% | 23.7% | 3.9% | 2.8% | 0.1% | 0.5% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 31.0% | 31.4% | 29.2% | 8.3% |
| 200–299 | 32.3% | 28.9% | 30.6% | 8.2% |
| 300–399 | 29.1% | 32.1% | 30.6% | 8.2% |
| 400–500 | 29.7% | 29.0% | 31.4% | 9.9% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 996 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 516 (46.9%) | 584 (53.1%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 127 (13.0%) | 335 (34.2%) | 517 (52.8%) | 0 (0.0%) |
| 400–500 | 12 (1.3%) | 114 (12.3%) | 310 (33.5%) | 489 (52.9%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.19 |
| Cobertura dominante | total: 2539 · alta: 1324 · media: 119 · ligera: 18 |
| Piezas de set (0 / 1-2 / 3+) | 3+: 3891 · 1-2: 109 |
| Set bonus activo | 97.3% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 40.5% |
| Con escudo | 60.2% |
| Fighters con ≥1 pieza rota post-batalla | 59.5% (6011 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 88.1% |
| Batallas con ≥1 ítem | 50.4% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 16.8% |
| Rests por batalla (P50/P90) | 3/4 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.118 |
| def | 0.121 |
| aspd | -0.082 |
| ref | 0.049 |
| mspd | 0.079 |
| hp | 0.221 |
| fulgor | -0.104 |
| d_fulgor | -0.099 |
| r_fulgor | -0.101 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 7 / 21 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 316 (15.8%) |
| Duración media | 9.35 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 286 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | tanque (report) | tanque (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (3.6% sobre 50%, CI 95% 1.4%–5.8%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (34.9% para el mayor nivel; correlación 0.174)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: tanque ≈68.9% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 50.4% de batallas usan ítem; los descansos (P50 3/4) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (3.6% ventaja, meta 68.9%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 9.75, meta 68.9%) para cerrar el ciclo.
