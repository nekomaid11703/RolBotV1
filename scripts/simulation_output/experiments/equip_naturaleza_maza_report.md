# Combat Simulation Report
Generated: 2026-08-05 03:22:32 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 9.3 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 839 (83.9%) |
| Timeouts (draws) | 161 (16.1%) |
| Avg rounds (all) | 9.2 |
| Avg rounds (KO only) | 7.0 |
| Rounds P50 / P90 / Max | 7 / 21 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 171 |
| Avg rounds | 9.3 |
| P50 / P90 | 7 / 21 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 504/1000 |
| Winrate | 50.4% |
| Advantage over 50% | 0.4% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 89 | 137 | 65.0% |  |
| Asesino | 71 | 161 | 44.1% |  |
| Esquivo | 57 | 135 | 42.2% |  |
| Equilibrado | 88 | 163 | 54.0% |  |
| Extremista ATK | 66 | 151 | 43.7% |  |
| Extremista DEF | 91 | 138 | 65.9% | YES |
| Extremista ASPD | 65 | 142 | 45.8% |  |
| Extremista REF | 45 | 130 | 34.6% |  |
| Velocista | 80 | 153 | 52.3% |  |
| Berserker | 70 | 148 | 47.3% |  |
| Guardian | 79 | 130 | 60.8% |  |
| Estratega | 69 | 125 | 55.2% |  |
| Gladiador | 80 | 145 | 55.2% |  |
| Magus | 49 | 142 | 34.5% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.1 | 0 |
| Heal applied | 57.6 | - |
| Rests | 3.9 | 2 |
| Advances | 4.0 | - |
| Retreats | 0.1 | - |
| Battles with item use | 45.5% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 100.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.50 (avg 47.87) |
| ASPD spread (stddev) | 31.14 (avg 53.00) |
| Equipment tier A | 266 (13.3%) |
| Equipment tier B | 400 (20.0%) |
| Equipment tier C | 481 (24.1%) |
| Equipment tier E | 853 (42.6%) |
| Level 100-199 | 519 |
| Level 200-299 | 547 |
| Level 300-399 | 481 |
| Level 400-500 | 453 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 2000 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1149 | 50.1% |
| ligera | 188 | 48.4% |
| media | 197 | 48.7% |
| total | 466 | 50.6% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 40 | 62.5% |
| 3+ | 1960 | 49.7% |
Set bonus active: 49.7% (1960) vs inactive 62.5% (40)

### Amulet
With amulet: 51.5% (796) vs without 48.9% (1204)

### Shield
With shield: 50.6% (1236) vs without 48.8% (764)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 266 | 65.0% |
| B | 400 | 55.3% |
| C | 481 | 48.9% |
| E | 853 | 43.4% |

### Nature by level bracket
- **100-199**: contundente: 519
- **200-299**: contundente: 547
- **300-399**: contundente: 481
- **400-500**: contundente: 453

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 40.4% | 497 | 53.1% | 1503 | -12.7pp |
| d_fulgor | 40.6% | 503 | 53.1% | 1497 | -12.5pp |
| r_fulgor | 40.2% | 510 | 53.3% | 1490 | -13.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 9.4 | 0 | 33 | 3 | 9 | 14 |
| Asesino | 51.5 | 0 | 80 | 46 | 50 | 64 |
| Esquivo | 9.7 | 0 | 32 | 0 | 9 | 17 |
| Equilibrado | 21.2 | 0 | 68 | 4 | 20 | 35 |
| Extremista ATK | 52.3 | 0 | 79 | 48 | 50 | 66 |
| Extremista DEF | 4.4 | 0 | 47 | 0 | 0 | 6 |
| Extremista ASPD | 36.5 | 9 | 78 | 20 | 35 | 50 |
| Extremista REF | 12.9 | 0 | 62 | 7 | 10 | 17 |
| Velocista | 13.3 | 0 | 33 | 9 | 13 | 17 |
| Berserker | 50.2 | 0 | 82 | 47 | 50 | 58 |
| Guardian | 6.9 | 0 | 37 | 0 | 6 | 11 |
| Estratega | 18.5 | 0 | 57 | 11 | 17 | 23 |
| Gladiador | 43.3 | 0 | 79 | 30 | 43 | 53 |
| Magus | 35.2 | 0 | 75 | 19 | 32 | 50 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 209 | 209 | 100.0% |
| Asesino | 269 | 269 | 100.0% |
| Esquivo | 600 | 600 | 100.0% |
| Equilibrado | 690 | 690 | 100.0% |
| Extremista ATK | 46 | 46 | 100.0% |
| Extremista DEF | 141 | 141 | 100.0% |
| Extremista ASPD | 112 | 112 | 100.0% |
| Extremista REF | 117 | 117 | 100.0% |
| Velocista | 354 | 354 | 100.0% |
| Berserker | 48 | 48 | 100.0% |
| Guardian | 304 | 304 | 100.0% |
| Estratega | 150 | 150 | 100.0% |
| Gladiador | 165 | 165 | 100.0% |
| Magus | 249 | 249 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 46 | 1257 | 3.7% |
| Asesino | 7 | 687 | 1.0% |
| Esquivo | 271 | 1006 | 26.9% |
| Equilibrado | 105 | 1331 | 7.9% |
| Extremista ATK | 104 | 658 | 15.8% |
| Extremista DEF | 235 | 913 | 25.7% |
| Extremista ASPD | 108 | 684 | 15.8% |
| Extremista REF | 619 | 863 | 71.7% |
| Velocista | 0 | 887 | 0.0% |
| Berserker | 90 | 804 | 11.2% |
| Guardian | 2 | 1002 | 0.2% |
| Estratega | 450 | 755 | 59.6% |
| Gladiador | 149 | 653 | 22.8% |
| Magus | 92 | 746 | 12.3% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 14 | 15 | 19 | 11 | 10 | 10 | 12 | 8 | 10 | 14 | 13 | 9 | 16 |
| 5 | 25 | 21 | 19 | 25 | 19 | 19 | 18 | 16 | 15 | 17 | 23 | 17 | 19 | 22 |
| 10 | 29 | 22 | 22 | 28 | 18 | 24 | 17 | 15 | 18 | 18 | 26 | 16 | 19 | 22 |
| 15 | 31 | 22 | 24 | 28 | 18 | 28 | 17 | 14 | 18 | 18 | 28 | 16 | 20 | 23 |
| 20 | 31 | 22 | 27 | 29 | 18 | 30 | 18 | 14 | 18 | 18 | 29 | 17 | 20 | 23 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 76.5% | 63.6% | 50.0% | 83.3% | 40.0% | 100.0% | 71.4% | 71.4% | 57.1% | 62.5% | 78.6% | 28.6% | 69.2% |
| Asesino | 23.5% | 50.0% | 66.7% | 44.4% | 46.7% | 20.0% | 54.5% | 84.6% | 38.5% | 30.0% | 30.8% | 45.5% | 14.3% | 56.3% |
| Esquivo | 36.4% | 33.3% | 50.0% | 35.3% | 69.2% | 12.5% | 20.0% | 75.0% | 60.0% | 66.7% | 0.0% | 16.7% | 57.1% | 25.0% |
| Equilibrado | 50.0% | 55.6% | 64.7% | 50.0% | 75.0% | 31.3% | 66.7% | 87.5% | 16.7% | 63.6% | 38.5% | 50.0% | 73.3% | 44.4% |
| Extremista ATK | 16.7% | 53.3% | 30.8% | 25.0% | 50.0% | 16.7% | 50.0% | 66.7% | 37.5% | 37.5% | 42.9% | 36.4% | 30.0% | 90.9% |
| Extremista DEF | 60.0% | 80.0% | 87.5% | 68.8% | 83.3% | 50.0% | 72.7% | 81.8% | 57.1% | 54.5% | 57.1% | 80.0% | 36.4% | 69.2% |
| Extremista ASPD | 0.0% | 45.5% | 80.0% | 33.3% | 50.0% | 27.3% | 50.0% | 46.2% | 33.3% | 33.3% | 60.0% | 30.0% | 53.3% | 63.6% |
| Extremista REF | 28.6% | 15.4% | 25.0% | 12.5% | 33.3% | 18.2% | 53.8% | 50.0% | 50.0% | 35.7% | 14.3% | 44.4% | 50.0% | 45.5% |
| Velocista | 28.6% | 61.5% | 40.0% | 83.3% | 62.5% | 42.9% | 66.7% | 50.0% | 50.0% | 57.9% | 11.1% | 42.9% | 50.0% | 81.8% |
| Berserker | 42.9% | 70.0% | 33.3% | 36.4% | 62.5% | 45.5% | 66.7% | 64.3% | 42.1% | 50.0% | 46.7% | 14.3% | 30.8% | 60.0% |
| Guardian | 37.5% | 69.2% | 100.0% | 61.5% | 57.1% | 42.9% | 40.0% | 85.7% | 88.9% | 53.3% | 50.0% | 60.0% | 37.5% | 85.7% |
| Estratega | 21.4% | 54.5% | 83.3% | 50.0% | 63.6% | 20.0% | 70.0% | 55.6% | 57.1% | 85.7% | 40.0% | 50.0% | 42.9% | 81.8% |
| Gladiador | 71.4% | 85.7% | 42.9% | 26.7% | 70.0% | 63.6% | 46.7% | 50.0% | 50.0% | 69.2% | 62.5% | 57.1% | 50.0% | 55.6% |
| Magus | 30.8% | 43.8% | 75.0% | 55.6% | 9.1% | 23.1% | 36.4% | 54.5% | 18.2% | 40.0% | 14.3% | 18.2% | 44.4% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.3% | 335 |
| 16-30 | 51.5% | 528 |
| 31-50 | 51.6% | 335 |
| 51-70 | 54.7% | 212 |
| 71-100 | 51.4% | 590 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 18.2% | 11 |
| 16-30 | 35.7% | 437 |
| 31-50 | 44.3% | 785 |
| 51-70 | 58.7% | 310 |
| 71-100 | 68.1% | 457 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.8% | 248 |
| 16-30 | 44.5% | 409 |
| 31-50 | 52.0% | 379 |
| 51-70 | 49.3% | 268 |
| 71-100 | 52.7% | 696 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.5% | 485 |
| 16-30 | 42.7% | 490 |
| 31-50 | 52.5% | 406 |
| 51-70 | 63.0% | 208 |
| 71-100 | 56.0% | 411 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.8% | 827 |
| 16-30 | 43.1% | 538 |
| 31-50 | 47.9% | 311 |
| 51-70 | 75.9% | 137 |
| 71-100 | 72.2% | 187 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.3% | 1613 |
| 16-30 | 44.2% | 242 |
| 31-50 | 36.4% | 107 |
| 51-70 | 25.0% | 36 |
| 71-100 | 50.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1610 |
| 16-30 | 45.3% | 243 |
| 31-50 | 31.7% | 104 |
| 51-70 | 27.5% | 40 |
| 71-100 | 66.7% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.0% | 1610 |
| 16-30 | 45.4% | 249 |
| 31-50 | 37.5% | 104 |
| 51-70 | 25.7% | 35 |
| 71-100 | 0.0% | 2 |
