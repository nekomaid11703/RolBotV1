# Laboratorio Modos de Armadura × Nivel (Fase C)

Config: sims/par=800 | nominal=20 | maxRounds=30
Niveles: 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300 | Modos: actual | Armas: cortante
Material por nivel: CRUCE (A=acero, B=piedra).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 100 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 100.0% |

## Nivel 120 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 50.0% |

## Nivel 140 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 100.0% |

## Nivel 160 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 100.0% |

## Nivel 180 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 50.0% |

## Nivel 200 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 50.0% |

## Nivel 220 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 100.0% |

## Nivel 240 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 50.0% |

## Nivel 260 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 50.0% |

## Nivel 280 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 100.0% |

## Nivel 300 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | Total |
| --- | --- | --- |
| actual | cortante | 100.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | matA vs matB | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | actual | cortante | acero vs piedra | total vs total | 100.0 | 7.5 | 7 | 22 | 0 | 2 | 7 | 82.5 | 324 | 0.5 |
| 120 | actual | cortante | acero vs piedra | total vs total | 50.0 | 6.5 | 9.3 | 38 | 0 | 2.6 | 9.9 | 117 | 324 | 1 |
| 140 | actual | cortante | acero vs piedra | total vs total | 100.0 | 8.5 | 9 | 33 | 0 | 2 | 8 | 110 | 324 | 1 |
| 160 | actual | cortante | acero vs piedra | total vs total | 100.0 | 9.5 | 12.2 | 39 | 2 | 1.8 | 8 | 136.5 | 324 | 1 |
| 180 | actual | cortante | acero vs piedra | total vs total | 50.0 | 7.0 | 13.6 | 58.5 | 1.1 | 3.4 | 10.6 | 161 | 324 | 1.5 |
| 200 | actual | cortante | acero vs piedra | total vs total | 50.0 | 7.5 | 12.8 | 65.5 | 0.3 | 3.2 | 12.9 | 210 | 352 | 2 |
| 220 | actual | cortante | acero vs piedra | total vs total | 100.0 | 8.0 | 14.4 | 67.5 | 1.5 | 2.6 | 10.5 | 225 | 352 | 2 |
| 240 | actual | cortante | acero vs piedra | total vs total | 50.0 | 7.0 | 18.1 | 79.5 | 2.6 | 3.9 | 14.4 | 224 | 352 | 2 |
| 260 | actual | cortante | acero vs piedra | total vs total | 50.0 | 7.5 | 15.8 | 87 | 0.5 | 4.2 | 14.3 | 258.5 | 352 | 2.5 |
| 280 | actual | cortante | acero vs piedra | total vs total | 100.0 | 8.0 | 24 | 58.5 | 6.5 | 3 | 9.8 | 221 | 352 | 2 |
| 300 | actual | cortante | acero vs piedra | total vs total | 100.0 | 6.5 | 29.2 | 67 | 6 | 4 | 14.6 | 203.5 | 384 | 1.5 |

## Invariantes (por nivel)
- Nivel 100: espejo fuera de 50±5%: actual/cortante/total=100.0%
- Nivel 120: espejo fuera de 50±5%: ninguno ✅
- Nivel 140: espejo fuera de 50±5%: actual/cortante/total=100.0%
- Nivel 160: espejo fuera de 50±5%: actual/cortante/total=100.0%
- Nivel 180: espejo fuera de 50±5%: ninguno ✅
- Nivel 200: espejo fuera de 50±5%: ninguno ✅
- Nivel 220: espejo fuera de 50±5%: actual/cortante/total=100.0%
- Nivel 240: espejo fuera de 50±5%: ninguno ✅
- Nivel 260: espejo fuera de 50±5%: ninguno ✅
- Nivel 280: espejo fuera de 50±5%: actual/cortante/total=100.0%
- Nivel 300: espejo fuera de 50±5%: actual/cortante/total=100.0%