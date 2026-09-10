# Combat Simulation Report
Generated: 2026-08-07 17:57:21 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.4 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.8 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1969 (98.5%) |
| Timeouts (draws) | 31 (1.5%) |
| Avg rounds (all) | 4.7 |
| Avg rounds (KO only) | 4.4 |
| Rounds P50 / P90 / Max | 4 / 9 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 249 |
| Avg rounds | 5.4 |
| P50 / P90 | 4 / 10 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 945/2000 |
| Winrate | 47.3% |
| Advantage over 50% | -2.8% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 204 | 271 | 75.3% |  |
| Asesino | 99 | 301 | 32.9% |  |
| Esquivo | 85 | 308 | 27.6% |  |
| Equilibrado | 121 | 261 | 46.4% |  |
| Extremista ATK | 160 | 294 | 54.4% |  |
| Extremista DEF | 202 | 266 | 75.9% | YES |
| Extremista ASPD | 133 | 296 | 44.9% |  |
| Extremista REF | 142 | 286 | 49.7% |  |
| Velocista | 60 | 270 | 22.2% |  |
| Berserker | 137 | 289 | 47.4% |  |
| Guardian | 202 | 305 | 66.2% |  |
| Estratega | 169 | 301 | 56.1% |  |
| Gladiador | 163 | 268 | 60.8% |  |
| Magus | 123 | 284 | 43.3% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.3 | 0 |
| Heal applied | 15.5 | - |
| Rests | 3.8 | 3 |
| Advances | 2.9 | - |
| Retreats | 0.5 | - |
| Battles with item use | 15.0% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.3% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 33.24 (avg 45.99) |
| ASPD spread (stddev) | 31.34 (avg 55.72) |
| Equipment tier A | 133 (3.3%) |
| Equipment tier B | 1672 (41.8%) |
| Equipment tier C | 697 (17.4%) |
| Equipment tier D | 1128 (28.2%) |
| Equipment tier S | 370 (9.3%) |
| Level 100-199 | 1074 |
| Level 200-299 | 1102 |
| Level 300-399 | 972 |
| Level 400-500 | 852 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 894 |
| cortante | 904 |
| desarmado | 387 |
| perforante | 1815 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1278 | 49.4% |
| ligera | 21 | 38.1% |
| media | 133 | 46.6% |
| total | 2568 | 50.6% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 87 | 51.7% |
| 3+ | 3913 | 50.0% |
Set bonus active: 0.0% (0) vs inactive 50.0% (4000)

### Amulet
With amulet: 0.0% (0) vs without 50.0% (4000)

### Shield
With shield: 49.4% (2407) vs without 50.9% (1593)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 120 | 72.5% |
| B | 1518 | 56.4% |
| C | 627 | 40.8% |
| D | 1008 | 40.8% |
| S | 340 | 74.1% |
| desarmado | 387 | 35.7% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 785 | 48.9% |
| adamantita | 176 | 75.0% |
| bronce | 807 | 40.8% |
| desarmado | 387 | 35.7% |
| filo_estelar | 164 | 73.2% |
| hierro | 810 | 44.8% |
| mitril | 441 | 60.3% |
| titanio | 430 | 62.3% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 871 | 61.3% |
| mitico | 340 | 74.1% |
| ninguno | 387 | 35.7% |
| poco_comun | 2402 | 44.8% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 900 | 51.0% |
| adamantita | 176 | 51.1% |
| bronce | 892 | 49.9% |
| filo_estelar | 187 | 44.4% |
| hierro | 873 | 49.5% |
| mitril | 513 | 51.1% |
| ninguno | 1 | 0.0% |
| titanio | 458 | 50.0% |

### Nature by level bracket
- **100-199**: contundente: 249, cortante: 232, desarmado: 108, perforante: 485
- **200-299**: contundente: 249, cortante: 254, desarmado: 105, perforante: 494
- **300-399**: contundente: 207, cortante: 218, desarmado: 97, perforante: 450
- **400-500**: contundente: 189, cortante: 200, desarmado: 77, perforante: 386

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 45.1% | 1043 | 51.7% | 2957 | -6.7pp |
| d_fulgor | 44.7% | 1032 | 51.9% | 2968 | -7.2pp |
| r_fulgor | 44.7% | 1022 | 51.8% | 2978 | -7.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 25.0 | 1 | 153 | 10 | 20 | 30 |
| Asesino | 52.9 | 1 | 171 | 22 | 49 | 79 |
| Esquivo | 25.5 | 1 | 108 | 14 | 22 | 35 |
| Equilibrado | 34.4 | 1 | 149 | 12 | 28 | 49 |
| Extremista ATK | 62.8 | 1 | 193 | 31 | 62 | 87 |
| Extremista DEF | 21.5 | 1 | 124 | 6 | 18 | 30 |
| Extremista ASPD | 50.6 | 1 | 184 | 24 | 44 | 76 |
| Extremista REF | 36.4 | 1 | 155 | 18 | 31 | 47 |
| Velocista | 35.3 | 1 | 126 | 19 | 32 | 48 |
| Berserker | 62.4 | 1 | 190 | 30 | 65 | 86 |
| Guardian | 24.1 | 1 | 129 | 11 | 21 | 33 |
| Estratega | 38.1 | 1 | 135 | 21 | 33 | 53 |
| Gladiador | 60.0 | 1 | 175 | 32 | 59 | 82 |
| Magus | 44.4 | 1 | 172 | 19 | 40 | 65 |

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
| Tanque | 97 | 695 | 14.0% |
| Asesino | 87 | 797 | 10.9% |
| Esquivo | 592 | 961 | 61.6% |
| Equilibrado | 225 | 822 | 27.4% |
| Extremista ATK | 149 | 705 | 21.1% |
| Extremista DEF | 346 | 854 | 40.5% |
| Extremista ASPD | 124 | 813 | 15.3% |
| Extremista REF | 667 | 851 | 78.4% |
| Velocista | 128 | 722 | 17.7% |
| Berserker | 148 | 720 | 20.6% |
| Guardian | 220 | 1055 | 20.9% |
| Estratega | 698 | 1010 | 69.1% |
| Gladiador | 287 | 561 | 51.2% |
| Magus | 172 | 694 | 24.8% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 24 | 53 | 60 | 53 | 18 | 20 | 14 | 13 | 104 | 14 | 47 | 17 | 10 | 25 |
| 5 | 37 | 58 | 63 | 58 | 25 | 31 | 19 | 17 | 109 | 21 | 56 | 22 | 17 | 29 |
| 10 | 38 | 58 | 63 | 58 | 25 | 34 | 20 | 17 | 110 | 22 | 56 | 21 | 17 | 30 |
| 15 | 38 | 58 | 64 | 58 | 25 | 35 | 20 | 17 | 110 | 22 | 57 | 22 | 17 | 30 |
| 20 | 38 | 58 | 64 | 58 | 25 | 35 | 20 | 17 | 110 | 22 | 58 | 22 | 17 | 30 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 95.7% | 86.4% | 76.2% | 100.0% | 25.0% | 77.3% | 55.0% | 89.5% | 85.2% | 66.7% | 70.6% | 63.2% | 80.0% |
| Asesino | 4.3% | 50.0% | 65.2% | 42.9% | 26.7% | 9.1% | 50.0% | 38.1% | 56.5% | 32.0% | 15.0% | 18.2% | 23.8% | 35.7% |
| Esquivo | 13.6% | 34.8% | 50.0% | 34.8% | 13.0% | 14.3% | 38.5% | 18.2% | 57.1% | 22.2% | 21.1% | 12.0% | 19.0% | 36.4% |
| Equilibrado | 23.8% | 57.1% | 65.2% | 50.0% | 18.8% | 18.8% | 43.5% | 58.3% | 85.7% | 50.0% | 26.3% | 43.8% | 9.1% | 71.4% |
| Extremista ATK | 0.0% | 73.3% | 87.0% | 81.3% | 50.0% | 35.0% | 52.9% | 50.0% | 77.8% | 56.3% | 20.0% | 61.5% | 36.4% | 64.0% |
| Extremista DEF | 75.0% | 90.9% | 85.7% | 81.3% | 65.0% | 50.0% | 100.0% | 91.7% | 94.1% | 72.0% | 57.7% | 64.7% | 66.7% | 85.0% |
| Extremista ASPD | 22.7% | 50.0% | 61.5% | 56.5% | 47.1% | 0.0% | 50.0% | 43.5% | 88.9% | 47.8% | 36.0% | 48.0% | 47.6% | 43.8% |
| Extremista REF | 45.0% | 61.9% | 81.8% | 41.7% | 50.0% | 8.3% | 56.5% | 50.0% | 85.7% | 47.8% | 41.2% | 45.5% | 23.5% | 29.4% |
| Velocista | 10.5% | 43.5% | 42.9% | 14.3% | 22.2% | 5.9% | 11.1% | 14.3% | 50.0% | 21.7% | 9.1% | 18.8% | 15.0% | 22.7% |
| Berserker | 14.8% | 68.0% | 77.8% | 50.0% | 43.8% | 28.0% | 52.2% | 52.2% | 78.3% | 50.0% | 23.8% | 39.1% | 25.0% | 69.2% |
| Guardian | 33.3% | 85.0% | 78.9% | 73.7% | 80.0% | 42.3% | 64.0% | 58.8% | 90.9% | 76.2% | 50.0% | 65.2% | 56.3% | 77.8% |
| Estratega | 29.4% | 81.8% | 88.0% | 56.3% | 38.5% | 35.3% | 52.0% | 54.5% | 81.3% | 60.9% | 34.8% | 50.0% | 61.9% | 61.5% |
| Gladiador | 36.8% | 76.2% | 81.0% | 90.9% | 63.6% | 33.3% | 52.4% | 76.5% | 85.0% | 75.0% | 43.8% | 38.1% | 50.0% | 80.0% |
| Magus | 20.0% | 64.3% | 63.6% | 28.6% | 36.0% | 15.0% | 56.3% | 70.6% | 77.3% | 30.8% | 22.2% | 38.5% | 20.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.6% | 961 |
| 16-30 | 49.0% | 855 |
| 31-50 | 55.2% | 631 |
| 51-70 | 45.9% | 392 |
| 71-100 | 51.3% | 1161 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 36.4% | 1367 |
| 16-30 | 47.1% | 929 |
| 31-50 | 56.9% | 650 |
| 51-70 | 57.7% | 284 |
| 71-100 | 69.0% | 770 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 61.0% | 451 |
| 16-30 | 48.7% | 704 |
| 31-50 | 45.7% | 785 |
| 51-70 | 42.5% | 520 |
| 71-100 | 52.1% | 1540 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 803 |
| 16-30 | 48.0% | 1006 |
| 31-50 | 49.4% | 751 |
| 51-70 | 51.2% | 473 |
| 71-100 | 51.5% | 967 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.2% | 1497 |
| 16-30 | 54.4% | 1126 |
| 31-50 | 52.7% | 677 |
| 51-70 | 44.7% | 300 |
| 71-100 | 32.3% | 400 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.6% | 3176 |
| 16-30 | 47.3% | 455 |
| 31-50 | 39.1% | 284 |
| 51-70 | 37.8% | 74 |
| 71-100 | 54.5% | 11 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.5% | 3169 |
| 16-30 | 46.9% | 463 |
| 31-50 | 40.2% | 281 |
| 51-70 | 39.0% | 77 |
| 71-100 | 70.0% | 10 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.6% | 3156 |
| 16-30 | 46.4% | 485 |
| 31-50 | 40.1% | 279 |
| 51-70 | 42.3% | 71 |
| 71-100 | 44.4% | 9 |
