# Laboratorio Modos de Armadura × Nivel (Iteración 1 Fase C)

Config: sims/par=300 | nominal=20 | maxRounds=30
Niveles: 100 | Modos: actual, overflow, full | Armas: cortante
Material por nivel: NATURAL (generador de familias).

Lectura R3 (armadura protege HP real): comparar avgHpLossA entre 'actual' y los modos en cada nivel.
Lectura R2 (espejo ~50%): winrateA en covA==covB debe quedar 50±5%.
Spec §3: avgOverflowPerHit > 0 significa que el overflow de material NO se convirtió en daño a HP.

## Nivel 100 — winrate A% (diagonal espejo, fila A = columna B)
| Modo | Arma | None | Total |
| --- | --- | --- | --- |
| actual | cortante | 50.0% | 50.0% |
| overflow | cortante | 50.0% | 50.0% |
| full | cortante | 50.0% | 50.0% |

## Detalle por nivel/modo/arma (espejo + none-vs-total)
| lv | modo | arma | A vs B | win% | avgR | dmg | hpLossA | ovf/hit | soak/hit | defRed | absorb | maxRes | rota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | actual | cortante | none vs none | 50.0 | 2.0 | 26 | 37 | 35 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | cortante | none vs total | 100.0 | 2.0 | 26 | 26 | 0 | 0 | 0 | 0 | 0 | 0 |
| 100 | actual | cortante | total vs none | 0.0 | 2.0 | 26 | 48 | 35 | 0 | 0 | 70 | 272 | 1 |
| 100 | actual | cortante | total vs total | 50.0 | 2.0 | 26 | 37 | 0 | 0 | 0 | 52.5 | 272 | 0.5 |
| 100 | overflow | cortante | none vs none | 50.0 | 1.0 | 61 | 24 | 35 | 0 | 0 | 0 | 0 | 0 |
| 100 | overflow | cortante | none vs total | 0.0 | 1.5 | 26 | 48 | 0 | 0 | 0 | 0 | 0 | 0 |
| 100 | overflow | cortante | total vs none | 100.0 | 1.5 | 61 | 26 | 35 | 0 | 0 | 35 | 272 | 0 |
| 100 | overflow | cortante | total vs total | 50.0 | 2.0 | 26 | 37 | 0 | 0 | 0 | 52.5 | 272 | 0.5 |
| 100 | full | cortante | none vs none | 50.0 | 1.0 | 55 | 24 | 35 | 6 | 0 | 0 | 0 | 0 |
| 100 | full | cortante | none vs total | 0.0 | 1.5 | 9 | 48 | 0 | 3 | 14 | 0 | 0 | 0 |
| 100 | full | cortante | total vs none | 100.0 | 1.5 | 55 | 9 | 35 | 6 | 0 | 35 | 272 | 0 |
| 100 | full | cortante | total vs total | 50.0 | 6.0 | 9 | 42 | 0 | 3 | 14 | 175 | 272 | 2.5 |

## Invariantes (por nivel)
- Nivel 100: espejo fuera de 50±5%: ninguno ✅