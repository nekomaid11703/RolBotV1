# Stress Test — Fase A (full)

Config: sims=300/par | nivel=300 | maxRounds=30 | armas=estoque
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ✅ OK

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | estoque | 75 | 225 | 0 | 25.0 | 7.7 | 13 | 0/0 |
| el_muro | el_misil | estoque | 300 | 0 | 0 | 100.0 | 3.2 | 5 | 0/0 |
| el_muro | el_intocable | estoque | 300 | 0 | 0 | 100.0 | 2.0 | 2 | 0/0 |
| el_muro | la_tormenta | estoque | 299 | 1 | 0 | 99.7 | 3.2 | 6 | 0/0 |
| el_muro | el_vidrio | estoque | 291 | 9 | 0 | 97.0 | 4.5 | 7 | 0/0 |
| el_muro | el_goliat | estoque | 274 | 26 | 0 | 91.3 | 5.3 | 9 | 0/0 |
| el_misil | el_muro | estoque | 0 | 300 | 0 | 0.0 | 3.1 | 5 | 0/0 |
| el_misil | el_misil | estoque | 21 | 279 | 0 | 7.0 | 2.0 | 3 | 0/0 |
| el_misil | el_intocable | estoque | 298 | 2 | 0 | 99.3 | 2.0 | 2 | 0/0 |
| el_misil | la_tormenta | estoque | 15 | 285 | 0 | 5.0 | 2.0 | 3 | 0/0 |
| el_misil | el_vidrio | estoque | 20 | 280 | 0 | 6.7 | 2.1 | 4 | 0/0 |
| el_misil | el_goliat | estoque | 0 | 300 | 0 | 0.0 | 2.9 | 4 | 0/0 |
| el_intocable | el_muro | estoque | 0 | 300 | 0 | 0.0 | 1.5 | 2 | 0/0 |
| el_intocable | el_misil | estoque | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_intocable | estoque | 0 | 300 | 0 | 0.0 | 1.3 | 2 | 0/0 |
| el_intocable | la_tormenta | estoque | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_vidrio | estoque | 0 | 300 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_goliat | estoque | 0 | 300 | 0 | 0.0 | 1.1 | 2 | 0/0 |
| la_tormenta | el_muro | estoque | 1 | 299 | 0 | 0.3 | 3.1 | 5 | 0/0 |
| la_tormenta | el_misil | estoque | 21 | 279 | 0 | 7.0 | 2.0 | 3 | 0/0 |
| la_tormenta | el_intocable | estoque | 299 | 1 | 0 | 99.7 | 2.0 | 2 | 0/0 |
| la_tormenta | la_tormenta | estoque | 23 | 277 | 0 | 7.7 | 2.0 | 3 | 0/0 |
| la_tormenta | el_vidrio | estoque | 22 | 278 | 0 | 7.3 | 2.0 | 4 | 0/0 |
| la_tormenta | el_goliat | estoque | 0 | 300 | 0 | 0.0 | 3.0 | 5 | 0/0 |
| el_vidrio | el_muro | estoque | 4 | 296 | 0 | 1.3 | 4.9 | 8 | 0/0 |
| el_vidrio | el_misil | estoque | 222 | 78 | 0 | 74.0 | 2.1 | 4 | 0/0 |
| el_vidrio | el_intocable | estoque | 300 | 0 | 0 | 100.0 | 2.0 | 2 | 0/0 |
| el_vidrio | la_tormenta | estoque | 230 | 70 | 0 | 76.7 | 2.1 | 4 | 0/0 |
| el_vidrio | el_vidrio | estoque | 111 | 189 | 0 | 37.0 | 3.4 | 31 | 0/0 |
| el_vidrio | el_goliat | estoque | 0 | 300 | 0 | 0.0 | 3.8 | 5 | 0/0 |
| el_goliat | el_muro | estoque | 27 | 273 | 0 | 9.0 | 5.3 | 10 | 0/0 |
| el_goliat | el_misil | estoque | 300 | 0 | 0 | 100.0 | 2.9 | 4 | 0/0 |
| el_goliat | el_intocable | estoque | 300 | 0 | 0 | 100.0 | 2.3 | 3 | 0/0 |
| el_goliat | la_tormenta | estoque | 299 | 1 | 0 | 99.7 | 2.9 | 4 | 0/0 |
| el_goliat | el_vidrio | estoque | 300 | 0 | 0 | 100.0 | 3.0 | 4 | 0/0 |
| el_goliat | el_goliat | estoque | 111 | 189 | 0 | 37.0 | 6.3 | 8 | 0/0 |