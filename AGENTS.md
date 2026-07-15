## graphify — Knowledge Graph (Code-Only)

Este proyecto tiene un knowledge graph activo en `graphify-out/` con **1207 nodos, 1872 aristas, 101 comunidades** que reflejan la arquitectura real del código **sin dependencias de IA externas**. El grafo se construye exclusivamente por **AST (tree-sitter)**, sin ningún LLM externo — **0 costo, 0 API keys, 100% reproducible**.

**El chatbot es 100% código puro.** No tiene capa de IA interna (sin narración, roleplay, ni clasificación por IA). DeepSeek v4 flash (gratuito e ilimitado) lo usa exclusivamente el agente programador para:

| Ámbito | Herramienta | Qué hace |
|--------|-------------|----------|
| **Análisis estructural** | graphify (AST) | Extrae funciones, clases, imports, llamadas - determinista |
| **Comprensión semántica** | DeepSeek (agente) | Interpreta el grafo, responde preguntas, explica relaciones |
| **Búsqueda en código** | graphify query + DeepSeek | Navega el grafo (NetworkX), DeepSeek sintetiza la respuesta |

### Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):

- **Consulta pre-acción**: Para preguntas sobre el código, primero ejecutar `graphify query "<pregunta>"`. Usar `graphify path "<A>" "<B>"` para relaciones y `graphify explain "<concepto>"` para explicaciones.
- **Actualización post-modificación**: Después de modificar código, ejecutar `graphify --update .` (incremental, AST). Para cambios mayores: `graphify extract . --code-only --out .`.
- **Archivos sucios**: Dirty files en `graphify-out/` son esperados tras updates incrementales. No omitir graphify por eso.
- **Wiki**: Si `graphify-out/wiki/index.md` existe, usarla para navegación amplia.
- **GRAGH_REPORT.md**: Leer `graphify-out/GRAPH_REPORT.md` para revisión macro de arquitectura.
- **Exclusiones** (`.graphifyignore`): `node_modules/`, `.git/`, `.agents/`, `.vscode/`, `.opencode/`, `.roo/`, `logs/`, `bugs/`, `*.zip`, `*.log`, `graphify-out/`.

### Uso para auditoría e investigación

```bash
# Auditoría: encontrar puntos de alto acoplamiento
graphify explain "logError"           # God node #1 - 36 edges
graphify explain "supabase"           # God node #9 - 11 edges

# Investigación: trazar flujo completo
graphify path "startBot" "supabase"   # Cadena de inicio hasta DB
graphify query "cómo se procesa un comando" --dfs

# Búsqueda: encontrar dónde se usa algo
graphify query "dónde se llama addMoney"
graphify query "qué comandos usan el servicio de economía"

# Comprensión: explicar un módulo completo
graphify explain "AiOrchestrator"     # Nodo orquestador central
graphify path "DeepSeekProvider" "AiDispatcher"  # Flujo de IA
```

### Hook post-commit:

El repositorio tiene instalado un hook post-commit que auto-actualiza el grafo tras cada `git commit`:
- Detecta archivos de código cambiados via `git diff HEAD~1`
- Re-ejecuta extracción AST solo en los modificados
- Reconstruye `graph.json` y `GRAPH_REPORT.md`
- Es código-only, no procesa docs/images (no necesita LLM)
