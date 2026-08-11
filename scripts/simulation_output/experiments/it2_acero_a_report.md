# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=1000 | nominal=20 | maxRounds=30
Niveles: 150, 250, 299 | Modos: actual | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 150 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Nivel 250 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Nivel 299 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 150 | actual | cortante | none vs none | 50.0 | 2.0 | 52 | 63.5 | 26 | 0 | 0 | 0 | 0 | 0 |
| 150 | actual | cortante | none vs total | 0.0 | 2.5 | 9 | 75 | 0 | 3 | 14 | 0 | 0 | 0 |
| 150 | actual | cortante | total vs none | 100.0 | 2.5 | 52 | 18 | 26 | 0 | 0 | 52 | 324 | 0 |
| 150 | actual | cortante | total vs total | 50.0 | 7.0 | 8.7 | 53.5 | 0 | 2.8 | 13.5 | 169 | 324 | 1.5 |
| 150 | actual | contundente | none vs none | 50.0 | 2.0 | 65 | 37.5 | 39 | 0 | 0 | 0 | 0 | 0 |
| 150 | actual | contundente | none vs total | 0.0 | 4.0 | 9 | 75 | 0 | 3 | 14 | 0 | 0 | 0 |
| 150 | actual | contundente | total vs none | 100.0 | 4.0 | 43.3 | 18 | 26 | 0 | 0 | 78 | 324 | 0.5 |
| 150 | actual | contundente | total vs total | 50.0 | 7.0 | 12.1 | 53.5 | 2.1 | 2.6 | 12.5 | 240 | 324 | 2.5 |
| 150 | actual | perforante | none vs none | 50.0 | 2.0 | 40 | 57.5 | 13 | 0 | 0 | 0 | 0 | 0 |
| 150 | actual | perforante | none vs total | 0.0 | 2.5 | 9 | 75 | 0 | 3 | 15 | 0 | 0 | 0 |
| 150 | actual | perforante | total vs none | 100.0 | 2.5 | 40 | 18 | 13 | 0 | 0 | 26 | 324 | 0 |
| 150 | actual | perforante | total vs total | 50.0 | 7.0 | 8.7 | 53.5 | 0 | 2.8 | 14.4 | 84.5 | 324 | 0.5 |
| 150 | actual | proyectil | none vs none | 50.0 | 4.0 | 24 | 61.5 | 8 | 0 | 0 | 0 | 0 | 0 |
| 150 | actual | proyectil | none vs total | 0.0 | 4.5 | 6 | 75 | 0 | 1 | 9 | 0 | 0 | 0 |
| 150 | actual | proyectil | total vs none | 100.0 | 4.5 | 19 | 15 | 6.3 | 0 | 0 | 20 | 324 | 0 |
| 150 | actual | proyectil | total vs total | 50.0 | 17.0 | 5 | 72 | 0 | 0.8 | 7.1 | 95 | 324 | 1 |
| 250 | actual | cortante | none vs none | 50.0 | 2.0 | 65 | 94 | 37 | 0 | 0 | 0 | 0 | 0 |
| 250 | actual | cortante | none vs total | 0.0 | 3.5 | 11.5 | 123 | 0 | 3.5 | 17.5 | 0 | 0 | 0 |
| 250 | actual | cortante | total vs none | 100.0 | 3.5 | 37.1 | 34.5 | 21.1 | 0 | 0 | 111 | 352 | 0.5 |
| 250 | actual | cortante | total vs total | 50.0 | 8.0 | 14.2 | 86.5 | 1.2 | 3.4 | 17 | 268.5 | 352 | 3 |
| 250 | actual | contundente | none vs none | 50.0 | 2.0 | 81 | 102 | 54 | 0 | 0 | 0 | 0 | 0 |
| 250 | actual | contundente | none vs total | 0.0 | 3.5 | 11.5 | 123 | 0 | 3.5 | 16.5 | 0 | 0 | 0 |
| 250 | actual | contundente | total vs none | 100.0 | 3.5 | 46.3 | 34.5 | 30.9 | 0 | 0 | 162 | 352 | 1.5 |
| 250 | actual | contundente | total vs total | 50.0 | 6.0 | 15.8 | 86.5 | 2.2 | 3.3 | 15.3 | 311 | 352 | 3.5 |
| 250 | actual | perforante | none vs none | 50.0 | 3.0 | 50.5 | 85.5 | 19 | 0 | 0 | 0 | 0 | 0 |
| 250 | actual | perforante | none vs total | 50.0 | 8.0 | 13 | 109.5 | 0 | 3.8 | 19.8 | 0 | 0 | 0 |
| 250 | actual | perforante | total vs none | 50.0 | 8.0 | 17.1 | 71.5 | 6.8 | 0 | 0 | 114 | 352 | 1 |
| 250 | actual | perforante | total vs total | 50.0 | 7.0 | 12.6 | 86.5 | 0 | 3.6 | 19.2 | 133 | 352 | 1 |
| 250 | actual | proyectil | none vs none | 50.0 | 4.0 | 39 | 120 | 13 | 0 | 0 | 0 | 0 | 0 |
| 250 | actual | proyectil | none vs total | 0.0 | 4.5 | 9 | 123 | 0 | 3 | 14 | 0 | 0 | 0 |
| 250 | actual | proyectil | total vs none | 100.0 | 4.5 | 39 | 36 | 13 | 0 | 0 | 52 | 352 | 0 |
| 250 | actual | proyectil | total vs total | 50.0 | 12.0 | 9 | 102 | 0 | 3 | 14 | 149.5 | 352 | 1.5 |
| 299 | actual | cortante | none vs none | 50.0 | 3.0 | 74.5 | 109.5 | 41 | 0 | 0 | 0 | 0 | 0 |
| 299 | actual | cortante | none vs total | 0.0 | 5.0 | 13.5 | 147 | 0 | 3.5 | 19 | 0 | 0 | 0 |
| 299 | actual | cortante | total vs none | 100.0 | 5.0 | 46.3 | 54 | 25.6 | 0 | 0 | 164 | 352 | 1 |
| 299 | actual | cortante | total vs total | 50.0 | 7.0 | 16.1 | 103.5 | 1.2 | 3.3 | 17.9 | 278.5 | 352 | 3 |
| 299 | actual | contundente | none vs none | 50.0 | 2.0 | 87 | 117 | 58 | 0 | 0 | 0 | 0 | 0 |
| 299 | actual | contundente | none vs total | 0.0 | 4.0 | 12.5 | 147 | 0 | 3.5 | 18 | 0 | 0 | 0 |
| 299 | actual | contundente | total vs none | 100.0 | 4.0 | 51.1 | 50 | 33.1 | 0 | 0 | 232 | 352 | 2 |
| 299 | actual | contundente | total vs total | 50.0 | 6.0 | 19.3 | 101 | 4.5 | 3.3 | 16.8 | 321 | 352 | 3.5 |
| 299 | actual | perforante | none vs none | 50.0 | 3.0 | 55 | 128.5 | 22 | 0 | 0 | 0 | 0 | 0 |
| 299 | actual | perforante | none vs total | 0.0 | 4.5 | 13.8 | 147 | 0 | 4.4 | 19.7 | 0 | 0 | 0 |
| 299 | actual | perforante | total vs none | 100.0 | 4.5 | 39.1 | 62 | 14.7 | 0 | 0 | 99 | 352 | 0.5 |
| 299 | actual | perforante | total vs total | 50.0 | 8.0 | 14.1 | 103.5 | 0 | 4.5 | 20.2 | 165 | 352 | 1.5 |
| 299 | actual | proyectil | none vs none | 50.0 | 4.0 | 42 | 136.5 | 14 | 0 | 0 | 0 | 0 | 0 |
| 299 | actual | proyectil | none vs total | 0.0 | 4.5 | 10 | 147 | 0 | 3 | 15 | 0 | 0 | 0 |
| 299 | actual | proyectil | total vs none | 100.0 | 4.5 | 42 | 40 | 14 | 0 | 0 | 56 | 352 | 0 |
| 299 | actual | proyectil | total vs total | 50.0 | 13.0 | 10 | 123.5 | 0 | 3 | 15 | 175 | 352 | 1.5 |

## Invariantes (por nivel)
- Nivel 150: espejo fuera de 50±5%: ninguno ✅
- Nivel 250: espejo fuera de 50±5%: ninguno ✅
- Nivel 299: espejo fuera de 50±5%: ninguno ✅