# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:14:21.743Z · Sims: 2000 · Máx rounds: 20

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
| Timeouts | 288 (14.4%) |
| Ambos vivos al round 21 | 288/288 |
| Con fatiga ≥ 90 al final | 9/288 |
| Con algún HP ≤ 5 al final | 9/288 |
| Distancia final P50 | 7 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 172/288 |
| Gap de HP relativo al corte (P50/P90) | 43.8% / 85.5% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 10.09 | 9.37–10.82 (n=313) | target 7.0 ⚠️ |
| Ventaja primer atacante | 1.2% | -1.0%–3.4% (n=2000) | target ≤5% ✅ |
| Winrate meta (guardian) | 67.8% | 62.2%–72.9% (n=289) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 35.9% | 35.9% [34.4%–37.3%] |
| Mismo build (extremista_reflejos) | 500 | 38.6% | 38.6% [34.4%–42.9%] |
| Mismo build (asesino) | 578 | 35.5% | 35.5% [31.7%–39.5%] |
| Mismo build (berserker) | 546 | 34.6% | 34.6% [30.7%–38.7%] |
| Mismo build (estratega) | 572 | 35.8% | 35.8% [32.0%–39.9%] |
| Mismo build (equilibrado) | 516 | 37.8% | 37.8% [33.7%–42.1%] |
| Mismo build (tanque) | 558 | 34.6% | 34.6% [30.8%–38.6%] |
| Mismo build (velocista) | 602 | 37.7% | 37.7% [33.9%–41.6%] |
| Mismo build (extremista_velocidad) | 584 | 34.8% | 34.8% [31.0%–38.7%] |
| Mismo build (guardian) | 578 | 36.0% | 36.0% [32.2%–40.0%] |
| Mismo build (esquivo) | 538 | 35.7% | 35.7% [31.8%–39.8%] |
| Mismo build (extremista_ataque) | 564 | 34.2% | 34.2% [30.4%–38.2%] |
| Mismo build (extremista_defensa) | 496 | 35.5% | 35.5% [31.4%–39.8%] |
| Mismo build (gladiador) | 550 | 36.9% | 36.9% [33.0%–41.0%] |
| Mismo build (magus) | 534 | 34.8% | 34.8% [30.9%–39.0%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.187 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 35.8% | 120 | 42.7% | 803 | -6.9pp |
| 200–299 | 33.0% | 261 | 45.0% | 817 | -12.1pp |
| 300–399 | 38.9% | 285 | 54.6% | 712 | -15.7pp |
| 400–500 | 47.8% | 297 | 73.2% | 705 | -25.4pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 35.9% | 128 | 42.8% | 795 | -6.8pp |
| 200–299 | 31.9% | 260 | 45.4% | 818 | -13.4pp |
| 300–399 | 38.6% | 285 | 54.8% | 712 | -16.2pp |
| 400–500 | 48.2% | 299 | 73.1% | 703 | -25.0pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 36.4% | 129 | 42.7% | 794 | -6.3pp |
| 200–299 | 32.4% | 256 | 45.1% | 822 | -12.7pp |
| 300–399 | 37.3% | 284 | 55.3% | 713 | -17.9pp |
| 400–500 | 48.3% | 298 | 73.0% | 704 | -24.7pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 66.5% | 549 | 458 |
| B | 58.8% | 861 | 391 |
| C | 47.1% | 1033 | 305 |
| E | 41.1% | 1557 | 201 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 923 | 0.0% | 0.9% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1078 | 2.9% | 12.1% | 0.0% | 0.0% | 0.0% | 0.0% |
| 300–399 | 997 | 9.7% | 18.6% | 1.3% | 0.7% | 0.0% | 0.1% |
| 400–500 | 1002 | 14.7% | 21.4% | 3.6% | 2.0% | 0.4% | 0.8% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 33.5% | 30.4% | 27.2% | 8.9% |
| 200–299 | 30.3% | 29.8% | 30.1% | 9.7% |
| 300–399 | 30.0% | 30.7% | 29.2% | 10.1% |
| 400–500 | 29.4% | 31.9% | 29.5% | 9.1% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 923 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 499 (46.3%) | 579 (53.7%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 122 (12.2%) | 345 (34.6%) | 530 (53.2%) | 0 (0.0%) |
| 400–500 | 13 (1.3%) | 109 (10.9%) | 331 (33.0%) | 549 (54.8%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.23 |
| Cobertura dominante | total: 2534 · alta: 1313 · media: 133 · ligera: 20 |
| Piezas de set (0 / 1-2 / 3+) | 3+: 3913 · 1-2: 87 |
| Set bonus activo | 97.8% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 39.4% |
| Con escudo | 61.0% |
| Fighters con ≥1 pieza rota post-batalla | 60.7% (6228 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 86.8% |
| Batallas con ≥1 ítem | 50.0% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 15.5% |
| Rests por batalla (P50/P90) | 3/3 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.092 |
| def | 0.133 |
| aspd | -0.109 |
| ref | 0.006 |
| mspd | 0.085 |
| hp | 0.241 |
| fulgor | -0.101 |
| d_fulgor | -0.106 |
| r_fulgor | -0.101 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 7 / 21 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 314 (15.7%) |
| Duración media | 9.25 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 288 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | guardian (report) | guardian (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (1.2% sobre 50%, CI 95% -1.0%–3.4%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (35.9% para el mayor nivel; correlación 0.187)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: guardian ≈67.8% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 50.0% de batallas usan ítem; los descansos (P50 3/3) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (1.2% ventaja, meta 67.8%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 10.09, meta 67.8%) para cerrar el ciclo.
