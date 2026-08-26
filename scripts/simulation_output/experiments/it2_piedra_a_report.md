# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=1000 | nominal=20 | maxRounds=30
Niveles: 100, 150, 199 | Modos: actual | Armas: cortante, contundente, perforante, proyectil
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 100 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Nivel 150 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 0.0% |

## Nivel 199 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| actual | contundente | 50.0% | 50.0% |
| actual | perforante | 50.0% | 50.0% |
| actual | proyectil | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | actual | cortante | none vs none | 50.0 | 2.0 | 26 | 37 | 15 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs total | 0.0 | 2.5 | 5 | 48 | 0 | 1 | 5 | 0 | 0 | 0 |
| 100 | actual | cortante | total vs none | 100.0 | 2.5 | 26 | 10 | 15 | 0 | 0 | 30 | 216 | 0 |
| 100 | actual | cortante | total vs total | 50.0 | 12.0 | 5 | 44 | 0 | 1 | 5 | 135 | 216 | 2 |
| 100 | actual | contundente | none vs none | 50.0 | 2.0 | 36 | 42 | 24 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | contundente | none vs total | 0.0 | 2.5 | 6 | 48 | 0 | 1 | 5 | 0 | 0 | 0 |
| 100 | actual | contundente | total vs none | 100.0 | 2.5 | 36 | 12 | 24 | 0 | 0 | 48 | 216 | 0 |
| 100 | actual | contundente | total vs total | 50.0 | 8.0 | 6 | 42 | 0 | 1 | 5 | 168 | 216 | 2.5 |
| 100 | actual | perforante | none vs none | 50.0 | 3.0 | 18 | 42 | 7 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | perforante | none vs total | 0.0 | 3.5 | 5 | 48 | 0 | 1 | 5 | 0 | 0 | 0 |
| 100 | actual | perforante | total vs none | 100.0 | 3.5 | 18 | 15 | 7 | 0 | 0 | 21 | 216 | 0 |
| 100 | actual | perforante | total vs total | 50.0 | 12.0 | 5 | 44 | 0 | 1 | 5 | 63 | 216 | 1 |
| 100 | actual | proyectil | none vs none | 50.0 | 4.0 | 12 | 36 | 4 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | proyectil | none vs total | 0.0 | 4.5 | 3.3 | 48 | 0 | 1 | 3 | 0 | 0 | 0 |
| 100 | actual | proyectil | total vs none | 100.0 | 4.5 | 10.9 | 10 | 3.4 | 0 | 0 | 10 | 216 | 0 |
| 100 | actual | proyectil | total vs total | 50.0 | 25.0 | 2.4 | 46.5 | 0 | 0.7 | 2.1 | 46.5 | 216 | 0 |
| 150 | actual | cortante | none vs none | 50.0 | 2.0 | 42 | 58.5 | 21 | 0 | 0 | 0 | 0 | 0 |
| 150 | actual | cortante | none vs total | 0.0 | 2.5 | 9 | 75 | 0 | 3 | 9 | 0 | 0 | 0 |
| 150 | actual | cortante | total vs none | 100.0 | 2.5 | 42 | 18 | 21 | 0 | 0 | 42 | 216 | 0 |
| 150 | actual | cortante | total vs total | 50.0 | 7.0 | 8.7 | 53.5 | 0 | 2.8 | 8.7 | 136.5 | 216 | 2 |
| 150 | actual | contundente | none vs none | 50.0 | 2.0 | 57 | 37.5 | 34 | 0 | 0 | 0 | 0 | 0 |
| 150 | actual | contundente | none vs total | 0.0 | 4.0 | 10 | 75 | 0 | 3 | 10 | 0 | 0 | 0 |
| 150 | actual | contundente | total vs none | 100.0 | 4.0 | 38 | 20 | 22.7 | 0 | 0 | 68 | 216 | 0.5 |
| 150 | actual | contundente | total vs total | 50.0 | 6.0 | 12.8 | 55.5 | 2 | 2.5 | 8.5 | 176 | 216 | 3 |
| 150 | actual | perforante | none vs none | 50.0 | 3.0 | 31 | 53 | 10 | 0 | 0 | 0 | 0 | 0 |
| 150 | actual | perforante | none vs total | 50.0 | 7.0 | 9 | 68.5 | 0 | 3 | 9 | 0 | 0 | 0 |
| 150 | actual | perforante | total vs none | 50.0 | 7.0 | 12.9 | 46.5 | 4.2 | 0 | 0 | 55 | 216 | 0.5 |
| 150 | actual | perforante | total vs total | 50.0 | 7.0 | 8.7 | 53.5 | 0 | 2.8 | 8.7 | 65 | 216 | 0.5 |
| 150 | actual | proyectil | none vs none | 50.0 | 31.0 | 2 | 59 | 1 | 0 | 0 | 0 | 0 | 0 |
| 150 | actual | proyectil | none vs total | 0.0 | 31.0 | 1 | 60 | 0 | 0 | 0 | 0 | 0 | 0 |
| 150 | actual | proyectil | total vs none | 100.0 | 31.0 | 2 | 28.5 | 1 | 0 | 0 | 28.5 | 216 | 0 |
| 150 | actual | proyectil | total vs total | 0.0 | 31.0 | 1 | 30 | 0 | 0 | 0 | 30 | 216 | 0 |
| 199 | actual | cortante | none vs none | 50.0 | 3.0 | 43.5 | 70.5 | 24 | 0 | 0 | 0 | 0 | 0 |
| 199 | actual | cortante | none vs total | 0.0 | 4.5 | 9.5 | 99 | 0 | 2.5 | 9 | 0 | 0 | 0 |
| 199 | actual | cortante | total vs none | 100.0 | 4.5 | 28.7 | 28.5 | 16 | 0 | 0 | 72 | 216 | 0.5 |
| 199 | actual | cortante | total vs total | 50.0 | 7.0 | 10.2 | 69.5 | 0 | 2.4 | 8.4 | 168 | 216 | 3 |
| 199 | actual | contundente | none vs none | 50.0 | 2.0 | 60 | 79.5 | 40 | 0 | 0 | 0 | 0 | 0 |
| 199 | actual | contundente | none vs total | 0.0 | 3.0 | 10.8 | 99 | 0 | 3 | 10.4 | 0 | 0 | 0 |
| 199 | actual | contundente | total vs none | 100.0 | 3.0 | 40 | 27 | 26.7 | 0 | 0 | 100 | 216 | 1.5 |
| 199 | actual | contundente | total vs total | 50.0 | 5.0 | 14.7 | 67.5 | 2.4 | 2.7 | 9.2 | 188 | 216 | 3 |
| 199 | actual | perforante | none vs none | 50.0 | 4.0 | 32 | 80.5 | 12 | 0 | 0 | 0 | 0 | 0 |
| 199 | actual | perforante | none vs total | 0.0 | 5.5 | 9.9 | 99 | 0 | 2.4 | 9.3 | 0 | 0 | 0 |
| 199 | actual | perforante | total vs none | 100.0 | 5.5 | 22.3 | 44.5 | 8.4 | 0 | 0 | 54 | 216 | 0.5 |
| 199 | actual | perforante | total vs total | 50.0 | 8.0 | 10.1 | 72 | 0 | 2.5 | 9.6 | 90 | 216 | 1.5 |
| 199 | actual | proyectil | none vs none | 50.0 | 12.0 | 8.4 | 91 | 2.8 | 0 | 0 | 0 | 0 | 0 |
| 199 | actual | proyectil | none vs total | 0.0 | 10.0 | 3 | 99 | 0 | 1 | 2 | 0 | 0 | 0 |
| 199 | actual | proyectil | total vs none | 100.0 | 10.0 | 9 | 25.5 | 3 | 0 | 0 | 25.5 | 216 | 0 |
| 199 | actual | proyectil | total vs total | 50.0 | 31.0 | 3 | 85.5 | 0 | 1 | 2 | 85.5 | 216 | 1 |

## Invariantes (por nivel)
- Nivel 100: espejo fuera de 50±5%: ninguno ✅
- Nivel 150: espejo fuera de 50±5%: actual/proyectil/total=0.0%
- Nivel 199: espejo fuera de 50±5%: ninguno ✅