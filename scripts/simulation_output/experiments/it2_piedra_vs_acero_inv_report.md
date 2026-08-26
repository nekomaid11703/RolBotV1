# Laboratorio Modos de Armadura × Nivel (Fase C)

Config: sims/par=800 | nominal=20 | maxRounds=30
Niveles: 100, 150, 250, 300 | Modos: actual | Armas: cortante
Material por nivel: CRUCE (A=piedra, B=acero).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 100 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 0.0% |

## Nivel 150 — winrate A% (diagonal espejo, fila A = columna B)
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
| actual | cortante | 0.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | matA vs matB | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | actual | cortante | piedra vs acero | total vs total | 0.0 | 7.5 | 4 | 48 | 0 | 1 | 6 | 147 | 216 | 2 |
| 150 | actual | cortante | piedra vs acero | total vs total | 50.0 | 7.0 | 7.7 | 57.5 | 0 | 1.9 | 10.7 | 143 | 216 | 2 |
| 250 | actual | cortante | piedra vs acero | total vs total | 50.0 | 7.5 | 12 | 97.5 | 0 | 2.5 | 14.8 | 241 | 260 | 3.5 |
| 300 | actual | cortante | piedra vs acero | total vs total | 0.0 | 6.5 | 12.2 | 150 | 0 | 3.7 | 18.6 | 260 | 260 | 4 |

## Invariantes (por nivel)
- Nivel 100: espejo fuera de 50±5%: actual/cortante/total=0.0%
- Nivel 150: espejo fuera de 50±5%: ninguno ✅
- Nivel 250: espejo fuera de 50±5%: ninguno ✅
- Nivel 300: espejo fuera de 50±5%: actual/cortante/total=0.0%