# Combat Simulation Report
Generated: 2026-08-05 03:22:00 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 8.4 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 872 (87.2%) |
| Timeouts (draws) | 128 (12.8%) |
| Avg rounds (all) | 7.8 |
| Avg rounds (KO only) | 5.8 |
| Rounds P50 / P90 / Max | 5 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 143 |
| Avg rounds | 8.4 |
| P50 / P90 | 6 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 531/1000 |
| Winrate | 53.1% |
| Advantage over 50% | 3.1% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 106 | 166 | 63.9% | YES |
| Asesino | 59 | 140 | 42.1% |  |
| Esquivo | 71 | 157 | 45.2% |  |
| Equilibrado | 91 | 165 | 55.2% |  |
| Extremista ATK | 61 | 126 | 48.4% |  |
| Extremista DEF | 92 | 152 | 60.5% |  |
| Extremista ASPD | 60 | 143 | 42.0% |  |
| Extremista REF | 51 | 133 | 38.3% |  |
| Velocista | 86 | 141 | 61.0% |  |
| Berserker | 49 | 117 | 41.9% |  |
| Guardian | 87 | 152 | 57.2% |  |
| Estratega | 77 | 142 | 54.2% |  |
| Gladiador | 61 | 128 | 47.7% |  |
| Magus | 49 | 138 | 35.5% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.1 | 0 |
| Heal applied | 55.3 | - |
| Rests | 3.0 | 1 |
| Advances | 3.6 | - |
| Retreats | 0.1 | - |
| Battles with item use | 43.3% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.5% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.46 (avg 42.50) |
| ASPD spread (stddev) | 31.48 (avg 53.11) |
| Equipment tier A | 243 (12.2%) |
| Equipment tier B | 425 (21.3%) |
| Equipment tier C | 518 (25.9%) |
| Equipment tier E | 814 (40.7%) |
| Level 100-199 | 501 |
| Level 200-299 | 537 |
| Level 300-399 | 511 |
| Level 400-500 | 451 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 585 |
| cortante | 608 |
| desarmado | 211 |
| perforante | 596 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1093 | 51.0% |
| ligera | 201 | 41.3% |
| media | 199 | 49.7% |
| total | 507 | 51.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 52 | 55.8% |
| 3+ | 1948 | 49.8% |
Set bonus active: 49.8% (1948) vs inactive 55.8% (52)

### Amulet
With amulet: 0.0% (0) vs without 50.0% (2000)

### Shield
With shield: 50.6% (1169) vs without 49.1% (831)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 217 | 73.7% |
| B | 387 | 58.7% |
| C | 463 | 50.5% |
| E | 722 | 41.8% |
| desarmado | 211 | 36.5% |

### Nature by level bracket
- **100-199**: contundente: 157, cortante: 153, desarmado: 56, perforante: 135
- **200-299**: contundente: 154, cortante: 161, desarmado: 58, perforante: 164
- **300-399**: contundente: 132, cortante: 163, desarmado: 57, perforante: 159
- **400-500**: contundente: 142, cortante: 131, desarmado: 40, perforante: 138

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 38.2% | 510 | 54.0% | 1490 | -15.8pp |
| d_fulgor | 38.8% | 498 | 53.7% | 1502 | -15.0pp |
| r_fulgor | 38.2% | 511 | 54.1% | 1489 | -15.9pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 16.4 | 0 | 128 | 0 | 8 | 23 |
| Asesino | 58.8 | 0 | 128 | 40 | 56 | 78 |
| Esquivo | 14.9 | 0 | 128 | 0 | 9 | 19 |
| Equilibrado | 26.8 | 0 | 128 | 0 | 20 | 36 |
| Extremista ATK | 52.5 | 0 | 128 | 22 | 55 | 74 |
| Extremista DEF | 8.6 | 0 | 128 | 0 | 0 | 8 |
| Extremista ASPD | 47.4 | 6 | 128 | 19 | 45 | 65 |
| Extremista REF | 23.2 | 0 | 128 | 8 | 16 | 34 |
| Velocista | 17.5 | 0 | 128 | 6 | 13 | 20 |
| Berserker | 50.5 | 19 | 128 | 32 | 49 | 68 |
| Guardian | 11.5 | 0 | 128 | 0 | 3 | 19 |
| Estratega | 28.4 | 0 | 128 | 14 | 20 | 37 |
| Gladiador | 46.8 | 0 | 128 | 26 | 45 | 57 |
| Magus | 36.7 | 8 | 128 | 19 | 30 | 46 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 111 | 111 | 100.0% |
| Asesino | 75 | 75 | 100.0% |
| Esquivo | 684 | 684 | 100.0% |
| Equilibrado | 536 | 536 | 100.0% |
| Extremista ATK | 26 | 26 | 100.0% |
| Extremista DEF | 238 | 238 | 100.0% |
| Extremista ASPD | 168 | 168 | 100.0% |
| Extremista REF | 152 | 152 | 100.0% |
| Velocista | 242 | 242 | 100.0% |
| Berserker | 111 | 111 | 100.0% |
| Guardian | 313 | 313 | 100.0% |
| Estratega | 126 | 126 | 100.0% |
| Gladiador | 48 | 48 | 100.0% |
| Magus | 151 | 151 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 14 | 874 | 1.6% |
| Asesino | 3 | 334 | 0.9% |
| Esquivo | 200 | 1023 | 19.6% |
| Equilibrado | 14 | 1029 | 1.4% |
| Extremista ATK | 69 | 454 | 15.2% |
| Extremista DEF | 240 | 997 | 24.1% |
| Extremista ASPD | 58 | 602 | 9.6% |
| Extremista REF | 496 | 712 | 69.7% |
| Velocista | 0 | 530 | 0.0% |
| Berserker | 103 | 525 | 19.6% |
| Guardian | 1 | 991 | 0.1% |
| Estratega | 438 | 708 | 61.9% |
| Gladiador | 156 | 465 | 33.5% |
| Magus | 141 | 621 | 22.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 14 | 14 | 13 | 18 | 13 | 11 | 10 | 9 | 6 | 12 | 13 | 15 | 9 | 16 |
| 5 | 23 | 20 | 17 | 23 | 20 | 19 | 16 | 12 | 11 | 19 | 22 | 17 | 17 | 21 |
| 10 | 26 | 21 | 19 | 25 | 20 | 23 | 16 | 12 | 14 | 19 | 24 | 17 | 16 | 21 |
| 15 | 28 | 21 | 20 | 25 | 20 | 27 | 17 | 12 | 17 | 20 | 27 | 17 | 16 | 21 |
| 20 | 28 | 21 | 22 | 26 | 20 | 28 | 17 | 13 | 16 | 20 | 29 | 18 | 17 | 21 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 44.4% | 70.0% | 66.7% | 90.0% | 70.0% | 100.0% | 75.0% | 61.1% | 60.0% | 28.6% | 38.9% | 70.0% | 70.0% |
| Asesino | 55.6% | 50.0% | 42.9% | 16.7% | 25.0% | 42.9% | 55.6% | 62.5% | 10.0% | 57.1% | 22.2% | 71.4% | 40.0% | 45.5% |
| Esquivo | 30.0% | 57.1% | 50.0% | 50.0% | 62.5% | 36.4% | 66.7% | 58.8% | 7.7% | 33.3% | 37.5% | 44.4% | 44.4% | 50.0% |
| Equilibrado | 33.3% | 83.3% | 50.0% | 50.0% | 65.0% | 46.7% | 42.9% | 61.5% | 50.0% | 85.7% | 72.7% | 38.5% | 33.3% | 66.7% |
| Extremista ATK | 10.0% | 75.0% | 37.5% | 35.0% | 50.0% | 20.0% | 66.7% | 58.3% | 42.9% | 70.0% | 25.0% | 71.4% | 57.1% | 75.0% |
| Extremista DEF | 30.0% | 57.1% | 63.6% | 53.3% | 80.0% | 50.0% | 55.6% | 93.3% | 30.0% | 90.9% | 35.7% | 71.4% | 61.5% | 81.8% |
| Extremista ASPD | 0.0% | 44.4% | 33.3% | 57.1% | 33.3% | 44.4% | 50.0% | 37.5% | 45.5% | 54.5% | 30.0% | 50.0% | 44.4% | 70.0% |
| Extremista REF | 25.0% | 37.5% | 41.2% | 38.5% | 41.7% | 6.7% | 62.5% | 50.0% | 16.7% | 46.2% | 22.2% | 100.0% | 37.5% | 100.0% |
| Velocista | 38.9% | 90.0% | 92.3% | 50.0% | 57.1% | 70.0% | 54.5% | 83.3% | 50.0% | 62.5% | 46.2% | 40.0% | 77.8% | 53.8% |
| Berserker | 40.0% | 42.9% | 66.7% | 14.3% | 30.0% | 9.1% | 45.5% | 53.8% | 37.5% | 50.0% | 33.3% | 33.3% | 66.7% | 87.5% |
| Guardian | 71.4% | 77.8% | 62.5% | 27.3% | 75.0% | 64.3% | 70.0% | 77.8% | 53.8% | 66.7% | 50.0% | 41.7% | 36.4% | 50.0% |
| Estratega | 61.1% | 28.6% | 55.6% | 61.5% | 28.6% | 28.6% | 50.0% | 0.0% | 60.0% | 66.7% | 58.3% | 50.0% | 76.9% | 64.7% |
| Gladiador | 30.0% | 60.0% | 55.6% | 66.7% | 42.9% | 38.5% | 55.6% | 62.5% | 22.2% | 33.3% | 63.6% | 23.1% | 50.0% | 83.3% |
| Magus | 30.0% | 54.5% | 50.0% | 33.3% | 25.0% | 18.2% | 30.0% | 0.0% | 46.2% | 12.5% | 50.0% | 35.3% | 16.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.3% | 542 |
| 16-30 | 52.2% | 446 |
| 31-50 | 51.5% | 332 |
| 51-70 | 51.1% | 178 |
| 71-100 | 50.6% | 502 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 33.3% | 9 |
| 16-30 | 35.0% | 391 |
| 31-50 | 45.9% | 750 |
| 51-70 | 55.2% | 308 |
| 71-100 | 63.8% | 542 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.3% | 245 |
| 16-30 | 45.9% | 416 |
| 31-50 | 51.2% | 375 |
| 51-70 | 45.4% | 240 |
| 71-100 | 54.1% | 724 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.6% | 473 |
| 16-30 | 46.8% | 468 |
| 31-50 | 49.2% | 362 |
| 51-70 | 64.5% | 228 |
| 71-100 | 55.2% | 469 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.5% | 760 |
| 16-30 | 43.1% | 564 |
| 31-50 | 50.6% | 344 |
| 51-70 | 72.2% | 144 |
| 71-100 | 75.0% | 188 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.8% | 1593 |
| 16-30 | 40.8% | 255 |
| 31-50 | 33.9% | 121 |
| 51-70 | 46.4% | 28 |
| 71-100 | 33.3% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.9% | 1594 |
| 16-30 | 39.9% | 258 |
| 31-50 | 35.7% | 112 |
| 51-70 | 36.4% | 33 |
| 71-100 | 33.3% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.6% | 1593 |
| 16-30 | 43.4% | 242 |
| 31-50 | 30.5% | 131 |
| 51-70 | 50.0% | 34 |
| 71-100 | 0.0% | 0 |
