# Laboratorio Modos de Armadura × Nivel (Fase C)

Config: sims/par=1000 | nominal=20 | maxRounds=30
Niveles: 100, 150, 199, 250, 300 | Modos: actual | Armas: cortante
Material por nivel: CRUCE (A=acero, B=piedra).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 100 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 100.0% |

## Nivel 150 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 50.0% |

## Nivel 199 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 50.0% |

## Nivel 250 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 50.0% |

## Nivel 300 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 100.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | matA vs matB | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | actual | cortante | acero vs piedra | total vs total | 100.0 | 7.5 | 7 | 22 | 0 | 2 | 7 | 82.5 | 324 | 0.5 |
| 150 | actual | cortante | acero vs piedra | total vs total | 50.0 | 7.0 | 10.6 | 51.5 | 0 | 2.8 | 11.5 | 147 | 324 | 1.5 |
| 199 | actual | cortante | acero vs piedra | total vs total | 50.0 | 7.5 | 13.9 | 63.5 | 1.7 | 3.2 | 10.6 | 192 | 324 | 2 |
| 250 | actual | cortante | acero vs piedra | total vs total | 50.0 | 7.5 | 17 | 79.5 | 2.6 | 3.6 | 13.8 | 240 | 352 | 2.5 |
| 300 | actual | cortante | acero vs piedra | total vs total | 100.0 | 6.5 | 29.2 | 67 | 6 | 4 | 14.6 | 203.5 | 384 | 1.5 |

## Invariantes (por nivel)
- Nivel 100: espejo fuera de 50±5%: actual/cortante/total=100.0%
- Nivel 150: espejo fuera de 50±5%: ninguno ✅
- Nivel 199: espejo fuera de 50±5%: ninguno ✅
- Nivel 250: espejo fuera de 50±5%: ninguno ✅
- Nivel 300: espejo fuera de 50±5%: actual/cortante/total=100.0%