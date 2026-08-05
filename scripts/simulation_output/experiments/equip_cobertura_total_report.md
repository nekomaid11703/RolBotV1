# Combat Simulation Report
Generated: 2026-08-05 02:26:09 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 11.7 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 957 (95.7%) |
| Timeouts (draws) | 43 (4.3%) |
| Avg rounds (all) | 11.6 |
| Avg rounds (KO only) | 9.8 |
| Rounds P50 / P90 / Max | 7 / 25 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 145 |
| Avg rounds | 11.7 |
| P50 / P90 | 7 / 25 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 521/1000 |
| Winrate | 52.1% |
| Advantage over 50% | 2.1% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 85 | 136 | 62.5% |  |
| Asesino | 43 | 136 | 31.6% |  |
| Esquivo | 84 | 157 | 53.5% |  |
| Equilibrado | 77 | 137 | 56.2% |  |
| Extremista ATK | 61 | 163 | 37.4% |  |
| Extremista DEF | 93 | 147 | 63.3% | YES |
| Extremista ASPD | 64 | 150 | 42.7% |  |
| Extremista REF | 64 | 131 | 48.9% |  |
| Velocista | 92 | 151 | 60.9% |  |
| Berserker | 60 | 134 | 44.8% |  |
| Guardian | 78 | 136 | 57.4% |  |
| Estratega | 64 | 127 | 50.4% |  |
| Gladiador | 76 | 161 | 47.2% |  |
| Magus | 59 | 134 | 44.0% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.4 | 1 |
| Heal applied | 91.0 | - |
| Rests | 5.9 | 3 |
| Advances | 4.5 | - |
| Retreats | 0.2 | - |
| Battles with item use | 53.7% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.7% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.50 (avg 47.70) |
| ASPD spread (stddev) | 30.90 (avg 52.89) |
| Equipment tier A | 225 (11.3%) |
| Equipment tier B | 403 (20.2%) |
| Equipment tier C | 539 (27.0%) |
| Equipment tier E | 833 (41.6%) |
| Level 100-199 | 464 |
| Level 200-299 | 625 |
| Level 300-399 | 472 |
| Level 400-500 | 439 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 636 |
| cortante | 568 |
| desarmado | 206 |
| perforante | 590 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| total | 2000 | 50.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 3+ | 2000 | 50.0% |
Set bonus active: 50.0% (2000) vs inactive 0.0% (0)

### Amulet
With amulet: 52.0% (796) vs without 48.7% (1204)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 202 | 67.3% |
| B | 361 | 58.4% |
| C | 484 | 48.1% |
| E | 747 | 43.9% |
| desarmado | 206 | 44.7% |

### Nature by level bracket
- **100-199**: contundente: 134, cortante: 134, desarmado: 50, perforante: 146
- **200-299**: contundente: 188, cortante: 185, desarmado: 60, perforante: 192
- **300-399**: contundente: 174, cortante: 117, desarmado: 51, perforante: 130
- **400-500**: contundente: 140, cortante: 132, desarmado: 45, perforante: 122

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 37.7% | 475 | 53.8% | 1525 | -16.2pp |
| d_fulgor | 38.2% | 476 | 53.7% | 1524 | -15.4pp |
| r_fulgor | 37.7% | 467 | 53.8% | 1533 | -16.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 20.1 | 0 | 128 | 9 | 16 | 23 |
| Asesino | 53.1 | 0 | 128 | 33 | 49 | 71 |
| Esquivo | 17.4 | 0 | 128 | 0 | 10 | 26 |
| Equilibrado | 26.0 | 0 | 128 | 0 | 20 | 39 |
| Extremista ATK | 52.1 | 0 | 128 | 19 | 49 | 72 |
| Extremista DEF | 5.9 | 0 | 128 | 0 | 0 | 5 |
| Extremista ASPD | 40.5 | 0 | 128 | 19 | 31 | 60 |
| Extremista REF | 27.9 | 0 | 128 | 11 | 19 | 38 |
| Velocista | 22.7 | 0 | 128 | 10 | 19 | 29 |
| Berserker | 60.6 | 0 | 128 | 46 | 65 | 77 |
| Guardian | 9.2 | 0 | 128 | 0 | 0 | 15 |
| Estratega | 26.0 | 0 | 128 | 14 | 19 | 32 |
| Gladiador | 50.0 | 0 | 128 | 32 | 47 | 67 |
| Magus | 44.8 | 14 | 128 | 22 | 41 | 61 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 161 | 161 | 100.0% |
| Asesino | 350 | 350 | 100.0% |
| Esquivo | 1148 | 1148 | 100.0% |
| Equilibrado | 572 | 572 | 100.0% |
| Extremista ATK | 120 | 120 | 100.0% |
| Extremista DEF | 647 | 647 | 100.0% |
| Extremista ASPD | 167 | 167 | 100.0% |
| Extremista REF | 315 | 315 | 100.0% |
| Velocista | 528 | 528 | 100.0% |
| Berserker | 184 | 184 | 100.0% |
| Guardian | 403 | 403 | 100.0% |
| Estratega | 260 | 260 | 100.0% |
| Gladiador | 29 | 29 | 100.0% |
| Magus | 399 | 399 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 42 | 1103 | 3.8% |
| Asesino | 2 | 810 | 0.2% |
| Esquivo | 288 | 1645 | 17.5% |
| Equilibrado | 27 | 1213 | 2.2% |
| Extremista ATK | 144 | 1122 | 12.8% |
| Extremista DEF | 371 | 1922 | 19.3% |
| Extremista ASPD | 83 | 893 | 9.3% |
| Extremista REF | 677 | 1108 | 61.1% |
| Velocista | 0 | 968 | 0.0% |
| Berserker | 81 | 859 | 9.4% |
| Guardian | 0 | 1589 | 0.0% |
| Estratega | 609 | 1078 | 56.5% |
| Gladiador | 233 | 711 | 32.8% |
| Magus | 153 | 1041 | 14.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 12 | 15 | 13 | 18 | 8 | 10 | 8 | 8 | 7 | 8 | 14 | 11 | 8 | 15 |
| 5 | 23 | 21 | 17 | 23 | 18 | 19 | 16 | 13 | 13 | 17 | 24 | 15 | 18 | 23 |
| 10 | 27 | 22 | 19 | 25 | 17 | 25 | 16 | 12 | 15 | 18 | 27 | 14 | 18 | 22 |
| 15 | 29 | 22 | 21 | 26 | 17 | 28 | 16 | 12 | 17 | 18 | 31 | 14 | 18 | 23 |
| 20 | 30 | 23 | 23 | 25 | 17 | 29 | 17 | 12 | 17 | 19 | 31 | 14 | 19 | 23 |
| 25 | 29 | 23 | 24 | 25 | 17 | 30 | 17 | 13 | 17 | 19 | 31 | 15 | 18 | 24 |
| 30 | 29 | 23 | 24 | 25 | 17 | 30 | 17 | 13 | 17 | 19 | 31 | 15 | 18 | 24 |
| 40 | 29 | 24 | 24 | 26 | 17 | 29 | 17 | 13 | 17 | 19 | 31 | 15 | 18 | 25 |
| 50 | 29 | 25 | 25 | 26 | 17 | 30 | 18 | 13 | 17 | 20 | 30 | 15 | 18 | 25 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 87.5% | 50.0% | 60.0% | 81.8% | 69.2% | 75.0% | 57.1% | 50.0% | 70.0% | 50.0% | 71.4% | 44.4% | 53.8% |
| Asesino | 12.5% | 50.0% | 40.0% | 37.5% | 40.0% | 20.0% | 36.4% | 28.6% | 42.9% | 33.3% | 0.0% | 22.2% | 22.2% | 60.0% |
| Esquivo | 50.0% | 60.0% | 50.0% | 54.5% | 78.6% | 46.2% | 60.0% | 55.6% | 28.6% | 58.3% | 70.0% | 28.6% | 50.0% | 50.0% |
| Equilibrado | 40.0% | 62.5% | 45.5% | 50.0% | 66.7% | 50.0% | 69.2% | 45.5% | 55.6% | 75.0% | 57.1% | 45.5% | 77.8% | 50.0% |
| Extremista ATK | 18.2% | 60.0% | 21.4% | 33.3% | 50.0% | 29.4% | 35.7% | 40.0% | 25.0% | 37.5% | 20.0% | 38.5% | 52.9% | 60.0% |
| Extremista DEF | 30.8% | 80.0% | 53.8% | 50.0% | 70.6% | 50.0% | 77.8% | 80.0% | 30.8% | 90.0% | 76.9% | 100.0% | 80.0% | 70.0% |
| Extremista ASPD | 25.0% | 63.6% | 40.0% | 30.8% | 64.3% | 22.2% | 50.0% | 62.5% | 40.0% | 33.3% | 28.6% | 45.5% | 40.0% | 40.0% |
| Extremista REF | 42.9% | 71.4% | 44.4% | 54.5% | 60.0% | 20.0% | 37.5% | 50.0% | 54.5% | 50.0% | 57.1% | 40.0% | 52.9% | 45.5% |
| Velocista | 50.0% | 57.1% | 71.4% | 44.4% | 75.0% | 69.2% | 60.0% | 45.5% | 50.0% | 55.6% | 66.7% | 66.7% | 78.6% | 66.7% |
| Berserker | 30.0% | 66.7% | 41.7% | 25.0% | 62.5% | 10.0% | 66.7% | 50.0% | 44.4% | 50.0% | 21.4% | 60.0% | 57.1% | 60.0% |
| Guardian | 50.0% | 100.0% | 30.0% | 42.9% | 80.0% | 23.1% | 71.4% | 42.9% | 33.3% | 78.6% | 50.0% | 57.1% | 85.7% | 54.5% |
| Estratega | 28.6% | 77.8% | 71.4% | 54.5% | 61.5% | 0.0% | 54.5% | 60.0% | 33.3% | 40.0% | 42.9% | 50.0% | 14.3% | 60.0% |
| Gladiador | 55.6% | 77.8% | 50.0% | 22.2% | 47.1% | 20.0% | 60.0% | 47.1% | 21.4% | 42.9% | 14.3% | 85.7% | 50.0% | 62.5% |
| Magus | 46.2% | 40.0% | 50.0% | 50.0% | 40.0% | 30.0% | 60.0% | 54.5% | 33.3% | 40.0% | 45.5% | 40.0% | 37.5% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.8% | 333 |
| 16-30 | 49.9% | 535 |
| 31-50 | 52.6% | 350 |
| 51-70 | 52.7% | 188 |
| 71-100 | 47.3% | 594 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 44.4% | 18 |
| 16-30 | 31.3% | 403 |
| 31-50 | 45.1% | 791 |
| 51-70 | 65.2% | 290 |
| 71-100 | 64.3% | 498 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.2% | 240 |
| 16-30 | 44.6% | 417 |
| 31-50 | 48.9% | 376 |
| 51-70 | 46.7% | 272 |
| 71-100 | 55.4% | 695 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 39.8% | 457 |
| 16-30 | 44.2% | 527 |
| 31-50 | 50.1% | 371 |
| 51-70 | 61.4% | 215 |
| 71-100 | 62.1% | 430 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.2% | 819 |
| 16-30 | 45.8% | 565 |
| 31-50 | 51.0% | 306 |
| 51-70 | 77.9% | 122 |
| 71-100 | 72.3% | 188 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.3% | 1617 |
| 16-30 | 33.9% | 221 |
| 31-50 | 41.8% | 122 |
| 51-70 | 28.9% | 38 |
| 71-100 | 50.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.8% | 1627 |
| 16-30 | 36.1% | 208 |
| 31-50 | 43.4% | 129 |
| 51-70 | 25.7% | 35 |
| 71-100 | 100.0% | 1 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.1% | 1618 |
| 16-30 | 36.0% | 222 |
| 31-50 | 39.1% | 115 |
| 51-70 | 34.9% | 43 |
| 71-100 | 50.0% | 2 |
