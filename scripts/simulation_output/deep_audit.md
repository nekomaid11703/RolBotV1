# Auditoría profunda — baseline 10k

Fecha: 2026-08-06T18:58:07.548Z · Sims: 10000 · Máx rounds: 20
Filtro de nivel: parejas con |Δnivel| ≤ 10% (control de confound)

## 1. Winrate por personalidad (global, sin control de nivel)

Referencia: emparejamiento aleatorio → el winrate esperado si todas fueran iguales es 50%. Meta = la que supere el 55%.

| Grupo | Winrate | n |
|-------|---------|----|
| tanque | 65.5% | 1480 |
| gladiador | 65.4% | 1464 |
| extremista_defensa | 64.4% | 1448 |
| estratega | 60.4% | 1392 |
| berserker | 59.6% | 1392 |
| extremista_ataque | 57.6% | 1496 |
| extremista_reflejos | 57.4% | 1410 |
| extremista_velocidad | 55.3% | 1392 |
| guardian | 51.9% | 1425 |
| magus | 45.4% | 1414 |
| equilibrado | 41.2% | 1419 |
| asesino | 30.2% | 1485 |
| esquivo | 26.2% | 1421 |
| velocista | 17.3% | 1362 |

## 2. Matchup winrate A vs B (parejas con nivel similar)

Lee la celda (fila build A, columna build B) = winrate de A cuando pelea contra B. Detrás de la diagonal está el espejo.

| A\B | asesino | berserke | equilibr | esquivo | estrateg | extremis | extremis | extremis | extremis | gladiado | guardian | magus | tanque | velocist |
|-----|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
| asesino | – | – | – | 45% | 19% | 22% | 0% | – | – | – | – | – | 11% | – |
| berserker | – | – | – | 88% | – | 47% | – | 53% | 31% | 45% | – | 72% | – | – |
| equilibrado | – | 41% | 35% | – | – | – | – | 47% | – | – | 40% | 47% | – | 61% |
| esquivo | 0% | – | – | – | – | 6% | – | 17% | – | 11% | – | 6% | 19% | – |
| estratega | – | – | 82% | 87% | 25% | – | 31% | – | – | – | – | – | – | 100% |
| extremista_a | – | 20% | 79% | 82% | – | – | 40% | 50% | 47% | 21% | – | 71% | 40% | – |
| extremista_d | – | – | 69% | 90% | – | – | 26% | – | – | 52% | – | – | – | – |
| extremista_r | – | – | 59% | 75% | – | – | 20% | – | – | – | – | 73% | – | – |
| extremista_v | 50% | – | – | – | – | – | 24% | 42% | 47% | – | – | – | – | – |
| gladiador | – | 47% | 69% | 94% | 47% | 63% | – | 53% | 53% | – | 88% | 53% | 55% | – |
| guardian | – | – | – | 50% | – | 73% | – | – | – | – | – | – | 33% | – |
| magus | – | – | 38% | 63% | – | 18% | 40% | – | – | – | – | 44% | – | 67% |
| tanque | 74% | – | – | 56% | 40% | 69% | – | – | 56% | – | 63% | 82% | 56% | – |
| velocista | – | 5% | – | – | 12% | – | – | – | – | – | – | – | – | 24% |

## 3. Efecto del equipamiento (parejas con nivel similar)

### 3.1 Naturaleza de arma

| Grupo | Winrate | n |
|-------|---------|----|
| cortante | 60.4% | 1231 |
| perforante | 52.8% | 2462 |
| contundente | 39.5% | 1192 |
| desarmado | 35.5% | 499 |

### 3.2 Tier del arma

| Grupo | Winrate | n |
|-------|---------|----|
| S | 66.4% | 435 |
| A | 59.2% | 267 |
| B | 51.0% | 2167 |
| C | 50.8% | 721 |
| D | 45.9% | 1295 |

### 3.3 Material del arma

| Grupo | Winrate | n |
|-------|---------|----|
| adamantita | 69.2% | 211 |
| filo_estelar | 63.8% | 224 |
| titanio | 59.1% | 621 |
| mitril | 56.2% | 635 |
| acero | 50.3% | 1045 |
| hierro | 47.7% | 1049 |
| bronce | 43.1% | 1100 |
| desarmado | 35.5% | 499 |

### 3.4 Rareza del material del arma

| Grupo | Winrate | n |
|-------|---------|----|
| mitico | 66.4% | 435 |
| epico | 57.6% | 1256 |
| poco_comun | 47.0% | 3194 |
| ninguno | 35.5% | 499 |

### 3.5 Cobertura dominante

| Grupo | Winrate | n |
|-------|---------|----|
| total | 50.4% | 3430 |
| alta | 49.7% | 1757 |
| media | 46.3% | 177 |

### 3.6 Con munición (arquero)

| Grupo | Winrate | n |
|-------|---------|----|
| con munición | 53.2% | 1216 |
| sin munición | 52.3% | 1246 |
| no ranged | 47.6% | 2922 |

### 3.7 Con escudo

| Grupo | Winrate | n |
|-------|---------|----|
| con escudo | 51.1% | 3206 |
| sin escudo | 48.3% | 2178 |

### 3.8 Con amuleto

| Grupo | Winrate | n |
|-------|---------|----|
| con amuleto | 51.5% | 2094 |
| sin amuleto | 49.0% | 3290 |

### 3.9 Set bonus activo

| Grupo | Winrate | n |
|-------|---------|----|
| set activo | 50.0% | 5262 |
| set inactivo | 48.4% | 122 |

## 4. Winrate del set bonus / amuleto / escudo por bracket de nivel (¿progresión o balance?)

Si el set/amuleto dieran progresión pura, su efecto sería constante; si fueran balance, el winrate sería ~50% en todo bracket.

### Set bonus activo

| Bracket nivel | Winrate con | n | Winrate sin | n | Diff |
|---------------|-------------|----|-------------|----|------|
| 100–199 | 49.5% | 1280 | 44.4% | 27 | 5.0pp |
| 200–299 | 50.5% | 1143 | 41.4% | 29 | 9.1pp |
| 300–399 | 49.1% | 1160 | 51.9% | 27 | -2.7pp |
| 400–500 | 50.7% | 1679 | 53.8% | 39 | -3.2pp |

### Amuleto

| Bracket nivel | Winrate con | n | Winrate sin | n | Diff |
|---------------|-------------|----|-------------|----|------|
| 100–199 | 49.8% | 478 | 49.1% | 829 | 0.7pp |
| 200–299 | 52.2% | 425 | 49.1% | 747 | 3.1pp |
| 300–399 | 51.6% | 483 | 47.6% | 704 | 4.0pp |
| 400–500 | 52.3% | 708 | 49.7% | 1010 | 2.6pp |

### Escudo

| Bracket nivel | Winrate con | n | Winrate sin | n | Diff |
|---------------|-------------|----|-------------|----|------|
| 100–199 | 48.8% | 783 | 50.2% | 524 | -1.4pp |
| 200–299 | 50.4% | 689 | 50.1% | 483 | 0.3pp |
| 300–399 | 52.5% | 689 | 44.6% | 498 | 8.0pp |
| 400–500 | 52.4% | 1045 | 48.1% | 673 | 4.3pp |

## 5. Meta y anti-meta (winrate de cada personalidad con el equipo que le tocó)

Descompone el winrate global de cada personalidad según armó/perdió el bono de set. Un build que depende del set para ganar es frágil (anti-meta lo quita).

| Build | Winrate | n |
|-------|---------|----|
| gladiador · set SÍ | 66.7% | 412 |
| extremista_defensa · set SÍ | 64.2% | 399 |
| estratega · set SÍ | 63.1% | 360 |
| tanque · set SÍ | 61.8% | 393 |
| berserker · set SÍ | 60.3% | 353 |
| extremista_reflejos · set SÍ | 58.5% | 357 |
| extremista_ataque · set SÍ | 57.6% | 401 |
| extremista_velocidad · set SÍ | 54.1% | 357 |
| guardian · set SÍ | 52.4% | 353 |
| equilibrado · set SÍ | 45.4% | 390 |
| magus · set SÍ | 42.6% | 373 |
| asesino · set SÍ | 30.9% | 363 |
| esquivo · set SÍ | 23.1% | 389 |
| velocista · set SÍ | 16.9% | 362 |

**Meta**: gladiador · set SÍ ≈ 66.7% · **Anti-meta/peor**: velocista · set SÍ ≈ 16.9%

## 6. Duración media de la pelea por personalidad (¿builds que estiran o matan rápido?)

| Personalidad | Duración media | Daño/turno medio | Winrate | n |
|--------------|----------------|------------------|---------|----|
| extremista_defensa | 11.04 | 24.0 | 64.4% | 1448 |
| tanque | 9.28 | 24.8 | 65.5% | 1480 |
| guardian | 8.83 | 21.8 | 51.9% | 1425 |
| extremista_reflejos | 8.00 | 29.3 | 57.4% | 1410 |
| estratega | 7.25 | 32.6 | 60.4% | 1392 |
| extremista_velocidad | 5.82 | 44.5 | 55.3% | 1392 |
| gladiador | 5.79 | 49.7 | 65.4% | 1464 |
| esquivo | 5.50 | 16.3 | 26.2% | 1421 |
| equilibrado | 5.45 | 26.8 | 41.2% | 1419 |
| magus | 5.19 | 38.8 | 45.4% | 1414 |
| extremista_ataque | 5.11 | 52.5 | 57.6% | 1496 |
| berserker | 4.98 | 53.5 | 59.6% | 1392 |
| asesino | 4.22 | 31.6 | 30.2% | 1485 |
| velocista | 3.79 | 12.2 | 17.3% | 1362 |

## 7. Builds que llevan a timeout (pelea que no muere)

| Personalidad | Tasa de timeout | n |
|--------------|-----------------|----|
| extremista_defensa | 18.9% | 1448 |
| guardian | 10.7% | 1425 |
| tanque | 10.2% | 1480 |
| extremista_reflejos | 6.5% | 1410 |
| estratega | 5.7% | 1392 |
| esquivo | 2.7% | 1421 |
| equilibrado | 2.2% | 1419 |
| extremista_velocidad | 1.7% | 1392 |
| gladiador | 1.4% | 1464 |
| magus | 1.0% | 1414 |
| extremista_ataque | 0.7% | 1496 |
| velocista | 0.6% | 1362 |
| berserker | 0.5% | 1392 |
| asesino | 0.5% | 1485 |

## 8. Perfil de stats real por personalidad (media por 100 de nivel)

| Personalidad | ATK | DEF | ASPD | REF | MSPD | HP |
|--------------|---|---|---|---|---|---|
| berserker | 32.2 | 12.2 | 19.9 | 7.4 | 4.9 | 12.1 |
| extremista_velocidad | 19.8 | 12.3 | 32.2 | 7.3 | 4.8 | 12.1 |
| equilibrado | 14.8 | 20.9 | 13.1 | 13.6 | 13.6 | 14.3 |
| extremista_ataque | 33.0 | 12.1 | 18.9 | 7.4 | 4.9 | 12.2 |
| gladiador | 25.0 | 14.9 | 19.7 | 14.7 | 4.8 | 10.8 |
| guardian | 6.7 | 31.6 | 8.3 | 8.6 | 11.6 | 23.1 |
| extremista_defensa | 7.1 | 36.2 | 5.3 | 11.3 | 5.7 | 22.6 |
| extremista_reflejos | 8.8 | 12.1 | 18.6 | 32.1 | 4.8 | 12.2 |
| esquivo | 7.5 | 22.2 | 9.9 | 25.9 | 15.0 | 9.7 |
| magus | 19.8 | 14.7 | 24.9 | 12.6 | 7.4 | 10.8 |
| asesino | 26.4 | 12.5 | 22.8 | 8.2 | 11.0 | 9.0 |
| velocista | 6.6 | 12.9 | 19.8 | 11.3 | 27.8 | 10.8 |
| tanque | 7.0 | 33.1 | 13.2 | 7.4 | 7.4 | 21.7 |
| estratega | 11.4 | 16.1 | 18.2 | 25.2 | 5.9 | 13.3 |

## 9. Desempate por HP residual en timeouts (¿defensa roba empates?)

De 455 timeouts, el ganador tiene más HP residual en 49.9% (regla del motor).

¿La build con más DEF total gana el desempate?

| Condición (en timeouts) | Winrate | n |
|-------------------------|---------|----|
| extremista_defensa · armorBonusDef>=200:true | 64.6% | 130 |
| tanque · armorBonusDef>=200:true | 62.9% | 62 |
| extremista_defensa · set:true | 62.7% | 271 |
| guardian · armorBonusDef>=200:true | 62.5% | 64 |
| extremista_defensa · def>=60:true | 62.3% | 265 |
| extremista_defensa · armorBonusDef>=200:false | 60.8% | 143 |
| guardian · def>=60:true | 60.5% | 124 |
| tanque · set:true | 60.3% | 146 |
| guardian · set:true | 59.3% | 150 |
| tanque · def>=60:true | 59.1% | 137 |
| guardian · def>=60:false | 58.6% | 29 |
| guardian · armorBonusDef>=200:false | 58.4% | 89 |
| tanque · armorBonusDef>=200:false | 58.4% | 89 |
| equilibrado · armorBonusDef>=200:true | 50.0% | 16 |
| extremista_reflejos · armorBonusDef>=200:true | 39.5% | 38 |

Interpretación: si las condiciones defensivas superan 50% en timeouts, la defensa roba empates (sesgo del desempate por HP residual).

## Veredicto (resumen de hallazgos)

- **Meta**: gladiador 66.9% (n=420) — por encima del target 55%.
- **Builds malas**: magus 42.4%, asesino 31.1%, esquivo 23.1%, velocista 16.8% (target: ninguna < 45% con n≥50).
- **Sesgo de nivel**: ver sección de auditoría estándar (el mayor nivel gana ≈29% — nivel NO predice victoria).
- **Ventaja 1er atacante**: ver auditoría estándar (target ≤5%).

