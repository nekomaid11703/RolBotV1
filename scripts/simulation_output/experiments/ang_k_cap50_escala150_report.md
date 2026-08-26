# Combat Simulation Report
Generated: 2026-08-07 18:09:33 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.7 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1952 (97.6%) |
| Timeouts (draws) | 48 (2.4%) |
| Avg rounds (all) | 5.5 |
| Avg rounds (KO only) | 5.2 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 229 |
| Avg rounds | 5.7 |
| P50 / P90 | 4 / 11 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 927/2000 |
| Winrate | 46.4% |
| Advantage over 50% | -3.6% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 199 | 294 | 67.7% | YES |
| Asesino | 73 | 278 | 26.3% |  |
| Esquivo | 69 | 277 | 24.9% |  |
| Equilibrado | 131 | 304 | 43.1% |  |
| Extremista ATK | 146 | 277 | 52.7% |  |
| Extremista DEF | 171 | 257 | 66.5% |  |
| Extremista ASPD | 141 | 290 | 48.6% |  |
| Extremista REF | 179 | 318 | 56.3% |  |
| Velocista | 63 | 295 | 21.4% |  |
| Berserker | 177 | 277 | 63.9% |  |
| Guardian | 150 | 268 | 56.0% |  |
| Estratega | 178 | 283 | 62.9% |  |
| Gladiador | 191 | 304 | 62.8% |  |
| Magus | 131 | 278 | 47.1% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 27.3 | - |
| Rests | 3.1 | 2 |
| Advances | 4.0 | - |
| Retreats | 0.7 | - |
| Battles with item use | 24.9% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 31.90 (avg 47.44) |
| ASPD spread (stddev) | 31.04 (avg 53.59) |
| Equipment tier A | 114 (2.9%) |
| Equipment tier B | 1696 (42.4%) |
| Equipment tier C | 682 (17.1%) |
| Equipment tier D | 1144 (28.6%) |
| Equipment tier S | 364 (9.1%) |
| Level 100-199 | 1001 |
| Level 200-299 | 1091 |
| Level 300-399 | 974 |
| Level 400-500 | 934 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 946 |
| cortante | 855 |
| desarmado | 419 |
| perforante | 1780 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1283 | 47.2% |
| ligera | 32 | 31.3% |
| media | 139 | 43.2% |
| total | 2546 | 52.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 103 | 41.7% |
| 3+ | 3897 | 50.2% |
Set bonus active: 50.2% (3897) vs inactive 41.7% (103)

### Amulet
With amulet: 51.6% (1641) vs without 48.9% (2359)

### Shield
With shield: 49.1% (2430) vs without 51.3% (1570)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 104 | 64.4% |
| B | 1523 | 56.1% |
| C | 611 | 47.0% |
| D | 1017 | 42.3% |
| S | 326 | 68.7% |
| desarmado | 419 | 32.5% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 785 | 45.9% |
| adamantita | 161 | 66.5% |
| bronce | 814 | 45.9% |
| desarmado | 419 | 32.5% |
| filo_estelar | 165 | 70.9% |
| hierro | 776 | 49.6% |
| mitril | 439 | 56.3% |
| titanio | 441 | 61.9% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 880 | 59.1% |
| mitico | 326 | 68.7% |
| ninguno | 419 | 32.5% |
| poco_comun | 2375 | 47.1% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 861 | 51.8% |
| adamantita | 184 | 45.7% |
| bronce | 930 | 50.5% |
| filo_estelar | 174 | 51.1% |
| hierro | 882 | 49.7% |
| mitril | 480 | 47.7% |
| titanio | 489 | 49.7% |

### Nature by level bracket
- **100-199**: contundente: 242, cortante: 210, desarmado: 109, perforante: 440
- **200-299**: contundente: 241, cortante: 225, desarmado: 113, perforante: 512
- **300-399**: contundente: 232, cortante: 213, desarmado: 108, perforante: 421
- **400-500**: contundente: 231, cortante: 207, desarmado: 89, perforante: 407

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 45.3% | 920 | 51.4% | 3080 | -6.0pp |
| d_fulgor | 45.9% | 922 | 51.2% | 3078 | -5.3pp |
| r_fulgor | 46.4% | 932 | 51.1% | 3068 | -4.7pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 28.1 | 1 | 130 | 13 | 25 | 38 |
| Asesino | 41.1 | 1 | 163 | 13 | 31 | 64 |
| Esquivo | 28.0 | 1 | 108 | 17 | 25 | 37 |
| Equilibrado | 34.8 | 1 | 135 | 17 | 30 | 47 |
| Extremista ATK | 55.5 | 1 | 165 | 23 | 56 | 82 |
| Extremista DEF | 24.9 | 0 | 143 | 12 | 21 | 32 |
| Extremista ASPD | 48.2 | 1 | 161 | 24 | 44 | 69 |
| Extremista REF | 28.9 | 1 | 162 | 12 | 25 | 42 |
| Velocista | 29.0 | 1 | 115 | 15 | 28 | 38 |
| Berserker | 64.8 | 1 | 172 | 40 | 68 | 88 |
| Guardian | 27.4 | 0 | 146 | 15 | 25 | 36 |
| Estratega | 32.4 | 1 | 134 | 16 | 29 | 47 |
| Gladiador | 46.3 | 1 | 171 | 14 | 42 | 74 |
| Magus | 45.9 | 1 | 174 | 26 | 41 | 59 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 0 | 0 | 0.0% |
| Equilibrado | 22 | 22 | 100.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
| Extremista REF | 2 | 2 | 100.0% |
| Velocista | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 161 | 970 | 16.6% |
| Asesino | 46 | 597 | 7.7% |
| Esquivo | 426 | 793 | 53.7% |
| Equilibrado | 293 | 1049 | 27.9% |
| Extremista ATK | 107 | 698 | 15.3% |
| Extremista DEF | 177 | 919 | 19.3% |
| Extremista ASPD | 96 | 724 | 13.3% |
| Extremista REF | 769 | 926 | 83.0% |
| Velocista | 123 | 871 | 14.1% |
| Berserker | 137 | 680 | 20.1% |
| Guardian | 132 | 1199 | 11.0% |
| Estratega | 543 | 804 | 67.5% |
| Gladiador | 264 | 636 | 41.5% |
| Magus | 148 | 659 | 22.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 26 | 45 | 62 | 56 | 13 | 18 | 14 | 10 | 90 | 15 | 42 | 14 | 10 | 21 |
| 5 | 39 | 49 | 66 | 63 | 22 | 29 | 22 | 16 | 95 | 23 | 54 | 21 | 22 | 29 |
| 10 | 40 | 49 | 67 | 64 | 22 | 32 | 22 | 15 | 96 | 23 | 54 | 21 | 22 | 29 |
| 15 | 40 | 49 | 66 | 64 | 22 | 33 | 22 | 16 | 96 | 24 | 53 | 21 | 22 | 29 |
| 20 | 40 | 49 | 66 | 64 | 22 | 34 | 22 | 16 | 98 | 24 | 53 | 21 | 22 | 29 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 95.0% | 84.2% | 76.2% | 68.2% | 46.2% | 71.4% | 58.3% | 78.8% | 52.4% | 63.2% | 44.4% | 56.3% | 81.8% |
| Asesino | 5.0% | 50.0% | 66.7% | 21.7% | 11.8% | 6.3% | 28.6% | 19.0% | 65.4% | 19.2% | 0.0% | 11.1% | 26.7% | 32.1% |
| Esquivo | 15.8% | 33.3% | 50.0% | 31.6% | 28.6% | 22.7% | 12.0% | 6.3% | 50.0% | 20.0% | 13.6% | 24.0% | 29.4% | 17.6% |
| Equilibrado | 23.8% | 78.3% | 68.4% | 50.0% | 26.7% | 39.1% | 63.2% | 23.3% | 82.1% | 28.6% | 17.6% | 19.0% | 25.0% | 42.9% |
| Extremista ATK | 31.8% | 88.2% | 71.4% | 73.3% | 50.0% | 34.8% | 61.5% | 52.4% | 84.0% | 40.0% | 21.1% | 46.2% | 34.6% | 64.7% |
| Extremista DEF | 53.8% | 93.8% | 77.3% | 60.9% | 65.2% | 50.0% | 70.0% | 64.7% | 93.3% | 58.8% | 70.6% | 50.0% | 55.6% | 83.3% |
| Extremista ASPD | 28.6% | 71.4% | 88.0% | 36.8% | 38.5% | 30.0% | 50.0% | 46.2% | 83.3% | 36.8% | 60.0% | 47.4% | 33.3% | 50.0% |
| Extremista REF | 41.7% | 81.0% | 93.8% | 76.7% | 47.6% | 35.3% | 53.8% | 50.0% | 90.5% | 26.3% | 60.9% | 36.0% | 42.9% | 54.2% |
| Velocista | 21.2% | 34.6% | 50.0% | 17.9% | 16.0% | 6.7% | 16.7% | 9.5% | 50.0% | 15.0% | 20.0% | 11.1% | 0.0% | 11.1% |
| Berserker | 47.6% | 80.8% | 80.0% | 71.4% | 60.0% | 41.2% | 63.2% | 73.7% | 85.0% | 50.0% | 50.0% | 50.0% | 66.7% | 63.6% |
| Guardian | 36.8% | 100.0% | 86.4% | 82.4% | 78.9% | 29.4% | 40.0% | 39.1% | 80.0% | 50.0% | 50.0% | 42.9% | 25.0% | 47.8% |
| Estratega | 55.6% | 88.9% | 76.0% | 81.0% | 53.8% | 45.0% | 52.6% | 64.0% | 88.9% | 50.0% | 57.1% | 50.0% | 39.1% | 77.3% |
| Gladiador | 43.8% | 73.3% | 70.6% | 75.0% | 65.4% | 44.4% | 66.7% | 57.1% | 100.0% | 33.3% | 75.0% | 60.9% | 50.0% | 66.7% |
| Magus | 18.2% | 67.9% | 82.4% | 57.1% | 35.3% | 16.7% | 50.0% | 45.8% | 88.9% | 36.4% | 52.2% | 22.7% | 33.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.5% | 661 |
| 16-30 | 46.1% | 1040 |
| 31-50 | 49.3% | 726 |
| 51-70 | 53.0% | 428 |
| 71-100 | 54.2% | 1145 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 25.0% | 28 |
| 16-30 | 38.3% | 880 |
| 31-50 | 50.5% | 1529 |
| 51-70 | 54.5% | 602 |
| 71-100 | 57.8% | 961 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.2% | 483 |
| 16-30 | 49.2% | 791 |
| 31-50 | 45.7% | 738 |
| 51-70 | 45.6% | 568 |
| 71-100 | 53.7% | 1420 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.2% | 910 |
| 16-30 | 49.7% | 982 |
| 31-50 | 49.0% | 694 |
| 51-70 | 51.2% | 475 |
| 71-100 | 52.1% | 939 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.2% | 1609 |
| 16-30 | 51.4% | 1118 |
| 31-50 | 47.6% | 607 |
| 51-70 | 42.1% | 266 |
| 71-100 | 25.5% | 400 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3268 |
| 16-30 | 42.3% | 435 |
| 31-50 | 48.7% | 230 |
| 51-70 | 53.1% | 64 |
| 71-100 | 33.3% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3254 |
| 16-30 | 40.6% | 446 |
| 31-50 | 52.5% | 242 |
| 51-70 | 52.7% | 55 |
| 71-100 | 33.3% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.9% | 3265 |
| 16-30 | 41.3% | 455 |
| 31-50 | 52.3% | 220 |
| 51-70 | 57.4% | 54 |
| 71-100 | 33.3% | 6 |
