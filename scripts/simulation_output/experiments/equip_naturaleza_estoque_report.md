# Combat Simulation Report
Generated: 2026-08-05 03:22:30 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.7 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 967 (96.7%) |
| Timeouts (draws) | 33 (3.3%) |
| Avg rounds (all) | 5.6 |
| Avg rounds (KO only) | 5.1 |
| Rounds P50 / P90 / Max | 4 / 11 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 157 |
| Avg rounds | 5.7 |
| P50 / P90 | 4 / 11 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 479/1000 |
| Winrate | 47.9% |
| Advantage over 50% | -2.1% |
| Draws | 1 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 85 | 135 | 63.0% |  |
| Asesino | 59 | 142 | 41.5% |  |
| Esquivo | 85 | 156 | 54.5% |  |
| Equilibrado | 73 | 135 | 54.1% |  |
| Extremista ATK | 52 | 162 | 32.1% |  |
| Extremista DEF | 81 | 137 | 59.1% |  |
| Extremista ASPD | 54 | 143 | 37.8% |  |
| Extremista REF | 68 | 140 | 48.6% |  |
| Velocista | 92 | 134 | 68.7% | YES |
| Berserker | 53 | 153 | 34.6% |  |
| Guardian | 86 | 129 | 66.7% |  |
| Estratega | 67 | 131 | 51.1% |  |
| Gladiador | 83 | 160 | 51.9% |  |
| Magus | 61 | 143 | 42.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.9 | 0 |
| Heal applied | 47.4 | - |
| Rests | 2.2 | 1 |
| Advances | 3.5 | - |
| Retreats | 0.1 | - |
| Battles with item use | 38.4% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 100.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.65 (avg 49.65) |
| ASPD spread (stddev) | 31.07 (avg 54.61) |
| Equipment tier A | 269 (13.5%) |
| Equipment tier B | 405 (20.3%) |
| Equipment tier C | 513 (25.7%) |
| Equipment tier E | 813 (40.6%) |
| Level 100-199 | 459 |
| Level 200-299 | 573 |
| Level 300-399 | 489 |
| Level 400-500 | 479 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| perforante | 2000 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1078 | 51.5% |
| ligera | 204 | 41.2% |
| media | 206 | 48.1% |
| total | 512 | 51.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 54 | 53.7% |
| 3+ | 1946 | 49.8% |
Set bonus active: 49.8% (1946) vs inactive 53.7% (54)

### Amulet
With amulet: 49.9% (783) vs without 50.0% (1217)

### Shield
With shield: 51.6% (1193) vs without 47.6% (807)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 269 | 70.6% |
| B | 405 | 56.8% |
| C | 513 | 49.3% |
| E | 813 | 40.1% |

### Nature by level bracket
- **100-199**: perforante: 459
- **200-299**: perforante: 573
- **300-399**: perforante: 489
- **400-500**: perforante: 479

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 45.4% | 463 | 51.3% | 1537 | -6.0pp |
| d_fulgor | 45.2% | 460 | 51.4% | 1540 | -6.1pp |
| r_fulgor | 44.7% | 463 | 51.5% | 1537 | -6.8pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 32.4 | 0 | 128 | 14 | 19 | 46 |
| Asesino | 59.4 | 0 | 128 | 19 | 46 | 84 |
| Esquivo | 31.8 | 0 | 128 | 0 | 19 | 46 |
| Equilibrado | 36.9 | 0 | 128 | 19 | 19 | 46 |
| Extremista ATK | 43.3 | 0 | 128 | 19 | 46 | 46 |
| Extremista DEF | 15.1 | 0 | 128 | 0 | 0 | 19 |
| Extremista ASPD | 52.5 | 14 | 128 | 19 | 46 | 84 |
| Extremista REF | 38.2 | 0 | 128 | 19 | 19 | 46 |
| Velocista | 39.2 | 0 | 128 | 19 | 19 | 46 |
| Berserker | 57.0 | 19 | 128 | 19 | 46 | 84 |
| Guardian | 25.0 | 0 | 128 | 0 | 14 | 46 |
| Estratega | 37.2 | 14 | 128 | 19 | 19 | 46 |
| Gladiador | 41.5 | 0 | 128 | 19 | 19 | 46 |
| Magus | 52.8 | 14 | 128 | 19 | 46 | 84 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 42 | 42 | 100.0% |
| Asesino | 27 | 27 | 100.0% |
| Esquivo | 347 | 347 | 100.0% |
| Equilibrado | 149 | 149 | 100.0% |
| Extremista ATK | 22 | 22 | 100.0% |
| Extremista DEF | 45 | 45 | 100.0% |
| Extremista ASPD | 30 | 30 | 100.0% |
| Extremista REF | 47 | 47 | 100.0% |
| Velocista | 19 | 19 | 100.0% |
| Berserker | 23 | 23 | 100.0% |
| Guardian | 118 | 118 | 100.0% |
| Estratega | 158 | 158 | 100.0% |
| Gladiador | 135 | 135 | 100.0% |
| Magus | 78 | 78 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 0 | 474 | 0.0% |
| Asesino | 9 | 288 | 3.1% |
| Esquivo | 88 | 528 | 16.7% |
| Equilibrado | 28 | 434 | 6.5% |
| Extremista ATK | 35 | 469 | 7.5% |
| Extremista DEF | 144 | 501 | 28.7% |
| Extremista ASPD | 13 | 396 | 3.3% |
| Extremista REF | 294 | 482 | 61.0% |
| Velocista | 0 | 142 | 0.0% |
| Berserker | 30 | 420 | 7.1% |
| Guardian | 0 | 493 | 0.0% |
| Estratega | 181 | 481 | 37.6% |
| Gladiador | 155 | 514 | 30.2% |
| Magus | 49 | 404 | 12.1% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 13 | 12 | 17 | 10 | 10 | 10 | 11 | 7 | 12 | 16 | 18 | 9 | 17 |
| 5 | 22 | 19 | 15 | 21 | 18 | 18 | 17 | 15 | 12 | 19 | 22 | 21 | 17 | 22 |
| 10 | 24 | 19 | 16 | 22 | 19 | 21 | 17 | 14 | 12 | 19 | 23 | 21 | 17 | 22 |
| 15 | 24 | 19 | 17 | 22 | 19 | 23 | 17 | 14 | 12 | 19 | 24 | 22 | 18 | 22 |
| 20 | 24 | 19 | 17 | 23 | 19 | 23 | 17 | 14 | 12 | 19 | 24 | 22 | 18 | 22 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 75.0% | 36.4% | 77.8% | 80.0% | 47.1% | 90.0% | 55.6% | 57.1% | 83.3% | 33.3% | 50.0% | 66.7% | 57.1% |
| Asesino | 25.0% | 50.0% | 70.0% | 20.0% | 50.0% | 37.5% | 46.2% | 41.7% | 28.6% | 53.8% | 12.5% | 40.0% | 33.3% | 53.8% |
| Esquivo | 63.6% | 30.0% | 50.0% | 61.5% | 50.0% | 54.5% | 58.3% | 81.8% | 42.9% | 50.0% | 40.0% | 62.5% | 57.1% | 56.3% |
| Equilibrado | 22.2% | 80.0% | 38.5% | 50.0% | 87.5% | 60.0% | 75.0% | 62.5% | 36.4% | 83.3% | 14.3% | 66.7% | 45.0% | 63.6% |
| Extremista ATK | 20.0% | 50.0% | 50.0% | 12.5% | 50.0% | 0.0% | 16.7% | 28.6% | 8.3% | 53.8% | 15.4% | 38.1% | 27.3% | 50.0% |
| Extremista DEF | 52.9% | 62.5% | 45.5% | 40.0% | 100.0% | 50.0% | 92.3% | 75.0% | 30.8% | 100.0% | 50.0% | 60.0% | 66.7% | 28.6% |
| Extremista ASPD | 10.0% | 53.8% | 41.7% | 25.0% | 83.3% | 7.7% | 50.0% | 40.0% | 11.1% | 50.0% | 14.3% | 14.3% | 50.0% | 66.7% |
| Extremista REF | 44.4% | 58.3% | 18.2% | 37.5% | 71.4% | 25.0% | 60.0% | 50.0% | 60.0% | 88.9% | 40.0% | 40.0% | 43.8% | 50.0% |
| Velocista | 42.9% | 71.4% | 57.1% | 63.6% | 91.7% | 69.2% | 88.9% | 40.0% | 50.0% | 55.6% | 100.0% | 70.0% | 76.9% | 90.0% |
| Berserker | 16.7% | 46.2% | 50.0% | 16.7% | 46.2% | 0.0% | 50.0% | 11.1% | 44.4% | 50.0% | 11.1% | 40.0% | 36.4% | 33.3% |
| Guardian | 66.7% | 87.5% | 60.0% | 85.7% | 84.6% | 50.0% | 85.7% | 60.0% | 0.0% | 88.9% | 50.0% | 42.9% | 54.5% | 77.8% |
| Estratega | 50.0% | 60.0% | 37.5% | 33.3% | 61.9% | 20.0% | 85.7% | 60.0% | 30.0% | 60.0% | 57.1% | 50.0% | 38.5% | 60.0% |
| Gladiador | 33.3% | 66.7% | 42.9% | 55.0% | 72.7% | 33.3% | 50.0% | 56.3% | 23.1% | 63.6% | 45.5% | 61.5% | 50.0% | 60.0% |
| Magus | 42.9% | 46.2% | 43.8% | 36.4% | 50.0% | 71.4% | 33.3% | 50.0% | 10.0% | 66.7% | 22.2% | 40.0% | 40.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.9% | 291 |
| 16-30 | 54.7% | 521 |
| 31-50 | 57.5% | 351 |
| 51-70 | 46.4% | 209 |
| 71-100 | 42.5% | 628 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.0% | 15 |
| 16-30 | 35.9% | 437 |
| 31-50 | 44.8% | 732 |
| 51-70 | 57.3% | 335 |
| 71-100 | 65.7% | 481 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.6% | 235 |
| 16-30 | 43.9% | 369 |
| 31-50 | 50.0% | 388 |
| 51-70 | 53.3% | 287 |
| 71-100 | 51.5% | 721 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.1% | 455 |
| 16-30 | 43.6% | 486 |
| 31-50 | 53.1% | 337 |
| 51-70 | 54.5% | 253 |
| 71-100 | 60.3% | 469 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.2% | 791 |
| 16-30 | 44.7% | 568 |
| 31-50 | 44.9% | 321 |
| 51-70 | 75.4% | 138 |
| 71-100 | 85.2% | 182 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.2% | 1627 |
| 16-30 | 43.7% | 229 |
| 31-50 | 48.2% | 114 |
| 51-70 | 36.0% | 25 |
| 71-100 | 40.0% | 5 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.2% | 1636 |
| 16-30 | 44.5% | 220 |
| 31-50 | 43.9% | 114 |
| 51-70 | 46.4% | 28 |
| 71-100 | 50.0% | 2 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 1623 |
| 16-30 | 46.4% | 235 |
| 31-50 | 41.6% | 113 |
| 51-70 | 51.9% | 27 |
| 71-100 | 50.0% | 2 |
