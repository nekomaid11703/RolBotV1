# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=1000 | nominal=20 | maxRounds=30
Niveles: 250, 350, 399 | Modos: actual | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 250 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Nivel 350 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Nivel 399 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 250 | actual | cortante | none vs none | 50.0 | 2.0 | 89 | 106 | 51 | 0 | 0 | 0 | 0 | 0 |
| 250 | actual | cortante | none vs total | 50.0 | 4.0 | 25.4 | 106 | 1.6 | 5.4 | 18 | 0 | 0 | 0 |
| 250 | actual | cortante | total vs none | 50.0 | 4.0 | 33.4 | 77.5 | 19.1 | 0 | 0 | 173 | 244 | 2.5 |
| 250 | actual | cortante | total vs total | 50.0 | 5.0 | 23.3 | 93.5 | 1.2 | 5.3 | 17.8 | 224 | 244 | 3.5 |
| 250 | actual | contundente | none vs none | 50.0 | 2.0 | 106.5 | 61.5 | 67 | 0 | 0 | 0 | 0 | 0 |
| 250 | actual | contundente | none vs total | 50.0 | 4.5 | 27.6 | 112 | 4.8 | 4.4 | 15.6 | 0 | 0 | 0 |
| 250 | actual | contundente | total vs none | 50.0 | 4.5 | 43.3 | 69 | 28.7 | 0 | 0 | 155.5 | 244 | 2.5 |
| 250 | actual | contundente | total vs total | 50.0 | 5.0 | 36.3 | 117.5 | 12.8 | 3.3 | 12 | 244 | 244 | 4 |
| 250 | actual | perforante | none vs none | 50.0 | 2.0 | 71 | 97 | 28 | 0 | 0 | 0 | 0 | 0 |
| 250 | actual | perforante | none vs total | 0.0 | 3.5 | 20.6 | 123 | 0 | 5.9 | 22.6 | 0 | 0 | 0 |
| 250 | actual | perforante | total vs none | 100.0 | 3.5 | 42.6 | 72 | 16 | 0 | 0 | 98 | 244 | 1 |
| 250 | actual | perforante | total vs total | 50.0 | 5.0 | 21.6 | 97.5 | 0 | 6.2 | 23.6 | 140 | 244 | 1.5 |
| 250 | actual | proyectil | none vs none | 50.0 | 2.0 | 63 | 93 | 21 | 0 | 0 | 0 | 0 | 0 |
| 250 | actual | proyectil | none vs total | 0.0 | 2.0 | 18 | 123 | 0 | 5 | 19 | 0 | 0 | 0 |
| 250 | actual | proyectil | total vs none | 100.0 | 2.0 | 63 | 27 | 21 | 0 | 0 | 31.5 | 244 | 0 |
| 250 | actual | proyectil | total vs total | 50.0 | 5.0 | 18 | 88.5 | 0 | 5 | 19 | 105 | 244 | 1.5 |
| 350 | actual | cortante | none vs none | 50.0 | 2.0 | 116 | 145 | 66 | 0 | 0 | 0 | 0 | 0 |
| 350 | actual | cortante | none vs total | 0.0 | 2.0 | 21 | 174 | 0 | 6 | 23 | 0 | 0 | 0 |
| 350 | actual | cortante | total vs none | 100.0 | 2.0 | 116 | 31.5 | 66 | 0 | 0 | 99 | 268 | 0.5 |
| 350 | actual | cortante | total vs total | 50.0 | 5.0 | 31.1 | 129 | 6.9 | 5.3 | 20.4 | 266 | 268 | 3.5 |
| 350 | actual | contundente | none vs none | 50.0 | 2.0 | 126 | 150 | 84 | 0 | 0 | 0 | 0 | 0 |
| 350 | actual | contundente | none vs total | 0.0 | 2.0 | 18 | 174 | 0 | 5 | 19 | 0 | 0 | 0 |
| 350 | actual | contundente | total vs none | 100.0 | 2.0 | 126 | 27 | 84 | 0 | 0 | 126 | 268 | 1.5 |
| 350 | actual | contundente | total vs total | 50.0 | 5.0 | 44.8 | 114 | 19 | 3.8 | 14.3 | 260 | 268 | 3.5 |
| 350 | actual | perforante | none vs none | 50.0 | 2.0 | 93 | 133.5 | 37 | 0 | 0 | 0 | 0 | 0 |
| 350 | actual | perforante | none vs total | 0.0 | 2.0 | 24 | 174 | 0 | 7 | 25 | 0 | 0 | 0 |
| 350 | actual | perforante | total vs none | 100.0 | 2.0 | 93 | 36 | 37 | 0 | 0 | 55.5 | 268 | 0.5 |
| 350 | actual | perforante | total vs total | 50.0 | 7.0 | 24.5 | 147 | 0 | 7.3 | 25.8 | 222 | 268 | 2.5 |
| 350 | actual | proyectil | none vs none | 50.0 | 2.0 | 87 | 130.5 | 29 | 0 | 0 | 0 | 0 | 0 |
| 350 | actual | proyectil | none vs total | 50.0 | 3.5 | 24 | 135 | 0 | 8 | 26 | 0 | 0 | 0 |
| 350 | actual | proyectil | total vs none | 50.0 | 3.5 | 90 | 99 | 30 | 0 | 0 | 130.5 | 268 | 1.5 |
| 350 | actual | proyectil | total vs total | 50.0 | 5.0 | 24.3 | 100.5 | 0 | 8 | 26.3 | 132 | 268 | 1.5 |
| 399 | actual | cortante | none vs none | 50.0 | 2.0 | 119 | 158.5 | 68 | 0 | 0 | 0 | 0 | 0 |
| 399 | actual | cortante | none vs total | 50.0 | 3.5 | 48.4 | 158.5 | 10.3 | 5.9 | 19.1 | 0 | 0 | 0 |
| 399 | actual | cortante | total vs none | 50.0 | 3.5 | 59.5 | 121 | 34 | 0 | 0 | 202 | 268 | 3 |
| 399 | actual | cortante | total vs total | 50.0 | 5.0 | 46.2 | 159.5 | 8.4 | 5.3 | 17.3 | 268 | 268 | 4 |
| 399 | actual | contundente | none vs none | 50.0 | 2.0 | 132 | 165 | 88 | 0 | 0 | 0 | 0 | 0 |
| 399 | actual | contundente | none vs total | 50.0 | 3.0 | 42.7 | 165 | 14 | 6 | 19.3 | 0 | 0 | 0 |
| 399 | actual | contundente | total vs none | 50.0 | 3.0 | 66 | 118 | 44 | 0 | 0 | 222 | 268 | 3 |
| 399 | actual | contundente | total vs total | 50.0 | 5.0 | 48.5 | 191.5 | 21 | 5.3 | 16.9 | 268 | 268 | 4 |
| 399 | actual | perforante | none vs none | 50.0 | 3.0 | 103 | 148 | 39 | 0 | 0 | 0 | 0 | 0 |
| 399 | actual | perforante | none vs total | 50.0 | 5.0 | 33.8 | 148 | 0.6 | 8.8 | 28.1 | 0 | 0 | 0 |
| 399 | actual | perforante | total vs none | 50.0 | 5.0 | 56 | 124 | 22.3 | 0 | 0 | 173 | 268 | 2.5 |
| 399 | actual | perforante | total vs total | 50.0 | 5.0 | 29.8 | 149 | 0 | 9.8 | 31.4 | 195 | 268 | 2.5 |
| 399 | actual | proyectil | none vs none | 50.0 | 2.0 | 91 | 144.5 | 30 | 0 | 0 | 0 | 0 | 0 |
| 399 | actual | proyectil | none vs total | 50.0 | 3.5 | 26 | 147 | 0 | 8 | 27 | 0 | 0 | 0 |
| 399 | actual | proyectil | total vs none | 50.0 | 3.5 | 92.3 | 112 | 30.5 | 0 | 0 | 135 | 268 | 1.5 |
| 399 | actual | proyectil | total vs total | 50.0 | 5.0 | 26.1 | 112.5 | 0 | 8.1 | 27.1 | 136 | 268 | 1.5 |

## Invariantes (por nivel)
- Nivel 250: espejo fuera de 50±5%: ninguno ✅
- Nivel 350: espejo fuera de 50±5%: ninguno ✅
- Nivel 399: espejo fuera de 50±5%: ninguno ✅