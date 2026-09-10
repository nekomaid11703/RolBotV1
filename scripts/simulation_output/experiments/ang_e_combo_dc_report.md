# Combat Simulation Report
Generated: 2026-08-07 18:02:42 | 2000 simulations | Max 20 rounds

Config: numSims=2000

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 5.2 | FAIL |
| Ventaja del primer atacante (sobre 50%) | 0.1 | -0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.8 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 2000 |
| KO victories | 1970 (98.5%) |
| Timeouts (draws) | 30 (1.5%) |
| Avg rounds (all) | 4.9 |
| Avg rounds (KO only) | 4.7 |
| Rounds P50 / P90 / Max | 4 / 10 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 232 |
| Avg rounds | 5.2 |
| P50 / P90 | 4 / 10 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 971/2000 |
| Winrate | 48.5% |
| Advantage over 50% | -1.5% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 243 | 317 | 76.7% |  |
| Asesino | 88 | 277 | 31.8% |  |
| Esquivo | 81 | 282 | 28.7% |  |
| Equilibrado | 133 | 277 | 48.0% |  |
| Extremista ATK | 134 | 276 | 48.6% |  |
| Extremista DEF | 211 | 269 | 78.4% | YES |
| Extremista ASPD | 131 | 275 | 47.6% |  |
| Extremista REF | 126 | 292 | 43.2% |  |
| Velocista | 72 | 278 | 25.9% |  |
| Berserker | 157 | 274 | 57.3% |  |
| Guardian | 188 | 317 | 59.3% |  |
| Estratega | 157 | 285 | 55.1% |  |
| Gladiador | 158 | 282 | 56.0% |  |
| Magus | 121 | 299 | 40.5% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 0.3 | 0 |
| Heal applied | 17.8 | - |
| Rests | 4.0 | 3 |
| Advances | 2.9 | - |
| Retreats | 0.5 | - |
| Battles with item use | 16.1% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 90.3% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 33.07 (avg 44.83) |
| ASPD spread (stddev) | 31.08 (avg 54.78) |
| Equipment tier A | 129 (3.2%) |
| Equipment tier B | 1680 (42.0%) |
| Equipment tier C | 694 (17.3%) |
| Equipment tier D | 1153 (28.8%) |
| Equipment tier S | 344 (8.6%) |
| Level 100-199 | 1084 |
| Level 200-299 | 1123 |
| Level 300-399 | 989 |
| Level 400-500 | 804 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 922 |
| cortante | 890 |
| desarmado | 386 |
| perforante | 1802 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| alta | 1307 | 49.7% |
| ligera | 16 | 37.5% |
| media | 121 | 43.8% |
| total | 2556 | 50.5% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 1-2 | 88 | 44.3% |
| 3+ | 3912 | 50.1% |
Set bonus active: 0.0% (0) vs inactive 50.0% (4000)

### Amulet
With amulet: 0.0% (0) vs without 50.0% (4000)

### Shield
With shield: 50.1% (2429) vs without 49.9% (1571)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 121 | 54.5% |
| B | 1516 | 58.5% |
| C | 638 | 45.1% |
| D | 1036 | 39.6% |
| S | 303 | 70.3% |
| desarmado | 386 | 35.2% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 851 | 48.8% |
| adamantita | 158 | 65.8% |
| bronce | 829 | 43.1% |
| desarmado | 386 | 35.2% |
| filo_estelar | 145 | 75.2% |
| hierro | 757 | 47.3% |
| mitril | 425 | 57.9% |
| titanio | 449 | 61.2% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 874 | 59.6% |
| mitico | 303 | 70.3% |
| ninguno | 386 | 35.2% |
| poco_comun | 2437 | 46.4% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 895 | 50.5% |
| adamantita | 184 | 53.8% |
| bronce | 914 | 50.0% |
| filo_estelar | 188 | 50.5% |
| hierro | 826 | 45.8% |
| mitril | 503 | 56.5% |
| titanio | 490 | 48.0% |

### Nature by level bracket
- **100-199**: contundente: 242, cortante: 226, desarmado: 118, perforante: 498
- **200-299**: contundente: 270, cortante: 271, desarmado: 85, perforante: 497
- **300-399**: contundente: 227, cortante: 214, desarmado: 109, perforante: 439
- **400-500**: contundente: 183, cortante: 179, desarmado: 74, perforante: 368

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 45.6% | 962 | 51.4% | 3038 | -5.7pp |
| d_fulgor | 45.2% | 987 | 51.6% | 3013 | -6.4pp |
| r_fulgor | 45.3% | 974 | 51.5% | 3026 | -6.2pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 24.1 | 1 | 128 | 10 | 21 | 34 |
| Asesino | 49.8 | 1 | 157 | 16 | 42 | 76 |
| Esquivo | 26.4 | 1 | 122 | 13 | 26 | 35 |
| Equilibrado | 37.6 | 1 | 149 | 18 | 35 | 50 |
| Extremista ATK | 58.4 | 1 | 190 | 29 | 59 | 86 |
| Extremista DEF | 21.0 | 0 | 123 | 7 | 18 | 29 |
| Extremista ASPD | 57.7 | 1 | 175 | 31 | 52 | 78 |
| Extremista REF | 32.6 | 1 | 131 | 15 | 28 | 45 |
| Velocista | 32.2 | 1 | 105 | 17 | 29 | 45 |
| Berserker | 63.1 | 1 | 172 | 26 | 69 | 91 |
| Guardian | 23.5 | 1 | 138 | 12 | 20 | 30 |
| Estratega | 34.2 | 1 | 136 | 18 | 30 | 49 |
| Gladiador | 50.4 | 1 | 167 | 21 | 45 | 76 |
| Magus | 46.0 | 1 | 166 | 21 | 40 | 66 |

## Dodge Effectiveness
| Personality | Attempts | Successes | Rate |
|-------------|----------|-----------|------|
| Tanque | 0 | 0 | 0.0% |
| Asesino | 0 | 0 | 0.0% |
| Esquivo | 0 | 0 | 0.0% |
| Equilibrado | 0 | 0 | 0.0% |
| Extremista ATK | 0 | 0 | 0.0% |
| Extremista DEF | 0 | 0 | 0.0% |
| Extremista ASPD | 0 | 0 | 0.0% |
| Extremista REF | 0 | 0 | 0.0% |
| Velocista | 0 | 0 | 0.0% |
| Berserker | 0 | 0 | 0.0% |
| Guardian | 0 | 0 | 0.0% |
| Estratega | 0 | 0 | 0.0% |
| Gladiador | 0 | 0 | 0.0% |
| Magus | 15 | 15 | 100.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 209 | 957 | 21.8% |
| Asesino | 128 | 709 | 18.1% |
| Esquivo | 509 | 841 | 60.5% |
| Equilibrado | 258 | 985 | 26.2% |
| Extremista ATK | 133 | 805 | 16.5% |
| Extremista DEF | 245 | 827 | 29.6% |
| Extremista ASPD | 92 | 633 | 14.5% |
| Extremista REF | 733 | 1017 | 72.1% |
| Velocista | 98 | 751 | 13.0% |
| Berserker | 120 | 692 | 17.3% |
| Guardian | 137 | 1249 | 11.0% |
| Estratega | 634 | 955 | 66.4% |
| Gladiador | 336 | 713 | 47.1% |
| Magus | 352 | 909 | 38.7% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 20 | 49 | 62 | 59 | 15 | 14 | 14 | 12 | 99 | 15 | 41 | 14 | 11 | 26 |
| 5 | 34 | 53 | 65 | 62 | 21 | 27 | 19 | 16 | 102 | 23 | 54 | 20 | 18 | 31 |
| 10 | 34 | 54 | 64 | 62 | 21 | 30 | 19 | 16 | 102 | 23 | 54 | 20 | 19 | 31 |
| 15 | 34 | 54 | 64 | 62 | 22 | 31 | 19 | 16 | 102 | 23 | 54 | 20 | 19 | 31 |
| 20 | 34 | 54 | 64 | 62 | 22 | 31 | 19 | 16 | 102 | 23 | 54 | 21 | 19 | 31 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 93.3% | 92.3% | 95.5% | 78.9% | 45.5% | 78.6% | 81.0% | 78.9% | 78.3% | 75.9% | 65.2% | 76.2% | 90.9% |
| Asesino | 6.7% | 50.0% | 61.9% | 29.2% | 29.6% | 5.3% | 44.4% | 47.4% | 84.2% | 9.5% | 11.1% | 22.7% | 23.1% | 31.8% |
| Esquivo | 7.7% | 38.1% | 50.0% | 22.2% | 15.8% | 11.8% | 36.4% | 40.0% | 63.2% | 17.4% | 25.0% | 29.4% | 9.1% | 28.0% |
| Equilibrado | 4.5% | 70.8% | 77.8% | 50.0% | 33.3% | 19.0% | 56.3% | 70.8% | 69.6% | 52.4% | 26.3% | 29.2% | 50.0% | 62.5% |
| Extremista ATK | 21.1% | 70.4% | 84.2% | 66.7% | 50.0% | 14.8% | 78.6% | 61.1% | 66.7% | 52.4% | 42.9% | 40.9% | 12.0% | 52.4% |
| Extremista DEF | 54.5% | 94.7% | 88.2% | 81.0% | 85.2% | 50.0% | 77.3% | 94.1% | 87.5% | 63.6% | 68.4% | 64.7% | 86.4% | 88.0% |
| Extremista ASPD | 21.4% | 55.6% | 63.6% | 43.8% | 21.4% | 22.7% | 50.0% | 45.5% | 84.2% | 31.6% | 28.6% | 45.5% | 66.7% | 70.0% |
| Extremista REF | 19.0% | 52.6% | 60.0% | 29.2% | 38.9% | 5.9% | 54.5% | 50.0% | 84.2% | 42.9% | 25.0% | 33.3% | 46.2% | 48.1% |
| Velocista | 21.1% | 15.8% | 36.8% | 30.4% | 33.3% | 12.5% | 15.8% | 15.8% | 50.0% | 21.1% | 14.3% | 35.3% | 12.5% | 38.9% |
| Berserker | 21.7% | 90.5% | 82.6% | 47.6% | 47.6% | 36.4% | 68.4% | 57.1% | 78.9% | 50.0% | 33.3% | 62.5% | 54.2% | 73.3% |
| Guardian | 24.1% | 88.9% | 75.0% | 73.7% | 57.1% | 31.6% | 71.4% | 75.0% | 85.7% | 66.7% | 50.0% | 53.8% | 29.2% | 60.0% |
| Estratega | 34.8% | 77.3% | 70.6% | 70.8% | 59.1% | 35.3% | 54.5% | 66.7% | 64.7% | 37.5% | 46.2% | 50.0% | 50.0% | 62.5% |
| Gladiador | 23.8% | 76.9% | 90.9% | 50.0% | 88.0% | 13.6% | 33.3% | 53.8% | 87.5% | 45.8% | 70.8% | 50.0% | 50.0% | 66.7% |
| Magus | 9.1% | 68.2% | 72.0% | 37.5% | 47.6% | 12.0% | 30.0% | 51.9% | 61.1% | 26.7% | 40.0% | 37.5% | 33.3% | 50.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.5% | 1027 |
| 16-30 | 47.9% | 862 |
| 31-50 | 48.9% | 597 |
| 51-70 | 52.4% | 391 |
| 71-100 | 50.8% | 1123 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 36.5% | 1319 |
| 16-30 | 47.3% | 961 |
| 31-50 | 56.0% | 612 |
| 51-70 | 59.1% | 320 |
| 71-100 | 67.4% | 788 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 59.8% | 448 |
| 16-30 | 49.0% | 745 |
| 31-50 | 48.9% | 798 |
| 51-70 | 42.7% | 525 |
| 71-100 | 50.7% | 1484 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.8% | 846 |
| 16-30 | 47.8% | 1008 |
| 31-50 | 51.4% | 732 |
| 51-70 | 51.8% | 467 |
| 71-100 | 48.8% | 947 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.1% | 1494 |
| 16-30 | 54.7% | 1150 |
| 31-50 | 53.5% | 649 |
| 51-70 | 47.7% | 310 |
| 71-100 | 32.2% | 397 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.4% | 3204 |
| 16-30 | 43.0% | 463 |
| 31-50 | 46.6% | 251 |
| 51-70 | 45.2% | 73 |
| 71-100 | 55.6% | 9 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.0% | 3217 |
| 16-30 | 46.1% | 460 |
| 31-50 | 45.7% | 243 |
| 51-70 | 44.2% | 77 |
| 71-100 | 33.3% | 3 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 51.2% | 3214 |
| 16-30 | 43.4% | 454 |
| 31-50 | 47.1% | 259 |
| 51-70 | 47.0% | 66 |
| 71-100 | 42.9% | 7 |
