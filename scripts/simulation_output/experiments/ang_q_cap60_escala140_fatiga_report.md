# Combat Simulation Report
Generated: 2026-08-07 18:14:24 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.9 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1948 (97.4%) |
| Timeouts (draws) | 52 (2.6%) |
| Avg rounds (all) | 5.7 |
| Avg rounds (KO only) | 5.3 |
| Rounds P50 / P90 / Max | 4 / 11 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 231 |
| Avg rounds | 5.9 |
| P50 / P90 | 4 / 12 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 938/2000 |
| Winrate | 46.9% |
| Advantage over 50% | -3.1% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 182 | 281 | 64.8% |  |
| Asesino | 87 | 298 | 29.2% |  |
| Esquivo | 72 | 266 | 27.1% |  |
| Equilibrado | 105 | 276 | 38.0% |  |
| Extremista ATK | 171 | 284 | 60.2% |  |
| Extremista DEF | 200 | 290 | 69.0% | YES |
| Extremista ASPD | 158 | 297 | 53.2% |  |
| Extremista REF | 168 | 289 | 58.1% |  |
| Velocista | 50 | 282 | 17.7% |  |
| Berserker | 179 | 303 | 59.1% |  |
| Guardian | 166 | 300 | 55.3% |  |
| Estratega | 151 | 263 | 57.4% |  |
| Gladiador | 183 | 288 | 63.5% |  |
| Magus | 128 | 283 | 45.2% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 30.6 | - |
| Rests | 2.8 | 2 |
| Advances | 4.0 | - |
| Retreats | 0.8 | - |
| Battles with item use | 28.2% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.4% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.55 (avg 47.99) |
| ASPD spread (stddev) | 31.46 (avg 54.04) |
| Equipment tier A | 148 (3.7%) |
| Equipment tier B | 1689 (42.2%) |
| Equipment tier C | 671 (16.8%) |
| Equipment tier D | 1126 (28.1%) |
| Equipment tier S | 366 (9.2%) |
| Level 100-199 | 966 |
| Level 200-299 | 1048 |
| Level 300-399 | 1072 |
| Level 400-500 | 914 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 869 |
| cortante | 912 |
| desarmado | 384 |
| perforante | 1835 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1271 | 50.8% |
| ligera | 15 | 53.3% |
| media | 132 | 40.2% |
| total | 2582 | 50.1% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 105 | 41.0% |
| 3+ | 3895 | 50.2% |
Set bonus active: 50.2% (3895) vs inactive 41.0% (105)

### Amulet
With amulet: 52.3% (1638) vs without 48.4% (2362)

### Shield
With shield: 49.7% (2447) vs without 50.5% (1553)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 131 | 56.5% |
| B | 1539 | 54.8% |
| C | 602 | 46.2% |
| D | 1021 | 44.2% |
| S | 323 | 69.0% |
| desarmado | 384 | 33.9% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 763 | 50.5% |
| adamantita | 151 | 71.5% |
| bronce | 829 | 44.0% |
| desarmado | 384 | 33.9% |
| filo_estelar | 172 | 66.9% |
| hierro | 826 | 45.3% |
| mitril | 439 | 63.3% |
| titanio | 436 | 56.2% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 875 | 59.8% |
| mitico | 323 | 69.0% |
| ninguno | 384 | 33.9% |
| poco_comun | 2418 | 46.5% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 876 | 47.7% |
| adamantita | 194 | 45.4% |
| bronce | 918 | 50.8% |
| filo_estelar | 176 | 49.4% |
| hierro | 886 | 48.6% |
| mitril | 466 | 54.1% |
| ninguno | 1 | 0.0% |
| titanio | 483 | 53.4% |

### Nature by level bracket
- **100-199**: contundente: 209, cortante: 231, desarmado: 88, perforante: 438
- **200-299**: contundente: 221, cortante: 236, desarmado: 106, perforante: 485
- **300-399**: contundente: 235, cortante: 254, desarmado: 101, perforante: 482
- **400-500**: contundente: 204, cortante: 191, desarmado: 89, perforante: 430

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 50.3% | 956 | 49.9% | 3044 | 0.4pp |
| d_fulgor | 50.4% | 962 | 49.9% | 3038 | 0.5pp |
| r_fulgor | 51.1% | 950 | 49.7% | 3050 | 1.4pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 26.3 | 1 | 146 | 13 | 23 | 37 |
| Asesino | 46.9 | 1 | 181 | 17 | 40 | 66 |
| Esquivo | 23.0 | 1 | 123 | 12 | 21 | 30 |
| Equilibrado | 33.1 | 1 | 160 | 17 | 26 | 43 |
| Extremista ATK | 51.8 | 2 | 169 | 19 | 48 | 79 |
| Extremista DEF | 23.1 | 0 | 118 | 11 | 20 | 31 |
| Extremista ASPD | 41.3 | 1 | 155 | 15 | 32 | 66 |
| Extremista REF | 32.0 | 1 | 148 | 15 | 25 | 46 |
| Velocista | 29.5 | 1 | 109 | 18 | 26 | 35 |
| Berserker | 53.1 | 1 | 179 | 19 | 50 | 80 |
| Guardian | 23.2 | 1 | 136 | 13 | 20 | 30 |
| Estratega | 38.5 | 1 | 145 | 22 | 32 | 52 |
| Gladiador | 47.1 | 1 | 168 | 20 | 45 | 69 |
| Magus | 39.8 | 1 | 167 | 18 | 30 | 55 |

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
| Berserker | 9 | 9 | 100.0% |
| Guardian | 36 | 36 | 100.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 129 | 1133 | 11.4% |
| Asesino | 148 | 776 | 19.1% |
| Esquivo | 388 | 740 | 52.4% |
| Equilibrado | 218 | 929 | 23.5% |
| Extremista ATK | 103 | 653 | 15.8% |
| Extremista DEF | 238 | 1178 | 20.2% |
| Extremista ASPD | 106 | 779 | 13.6% |
| Extremista REF | 748 | 916 | 81.7% |
| Velocista | 194 | 921 | 21.1% |
| Berserker | 96 | 722 | 13.3% |
| Guardian | 208 | 1315 | 15.8% |
| Estratega | 454 | 710 | 63.9% |
| Gladiador | 222 | 625 | 35.5% |
| Magus | 133 | 691 | 19.2% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 27 | 46 | 53 | 50 | 14 | 18 | 13 | 11 | 104 | 13 | 41 | 15 | 9 | 24 |
| 5 | 41 | 47 | 57 | 54 | 20 | 28 | 18 | 16 | 108 | 19 | 52 | 21 | 16 | 29 |
| 10 | 42 | 47 | 57 | 54 | 19 | 31 | 18 | 14 | 108 | 18 | 51 | 20 | 16 | 28 |
| 15 | 42 | 47 | 57 | 54 | 19 | 32 | 18 | 14 | 108 | 18 | 52 | 20 | 16 | 28 |
| 20 | 42 | 47 | 58 | 54 | 19 | 32 | 18 | 14 | 108 | 18 | 52 | 20 | 16 | 28 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 83.3% | 69.6% | 92.3% | 56.3% | 70.0% | 66.7% | 52.0% | 81.8% | 48.1% | 70.6% | 57.1% | 47.6% | 88.9% |
| Asesino | 16.7% | 50.0% | 61.5% | 16.0% | 11.8% | 25.0% | 17.6% | 26.7% | 78.6% | 28.1% | 17.4% | 7.1% | 15.0% | 34.8% |
| Esquivo | 30.4% | 38.5% | 50.0% | 27.3% | 5.6% | 13.3% | 21.4% | 20.0% | 71.4% | 21.4% | 29.4% | 15.4% | 5.6% | 31.8% |
| Equilibrado | 7.7% | 84.0% | 72.7% | 50.0% | 27.8% | 9.1% | 12.5% | 28.0% | 74.1% | 45.0% | 14.3% | 5.9% | 31.3% | 25.0% |
| Extremista ATK | 43.8% | 88.2% | 94.4% | 72.2% | 50.0% | 22.7% | 70.8% | 57.9% | 82.6% | 50.0% | 50.0% | 47.8% | 56.0% | 60.9% |
| Extremista DEF | 30.0% | 75.0% | 86.7% | 90.9% | 77.3% | 50.0% | 55.0% | 66.7% | 95.8% | 66.7% | 76.2% | 58.3% | 48.3% | 85.7% |
| Extremista ASPD | 33.3% | 82.4% | 78.6% | 87.5% | 29.2% | 45.0% | 50.0% | 52.4% | 90.9% | 29.4% | 30.0% | 55.0% | 25.0% | 55.6% |
| Extremista REF | 48.0% | 73.3% | 80.0% | 72.0% | 42.1% | 33.3% | 47.6% | 50.0% | 96.2% | 55.0% | 52.4% | 58.8% | 40.9% | 66.7% |
| Velocista | 18.2% | 21.4% | 28.6% | 25.9% | 17.4% | 4.2% | 9.1% | 3.8% | 50.0% | 9.5% | 17.4% | 27.8% | 11.5% | 26.3% |
| Berserker | 51.9% | 71.9% | 78.6% | 55.0% | 50.0% | 33.3% | 70.6% | 45.0% | 90.5% | 50.0% | 51.6% | 78.9% | 54.2% | 50.0% |
| Guardian | 29.4% | 82.6% | 70.6% | 85.7% | 50.0% | 23.8% | 70.0% | 47.6% | 82.6% | 48.4% | 50.0% | 25.0% | 52.6% | 58.8% |
| Estratega | 42.9% | 92.9% | 84.6% | 94.1% | 52.2% | 41.7% | 45.0% | 41.2% | 72.2% | 21.1% | 75.0% | 50.0% | 45.0% | 58.3% |
| Gladiador | 52.4% | 85.0% | 94.4% | 68.8% | 44.0% | 51.7% | 75.0% | 59.1% | 88.5% | 45.8% | 47.4% | 55.0% | 50.0% | 73.1% |
| Magus | 11.1% | 65.2% | 68.2% | 75.0% | 39.1% | 14.3% | 44.4% | 33.3% | 73.7% | 50.0% | 41.2% | 41.7% | 26.9% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.5% | 693 |
| 16-30 | 48.5% | 1003 |
| 31-50 | 48.1% | 699 |
| 51-70 | 48.0% | 423 |
| 71-100 | 55.2% | 1182 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 33.3% | 27 |
| 16-30 | 41.4% | 851 |
| 31-50 | 49.5% | 1540 |
| 51-70 | 50.9% | 611 |
| 71-100 | 58.2% | 971 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 56.0% | 480 |
| 16-30 | 49.8% | 809 |
| 31-50 | 45.8% | 701 |
| 51-70 | 43.6% | 551 |
| 71-100 | 52.6% | 1459 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 923 |
| 16-30 | 49.5% | 1011 |
| 31-50 | 49.8% | 759 |
| 51-70 | 46.5% | 398 |
| 71-100 | 50.9% | 909 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 58.8% | 1598 |
| 16-30 | 52.0% | 1142 |
| 31-50 | 46.6% | 586 |
| 51-70 | 32.4% | 309 |
| 71-100 | 25.8% | 365 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.7% | 3218 |
| 16-30 | 50.3% | 457 |
| 31-50 | 51.4% | 247 |
| 51-70 | 53.3% | 75 |
| 71-100 | 100.0% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.7% | 3221 |
| 16-30 | 50.2% | 442 |
| 31-50 | 50.2% | 263 |
| 51-70 | 58.6% | 70 |
| 71-100 | 75.0% | 4 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.9% | 3230 |
| 16-30 | 48.5% | 437 |
| 31-50 | 51.5% | 268 |
| 51-70 | 55.9% | 59 |
| 71-100 | 83.3% | 6 |
