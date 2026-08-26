# Stress Test — Fase A (weapon)

Config: sims=200/par | nivel=300 | maxRounds=30 | armas=arco
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ✅ OK

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | arco | 30 | 170 | 0 | 15.0 | 2.1 | 3 | 0/0 |
| el_muro | el_misil | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_muro | el_intocable | arco | 53 | 147 | 0 | 26.5 | 3.0 | 20 | 0/0 |
| el_muro | la_tormenta | arco | 199 | 1 | 0 | 99.5 | 1.0 | 2 | 0/0 |
| el_muro | el_vidrio | arco | 199 | 1 | 0 | 99.5 | 1.0 | 2 | 0/0 |
| el_muro | el_goliat | arco | 37 | 163 | 0 | 18.5 | 2.9 | 3 | 0/0 |
| el_misil | el_muro | arco | 0 | 200 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_misil | el_misil | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_misil | el_intocable | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_misil | la_tormenta | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_misil | el_vidrio | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_misil | el_goliat | arco | 0 | 200 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_muro | arco | 108 | 92 | 0 | 54.0 | 10.2 | 19 | 0/0 |
| el_intocable | el_misil | arco | 183 | 17 | 0 | 91.5 | 1.0 | 1 | 0/0 |
| el_intocable | el_intocable | arco | 0 | 200 | 0 | 0.0 | 1.1 | 31 | 0/0 |
| el_intocable | la_tormenta | arco | 176 | 24 | 0 | 88.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_vidrio | arco | 186 | 14 | 0 | 93.0 | 1.0 | 1 | 0/0 |
| el_intocable | el_goliat | arco | 1 | 199 | 0 | 0.5 | 1.1 | 23 | 0/0 |
| la_tormenta | el_muro | arco | 0 | 200 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| la_tormenta | el_misil | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| la_tormenta | el_intocable | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| la_tormenta | la_tormenta | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| la_tormenta | el_vidrio | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| la_tormenta | el_goliat | arco | 0 | 200 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_vidrio | el_muro | arco | 0 | 200 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_vidrio | el_misil | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_vidrio | el_intocable | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_vidrio | la_tormenta | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_vidrio | el_vidrio | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_vidrio | el_goliat | arco | 0 | 200 | 0 | 0.0 | 1.0 | 1 | 0/0 |
| el_goliat | el_muro | arco | 0 | 200 | 0 | 0.0 | 2.0 | 2 | 0/0 |
| el_goliat | el_misil | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_goliat | el_intocable | arco | 5 | 195 | 0 | 2.5 | 2.2 | 3 | 0/0 |
| el_goliat | la_tormenta | arco | 200 | 0 | 0 | 100.0 | 1.0 | 1 | 0/0 |
| el_goliat | el_vidrio | arco | 197 | 3 | 0 | 98.5 | 1.0 | 2 | 0/0 |
| el_goliat | el_goliat | arco | 0 | 200 | 0 | 0.0 | 2.5 | 3 | 0/0 |