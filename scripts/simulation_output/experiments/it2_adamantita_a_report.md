# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=1000 | nominal=20 | maxRounds=30
Niveles: 450, 500 | Modos: actual | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 450 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Nivel 500 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 450 | actual | cortante | none vs none | 50.0 | 1.0 | 294 | 112.5 | 147 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | cortante | none vs total | 0.0 | 1.0 | 38 | 225 | 0 | 12 | 97 | 0 | 0 | 0 |
| 450 | actual | cortante | total vs none | 100.0 | 1.0 | 294 | 19 | 147 | 0 | 0 | 73.5 | 688 | 0 |
| 450 | actual | cortante | total vs total | 50.0 | 5.0 | 48.2 | 188.5 | 5.2 | 9.7 | 77.9 | 638 | 688 | 3.5 |
| 450 | actual | contundente | none vs none | 50.0 | 1.0 | 252 | 112.5 | 151 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | contundente | none vs total | 0.0 | 1.0 | 27 | 225 | 0 | 8 | 66 | 0 | 0 | 0 |
| 450 | actual | contundente | total vs none | 100.0 | 1.0 | 252 | 13.5 | 151 | 0 | 0 | 75.5 | 688 | 0 |
| 450 | actual | contundente | total vs total | 50.0 | 5.0 | 37.6 | 166.5 | 7.4 | 6.4 | 53.3 | 646 | 688 | 3.5 |
| 450 | actual | perforante | none vs none | 50.0 | 1.0 | 244 | 112.5 | 81 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | perforante | none vs total | 0.0 | 1.0 | 42 | 225 | 0 | 13 | 108 | 0 | 0 | 0 |
| 450 | actual | perforante | total vs none | 100.0 | 1.0 | 244 | 21 | 81 | 0 | 0 | 40.5 | 688 | 0 |
| 450 | actual | perforante | total vs total | 50.0 | 5.0 | 39 | 181.5 | 0 | 12.1 | 99.6 | 405 | 688 | 1.5 |
| 450 | actual | proyectil | none vs none | 50.0 | 1.0 | 336 | 112.5 | 112 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | proyectil | none vs total | 0.0 | 1.0 | 57 | 225 | 0 | 19 | 148 | 0 | 0 | 0 |
| 450 | actual | proyectil | total vs none | 100.0 | 1.0 | 328.5 | 28.5 | 109.5 | 0 | 0 | 56 | 688 | 0 |
| 450 | actual | proyectil | total vs total | 50.0 | 4.0 | 54.6 | 218.5 | 0 | 17.5 | 139.3 | 421 | 688 | 2 |
| 500 | actual | cortante | none vs none | 50.0 | 1.0 | 261 | 124.5 | 149 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | cortante | none vs total | 0.0 | 1.0 | 30 | 249 | 0 | 9 | 73 | 0 | 0 | 0 |
| 500 | actual | cortante | total vs none | 100.0 | 1.0 | 261 | 15 | 149 | 0 | 0 | 74.5 | 688 | 0 |
| 500 | actual | cortante | total vs total | 50.0 | 5.0 | 45.4 | 184.5 | 6.3 | 8 | 64.9 | 642 | 688 | 3.5 |
| 500 | actual | contundente | none vs none | 50.0 | 2.0 | 247 | 124.5 | 156 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | contundente | none vs total | 0.0 | 2.5 | 21 | 249 | 0 | 7 | 50 | 0 | 0 | 0 |
| 500 | actual | contundente | total vs none | 100.0 | 2.5 | 234 | 10.5 | 156 | 0 | 0 | 78 | 688 | 0 |
| 500 | actual | contundente | total vs total | 50.0 | 5.0 | 37.6 | 166.5 | 10.2 | 6.2 | 44.4 | 656 | 688 | 3.5 |
| 500 | actual | perforante | none vs none | 50.0 | 2.0 | 229 | 124.5 | 83 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | perforante | none vs total | 0.0 | 2.5 | 33 | 249 | 0 | 11 | 81 | 0 | 0 | 0 |
| 500 | actual | perforante | total vs none | 100.0 | 2.5 | 208 | 16.5 | 83 | 0 | 0 | 41.5 | 688 | 0 |
| 500 | actual | perforante | total vs total | 50.0 | 7.0 | 33.8 | 207 | 0 | 11.2 | 83.2 | 539.5 | 688 | 2.5 |
| 500 | actual | proyectil | none vs none | 50.0 | 1.0 | 334 | 124.5 | 111 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | proyectil | none vs total | 0.0 | 1.0 | 59 | 249 | 0 | 19 | 145 | 0 | 0 | 0 |
| 500 | actual | proyectil | total vs none | 100.0 | 1.0 | 332 | 29.5 | 110.5 | 0 | 0 | 55.5 | 688 | 0 |
| 500 | actual | proyectil | total vs total | 50.0 | 5.0 | 55.6 | 239.5 | 0 | 17.6 | 137 | 472.5 | 688 | 2 |

## Invariantes (por nivel)
- Nivel 450: espejo fuera de 50±5%: ninguno ✅
- Nivel 500: espejo fuera de 50±5%: ninguno ✅