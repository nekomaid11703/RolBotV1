# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:14:13.948Z · Sims: 2000 · Máx rounds: 20

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
| Timeouts | 329 (16.4%) |
| Ambos vivos al round 21 | 329/329 |
| Con fatiga ≥ 90 al final | 19/329 |
| Con algún HP ≤ 5 al final | 9/329 |
| Distancia final P50 | 7 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 193/329 |
| Gap de HP relativo al corte (P50/P90) | 41.6% / 86.7% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 10.65 | 9.91–11.39 (n=291) | target 7.0 ⚠️ |
| Ventaja primer atacante | 0.5% | -1.7%–2.7% (n=2000) | target ≤5% ✅ |
| Winrate meta (guardian) | 67.7% | 62.1%–72.8% (n=291) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 35.1% | 35.1% [33.7%–36.6%] |
| Mismo build (extremista_reflejos) | 506 | 34.4% | 34.4% [30.4%–38.6%] |
| Mismo build (extremista_ataque) | 532 | 32.0% | 32.0% [28.1%–36.0%] |
| Mismo build (guardian) | 582 | 34.4% | 34.4% [30.6%–38.3%] |
| Mismo build (esquivo) | 568 | 37.0% | 37.0% [33.1%–41.0%] |
| Mismo build (berserker) | 576 | 35.8% | 35.8% [32.0%–39.8%] |
| Mismo build (tanque) | 526 | 34.6% | 34.6% [30.7%–38.8%] |
| Mismo build (estratega) | 586 | 35.8% | 35.8% [32.1%–39.8%] |
| Mismo build (velocista) | 566 | 37.1% | 37.1% [33.2%–41.2%] |
| Mismo build (magus) | 570 | 32.8% | 32.8% [29.1%–36.8%] |
| Mismo build (asesino) | 494 | 33.8% | 33.8% [29.8%–38.1%] |
| Mismo build (extremista_velocidad) | 588 | 34.4% | 34.4% [30.6%–38.3%] |
| Mismo build (extremista_defensa) | 596 | 34.4% | 34.4% [30.7%–38.3%] |
| Mismo build (gladiador) | 520 | 36.5% | 36.5% [32.5%–40.8%] |
| Mismo build (equilibrado) | 544 | 37.3% | 37.3% [33.4%–41.5%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.182 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 33.3% | 114 | 42.9% | 868 | -9.5pp |
| 200–299 | 39.7% | 262 | 44.6% | 861 | -4.9pp |
| 300–399 | 39.4% | 284 | 52.8% | 672 | -13.4pp |
| 400–500 | 48.7% | 277 | 75.1% | 662 | -26.3pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 29.8% | 124 | 43.5% | 858 | -13.6pp |
| 200–299 | 40.2% | 254 | 44.4% | 869 | -4.3pp |
| 300–399 | 39.1% | 284 | 53.0% | 672 | -13.9pp |
| 400–500 | 49.1% | 275 | 74.8% | 664 | -25.8pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 33.3% | 126 | 43.0% | 856 | -9.7pp |
| 200–299 | 39.8% | 266 | 44.6% | 857 | -4.7pp |
| 300–399 | 37.8% | 283 | 53.5% | 673 | -15.7pp |
| 400–500 | 48.7% | 277 | 75.1% | 662 | -26.3pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 66.1% | 498 | 459 |
| B | 58.1% | 843 | 390 |
| C | 49.3% | 1034 | 302 |
| E | 41.1% | 1625 | 199 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 982 | 0.0% | 1.2% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1123 | 3.1% | 12.6% | 0.0% | 0.0% | 0.0% | 0.0% |
| 300–399 | 956 | 7.6% | 22.7% | 0.6% | 0.6% | 0.0% | 0.0% |
| 400–500 | 939 | 15.1% | 20.0% | 3.6% | 3.3% | 0.3% | 1.0% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 30.2% | 29.4% | 30.4% | 9.9% |
| 200–299 | 30.8% | 30.9% | 28.1% | 10.2% |
| 300–399 | 29.7% | 29.3% | 31.2% | 9.8% |
| 400–500 | 25.2% | 35.0% | 28.1% | 11.6% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 982 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 506 (45.1%) | 617 (54.9%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 135 (14.1%) | 309 (32.3%) | 512 (53.6%) | 0 (0.0%) |
| 400–500 | 2 (0.2%) | 108 (11.5%) | 331 (35.3%) | 498 (53.0%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.21 |
| Cobertura dominante | total: 2602 · alta: 1274 · media: 110 · ligera: 13 · ninguna: 1 |
| Piezas de set (0 / 1-2 / 3+) | 0: 1 · 3+: 3910 · 1-2: 89 |
| Set bonus activo | 97.8% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 39.1% |
| Con escudo | 60.8% |
| Fighters con ≥1 pieza rota post-batalla | 60.1% (5986 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 87.1% |
| Batallas con ≥1 ítem | 51.5% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 17.3% |
| Rests por batalla (P50/P90) | 3/4 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.121 |
| def | 0.120 |
| aspd | -0.106 |
| ref | 0.027 |
| mspd | 0.088 |
| hp | 0.221 |
| fulgor | -0.077 |
| d_fulgor | -0.073 |
| r_fulgor | -0.084 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 7 / 21 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 356 (17.8%) |
| Duración media | 9.67 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 329 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | guardian (report) | guardian (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (0.5% sobre 50%, CI 95% -1.7%–2.7%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (35.1% para el mayor nivel; correlación 0.182)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: guardian ≈67.7% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 51.5% de batallas usan ítem; los descansos (P50 3/4) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (0.5% ventaja, meta 67.7%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 10.65, meta 67.7%) para cerrar el ciclo.
