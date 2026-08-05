# Combat Simulation Report
Generated: 2026-08-05 02:25:53 | 1000 simulations | Max 50 rounds

Config: numSims=1000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 10.8 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.6 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 1000 |
| KO victories | 969 (96.9%) |
| Timeouts (draws) | 31 (3.1%) |
| Avg rounds (all) | 10.2 |
| Avg rounds (KO only) | 8.9 |
| Rounds P50 / P90 / Max | 6 / 21 / 51 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 152 |
| Avg rounds | 10.8 |
| P50 / P90 | 7 / 22 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 522/1000 |
| Winrate | 52.2% |
| Advantage over 50% | 2.2% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 79 | 134 | 59.0% |  |
| Asesino | 58 | 158 | 36.7% |  |
| Esquivo | 66 | 143 | 46.2% |  |
| Equilibrado | 76 | 139 | 54.7% |  |
| Extremista ATK | 63 | 162 | 38.9% |  |
| Extremista DEF | 77 | 132 | 58.3% |  |
| Extremista ASPD | 47 | 121 | 38.8% |  |
| Extremista REF | 72 | 140 | 51.4% |  |
| Velocista | 101 | 160 | 63.1% | YES |
| Berserker | 72 | 148 | 48.6% |  |
| Guardian | 68 | 123 | 55.3% |  |
| Estratega | 90 | 147 | 61.2% |  |
| Gladiador | 63 | 141 | 44.7% |  |
| Magus | 68 | 152 | 44.7% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.3 | 0 |
| Heal applied | 84.7 | - |
| Rests | 5.4 | 3 |
| Advances | 4.1 | - |
| Retreats | 0.1 | - |
| Battles with item use | 48.9% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 87.8% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 31.21 (avg 53.99) |
| ASPD spread (stddev) | 30.77 (avg 54.16) |
| Equipment tier A | 278 (13.9%) |
| Equipment tier B | 404 (20.2%) |
| Equipment tier C | 534 (26.7%) |
| Equipment tier E | 784 (39.2%) |
| Level 100-199 | 445 |
| Level 200-299 | 552 |
| Level 300-399 | 503 |
| Level 400-500 | 500 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 572 |
| cortante | 575 |
| desarmado | 243 |
| perforante | 610 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 684 | 50.4% |
| ligera | 10 | 30.0% |
| media | 59 | 44.1% |
| total | 1247 | 50.2% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 45 | 35.6% |
| 3+ | 1955 | 50.3% |
Set bonus active: 50.3% (1955) vs inactive 35.6% (45)

### Amulet
With amulet: 50.0% (2000) vs without 0.0% (0)

### Shield
With shield: 50.0% (1185) vs without 49.9% (815)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 250 | 68.8% |
| B | 355 | 55.8% |
| C | 468 | 51.9% |
| E | 684 | 40.8% |
| desarmado | 243 | 44.4% |

### Nature by level bracket
- **100-199**: contundente: 114, cortante: 119, desarmado: 57, perforante: 155
- **200-299**: contundente: 166, cortante: 159, desarmado: 66, perforante: 161
- **300-399**: contundente: 155, cortante: 142, desarmado: 60, perforante: 146
- **400-500**: contundente: 137, cortante: 155, desarmado: 60, perforante: 148

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 41.3% | 479 | 52.7% | 1521 | -11.4pp |
| d_fulgor | 40.4% | 473 | 53.0% | 1527 | -12.6pp |
| r_fulgor | 40.7% | 474 | 52.9% | 1526 | -12.2pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 19.4 | 0 | 128 | 0 | 15 | 27 |
| Asesino | 60.7 | 0 | 128 | 46 | 61 | 77 |
| Esquivo | 12.9 | 0 | 128 | 0 | 0 | 19 |
| Equilibrado | 34.4 | 0 | 128 | 19 | 29 | 46 |
| Extremista ATK | 60.2 | 0 | 128 | 46 | 62 | 76 |
| Extremista DEF | 6.7 | 0 | 128 | 0 | 0 | 0 |
| Extremista ASPD | 47.1 | 0 | 128 | 25 | 46 | 64 |
| Extremista REF | 31.9 | 0 | 128 | 17 | 21 | 38 |
| Velocista | 28.2 | 0 | 128 | 16 | 21 | 32 |
| Berserker | 58.4 | 0 | 128 | 46 | 53 | 76 |
| Guardian | 12.2 | 0 | 128 | 0 | 9 | 19 |
| Estratega | 34.5 | 0 | 128 | 19 | 27 | 46 |
| Gladiador | 53.5 | 0 | 128 | 33 | 50 | 68 |
| Magus | 52.4 | 0 | 128 | 34 | 46 | 68 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 136 | 136 | 100.0% |
| Asesino | 124 | 124 | 100.0% |
| Esquivo | 1757 | 1757 | 100.0% |
| Equilibrado | 621 | 621 | 100.0% |
| Extremista ATK | 261 | 261 | 100.0% |
| Extremista DEF | 308 | 308 | 100.0% |
| Extremista ASPD | 84 | 84 | 100.0% |
| Extremista REF | 78 | 78 | 100.0% |
| Velocista | 433 | 433 | 100.0% |
| Berserker | 170 | 170 | 100.0% |
| Guardian | 209 | 209 | 100.0% |
| Estratega | 358 | 358 | 100.0% |
| Gladiador | 135 | 135 | 100.0% |
| Magus | 245 | 245 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 33 | 1149 | 2.9% |
| Asesino | 7 | 595 | 1.2% |
| Esquivo | 255 | 2210 | 11.5% |
| Equilibrado | 28 | 1111 | 2.5% |
| Extremista ATK | 95 | 935 | 10.2% |
| Extremista DEF | 310 | 1296 | 23.9% |
| Extremista ASPD | 56 | 645 | 8.7% |
| Extremista REF | 677 | 947 | 71.5% |
| Velocista | 0 | 804 | 0.0% |
| Berserker | 86 | 793 | 10.8% |
| Guardian | 0 | 1062 | 0.0% |
| Estratega | 404 | 972 | 41.6% |
| Gladiador | 295 | 736 | 40.1% |
| Magus | 171 | 830 | 20.6% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 16 | 17 | 15 | 16 | 10 | 10 | 11 | 11 | 5 | 10 | 15 | 12 | 9 | 17 |
| 5 | 27 | 24 | 20 | 23 | 19 | 18 | 18 | 15 | 14 | 20 | 23 | 18 | 18 | 23 |
| 10 | 31 | 24 | 22 | 25 | 19 | 24 | 18 | 15 | 16 | 21 | 28 | 17 | 18 | 23 |
| 15 | 32 | 24 | 25 | 26 | 19 | 28 | 18 | 15 | 16 | 21 | 31 | 17 | 18 | 23 |
| 20 | 32 | 25 | 26 | 27 | 19 | 29 | 18 | 15 | 15 | 22 | 32 | 18 | 19 | 23 |
| 25 | 31 | 25 | 26 | 27 | 19 | 30 | 18 | 15 | 19 | 22 | 32 | 18 | 19 | 24 |
| 30 | 31 | 25 | 27 | 28 | 20 | 29 | 18 | 15 | 19 | 22 | 31 | 18 | 19 | 24 |
| 40 | 31 | 25 | 27 | 29 | 20 | 28 | 18 | 15 | 19 | 22 | 31 | 18 | 19 | 24 |
| 50 | 30 | 25 | 28 | 30 | 20 | 28 | 18 | 15 | 19 | 22 | 31 | 18 | 19 | 24 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 75.0% | 11.1% | 46.2% | 90.9% | 75.0% | 100.0% | 42.9% | 53.8% | 66.7% | 66.7% | 46.7% | 44.4% | 75.0% |
| Asesino | 25.0% | 50.0% | 42.9% | 20.0% | 43.8% | 14.3% | 20.0% | 55.6% | 50.0% | 20.0% | 28.6% | 33.3% | 45.5% | 55.6% |
| Esquivo | 88.9% | 57.1% | 50.0% | 16.7% | 41.7% | 61.5% | 25.0% | 50.0% | 15.4% | 62.5% | 61.5% | 12.5% | 40.0% | 33.3% |
| Equilibrado | 53.8% | 80.0% | 83.3% | 50.0% | 90.0% | 33.3% | 45.5% | 54.5% | 41.7% | 70.0% | 57.1% | 8.3% | 25.0% | 77.8% |
| Extremista ATK | 9.1% | 56.3% | 58.3% | 10.0% | 50.0% | 46.2% | 33.3% | 27.3% | 35.7% | 55.6% | 27.3% | 23.1% | 72.7% | 33.3% |
| Extremista DEF | 25.0% | 85.7% | 38.5% | 66.7% | 53.8% | 50.0% | 61.5% | 71.4% | 50.0% | 85.7% | 50.0% | 44.4% | 66.7% | 80.0% |
| Extremista ASPD | 0.0% | 80.0% | 75.0% | 54.5% | 66.7% | 38.5% | 50.0% | 33.3% | 20.0% | 27.3% | 0.0% | 46.7% | 44.4% | 28.6% |
| Extremista REF | 57.1% | 44.4% | 50.0% | 45.5% | 72.7% | 28.6% | 66.7% | 50.0% | 57.1% | 50.0% | 45.5% | 42.9% | 58.3% | 44.4% |
| Velocista | 46.2% | 50.0% | 84.6% | 58.3% | 64.3% | 50.0% | 80.0% | 42.9% | 50.0% | 76.9% | 66.7% | 57.1% | 91.7% | 70.0% |
| Berserker | 33.3% | 80.0% | 37.5% | 30.0% | 44.4% | 14.3% | 72.7% | 50.0% | 23.1% | 50.0% | 18.2% | 53.8% | 50.0% | 80.0% |
| Guardian | 33.3% | 71.4% | 38.5% | 42.9% | 72.7% | 50.0% | 100.0% | 54.5% | 33.3% | 81.8% | 50.0% | 37.5% | 61.5% | 36.4% |
| Estratega | 53.3% | 66.7% | 87.5% | 91.7% | 76.9% | 55.6% | 53.3% | 57.1% | 42.9% | 46.2% | 62.5% | 50.0% | 50.0% | 50.0% |
| Gladiador | 55.6% | 54.5% | 60.0% | 75.0% | 27.3% | 33.3% | 55.6% | 41.7% | 8.3% | 50.0% | 38.5% | 50.0% | 50.0% | 50.0% |
| Magus | 25.0% | 44.4% | 66.7% | 22.2% | 66.7% | 20.0% | 71.4% | 55.6% | 30.0% | 20.0% | 63.6% | 50.0% | 50.0% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 43.1% | 58 |
| 16-30 | 49.1% | 617 |
| 31-50 | 55.0% | 440 |
| 51-70 | 49.5% | 208 |
| 71-100 | 48.3% | 677 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 14.3% | 21 |
| 16-30 | 35.5% | 400 |
| 31-50 | 47.8% | 824 |
| 51-70 | 60.6% | 279 |
| 71-100 | 61.3% | 476 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 48.7% | 224 |
| 16-30 | 42.4% | 363 |
| 31-50 | 46.0% | 433 |
| 51-70 | 51.5% | 262 |
| 71-100 | 56.1% | 718 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 41.8% | 443 |
| 16-30 | 40.7% | 518 |
| 31-50 | 48.7% | 349 |
| 51-70 | 63.5% | 244 |
| 71-100 | 62.6% | 446 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.3% | 797 |
| 16-30 | 43.3% | 550 |
| 31-50 | 50.2% | 313 |
| 51-70 | 69.2% | 133 |
| 71-100 | 73.4% | 207 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.1% | 1619 |
| 16-30 | 40.5% | 220 |
| 31-50 | 45.8% | 131 |
| 51-70 | 25.9% | 27 |
| 71-100 | 33.3% | 3 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1619 |
| 16-30 | 37.9% | 214 |
| 31-50 | 41.4% | 145 |
| 51-70 | 47.6% | 21 |
| 71-100 | 0.0% | 1 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 52.4% | 1612 |
| 16-30 | 40.2% | 224 |
| 31-50 | 39.7% | 141 |
| 51-70 | 40.0% | 20 |
| 71-100 | 66.7% | 3 |
