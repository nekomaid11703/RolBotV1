# Combat Simulation Report
Generated: 2026-08-07 18:08:05 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.8 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1961 (98.0%) |
| Timeouts (draws) | 39 (1.9%) |
| Avg rounds (all) | 5.5 |
| Avg rounds (KO only) | 5.2 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 236 |
| Avg rounds | 5.8 |
| P50 / P90 | 4 / 11 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 963/2000 |
| Winrate | 48.1% |
| Advantage over 50% | -1.9% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 172 | 260 | 66.2% |  |
| Asesino | 83 | 268 | 31.0% |  |
| Esquivo | 84 | 295 | 28.5% |  |
| Equilibrado | 101 | 290 | 34.8% |  |
| Extremista ATK | 190 | 312 | 60.9% |  |
| Extremista DEF | 200 | 294 | 68.0% | YES |
| Extremista ASPD | 173 | 305 | 56.7% |  |
| Extremista REF | 164 | 286 | 57.3% |  |
| Velocista | 48 | 291 | 16.5% |  |
| Berserker | 159 | 272 | 58.5% |  |
| Guardian | 151 | 283 | 53.4% |  |
| Estratega | 175 | 287 | 61.0% |  |
| Gladiador | 175 | 280 | 62.5% |  |
| Magus | 125 | 277 | 45.1% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 26.8 | - |
| Rests | 3.1 | 2 |
| Advances | 4.0 | - |
| Retreats | 0.7 | - |
| Battles with item use | 23.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.9% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.66 (avg 48.03) |
| ASPD spread (stddev) | 31.33 (avg 53.56) |
| Equipment tier A | 141 (3.5%) |
| Equipment tier B | 1619 (40.5%) |
| Equipment tier C | 700 (17.5%) |
| Equipment tier D | 1151 (28.8%) |
| Equipment tier S | 389 (9.7%) |
| Level 100-199 | 945 |
| Level 200-299 | 1119 |
| Level 300-399 | 1016 |
| Level 400-500 | 920 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 889 |
| cortante | 925 |
| desarmado | 405 |
| perforante | 1781 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1293 | 48.0% |
| ligera | 16 | 43.8% |
| media | 122 | 44.3% |
| total | 2569 | 51.3% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 108 | 48.1% |
| 3+ | 3892 | 50.1% |
Set bonus active: 50.1% (3892) vs inactive 48.1% (108)

### Amulet
With amulet: 49.8% (1614) vs without 50.1% (2386)

### Shield
With shield: 50.5% (2381) vs without 49.3% (1619)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 128 | 66.4% |
| B | 1459 | 55.9% |
| C | 630 | 49.5% |
| D | 1037 | 40.4% |
| S | 341 | 70.7% |
| desarmado | 405 | 31.4% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 813 | 50.9% |
| adamantita | 182 | 70.9% |
| bronce | 802 | 44.9% |
| desarmado | 405 | 31.4% |
| filo_estelar | 159 | 70.4% |
| hierro | 809 | 44.4% |
| mitril | 449 | 63.3% |
| titanio | 381 | 56.4% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 830 | 60.1% |
| mitico | 341 | 70.7% |
| ninguno | 405 | 31.4% |
| poco_comun | 2424 | 46.7% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 939 | 49.2% |
| adamantita | 190 | 50.0% |
| bronce | 884 | 50.1% |
| filo_estelar | 209 | 49.3% |
| hierro | 880 | 50.6% |
| mitril | 481 | 49.3% |
| titanio | 417 | 51.6% |

### Nature by level bracket
- **100-199**: contundente: 230, cortante: 230, desarmado: 104, perforante: 381
- **200-299**: contundente: 246, cortante: 249, desarmado: 106, perforante: 518
- **300-399**: contundente: 216, cortante: 239, desarmado: 101, perforante: 460
- **400-500**: contundente: 197, cortante: 207, desarmado: 94, perforante: 422

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 48.3% | 947 | 50.5% | 3053 | -2.3pp |
| d_fulgor | 48.0% | 943 | 50.6% | 3057 | -2.6pp |
| r_fulgor | 49.1% | 953 | 50.3% | 3047 | -1.2pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 26.0 | 0 | 143 | 13 | 23 | 36 |
| Asesino | 48.0 | 1 | 156 | 19 | 48 | 72 |
| Esquivo | 28.4 | 1 | 123 | 15 | 23 | 33 |
| Equilibrado | 39.5 | 1 | 144 | 23 | 34 | 52 |
| Extremista ATK | 56.2 | 1 | 170 | 18 | 57 | 83 |
| Extremista DEF | 22.9 | 0 | 133 | 10 | 20 | 30 |
| Extremista ASPD | 50.8 | 1 | 177 | 21 | 50 | 77 |
| Extremista REF | 32.7 | 1 | 134 | 17 | 29 | 42 |
| Velocista | 33.5 | 1 | 128 | 18 | 28 | 39 |
| Berserker | 63.4 | 3 | 183 | 40 | 65 | 80 |
| Guardian | 22.9 | 1 | 122 | 12 | 21 | 29 |
| Estratega | 36.6 | 1 | 148 | 17 | 30 | 50 |
| Gladiador | 52.9 | 2 | 143 | 25 | 48 | 81 |
| Magus | 44.6 | 1 | 158 | 19 | 39 | 66 |

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
| Magus | 28 | 28 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 174 | 928 | 18.8% |
| Asesino | 57 | 640 | 8.9% |
| Esquivo | 498 | 839 | 59.4% |
| Equilibrado | 206 | 924 | 22.3% |
| Extremista ATK | 103 | 686 | 15.0% |
| Extremista DEF | 225 | 1027 | 21.9% |
| Extremista ASPD | 138 | 796 | 17.3% |
| Extremista REF | 618 | 805 | 76.8% |
| Velocista | 168 | 883 | 19.0% |
| Berserker | 72 | 559 | 12.9% |
| Guardian | 224 | 1233 | 18.2% |
| Estratega | 544 | 786 | 69.2% |
| Gladiador | 342 | 653 | 52.4% |
| Magus | 200 | 726 | 27.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 22 | 46 | 58 | 59 | 12 | 16 | 12 | 12 | 104 | 14 | 42 | 14 | 10 | 25 |
| 5 | 35 | 51 | 61 | 65 | 22 | 29 | 21 | 19 | 112 | 24 | 55 | 24 | 21 | 32 |
| 10 | 36 | 51 | 61 | 66 | 22 | 32 | 21 | 18 | 113 | 24 | 55 | 23 | 21 | 32 |
| 15 | 36 | 51 | 61 | 65 | 22 | 33 | 21 | 18 | 113 | 24 | 55 | 23 | 21 | 32 |
| 20 | 36 | 51 | 61 | 65 | 22 | 34 | 21 | 18 | 114 | 24 | 55 | 23 | 21 | 32 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 94.7% | 78.3% | 81.3% | 42.9% | 42.9% | 79.2% | 48.1% | 100.0% | 66.7% | 75.0% | 52.4% | 26.7% | 82.4% |
| Asesino | 5.3% | 50.0% | 43.3% | 48.0% | 8.0% | 5.9% | 20.8% | 21.4% | 86.7% | 14.3% | 23.5% | 35.0% | 15.4% | 53.3% |
| Esquivo | 21.7% | 56.7% | 50.0% | 26.3% | 4.5% | 20.8% | 17.4% | 31.6% | 66.7% | 9.1% | 21.7% | 11.8% | 5.0% | 61.5% |
| Equilibrado | 18.8% | 52.0% | 73.7% | 50.0% | 21.7% | 30.4% | 22.7% | 15.0% | 57.9% | 16.7% | 55.6% | 18.2% | 25.0% | 40.7% |
| Extremista ATK | 57.1% | 92.0% | 95.5% | 78.3% | 50.0% | 29.2% | 52.6% | 65.2% | 93.8% | 55.6% | 33.3% | 42.3% | 52.2% | 73.9% |
| Extremista DEF | 57.1% | 94.1% | 79.2% | 69.6% | 70.8% | 50.0% | 65.0% | 33.3% | 90.9% | 66.7% | 80.0% | 70.8% | 45.5% | 66.7% |
| Extremista ASPD | 20.8% | 79.2% | 82.6% | 77.3% | 47.4% | 35.0% | 50.0% | 57.1% | 96.2% | 39.1% | 47.8% | 50.0% | 45.2% | 61.1% |
| Extremista REF | 51.9% | 78.6% | 68.4% | 85.0% | 34.8% | 66.7% | 42.9% | 50.0% | 88.9% | 60.0% | 36.8% | 38.9% | 50.0% | 60.7% |
| Velocista | 0.0% | 13.3% | 33.3% | 42.1% | 6.3% | 9.1% | 3.8% | 11.1% | 50.0% | 13.6% | 24.0% | 3.8% | 13.3% | 15.0% |
| Berserker | 33.3% | 85.7% | 90.9% | 83.3% | 44.4% | 33.3% | 60.9% | 40.0% | 86.4% | 50.0% | 39.1% | 52.0% | 52.4% | 50.0% |
| Guardian | 25.0% | 76.5% | 78.3% | 44.4% | 66.7% | 20.0% | 52.2% | 63.2% | 76.0% | 60.9% | 50.0% | 26.7% | 63.6% | 28.6% |
| Estratega | 47.6% | 65.0% | 88.2% | 81.8% | 57.7% | 29.2% | 50.0% | 61.1% | 96.2% | 48.0% | 73.3% | 50.0% | 66.7% | 41.2% |
| Gladiador | 73.3% | 84.6% | 95.0% | 75.0% | 47.8% | 54.5% | 54.8% | 50.0% | 86.7% | 47.6% | 36.4% | 33.3% | 50.0% | 72.7% |
| Magus | 17.6% | 46.7% | 38.5% | 59.3% | 26.1% | 33.3% | 38.9% | 39.3% | 85.0% | 50.0% | 71.4% | 58.8% | 27.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.9% | 708 |
| 16-30 | 48.1% | 993 |
| 31-50 | 47.0% | 690 |
| 51-70 | 46.1% | 425 |
| 71-100 | 57.8% | 1184 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 32.1% | 28 |
| 16-30 | 41.1% | 891 |
| 31-50 | 48.8% | 1458 |
| 51-70 | 54.6% | 614 |
| 71-100 | 57.3% | 1009 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.8% | 507 |
| 16-30 | 47.9% | 777 |
| 31-50 | 43.6% | 722 |
| 51-70 | 48.3% | 561 |
| 71-100 | 53.7% | 1433 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.4% | 929 |
| 16-30 | 49.1% | 969 |
| 31-50 | 47.7% | 728 |
| 51-70 | 48.4% | 488 |
| 71-100 | 54.4% | 886 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.7% | 1593 |
| 16-30 | 52.5% | 1138 |
| 31-50 | 48.0% | 608 |
| 51-70 | 32.2% | 273 |
| 71-100 | 26.8% | 388 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 3238 |
| 16-30 | 48.4% | 446 |
| 31-50 | 45.6% | 237 |
| 51-70 | 64.8% | 71 |
| 71-100 | 62.5% | 8 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.9% | 3242 |
| 16-30 | 50.3% | 443 |
| 31-50 | 48.5% | 241 |
| 51-70 | 55.6% | 72 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 3238 |
| 16-30 | 47.8% | 439 |
| 31-50 | 48.8% | 248 |
| 51-70 | 59.4% | 69 |
| 71-100 | 33.3% | 6 |
