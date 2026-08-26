# Laboratorio de Naturalezas — Fase B

Config: sims=300/par | nivel=300 | nominalDamage=20 | tier=B | maxRounds=30
Build: NEUTRAL (misma stats para todas; solo cambia la fórmula del arma)

## Espejos (winrate ~50%, mide turnos)
Target: 7 turnos de media | desventaja ≤ 30

| Naturaleza | avgRounds | maxRounds | timeouts |
| --- | --- | --- | --- |
| cortante | 2.0 ❌ | 2 | 0 |
| contundente | 2.0 ❌ | 2 | 0 |
| perforante | 2.0 ❌ | 2 | 0 |
| proyectil | 2.0 ❌ | 2 | 0 |
| desarmado | 3.0 ❌ | 3 | 0 |

## Cross (naturaleza A vs B)
| Naturaleza A | Naturaleza B | winrate A% | avgRounds | maxRounds | timeouts |
| --- | --- | --- | --- | --- | --- |
| cortante | contundente | 0.0 | 2.0 | 2 | 0 |
| cortante | perforante | 0.0 | 2.0 | 2 | 0 |
| cortante | proyectil | 0.0 | 2.0 | 2 | 0 |
| cortante | desarmado | 0.0 | 4.0 | 4 | 0 |
| contundente | cortante | 0.0 | 2.0 | 2 | 0 |
| contundente | perforante | 0.0 | 2.0 | 2 | 0 |
| contundente | proyectil | 0.0 | 2.0 | 2 | 0 |
| contundente | desarmado | 0.0 | 4.0 | 4 | 0 |
| perforante | cortante | 0.0 | 2.0 | 2 | 0 |
| perforante | contundente | 0.0 | 2.0 | 2 | 0 |
| perforante | proyectil | 0.0 | 2.0 | 2 | 0 |
| perforante | desarmado | 0.0 | 4.0 | 4 | 0 |
| proyectil | cortante | 100.0 | 2.0 | 2 | 0 |
| proyectil | contundente | 100.0 | 2.0 | 2 | 0 |
| proyectil | perforante | 100.0 | 2.0 | 2 | 0 |
| proyectil | desarmado | 100.0 | 2.0 | 2 | 0 |
| desarmado | cortante | 0.0 | 2.0 | 2 | 0 |
| desarmado | contundente | 0.0 | 2.0 | 2 | 0 |
| desarmado | perforante | 0.0 | 2.0 | 2 | 0 |
| desarmado | proyectil | 0.0 | 2.0 | 2 | 0 |

## Invariantes
- Sin timeouts: ✅ OK
- Espejo en target 7 ±1.5: 0/5