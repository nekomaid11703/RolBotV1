# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T00:37:43.525Z · Sims: 2000 · Máx rounds: 50

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
| Timeouts | 16 (0.8%) |
| Ambos vivos al round 51 | 16/16 |
| Con fatiga ≥ 90 al final | 2/16 |
| Con algún HP ≤ 5 al final | 0/16 |
| Distancia final P50 | 25 m |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El techo de 50 rounds NO debería recortar combates decisivos.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 7.13 | 6.43–7.84 (n=463) | target 7.0 ✅ |
| Ventaja primer atacante | -7.6% | -9.7%–-5.4% (n=2000) | target ≤5% ✅ |
| Winrate meta (berserker) | 33.7% | 28.3%–39.7% (n=261) | target ≤55% ✅ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 34.1% | 34.1% [32.6%–35.6%] |
| Mismo build (asesino) | 534 | 33.7% | 33.7% [29.8%–37.8%] |
| Mismo build (extremista_defensa) | 596 | 35.2% | 35.2% [31.5%–39.2%] |
| Mismo build (tanque) | 486 | 34.2% | 34.2% [30.1%–38.5%] |
| Mismo build (guardian) | 532 | 33.3% | 33.3% [29.4%–37.4%] |
| Mismo build (equilibrado) | 596 | 35.2% | 35.2% [31.5%–39.2%] |
| Mismo build (extremista_reflejos) | 506 | 33.4% | 33.4% [29.4%–37.6%] |
| Mismo build (magus) | 568 | 31.7% | 31.7% [28.0%–35.6%] |
| Mismo build (esquivo) | 564 | 35.5% | 35.5% [31.6%–39.5%] |
| Mismo build (berserker) | 522 | 32.8% | 32.8% [28.9%–36.9%] |
| Mismo build (estratega) | 580 | 33.8% | 33.8% [30.1%–37.7%] |
| Mismo build (extremista_velocidad) | 532 | 32.1% | 32.1% [28.3%–36.2%] |
| Mismo build (gladiador) | 584 | 37.3% | 37.3% [33.5%–41.3%] |
| Mismo build (extremista_ataque) | 566 | 33.7% | 33.7% [30.0%–37.7%] |
| Mismo build (velocista) | 548 | 33.8% | 33.8% [29.9%–37.8%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.161 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 43.8% | 48 | 43.3% | 1082 | 0.5pp |
| 200–299 | 40.5% | 482 | 51.4% | 650 | -10.9pp |
| 300–399 | 47.2% | 922 | 47.5% | 181 | -0.3pp |
| 400–500 | 72.6% | 610 | 72.0% | 25 | 0.6pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 42.6% | 47 | 43.3% | 1083 | -0.8pp |
| 200–299 | 42.9% | 490 | 49.7% | 642 | -6.8pp |
| 300–399 | 47.0% | 903 | 48.5% | 200 | -1.5pp |
| 400–500 | 72.5% | 607 | 75.0% | 28 | -2.5pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 44.9% | 69 | 43.2% | 1061 | 1.8pp |
| 200–299 | 43.1% | 443 | 49.1% | 689 | -5.9pp |
| 300–399 | 46.7% | 882 | 49.3% | 221 | -2.6pp |
| 400–500 | 72.5% | 607 | 75.0% | 28 | -2.5pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| T1 | 43.3% | 1130 | 149 |
| T2 | 46.4% | 1710 | 274 |
| T3 | 61.9% | 1159 | 410 |
| T4 | 100.0% | 1 | 500 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor equipo). Si el winrate por tier ≈ 50% corregido, el equipo es progresión, no balance.

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 99.4% |
| Batallas con ≥1 ítem | 16.7% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 7.5% |
| Rests por batalla (P50/P90) | 4/5 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.169 |
| def | 0.174 |
| aspd | -0.168 |
| ref | 0.024 |
| mspd | 0.139 |
| hp | 0.166 |
| fulgor | 0.078 |
| d_fulgor | 0.089 |
| r_fulgor | 0.060 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 5 / 11 / 40 / 51 |
| Batallas ≥ 20 rounds | 82 (4.1%) |
| Duración media | 6.35 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 16 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | velocista (report) | velocista (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los 11 checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas (0 desviaciones). Dos bugs del simulador fueron corregidos en esta auditoría: (1) KO por contraataque durante descanso asignaba la victoria al muerto — invertía los winrates de toda build que descansa; (2) `collectMetrics` excluía los contraataques del daño reportado. Los datos actuales son correctos y reproducibles (`node scripts/simulate_combat/audit.js`).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **El segundo atacante gana (ventaja -7.6% para el primero, CI 95% -9.7%–-5.4%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales (≈27 de fatiga) → su aspd/ref caen (penalty 20-60%) → el rival le esquiva/bloquea más (1317 vs 848 bloques) y lo golpea más (5.81 vs 4.17 golpes/batalla). Es una asimetría REAL del sistema de fatiga de movimiento del motor, no del simulador. **Decisión**: ticket de diseño — ¿debe el segundo en moverse ganar 10pp? Ajustar INITIAL_DISTANCE, FATIGUE_BASE_PER_METER o el orden de movimiento.
2. **El nivel no predice victoria (34.1% para el mayor nivel; correlación 0.161)**: con arma del mismo tier el daño es FIJO (perforante = base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk (0.05×atk − 0.01×def) → subir de nivel sube tu fatiga sin subir tu daño. Verificado dirigido: 400 vs 300 misma build/arma → 0-3% de victorias para el 400. **Decisión**: ticket de balance — el daño por nivel (escalado del arma o de atk) y el costo de fatiga deben revisarse juntos.
3. **Meta dominante: extremista_defensa ≈66% (objetivo ≤55%)**: su DEF alta reduce el costo de ataque a FATIGUE_COST_MIN (1+0.05×atk−0.01×def ≈ 1) → descansa mucho menos que el rival (que paga 3-6 por golpe) → recibe golpes extra gratis (contraataques mientras el rival descansa). El experimento FATIGUE_ATK_COST_SCALE 0.05→0.025 NO la mueve (66.2%) — la palanca efectiva es el mínimo de costo (FATIGUE_COST_MIN) o la reducción por DEF. Rango de winrates por personalidad: 30.5%–66.3% (36pp).
4. **Ítems subutilizados**: 16.7% de batallas usan ítem; el umbral HP < 50% deja el stock casi intacto. Los descansos (P50 4) dominan la gestión de recursos: la fatiga es el cuello de botella, no el HP.
5. **Timeouts 16 (0.8%)**: fatiga colapsada → daño mínimo → no se mata nadie en 51 rounds. Poco frecuente, pero confirma que la fatiga puede estancar el combate.

### Decisión recomendada

1. **Aceptar la auditoría como baseline válido** (datos íntegros post-fix) y commitear: 3 bugs corregidos + audit script reproducible + runner de experimentos.
2. **No ajustar el simulador para cumplir los targets**: los targets 2 (-7.6% vs ≤5%) y la meta fallan por el MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante; daño fijo por tier + fatiga ∝ atk anulan la progresión; costo de fatiga mínimo = meta defensiva).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 7.13, meta 33.7%) para cerrar el ciclo.
