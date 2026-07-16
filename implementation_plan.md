# Plan de Implementación: Onboarding Automático de Agentes

## Objetivo
Que **cualquier agente sin contexto previo** pueda descubrir y utilizar todas las herramientas del proyecto automáticamente, arrancando desde la configuración de OpenCode y usando el comando `/revisar` como puerta de entrada.

---

## Cambios Propuestos

### 1. [MODIFY] `.opencode/opencode.json`
Añadir `agentCommands` con el comando `/revisar` y `permissionRules` para que el agente tenga acceso a scripts.

### 2. [MODIFY] `AGENTS.md`
Reescribir como **documento de onboarding completo**:
- Project overview (RolBotV1: WhatsApp bot con Baileys + Supabase)
- **Toolchain completo** (npm scripts, graphify, skills, nekomemori)
- **Bot architecture** (startup flow, core modules, servicios)
- **Reglas de descubrimiento**: `npm run tools:list`, leer AGENTS.md, skills
- **Instrucciones obligatorias** para el agente ante cualquier tarea

### 3. [NEW] `.opencode/skills/onboarding/SKILL.md`
Skill de "onboarding automático" que se carga con `/revisar`, contiene:
- Contexto completo del proyecto
- Catálogo de herramientas con propósito y ubicación
- Mapa de skills y cuándo usarlas
- Referencia de comandos npm
- Protocolo de inicio de sesión

### 4. [NEW] `scripts/context.js`
Script Node.js ejecutable con `npm run context` que imprime:
- package.json scripts
- Config files detectados (eslint, typescript, prettier...)
- Skills disponibles
- MCP servers activos
- Estructura `src/` resumida
- Estado de graphify

### 5. [MODIFY] `package.json`
Añadir scripts:
```json
"context": "node scripts/context.js"
"tools:list": "node scripts/tools-list.js"
```

### 6. [MODIFY] `.clinerules`
Añadir regla: "Ante cualquier tarea, ejecuta `/revisar` primero"

---

## Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| R1: `/revisar` satura de tokens en sesiones largas | El comando imprime un resumen estructurado, no volcados crudos. El agente decide cuánto leer. |
| R2: Cambiar AGENTS.md rompe sesiones existentes | AGENTS.md se lee al inicio de cada sesión; los cambios aplican solo a sesiones nuevas. |
| R3: Script `context.js` necesita mantenerse actualizado | Se añade a la checklist de post-cambio en el skill de auditoría. |
| R4: El agente ignora `/revisar` si no se le ordena explícitamente | La regla en `.clinerules` lo hace obligatorio, pero depende de que el agente respete `.clinerules`. |
| R5: Duplicación de información entre AGENTS.md, onboarding skill y context.js | Riesgo de que diverjan con el tiempo. |

---

## Verificación

1. `node scripts/context.js` → imprime herramientas, skills, estructura
2. `npm run context` → mismo resultado via npm
3. Tests existentes siguen pasando (`npm run test:vite`)
4. Lint 0 errores (`npm run lint`)
5. Typecheck sin nuevos errores (`npm run typecheck`)
6. JSON válido en `.opencode/opencode.json`
