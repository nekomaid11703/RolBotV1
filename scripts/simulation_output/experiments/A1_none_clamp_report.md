# Stress Test — Fase A (none)

Config: sims=500/par | nivel=500 (clamp) | maxRounds=30 | armas=none
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ✅ OK

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | none | 0 | 500 | 0 | 0.0 | 5.1 | 8 | 0/0 |
| el_muro | el_misil | none | 0 | 500 | 0 | 0.0 | 4.0 | 4 | 0/0 |
| el_muro | el_intocable | none | 0 | 500 | 0 | 0.0 | 5.8 | 8 | 0/0 |
| el_muro | la_tormenta | none | 0 | 500 | 0 | 0.0 | 4.0 | 4 | 0/0 |
| el_muro | el_vidrio | none | 0 | 500 | 0 | 0.0 | 4.3 | 5 | 0/0 |
| el_muro | el_goliat | none | 0 | 500 | 0 | 0.0 | 4.8 | 6 | 0/0 |
| el_misil | el_muro | none | 0 | 500 | 0 | 0.0 | 3.7 | 5 | 0/0 |
| el_misil | el_misil | none | 0 | 500 | 0 | 0.0 | 3.0 | 4 | 0/0 |
| el_misil | el_intocable | none | 0 | 500 | 0 | 0.0 | 4.1 | 6 | 0/0 |
| el_misil | la_tormenta | none | 0 | 500 | 0 | 0.0 | 3.0 | 4 | 0/0 |
| el_misil | el_vidrio | none | 0 | 500 | 0 | 0.0 | 3.2 | 4 | 0/0 |
| el_misil | el_goliat | none | 0 | 500 | 0 | 0.0 | 3.5 | 5 | 0/0 |
| el_intocable | el_muro | none | 0 | 500 | 0 | 0.0 | 3.2 | 4 | 0/0 |
| el_intocable | el_misil | none | 0 | 500 | 0 | 0.0 | 2.9 | 3 | 0/0 |
| el_intocable | el_intocable | none | 0 | 500 | 0 | 0.0 | 3.5 | 5 | 0/0 |
| el_intocable | la_tormenta | none | 0 | 500 | 0 | 0.0 | 2.9 | 3 | 0/0 |
| el_intocable | el_vidrio | none | 0 | 500 | 0 | 0.0 | 2.9 | 4 | 0/0 |
| el_intocable | el_goliat | none | 0 | 500 | 0 | 0.0 | 3.1 | 4 | 0/0 |
| la_tormenta | el_muro | none | 0 | 500 | 0 | 0.0 | 3.7 | 5 | 0/0 |
| la_tormenta | el_misil | none | 0 | 500 | 0 | 0.0 | 3.0 | 3 | 0/0 |
| la_tormenta | el_intocable | none | 0 | 500 | 0 | 0.0 | 4.0 | 6 | 0/0 |
| la_tormenta | la_tormenta | none | 0 | 500 | 0 | 0.0 | 3.0 | 4 | 0/0 |
| la_tormenta | el_vidrio | none | 0 | 500 | 0 | 0.0 | 3.1 | 5 | 0/0 |
| la_tormenta | el_goliat | none | 0 | 500 | 0 | 0.0 | 3.5 | 5 | 0/0 |
| el_vidrio | el_muro | none | 0 | 500 | 0 | 0.0 | 4.2 | 6 | 0/0 |
| el_vidrio | el_misil | none | 0 | 500 | 0 | 0.0 | 3.3 | 4 | 0/0 |
| el_vidrio | el_intocable | none | 0 | 500 | 0 | 0.0 | 4.6 | 6 | 0/0 |
| el_vidrio | la_tormenta | none | 0 | 500 | 0 | 0.0 | 3.3 | 4 | 0/0 |
| el_vidrio | el_vidrio | none | 0 | 500 | 0 | 0.0 | 3.5 | 5 | 0/0 |
| el_vidrio | el_goliat | none | 0 | 500 | 0 | 0.0 | 4.1 | 6 | 0/0 |
| el_goliat | el_muro | none | 0 | 500 | 0 | 0.0 | 4.6 | 6 | 0/0 |
| el_goliat | el_misil | none | 0 | 500 | 0 | 0.0 | 4.0 | 4 | 0/0 |
| el_goliat | el_intocable | none | 0 | 500 | 0 | 0.0 | 5.2 | 7 | 0/0 |
| el_goliat | la_tormenta | none | 0 | 500 | 0 | 0.0 | 4.0 | 4 | 0/0 |
| el_goliat | el_vidrio | none | 0 | 500 | 0 | 0.0 | 4.3 | 5 | 0/0 |
| el_goliat | el_goliat | none | 0 | 500 | 0 | 0.0 | 4.4 | 6 | 0/0 |