# Combat Simulation Report
Generated: 2026-08-05 14:02:14 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.3 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1817 (90.8%) |
| Timeouts (draws) | 183 (9.2%) |
| Avg rounds (all) | 7.1 |
| Avg rounds (KO only) | 5.7 |
| Rounds P50 / P90 / Max | 5 / 19 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 284 |
| Avg rounds | 7.3 |
| P50 / P90 | 5 / 17 |

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
| Tanque | 191 | 294 | 65.0% |  |
| Asesino | 81 | 285 | 28.4% |  |
| Esquivo | 97 | 301 | 32.2% |  |
| Equilibrado | 123 | 306 | 40.2% |  |
| Extremista ATK | 156 | 295 | 52.9% |  |
| Extremista DEF | 170 | 277 | 61.4% |  |
| Extremista ASPD | 152 | 277 | 54.9% |  |
| Extremista REF | 151 | 282 | 53.5% |  |
| Velocista | 75 | 252 | 29.8% |  |
| Berserker | 144 | 289 | 49.8% |  |
| Guardian | 163 | 306 | 53.3% |  |
| Estratega | 182 | 276 | 65.9% | YES |
| Gladiador | 176 | 275 | 64.0% |  |
| Magus | 137 | 285 | 48.1% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.6 | 0 |
| Heal applied | 29.4 | - |
| Rests | 4.2 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.0 | - |
| Battles with item use | 27.7% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.9% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.11 (avg 47.83) |
| ASPD spread (stddev) | 31.37 (avg 53.31) |
| Equipment tier A | 485 (12.1%) |
| Equipment tier B | 869 (21.7%) |
| Equipment tier C | 1047 (26.2%) |
| Equipment tier E | 1599 (40.0%) |
| Level 100-199 | 968 |
| Level 200-299 | 1084 |
| Level 300-399 | 1030 |
| Level 400-500 | 918 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 929 |
| cortante | 931 |
| desarmado | 364 |
| perforante | 1776 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 2151 | 50.6% |
| ligera | 409 | 48.2% |
| media | 413 | 45.3% |
| total | 1027 | 51.2% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 100 | 43.0% |
| 3+ | 3900 | 50.1% |
Set bonus active: 50.1% (3900) vs inactive 43.0% (100)

### Amulet
With amulet: 50.6% (1572) vs without 49.5% (2428)

### Shield
With shield: 49.7% (2372) vs without 50.4% (1628)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 440 | 56.6% |
| B | 789 | 56.0% |
| C | 951 | 50.7% |
| E | 1456 | 45.9% |
| desarmado | 364 | 42.9% |

### Nature by level bracket
- **100-199**: contundente: 226, cortante: 226, desarmado: 88, perforante: 428
- **200-299**: contundente: 260, cortante: 259, desarmado: 98, perforante: 467
- **300-399**: contundente: 226, cortante: 231, desarmado: 99, perforante: 474
- **400-500**: contundente: 217, cortante: 215, desarmado: 79, perforante: 407

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 46.9% | 922 | 50.9% | 3078 | -4.0pp |
| d_fulgor | 47.0% | 931 | 50.8% | 3069 | -3.8pp |
| r_fulgor | 47.1% | 904 | 50.8% | 3096 | -3.7pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 15.6 | 0 | 106 | 5 | 12 | 23 |
| Asesino | 38.9 | 0 | 112 | 17 | 37 | 56 |
| Esquivo | 15.2 | 0 | 100 | 0 | 11 | 23 |
| Equilibrado | 22.5 | 0 | 106 | 8 | 20 | 33 |
| Extremista ATK | 46.1 | 0 | 110 | 24 | 49 | 68 |
| Extremista DEF | 5.5 | 0 | 106 | 0 | 0 | 4 |
| Extremista ASPD | 38.0 | 0 | 111 | 15 | 33 | 54 |
| Extremista REF | 22.8 | 0 | 98 | 12 | 20 | 29 |
| Velocista | 19.4 | 0 | 106 | 9 | 14 | 28 |
| Berserker | 43.2 | 0 | 113 | 13 | 46 | 66 |
| Guardian | 8.4 | 0 | 106 | 0 | 0 | 13 |
| Estratega | 26.5 | 0 | 91 | 14 | 23 | 35 |
| Gladiador | 43.6 | 0 | 111 | 24 | 42 | 62 |
| Magus | 36.5 | 0 | 112 | 17 | 31 | 53 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 311 | 311 | 100.0% |
| Asesino | 490 | 490 | 100.0% |
| Esquivo | 1164 | 1164 | 100.0% |
| Equilibrado | 822 | 822 | 100.0% |
| Extremista ATK | 173 | 173 | 100.0% |
| Extremista DEF | 264 | 264 | 100.0% |
| Extremista ASPD | 158 | 158 | 100.0% |
| Extremista REF | 190 | 190 | 100.0% |
| Velocista | 598 | 598 | 100.0% |
| Berserker | 106 | 106 | 100.0% |
| Guardian | 646 | 646 | 100.0% |
| Estratega | 420 | 420 | 100.0% |
| Gladiador | 185 | 185 | 100.0% |
| Magus | 431 | 431 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 50 | 1502 | 3.3% |
| Asesino | 10 | 1214 | 0.8% |
| Esquivo | 256 | 1893 | 13.5% |
| Equilibrado | 42 | 1845 | 2.3% |
| Extremista ATK | 131 | 1129 | 11.6% |
| Extremista DEF | 240 | 1322 | 18.2% |
| Extremista ASPD | 120 | 1004 | 12.0% |
| Extremista REF | 887 | 1343 | 66.0% |
| Velocista | 0 | 1322 | 0.0% |
| Berserker | 96 | 1032 | 9.3% |
| Guardian | 4 | 2093 | 0.2% |
| Estratega | 692 | 1351 | 51.2% |
| Gladiador | 290 | 825 | 35.2% |
| Magus | 247 | 1188 | 20.8% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 20 | 39 | 55 | 46 | 13 | 16 | 11 | 12 | 78 | 12 | 39 | 14 | 8 | 22 |
| 5 | 31 | 44 | 57 | 51 | 23 | 26 | 20 | 17 | 79 | 22 | 46 | 20 | 20 | 29 |
| 10 | 33 | 44 | 58 | 52 | 24 | 30 | 21 | 16 | 80 | 23 | 48 | 20 | 20 | 30 |
| 15 | 34 | 44 | 59 | 53 | 24 | 33 | 21 | 16 | 80 | 23 | 49 | 20 | 21 | 30 |
| 20 | 34 | 45 | 60 | 53 | 24 | 34 | 21 | 16 | 80 | 23 | 49 | 20 | 21 | 30 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 82.6% | 80.0% | 76.0% | 83.3% | 69.2% | 47.6% | 55.0% | 73.3% | 57.9% | 60.7% | 45.5% | 51.9% | 87.5% |
| Asesino | 17.4% | 50.0% | 59.1% | 56.5% | 6.7% | 8.3% | 7.4% | 43.8% | 53.8% | 21.1% | 22.7% | 16.7% | 27.8% | 24.1% |
| Esquivo | 20.0% | 40.9% | 50.0% | 55.0% | 37.0% | 27.8% | 4.8% | 15.8% | 63.2% | 16.7% | 23.1% | 22.2% | 40.0% | 39.1% |
| Equilibrado | 24.0% | 43.5% | 45.0% | 50.0% | 43.8% | 30.4% | 30.0% | 47.8% | 59.1% | 61.5% | 52.9% | 22.7% | 23.8% | 40.0% |
| Extremista ATK | 16.7% | 93.3% | 63.0% | 56.3% | 50.0% | 22.7% | 60.9% | 73.7% | 81.3% | 61.9% | 30.4% | 52.4% | 47.4% | 40.0% |
| Extremista DEF | 30.8% | 91.7% | 72.2% | 69.6% | 72.7% | 50.0% | 85.0% | 56.0% | 62.5% | 93.3% | 52.4% | 60.0% | 22.7% | 40.7% |
| Extremista ASPD | 52.4% | 92.6% | 95.2% | 70.0% | 39.1% | 15.0% | 50.0% | 50.0% | 60.0% | 44.0% | 38.1% | 43.8% | 43.8% | 64.7% |
| Extremista REF | 45.0% | 56.3% | 84.2% | 52.2% | 26.3% | 44.0% | 50.0% | 50.0% | 90.0% | 52.0% | 58.3% | 18.8% | 47.6% | 83.3% |
| Velocista | 26.7% | 46.2% | 36.8% | 40.9% | 18.8% | 37.5% | 40.0% | 10.0% | 50.0% | 36.4% | 21.1% | 4.0% | 15.0% | 29.4% |
| Berserker | 42.1% | 78.9% | 83.3% | 38.5% | 38.1% | 6.7% | 56.0% | 48.0% | 63.6% | 50.0% | 35.0% | 25.0% | 35.7% | 70.8% |
| Guardian | 39.3% | 77.3% | 76.9% | 47.1% | 69.6% | 42.9% | 61.9% | 41.7% | 78.9% | 65.0% | 50.0% | 35.7% | 20.0% | 31.3% |
| Estratega | 54.5% | 83.3% | 77.8% | 77.3% | 47.6% | 40.0% | 56.3% | 81.3% | 96.0% | 75.0% | 64.3% | 50.0% | 52.9% | 62.5% |
| Gladiador | 48.1% | 72.2% | 60.0% | 76.2% | 52.6% | 77.3% | 56.3% | 52.4% | 85.0% | 64.3% | 80.0% | 47.1% | 50.0% | 75.0% |
| Magus | 12.5% | 75.9% | 60.9% | 60.0% | 60.0% | 59.3% | 35.3% | 16.7% | 70.6% | 29.2% | 68.8% | 37.5% | 25.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.0% | 669 |
| 16-30 | 47.8% | 1017 |
| 31-50 | 48.8% | 711 |
| 51-70 | 48.1% | 451 |
| 71-100 | 53.8% | 1152 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.4% | 33 |
| 16-30 | 37.1% | 836 |
| 31-50 | 51.1% | 1473 |
| 51-70 | 55.5% | 620 |
| 71-100 | 55.7% | 1038 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 480 |
| 16-30 | 46.8% | 837 |
| 31-50 | 45.6% | 728 |
| 51-70 | 45.5% | 543 |
| 71-100 | 55.5% | 1412 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.9% | 917 |
| 16-30 | 47.4% | 964 |
| 31-50 | 50.9% | 737 |
| 51-70 | 52.2% | 454 |
| 71-100 | 53.8% | 928 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.4% | 1520 |
| 16-30 | 55.0% | 1159 |
| 31-50 | 45.0% | 673 |
| 51-70 | 36.7% | 305 |
| 71-100 | 39.1% | 343 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.7% | 3280 |
| 16-30 | 43.7% | 426 |
| 31-50 | 47.6% | 231 |
| 51-70 | 59.3% | 59 |
| 71-100 | 75.0% | 4 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 3266 |
| 16-30 | 45.6% | 430 |
| 31-50 | 48.7% | 238 |
| 51-70 | 47.5% | 61 |
| 71-100 | 80.0% | 5 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.3% | 3294 |
| 16-30 | 47.7% | 409 |
| 31-50 | 48.1% | 237 |
| 51-70 | 50.0% | 56 |
| 71-100 | 75.0% | 4 |
