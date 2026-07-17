## graphify — Knowledge Graph (Code-Only)

Este proyecto tiene un knowledge graph activo en `graphify-out/` con **851 nodos, 1709 aristas, 70 comunidades** que reflejan la arquitectura real del código **sin dependencias de IA externas**. El grafo se construye exclusivamente por **AST (tree-sitter)**, sin ningún LLM externo — **0 costo, 0 API keys, 100% reproducible**.

**El chatbot es 100% código puro.** No tiene capa de IA interna (sin narración, roleplay, ni clasificación por IA). DeepSeek v4 flash (gratuito e ilimitado) lo usa exclusivamente el agente programador para:

| Ámbito | Herramienta | Qué hace |
|--------|-------------|----------|
| **Análisis estructural** | graphify (AST) | Extrae funciones, clases, imports, llamadas - determinista |
| **Comprensión semántica** | DeepSeek (agente) | Interpreta el grafo, responde preguntas, explica relaciones |
| **Búsqueda en código** | graphify query + DeepSeek | Navega el grafo (NetworkX), DeepSeek sintetiza la respuesta |

### Instalación y dependencias

Graphify es el paquete PyPI `graphifyy` (v0.9.12). Ya instalado globalmente en este entorno.

```bash
# Verificar instalación
python -m graphify info .

# Reconstruir grafo completo (después de cambios mayores)
npm run graphify:rebuild

# Actualización incremental (después de commits pequeños)
npm run graphify:update

# Re-clusterizar (si solo cambió el análisis, no los archivos)
npm run graphify:cluster
```

### Reglas operativas (complementan `c:\IA_rolbot\.agents\AGENTS.md`):

- **Consulta pre-acción**: Para preguntas sobre el código, primero ejecutar `graphify query "<pregunta>"`. Usar `graphify path "<A>" "<B>"` para relaciones y `graphify explain "<concepto>"` para explicaciones.
- **Actualización post-modificación**: Después de modificar código, ejecutar `npm run graphify:update` (incremental, AST). Para cambios mayores: `npm run graphify:rebuild`.
- **Archivos sucios**: Dirty files en `graphify-out/` son esperados tras updates incrementales. No omitir graphify por eso.
- **Wiki**: Si `graphify-out/wiki/index.md` existe, usarla para navegación amplia.
- **GRAPH_REPORT.md**: Leer `graphify-out/GRAPH_REPORT.md` para revisión macro de arquitectura.
- **Exclusiones** (`.graphifyignore`): `node_modules/`, `.git/`, `.agents/`, `.vscode/`, `.opencode/`, `.roo/`, `logs/`, `bugs/`, `*.zip`, `*.log`, `graphify-out/`.

### Uso para auditoría e investigación

```bash
# NPM scripts disponibles
npm run graphify:status       # Info del grafo actual
npm run graphify:query        # Consulta por BFS/DFS
npm run graphify:path         # Camino más corto entre 2 nodos

# Auditoría: encontrar puntos de alto acoplamiento
graphify explain "logError"           # God node — edges
graphify explain "supabase"           # God node — edges

# Investigación: trazar flujo completo
graphify path "startBot" "supabase"
graphify query "cómo se procesa un comando" --dfs

# Búsqueda: encontrar dónde se usa algo
graphify query "dónde se llama addMoney"
graphify query "qué comandos usan el servicio de economía"
```

### Hook post-commit:

El hook post-commit de husky intenta auto-actualizar el grafo. Si graphify no está disponible en ese momento, ejecutar manualmente:

```bash
npm run graphify:update
```
