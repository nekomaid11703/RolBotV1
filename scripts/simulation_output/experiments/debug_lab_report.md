# Laboratorio de Naturalezas — Fase B

Config: sims=100/par | nivel=300 | nominalDamage=20 | tier=B | maxRounds=30
Build: NEUTRAL (misma stats para todas; solo cambia la fórmula del arma)
Método: swap de orden de ataque por sim (anula el sesgo del primer atacante)

## Espejos (winrate ~50%, mide turnos)
Target: 7 turnos de media | desventaja ≤ 30

| Naturaleza | avgRounds | maxRounds | timeouts | avgDmg/golpe |
| --- | --- | --- | --- | --- |
| cortante | 3.0 ❌ | 3 | 0 | 63 |
| contundente | 3.0 ❌ | 3 | 0 | 53 |
| perforante | 3.0 ❌ | 3 | 0 | 70 |
| proyectil | 3.0 ❌ | 3 | 0 | 40 |
| desarmado | 5.0 ⚠️ | 5 | 0 | 0 |

## Invariantes
- Sin timeouts: ✅ OK
- Espejo en target 7 ±1.5: 0/5