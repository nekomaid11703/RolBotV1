# Laboratorio Modos de Armadura × Nivel (Fase C)

Config: sims/par=200 | nominal=20 | maxRounds=30
Niveles: 150 | Modos: actual | Armas: cortante
Material por nivel: CRUCE (A=acero, B=piedra).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 150 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | matA vs matB | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 150 | actual | cortante | acero vs piedra | total vs total | 50.0 | 7.0 | 10.6 | 51.5 | 0 | 2.8 | 11.5 | 147 | 324 | 1.5 |

## Invariantes (por nivel)
- Nivel 150: espejo fuera de 50±5%: ninguno ✅