# Combat Simulation Report
Generated: 2026-08-05 14:01:09 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 8.4 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1704 (85.2%) |
| Timeouts (draws) | 296 (14.8%) |
| Avg rounds (all) | 8.2 |
| Avg rounds (KO only) | 6.0 |
| Rounds P50 / P90 / Max | 5 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 302 |
| Avg rounds | 8.4 |
| P50 / P90 | 6 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 917/2000 |
| Winrate | 45.9% |
| Advantage over 50% | -4.1% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 197 | 291 | 67.7% |  |
| Asesino | 91 | 299 | 30.4% |  |
| Esquivo | 67 | 280 | 23.9% |  |
| Equilibrado | 110 | 294 | 37.4% |  |
| Extremista ATK | 184 | 276 | 66.7% |  |
| Extremista DEF | 169 | 262 | 64.5% |  |
| Extremista ASPD | 152 | 266 | 57.1% |  |
| Extremista REF | 124 | 293 | 42.3% |  |
| Velocista | 42 | 288 | 14.6% |  |
| Berserker | 208 | 318 | 65.4% |  |
| Guardian | 141 | 271 | 52.0% |  |
| Estratega | 184 | 294 | 62.6% |  |
| Gladiador | 192 | 280 | 68.6% | YES |
| Magus | 137 | 288 | 47.6% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 24.8 | - |
| Rests | 5.6 | 4 |
| Advances | 4.3 | - |
| Retreats | 0.0 | - |
| Battles with item use | 22.3% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 100.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.28 (avg 47.88) |
| ASPD spread (stddev) | 31.40 (avg 53.33) |
| Equipment tier A | 495 (12.4%) |
| Equipment tier B | 809 (20.2%) |
| Equipment tier C | 1019 (25.5%) |
| Equipment tier E | 1677 (41.9%) |
| Level 100-199 | 986 |
| Level 200-299 | 1112 |
| Level 300-399 | 993 |
| Level 400-500 | 909 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 4000 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 2280 | 49.4% |
| ligera | 404 | 44.3% |
| media | 377 | 51.2% |
| ninguna | 1 | 100.0% |
| total | 938 | 53.1% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 0 | 1 | 100.0% |
| 1-2 | 91 | 38.5% |
| 3+ | 3908 | 50.2% |
Set bonus active: 50.2% (3908) vs inactive 39.1% (92)

### Amulet
With amulet: 50.8% (1585) vs without 49.4% (2415)

### Shield
With shield: 49.7% (2439) vs without 50.4% (1561)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 495 | 57.0% |
| B | 809 | 55.5% |
| C | 1019 | 50.0% |
| E | 1677 | 45.1% |

### Nature by level bracket
- **100-199**: contundente: 986
- **200-299**: contundente: 1112
- **300-399**: contundente: 993
- **400-500**: contundente: 909

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 45.3% | 958 | 51.4% | 3042 | -6.1pp |
| d_fulgor | 45.3% | 951 | 51.4% | 3049 | -6.1pp |
| r_fulgor | 44.8% | 949 | 51.6% | 3051 | -6.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 9.5 | 0 | 42 | 5 | 8 | 13 |
| Asesino | 43.8 | 0 | 79 | 31 | 48 | 58 |
| Esquivo | 6.9 | 0 | 38 | 0 | 6 | 12 |
| Equilibrado | 16.4 | 0 | 65 | 0 | 15 | 26 |
| Extremista ATK | 53.8 | 0 | 82 | 49 | 52 | 67 |
| Extremista DEF | 3.3 | 0 | 45 | 0 | 0 | 4 |
| Extremista ASPD | 39.8 | 0 | 81 | 21 | 43 | 56 |
| Extremista REF | 14.8 | 0 | 68 | 8 | 12 | 18 |
| Velocista | 12.6 | 0 | 34 | 6 | 11 | 18 |
| Berserker | 53.2 | 0 | 81 | 48 | 50 | 66 |
| Guardian | 4.5 | 0 | 31 | 0 | 0 | 8 |
| Estratega | 19.5 | 0 | 62 | 11 | 17 | 27 |
| Gladiador | 42.8 | 0 | 80 | 33 | 46 | 51 |
| Magus | 33.4 | 0 | 78 | 22 | 31 | 43 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 682 | 682 | 100.0% |
| Asesino | 193 | 193 | 100.0% |
| Esquivo | 1394 | 1394 | 100.0% |
| Equilibrado | 1039 | 1039 | 100.0% |
| Extremista ATK | 130 | 130 | 100.0% |
| Extremista DEF | 375 | 375 | 100.0% |
| Extremista ASPD | 111 | 111 | 100.0% |
| Extremista REF | 314 | 314 | 100.0% |
| Velocista | 660 | 660 | 100.0% |
| Berserker | 263 | 263 | 100.0% |
| Guardian | 855 | 855 | 100.0% |
| Estratega | 421 | 421 | 100.0% |
| Gladiador | 256 | 256 | 100.0% |
| Magus | 530 | 530 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 31 | 2361 | 1.3% |
| Asesino | 17 | 1180 | 1.4% |
| Esquivo | 484 | 2377 | 20.4% |
| Equilibrado | 93 | 2439 | 3.8% |
| Extremista ATK | 148 | 859 | 17.2% |
| Extremista DEF | 386 | 1569 | 24.6% |
| Extremista ASPD | 144 | 902 | 16.0% |
| Extremista REF | 1115 | 1683 | 66.3% |
| Velocista | 0 | 1802 | 0.0% |
| Berserker | 156 | 1196 | 13.0% |
| Guardian | 0 | 2615 | 0.0% |
| Estratega | 849 | 1524 | 55.7% |
| Gladiador | 290 | 886 | 32.7% |
| Magus | 280 | 1407 | 19.9% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 25 | 45 | 55 | 53 | 12 | 17 | 14 | 14 | 104 | 12 | 44 | 15 | 9 | 21 |
| 5 | 37 | 49 | 57 | 57 | 23 | 27 | 24 | 20 | 104 | 24 | 53 | 22 | 21 | 29 |
| 10 | 40 | 49 | 57 | 57 | 23 | 32 | 24 | 18 | 104 | 25 | 53 | 21 | 21 | 29 |
| 15 | 40 | 50 | 59 | 58 | 23 | 35 | 24 | 18 | 107 | 25 | 54 | 21 | 21 | 30 |
| 20 | 41 | 50 | 60 | 59 | 23 | 38 | 24 | 19 | 107 | 25 | 54 | 22 | 22 | 30 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 89.5% | 100.0% | 73.1% | 44.4% | 72.0% | 53.3% | 85.0% | 90.0% | 58.6% | 65.0% | 52.9% | 60.0% | 60.0% |
| Asesino | 10.5% | 50.0% | 57.9% | 34.5% | 6.3% | 9.1% | 38.9% | 37.5% | 83.3% | 16.1% | 26.3% | 23.8% | 12.5% | 27.6% |
| Esquivo | 0.0% | 42.1% | 50.0% | 25.0% | 11.8% | 9.5% | 15.8% | 25.0% | 81.3% | 15.0% | 15.0% | 17.4% | 9.1% | 23.8% |
| Equilibrado | 26.9% | 65.5% | 70.8% | 50.0% | 26.3% | 13.3% | 22.2% | 44.4% | 87.5% | 15.8% | 30.0% | 16.7% | 10.0% | 31.6% |
| Extremista ATK | 55.6% | 93.8% | 88.2% | 73.7% | 50.0% | 42.9% | 58.3% | 78.9% | 100.0% | 52.6% | 52.9% | 52.4% | 63.6% | 72.0% |
| Extremista DEF | 28.0% | 90.9% | 90.5% | 86.7% | 57.1% | 50.0% | 63.6% | 84.2% | 78.9% | 57.9% | 40.0% | 68.8% | 38.9% | 82.4% |
| Extremista ASPD | 46.7% | 61.1% | 84.2% | 77.8% | 41.7% | 36.4% | 50.0% | 87.5% | 88.2% | 28.0% | 47.1% | 52.4% | 35.7% | 60.0% |
| Extremista REF | 15.0% | 62.5% | 75.0% | 55.6% | 21.1% | 15.8% | 12.5% | 50.0% | 85.3% | 28.0% | 47.1% | 14.3% | 32.1% | 50.0% |
| Velocista | 10.0% | 16.7% | 18.8% | 12.5% | 0.0% | 21.1% | 11.8% | 14.7% | 50.0% | 6.3% | 8.3% | 0.0% | 9.5% | 8.0% |
| Berserker | 41.4% | 83.9% | 85.0% | 84.2% | 47.4% | 42.1% | 72.0% | 72.0% | 93.8% | 50.0% | 55.2% | 63.0% | 59.1% | 80.0% |
| Guardian | 35.0% | 73.7% | 85.0% | 70.0% | 47.1% | 60.0% | 52.9% | 52.9% | 91.7% | 44.8% | 50.0% | 29.4% | 0.0% | 57.1% |
| Estratega | 47.1% | 76.2% | 82.6% | 83.3% | 47.6% | 31.3% | 47.6% | 85.7% | 100.0% | 37.0% | 70.6% | 50.0% | 35.3% | 71.4% |
| Gladiador | 40.0% | 87.5% | 90.9% | 90.0% | 36.4% | 61.1% | 64.3% | 67.9% | 90.5% | 40.9% | 100.0% | 64.7% | 50.0% | 77.8% |
| Magus | 35.0% | 72.4% | 76.2% | 68.4% | 28.0% | 17.6% | 40.0% | 50.0% | 92.0% | 20.0% | 42.9% | 28.6% | 22.2% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.8% | 669 |
| 16-30 | 42.3% | 1024 |
| 31-50 | 50.6% | 694 |
| 51-70 | 51.8% | 434 |
| 71-100 | 60.7% | 1179 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 20.0% | 45 |
| 16-30 | 40.3% | 876 |
| 31-50 | 50.0% | 1517 |
| 51-70 | 52.0% | 629 |
| 71-100 | 58.9% | 933 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.9% | 482 |
| 16-30 | 48.4% | 854 |
| 31-50 | 45.0% | 706 |
| 51-70 | 47.1% | 527 |
| 71-100 | 55.4% | 1431 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.1% | 926 |
| 16-30 | 50.3% | 980 |
| 31-50 | 50.1% | 761 |
| 51-70 | 47.1% | 478 |
| 71-100 | 49.8% | 855 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.1% | 1610 |
| 16-30 | 53.3% | 1132 |
| 31-50 | 46.4% | 638 |
| 51-70 | 34.1% | 267 |
| 71-100 | 25.2% | 353 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3240 |
| 16-30 | 43.3% | 457 |
| 31-50 | 48.4% | 250 |
| 51-70 | 51.0% | 49 |
| 71-100 | 50.0% | 4 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3257 |
| 16-30 | 41.6% | 435 |
| 31-50 | 48.8% | 250 |
| 51-70 | 58.5% | 53 |
| 71-100 | 40.0% | 5 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3241 |
| 16-30 | 41.0% | 459 |
| 31-50 | 51.2% | 240 |
| 51-70 | 52.7% | 55 |
| 71-100 | 80.0% | 5 |
