# Stress Test — Fase A (full)

Config: sims=300/par | nivel=300 | maxRounds=30 | armas=espada
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ✅ OK

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | espada | 83 | 217 | 0 | 27.7 | 7.2 | 13 | 0/0 |
| el_muro | el_misil | espada | 299 | 1 | 0 | 99.7 | 2.8 | 5 | 0/0 |
| el_muro | el_intocable | espada | 300 | 0 | 0 | 100.0 | 2.0 | 2 | 0/0 |
| el_muro | la_tormenta | espada | 300 | 0 | 0 | 100.0 | 2.8 | 5 | 0/0 |
| el_muro | el_vidrio | espada | 277 | 23 | 0 | 92.3 | 4.0 | 7 | 0/0 |
| el_muro | el_goliat | espada | 276 | 24 | 0 | 92.0 | 4.5 | 8 | 0/0 |
| el_misil | el_muro | espada | 0 | 300 | 0 | 0.0 | 2.8 | 4 | 0/0 |
| el_misil | el_misil | espada | 12 | 288 | 0 | 4.0 | 2.0 | 4 | 0/0 |
| el_misil | el_intocable | espada | 271 | 29 | 0 | 90.3 | 2.0 | 2 | 0/0 |
| el_misil | la_tormenta | espada | 13 | 287 | 0 | 4.3 | 2.0 | 2 | 0/0 |
| el_misil | el_vidrio | espada | 7 | 293 | 0 | 2.3 | 2.0 | 4 | 0/0 |
| el_misil | el_goliat | espada | 1 | 299 | 0 | 0.3 | 2.6 | 4 | 0/0 |
| el_intocable | el_muro | espada | 0 | 300 | 0 | 0.0 | 1.1 | 2 | 0/0 |
| el_intocable | el_misil | espada | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_intocable | espada | 0 | 300 | 0 | 0.0 | 1.0 | 2 | 0/0 |
| el_intocable | la_tormenta | espada | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_vidrio | espada | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_goliat | espada | 0 | 300 | 0 | 0.0 | 1.0 | 2 | 0/0 |
| la_tormenta | el_muro | espada | 0 | 300 | 0 | 0.0 | 2.8 | 5 | 0/0 |
| la_tormenta | el_misil | espada | 10 | 290 | 0 | 3.3 | 2.0 | 2 | 0/0 |
| la_tormenta | el_intocable | espada | 271 | 29 | 0 | 90.3 | 2.0 | 2 | 0/0 |
| la_tormenta | la_tormenta | espada | 17 | 283 | 0 | 5.7 | 2.0 | 2 | 0/0 |
| la_tormenta | el_vidrio | espada | 3 | 297 | 0 | 1.0 | 2.1 | 4 | 0/0 |
| la_tormenta | el_goliat | espada | 0 | 300 | 0 | 0.0 | 2.6 | 4 | 0/0 |
| el_vidrio | el_muro | espada | 6 | 294 | 0 | 2.0 | 4.3 | 8 | 0/0 |
| el_vidrio | el_misil | espada | 216 | 84 | 0 | 72.0 | 2.1 | 4 | 0/0 |
| el_vidrio | el_intocable | espada | 299 | 1 | 0 | 99.7 | 2.0 | 2 | 0/0 |
| el_vidrio | la_tormenta | espada | 209 | 91 | 0 | 69.7 | 2.0 | 4 | 0/0 |
| el_vidrio | el_vidrio | espada | 97 | 203 | 0 | 32.3 | 3.4 | 31 | 0/0 |
| el_vidrio | el_goliat | espada | 1 | 299 | 0 | 0.3 | 3.5 | 5 | 0/0 |
| el_goliat | el_muro | espada | 12 | 288 | 0 | 4.0 | 4.5 | 8 | 0/0 |
| el_goliat | el_misil | espada | 299 | 1 | 0 | 99.7 | 2.4 | 4 | 0/0 |
| el_goliat | el_intocable | espada | 300 | 0 | 0 | 100.0 | 2.0 | 3 | 0/0 |
| el_goliat | la_tormenta | espada | 294 | 6 | 0 | 98.0 | 2.5 | 4 | 0/0 |
| el_goliat | el_vidrio | espada | 299 | 1 | 0 | 99.7 | 2.8 | 4 | 0/0 |
| el_goliat | el_goliat | espada | 99 | 201 | 0 | 33.0 | 5.4 | 7 | 0/0 |