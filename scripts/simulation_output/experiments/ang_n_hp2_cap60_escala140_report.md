# Combat Simulation Report
Generated: 2026-08-07 18:10:43 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.1 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1977 (98.9%) |
| Timeouts (draws) | 23 (1.1%) |
| Avg rounds (all) | 4.6 |
| Avg rounds (KO only) | 4.4 |
| Rounds P50 / P90 / Max | 4 / 8 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 268 |
| Avg rounds | 5.1 |
| P50 / P90 | 4 / 9 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 898/2000 |
| Winrate | 44.9% |
| Advantage over 50% | -5.1% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 191 | 280 | 68.2% |  |
| Asesino | 73 | 265 | 27.5% |  |
| Esquivo | 93 | 309 | 30.1% |  |
| Equilibrado | 99 | 273 | 36.3% |  |
| Extremista ATK | 183 | 306 | 59.8% |  |
| Extremista DEF | 218 | 303 | 71.9% | YES |
| Extremista ASPD | 149 | 274 | 54.4% |  |
| Extremista REF | 172 | 297 | 57.9% |  |
| Velocista | 48 | 258 | 18.6% |  |
| Berserker | 146 | 255 | 57.3% |  |
| Guardian | 157 | 278 | 56.5% |  |
| Estratega | 169 | 308 | 54.9% |  |
| Gladiador | 177 | 289 | 61.2% |  |
| Magus | 125 | 305 | 41.0% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 21.6 | - |
| Rests | 2.2 | 2 |
| Advances | 3.6 | - |
| Retreats | 0.6 | - |
| Battles with item use | 20.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.6% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.22 (avg 48.16) |
| ASPD spread (stddev) | 31.14 (avg 54.47) |
| Equipment tier A | 152 (3.8%) |
| Equipment tier B | 1715 (42.9%) |
| Equipment tier C | 682 (17.1%) |
| Equipment tier D | 1083 (27.1%) |
| Equipment tier S | 368 (9.2%) |
| Level 100-199 | 866 |
| Level 200-299 | 1100 |
| Level 300-399 | 1055 |
| Level 400-500 | 979 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 894 |
| cortante | 912 |
| desarmado | 417 |
| perforante | 1777 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1307 | 51.0% |
| ligera | 15 | 53.3% |
| media | 144 | 50.7% |
| total | 2534 | 49.4% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 85 | 48.2% |
| 3+ | 3915 | 50.0% |
Set bonus active: 50.0% (3915) vs inactive 48.2% (85)

### Amulet
With amulet: 50.6% (1572) vs without 49.6% (2428)

### Shield
With shield: 49.1% (2412) vs without 51.3% (1588)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 138 | 58.0% |
| B | 1524 | 55.6% |
| C | 605 | 46.8% |
| D | 980 | 42.8% |
| S | 336 | 69.0% |
| desarmado | 417 | 33.1% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 784 | 49.7% |
| adamantita | 171 | 65.5% |
| bronce | 799 | 40.8% |
| desarmado | 417 | 33.1% |
| filo_estelar | 165 | 72.7% |
| hierro | 809 | 47.7% |
| mitril | 422 | 61.1% |
| titanio | 433 | 62.4% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 855 | 61.8% |
| mitico | 336 | 69.0% |
| ninguno | 417 | 33.1% |
| poco_comun | 2392 | 46.1% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 880 | 49.7% |
| adamantita | 158 | 50.6% |
| bronce | 881 | 49.9% |
| filo_estelar | 184 | 51.1% |
| hierro | 924 | 48.9% |
| mitril | 472 | 50.6% |
| ninguno | 2 | 0.0% |
| titanio | 499 | 51.7% |

### Nature by level bracket
- **100-199**: contundente: 193, cortante: 187, desarmado: 89, perforante: 397
- **200-299**: contundente: 240, cortante: 245, desarmado: 113, perforante: 502
- **300-399**: contundente: 230, cortante: 252, desarmado: 110, perforante: 463
- **400-500**: contundente: 231, cortante: 228, desarmado: 105, perforante: 415

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 47.0% | 1006 | 51.0% | 2994 | -4.0pp |
| d_fulgor | 46.8% | 1014 | 51.1% | 2986 | -4.2pp |
| r_fulgor | 47.8% | 993 | 50.7% | 3007 | -2.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 26.2 | 1 | 122 | 13 | 23 | 34 |
| Asesino | 45.5 | 1 | 160 | 16 | 38 | 72 |
| Esquivo | 28.7 | 1 | 133 | 17 | 25 | 35 |
| Equilibrado | 38.3 | 1 | 135 | 18 | 32 | 49 |
| Extremista ATK | 56.5 | 1 | 184 | 22 | 54 | 83 |
| Extremista DEF | 24.0 | 1 | 147 | 11 | 21 | 31 |
| Extremista ASPD | 51.7 | 1 | 153 | 22 | 46 | 78 |
| Extremista REF | 31.0 | 1 | 128 | 12 | 28 | 44 |
| Velocista | 27.2 | 1 | 112 | 13 | 24 | 36 |
| Berserker | 55.7 | 1 | 179 | 21 | 56 | 83 |
| Guardian | 24.8 | 1 | 110 | 14 | 21 | 32 |
| Estratega | 29.7 | 1 | 147 | 11 | 24 | 43 |
| Gladiador | 55.1 | 1 | 157 | 22 | 53 | 84 |
| Magus | 38.9 | 1 | 168 | 13 | 30 | 56 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 0 | 0 | 0.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
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
| Tanque | 67 | 703 | 9.5% |
| Asesino | 76 | 469 | 16.2% |
| Esquivo | 321 | 615 | 52.2% |
| Equilibrado | 129 | 601 | 21.5% |
| Extremista ATK | 152 | 561 | 27.1% |
| Extremista DEF | 277 | 847 | 32.7% |
| Extremista ASPD | 104 | 543 | 19.2% |
| Extremista REF | 460 | 574 | 80.1% |
| Velocista | 82 | 578 | 14.2% |
| Berserker | 76 | 452 | 16.8% |
| Guardian | 175 | 901 | 19.4% |
| Estratega | 476 | 752 | 63.3% |
| Gladiador | 192 | 414 | 46.4% |
| Magus | 227 | 672 | 33.8% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 24 | 43 | 58 | 57 | 16 | 17 | 16 | 10 | 96 | 13 | 43 | 15 | 11 | 23 |
| 5 | 38 | 47 | 64 | 62 | 24 | 27 | 22 | 17 | 101 | 21 | 56 | 22 | 20 | 29 |
| 10 | 40 | 48 | 65 | 62 | 24 | 29 | 22 | 16 | 102 | 21 | 55 | 22 | 20 | 29 |
| 15 | 40 | 48 | 65 | 62 | 24 | 29 | 22 | 16 | 102 | 22 | 55 | 22 | 20 | 29 |
| 20 | 40 | 48 | 65 | 62 | 24 | 30 | 22 | 16 | 102 | 22 | 56 | 22 | 20 | 29 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 92.9% | 88.2% | 77.8% | 50.0% | 38.9% | 70.0% | 66.7% | 81.3% | 73.7% | 52.9% | 66.7% | 59.1% | 90.0% |
| Asesino | 7.1% | 50.0% | 43.5% | 50.0% | 20.0% | 9.5% | 5.6% | 16.7% | 66.7% | 30.0% | 23.8% | 16.7% | 5.0% | 28.6% |
| Esquivo | 11.8% | 56.5% | 50.0% | 34.8% | 9.1% | 10.7% | 7.7% | 15.2% | 60.7% | 10.5% | 50.0% | 18.2% | 32.1% | 53.3% |
| Equilibrado | 22.2% | 50.0% | 65.2% | 50.0% | 23.5% | 20.0% | 40.0% | 32.1% | 100.0% | 41.2% | 26.3% | 16.7% | 26.7% | 22.6% |
| Extremista ATK | 50.0% | 80.0% | 90.9% | 76.5% | 50.0% | 28.6% | 63.6% | 54.5% | 95.0% | 40.7% | 47.4% | 54.5% | 30.0% | 88.2% |
| Extremista DEF | 61.1% | 90.5% | 89.3% | 80.0% | 71.4% | 50.0% | 72.2% | 77.3% | 95.5% | 58.8% | 59.3% | 63.0% | 73.7% | 66.7% |
| Extremista ASPD | 30.0% | 94.4% | 92.3% | 60.0% | 36.4% | 27.8% | 50.0% | 57.7% | 76.5% | 57.1% | 60.0% | 57.1% | 27.8% | 54.2% |
| Extremista REF | 33.3% | 83.3% | 84.8% | 67.9% | 45.5% | 22.7% | 42.3% | 50.0% | 90.9% | 45.0% | 53.3% | 66.7% | 66.7% | 52.4% |
| Velocista | 18.8% | 33.3% | 39.3% | 0.0% | 5.0% | 4.5% | 23.5% | 9.1% | 50.0% | 16.7% | 13.6% | 25.0% | 5.3% | 15.0% |
| Berserker | 26.3% | 70.0% | 89.5% | 58.8% | 59.3% | 41.2% | 42.9% | 55.0% | 83.3% | 50.0% | 22.2% | 58.6% | 50.0% | 79.2% |
| Guardian | 47.1% | 76.2% | 50.0% | 73.7% | 52.6% | 40.7% | 40.0% | 46.7% | 86.4% | 77.8% | 50.0% | 38.9% | 45.0% | 72.0% |
| Estratega | 33.3% | 83.3% | 81.8% | 83.3% | 45.5% | 37.0% | 42.9% | 33.3% | 75.0% | 41.4% | 61.1% | 50.0% | 40.0% | 82.4% |
| Gladiador | 40.9% | 95.0% | 67.9% | 73.3% | 70.0% | 26.3% | 72.2% | 33.3% | 94.7% | 50.0% | 55.0% | 60.0% | 50.0% | 63.0% |
| Magus | 10.0% | 71.4% | 46.7% | 77.4% | 11.8% | 33.3% | 45.8% | 47.6% | 85.0% | 20.8% | 28.0% | 17.6% | 37.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.1% | 616 |
| 16-30 | 50.0% | 1054 |
| 31-50 | 50.5% | 739 |
| 51-70 | 46.1% | 397 |
| 71-100 | 53.5% | 1194 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.5% | 23 |
| 16-30 | 40.2% | 789 |
| 31-50 | 48.2% | 1541 |
| 51-70 | 47.6% | 592 |
| 71-100 | 61.5% | 1055 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.2% | 463 |
| 16-30 | 50.5% | 774 |
| 31-50 | 45.7% | 746 |
| 51-70 | 46.3% | 533 |
| 71-100 | 51.3% | 1484 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.5% | 820 |
| 16-30 | 47.9% | 982 |
| 31-50 | 46.9% | 784 |
| 51-70 | 50.4% | 462 |
| 71-100 | 51.5% | 952 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.6% | 1528 |
| 16-30 | 48.9% | 1140 |
| 31-50 | 51.8% | 714 |
| 51-70 | 28.5% | 277 |
| 71-100 | 28.7% | 341 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.8% | 3185 |
| 16-30 | 46.2% | 470 |
| 31-50 | 43.9% | 264 |
| 51-70 | 62.0% | 71 |
| 71-100 | 60.0% | 10 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.8% | 3196 |
| 16-30 | 44.6% | 457 |
| 31-50 | 46.8% | 265 |
| 51-70 | 59.2% | 71 |
| 71-100 | 63.6% | 11 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 3189 |
| 16-30 | 46.1% | 458 |
| 31-50 | 44.6% | 267 |
| 51-70 | 64.6% | 79 |
| 71-100 | 57.1% | 7 |
