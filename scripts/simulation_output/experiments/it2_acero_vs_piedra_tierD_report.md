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
| 100 | actual | cortante | acero vs piedra | total vs total | 100.0 | 8.5 | 6 | 26 | 0 | 2 | 8 | 104 | 324 | 1 |
| 150 | actual | cortante | acero vs piedra | total vs total | 50.0 | 7.0 | 10.6 | 51.5 | 0 | 2.8 | 11.5 | 154 | 324 | 1.5 |
| 199 | actual | cortante | acero vs piedra | total vs total | 50.0 | 7.5 | 11.8 | 63.5 | 0 | 3.2 | 11 | 208 | 324 | 2 |
| 250 | actual | cortante | acero vs piedra | total vs total | 50.0 | 8.0 | 15.8 | 84 | 1.7 | 3.3 | 12.2 | 234.5 | 324 | 2.5 |
| 300 | actual | cortante | acero vs piedra | total vs total | 100.0 | 7.5 | 23.3 | 83.5 | 5 | 3.7 | 11.5 | 238 | 324 | 2.5 |

## Invariantes (por nivel)
- Nivel 100: espejo fuera de 50±5%: actual/cortante/total=100.0%
- Nivel 150: espejo fuera de 50±5%: ninguno ✅
- Nivel 199: espejo fuera de 50±5%: ninguno ✅
- Nivel 250: espejo fuera de 50±5%: ninguno ✅
- Nivel 300: espejo fuera de 50±5%: actual/cortante/total=100.0%