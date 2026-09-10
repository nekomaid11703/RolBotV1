# Stress Test — Fase A (none)

Config: sims=500/par | nivel=100 | maxRounds=30 | armas=none
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ❌ VIOLADO

## ⚠️ Timeouts detectados (8 pares)
| Build A | Build B | Arma | timeouts | maxRounds |
| --- | --- | --- | --- | --- |
| el_muro | el_muro | none | 22 | 31 |
| el_misil | el_misil | none | 8 | 31 |
| el_misil | la_tormenta | none | 6 | 31 |
| el_intocable | el_intocable | none | 122 | 31 |
| la_tormenta | el_misil | none | 7 | 31 |
| la_tormenta | la_tormenta | none | 6 | 31 |
| el_vidrio | la_tormenta | none | 1 | 31 |
| el_goliat | el_goliat | none | 11 | 31 |

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | none | 230 | 248 | 22 | 46.0 | 31.0 | 31 | 0/0 |
| el_muro | el_misil | none | 478 | 22 | 0 | 95.6 | 12.8 | 31 | 0/0 |
| el_muro | el_intocable | none | 500 | 0 | 0 | 100.0 | 31.0 | 31 | 0/0 |
| el_muro | la_tormenta | none | 500 | 0 | 0 | 100.0 | 13.7 | 31 | 0/0 |
| el_muro | el_vidrio | none | 411 | 89 | 0 | 82.2 | 22.1 | 31 | 0/0 |
| el_muro | el_goliat | none | 0 | 500 | 0 | 0.0 | 31.0 | 31 | 0/0 |
| el_misil | el_muro | none | 23 | 477 | 0 | 4.6 | 13.2 | 31 | 0/0 |
| el_misil | el_misil | none | 176 | 316 | 8 | 35.2 | 4.8 | 31 | 0/0 |
| el_misil | el_intocable | none | 389 | 111 | 0 | 77.8 | 2.9 | 16 | 0/0 |
| el_misil | la_tormenta | none | 205 | 289 | 6 | 41.0 | 4.5 | 31 | 0/0 |
| el_misil | el_vidrio | none | 172 | 328 | 0 | 34.4 | 4.5 | 31 | 0/0 |
| el_misil | el_goliat | none | 237 | 263 | 0 | 47.4 | 6.5 | 31 | 0/0 |
| el_intocable | el_muro | none | 0 | 500 | 0 | 0.0 | 31.0 | 31 | 0/0 |
| el_intocable | el_misil | none | 5 | 495 | 0 | 1.0 | 1.0 | 7 | 0/0 |
| el_intocable | el_intocable | none | 156 | 222 | 122 | 31.2 | 30.8 | 31 | 0/0 |
| el_intocable | la_tormenta | none | 0 | 500 | 0 | 0.0 | 1.1 | 3 | 0/0 |
| el_intocable | el_vidrio | none | 1 | 499 | 0 | 0.2 | 1.0 | 22 | 0/0 |
| el_intocable | el_goliat | none | 0 | 500 | 0 | 0.0 | 31.0 | 31 | 0/0 |
| la_tormenta | el_muro | none | 0 | 500 | 0 | 0.0 | 13.8 | 31 | 0/0 |
| la_tormenta | el_misil | none | 186 | 307 | 7 | 37.2 | 4.2 | 31 | 0/0 |
| la_tormenta | el_intocable | none | 490 | 10 | 0 | 98.0 | 2.0 | 4 | 0/0 |
| la_tormenta | la_tormenta | none | 216 | 278 | 6 | 43.2 | 4.3 | 31 | 0/0 |
| la_tormenta | el_vidrio | none | 30 | 470 | 0 | 6.0 | 5.1 | 31 | 0/0 |
| la_tormenta | el_goliat | none | 37 | 463 | 0 | 7.4 | 9.9 | 31 | 0/0 |
| el_vidrio | el_muro | none | 87 | 413 | 0 | 17.4 | 22.7 | 31 | 0/0 |
| el_vidrio | el_misil | none | 193 | 307 | 0 | 38.6 | 4.4 | 31 | 0/0 |
| el_vidrio | el_intocable | none | 453 | 47 | 0 | 90.6 | 3.8 | 31 | 0/0 |
| el_vidrio | la_tormenta | none | 440 | 59 | 1 | 88.0 | 4.8 | 31 | 0/0 |
| el_vidrio | el_vidrio | none | 182 | 318 | 0 | 36.4 | 4.0 | 31 | 0/0 |
| el_vidrio | el_goliat | none | 421 | 79 | 0 | 84.2 | 10.3 | 31 | 0/0 |
| el_goliat | el_muro | none | 500 | 0 | 0 | 100.0 | 31.0 | 31 | 0/0 |
| el_goliat | el_misil | none | 264 | 236 | 0 | 52.8 | 6.6 | 31 | 0/0 |
| el_goliat | el_intocable | none | 500 | 0 | 0 | 100.0 | 31.0 | 31 | 0/0 |
| el_goliat | la_tormenta | none | 462 | 38 | 0 | 92.4 | 9.3 | 31 | 0/0 |
| el_goliat | el_vidrio | none | 69 | 431 | 0 | 13.8 | 10.5 | 31 | 0/0 |
| el_goliat | el_goliat | none | 243 | 246 | 11 | 48.6 | 31.0 | 31 | 0/0 |