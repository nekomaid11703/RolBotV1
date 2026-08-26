# Combat Simulation Report
Generated: 2026-08-07 18:06:56 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.5 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.7 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1957 (97.9%) |
| Timeouts (draws) | 43 (2.1%) |
| Avg rounds (all) | 5.5 |
| Avg rounds (KO only) | 5.2 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 232 |
| Avg rounds | 6.5 |
| P50 / P90 | 5 / 13 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 974/2000 |
| Winrate | 48.7% |
| Advantage over 50% | -1.3% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 170 | 268 | 63.4% |  |
| Asesino | 76 | 309 | 24.6% |  |
| Esquivo | 87 | 287 | 30.3% |  |
| Equilibrado | 104 | 269 | 38.7% |  |
| Extremista ATK | 175 | 311 | 56.3% |  |
| Extremista DEF | 206 | 283 | 72.8% | YES |
| Extremista ASPD | 169 | 302 | 56.0% |  |
| Extremista REF | 165 | 281 | 58.7% |  |
| Velocista | 59 | 293 | 20.1% |  |
| Berserker | 165 | 285 | 57.9% |  |
| Guardian | 146 | 279 | 52.3% |  |
| Estratega | 175 | 268 | 65.3% |  |
| Gladiador | 162 | 259 | 62.5% |  |
| Magus | 141 | 306 | 46.1% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.5 | 0 |
| Heal applied | 26.8 | - |
| Rests | 3.0 | 2 |
| Advances | 3.9 | - |
| Retreats | 0.6 | - |
| Battles with item use | 24.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.57 (avg 47.94) |
| ASPD spread (stddev) | 31.34 (avg 53.83) |
| Equipment tier A | 144 (3.6%) |
| Equipment tier B | 1654 (41.3%) |
| Equipment tier C | 682 (17.1%) |
| Equipment tier D | 1165 (29.1%) |
| Equipment tier S | 355 (8.9%) |
| Level 100-199 | 964 |
| Level 200-299 | 1136 |
| Level 300-399 | 975 |
| Level 400-500 | 925 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 887 |
| cortante | 912 |
| desarmado | 400 |
| perforante | 1801 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1247 | 48.1% |
| ligera | 14 | 57.1% |
| media | 136 | 43.4% |
| total | 2603 | 51.2% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 87 | 46.0% |
| 3+ | 3913 | 50.1% |
Set bonus active: 50.1% (3913) vs inactive 46.0% (87)

### Amulet
With amulet: 51.2% (1586) vs without 49.2% (2414)

### Shield
With shield: 49.7% (2418) vs without 50.5% (1582)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 129 | 55.8% |
| B | 1484 | 55.7% |
| C | 609 | 48.4% |
| D | 1058 | 42.1% |
| S | 320 | 67.8% |
| desarmado | 400 | 36.0% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 793 | 50.8% |
| adamantita | 151 | 64.2% |
| bronce | 800 | 42.0% |
| desarmado | 400 | 36.0% |
| filo_estelar | 169 | 71.0% |
| hierro | 807 | 47.7% |
| mitril | 443 | 56.9% |
| titanio | 437 | 60.2% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 880 | 58.5% |
| mitico | 320 | 67.8% |
| ninguno | 400 | 36.0% |
| poco_comun | 2400 | 46.8% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 868 | 53.0% |
| adamantita | 186 | 55.4% |
| bronce | 878 | 49.3% |
| filo_estelar | 193 | 46.1% |
| hierro | 909 | 49.0% |
| mitril | 503 | 50.3% |
| titanio | 463 | 46.9% |

### Nature by level bracket
- **100-199**: contundente: 193, cortante: 223, desarmado: 100, perforante: 448
- **200-299**: contundente: 266, cortante: 243, desarmado: 111, perforante: 516
- **300-399**: contundente: 222, cortante: 215, desarmado: 98, perforante: 440
- **400-500**: contundente: 206, cortante: 231, desarmado: 91, perforante: 397

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 48.9% | 1001 | 50.4% | 2999 | -1.5pp |
| d_fulgor | 48.6% | 991 | 50.4% | 3009 | -1.8pp |
| r_fulgor | 48.5% | 1001 | 50.5% | 2999 | -2.1pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 27.5 | 1 | 135 | 13 | 24 | 38 |
| Asesino | 47.7 | 1 | 155 | 16 | 43 | 75 |
| Esquivo | 26.4 | 1 | 140 | 13 | 21 | 35 |
| Equilibrado | 35.7 | 1 | 147 | 18 | 29 | 50 |
| Extremista ATK | 60.5 | 1 | 185 | 26 | 62 | 84 |
| Extremista DEF | 22.7 | 0 | 128 | 8 | 20 | 31 |
| Extremista ASPD | 48.6 | 1 | 162 | 25 | 40 | 73 |
| Extremista REF | 31.1 | 1 | 133 | 15 | 28 | 41 |
| Velocista | 31.7 | 1 | 131 | 18 | 27 | 42 |
| Berserker | 55.4 | 1 | 179 | 24 | 53 | 82 |
| Guardian | 23.7 | 1 | 122 | 13 | 21 | 31 |
| Estratega | 35.4 | 1 | 163 | 17 | 31 | 47 |
| Gladiador | 52.5 | 1 | 176 | 27 | 50 | 74 |
| Magus | 40.3 | 1 | 165 | 19 | 35 | 53 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 0 | 0 | 0.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 3 | 3 | 100.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Velocista | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 128 | 911 | 14.1% |
| Asesino | 66 | 763 | 8.7% |
| Esquivo | 507 | 883 | 57.4% |
| Equilibrado | 254 | 797 | 31.9% |
| Extremista ATK | 116 | 715 | 16.2% |
| Extremista DEF | 318 | 1147 | 27.7% |
| Extremista ASPD | 119 | 704 | 16.9% |
| Extremista REF | 630 | 827 | 76.2% |
| Velocista | 91 | 864 | 10.5% |
| Berserker | 90 | 661 | 13.6% |
| Guardian | 200 | 1345 | 14.9% |
| Estratega | 522 | 682 | 76.5% |
| Gladiador | 219 | 533 | 41.1% |
| Magus | 231 | 784 | 29.5% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 24 | 47 | 60 | 54 | 15 | 13 | 12 | 13 | 104 | 13 | 41 | 15 | 10 | 22 |
| 5 | 36 | 52 | 65 | 59 | 24 | 25 | 20 | 19 | 111 | 23 | 55 | 23 | 20 | 30 |
| 10 | 37 | 52 | 65 | 59 | 24 | 29 | 20 | 18 | 111 | 23 | 54 | 22 | 20 | 29 |
| 15 | 37 | 52 | 65 | 58 | 24 | 30 | 20 | 18 | 111 | 23 | 54 | 21 | 20 | 29 |
| 20 | 38 | 52 | 65 | 58 | 25 | 31 | 20 | 19 | 111 | 23 | 54 | 21 | 20 | 29 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 95.0% | 80.0% | 66.7% | 63.2% | 42.9% | 65.2% | 35.3% | 81.0% | 75.0% | 64.3% | 35.3% | 41.2% | 75.0% |
| Asesino | 5.0% | 50.0% | 40.0% | 29.4% | 24.0% | 0.0% | 12.5% | 19.2% | 56.3% | 18.8% | 15.8% | 4.0% | 35.0% | 44.0% |
| Esquivo | 20.0% | 60.0% | 50.0% | 25.0% | 28.6% | 7.7% | 14.3% | 33.3% | 53.8% | 22.7% | 33.3% | 5.6% | 10.0% | 31.8% |
| Equilibrado | 33.3% | 70.6% | 75.0% | 50.0% | 15.0% | 16.7% | 26.7% | 21.4% | 76.0% | 30.4% | 33.3% | 23.1% | 17.6% | 40.0% |
| Extremista ATK | 36.8% | 76.0% | 71.4% | 85.0% | 50.0% | 21.4% | 47.8% | 45.5% | 90.9% | 50.0% | 59.1% | 35.7% | 38.1% | 60.7% |
| Extremista DEF | 57.1% | 100.0% | 92.3% | 83.3% | 78.6% | 50.0% | 68.4% | 58.3% | 100.0% | 75.0% | 65.0% | 56.3% | 69.6% | 81.0% |
| Extremista ASPD | 34.8% | 87.5% | 85.7% | 73.3% | 52.2% | 31.6% | 50.0% | 58.8% | 80.6% | 42.1% | 58.3% | 38.5% | 26.3% | 45.8% |
| Extremista REF | 64.7% | 80.8% | 66.7% | 78.6% | 54.5% | 41.7% | 41.2% | 50.0% | 90.0% | 44.4% | 56.3% | 60.0% | 32.0% | 72.7% |
| Velocista | 19.0% | 43.8% | 46.2% | 24.0% | 9.1% | 0.0% | 19.4% | 10.0% | 50.0% | 0.0% | 29.4% | 11.8% | 7.4% | 19.2% |
| Berserker | 25.0% | 81.3% | 77.3% | 69.6% | 50.0% | 25.0% | 57.9% | 55.6% | 100.0% | 50.0% | 50.0% | 48.1% | 73.7% | 59.3% |
| Guardian | 35.7% | 84.2% | 66.7% | 66.7% | 40.9% | 35.0% | 41.7% | 43.8% | 70.6% | 50.0% | 50.0% | 30.4% | 40.0% | 65.2% |
| Estratega | 64.7% | 96.0% | 94.4% | 76.9% | 64.3% | 43.8% | 61.5% | 40.0% | 88.2% | 51.9% | 69.6% | 50.0% | 66.7% | 58.8% |
| Gladiador | 58.8% | 65.0% | 90.0% | 82.4% | 61.9% | 30.4% | 73.7% | 68.0% | 92.6% | 26.3% | 60.0% | 33.3% | 50.0% | 64.3% |
| Magus | 25.0% | 56.0% | 68.2% | 60.0% | 39.3% | 19.0% | 54.2% | 27.3% | 80.8% | 40.7% | 34.8% | 41.2% | 35.7% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 45.8% | 694 |
| 16-30 | 49.9% | 1016 |
| 31-50 | 51.7% | 692 |
| 51-70 | 47.8% | 414 |
| 71-100 | 52.3% | 1184 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 38.5% | 39 |
| 16-30 | 42.0% | 899 |
| 31-50 | 47.5% | 1523 |
| 51-70 | 57.1% | 588 |
| 71-100 | 57.5% | 951 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.3% | 510 |
| 16-30 | 44.7% | 740 |
| 31-50 | 46.3% | 769 |
| 51-70 | 47.7% | 535 |
| 71-100 | 53.0% | 1446 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.2% | 949 |
| 16-30 | 48.4% | 999 |
| 31-50 | 49.5% | 772 |
| 51-70 | 47.6% | 462 |
| 71-100 | 54.6% | 818 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 57.1% | 1656 |
| 16-30 | 53.9% | 1053 |
| 31-50 | 44.8% | 620 |
| 51-70 | 36.2% | 282 |
| 71-100 | 27.5% | 389 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 3189 |
| 16-30 | 44.9% | 452 |
| 31-50 | 51.8% | 278 |
| 51-70 | 52.7% | 74 |
| 71-100 | 57.1% | 7 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.3% | 3195 |
| 16-30 | 45.8% | 456 |
| 31-50 | 52.2% | 272 |
| 51-70 | 54.1% | 74 |
| 71-100 | 66.7% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.2% | 3195 |
| 16-30 | 45.4% | 438 |
| 31-50 | 52.4% | 294 |
| 51-70 | 58.7% | 63 |
| 71-100 | 50.0% | 10 |
