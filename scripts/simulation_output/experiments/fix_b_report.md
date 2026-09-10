# Laboratorio de Naturalezas — Fase B

Config: sims=300/par | nivel=300 | nominalDamage=20 | tier=B | maxRounds=30
Build: NEUTRAL (misma stats para todas; solo cambia la fórmula del arma)
Método: swap de orden de ataque por sim (anula el sesgo del primer atacante)

## Espejos (winrate ~50%, mide turnos)
Target: 7 turnos de media | desventaja ≤ 30

| Naturaleza | avgRounds | maxRounds | timeouts | avgDmg/golpe |
| --- | --- | --- | --- | --- |
| cortante | 2.0 ❌ | 2 | 0 | - |
| contundente | 2.0 ❌ | 2 | 0 | - |
| perforante | 2.0 ❌ | 2 | 0 | - |
| proyectil | 4.0 ⚠️ | 4 | 0 | 40 |
| desarmado | 3.0 ❌ | 3 | 0 | - |

## Cross (naturaleza A vs B, winrate sin sesgo de orden)
| Naturaleza A | Naturaleza B | winrate A% | avgRounds | maxRounds | timeouts | dmgA | dmgB |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cortante | contundente | 50.0 | 2.0 | 2 | 0 | - | 58 |
| cortante | perforante | 50.0 | 2.0 | 2 | 0 | - | 66.5 |
| cortante | proyectil | 0.0 | 3.5 | 4 | 0 | 42.3 | 42.2 |
| cortante | desarmado | 50.0 | 3.0 | 4 | 0 | - | 44.3 |
| contundente | cortante | 50.0 | 2.0 | 2 | 0 | - | 58 |
| contundente | perforante | 50.0 | 2.0 | 2 | 0 | - | 61.5 |
| contundente | proyectil | 0.0 | 3.5 | 4 | 0 | 40 | 40.8 |
| contundente | desarmado | 50.0 | 3.0 | 4 | 0 | - | 40.5 |
| perforante | cortante | 50.0 | 2.0 | 2 | 0 | - | 66.5 |
| perforante | contundente | 50.0 | 2.0 | 2 | 0 | - | 61.5 |
| perforante | proyectil | 0.0 | 3.5 | 4 | 0 | 44.3 | 43.4 |
| perforante | desarmado | 50.0 | 3.0 | 4 | 0 | - | 46.9 |
| proyectil | cortante | 100.0 | 3.5 | 4 | 0 | 42.3 | 42.2 |
| proyectil | contundente | 100.0 | 3.5 | 4 | 0 | 40 | 40.8 |
| proyectil | perforante | 100.0 | 3.5 | 4 | 0 | 44.3 | 43.4 |
| proyectil | desarmado | 100.0 | 3.5 | 4 | 0 | 37.7 | 40.2 |
| desarmado | cortante | 50.0 | 3.0 | 4 | 0 | - | 44.3 |
| desarmado | contundente | 50.0 | 3.0 | 4 | 0 | - | 40.5 |
| desarmado | perforante | 50.0 | 3.0 | 4 | 0 | - | 46.9 |
| desarmado | proyectil | 0.0 | 3.5 | 4 | 0 | 37.7 | 40.2 |

## Invariantes
- Sin timeouts: ✅ OK
- Espejo en target 7 ±1.5: 0/5