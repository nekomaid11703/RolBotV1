# Stress Test — Fase A (none)

Config: sims=500/par | nivel=300 | maxRounds=30 | armas=none
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ❌ VIOLADO

## ⚠️ Timeouts detectados (4 pares)
| Build A | Build B | Arma | timeouts | maxRounds |
| --- | --- | --- | --- | --- |
| el_muro | el_muro | none | 49 | 31 |
| el_muro | el_goliat | none | 13 | 31 |
| el_goliat | el_muro | none | 2 | 31 |
| el_goliat | el_intocable | none | 8 | 31 |

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | none | 208 | 243 | 49 | 41.6 | 27.4 | 31 | 0/0 |
| el_muro | el_misil | none | 496 | 4 | 0 | 99.2 | 4.0 | 9 | 0/0 |
| el_muro | el_intocable | none | 500 | 0 | 0 | 100.0 | 31.0 | 31 | 0/0 |
| el_muro | la_tormenta | none | 497 | 3 | 0 | 99.4 | 3.9 | 7 | 0/0 |
| el_muro | el_vidrio | none | 479 | 21 | 0 | 95.8 | 5.5 | 10 | 0/0 |
| el_muro | el_goliat | none | 381 | 106 | 13 | 76.2 | 19.1 | 31 | 0/0 |
| el_misil | el_muro | none | 0 | 500 | 0 | 0.0 | 3.8 | 10 | 0/0 |
| el_misil | el_misil | none | 99 | 401 | 0 | 19.8 | 2.1 | 3 | 0/0 |
| el_misil | el_intocable | none | 497 | 3 | 0 | 99.4 | 2.0 | 10 | 0/0 |
| el_misil | la_tormenta | none | 115 | 385 | 0 | 23.0 | 2.1 | 3 | 0/0 |
| el_misil | el_vidrio | none | 151 | 349 | 0 | 30.2 | 2.0 | 3 | 0/0 |
| el_misil | el_goliat | none | 21 | 479 | 0 | 4.2 | 3.9 | 6 | 0/0 |
| el_intocable | el_muro | none | 0 | 500 | 0 | 0.0 | 30.9 | 31 | 0/0 |
| el_intocable | el_misil | none | 0 | 500 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_intocable | none | 0 | 500 | 0 | 0.0 | 4.8 | 31 | 0/0 |
| el_intocable | la_tormenta | none | 0 | 500 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_vidrio | none | 0 | 500 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_goliat | none | 2 | 498 | 0 | 0.4 | 16.7 | 31 | 0/0 |
| la_tormenta | el_muro | none | 2 | 498 | 0 | 0.4 | 3.8 | 17 | 0/0 |
| la_tormenta | el_misil | none | 118 | 382 | 0 | 23.6 | 2.1 | 3 | 0/0 |
| la_tormenta | el_intocable | none | 497 | 3 | 0 | 99.4 | 2.1 | 17 | 0/0 |
| la_tormenta | la_tormenta | none | 109 | 391 | 0 | 21.8 | 2.1 | 3 | 0/0 |
| la_tormenta | el_vidrio | none | 151 | 349 | 0 | 30.2 | 2.0 | 3 | 0/0 |
| la_tormenta | el_goliat | none | 8 | 492 | 0 | 1.6 | 3.9 | 6 | 0/0 |
| el_vidrio | el_muro | none | 3 | 497 | 0 | 0.6 | 5.5 | 9 | 0/0 |
| el_vidrio | el_misil | none | 242 | 258 | 0 | 48.4 | 2.2 | 4 | 0/0 |
| el_vidrio | el_intocable | none | 448 | 52 | 0 | 89.6 | 2.8 | 14 | 0/0 |
| el_vidrio | la_tormenta | none | 255 | 245 | 0 | 51.0 | 2.2 | 4 | 0/0 |
| el_vidrio | el_vidrio | none | 171 | 329 | 0 | 34.2 | 2.5 | 6 | 0/0 |
| el_vidrio | el_goliat | none | 46 | 454 | 0 | 9.2 | 4.6 | 6 | 0/0 |
| el_goliat | el_muro | none | 6 | 492 | 2 | 1.2 | 11.0 | 31 | 0/0 |
| el_goliat | el_misil | none | 238 | 262 | 0 | 47.6 | 4.4 | 6 | 0/0 |
| el_goliat | el_intocable | none | 193 | 299 | 8 | 38.6 | 29.3 | 31 | 0/0 |
| el_goliat | la_tormenta | none | 233 | 267 | 0 | 46.6 | 4.5 | 6 | 0/0 |
| el_goliat | el_vidrio | none | 460 | 40 | 0 | 92.0 | 4.1 | 6 | 0/0 |
| el_goliat | el_goliat | none | 4 | 496 | 0 | 0.8 | 9.1 | 31 | 0/0 |