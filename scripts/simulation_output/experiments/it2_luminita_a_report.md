# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=1000 | nominal=20 | maxRounds=30
Niveles: 400, 450, 500 | Modos: actual | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 400 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

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
| 400 | actual | cortante | none vs none | 50.0 | 2.0 | 191.5 | 99 | 102 | 0 | 0 | 0 | 0 | 0 |
| 400 | actual | cortante | none vs total | 0.0 | 2.5 | 24 | 198 | 0 | 8 | 45 | 0 | 0 | 0 |
| 400 | actual | cortante | total vs none | 100.0 | 2.5 | 179 | 12 | 102 | 0 | 0 | 51 | 480 | 0 |
| 400 | actual | cortante | total vs total | 50.0 | 5.0 | 39.6 | 147 | 3.3 | 8 | 46.7 | 444 | 480 | 3.5 |
| 400 | actual | contundente | none vs none | 50.0 | 2.0 | 182.5 | 99 | 115 | 0 | 0 | 0 | 0 | 0 |
| 400 | actual | contundente | none vs total | 0.0 | 2.5 | 18 | 198 | 0 | 6 | 34 | 0 | 0 | 0 |
| 400 | actual | contundente | total vs none | 100.0 | 2.5 | 173 | 9 | 115 | 0 | 0 | 57.5 | 480 | 0 |
| 400 | actual | contundente | total vs total | 50.0 | 5.0 | 37.8 | 135 | 10.6 | 6.2 | 35.1 | 470 | 480 | 3.5 |
| 400 | actual | perforante | none vs none | 50.0 | 2.0 | 145 | 171.5 | 58 | 0 | 0 | 0 | 0 | 0 |
| 400 | actual | perforante | none vs total | 50.0 | 4.0 | 33.8 | 171.5 | 0 | 11.3 | 63.8 | 0 | 0 | 0 |
| 400 | actual | perforante | total vs none | 50.0 | 4.0 | 62.1 | 126 | 24.9 | 0 | 0 | 232 | 480 | 1 |
| 400 | actual | perforante | total vs total | 50.0 | 5.0 | 32.4 | 153 | 0 | 10.8 | 61.2 | 290 | 480 | 1.5 |
| 400 | actual | proyectil | none vs none | 50.0 | 2.0 | 169 | 183.5 | 56 | 0 | 0 | 0 | 0 | 0 |
| 400 | actual | proyectil | none vs total | 0.0 | 1.5 | 36 | 198 | 0 | 11 | 66 | 0 | 0 | 0 |
| 400 | actual | proyectil | total vs none | 100.0 | 1.5 | 186 | 18 | 61.7 | 0 | 0 | 28 | 480 | 0 |
| 400 | actual | proyectil | total vs total | 50.0 | 6.0 | 36.9 | 194 | 0 | 11.4 | 67.8 | 316.5 | 480 | 2 |
| 450 | actual | cortante | none vs none | 50.0 | 2.0 | 210 | 112.5 | 105 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | cortante | none vs total | 0.0 | 3.5 | 28.7 | 225 | 0 | 9 | 50 | 0 | 0 | 0 |
| 450 | actual | cortante | total vs none | 100.0 | 3.5 | 131.3 | 43 | 70 | 0 | 0 | 157.5 | 480 | 0.5 |
| 450 | actual | cortante | total vs total | 50.0 | 5.0 | 41.3 | 180.5 | 5 | 8.8 | 48.3 | 450 | 480 | 3.5 |
| 450 | actual | contundente | none vs none | 50.0 | 2.0 | 200 | 112.5 | 120 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | contundente | none vs total | 0.0 | 3.5 | 22 | 225 | 0 | 6.7 | 38 | 0 | 0 | 0 |
| 450 | actual | contundente | total vs none | 100.0 | 3.5 | 126.7 | 33 | 80 | 0 | 0 | 180 | 480 | 1.5 |
| 450 | actual | contundente | total vs total | 50.0 | 5.0 | 53.8 | 175.5 | 13.3 | 4.9 | 28 | 480 | 480 | 4 |
| 450 | actual | perforante | none vs none | 50.0 | 2.0 | 183 | 112.5 | 61 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | perforante | none vs total | 0.0 | 3.5 | 33 | 225 | 0 | 10.3 | 58.7 | 0 | 0 | 0 |
| 450 | actual | perforante | total vs none | 100.0 | 3.5 | 112 | 49.5 | 40.7 | 0 | 0 | 91.5 | 480 | 0.5 |
| 450 | actual | perforante | total vs total | 50.0 | 6.0 | 35.7 | 192 | 0 | 11.5 | 63.8 | 335.5 | 480 | 2.5 |
| 450 | actual | proyectil | none vs none | 50.0 | 2.0 | 172 | 198.5 | 57 | 0 | 0 | 0 | 0 | 0 |
| 450 | actual | proyectil | none vs total | 0.0 | 2.0 | 37 | 225 | 0 | 12 | 66 | 0 | 0 | 0 |
| 450 | actual | proyectil | total vs none | 100.0 | 2.0 | 184.5 | 55.5 | 61.3 | 0 | 0 | 85.5 | 480 | 0 |
| 450 | actual | proyectil | total vs total | 50.0 | 6.0 | 37.9 | 223.5 | 0 | 12.3 | 67.6 | 350.5 | 480 | 2 |
| 500 | actual | cortante | none vs none | 50.0 | 2.0 | 200.5 | 124.5 | 107 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | cortante | none vs total | 0.0 | 2.5 | 27 | 249 | 0 | 8 | 45 | 0 | 0 | 0 |
| 500 | actual | cortante | total vs none | 100.0 | 2.5 | 187 | 13.5 | 107 | 0 | 0 | 53.5 | 480 | 0 |
| 500 | actual | cortante | total vs total | 50.0 | 6.0 | 56.5 | 178.5 | 16.2 | 6.4 | 36 | 454 | 480 | 3.5 |
| 500 | actual | contundente | none vs none | 50.0 | 2.0 | 186 | 217.5 | 124 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | contundente | none vs total | 0.0 | 2.0 | 21 | 249 | 0 | 6 | 35 | 0 | 0 | 0 |
| 500 | actual | contundente | total vs none | 100.0 | 2.0 | 186 | 31.5 | 124 | 0 | 0 | 186 | 480 | 1.5 |
| 500 | actual | contundente | total vs total | 50.0 | 5.0 | 52 | 195 | 17.3 | 4 | 23.3 | 480 | 480 | 4 |
| 500 | actual | perforante | none vs none | 50.0 | 2.0 | 158 | 203.5 | 63 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | perforante | none vs total | 0.0 | 2.0 | 32 | 249 | 0 | 10 | 53 | 0 | 0 | 0 |
| 500 | actual | perforante | total vs none | 100.0 | 2.0 | 158 | 48 | 63 | 0 | 0 | 94.5 | 480 | 0.5 |
| 500 | actual | perforante | total vs total | 50.0 | 7.0 | 39.5 | 204.5 | 1.8 | 9.5 | 50.3 | 397.5 | 480 | 3 |
| 500 | actual | proyectil | none vs none | 50.0 | 2.0 | 177 | 213 | 59 | 0 | 0 | 0 | 0 | 0 |
| 500 | actual | proyectil | none vs total | 0.0 | 2.0 | 39 | 249 | 0 | 13 | 66 | 0 | 0 | 0 |
| 500 | actual | proyectil | total vs none | 100.0 | 2.0 | 188.5 | 58.5 | 62.8 | 0 | 0 | 88.5 | 480 | 0 |
| 500 | actual | proyectil | total vs total | 50.0 | 6.0 | 39.8 | 222 | 0 | 13.3 | 67.5 | 361.5 | 480 | 2.5 |

## Invariantes (por nivel)
- Nivel 400: espejo fuera de 50±5%: ninguno ✅
- Nivel 450: espejo fuera de 50±5%: ninguno ✅
- Nivel 500: espejo fuera de 50±5%: ninguno ✅