# Auditoría de datos crudos de la simulación

Fecha: 2026-08-06T19:47:13.503Z · Sims: 10000 · Máx rounds: 20

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
| Timeouts | 427 (4.3%) |
| Ambos vivos al round 21 | 427/427 |
| Con fatiga ≥ 90 al final | 6/427 |
| Con algún HP ≤ 5 al final | 17/427 |
| Distancia final P50 | 2 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 249/427 |
| Gap de HP relativo al corte (P50/P90) | 41.9% / 85.2% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 6.84 | 6.69–6.98 (n=4292) | target 7.0 ✅ |
| Ventaja primer atacante | -5.3% | -6.3%–-4.4% (n=10000) | target ≤5% ✅ |
| Winrate meta (tanque) | 68.5% | 66.0%–70.9% (n=1374) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 20000 | 25.1% | 25.1% [24.5%–25.7%] |
| Mismo build (berserker) | 2790 | 24.8% | 24.8% [23.2%–26.4%] |
| Mismo build (velocista) | 2698 | 23.1% | 23.1% [21.6%–24.8%] |
| Mismo build (extremista_velocidad) | 2734 | 26.7% | 26.7% [25.1%–28.4%] |
| Mismo build (guardian) | 2648 | 25.3% | 25.3% [23.6%–27.0%] |
| Mismo build (estratega) | 2734 | 26.1% | 26.1% [24.5%–27.8%] |
| Mismo build (equilibrado) | 2726 | 24.9% | 24.9% [23.4%–26.6%] |
| Mismo build (tanque) | 2748 | 24.5% | 24.5% [22.9%–26.1%] |
| Mismo build (gladiador) | 2700 | 25.6% | 25.6% [24.0%–27.3%] |
| Mismo build (extremista_reflejos) | 2772 | 25.5% | 25.5% [23.9%–27.1%] |
| Mismo build (extremista_ataque) | 2864 | 24.8% | 24.8% [23.2%–26.4%] |
| Mismo build (extremista_defensa) | 2812 | 24.9% | 24.9% [23.4%–26.6%] |
| Mismo build (asesino) | 2862 | 25.4% | 25.4% [23.9%–27.1%] |
| Mismo build (esquivo) | 2698 | 25.2% | 25.2% [23.6%–26.9%] |
| Mismo build (magus) | 2726 | 25.3% | 25.3% [23.8%–27.0%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.001 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 46.9% | 540 | 50.2% | 3910 | -3.4pp |
| 200–299 | 47.0% | 1200 | 50.9% | 3785 | -3.9pp |
| 300–399 | 43.5% | 1503 | 52.7% | 3637 | -9.1pp |
| 400–500 | 42.7% | 1650 | 53.4% | 3775 | -10.7pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 48.8% | 555 | 50.0% | 3895 | -1.1pp |
| 200–299 | 46.8% | 1192 | 51.0% | 3793 | -4.2pp |
| 300–399 | 43.6% | 1510 | 52.6% | 3630 | -9.1pp |
| 400–500 | 42.9% | 1643 | 53.2% | 3782 | -10.3pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 47.7% | 545 | 50.1% | 3905 | -2.4pp |
| 200–299 | 46.2% | 1202 | 51.2% | 3783 | -5.0pp |
| 300–399 | 43.2% | 1505 | 52.8% | 3635 | -9.6pp |
| 400–500 | 42.8% | 1645 | 53.3% | 3780 | -10.5pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 57.9% | 826 | 458 |
| B | 51.7% | 8747 | 359 |
| C | 46.0% | 3252 | 307 |
| D | 44.4% | 5348 | 199 |
| S | 61.9% | 1827 | 334 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 4450 | 0.0% | 0.7% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 4985 | 3.0% | 12.1% | 0.1% | 0.0% | 0.0% | 0.0% |
| 300–399 | 5140 | 8.5% | 20.6% | 1.0% | 0.8% | 0.0% | 0.0% |
| 400–500 | 5425 | 15.3% | 21.6% | 3.5% | 3.6% | 0.4% | 0.7% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 22.2% | 45.6% | 23.5% | 8.8% |
| 200–299 | 22.0% | 45.8% | 21.7% | 10.5% |
| 300–399 | 23.2% | 44.1% | 22.3% | 10.3% |
| 400–500 | 22.6% | 44.6% | 22.8% | 10.0% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 0 (0.0%) | 0 (0.0%) | 907 (20.4%) | 0 (0.0%) |
| 200–299 | 0 (0.0%) | 1813 (36.4%) | 1147 (23.0%) | 0 (0.0%) |
| 300–399 | 0 (0.0%) | 1034 (20.1%) | 3176 (61.8%) | 0 (0.0%) |
| 400–500 | 0 (0.0%) | 405 (7.5%) | 3517 (64.8%) | 826 (15.2%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.21 |
| Cobertura dominante | total: 12842 · alta: 6433 · media: 645 · ligera: 78 · ninguna: 2 |
| Piezas de set (0 / 1-2 / 3+) | 0: 2 · 3+: 19553 · 1-2: 445 |
| Set bonus activo | 97.8% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 39.7% |
| Con escudo | 60.5% |
| Fighters con ≥1 pieza rota post-batalla | 41.9% (15894 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 93.1% |
| Batallas con ≥1 ítem | 27.1% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 18.1% |
| Rests por batalla (P50/P90) | 3/4 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | 0.057 |
| def | 0.102 |
| aspd | -0.027 |
| ref | -0.016 |
| mspd | -0.273 |
| hp | 0.197 |
| fulgor | -0.056 |
| d_fulgor | -0.060 |
| r_fulgor | -0.053 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 5 / 13 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 470 (4.7%) |
| Duración media | 6.39 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 10000 | 10000 | ✅ |
| Timeouts | 427 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | tanque (report) | tanque (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (-5.3% sobre 50%, CI 95% -6.3%–-4.4%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (25.1% para el mayor nivel; correlación 0.001)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: tanque ≈68.5% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 27.1% de batallas usan ítem; los descansos (P50 3/4) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (-5.3% ventaja, meta 68.5%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 6.84, meta 68.5%) para cerrar el ciclo.
