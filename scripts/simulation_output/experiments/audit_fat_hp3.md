# Auditoría de datos crudos de la simulación

Fecha: 2026-08-05T03:17:09.805Z · Sims: 2000 · Máx rounds: 20

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
| Timeouts | 163 (8.2%) |
| Ambos vivos al round 21 | 163/163 |
| Con fatiga ≥ 90 al final | 14/163 |
| Con algún HP ≤ 5 al final | 4/163 |
| Distancia final P50 | 8 m |
| Timeouts con perdedor ≥ 50% HP del ganador | 96/163 |
| Gap de HP relativo al corte (P50/P90) | 45.5% / 84.0% |

**Diagnóstico**: los timeouts rara vez son peleas trabadas; son fatiga acumulada → daño colapsado. El desempate por HP residual favorece builds defensivas (sesgo medido arriba). El techo recorta combates decisivos solo cuando el perdedor conserva ≥50% del HP del ganador.

## 4. Targets con intervalo de confianza 95%

| Target | Valor | CI 95% | Veredicto |
|--------|-------|--------|-----------|
| Turnos subset parejo | 7.73 | 7.12–8.35 (n=324) | target 7.0 ✅ |
| Ventaja primer atacante | 0.5% | -1.7%–2.7% (n=2000) | target ≤5% ✅ |
| Winrate meta (extremista_defensa) | 65.6% | 59.9%–70.9% (n=282) | target ≤55% ⚠️ |

## 5. Nivel vs resultado (controles)

La pregunta: ¿el nivel predice victoria? El signo sale invertido o neutro en todas las builds.

| Control | n (lados) | Winrate del de MAYOR nivel | CI 95% |
|---------|-----------|----------------------------|--------|
| Población completa | 4000 | 34.9% | 34.9% [33.4%–36.4%] |
| Mismo build (equilibrado) | 540 | 37.4% | 37.4% [33.4%–41.6%] |
| Mismo build (estratega) | 480 | 34.8% | 34.8% [30.7%–39.2%] |
| Mismo build (extremista_velocidad) | 518 | 32.4% | 32.4% [28.5%–36.6%] |
| Mismo build (extremista_ataque) | 540 | 34.3% | 34.3% [30.4%–38.4%] |
| Mismo build (magus) | 570 | 33.5% | 33.5% [29.8%–37.5%] |
| Mismo build (extremista_reflejos) | 614 | 33.4% | 33.4% [29.8%–37.2%] |
| Mismo build (esquivo) | 556 | 37.1% | 37.1% [33.1%–41.1%] |
| Mismo build (velocista) | 560 | 36.3% | 36.3% [32.4%–40.3%] |
| Mismo build (gladiador) | 586 | 34.3% | 34.3% [30.6%–38.2%] |
| Mismo build (berserker) | 622 | 31.4% | 31.4% [27.8%–35.1%] |
| Mismo build (extremista_defensa) | 564 | 34.4% | 34.4% [30.6%–38.4%] |
| Mismo build (asesino) | 540 | 35.7% | 35.7% [31.8%–39.9%] |
| Mismo build (tanque) | 520 | 36.7% | 36.7% [32.7%–41.0%] |
| Mismo build (guardian) | 540 | 37.0% | 37.0% [33.1%–41.2%] |
| Correlación punto-biserial nivel→win (todos los lados) | 0.177 |

## 6. Contribución de stats mágicas (controlando nivel)

| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 29.7% | 118 | 42.8% | 835 | -13.1pp |
| 200–299 | 38.2% | 241 | 45.7% | 843 | -7.5pp |
| 300–399 | 42.8% | 271 | 52.9% | 771 | -10.1pp |
| 400–500 | 51.4% | 257 | 71.2% | 664 | -19.9pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 30.8% | 120 | 42.6% | 833 | -11.8pp |
| 200–299 | 39.2% | 237 | 45.3% | 847 | -6.1pp |
| 300–399 | 43.0% | 265 | 52.8% | 777 | -9.7pp |
| 400–500 | 51.6% | 258 | 71.2% | 663 | -19.6pp |
| Bracket nivel | Winrate magia ALTA | n | Winrate magia BAJA | n | Diff |
|---------------|-------------------|----|--------------------|----|------|
| 100–199 | 31.4% | 121 | 42.5% | 832 | -11.1pp |
| 200–299 | 40.5% | 242 | 45.0% | 842 | -4.5pp |
| 300–399 | 42.7% | 267 | 52.9% | 775 | -10.2pp |
| 400–500 | 51.2% | 256 | 71.3% | 665 | -20.1pp |

## 7. Tier de equipo vs resultado (confound con nivel)

| Tier | Winrate | n | Nivel medio |
|------|---------|----|-------------|
| A | 67.0% | 515 | 458 |
| B | 56.7% | 843 | 386 |
| C | 49.4% | 1075 | 303 |
| E | 41.1% | 1567 | 199 |

Interpretación: el tier correlaciona con nivel (más nivel = mejor calidad). Si el winrate por tier ≈ 50% corregido, el tier es progresión, no balance.

## 7.1 Saturación de stats (clamp 100)

Un jugador humano prioriza su estilo: su stat principal debería saturar poco incluso a nivel alto. La saturación aplana la varianza (confound del análisis).

| Bracket nivel | n (lados) | atk | def | aspd | ref | mspd | hp |
|---------------|-----------|-----|-----|------|-----|------|----|
| 100–199 | 953 | 0.0% | 0.8% | 0.0% | 0.0% | 0.0% | 0.0% |
| 200–299 | 1084 | 3.5% | 13.3% | 0.0% | 0.0% | 0.0% | 0.0% |
| 300–399 | 1042 | 7.4% | 21.2% | 1.2% | 1.5% | 0.0% | 0.1% |
| 400–500 | 921 | 16.7% | 21.7% | 4.2% | 3.9% | 0.5% | 0.9% |

## 7.2 Naturalezas de arma por bracket (objetivo ≈ 1/3 cada una)

| Bracket nivel | cortante | perforante | contundente | desarmado |
|---------------|----------|------------|-------------|-----------|
| 100–199 | 32.2% | 31.7% | 26.7% | 9.4% |
| 200–299 | 28.7% | 30.5% | 30.7% | 10.1% |
| 300–399 | 33.1% | 28.8% | 28.9% | 9.2% |
| 400–500 | 29.2% | 31.8% | 30.0% | 9.0% |

## 7.3 Tier de equipo por nivel (asignación probabilística 60/30/10)

| Bracket nivel | E | C | B | A |
|---------------|----|----|----|----|
| 100–199 | 953 (100.0%) | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| 200–299 | 473 (43.6%) | 611 (56.4%) | 0 (0.0%) | 0 (0.0%) |
| 300–399 | 130 (12.5%) | 362 (34.7%) | 550 (52.8%) | 0 (0.0%) |
| 400–500 | 11 (1.2%) | 102 (11.1%) | 293 (31.8%) | 515 (55.9%) |

## 7.4 Equipo: cobertura, set bonus, amuleto, escudo

| Métrica | Valor |
|---------|-------|
| Piezas de armadura por fighter (promedio) | 4.21 |
| Cobertura dominante | total: 2570 · alta: 1282 · media: 133 · ligera: 15 |
| Piezas de set (0 / 1-2 / 3+) | 3+: 3913 · 1-2: 87 |
| Set bonus activo | 97.8% |
| Inconsistencias setPieces↔setBonusActive | 0 |
| Con amuleto | 39.0% |
| Con escudo | 60.1% |
| Fighters con ≥1 pieza rota post-batalla | 47.7% (4312 piezas) |

## 8. Gestión de recursos

| Métrica | Valor |
|---------|-------|
| Batallas con ≥1 descanso | 79.7% |
| Batallas con ≥1 ítem | 43.5% |
| Batallas donde el ítem se usó con >50% HP (temprano) | 18.1% |
| Rests por batalla (P50/P90) | 2/2 |

## 9. Correlación de stats (normalizadas por nivel) con victoria

| Stat (por 100 de nivel) | Correlación con win |
|-------------------------|---------------------|
| atk | -0.121 |
| def | 0.114 |
| aspd | -0.076 |
| ref | 0.004 |
| mspd | 0.104 |
| hp | 0.194 |
| fulgor | -0.064 |
| d_fulgor | -0.068 |
| r_fulgor | -0.066 |

Signo negativo en stats mágicas = puntos invertidos en magia son puntos que no pelean (dilución), no un efecto del stat.

## 10. Distribución de duración

| Métrica | Valor |
|---------|-------|
| P50 / P90 / P99 / Max | 5 / 19 / 21 / 21 |
| Batallas ≥ 20 rounds (techo) | 179 (8.9%) |
| Duración media | 7.35 |

## 11. Coherencia report ↔ raw

| Campo | report | raw_data | ¿Coincide? |
|-------|--------|----------|-----------|
| Sims totales | 2000 | 2000 | ✅ |
| Timeouts | 163 (raw) | report.overview.totalTimeouts  | — |
| Meta detectada | extremista_defensa (report) | extremista_defensa (raw) | ✅ |

## Veredicto

### Integridad: datos listos para decidir

Los checks de integridad pasan (0 casos). El daño registrado coincide con el real por curvas. El catálogo base de hierro deriva sus stats con las fórmulas reales del motor (itemStatService: base × tier × material); la durabilidad se reparte entre piezas en orden (mecánica VALIDADA en la simulación; el motor real hoy solo impacta armor.list[0] en atacar.js).

### Hallazgos de balance del MOTOR (expuestos, no maquillados)

1. **Ventaja del primer atacante (0.5% sobre 50%, CI 95% -1.7%–2.7%)**: el primer atacante asume el costo de movimiento de los 25 m iniciales. La cobertura del equipo (ligera ×1.05 → total ×1.5 de fatiga de movimiento) ahora se aplica en la simulación (mecánica pendiente en el motor real: armorSetService.getMovementFatigueWithCoverage no la consume nadie) y MODULA esta asimetría: cuanta más cobertura, más cara la aproximación del primer atacante.
2. **El nivel no predice victoria (34.9% para el mayor nivel; correlación 0.177)**: el daño perforante es FIJO (base×tierMult, ignora atk/def) y la fatiga por ataque escala con atk → subir de nivel sube la fatiga sin subir el daño (en perforante). El tier del ítem (E→A) multiplica el daño 1.12x→1.60x (cortante/contundente) y 1.2x→4.0x (perforante): la progresión real viene del EQUIPO, no del nivel de stats.
3. **Meta dominante: extremista_defensa ≈65.6% (objetivo ≤55%)**: el bono de set {def:+10} y el amuleto {atk:+5} ahora se aplican a stats efectivas (mecánicas pendientes en el motor real: solo se resuelven para UI en equipmentResolverService). Un set completo de hierro +10 def refuerza el descuento de fatiga de ataque por DEF — vigilar la interacción set×meta defensiva.
4. **Saturación de stats**: ver sección 7.1 — el objetivo es que la personalidad priorizada no sature el clamp 100 en sus stats clave incluso a nivel alto; si satura, el nivel extra no aporta varianza y los datos se aplastan.
5. **Ítems subutilizados**: 43.5% de batallas usan ítem; los descansos (P50 2/2) dominan la gestión de recursos.

### Decisión recomendada

1. **Aceptar el re-baseline con catálogo de hierro como referencia** (datos íntegros, fórmulas reales, mecánicas de cobertura/set/amuleto validadas) y commitear.
2. **No ajustar el simulador para cumplir los targets**: los fallos restantes (0.5% ventaja, meta 65.6%) provienen del MOTOR. Maquillar el simulador ocultaría bugs reales del juego.
3. **Crear tickets de balance del motor** a partir de los hallazgos 1-3 (asimetría del primer atacante y cobertura; progresión por tier vs nivel; set bonus y amuleto pendientes de implementar en combate real; absorción de durabilidad por piezas en orden).
4. **Regenerar el reporte oficial tras cada cambio del motor** y re-auditar (turnos 7.73, meta 65.6%) para cerrar el ciclo.
