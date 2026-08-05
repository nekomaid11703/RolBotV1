# Combat Simulation Report
Generated: 2026-08-05 02:26:14 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 12.6 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 948 (94.8%) |
| Timeouts (draws) | 52 (5.2%) |
| Avg rounds (all) | 12.1 |
| Avg rounds (KO only) | 10.0 |
| Rounds P50 / P90 / Max | 7 / 29 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 160 |
| Avg rounds | 12.6 |
| P50 / P90 | 8 / 30 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 515/1000 |
| Winrate | 51.5% |
| Advantage over 50% | 1.5% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 91 | 134 | 67.9% | YES |
| Asesino | 54 | 145 | 37.2% |  |
| Esquivo | 68 | 138 | 49.3% |  |
| Equilibrado | 78 | 140 | 55.7% |  |
| Extremista ATK | 69 | 146 | 47.3% |  |
| Extremista DEF | 89 | 161 | 55.3% |  |
| Extremista ASPD | 49 | 127 | 38.6% |  |
| Extremista REF | 64 | 138 | 46.4% |  |
| Velocista | 85 | 153 | 55.6% |  |
| Berserker | 52 | 130 | 40.0% |  |
| Guardian | 87 | 145 | 60.0% |  |
| Estratega | 86 | 176 | 48.9% |  |
| Gladiador | 65 | 126 | 51.6% |  |
| Magus | 63 | 141 | 44.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.5 | 1 |
| Heal applied | 91.2 | - |
| Rests | 6.1 | 3 |
| Advances | 4.2 | - |
| Retreats | 0.2 | - |
| Battles with item use | 54.7% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 89.7% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 31.72 (avg 46.82) |
| ASPD spread (stddev) | 30.97 (avg 52.36) |
| Equipment tier A | 261 (13.1%) |
| Equipment tier B | 422 (21.1%) |
| Equipment tier C | 495 (24.8%) |
| Equipment tier E | 822 (41.1%) |
| Level 100-199 | 494 |
| Level 200-299 | 527 |
| Level 300-399 | 504 |
| Level 400-500 | 475 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 579 |
| cortante | 598 |
| desarmado | 206 |
| perforante | 617 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 528 | 51.3% |
| ligera | 6 | 16.7% |
| media | 113 | 45.1% |
| total | 1353 | 50.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 3+ | 2000 | 50.0% |
Set bonus active: 50.0% (2000) vs inactive 0.0% (0)

### Amulet
With amulet: 51.2% (847) vs without 49.1% (1153)

### Shield
With shield: 0.0% (0) vs without 50.0% (2000)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 230 | 70.0% |
| B | 373 | 55.5% |
| C | 438 | 49.5% |
| E | 753 | 43.4% |
| desarmado | 206 | 42.7% |

### Nature by level bracket
- **100-199**: contundente: 149, cortante: 146, desarmado: 42, perforante: 157
- **200-299**: contundente: 165, cortante: 162, desarmado: 51, perforante: 149
- **300-399**: contundente: 136, cortante: 137, desarmado: 64, perforante: 167
- **400-500**: contundente: 129, cortante: 153, desarmado: 49, perforante: 144

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 37.0% | 495 | 54.3% | 1505 | -17.3pp |
| d_fulgor | 36.4% | 500 | 54.5% | 1500 | -18.1pp |
| r_fulgor | 37.1% | 490 | 54.2% | 1510 | -17.0pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 16.1 | 0 | 128 | 5 | 11 | 19 |
| Asesino | 53.7 | 0 | 128 | 29 | 50 | 76 |
| Esquivo | 9.9 | 0 | 84 | 0 | 4 | 16 |
| Equilibrado | 32.4 | 0 | 128 | 14 | 29 | 45 |
| Extremista ATK | 60.2 | 0 | 128 | 46 | 59 | 78 |
| Extremista DEF | 8.6 | 0 | 128 | 0 | 0 | 9 |
| Extremista ASPD | 43.2 | 10 | 128 | 19 | 46 | 59 |
| Extremista REF | 26.9 | 0 | 128 | 11 | 19 | 32 |
| Velocista | 21.1 | 0 | 128 | 8 | 16 | 25 |
| Berserker | 56.0 | 0 | 128 | 44 | 50 | 72 |
| Guardian | 7.2 | 0 | 128 | 0 | 0 | 10 |
| Estratega | 32.0 | 0 | 128 | 16 | 23 | 46 |
| Gladiador | 48.1 | 0 | 128 | 19 | 46 | 65 |
| Magus | 43.2 | 0 | 128 | 19 | 39 | 58 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 378 | 378 | 100.0% |
| Asesino | 320 | 320 | 100.0% |
| Esquivo | 1894 | 1894 | 100.0% |
| Equilibrado | 813 | 813 | 100.0% |
| Extremista ATK | 189 | 189 | 100.0% |
| Extremista DEF | 368 | 368 | 100.0% |
| Extremista ASPD | 196 | 196 | 100.0% |
| Extremista REF | 202 | 202 | 100.0% |
| Velocista | 480 | 480 | 100.0% |
| Berserker | 147 | 147 | 100.0% |
| Guardian | 648 | 648 | 100.0% |
| Estratega | 182 | 182 | 100.0% |
| Gladiador | 160 | 160 | 100.0% |
| Magus | 281 | 281 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 72 | 1420 | 5.1% |
| Asesino | 3 | 795 | 0.4% |
| Esquivo | 297 | 2365 | 12.6% |
| Equilibrado | 32 | 1477 | 2.2% |
| Extremista ATK | 53 | 847 | 6.3% |
| Extremista DEF | 434 | 1831 | 23.7% |
| Extremista ASPD | 80 | 917 | 8.7% |
| Extremista REF | 811 | 1161 | 69.9% |
| Velocista | 0 | 828 | 0.0% |
| Berserker | 116 | 833 | 13.9% |
| Guardian | 0 | 1887 | 0.0% |
| Estratega | 750 | 1232 | 60.9% |
| Gladiador | 211 | 714 | 29.6% |
| Magus | 158 | 857 | 18.4% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 13 | 17 | 16 | 13 | 10 | 11 | 10 | 9 | 7 | 9 | 12 | 13 | 9 | 16 |
| 5 | 24 | 23 | 19 | 22 | 19 | 19 | 18 | 13 | 13 | 17 | 22 | 16 | 18 | 21 |
| 10 | 28 | 23 | 22 | 26 | 20 | 23 | 17 | 12 | 15 | 17 | 27 | 16 | 18 | 21 |
| 15 | 29 | 24 | 24 | 26 | 20 | 26 | 18 | 12 | 15 | 17 | 29 | 16 | 19 | 21 |
| 20 | 29 | 24 | 25 | 26 | 20 | 28 | 18 | 12 | 15 | 18 | 30 | 17 | 19 | 22 |
| 25 | 29 | 25 | 26 | 26 | 20 | 29 | 18 | 12 | 15 | 18 | 30 | 17 | 19 | 22 |
| 30 | 30 | 25 | 28 | 27 | 20 | 28 | 19 | 13 | 15 | 19 | 29 | 16 | 19 | 22 |
| 40 | 29 | 26 | 29 | 27 | 20 | 28 | 19 | 13 | 15 | 19 | 28 | 17 | 19 | 22 |
| 50 | 29 | 26 | 30 | 28 | 21 | 28 | 19 | 13 | 15 | 19 | 28 | 17 | 19 | 21 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 83.3% | 55.6% | 50.0% | 77.8% | 40.0% | 90.9% | 66.7% | 66.7% | 75.0% | 50.0% | 75.0% | 75.0% | 75.0% |
| Asesino | 16.7% | 50.0% | 25.0% | 33.3% | 33.3% | 33.3% | 42.9% | 53.8% | 22.2% | 25.0% | 28.6% | 53.3% | 33.3% | 55.6% |
| Esquivo | 44.4% | 75.0% | 50.0% | 50.0% | 27.3% | 61.5% | 66.7% | 66.7% | 35.7% | 40.0% | 44.4% | 45.5% | 54.5% | 46.7% |
| Equilibrado | 50.0% | 66.7% | 50.0% | 50.0% | 54.5% | 62.5% | 33.3% | 55.6% | 50.0% | 72.7% | 58.3% | 42.9% | 63.6% | 60.0% |
| Extremista ATK | 22.2% | 66.7% | 72.7% | 45.5% | 50.0% | 46.7% | 77.8% | 50.0% | 27.3% | 57.1% | 25.0% | 30.0% | 50.0% | 44.4% |
| Extremista DEF | 60.0% | 66.7% | 38.5% | 37.5% | 53.3% | 50.0% | 60.0% | 66.7% | 57.1% | 55.6% | 42.9% | 57.9% | 42.9% | 66.7% |
| Extremista ASPD | 9.1% | 57.1% | 33.3% | 66.7% | 22.2% | 40.0% | 50.0% | 30.0% | 53.8% | 25.0% | 36.4% | 53.3% | 22.2% | 50.0% |
| Extremista REF | 33.3% | 46.2% | 33.3% | 44.4% | 50.0% | 33.3% | 70.0% | 50.0% | 57.1% | 85.7% | 25.0% | 58.3% | 40.0% | 25.0% |
| Velocista | 33.3% | 77.8% | 64.3% | 50.0% | 72.7% | 42.9% | 46.2% | 42.9% | 50.0% | 75.0% | 56.3% | 37.5% | 50.0% | 69.2% |
| Berserker | 25.0% | 75.0% | 60.0% | 27.3% | 42.9% | 44.4% | 75.0% | 14.3% | 25.0% | 50.0% | 13.3% | 47.1% | 50.0% | 44.4% |
| Guardian | 50.0% | 71.4% | 55.6% | 41.7% | 75.0% | 57.1% | 63.6% | 75.0% | 43.8% | 86.7% | 50.0% | 57.1% | 66.7% | 37.5% |
| Estratega | 25.0% | 46.7% | 54.5% | 57.1% | 70.0% | 42.1% | 46.7% | 41.7% | 62.5% | 52.9% | 42.9% | 50.0% | 33.3% | 66.7% |
| Gladiador | 25.0% | 66.7% | 45.5% | 36.4% | 50.0% | 57.1% | 77.8% | 60.0% | 50.0% | 50.0% | 33.3% | 66.7% | 50.0% | 53.3% |
| Magus | 25.0% | 44.4% | 53.3% | 40.0% | 55.6% | 33.3% | 50.0% | 75.0% | 30.8% | 55.6% | 62.5% | 33.3% | 46.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.8% | 336 |
| 16-30 | 50.7% | 521 |
| 31-50 | 53.2% | 376 |
| 51-70 | 51.9% | 216 |
| 71-100 | 50.3% | 551 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 14.3% | 14 |
| 16-30 | 37.4% | 422 |
| 31-50 | 44.7% | 770 |
| 51-70 | 58.5% | 272 |
| 71-100 | 64.6% | 522 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.4% | 249 |
| 16-30 | 44.4% | 417 |
| 31-50 | 52.2% | 381 |
| 51-70 | 51.3% | 269 |
| 71-100 | 54.1% | 684 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.4% | 465 |
| 16-30 | 43.2% | 470 |
| 31-50 | 50.9% | 373 |
| 51-70 | 60.6% | 208 |
| 71-100 | 60.5% | 484 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.2% | 797 |
| 16-30 | 46.1% | 529 |
| 31-50 | 50.1% | 339 |
| 51-70 | 73.5% | 155 |
| 71-100 | 71.1% | 180 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.2% | 1609 |
| 16-30 | 38.6% | 210 |
| 31-50 | 39.4% | 137 |
| 51-70 | 22.0% | 41 |
| 71-100 | 0.0% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.3% | 1615 |
| 16-30 | 39.1% | 215 |
| 31-50 | 34.6% | 130 |
| 51-70 | 29.4% | 34 |
| 71-100 | 16.7% | 6 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 53.1% | 1613 |
| 16-30 | 39.8% | 221 |
| 31-50 | 36.6% | 123 |
| 51-70 | 28.6% | 35 |
| 71-100 | 12.5% | 8 |
