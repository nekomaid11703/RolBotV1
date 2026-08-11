# Combat Simulation Report
Generated: 2026-08-05 14:01:01 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.1 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.1 | FAIL |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1873 (93.7%) |
| Timeouts (draws) | 127 (6.3%) |
| Avg rounds (all) | 5.7 |
| Avg rounds (KO only) | 4.7 |
| Rounds P50 / P90 / Max | 4 / 13 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 303 |
| Avg rounds | 6.1 |
| P50 / P90 | 4 / 14 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 861/2000 |
| Winrate | 43.0% |
| Advantage over 50% | -7.0% |
| Draws | 2 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 200 | 275 | 72.7% | YES |
| Asesino | 69 | 280 | 24.6% |  |
| Esquivo | 71 | 292 | 24.3% |  |
| Equilibrado | 105 | 295 | 35.6% |  |
| Extremista ATK | 171 | 301 | 56.8% |  |
| Extremista DEF | 185 | 265 | 69.8% |  |
| Extremista ASPD | 157 | 283 | 55.5% |  |
| Extremista REF | 160 | 276 | 58.0% |  |
| Velocista | 51 | 290 | 17.6% |  |
| Berserker | 169 | 286 | 59.1% |  |
| Guardian | 153 | 287 | 53.3% |  |
| Estratega | 182 | 297 | 61.3% |  |
| Gladiador | 178 | 268 | 66.4% |  |
| Magus | 147 | 305 | 48.2% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.4 | 0 |
| Heal applied | 19.6 | - |
| Rests | 3.6 | 2 |
| Advances | 4.2 | - |
| Retreats | 0.0 | - |
| Battles with item use | 20.2% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 100.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.40 (avg 48.13) |
| ASPD spread (stddev) | 31.13 (avg 54.28) |
| Equipment tier A | 519 (13.0%) |
| Equipment tier B | 838 (20.9%) |
| Equipment tier C | 1019 (25.5%) |
| Equipment tier E | 1624 (40.6%) |
| Level 100-199 | 954 |
| Level 200-299 | 1093 |
| Level 300-399 | 999 |
| Level 400-500 | 954 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| cortante | 4000 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 2167 | 51.5% |
| ligera | 408 | 43.6% |
| media | 414 | 47.3% |
| total | 1011 | 50.3% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 110 | 33.6% |
| 3+ | 3890 | 50.4% |
Set bonus active: 50.4% (3890) vs inactive 33.6% (110)

### Amulet
With amulet: 50.5% (1597) vs without 49.6% (2403)

### Shield
With shield: 51.6% (2415) vs without 47.4% (1585)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 519 | 55.5% |
| B | 838 | 51.6% |
| C | 1019 | 53.1% |
| E | 1624 | 45.4% |

### Nature by level bracket
- **100-199**: cortante: 954
- **200-299**: cortante: 1093
- **300-399**: cortante: 999
- **400-500**: cortante: 954

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 49.6% | 964 | 50.1% | 3036 | -0.5pp |
| d_fulgor | 49.0% | 971 | 50.2% | 3029 | -1.2pp |
| r_fulgor | 49.2% | 959 | 50.2% | 3041 | -1.0pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 24.5 | 0 | 80 | 15 | 23 | 36 |
| Asesino | 66.7 | 0 | 112 | 49 | 69 | 87 |
| Esquivo | 14.6 | 0 | 75 | 0 | 0 | 30 |
| Equilibrado | 35.4 | 0 | 105 | 0 | 34 | 57 |
| Extremista ATK | 72.1 | 0 | 114 | 59 | 78 | 91 |
| Extremista DEF | 6.6 | 0 | 85 | 0 | 0 | 0 |
| Extremista ASPD | 58.1 | 0 | 114 | 36 | 54 | 78 |
| Extremista REF | 34.1 | 0 | 99 | 21 | 31 | 46 |
| Velocista | 29.6 | 0 | 81 | 20 | 33 | 40 |
| Berserker | 73.7 | 0 | 112 | 64 | 76 | 90 |
| Guardian | 11.2 | 0 | 75 | 0 | 0 | 23 |
| Estratega | 36.2 | 0 | 100 | 24 | 33 | 47 |
| Gladiador | 65.8 | 23 | 113 | 48 | 65 | 84 |
| Magus | 55.7 | 0 | 116 | 36 | 54 | 74 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 431 | 431 | 100.0% |
| Asesino | 147 | 147 | 100.0% |
| Esquivo | 1404 | 1404 | 100.0% |
| Equilibrado | 647 | 647 | 100.0% |
| Extremista ATK | 204 | 204 | 100.0% |
| Extremista DEF | 222 | 222 | 100.0% |
| Extremista ASPD | 125 | 125 | 100.0% |
| Extremista REF | 211 | 211 | 100.0% |
| Velocista | 598 | 598 | 100.0% |
| Berserker | 137 | 137 | 100.0% |
| Guardian | 595 | 595 | 100.0% |
| Estratega | 329 | 329 | 100.0% |
| Gladiador | 218 | 218 | 100.0% |
| Magus | 378 | 378 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 27 | 1159 | 2.3% |
| Asesino | 5 | 592 | 0.8% |
| Esquivo | 210 | 1930 | 10.9% |
| Equilibrado | 32 | 1340 | 2.4% |
| Extremista ATK | 68 | 690 | 9.9% |
| Extremista DEF | 209 | 887 | 23.6% |
| Extremista ASPD | 91 | 586 | 15.5% |
| Extremista REF | 473 | 806 | 58.7% |
| Velocista | 0 | 1130 | 0.0% |
| Berserker | 103 | 621 | 16.6% |
| Guardian | 10 | 1576 | 0.6% |
| Estratega | 510 | 979 | 52.1% |
| Gladiador | 205 | 579 | 35.4% |
| Magus | 172 | 900 | 19.1% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 25 | 46 | 62 | 57 | 12 | 18 | 13 | 13 | 101 | 13 | 48 | 16 | 9 | 24 |
| 5 | 36 | 49 | 64 | 60 | 21 | 27 | 20 | 18 | 102 | 22 | 56 | 21 | 20 | 30 |
| 10 | 38 | 49 | 66 | 61 | 21 | 32 | 21 | 18 | 102 | 22 | 56 | 21 | 20 | 30 |
| 15 | 38 | 49 | 67 | 62 | 22 | 35 | 21 | 18 | 102 | 23 | 56 | 21 | 20 | 31 |
| 20 | 38 | 49 | 69 | 62 | 22 | 37 | 21 | 18 | 103 | 23 | 57 | 21 | 20 | 31 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 87.0% | 76.9% | 77.3% | 86.7% | 54.5% | 76.2% | 61.5% | 100.0% | 77.8% | 44.4% | 52.6% | 71.4% | 83.3% |
| Asesino | 13.0% | 50.0% | 73.7% | 27.3% | 10.7% | 14.3% | 25.0% | 22.2% | 56.3% | 8.0% | 19.0% | 8.3% | 13.6% | 35.0% |
| Esquivo | 23.1% | 26.3% | 44.4% | 31.3% | 12.5% | 12.0% | 13.0% | 26.7% | 66.7% | 26.3% | 13.6% | 22.6% | 5.6% | 18.2% |
| Equilibrado | 22.7% | 72.7% | 68.8% | 50.0% | 26.3% | 47.1% | 3.8% | 34.6% | 60.0% | 17.4% | 31.3% | 30.0% | 10.0% | 33.3% |
| Extremista ATK | 13.3% | 89.3% | 87.5% | 73.7% | 50.0% | 13.3% | 56.0% | 70.0% | 95.8% | 46.2% | 40.0% | 52.2% | 48.1% | 61.1% |
| Extremista DEF | 45.5% | 85.7% | 88.0% | 52.9% | 86.7% | 50.0% | 100.0% | 75.0% | 76.2% | 81.0% | 56.5% | 70.0% | 50.0% | 68.4% |
| Extremista ASPD | 23.8% | 75.0% | 87.0% | 96.2% | 44.0% | 0.0% | 50.0% | 44.4% | 86.4% | 41.2% | 47.6% | 47.1% | 26.3% | 72.7% |
| Extremista REF | 38.5% | 77.8% | 73.3% | 65.4% | 30.0% | 25.0% | 55.6% | 50.0% | 95.2% | 65.0% | 81.0% | 45.8% | 57.1% | 47.1% |
| Velocista | 0.0% | 43.8% | 33.3% | 40.0% | 4.2% | 23.8% | 13.6% | 4.8% | 50.0% | 4.5% | 22.2% | 4.8% | 0.0% | 14.3% |
| Berserker | 22.2% | 92.0% | 73.7% | 82.6% | 53.8% | 19.0% | 58.8% | 35.0% | 95.5% | 50.0% | 50.0% | 55.0% | 50.0% | 77.8% |
| Guardian | 55.6% | 81.0% | 81.8% | 68.8% | 60.0% | 43.5% | 52.4% | 19.0% | 77.8% | 50.0% | 50.0% | 31.3% | 34.8% | 42.1% |
| Estratega | 47.4% | 91.7% | 77.4% | 70.0% | 47.8% | 30.0% | 52.9% | 54.2% | 95.2% | 45.0% | 68.8% | 50.0% | 35.0% | 80.0% |
| Gladiador | 28.6% | 86.4% | 94.4% | 90.0% | 51.9% | 50.0% | 73.7% | 42.9% | 100.0% | 50.0% | 65.2% | 65.0% | 50.0% | 77.8% |
| Magus | 16.7% | 65.0% | 81.8% | 66.7% | 38.9% | 31.6% | 27.3% | 52.9% | 85.7% | 22.2% | 57.9% | 20.0% | 22.2% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.0% | 683 |
| 16-30 | 49.2% | 995 |
| 31-50 | 49.4% | 707 |
| 51-70 | 47.6% | 424 |
| 71-100 | 54.0% | 1191 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 30.0% | 30 |
| 16-30 | 39.9% | 855 |
| 31-50 | 49.3% | 1494 |
| 51-70 | 53.1% | 639 |
| 71-100 | 58.2% | 982 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 477 |
| 16-30 | 47.7% | 767 |
| 31-50 | 48.5% | 751 |
| 51-70 | 46.5% | 536 |
| 71-100 | 52.7% | 1469 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.9% | 911 |
| 16-30 | 48.9% | 979 |
| 31-50 | 48.4% | 719 |
| 51-70 | 47.9% | 491 |
| 71-100 | 53.4% | 900 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 59.1% | 1564 |
| 16-30 | 52.4% | 1113 |
| 31-50 | 45.5% | 626 |
| 51-70 | 30.7% | 280 |
| 71-100 | 28.5% | 417 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.9% | 3216 |
| 16-30 | 47.0% | 464 |
| 31-50 | 56.2% | 260 |
| 51-70 | 50.0% | 52 |
| 71-100 | 37.5% | 8 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.0% | 3242 |
| 16-30 | 46.7% | 454 |
| 31-50 | 55.1% | 245 |
| 51-70 | 54.7% | 53 |
| 71-100 | 33.3% | 6 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.6% | 3233 |
| 16-30 | 49.5% | 455 |
| 31-50 | 53.7% | 246 |
| 51-70 | 55.9% | 59 |
| 71-100 | 42.9% | 7 |
