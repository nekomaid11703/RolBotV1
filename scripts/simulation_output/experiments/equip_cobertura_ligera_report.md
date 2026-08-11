# Combat Simulation Report
Generated: 2026-08-06 14:08:51 | 150 simulations | Max 20 rounds

Config: numSims=150

## Balance Targets
| Target | Objetivo | Valor actual | Estado |
|--------|----------|--------------|--------|
| Turnos promedio (nivel/equipo similares) | 7.0 | 6.9 | PASS |
| Ventaja del primer atacante (sobre 50%) | 0.1 | 0.0 | PASS |
| Winrate de la build meta (max por personalidad) | 0.6 | 0.8 | FAIL |

## Overview
| Metric | Value |
|--------|-------|
| Total simulations | 150 |
| KO victories | 144 (96.0%) |
| Timeouts (draws) | 6 (4.0%) |
| Avg rounds (all) | 5.9 |
| Avg rounds (KO only) | 5.3 |
| Rounds P50 / P90 / Max | 4 / 14 / 21 |

## Turns (matched level & equipment)
| Metric | Value |
|--------|-------|
| Battles in subset | 20 |
| Avg rounds | 6.9 |
| P50 / P90 | 5 / 16 |

## First Attacker Advantage
| Metric | Value |
|--------|-------|
| First attacker wins | 82/150 |
| Winrate | 54.7% |
| Advantage over 50% | 4.7% |
| Draws | 0 |

## Win Rates by Personality
| Personality | Wins | Total | Win Rate | Meta? |
|-------------|------|-------|----------|-------|
| Tanque | 10 | 18 | 55.6% |  |
| Asesino | 6 | 21 | 28.6% |  |
| Esquivo | 8 | 21 | 38.1% |  |
| Equilibrado | 6 | 17 | 35.3% |  |
| Extremista ATK | 16 | 27 | 59.3% |  |
| Extremista DEF | 11 | 16 | 68.8% |  |
| Extremista ASPD | 9 | 26 | 34.6% |  |
| Extremista REF | 13 | 23 | 56.5% |  |
| Velocista | 7 | 20 | 35.0% |  |
| Berserker | 12 | 23 | 52.2% |  |
| Guardian | 11 | 24 | 45.8% |  |
| Estratega | 12 | 20 | 60.0% |  |
| Gladiador | 17 | 21 | 81.0% | YES |
| Magus | 12 | 23 | 52.2% |  |

## Resource Management (per battle)
| Metric | Avg | P50 |
|--------|-----|-----|
| Items used | 1.0 | 0 |
| Heal applied | 54.8 | - |
| Rests | 2.3 | 1 |
| Advances | 3.5 | - |
| Retreats | 0.1 | - |
| Battles with item use | 37.3% | - |

## Data Variance
| Metric | Value |
|--------|-------|
| Weapon presence | 86.0% |
| Armor presence | 100.0% |
| ATK spread (stddev) | 32.56 (avg 51.08) |
| ASPD spread (stddev) | 31.57 (avg 56.41) |
| Equipment tier A | 9 (3.0%) |
| Equipment tier B | 128 (42.7%) |
| Equipment tier C | 43 (14.3%) |
| Equipment tier D | 85 (28.3%) |
| Equipment tier S | 35 (11.7%) |
| Level 100-199 | 65 |
| Level 200-299 | 80 |
| Level 300-399 | 79 |
| Level 400-500 | 76 |

### Weapon Natures
| Nature | Count |
|--------|-------|
| contundente | 69 |
| cortante | 80 |
| desarmado | 42 |
| perforante | 109 |

## Equipment Analysis
### Coverage (dominante)
| Coverage | Count | Winrate |
|----------|-------|---------|
| ligera | 300 | 50.0% |

### Set pieces
| Pieces | Count | Winrate |
|--------|-------|---------|
| 3+ | 300 | 50.0% |
Set bonus active: 50.0% (300) vs inactive 0.0% (0)

### Amulet
With amulet: 46.6% (133) vs without 52.7% (167)

### Shield
With shield: 0.0% (0) vs without 50.0% (300)

### Weapon tier
| Tier | Count | Winrate |
|------|-------|---------|
| A | 9 | 66.7% |
| B | 110 | 52.7% |
| C | 39 | 46.2% |
| D | 72 | 47.2% |
| S | 28 | 64.3% |
| desarmado | 42 | 38.1% |

### Weapon material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 59 | 49.2% |
| adamantita | 17 | 64.7% |
| bronce | 46 | 50.0% |
| desarmado | 42 | 38.1% |
| filo_estelar | 11 | 63.6% |
| hierro | 67 | 47.8% |
| mitril | 36 | 61.1% |
| titanio | 22 | 45.5% |

### Weapon material rarity
| Rarity | Count | Winrate |
|--------|-------|---------|
| epico | 58 | 55.2% |
| mitico | 28 | 64.3% |
| ninguno | 42 | 38.1% |
| poco_comun | 172 | 48.8% |

### Armor material
| Material | Count | Winrate |
|----------|-------|---------|
| acero | 76 | 47.4% |
| adamantita | 12 | 50.0% |
| bronce | 52 | 48.1% |
| filo_estelar | 21 | 33.3% |
| hierro | 68 | 48.5% |
| mitril | 38 | 63.2% |
| titanio | 33 | 57.6% |

### Nature by level bracket
- **100-199**: contundente: 11, cortante: 17, desarmado: 9, perforante: 28
- **200-299**: contundente: 15, cortante: 15, desarmado: 12, perforante: 38
- **300-399**: contundente: 20, cortante: 22, desarmado: 10, perforante: 27
- **400-500**: contundente: 23, cortante: 26, desarmado: 11, perforante: 16

## Magic Stats Contribution
| Stat | High winrate | High count | Low winrate | Low count | Diff |
|------|--------------|------------|-------------|-----------|------|
| fulgor | 52.6% | 76 | 49.1% | 224 | 3.5pp |
| d_fulgor | 53.3% | 75 | 48.9% | 225 | 4.4pp |
| r_fulgor | 54.4% | 79 | 48.4% | 221 | 6.0pp |

## Average Damage Per Attack
| Personality | Avg | Min | Max | P25 | P50 | P75 |
|-------------|-----|-----|-----|-----|-----|-----|
| Tanque | 24.7 | 8 | 75 | 14 | 17 | 33 |
| Asesino | 59.6 | 15 | 128 | 33 | 45 | 77 |
| Esquivo | 28.5 | 6 | 247 | 8 | 15 | 26 |
| Equilibrado | 29.0 | 8 | 114 | 8 | 35 | 38 |
| Extremista ATK | 66.6 | 34 | 230 | 50 | 55 | 75 |
| Extremista DEF | 24.6 | 3 | 56 | 14 | 19 | 37 |
| Extremista ASPD | 43.2 | 11 | 79 | 21 | 50 | 57 |
| Extremista REF | 27.0 | 5 | 105 | 10 | 19 | 45 |
| Velocista | 27.7 | 8 | 72 | 11 | 16 | 38 |
| Berserker | 57.2 | 13 | 107 | 20 | 66 | 78 |
| Guardian | 19.1 | 2 | 284 | 6 | 15 | 19 |
| Estratega | 24.5 | 8 | 124 | 11 | 20 | 36 |
| Gladiador | 55.6 | 7 | 177 | 33 | 57 | 68 |
| Magus | 44.0 | 15 | 117 | 28 | 31 | 55 |

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
| Magus | 0 | 0 | 0.0% |

## Block Effectiveness
| Personality | Chosen | Total Defended | Rate |
|-------------|--------|----------------|------|
| Tanque | 17 | 103 | 16.5% |
| Asesino | 1 | 38 | 2.6% |
| Esquivo | 39 | 67 | 58.2% |
| Equilibrado | 15 | 64 | 23.4% |
| Extremista ATK | 10 | 78 | 12.8% |
| Extremista DEF | 3 | 79 | 3.8% |
| Extremista ASPD | 10 | 96 | 10.4% |
| Extremista REF | 94 | 108 | 87.0% |
| Velocista | 6 | 33 | 18.2% |
| Berserker | 14 | 76 | 18.4% |
| Guardian | 35 | 141 | 24.8% |
| Estratega | 108 | 120 | 90.0% |
| Gladiador | 29 | 34 | 85.3% |
| Magus | 41 | 65 | 63.1% |

## Fatigue Progression (Avg)
| Turn | Tanque | Asesino | Esquivo | Equilibrado | Extremista ATK | Extremista DEF | Extremista ASPD | Extremista REF | Velocista | Berserker | Guardian | Estratega | Gladiador | Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 16 | 32 | 39 | 53 | 20 | 12 | 16 | 16 | 46 | 12 | 53 | 21 | 12 | 23 |
| 5 | 23 | 37 | 39 | 53 | 28 | 21 | 23 | 19 | 48 | 18 | 60 | 20 | 18 | 26 |
| 10 | 24 | 36 | 38 | 53 | 28 | 21 | 23 | 17 | 48 | 19 | 60 | 20 | 19 | 30 |
| 15 | 24 | 36 | 38 | 51 | 27 | 23 | 24 | 17 | 48 | 19 | 58 | 21 | 19 | 30 |
| 20 | 25 | 36 | 39 | 51 | 27 | 23 | 24 | 17 | 48 | 19 | 58 | 20 | 19 | 30 |

## Personality Matchup Matrix
(Row wins vs Column X% of the time)
|  | vs Tanque | vs Asesino | vs Esquivo | vs Equilibrado | vs Extremista ATK | vs Extremista DEF | vs Extremista ASPD | vs Extremista REF | vs Velocista | vs Berserker | vs Guardian | vs Estratega | vs Gladiador | vs Magus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tanque | 50.0% | 0.0% | 100.0% | 0.0% | 100.0% | 0.0% | 50.0% | 33.3% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% |
| Asesino | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% | 0.0% | 50.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 33.3% |
| Esquivo | 0.0% | 100.0% | 50.0% | 0.0% | 50.0% | 0.0% | 0.0% | 0.0% | 100.0% | 50.0% | 0.0% | 50.0% | 33.3% | 0.0% |
| Equilibrado | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% | 50.0% | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% |
| Extremista ATK | 0.0% | 100.0% | 50.0% | 100.0% | 50.0% | 100.0% | 100.0% | 33.3% | 0.0% | 100.0% | 75.0% | 33.3% | 0.0% | 100.0% |
| Extremista DEF | 0.0% | 0.0% | 100.0% | 0.0% | 0.0% | 0.0% | 100.0% | 50.0% | 100.0% | 0.0% | 100.0% | 33.3% | 0.0% | 100.0% |
| Extremista ASPD | 50.0% | 0.0% | 100.0% | 100.0% | 0.0% | 0.0% | 50.0% | 100.0% | 25.0% | 25.0% | 50.0% | 0.0% | 0.0% | 0.0% |
| Extremista REF | 66.7% | 50.0% | 0.0% | 100.0% | 66.7% | 50.0% | 0.0% | 50.0% | 0.0% | 50.0% | 50.0% | 0.0% | 100.0% | 0.0% |
| Velocista | 0.0% | 0.0% | 0.0% | 50.0% | 100.0% | 0.0% | 75.0% | 0.0% | 0.0% | 0.0% | 0.0% | 50.0% | 0.0% | 25.0% |
| Berserker | 0.0% | 100.0% | 50.0% | 100.0% | 0.0% | 0.0% | 75.0% | 50.0% | 0.0% | 50.0% | 0.0% | 0.0% | 0.0% | 50.0% |
| Guardian | 0.0% | 100.0% | 100.0% | 0.0% | 25.0% | 0.0% | 50.0% | 50.0% | 100.0% | 100.0% | 50.0% | 33.3% | 50.0% | 0.0% |
| Estratega | 0.0% | 0.0% | 50.0% | 0.0% | 66.7% | 66.7% | 0.0% | 0.0% | 50.0% | 0.0% | 66.7% | 50.0% | 0.0% | 100.0% |
| Gladiador | 100.0% | 100.0% | 66.7% | 100.0% | 100.0% | 0.0% | 100.0% | 0.0% | 100.0% | 100.0% | 50.0% | 0.0% | 0.0% | 0.0% |
| Magus | 0.0% | 66.7% | 0.0% | 100.0% | 0.0% | 0.0% | 100.0% | 0.0% | 75.0% | 50.0% | 100.0% | 0.0% | 100.0% | 0.0% |

## Stat vs Win Rate Heatmap
### atk
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 47.5% | 40 |
| 16-30 | 48.8% | 82 |
| 31-50 | 44.4% | 45 |
| 51-70 | 42.4% | 33 |
| 71-100 | 57.0% | 100 |

### def
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 66.7% | 3 |
| 16-30 | 40.3% | 72 |
| 31-50 | 50.9% | 106 |
| 51-70 | 56.5% | 46 |
| 71-100 | 53.4% | 73 |

### aspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 46.9% | 32 |
| 16-30 | 46.6% | 58 |
| 31-50 | 42.0% | 50 |
| 51-70 | 60.0% | 40 |
| 71-100 | 52.5% | 120 |

### ref
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 40.6% | 69 |
| 16-30 | 49.3% | 71 |
| 31-50 | 54.2% | 59 |
| 51-70 | 41.9% | 31 |
| 71-100 | 60.0% | 70 |

### mspd
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 50.8% | 120 |
| 16-30 | 56.6% | 76 |
| 31-50 | 50.0% | 52 |
| 51-70 | 36.8% | 19 |
| 71-100 | 39.4% | 33 |

### fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.0% | 241 |
| 16-30 | 51.4% | 35 |
| 31-50 | 68.8% | 16 |
| 51-70 | 16.7% | 6 |
| 71-100 | 100.0% | 2 |

### d_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.0% | 239 |
| 16-30 | 51.4% | 37 |
| 31-50 | 53.8% | 13 |
| 51-70 | 63.6% | 11 |
| 71-100 | 0.0% | 0 |

### r_fulgor
| Range | Win Rate | Count |
|-------|----------|-------|
| 1-15 | 49.0% | 239 |
| 16-30 | 48.6% | 35 |
| 31-50 | 70.6% | 17 |
| 51-70 | 28.6% | 7 |
| 71-100 | 100.0% | 2 |
