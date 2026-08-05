# Combat Simulation Report
Generated: 2026-08-05 03:22:05 | 1000 simulations | Max 20 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 7.0 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 910 (91.0%) |
| Timeouts (draws) | 90 (9.0%) |
| Avg rounds (all) | 6.9 |
| Avg rounds (KO only) | 5.5 |
| Rounds P50 / P90 / Max | 5 / 18 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 154 |
| Avg rounds | 7.0 |
| P50 / P90 | 5 / 19 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 492/1000 |
| Winrate | 49.2% |
| Advantage over 50% | -0.8% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 111 | 155 | 71.6% | YES |
| Asesino | 46 | 136 | 33.8% |  |
| Esquivo | 66 | 143 | 46.2% |  |
| Equilibrado | 84 | 142 | 59.2% |  |
| Extremista ATK | 53 | 131 | 40.5% |  |
| Extremista DEF | 91 | 145 | 62.8% |  |
| Extremista ASPD | 66 | 147 | 44.9% |  |
| Extremista REF | 51 | 142 | 35.9% |  |
| Velocista | 88 | 159 | 55.3% |  |
| Berserker | 63 | 147 | 42.9% |  |
| Guardian | 103 | 157 | 65.6% |  |
| Estratega | 66 | 135 | 48.9% |  |
| Gladiador | 75 | 135 | 55.6% |  |
| Magus | 37 | 126 | 29.4% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.0 | 0 |
| Heal applied | 57.6 | - |
| Rests | 2.8 | 1 |
| Advances | 3.6 | - |
| Retreats | 0.1 | - |
| Battles with item use | 40.8% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 30.61 (avg 51.56) |
| ASPD spread (stddev) | 31.46 (avg 53.08) |
| Equipment tier A | 248 (12.4%) |
| Equipment tier B | 450 (22.5%) |
| Equipment tier C | 495 (24.8%) |
| Equipment tier E | 807 (40.4%) |
| Level 100-199 | 459 |
| Level 200-299 | 553 |
| Level 300-399 | 482 |
| Level 400-500 | 506 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 579 |
| cortante | 617 |
| desarmado | 201 |
| perforante | 603 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1106 | 50.5% |
| ligera | 174 | 47.7% |
| media | 194 | 45.4% |
| total | 526 | 51.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 62 | 48.4% |
| 3+ | 1938 | 50.1% |
Set bonus active: 50.1% (1938) vs inactive 48.4% (62)

### Amulet
With amulet: 50.0% (2000) vs without 0.0% (0)

### Shield
With shield: 50.9% (1228) vs without 48.6% (772)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 224 | 65.2% |
| B | 403 | 62.0% |
| C | 453 | 46.4% |
| E | 719 | 43.7% |
| desarmado | 201 | 39.8% |

### Nature by level bracket
- **100-199**: contundente: 139, cortante: 135, desarmado: 52, perforante: 133
- **200-299**: contundente: 164, cortante: 182, desarmado: 53, perforante: 154
- **300-399**: contundente: 141, cortante: 142, desarmado: 44, perforante: 155
- **400-500**: contundente: 135, cortante: 158, desarmado: 52, perforante: 161

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 42.0% | 476 | 52.5% | 1524 | -10.5pp |
| d_fulgor | 42.2% | 472 | 52.4% | 1528 | -10.3pp |
| r_fulgor | 40.7% | 464 | 52.8% | 1536 | -12.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 21.4 | 0 | 128 | 9 | 15 | 31 |
| Asesino | 58.8 | 0 | 128 | 39 | 52 | 84 |
| Esquivo | 16.9 | 0 | 128 | 0 | 14 | 24 |
| Equilibrado | 34.7 | 0 | 128 | 14 | 34 | 49 |
| Extremista ATK | 59.8 | 0 | 128 | 47 | 65 | 80 |
| Extremista DEF | 8.1 | 0 | 128 | 0 | 0 | 12 |
| Extremista ASPD | 54.2 | 11 | 128 | 22 | 46 | 78 |
| Extremista REF | 30.0 | 0 | 128 | 15 | 19 | 36 |
| Velocista | 27.3 | 0 | 128 | 15 | 19 | 31 |
| Berserker | 63.0 | 0 | 128 | 46 | 62 | 84 |
| Guardian | 14.5 | 0 | 128 | 0 | 9 | 20 |
| Estratega | 32.5 | 0 | 128 | 19 | 26 | 44 |
| Gladiador | 51.3 | 0 | 128 | 38 | 49 | 68 |
| Magus | 50.0 | 14 | 128 | 32 | 46 | 62 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 164 | 164 | 100.0% |
| Asesino | 79 | 79 | 100.0% |
| Esquivo | 587 | 587 | 100.0% |
| Equilibrado | 315 | 315 | 100.0% |
| Extremista ATK | 75 | 75 | 100.0% |
| Extremista DEF | 85 | 85 | 100.0% |
| Extremista ASPD | 103 | 103 | 100.0% |
| Extremista REF | 54 | 54 | 100.0% |
| Velocista | 271 | 271 | 100.0% |
| Berserker | 64 | 64 | 100.0% |
| Guardian | 195 | 195 | 100.0% |
| Estratega | 305 | 305 | 100.0% |
| Gladiador | 118 | 118 | 100.0% |
| Magus | 190 | 190 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 12 | 695 | 1.7% |
| Asesino | 3 | 324 | 0.9% |
| Esquivo | 124 | 804 | 15.4% |
| Equilibrado | 11 | 625 | 1.8% |
| Extremista ATK | 61 | 464 | 13.1% |
| Extremista DEF | 196 | 796 | 24.6% |
| Extremista ASPD | 89 | 526 | 16.9% |
| Extremista REF | 406 | 578 | 70.2% |
| Velocista | 0 | 476 | 0.0% |
| Berserker | 56 | 467 | 12.0% |
| Guardian | 8 | 864 | 0.9% |
| Estratega | 327 | 782 | 41.8% |
| Gladiador | 205 | 497 | 41.2% |
| Magus | 86 | 507 | 17.0% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 14 | 15 | 17 | 17 | 11 | 11 | 10 | 12 | 7 | 11 | 13 | 14 | 11 | 20 |
| 5 | 24 | 19 | 21 | 23 | 18 | 20 | 16 | 15 | 13 | 17 | 21 | 18 | 18 | 24 |
| 10 | 27 | 19 | 25 | 25 | 19 | 23 | 16 | 14 | 14 | 17 | 25 | 17 | 18 | 23 |
| 15 | 28 | 20 | 27 | 25 | 19 | 26 | 16 | 14 | 14 | 18 | 27 | 17 | 19 | 24 |
| 20 | 28 | 20 | 28 | 26 | 20 | 27 | 16 | 14 | 14 | 18 | 29 | 17 | 20 | 24 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 92.3% | 72.7% | 75.0% | 75.0% | 45.5% | 90.0% | 77.8% | 75.0% | 89.5% | 38.5% | 66.7% | 55.6% | 100.0% |
| Asesino | 7.7% | 50.0% | 57.1% | 36.4% | 14.3% | 0.0% | 75.0% | 45.5% | 0.0% | 33.3% | 33.3% | 30.8% | 44.4% | 66.7% |
| Esquivo | 27.3% | 42.9% | 50.0% | 33.3% | 50.0% | 25.0% | 54.5% | 58.3% | 54.5% | 55.6% | 36.4% | 50.0% | 45.5% | 71.4% |
| Equilibrado | 25.0% | 63.6% | 66.7% | 50.0% | 90.0% | 54.5% | 87.5% | 71.4% | 25.0% | 75.0% | 50.0% | 100.0% | 45.5% | 58.3% |
| Extremista ATK | 25.0% | 85.7% | 50.0% | 10.0% | 50.0% | 30.8% | 50.0% | 80.0% | 26.7% | 58.3% | 30.0% | 0.0% | 22.2% | 57.1% |
| Extremista DEF | 54.5% | 100.0% | 75.0% | 45.5% | 69.2% | 50.0% | 60.0% | 100.0% | 66.7% | 55.6% | 33.3% | 60.0% | 50.0% | 80.0% |
| Extremista ASPD | 10.0% | 25.0% | 45.5% | 12.5% | 50.0% | 40.0% | 50.0% | 62.5% | 69.2% | 53.8% | 25.0% | 30.0% | 71.4% | 60.0% |
| Extremista REF | 22.2% | 54.5% | 41.7% | 28.6% | 20.0% | 0.0% | 37.5% | 50.0% | 41.2% | 46.2% | 0.0% | 33.3% | 40.0% | 66.7% |
| Velocista | 25.0% | 100.0% | 45.5% | 75.0% | 73.3% | 33.3% | 30.8% | 58.8% | 50.0% | 85.7% | 44.4% | 46.2% | 28.6% | 83.3% |
| Berserker | 10.5% | 66.7% | 44.4% | 25.0% | 41.7% | 44.4% | 46.2% | 53.8% | 14.3% | 50.0% | 27.3% | 50.0% | 57.1% | 87.5% |
| Guardian | 61.5% | 66.7% | 63.6% | 50.0% | 70.0% | 66.7% | 75.0% | 100.0% | 55.6% | 72.7% | 50.0% | 84.6% | 46.7% | 66.7% |
| Estratega | 33.3% | 69.2% | 50.0% | 0.0% | 100.0% | 40.0% | 70.0% | 66.7% | 53.8% | 50.0% | 15.4% | 50.0% | 42.9% | 55.6% |
| Gladiador | 44.4% | 55.6% | 54.5% | 54.5% | 77.8% | 50.0% | 28.6% | 60.0% | 71.4% | 42.9% | 53.3% | 57.1% | 50.0% | 78.6% |
| Magus | 0.0% | 33.3% | 28.6% | 41.7% | 42.9% | 20.0% | 40.0% | 33.3% | 16.7% | 12.5% | 33.3% | 44.4% | 21.4% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 42.9% | 77 |
| 16-30 | 50.3% | 632 |
| 31-50 | 51.7% | 458 |
| 51-70 | 58.5% | 236 |
| 71-100 | 45.9% | 597 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 31.6% | 19 |
| 16-30 | 31.0% | 445 |
| 31-50 | 44.9% | 709 |
| 51-70 | 58.7% | 298 |
| 71-100 | 68.6% | 529 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.0% | 256 |
| 16-30 | 44.7% | 407 |
| 31-50 | 50.3% | 360 |
| 51-70 | 51.3% | 275 |
| 71-100 | 52.4% | 702 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.9% | 467 |
| 16-30 | 44.2% | 493 |
| 31-50 | 52.9% | 367 |
| 51-70 | 61.7% | 227 |
| 71-100 | 54.5% | 446 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.1% | 798 |
| 16-30 | 44.2% | 529 |
| 31-50 | 41.9% | 329 |
| 51-70 | 81.5% | 135 |
| 71-100 | 71.8% | 209 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.9% | 1617 |
| 16-30 | 41.3% | 223 |
| 31-50 | 45.6% | 136 |
| 51-70 | 30.4% | 23 |
| 71-100 | 0.0% | 1 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.7% | 1625 |
| 16-30 | 43.1% | 218 |
| 31-50 | 44.9% | 127 |
| 51-70 | 30.0% | 30 |
| 71-100 | 0.0% | 0 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.9% | 1622 |
| 16-30 | 39.6% | 222 |
| 31-50 | 49.2% | 120 |
| 51-70 | 30.6% | 36 |
| 71-100 | 0.0% | 0 |
