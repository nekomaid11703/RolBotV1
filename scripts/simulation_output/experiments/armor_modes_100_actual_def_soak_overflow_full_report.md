# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=200 | nominal=20 | maxRounds=30
Niveles: 100 | Modos: actual, def, soak, overflow, full | Armas: cortante
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 100 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| def | cortante | 50.0% | 50.0% |
| soak | cortante | 50.0% | 50.0% |
| overflow | cortante | 50.0% | 50.0% |
| full | cortante | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | actual | cortante | none vs none | 50.0 | 3.0 | 22 | 22 | 29 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs total | 100.0 | 3.0 | 22 | 35 | 0 | 0 | 0 | 43.5 | 112 | 0.5 |
| 100 | actual | cortante | total vs none | 0.0 | 3.0 | 22 | 35 | 29 | 0 | 0 | 43.5 | 112 | 0.5 |
| 100 | actual | cortante | total vs total | 50.0 | 3.0 | 22 | 48 | 0 | 0 | 0 | 87 | 224 | 1 |
| 100 | def | cortante | none vs none | 50.0 | 3.0 | 22 | 22 | 29 | 0 | 0 | 0 | 0 | 0 |
| 100 | def | cortante | none vs total | 100.0 | 7.5 | 13.5 | 46 | 0 | 0 | 12 | 58 | 112 | 1 |
| 100 | def | cortante | total vs none | 0.0 | 7.5 | 8.8 | 46 | 11.6 | 0 | 0 | 58 | 112 | 1 |
| 100 | def | cortante | total vs total | 50.0 | 4.0 | 12 | 48 | 0 | 0 | 10 | 116 | 224 | 2 |
| 100 | soak | cortante | none vs none | 50.0 | 3.0 | 17 | 34 | 29 | 5 | 0 | 0 | 0 | 0 |
| 100 | soak | cortante | none vs total | 100.0 | 3.0 | 17 | 41 | 0 | 5 | 0 | 43.5 | 112 | 0.5 |
| 100 | soak | cortante | total vs none | 0.0 | 3.0 | 17 | 41 | 29 | 5 | 0 | 43.5 | 112 | 0.5 |
| 100 | soak | cortante | total vs total | 50.0 | 3.0 | 17 | 48 | 0 | 5 | 0 | 87 | 224 | 1 |
| 100 | overflow | cortante | none vs none | 50.0 | 1.0 | 51 | 0 | 29 | 0 | 0 | 0 | 0 | 0 |
| 100 | overflow | cortante | none vs total | 0.0 | 1.5 | 22 | 35 | 0 | 0 | 0 | 14.5 | 112 | 0 |
| 100 | overflow | cortante | total vs none | 100.0 | 1.5 | 51 | 35 | 29 | 0 | 0 | 14.5 | 112 | 0 |
| 100 | overflow | cortante | total vs total | 50.0 | 3.0 | 22 | 48 | 0 | 0 | 0 | 87 | 224 | 1 |
| 100 | full | cortante | none vs none | 50.0 | 2.0 | 46 | 0 | 29 | 5 | 0 | 0 | 0 | 0 |
| 100 | full | cortante | none vs total | 50.0 | 8.5 | 10.7 | 48 | 0 | 3 | 12.2 | 72.5 | 112 | 1 |
| 100 | full | cortante | total vs none | 50.0 | 8.5 | 11.5 | 48 | 7.3 | 1.3 | 0 | 72.5 | 112 | 1 |
| 100 | full | cortante | total vs total | 50.0 | 6.0 | 9 | 48 | 0 | 3 | 10 | 174 | 224 | 3 |

## Invariantes (por nivel)
- Nivel 100: espejo fuera de 50±5%: ninguno ✅