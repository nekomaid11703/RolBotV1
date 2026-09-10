# Stress Test — Fase A (none)

Config: sims=100/par | nivel=100 | maxRounds=30 | armas=none
Builds: el_muro, el_misil, el_intocable, la_tormenta, el_vidrio, el_goliat

## Invariantes
- Daño por golpe ∈ [DAMAGE_MIN, ∞) y finito (nunca 0/negativo/NaN/Inf): ✅ OK
- Combates resueltos por KO en ≤ 30 turnos (sin timeout): ❌ VIOLADO

## ⚠️ Timeouts detectados (8 pares)
| Build A | Build B | Arma | timeouts | maxRounds |
| --- | --- | --- | --- | --- |
| el_muro | el_muro | none | 3 | 31 |
| el_misil | el_misil | none | 2 | 31 |
| el_misil | la_tormenta | none | 1 | 31 |
| el_intocable | el_intocable | none | 17 | 31 |
| la_tormenta | el_misil | none | 3 | 31 |
| la_tormenta | la_tormenta | none | 1 | 31 |
| el_vidrio | el_vidrio | none | 2 | 31 |
| el_goliat | el_goliat | none | 1 | 31 |

## Resultados por par (winrate A)
| Build A | Build B | Arma | A wins | B wins | timeout | winrate A% | avgRounds | maxRounds | dmgBad A/B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| el_muro | el_muro | none | 54 | 43 | 3 | 54.0 | 31.0 | 31 | 0/0 |
| el_muro | el_misil | none | 98 | 2 | 0 | 98.0 | 14.4 | 31 | 0/0 |
| el_muro | el_intocable | none | 100 | 0 | 0 | 100.0 | 31.0 | 31 | 0/0 |
| el_muro | la_tormenta | none | 100 | 0 | 0 | 100.0 | 13.8 | 31 | 0/0 |
| el_muro | el_vidrio | none | 85 | 15 | 0 | 85.0 | 22.3 | 31 | 0/0 |
| el_muro | el_goliat | none | 0 | 100 | 0 | 0.0 | 31.0 | 31 | 0/0 |
| el_misil | el_muro | none | 4 | 96 | 0 | 4.0 | 14.3 | 31 | 0/0 |
| el_misil | el_misil | none | 29 | 69 | 2 | 29.0 | 5.6 | 31 | 0/0 |
| el_misil | el_intocable | none | 79 | 21 | 0 | 79.0 | 2.8 | 10 | 0/0 |
| el_misil | la_tormenta | none | 35 | 64 | 1 | 35.0 | 6.0 | 31 | 0/0 |
| el_misil | el_vidrio | none | 45 | 55 | 0 | 45.0 | 4.3 | 31 | 0/0 |
| el_misil | el_goliat | none | 45 | 55 | 0 | 45.0 | 6.6 | 31 | 0/0 |
| el_intocable | el_muro | none | 0 | 100 | 0 | 0.0 | 31.0 | 31 | 0/0 |
| el_intocable | el_misil | none | 1 | 99 | 0 | 1.0 | 1.0 | 4 | 0/0 |
| el_intocable | el_intocable | none | 42 | 41 | 17 | 42.0 | 30.1 | 31 | 0/0 |
| el_intocable | la_tormenta | none | 0 | 100 | 0 | 0.0 | 1.1 | 2 | 0/0 |
| el_intocable | el_vidrio | none | 0 | 100 | 0 | 0.0 | 1.0 | 2 | 0/0 |
| el_intocable | el_goliat | none | 0 | 100 | 0 | 0.0 | 31.0 | 31 | 0/0 |
| la_tormenta | el_muro | none | 0 | 100 | 0 | 0.0 | 12.8 | 31 | 0/0 |
| la_tormenta | el_misil | none | 41 | 56 | 3 | 41.0 | 5.4 | 31 | 0/0 |
| la_tormenta | el_intocable | none | 100 | 0 | 0 | 100.0 | 2.0 | 3 | 0/0 |
| la_tormenta | la_tormenta | none | 42 | 57 | 1 | 42.0 | 3.6 | 31 | 0/0 |
| la_tormenta | el_vidrio | none | 3 | 97 | 0 | 3.0 | 5.2 | 31 | 0/0 |
| la_tormenta | el_goliat | none | 9 | 91 | 0 | 9.0 | 10.9 | 31 | 0/0 |
| el_vidrio | el_muro | none | 16 | 84 | 0 | 16.0 | 21.9 | 31 | 0/0 |
| el_vidrio | el_misil | none | 40 | 60 | 0 | 40.0 | 4.6 | 31 | 0/0 |
| el_vidrio | el_intocable | none | 91 | 9 | 0 | 91.0 | 5.0 | 31 | 0/0 |
| el_vidrio | la_tormenta | none | 90 | 10 | 0 | 90.0 | 4.3 | 31 | 0/0 |
| el_vidrio | el_vidrio | none | 42 | 56 | 2 | 42.0 | 5.4 | 31 | 0/0 |
| el_vidrio | el_goliat | none | 86 | 14 | 0 | 86.0 | 9.8 | 31 | 0/0 |
| el_goliat | el_muro | none | 99 | 1 | 0 | 99.0 | 31.0 | 31 | 0/0 |
| el_goliat | el_misil | none | 49 | 51 | 0 | 49.0 | 7.9 | 31 | 0/0 |
| el_goliat | el_intocable | none | 100 | 0 | 0 | 100.0 | 31.0 | 31 | 0/0 |
| el_goliat | la_tormenta | none | 91 | 9 | 0 | 91.0 | 9.8 | 31 | 0/0 |
| el_goliat | el_vidrio | none | 14 | 86 | 0 | 14.0 | 10.8 | 31 | 0/0 |
| el_goliat | el_goliat | none | 49 | 50 | 1 | 49.0 | 31.0 | 31 | 0/0 |