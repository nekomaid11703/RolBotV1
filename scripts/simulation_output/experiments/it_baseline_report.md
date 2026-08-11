# Combat Simulation Report
Generated: 2026-08-07 18:46:11 | 4000 simulations | Max 20 rounds

Config: numSims=4000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.0 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 4000 |
| KO victories | 3932 (98.3%) |
| Timeouts (draws) | 68 (1.7%) |
| Avg rounds (all) | 5.4 |
| Avg rounds (KO only) | 5.1 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 448 |
| Avg rounds | 6.0 |
| P50 / P90 | 4 / 13 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 1884/4000 |
| Winrate | 47.1% |
| Advantage over 50% | -2.9% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 385 | 557 | 69.1% |  |
| Asesino | 155 | 556 | 27.9% |  |
| Esquivo | 155 | 575 | 27.0% |  |
| Equilibrado | 221 | 560 | 39.5% |  |
| Extremista ATK | 347 | 585 | 59.3% |  |
| Extremista DEF | 397 | 557 | 71.3% | YES |
| Extremista ASPD | 323 | 580 | 55.7% |  |
| Extremista REF | 336 | 568 | 59.2% |  |
| Velocista | 111 | 618 | 18.0% |  |
| Berserker | 353 | 611 | 57.8% |  |
| Guardian | 272 | 572 | 47.6% |  |
| Estratega | 328 | 534 | 61.4% |  |
| Gladiador | 372 | 578 | 64.4% |  |
| Magus | 245 | 549 | 44.6% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 25.2 | - |
| Rests | 3.0 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.6 | - |
| Battles with item use | 23.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.2% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.46 (avg 47.58) |
| ASPD spread (stddev) | 31.19 (avg 53.25) |
| Equipment tier A | 268 (3.4%) |
| Equipment tier B | 3298 (41.2%) |
| Equipment tier C | 1411 (17.6%) |
| Equipment tier D | 2235 (27.9%) |
| Equipment tier S | 788 (9.8%) |
| Level 100-199 | 1945 |
| Level 200-299 | 2235 |
| Level 300-399 | 1972 |
| Level 400-500 | 1848 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 1821 |
| cortante | 1823 |
| desarmado | 785 |
| perforante | 3571 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 2641 | 48.2% |
| ligera | 37 | 40.5% |
| media | 254 | 56.7% |
| total | 5068 | 50.7% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 171 | 41.5% |
| 3+ | 7829 | 50.2% |
Set bonus active: 50.2% (7829) vs inactive 41.5% (171)

### Amulet
With amulet: 50.4% (3208) vs without 49.7% (4792)

### Shield
With shield: 50.4% (4784) vs without 49.5% (3216)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 252 | 59.5% |
| B | 2943 | 56.0% |
| C | 1267 | 47.5% |
| D | 2024 | 40.5% |
| S | 729 | 71.3% |
| desarmado | 785 | 33.0% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 1660 | 48.2% |
| adamantita | 363 | 72.2% |
| bronce | 1527 | 42.4% |
| desarmado | 785 | 33.0% |
| filo_estelar | 366 | 70.5% |
| hierro | 1571 | 47.9% |
| mitril | 850 | 61.4% |
| titanio | 878 | 56.8% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 1728 | 59.1% |
| mitico | 729 | 71.3% |
| ninguno | 785 | 33.0% |
| poco_comun | 4758 | 46.2% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 1797 | 48.9% |
| adamantita | 400 | 52.0% |
| bronce | 1776 | 51.1% |
| filo_estelar | 337 | 49.6% |
| hierro | 1742 | 50.1% |
| mitril | 987 | 48.4% |
| ninguno | 1 | 100.0% |
| titanio | 960 | 50.8% |

### Nature by level bracket
- **100-199**: contundente: 462, cortante: 464, desarmado: 171, perforante: 848
- **200-299**: contundente: 471, cortante: 461, desarmado: 232, perforante: 1071
- **300-399**: contundente: 434, cortante: 464, desarmado: 212, perforante: 862
- **400-500**: contundente: 454, cortante: 434, desarmado: 170, perforante: 790

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 47.7% | 1977 | 50.8% | 6023 | -3.1pp |
| d_fulgor | 47.0% | 1980 | 51.0% | 6020 | -4.0pp |
| r_fulgor | 47.3% | 1985 | 50.9% | 6015 | -3.6pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 26.7 | 1 | 146 | 14 | 23 | 36 |
| Asesino | 44.9 | 1 | 176 | 16 | 38 | 68 |
| Esquivo | 26.5 | 0 | 145 | 12 | 21 | 35 |
| Equilibrado | 37.4 | 1 | 145 | 18 | 35 | 50 |
| Extremista ATK | 59.3 | 1 | 163 | 28 | 62 | 84 |
| Extremista DEF | 24.4 | 0 | 159 | 11 | 21 | 33 |
| Extremista ASPD | 50.6 | 1 | 178 | 24 | 45 | 74 |
| Extremista REF | 31.1 | 0 | 145 | 14 | 27 | 42 |
| Velocista | 28.7 | 1 | 119 | 17 | 24 | 35 |
| Berserker | 59.5 | 1 | 175 | 29 | 60 | 84 |
| Guardian | 26.4 | 1 | 123 | 13 | 23 | 34 |
| Estratega | 35.1 | 1 | 157 | 17 | 29 | 48 |
| Gladiador | 51.4 | 1 | 184 | 23 | 48 | 77 |
| Magus | 46.0 | 1 | 171 | 19 | 42 | 67 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 23 | 23 | 100.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 2 | 2 | 100.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Velocista | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 287 | 1797 | 16.0% |
| Asesino | 123 | 1291 | 9.5% |
| Esquivo | 970 | 1728 | 56.1% |
| Equilibrado | 436 | 1655 | 26.3% |
| Extremista ATK | 199 | 1382 | 14.4% |
| Extremista DEF | 669 | 1889 | 35.4% |
| Extremista ASPD | 239 | 1467 | 16.3% |
| Extremista REF | 1239 | 1600 | 77.4% |
| Velocista | 299 | 1661 | 18.0% |
| Berserker | 233 | 1341 | 17.4% |
| Guardian | 422 | 2614 | 16.1% |
| Estratega | 1049 | 1454 | 72.1% |
| Gladiador | 485 | 1164 | 41.7% |
| Magus | 454 | 1419 | 32.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 23 | 45 | 56 | 52 | 13 | 15 | 13 | 10 | 100 | 14 | 49 | 15 | 11 | 24 |
| 5 | 38 | 50 | 61 | 58 | 23 | 26 | 21 | 17 | 105 | 23 | 60 | 23 | 21 | 30 |
| 10 | 39 | 50 | 60 | 58 | 23 | 29 | 21 | 16 | 106 | 23 | 59 | 22 | 22 | 30 |
| 15 | 39 | 50 | 61 | 58 | 23 | 31 | 21 | 16 | 106 | 23 | 60 | 22 | 22 | 30 |
| 20 | 39 | 50 | 61 | 58 | 23 | 31 | 21 | 16 | 106 | 23 | 60 | 22 | 22 | 30 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 90.7% | 87.8% | 78.9% | 77.8% | 48.3% | 70.8% | 69.8% | 85.3% | 64.6% | 59.5% | 46.7% | 52.0% | 82.1% |
| Asesino | 9.3% | 50.0% | 61.0% | 33.3% | 9.4% | 9.1% | 30.4% | 18.9% | 79.4% | 22.0% | 16.7% | 25.0% | 7.3% | 16.0% |
| Esquivo | 12.2% | 39.0% | 50.0% | 26.1% | 18.4% | 10.5% | 15.6% | 18.6% | 60.8% | 19.2% | 44.4% | 16.7% | 15.2% | 27.0% |
| Equilibrado | 21.1% | 66.7% | 73.9% | 50.0% | 14.6% | 22.2% | 21.4% | 23.3% | 71.8% | 29.5% | 53.7% | 24.3% | 21.6% | 41.9% |
| Extremista ATK | 22.2% | 90.6% | 81.6% | 85.4% | 50.0% | 31.8% | 55.0% | 52.8% | 93.5% | 51.2% | 44.4% | 59.5% | 45.7% | 65.0% |
| Extremista DEF | 51.7% | 90.9% | 89.5% | 77.8% | 68.2% | 50.0% | 58.7% | 71.1% | 97.3% | 73.7% | 66.0% | 67.7% | 52.8% | 85.0% |
| Extremista ASPD | 29.2% | 69.6% | 84.4% | 78.6% | 45.0% | 41.3% | 50.0% | 33.3% | 81.6% | 46.2% | 63.6% | 54.8% | 47.8% | 65.5% |
| Extremista REF | 30.2% | 81.1% | 81.4% | 76.7% | 47.2% | 28.9% | 66.7% | 50.0% | 90.7% | 49.0% | 65.9% | 31.7% | 52.8% | 76.7% |
| Velocista | 14.7% | 20.6% | 39.2% | 28.2% | 6.5% | 2.7% | 18.4% | 9.3% | 50.0% | 5.6% | 34.1% | 2.2% | 12.7% | 7.1% |
| Berserker | 35.4% | 78.0% | 80.8% | 70.5% | 48.8% | 26.3% | 53.8% | 51.0% | 94.4% | 50.0% | 48.6% | 52.8% | 34.2% | 63.5% |
| Guardian | 40.5% | 83.3% | 55.6% | 46.3% | 55.6% | 34.0% | 36.4% | 34.1% | 65.9% | 51.4% | 50.0% | 35.9% | 27.5% | 52.2% |
| Estratega | 53.3% | 75.0% | 83.3% | 75.7% | 40.5% | 32.3% | 45.2% | 68.3% | 97.8% | 47.2% | 64.1% | 50.0% | 39.0% | 72.2% |
| Gladiador | 48.0% | 92.7% | 84.8% | 78.4% | 54.3% | 47.2% | 52.2% | 47.2% | 87.3% | 65.8% | 72.5% | 61.0% | 50.0% | 61.3% |
| Magus | 17.9% | 84.0% | 73.0% | 58.1% | 35.0% | 15.0% | 34.5% | 23.3% | 92.9% | 36.5% | 47.8% | 27.8% | 38.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.7% | 1395 |
| 16-30 | 48.9% | 2085 |
| 31-50 | 48.8% | 1353 |
| 51-70 | 48.3% | 811 |
| 71-100 | 55.3% | 2356 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 38.0% | 71 |
| 16-30 | 41.4% | 1747 |
| 31-50 | 48.2% | 3041 |
| 51-70 | 54.8% | 1173 |
| 71-100 | 57.9% | 1968 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 54.1% | 984 |
| 16-30 | 47.9% | 1610 |
| 31-50 | 45.5% | 1500 |
| 51-70 | 46.4% | 1086 |
| 71-100 | 53.5% | 2820 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.8% | 1854 |
| 16-30 | 47.6% | 1965 |
| 31-50 | 49.0% | 1517 |
| 51-70 | 50.7% | 913 |
| 71-100 | 53.4% | 1751 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.9% | 3224 |
| 16-30 | 52.2% | 2143 |
| 31-50 | 47.8% | 1284 |
| 51-70 | 34.0% | 550 |
| 71-100 | 26.8% | 799 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.4% | 6433 |
| 16-30 | 46.7% | 908 |
| 31-50 | 49.8% | 498 |
| 51-70 | 53.4% | 148 |
| 71-100 | 61.5% | 13 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 6421 |
| 16-30 | 45.4% | 929 |
| 31-50 | 49.5% | 505 |
| 51-70 | 54.3% | 129 |
| 71-100 | 68.8% | 16 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 6429 |
| 16-30 | 45.8% | 924 |
| 31-50 | 48.9% | 503 |
| 51-70 | 56.9% | 130 |
| 71-100 | 64.3% | 14 |
