# Combat Pipeline Multi-Model — Plan de Implementación

## Arquitectura General

```
                    ┌──────────────────────────────────────────┐
                    │         COMBAT BUFFER (objeto JSON)       │
                    │  { classification, mechanics, infractions, │
                    │    actionResult, narrative, errors[] }     │
                    └──────────────────────────────────────────┘
                                ▲         ▲         ▲
               ┌────────────────┘         │         └────────────────┐
               ▼                          ▼                          ▼
     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
     │   STEP 1:        │     │   STEP 2:        │     │   STEP 3:        │
     │   CLASIFICADOR   │     │   MECÁNICAS      │     │   NARRADOR       │
     │   DeepSeek Chat  │     │   Gemini Flash   │     │ NaraRouter V3.2  │
     │   temp: 0.1      │     │   temp: 0.2      │     │   temp: 0.7      │
     │   jsonMode: true  │     │   jsonMode: true  │     │   jsonMode: true  │
     │   prompt: ~200t   │     │   prompt: ~600t   │     │   prompt: ~400t   │
     └────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
              │                        │                        │
        Si falla:                 Si falla:               Si falla:
        combatParser.parse()      extractZone/Weapon()    combat.templates.js
        (regex, 0 tokens)         (regex, 0 tokens)       (0 tokens, 100%)
              │                        │                        │
              └───────────┬────────────┘────────────────────────┘
                          ▼
              ┌──────────────────────┐
              │   STEP 4: EJECUTOR   │
              │   (código puro)      │
              │   executeValidatedOutput() + combatEngine
              │   Siempre funciona   │
              └──────────────────────┘
```

## Diseño del Buffer

**Archivo nuevo:** `src/services/rpg/combatBuffer.js`

```js
class CombatBuffer {
  constructor(ctx) {
    this.inputText = ctx.text;
    this.room = ctx.room;
    this.participant = ctx.participant;
    this.inventory = ctx.inventory;
    this.status = 'pending';
    
    this.classification = null;
    this.mechanics = null;
    this.infractions = [];
    this.coherent = true;
    this.coherenceIssues = [];
    this.environmentalEffect = null;
    this.abilityId = null;
    this.abilityResult = null;
    this.actionResult = null;
    this.narrative = null;
    this.tone = null;
    
    this.errors = [];
    this.modelsUsed = {};
  }
}
```

## Diseño de Prompts

### STEP 1 — Classification Prompt (classification.prompt.md)

```
## CLASIFICACIÓN DE ACCIÓN

Texto del jugador: "{text}"

Clasifica esta acción entre:
- **attack**: ataque directo (golpear, cortar, disparar, lanzar, hechizar)
- **defend**: defensa (bloquear, esquivar, cubrirse, proteger)
- **flee**: huir (escapar, retirarse, correr)
- **interact**: observar (mirar, examinar, analizar, inspeccionar, explorar)
- **transition**: acción auxiliar (tomar objeto, cambiar arma, beber poción)
- **use_item**: usar objeto consumible

Reglas:
- Si describe preparación/observación SIN verbos de ataque → interact
- Si es principalmente diálogo sin acción → interact
- Si hay verbo de ataque + zona → attack
- Si hay "defender/esquivar/bloquear" → defend

Responde SOLO este JSON:
{"action_type":"string","intent":"ofensivo|defensivo|retirada|auxiliar","target_id":"string|null","confidence":0.0-1.0}
```

### STEP 2 — Mechanics Prompt (inline en código)

```
## MECÁNICAS DE COMBATE

Acción: {action_type} ({intent})

Personaje: {name}
Arma equipada: {weapon}
Habilidades disponibles: {abilities}
Fulgor: {fulgor}/{maxFulgor} | Fatiga: {fatiga}/10
Aturdido: {stunned}
Zonas dañadas: {damagedZones}
Enemigos vivos: {enemies}

{IF attack}
Determina zona de impacto y si usa habilidad.
{ENDIF}

Responde JSON:
{"zone":"cuerpo|null","weapon":"string|null","ability_id":"string|null","move_number":1|2,"is_attempt":bool}
```

### STEP 3 — Ya existe: `combatNarrator.buildNarrativePrompt()`

## Checklist de Implementación

### Fase 0: Preparación (Prerequisitos)
- [ ] Confirmar que `NARAROUTER_API_KEY` funciona
- [ ] Verificar fix de `OBSERVATION_SYNONYMS` en `combatParser.js`
- [ ] Verificar fix de `supabase` import en `groupActivityService.js`

### Fase 1: Infraestructura Base
- [ ] **1.1** — Crear `src/services/rpg/combatBuffer.js`
- [ ] **1.2** — Crear `src/services/rpg/narrativePrompts/classification.prompt.md`
- [ ] **1.3** — Agregar `jsonMode` a `aiOrchestrator.generateText()`
- [ ] **1.4** — Modificar `deepseekProvider.js` para `jsonMode`
- [ ] **1.5** — Modificar `geminiProvider.js` para `jsonMode`
- [ ] **1.6** — Modificar `nararouterProvider.js` para `jsonMode`
- [ ] **1.7** — Modificar `openrouterProvider.js` para `jsonMode`

### Fase 2: Pipeline Steps en combatRefereeService.js
- [ ] **2.1** — Importar `CombatBuffer` y prompt de clasificación
- [ ] **2.2** — Implementar `runStep1Classification(buffer)`
- [ ] **2.3** — Implementar `runStep2Mechanics(buffer)`
- [ ] **2.4** — Implementar `runStep3Narration(buffer)`
- [ ] **2.5** — Implementar `runStep4Execute(buffer)`
- [ ] **2.6** — Implementar `runStep5Assemble(buffer)`

### Fase 3: Integración
- [ ] **3.1** — Modificar `processRoleplay()` con feature flag
- [ ] **3.2** — Actualizar cacheo con buffer hash
- [ ] **3.3** — Actualizar `module.exports`

### Fase 4: Testing
- [ ] **4.1** — Test unitario: `CombatBuffer`
- [ ] **4.2** — Test unitario: Prompt de clasificación
- [ ] **4.3** — Test integración: Pipeline con ataque
- [ ] **4.4** — Test integración: Pipeline con observación
- [ ] **4.5** — Test integración: Pipeline con defensa
- [ ] **4.6** — Test integración: Fallo en paso 1
- [ ] **4.7** — Test integración: Fallo en paso 3
- [ ] **4.8** — Verificar fallback legacy

## Análisis de Riesgos

| Riesgo | Prob | Impacto | Mitigación |
|--------|------|---------|------------|
| NaraRouter caído (502) | Media | Medio | Fallback a `combat.templates.js` |
| DeepSeek rate limit | Baja | Medio | Fallback a `combatParser.js` regex |
| Gemini rate limit | Baja | Bajo | Fallback a `extractZone/Weapon` regex |
| Latencia alta (3 llamadas) | Media | Bajo | ~3-5s vs ~2-3s hoy, aceptable |
| jsonMode no soportado | Baja | Medio | Fallback a texto plano + fuzzyParse |
| Buffer corrupto | Muy baja | Alto | Validación con schemas estrictos |
