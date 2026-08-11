# Combat Simulation Report
Generated: 2026-08-07 16:07:29 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.3 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1960 (98.0%) |
| Timeouts (draws) | 40 (2.0%) |
| Avg rounds (all) | 5.5 |
| Avg rounds (KO only) | 5.2 |
| Rounds P50 / P90 / Max | 4 / 11 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 232 |
| Avg rounds | 6.3 |
| P50 / P90 | 5 / 12 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 938/2000 |
| Winrate | 46.9% |
| Advantage over 50% | -3.1% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 213 | 325 | 65.5% |  |
| Asesino | 80 | 276 | 29.0% |  |
| Esquivo | 57 | 290 | 19.7% |  |
| Equilibrado | 95 | 266 | 35.7% |  |
| Extremista ATK | 177 | 294 | 60.2% |  |
| Extremista DEF | 198 | 294 | 67.3% | YES |
| Extremista ASPD | 189 | 294 | 64.3% |  |
| Extremista REF | 155 | 274 | 56.6% |  |
| Velocista | 53 | 309 | 17.2% |  |
| Berserker | 178 | 306 | 58.2% |  |
| Guardian | 123 | 253 | 48.6% |  |
| Estratega | 168 | 263 | 63.9% |  |
| Gladiador | 194 | 294 | 66.0% |  |
| Magus | 118 | 262 | 45.0% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 29.3 | - |
| Rests | 2.8 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.8 | - |
| Battles with item use | 25.9% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.32 (avg 48.14) |
| ASPD spread (stddev) | 31.00 (avg 53.75) |
| Equipment tier A | 138 (3.5%) |
| Equipment tier B | 1670 (41.8%) |
| Equipment tier C | 739 (18.5%) |
| Equipment tier D | 1074 (26.9%) |
| Equipment tier S | 379 (9.5%) |
| Level 100-199 | 929 |
| Level 200-299 | 1148 |
| Level 300-399 | 995 |
| Level 400-500 | 928 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 928 |
| cortante | 904 |
| desarmado | 399 |
| perforante | 1769 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1262 | 50.3% |
| ligera | 19 | 31.6% |
| media | 131 | 50.4% |
| total | 2588 | 49.9% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 98 | 52.0% |
| 3+ | 3902 | 49.9% |
Set bonus active: 49.9% (3902) vs inactive 52.0% (98)

### Amulet
With amulet: 52.3% (1609) vs without 48.3% (2391)

### Shield
With shield: 49.8% (2385) vs without 50.2% (1615)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 127 | 54.3% |
| B | 1512 | 53.8% |
| C | 662 | 46.5% |
| D | 953 | 43.4% |
| S | 347 | 73.2% |
| desarmado | 399 | 34.8% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 737 | 48.7% |
| adamantita | 183 | 71.0% |
| bronce | 785 | 44.2% |
| desarmado | 399 | 34.8% |
| filo_estelar | 164 | 75.6% |
| hierro | 802 | 47.0% |
| mitril | 447 | 57.9% |
| titanio | 483 | 54.5% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 930 | 56.1% |
| mitico | 347 | 73.2% |
| ninguno | 399 | 34.8% |
| poco_comun | 2324 | 46.6% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 914 | 50.9% |
| adamantita | 188 | 52.7% |
| bronce | 844 | 48.0% |
| filo_estelar | 187 | 49.2% |
| hierro | 912 | 52.7% |
| mitril | 482 | 47.9% |
| titanio | 473 | 47.6% |

### Nature by level bracket
- **100-199**: contundente: 207, cortante: 220, desarmado: 101, perforante: 401
- **200-299**: contundente: 275, cortante: 238, desarmado: 107, perforante: 528
- **300-399**: contundente: 234, cortante: 231, desarmado: 101, perforante: 429
- **400-500**: contundente: 212, cortante: 215, desarmado: 90, perforante: 411

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 50.7% | 979 | 49.7% | 3021 | 0.9pp |
| d_fulgor | 50.7% | 973 | 49.7% | 3027 | 0.9pp |
| r_fulgor | 50.7% | 979 | 49.7% | 3021 | 0.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 29.1 | 1 | 133 | 14 | 26 | 38 |
| Asesino | 42.6 | 1 | 173 | 16 | 34 | 70 |
| Esquivo | 25.5 | 1 | 134 | 13 | 21 | 35 |
| Equilibrado | 34.8 | 1 | 143 | 17 | 31 | 45 |
| Extremista ATK | 54.5 | 1 | 156 | 24 | 52 | 82 |
| Extremista DEF | 24.3 | 1 | 144 | 14 | 20 | 30 |
| Extremista ASPD | 48.3 | 1 | 164 | 20 | 44 | 72 |
| Extremista REF | 34.9 | 1 | 135 | 17 | 30 | 46 |
| Velocista | 28.9 | 1 | 117 | 13 | 21 | 38 |
| Berserker | 50.1 | 1 | 179 | 15 | 49 | 76 |
| Guardian | 25.2 | 1 | 126 | 13 | 21 | 35 |
| Estratega | 35.8 | 1 | 147 | 17 | 31 | 51 |
| Gladiador | 46.7 | 1 | 145 | 14 | 39 | 76 |
| Magus | 43.7 | 1 | 154 | 16 | 35 | 64 |

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
| Tanque | 154 | 1270 | 12.1% |
| Asesino | 64 | 680 | 9.4% |
| Esquivo | 490 | 885 | 55.4% |
| Equilibrado | 159 | 814 | 19.5% |
| Extremista ATK | 58 | 668 | 8.7% |
| Extremista DEF | 313 | 1110 | 28.2% |
| Extremista ASPD | 103 | 637 | 16.2% |
| Extremista REF | 697 | 882 | 79.0% |
| Velocista | 102 | 803 | 12.7% |
| Berserker | 78 | 654 | 11.9% |
| Guardian | 119 | 1137 | 10.5% |
| Estratega | 460 | 787 | 58.4% |
| Gladiador | 248 | 625 | 39.7% |
| Magus | 177 | 601 | 29.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 24 | 40 | 62 | 55 | 13 | 16 | 13 | 11 | 99 | 12 | 44 | 14 | 9 | 24 |
| 5 | 38 | 43 | 64 | 60 | 17 | 27 | 18 | 15 | 102 | 18 | 54 | 20 | 17 | 27 |
| 10 | 39 | 43 | 64 | 60 | 17 | 29 | 17 | 13 | 103 | 18 | 54 | 19 | 16 | 26 |
| 15 | 39 | 42 | 65 | 61 | 17 | 30 | 17 | 14 | 103 | 18 | 54 | 19 | 16 | 27 |
| 20 | 39 | 43 | 65 | 61 | 17 | 30 | 17 | 14 | 103 | 18 | 54 | 19 | 16 | 27 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 89.3% | 89.7% | 86.7% | 47.1% | 52.2% | 58.3% | 65.2% | 92.6% | 60.9% | 82.1% | 25.0% | 38.9% | 62.5% |
| Asesino | 10.7% | 50.0% | 75.0% | 48.0% | 0.0% | 18.2% | 19.2% | 34.8% | 52.9% | 18.8% | 22.2% | 21.7% | 20.0% | 35.3% |
| Esquivo | 10.3% | 16.7% | 50.0% | 36.8% | 17.2% | 11.1% | 8.0% | 15.8% | 76.5% | 5.0% | 18.2% | 10.0% | 4.5% | 15.0% |
| Equilibrado | 13.3% | 52.0% | 63.2% | 50.0% | 15.0% | 20.0% | 34.6% | 15.8% | 61.1% | 28.6% | 20.0% | 35.3% | 21.4% | 57.1% |
| Extremista ATK | 52.9% | 100.0% | 82.8% | 85.0% | 50.0% | 15.8% | 48.1% | 50.0% | 81.0% | 30.0% | 72.0% | 60.0% | 47.6% | 75.0% |
| Extremista DEF | 47.8% | 81.8% | 88.9% | 80.0% | 84.2% | 50.0% | 50.0% | 65.2% | 100.0% | 65.0% | 56.3% | 33.3% | 56.0% | 78.9% |
| Extremista ASPD | 41.7% | 80.8% | 92.0% | 65.4% | 51.9% | 50.0% | 50.0% | 63.6% | 95.2% | 60.0% | 54.5% | 80.0% | 29.4% | 75.0% |
| Extremista REF | 34.8% | 65.2% | 84.2% | 84.2% | 50.0% | 34.8% | 36.4% | 50.0% | 96.3% | 55.0% | 47.1% | 50.0% | 31.6% | 70.0% |
| Velocista | 7.4% | 47.1% | 23.5% | 38.9% | 19.0% | 0.0% | 4.8% | 3.7% | 50.0% | 17.9% | 12.5% | 5.0% | 4.5% | 13.6% |
| Berserker | 39.1% | 81.3% | 95.0% | 71.4% | 70.0% | 35.0% | 40.0% | 45.0% | 82.1% | 50.0% | 70.6% | 34.6% | 51.9% | 59.1% |
| Guardian | 17.9% | 77.8% | 81.8% | 80.0% | 28.0% | 43.8% | 45.5% | 52.9% | 87.5% | 29.4% | 50.0% | 31.3% | 18.2% | 53.3% |
| Estratega | 75.0% | 78.3% | 90.0% | 64.7% | 40.0% | 66.7% | 20.0% | 50.0% | 95.0% | 61.5% | 68.8% | 50.0% | 52.6% | 66.7% |
| Gladiador | 61.1% | 80.0% | 95.5% | 78.6% | 52.4% | 44.0% | 70.6% | 68.4% | 95.5% | 48.1% | 81.8% | 47.4% | 50.0% | 75.0% |
| Magus | 37.5% | 64.7% | 85.0% | 42.9% | 25.0% | 21.1% | 25.0% | 30.0% | 86.4% | 40.9% | 46.7% | 33.3% | 25.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.5% | 665 |
| 16-30 | 48.5% | 1017 |
| 31-50 | 49.4% | 712 |
| 51-70 | 46.5% | 409 |
| 71-100 | 57.4% | 1197 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 36.4% | 33 |
| 16-30 | 45.7% | 875 |
| 31-50 | 49.2% | 1471 |
| 51-70 | 47.1% | 584 |
| 71-100 | 56.7% | 1037 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.7% | 455 |
| 16-30 | 48.3% | 804 |
| 31-50 | 44.7% | 783 |
| 51-70 | 46.0% | 539 |
| 71-100 | 54.4% | 1419 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.7% | 939 |
| 16-30 | 48.8% | 970 |
| 31-50 | 48.4% | 729 |
| 51-70 | 45.8% | 478 |
| 71-100 | 50.8% | 884 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 60.1% | 1607 |
| 16-30 | 52.6% | 1070 |
| 31-50 | 45.0% | 664 |
| 51-70 | 30.3% | 274 |
| 71-100 | 22.6% | 385 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.8% | 3208 |
| 16-30 | 46.8% | 444 |
| 31-50 | 52.9% | 272 |
| 51-70 | 60.3% | 73 |
| 71-100 | 100.0% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.5% | 3203 |
| 16-30 | 49.7% | 467 |
| 31-50 | 53.6% | 252 |
| 51-70 | 55.9% | 68 |
| 71-100 | 60.0% | 10 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.7% | 3207 |
| 16-30 | 47.5% | 453 |
| 31-50 | 53.8% | 262 |
| 51-70 | 63.0% | 73 |
| 71-100 | 60.0% | 5 |
