# Combat Simulation Report
Generated: 2026-08-05 02:26:06 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.6 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 962 (96.2%) |
| Timeouts (draws) | 38 (3.8%) |
| Avg rounds (all) | 10.9 |
| Avg rounds (KO only) | 9.4 |
| Rounds P50 / P90 / Max | 6 / 26 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 137 |
| Avg rounds | 10.6 |
| P50 / P90 | 6 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 524/1000 |
| Winrate | 52.4% |
| Advantage over 50% | 2.4% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 82 | 135 | 60.7% |  |
| Asesino | 51 | 150 | 34.0% |  |
| Esquivo | 75 | 145 | 51.7% |  |
| Equilibrado | 68 | 131 | 51.9% |  |
| Extremista ATK | 64 | 154 | 41.6% |  |
| Extremista DEF | 68 | 128 | 53.1% |  |
| Extremista ASPD | 73 | 160 | 45.6% |  |
| Extremista REF | 76 | 127 | 59.8% |  |
| Velocista | 95 | 149 | 63.8% | YES |
| Berserker | 60 | 136 | 44.1% |  |
| Guardian | 86 | 155 | 55.5% |  |
| Estratega | 67 | 136 | 49.3% |  |
| Gladiador | 87 | 161 | 54.0% |  |
| Magus | 47 | 133 | 35.3% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.4 | 0 |
| Heal applied | 86.3 | - |
| Rests | 5.9 | 3 |
| Advances | 4.0 | - |
| Retreats | 0.2 | - |
| Battles with item use | 49.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.8% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.32 (avg 48.32) |
| ASPD spread (stddev) | 31.26 (avg 54.18) |
| Equipment tier A | 251 (12.6%) |
| Equipment tier B | 414 (20.7%) |
| Equipment tier C | 531 (26.6%) |
| Equipment tier E | 804 (40.2%) |
| Level 100-199 | 484 |
| Level 200-299 | 538 |
| Level 300-399 | 522 |
| Level 400-500 | 456 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 580 |
| cortante | 592 |
| desarmado | 205 |
| perforante | 623 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 2000 | 50.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 3+ | 2000 | 50.0% |
Set bonus active: 50.0% (2000) vs inactive 0.0% (0)

### Amulet
With amulet: 50.1% (785) vs without 49.9% (1215)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 228 | 71.9% |
| B | 375 | 62.1% |
| C | 483 | 44.9% |
| E | 709 | 42.5% |
| desarmado | 205 | 41.0% |

### Nature by level bracket
- **100-199**: contundente: 143, cortante: 150, desarmado: 60, perforante: 131
- **200-299**: contundente: 153, cortante: 156, desarmado: 53, perforante: 176
- **300-399**: contundente: 158, cortante: 149, desarmado: 46, perforante: 169
- **400-500**: contundente: 126, cortante: 137, desarmado: 46, perforante: 147

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 41.4% | 461 | 52.5% | 1539 | -11.1pp |
| d_fulgor | 41.7% | 465 | 52.4% | 1535 | -10.7pp |
| r_fulgor | 41.5% | 472 | 52.6% | 1528 | -11.0pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 15.3 | 0 | 128 | 0 | 10 | 19 |
| Asesino | 59.1 | 0 | 128 | 46 | 61 | 75 |
| Esquivo | 13.5 | 0 | 128 | 0 | 9 | 17 |
| Equilibrado | 27.9 | 0 | 128 | 0 | 21 | 39 |
| Extremista ATK | 63.7 | 0 | 128 | 46 | 59 | 84 |
| Extremista DEF | 7.5 | 0 | 128 | 0 | 0 | 5 |
| Extremista ASPD | 50.8 | 10 | 128 | 19 | 50 | 71 |
| Extremista REF | 26.3 | 0 | 128 | 13 | 19 | 32 |
| Velocista | 23.3 | 0 | 128 | 10 | 19 | 31 |
| Berserker | 63.5 | 19 | 128 | 46 | 55 | 77 |
| Guardian | 11.1 | 0 | 128 | 0 | 0 | 14 |
| Estratega | 25.9 | 0 | 128 | 11 | 19 | 35 |
| Gladiador | 49.9 | 0 | 128 | 26 | 46 | 66 |
| Magus | 43.5 | 0 | 128 | 24 | 37 | 56 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 139 | 139 | 100.0% |
| Asesino | 131 | 131 | 100.0% |
| Esquivo | 1179 | 1179 | 100.0% |
| Equilibrado | 953 | 953 | 100.0% |
| Extremista ATK | 116 | 116 | 100.0% |
| Extremista DEF | 122 | 122 | 100.0% |
| Extremista ASPD | 420 | 420 | 100.0% |
| Extremista REF | 317 | 317 | 100.0% |
| Velocista | 483 | 483 | 100.0% |
| Berserker | 123 | 123 | 100.0% |
| Guardian | 452 | 452 | 100.0% |
| Estratega | 281 | 281 | 100.0% |
| Gladiador | 318 | 318 | 100.0% |
| Magus | 272 | 272 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 0 | 1278 | 0.0% |
| Asesino | 11 | 648 | 1.7% |
| Esquivo | 384 | 1764 | 21.8% |
| Equilibrado | 36 | 1594 | 2.3% |
| Extremista ATK | 78 | 769 | 10.1% |
| Extremista DEF | 231 | 1213 | 19.0% |
| Extremista ASPD | 50 | 1071 | 4.7% |
| Extremista REF | 683 | 1102 | 62.0% |
| Velocista | 0 | 825 | 0.0% |
| Berserker | 103 | 803 | 12.8% |
| Guardian | 0 | 1492 | 0.0% |
| Estratega | 689 | 1197 | 57.6% |
| Gladiador | 249 | 1045 | 23.8% |
| Magus | 91 | 795 | 11.4% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 15 | 13 | 17 | 12 | 11 | 11 | 11 | 8 | 11 | 15 | 13 | 10 | 17 |
| 5 | 25 | 21 | 17 | 25 | 20 | 19 | 19 | 13 | 14 | 20 | 22 | 17 | 19 | 23 |
| 10 | 29 | 21 | 19 | 28 | 20 | 24 | 19 | 13 | 17 | 20 | 25 | 16 | 20 | 23 |
| 15 | 30 | 21 | 22 | 29 | 21 | 28 | 20 | 13 | 17 | 20 | 26 | 16 | 20 | 23 |
| 20 | 31 | 21 | 24 | 30 | 21 | 30 | 21 | 14 | 17 | 20 | 26 | 17 | 20 | 24 |
| 25 | 30 | 21 | 27 | 31 | 21 | 31 | 21 | 14 | 17 | 20 | 26 | 17 | 20 | 25 |
| 30 | 30 | 21 | 27 | 32 | 21 | 30 | 22 | 15 | 17 | 20 | 26 | 17 | 20 | 25 |
| 40 | 30 | 21 | 27 | 33 | 22 | 30 | 23 | 15 | 17 | 21 | 26 | 18 | 21 | 26 |
| 50 | 29 | 21 | 27 | 35 | 22 | 29 | 24 | 16 | 17 | 21 | 26 | 18 | 21 | 26 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 88.9% | 45.5% | 54.5% | 33.3% | 33.3% | 77.8% | 58.3% | 50.0% | 100.0% | 69.2% | 54.5% | 36.4% | 90.9% |
| Asesino | 11.1% | 50.0% | 25.0% | 20.0% | 57.1% | 20.0% | 18.2% | 20.0% | 16.7% | 44.4% | 41.2% | 50.0% | 37.5% | 42.9% |
| Esquivo | 54.5% | 75.0% | 45.0% | 50.0% | 75.0% | 85.7% | 50.0% | 50.0% | 12.5% | 85.7% | 37.5% | 58.3% | 14.3% | 64.3% |
| Equilibrado | 45.5% | 80.0% | 50.0% | 50.0% | 81.8% | 85.7% | 50.0% | 55.6% | 23.1% | 42.9% | 50.0% | 46.2% | 40.0% | 60.0% |
| Extremista ATK | 66.7% | 42.9% | 25.0% | 18.2% | 50.0% | 0.0% | 33.3% | 50.0% | 75.0% | 46.2% | 41.2% | 25.0% | 55.6% | 38.5% |
| Extremista DEF | 66.7% | 80.0% | 14.3% | 14.3% | 100.0% | 50.0% | 70.0% | 22.2% | 0.0% | 66.7% | 46.2% | 60.0% | 50.0% | 75.0% |
| Extremista ASPD | 22.2% | 81.8% | 50.0% | 50.0% | 66.7% | 30.0% | 50.0% | 54.5% | 30.0% | 30.0% | 15.4% | 50.0% | 33.3% | 72.7% |
| Extremista REF | 41.7% | 80.0% | 50.0% | 44.4% | 50.0% | 77.8% | 45.5% | 50.0% | 66.7% | 71.4% | 25.0% | 60.0% | 75.0% | 87.5% |
| Velocista | 50.0% | 83.3% | 87.5% | 76.9% | 25.0% | 100.0% | 70.0% | 33.3% | 50.0% | 57.1% | 66.7% | 60.0% | 55.6% | 81.8% |
| Berserker | 0.0% | 55.6% | 14.3% | 57.1% | 53.8% | 33.3% | 70.0% | 28.6% | 42.9% | 50.0% | 30.0% | 55.6% | 50.0% | 83.3% |
| Guardian | 30.8% | 58.8% | 62.5% | 50.0% | 58.8% | 53.8% | 84.6% | 75.0% | 33.3% | 70.0% | 50.0% | 62.5% | 54.5% | 33.3% |
| Estratega | 45.5% | 50.0% | 41.7% | 53.8% | 75.0% | 40.0% | 50.0% | 40.0% | 40.0% | 44.4% | 37.5% | 50.0% | 66.7% | 60.0% |
| Gladiador | 63.6% | 62.5% | 85.7% | 60.0% | 44.4% | 50.0% | 66.7% | 25.0% | 44.4% | 50.0% | 45.5% | 33.3% | 50.0% | 60.0% |
| Magus | 9.1% | 57.1% | 35.7% | 40.0% | 61.5% | 25.0% | 27.3% | 12.5% | 18.2% | 16.7% | 66.7% | 40.0% | 40.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.5% | 328 |
| 16-30 | 50.0% | 508 |
| 31-50 | 50.1% | 355 |
| 51-70 | 54.0% | 215 |
| 71-100 | 49.2% | 594 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 33.3% | 15 |
| 16-30 | 36.1% | 424 |
| 31-50 | 46.8% | 780 |
| 51-70 | 59.7% | 290 |
| 71-100 | 61.7% | 491 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.9% | 225 |
| 16-30 | 43.9% | 410 |
| 31-50 | 49.6% | 363 |
| 51-70 | 51.8% | 278 |
| 71-100 | 54.4% | 724 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.5% | 460 |
| 16-30 | 40.3% | 499 |
| 31-50 | 52.3% | 398 |
| 51-70 | 60.5% | 205 |
| 71-100 | 62.8% | 438 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.1% | 809 |
| 16-30 | 42.0% | 559 |
| 31-50 | 46.6% | 307 |
| 51-70 | 74.3% | 148 |
| 71-100 | 78.0% | 177 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.9% | 1623 |
| 16-30 | 36.8% | 220 |
| 31-50 | 50.4% | 133 |
| 51-70 | 33.3% | 18 |
| 71-100 | 33.3% | 6 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 1634 |
| 16-30 | 43.6% | 220 |
| 31-50 | 43.8% | 112 |
| 51-70 | 43.8% | 32 |
| 71-100 | 0.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.9% | 1621 |
| 16-30 | 39.4% | 231 |
| 31-50 | 46.7% | 122 |
| 51-70 | 38.1% | 21 |
| 71-100 | 40.0% | 5 |
